import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Megaphone, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Smartphone,
  BadgeCheck,
  Zap,
  Building2,
  Phone,
  Send,
  Eye,
  Layers,
  Sparkle
} from 'lucide-react';
import { AdBanner, SellerAdBooking } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface SellerAdBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdBooked: (booking: SellerAdBooking, createdBanner: AdBanner) => void;
  defaultPincode?: string;
  defaultCity?: string;
}

export const SellerAdBookingModal: React.FC<SellerAdBookingModalProps> = ({
  isOpen,
  onClose,
  onAdBooked,
  defaultPincode = '534001',
  defaultCity = 'Eluru',
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'register' | 'preview_simulator'>('info');

  // Seller Registration Form State
  const [storeName, setStoreName] = useState<string>('');
  const [ownerName, setOwnerName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [sellerEmail, setSellerEmail] = useState<string>('');
  const [sellerCity, setSellerCity] = useState<string>(defaultCity);
  const [sellerPincode, setSellerPincode] = useState<string>(defaultPincode);
  const [hallmarkGst, setHallmarkGst] = useState<string>('');
  const [craftSpecialty, setCraftSpecialty] = useState<string>('Temple & Kundan Gold');
  const [isSubmittingRegistration, setIsSubmittingRegistration] = useState<boolean>(false);
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState<boolean>(false);

  // Ad Preview Simulation State (for verified merchants exploring ad formats)
  const [slotType, setSlotType] = useState<'home_top' | 'boutique_spotlight' | 'flash_deal'>('home_top');
  const [simBannerTitle, setSimBannerTitle] = useState<string>('Machilipatnam 1-Gram Pure Polish Mega Mela');
  const [simBannerSubtitle, setSimBannerSubtitle] = useState<string>('Direct from certified artisans. Up to 40% Off + Instant 20m Home Trial');
  const [simCtaText, setSimCtaText] = useState<string>('Explore Artisanal Collection');
  const [simSelectedImage, setSimSelectedImage] = useState<string>('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85');
  const [simTargetCategory, setSimTargetCategory] = useState<string>('Bridal');

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !contactPhone) return;

    setIsSubmittingRegistration(true);
    triggerHaptic('medium');

    setTimeout(() => {
      setIsSubmittingRegistration(false);
      setIsRegisteredSuccess(true);
      triggerHaptic('success');
    }, 1000);
  };

  const handleDeploySimulatedBanner = () => {
    const bookingId = `SELLER-SIM-${Date.now().toString().slice(-4)}`;
    const newBooking: SellerAdBooking = {
      id: bookingId,
      sellerName: ownerName || 'Verified Artisan',
      businessName: storeName || 'Sri Lakshmi Jewellers',
      phone: contactPhone || '+91 94401 23456',
      email: sellerEmail || 'partner@roldygoldy.in',
      city: sellerCity,
      pincode: sellerPincode,
      slotType,
      duration: '1_week',
      cost: 0,
      bannerTitle: simBannerTitle,
      bannerSubtitle: simBannerSubtitle,
      bannerImage: simSelectedImage,
      ctaText: simCtaText,
      paymentStatus: 'Paid',
      startDate: 'Active Now',
    };

    const newBanner: AdBanner = {
      id: `banner-${Date.now()}`,
      sellerName: ownerName || 'Verified Artisan',
      businessName: storeName || 'Sri Lakshmi Jewellers',
      city: sellerCity,
      pincode: sellerPincode,
      title: simBannerTitle,
      subtitle: simBannerSubtitle,
      tag: slotType === 'home_top' ? 'Featured Artisan' : slotType === 'boutique_spotlight' ? 'Boutique Spotlight' : 'Flash Sale',
      imageUrl: simSelectedImage,
      ctaText: simCtaText,
      targetCategory: simTargetCategory,
      slotType,
      active: true,
      clicksCount: 0,
      impressionsCount: 1,
    };

    onAdBooked(newBooking, newBanner);
    triggerHaptic('success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm flex items-center gap-1.5">
                <span>RoldyGoldy Seller &amp; Artisan Partner Portal</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-sm border border-amber-500/30">
                  Seller Network
                </span>
              </h3>
              <p className="text-xs text-stone-400">Information &amp; Registration for Certified Jewellers &amp; Artisans</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-950/80 px-5 pt-2 border-b border-stone-800 flex gap-2">
          <button
            onClick={() => { setActiveTab('info'); triggerHaptic('light'); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'info'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            🏪 How Ad Banners Work
          </button>
          <button
            onClick={() => { setActiveTab('register'); triggerHaptic('light'); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'register'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            📝 Register as Seller / Jeweller
          </button>
          <button
            onClick={() => { setActiveTab('preview_simulator'); triggerHaptic('light'); }}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'preview_simulator'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            👁️ Preview Banner Simulator
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-stone-200">
          
          {/* TAB 1: HOW IT WORKS & SELLER APP NOTICE */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Notice Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-stone-900 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <h4 className="font-bold text-amber-200 text-sm">Customer App vs Seller App Architecture</h4>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  You are currently viewing the <strong>Customer Application</strong>, where shoppers browse jewellery, book ⚡ 20-min home trials, and view sponsored collection banners.
                </p>
                <div className="text-xs text-amber-300/90 bg-stone-950/60 p-2.5 rounded-xl border border-amber-500/20 flex items-start gap-2">
                  <Smartphone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Ad Campaigns &amp; Banner Uploads</strong> are managed exclusively through the <strong>RoldyGoldy Seller App</strong> by verified artisanal boutiques.
                  </span>
                </div>
              </div>

              {/* Seller App Benefits Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">What Sellers Do in the Seller App:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <Megaphone className="w-4 h-4" />
                      <span>Sponsor Top Banners</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Feature your shop banner on the homepage top strip, boutique spotlights, and festival flash deals.
                    </p>
                  </div>

                  <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Zap className="w-4 h-4" />
                      <span>20-Min Doorstep Concierge</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Dispatch trial boxes to nearby customers with calibrated scales and instant digital UPI billing.
                    </p>
                  </div>

                  <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs">
                      <Layers className="w-4 h-4" />
                      <span>Live Video &amp; 3D Try-On</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Upload high-res jewellery videos and AR 3D assets directly to customer product cards.
                    </p>
                  </div>

                  <div className="bg-stone-950/70 border border-stone-800 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Direct Customer Bargains</span>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Accept or counter live price negotiations from customers in real time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setActiveTab('register'); triggerHaptic('light'); }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Store className="w-4 h-4" />
                  <span>Register Your Boutique / Shop</span>
                </button>
                <button
                  onClick={() => { setActiveTab('preview_simulator'); triggerHaptic('light'); }}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs py-3 px-4 rounded-xl border border-stone-700 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Preview How Banners Appear</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SELLER / ARTISAN REGISTRATION FORM */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {isRegisteredSuccess ? (
                <div className="bg-stone-950 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-300 text-base">Registration Request Received!</h4>
                  <p className="text-xs text-stone-300 max-w-md mx-auto">
                    Thank you for applying to the <strong>RoldyGoldy Artisan Partner Network</strong>. Our onboarding team will contact <span className="text-amber-300 font-semibold">{contactPhone}</span> to verify BIS Hallmark / GST credentials and provide your <strong>Seller App Credentials</strong>.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsRegisteredSuccess(false)}
                      className="text-xs text-amber-400 hover:underline"
                    >
                      Submit Another Registration
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200">
                    📢 <strong>Seller Onboarding:</strong> Fill in your jewellery workshop or showroom details to receive instant access to the Seller App.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">Boutique / Showroom Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Sri Mahalakshmi Jewellers"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">Owner / Artisan Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Ramakrishna Varma"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">Email Address</label>
                      <input
                        type="email"
                        placeholder="jeweller@example.com"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">City / District *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Eluru, Machilipatnam, Hyderabad"
                        value={sellerCity}
                        onChange={(e) => setSellerCity(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g., 534001"
                        value={sellerPincode}
                        onChange={(e) => setSellerPincode(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">GST / BIS Hallmark License (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g., 37ABCDE1234F1Z5"
                        value={hallmarkGst}
                        onChange={(e) => setHallmarkGst(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:border-amber-500 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-300">Jewellery Craft Specialty</label>
                      <select
                        value={craftSpecialty}
                        onChange={(e) => setCraftSpecialty(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-500 outline-hidden"
                      >
                        <option value="Temple & Kundan Gold">Temple &amp; Kundan Gold</option>
                        <option value="Machilipatnam 1-Gram Polish">Machilipatnam 1-Gram Polish</option>
                        <option value="Polki & Uncut Emeralds">Polki &amp; Uncut Emeralds</option>
                        <option value="CZ & American Diamond">CZ &amp; American Diamond</option>
                        <option value="Antique Matte Bridal Sets">Antique Matte Bridal Sets</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRegistration}
                    className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmittingRegistration ? 'Submitting Application...' : 'Submit Seller Application'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: BANNER PREVIEW SIMULATOR */}
          {activeTab === 'preview_simulator' && (
            <div className="space-y-4">
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Live Customer App Preview</span>
                  </span>
                  <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full">
                    {slotType === 'home_top' ? 'Top Strip Banner' : 'Boutique Spotlight'}
                  </span>
                </div>
                
                {/* Live Banner Mockup */}
                <div className="relative overflow-hidden bg-stone-900 border border-amber-500/50 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 flex-1 z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Sponsored Artisan
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {storeName || 'Sri Lakshmi Jewellers'} ({sellerCity})
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base">
                        {simBannerTitle}
                      </h4>
                      <p className="text-xs text-stone-300 line-clamp-1">
                        {simBannerSubtitle}
                      </p>
                      <div className="pt-1">
                        <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                          <span>{simCtaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                    <img 
                      src={simSelectedImage} 
                      alt="Banner Preview" 
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-amber-500/30 shrink-0" 
                    />
                  </div>
                </div>
              </div>

              {/* Simulation Controls */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-300">Banner Headline</label>
                  <input
                    type="text"
                    value={simBannerTitle}
                    onChange={(e) => setSimBannerTitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-stone-300">Banner Subtitle / Promotional Offer</label>
                  <input
                    type="text"
                    value={simBannerSubtitle}
                    onChange={(e) => setSimBannerSubtitle(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-500 outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDeploySimulatedBanner}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-stone-950 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Display This Banner on Customer Homepage (Demo Test)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
