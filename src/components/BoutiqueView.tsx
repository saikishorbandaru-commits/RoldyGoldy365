import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  Scale, 
  Gem, 
  Truck, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Scissors, 
  Store,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface BoutiqueViewProps {
  onOpenTrial: (product?: Product) => void;
  onOpenLiveScrapUpload: () => void;
  onExploreProducts: () => void;
}

export const BoutiqueView: React.FC<BoutiqueViewProps> = ({
  onOpenTrial,
  onOpenLiveScrapUpload,
  onExploreProducts,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [appointmentType, setAppointmentType] = useState<'bridal' | 'repolish' | 'scrap'>('bridal');
  const [selectedDate, setSelectedDate] = useState('Tomorrow (3:00 PM)');

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    setIsBooked(true);
  };

  return (
    <main className="flex-1 p-4 pb-24 space-y-5 max-w-4xl mx-auto animate-in fade-in duration-200">
      
      {/* Boutique Hero Showcase */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/60 border border-amber-500/40 p-6 shadow-2xl">
        <div className="relative z-10 max-w-lg space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Flagship Atelier &amp; Experience Centre</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 leading-tight">
            The RoldyGoldy Boutique Hub
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            The heart of our craftsmanship. The boutique serves as our local fulfillment hub for 20-minute Doorstep Trials, hallmark verification lab, and bridal styling lounge.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 text-xs">
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenTrial();
              }}
              className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold px-4 py-2 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Order 20-Min Doorstep Trial
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenLiveScrapUpload();
              }}
              className="bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-bold px-3.5 py-2 rounded-xl transition-all"
            >
              Exchange Old Scrap (₹0.35/g)
            </button>
          </div>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* 4 Core Purposes of the Boutique */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-stone-200">
            Why We Have Boutique Hubs
          </h3>
          <span className="text-[11px] text-amber-400 font-medium">Local &amp; Trusted</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          
          {/* Pillar 1 */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-100 text-sm">1. 20-Min Trial@Home Dispatch</h4>
            <p className="text-stone-400 leading-relaxed">
              Boutiques are positioned within 5 km of customer zones so uniformed Concierge riders can dispatch 3–4 jewellery pieces to your doorstep in 20 minutes with tamper-proof security seals.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-100 text-sm">2. Precision Scrap Exchange Verification</h4>
            <p className="text-stone-400 leading-relaxed">
              Every rider carries a digital precision scale linked to the boutique vault. Customers get live hallmark verification and instant bill deduction on old imitation scrap without shipping delays.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400">
              <Scissors className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-100 text-sm">3. 22K 1-Gram Re-polishing &amp; Karigars</h4>
            <p className="text-stone-400 leading-relaxed">
              Our in-house master karigars provide lifetime micro-gold dip re-polishing, custom bangle sizing, lock replacements, and stone resetting for every piece in our catalogue.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Gem className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-100 text-sm">4. VIP Bridal Styling Lounge</h4>
            <p className="text-stone-400 leading-relaxed">
              Visit our experiential lounge to match bridal chokers with your actual wedding lehengas or sarees, guided by personal gemmologists with private trial mirrors.
            </p>
          </div>

        </div>
      </div>

      {/* Flagship Location Details & In-Store Appointment */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <h4 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
              <span>Jubilee Hills Flagship Boutique</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Open Now
              </span>
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Road No. 36, Near Peddamma Temple Metro, Jubilee Hills, Hyderabad - 500033
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <a
              href="tel:+919876543210"
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-3 py-1.5 rounded-xl border border-stone-700 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Concierge</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
            <span className="text-stone-500 text-[10px] block uppercase">Timings</span>
            <span className="text-stone-200 font-bold text-[11px]">10:30 AM - 9:30 PM</span>
          </div>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
            <span className="text-stone-500 text-[10px] block uppercase">Trial Radius</span>
            <span className="text-amber-400 font-bold text-[11px]">5 km (20 Mins)</span>
          </div>
          <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
            <span className="text-stone-500 text-[10px] block uppercase">Hallmark</span>
            <span className="text-emerald-400 font-bold text-[11px]">22K Micron Grade</span>
          </div>
        </div>

        {/* Appointment Booking Form */}
        <div className="bg-stone-950 rounded-2xl p-4 border border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Book VIP Showroom Visit / Styling Consultation</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold">Complimentary</span>
          </div>

          {isBooked ? (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-3.5 text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-emerald-300 block">VIP Appointment Confirmed!</strong>
                <span>We look forward to hosting you on {selectedDate} at Jubilee Hills Flagship Boutique.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleBookVisit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-400 block mb-1 text-[11px]">Consultation Purpose</label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="bridal">Bridal &amp; Wedding Jewellery Styling</option>
                    <option value="repolish">22K 1-Gram Re-polishing &amp; Sizing</option>
                    <option value="scrap">In-Person Old Scrap Valuation</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1 text-[11px]">Preferred Time Slot</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Today (5:30 PM)">Today (5:30 PM)</option>
                    <option value="Tomorrow (11:30 AM)">Tomorrow (11:30 AM)</option>
                    <option value="Tomorrow (3:00 PM)">Tomorrow (3:00 PM)</option>
                    <option value="This Weekend (4:00 PM)">This Weekend (4:00 PM)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold py-2.5 rounded-xl shadow-md hover:brightness-110 active:scale-98 transition-all"
              >
                Confirm Showroom Appointment
              </button>
            </form>
          )}
        </div>

      </div>

    </main>
  );
};
