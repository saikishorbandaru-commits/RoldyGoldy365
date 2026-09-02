import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Truck,
  Plus,
  Minus,
  Trash2,
  Gift,
  ShoppingBag
} from 'lucide-react';
import { CartItem, ExchangeScrapData, Order, UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty?: (productId: string, delta: number) => void;
  onRemoveItem?: (productId: string) => void;
  exchangeVoucher: ExchangeScrapData | null;
  onRemoveVoucher?: () => void;
  onOpenLiveScrapUpload?: () => void;
  userProfile: UserProfile;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  exchangeVoucher,
  onRemoveVoucher,
  onOpenLiveScrapUpload,
  userProfile,
  onOrderPlaced,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<string>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showItemsList, setShowItemsList] = useState<boolean>(true);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.customPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = exchangeVoucher ? exchangeVoucher.netCredit : 0;
  const totalPayable = Math.max(0, subtotal - discountAmount);

  const handlePlaceOrder = () => {
    triggerHaptic('success');
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = `RGORD${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        items: cartItems.map((c) => ({
          id: c.product.id,
          name: c.product.name,
          price: c.customPrice || c.product.price,
          originalPrice: c.product.originalPrice,
          quantity: c.quantity,
          image: c.product.image,
          isBargained: Boolean(c.isBargained || (c.customPrice && c.customPrice < c.product.price)),
          category: c.product.category,
          metal: c.product.metal,
          grossWeight: c.product.grossWeight,
          netWeight: c.product.netWeight,
          stone: c.product.stone,
          sku: `RG-${c.product.category.toUpperCase().slice(0, 3)}-${c.product.id.slice(0, 4)}`,
          partnerSeller: c.product.partnerSeller,
        })),
        subtotal,
        exchangeDiscount: discountAmount,
        exchangeVoucherDetails: exchangeVoucher ? {
          code: exchangeVoucher.voucherCode,
          grams: exchangeVoucher.grams,
          metalType: exchangeVoucher.metalType,
          ratePerGram: exchangeVoucher.grams > 0 ? (exchangeVoucher.netCredit / exchangeVoucher.grams) : 0.35,
        } : undefined,
        taxGst: Math.round(totalPayable * 0.03),
        deliveryFee: 0,
        total: totalPayable,
        paymentMethod: selectedPayment === 'upi' ? 'UPI (Instant Netbanking)' : selectedPayment === 'card' ? 'Credit / Debit Card' : 'Cash on Doorstep Delivery',
        paymentTransactionId: selectedPayment === 'cod' ? `COD-${orderId}` : `TXN/${Math.floor(1000000000 + Math.random() * 9000000000)}/HDFC`,
        paymentStatus: selectedPayment === 'cod' ? 'Cash on Delivery' : selectedPayment === 'upi' ? 'Paid via UPI' : 'Paid via Card',
        status: 'Dispatched',
        deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
        address: userProfile.address,
        pincode: userProfile.pincode,
        customerName: userProfile.name,
        customerPhone: userProfile.phone,
        trackingHub: 'Hyderabad West Central Atelier Hub (Banjara Hills)',
        courierPartner: 'Roldy Goldy Doorstep Concierge Express (Scale Equipped)',
        estimatedDelivery: 'Today within 2-4 Hours',
        insurancePolicyNumber: `TATA-AIG-RG-${orderId.slice(5)}-TRANSIT`,
        invoiceNumber: `INV-RG-2026-${orderId.slice(5)}`,
        returnWindowExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      };

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm">Insured Checkout &amp; Payment</h3>
              <p className="text-xs text-stone-400">100% Certified Hallmark &amp; Transit Insurance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/60 text-xs">
          
          {/* Order Items Breakdown */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
              </span>
              <button 
                onClick={() => setShowItemsList(!showItemsList)}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-medium"
              >
                {showItemsList ? 'Hide Items' : 'Show Items'}
              </button>
            </div>

            {showItemsList && (
              <div className="space-y-2 pt-1 divide-y divide-stone-800/60">
                {cartItems.length === 0 ? (
                  <p className="text-stone-500 py-2 text-center text-xs">Your cart is currently empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const price = item.customPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-12 h-12 rounded-xl object-cover border border-stone-800 shrink-0" 
                          />
                          <div className="min-w-0">
                            <h4 className="font-semibold text-stone-200 text-xs truncate">{item.product.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-amber-400 font-bold">₹{price.toLocaleString('en-IN')}</span>
                              {item.isBargained && (
                                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                  Bargained Deal
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {onUpdateQty && (
                            <div className="flex items-center gap-1.5 bg-stone-950 rounded-lg px-2 py-0.5 border border-stone-800">
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
                          )}
                          {onRemoveItem && (
                            <button
                              onClick={() => {
                                triggerHaptic('medium');
                                onRemoveItem(item.product.id);
                              }}
                              className="text-stone-500 hover:text-red-400 p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Trade-in Scrap Cashback Section */}
          <div>
            {exchangeVoucher ? (
              <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scrap Trade-in Cashback: -₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10.5px] text-emerald-400/90 font-mono">
                    Code: {exchangeVoucher.voucherCode} ({exchangeVoucher.grams}g {exchangeVoucher.metalType})
                  </p>
                </div>
                {onRemoveVoucher && (
                  <button
                    onClick={() => {
                      triggerHaptic('medium');
                      onRemoveVoucher();
                    }}
                    className="text-red-400 hover:text-red-300 text-xs font-bold px-2.5 py-1 bg-red-950/60 rounded-lg border border-red-500/30"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : onOpenLiveScrapUpload ? (
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
                    <p className="text-[11px] text-stone-400">Snap live photo for instant cashback voucher on this bill</p>
                  </div>
                </div>
                <span className="text-amber-400 font-bold text-xs">&plus; Add</span>
              </div>
            ) : null}
          </div>

          {/* Delivery Address */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Delivering To</span>
              </span>
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                Express Hub 500101
              </span>
            </div>
            <div>
              <div className="font-bold text-stone-100 text-sm">{userProfile.name}</div>
              <p className="text-stone-400 text-xs mt-0.5">{userProfile.address}</p>
              <div className="text-stone-400 text-[11px] mt-1 flex gap-3">
                <span>Phone: {userProfile.phone}</span>
                <span>Pincode: {userProfile.pincode}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2.5">
            <span className="font-bold text-stone-300 text-xs uppercase tracking-wider block">
              Select Payment Option
            </span>

            <label 
              onClick={() => {
                triggerHaptic('light');
                setSelectedPayment('upi');
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPayment === 'upi'
                  ? 'bg-amber-500/10 border-amber-500/80 text-stone-100'
                  : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-xs">Instant UPI (GPay, PhonePe, Paytm, BHIM)</div>
                  <p className="text-[11px] text-stone-400">Zero transaction fees &amp; fastest order dispatch</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={selectedPayment === 'upi'} 
                onChange={() => setSelectedPayment('upi')}
                className="accent-amber-500" 
              />
            </label>

            <label 
              onClick={() => {
                triggerHaptic('light');
                setSelectedPayment('card');
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPayment === 'card'
                  ? 'bg-amber-500/10 border-amber-500/80 text-stone-100'
                  : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-xs">Credit / Debit Card (Visa, Mastercard, RuPay)</div>
                  <p className="text-[11px] text-stone-400">No-Cost EMI available on select bank cards</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={selectedPayment === 'card'} 
                onChange={() => setSelectedPayment('card')}
                className="accent-amber-500" 
              />
            </label>

            <label 
              onClick={() => {
                triggerHaptic('light');
                setSelectedPayment('cod');
              }}
              className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedPayment === 'cod'
                  ? 'bg-amber-500/10 border-amber-500/80 text-stone-100'
                  : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-xs">Cash on Doorstep Delivery (COD)</div>
                  <p className="text-[11px] text-stone-400">Pay cash or UPI after opening tamper-proof seal</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={selectedPayment === 'cod'} 
                onChange={() => setSelectedPayment('cod')}
                className="accent-amber-500" 
              />
            </label>
          </div>

          {/* Detailed Price & Deductions Breakdown */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2.5">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              BILL SUMMARY
            </span>
            <div className="flex justify-between text-stone-300">
              <span>Items Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <span>Scrap Cashback ({exchangeVoucher?.voucherCode})</span>
                </span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-300">
              <span>Insured Transit Courier</span>
              <span className="text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="border-t border-stone-800 pt-2.5 flex justify-between items-baseline font-bold">
              <span className="text-stone-100 text-sm">Net Total Payable</span>
              <span className="text-2xl text-amber-400">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-5 py-4 border-t border-stone-800 flex items-center justify-between gap-3">
          <button
            disabled={isProcessing || cartItems.length === 0}
            onClick={handlePlaceOrder}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 disabled:opacity-50 text-stone-950 font-bold text-xs py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Luxury Order...</span>
              </>
            ) : (
              <>
                <span>Confirm &amp; Pay ₹{totalPayable.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

