import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Sparkles, 
  Package, 
  User, 
  Crown,
  RefreshCw,
  Printer,
  Compass
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface OrderLiveTrackingModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPrintInvoice?: (order: Order) => void;
}

export const OrderLiveTrackingModal: React.FC<OrderLiveTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
  onPrintInvoice,
}) => {
  const [riderCalled, setRiderCalled] = useState(false);

  if (!isOpen || !order) return null;

  const isDelivered = order.status === 'Delivered';
  const isOutForDelivery = order.status === 'Out for Delivery' || isDelivered;
  const isDispatched = order.status === 'Dispatched' || isOutForDelivery;
  const isHallmarked = true;
  const isConfirmed = true;

  const trackingSteps = [
    {
      id: 1,
      title: 'Order Confirmed & Payment Verified',
      subtitle: `Billed to ${order.customerName || 'Customer'} · Txn Ref: ${order.paymentTransactionId || `TXN-UPI-${order.id.slice(2)}`}`,
      time: `${order.date}, ${order.time || '02:45 PM'}`,
      location: 'RoldyGoldy Online Vault Server',
      status: 'completed',
    },
    {
      id: 2,
      title: '22K Micron Hallmark & Insured Vault Packaging',
      subtitle: 'Passed 4-layer purity assay with holographic tamper-proof seal and velvet travel case',
      time: `${order.date}, 03:15 PM`,
      location: order.trackingHub || 'Hyderabad West Central Atelier Hub',
      status: isHallmarked ? 'completed' : 'pending',
    },
    {
      id: 3,
      title: 'Dispatched via Insured Concierge Express',
      subtitle: `Handed over to ${order.courierPartner || 'Roldy Goldy Doorstep Concierge Express'}`,
      time: `${order.date}, 03:45 PM`,
      location: 'Atelier Transit Hub Banjara Hills',
      status: isDispatched ? 'completed' : 'pending',
    },
    {
      id: 4,
      title: 'Out for Doorstep Delivery with Precision Scales',
      subtitle: 'Rider is en route in temperature-controlled security van with calibrated digital scale',
      time: isOutForDelivery ? 'Today, Live in Transit' : 'Expected in 20-35 mins',
      location: `En Route to Pincode ${order.pincode || '500101'}`,
      status: isDelivered ? 'completed' : isOutForDelivery ? 'active' : 'pending',
    },
    {
      id: 5,
      title: 'Doorstep Verification & OTP Handover',
      subtitle: `Requires 4-Digit Security OTP: [${order.deliveryOtp}] after customer weight check`,
      time: isDelivered ? 'Delivered & Verified' : 'Pending OTP Verification',
      location: order.address,
      status: isDelivered ? 'completed' : 'pending',
    },
  ];

  const totalItemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md flex items-center justify-center text-stone-950 font-bold shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-stone-100 text-sm">Live Order Tracking</h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  {order.id}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Official Tax Invoice: <span className="font-mono text-stone-300">{order.invoiceNumber || `INV-RG-2026-${order.id.slice(2)}`}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Tracking Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950/60 text-xs">
          
          {/* Live Delivery Status Hero Banner */}
          <div className="bg-gradient-to-r from-amber-950/70 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-stone-100 text-sm">
                  {isDelivered ? '✅ Order Successfully Delivered' : '🚚 Out for Doorstep Delivery'}
                </span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                ETA: {order.estimatedDelivery || 'Today within 25–35 mins'}
              </span>
            </div>

            {/* Delivery Security OTP Highlight */}
            <div className="bg-stone-950/90 border border-amber-500/40 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  Delivery Security Verification Code
                </span>
                <p className="text-[11px] text-stone-400">
                  Share this OTP with the concierge rider <strong>only after</strong> inspecting your jewellery.
                </p>
              </div>
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-mono font-extrabold text-base px-3.5 py-1.5 rounded-xl shadow-md tracking-widest shrink-0">
                {order.deliveryOtp}
              </div>
            </div>

            {/* Simulated Live GPS Map Graphic */}
            <div className="relative h-28 bg-stone-950 rounded-xl overflow-hidden border border-stone-800 flex items-center justify-between px-6 select-none">
              {/* Grid map pattern background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px]" />
              
              {/* Origin Atelier Hub */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[9.5px] font-bold text-stone-300 mt-1">Banjara Atelier Hub</span>
                <span className="text-[8.5px] text-stone-500">Dispatched 03:45 PM</span>
              </div>

              {/* Transit Path with Live Animated Rider Beacon */}
              <div className="flex-1 mx-4 relative flex items-center justify-center">
                <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full" />
                <div className="absolute left-1/2 -translate-x-1/2 -top-3.5 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce">
                  <Navigation className="w-3 h-3 fill-stone-950" />
                  <span>Rider 1.8 km away</span>
                </div>
              </div>

              {/* Destination Doorstep */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[9.5px] font-bold text-stone-300 mt-1">Your Doorstep</span>
                <span className="text-[8.5px] text-stone-500">{order.pincode || '500101'}</span>
              </div>
            </div>

            {/* Rider Details & Contact */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-stone-200 text-xs truncate">
                    Concierge Rider: Suresh Kumar (ID: RG-RIDER-582)
                  </div>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <span>Scale-Equipped Security Van</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">Sanitized Vault Box</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setRiderCalled(true);
                  setTimeout(() => setRiderCalled(false), 3000);
                }}
                className={`text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  riderCalled
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-stone-950 hover:bg-stone-800 text-amber-300 border border-amber-500/40 active:scale-95'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{riderCalled ? 'Calling +91 94401 23456...' : 'Call Rider'}</span>
              </button>
            </div>

          </div>

          {/* Detailed Tracking Milestones Stepper */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <span className="font-bold text-stone-200 text-xs uppercase tracking-wider block flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Custody &amp; Transit Audit Timeline</span>
            </span>

            <div className="space-y-4 pt-1">
              {trackingSteps.map((step, idx) => {
                const isStepCompleted = step.status === 'completed';
                const isStepActive = step.status === 'active';

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    {/* Stepper vertical connector */}
                    {idx < trackingSteps.length - 1 && (
                      <div 
                        className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                          isStepCompleted ? 'bg-amber-500/60' : 'bg-stone-800'
                        }`} 
                      />
                    )}

                    {/* Step Icon Badge */}
                    <div 
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                        isStepCompleted
                          ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                          : isStepActive
                          ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-500/20 animate-pulse'
                          : 'bg-stone-800 text-stone-500 border border-stone-700'
                      }`}
                    >
                      {isStepCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4 className={`text-xs font-bold ${isStepActive ? 'text-amber-300' : isStepCompleted ? 'text-stone-100' : 'text-stone-400'}`}>
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-mono">{step.time}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">{step.subtitle}</p>
                      <div className="flex items-center gap-1 text-[10px] text-stone-500 mt-1">
                        <MapPin className="w-3 h-3 text-amber-500/70 shrink-0" />
                        <span className="truncate">{step.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Products in this Specific Order */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
            <span className="font-bold text-stone-200 text-xs uppercase tracking-wider block flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              <span>Individually Tracked Jewellery Pieces ({totalItemsCount} Total)</span>
            </span>

            <div className="space-y-2.5">
              {order.items.map((item, itemIdx) => (
                <div 
                  key={`${item.id}-${itemIdx}`}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-xl object-cover border border-stone-700 shrink-0"
                    />
                    <div className="truncate space-y-0.5">
                      <div className="font-semibold text-stone-100 text-xs truncate">{item.name}</div>
                      <div className="text-[11px] text-stone-400 flex flex-wrap gap-x-2">
                        {item.category && <span>Category: {item.category}</span>}
                        {item.grossWeight && <span>· Weight: {item.grossWeight}</span>}
                        {item.metal && <span>· {item.metal}</span>}
                      </div>
                      {item.partnerSeller && (
                        <div className="text-[10px] text-amber-400/90 font-medium">
                          Artisan: {item.partnerSeller.businessName} ({item.partnerSeller.city})
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-amber-400 text-xs">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-stone-400">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transit Insurance & Delivery Destination Summary */}
          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2 text-xs">
            <span className="font-bold text-stone-300 uppercase tracking-wider text-[10px] block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Transit Security &amp; Recipient
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
              <div>
                <span className="text-stone-500 text-[11px]">Recipient Name: </span>
                <strong className="text-stone-200">{order.customerName}</strong>
              </div>
              <div>
                <span className="text-stone-500 text-[11px]">Phone: </span>
                <strong className="text-stone-200">{order.customerPhone}</strong>
              </div>
              <div>
                <span className="text-stone-500 text-[11px]">Transit Insurance Policy: </span>
                <strong className="text-stone-200 font-mono">{order.insurancePolicyNumber || `ICICI-LOMBARD-JWL-${order.id.slice(2)}`}</strong>
              </div>
              <div>
                <span className="text-stone-500 text-[11px]">Transit Hub: </span>
                <strong className="text-stone-200">{order.trackingHub || 'Hyderabad West Central Hub'}</strong>
              </div>
            </div>
            <div className="pt-1 text-stone-300 border-t border-stone-900 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span><strong>Delivery Address:</strong> {order.address} (Pincode: {order.pincode})</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs">
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 font-semibold px-3 py-2"
          >
            Close Tracking
          </button>

          {onPrintInvoice && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onPrintInvoice(order);
              }}
              className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs px-4 py-2 rounded-xl border border-amber-500/40 flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>View Tax Invoice</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
