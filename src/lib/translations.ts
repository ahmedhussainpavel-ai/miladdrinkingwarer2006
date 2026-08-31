export type Language = 'bn' | 'en';

export interface TranslationDictionary {
  // Common & UI Elements
  appName: string;
  appTagline: string;
  currency: string;
  taka: string;
  perJar: string;
  perBottle: string;
  perCase: string;
  freeDelivery: string;
  sylhetCoverage: string;
  sylhetFactory: string;
  mirboxtula: string;
  cashOnDelivery: string;
  orderNow: string;
  addToCart: string;
  viewCart: string;
  checkoutLabel: string;
  quantity: string;
  total: string;
  subtotal: string;
  deposit: string;
  discount: string;
  grandTotal: string;
  deliveryFee: string;
  save: string;
  cancel: string;
  confirm: string;
  close: string;
  back: string;
  loading: string;
  viewAll: string;
  callNow: string;
  whatsApp: string;
  copy: string;
  copied: string;
  apply: string;
  remove: string;
  login: string;
  logout: string;
  myAccount: string;
  adminPanel: string;
  customerDashboard: string;
  verified: string;
  active: string;
  paused: string;
  cancelled: string;
  completed: string;
  pending: string;
  confirmed: string;
  outForDelivery: string;
  delivered: string;
  processing: string;
  days: {
    sat: string;
    sun: string;
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
  };
  timeSlots: {
    morning: string;
    noon: string;
    evening: string;
    custom: string;
  };

  // Navigation
  nav: {
    home: string;
    products: string;
    subscriptions: string;
    calculator: string;
    events: string;
    quality: string;
    referrals: string;
    admin: string;
    moreServices: string;
    myOrders: string;
    loginRegister: string;
    hotline: string;
    whatsappOrder: string;
    cart: string;
    wallet: string;
    jarsHeld: string;
  };

  // Hero Section
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    priceHighlight: string;
    statRefill: string;
    statRefillSub: string;
    statDelivery: string;
    statDeliverySub: string;
    statPayment: string;
    statPaymentSub: string;
    btnOrder: string;
    btnCall: string;
    btnWhatsApp: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    bstiReassurance: string;
  };

  // Quick 1-Click Easy Order Section
  easyOrder: {
    badge: string;
    title: string;
    subtitle: string;
    step1Label: string;
    step2Label: string;
    step3Label: string;
    selectJarType: string;
    jar20LTitle: string;
    jar20LPrice: string;
    jar20LDesc: string;
    bottle5LTitle: string;
    bottle5LPrice: string;
    bottle5LDesc: string;
    exchangeToggleLabel: string;
    exchangeToggleYes: string;
    exchangeToggleNo: string;
    exchangeDepositNote: string;
    pumpAddonTitle: string;
    pumpAddonPrice: string;
    pumpAddonDesc: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    areaLabel: string;
    areaSelectPlaceholder: string;
    addressPlaceholder: string;
    timeSlotLabel: string;
    paymentMethodLabel: string;
    codLabel: string;
    bkashLabel: string;
    walletLabel: string;
    orderSummaryTitle: string;
    waterCost: string;
    jarDepositFee: string;
    pumpCost: string;
    netPayable: string;
    placeOrderBtn: string;
    successTitle: string;
    successMessage: string;
    trackOrderBtn: string;
  };

  // Calculator
  calculator: {
    badge: string;
    title: string;
    subtitle: string;
    step1: string;
    homeType: string;
    homeTypeDesc: string;
    officeType: string;
    officeTypeDesc: string;
    step2: string;
    peopleCount: string;
    persons: string;
    step3: string;
    jar20LChoice: string;
    bottle5LChoice: string;
    cookingToggle: string;
    cookingToggleDesc: string;
    recommendedHeader: string;
    weeklySuggestion: string;
    monthlyTotalWater: string;
    miladCost: string;
    monthlySavings: string;
    savingsSubtext: string;
    plasticSaved: string;
    plasticSavedSubtext: string;
    subscribeBtn: string;
  };

  // Products
  catalog: {
    badge: string;
    title: string;
    subtitle: string;
    allCategory: string;
    jarsCategory: string;
    bottlesCategory: string;
    dispensersCategory: string;
    accessoriesCategory: string;
    inStock: string;
    outOfStock: string;
    featuresLabel: string;
    refillExchangeNote: string;
    depositIncludedNote: string;
    selectQty: string;
    addToCartBtn: string;
    exchangeJarOption: string;
    newJarOption: string;
  };

  // Subscriptions
  subscriptions: {
    badge: string;
    title: string;
    subtitle: string;
    popularBadge: string;
    planFamilyTitle: string;
    planFamilyDesc: string;
    planOfficeTitle: string;
    planOfficeDesc: string;
    planCustomTitle: string;
    planCustomDesc: string;
    frequencyLabel: string;
    frequencyWeekly1: string;
    frequencyWeekly2: string;
    frequencyWeekly3: string;
    frequencyDaily: string;
    chooseDays: string;
    chooseTime: string;
    perDelivery: string;
    monthlyEstimate: string;
    autoWalletDeduct: string;
    activateBtn: string;
    pauseResumeInfo: string;
  };

  // Quality & Testing
  quality: {
    badge: string;
    title: string;
    subtitle: string;
    bstiBadge: string;
    isoBadge: string;
    tdsBadge: string;
    phBadge: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    step5Title: string;
    step5Desc: string;
    step6Title: string;
    step6Desc: string;
    step7Title: string;
    step7Desc: string;
    labReportTitle: string;
    labReportDesc: string;
    parameterCol: string;
    bstiStandardCol: string;
    miladResultCol: string;
    statusCol: string;
    downloadReportBtn: string;
    factoryTourTitle: string;
    factoryTourDesc: string;
  };

  // Events & Bulk Order
  events: {
    badge: string;
    title: string;
    subtitle: string;
    eventNamePlaceholder: string;
    eventTypePlaceholder: string;
    guestCountPlaceholder: string;
    eventDateLabel: string;
    eventTimeLabel: string;
    venueAddressPlaceholder: string;
    dispenserNeedLabel: string;
    chilledNeedLabel: string;
    notesPlaceholder: string;
    submitQuoteBtn: string;
    corporatePerksTitle: string;
    perk1: string;
    perk2: string;
    perk3: string;
    perk4: string;
  };

  // Customer Dashboard
  dashboard: {
    title: string;
    welcome: string;
    walletBalance: string;
    topUpWallet: string;
    jarsAtHome: string;
    activeSubscription: string;
    tabOverview: string;
    tabSubscriptions: string;
    tabOrders: string;
    tabAddresses: string;
    tabReferrals: string;
    liveDeliveryTracking: string;
    driverAssigned: string;
    callDriver: string;
    invoiceBtn: string;
    reorderBtn: string;
    noOrdersFound: string;
    addAddressBtn: string;
  };

  // Admin Dashboard
  admin: {
    title: string;
    subtitle: string;
    tabOverview: string;
    tabOrders: string;
    tabInventory: string;
    tabZones: string;
    tabWhatsApp: string;
    todayProduction: string;
    activeDeliveries: string;
    totalOrdersToday: string;
    sterilizedJarsReady: string;
    waterQualityStats: string;
    assignDriverModal: string;
    updateStatusModal: string;
    exportReportBtn: string;
  };

  // Referral Program
  referrals: {
    badge: string;
    title: string;
    subtitle: string;
    yourCode: string;
    copyCodeBtn: string;
    shareWhatsAppBtn: string;
    earnedTotal: string;
    friendsJoined: string;
    howItWorks1: string;
    howItWorks2: string;
    howItWorks3: string;
  };

  // Cart & Checkout
  cart: {
    title: string;
    emptyMessage: string;
    continueShopping: string;
    exchangeYes: string;
    exchangeNo: string;
    itemCount: string;
    estimatedDelivery: string;
    checkoutBtn: string;
  };

  checkout: {
    title: string;
    subtitle: string;
    stepAddress: string;
    stepDateTime: string;
    stepPayment: string;
    selectSavedAddress: string;
    addNewAddress: string;
    deliveryDate: string;
    deliverySlot: string;
    promoCodePlaceholder: string;
    applyPromoBtn: string;
    orderSummary: string;
    confirmAndPlaceBtn: string;
    orderSuccessTitle: string;
    orderSuccessInvoice: string;
  };

  // Footer
  footer: {
    description: string;
    installApp: string;
    servicesHeading: string;
    quickOrderLink: string;
    catalogLink: string;
    subscriptionLink: string;
    eventLink: string;
    calculatorLink: string;
    coverageHeading: string;
    coverageSub: string;
    contactHeading: string;
    addressLine: string;
    callDirect: string;
    whatsappDirect: string;
    deliveryHours: string;
    customerPortalLink: string;
    adminPanelLink: string;
    copyright: string;
    factoryAddress?: string;
    factoryLocationDesc?: string;
    hotlineTitle?: string;
    hotlineNumbers?: string;
    emailTitle?: string;
    quickLinksTitle?: string;
    coverageAreasTitle?: string;
    coverageAreasList?: string[];
    bstiNotice?: string;
    openHours?: string;
  };
}

