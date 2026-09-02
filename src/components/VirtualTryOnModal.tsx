import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Sparkles, 
  RotateCw, 
  Maximize2, 
  SwitchCamera, 
  ShoppingBag, 
  MessageSquare,
  Crown,
  Crosshair,
  CheckCircle2,
  RefreshCw,
  Move,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Product } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { VirtualTryOnJewelryOverlay } from './VirtualTryOnJewelryOverlay';

interface VirtualTryOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onOpenBargain: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenTrial: (product: Product) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  product,
  isOpen,
  onClose,
  onOpenBargain,
  onAddToCart,
  onOpenTrial,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Determine item type for smart anatomical auto-placement
  const prodName = (product?.name || '').toLowerCase();
  const itemType = product?.itemType || (
    prodName.includes('choker') || prodName.includes('necklace') || prodName.includes('haram')
      ? (prodName.includes('choker') ? 'choker' : 'necklace')
      : prodName.includes('jhumka') || prodName.includes('earring') || prodName.includes('chandbali') || prodName.includes('hoop')
      ? 'earrings'
      : prodName.includes('tikka') || prodName.includes('passa')
      ? 'tikka'
      : prodName.includes('bangle') || prodName.includes('bracelet') || prodName.includes('kada')
      ? 'bangles'
      : 'choker'
  );

  // Default initial Y offset based on human anatomy
  const getDefaultY = (type: string) => {
    switch (type) {
      case 'tikka': return -90;
      case 'earrings': return -10;
      case 'bangles': return 140;
      case 'necklace': return 100;
      case 'choker': default: return 70;
    }
  };

  // Position, Scale & Upright Orientation State (Rotation strictly 0 for perfect upright balance)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: getDefaultY(itemType) });
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1.0);
  
  // Intelligent Face Tracking & Skin Alignment
  const [isAutoArranged, setIsAutoArranged] = useState<boolean>(true);
  const [autoTrackingStatus, setAutoTrackingStatus] = useState<string>('Calibrating to Face & Neckline...');
  const [detectedSkinWarmth, setDetectedSkinWarmth] = useState<{ r: number; g: number; b: number; warmthFactor: number }>({
    r: 225,
    g: 175,
    b: 135,
    warmthFactor: 1.15,
  });

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenScanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingCameraRef = useRef<boolean>(false);

  const stopCamera = () => {
    isStartingCameraRef.current = false;
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {
          console.warn('Error stopping try-on track:', e);
        }
      });
      streamRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
          track.enabled = false;
        } catch (e) {
          console.warn('Error stopping try-on state track:', e);
        }
      });
    }
    if (videoRef.current && videoRef.current.srcObject) {
      try {
        const currentSrc = videoRef.current.srcObject as MediaStream;
        if (currentSrc && currentSrc.getTracks) {
          currentSrc.getTracks().forEach((track) => {
            track.stop();
            track.enabled = false;
          });
        }
      } catch (e) {
        console.warn('Error releasing try-on video srcObject:', e);
      }
      videoRef.current.srcObject = null;
    }
    setStream(null);
  };

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();
    isStartingCameraRef.current = true;
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      if (!isStartingCameraRef.current || !isOpen) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      isStartingCameraRef.current = false;
      console.warn('Try-on camera error:', err);
      setCameraError('Camera preview could not be loaded. Please grant camera access to try on jewellery.');
    }
  };

  // Robust face & skin landmark detection
  const runAutoSkinAlignment = useCallback(() => {
    if (!videoRef.current || !containerRef.current || !isAutoArranged) return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    if (!hiddenScanCanvasRef.current) {
      hiddenScanCanvasRef.current = document.createElement('canvas');
    }
    const canvas = hiddenScanCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 120;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      let totalSkinX = 0;
      let totalSkinY = 0;
      let skinPixelCount = 0;
      let totalR = 0, totalG = 0, totalB = 0;

      let minY = canvas.height;
      let maxY = 0;
      let minX = canvas.width;
      let maxX = 0;

      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 2) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Reliable human skin detection heuristic
          const isSkin = r > 80 && g > 35 && b > 15 && r > g && r > b && (r - g > 10) && (r - b > 12);

          if (isSkin) {
            totalSkinX += x;
            totalSkinY += y;
            totalR += r;
            totalG += g;
            totalB += b;
            skinPixelCount++;

            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
      }

      if (skinPixelCount > 40) {
        const avgX = totalSkinX / skinPixelCount;
        const avgY = totalSkinY / skinPixelCount;
        const faceWidth = maxX - minX;
        const faceHeight = maxY - minY;

        const containerRect = containerRef.current.getBoundingClientRect();
        // Since video is mirrored with -scale-x-100 on user facing mode:
        const xOffset = ((avgX - canvas.width / 2) / canvas.width) * containerRect.width * (facingMode === 'user' ? -0.5 : 0.5);
        const yOffset = ((avgY - canvas.height / 2) / canvas.height) * containerRect.height;

        // Auto-scale relative to user's distance
        const relativeScale = Math.min(1.25, Math.max(0.85, (faceWidth / 60)));

        // Determine anatomical landing point based on category
        let targetY = yOffset;
        if (itemType === 'choker') {
          // Collarbone / lower neck just beneath chin
          targetY = yOffset + (faceHeight * 0.45);
        } else if (itemType === 'necklace') {
          // Mid chest / neckline
          targetY = yOffset + (faceHeight * 0.72);
        } else if (itemType === 'earrings') {
          // Mid-ear lobe level
          targetY = yOffset + (faceHeight * 0.05);
        } else if (itemType === 'tikka') {
          // Upper forehead hairline
          targetY = yOffset - (faceHeight * 0.45);
        } else if (itemType === 'bangles') {
          targetY = yOffset + 130;
        }

        // Smoothly interpolate towards target with exponential smoothing to prevent jitter
        setPosition((prev) => ({
          x: Math.round(prev.x * 0.8 + xOffset * 0.2),
          y: Math.round(prev.y * 0.8 + targetY * 0.2),
        }));
        setScale((prev) => Number((prev * 0.85 + relativeScale * 0.15).toFixed(2)));
        setRotation(0); // STRICTLY 0° upright orientation

        const avgR = Math.round(totalR / skinPixelCount);
        const avgG = Math.round(totalG / skinPixelCount);
        const avgB = Math.round(totalB / skinPixelCount);
        setDetectedSkinWarmth({
          r: avgR,
          g: avgG,
          b: avgB,
          warmthFactor: avgR / (avgB || 1),
        });

        setAutoTrackingStatus(`✓ Auto-Arranged to ${itemType === 'tikka' ? 'Forehead Hairline' : itemType === 'earrings' ? 'Earlobes' : 'Collarbone Neckline'}`);
      } else {
        setAutoTrackingStatus('Align face in center oval');
      }
    } catch (err) {
      console.warn('Auto-tracking processing:', err);
    }
  }, [isAutoArranged, facingMode, itemType]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setPosition({ x: 0, y: getDefaultY(itemType) });
      setRotation(0);
      setScale(1.0);
      setIsAutoArranged(true);

      // Continuous face scanner
      scanIntervalRef.current = setInterval(runAutoSkinAlignment, 350);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, product.id, runAutoSkinAlignment]);

  // Turn off camera when tab loses visibility or window is minimized
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
      } else if (isOpen) {
        startCamera();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch / Mouse Drag handlers for manual positioning
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoArranged(false);
    setAutoTrackingStatus('Manual Positioning (Drag to Adjust)');
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const resetToAutoArrange = () => {
    triggerHaptic('light');
    setIsAutoArranged(true);
    setPosition({ x: 0, y: getDefaultY(itemType) });
    setScale(1.0);
    setRotation(0);
    setAutoTrackingStatus('✓ Locked Upright & Auto-Arranged');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md h-full sm:h-[94vh] bg-stone-950 border sm:border-amber-500/30 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Floating Header */}
        <div className="absolute top-0 inset-x-0 z-20 px-4 py-3 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Live AR Try-On
            </span>
            <span className="text-xs text-stone-200 font-medium truncate max-w-[140px]">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-300 px-2 py-1 rounded-full shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold">Zero-Storage Privacy (No Images Saved)</span>
            </div>
            <button
              onClick={() => {
                triggerHaptic('light');
                setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
              }}
              className="w-9 h-9 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md hover:bg-stone-800"
              title="Flip Camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md hover:bg-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewport */}
        <div 
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="relative flex-1 bg-black flex items-center justify-center overflow-hidden touch-none select-none"
        >
          {cameraError ? (
            <div className="text-center p-6 space-y-3">
              <p className="text-sm text-stone-300">{cameraError}</p>
              <button
                onClick={startCamera}
                className="bg-amber-500 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Retry Camera Access
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
            />
          )}

          {/* Subtle Anatomical Alignment Guide Reticle */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-25">
            <div className="w-56 h-72 border border-dashed border-amber-400/50 rounded-full" />
            <div className="w-44 border-t border-dashed border-amber-400/50 mt-4" />
          </div>

          {/* Auto-Arrangement Live Status Badge */}
          <div className="absolute top-14 left-4 z-20">
            <div className="flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-full text-[10.5px] text-amber-300 font-semibold shadow-lg">
              <span className={`w-2 h-2 rounded-full ${isAutoArranged ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{autoTrackingStatus}</span>
            </div>
          </div>

          {/* Symmetrical Upright Jewellery Layer (Auto-Arranged & Scaled onto Skin) */}
          <div
            onPointerDown={handlePointerDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="absolute z-10 select-none transition-transform duration-75 flex items-center justify-center group"
          >
            <VirtualTryOnJewelryOverlay
              product={product}
              activeImage={product.image}
              itemType={itemType}
              scale={scale}
              rotation={rotation}
              opacity={opacity}
              skinWarmth={detectedSkinWarmth}
            />

            {/* Subtle Interactive Drag Handle */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Floating Action: Quick Anatomical Re-Align Presets */}
          <div className="absolute top-14 right-3 z-20 flex flex-col gap-1.5">
            <button
              onClick={resetToAutoArrange}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10.5px] font-bold backdrop-blur-md border transition-all ${
                isAutoArranged
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg'
                  : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:bg-stone-900'
              }`}
              title="Auto Align to Skin"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Fit Face</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setRotation(0);
                setIsAutoArranged(false);
                setAutoTrackingStatus('0° Upright Level Locked');
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-stone-950/80 border border-stone-800 text-stone-300 hover:text-amber-300 backdrop-blur-md"
              title="Reset 0° Level"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>0° Level</span>
            </button>
          </div>
        </div>

        {/* Bottom Control & Trial@Home Booking Area */}
        <div className="bg-stone-950 p-4 border-t border-stone-800 space-y-3 z-10">
          
          {/* Trial @ Home Option for Dissatisfied Customers */}
          {product.trialEligible && (
            <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-stone-900 border border-amber-500/50 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-md">
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dissatisfied with Virtual Try-On?</span>
                </div>
                <p className="text-[10.5px] text-stone-400 leading-tight">
                  Try the actual physical piece at home! 20-min doorstep concierge.
                </p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('success');
                  stopCamera();
                  onClose();
                  onOpenTrial(product);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-[11px] px-3 py-2 rounded-xl shrink-0 shadow-lg active:scale-95 transition-all flex items-center gap-1"
              >
                <span>🏠 Arrange Trial</span>
              </button>
            </div>
          )}

          {/* Size & Fine Nudge Controls */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3 text-amber-400" /> Size Scale</span>
                <span className="font-mono text-stone-300">{Math.round(scale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.8"
                step="0.05"
                value={scale}
                onChange={(e) => {
                  setIsAutoArranged(false);
                  setScale(Number(e.target.value));
                }}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span className="flex items-center gap-1"><RotateCw className="w-3 h-3 text-amber-400" /> Upright Level</span>
                <span className="font-mono text-stone-300">{rotation}&deg;</span>
              </div>
              <input
                type="range"
                min="-30"
                max="30"
                step="1"
                value={rotation}
                onChange={(e) => {
                  setIsAutoArranged(false);
                  setRotation(Number(e.target.value));
                }}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Direct Buy & Bargain Action Buttons */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => {
                triggerHaptic('light');
                stopCamera();
                onClose();
                onOpenBargain(product);
              }}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs py-2.5 rounded-xl border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bargain with Jeweller</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('success');
                onAddToCart(product);
                stopCamera();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy ₹{product.bargainedPrice || product.price}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
