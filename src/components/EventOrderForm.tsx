import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  DollarSign, 
  FileText,
  Phone,
  Building2,
  PartyPopper
} from 'lucide-react';
import { Order } from '../types';

export const EventOrderForm: React.FC = () => {
  const { user } = useAuth();
  const { createOrder, setCurrentView, showToast, promptLocationPicker } = useStore();

  const [eventName, setEventName] = useState<string>('Grand Corporate Summit 2026');
  const [eventType, setEventType] = useState<string>('Corporate Conference');
  const [guestCount, setGuestCount] = useState<number>(350);
  const [eventHours, setEventHours] = useState<number>(6);
  const [eventDate, setEventDate] = useState<string>('2026-09-15');
  const [eventTime, setEventTime] = useState<string>('09:00 AM');
  const [venueAddress, setVenueAddress] = useState<string>('BICC International Convention Hall, Agargaon, Dhaka');
  const [organizerName, setOrganizerName] = useState<string>(user?.displayName || 'Ahmed Hussain');
  const [organizerPhone, setOrganizerPhone] = useState<string>(user?.phone || '+880 1712-345678');
  const [organizerEmail, setOrganizerEmail] = useState<string>(user?.email || 'event@miladwater.com');

  // Package options
  const [jars20LCount, setJars20LCount] = useState<number>(15);
  const [cases500mlCount, setCases500mlCount] = useState<number>(12); // 24 bottles per case = 288 bottles
  const [rentalDispensersCount, setRentalDispensersCount] = useState<number>(4);
  const [chilledRequired, setChilledRequired] = useState<boolean>(true);
  const [onSiteStaffRequired, setOnSiteStaffRequired] = useState<boolean>(true);
  const [specialNotes, setSpecialNotes] = useState<string>('Please setup dispensers 2 hours before conference starts at 7:00 AM.');

  // Math Estimation
  // Standard event water rule of thumb: ~0.4 Liters per guest per 3 hours
  const estimatedRecommendedLiters = Math.round((guestCount * (eventHours / 3) * 0.4) + 50);

  // Price Calculation
  const jar20LCost = jars20LCount * 80;
  const cases500mlCost = cases500mlCount * 360;
  const dispenserRentalCost = rentalDispensersCount * 300; // 300 BDT per rental unit/day
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
          name: '20L Pure Mineral Water Jar (Event Supply)',
          volume: '20 Liters',
          quantity: jars20LCount,
          unitPrice: 80,
          jarDepositPaid: 0,
          emptyJarsToReturn: jars20LCount,
          totalPrice: jar20LCost
        },
        {
          productId: 'prod-500ml-case',
          name: '500ml Premium Bottles (Case of 24)',
          volume: '12 Liters (24 pcs)',
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
        tag: 'Event Venue',
        recipientName: organizerName,
        phone: organizerPhone,
        addressLine: venueAddress,
        area: 'Agargaon / Central',
        city: 'Dhaka',
        lat: 23.7772,
        lng: 90.3804
      },
      deliveryDate: eventDate,
      timeSlot: `${eventTime} Setup`,
      deliveryZone: 'Special Event Logistics Division',
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

    showToast('success', 'Event Order Received!', `Factory Event Logistics will contact you on ${organizerPhone}.`);
    setCurrentView('customer_portal');
  };

  return (
    <section className="py-14 bg-gradient-to-b from-white via-slate-50 to-cyan-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-2">
            <PartyPopper className="w-3.5 h-3.5 text-cyan-600" />
            <span>Wholesale & Event Water Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Event, Wedding & Wholesale Water Supply
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Host stress-free conferences, weddings, sports tournaments, and corporate galas with on-time chilled water dispatch, dispenser rentals, and on-site support.
          </p>
        </div>

        <form onSubmit={handleSubmitEventBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
            
            {/* Event Overview Details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-600" />
                <span>1. Event Details & Scale</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Event / Occasion Name</label>
                  <input
                    type="text"
                    required
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g. Annual Developers Conference"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Event Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                  >
                    <option value="Corporate Conference">Corporate Conference</option>
                    <option value="Wedding & Reception">Wedding & Reception</option>
                    <option value="Sports Marathon & Tournament">Sports Marathon & Tournament</option>
                    <option value="Exhibition / Expo">Exhibition / Expo</option>
                    <option value="Construction & Factory Site">Construction & Factory Site</option>
                    <option value="Educational & University Event">Educational & University Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Expected Guests</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-1">Duration (Hours)</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Setup Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 08:00 AM"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200/80 flex items-center justify-between text-xs">
                <span className="text-cyan-900 font-medium">Estimated Minimum Hydration Volume:</span>
                <span className="font-extrabold text-cyan-800 text-sm">~{estimatedRecommendedLiters} Liters</span>
              </div>
            </div>

            {/* Step 2: Required Quantities & Add-ons */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>2. Water Products & Dispenser Equipment</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800">20L Polycarbonate Jars</span>
                    <span className="text-xs font-bold text-cyan-700">৳80 / jar</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={jars20LCount}
                    onChange={(e) => setJars20LCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Total: {jars20LCount * 20} Liters</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-800">500ml Bottled Cases (24 pcs)</span>
                    <span className="text-xs font-bold text-cyan-700">৳360 / case</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={cases500mlCount}
                    onChange={(e) => setCases500mlCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Total: {cases500mlCount * 24} individual bottles</p>
                </div>
              </div>

              {/* Equipment Rental Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Rental Hot/Cold Dispensers</p>
                    <p className="text-[10px] text-slate-500">৳300 / unit per day</p>
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
                    <p className="text-xs font-bold text-slate-800">On-Site Logistics Staff</p>
                    <p className="text-[10px] text-slate-500">Dedicated refiller & stand manager (৳1,200)</p>
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
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600" />
                  <span>3. Venue Location & Contact</span>
                </h3>
                <button
                  type="button"
                  onClick={() => promptLocationPicker((addr) => {
                    setVenueAddress(`${addr.addressLine}, ${addr.area}, ${addr.city}`);
                  })}
                  className="text-xs font-bold text-cyan-700 hover:underline"
                >
                  Pin Venue on Map
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Venue Address</label>
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
                  <label className="block text-xs font-bold text-slate-600 mb-1">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Special Instructions & Delivery Gate</label>
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
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Instant Wholesale Quote
                </span>
                <h3 className="text-xl font-heading font-extrabold text-white mt-0.5">
                  {eventName}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                Bulk Tier
              </span>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>{jars20LCount}x 20L Water Jars ({jars20LCount * 20}L):</span>
                <span className="font-bold text-white">৳{jar20LCost}</span>
              </div>
              <div className="flex justify-between">
                <span>{cases500mlCount}x Cases of 500ml ({cases500mlCount * 24} pcs):</span>
                <span className="font-bold text-white">৳{cases500mlCost}</span>
              </div>
              {rentalDispensersCount > 0 && (
                <div className="flex justify-between">
                  <span>{rentalDispensersCount}x Rental Hot/Cold Dispensers:</span>
                  <span className="font-bold text-white">৳{dispenserRentalCost}</span>
                </div>
              )}
              {onSiteStaffRequired && (
                <div className="flex justify-between">
                  <span>On-Site Factory Service Support:</span>
                  <span className="font-bold text-white">৳{staffCost}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Factory Dedicated Dispatch Vehicle:</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>10% Event Wholesale Discount:</span>
                <span>- ৳{eventDiscount}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Quotation Total:</span>
                <span className="text-3xl font-extrabold text-cyan-400 font-heading">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Quality & Sterility Assurance with on-site TDS verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Arrival 2 hours prior to start time guaranteed</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-400/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Book Event Water Supply (৳{grandTotal})</span>
            </button>

          </div>

        </form>

      </div>
    </section>
  );
};
