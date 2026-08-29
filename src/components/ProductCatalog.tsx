import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { 
  Package, 
  Plus, 
  Minus, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  Info, 
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react';

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
    { id: 'all', label: 'সব পণ্য (All Products)' },
    { id: 'water_jar', label: '২০ লিটার জার (20L Jars)' },
    { id: 'water_bottle', label: '৫ লিটার ও বোতল (5L Bottles)' },
    { id: 'dispenser', label: 'ডিসপেনসার ও পাম্প (Dispensers)' }
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
    <section className="py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-black uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-cyan-600" />
              <span>কারখানা থেকে সরাসরি খাবার পানি • Factory Direct</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
              পণ্য ও ডিসপেনসার ক্যাটালগ (Products)
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
              এককালীন পানির জার অর্ডার করুন অথবা ডিসপেনসার ও পাম্প যুক্ত করুন।
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border-2 border-cyan-200 shadow-sm overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/25'
                    : 'text-slate-700 hover:text-cyan-800 hover:bg-cyan-50'
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
                className="bg-white rounded-3xl overflow-hidden border-2 border-cyan-100/90 shadow-md hover:shadow-2xl hover:border-cyan-400 transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Product Image & Top Badges */}
                  <div className="relative h-60 bg-gradient-to-br from-cyan-100/70 via-sky-50 to-teal-100/50 p-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full object-contain drop-shadow-xl group-hover:scale-108 transition-transform duration-300"
                    />

                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-sm border border-cyan-200">
                        {product.volume}
                      </span>
                      {product.popular && (
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white text-[10px] font-black shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Most Popular
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-cyan-200">
                      <span className="text-xl font-heading font-black text-cyan-800">
                        ৳{product.price}
                      </span>
                      <span className="text-[10px] text-slate-600 font-bold"> / {product.unit}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-cyan-700 transition-colors">
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
                      <div className="p-3.5 bg-gradient-to-br from-cyan-50 to-teal-50/60 rounded-2xl border border-cyan-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-cyan-600" />
                            <span>1-to-1 Empty Jar Return</span>
                          </span>
                          <button
                            onClick={() => toggleExchange(product.id)}
                            className={`text-[11px] font-black px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                              willExchange
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-amber-500 text-slate-950 shadow-xs'
                            }`}
                          >
                            {willExchange ? 'Returning Jar (৳0 Fee)' : `New Jar (+৳${product.jarDeposit} Deposit)`}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-600 font-medium">
                          {willExchange
                            ? 'Our delivery driver will collect your empty jar upon delivery.'
                            : `Refundable deposit of ৳${product.jarDeposit} per jar applies for first-time buyers.`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls: Quantity & Add to Cart */}
                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center gap-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border-2 border-cyan-200 rounded-xl p-1 bg-cyan-50/50">
                      <button
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-700 hover:text-cyan-800 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        addToCart(product, qty, willExchange);
                        setIsCartDrawerOpen(true);
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-cyan-600/25 hover:shadow-cyan-600/40 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-101"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart (৳{totalPrice})</span>
                    </button>
                  </div>

                  {/* Quick Subscription Trigger for Jars */}
                  {product.category === 'water_jar' && (
                    <button
                      onClick={() => setCurrentView('subscriptions')}
                      className="w-full py-2 text-center text-xs font-black text-cyan-800 hover:text-cyan-900 bg-cyan-50/70 hover:bg-cyan-100 rounded-xl border border-cyan-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Set as Recurring Weekly Subscription (Save 15%)</span>
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
