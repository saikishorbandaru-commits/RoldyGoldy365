import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  RotateCw, 
  Eye, 
  Sparkles, 
  ShoppingBag, 
  Crown, 
  CheckCircle2, 
  ArrowRight, 
  Layers,
  Camera,
  MapPin
} from 'lucide-react';
import { Product } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface JewelleryMartTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onOpenTryOn: (product: Product) => void;
  onOpenTrial: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

interface MartZone {
  id: string;
  name: string;
  panoramicImage: string;
  description: string;
  accent: string;
  hotspots: {
    x: number; // percentage
    y: number; // percentage
    title: string;
    description: string;
    itemType: string;
    isCurrentProduct?: boolean;
  }[];
}

const MART_ZONES: MartZone[] = [
  {
    id: 'bridal-sanctum',
    name: 'Grand Bridal Vault & Kundan Sanctum',
    panoramicImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90',
    description: 'Walk through illuminated velvet glass pedestals featuring 22K micro-plated bridal chokers, uncut polki sets, and Jaipur meenakari heirlooms.',
    accent: 'from-amber-500/30 to-yellow-600/20',
    hotspots: [
      { x: 32, y: 45, title: '22K Kundan Choker Pedestal', description: 'Handcrafted in Jaipur with uncut polki and Zambian emerald fringes.', itemType: 'choker', isCurrentProduct: true },
      { x: 68, y: 55, title: 'Royal Mathapatti & Jhumka Station', description: 'Matching bridal maang tikka and chandelier earrings on velvet display.', itemType: 'earrings' },
      { x: 50, y: 30, title: 'Artisan Workshop Live Feed', description: 'Master craftsman applying micro-gold plating and stone setting in real-time.', itemType: 'craft' },
    ]
  },
  {
    id: 'temple-pavilion',
    name: 'Machilipatnam Temple & Matte Gold Pavilion',
    panoramicImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=90',
    description: 'Heritage gallery showcasing traditional South Indian Lakshmi harams, antique matte finish kasu malas, and nakshi temple work.',
    accent: 'from-red-500/20 to-amber-600/20',
    hotspots: [
      { x: 28, y: 50, title: 'Lakshmi Kasu Haram Velvet Case', description: 'Intricate nakshi embossing with antique red kemp stone setting.', itemType: 'necklace' },
      { x: 72, y: 42, title: 'Peacock Jhumka & Vanki Showcase', description: 'Traditional armlets and South Indian temple earrings.', itemType: 'earrings' },
    ]
  },
  {
    id: 'artisan-atelier',
    name: 'Polki & Diamond Modern Atelier',
    panoramicImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=90',
    description: 'Contemporary lounge with interactive styling mirrors, luxury lighting, and bespoke cocktail rings and lightweight daily jewellery.',
    accent: 'from-emerald-500/20 to-teal-600/20',
    hotspots: [
      { x: 40, y: 48, title: 'Bespoke Cocktail Ring Display', description: 'Precision-cut cubic zirconia and simulated solitaires.', itemType: 'ring' },
      { x: 60, y: 52, title: 'Korean Minimalist Pendant Trays', description: 'Anti-tarnish 18K rose gold plated delicate chokers.', itemType: 'pendant' },
    ]
  }
];

