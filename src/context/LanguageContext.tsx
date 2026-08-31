import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationDictionary, banglaTranslations, englishTranslations } from '../lib/translations';
import { OrderStatus, ProductCategory } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
  formatNumber: (num: number | string) => string;
  formatCurrency: (amount: number) => string;
  formatDate: (dateStr: string) => string;
  translateStatus: (status: OrderStatus) => string;
  translateCategory: (category: ProductCategory | string) => string;
  translateDay: (day: string) => string;
}

const bnDigits: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('milad_lang') as Language | null;
    return saved === 'en' ? 'en' : 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('milad_lang', lang);
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = language === 'bn' ? banglaTranslations : englishTranslations;

  const formatNumber = (num: number | string): string => {
    const str = String(num);
    if (language === 'en') return str;
    return str.replace(/[0-9]/g, (d) => bnDigits[d] || d);
  };

  const formatCurrency = (amount: number): string => {
    const formattedNum = formatNumber(amount.toLocaleString());
    return `৳${formattedNum}`;
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'today') return language === 'bn' ? 'আজ' : 'Today';
    if (dateStr.toLowerCase() === 'tomorrow') return language === 'bn' ? 'আগামীকাল' : 'Tomorrow';
    
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      
      if (language === 'bn') {
        const monthsBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        const dayBn = formatNumber(d.getDate());
        const monthBn = monthsBn[d.getMonth()];
        const yearBn = formatNumber(d.getFullYear());
        return `${dayBn} ${monthBn} ${yearBn}`;
      } else {
        return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    } catch {
      return dateStr;
    }
  };

  const translateStatus = (status: OrderStatus): string => {
    if (language === 'bn') {
      switch (status) {
        case 'pending': return 'অপেক্ষমাণ';
        case 'confirmed': return 'নিশ্চিতকৃত';
        case 'sterilizing_bottling': return 'বোতলজাতকরণ চলছে';
        case 'out_for_delivery': return 'ডেলিভারির পথে';
        case 'delivered': return 'ডেলিভারি সম্পন্ন';
        case 'cancelled': return 'বাতিলকৃত';
        default: return status;
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending Confirmation';
        case 'confirmed': return 'Order Confirmed';
        case 'sterilizing_bottling': return 'Sterilizing & Bottling';
        case 'out_for_delivery': return 'Out for Delivery';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return (status as string).replace(/_/g, ' ');
      }
    }
  };

  const translateCategory = (category: ProductCategory | string): string => {
    if (language === 'bn') {
      switch (category) {
        case 'water_jar': return '২০ লিটার জার';
        case 'water_bottle': return '৫ লিটার ও ছোট বোতল';
        case 'dispenser': return 'ডিসপেনসার ও পাম্প';
        case 'accessories': return 'এক্সেসরিজ';
        case 'event_bulk': return 'ইভেন্ট ও বাল্ক সাপ্লাই';
        default: return category;
      }
    } else {
      switch (category) {
        case 'water_jar': return '20L Water Jars';
        case 'water_bottle': return '5L & Small Bottles';
        case 'dispenser': return 'Dispensers & Pumps';
        case 'accessories': return 'Accessories';
        case 'event_bulk': return 'Event & Bulk Supply';
        default: return category.replace(/_/g, ' ');
      }
    }
  };

  const translateDay = (day: string): string => {
    if (language === 'en') {
      const map: Record<string, string> = {
        'শনিবার': 'Saturday',
        'রবিবার': 'Sunday',
        'সোমবার': 'Monday',
        'মঙ্গলবার': 'Tuesday',
        'বুধবার': 'Wednesday',
        'বৃহস্পতিবার': 'Thursday',
        'শুক্রবার': 'Friday',
      };
      return map[day] || day;
    } else {
      const map: Record<string, string> = {
        'Saturday': 'শনিবার',
        'Sunday': 'রবিবার',
        'Monday': 'সোমবার',
        'Tuesday': 'মঙ্গলবার',
        'Wednesday': 'বুধবার',
        'Thursday': 'বৃহস্পতিবার',
        'Friday': 'শুক্রবার',
      };
      return map[day] || day;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatCurrency,
        formatDate,
        translateStatus,
        translateCategory,
        translateDay,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
