export interface ProductReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  triedAtHome?: boolean;
  helpfulCount: number;
  customerPhotos?: string[];
  occasionTag?: 'Bridal' | 'Festive' | 'Daily Wear' | 'Party' | 'Gift';
}

export interface ProductAngle {
  label: string;
  type: 'front' | 'angle45' | 'model' | 'macro' | 'back';
  url: string;
  craftsmanshipNote: string;
  zoomScale?: number;
}

export interface PartnerSeller {
  sellerName?: string;
  name?: string;
  storeName?: string;
  businessName?: string;
  city: string;
  state?: string;
  pincode: string;
  hubName?: string;
  verifiedArtisan?: boolean;
  yearsExperience?: number;
  specialization?: string;
  rating?: number;
  deliveryEta?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Bridal' | 'Kundan' | 'Temple' | 'Korean' | 'Daily Wear' | 'Polki';
  price: number;
  originalPrice: number;
  bargainedPrice?: number;
  trialEligible: boolean;
  image: string;
  gallery: string[];
  angles?: ProductAngle[];
  videoUrl?: string;
  tryOnTransparentImage?: string;
  itemType?: 'necklace' | 'earrings' | 'tikka' | 'bangles' | 'choker';
  metal: string;
  grossWeight: string;
  netWeight: string;
  stone: string;
  closure: string;
  description: string;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  partnerSeller?: PartnerSeller;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
  isBargained?: boolean;
  routingHub?: string;
}

export interface BargainMessage {
  id: string;
  sender: 'user' | 'jeweller' | 'system';
  text: string;
  time: string;
  proposedPrice?: number;
  isAccepted?: boolean;
}

export interface ExchangeScrapData {
  id: string;
  description: string;
  metalType: string;
  grams: number;
  grossCredit: number;
  netCredit: number;
  livePhotoUrl?: string;
  voucherCode: string;
  date: string;
  status: 'Draft' | 'Applied' | 'Verified' | 'Rejected' | 'Failed';
  isRejected?: boolean;
  rejectionReason?: string;
  notes?: string;
}

export interface TrialBooking {
  id: string;
  date: string;
  timeSlot: string;
  items: Product[];
  fee: number;
  overageMins: number;
  status: 'Scheduled' | 'Rider En Route' | 'Trial in Progress' | 'Completed';
  deliveryOtp: string;
  returnOtp: string;
  pincode: string;
  routingHub?: string;
  isCrossPincodeRouted?: boolean;
}

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  isBargained?: boolean;
  category?: string;
  metal?: string;
  grossWeight?: string;
  netWeight?: string;
  stone?: string;
  sku?: string;
  partnerSeller?: PartnerSeller;
}

export interface Order {
  id: string;
  date: string;
  time?: string;
  items: OrderItemRecord[];
  subtotal: number;
  exchangeDiscount: number;
  exchangeVoucherDetails?: {
    code: string;
    grams: number;
    metalType: string;
    ratePerGram: number;
  };
  trialAtHomeValue?: number;
  taxGst?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: string;
  paymentTransactionId?: string;
  paymentStatus?: 'Completed' | 'Paid via UPI' | 'Paid via Card' | 'Cash on Delivery' | 'Pending';
  status: 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  deliveryOtp: string;
  address: string;
  pincode?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  customerState?: string;
  trackingHub?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  insurancePolicyNumber?: string;
  invoiceNumber?: string;
  returnWindowExpiry?: string;
  exchangeScrapSlip?: ExchangeScrapData;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  avatarUrl?: string;
}

export interface AdBanner {
  id: string;
  sellerName: string;
  businessName: string;
  city: string;
  pincode: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  ctaText: string;
  targetCategory?: string;
  slotType: 'home_top' | 'boutique_spotlight' | 'flash_deal';
  active: boolean;
  clicksCount: number;
  impressionsCount: number;
}

export interface SellerAdBooking {
  id: string;
  sellerName: string;
  businessName: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  slotType: 'home_top' | 'boutique_spotlight' | 'flash_deal';
  duration: '1_day' | '1_week' | '1_month';
  cost: number;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  ctaText: string;
  paymentStatus: 'Paid' | 'Pending';
  startDate: string;
}
