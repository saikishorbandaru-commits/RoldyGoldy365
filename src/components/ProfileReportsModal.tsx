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
  Check,
  Printer,
  CreditCard,
  Truck,
  Building,
  Tag,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { Order, TrialBooking, ExchangeScrapData, UserProfile } from '../types';
import { triggerHaptic } from '../utils/haptics';
import { OrderLiveTrackingModal } from './OrderLiveTrackingModal';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'trials' | 'exchanges' | 'bargains' | 'policies'>('orders');
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [name, setName] = useState<string>(userProfile.name);
  const [phone, setPhone] = useState<string>(userProfile.phone);
  const [email, setEmail] = useState<string>(userProfile.email);
  const [address, setAddress] = useState<string>(userProfile.address);
  const [pincode, setPincode] = useState<string>(userProfile.pincode);
  const [avatarUrl, setAvatarUrl] = useState<string>(userProfile.avatarUrl || '');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[94vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        
        {/* Header */}
        <div className="bg-stone-950 px-5 py-3.5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-100 text-sm">Account &amp; Comprehensive Transaction Reports</h3>
              <p className="text-xs text-stone-400">Order invoices, doorstep trials, trade-in audit slips &amp; customer dossier</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-950/70 border-b border-stone-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: `Orders & Invoices (${orders.length})`, icon: Package },
            { id: 'profile', label: 'User Profile & Address', icon: User },
            { id: 'trials', label: `Trial@Home (${trialBookings.length})`, icon: Crown },
            { id: 'exchanges', label: `Scrap Exchange (${exchangeSlips.length})`, icon: RefreshCw },
            { id: 'bargains', label: `Bargain Logs (${bargainHistory.length})`, icon: MessageSquare },
            { id: 'policies', label: 'Terms & Policies', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveTab(tab.id as any);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-950/50">

          {/* 1. ORDERS TAB (COMPREHENSIVE FINANCIAL & PRODUCT DOSSIER) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <Package className="w-10 h-10 mx-auto text-stone-600 mb-2 opacity-50" />
                  <p className="font-semibold text-stone-300">No orders placed yet.</p>
                  <p className="text-xs text-stone-500 mt-1">Place an order with exchange scrap discount or doorstep delivery to view complete records.</p>
                </div>
              ) : (
                orders.map((order) => {
                  const itemsCount = order.items.reduce((acc, i) => acc + i.quantity, 0);
                  return (
                    <div key={order.id} className="bg-stone-900 border border-stone-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
                      
                      {/* Order Header & Status Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-100 text-sm">{order.id}</span>
                            <span className="text-[10px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded font-mono">
                              {order.invoiceNumber || `INV-${order.id}`}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400">
                            <strong>Date Placed:</strong> {order.date} {order.time ? `at ${order.time}` : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {order.status === 'Delivered' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Truck className="w-3.5 h-3.5 text-amber-400" />}
                            <span>{order.status}</span>
                          </span>
                        </div>
                      </div>

                      {/* Live GPS Logistics & Rider Tracking Preview Card */}
                      <div className="bg-stone-950 border border-amber-500/30 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                              <Navigation className="w-3.5 h-3.5 text-amber-400" /> Live Express Transit Status
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              triggerHaptic('light');
                              setTrackingOrder(order);
                            }}
                            className="text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold px-2.5 py-1 rounded-lg border border-amber-500/40 flex items-center gap-1 transition-all"
                          >
                            <Truck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Track Live GPS &amp; Route</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                          <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-500 block">Current Stage:</span>
                            <strong className="text-stone-200 text-xs">{order.status}</strong>
                          </div>
                          <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-500 block">Estimated Arrival:</span>
                            <strong className="text-amber-400 text-xs">{order.status === 'Delivered' ? 'Delivered' : 'Today in 25–35 mins'}</strong>
                          </div>
                          <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                            <span className="text-[10px] text-stone-500 block">Doorstep Verification OTP:</span>
                            <strong className="font-mono text-amber-300 text-xs bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">{order.deliveryOtp}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Customer & Delivery Dossier */}
                      <div className="bg-stone-950/80 border border-stone-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                        <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block flex items-center gap-1">
                          <User className="w-3 h-3" /> Customer &amp; Destination Details
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-300">
                          <div>
                            <span className="text-stone-500 text-[11px]">Recipient Name: </span>
                            <strong className="text-stone-200">{order.customerName || userProfile.name}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[11px]">Contact Phone: </span>
                            <strong className="text-stone-200">{order.customerPhone || userProfile.phone}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[11px]">Email ID: </span>
                            <strong className="text-stone-200">{order.customerEmail || userProfile.email}</strong>
                          </div>
                          <div>
                            <span className="text-stone-500 text-[11px]">Delivery OTP: </span>
                            <span className="font-mono bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded">
                              {order.deliveryOtp}
                            </span>
                          </div>
                        </div>
                        <div className="pt-1 text-stone-300 border-t border-stone-900 flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span><strong>Shipping Address:</strong> {order.address || userProfile.address} (Pincode: {order.pincode || userProfile.pincode})</span>
                        </div>
                      </div>

                      {/* Purchased Products Detailed Breakdown */}
                      <div className="space-y-2">
                        <span className="font-bold text-stone-300 text-xs uppercase tracking-wider block">
                          Purchased Jewellery Pieces ({itemsCount} Item{itemsCount > 1 ? 's' : ''})
                        </span>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="bg-stone-950 p-3 rounded-xl border border-stone-800/60 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-stone-800 shrink-0" />
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-stone-100 text-xs">{item.name}</div>
                                  <div className="text-[11px] text-stone-400 flex flex-wrap gap-x-2">
                                    {item.category && <span>Category: {item.category}</span>}
                                    {item.metal && <span>· Metal: {item.metal}</span>}
                                    {item.grossWeight && <span>· Weight: {item.grossWeight}</span>}
                                  </div>
                                  {item.partnerSeller && (
                                    <div className="text-[10px] text-amber-400/90 font-medium">
                                      Guild Artisan: {item.partnerSeller.businessName} ({item.partnerSeller.city})
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="font-bold text-amber-400 text-xs">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                <span className="text-[10px] text-stone-400">₹{item.price.toLocaleString('en-IN')} &times; {item.quantity}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Financial & Transaction Breakdown */}
                      <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-2 text-xs">
                        <span className="font-bold text-stone-300 uppercase tracking-wider text-[10px] block">
                          Financial Breakdown &amp; Transaction Details
                        </span>

                        <div className="space-y-1.5 text-stone-300">
                          <div className="flex justify-between">
                            <span className="text-stone-400">Items Gross Subtotal:</span>
                            <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                          </div>

                          {/* Scrap Exchange Trade-In Value (If Opted) */}
                          {order.exchangeDiscount > 0 && (
                            <div className="flex justify-between text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-500/20">
                              <div className="space-y-0.5">
                                <span className="font-bold flex items-center gap-1">
                                  <RefreshCw className="w-3 h-3" /> Old Scrap Exchange Value:
                                </span>
                                {order.exchangeVoucherDetails && (
                                  <span className="text-[10px] text-emerald-300 block">
                                    {order.exchangeVoucherDetails.grams}g {order.exchangeVoucherDetails.metalType} (Voucher: {order.exchangeVoucherDetails.code})
                                  </span>
                                )}
                              </div>
                              <span className="font-bold font-mono">-₹{order.exchangeDiscount.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {/* Trial @ Home Value (If Opted) */}
                          {order.trialAtHomeValue !== undefined && order.trialAtHomeValue > 0 && (
                            <div className="flex justify-between text-amber-300 bg-amber-950/20 px-2 py-1 rounded-md border border-amber-500/20">
                              <span>Trial@Home Concierge Adjustment:</span>
                              <span className="font-bold">₹{order.trialAtHomeValue.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {/* Delivery Fee */}
                          <div className="flex justify-between">
                            <span className="text-stone-400">Doorstep Insured Express Delivery:</span>
                            <span className="text-emerald-400 font-semibold">
                              {order.deliveryFee && order.deliveryFee > 0 ? `₹${order.deliveryFee}` : '₹0 (Free Festive Delivery)'}
                            </span>
                          </div>

                          {/* Tax GST */}
                          {order.taxGst !== undefined && order.taxGst > 0 && (
                            <div className="flex justify-between text-stone-400">
                              <span>GST / Hallmark Luxury Tax (3% included):</span>
                              <span>₹{order.taxGst.toLocaleString('en-IN')}</span>
                            </div>
                          )}

                          {/* Net Paid Amount */}
                          <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm font-bold">
                            <span className="text-stone-100">Total Paid Amount:</span>
                            <span className="text-amber-400 font-mono text-base">₹{order.total.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        {/* Transaction ID & Payment Method */}
                        <div className="pt-2 border-t border-stone-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-400">
                          <div>
                            <span>Payment Method: </span>
                            <strong className="text-stone-200">{order.paymentMethod}</strong>
                          </div>
                          <div>
                            <span>Transaction Reference ID: </span>
                            <strong className="text-stone-200 font-mono">{order.paymentTransactionId || `TXN-UPI-${order.id.slice(2)}`}</strong>
                          </div>
                          <div>
                            <span>Courier Partner: </span>
                            <strong className="text-stone-200">{order.courierPartner || 'Roldy Goldy Concierge Transit'}</strong>
                          </div>
                          <div>
                            <span>Insurance Policy No: </span>
                            <strong className="text-stone-200 font-mono">{order.insurancePolicyNumber || `ICICI-LOMBARD-JWL-${order.id.slice(2)}`}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Action Button: View / Print Invoice & Live Tracking */}
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            setTrackingOrder(order);
                          }}
                          className="bg-stone-950 hover:bg-stone-800 text-stone-200 font-semibold text-xs px-3.5 py-2 rounded-xl border border-stone-700 flex items-center gap-1.5 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Track Live Delivery</span>
                        </button>
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            setSelectedInvoiceOrder(order);
                          }}
                          className="bg-stone-950 hover:bg-stone-800 text-amber-300 font-semibold text-xs px-3.5 py-2 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                          <span>Print / View Formal Tax Invoice</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 2. USER PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt="User Avatar"
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-400/60 shadow-lg"
                    />
                    <div>
                      <h4 className="font-bold text-stone-100 text-sm">{userProfile.name}</h4>
                      <p className="text-xs text-amber-400 font-medium">Gold Heritage Member</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="bg-stone-950 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isEditingProfile ? 'Close' : 'Edit Profile'}</span>
                  </button>
                </div>

                {isEditingProfile ? (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-300 font-medium block mb-1">Email Address (Editable)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError(null);
                        }}
                        className="w-full bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-2 text-stone-200 focus:outline-hidden focus:border-amber-400"
                      />
                      {emailError && <p className="text-[10px] text-red-400 mt-1">{emailError}</p>}
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

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 bg-stone-800 text-stone-300 font-bold py-2 rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs text-stone-300">
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-500">Contact Phone:</span>
                      <strong className="text-stone-200">{userProfile.phone}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800/60">
                      <span className="text-stone-500">Email:</span>
                      <strong className="text-stone-200">{userProfile.email}</strong>
                    </div>
                    <div className="py-1">
                      <span className="text-stone-500 block mb-0.5">Primary Delivery Address:</span>
                      <p className="text-stone-200">{userProfile.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-amber-400 font-bold">Pincode: {userProfile.pincode}</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                          Verified Concierge Hub
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                        <span className="text-[9px] text-stone-400 block">Verified upon rider arrival</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">2. Return OTP</span>
                        <span className="font-mono text-xs font-semibold text-emerald-400/90 block mt-1">Provided upon handover</span>
                        <span className="text-[9px] text-stone-500 block">Generated after trial</span>
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
                <p className="text-amber-300/80">⚠️ Notice: All exchange appraisals are verified physically by certified riders with calibrated scales &amp; acid testing before product handover.</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Formal Tax Invoice Modal Dialog */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 p-3 sm:p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-stone-950 border border-amber-500/50 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl text-stone-200 text-xs max-h-[92vh] overflow-y-auto">
            
            {/* Invoice Official Letterhead */}
            <div className="flex justify-between items-start border-b border-amber-500/30 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h4 className="font-extrabold text-amber-400 text-base tracking-wide">ROLDY GOLDY HERITAGE ATELIER</h4>
                </div>
                <p className="text-[11px] text-stone-400">Official Luxury Jeweller &amp; Doorstep Concierge</p>
                <div className="flex flex-wrap gap-x-3 text-[10px] text-stone-400 mt-0.5">
                  <span><strong>GSTIN:</strong> 37AAECR1029K1Z4</span>
                  <span><strong>BIS Hallmark Lic:</strong> HM/2026/0912</span>
                  <span><strong>HSN:</strong> 71131930 / 7117</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 text-stone-300 hover:text-white flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invoice Meta Dossier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-900/90 border border-stone-800 p-3.5 rounded-2xl text-[11px]">
              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">Bill To / Ship To:</span>
                <p className="font-bold text-stone-100 text-xs">{selectedInvoiceOrder.customerName || userProfile.name}</p>
                <p className="text-stone-300">{selectedInvoiceOrder.address || userProfile.address}</p>
                <p className="text-stone-400">Pincode: {selectedInvoiceOrder.pincode || userProfile.pincode}</p>
                <p className="text-stone-400">Phone: {selectedInvoiceOrder.customerPhone || userProfile.phone}</p>
                <p className="text-stone-400">Email: {selectedInvoiceOrder.customerEmail || userProfile.email}</p>
                <div className="pt-1">
                  <span className="text-stone-400">Delivery Security OTP: </span>
                  <span className="font-mono bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                    {selectedInvoiceOrder.deliveryOtp}
                  </span>
                </div>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-stone-800 pt-2 sm:pt-0 sm:pl-3">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold block">Tax Invoice Reference:</span>
                <p className="font-mono font-bold text-stone-100">{selectedInvoiceOrder.invoiceNumber || `INV-RG-2026-${selectedInvoiceOrder.id.slice(2)}`}</p>
                <p className="text-stone-400">Order ID: <span className="font-mono text-stone-300">{selectedInvoiceOrder.id}</span></p>
                <p className="text-stone-400">Transaction Date: <strong className="text-stone-200">{selectedInvoiceOrder.date} {selectedInvoiceOrder.time ? `at ${selectedInvoiceOrder.time}` : ''}</strong></p>
                <p className="text-stone-400">Payment Mode: <strong className="text-stone-200">{selectedInvoiceOrder.paymentMethod}</strong></p>
                <p className="text-stone-400">Payment Ref ID: <strong className="font-mono text-stone-200">{selectedInvoiceOrder.paymentTransactionId || `TXN-UPI-${selectedInvoiceOrder.id.slice(2)}`}</strong></p>
                <p className="text-stone-400">Transit Insurance: <span className="font-mono text-stone-300">{selectedInvoiceOrder.insurancePolicyNumber || 'ICICI-LOMBARD-JWL'}</span></p>
              </div>
            </div>

            {/* Itemized Products Table */}
            <div className="space-y-2">
              <span className="font-bold text-stone-300 uppercase tracking-wider text-[10px] block">
                Itemized Jewellery Purchases
              </span>
              <div className="border border-stone-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900 text-stone-400 text-[10.5px] border-b border-stone-800">
                    <tr>
                      <th className="py-2 px-3">Item &amp; Specifications</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Unit Rate</th>
                      <th className="py-2 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-900 bg-stone-950/60">
                    {selectedInvoiceOrder.items.map((it) => (
                      <tr key={it.id} className="text-stone-300">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <img src={it.image} alt={it.name} className="w-9 h-9 rounded-lg object-cover border border-stone-800 shrink-0" />
                            <div>
                              <div className="font-semibold text-stone-100">{it.name}</div>
                              <div className="text-[10px] text-stone-400">
                                {it.metal || '22K Rold Gold'} · {it.grossWeight || 'Standard'} {it.stone ? `· ${it.stone}` : ''}
                              </div>
                              {it.partnerSeller && (
                                <div className="text-[9.5px] text-amber-400/90 font-medium">
                                  Artisan: {it.partnerSeller.businessName} ({it.partnerSeller.city})
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-400">₹{it.price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-100">₹{(it.price * it.quantity).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3.5 space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-400">Items Gross Value:</span>
                <span className="font-mono">₹{selectedInvoiceOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {selectedInvoiceOrder.exchangeDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <div>
                    <span className="font-bold flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Scrap Exchange Trade-In Credit:
                    </span>
                    {selectedInvoiceOrder.exchangeVoucherDetails && (
                      <span className="text-[10px] text-emerald-300 block">
                        {selectedInvoiceOrder.exchangeVoucherDetails.grams}g {selectedInvoiceOrder.exchangeVoucherDetails.metalType} (Voucher: {selectedInvoiceOrder.exchangeVoucherDetails.code})
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold">-₹{selectedInvoiceOrder.exchangeDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {selectedInvoiceOrder.taxGst !== undefined && selectedInvoiceOrder.taxGst > 0 && (
                <div className="flex justify-between text-stone-400">
                  <span>GST / Hallmark Luxury Tax (3%):</span>
                  <span className="font-mono">₹{selectedInvoiceOrder.taxGst.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-stone-400">Doorstep Insured Express Delivery:</span>
                <span className="text-emerald-400 font-semibold">
                  {selectedInvoiceOrder.deliveryFee && selectedInvoiceOrder.deliveryFee > 0 ? `₹${selectedInvoiceOrder.deliveryFee}` : '₹0 (Free Compliments)'}
                </span>
              </div>

              <div className="flex justify-between pt-2 text-sm font-extrabold text-amber-400 border-t border-stone-800">
                <span>Net Payable Amount:</span>
                <span className="font-mono text-base">₹{selectedInvoiceOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Official Seal & Signature */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[10px] text-stone-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% BIS Hallmarked &amp; 7-Day Doorstep Replacement Guarantee</span>
              </div>
              <div className="text-right">
                <span className="font-serif italic text-amber-400 font-bold block">Roldy Goldy Atelier</span>
                <span className="text-[9px] text-stone-500">Authorized Signatory</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  window.print();
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="flex-1 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 font-bold py-2.5 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Live Order Tracking Modal */}
      {trackingOrder && (
        <OrderLiveTrackingModal
          order={trackingOrder}
          isOpen={Boolean(trackingOrder)}
          onClose={() => setTrackingOrder(null)}
          onViewInvoice={(ord) => {
            setTrackingOrder(null);
            setSelectedInvoiceOrder(ord);
          }}
        />
      )}
    </div>
  );
};
