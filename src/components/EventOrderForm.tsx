import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Building2,
  PartyPopper
} from 'lucide-react';
import { trackPurchase } from '../lib/analytics';

export const EventOrderForm: React.FC = () => {
  const { user } = useAuth();
  const { createOrder, setCurrentView, showToast, promptLocationPicker } = useStore();

  const [eventName, setEventName] = useState<string>('সিলেট কর্পোরেট সেমিনার');
  const [eventType, setEventType] = useState<string>('কর্পোরেট কনফারেন্স');
  const [guestCount, setGuestCount] = useState<number>(350);
  const [eventHours, setEventHours] = useState<number>(6);
  const [eventDate, setEventDate] = useState<string>('2026-09-15');
  const [eventTime, setEventTime] = useState<string>('সকাল ০৯:০০');
  const [venueAddress, setVenueAddress] = useState<string>('গ্র্যান্ড সিলেট হোটেল অ্যান্ড কনভেনশন হল, সিলেট');
  const [organizerName, setOrganizerName] = useState<string>(user?.displayName || 'আহমেদ হোসেন');
  const [organizerPhone, setOrganizerPhone] = useState<string>(user?.phone || '+8801711102448');
  const [organizerEmail, setOrganizerEmail] = useState<string>(user?.email || 'event@miladwater.com');

  // Package options
  const [jars20LCount, setJars20LCount] = useState<number>(15);
  const [cases500mlCount, setCases500mlCount] = useState<number>(12); // 24 bottles per case = 288 bottles
  const [rentalDispensersCount, setRentalDispensersCount] = useState<number>(4);
  const [chilledRequired, setChilledRequired] = useState<boolean>(true);
  const [onSiteStaffRequired, setOnSiteStaffRequired] = useState<boolean>(true);
  const [specialNotes, setSpecialNotes] = useState<string>('অনুগ্রহ করে অনুষ্ঠান শুরুর ২ ঘণ্টা পূর্বে সকাল ৭টায় সেটআপ সম্পন্ন করুন।');

  // Standard event water rule of thumb: ~0.4 Liters per guest per 3 hours
  const estimatedRecommendedLiters = Math.round((guestCount * (eventHours / 3) * 0.4) + 50);

  // Price Calculation
  const jar20LCost = jars20LCount * 80;
  const cases500mlCost = cases500mlCount * 360;
  const dispenserRentalCost = rentalDispensersCount * 300;
  const staffCost = onSiteStaffRequired ? 1200 : 0;
  const subtotal = jar20LCost + cases500mlCost + dispenserRentalCost + staffCost;
  const eventDiscount = Math.round(subtotal * 0.1); // 10% wholesale discount
  const grandTotal = subtotal - eventDiscount;

  const handleSubmitEventBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder = await createOrder({
      userId: user?.uid || 'guest-event-organizer',
      customerName: organizerName,
      customerPhone: organizerPhone,
      customerEmail: organizerEmail,
      type: 'event_bulk',
      items: [
        {
          productId: 'prod-20l-jar',
          name: '২০ লিটার মিনারেল ওয়াটার জার (ইভেন্ট স্পেশাল)',
          volume: '২০ লিটার',
          quantity: jars20LCount,
          unitPrice: 80,
          jarDepositPaid: 0,
          emptyJarsToReturn: jars20LCount,
          totalPrice: jar20LCost
        },
        {
          productId: 'prod-500ml-case',
          name: '৫০০ মি.লি. প্রিমিয়াম বোতল (২৪ পিস কেস)',
          volume: '১২ লিটার (২৪ বোতল)',
          quantity: cases500mlCount,
          unitPrice: 360,
          jarDepositPaid: 0,
          emptyJarsToReturn: 0,
          totalPrice: cases500mlCost
        }
      ],
      subtotal,
      depositTotal: 0,
      deliveryFee: 0,
      discount: eventDiscount,
      totalAmount: grandTotal,
      deliveryAddress: {
        id: 'venue-' + Date.now(),
        tag: 'অনুষ্ঠান ভেন্যু',
        recipientName: organizerName,
        phone: organizerPhone,
        addressLine: venueAddress,
        area: 'সিলেট সদর',
        city: 'সিলেট',
        lat: 24.8949,
        lng: 91.8687
      },
      deliveryDate: eventDate,
      timeSlot: `${eventTime} সেটআপ`,
      deliveryZone: 'স্পেশাল ইভেন্ট লজিস্টিক টিম',
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'pending',
      eventDetails: {
        eventName,
        eventType,
        guestCount,
        eventTime,
        dispenserNeeded: rentalDispensersCount > 0,
        chilledRequired,
        specialNotes
      },
      emptyJarsReturnedCount: 0
    });

    trackPurchase({
      orderId: newOrder.id || newOrder.invoiceNumber,
      value: grandTotal,
      paymentMethod: 'cod',
      isSubscription: false,
      deliveryArea: 'সিলেট সদর',
      items: [
        { id: 'prod-20l-jar', name: '২০ লিটার মিনারেল ওয়াটার জার', quantity: jars20LCount, price: 80 },
        { id: 'prod-500ml-case', name: '৫০০ মি.লি. বোতল কেস', quantity: cases500mlCount, price: 360 }
      ]
    });

    showToast('success', 'ইভেন্ট বুকিং গ্রহণ করা হয়েছে!', `আমাদের স্পেশাল ইভেন্ট টিম আপনার সাথে ${organizerPhone} নম্বরে যোগাযোগ করবে।`);
    setCurrentView('customer_portal');
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-3 border border-cyan-200">
            <PartyPopper className="w-4 h-4 text-cyan-700" />
            <span>ইভেন্ট, বিয়ে ও কর্পোরেট বাল্ক সাপ্লাই</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            যেকোনো বড় অনুষ্ঠানের খাবার পানির নির্ভরযোগ্য ব্যবস্থা
          </h2>
          <p className="text-slate-600 text-xs sm:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
            বিয়ে, সম্মেলন, খেলাধুলার টুর্নামেন্ট ও সামাজিক অনুষ্ঠানের জন্য সঠিক সময়ে ঠান্ডা পানি ডেলিভারি, ডিসপেনসার ভাড়া ও অভিজ্ঞ অন-সাইট সহকারী সুবিধা।
          </p>
        </div>

        <form onSubmit={handleSubmitEventBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/90 space-y-6">
            
            {/* Event Overview Details */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-600" />
                <span>১. অনুষ্ঠানের বিবরণ ও পরিধি</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অনুষ্ঠানের নাম</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="যেমন: বার্ষিক সাধারণ সভা ২০২৬"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অনুষ্ঠানের ধরন</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                  >
                    <option value="Corporate Conference">কর্পোরেট কনফারেন্স ও সেমিনার</option>
                    <option value="Wedding & Reception">বিয়ে ও রিসেপশন অনুষ্ঠান</option>
                    <option value="Sports Marathon & Tournament">ক্রীড়া প্রতিযোগিতা ও টুর্নামেন্ট</option>
                    <option value="Exhibition / Expo">মেলা ও প্রদর্শনী</option>
                    <option value="Construction & Factory Site">কনস্ট্রাকশন ও ফ্যাক্টরি প্রজেক্ট</option>
                    <option value="Educational & University Event">স্কুল, কলেজ ও বিশ্ববিদ্যালয় অনুষ্ঠান</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">অতিথি সংখ্যা</label>
                  <input
                    type="number"
                    min="20"
                    max="10000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-cyan-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সময়কাল (ঘণ্টা)</label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={eventHours}
                    onChange={(e) => setEventHours(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সেটআপ সময়</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="যেমন: সকাল ০৮:০০"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 flex items-center justify-between text-xs">
                <span className="text-cyan-900 font-medium">প্রয়োজনীয় আনুমানিক খাবার পানি:</span>
                <span className="font-black text-cyan-800 text-sm">~{estimatedRecommendedLiters} লিটার</span>
              </div>
            </div>

            {/* Step 2: Required Quantities & Add-ons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>২. পানির পরিমাণ ও ইকুইপমেন্ট রেন্টাল</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800">২০ লিটার জার</span>
                    <span className="text-xs font-bold text-cyan-700">৳৮০ / জার</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={jars20LCount}
                    onChange={(e) => setJars20LCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">মোট: {jars20LCount * 20} লিটার পানি</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800">৫০০ মি.লি. বোতল কেস (২৪ পিস)</span>
                    <span className="text-xs font-bold text-cyan-700">৳৩৬০ / কেস</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={cases500mlCount}
                    onChange={(e) => setCases500mlCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">মোট: {cases500mlCount * 24}টি বোতল</p>
                </div>
              </div>

              {/* Equipment Rental Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">হট/কোল্ড ডিসপেনসার ভাড়া</p>
                    <p className="text-[10px] text-slate-500">৳৩০০ / দিন প্রতি ইউনিট</p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={rentalDispensersCount}
                    onChange={(e) => setRentalDispensersCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-center"
                  />
                </div>

                <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">অন-সাইট সার্ভিস কর্মী</p>
                    <p className="text-[10px] text-slate-500">পানি পরিবেশন ও রিলোড সহকারী (৳১,২০০)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={onSiteStaffRequired}
                    onChange={(e) => setOnSiteStaffRequired(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Venue & Contact */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  <span>৩. ভেন্যু ঠিকানা ও যোগাযোগের তথ্য</span>
                </h3>
                <button
                  type="button"
                  onClick={() => promptLocationPicker((addr) => {
                    setVenueAddress(`${addr.addressLine}, ${addr.area}, ${addr.city}`);
                  })}
                  className="text-xs font-bold text-cyan-700 hover:underline cursor-pointer"
                >
                  ম্যাপে ভেন্যু চিহ্নিত করুন
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">সম্পূর্ণ ভেন্যু ঠিকানা</label>
                <input
                  type="text"
                  required
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আয়োজকের নাম</label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">বিশেষ নির্দেশনা বা ডেলিভারি গেট</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

          </div>

          {/* Right Live Event Quote Column */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 sticky top-24 border border-slate-800">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  ইভেন্ট কোটেশন সারসংক্ষেপ
                </span>
                <h3 className="text-lg sm:text-xl font-heading font-extrabold text-white mt-1">
                  {eventName}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                বাল্ক অফার
              </span>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>{jars20LCount}টি ২০ লিটার জার ({jars20LCount * 20}L):</span>
                <span className="font-bold text-white">৳{jar20LCost}</span>
              </div>
              <div className="flex justify-between">
                <span>{cases500mlCount} কেস ৫০০ মি.লি. ({cases500mlCount * 24} বোতল):</span>
                <span className="font-bold text-white">৳{cases500mlCost}</span>
              </div>
              {rentalDispensersCount > 0 && (
                <div className="flex justify-between">
                  <span>{rentalDispensersCount}টি হট/কোল্ড ডিসপেনসার রেন্টাল:</span>
                  <span className="font-bold text-white">৳{dispenserRentalCost}</span>
                </div>
              )}
              {onSiteStaffRequired && (
                <div className="flex justify-between">
                  <span>অন-সাইট সার্ভিস সাপোর্ট সহকারী:</span>
                  <span className="font-bold text-white">৳{staffCost}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ফ্যাক্টরি ডেডিকেটেড ডেলিভারি গাড়ি:</span>
                <span className="font-bold text-emerald-400">সম্পূর্ণ ফ্রি</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>১০% বাল্ক ডিসকাউন্ট:</span>
                <span>- ৳{eventDiscount}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">মোট প্রাক্কলিত মূল্য:</span>
                <span className="text-3xl font-black text-cyan-300 font-heading">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>শতভাগ বিএসটিআই মান ও অন-সাইট টিডিএস পরিমাপের নিশ্চয়তা</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>অনুষ্ঠান শুরুর ২ ঘণ্টা পূর্বে ভেন্যুতে সেটআপ ডেলিভারির প্রতিশ্রুতি</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>ইভেন্ট ওয়াটার সাপ্লাই বুক করুন (৳{grandTotal})</span>
            </button>

          </div>

        </form>

      </div>
    </section>
  );
};
