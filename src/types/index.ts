export type Role = 'customer' | 'admin' | 'staff';

export interface Address {
  id: string;
  tag: 'Home' | 'Office' | 'Event Venue' | 'Other';
  recipientName: string;
  phone: string;
  addressLine: string;
  floorUnit?: string;
  area: string;
  city: string;
  postalCode?: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  instructions?: string;
}

export interface ReferralInvite {
  id: string;
  referrerUserId: string;
  referralCode: string;
  friendName: string;
  friendContact: string; // Email or Phone
  channel: 'whatsapp' | 'email' | 'sms' | 'direct_link';
  status: 'invited' | 'registered' | 'ordered' | 'reward_claimed';
  discountGiven: number; // e.g. ৳50
  rewardEarned: number; // e.g. ৳50
  invitedAt: string;
  completedAt?: string;
  note?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  photoURL?: string;
  role: Role;
  walletBalance: number;
  emptyJarsHeld: {
    jar20L: number;
    jar5L: number;
  };
  savedAddresses: Address[];
  referralCode: string;
  referralStats: {
    totalInvites: number;
    successfulReferrals: number;
    totalCreditsEarned: number;
    pendingCredits: number;
  };
  createdAt: string;
}

export type ProductCategory = 'water_jar' | 'water_bottle' | 'dispenser' | 'accessories' | 'event_bulk';

export interface Product {
  id: string;
  name: string;
  subTitle: string;
  category: ProductCategory;
  volume: string;
  price: number; // In BDT / Local currency
  jarDeposit: number; // Deposit if buying without empty jar exchange
  description: string;
  image: string;
  features: string[];
  popular?: boolean;
  inStock: boolean;
  unit: string;
}

export type OrderType = 'one_time' | 'subscription_delivery' | 'event_bulk';

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'sterilizing_bottling'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card' | 'wallet';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface CartItem {
  product: Product;
  quantity: number;
  exchangeEmptyJar: boolean; // true = customer will return jar, deposit waived
  customNotes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  volume: string;
  quantity: number;
  unitPrice: number;
  jarDepositPaid: number;
  emptyJarsToReturn: number;
  totalPrice: number;
}

export type WhatsAppNotificationStatus = 'sent' | 'pending' | 'failed';

export interface Order {
  id: string;
  invoiceNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  type: OrderType;
  items: OrderItem[];
  subtotal: number;
  depositTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  deliveryAddress: Address;
  deliveryDate: string;
  timeSlot: string;
  deliveryZone: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  whatsappNotificationStatus?: WhatsAppNotificationStatus;
  whatsappLastSentAt?: string;
  whatsappFailureReason?: string;
  whatsappLastTrigger?: string;
  assignedDriver?: {
    name: string;
    phone: string;
    vehicleNo: string;
  };
  eventDetails?: {
    eventName: string;
    eventType: string;
    guestCount: number;
    eventTime: string;
    dispenserNeeded: boolean;
    chilledRequired: boolean;
    specialNotes?: string;
  };
  emptyJarsReturnedCount: number;
  referralCodeUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionFrequency = 'weekly_1x' | 'weekly_2x' | 'weekly_3x' | 'monthly_bulk' | 'daily_office';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  planName: string;
  frequency: SubscriptionFrequency;
  bottleSize: '20L' | '5L' | 'Mixed';
  quantityPerDelivery: number;
  deliveryDays: string[]; // e.g. ["Monday", "Thursday"]
  timeSlot: string; // e.g. "Morning 08:00 AM - 11:00 AM"
  deliveryAddress: Address;
  pricePerDelivery: number;
  monthlyEstimate: number;
  paymentMethod: PaymentMethod;
  autoDeductWallet: boolean;
  status: SubscriptionStatus;
  startDate: string;
  nextDeliveryDate: string;
  pausedUntil?: string;
  deliveriesCompleted: number;
  createdAt: string;
}

export interface FactoryJarInventory {
  total20LJars: number;
  jarsInFactorySterilized: number;
  jarsInBottlingLine: number;
  jarsInCirculationWithCustomers: number;
  damagedOrRecycledJars: number;
  total5LUnits: number;
  todayProductionLiters: number;
  activeVehiclesOnRoad: number;
  currentWaterTDS: number; // ppm, target < 40 ppm
  currentWaterPH: number;  // 7.2 - 7.6
}

export interface DeliveryZone {
  id: string;
  name: string;
  code: string;
  driverName: string;
  driverPhone: string;
  vehicleNo: string;
  capacityJars: number;
  activeOrders: number;
  status: 'idle' | 'on_route' | 'delivered';
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  comment: string;
  userType: 'Home Subscriber' | 'Corporate Client' | 'Event Organizer';
  date: string;
  verified: boolean;
}
