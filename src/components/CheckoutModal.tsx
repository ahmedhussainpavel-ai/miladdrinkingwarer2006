import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  CreditCard, 
  Wallet, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Plus, 
  Tag, 
  Check,
  ArrowRight,
  WifiOff
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNetworkStatus } from '../lib/useNetworkStatus';
import { generateOrderInvoicePDF } from '../lib/pdfGenerator';
import { trackPurchase } from '../lib/analytics';
import { Address, Order, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    createOrder, 
    clearCart, 
    promptLocationPicker, 
    setCurrentView,
    showToast
  } = useStore();
  const { user, updateWalletBalance } = useAuth();
  const { language, t, formatCurrency, formatNumber, formatDate } = useLanguage();
  const { isOffline } = useNetworkStatus();

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.savedAddresses[0] || null);
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlotKey, setTimeSlotKey] = useState<'morning' | 'noon' | 'evening' | 'custom'>('morning');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Referral / Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const handleApplyPromo = () => {
    const trimmed = promoCodeInput.trim().toUpperCase();
    if (!trimmed) {
      setPromoError(language === 'bn' ? 'অনুগ্রহ করে কোড লিখুন।' : 'Please enter a code.');
      return;
    }

    if (trimmed.startsWith('MILAD-') || trimmed.includes('REF') || trimmed === 'WELCOME50' || trimmed === 'PURE50') {
      const discount = 50;
      setAppliedPromo({
        code: trimmed,
        discount,
        description: language === 'bn' ? 'রেফারেল বোনাস: প্রথম অর্ডারে ৳৫০ ছাড়' : 'Referral Bonus: ৳50 OFF First Order'
      });
      setPromoError('');
      showToast(
        'success', 
        language === 'bn' ? 'প্রোমো কোড যুক্ত হয়েছে!' : 'Promo Code Applied!', 
        language === 'bn' ? `৳৫০ ডিসকাউন্ট সফল হয়েছে (${trimmed})।` : `৳50 discount applied with code ${trimmed}.`
      );
    } else {
      setPromoError(language === 'bn' ? 'অকার্যকর কোড। সঠিক রেফারেল কোড লিখুন।' : 'Invalid code. Please check and try again.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError('');
  };

  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalPayable = Math.max(0, cartTotal.grandTotal - discountAmount);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddress) {
      showToast('error', 'Address Required', language === 'bn' ? 'অনুগ্রহ করে ডেলিভারির ঠিকানা নির্বাচন করুন।' : 'Please select a delivery address.');
      return;
    }

    if (paymentMethod === 'wallet' && (user?.walletBalance || 0) < finalPayable) {
      showToast('error', 'Insufficient Wallet Balance', language === 'bn' ? 'ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। ক্যাশ অন ডেলিভারি বেছে নিন।' : 'Insufficient wallet balance. Please use Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);

    let emptyJarsCount = 0;
    const orderItems = cart.map(item => {
      const hasDeposit = item.product.jarDeposit > 0;
      const depositPerUnit = hasDeposit && !item.exchangeEmptyJar ? item.product.jarDeposit : 0;
      if (item.exchangeEmptyJar && hasDeposit) {
        emptyJarsCount += item.quantity;
      }
      return {
        productId: item.product.id,
        name: item.product.name,
        volume: item.product.volume || '20L',
        quantity: item.quantity,
        unitPrice: item.product.price,
        jarDepositPaid: depositPerUnit * item.quantity,
        emptyJarsToReturn: item.exchangeEmptyJar ? item.quantity : 0,
        totalPrice: (item.product.price + depositPerUnit) * item.quantity
      };
    });

    try {
      const newOrder = await createOrder({
        userId: user?.uid || 'guest-order',
        customerName: selectedAddress.recipientName || user?.displayName || (language === 'bn' ? 'সম্মানিত গ্রাহক' : 'Customer'),
        customerPhone: selectedAddress.phone || user?.phone || '+8801711102448',
        customerEmail: user?.email || '',
        type: 'one_time',
        items: orderItems,
        subtotal: cartTotal.subtotal,
        depositTotal: cartTotal.depositTotal,
        deliveryFee: 0,
        discount: discountAmount,
        totalAmount: finalPayable,
        deliveryAddress: selectedAddress,
        deliveryDate,
        timeSlot: t.timeSlots[timeSlotKey],
        deliveryZone: `${selectedAddress.area} Hub`,
        paymentMethod,
        paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'unpaid',
        status: 'pending',
        emptyJarsReturnedCount: emptyJarsCount
      });

      if (paymentMethod === 'wallet') {
        await updateWalletBalance(-finalPayable);
      }

      setPlacedOrder(newOrder);
      clearCart();
      trackPurchase({
        orderId: newOrder.id,
        value: finalPayable,
        paymentMethod: newOrder.paymentMethod,
        deliveryArea: newOrder.deliveryAddress.area,
        items: newOrder.items
      });

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        // ignore
      }

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{t.checkout.title}</h3>
            <p className="text-xs text-slate-500">{t.checkout.subtitle}</p>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setPlacedOrder(null);
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {placedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">{t.checkout.orderSuccessTitle}</h4>
              <p className="text-xs text-slate-500">{t.checkout.orderSuccessInvoice} <strong>{placedOrder.invoiceNumber}</strong></p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Address'}:</span>
                <span className="font-bold truncate max-w-xs">{placedOrder.deliveryAddress.addressLine}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'ডেলিভারি সময়' : 'Time'}:</span>
                <span className="font-bold">{placedOrder.timeSlot}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-sky-700 pt-1 border-t border-slate-200">
                <span>{t.grandTotal}:</span>
                <span>{formatCurrency(placedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-sm mx-auto">
              <button
                type="button"
                onClick={() => generateOrderInvoicePDF(placedOrder)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4" />
                <span>PDF ইনভয়েস</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setPlacedOrder(null);
                  setCurrentView('customer_portal');
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>ড্যাশবোর্ড দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Main Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            
            {/* Step 1: Address Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t.checkout.stepAddress}</label>
                <button
                  type="button"
                  onClick={() => promptLocationPicker((addr) => setSelectedAddress(addr))}
                  className="text-xs text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.checkout.addNewAddress}</span>
                </button>
              </div>

              {selectedAddress ? (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-950">{selectedAddress.recipientName} ({selectedAddress.phone})</span>
                    <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 text-[10px] font-bold">{selectedAddress.tag}</span>
                  </div>
                  <p className="text-slate-600">{selectedAddress.addressLine}, {selectedAddress.area}, {selectedAddress.city}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => promptLocationPicker((addr) => setSelectedAddress(addr))}
                  className="w-full p-4 rounded-2xl border border-dashed border-slate-300 hover:border-sky-500 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>{language === 'bn' ? 'ঠিকানা সিলেক্ট বা পিন করুন' : 'Select or Pin Delivery Address'}</span>
                </button>
              )}
            </div>

            {/* Step 2: Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">{t.checkout.deliveryDate}</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">{t.checkout.deliverySlot}</label>
                <select
                  value={timeSlotKey}
                  onChange={(e) => setTimeSlotKey(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="morning">{t.timeSlots.morning}</option>
                  <option value="noon">{t.timeSlots.noon}</option>
                  <option value="evening">{t.timeSlots.evening}</option>
                  <option value="custom">{t.timeSlots.custom}</option>
                </select>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder={t.checkout.promoCodePlaceholder}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  {t.checkout.applyPromoBtn}
                </button>
              </div>

              {promoError && <p className="text-[11px] text-rose-600 font-semibold">{promoError}</p>}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <span>{appliedPromo.description}</span>
                  <button type="button" onClick={handleRemovePromo} className="text-rose-600 text-[11px] underline cursor-pointer">
                    {t.remove}
                  </button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">{t.checkout.stepPayment}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'bkash'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {language === 'bn' ? 'বিকাশ / নগদ' : 'bKash / Nagad'}
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                    paymentMethod === 'wallet'
                      ? 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-500'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {t.nav.wallet}
                </button>
              </div>
            </div>

            {/* Final Bill Summary */}
            <div className="pt-3 border-t border-slate-200 space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-bold text-slate-900">{formatCurrency(cartTotal.subtotal)}</span>
              </div>
              {cartTotal.depositTotal > 0 && (
                <div className="flex justify-between text-amber-700 font-semibold">
                  <span>{t.deposit}</span>
                  <span>{formatCurrency(cartTotal.depositTotal)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t.discount}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>{t.grandTotal}</span>
                <span className="text-sky-700">{formatCurrency(finalPayable)}</span>
              </div>
            </div>

            {/* Offline Mode Alert */}
            {isOffline && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <WifiOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {language === 'bn' ? 'অফলাইন মোড সক্রিয়' : 'Offline Mode Active'}
                  </p>
                  <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                    {language === 'bn' 
                      ? 'ইন্টারনেট বিচ্ছিন্ন থাকা অবস্থায়ও আপনি অর্ডার প্রস্তুত রাখতে পারছেন। অর্ডার সাবমিট করলে এটি অফলাইনে সংরক্ষিত হবে।'
                      : 'You are currently offline. Submitting will save the order locally to dispatch once connection restores.'}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-black text-sm cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <span>{t.loading}</span> : (
                <>
                  <span>{t.checkout.confirmAndPlaceBtn} ({formatCurrency(finalPayable)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
