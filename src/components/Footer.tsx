import React from 'react';
import { useStore } from '../context/StoreContext';
import { MiladLogo } from './MiladLogo';
import { 
  Droplet, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Clock, 
  Calendar, 
  RotateCcw,
  Sparkles,
  PhoneCall,
  MessageSquare,
  Smartphone,
  Download
} from 'lucide-react';
import { createWhatsAppChatUrl } from '../lib/whatsapp';
import { trackWhatsAppClick, trackPhoneCall } from '../lib/analytics';
import { InstallAppModal } from './InstallAppModal';

export const Footer: React.FC = () => {
  const { setCurrentView } = useStore();
  const [installModalOpen, setInstallModalOpen] = React.useState(false);

  const handleWhatsAppQuickChat = () => {
    trackWhatsAppClick('footer_quick_chat');
    const url = createWhatsAppChatUrl('+8801711102448', 'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে পানি অর্ডার করতে চাই।');
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <MiladLogo size="md" textColor="text-white" subtextColor="text-cyan-400" />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              সিলেটের মিরবক্সটুলায় অবস্থিত আধুনিক ৭-ধাপ বিশিষ্ট RO, UV ও ওজোন ফিল্ট্রেশন মিনারেল পানির কারখানা। বাসা, অফিস, ক্লিনিক, হোটেল ও বড় সামাজিক অনুষ্ঠানের জন্য নিয়মিত নিরাপদ পানি সরবরাহ।
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> BSTI অনুমোদিত
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 font-semibold">
                <Award className="w-3.5 h-3.5 text-cyan-400" /> ISO 22000 সার্টিফাইড
              </span>
            </div>

            {/* Direct App Install Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setInstallModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>📱 মোবাইল অ্যাপ ইন্সটল করুন (PWA/APK)</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              পণ্য ও সেবাসমূহ
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  💧 সহজ ৩-ধাপে দ্রুত অর্ডার
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('products')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  📦 ২০ লিটার জার ও ৫ লিটার বোতল
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('subscriptions')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  📅 মাসিক হোম ও অফিস সাবস্ক্রিপশন
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('events')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  🎉 বিয়ে ও ইভেন্ট বাল্ক সাপ্লাই
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('calculator')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  🧮 পানির চাহিদা ক্যালকুলেটর
                </button>
              </li>
            </ul>
          </div>

          {/* Sylhet Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              ডেলিভারি কভারেজ (সিলেট)
            </h4>
            <p className="text-slate-400 text-xs">
              প্রতিদিন সকাল ও বিকালে নির্ধারিত ভ্যানে ডেলিভারি:
            </p>
            <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
              <li>• মিরবক্সটুলা</li>
              <li>• জিন্দাবাজার</li>
              <li>• আম্বরখানা</li>
              <li>• দরগাহ গেট</li>
              <li>• শিবগঞ্জ</li>
              <li>• টিলাগড়</li>
              <li>• লামাবাজার</li>
              <li>• উপশহর</li>
              <li>• সুবিদবাজার</li>
              <li>• দক্ষিণ সুরমা</li>
            </ul>
          </div>

          {/* Factory & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              যোগাযোগ ও কারখানা
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>মিরবক্সটুলা, সিলেট, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="tel:+8801711102448" 
                  onClick={() => trackPhoneCall('footer_contact_link', '+8801711102448')}
                  className="hover:text-white font-bold text-slate-200"
                >
                  +8801711102448 (সরাসরি কল)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400 shrink-0" />
                <button onClick={handleWhatsAppQuickChat} className="hover:text-white text-slate-300">
                  +8801711102448 (হোয়াটসঅ্যাপ)
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>miladdrinkingwater@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>ডেলিভারি সময়: সকাল ৮:০০ - রাত ১০:০০</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} মিলাদ ড্রিংকিং ওয়াটার (Milad Drinking Water) • মিরবক্সটুলা, সিলেট। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('customer_portal')} className="hover:text-cyan-400 cursor-pointer">গ্রাহক পোর্টাল</button>
            <span>•</span>
            <button onClick={() => setCurrentView('admin_dashboard')} className="hover:text-cyan-400 font-bold text-slate-300 cursor-pointer">🏢 এডমিন প্যানেল</button>
          </div>
        </div>

      </div>

      {/* App Install Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
    </footer>
  );
};
