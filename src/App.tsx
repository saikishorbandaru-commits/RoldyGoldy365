import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Camera, 
  MessageSquare, 
  Crown, 
  MapPin, 
  User, 
  Search, 
  Filter, 
  ShieldCheck, 
  Heart, 
  ChevronRight,
  Gift,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  X,
  Navigation
} from 'lucide-react';
import { INITIAL_PRODUCTS } from './data/products';
import { Product, CartItem, ExchangeScrapData, TrialBooking, Order, UserProfile, AdBanner, SellerAdBooking } from './types';
import { BargainModal } from './components/BargainModal';
import { LivePhotoUploadModal } from './components/LivePhotoUploadModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { TrialConciergeModal } from './components/TrialConciergeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProfileReportsModal } from './components/ProfileReportsModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailView } from './components/ProductDetailView';
import { BoutiqueView } from './components/BoutiqueView';
import { AccountView } from './components/AccountView';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { SellerAdBookingModal } from './components/SellerAdBookingModal';
import { JewelleryMartTourModal } from './components/JewelleryMartTourModal';
import { detectCurrentLocation, DetectedLocationResult } from './utils/location';

export default function App() {
  // State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [trialOnlyFilter, setTrialOnlyFilter] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'boutique' | 'cart' | 'account'>('home');
  const [isBargainModalOpen, setIsBargainModalOpen] = useState<boolean>(false);
  const [bargainTargetProduct, setBargainTargetProduct] = useState<Product | null>(null);
  const [isLivePhotoModalOpen, setIsLivePhotoModalOpen] = useState<boolean>(false);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState<boolean>(false);
  const [tryOnTargetProduct, setTryOnTargetProduct] = useState<Product | null>(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState<boolean>(false);
  const [trialTargetProduct, setTrialTargetProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState<boolean>(false);
  const [latestPlacedOrder, setLatestPlacedOrder] = useState<Order | null>(null);
  const [isProfileReportsOpen, setIsProfileReportsOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isSellerAdModalOpen, setIsSellerAdModalOpen] = useState<boolean>(false);
  const [isMartTourModalOpen, setIsMartTourModalOpen] = useState<boolean>(false);
  const [martTourTargetProduct, setMartTourTargetProduct] = useState<Product | null>(null);

  // Active Sponsored Ad Banners (Bookable by local sellers for money)
  const [adBanners, setAdBanners] = useState<AdBanner[]>([
    {
      id: 'ad-eluru-1',
      sellerName: 'Srinivas Rao',
      businessName: 'Sri Lakshmi Rold Gold Jewellers',
      city: 'Eluru',
      pincode: '534001',
      title: 'Machilipatnam 1-Gram Pure Polish Mega Mela',
      subtitle: 'Direct from verified artisans of Eluru & Machilipatnam. Up to 40% Off + Free Home Trial',
      tag: 'Verified Artisan Banner',
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
      ctaText: 'Explore Artisanal Collection',
      targetCategory: 'Bridal',
      slotType: 'home_top',
      active: true,
      clicksCount: 142,
      impressionsCount: 890,
    }
  ]);
  const [sellerAdBookings, setSellerAdBookings] = useState<SellerAdBooking[]>([]);

  // Cart & Exchange State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [exchangeVoucher, setExchangeVoucher] = useState<ExchangeScrapData | null>(null);
  
  // Dynamic Geolocation State
  const [currentLocation, setCurrentLocation] = useState<DetectedLocationResult>({
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    state: 'Telangana',
    pincode: '500101',
    formattedAddress: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad - 500101',
    hubName: 'Banjara & Jubilee Hills Flagship Hub',
    trialAtHomeAvailable: true,
    deliveryEta: '20 mins (Instant Trial & Express)',
    source: 'saved'
  });
  const [userPincode, setUserPincode] = useState<string>('500101');

  // User Data & Records
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Meera Sharma',
    phone: '+91 98765 43210',
    email: 'meera.sharma@example.com',
    address: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad',
    pincode: '500101',
  });

  // Attempt automatic detection on mount
  useEffect(() => {
    const saved = localStorage.getItem('roldygoldy_detected_location');
    if (saved) {
      try {
        const parsed: DetectedLocationResult = JSON.parse(saved);
        setCurrentLocation(parsed);
        setUserPincode(parsed.pincode);
        setUserProfile(prev => ({
          ...prev,
          address: parsed.formattedAddress,
          pincode: parsed.pincode
        }));
        return;
      } catch (e) {
        console.warn('Failed to parse saved location', e);
      }
    }

    // Auto-detect if browser supports geolocation
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      detectCurrentLocation()
        .then((loc) => {
          setCurrentLocation(loc);
          setUserPincode(loc.pincode);
          setUserProfile(prev => ({
            ...prev,
            address: loc.formattedAddress,
            pincode: loc.pincode
          }));
          showToast(`📍 Auto-Detected Location: ${loc.city} (${loc.pincode})`);
        })
        .catch((err) => {
          console.log('GPS auto-detect skipped:', err);
        });
    }
  }, []);

  const handleLocationSelected = (loc: DetectedLocationResult) => {
    setCurrentLocation(loc);
    setUserPincode(loc.pincode);
    setUserProfile(prev => ({
      ...prev,
      address: loc.formattedAddress,
      pincode: loc.pincode
    }));
    showToast(`📍 Location updated: ${loc.city} (${loc.pincode})`);
  };

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'RGORD84920',
      date: '28 May 2026',
      items: [{
        id: INITIAL_PRODUCTS[0].id,
        name: INITIAL_PRODUCTS[0].name,
        price: 3499,
        quantity: 1,
        image: INITIAL_PRODUCTS[0].image,
      }],
      subtotal: 3499,
      exchangeDiscount: 0,
      total: 3499,
      paymentMethod: 'UPI',
      status: 'Out for Delivery',
      deliveryOtp: '4812',
      address: '21-1-564, Lakdi Ka Pul, Banjara Hills, Hyderabad - 500101',
    }
  ]);

  const [trialBookings, setTrialBookings] = useState<TrialBooking[]>([
    {
      id: 'RGTR59102',
      date: '27 May, Tue',
      timeSlot: 'Evening (04:00 PM - 07:00 PM)',
      items: [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1]],
      fee: 99,
      overageMins: 0,
      status: 'Scheduled',
      deliveryOtp: '4812',
      returnOtp: '9341',
      pincode: '500101',
    }
  ]);

  const [exchangeSlips, setExchangeSlips] = useState<ExchangeScrapData[]>([]);
  const [bargainHistory, setBargainHistory] = useState<{ item: string; offer: number; counter: number; date: string }[]>([]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handlers
  const handleOpenBargain = (prod: Product) => {
    setBargainTargetProduct(prod);
    setIsBargainModalOpen(true);
  };

  const handleDealLocked = (prod: Product, lockedPrice: number) => {
    // Update product bargained price
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, bargainedPrice: lockedPrice } : p))
    );
    if (selectedProduct && selectedProduct.id === prod.id) {
      setSelectedProduct({ ...selectedProduct, bargainedPrice: lockedPrice });
    }

    // Add / Update in Cart with bargained price
    setCart((prev) => {
      const exist = prev.find((item) => item.product.id === prod.id);
      if (exist) {
        return prev.map((item) =>
          item.product.id === prod.id
            ? { ...item, customPrice: lockedPrice, isBargained: true }
            : item
        );
      }
      return [...prev, { product: prod, quantity: 1, customPrice: lockedPrice, isBargained: true }];
    });

    // Record in history
    setBargainHistory((prev) => [
      {
        item: prod.name,
        offer: lockedPrice,
        counter: lockedPrice,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      },
      ...prev,
    ]);

    showToast(`🎉 Deal locked at ₹${lockedPrice.toLocaleString('en-IN')}! Added to Cart.`);
  };

  const handleScrapValued = (data: ExchangeScrapData) => {
    setExchangeVoucher(data);
    setExchangeSlips((prev) => [data, ...prev]);
    showToast(`♻️ Instant Cashback of ₹${data.netCredit.toLocaleString('en-IN')} applied via code ${data.voucherCode}!`);
  };

  const handleAddToCart = (prod: Product, isDirectBuy = false) => {
    const activePrice = prod.bargainedPrice || prod.price;
    setCart((prev) => {
      const exist = prev.find((item) => item.product.id === prod.id);
      if (exist) {
        return prev.map((item) =>
          item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product: prod,
          quantity: 1,
          customPrice: activePrice,
          isBargained: Boolean(prod.bargainedPrice && prod.bargainedPrice < prod.price),
        },
      ];
    });

    if (isDirectBuy) {
      setIsCheckoutOpen(true);
    } else {
      setIsCartOpen(true);
      showToast(`Added ${prod.name} to Cart.`);
    }
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleConfirmTrial = (booking: TrialBooking) => {
    setTrialBookings((prev) => [booking, ...prev]);
    showToast(`👑 Trial @Home scheduled for ${booking.date} (${booking.timeSlot})!`);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setLatestPlacedOrder(newOrder);
    setCart([]);
    setExchangeVoucher(null);
    setIsOrderSuccessOpen(true);
    showToast(`🎉 Order ${newOrder.id} Booked Successfully! Doorstep delivery OTP: ${newOrder.deliveryOtp}`);
  };

  // Filtered Products
  const qLower = (searchQuery || '').toLowerCase().trim();
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesTrial = !trialOnlyFilter || Boolean(p.trialEligible);
    const matchesSearch =
      qLower === '' ||
      (p.name || '').toLowerCase().includes(qLower) ||
      (p.category || '').toLowerCase().includes(qLower) ||
      (p.metal || '').toLowerCase().includes(qLower);
    return matchesCat && matchesTrial && matchesSearch;
  });

  const totalTrialEligibleCount = products.filter((p) => p.trialEligible).length;

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 inset-x-4 sm:inset-x-auto sm:right-6 z-50 bg-amber-500 text-stone-950 px-4 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-yellow-300 animate-in fade-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col relative bg-stone-950 border-x border-stone-800/60 shadow-2xl">
        
        {/* Top Header */}
        {!selectedProduct && activeTab !== 'account' && (
          <header className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/80 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                  RoldyGoldy
                </h1>
                <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 block font-semibold">
                  Her Pride · Her Choice · Her Trust
                </span>
              </div>
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-stone-900 hover:bg-stone-800 text-stone-200 p-2 rounded-xl border border-stone-800 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </header>
        )}

        {/* Dynamic Content View */}
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onOpenBargain={handleOpenBargain}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
            onOpenTryOn={(p) => {
              setTryOnTargetProduct(p);
              setIsTryOnModalOpen(true);
            }}
            onOpenTrial={(p) => {
              setTrialTargetProduct(p);
              setIsTrialModalOpen(true);
            }}
            onOpenMartTour={(p) => {
              setMartTourTargetProduct(p);
              setIsMartTourModalOpen(true);
            }}
            onAddToCart={handleAddToCart}
            appliedExchangeVoucher={exchangeVoucher}
          />
        ) : activeTab === 'boutique' ? (
          <BoutiqueView
            onOpenTrial={(p) => {
              setTrialTargetProduct(p || products[0]);
              setIsTrialModalOpen(true);
            }}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
            onExploreProducts={() => setActiveTab('home')}
          />
        ) : activeTab === 'account' ? (
          <AccountView
            onBack={() => setActiveTab('home')}
            userProfile={userProfile}
            onUpdateProfile={(updated) => {
              setUserProfile(updated);
              showToast('Profile & picture updated successfully!');
            }}
            orders={orders}
            trialBookings={trialBookings}
            exchangeSlips={exchangeSlips}
            bargainHistory={bargainHistory}
            onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
          />
        ) : (
          <main className="flex-1 p-4 pb-24 space-y-4">
            
            {/* Pincode & Quick Bar with Live GPS status */}
            <div className="flex items-center justify-between text-xs bg-stone-900/90 border border-stone-800 rounded-2xl p-3 gap-2">
              <button 
                onClick={() => {
                  triggerHaptic('light');
                  setIsLocationModalOpen(true);
                }}
                className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-amber-400 transition-colors flex-1 min-w-0 text-left"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="text-[11px] text-stone-400 block sm:inline">Deliver to: </span>
                  <strong className="text-amber-300 font-semibold">{currentLocation.city} ({currentLocation.pincode})</strong>
                  <span className="text-[10px] text-stone-400 ml-1">▾</span>
                  {currentLocation.trialAtHomeAvailable ? (
                    <span className="ml-2 bg-emerald-500/20 text-emerald-300 font-bold text-[9.5px] px-1.5 py-0.5 rounded-sm border border-emerald-500/30">
                      ⚡ 20m Trial Hub
                    </span>
                  ) : (
                    <span className="ml-2 bg-stone-800 text-stone-400 text-[9.5px] px-1.5 py-0.5 rounded-sm border border-stone-700">
                      📦 2-Day Courier
                    </span>
                  )}
                </div>
              </button>

              <div className="flex items-center gap-2 shrink-0 pl-1">
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setIsSellerAdModalOpen(true);
                  }}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                  title="Seller App Info & Artisan Boutique Registration"
                >
                  <span>🏬 For Sellers</span>
                </button>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    setTryOnTargetProduct(products[0]);
                    setIsTryOnModalOpen(true);
                  }}
                  className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 text-xs px-1.5 py-1 rounded-lg bg-stone-950/60 border border-stone-800"
                >
                  <span>🪞 3D Try-On</span>
                </button>
              </div>
            </div>

            {/* Sponsored Seller Ad Banner (Targeted for Sellers) */}
            {adBanners.filter(b => b.active && b.slotType === 'home_top').map(banner => (
              <div 
                key={banner.id}
                className="relative overflow-hidden bg-stone-900 border border-amber-500/50 rounded-2xl p-4 shadow-lg group cursor-pointer"
                onClick={() => {
                  if (banner.targetCategory) {
                    setSelectedCategory(banner.targetCategory);
                    showToast(`📢 Exploring ${banner.businessName}'s ${banner.targetCategory} Collection`);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] bg-amber-500 text-stone-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {banner.tag} · Sponsored
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {banner.businessName} ({banner.city} · {banner.pincode})
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-stone-100 text-sm sm:text-base leading-snug line-clamp-1">
                      {banner.title}
                    </h3>
                    <p className="text-xs text-stone-300 line-clamp-1">
                      {banner.subtitle}
                    </p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-amber-400 text-xs font-bold flex items-center gap-1 group-hover:underline">
                        <span>{banner.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic('light');
                          setIsSellerAdModalOpen(true);
                        }}
                        className="text-[10.5px] text-stone-400 hover:text-amber-300 underline flex items-center gap-0.5"
                      >
                        <span>🏬 Artisan Partner Info</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-20 h-20 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-stone-800 shadow-md">
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}

            {/* Trial @Home Concierge Hero Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/40 rounded-3xl p-5 shadow-xl">
              <div className="relative z-10 max-w-sm space-y-2">
                <span className="text-[10px] bg-amber-500 text-stone-950 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Doorstep Concierge
                </span>
                <h2 className="font-serif text-xl font-bold text-stone-100">
                  Trial @Home · Try 3–4 Pieces at Your Doorstep
                </h2>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Rider delivers in 20 mins. ₹99 fee is completely waived if you keep any item!
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      setTrialTargetProduct(products[0]);
                      setIsTrialModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all"
                  >
                    Book Trial · ₹99
                  </button>
                  <button
                    onClick={() => setIsLivePhotoModalOpen(true)}
                    className="bg-stone-800 text-stone-200 hover:text-white border border-stone-700 font-bold text-xs px-3.5 py-2 rounded-xl"
                  >
                    📸 Snap Scrap
                  </button>
                </div>
              </div>

              {/* Decorative Right Image */}
              <div className="absolute right-0 top-0 bottom-0 w-36 sm:w-48 opacity-40 sm:opacity-90 pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80"
                  alt="Bridal Jewellery"
                  className="w-full h-full object-cover object-left mask-radial"
                />
              </div>
            </div>

            {/* Live Interactive Bargain & Scrap Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div 
                onClick={() => handleOpenBargain(products[0])}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-3.5 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">💬</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    Live AI
                  </span>
                </div>
                <div className="font-bold text-stone-200 group-hover:text-amber-300 transition-colors">
                  Bargain with Jeweller
                </div>
                <p className="text-[11px] text-stone-400 leading-snug">
                  Negotiate real artisanal discounts on Kundan &amp; Polki sets.
                </p>
              </div>

              <div 
                onClick={() => setIsLivePhotoModalOpen(true)}
                className="bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-3.5 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">📸</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    Instant Credit
                  </span>
                </div>
                <div className="font-bold text-stone-200 group-hover:text-emerald-300 transition-colors">
                  Snap Scrap Photo
                </div>
                <p className="text-[11px] text-stone-400 leading-snug">
                  Live camera valuation &amp; trade-in discount on cart.
                </p>
              </div>
            </div>

            {/* Search & Categories Bar */}
            <div className="space-y-2.5 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search choker, temple jhumkas, bridal polki..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Category Pills & Trial Filter */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
                <div className="flex gap-1.5 shrink-0">
                  {['All', 'Bridal', 'Temple', 'Korean', 'Daily Wear', 'Polki'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const nextVal = !trialOnlyFilter;
                    setTrialOnlyFilter(nextVal);
                    if (nextVal && selectedCategory !== 'All') {
                      // Check if current category has trial items, if not switch to All
                      const hasInCat = products.some(p => p.category === selectedCategory && p.trialEligible);
                      if (!hasInCat) {
                        setSelectedCategory('All');
                        showToast(`👑 Switched to All Collections: Showing all ${totalTrialEligibleCount} Trial@Home pieces`);
                      }
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                    trialOnlyFilter
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                      : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-300'
                  }`}
                >
                  <span>👑 Trial@Home Only ({totalTrialEligibleCount})</span>
                </button>
              </div>
            </div>

            {/* Product Catalog Grid */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-200 text-sm font-serif">Featured Collections</span>
                  {trialOnlyFilter && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                      Trial@Home Filter Active
                    </span>
                  )}
                </div>
                <span>{filteredProducts.length} Pieces</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-3">
                  <span className="text-3xl block">🔍</span>
                  <h4 className="font-serif font-bold text-stone-200 text-sm">
                    No products matching current filter criteria
                  </h4>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto">
                    {trialOnlyFilter && selectedCategory !== 'All'
                      ? `There are no Trial @Home pieces in '${selectedCategory}'. Tap below to view all ${totalTrialEligibleCount} available trial pieces.`
                      : 'Try changing your search query or resetting filters.'}
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    {selectedCategory !== 'All' && (
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="bg-amber-500 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl"
                      >
                        Show All Trial Pieces ({totalTrialEligibleCount})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setTrialOnlyFilter(false);
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="bg-stone-800 text-stone-200 font-bold text-xs px-4 py-2 rounded-xl border border-stone-700"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredProducts.map((product) => {
                    const activePrice = product.bargainedPrice || product.price;
                    const isBargained = Boolean(product.bargainedPrice && product.bargainedPrice < product.price);

                  return (
                    <div
                      key={product.id}
                      className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all flex flex-col group"
                    >
                      {/* Product Image Stage */}
                      <div 
                        onClick={() => setSelectedProduct(product)}
                        className="relative h-40 sm:h-48 overflow-hidden bg-stone-950 cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.trialEligible && (
                          <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-md">
                            Trial @Home
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTryOnTargetProduct(product);
                            setIsTryOnModalOpen(true);
                          }}
                          className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-xs border border-amber-500/30"
                        >
                          🪞 Try-On
                        </button>
                      </div>

                      {/* Content & Actions */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                        <div onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                          <h3 className="font-semibold text-stone-200 text-xs line-clamp-1 group-hover:text-amber-300 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-extrabold text-amber-400">
                              ₹{activePrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[11px] text-stone-500 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          {isBargained && (
                            <span className="text-[9.5px] text-emerald-400 font-bold block mt-0.5">
                              ✓ Bargained Price
                            </span>
                          )}
                        </div>

                        {/* Quick Bargain & Buy Buttons */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-stone-800/80">
                          <button
                            onClick={() => handleOpenBargain(product)}
                            className="flex-1 bg-stone-950 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1"
                            title="Bargain with Jeweller"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Bargain</span>
                          </button>
                          <button
                            onClick={() => handleAddToCart(product, false)}
                            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10.5px] p-1.5 px-2.5 rounded-xl transition-colors"
                            title="Add to Cart"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>

          </main>
        )}

        {/* Persistent Bottom 4-Tab Navigation */}
        {!selectedProduct && (
          <nav className="fixed bottom-0 inset-x-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 max-w-4xl mx-auto flex justify-around py-2 px-4 shadow-2xl">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('home');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">🏠</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('boutique');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'boutique' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">💎</span>
              <span>Boutique</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center gap-1 text-[11px] font-semibold text-stone-400 hover:text-stone-200 relative"
            >
              <div className="relative">
                <span className="text-base">🛒</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-stone-950 font-extrabold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span>Cart</span>
            </button>

            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('account');
              }}
              className={`flex flex-col items-center gap-1 text-[11px] font-semibold transition-colors ${
                activeTab === 'account' ? 'text-amber-400 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <span className="text-base">👤</span>
              <span>Account</span>
            </button>
          </nav>
        )}

      </div>

      {/* MODALS */}

      {/* 1. Bargain with Jeweller Modal */}
      {bargainTargetProduct && (
        <BargainModal
          product={bargainTargetProduct}
          isOpen={isBargainModalOpen}
          onClose={() => {
            setIsBargainModalOpen(false);
            setBargainTargetProduct(null);
          }}
          onDealLocked={handleDealLocked}
        />
      )}

      {/* 2. Live Photo Upload / Camera Scrap Exchange Modal */}
      {isLivePhotoModalOpen && (
        <LivePhotoUploadModal
          isOpen={isLivePhotoModalOpen}
          onClose={() => setIsLivePhotoModalOpen(false)}
          onScrapValued={handleScrapValued}
        />
      )}

      {/* 3. 3D AR Virtual Try-On Mirror Modal */}
      {tryOnTargetProduct && (
        <VirtualTryOnModal
          product={tryOnTargetProduct}
          isOpen={isTryOnModalOpen}
          onClose={() => {
            setIsTryOnModalOpen(false);
            setTryOnTargetProduct(null);
          }}
          onOpenBargain={handleOpenBargain}
          onAddToCart={handleAddToCart}
          onOpenTrial={(prod) => {
            setIsTryOnModalOpen(false);
            setTryOnTargetProduct(null);
            setTrialTargetProduct(prod);
            setIsTrialModalOpen(true);
          }}
        />
      )}

      {/* 4. Trial @Home Concierge Modal */}
      {trialTargetProduct && (
        <TrialConciergeModal
          product={trialTargetProduct}
          isOpen={isTrialModalOpen}
          userPincode={userPincode}
          onClose={() => {
            setIsTrialModalOpen(false);
            setTrialTargetProduct(null);
          }}
          onConfirmTrial={handleConfirmTrial}
        />
      )}

      {/* 5. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        exchangeVoucher={exchangeVoucher}
        onRemoveVoucher={() => setExchangeVoucher(null)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
      />

      {/* 6. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        exchangeVoucher={exchangeVoucher}
        onRemoveVoucher={() => setExchangeVoucher(null)}
        onOpenLiveScrapUpload={() => setIsLivePhotoModalOpen(true)}
        userProfile={userProfile}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* 7. Dedicated Order Booking Confirmation Screen */}
      <OrderSuccessModal
        isOpen={isOrderSuccessOpen}
        order={latestPlacedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewReports={() => {
          setIsOrderSuccessOpen(false);
          setIsProfileReportsOpen(true);
        }}
      />

      {/* 8. Profile & 4 Reports Modal */}
      <ProfileReportsModal
        isOpen={isProfileReportsOpen}
        onClose={() => setIsProfileReportsOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => {
          setUserProfile(updated);
          showToast('Profile updated successfully!');
        }}
        orders={orders}
        trialBookings={trialBookings}
        exchangeSlips={exchangeSlips}
        bargainHistory={bargainHistory}
      />

      {/* 8. Interactive GPS & Pincode Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleLocationSelected}
      />

      {/* 10. Seller Ad Slot Booking Portal Modal */}
      <SellerAdBookingModal
        isOpen={isSellerAdModalOpen}
        onClose={() => setIsSellerAdModalOpen(false)}
        defaultCity={currentLocation.city}
        defaultPincode={currentLocation.pincode}
        onAdBooked={(booking, banner) => {
          setSellerAdBookings((prev) => [booking, ...prev]);
          setAdBanners((prev) => [banner, ...prev]);
          showToast(`📢 Ad Slot Booked! "${banner.title}" is now live.`);
        }}
      />

      {/* 11. 360° Real-time Jewellery Mart Tour Modal */}
      <JewelleryMartTourModal
        isOpen={isMartTourModalOpen}
        product={martTourTargetProduct}
        onClose={() => {
          setIsMartTourModalOpen(false);
          setMartTourTargetProduct(null);
        }}
        onOpenTryOn={(prod) => {
          setMartTourTargetProduct(null);
          setIsMartTourModalOpen(false);
          setTryOnTargetProduct(prod);
          setIsTryOnModalOpen(true);
        }}
        onOpenTrial={(prod) => {
          setMartTourTargetProduct(null);
          setIsMartTourModalOpen(false);
          setTrialTargetProduct(prod);
          setIsTrialModalOpen(true);
        }}
        onAddToCart={handleAddToCart}
      />

    </div>
  );
}
