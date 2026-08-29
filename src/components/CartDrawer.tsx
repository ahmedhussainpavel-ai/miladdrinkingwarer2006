import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVisual } from './ProductVisual';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingCart,
  Sparkles
} from 'lucide-react';
import { trackBeginCheckout } from '../lib/analytics';

export const CartDrawer: React.FC = () => {
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    toggleCartJarExchange,
    cartTotal,
    setIsCheckoutOpen,
    clearCart
  } = useStore();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Water Order</h3>
                <p className="text-xs text-slate-500">{cartTotal.totalBottles} items in cart</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => {
                const hasDeposit = item.product.jarDeposit > 0;
                const depositPerUnit = hasDeposit && !item.exchangeEmptyJar ? item.product.jarDeposit : 0;
                const itemLineTotal = (item.product.price + depositPerUnit) * item.quantity;

                return (
                  <div 
                    key={item.product.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white p-1 border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                        <ProductVisual 
                          productId={item.product.id} 
                          className="w-full h-full scale-75"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-cyan-700 font-semibold mt-0.5">
                          ৳{item.product.price} / {item.product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Empty jar return switch */}
                    {hasDeposit && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-medium">
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Empty Jar Return:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCartJarExchange(item.product.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            item.exchangeEmptyJar 
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.exchangeEmptyJar ? 'Returning 1:1 (৳0)' : `+৳${item.product.jarDeposit} Deposit`}
                        </button>
                      </div>
                    )}

                    {/* Quantity Selector & Line Total */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-slate-900">
                        ৳{itemLineTotal}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center space-y-3">
                <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Add 20L water refills, 5L compact jars, or accessories to get started.
                </p>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Water Refill Subtotal:</span>
                  <span className="font-bold text-slate-900">৳{cartTotal.subtotal}</span>
                </div>

                {cartTotal.depositTotal > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>New Jar Security Deposit:</span>
                    <span className="font-bold">৳{cartTotal.depositTotal}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Doorstep Delivery:</span>
                  <span className="font-bold text-emerald-600">
                    {cartTotal.deliveryFee === 0 ? 'FREE' : `৳${cartTotal.deliveryFee}`}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Total Payable:</span>
                  <span className="text-xl font-extrabold text-cyan-700 font-heading">
                    ৳{cartTotal.grandTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  trackBeginCheckout(cartTotal.grandTotal, cartTotal.totalBottles, cart);
                  setIsCartDrawerOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout (৳{cartTotal.grandTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-400">
                Free delivery on orders over ৳300. Instant invoice generated upon completion.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