export const banglaTranslations: TranslationDictionary = {
  appName: 'মিলাদ ড্রিংকিং ওয়াটার',
  appTagline: 'সিলেট শহরের বিশ্বস্ত ও বিএসটিআই অনুমোদিত বিশুদ্ধ খাবার পানি',
  currency: '৳',
  taka: 'টাকা',
  perJar: 'প্রতি জার',
  perBottle: 'প্রতি বোতল',
  perCase: 'প্রতি কেস',
  freeDelivery: 'ফ্রি হোম ডেলিভারি',
  sylhetCoverage: 'সমগ্র সিলেট শহর জুড়ে বিস্তৃত ডেলিভারি নেটওয়ার্ক',
  sylhetFactory: 'মিরবক্সটুলা নিজস্ব মিনারেল ওয়াটার কারখানা',
  mirboxtula: 'মিরবক্সটুলা, সিলেট',
  cashOnDelivery: 'ক্যাশ অন ডেলিভারি (পানি পেয়ে টাকা দিন)',
  orderNow: 'এখনই অর্ডার করুন',
  addToCart: 'অর্ডারে যোগ করুন',
  viewCart: 'কার্ট দেখুন',
  checkoutLabel: 'অর্ডার সম্পন্ন করুন',
  quantity: 'পরিমাণ',
  total: 'মোট',
  subtotal: 'সাব-টোটাল',
  deposit: 'জার জামানত',
  discount: 'ছাড় / ডিসকাউন্ট',
  grandTotal: 'সর্বমোট প্রদেয়',
  deliveryFee: 'ডেলিভারি চার্জ',
  save: 'সংরক্ষণ করুন',
  cancel: 'বাতিল',
  confirm: 'নিশ্চিত করুন',
  close: 'বন্ধ করুন',
  back: 'পূর্ববর্তী',
  loading: 'অপেক্ষা করুন...',
  viewAll: 'সব দেখুন',
  callNow: 'সরাসরি কল করুন',
  whatsApp: 'হোয়াটসঅ্যাপ মেসেজ',
  copy: 'কপি করুন',
  copied: 'কপি হয়েছে!',
  apply: 'প্রয়োগ করুন',
  remove: 'মুছে ফেলুন',
  login: 'লগইন করুন',
  logout: 'লগআউট',
  myAccount: 'আমার অ্যাকাউন্ট',
  adminPanel: 'ফ্যাক্টরি অ্যাডমিন প্যানেল',
  customerDashboard: 'কাস্টমার ড্যাশবোর্ড',
  verified: 'যাচাইকৃত',
  active: 'চালু রয়েছে',
  paused: 'স্থগিত',
  cancelled: 'বাতিলকৃত',
  completed: 'সম্পন্ন',
  pending: 'অপেক্ষমাণ',
  confirmed: 'নিশ্চিতকৃত',
  outForDelivery: 'ডেলিভারির পথে',
  delivered: 'ডেলিভারি সম্পন্ন',
  processing: 'বোতলজাতকরণ চলছে',
  days: {
    sat: 'শনিবার',
    sun: 'রবিবার',
    mon: 'সোমবার',
    tue: 'মঙ্গলবার',
    wed: 'বুধবার',
    thu: 'বৃহস্পতিবার',
    fri: 'শুক্রবার'
  },
  timeSlots: {
    morning: 'সকাল ০৮:০০ - সকাল ১১:০০',
    noon: 'দুপুর ০২:০০ - বিকাল ০৫:০০',
    evening: 'সন্ধ্যা ০৬:০০ - রাত ০৯:০০',
    custom: 'জরুরি ডেলিভারি (১ ঘণ্টার মধ্যে)'
  },

  nav: {
    home: 'হোম',
    products: 'পণ্য ও মূল্যতালিকা',
    subscriptions: 'মাসিক প্যাকেজ',
    calculator: 'খরচ ক্যালকুলেটর',
    events: 'অনুষ্ঠান ও কর্পোরেট সাপ্লাই',
    quality: 'ল্যাব টেস্ট ও বিশুদ্ধতা',
    referrals: 'রেফার বোনাস (৳৫০)',
    admin: 'ফ্যাক্টরি অ্যাডমিন',
    moreServices: 'অন্যান্য সেবা',
    myOrders: 'আমার অর্ডার ও হিসাব',
    loginRegister: 'লগইন / একাউন্ট',
    hotline: 'হটলাইন: ০১৭১১-১০২৪৪৮',
    whatsappOrder: 'হোয়াটসঅ্যাপে অর্ডার',
    cart: 'ব্যাগ',
    wallet: 'ওয়ালেট ব্যালেন্স',
    jarsHeld: 'খালি জার সংখ্যা'
  },

  hero: {
    badge: 'সিলেট শহরের নিজস্ব কারখানা • মিরবক্সটুলা',
    titleLine1: 'বিশুদ্ধ খাবার পানি সরাসরি',
    titleLine2: 'আপনার বাসা ও অফিসে',
    subtitle: 'মিরবক্সটুলা ফ্যাক্টরি থেকে ২০ লিটার রিফিল জার মাত্র ৳৮০। কোনো অগ্রিম টাকা ছাড়াই ক্যাশ অন ডেলিভারিতে দ্রুত পৌঁছে যাবে।',
    priceHighlight: '৳৮০ / ২০ লিটার রিফিল',
    statRefill: '৳৮০ রিফিল',
    statRefillSub: '২০ লিটার নিরাপদ জার',
    statDelivery: 'ফ্রি ডেলিভারি',
    statDeliverySub: 'সিলেট শহর জুড়ে',
    statPayment: 'ক্যাশ ডেলিভারি',
    statPaymentSub: 'পানি পেয়ে মূল্য পরিশোধ',
    btnOrder: 'সহজে পানি অর্ডার করুন',
    btnCall: '০১৭১১-১০২৪৪৮',
    btnWhatsApp: 'হোয়াটসঅ্যাপে চ্যাট',
    step1Title: '১. কয় জার পানি লাগবে বাছুন',
    step1Desc: 'প্রয়োজন অনুযায়ী বোতল বা রিফিল নির্বাচন করুন',
    step2Title: '২. নাম ও বাসার ঠিকানা দিন',
    step2Desc: 'সিলেট শহরের যেকোনো পয়েন্টে ডেলিভারি',
    step3Title: '৩. পানি পেয়ে টাকা দিন',
    step3Desc: 'ক্যাশ, বিকাশ বা কার্ডে মূল্য পরিশোধ করুন',
    bstiReassurance: 'বিএসটিআই মানসম্মত ৭-ধাপ বিশিষ্ট RO + UV পিউরিফাইড মিষ্টি খাবার পানি'
  },

  easyOrder: {
    badge: 'সহজ ১-মিনিট সরাসরি অর্ডার',
    title: 'দ্রুত খাবার পানি অর্ডার ফর্ম',
    subtitle: 'কোনো দীর্ঘ রেজিস্ট্রেশন ছাড়াই নাম, ঠিকানা ও প্রয়োজনীয় জার সংখ্যা দিয়ে সরাসরি অর্ডার করুন।',
    step1Label: '১. পানির ধরন ও পরিমাণ',
    step2Label: '২. আপনার ডেলিভারি ঠিকানা',
    step3Label: '৩. ডেলিভারি সময় ও পেমেন্ট',
    selectJarType: 'পানির সাইজ পছন্দ করুন:',
    jar20LTitle: '২০ লিটার মিনারেল জার',
    jar20LPrice: '৳৮০ / রিফিল',
    jar20LDesc: 'বাসা ও অফিসের জন্য সর্বাধিক সাশ্রয়ী ফুড-গ্রেড জার',
    bottle5LTitle: '৫ লিটার হ্যান্ডেল বোতল',
    bottle5LPrice: '৳৩৫ / বোতল',
    bottle5LDesc: 'ডাইনিং টেবিল ও সহজে বহনের উপযোগী হালকা বোতল',
    exchangeToggleLabel: 'আপনার কাছে কি খালি জার আছে?',
    exchangeToggleYes: 'হ্যাঁ, খালি জার বদলে নেব (জামানত ৳০)',
    exchangeToggleNo: 'না, নতুন জার জামানত সহ নেব (+৳২০০/জার ফেরতযোগ্য)',
    exchangeDepositNote: 'খালি জার ফেরত দিলে কোনো জামানত ফি দিতে হবে না।',
    pumpAddonTitle: 'ইলেকট্রিক অটোমেটিক জার পাম্প যোগ করুন',
    pumpAddonPrice: '+৳৪৫০',
    pumpAddonDesc: 'এক ক্লিকে পানি পড়ার রিচার্জেবল ইউএসবি পাম্প (ঐচ্ছিক)',
    namePlaceholder: 'আপনার সম্পূর্ণ নাম লিখুন',
    phonePlaceholder: 'মোবাইল নম্বর (যেমন: 01711102448)',
    areaLabel: 'সিলেটের এলাকা নির্বাচন করুন',
    areaSelectPlaceholder: 'আপনার এলাকা বেছে নিন...',
    addressPlaceholder: 'বাসা নম্বর, ফ্ল্যাট/তলা, রোডের নাম ও ল্যান্ডমার্ক লিখুন',
    timeSlotLabel: 'ডেলিভারির সুবিধাজনক সময়',
    paymentMethodLabel: 'মূল্য পরিশোধের মাধ্যম',
    codLabel: 'ক্যাশ অন ডেলিভারি (পানি পেয়ে টাকা দিন)',
    bkashLabel: 'বিকাশ / নগদ / রকেট অনলাইন পেমেন্ট',
    walletLabel: 'কাস্টমার ওয়ালেট ব্যালেন্স দিয়ে',
    orderSummaryTitle: 'অর্ডারের সংক্ষিপ্ত বিবরণ',
    waterCost: 'পানির মূল্য',
    jarDepositFee: 'জার জামানত ফি',
    pumpCost: 'ডিসপেনসার/পাম্প মূল্য',
    netPayable: 'সর্বমোট প্রদেয় টাকা',
    placeOrderBtn: 'অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)',
    successTitle: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!',
    successMessage: 'আমাদের ফ্যাক্টরি থেকে পানি বোতলজাত করে দ্রুত আপনার ঠিকানায় পাঠানো হচ্ছে।',
    trackOrderBtn: 'অর্ডার ট্র্যাকিং ও ইনভয়েস দেখুন'
  },

  calculator: {
    badge: 'পানি খরচ ও সাশ্রয় ক্যালকুলেটর',
    title: 'আপনার পরিবার বা প্রতিষ্ঠানের জন্য কতটুকু পানি প্রয়োজন?',
    subtitle: 'দৈনিক প্রয়োজনীয় পানির পরিমাণ নির্ধারণ করুন এবং দেখুন সাধারণ বোতলজাত পানির তুলনায় মিলাদ ওয়াটার রিফিলে প্রতি মাসে কত টাকা ও প্লাস্টিক সাশ্রয় হয়।',
    step1: '১. ব্যবহারের স্থান নির্বাচন করুন',
    homeType: 'বাসা ও পরিবার',
    homeTypeDesc: 'বাসা-বাড়ি ও ফ্ল্যাটের জন্য',
    officeType: 'অফিস ও প্রতিষ্ঠান',
    officeTypeDesc: 'দোকান, শোরুম ও করপোরেট অফিস',
    step2: '২. সদস্য অথবা কর্মকর্তা সংখ্যা',
    peopleCount: 'সদস্য সংখ্যা',
    persons: 'জন',
    step3: '৩. পছন্দের বোতল সাইজ',
    jar20LChoice: '২০ লিটার রিফিল জার (৳৮০/জার)',
    bottle5LChoice: '৫ লিটার হ্যান্ডেল বোতল (৳৩৫/বোতল)',
    cookingToggle: 'রান্না ও চা-কফির জন্য বিশুদ্ধ পানি?',
    cookingToggleDesc: 'স্বাস্থ্যকর খাবারের জন্য সুপারিশকৃত (দৈনিক জনপ্রতি +১.৫ লিটার)',
    recommendedHeader: 'প্রস্তাবিত সাপ্তাহিক ডেলিভারি প্ল্যান',
    weeklySuggestion: 'সপ্তাহে প্রয়োজনীয় জার সংখ্যা',
    monthlyTotalWater: 'মাসিক মোট পানির চাহিদা',
    miladCost: 'মিলাদ ফ্যাক্টরি মাসিক খরচ',
    monthlySavings: 'আপনার সম্ভাব্য মাসিক সাশ্রয়',
    savingsSubtext: 'সাধারণ ১.৫ লিটার বা ৫০০ মিলি বোতলের তুলনায়',
    plasticSaved: 'প্লাস্টিক বোতল বর্জন',
    plasticSavedSubtext: 'পরিবেশ বান্ধব সার্কুলার ফুড-গ্রেড জারের মাধ্যমে',
    subscribeBtn: 'এই প্যাকেজটি সাবস্ক্রাইব করুন'
  },

  catalog: {
    badge: 'কারখানা থেকে সরাসরি খাবার পানি',
    title: 'পণ্য ও এক্সেসরিজ ক্যাটালগ',
    subtitle: 'এককালীন পানির জার অর্ডার করুন অথবা রিচার্জেবল পাম্প ও সিরামিক ডিসপেনসার সংগ্রহ করুন।',
    allCategory: 'সকল পণ্য',
    jarsCategory: '২০ লিটার জার',
    bottlesCategory: '৫ লিটার ও বোতল',
    dispensersCategory: 'ডিসপেনসার ও পাম্প',
    accessoriesCategory: 'এক্সেসরিজ ও পার্টস',
    inStock: 'স্টকে আছে',
    outOfStock: 'স্টক শেষ',
    featuresLabel: 'প্রধান বৈশিষ্ট্যসমূহ:',
    refillExchangeNote: 'খালি জার বদলে নিলে জামানত ফি লাগবে না',
    depositIncludedNote: 'নতুন জার ক্রয়ের ক্ষেত্রে ফেরতযোগ্য জামানত প্রযোজ্য',
    selectQty: 'পরিমাণ নির্বাচন:',
    addToCartBtn: 'কার্টে যোগ করুন',
    exchangeJarOption: 'খালি জার বদল (জামানত ৳০)',
    newJarOption: 'নতুন জার জামানত সহ (+৳২০০)'
  },

  subscriptions: {
    badge: 'নিয়মিত পানি ডেলিভারি প্যাকেজ',
    title: 'মাসিক স্মার্ট ওয়াটার সাবস্ক্রিপশন',
    subtitle: 'বারবার অর্ডার করার ঝামেলা ছাড়াই নির্দিষ্ট দিনে সঠিক সময়ে পৌঁছে যাবে বিশুদ্ধ খাবার পানি।',
    popularBadge: 'সর্বাধিক জনপ্রিয়',
    planFamilyTitle: 'ফ্যামিলি হাইড্রেশন প্যাকেজ',
    planFamilyDesc: '৪-৬ সদস্যের পরিবারের জন্য আদর্শ (সপ্তাহে ২ দিন ডেলিভারি)',
    planOfficeTitle: 'কর্পোরেট অফিস প্যাকেজ',
    planOfficeDesc: 'অফিস ও বাণিজ্যিক প্রতিষ্ঠানের জন্য নিরবচ্ছিন্ন পানি সাপ্লাই',
    planCustomTitle: 'কাস্টম প্যাকেজ তৈরি করুন',
    planCustomDesc: 'আপনার সুবিধামতো দিন, সময় ও জারের সংখ্যা নির্ধারণ করুন',
    frequencyLabel: 'ডেলিভারির নিয়মিত ফ্রিকোয়েন্সি:',
    frequencyWeekly1: 'সপ্তাহে ১ দিন (সাপ্তাহিক ৪টি)',
    frequencyWeekly2: 'সপ্তাহে ২ দিন (সাপ্তাহিক ৮টি)',
    frequencyWeekly3: 'সপ্তাহে ৩ দিন (সাপ্তাহিক ১২টি)',
    frequencyDaily: 'প্রতি কর্মদিবসে (অফিস প্যাকেজ)',
    chooseDays: 'ডেলিভারির দিনগুলো বেছে নিন:',
    chooseTime: 'সুবিধাজনক সময় নির্বাচন করুন:',
    perDelivery: 'প্রতি ডেলিভারিতে খরচ',
    monthlyEstimate: 'মাসিক আনুমানিক বিল',
    autoWalletDeduct: 'ওয়ালেট থেকে স্বয়ংক্রিয়ভাবে ব্যালেন্স সমন্বয়',
    activateBtn: 'সাবস্ক্রিপশন চালু করুন',
    pauseResumeInfo: 'ছুটি বা ভ্রমণের সময় কাস্টমার পোর্টাল থেকে যেকোনো মুহূর্তে পজ করতে পারবেন।'
  },

  quality: {
    badge: 'ল্যাব টেস্ট ও ফিল্ট্রেশন স্ট্যান্ডার্ড',
    title: 'শতভাগ বিশুদ্ধতার ৭-ধাপ বিশিষ্ট ফিল্ট্রেশন',
    subtitle: 'বিএসটিআই মান ও আধুনিক রিভার্স অসমোসিস প্রযুক্তিতে প্রক্রিয়াজাত স্ফটিকের মতো স্বচ্ছ ও সুস্বাদু মিনারেল ওয়াটার।',
    bstiBadge: 'বিএসটিআই অনুমোদিত (BDS 1414)',
    isoBadge: 'ফুড-গ্রেড সার্টিফাইড ফ্যাক্টরি',
    tdsBadge: 'টিডিএস < ৩৫ PPM (মিষ্টি স্বাদ)',
    phBadge: 'ব্যালেন্সড পিএইচ ৭.৪',
    step1Title: '১. সেডিমেন্ট প্রি-ফিল্ট্রেশন',
    step1Desc: 'পানিতে থাকা বালু, ধূলিকণা ও দৃশ্যমান সমস্ত অপদ্রব্য দূর করা হয়।',
    step2Title: '২. অ্যাক্টিভেটেড কার্বন ফিল্টার',
    step2Desc: 'অবাঞ্ছিত গন্ধ, ক্লোরিন ও জৈব রাসায়নিক উপাদান সম্পূর্ণ দূর করে।',
    step3Title: '৩. মাইক্রন পলিশিং ফিল্টার',
    step3Desc: '৫ মাইক্রন সূক্ষ্ম মেমব্রেন দিয়ে অতিক্ষুদ্র কণা অপসারণ করা হয়।',
    step4Title: '৪. হাই-প্রেশার RO মেমব্রেন',
    step4Desc: '০.০০০১ মাইক্রন মেমব্রেনে দ্রবীভূত ভারি ধাতু, আর্সেনিক ও ক্ষতিকর লবণ পৃথক হয়।',
    step5Title: '৫. মিনারেল ব্যালেন্সিং',
    step5Desc: 'শরীরের জন্য প্রয়োজনীয় ক্যালসিয়াম ও ম্যাগনেসিয়াম খনিজ ভারসাম্যযুক্ত করা হয়।',
    step6Title: '৬. আল্ট্রাভায়োলেট (UV) স্টেরিলাইজেশন',
    step6Desc: 'উচ্চ ক্ষমতাসম্পন্ন ইউভি রশ্মি দিয়ে শতভাগ জীবাণু ও ভাইরাস ধ্বংস করা হয়।',
    step7Title: '৭. ওজোন পিউরিফিকেশন ও অটো ফিলিং',
    step7Desc: 'জার ও বোতল সম্পূর্ণ জীবাণুমুক্ত করে স্পর্শহীন রোবোটিক নোজলে সিল করা হয়।',
    labReportTitle: 'সর্বশেষ ল্যাব টেস্ট ও রাসায়নিক বিশ্লেষণ রিপোর্ট',
    labReportDesc: 'সিলেটের শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় এবং বিএসটিআই মানদণ্ডের সাথে তুলনা:',
    parameterCol: 'পরীক্ষিত প্যারামিটার',
    bstiStandardCol: 'বিএসটিআই অনুমোদিত মান',
    miladResultCol: 'মিলাদ ওয়াটার টেস্ট ফলাফল',
    statusCol: 'মান যাচাই',
    downloadReportBtn: 'অফিসিয়াল টেস্ট সার্টিফিকেট (PDF) ডাউনলোড',
    factoryTourTitle: 'ফ্যাক্টরি পরিদর্শন ও ওপেন ডোর পলিসি',
    factoryTourDesc: 'আমাদের মিরবক্সটুলা ফ্যাক্টরিতে যেকোনো গ্রাহক বা কর্পোরেট প্রতিনিধি সশরীরে এসে ফিল্ট্রেশন ও জার ওয়াশিং প্রক্রিয়া দেখতে পারেন।'
  },

  events: {
    badge: 'অনুষ্ঠান ও কর্পোরেট পানি সাপ্লাই',
    title: 'বিয়ে, সেমিনার ও ইভেন্টের জন্য বাল্ক পানি বুকিং',
    subtitle: 'যেকোনো বড় পারিবারিক ও সামাজিক অনুষ্ঠানে বরফ-ঠাণ্ডা পানি, ডিসপেনসার ও গ্লাসের সার্বিক দায়িত্ব আমাদের।',
    eventNamePlaceholder: 'অনুষ্ঠানের নাম (যেমন: বিবাহোত্তর সংবর্ধনা)',
    eventTypePlaceholder: 'অনুষ্ঠানের ধরন (বিয়ে/কনফারেন্স/পার্টি)',
    guestCountPlaceholder: 'আনুমানিক মেহমান সংখ্যা',
    eventDateLabel: 'অনুষ্ঠানের তারিখ',
    eventTimeLabel: 'পানি পৌঁছানোর সময়',
    venueAddressPlaceholder: 'কমিউনিটি সেন্টার বা ভেন্যুর সম্পূর্ণ ঠিকানা',
    dispenserNeedLabel: 'ডিসপেনসার ও পানির পট লাগবে?',
    chilledNeedLabel: 'ঠাণ্ডা পানির ব্যবস্থা প্রয়োজন?',
    notesPlaceholder: 'অন্যান্য বিশেষ কোনো নির্দেশনা থাকলে লিখুন...',
    submitQuoteBtn: 'বাল্ক কোটেশন ও বুকিং অনুরোধ পাঠান',
    corporatePerksTitle: 'ইভেন্ট সাপ্লাইয়ের বিশেষ সুবিধাসমূহ:',
    perk1: 'অনুষ্ঠানের সময় অনুযায়ী অন-টাইম ফ্রি ভেন্যু ডেলিভারি',
    perk2: 'প্রয়োজনমাফিক অতিরিক্ত রিফিল জার ব্যাকআপ রাখার সুবিধা',
    perk3: 'অব্যবহৃত অক্ষত জার ফেরত নেওয়ার ব্যবস্থা',
    perk4: 'বড় অর্ডারে স্পেশাল করপোরেট ডিসকাউন্ট'
  },

  dashboard: {
    title: 'কাস্টমার ড্যাশবোর্ড ও পোর্টাল',
    welcome: 'স্বাগতম,',
    walletBalance: 'আপনার ওয়ালেট ব্যালেন্স',
    topUpWallet: 'ব্যালেন্স রিচার্জ করুন',
    jarsAtHome: 'আপনার কাছে থাকা খালি জার',
    activeSubscription: 'সক্রিয় মাসিক প্যাকেজ',
    tabOverview: 'সারসংক্ষেপ',
    tabSubscriptions: 'সাবস্ক্রিপশন প্ল্যান',
    tabOrders: 'অর্ডার হিস্ট্রি',
    tabAddresses: 'সংরক্ষিত ঠিকানা',
    tabReferrals: 'রেফারেল ও আয়',
    liveDeliveryTracking: 'লাইভ ডেলিভারি স্ট্যাটাস',
    driverAssigned: 'নিযুক্ত ডেলিভারি ম্যান',
    callDriver: 'ড্রাইভারকে কল করুন',
    invoiceBtn: 'ইনভয়েস ডাউনলোড',
    reorderBtn: 'পুনরায় অর্ডার করুন',
    noOrdersFound: 'কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি।',
    addAddressBtn: 'নতুন ঠিকানা যুক্ত করুন'
  },

  admin: {
    title: 'ফ্যাক্টরি ম্যানেজমেন্ট ও কন্ট্রোল কনসোল',
    subtitle: 'মিরবক্সটুলা কারখানা উৎপাদন, স্টক, লাইভ রুট ও অর্ডার ট্র্যাকিং',
    tabOverview: 'অপারেশনাল ড্যাশবোর্ড',
    tabOrders: 'সকল গ্রাহক অর্ডার',
    tabInventory: 'জার ইনভেন্টরি ও ল্যাব',
    tabZones: 'সিলেট ডেলিভারি জোন',
    tabWhatsApp: 'হোয়াটসঅ্যাপ মেসেজিং লগ',
    todayProduction: 'আজকের মোট পানি বোতলজাত',
    activeDeliveries: 'রাস্তায় চলমান ডেলিভারি গাড়ি',
    totalOrdersToday: 'আজকের মোট অর্ডার',
    sterilizedJarsReady: 'ফ্যাক্টরিতে রেডি জীবাণুমুক্ত জার',
    waterQualityStats: 'রিয়েল-টাইম পানির মান (TDS ও pH)',
    assignDriverModal: 'ডেলিভারি ম্যান নিযুক্ত করুন',
    updateStatusModal: 'অর্ডার স্ট্যাটাস আপডেট',
    exportReportBtn: 'দৈনিক সামারি এক্সপোর্ট'
  },

  referrals: {
    badge: 'বন্ধুদের জানান ও বোনাস জিতুন',
    title: 'মিলাদ ওয়াটার রেফারেল প্রোগ্রাম',
    subtitle: 'আপনার রেফারেল কোড বন্ধুদের সাথে শেয়ার করুন। তারা প্রথম অর্ডারে পাবেন ৳৫০ ছাড় এবং আপনার ওয়ালেটে যোগ হবে ৳৫০ ক্যাশব্যাক!',
    yourCode: 'আপনার ইউনিক রেফারেল কোড',
    copyCodeBtn: 'কোড কপি করুন',
    shareWhatsAppBtn: 'হোয়াটসঅ্যাপে বন্ধুদের জানান',
    earnedTotal: 'মোট অর্জিত রিওয়ার্ড',
    friendsJoined: 'সফল রেফারেল সংখ্যা',
    howItWorks1: '১. বন্ধুদের রেফারেল কোড দিন',
    howItWorks2: '২. তারা প্রথম অর্ডারে ৳৫০ ছাড় পাবেন',
    howItWorks3: '৩. ডেলিভারি সম্পন্ন হলে আপনার ওয়ালেটে ৳৫০ ক্যাশব্যাক আসবে'
  },

  cart: {
    title: 'আপনার শপিং ব্যাগ',
    emptyMessage: 'আপনার ব্যাগে বর্তমানে কোনো পণ্য নেই।',
    continueShopping: 'পণ্য পছন্দ করুন',
    exchangeYes: 'খালি জার বদল (জামানত ৳০)',
    exchangeNo: 'নতুন জার (+৳২০০ জামানত)',
    itemCount: 'আইটেম সংখ্যা',
    estimatedDelivery: 'আনুমানিক ডেলিভারি সময়: ১-২ ঘণ্টা',
    checkoutBtn: 'অর্ডার সম্পূর্ণ করতে এগিয়ে যান'
  },

  checkout: {
    title: 'অর্ডার ও ডেলিভারি কনফার্মেশন',
    subtitle: 'সিলেট শহরের জন্য সরাসরি হোম ডেলিভারি ও পেমেন্ট পেজ',
    stepAddress: '১. ডেলিভারির সঠিক ঠিকানা',
    stepDateTime: '২. ডেলিভারির তারিখ ও শিডিউল',
    stepPayment: '৩. মূল্য পরিশোধ পদ্ধতি',
    selectSavedAddress: 'সংরক্ষিত ঠিকানা থেকে বেছে নিন',
    addNewAddress: 'নতুন ঠিকানা যুক্ত করুন',
    deliveryDate: 'ডেলিভারির তারিখ',
    deliverySlot: 'সুবিধাজনক সময়',
    promoCodePlaceholder: 'প্রোমো বা রেফারেল কোড লিখুন',
    applyPromoBtn: 'প্রয়োগ করুন',
    orderSummary: 'অর্ডারের মোট হিসাব',
    confirmAndPlaceBtn: 'অর্ডার কনফার্ম করুন',
    orderSuccessTitle: 'ধন্যবাদ! আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে',
    orderSuccessInvoice: 'ইনভয়েস নম্বর:'
  },

  footer: {
    description: 'মিরবক্সটুলা, সিলেটে নিজস্ব ওয়াটার ট্রিটমেন্ট প্ল্যান্ট থেকে উৎপাদিত ১০০% বিশুদ্ধ ও বিএসটিআই অনুমোদিত জার ও বোতলজাত পানি। নির্ভরযোগ্য ও দ্রুততম হোম ও অফিস ডেলিভারি।',
    installApp: 'অ্যান্ড্রয়েড / আইওএস অ্যাপ ইনস্টল করুন',
    servicesHeading: 'আমাদের সেবাসমূহ',
    quickOrderLink: 'জরুরি ইনস্ট্যান্ট অর্ডার (১-২ ঘণ্টা)',
    catalogLink: 'পণ্য ও ডিসপেনসার ক্যাটালগ',
    subscriptionLink: 'সাপ্তাহিক ও মাসিক সাবস্ক্রিপশন',
    eventLink: 'বিবাহ ও সামাজিক অনুষ্ঠানের পানি',
    calculatorLink: 'মাসিক পানি ও খরচ ক্যালকুলেটর',
    coverageHeading: 'সিলেট শহরে কভারেজ এলাকা',
    coverageSub: 'সিলেট সিটি কর্পোরেশনের প্রায় সকল ওয়ার্ডে সার্বক্ষণিক নিজস্ব ডেলিভারি ভ্যান ও রাইডার নেটওয়ার্ক:',
    contactHeading: 'কারখানা ও যোগাযোগ',
    addressLine: 'মিরবক্সটুলা মেইন রোড, সিলেট ৩১০০',
    callDirect: 'সরাসরি কল',
    whatsappDirect: 'হোয়াটসঅ্যাপ মেসেজ',
    deliveryHours: 'সকাল ৭:০০ - রাত ১০:০০ (সপ্তাহে ৭ দিন খোলা)',
    customerPortalLink: 'কাস্টমার পোর্টাল ও ট্র্যাকিং',
    adminPanelLink: 'অ্যাডমিন ড্যাশবোর্ড',
    copyright: '© ২০২৬ মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) - সর্বস্বত্ব সংরক্ষিত।',
    factoryAddress: 'মিরবক্সটুলা মেইন রোড, সিলেট ৩১০০',
    factoryLocationDesc: 'সিলেট শহরের প্রাণকেন্দ্রে অবস্থিত নিজস্ব সার্বক্ষণিক ফিল্ট্রেশন প্ল্যান্ট ও ডিস্ট্রিবিউশন হাব।',
    hotlineTitle: 'জরুরি কাস্টমার কেয়ার ও অর্ডার হটলাইন',
    hotlineNumbers: '+৮৮০ ১৭১১-১০২৪৪৮',
    emailTitle: 'ইমেইল যোগাযোগ',
    quickLinksTitle: 'প্রয়োজনীয় লিংকসমূহ',
    coverageAreasTitle: 'সিলেট শহরের ডেলিভারি জোনসমূহ',
    coverageAreasList: [
      'মিরবক্সটুলা',
      'জিন্দাবাজার',
      'আম্বরখানা',
      'দরগাহ গেট',
      'লামাবাজার',
      'রিকাবীবাজার',
      'মিরাবাজার',
      'শিবগঞ্জ',
      'টিলাগড়',
      'উপশহর',
      'পাঠানটুলা',
      'সুবিদবাজার'
    ],
    bstiNotice: 'বিএসটিআই রেজিস্ট্রেশন নম্বর: BDS 1414:2000 • শতভাগ ফুড-গ্রেড ও স্বাস্থ্যসম্মত খাদ্য অধিদপ্তর অনুমোদিত।',
    openHours: 'সকাল ০৭:০০ টা হতে রাত ১০:০০ টা (সপ্তাহের ৭ দিন খোলা)'
  }
};

