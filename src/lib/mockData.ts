import { Product, DeliveryZone, CustomerReview, FactoryJarInventory, Address, ReferralInvite } from '../types';

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-20l-jar',
    name: '২০ লিটার মিনারেল ওয়াটার জার (20L Jar)',
    subTitle: 'খাদ্যমান গ্রেড-এ পলিকার্বনেট জার (রিফিল / নতুন)',
    category: 'water_jar',
    volume: '২০ লিটার (20 Liters)',
    price: 80, // In BDT
    jarDeposit: 250, // One-time security deposit if not exchanging empty jar
    description: '৭-ধাপ বিশিষ্ট রিভার্স অসমোসিস (RO), ইউভি (UV) এবং ওজোন নির্বীজিত বিশুদ্ধ মিনারেল পানি। বাসা, অফিস, হাসপাতাল ও রেস্টুরেন্টের জন্য উপযুক্ত।',
    image: 'prod-20l-jar',
    features: [
      '৭-স্তরের RO + UV + ওজোন ফিল্ট্রেশন',
      'টিডিএস (TDS) < ৩৫ PPM এবং পিএইচ ৭.৪ ব্যালেন্সড',
      'মজবুত ও শতভাগ নিরাপদ পলিকার্বনেট ফুড-গ্রেড জার',
      'সিলেট শহরে দ্রুত ১-২ ঘণ্টার মধ্যে হোম ডেলিভারি'
    ],
    popular: true,
    inStock: true,
    unit: 'জার'
  },
  {
    id: 'prod-5l-bottle',
    name: '৫ লিটার ফ্যামিলি বোতল (5L Bottle)',
    subTitle: 'সহজে হাতল ধরে ঢালার উপযোগী হ্যান্ডেল বোতল',
    category: 'water_bottle',
    volume: '৫ লিটার (5 Liters)',
    price: 35,
    jarDeposit: 40,
    description: 'ছোট পরিবার, ডাইনিং টেবিল ও ভ্রমণের জন্য সহজ ও হালকা ৫ লিটার বোতল।',
    image: 'prod-5l-bottle',
    features: [
      'সহজে বহনের জন্য আরামদায়ক হ্যান্ডেল',
      '১০০% ফুড গ্রেড বিপিএ-মুক্ত পিইটি বোতল',
      'কোনো ভারি তোলাতুলির ঝামেলা নেই',
      'টেবিলে রাখার জন্য আকর্ষণীয় সাইজ'
    ],
    popular: false,
    inStock: true,
    unit: 'বোতল'
  },
  {
    id: 'prod-500ml-case',
    name: '৫০০ মিলি প্রিমিয়াম বোতল (২৪ পিস কেস)',
    subTitle: 'সভা, অনুষ্ঠান, বিয়ে ও মেহমানদারির জন্য',
    category: 'water_bottle',
    volume: '১২ লিটার (২৪ x ৫০০ মিলি)',
    price: 360,
    jarDeposit: 0,
    description: 'কনফারেন্স, ঘরোয়া অনুষ্ঠান, মেহমানদারি ও রেস্টুরেন্টের জন্য ক্রিস্টাল ক্লিয়ার ৫০০ মিলি বোতলের কেস।',
    image: 'prod-500ml-case',
    features: [
      'এয়ারটাইট সিলযুক্ত সম্পূর্ণ নিরাপদ ক্যাপ',
      'হাতে সহজে ধরার উপযোগী স্লিম ডিজাইন',
      'বিয়ে, মাহফিল ও কর্পোরেট ইভেন্টের জন্য সেরা',
      'কোনো খালি জার ফেরত বা জামানতের প্রয়োজন নেই'
    ],
    popular: false,
    inStock: true,
    unit: 'কেস (২৪ পিস)'
  },
  {
    id: 'prod-electric-pump',
    name: 'অটোমেটিক ইলেকট্রিক জার পাম্প ডিসপেন্সার',
    subTitle: 'ইউএসবি রিচার্জেবল ওয়ান-টাচ ওয়াটার পাম্প',
    category: 'dispenser',
    volume: '২০ লিটার ও ৫ লিটার জারে ব্যবহার উপযোগী',
    price: 450,
    jarDeposit: 0,
    description: 'এক ক্লিকেই স্বয়ংক্রিয়ভাবে পানি গ্লাসে পড়বে। ১ বার ফুল চার্জে ৬-৮টি ২০ লিটার জার অনায়াসে চলবে।',
    image: 'prod-electric-pump',
    features: [
      'দ্রুত ১.৮ লিটার/মিনিট ওয়াটার ফ্লো',
      'ইউএসবি-সি ফাস্ট চার্জিং ১২০০mAh ব্যাটারি',
      'ফুড গ্রেড সিলিকন পাইপ ও স্টেইনলেস স্টিল নোজল',
      'এলইডি টাচ কন্ট্রোল বাটন'
    ],
    popular: true,
    inStock: true,
    unit: 'ডিভাইস'
  },
  {
    id: 'prod-ceramic-dispenser',
    name: 'মাটির সিরামিক পট ও কাঠের স্ট্যান্ড',
    subTitle: 'প্রাকৃতিক ঠাণ্ডা পানি পানের জন্য ইকো-ফ্রেন্ডলি পট',
    category: 'dispenser',
    volume: '২০ লিটার জার উল্টো করে বসানো যায়',
    price: 1200,
    jarDeposit: 0,
    description: 'প্রাকৃতিক মাটির ফিল্ট্রেশন পট ও আকর্ষণীয় কাঠের ট্রাইপড স্ট্যান্ড। কোনো বিদ্যুৎ ছাড়াই পানি প্রাকৃতিকভাবে সুস্বাদু ও ঠাণ্ডা রাখে।',
    image: 'prod-ceramic-dispenser',
    features: [
      'প্রাকৃতিক উপায়ে পানি ঠাণ্ডা ও সুস্বাদু থাকে',
      'মজবুত কাঠের স্ট্যান্ড ও পিতলের পুশ ট্যাপ',
      'বিদ্যুৎ খরচের কোনো ঝামেলা নেই',
      'লিভিং রুম বা ডাইনিংয়ের সৌন্দর্য বৃদ্ধি করে'
    ],
    popular: false,
    inStock: true,
    unit: 'সেট'
  },
  {
    id: 'prod-hot-cold-dispenser',
    name: 'কমার্শিয়াল হট অ্যান্ড কোল্ড ফ্লোর ডিসপেন্সার',
    subTitle: 'তাৎক্ষণিক গরম ও বরফ ঠাণ্ডা পানির সুবিধা',
    category: 'dispenser',
    volume: 'ফ্লোর স্ট্যান্ডিং কমার্শিয়াল ইউনিট',
    price: 9500,
    jarDeposit: 0,
    description: 'চা-কফির জন্য ৯০° সে. ফুটন্ত পানি এবং বরফ শীতল ৫° সে. ঠাণ্ডা পানি পাওয়ার জন্য হেভি ডিউটি কম্প্রেসার ডিসপেন্সার।',
    image: 'prod-hot-cold-dispenser',
    features: [
      'শক্তিশালী কম্প্রেসার কুলিং ও হিটিং',
      'গরম পানির জন্য চাইল্ড সেফটি লক',
      'নিচে কাপ রাখার জন্য স্টোরেজ ক্যাবিনেট',
      'অফিস, ক্লিনিক ও শোরুমের জন্য মানানসই'
    ],
    popular: false,
    inStock: true,
    unit: 'ইউনিট'
  }
];

