import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Package, 
  Crown, 
  RefreshCw, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Edit3,
  Camera,
  Upload,
  Sparkles,
  Check,
  ChevronRight,
  Clock,
  ExternalLink,
  Info
} from 'lucide-react';
import { Order, TrialBooking, ExchangeScrapData, UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface AccountViewProps {
  onBack: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  orders: Order[];
  trialBookings: TrialBooking[];
  exchangeSlips: ExchangeScrapData[];
  bargainHistory: { item: string; offer: number; counter: number; date: string }[];
  onOpenLiveScrapUpload?: () => void;
}

const AVATAR_PRESETS = [
  { id: 'royal_gold', label: '👑 Queen Crown', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'bridal_look', label: '🪷 Bridal Lotus', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { id: 'modern_chic', label: '💎 Minimal Gem', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  { id: 'peacock_muse', label: '🦚 Royal Muse', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
];

export const AccountView: React.FC<AccountViewProps> = ({
  onBack,
  userProfile,
  onUpdateProfile,
  orders,
  trialBookings,
  exchangeSlips,
  bargainHistory,
  onOpenLiveScrapUpload,
}) => {
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'orders' | 'trials' | 'exchanges' | 'bargains' | 'policies'>('main');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [phone, setPhone] = useState<string>(userProfile.phone);
  const [email, setEmail] = useState<string>(userProfile.email);
  const [address, setAddress] = useState<string>(userProfile.address);
  const [pincode, setPincode] = useState<string>(userProfile.pincode);
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile.avatarUrl || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    setName(userProfile.name);
    setPhone(userProfile.phone);
    setEmail(userProfile.email);
    setAddress(userProfile.address);
    setPincode(userProfile.pincode);
    setAvatarUrl(userProfile.avatarUrl || '');
  }, [userProfile]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        triggerHaptic('success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError(null);

    onUpdateProfile({
      name: name.trim() || userProfile.name,
      phone: phone.trim() || userProfile.phone,
      email: email.trim(),
      address: address.trim() || userProfile.address,
      pincode: pincode.trim() || userProfile.pincode,
      avatarUrl: avatarUrl || userProfile.avatarUrl,
    });
    setIsEditingProfile(false);
    triggerHaptic('success');
  };

  const handleNavClick = (section: typeof activeSection) => {
    triggerHaptic('light');
    setActiveSection(section);
  };

  const handleBackToMain = () => {
    triggerHaptic('light');
    setActiveSection('main');
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-950 min-h-[calc(100vh-60px)] pb-24 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md px-4 py-3.5 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerHaptic('light');
              if (activeSection !== 'main') {
                setActiveSection('main');
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-400 border border-stone-800 transition-all text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>{activeSection === 'main' ? 'Back to Boutique' : 'Back to Account'}</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-100 text-sm">
                {activeSection === 'main' && 'My Account & Reports'}
                {activeSection === 'profile' && 'Personal Profile'}
                {activeSection === 'orders' && 'Orders & Invoices'}
                {activeSection === 'trials' && 'Trial @Home Appointments'}
                {activeSection === 'exchanges' && 'Scrap Exchange Slips'}
                {activeSection === 'bargains' && 'Bargaining History'}
                {activeSection === 'policies' && 'Boutique Policies & Terms'}
              </h2>
              <p className="text-[10px] text-stone-400">
                {activeSection === 'main' ? 'Overview & all concierge records' : 'Her Pride · Her Choice · Her Trust'}
              </p>
            </div>
          </div>
        </div>

        {activeSection !== 'main' && (
          <button
            onClick={handleBackToMain}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg"
          >
            Overview
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 max-w-2xl mx-auto w-full space-y-4">
        
        {/* ======================================================== */}
        {/* 1. MAIN OVERVIEW HUB (No side-scrolling required!)      */}
        {/* ======================================================== */}
        {activeSection === 'main' && (
          <div className="space-y-4">
            
            {/* Patron Profile Summary Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="relative group shrink-0">
                    {userProfile.avatarUrl || avatarUrl ? (
                      <img 
                        src={userProfile.avatarUrl || avatarUrl} 
                        alt={userProfile.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-xl" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-amber-400">
                        {(userProfile?.name || 'User').split(' ').map((n) => n[0] || '').join('').substring(0, 2).toUpperCase() || 'RG'}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setIsEditingProfile(true);
                      }}
                      className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1.5 rounded-full shadow-md hover:bg-amber-400 transition-colors"
                      title="Edit Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-stone-100 text-base truncate">{userProfile.name}</h3>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-400" /> Verified Patron
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs mt-0.5">{userProfile.phone}</p>
                    <p className="text-amber-400 text-xs font-medium truncate">{userProfile.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavClick('profile')}
                  className="bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manage</span>
                </button>
              </div>

              {/* Delivery Address Pill */}
              <div className="mt-3.5 pt-3 border-t border-stone-800/80 flex items-start gap-2 text-xs text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="text-[11px] text-stone-400 font-semibold block">Primary Delivery Hub Address</span>
                  <p className="text-xs text-stone-200 leading-snug line-clamp-1">{userProfile.address}</p>
                  <p className="text-[11px] text-amber-300 font-medium">PIN: {userProfile.pincode}</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics & Reports Grid (All 4 Core Reports + Terms) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <span className="font-bold text-stone-200 text-sm font-serif">Reports &amp; Activity Hub</span>
                <span>Select to view details</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* 1. Orders Card */}
                <div
                  onClick={() => handleNavClick('orders')}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-stone-850 flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-200 text-sm group-hover:text-amber-400 transition-colors">
                        Orders &amp; Bills
                      </div>
                      <p className="text-xs text-stone-400">
                        {orders.length} order(s) placed
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>

                {/* 2. Trial @Home Appointments Card */}
                <div
                  onClick={() => handleNavClick('trials')}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-stone-850 flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-200 text-sm group-hover:text-amber-400 transition-colors">
                        Trial @Home Records
                      </div>
                      <p className="text-xs text-stone-400">
                        {trialBookings.length} booking(s) · OTPs
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>

                {/* 3. Scrap Exchange Slips Card */}
                <div
                  onClick={() => handleNavClick('exchanges')}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-stone-850 flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-lg">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-200 text-sm group-hover:text-amber-400 transition-colors">
                        Scrap Trade-in Slips
                      </div>
                      <p className="text-xs text-stone-400">
                        {exchangeSlips.length} appraisal voucher(s)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>

                {/* 4. Bargaining Deals Card */}
                <div
                  onClick={() => handleNavClick('bargains')}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-stone-850 flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-200 text-sm group-hover:text-amber-400 transition-colors">
                        Bargaining Negotiations
                      </div>
                      <p className="text-xs text-stone-400">
                        {bargainHistory.length} negotiated deal(s)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </div>

              </div>
            </div>

            {/* Quick Actions & Policies Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => handleNavClick('policies')}
                className="bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-2xl p-3.5 cursor-pointer flex items-center justify-between text-xs text-stone-300"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-stone-200">Boutique Policies &amp; ₹99 Trial Terms</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </div>

              {onOpenLiveScrapUpload && (
                <div
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenLiveScrapUpload();
                  }}
                  className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-3.5 cursor-pointer flex items-center justify-between text-xs text-stone-300"
                >
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">Live Scrap Photo Appraisal</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    Snap Now
                  </span>
                </div>
              )}
            </div>

            {/* Trust Assurance Footer Box */}
            <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-stone-400">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <p>
                All doorstep trials, live bargains, and scrap exchange vouchers are backed by the RoldyGoldy artisan guarantee.
              </p>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PROFILE EDIT & DETAILS SECTION                         */}
        {/* ======================================================== */}
        {activeSection === 'profile' && (
          <div className="space-y-4">
            
            {/* Header with quick back */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Information'}</span>
              </button>
            </div>

            {isEditingProfile ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h4 className="font-bold text-stone-200 text-sm">Edit Personal Profile &amp; Picture</h4>
                  <span className="text-[10px] text-amber-400 font-medium">Synchronizes with Orders</span>
                </div>

                {/* Profile Picture Upload & Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] text-stone-300 font-semibold flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Choose Profile Picture / Avatar</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-stone-950 hover:bg-stone-800 border border-dashed border-amber-500/50 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Gallery</span>
                    </button>

                    <span className="text-xs text-stone-500">or pick avatar:</span>
                  </div>

                  {/* Presets Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {AVATAR_PRESETS.map((preset) => (
                      <div
                        key={preset.id}
                        onClick={() => {
                          triggerHaptic('light');
                          setAvatarUrl(preset.url);
                        }}
                        className={`cursor-pointer rounded-xl p-1.5 border text-center transition-all flex flex-col items-center ${
                          avatarUrl === preset.url
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/40'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-10 h-10 rounded-full object-cover mb-1" />
                        <span className="text-[9.5px] text-stone-300 font-medium truncate w-full">{preset.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 text-sm focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                {/* Email Editing with Dedicated Field & Validation */}
                <div>
                  <label className="text-xs text-stone-300 font-medium block mb-1">
                    Email Address (Editable)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="e.g. b.saikishor365@gmail.com"
                      className="w-full bg-stone-950 border border-amber-500/40 rounded-xl pl-9 pr-3 py-2 text-stone-200 text-sm font-medium focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-400 mt-1">{emailError}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 text-sm focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-stone-400 block mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 text-sm focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-stone-400 block mb-1">Delivery Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 text-sm focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 bg-stone-800 text-stone-300 font-bold py-2.5 rounded-xl border border-stone-700 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-4 border-b border-stone-800 pb-4">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-extrabold text-2xl flex items-center justify-center shadow-lg border-2 border-amber-400">
                      {(userProfile?.name || 'User').split(' ').map((n) => n[0] || '').join('').substring(0, 2).toUpperCase() || 'RG'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-stone-100 text-base">{userProfile.name}</h3>
                    <p className="text-stone-400 text-xs">{userProfile.phone}</p>
                    <p className="text-amber-400 text-xs font-medium">{userProfile.email}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-stone-400 text-[11px] block font-medium">Saved Delivery Address</span>
                    <p className="text-stone-200 text-sm mt-0.5">{userProfile.address}</p>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[11px] block font-medium">Pincode</span>
                    <p className="text-amber-300 font-bold text-sm mt-0.5">{userProfile.pincode}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* 3. ORDERS & BILLS SECTION                                 */}
        {/* ======================================================== */}
        {activeSection === 'orders' && (
          <div className="space-y-3">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Overview</span>
            </button>

            {orders.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <Package className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="font-bold text-stone-300 text-sm">No Orders Placed Yet</h4>
                <p className="text-xs text-stone-500">Your purchased jewellery items and tax invoices will appear here.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div>
                      <span className="font-bold text-stone-100 font-mono text-xs">{order.id}</span>
                      <span className="text-[11px] text-stone-400 block">{order.date}</span>
                    </div>
                    <span className="text-[10.5px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img src={item.image} alt={item.name} className="w-11 h-11 rounded-xl object-cover border border-stone-800" />
                          <div>
                            <div className="font-semibold text-stone-200 text-xs truncate max-w-[220px]">{item.name}</div>
                            <span className="text-stone-400 text-[11px]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-amber-400 text-xs">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {order.exchangeDiscount > 0 && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20 flex justify-between">
                      <span>Trade-In Scrap Cashback Applied</span>
                      <span className="font-bold">-₹{order.exchangeDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between font-bold text-xs">
                    <span className="text-stone-300">Total Paid ({order.paymentMethod}):</span>
                    <span className="text-base text-amber-400">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. TRIAL @HOME SECTION                                    */}
        {/* ======================================================== */}
        {activeSection === 'trials' && (
          <div className="space-y-3">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Overview</span>
            </button>

            {trialBookings.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <Sparkles className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="font-bold text-stone-300 text-sm">No Trial Appointments Scheduled</h4>
                <p className="text-xs text-stone-500">Book a 20-min doorstep trial to try jewellery before buying.</p>
              </div>
            ) : (
              trialBookings.map((trial) => (
                <div key={trial.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div>
                      <span className="font-bold text-stone-100 font-mono text-xs">{trial.id}</span>
                      <span className="text-[11px] text-stone-400 block">{trial.date} · {trial.timeSlot}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      {trial.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-300">
                    <strong>Items for Tryout:</strong> {trial.items.map((i) => i.name).join(', ')}
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-950 p-3 rounded-xl border border-stone-800 text-center">
                    <div>
                      <span className="text-[10px] text-amber-400 uppercase font-bold block">1. Delivery OTP</span>
                      <span className="font-mono text-lg font-extrabold text-amber-300">{trial.deliveryOtp}</span>
                      <span className="text-[9.5px] text-stone-400 block">Give to rider upon arrival</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold block">2. Return OTP</span>
                      <span className="font-mono text-xs font-semibold text-emerald-400/90 block mt-1">Unlocks after trial</span>
                      <span className="text-[9.5px] text-stone-500 block">Generated at return handover</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. SCRAP EXCHANGE SECTION                                 */}
        {/* ======================================================== */}
        {activeSection === 'exchanges' && (
          <div className="space-y-3">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Overview</span>
            </button>

            {exchangeSlips.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <RefreshCw className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="font-bold text-stone-300 text-sm">No Scrap Exchange Slips</h4>
                <p className="text-xs text-stone-500">Snap a live photo of your old rold gold/imitation pieces to get instant cashback.</p>
              </div>
            ) : (
              exchangeSlips.map((slip) => {
                const isRejected = slip.isRejected || slip.status === 'Rejected' || slip.status === 'Failed';
                return (
                  <div 
                    key={slip.id} 
                    className={`border rounded-2xl p-4 space-y-3 ${
                      isRejected 
                        ? 'bg-red-950/20 border-red-500/40' 
                        : 'bg-stone-900 border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-100 font-mono text-xs">{slip.voucherCode}</span>
                          {isRejected && (
                            <span className="text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                              REJECTED
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 block mt-0.5">{slip.date}</span>
                      </div>
                      
                      {isRejected ? (
                        <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2.5 py-1 rounded-md border border-red-500/30">
                          ₹0 (Declined)
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-md border border-emerald-500/30">
                          Cashback: ₹{slip.netCredit.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 items-start">
                      {slip.livePhotoUrl && (
                        <img 
                          src={slip.livePhotoUrl} 
                          alt="Scrap capture" 
                          className={`w-14 h-14 rounded-xl object-cover shrink-0 ${
                            isRejected ? 'border border-red-500/50 grayscale' : 'border border-amber-500/30'
                          }`} 
                        />
                      )}
                      <div className="space-y-1">
                        <div className="font-semibold text-stone-200 text-xs">{slip.description}</div>
                        <p className="text-[11px] text-stone-400">{slip.grams}g · {slip.metalType}</p>
                        {isRejected && slip.rejectionReason && (
                          <div className="p-2 bg-red-950/60 border border-red-500/30 rounded-lg text-[10.5px] text-red-200 mt-1">
                            <strong>Audit Note:</strong> {slip.rejectionReason}
                          </div>
                        )}
                        {!isRejected && slip.notes && (
                          <p className="text-[10.5px] text-stone-400 italic">{slip.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. BARGAINING HISTORY SECTION                             */}
        {/* ======================================================== */}
        {activeSection === 'bargains' && (
          <div className="space-y-3">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Overview</span>
            </button>

            {bargainHistory.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-10 text-center space-y-2">
                <MessageSquare className="w-10 h-10 text-stone-600 mx-auto" />
                <h4 className="font-bold text-stone-300 text-sm">No Bargaining History Yet</h4>
                <p className="text-xs text-stone-500">Tap "Bargain with Jeweller" on any piece to negotiate custom pricing.</p>
              </div>
            ) : (
              bargainHistory.map((b, idx) => (
                <div key={idx} className="bg-stone-900 border border-stone-800 rounded-2xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 text-xs">{b.item}</span>
                    <span className="text-[10px] text-stone-400">{b.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span>Your Proposed Bid: ₹{b.offer.toLocaleString('en-IN')}</span>
                    <span>&rarr;</span>
                    <span className="text-emerald-400 font-bold">Deal Locked: ₹{b.counter.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. POLICIES & TERMS SECTION                               */}
        {/* ======================================================== */}
        {activeSection === 'policies' && (
          <div className="space-y-3 text-stone-300 text-xs leading-relaxed">
            <button
              onClick={handleBackToMain}
              className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-amber-400 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Account Overview</span>
            </button>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Terms &amp; Conditions (Trial @Home)</span>
              </h5>
              <p>1. Doorstep trials are available within designated boutique hub pincodes (e.g. Eluru 534001, Vijayawada 520001, Hyderabad 500001, Visakhapatnam 530001).</p>
              <p>2. The ₹99 trial booking covers 15–20 minutes plus 5 min grace period.</p>
              <p>3. If any jewellery item is bought, the full ₹99 is credited onto your final bill.</p>
              <p>4. Delivery OTP is verified on doorstep arrival; Return OTP unlocks strictly upon trial completion / timeout for return handover.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2">
              <h5 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Imitation / Rold Gold Scrap Exchange Policy</span>
              </h5>
              <p>We accept imitation, brass, copper, and rold gold jewellery scrap. Exchange value is appraised between ₹0.30 - ₹0.35 per gram with a 10% standard melting and wastage deduction applied as instant cart cashback.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