export const englishTranslations: TranslationDictionary = {
  appName: 'Milad Drinking Water',
  appTagline: 'Sylhet City’s Trusted & BSTI Certified Pure Mineral Water',
  currency: '৳',
  taka: 'BDT',
  perJar: 'per jar',
  perBottle: 'per bottle',
  perCase: 'per case',
  freeDelivery: 'Free Doorstep Delivery',
  sylhetCoverage: 'Comprehensive delivery coverage across Sylhet metropolitan area',
  sylhetFactory: 'Mirboxtula Mineral Water Plant & Hub',
  mirboxtula: 'Mirboxtula, Sylhet',
  cashOnDelivery: 'Cash on Delivery (Pay upon receiving)',
  orderNow: 'Order Now',
  addToCart: 'Add to Cart',
  viewCart: 'View Cart',
  checkoutLabel: 'Checkout Order',
  quantity: 'Quantity',
  total: 'Total',
  subtotal: 'Subtotal',
  deposit: 'Jar Deposit',
  discount: 'Discount',
  grandTotal: 'Grand Total Payable',
  deliveryFee: 'Delivery Fee',
  save: 'Save',
  cancel: 'Cancel',
  confirm: 'Confirm',
  close: 'Close',
  back: 'Back',
  loading: 'Please wait...',
  viewAll: 'View All',
  callNow: 'Direct Hotline Call',
  whatsApp: 'WhatsApp Chat',
  copy: 'Copy',
  copied: 'Copied!',
  apply: 'Apply',
  remove: 'Remove',
  login: 'Sign In',
  logout: 'Sign Out',
  myAccount: 'My Account',
  adminPanel: 'Factory Admin Console',
  customerDashboard: 'Customer Dashboard',
  verified: 'Verified',
  active: 'Active',
  paused: 'Paused',
  cancelled: 'Cancelled',
  completed: 'Completed',
  pending: 'Pending Confirmation',
  confirmed: 'Order Confirmed',
  outForDelivery: 'Out for Delivery',
  delivered: 'Successfully Delivered',
  processing: 'Bottling & Sanitization in Progress',
  days: {
    sat: 'Saturday',
    sun: 'Sunday',
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday'
  },
  timeSlots: {
    morning: 'Morning 08:00 AM - 11:00 AM',
    noon: 'Afternoon 02:00 PM - 05:00 PM',
    evening: 'Evening 06:00 PM - 09:00 PM',
    custom: 'Express Urgent Delivery (Within 1 Hour)'
  },

  nav: {
    home: 'Home',
    products: 'Products & Pricing',
    subscriptions: 'Monthly Plans',
    calculator: 'Cost Calculator',
    events: 'Event & Bulk Supply',
    quality: 'Lab Reports & Standards',
    referrals: 'Refer & Earn (৳50)',
    admin: 'Factory Admin',
    moreServices: 'More Services',
    myOrders: 'My Orders & Account',
    loginRegister: 'Login / Register',
    hotline: 'Hotline: +8801711102448',
    whatsappOrder: 'Order via WhatsApp',
    cart: 'Cart',
    wallet: 'Wallet Balance',
    jarsHeld: 'Empty Jars Held'
  },

  hero: {
    badge: 'Sylhet City Factory • Mirboxtula Hub',
    titleLine1: 'Pure Mineral Drinking Water',
    titleLine2: 'Delivered to Home & Office',
    subtitle: 'From our Mirboxtula factory, get 20 Liter refill jars for just ৳80. Zero advance payment with fast cash-on-delivery across Sylhet.',
    priceHighlight: '৳80 / 20L Refill',
    statRefill: '৳80 Refill',
    statRefillSub: '20L Food-Grade Jar',
    statDelivery: 'Free Delivery',
    statDeliverySub: 'Across Sylhet City',
    statPayment: 'Cash on Delivery',
    statPaymentSub: 'Pay after receiving water',
    btnOrder: 'Easy Direct Water Order',
    btnCall: '+8801711102448',
    btnWhatsApp: 'WhatsApp Chat',
    step1Title: '1. Select Jar Quantity',
    step1Desc: 'Choose refill exchange or fresh jars',
    step2Title: '2. Provide Name & Address',
    step2Desc: 'Fast delivery anywhere in Sylhet city',
    step3Title: '3. Pay upon Delivery',
    step3Desc: 'Pay via Cash, bKash, Nagad, or Wallet',
    bstiReassurance: 'BSTI BDS 1414 Certified 7-Stage Reverse Osmosis (RO) + UV Sterilized Sweet Mineral Water'
  },

  easyOrder: {
    badge: 'Fast 1-Minute Direct Order',
    title: 'Instant Water Delivery Request',
    subtitle: 'Order directly with your delivery address and jar count without complex registration forms.',
    step1Label: '1. Select Water Type & Quantity',
    step2Label: '2. Delivery Address & Contact',
    step3Label: '3. Schedule & Payment Mode',
    selectJarType: 'Choose Bottle Size:',
    jar20LTitle: '20 Liter Mineral Jar',
    jar20LPrice: '৳80 / Refill',
    jar20LDesc: 'Most economical food-grade polycarbonate jar for home and office',
    bottle5LTitle: '5 Liter Handle Bottle',
    bottle5LPrice: '৳35 / Bottle',
    bottle5LDesc: 'Convenient lightweight bottle with built-in handle for dining tables',
    exchangeToggleLabel: 'Do you have empty jars for exchange?',
    exchangeToggleYes: 'Yes, I will return empty jars (Deposit ৳0)',
    exchangeToggleNo: 'No, I need new jars with deposit (+৳200/jar refundable)',
    exchangeDepositNote: 'No security deposit charged when exchanging empty food-grade jars.',
    pumpAddonTitle: 'Add Automatic Electric Jar Pump',
    pumpAddonPrice: '+৳450',
    pumpAddonDesc: 'One-touch USB rechargeable automatic dispenser pump (Optional)',
    namePlaceholder: 'Enter your full name',
    phonePlaceholder: 'Mobile number (e.g. 01711102448)',
    areaLabel: 'Select Sylhet Area',
    areaSelectPlaceholder: 'Select your locality...',
    addressPlaceholder: 'House #, Flat/Floor, Road name and nearby landmark',
    timeSlotLabel: 'Preferred Delivery Time Slot',
    paymentMethodLabel: 'Payment Method',
    codLabel: 'Cash on Delivery (Pay when water arrives)',
    bkashLabel: 'bKash / Nagad / Rocket Mobile Banking',
    walletLabel: 'Pay using Customer Wallet Balance',
    orderSummaryTitle: 'Order Summary',
    waterCost: 'Water Refill Cost',
    jarDepositFee: 'Jar Security Deposit',
    pumpCost: 'Pump / Dispenser Price',
    netPayable: 'Total Payable Amount',
    placeOrderBtn: 'Confirm Order (Cash on Delivery)',
    successTitle: 'Your order has been placed successfully!',
    successMessage: 'Fresh sterilized mineral water is being packaged at our Mirboxtula factory for dispatch.',
    trackOrderBtn: 'Track Order & View Invoice'
  },

  calculator: {
    badge: 'Water Cost & Savings Calculator',
    title: 'How much pure water does your home or team need?',
    subtitle: 'Calculate daily hydration requirements and discover how much money and plastic you save with Milad Water refill compared to single-use bottles.',
    step1: '1. Select Usage Category',
    homeType: 'Home & Family',
    homeTypeDesc: 'For residences and apartments',
    officeType: 'Office & Business',
    officeTypeDesc: 'For shops, clinics, and corporate teams',
    step2: '2. Number of Family Members or Staff',
    peopleCount: 'Headcount',
    persons: 'people',
    step3: '3. Preferred Bottle Size',
    jar20LChoice: '20L Refill Jar (৳80/jar)',
    bottle5LChoice: '5L Handle Bottle (৳35/bottle)',
    cookingToggle: 'Include pure water for cooking & tea?',
    cookingToggleDesc: 'Recommended for healthier meals (+1.5L per person per day)',
    recommendedHeader: 'Recommended Weekly Hydration Plan',
    weeklySuggestion: 'Jars needed per week',
    monthlyTotalWater: 'Total Monthly Consumption',
    miladCost: 'Milad Factory Monthly Cost',
    monthlySavings: 'Your Estimated Monthly Savings',
    savingsSubtext: 'Compared to standard 1.5L or 500ml retail bottles',
    plasticSaved: 'Single-Use Plastic Bottles Eliminated',
    plasticSavedSubtext: 'Achieved through eco-friendly circular food-grade polycarbonate jars',
    subscribeBtn: 'Subscribe to this Monthly Plan'
  },

  catalog: {
    badge: 'Direct from Factory',
    title: 'Product & Accessories Catalog',
    subtitle: 'Order one-time water deliveries or purchase rechargeable pumps and ceramic dispensers.',
    allCategory: 'All Products',
    jarsCategory: '20 Liter Jars',
    bottlesCategory: '5L & Small Bottles',
    dispensersCategory: 'Dispensers & Pumps',
    accessoriesCategory: 'Accessories & Spares',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    featuresLabel: 'Key Highlights:',
    refillExchangeNote: 'Zero deposit when exchanging an empty jar',
    depositIncludedNote: 'One-time refundable security deposit for first-time buyers',
    selectQty: 'Quantity:',
    addToCartBtn: 'Add to Cart',
    exchangeJarOption: 'Exchange empty jar (৳0 Deposit)',
    newJarOption: 'New jar with deposit (+৳200)'
  },

  subscriptions: {
    badge: 'Scheduled Recurring Deliveries',
    title: 'Smart Monthly Water Subscriptions',
    subtitle: 'Never worry about ordering again. Get fresh mineral water delivered automatically on your chosen days.',
    popularBadge: 'Most Popular',
    planFamilyTitle: 'Family Hydration Plan',
    planFamilyDesc: 'Ideal for 4-6 member households (2 deliveries per week)',
    planOfficeTitle: 'Corporate Office Plan',
    planOfficeDesc: 'Continuous pure water supply for productive teams and staff',
    planCustomTitle: 'Custom Subscription Builder',
    planCustomDesc: 'Customize your delivery frequency, days, and jar volume',
    frequencyLabel: 'Delivery Frequency:',
    frequencyWeekly1: '1 Day per week (4 deliveries/mo)',
    frequencyWeekly2: '2 Days per week (8 deliveries/mo)',
    frequencyWeekly3: '3 Days per week (12 deliveries/mo)',
    frequencyDaily: 'Every Working Day (Office package)',
    chooseDays: 'Select Delivery Days:',
    chooseTime: 'Select Delivery Time Slot:',
    perDelivery: 'Cost per delivery',
    monthlyEstimate: 'Estimated monthly bill',
    autoWalletDeduct: 'Auto-debit from customer wallet',
    activateBtn: 'Activate Subscription',
    pauseResumeInfo: 'Easily pause or resume your plan during vacations directly from your customer portal.'
  },

  quality: {
    badge: 'Lab Testing & Filtration Standards',
    title: '7-Stage Advanced Multi-Barrier Purification',
    subtitle: 'Processed with modern Reverse Osmosis (RO) and UV technology to deliver crystal clear, sweet mineral drinking water meeting BDS 1414 standards.',
    bstiBadge: 'BSTI BDS 1414 Certified',
    isoBadge: 'Food-Grade Certified Facility',
    tdsBadge: 'TDS < 35 PPM (Optimal Sweet Taste)',
    phBadge: 'Balanced pH 7.4',
    step1Title: '1. Sediment Pre-Filtration',
    step1Desc: 'Removes sand, silt, suspended particles, and physical turbidity.',
    step2Title: '2. Activated Granular Carbon',
    step2Desc: 'Eliminates chlorine, volatile organic chemicals, and unwanted odors.',
    step3Title: '3. Micron Polishing Filter',
    step3Desc: '5-micron membrane traps microscopic residues and ultrafine particles.',
    step4Title: '4. High-Pressure RO Membrane',
    step4Desc: '0.0001-micron pores separate heavy metals, arsenic, nitrates, and dissolved solids.',
    step5Title: '5. Mineral Remineralization',
    step5Desc: 'Restores essential dietary electrolytes including calcium and magnesium.',
    step6Title: '6. Ultraviolet (UV) Disinfection',
    step6Desc: 'High-intensity UV-C lamps eliminate 99.99% of bacteria, cysts, and viruses.',
    step7Title: '7. Ozone Sanitization & Automated Filling',
    step7Desc: 'Jars are sterilized in closed chambers and sealed under positive pressure.',
    labReportTitle: 'Latest Water Quality & Chemical Analysis Report',
    labReportDesc: 'Tested and verified against Bangladesh Standards and Testing Institution (BSTI) BDS 1414:2000 specifications:',
    parameterCol: 'Tested Parameter',
    bstiStandardCol: 'BSTI Standard Limit',
    miladResultCol: 'Milad Water Test Reading',
    statusCol: 'Compliance',
    downloadReportBtn: 'Download Official Lab Certificate (PDF)',
    factoryTourTitle: 'Open Factory Visit Policy',
    factoryTourDesc: 'Customers and corporate partners are warmly welcome to visit our Mirboxtula plant to inspect our hygiene and bottling operations firsthand.'
  },

  events: {
    badge: 'Event & Corporate Water Supply',
    title: 'Bulk Water Booking for Weddings & Seminars',
    subtitle: 'We provide chilled mineral water, dispensers, disposable cups, and on-site logistics for large celebrations and events.',
    eventNamePlaceholder: 'Event Name (e.g. Wedding Reception / Annual Conference)',
    eventTypePlaceholder: 'Event Type (Wedding / Seminar / Festival / Sports)',
    guestCountPlaceholder: 'Estimated Guest Count',
    eventDateLabel: 'Event Date',
    eventTimeLabel: 'Required Setup Time',
    venueAddressPlaceholder: 'Venue or Community Center Full Address',
    dispenserNeedLabel: 'Dispenser stands and pots needed?',
    chilledNeedLabel: 'Chilled cold water required?',
    notesPlaceholder: 'Any special instructions or delivery requirements...',
    submitQuoteBtn: 'Request Bulk Quote & Reservation',
    corporatePerksTitle: 'Event Supply Advantages:',
    perk1: 'Punctual venue delivery coordinated with event schedule',
    perk2: 'Extra backup jars provided on standby with full return flexibility',
    perk3: 'Full refund for unopened, unused sealed jars',
    perk4: 'Special discounted bulk commercial rates'
  },

  dashboard: {
    title: 'Customer Portal & Dashboard',
    welcome: 'Welcome back,',
    walletBalance: 'Your Wallet Balance',
    topUpWallet: 'Top-Up Wallet',
    jarsAtHome: 'Empty Jars Held',
    activeSubscription: 'Active Subscription Plan',
    tabOverview: 'Overview',
    tabSubscriptions: 'My Subscriptions',
    tabOrders: 'Order History',
    tabAddresses: 'Saved Addresses',
    tabReferrals: 'Referral Rewards',
    liveDeliveryTracking: 'Live Delivery Status',
    driverAssigned: 'Assigned Driver',
    callDriver: 'Call Driver',
    invoiceBtn: 'Download Invoice',
    reorderBtn: 'Reorder Again',
    noOrdersFound: 'No past orders recorded yet.',
    addAddressBtn: 'Add New Address'
  },

  admin: {
    title: 'Factory Management & Control Console',
    subtitle: 'Mirboxtula plant bottling inventory, dispatch logistics, and live orders',
    tabOverview: 'Operations Overview',
    tabOrders: 'Customer Orders',
    tabInventory: 'Jar Inventory & Lab',
    tabZones: 'Sylhet Delivery Zones',
    tabWhatsApp: 'WhatsApp Dispatch Logs',
    todayProduction: 'Today’s Total Water Bottled',
    activeDeliveries: 'Active Vehicles on Route',
    totalOrdersToday: 'Orders Received Today',
    sterilizedJarsReady: 'Sterilized Jars in Storage',
    waterQualityStats: 'Real-Time Water Purity (TDS & pH)',
    assignDriverModal: 'Assign Delivery Partner',
    updateStatusModal: 'Update Order Status',
    exportReportBtn: 'Export Daily Summary'
  },

  referrals: {
    badge: 'Spread the Word & Earn',
    title: 'Milad Water Referral Program',
    subtitle: 'Share your exclusive referral link with friends. They get ৳50 discount on their first order, and you earn ৳50 wallet credit instantly upon delivery!',
    yourCode: 'Your Unique Referral Code',
    copyCodeBtn: 'Copy Code',
    shareWhatsAppBtn: 'Share on WhatsApp',
    earnedTotal: 'Total Credits Earned',
    friendsJoined: 'Successful Referrals',
    howItWorks1: '1. Share your code with friends & family',
    howItWorks2: '2. They get ৳50 OFF their first order',
    howItWorks3: '3. You earn ৳50 wallet credit after their delivery completes'
  },

  cart: {
    title: 'Your Order Basket',
    emptyMessage: 'Your cart is currently empty.',
    continueShopping: 'Browse Products',
    exchangeYes: 'Jar Exchange (৳0 Deposit)',
    exchangeNo: 'New Jar (+৳200 Deposit)',
    itemCount: 'Items',
    estimatedDelivery: 'Estimated Delivery: 1 - 2 Hours',
    checkoutBtn: 'Proceed to Checkout'
  },

  checkout: {
    title: 'Order & Delivery Confirmation',
    subtitle: 'Direct home delivery and payment for Sylhet City',
    stepAddress: '1. Delivery Address',
    stepDateTime: '2. Date & Time Slot',
    stepPayment: '3. Payment Method',
    selectSavedAddress: 'Choose from saved addresses',
    addNewAddress: 'Add New Address',
    deliveryDate: 'Delivery Date',
    deliverySlot: 'Preferred Time Slot',
    promoCodePlaceholder: 'Enter Promo / Referral Code',
    applyPromoBtn: 'Apply',
    orderSummary: 'Order Breakdown',
    confirmAndPlaceBtn: 'Confirm & Place Order',
    orderSuccessTitle: 'Thank You! Your order has been placed successfully',
    orderSuccessInvoice: 'Invoice Reference:'
  },

  footer: {
    description: '100% BSTI certified pure drinking water purified at our dedicated treatment plant in Mirboxtula, Sylhet. Fast and dependable delivery for homes, offices, and events.',
    installApp: 'Install Mobile App (Android / iOS)',
    servicesHeading: 'Our Services',
    quickOrderLink: 'Instant Order (1-2 Hours)',
    catalogLink: 'Products & Accessories Catalog',
    subscriptionLink: 'Weekly & Monthly Subscriptions',
    eventLink: 'Event & Bulk Water Supply',
    calculatorLink: 'Hydration & Cost Calculator',
    coverageHeading: 'Sylhet Delivery Coverage',
    coverageSub: 'Fleet and rider coverage across all central Sylhet City Corporation areas:',
    contactHeading: 'Factory & Contact',
    addressLine: 'Mirboxtula Main Road, Sylhet 3100',
    callDirect: 'Direct Call',
    whatsappDirect: 'WhatsApp Message',
    deliveryHours: '07:00 AM - 10:00 PM (Open 7 days a week)',
    customerPortalLink: 'Customer Portal & Tracking',
    adminPanelLink: 'Admin Dashboard',
    copyright: '© 2026 Milad Drinking Water (Mirboxtula, Sylhet) - All rights reserved.',
    factoryAddress: 'Mirboxtula Main Road, Sylhet 3100',
    factoryLocationDesc: 'Centrally located water purification factory and distribution facility in the heart of Sylhet.',
    hotlineTitle: '24/7 Customer Care & Order Hotline',
    hotlineNumbers: '+880 1711-102448',
    emailTitle: 'Email Inquiries',
    quickLinksTitle: 'Quick Links',
    coverageAreasTitle: 'Sylhet Delivery Coverage Areas',
    coverageAreasList: [
      'Mirboxtula',
      'Zindabazar',
      'Amberkhana',
      'Dargah Gate',
      'Lamabazar',
      'Rikabibazar',
      'Mirabazar',
      'Shibganj',
      'Tilagarh',
      'Upashahar',
      'Pathantula',
      'Subidbazar'
    ],
    bstiNotice: 'BSTI Registration: BDS 1414:2000 • 100% Food-Grade and Certified by Health Authorities.',
    openHours: '07:00 AM - 10:00 PM (Open 7 days a week)'
  }
};