export const DEFAULT_FACTORY_INVENTORY: FactoryJarInventory = {
  total20LJars: 18450,
  jarsInFactorySterilized: 4200,
  jarsInBottlingLine: 1850,
  jarsInCirculationWithCustomers: 12150,
  damagedOrRecycledJars: 250,
  total5LUnits: 6800,
  todayProductionLiters: 48500,
  activeVehiclesOnRoad: 14,
  currentWaterTDS: 28, // ppm
  currentWaterPH: 7.4
};

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-1',
    name: 'মিরবক্সটুলা ও জিন্দাবাজার জোন (Mirboxtula & Zindabazar)',
    code: 'ZONE-SYLHET-A',
    driverName: 'কবির হোসেন (Kabir)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১১-২২৩৩',
    capacityJars: 150,
    activeOrders: 18,
    status: 'on_route'
  },
  {
    id: 'zone-2',
    name: 'আম্বরখানা ও দরগাহ গেট জোন (Amberkhana & Dargah)',
    code: 'ZONE-SYLHET-B',
    driverName: 'রফিকুল ইসলাম (Rafiq)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১২-৩৪৫৬',
    capacityJars: 140,
    activeOrders: 14,
    status: 'on_route'
  },
  {
    id: 'zone-3',
    name: 'শিবগঞ্জ ও টিলাগড় জোন (Shibganj & Tilagarh)',
    code: 'ZONE-SYLHET-C',
    driverName: 'শাহিন আহমেদ (Shahin)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১৩-৫৬৭৮',
    capacityJars: 160,
    activeOrders: 22,
    status: 'on_route'
  },
  {
    id: 'zone-4',
    name: 'উপশহর ও লামাবাজার জোন (Uposhohor & Lamabazar)',
    code: 'ZONE-SYLHET-D',
    driverName: 'ফারুক মিয়া (Faruk)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১৪-৭৮৯০',
    capacityJars: 130,
    activeOrders: 11,
    status: 'idle'
  },
  {
    id: 'zone-5',
    name: 'সুবিদবাজার ও মদিনা মার্কেট জোন (Subidbazar & Madina Market)',
    code: 'ZONE-SYLHET-E',
    driverName: 'জাহাঙ্গীর আলম (Jahangir)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১৫-৯৯৮৮',
    capacityJars: 120,
    activeOrders: 9,
    status: 'idle'
  },
  {
    id: 'zone-6',
    name: 'দক্ষিণ সুরমা ও কদমতলী জোন (Dakshin Surma & Kadamtali)',
    code: 'ZONE-SYLHET-F',
    driverName: 'আব্দুল করিম (Karim)',
    driverPhone: '+8801711102448',
    vehicleNo: 'সিলেট মেট্রো-ড ১৬-১১২২',
    capacityJars: 140,
    activeOrders: 8,
    status: 'idle'
  }
];

