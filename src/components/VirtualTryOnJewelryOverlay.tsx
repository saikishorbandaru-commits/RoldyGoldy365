import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Sparkles, Gem, ShieldCheck } from 'lucide-react';

interface VirtualTryOnJewelryOverlayProps {
  product: Product;
  activeImage?: string;
  itemType: 'choker' | 'earrings' | 'tikka' | 'necklace' | 'bangles';
  scale: number;
  rotation: number;
  opacity: number;
  skinWarmth?: { r: number; g: number; b: number; warmthFactor: number };
  goldFinish?: '22k_yellow' | 'antique_matte' | 'rose_gold';
  sparkleActive?: boolean;
  tryOnMode?: 'wearable_ar' | 'transparent_cutout';
}

export const VirtualTryOnJewelryOverlay: React.FC<VirtualTryOnJewelryOverlayProps> = ({
  product,
  activeImage,
  itemType,
  opacity,
  goldFinish = '22k_yellow',
  sparkleActive = true,
  tryOnMode = 'wearable_ar',
}) => {
  const imageUrl = activeImage || product.image;
  const [processedImageUrl, setProcessedImageUrl] = useState<string>(imageUrl);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // Dynamic finish colors and visual photometric filters applied to the real product photo
  const getFinishFilters = () => {
    switch (goldFinish) {
      case 'antique_matte':
        return {
          filter: 'sepia(0.3) contrast(1.18) brightness(0.96) saturate(1.1)',
          glowColor: 'rgba(197, 154, 63, 0.45)',
          badgeLabel: 'Antique 22K Matte Finish',
        };
      case 'rose_gold':
        return {
          filter: 'hue-rotate(-18deg) saturate(1.25) contrast(1.12) brightness(1.02)',
          glowColor: 'rgba(224, 160, 128, 0.45)',
          badgeLabel: 'Rose Gold Polish',
        };
      case '22k_yellow':
      default:
        return {
          filter: 'saturate(1.25) contrast(1.15) brightness(1.04)',
          glowColor: 'rgba(255, 215, 0, 0.5)',
          badgeLabel: '22K Micro-Plated Gold',
        };
    }
  };

  const finishConfig = getFinishFilters();

  // Intelligent client-side background removal to make product transparent over live camera
  useEffect(() => {
    if (!imageUrl) return;

    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = img.naturalWidth || 500;
        const height = img.naturalHeight || 500;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const imgData = ctx.getImageData(0, 0, width, height);
          const d = imgData.data;

          // Corner sample background check
          const sampleCornerBrightness = (
            (d[0] + d[1] + d[2]) / 3 +
            (d[(width - 1) * 4] + d[(width - 1) * 4 + 1] + d[(width - 1) * 4 + 2]) / 3
          ) / 2;

          const isLightBg = sampleCornerBrightness > 160;

          // Background transparentization algorithm
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i];
            const g = d[i + 1];
            const b = d[i + 2];
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const diff = max - min;
            const avg = (r + g + b) / 3;

            if (isLightBg) {
              // Light/white studio backgrounds
              if (r > 225 && g > 225 && b > 225 && diff < 20) {
                d[i + 3] = 0;
              } else if (r > 200 && g > 200 && b > 200 && diff < 25) {
                const alpha = Math.max(0, 255 - (avg - 200) * 4.5);
                d[i + 3] = Math.min(d[i + 3], alpha);
              }
            } else {
              // Dark studio backgrounds
              if (r < 25 && g < 25 && b < 25) {
                d[i + 3] = 0;
              } else if (r < 40 && g < 40 && b < 40 && diff < 15) {
                const alpha = Math.max(0, (avg - 15) * 6);
                d[i + 3] = Math.min(d[i + 3], alpha);
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          setProcessedImageUrl(canvas.toDataURL('image/png'));
          setImageLoaded(true);
        } else {
          setProcessedImageUrl(imageUrl);
          setImageLoaded(true);
        }
      } catch (err) {
        console.warn('Transparent cutout fallback:', err);
        setProcessedImageUrl(imageUrl);
        setImageLoaded(true);
      }
    };

    img.onerror = () => {
      setProcessedImageUrl(imageUrl);
      setImageLoaded(true);
    };
  }, [imageUrl]);

  // =========================================================================
  // 1. EARRINGS CATEGORY: Dual Symmetrical Live Earring Pair using Real Product Photo
  // =========================================================================
  if (itemType === 'earrings') {
    return (
      <div 
        style={{ 
          opacity,
          filter: `${finishConfig.filter} drop-shadow(0 16px 28px rgba(0,0,0,0.85))` 
        }}
        className="relative w-80 sm:w-96 flex items-start justify-between px-3 sm:px-6 pointer-events-none select-none"
      >
        {/* Left Earring */}
        <div className="relative flex flex-col items-center group">
          <img
            src={processedImageUrl}
            alt={`${product.name} Left Earring`}
            className="w-24 sm:w-28 h-36 sm:h-44 object-contain transition-transform"
            style={{
              filter: `drop-shadow(0 8px 16px ${finishConfig.glowColor})`,
            }}
          />
          {sparkleActive && (
            <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
          )}
        </div>

        {/* Center Indicator Badge */}
        <div className="flex-1 text-center pt-2">
          <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/50 text-[10.5px] text-amber-300 font-bold shadow-2xl">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{product.name} (Earring Duo)</span>
          </span>
        </div>

        {/* Right Earring (Symmetrically Mirrored for natural ear fit) */}
        <div className="relative flex flex-col items-center group -scale-x-100">
          <img
            src={processedImageUrl}
            alt={`${product.name} Right Earring`}
            className="w-24 sm:w-28 h-36 sm:h-44 object-contain transition-transform"
            style={{
              filter: `drop-shadow(0 8px 16px ${finishConfig.glowColor})`,
            }}
          />
          {sparkleActive && (
            <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MAANG TIKKA CATEGORY: Centered Forehead Placement of Real Product Photo
  // =========================================================================
  if (itemType === 'tikka') {
    return (
      <div 
        style={{ 
          opacity,
          filter: `${finishConfig.filter} drop-shadow(0 18px 32px rgba(0,0,0,0.85))` 
        }}
        className="relative flex flex-col items-center pointer-events-none select-none"
      >
        <img
          src={processedImageUrl}
          alt={product.name}
          className="w-32 sm:w-40 h-44 sm:h-52 object-contain"
          style={{
            filter: `drop-shadow(0 10px 20px ${finishConfig.glowColor})`,
          }}
        />
        {sparkleActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
        )}
      </div>
    );
  }

  // =========================================================================
  // 3. BANGLES & KADAS CATEGORY: Real Product Photo Sized for Wrist/Hand
  // =========================================================================
  if (itemType === 'bangles') {
    return (
      <div 
        style={{ 
          opacity,
          filter: `${finishConfig.filter} drop-shadow(0 18px 30px rgba(0,0,0,0.85))` 
        }}
        className="relative flex flex-col items-center pointer-events-none select-none"
      >
        <img
          src={processedImageUrl}
          alt={product.name}
          className="w-48 sm:w-60 h-44 sm:h-52 object-contain"
          style={{
            filter: `drop-shadow(0 10px 22px ${finishConfig.glowColor})`,
          }}
        />
        {sparkleActive && (
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-200 rounded-full blur-[0.5px] animate-ping" />
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. NECKLACES & CHOKERS (Default): High-Fidelity Draped Real Product Photo
  // =========================================================================
  return (
    <div 
      style={{ 
        opacity,
        filter: `${finishConfig.filter} drop-shadow(0 20px 36px rgba(0,0,0,0.9))` 
      }}
      className="relative flex flex-col items-center pointer-events-none select-none"
    >
      <img
        src={processedImageUrl}
        alt={product.name}
        className="max-w-[300px] max-h-[300px] sm:max-w-[380px] sm:max-h-[360px] object-contain transition-all"
        style={{
          filter: `drop-shadow(0 12px 24px ${finishConfig.glowColor})`,
        }}
      />
      {sparkleActive && (
        <>
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-yellow-100 rounded-full blur-[0.5px] animate-ping" />
          <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-emerald-200 rounded-full blur-[0.5px] animate-ping" />
        </>
      )}
    </div>
  );
};
