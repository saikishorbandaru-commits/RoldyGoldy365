import React, { useState } from 'react';
import { Product } from '../types';
import { 
  MessageSquare, 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Crown, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface BargainPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProductToBargain: (product: Product) => void;
  onBrowseAllCatalog: () => void;
}

export const BargainPickerModal: React.FC<BargainPickerModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProductToBargain,
  onBrowseAllCatalog,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const filtered = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.partnerSeller?.businessName && p.partnerSeller.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0 shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-stone-100 text-sm">Bargain with Master Jeweller</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-sm border border-amber-500/30">Live AI</span>
              </div>
              <p className="text-xs text-stone-400">Select which jewellery piece you wish to negotiate on</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Explainer Banner */}
        <div className="bg-gradient-to-r from-amber-950/50 via-stone-900 to-amber-950/30 px-4 py-2.5 border-b border-stone-800/80 flex items-center gap-2.5 text-xs text-stone-300">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Choose any design below to negotiate directly with <strong>Master Jeweller Ramesh</strong> within artisan floor price limits!
          </span>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 bg-stone-950/70 border-b border-stone-800 space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search necklace, jhumka, bangle to bargain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            {['All', 'Bridal', 'Temple', 'Korean', 'Daily Wear', 'Polki'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedCategory(cat);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Items List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-stone-950/40">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs space-y-2">
              <p>No jewellery pieces match your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-amber-400 underline font-semibold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const activePrice = item.bargainedPrice || item.price;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectProductToBargain(item);
                  }}
                  className="bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-stone-700 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate space-y-0.5">
                      <div className="font-semibold text-stone-200 text-xs truncate group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-amber-400 font-extrabold">₹{activePrice.toLocaleString('en-IN')}</span>
                        <s className="text-stone-500">₹{item.originalPrice.toLocaleString('en-IN')}</s>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1 rounded">
                          Max ~20% OFF
                        </span>
                      </div>
                      {item.partnerSeller && (
                        <div className="text-[10px] text-stone-400 truncate">
                          Artisan: {item.partnerSeller.businessName}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic('light');
                      onSelectProductToBargain(item);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1 shrink-0 group-hover:brightness-110 active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Bargain</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Alternative */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
          <span className="text-stone-400 text-[11px]">Looking for a specific category?</span>
          <button
            onClick={() => {
              onClose();
              onBrowseAllCatalog();
            }}
            className="text-amber-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <span>Explore All in Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
