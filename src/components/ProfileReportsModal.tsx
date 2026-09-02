import React, { useState, useRef } from 'react';
import { 
  X, 
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
  ExternalLink,
  Camera,
  Upload,
  Sparkles,
  Check
} from 'lucide-react';
import { Order, TrialBooking, ExchangeScrapData, UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ProfileReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  orders: Order[];
  trialBookings: TrialBooking[];
  exchangeSlips: ExchangeScrapData[];
  bargainHistory: { item: string; offer: number; counter: number; date: string }[];
}

const AVATAR_PRESETS = [
  { id: 'royal_gold', label: '👑 Queen Crown', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'bridal_look', label: '🪷 Bridal Lotus', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' },
  { id: 'modern_chic', label: '💎 Minimal Gem', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80' },
  { id: 'peacock_muse', label: '🦚 Royal Muse', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
];

export const ProfileReportsModal: React.FC<ProfileReportsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  orders,
  trialBookings,
  exchangeSlips,
  bargainHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'trials' | 'exchanges' | 'bargains' | 'policies'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [phone, setPhone] = useState<string>(userProfile.phone);
  const [email, setEmail] = useState<string>(userProfile.email);
  const [address, setAddress] = useState<string>(userProfile.address);
  const [pincode, setPincode] = useState<string>(userProfile.pincode);
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile.avatarUrl || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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
    // Basic email validation
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-xl bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm">Account, Orders &amp; Reports</h3>
              <p className="text-xs text-stone-400">Manage profile, picture &amp; luxury concierge records</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="bg-stone-950/80 px-4 py-2 border-b border-stone-800 flex gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            👤 Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('trials')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'trials'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            👑 Trials ({trialBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('exchanges')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'exchanges'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            ♻️ Scrap Slips ({exchangeSlips.length})
          </button>
          <button
            onClick={() => setActiveTab('bargains')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'bargains'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            💬 Bargains ({bargainHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === 'policies'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📜 Policies
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/60 text-xs">
          
          {/* 1. PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="relative group">
                    {userProfile.avatarUrl || avatarUrl ? (
                      <img 
                        src={userProfile.avatarUrl || avatarUrl} 
                        alt={userProfile.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-lg" 
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-stone-950 font-extrabold text-xl flex items-center justify-center shadow-lg border-2 border-amber-400">
                        {(userProfile?.name || 'User').split(' ').map((n) => n[0] || '').join('').substring(0, 2).toUpperCase() || 'RG'}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setIsEditingProfile(true);
                        fileInputRef.current?.click();
                      }}
                      className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1.5 rounded-full shadow-md hover:bg-amber-400 transition-colors"
                      title="Upload New Profile Picture"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-100 text-sm flex items-center gap-1.5">
                      <span>{userProfile.name}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                        Verified Patron
                      </span>
                    </h4>
                    <p className="text-stone-400 text-xs mt-0.5">{userProfile.phone}</p>
                    <p className="text-amber-400 text-[11px] font-medium">{userProfile.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="bg-stone-800 hover:bg-stone-700 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'Close Edit' : 'Edit Profile'}</span>
                </button>
              </div>

              {isEditingProfile ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <h5 className="font-bold text-stone-200 text-xs">Edit Personal Details &amp; Picture</h5>
                    <span className="text-[10px] text-amber-400 font-medium">Auto-Updates Account State</span>
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
                        className="bg-stone-950 hover:bg-stone-800 border border-dashed border-amber-500/50 text-amber-300 px-3.5 py-2 rounded-xl font-bold text-[11px] flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Gallery</span>
                      </button>

                      <span className="text-[10.5px] text-stone-500">or pick preset:</span>
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
                          className={`cursor-pointer rounded-xl p-1 border text-center transition-all flex flex-col items-center ${
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
                    <label className="text-[11px] text-stone-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  {/* Email Editing with Dedicated Field & Error Notification */}
                  <div>
                    <label className="text-[11px] text-stone-300 font-medium block mb-1">
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
                        className="w-full bg-stone-950 border border-amber-500/40 rounded-xl pl-9 pr-3 py-2 text-stone-200 font-medium focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    {emailError && (
                      <p className="text-[10px] text-red-400 mt-1">{emailError}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Delivery Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 bg-stone-800 text-stone-300 font-bold py-2.5 rounded-xl border border-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2.5">
                  <span className="font-bold text-stone-300 text-xs uppercase tracking-wider block">
                    Saved Delivery Address &amp; Hub Profile
                  </span>
                  <p className="text-stone-300 text-xs leading-relaxed">{userProfile.address}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-amber-400 font-bold">Pincode: {userProfile.pincode}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Hub Serviceable
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-10 text-stone-400">No orders placed yet.</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div>
                        <span className="font-bold text-stone-100 font-mono">{order.id}</span>
                        <span className="text-[11px] text-stone-400 block">{order.date}</span>
                      </div>
                      <span className="text-[10.5px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <div className="font-semibold text-stone-200 text-xs truncate max-w-[200px]">{item.name}</div>
                              <span className="text-stone-400 text-[11px]">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-bold text-amber-400">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {order.exchangeDiscount > 0 && (
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20 flex justify-between">
                        <span>Trade-In Scrap Cashback Applied</span>
                        <span className="font-bold">-₹{order.exchangeDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between font-bold">
                      <span className="text-stone-300">Total Paid ({order.paymentMethod}):</span>
                      <span className="text-base text-amber-400">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. TRIALS TAB */}
          {activeTab === 'trials' && (
            <div className="space-y-3">
              {trialBookings.length === 0 ? (
                <div className="text-center py-10 text-stone-400">No trial @home appointments scheduled.</div>
              ) : (
                trialBookings.map((trial) => (
                  <div key={trial.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                      <div>
                        <span className="font-bold text-stone-100 font-mono">{trial.id}</span>
                        <span className="text-[11px] text-stone-400 block">{trial.date} · {trial.timeSlot}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {trial.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-300">
                      <strong>Items for Tryout:</strong> {trial.items.map((i) => i.name).join(', ')}
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-center">
                      <div>
                        <span className="text-[10px] text-amber-400 uppercase font-bold block">1. Delivery OTP</span>
                        <span className="font-mono text-base font-extrabold text-amber-300">{trial.deliveryOtp}</span>
                        <span className="text-[9px] text-stone-400 block">Active upon rider arrival</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">2. Return OTP</span>
                        <span className="font-mono text-xs font-semibold text-emerald-400/90 block mt-1">Unlocks after trial timeout</span>
                        <span className="text-[9px] text-stone-500 block">Generated at handover</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. EXCHANGES TAB */}
          {activeTab === 'exchanges' && (
            <div className="space-y-3">
              {exchangeSlips.length === 0 ? (
                <div className="text-center py-10 text-stone-400">No scrap jewellery trade-in slips generated yet.</div>
              ) : (
                exchangeSlips.map((slip) => {
                  const isRejected = slip.isRejected || slip.status === 'Rejected' || slip.status === 'Failed';
                  return (
                    <div 
                      key={slip.id} 
                      className={`border rounded-2xl p-4 space-y-3 ${
                        isRejected 
                          ? 'bg-red-950/20 border-red-500/40 shadow-xs' 
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
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
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

          {/* 5. BARGAINS TAB */}
          {activeTab === 'bargains' && (
            <div className="space-y-3">
              {bargainHistory.length === 0 ? (
                <div className="text-center py-10 text-stone-400">No price negotiations logged yet.</div>
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

          {/* 6. POLICIES TAB */}
          {activeTab === 'policies' && (
            <div className="space-y-3 text-stone-300 text-xs leading-relaxed">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-1.5">
                <h5 className="font-bold text-amber-400 text-xs">Terms &amp; Conditions (Trial @Home)</h5>
                <p>1. Doorstep trials are restricted to 5 km radius from the official boutique hub.</p>
                <p>2. The ₹99 trial booking covers 15–20 minutes plus 5 min grace period.</p>
                <p>3. If any jewellery item is bought, the full ₹99 is credited onto your bill.</p>
                <p>4. Delivery OTP is verified on doorstep arrival; Return OTP unlocks strictly upon trial completion / timeout for return handover.</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-1.5">
                <h5 className="font-bold text-amber-400 text-xs">Imitation / Rold Gold Scrap Exchange Policy</h5>
                <p>We accept only imitation, brass, copper, and rold gold jewellery scrap. Exchange value is appraised between ₹0.30 - ₹0.35 per gram with a 10% standard melting and wastage deduction applied as instant cart cashback.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

