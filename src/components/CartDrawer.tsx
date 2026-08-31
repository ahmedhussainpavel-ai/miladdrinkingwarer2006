import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductVisual } from './ProductVisual';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingCart
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
  const { language, t, formatCurrency, formatNumber } = useLanguage();

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
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{t.cart.title}</h3>
                <p className="text-xs text-slate-500">{formatNumber(cartTotal.totalBottles)} {t.cart.itemCount}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
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
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-sky-700 font-bold mt-0.5">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Jar Exchange Switcher for 20L / 5L */}
                    {hasDeposit && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                        <span className="text-[11px] font-semibold text-slate-600">
                          {language === 'bn' ? 'খালি জার বদল:' : 'Return Empty Jar:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleCartJarExchange(item.product.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            item.exchangeEmptyJar
                              ? 'bg-sky-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {item.exchangeEmptyJar ? t.cart.exchangeYes : t.cart.exchangeNo}
                        </button>
                      </div>
                    )}

                    {/* Stepper & Line Total */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-900">
                          {formatNumber(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 rounded text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-900">
                        {formatCurrency(itemLineTotal)}
                      </span>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 space-y-3">
                <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">{t.cart.emptyMessage}</p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
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
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{t.deliveryFee}</span>
                  <span>{language === 'bn' ? 'ফ্রি (৳০)' : 'Free (৳0)'}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>{t.grandTotal}</span>
                  <span className="text-sky-700">{formatCurrency(cartTotal.grandTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setIsCheckoutOpen(true);
                  trackBeginCheckout(cartTotal.grandTotal, cartTotal.totalBottles);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
              >
                <span>{t.cart.checkoutBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
