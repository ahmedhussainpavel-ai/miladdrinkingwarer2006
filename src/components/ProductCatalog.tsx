import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { useNetworkStatus } from '../lib/useNetworkStatus';
import { ProductVisual } from './ProductVisual';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  Calendar,
  Sparkles,
  WifiOff,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { trackAddToCart } from '../lib/analytics';

export const ProductCatalog: React.FC = () => {
  const { products, addToCart, setCurrentView, setIsCartDrawerOpen } = useStore();
  const { language, t, formatCurrency, formatNumber, translateCategory } = useLanguage();
  const { isOffline, cachedProductCount, lastSyncTime } = useNetworkStatus();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exchangeState, setExchangeState] = useState<Record<string, boolean>>({
    'prod-20l-jar': true,
    'prod-5l-bottle': true
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'prod-20l-jar': 2,
    'prod-5l-bottle': 2,
    'prod-500ml-case': 1,
    'prod-electric-pump': 1,
    'prod-ceramic-dispenser': 1,
    'prod-hot-cold-dispenser': 1
  });

  const categories = [
    { id: 'all', label: t.catalog.allCategory },
    { id: 'water_jar', label: t.catalog.jarsCategory },
    { id: 'water_bottle', label: t.catalog.bottlesCategory },
    { id: 'dispenser', label: t.catalog.dispensersCategory }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleQtyChange = (prodId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [prodId]: Math.max(1, (prev[prodId] || 1) + delta)
    }));
  };

  const toggleExchange = (prodId: string) => {
    setExchangeState(prev => ({
      ...prev,
      [prodId]: !prev[prodId]
    }));
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 text-xs font-bold border border-sky-200">
              <Package className="w-3.5 h-3.5 text-sky-700" />
              <span>{t.catalog.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              {t.catalog.title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              {t.catalog.subtitle}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-sky-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offline Mode Info Strip */}
        {isOffline && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                <WifiOff className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <span>{language === 'bn' ? 'অফলাইন ক্যাশড ক্যাটালগ সক্রিয়' : 'Offline Cached Catalog Active'}</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-800">
                    {language === 'bn' ? 'ক্যাশ থেকে প্রদর্শিত' : 'Fast Cache'}
                  </span>
                </p>
                <p className="text-amber-800/90 mt-0.5">
                  {language === 'bn' 
                    ? 'ইন্টারনেট ছাড়াই সকল পণ্যের বিবরণ, রিফিল মূল্য ও সিকিউরিটি ডিপোজিট দেখতে পারছেন।'
                    : 'All water jar and bottle specs and prices are loaded from offline cache for instant viewing.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 text-[11px] font-bold text-amber-700 bg-white px-3 py-1.5 rounded-xl border border-amber-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{language === 'bn' ? 'অফলাইনে প্রস্তুত' : 'Offline Ready'}</span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const willExchange = exchangeState[product.id] ?? true;
            const hasDeposit = product.jarDeposit > 0;
            const effectiveDeposit = (hasDeposit && !willExchange) ? product.jarDeposit * qty : 0;
            const itemTotal = (product.price * qty) + effectiveDeposit;

            return (
              <div 
                key={product.id}
                className="bg-slate-50 rounded-3xl p-6 border border-slate-200/90 hover:border-sky-300 transition-all flex flex-col justify-between shadow-2xs group"
              >
                <div>
                  {/* Top Image Card */}
                  <div className="mb-5 rounded-2xl bg-white p-4 border border-slate-200/70 overflow-hidden flex items-center justify-center relative">
                    <ProductVisual
                      type={
                        product.id === 'prod-20l-jar' ? 'jar_20l' :
                        product.id === 'prod-5l-bottle' ? 'bottle_5l' :
                        product.id === 'prod-500ml-case' ? 'case_500ml' :
                        product.id === 'prod-electric-pump' ? 'pump_electric' :
                        product.id === 'prod-ceramic-dispenser' ? 'dispenser_ceramic' :
                        'dispenser_hot_cold'
                      }
                      name={product.name}
                      category={product.category}
                      className="h-44 sm:h-48 w-full object-contain"
                    />

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-xs text-sky-800 border border-slate-200/80 shadow-2xs">
                        {translateCategory(product.category)}
                      </span>
                    </div>

                    {product.inStock && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {t.catalog.inStock}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-900 transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-base font-black text-sky-700 whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-1 mb-5">
                      {product.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-sky-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Jar Exchange Selector for 20L / 5L */}
                  {hasDeposit && (
                    <div className="p-3 rounded-2xl bg-white border border-slate-200/80 mb-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{language === 'bn' ? 'খালি জার আছে?' : 'Empty Jar?'}</span>
                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                          <button
                            type="button"
                            onClick={() => toggleExchange(product.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              willExchange ? 'bg-sky-600 text-white' : 'text-slate-600'
                            }`}
                          >
                            {language === 'bn' ? 'বদল (৳০)' : 'Return (৳0)'}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExchange(product.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                              !willExchange ? 'bg-amber-600 text-white' : 'text-slate-600'
                            }`}
                          >
                            {language === 'bn' ? 'নতুন (+৳২০০)' : 'New (+৳200)'}
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {willExchange ? t.catalog.refillExchangeNote : t.catalog.depositIncludedNote}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, -1)}
                      className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-900">
                      {formatNumber(qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, 1)}
                      className="w-6 h-6 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-200"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, qty, hasDeposit ? willExchange : true);
                      trackAddToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: qty,
                        category: product.category
                      });
                      setIsCartDrawerOpen(true);
                    }}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-sky-700 hover:bg-sky-800 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t.catalog.addToCartBtn}</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
