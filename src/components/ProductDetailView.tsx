import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MessageSquare, 
  Camera, 
  Crown, 
  ShoppingBag, 
  Share2, 
  Heart, 
  CheckCircle2, 
  ShieldCheck, 
  Star, 
  ThumbsUp, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Send, 
  UserCheck, 
  Compass,
  RotateCw,
  ZoomIn,
  Image as ImageIcon 
} from 'lucide-react';
import { Product, ExchangeScrapData, ProductReview, ProductAngle } from '../types';
import { triggerHaptic } from '../utils/haptics';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onOpenBargain: (product: Product) => void;
  onOpenLiveScrapUpload: () => void;
  onOpenTryOn: (product: Product) => void;
  onOpenTrial: (product: Product) => void;
  onAddToCart: (product: Product, isDirectBuy?: boolean) => void;
  onOpenMartTour?: (product: Product) => void;
  appliedExchangeVoucher: ExchangeScrapData | null;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onOpenBargain,
  onOpenLiveScrapUpload,
  onOpenTryOn,
  onOpenTrial,
  onAddToCart,
  onOpenMartTour,
  appliedExchangeVoucher,
}) => {
  const angles: ProductAngle[] = product.angles && product.angles.length > 0 ? product.angles : [
    {
      label: 'Front Studio 0°',
      type: 'front',
      url: product.image,
      craftsmanshipNote: 'Symmetrical studio front view displaying gemstone layout and proportions.',
      zoomScale: 1.0,
    }
  ];

  const images = angles.map(a => a.url);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showInlineExchange, setShowInlineExchange] = useState<boolean>(Boolean(appliedExchangeVoucher));
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isZoomMode, setIsZoomMode] = useState<boolean>(false);

  // Reviews state with local optimistic additions
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(product.reviews || []);
  const [filterType, setFilterType] = useState<'all' | 'photos' | 'trial' | '5star'>('all');
  const [helpfulMap, setHelpfulMap] = useState<Record<string, number>>({});
  
  // New Review Form State
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newName, setNewName] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [newOccasion, setNewOccasion] = useState<'Bridal' | 'Festive' | 'Daily Wear' | 'Party' | 'Gift'>('Festive');
  const [reviewSuccessToast, setReviewSuccessToast] = useState<string | null>(null);

  const activePrice = product.bargainedPrice || product.price;
  const isBargained = Boolean(product.bargainedPrice && product.bargainedPrice < product.price);
  const discountPercent = Math.round(((product.originalPrice - activePrice) / product.originalPrice) * 100);
  const effectivePrice = Math.max(0, activePrice - (appliedExchangeVoucher?.netCredit || 0));

  const currentAngle = angles[selectedImageIndex] || angles[0];
  const currentImage = currentAngle.url || product.image;

  const handleNextImage = () => {
    triggerHaptic('light');
    setSelectedImageIndex((prev) => (prev + 1) % angles.length);
  };

  const handlePrevImage = () => {
    triggerHaptic('light');
    setSelectedImageIndex((prev) => (prev - 1 + angles.length) % angles.length);
  };

  const handleHelpfulClick = (reviewId: string) => {
    triggerHaptic('light');
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    triggerHaptic('success');
    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: newName.trim(),
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim() || `${newRating} Star Experience`,
      comment: newComment.trim(),
      verifiedPurchase: true,
      triedAtHome: product.trialEligible,
      helpfulCount: 0,
      occasionTag: newOccasion,
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsWritingReview(false);
    setNewName('');
    setNewTitle('');
    setNewComment('');
    setReviewSuccessToast('🎉 Thank you! Your verified review has been published.');
    setTimeout(() => setReviewSuccessToast(null), 4000);
  };

  // Filtered reviews
  const filteredReviews = reviewsList.filter((rev) => {
    if (filterType === 'photos') return rev.customerPhotos && rev.customerPhotos.length > 0;
    if (filterType === 'trial') return rev.triedAtHome;
    if (filterType === '5star') return rev.rating === 5;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-stone-950 pb-24 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-stone-950/90 backdrop-blur-md px-4 py-3 border-b border-stone-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-serif text-amber-300/90 text-sm tracking-wide font-medium">
          RoldyGoldy Haute Joaillerie
        </span>
        <div className="flex items-center gap-2">
          {onOpenMartTour && (
            <button
              onClick={() => onOpenMartTour(product)}
              className="bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-md"
              title="360° Real-time Jewellery Mart Visit"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">360° Mart Tour</span>
            </button>
          )}
          <button
            onClick={() => onOpenTryOn(product)}
            className="w-9 h-9 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 flex items-center justify-center hover:bg-stone-800 text-xs shadow-md"
            title="3D Virtual Try-On"
          >
            🪞
          </button>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center transition-colors ${
              isLiked ? 'text-rose-500' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Multi-Image Stage & Carousel with Same-Product Angles */}
      <div className="relative bg-stone-900 border-b border-stone-800 overflow-hidden select-none">
        
        {/* Visual Angle Mode Switcher Bar */}
        <div className="bg-stone-950/90 border-b border-stone-800/80 px-3 py-2 flex items-center justify-between text-[11px] overflow-x-auto gap-2">
          <span className="text-stone-400 font-semibold flex items-center gap-1 shrink-0">
            <RotateCw className="w-3 h-3 text-amber-400" />
            <span>Angles ({angles.length}):</span>
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {angles.map((ang, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedImageIndex(idx);
                }}
                className={`px-2.5 py-1 rounded-full text-[10.5px] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedImageIndex === idx
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <span>
                  {ang.type === 'front' ? '🧭 0° Front' :
                   ang.type === 'angle45' ? '📐 45° Side' :
                   ang.type === 'model' ? '👤 On-Model' :
                   ang.type === 'macro' ? '🔍 10x Macro' : '🔐 Clasp/Back'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Stage Viewport */}
        <div className="relative h-80 sm:h-96 w-full flex items-center justify-center overflow-hidden bg-stone-950">
          <img
            src={currentImage}
            alt={`${product.name} - ${currentAngle.label}`}
            onClick={() => setIsLightboxOpen(true)}
            className={`w-full h-full object-cover object-center cursor-zoom-in transition-all duration-300 ${
              isZoomMode ? 'scale-150' : 'scale-100'
            }`}
          />

          {/* Left / Right Carousel Navigation Arrows */}
          {angles.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-950/70 hover:bg-stone-900 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-stone-950/70 hover:bg-stone-900 border border-stone-700 text-stone-200 flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            <span className="bg-amber-500 text-stone-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
              {product.category} Collection
            </span>
            <span className="bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
              ✨ Same Piece · Angle {selectedImageIndex + 1}/{angles.length}
            </span>
          </div>

          {/* Image Controls */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={() => setIsZoomMode(!isZoomMode)}
              className={`h-7 px-2 rounded-full backdrop-blur-md border text-[11px] font-medium flex items-center gap-1 transition-all ${
                isZoomMode ? 'bg-amber-500 text-stone-950 border-amber-400' : 'bg-stone-950/80 text-stone-300 border-stone-800'
              }`}
              title="Toggle Zoom Magnifier"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{isZoomMode ? '1.5x Zoom' : 'Zoom'}</span>
            </button>
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="w-7 h-7 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-800 text-stone-300 flex items-center justify-center hover:text-white"
              title="Fullscreen Ultra-HD Lightbox"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating 3D AR Try-On Mirror Action Button */}
          <button
            onClick={() => onOpenTryOn(product)}
            className="absolute bottom-3 right-3 bg-stone-950/90 hover:bg-stone-900 backdrop-blur-md border border-amber-500/50 text-amber-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <span>🪞 3D AR Try-On Mirror</span>
          </button>
        </div>

        {/* Active Angle Craftsmanship Explanation Banner */}
        <div className="bg-stone-950/95 border-t border-stone-800/80 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-stone-300">
          <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Sparkles className="w-3 h-3" />
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="font-bold text-amber-300 text-[11px] flex items-center justify-between">
              <span>{currentAngle.label}</span>
              <span className="text-[10px] text-stone-400 font-mono">100% Genuine Handcrafted Angle</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              {currentAngle.craftsmanshipNote}
            </p>
          </div>
        </div>

        {/* Thumbnail Preview Strip */}
        {angles.length > 1 && (
          <div className="px-3.5 py-2 bg-stone-950 flex items-center gap-2 overflow-x-auto border-t border-stone-800/60">
            {angles.map((ang, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedImageIndex(idx);
                }}
                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-md'
                    : 'border-stone-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={ang.url} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8.5px] font-mono text-amber-300 text-center py-0.5 truncate px-0.5">
                  {ang.type === 'front' ? '0° Front' :
                   ang.type === 'angle45' ? '45° Side' :
                   ang.type === 'model' ? 'Model' :
                   ang.type === 'macro' ? 'Macro' : 'Clasp'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-6 space-y-5 max-w-2xl mx-auto w-full">
        
        {/* Title, Rating Summary & Pricing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
            <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-300">{product.rating}</span>
            </div>
            <a href="#reviews-section" className="text-stone-400 hover:text-amber-300 underline underline-offset-2">
              {reviewsList.length} Customer Reviews &amp; Feedback
            </a>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-stone-100 font-serif leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 pt-1 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {appliedExchangeVoucher ? (
              <span className="text-sm text-stone-400 line-through">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-sm text-stone-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {appliedExchangeVoucher ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                -₹{appliedExchangeVoucher.netCredit.toLocaleString('en-IN')} Scrap Cashback
              </span>
            ) : (
              <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                {discountPercent}% OFF
              </span>
            )}
            {isBargained && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Bargain Deal Locked
              </span>
            )}
          </div>
        </div>

        {/* Primary Interactive Highlights: Bargain & Trial */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => onOpenBargain(product)}
            className="bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/50 p-3 rounded-2xl flex flex-col items-center text-center gap-1 transition-all active:scale-95 shadow-md"
          >
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Bargain with Jeweller</span>
            </div>
            <span className="text-[10.5px] text-stone-400">Negotiate direct artisanal discount</span>
          </button>

          {product.trialEligible ? (
            <button
              onClick={() => onOpenTrial(product)}
              className="bg-gradient-to-tr from-amber-500/20 to-yellow-400/10 hover:bg-amber-500/30 text-amber-200 border border-amber-500/50 p-3 rounded-2xl flex flex-col items-center text-center gap-1 transition-all active:scale-95 shadow-md"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Book Trial @Home</span>
              </div>
              <span className="text-[10.5px] text-stone-400">Doorstep try-on (₹99 fee waived)</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenTryOn(product)}
              className="bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 p-3 rounded-2xl flex flex-col items-center text-center gap-1 transition-all active:scale-95"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <span>🪞 3D AR Mirror</span>
              </div>
              <span className="text-[10.5px] text-stone-400">Instant camera virtual fit</span>
            </button>
          )}
        </div>

        {/* INLINE OLD JEWELLERY EXCHANGE SECTION */}
        <div className="bg-stone-900/90 border border-dashed border-amber-500/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">♻️</span>
              <div>
                <span className="font-bold text-stone-100 text-xs block">
                  Exchange Old Scrap Jewellery with this piece?
                </span>
                <span className="text-[11px] text-stone-400">
                  Instant trade-in cashback credited onto this purchase
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={showInlineExchange}
              onChange={() => setShowInlineExchange(!showInlineExchange)}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>

          {showInlineExchange && (
            <div className="pt-2 border-t border-stone-800 space-y-3 animate-in fade-in">
              {appliedExchangeVoucher ? (
                <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      ✓ Cashback Voucher Applied: -₹{appliedExchangeVoucher.netCredit.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10.5px] text-emerald-400/90 font-mono">
                      Code: {appliedExchangeVoucher.voucherCode} ({appliedExchangeVoucher.grams}g {appliedExchangeVoucher.metalType})
                    </span>
                  </div>
                  <button
                    onClick={onOpenLiveScrapUpload}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                  >
                    View Slip
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Snap a live picture of your broken chains, old scrap bangles, or coins to generate a certified digital appraisal voucher:
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenLiveScrapUpload}
                      className="flex-1 bg-stone-950 hover:bg-stone-800 border border-amber-500/50 text-amber-300 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>📸 Snap Live Photo &amp; Appraise</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Specifications Grid */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Artisanal Specifications &amp; Hallmarks</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10.5px] text-stone-500 block">Metal Composition</span>
              <span className="font-semibold text-stone-200">{product.metal}</span>
            </div>
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10.5px] text-stone-500 block">Gross / Net Weight</span>
              <span className="font-semibold text-stone-200">{product.grossWeight} / {product.netWeight}</span>
            </div>
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10.5px] text-stone-500 block">Gemstone Embellishment</span>
              <span className="font-semibold text-stone-200">{product.stone}</span>
            </div>
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10.5px] text-stone-500 block">Closure Type</span>
              <span className="font-semibold text-stone-200">{product.closure}</span>
            </div>
          </div>

          <p className="text-xs text-stone-400 leading-relaxed pt-1">
            {product.description}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CUSTOMER REVIEWS & FEEDBACK SECTION (E-COMMERCE STANDARD) */}
        {/* ========================================================================= */}
        <div id="reviews-section" className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-5">
          
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif flex items-center gap-2">
                <span>Customer Ratings &amp; Reviews</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {reviewsList.length}
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Verified buyer testimonials &amp; doorstep trial feedback
              </p>
            </div>

            <button
              onClick={() => {
                triggerHaptic('light');
                setIsWritingReview(!isWritingReview);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isWritingReview ? 'Cancel' : 'Write Review'}</span>
            </button>
          </div>

          {/* Review Success Toast */}
          {reviewSuccessToast && (
            <div className="bg-emerald-950/90 border border-emerald-500/60 p-3 rounded-2xl text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{reviewSuccessToast}</span>
            </div>
          )}

          {/* Rating Summary Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-950 p-4 rounded-2xl border border-stone-800/80">
            <div className="flex flex-col items-center justify-center text-center sm:border-r border-stone-800 pr-2">
              <span className="text-3xl font-extrabold text-amber-400 font-serif">{product.rating}</span>
              <div className="flex items-center gap-1 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-stone-400">{reviewsList.length} Verified Reviews</span>
            </div>

            <div className="sm:col-span-2 space-y-1.5 text-[11px] text-stone-400 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-stone-300">5 ★</span>
                <div className="flex-1 bg-stone-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[85%]" />
                </div>
                <span className="w-7 text-right font-mono">85%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-stone-300">4 ★</span>
                <div className="flex-1 bg-stone-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[12%]" />
                </div>
                <span className="w-7 text-right font-mono">12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 font-bold text-stone-300">3 ★</span>
                <div className="flex-1 bg-stone-900 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full w-[3%]" />
                </div>
                <span className="w-7 text-right font-mono">3%</span>
              </div>
            </div>
          </div>

          {/* Expandable Write Review Form */}
          {isWritingReview && (
            <form onSubmit={handleSubmitReview} className="bg-stone-950 border border-amber-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-amber-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Share Your Experience &amp; Feedback</span>
              </h4>

              {/* Star Rating Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-300">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 text-stone-600 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">({newRating}/5)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Priyadarshini K.)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
                />

                <select
                  value={newOccasion}
                  onChange={(e) => setNewOccasion(e.target.value as any)}
                  className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-hidden focus:border-amber-400"
                >
                  <option value="Bridal">Occasion: Bridal</option>
                  <option value="Festive">Occasion: Festive</option>
                  <option value="Party">Occasion: Party / Sangeet</option>
                  <option value="Daily Wear">Occasion: Daily Wear</option>
                  <option value="Gift">Occasion: Gift</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Headline (e.g. Stunning polish, exceeded expectations!)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-400"
              />

              <textarea
                placeholder="Write your honest comments about weight, luster, trial@home experience, and polish durability..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={3}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-amber-400 resize-none"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-3 py-2 rounded-xl bg-stone-900 text-stone-400 text-xs hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Review</span>
                </button>
              </div>
            </form>
          )}

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                filterType === 'all'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              All ({reviewsList.length})
            </button>
            <button
              onClick={() => setFilterType('photos')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1 ${
                filterType === 'photos'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>With Customer Photos</span>
            </button>
            <button
              onClick={() => setFilterType('trial')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1 ${
                filterType === 'trial'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Tried @Home</span>
            </button>
            <button
              onClick={() => setFilterType('5star')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                filterType === '5star'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              5 Stars Only
            </button>
          </div>

          {/* User Review Cards List */}
          <div className="space-y-3">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                No reviews match this filter. Be the first to add feedback!
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const totalHelpful = rev.helpfulCount + (helpfulMap[rev.id] || 0);

                return (
                  <div
                    key={rev.id}
                    className="bg-stone-950 border border-stone-800/80 rounded-2xl p-4 space-y-2.5 transition-all hover:border-stone-700"
                  >
                    {/* User Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 text-stone-950 font-bold flex items-center justify-center text-xs shadow-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-200 text-xs">{rev.userName}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[9.5px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[10.5px] text-stone-500">{rev.date}</span>
                        </div>
                      </div>

                      {rev.triedAtHome && (
                        <span className="text-[10px] bg-amber-500/15 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                          👑 Doorstep Trial Customer
                        </span>
                      )}
                    </div>

                    {/* Star Rating & Occasion */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                            }`}
                          />
                        ))}
                      </div>
                      {rev.occasionTag && (
                        <span className="text-[10px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded-md border border-stone-800 font-medium">
                          {rev.occasionTag}
                        </span>
                      )}
                    </div>

                    {/* Title & Comment Text */}
                    <div className="space-y-1">
                      <h5 className="font-bold text-stone-100 text-xs">{rev.title}</h5>
                      <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>
                    </div>

                    {/* Customer Uploaded Photos */}
                    {rev.customerPhotos && rev.customerPhotos.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        {rev.customerPhotos.map((photo, pIdx) => (
                          <img
                            key={pIdx}
                            src={photo}
                            alt="Customer photo"
                            className="w-16 h-16 rounded-xl object-cover border border-stone-700 cursor-pointer hover:border-amber-400 transition-colors"
                            onClick={() => {
                              setSelectedImageIndex(0);
                              setIsLightboxOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Helpful Button */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-900 text-[11px] text-stone-400">
                      <span>Was this review helpful?</span>
                      <button
                        onClick={() => handleHelpfulClick(rev.id)}
                        className="flex items-center gap-1 text-stone-300 hover:text-amber-300 bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800 transition-colors active:scale-95"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({totalHelpful})</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Guarantee Perquisites */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-3.5 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-300">
          <div className="p-2">
            <span className="text-lg block mb-1">✨</span>
            <strong>22K Micron</strong> Polish
          </div>
          <div className="p-2 border-x border-stone-800">
            <span className="text-lg block mb-1">🛡️</span>
            <strong>1-Yr Free</strong> Refurbish
          </div>
          <div className="p-2">
            <span className="text-lg block mb-1">📦</span>
            <strong>Tamper-Proof</strong> Seal
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal for High-Res Zoom Gallery */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in">
          <div className="flex items-center justify-between text-stone-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-md">
                Angle {selectedImageIndex + 1} / {angles.length}
              </span>
              <span className="text-xs font-bold text-stone-200 hidden sm:inline">
                {currentAngle.label} · {product.name}
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 rounded-full bg-stone-900 text-stone-200 flex items-center justify-center border border-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex flex-col items-center justify-center py-2">
            <img
              src={currentImage}
              alt=""
              className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />
            
            <div className="mt-3 max-w-lg text-center bg-stone-950/80 border border-stone-800 rounded-xl px-4 py-2 text-xs text-stone-300">
              <strong className="text-amber-400 block mb-0.5">{currentAngle.label}</strong>
              <p className="text-[11px] text-stone-400">{currentAngle.craftsmanshipNote}</p>
            </div>

            {angles.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-stone-900/80 border border-stone-700 text-stone-200 flex items-center justify-center"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {angles.map((ang, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 relative ${
                  selectedImageIndex === idx ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20' : 'border-stone-800 opacity-60'
                }`}
              >
                <img src={ang.url} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-amber-300 text-center py-0.5 truncate px-0.5">
                  {ang.type === 'front' ? '0° Front' :
                   ang.type === 'angle45' ? '45° Side' :
                   ang.type === 'model' ? 'Model' :
                   ang.type === 'macro' ? 'Macro' : 'Clasp'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-stone-950/95 backdrop-blur-md px-4 py-3 border-t border-stone-800 flex items-center justify-between gap-3 max-w-2xl mx-auto">
        <div className="shrink-0">
          <span className="text-[10px] text-stone-400 block uppercase">
            {appliedExchangeVoucher ? 'Net Total' : 'Price'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-amber-400">₹{effectivePrice.toLocaleString('en-IN')}</span>
            {appliedExchangeVoucher && (
              <span className="text-xs text-stone-500 line-through">
                ₹{activePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => onAddToCart(product, false)}
            className="bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold text-xs py-3 px-4 rounded-xl border border-stone-700 active:scale-95 transition-all"
          >
            Add to Cart
          </button>
          <button
            onClick={() => onAddToCart(product, true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs py-3 px-5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

    </div>
  );
};
