import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  MapPin, 
  Download, 
  ArrowRight, 
  Truck, 
  Sparkles, 
  Gift, 
  FileText,
  Clock,
  Phone,
  KeyRound,
  X
} from 'lucide-react';
import { Order } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface OrderSuccessModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onViewReports: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  order,
  onClose,
  onViewReports,
}) => {
  if (!isOpen || !order) return null;

  const handleDownloadInvoice = () => {
    triggerHaptic('success');
    const invoiceContent = `
=====================================================
         ROLDY GOLDY · OFFICIAL TAX INVOICE
       22K 1-Gram Rold Gold & Imitation Atelier
=====================================================
Order ID: ${order.id}
Date: ${order.date}
Payment Method: ${order.paymentMethod}
Status: ${order.status}
Delivery OTP: ${order.deliveryOtp} (Tamper-Proof Box)

DELIVERY ADDRESS:
${order.address}

-----------------------------------------------------
ITEMS PURCHASED:
${order.items.map((i) => `- ${i.name} x ${i.quantity} @ Rs. ${i.price.toLocaleString('en-IN')}`).join('\n')}

-----------------------------------------------------
Items Subtotal: Rs. ${order.subtotal.toLocaleString('en-IN')}
Scrap Trade-in Cashback: -Rs. ${order.exchangeDiscount.toLocaleString('en-IN')}
Insured Transit Delivery: FREE (Doorstep 20-Min Concierge)
-----------------------------------------------------
NET TOTAL PAID: Rs. ${order.total.toLocaleString('en-IN')}
=====================================================
Hallmark Certificate: CERT-HALLMARK-916-22K
Security Warning: Open only after verifying tamper seal.
=====================================================
`;
    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${order.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 px-5 py-5 border-b border-stone-800 flex items-center justify-between text-center relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center font-bold shadow-lg shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-stone-100 text-base">Order Booked &amp; Confirmed!</h3>
                <span className="text-[9.5px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full">
                  LIVE DISPATCH
                </span>
              </div>
              <p className="text-xs text-stone-400">Tamper-proof security packaging initiated</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/60 text-xs">
          
          {/* Order ID & Tamper-Proof OTP Box */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[10.5px] text-stone-400 font-mono block">BOOKING REFERENCE</span>
              <span className="text-sm font-extrabold text-amber-400 font-mono tracking-wider">{order.id}</span>
              <span className="text-[11px] text-stone-400 block mt-0.5">{order.date} · {order.paymentMethod}</span>
            </div>

            <div className="bg-stone-950 border border-amber-500/50 px-3.5 py-2 rounded-xl text-center shadow-inner">
              <div className="flex items-center justify-center gap-1 text-[10px] text-amber-400 font-bold uppercase">
                <KeyRound className="w-3 h-3" /> Delivery OTP
              </div>
              <div className="text-lg font-mono font-extrabold text-amber-300 tracking-widest mt-0.5">
                {order.deliveryOtp}
              </div>
              <span className="text-[8.5px] text-stone-400 block">Share at doorstep</span>
            </div>
          </div>

          {/* Doorstep Concierge Live Tracking Status */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Doorstep Courier Status</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                {order.status}
              </span>
            </div>

            {/* Tracking Progress Steps */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-stone-200 text-xs">Hallmark Vault Inspection Completed</div>
                  <p className="text-[11px] text-stone-400">Certified 22K 1-gram gold micro polish verified.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 animate-pulse">
                  2
                </div>
                <div>
                  <div className="font-semibold text-amber-300 text-xs">Tamper-Proof Box Sealed &amp; Dispatched</div>
                  <p className="text-[11px] text-stone-400">Assigned to Hyderabad Express Concierge Hub.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 opacity-60">
                <div className="w-5 h-5 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <div className="font-semibold text-stone-300 text-xs">Doorstep OTP Handover</div>
                  <p className="text-[11px] text-stone-500">Provide OTP {order.deliveryOtp} after inspecting the package.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Summary in this Booking */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2.5">
            <span className="font-bold text-stone-300 text-xs uppercase tracking-wider block">
              Items in Package ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
            </span>

            <div className="space-y-2 divide-y divide-stone-800/60">
              {order.items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover border border-stone-800 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-stone-200 text-xs truncate">{item.name}</h4>
                      <span className="text-stone-400 text-[11px]">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="text-amber-400 font-bold shrink-0">₹{item.price.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Deductions Breakdown */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
            <span className="font-bold text-stone-400 text-[10.5px] uppercase tracking-wider block">
              PAYMENT BREAKDOWN
            </span>
            <div className="flex justify-between text-stone-300">
              <span>Items Total</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.exchangeDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Scrap Trade-In Cashback Applied</span>
                <span>-₹{order.exchangeDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-300">
              <span>Doorstep Transit Insurance</span>
              <span className="text-emerald-400 font-bold">FREE</span>
            </div>
            <div className="border-t border-stone-800 pt-2 flex justify-between items-baseline font-bold">
              <span className="text-stone-100 text-xs">Total Paid ({order.paymentMethod})</span>
              <span className="text-xl text-amber-400">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 flex items-center gap-2.5 text-stone-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-[11px] leading-snug">
              <strong className="text-stone-200 block">Delivery Address:</strong>
              {order.address}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-stone-950 px-5 py-4 border-t border-stone-800 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold text-xs py-3 rounded-xl border border-stone-700 flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Tax Invoice</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
              onViewReports();
            }}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>View in Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