export const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'আহমেদ হাসান (Ahmed Hassan)',
    location: 'মিরবক্সটুলা, সিলেট',
    rating: 5,
    comment: 'মিলাদ ড্রিংকিং ওয়াটার এর পানির স্বাদ চমৎকার এবং সম্পূর্ণ গন্ধহীন ও মিষ্টি। ফোনে বা হোয়াটসঅ্যাপে জানালেই ১ ঘণ্টার মধ্যে জার দিয়ে যায়। খালি জার সহজে বদলে নেওয়া যায়।',
    userType: 'Home Subscriber',
    date: '২ দিন আগে',
    verified: true
  },
  {
    id: 'rev-2',
    customerName: 'ড. ফারহানা চৌধুরী',
    location: 'জিন্দাবাজার, সিলেট',
    rating: 5,
    comment: 'আমাদের ক্লিনিক ও বাসার জন্য নিয়মিত মিলাদ ওয়াটারের ২০ লিটার জার নিচ্ছি। পানির টিডিএস ও পিএইচ সবসময় সঠিক থাকে। সিলেট শহরের সবচেয়ে সেরা ও বিশ্বস্ত পানি।',
    userType: 'Corporate Client',
    date: '১ সপ্তাহ আগে',
    verified: true
  },
  {
    id: 'rev-3',
    customerName: 'মো. তারেক রহমান',
    location: 'আম্বরখানা, সিলেট',
    rating: 5,
    comment: 'আমাদের পারিবারিক অনুষ্ঠানে ৫০টি জার এবং ৫০০ মিলি বোতল নিয়েছিলাম। নির্দিষ্ট সময়ের পূর্বেই নিখুঁতভাবে ডেলিভারি দিয়েছে। ধন্যবাদ মিলাদ ড্রিংকিং ওয়াটার!',
    userType: 'Event Organizer',
    date: '২ সপ্তাহ আগে',
    verified: true
  }
];

