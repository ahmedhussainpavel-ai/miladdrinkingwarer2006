import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Building2,
  PartyPopper,
  CheckCircle2,
  Check
} from 'lucide-react';
import { trackPurchase } from '../lib/analytics';

export const EventOrderForm: React.FC = () => {
  const { user } = useAuth();
  const { createOrder, setCurrentView, showToast } = useStore();
  const { language, t, formatCurrency, formatNumber } = useLanguage();

  const [eventName, setEventName] = useState<string>('');
  const [eventType, setEventType] = useState<string>(language === 'bn' ? 'বিবাহোত্তর সংবর্ধনা' : 'Wedding Reception');
  const [guestCount, setGuestCount] = useState<number>(300);
  const [eventDate, setEventDate] = useState<string>('2026-09-15');
  const [eventTime, setEventTime] = useState<string>('11:00 AM');
  const [venueAddress, setVenueAddress] = useState<string>('');
  const [organizerName, setOrganizerName] = useState<string>(user?.displayName || '');
  const [organizerPhone, setOrganizerPhone] = useState<string>(user?.phone || '');
  const [jars20LCount, setJars20LCount] = useState<number>(10);
  const [dispenserRental, setDispenserRental] = useState<boolean>(true);
  const [chilledRequired, setChilledRequired] = useState<boolean>(true);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successQuote, setSuccessQuote] = useState<boolean>(false);

  const jar20LCost = jars20LCount * 80;
  const dispenserCost = dispenserRental ? 300 : 0;
  const subtotal = jar20LCost + dispenserCost;
  const discount = Math.round(subtotal * 0.1);
  const grandTotal = subtotal - discount;

  const handleSubmitEventBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizerPhone.trim() || !venueAddress.trim()) {
      showToast('error', 'Required Fields', 'Please provide your mobile number and venue address.');
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        userId: user?.uid || 'guest-event',
        customerName: organizerName || (language === 'bn' ? 'ইভেন্ট আয়োজক' : 'Event Organizer'),
        customerPhone: organizerPhone,
        customerEmail: user?.email || '',
        type: 'event_bulk',
        items: [
          {
            productId: 'prod-20l-jar',
            name: language === 'bn' ? '২০ লিটার জার (ইভেন্ট বাল্ক)' : '20L Jar (Event Bulk)',
            volume: '20L',
            quantity: jars20LCount,
            unitPrice: 80,
            jarDepositPaid: 0,
            emptyJarsToReturn: jars20LCount,
            totalPrice: jar20LCost
          }
        ],
        subtotal,
        depositTotal: 0,
        deliveryFee: 0,
        discount,
        totalAmount: grandTotal,
        deliveryAddress: {
          id: 'venue-' + Date.now(),
          tag: 'Event Venue',
          recipientName: organizerName || 'Organizer',
          phone: organizerPhone,
          addressLine: venueAddress,
          area: 'Sylhet',
          city: 'Sylhet',
          lat: 24.8949,
          lng: 91.8687
        },
        deliveryDate: eventDate,
        timeSlot: eventTime,
        deliveryZone: 'Special Event Logistics Team',
        paymentMethod: 'cod',
        paymentStatus: 'unpaid',
        status: 'confirmed'
      });

      setSuccessQuote(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.events.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            {t.events.title}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {t.events.subtitle}
          </p>
        </div>

        {successQuote ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {language === 'bn' ? 'ইভেন্ট পানি সাপ্লাই অনুরোধ গৃহীত হয়েছে!' : 'Event Bulk Request Received!'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              {language === 'bn' ? 'আমাদের ইভেন্ট টিম আপনার ফোন নম্বরে যোগাযোগ করে ডেলিভারি ও ডিসপেনসার সেটআপের ব্যবস্থা করবে।' : 'Our logistics coordinator will call you to confirm setup time and dispenser delivery.'}
            </p>
            <button
              onClick={() => {
                setSuccessQuote(false);
                setCurrentView('customer_portal');
              }}
              className="py-3 px-6 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs cursor-pointer"
            >
              {language === 'bn' ? 'কাস্টমার ড্যাশবোর্ড দেখুন' : 'Go to Customer Portal'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
            
            {/* 4 Corporate Perks */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
              <p className="text-xs font-extrabold text-sky-900">{t.events.corporatePerksTitle}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.events.perk1}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.events.perk2}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.events.perk3}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.events.perk4}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitEventBooking} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'অনুষ্ঠানের নাম' : 'Event Name'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder={t.events.eventNamePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'আনুমানিক মেহমান সংখ্যা' : 'Guest Count'}
                  </label>
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                    placeholder={t.events.guestCountPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.events.eventDateLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.events.eventTimeLabel}
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="যেমন: সকাল ১০:০০ টা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'ভেন্যুর সম্পূর্ণ ঠিকানা' : 'Venue Full Address'} *
                </label>
                <textarea
                  required
                  rows={2}
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder={t.events.venueAddressPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'যোগাযোগকারীর নাম' : 'Contact Person'}
                  </label>
                  <input
                    type="text"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="আপনার নাম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    placeholder="০১৭১১-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              {/* Estimate Cost Box */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-slate-400">{language === 'bn' ? 'আনুমানিক প্যাকেজ মূল্য' : 'Estimated Total'}</p>
                  <p className="text-xl font-black text-white">{formatCurrency(grandTotal)}</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs cursor-pointer shadow-xs transition-all"
                >
                  {submitting ? t.loading : t.events.submitQuoteBtn}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
