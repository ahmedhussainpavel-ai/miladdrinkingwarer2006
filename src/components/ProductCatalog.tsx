import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductVisual } from './ProductVisual';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { trackAddToCart } from '../lib/analytics';

export const ProductCatalog: React.FC = () => {
  const { products, addToCart, setCurrentView, setIsCartDrawerOpen } = useStore();
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
    { id: 'all', label: 'সকল পণ্য' },
    { id: 'water_jar', label: '২০ লিটার জার' },
    { id: 'water_bottle', label: '৫ লিটার ও বোতল' },
    { id: 'dispenser', label: 'ডিসপেনসার ও পাম্প' }
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
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-900 text-xs font-bold mb-2.5 border border-cyan-200">
              <Package className="w-3.5 h-3.5 text-cyan-700" />
              <span>কারখানা থেকে সরাসরি খাবার পানি</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              পণ্য ও এক্সেসরিজ ক্যাটালগ
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              এককালীন পানির জার অর্ডার করুন অথবা রিচার্জেবল পাম্প ও ডিসপেনসার সংগ্রহ করুন।
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-700 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-cyan-900 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const willExchange = exchangeState[product.id] ?? true;
            const hasDeposit = product.jarDeposit > 0;
            const depositFee = hasDeposit && !willExchange ? product.jarDeposit * qty : 0;
            const totalPrice = (product.price * qty) + depositFee;

            return (
              <div 
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Product Visual & Top Badges */}
                  <div className="relative h-56 bg-slate-100/70 p-6 flex items-center justify-center overflow-hidden">
                    <ProductVisual 
                      productId={product.id} 
                      className="h-full drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-extrabold shadow-2xs border border-slate-200">
                        {product.volume}
                      </span>
                      {product.popular && (
                        <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-2xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> জনপ্রিয় পছন্দ
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-2xs border border-slate-200">
                      <span className="text-xl font-heading font-black text-cyan-800">
                        ৳{product.price}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold"> / {product.unit === 'jar' ? 'জার' : product.unit === 'bottle' ? 'বোতল' : product.unit === 'piece' ? 'পিস' : product.unit}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug group-hover:text-cyan-800 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs text-cyan-700 font-bold mt-0.5">{product.subTitle}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1.5 pt-1">
                      {product.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 font-bold" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Empty Jar Exchange Box (if applicable) */}
                    {hasDeposit && (
                      <div className="p-3.5 bg-cyan-50/60 rounded-2xl border border-cyan-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-cyan-700" />
                            <span>১-টু-১ খালি জার বদল</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleExchange(product.id)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                              willExchange
                                ? 'bg-emerald-600 text-white shadow-2xs'
                                : 'bg-amber-500 text-slate-950 shadow-2xs'
                            }`}
                          >
                            {willExchange ? 'খালি জার দিব (৳০ জামানত)' : `নতুন জার (+৳${product.jarDeposit} ডিপোজিট)`}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-600">
                          {willExchange
                            ? 'আমাদের ডেলিভারি প্রতিনিধি নতুন জার দিয়ে আপনার আগের খালি জার সংগ্রহ করবেন।'
                            : `প্রথমবার যাদের খালি জার নেই তাদের প্রতি জারে ৳${product.jarDeposit} ফেরতযোগ্য জামানত প্রযোজ্য।`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Quantity & Add to Cart */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                        aria-label="পরিমাণ কমান"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                        aria-label="পরিমাণ বাড়ান"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, qty, willExchange);
                        trackAddToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          quantity: qty,
                          category: product.category,
                        });
                        setIsCartDrawerOpen(true);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>কার্টে যোগ করুন (৳{totalPrice})</span>
                    </button>
                  </div>

                  {/* Quick Subscription Trigger for Jars */}
                  {product.category === 'water_jar' && (
                    <button
                      type="button"
                      onClick={() => setCurrentView('subscriptions')}
                      className="w-full py-2.5 text-center text-xs font-bold text-cyan-800 hover:text-cyan-950 bg-cyan-50/70 hover:bg-cyan-100 rounded-xl border border-cyan-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                      <span>সাপ্তাহিক নিয়মিত প্যাকেজে সেট করুন</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