export const DEFAULT_SAMPLE_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    recipientName: 'আহমেদ হোসেন পাবেল',
    phone: '+8801711102448',
    addressLine: 'বাড়ি নম্বর ১২, রোড ৩, মিরবক্সটুলা',
    floorUnit: '৪র্থ তলা (ফ্ল্যাট ৪বি)',
    area: 'মিরবক্সটুলা',
    city: 'সিলেট',
    postalCode: '৩১০০',
    lat: 24.8949,
    lng: 91.8687,
    isDefault: true,
    instructions: 'দরজার বেল বাজাবেন। দরজার পাশে ২টি খালি জার রাখা আছে।'
  },
  {
    id: 'addr-2',
    tag: 'Office',
    recipientName: 'মিলাদ ট্রেডিং অ্যান্ড আইটি',
    phone: '+8801711102448',
    addressLine: 'সিটি সেন্টার টাওয়ার, জিন্দাবাজার',
    floorUnit: 'লেভেল ৫, রুম ৫০২',
    area: 'জিন্দাবাজার',
    city: 'সিলেট',
    postalCode: '৩১০০',
    lat: 24.8965,
    lng: 91.8710,
    isDefault: false,
    instructions: 'সকাল ৯টা থেকে বিকাল ৫টার মধ্যে রিসেপশনে ডেলিভারি দিন।'
  }
];

export const DEFAULT_REFERRAL_INVITES: ReferralInvite[] = [
  {
    id: 'ref-inv-1',
    referrerUserId: 'demo-customer-ahmed',
    referralCode: 'MILAD-SYLHET-50',
    friendName: 'মাহফুজ আলম',
    friendContact: '+8801711102448',
    channel: 'whatsapp',
    status: 'reward_claimed',
    discountGiven: 50,
    rewardEarned: 50,
    invitedAt: '2026-08-10T14:20:00.000Z',
    completedAt: '2026-08-12T11:05:00.000Z',
    note: 'মিরবক্সটুলা ফ্ল্যাটে ২ জার ২০ লিটার পানি অর্ডার করেছে'
  },
  {
    id: 'ref-inv-2',
    referrerUserId: 'demo-customer-ahmed',
    referralCode: 'MILAD-SYLHET-50',
    friendName: 'ফারহানা ইয়াসমিন',
    friendContact: '+8801711102448',
    channel: 'whatsapp',
    status: 'ordered',
    discountGiven: 50,
    rewardEarned: 50,
    invitedAt: '2026-08-20T09:15:00.000Z',
    completedAt: '2026-08-26T16:40:00.000Z',
    note: 'জিন্দাবাজার অফিসে প্রথম ডেলিভারি সম্পন্ন'
  },
  {
    id: 'ref-inv-3',
    referrerUserId: 'demo-customer-ahmed',
    referralCode: 'MILAD-SYLHET-50',
    friendName: 'সাজিদ মাহমুদ',
    friendContact: '+8801711102448',
    channel: 'sms',
    status: 'registered',
    discountGiven: 50,
    rewardEarned: 50,
    invitedAt: '2026-08-24T18:00:00.000Z',
    note: 'রেজিস্ট্রেশন সম্পন্ন, আম্বরখানায় ডেলিভারি নেবে'
  }
];


