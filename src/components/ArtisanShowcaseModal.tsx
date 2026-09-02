import React from 'react';
import { 
  X, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Phone, 
  Clock, 
  ArrowRight,
  Gem,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface ArtisanShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
  onSelectArtisan?: (artisanBusinessName: string, category?: string) => void;
}

export const ArtisanShowcaseModal: React.FC<ArtisanShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectArtisan,
}) => {
  if (!isOpen) return null;

  const artisans = [
    {
      name: 'Sri Lakshmi Rold Gold Jewellers (Srinivas Rao)',
      businessName: 'Sri Lakshmi Rold Gold Jewellers',
      city: 'Eluru & Machilipatnam',
      state: 'Andhra Pradesh',
      pincode: '534001',
      specialty: 'Authentic 1-Gram Pure Micro-Gold Plating & Temple Kemp Ornaments',
      experience: '38 Years Master Craftsmanship',
      badge: 'Heritage Master Guild',
      phone: '+91 94401 82930',
      purityGuarantee: '22K Micron Gold Dip with 2-Year Anti-Tarnish Guarantee',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=85',
      category: 'Bridal',
      hub: 'Machilipatnam Guild Cluster #4',
    },
    {
      name: 'Jaipur Johari Kundan Guild (Kishanlal Soni)',
      businessName: 'Jaipur Johari Kundan Guild',
      city: 'Jaipur (Johari Bazaar)',
      state: 'Rajasthan',
      pincode: '302003',
      specialty: 'Jadau Polki, Uncut Diamonds & Royal Meenakari Enamel Artwork',
      experience: '34 Years Royal Heirlooms',
      badge: 'Jaipur Royal Guild',
      phone: '+91 98290 14829',
      purityGuarantee: 'Dual Silver-Gold Foil Hand Setting & Hydro Stones',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85',
      category: 'Polki',
      hub: 'Johari Bazaar Atelier Hub',
    },
    {
      name: 'Rajkot Filigree & Polki House (Hasmukhbhai Zaveri)',
      businessName: 'Rajkot Filigree & Polki House',
      city: 'Rajkot (Soni Bazaar)',
      state: 'Gujarat',
      pincode: '360001',
      specialty: 'Precision Laser-Cut Filigree Bangles, Chokers & Lightweight Daily Pieces',
      experience: '29 Years Filigree Heritage',
      badge: 'Certified Filigree Master',
      phone: '+91 98240 77192',
      purityGuarantee: 'Hypoallergenic Brass Core & Micro-Pave Swiss Zircons',
      image: 'https://images.unsplash.com/photo-1611591475152-478311d9e76b?auto=format&fit=crop&w=800&q=85',
      category: 'Daily Wear',
      hub: 'Soni Bazaar Workshop #12',
    }
  ];

  return (
    <div className="fixed inset-0 z-75 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-stone-900 border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-1.5">
                <span>Certified Artisan Guilds &amp; Heritage Boutiques</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-xs border border-amber-500/30">
                  Direct from Goldsmiths
                </span>
              </h3>
              <p className="text-xs text-stone-400">Pure 1-gram polish &amp; temple jewellery from certified South Indian artisans</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-stone-200">
          
          {/* Trust Guarantee Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-stone-900 to-yellow-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Authentic Artisan Direct Model</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Every jewellery piece on RoldyGoldy is sourced directly from renowned goldsmith clusters in Machilipatnam, Eluru, and Hyderabad. Bypassing traditional showroom markups ensures 100% genuine 22K micro-gold polish at transparent maker prices.
            </p>
          </div>

          {/* Artisans List */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Featured Master Artisan Workshops:</h4>
            
            {artisans.map((artisan, idx) => (
              <div 
                key={idx}
                className="bg-stone-950/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                        {artisan.badge}
                      </span>
                      <span className="text-[11px] text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{artisan.city}</span>
                      </span>
                    </div>
                    <h5 className="font-serif font-bold text-stone-100 text-sm">{artisan.name}</h5>
                    <p className="text-xs text-stone-300">{artisan.specialty}</p>
                    <p className="text-[11px] text-amber-400/90 font-medium">✨ {artisan.purityGuarantee}</p>
                  </div>
                  <img 
                    src={artisan.image} 
                    alt={artisan.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-800 shrink-0" 
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-xs gap-2">
                  <span className="text-stone-400 text-[11px] flex items-center gap-1 truncate">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{artisan.experience}</span>
                  </span>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        triggerHaptic('light');
                        if (onSelectArtisan) {
                          onSelectArtisan(artisan.businessName, artisan.category);
                        } else if (onSelectCategory) {
                          onSelectCategory(artisan.category);
                        }
                        onClose();
                      }}
                      className="bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl transition-colors shadow-xs"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
