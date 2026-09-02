import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  ArrowRight,
  ArrowLeft,
  Gift,
  RefreshCw
} from 'lucide-react';
import { CartItem, ExchangeScrapData } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  exchangeVoucher: ExchangeScrapData | null;
  onRemoveVoucher: () => void;
  onProceedToCheckout: () => void;
  onOpenLiveScrapUpload: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  exchangeVoucher,
  onRemoveVoucher,
  onProceedToCheckout,
  onOpenLiveScrapUpload,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.customPrice || item.product.bargainedPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = exchangeVoucher ? exchangeVoucher.netCredit : 0;
  const totalPayable = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-stone-900 border-l border-amber-500/30 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        
        {/* Header with Back Navigation Button */}
        <div className="bg-stone-950 px-4 py-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400 border border-stone-800 transition-colors text-xs font-semibold"
              title="Back to Shopping"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-100 text-xs sm:text-sm">My Cart &amp; Bill</h3>
                <p className="text-[10px] text-stone-400">{cartItems.length} item(s)</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-950/60 text-xs">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-800/80 border border-stone-700 text-stone-500 flex items-center justify-center mx-auto text-2xl">
                💍
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-200">Your jewellery cart is empty</h4>
                <p className="text-xs text-stone-400 mt-1">Discover handcrafted bridal chokers, temple jhumkas &amp; daily wear.</p>
              </div>
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onClose();
                }}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Boutique Collections</span>
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const activePrice = item.customPrice || item.product.bargainedPrice || item.product.price;
              const isBargained = Boolean(item.isBargained || (item.customPrice && item.customPrice < item.product.price) || (item.product.bargainedPrice && item.product.bargainedPrice < item.product.price));

              return (
                <div 
                  key={item.product.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-3 flex gap-3 items-center"
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-amber-500/20 shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-stone-200 truncate">{item.product.name}</div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-extrabold text-sm text-amber-400">
                        ₹{activePrice.toLocaleString('en-IN')}
                      </span>
                      {isBargained && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-500/30">
                          Bargain Locked ✓
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800/60">
                      <div className="flex items-center gap-2 bg-stone-950 rounded-lg px-2 py-0.5 border border-stone-800">
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            onUpdateQty(item.product.id, -1);
                          }}
                          className="text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-200 px-1">{item.quantity}</span>
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            onUpdateQty(item.product.id, 1);
                          }}
                          className="text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          triggerHaptic('medium');
                          onRemoveItem(item.product.id);
                        }}
                        className="text-stone-500 hover:text-red-400 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Trade-in Scrap Cashback Section in Cart */}
          {cartItems.length > 0 && (
            <div className="pt-2">
              {exchangeVoucher ? (
                <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Old Scrap Cashback: -₹{exchangeVoucher.netCredit.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[10.5px] text-emerald-400/90 font-mono">
                      Code: {exchangeVoucher.voucherCode} ({exchangeVoucher.grams}g {exchangeVoucher.metalType})
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onRemoveVoucher();
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 bg-red-950/60 rounded-lg border border-red-500/30"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenLiveScrapUpload();
                  }}
                  className="bg-stone-900 border border-dashed border-amber-500/40 hover:border-amber-500 rounded-2xl p-3 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">♻️</span>
                    <div>
                      <div className="font-bold text-stone-200">Exchange Old Scrap Imitation / Rold Gold?</div>
                      <p className="text-[11px] text-stone-400">Snap live photo for instant estimated cashback voucher (₹0.30 - ₹0.35/g)</p>
                    </div>
                  </div>
                  <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30">+ Add</span>
                </div>
              )}
            </div>
          )}

          {/* Bill Summary */}
          {cartItems.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 mt-4">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                PRICE BREAKDOWN
              </span>
              <div className="flex justify-between text-stone-300">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Exchange Cashback Voucher</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-300">
                <span>Insured Doorstep Delivery</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline font-bold">
                <span className="text-stone-100 text-sm">Total Payable</span>
                <span className="text-xl text-amber-400">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="bg-stone-950 px-5 py-4 border-t border-stone-800 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-stone-400 block">TOTAL AMOUNT</span>
              <span className="text-lg font-extrabold text-amber-400">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={() => {
                triggerHaptic('success');
                onClose();
                onProceedToCheckout();
              }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-6 py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

