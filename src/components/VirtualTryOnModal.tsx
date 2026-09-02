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
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Sun,
  Layers
} from 'lucide-react';
import { Product } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { VirtualTryOnJewelryOverlay } from './VirtualTryOnJewelryOverlay';

interface VirtualTryOnModalProps {
  product: Product;
  catalogProducts?: Product[];
  isOpen: boolean;
  onClose: () => void;
  onOpenBargain: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenTrial: (product: Product) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  product: initialProduct,
  catalogProducts = [],
  isOpen,
  onClose,
  onOpenBargain,
  onAddToCart,
  onOpenTrial,
}) => {
  const [activeProduct, setActiveProduct] = useState<Product>(initialProduct);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [goldFinish, setGoldFinish] = useState<'22k_yellow' | 'antique_matte' | 'rose_gold'>('22k_yellow');
  const [sparkleActive, setSparkleActive] = useState<boolean>(true);
  const [showProductPicker, setShowProductPicker] = useState<boolean>(false);

  // Sync activeProduct when initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setActiveProduct(initialProduct);
    }
  }, [initialProduct]);

  // Determine item type for smart anatomical auto-placement
  const prodName = (activeProduct?.name || '').toLowerCase();
  const itemType = activeProduct?.itemType || (
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

  // Position, Scale & Orientation State
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: getDefaultY(itemType) });
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1.0);
  const [tryOnMode, setTryOnMode] = useState<'wearable_ar' | 'transparent_cutout'>('wearable_ar');
  
  // Tracking & Status
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
  const streamRef = useRef<MediaStream | null>(null);
  const isStartingCameraRef = useRef<boolean>(false);

  const stopCamera = () => {
    isStartingCameraRef.current = false;
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
    } catch (err: any) {
      isStartingCameraRef.current = false;
      console.warn('Camera try-on error:', err);
      setCameraError('Unable to open camera feed. Please check camera permissions or try in a well-lit area.');
    }
  };

  // Nudge Position Functions
  const nudge = (dx: number, dy: number) => {
    triggerHaptic('light');
    setIsAutoArranged(false);
    setAutoTrackingStatus('Manual Fine-Tuning');
    setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const adjustScale = (delta: number) => {
    triggerHaptic('light');
    setIsAutoArranged(false);
    setScale((prev) => Math.min(2.0, Math.max(0.5, Number((prev + delta).toFixed(2)))));
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setPosition({ x: 0, y: getDefaultY(itemType) });
      setRotation(0);
      setScale(1.0);
      setIsAutoArranged(true);
      setAutoTrackingStatus(`✓ Fitted for ${itemType === 'tikka' ? 'Forehead' : itemType === 'earrings' ? 'Earlobes' : itemType === 'bangles' ? 'Wrist' : 'Collarbone'}`);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, activeProduct.id]);

  if (!isOpen) return null;

  // Touch / Mouse Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsAutoArranged(false);
    setAutoTrackingStatus('Manual Repositioning');
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
    setAutoTrackingStatus('✓ Locked Upright & Centered');
  };

  const handleSelectDifferentProduct = (prod: Product) => {
    triggerHaptic('light');
    setActiveProduct(prod);
    setShowProductPicker(false);
    const newItemType = prod.itemType || (
      prod.name.toLowerCase().includes('choker') || prod.name.toLowerCase().includes('necklace')
        ? 'choker'
        : prod.name.toLowerCase().includes('jhumka') || prod.name.toLowerCase().includes('earring')
        ? 'earrings'
        : prod.name.toLowerCase().includes('tikka')
        ? 'tikka'
        : 'choker'
    );
    setPosition({ x: 0, y: getDefaultY(newItemType) });
    setScale(1.0);
    setIsAutoArranged(true);
    setAutoTrackingStatus(`✓ Switched to ${prod.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md h-full sm:h-[94vh] bg-stone-950 border sm:border-amber-500/30 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Floating Header */}
        <div className="absolute top-0 inset-x-0 z-20 px-4 py-2.5 bg-gradient-to-b from-black/95 via-black/85 to-transparent flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={activeProduct.image} 
              alt={activeProduct.name} 
              className="w-10 h-10 rounded-xl object-cover border border-amber-400/60 shadow-md shrink-0 bg-stone-900" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> 3D AR Mirror
                </span>
                <span className="text-[11px] text-amber-400 font-bold font-mono">₹{activeProduct.bargainedPrice || activeProduct.price}</span>
              </div>
              <p className="text-xs text-stone-200 font-medium truncate max-w-[160px] sm:max-w-[200px]">
                {activeProduct.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {catalogProducts.length > 1 && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setShowProductPicker(!showProductPicker);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 ${
                  showProductPicker
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-900/80 border-stone-700 text-amber-300 hover:bg-stone-800'
                }`}
                title="Switch Piece"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            )}

            <button
              onClick={() => {
                triggerHaptic('light');
                setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
              }}
              className="w-8 h-8 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md hover:bg-stone-800"
              title="Flip Camera"
            >
              <SwitchCamera className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md hover:bg-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* In-Mirror Product Switcher Drawer Overlay */}
        {showProductPicker && catalogProducts.length > 0 && (
          <div className="absolute top-16 inset-x-3 z-30 bg-stone-950/95 border border-amber-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Boutique Piece to Try On:</span>
              </span>
              <button
                onClick={() => setShowProductPicker(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {catalogProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectDifferentProduct(p)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl border text-left shrink-0 transition-all ${
                    activeProduct.id === p.id
                      ? 'bg-amber-500/20 border-amber-400 shadow-md'
                      : 'bg-stone-900 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-stone-950 shrink-0" />
                  <div className="w-24">
                    <p className="text-[11px] font-bold text-stone-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-amber-400 font-mono">₹{p.bargainedPrice || p.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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

          {/* Anatomical Reticle Guide */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-20">
            <div className="w-52 h-68 border border-dashed border-amber-400/60 rounded-full" />
            <div className="w-40 border-t border-dashed border-amber-400/60 mt-3" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-14 left-4 z-20">
            <div className="flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-full text-[10px] text-amber-300 font-semibold shadow-lg">
              <span className={`w-2 h-2 rounded-full ${isAutoArranged ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{autoTrackingStatus}</span>
            </div>
          </div>

          {/* On-Screen Nudge D-Pad Controls */}
          <div className="absolute top-14 right-3 z-20 flex flex-col items-end gap-1.5">
            <div className="bg-stone-950/80 backdrop-blur-md p-1.5 rounded-2xl border border-stone-800 flex flex-col items-center gap-1 shadow-lg">
              <button
                onClick={() => nudge(0, -15)}
                className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 flex items-center justify-center active:scale-90"
                title="Nudge Up"
              >
                <ChevronUp className="w-4 h-4 text-amber-400" />
              </button>
              <div className="flex gap-1">
                <button
                  onClick={() => nudge(-15, 0)}
                  className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 flex items-center justify-center active:scale-90"
                  title="Nudge Left"
                >
                  <ChevronLeft className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  onClick={resetToAutoArrange}
                  className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-[10px] active:scale-90"
                  title="Reset Center"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => nudge(15, 0)}
                  className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 flex items-center justify-center active:scale-90"
                  title="Nudge Right"
                >
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
              <button
                onClick={() => nudge(0, 15)}
                className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 flex items-center justify-center active:scale-90"
                title="Nudge Down"
              >
                <ChevronDown className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Quick Size Zoom Buttons */}
            <div className="flex gap-1 bg-stone-950/80 backdrop-blur-md p-1 rounded-xl border border-stone-800 shadow-md">
              <button
                onClick={() => adjustScale(-0.1)}
                className="w-7 h-7 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center active:scale-90"
                title="Decrease Size"
              >
                <Minus className="w-3.5 h-3.5 text-amber-400" />
              </button>
              <span className="text-[10px] text-stone-300 font-mono px-1 flex items-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => adjustScale(0.1)}
                className="w-7 h-7 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center active:scale-90"
                title="Increase Size"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Transparent Real Jewellery Layer */}
          <div
            onPointerDown={handlePointerDown}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="absolute z-10 select-none transition-transform duration-75 flex items-center justify-center group"
          >
            <VirtualTryOnJewelryOverlay
              product={activeProduct}
              activeImage={activeProduct.image}
              itemType={itemType}
              scale={scale}
              rotation={rotation}
              opacity={opacity}
              skinWarmth={detectedSkinWarmth}
              goldFinish={goldFinish}
              sparkleActive={sparkleActive}
              tryOnMode={tryOnMode}
            />

            {/* Interactive Drag Hint */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Move className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Bottom Control & Polish Area */}
        <div className="bg-stone-950 p-4 border-t border-stone-800 space-y-3 z-10">
          
          {/* Polish Finish Selector & Sparkle */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400 font-semibold uppercase mr-0.5">Finish:</span>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setGoldFinish('22k_yellow');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                  goldFinish === '22k_yellow'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                22K Gold
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setGoldFinish('antique_matte');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                  goldFinish === 'antique_matte'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                Antique Matte
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setGoldFinish('rose_gold');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                  goldFinish === 'rose_gold'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                Rose Gold
              </button>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                setSparkleActive(!sparkleActive);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold border transition-all flex items-center gap-1 ${
                sparkleActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-stone-900 border-stone-800 text-stone-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Glint</span>
            </button>
          </div>

          {/* Trial @ Home Option */}
          {activeProduct.trialEligible && (
            <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-stone-900 border border-amber-500/50 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-md">
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Want to try this in real life?</span>
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  Doorstep concierge brings this piece in 20 mins.
                </p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('success');
                  stopCamera();
                  onClose();
                  onOpenTrial(activeProduct);
                }}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl shrink-0 shadow-lg active:scale-95 transition-all flex items-center gap-1"
              >
                <span>Book 20m Trial</span>
              </button>
            </div>
          )}

          {/* Direct Buy & Bargain Action Buttons */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={() => {
                triggerHaptic('light');
                stopCamera();
                onClose();
                onOpenBargain(activeProduct);
              }}
              className="flex-1 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs py-2.5 rounded-xl border border-amber-500/40 flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bargain with Jeweller</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('success');
                onAddToCart(activeProduct);
                stopCamera();
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-extrabold text-xs py-2.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy ₹{activeProduct.bargainedPrice || activeProduct.price}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
