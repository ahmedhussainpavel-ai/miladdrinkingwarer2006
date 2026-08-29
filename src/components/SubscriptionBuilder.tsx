import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Check, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  RotateCcw, 
  ArrowRight,
  Droplet,
  Truck,
  Plus
} from 'lucide-react';
import { SubscriptionFrequency, PaymentMethod, Address } from '../types';

export const SubscriptionBuilder: React.FC = () => {
  const { user } = useAuth();
  const { createSubscription, setCurrentView, promptLocationPicker } = useStore();

  const [frequency, setFrequency] = useState<SubscriptionFrequency>('weekly_2x');
  const [bottleSize, setBottleSize] = useState<'20L' | '5L' | 'Mixed'>('20L');
  const [quantityPerDelivery, setQuantityPerDelivery] = useState<number>(2);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Thursday']);
  const [timeSlot, setTimeSlot] = useState<string>('Morning 08:00 AM - 11:00 AM');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');
  const [autoDeductWallet, setAutoDeductWallet] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeSlots = [
    'Morning 08:00 AM - 11:00 AM',
    'Afternoon 02:00 PM - 05:00 PM',
    'Evening 06:00 PM - 09:00 PM'
  ];

  const addresses = user?.savedAddresses || [];
  const currentAddress = addresses[selectedAddressIndex] || addresses[0];

  const unitPrice = bottleSize === '20L' ? 80 : 35;
  const pricePerDelivery = unitPrice * quantityPerDelivery;
  
  // Monthly calculations
  const deliveriesPerMonth = frequency === 'weekly_1x' ? 4 
    : frequency === 'weekly_2x' ? 8 
    : frequency === 'weekly_3x' ? 12 
    : 24;

  const monthlyEstimate = pricePerDelivery * deliveriesPerMonth;

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleCreateSubscription = async () => {
    if (!currentAddress) {
      alert('Please add a delivery address.');
      return;
    }
    setSubmitting(true);
    try {
      await createSubscription({
        userId: user?.uid || 'demo-user',
        customerName: user?.displayName || 'Valued Subscriber',
        customerPhone: user?.phone || '+880 1700-000000',
        customerEmail: user?.email || 'customer@miladwater.com',
        planName: `Milad ${bottleSize} Hydration (${frequency.replace('_', ' ').toUpperCase()})`,
        frequency,
        bottleSize,
        quantityPerDelivery,
        deliveryDays: selectedDays,
        timeSlot,
        deliveryAddress: currentAddress,
        pricePerDelivery,
        monthlyEstimate,
        paymentMethod,
        autoDeductWallet,
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        nextDeliveryDate: `${selectedDays[0]}, Upcoming`
      });
      setCurrentView('customer_portal');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-14 bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span>Automated Recurring Water Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
            Never Run Out of Pure Water Again
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Set your weekly delivery days and let Milad Water automatically refill your 20L jars with free doorstep delivery and seamless empty jar exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Wizard Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-8">
            
            {/* Step 1: Frequency Package */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-base font-bold text-slate-900">Choose Delivery Frequency</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_1x'); setSelectedDays(['Monday']); }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    frequency === 'weekly_1x'
                      ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-cyan-700 uppercase">Weekly 1x</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">1 Day / Week</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ideal for couples & small homes</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_2x'); setSelectedDays(['Monday', 'Thursday']); }}
                  className={`p-4 rounded-2xl border text-left transition-all relative ${
                    frequency === 'weekly_2x'
                      ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-extrabold uppercase shadow-xs">
                    Most Popular
                  </span>
                  <p className="text-xs font-bold text-cyan-700 uppercase">Weekly 2x</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">2 Days / Week</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Perfect for 4-6 person families</p>
                </button>

                <button
                  type="button"
                  onClick={() => { setFrequency('weekly_3x'); setSelectedDays(['Monday', 'Wednesday', 'Friday']); }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    frequency === 'weekly_3x'
                      ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-cyan-700 uppercase">Weekly 3x / Office</p>
                  <p className="text-sm font-bold text-slate-900 mt-1">3 Days / Week</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">For corporate offices & joint families</p>
                </button>
              </div>
            </div>

            {/* Step 2: Bottle Type & Jars per delivery */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-base font-bold text-slate-900">Select Bottle Size & Quantity</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setBottleSize('20L')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    bottleSize === '20L'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-950 font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                    20L
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">20L Standard Jars</p>
                    <p className="text-[10px] text-slate-500 font-normal">৳80 / refill</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBottleSize('5L')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    bottleSize === '5L'
                      ? 'border-cyan-500 bg-cyan-50/70 text-cyan-950 font-bold'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                    5L
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold">5L Compact Bottles</p>
                    <p className="text-[10px] text-slate-500 font-normal">৳35 / bottle</p>
                  </div>
                </button>
              </div>

              {/* Quantity Slider */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Quantity per scheduled delivery:</span>
                  <span className="px-3 py-1 bg-cyan-600 text-white rounded-full text-xs font-bold">
                    {quantityPerDelivery} {bottleSize} {bottleSize === '20L' ? 'Jars' : 'Bottles'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantityPerDelivery(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        quantityPerDelivery === num
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Days & Time Slot */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-base font-bold text-slate-900">Delivery Days & Time Slot</h3>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-600 mb-2">Select your recurring delivery days:</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {availableDays.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-cyan-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Preferred delivery time window:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left flex items-center gap-2 transition-all ${
                        timeSlot === slot
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span className="truncate">{slot}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Delivery Address */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                  <h3 className="text-base font-bold text-slate-900">Delivery Address</h3>
                </div>
                <button
                  type="button"
                  onClick={() => promptLocationPicker((newAddr) => {
                    // callback
                  })}
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Pin New Address on Map</span>
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="space-y-2">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        selectedAddressIndex === idx
                          ? 'border-cyan-500 bg-cyan-50/60 ring-1 ring-cyan-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedAddressIndex === idx ? 'text-cyan-600' : 'text-slate-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{addr.tag}</span>
                          <span className="text-xs text-slate-500 font-medium">{addr.recipientName} ({addr.phone})</span>
                        </div>
                        <p className="text-xs text-slate-600 truncate mt-0.5">{addr.addressLine}, {addr.area}, {addr.city}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => promptLocationPicker(() => {})}
                  className="w-full p-4 border-2 border-dashed border-cyan-300 rounded-2xl text-center text-cyan-700 font-bold text-xs hover:bg-cyan-50"
                >
                  + Click to Pin and Save Your Delivery Address
                </button>
              )}
            </div>

          </div>

          {/* Right Summary & Checkout Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Subscription Summary
                </span>
                <h3 className="text-xl font-heading font-extrabold text-white mt-0.5">
                  {quantityPerDelivery}x {bottleSize} ({selectedDays.join(' & ')})
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                Active Plan
              </span>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Per Delivery ({quantityPerDelivery}x {bottleSize} @ ৳{unitPrice}):</span>
                <span className="font-bold text-white">৳{pricePerDelivery}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Scheduled Deliveries:</span>
                <span className="font-bold text-white">{deliveriesPerMonth} Deliveries</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Delivery Fee:</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>1-to-1 Empty Jar Return:</span>
                <span className="font-bold text-cyan-300">৳0 Deposit</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Estimated Monthly Total:</span>
                <span className="text-2xl font-extrabold text-cyan-400 font-heading">
                  ৳{monthlyEstimate.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector for Subscription */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-cyan-400 bg-cyan-950 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <p className="text-xs">Milad Wallet</p>
                  <p className="text-[10px] text-cyan-400 font-normal">Balance: ৳{user?.walletBalance || 0}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-cyan-400 bg-cyan-950 text-white font-bold'
                      : 'border-slate-800 bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <p className="text-xs">Pay on Delivery</p>
                  <p className="text-[10px] text-slate-400 font-normal">Cash / bKash to driver</p>
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pause or cancel anytime with one click in your portal</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Empty jars swapped at doorstep automatically</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleCreateSubscription}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-400/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Setting up Plan...' : 'Activate Water Subscription'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