export const JewelleryMartTourModal: React.FC<JewelleryMartTourModalProps> = ({
  isOpen,
  onClose,
  product,
  onOpenTryOn,
  onOpenTrial,
  onAddToCart,
}) => {
  const [selectedZoneIndex, setSelectedZoneIndex] = useState<number>(0);
  const [panOffset, setPanOffset] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);
  const [isAutoPanning, setIsAutoPanning] = useState<boolean>(true);

  if (!isOpen) return null;

  const currentZone = MART_ZONES[selectedZoneIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-stone-900 border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[94vh] sm:h-[88vh] overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-stone-950 px-5 py-3.5 border-b border-stone-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-2">
                <span>360° Real-time Jewellery Mart Visit</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-500/30">
                  Virtual Flagship
                </span>
              </h3>
              <p className="text-xs text-stone-400">Explore interactive showroom pedestals, artisan workshops &amp; try on live</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Zone Navigation Pills */}
        <div className="bg-stone-950/90 border-b border-stone-800/80 px-4 py-2 flex items-center gap-2 overflow-x-auto z-20">
          <span className="text-[11px] text-stone-400 font-medium shrink-0">Mart Zones:</span>
          {MART_ZONES.map((zone, idx) => (
            <button
              key={zone.id}
              onClick={() => {
                triggerHaptic('light');
                setSelectedZoneIndex(idx);
                setSelectedHotspot(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                selectedZoneIndex === idx
                  ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* 360 Panoramic Virtual Viewport */}
        <div className="relative flex-1 bg-black overflow-hidden select-none group">
          
          {/* Panoramic Image with Simulated Pan */}
          <div 
            className="absolute inset-0 transition-transform duration-500 ease-out"
            style={{
              transform: `scale(1.15) translateX(${panOffset}px)`,
            }}
          >
            <img 
              src={currentZone.panoramicImage} 
              alt={currentZone.name}
              className="w-full h-full object-cover brightness-75 contrast-110 filter"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${currentZone.accent} mix-blend-overlay`} />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/70" />
          </div>

          {/* Interactive Mart Hotspots */}
          {currentZone.hotspots.map((spot, idx) => (
            <div
              key={idx}
              style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() => {
                  triggerHaptic('medium');
                  setSelectedHotspot(spot);
                }}
                className="relative group/btn flex items-center justify-center"
              >
                <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-stone-950 font-extrabold text-[11px] flex items-center justify-center shadow-lg border-2 border-stone-950 hover:scale-125 transition-transform">
                  💎
                </span>
                <span className="absolute top-7 bg-stone-950/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/40 whitespace-nowrap shadow-md opacity-90 group-hover/btn:opacity-100">
                  {spot.title}
                </span>
              </button>
            </div>
          ))}

          {/* Pan Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-stone-950/80 backdrop-blur-md border border-stone-800 rounded-xl px-3 py-1.5 text-stone-300 text-xs flex items-center gap-2 pointer-events-auto">
              <RotateCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>360° Real-time Mart View</span>
            </div>

            <div className="flex gap-2 pointer-events-auto">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setPanOffset((prev) => Math.min(prev + 80, 150));
                }}
                className="bg-stone-950/80 hover:bg-stone-850 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md"
              >
                ◀ Pan Left
              </button>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setPanOffset((prev) => Math.max(prev - 80, -150));
                }}
                className="bg-stone-950/80 hover:bg-stone-850 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md"
              >
                Pan Right ▶
              </button>
            </div>
          </div>

          {/* Selected Hotspot Drawer / Card */}
          {selectedHotspot && (
            <div className="absolute top-4 right-4 max-w-xs bg-stone-950/95 border border-amber-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-lg z-30 animate-in slide-in-from-right duration-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Showroom Highlight
                </span>
                <button 
                  onClick={() => setSelectedHotspot(null)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-stone-100 text-sm">{selectedHotspot.title}</h4>
                <p className="text-stone-300 text-xs mt-1 leading-relaxed">{selectedHotspot.description}</p>
              </div>

              {product && (
                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-stone-200 font-semibold line-clamp-1">{product.name}</span>
                      <span className="text-xs font-extrabold text-amber-400">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTryOn(product);
                      }}
                      className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/40 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                    >
                      <span>🪞 3D Try-On</span>
                    </button>
                    {product.trialEligible && (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTrial(product);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Crown className="w-3 h-3" />
                        <span>Trial @Home</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-5 py-3 border-t border-stone-800 flex items-center justify-between z-20 text-xs">
          <p className="text-stone-400 text-[11px]">
            {currentZone.description}
          </p>
          <button
            onClick={onClose}
            className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-4 py-2 rounded-xl text-xs shrink-0"
          >
            Exit Mart Tour
          </button>
        </div>

      </div>
    </div>
  );
};
