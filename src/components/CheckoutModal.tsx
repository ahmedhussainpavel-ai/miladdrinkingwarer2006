import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
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
  RotateCcw,
  Sparkles,
  Download,
  Plus,
  Gift,
  Tag,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.savedAddresses[0] || null);
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('07:00 AM - 10:00 AM');
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
      setPromoError('Please enter a referral or promo code.');
      return;
    }

    if (trimmed.startsWith('MILAD-') || trimmed.includes('REF') || trimmed === 'WELCOME50' || trimmed === 'PURE50') {
      const discount = 50;
      setAppliedPromo({
        code: trimmed,
        discount,
        description: 'Friend Referral Discount: ৳50 OFF First Delivery'
      });
      setPromoError('');
      showToast('success', 'Referral Code Applied!', `৳50 discount applied with code ${trimmed}.`);
    } else {
      setPromoError('Invalid referral code. Try MILAD-AHMED-88 or WELCOME50.');
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
      showToast('error', 'Address Required', 'Please select or pin a delivery address.');
      return;
    }

    if (paymentMethod === 'wallet' && (user?.walletBalance || 0) < finalPayable) {
      showToast('error', 'Insufficient Wallet Balance', `Please top-up your wallet or select Cash on Delivery.`);
      return;
    }

    setIsSubmitting(true);

    // Calculate total empty jars returning
    const emptyJarsCount = cart.reduce((acc, item) => item.exchangeEmptyJar ? acc + item.quantity : acc, 0);

    const orderPayload = {
      userId: user?.uid || 'guest-shopper',
      customerName: selectedAddress.recipientName,
      customerPhone: selectedAddress.phone,
      customerEmail: user?.email || 'customer@miladwater.com',
      type: 'one_time' as const,
      items: cart.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        volume: i.product.volume,
        quantity: i.quantity,
        unitPrice: i.product.price,
        jarDepositPaid: i.exchangeEmptyJar ? 0 : (i.product.jarDeposit * i.quantity),
        emptyJarsToReturn: i.exchangeEmptyJar ? i.quantity : 0,
        totalPrice: (i.product.price + (i.exchangeEmptyJar ? 0 : i.product.jarDeposit)) * i.quantity
      })),
      subtotal: cartTotal.subtotal,
      depositTotal: cartTotal.depositTotal,
      deliveryFee: cartTotal.deliveryFee,
      discount: discountAmount,
      totalAmount: finalPayable,
      deliveryAddress: selectedAddress,
      deliveryDate,
      timeSlot,
      deliveryZone: `${selectedAddress.area} Dispatch Zone`,
      paymentMethod,
      paymentStatus: (paymentMethod === 'wallet' || paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'card') ? 'paid' : 'unpaid' as const,
      status: 'confirmed' as const,
      emptyJarsReturnedCount: emptyJarsCount,
      referralCodeUsed: appliedPromo ? appliedPromo.code : undefined
    };

    const newOrder = await createOrder(orderPayload);

    // Track Purchase event in GA4
    trackPurchase({
      orderId: newOrder.id || newOrder.invoiceNumber,
      value: finalPayable,
      paymentMethod,
      isSubscription: false,
      deliveryArea: selectedAddress.area,
      items: orderPayload.items,
    });

    // If paid by wallet, deduct
    if (paymentMethod === 'wallet') {
      await updateWalletBalance(-finalPayable);
    }

    // Confetti blast
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    clearCart();
    setIsSubmitting(false);
    setPlacedOrder(newOrder);
    showToast('success', 'Order Confirmed!', `Invoice #${newOrder.invoiceNumber} generated.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 my-8">
        
        {!placedOrder ? (
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Checkout & Doorstep Schedule</h3>
                <p className="text-xs text-slate-500">Pure water delivered directly to your door.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Address Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  <span>1. Delivery Destination</span>
                </label>
                <button
                  type="button"
                  onClick={() => promptLocationPicker((newAddr) => setSelectedAddress(newAddr))}
                  className="text-xs font-bold text-cyan-700 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Pin New Address
                </button>
              </div>

              <div className="space-y-2">
                {user?.savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id
                        ? 'border-cyan-600 bg-cyan-50/50 ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                          className="w-4 h-4 text-cyan-600"
                        />
                        <span className="text-xs font-bold text-slate-900">{addr.tag} • {addr.recipientName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{addr.phone}</span>
                    </div>
                    <p className="text-xs text-slate-600 ml-6 mt-1">
                      {addr.addressLine} {addr.floorUnit && `(${addr.floorUnit})`}, {addr.area}, {addr.city}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Schedule Slot */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                <span>2. Delivery Date & Time Window</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="07:00 AM - 10:00 AM">Morning (07:00 - 10:00 AM)</option>
                    <option value="11:00 AM - 02:00 PM">Mid-Day (11:00 AM - 02:00 PM)</option>
                    <option value="04:00 PM - 08:00 PM">Evening (04:00 - 08:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-600" />
                <span>3. Payment Method</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cod' ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-slate-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-500">Pay when jars arrive</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'wallet' ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Milad Wallet</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Balance: ৳{user?.walletBalance || 0}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50/60 ring-2 ring-pink-400' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-pink-600 text-white text-[9px] font-extrabold flex items-center justify-center">b</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">bKash Payment</p>
                    <p className="text-[10px] text-slate-500">Instant gateway</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'card' ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                    <CreditCard className="w-4 h-4 text-cyan-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-500">Visa, Mastercard</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 4. Referral / Promo Code Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-cyan-600" />
                <span>4. Friend Referral or Promo Code</span>
              </label>

              {!appliedPromo ? (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. MILAD-AHMED-88 or WELCOME50"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold rounded-xl transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-rose-500 font-medium">{promoError}</p>
                  )}
                  <p className="text-[10px] text-slate-500">
                    Use a friend's referral code to get ৳50 off your first water delivery!
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-900">{appliedPromo.code}</span>
                        <span className="px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                          -৳{appliedPromo.discount} OFF
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700">{appliedPromo.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 p-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Water Refill Total:</span>
                <span className="font-bold text-slate-900">৳{cartTotal.subtotal}</span>
              </div>
              {cartTotal.depositTotal > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>New Jar Deposits:</span>
                  <span className="font-bold">৳{cartTotal.depositTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Doorstep Delivery:</span>
                <span className="font-bold text-emerald-600">{cartTotal.deliveryFee === 0 ? 'FREE' : `৳${cartTotal.deliveryFee}`}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Referral Discount ({appliedPromo.code}):</span>
                  <span>-৳{appliedPromo.discount}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900 text-sm">
                <span>Total Amount:</span>
                <span className="text-xl text-cyan-700 font-extrabold font-heading">৳{finalPayable}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-xl shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Order (৳{finalPayable})</span>
            </button>

          </form>
        ) : (
          /* Order Confirmed View */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-heading font-extrabold text-slate-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Invoice #{placedOrder.invoiceNumber} has been issued and queued in factory bottling.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
              <div className="flex justify-between">
                <span>Delivery Date:</span>
                <span className="font-bold text-slate-900">{placedOrder.deliveryDate} ({placedOrder.timeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-bold text-slate-900">{placedOrder.deliveryAddress.addressLine}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid / Due:</span>
                <span className="font-extrabold text-cyan-700">৳{placedOrder.totalAmount} ({placedOrder.paymentMethod.toUpperCase()})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => generateOrderInvoicePDF(placedOrder)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-cyan-600" />
                <span>Download Invoice PDF</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCurrentView('customer_portal');
                }}
                className="flex-1 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
              >
                Track in My Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
