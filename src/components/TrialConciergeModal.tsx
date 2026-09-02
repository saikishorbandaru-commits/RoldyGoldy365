import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Phone,
  Timer,
  KeyRound,
  Lock,
  Unlock,
  ArrowRight
} from 'lucide-react';
import { Product, TrialBooking } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { lookupPincode } from '../utils/location';

interface TrialConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  userPincode: string;
  onConfirmTrial: (booking: TrialBooking) => void;
}

export const TrialConciergeModal: React.FC<TrialConciergeModalProps> = ({
  isOpen,
  onClose,
  product,
  userPincode,
  onConfirmTrial,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('27 May, Tue');
  const [selectedSlot, setSelectedSlot] = useState<string>('Evening (04:00 PM - 07:00 PM)');
  const [activeStep, setActiveStep] = useState<'schedule' | 'active-timer'>('schedule');
  
  // Trial Lifecycle: 'awaiting_delivery' (only delivery OTP) -> 'in_tryout' (timer running) -> 'returned' (return OTP unlocked)
  const [trialPhase, setTrialPhase] = useState<'awaiting_delivery' | 'in_tryout' | 'returned'>('awaiting_delivery');

  // Timer State for active doorstep trial
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const hubInfo = lookupPincode(userPincode);
  const isEligiblePincode = hubInfo.trialAtHomeAvailable;

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && trialPhase === 'in_tryout') {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Time out! Automatically transition to return OTP phase
            setTrialPhase('returned');
            setIsTimerRunning(false);
            triggerHaptic('warning');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, trialPhase]);

  if (!isOpen) return null;

  const daysList = [
    { label: '27 May', sub: 'Tue', val: '27 May, Tue' },
    { label: '28 May', sub: 'Wed', val: '28 May, Wed' },
    { label: '29 May', sub: 'Thu', val: '29 May, Thu' },
    { label: '30 May', sub: 'Fri', val: '30 May, Fri' },
  ];

  const timeSlots = [
    'Evening (04:00 PM - 07:00 PM)',
    'Morning (07:00 AM - 09:00 AM)',
    'Afternoon (12:00 PM - 04:00 PM)',
  ];

  const handleBooking = () => {
    triggerHaptic('success');
    const booking: TrialBooking = {
      id: `RGTR${Math.floor(10000 + Math.random() * 90000)}`,
      date: selectedDay,
      timeSlot: selectedSlot,
      items: [product],
      fee: 99,
      overageMins: 0,
      status: 'Scheduled',
      deliveryOtp: '4812',
      returnOtp: '9341',
      pincode: userPincode,
    };
    onConfirmTrial(booking);
    setActiveStep('active-timer');
    setTrialPhase('awaiting_delivery');
  };

  const handleMarkDelivered = () => {
    triggerHaptic('medium');
    setTrialPhase('in_tryout');
    setIsTimerRunning(true);
  };

  const handleFinishTryout = () => {
    triggerHaptic('success');
    setTrialPhase('returned');
    setIsTimerRunning(false);
  };

  const formatTimer = (totalSeconds: number) => {
    if (totalSeconds >= 0) {
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
      const overage = Math.abs(Math.floor(totalSeconds / 60));
      return `+${overage} min overage`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              👑
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-1.5">
                <span>Trial @Home Concierge</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-500/30">Hub Express</span>
              </h3>
              <p className="text-xs text-stone-400">Try 3–4 luxury pieces at your doorstep before buying</p>
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
          
          {/* Pincode & Hub Geofencing & Partner Routing Status */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
            isEligiblePincode 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : product.partnerSeller 
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-xs">
                {isEligiblePincode 
                  ? `Serviceable: ${hubInfo.city} · ${hubInfo.hubName}`
                  : product.partnerSeller
                    ? `Cross-Pincode Auto Routed: ${product.partnerSeller.storeName} (${product.partnerSeller.city} - ${product.partnerSeller.pincode})`
                    : `Express Hub Unavailable in ${userPincode}`
                }
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {isEligiblePincode 
                  ? `Active Concierge: Valet Rider can reach your doorstep in ${hubInfo.deliveryEta} with sanitized velvet trays.` 
                  : product.partnerSeller
                    ? `Item not in local pincode hub, but available at our verified artisan partner '${product.partnerSeller.storeName}' in ${product.partnerSeller.city} (${product.partnerSeller.pincode}). Your Trial@Home request will be fulfilled via Partner Hub (${product.partnerSeller.hubName}) with courier dispatch in ${product.partnerSeller.deliveryEta}.`
                    : `Doorstep 20-min Trial is currently active across major metro hubs. Standard 2-day insured courier available for ${userPincode}.`}
              </p>
            </div>
          </div>

          {activeStep === 'schedule' ? (
            <>
              {/* Tryout Pricing Details */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-stone-400 font-medium">Doorstep Tryout Booking Fee:</span>
                  <span className="text-xl font-extrabold text-amber-400">₹99</span>
                </div>
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800/80 space-y-1 text-stone-300 text-[11.5px]">
                  <p>• <strong>15–20 minutes</strong> comfortable try-on in front of your own mirror/outfits.</p>
                  <p>• <strong>5-minute free grace period</strong> included.</p>
                  <p>• <strong>100% Fee Waived</strong> against purchase if you decide to buy any piece!</p>
                  <p>• ₹1 per minute overage applies only if tryout exceeds grace period.</p>
                </div>
              </div>

              {/* Schedule Selection */}
              <div className="space-y-3">
                <span className="font-bold text-stone-200 text-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Tryout Date:</span>
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {daysList.map((d) => (
                    <button
                      key={d.val}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedDay(d.val);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDay === d.val
                          ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div className="text-xs">{d.label}</div>
                      <div className="text-[10px] opacity-80">{d.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <span className="font-bold text-stone-200 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Time Window:</span>
                </span>
                <div className="space-y-1.5">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot}
                      onClick={() => {
                        triggerHaptic('light');
                        setSelectedSlot(slot);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedSlot === slot
                          ? 'bg-amber-500/10 border-amber-500/60 text-stone-100 font-medium'
                          : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="trial-slot"
                        checked={selectedSlot === slot}
                        onChange={() => setSelectedSlot(slot)}
                        className="accent-amber-500"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Active Live Concierge Tracker & Staged OTPs */
            <div className="space-y-4">
              <div className="bg-gradient-to-tr from-stone-900 to-stone-950 border border-amber-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🛵</span>
                    <div>
                      <div className="font-bold text-stone-100 text-xs">Rider Vikram Sharma</div>
                      <div className="text-[10px] text-stone-400">Express Delivery · Hub 500101</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert('Dialing Concierge Rider Vikram Sharma (+91 98000 12345)...')}
                    className="bg-stone-800 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Call Rider
                  </button>
                </div>

                {/* STAGED OTP LOGIC: Delivery OTP & Return OTP Never Shown at Same Time */}
                {trialPhase === 'awaiting_delivery' && (
                  <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-3 text-center space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-xs">
                      <KeyRound className="w-4 h-4" />
                      <span>STEP 1: DOORSTEP DELIVERY OTP</span>
                    </div>
                    <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-widest my-1">
                      4812
                    </div>
                    <p className="text-[11px] text-stone-300">
                      Share this Delivery OTP with the rider when he arrives to hand over the trial jewellery tray.
                    </p>
                    <button
                      onClick={handleMarkDelivered}
                      className="w-full bg-amber-500 text-stone-950 font-bold py-2 rounded-xl text-xs hover:brightness-110 active:scale-95 transition-all shadow-md mt-1"
                    >
                      ✓ Items Received from Rider (Start 20-Min Tryout)
                    </button>
                  </div>
                )}

                {trialPhase === 'in_tryout' && (
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-300 flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-amber-400" />
                        <span>Tryout In Progress</span>
                      </span>
                      <span className="text-[10.5px] text-stone-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-stone-500" />
                        <span>Return OTP locked until timer ends</span>
                      </span>
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-center text-amber-400 my-1">
                      {formatTimer(secondsRemaining)}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-1.5 rounded-lg text-xs"
                      >
                        {isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                      </button>
                      <button
                        onClick={handleFinishTryout}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs"
                      >
                        Finish &amp; Get Return OTP
                      </button>
                    </div>
                  </div>
                )}

                {trialPhase === 'returned' && (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-center space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <Unlock className="w-4 h-4" />
                      <span>STEP 2: RETURN / HANDOVER OTP</span>
                    </div>
                    <div className="text-3xl font-extrabold text-emerald-300 font-mono tracking-widest my-1">
                      9341
                    </div>
                    <p className="text-[11px] text-emerald-200">
                      Tryout session complete. Share this Return OTP with Rider Vikram Sharma when handing back unpurchased pieces.
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-5 py-3.5 border-t border-stone-800 flex items-center justify-between">
          {activeStep === 'schedule' ? (
            <button
              disabled={!isEligiblePincode}
              onClick={handleBooking}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 disabled:opacity-50 text-stone-950 font-bold text-xs py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pay ₹99 &amp; Confirm Trial Schedule</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs py-3 rounded-xl transition-colors"
            >
              Done / Return to Store
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

