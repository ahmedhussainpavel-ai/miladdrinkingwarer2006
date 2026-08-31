import React from 'react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { language, t } = useLanguage();
  const [installModalOpen, setInstallModalOpen] = React.useState(false);

  const handleWhatsAppQuickChat = () => {
    trackWhatsAppClick('footer_quick_chat');
    const msg = language === 'bn' 
      ? 'আসসালামু আলাইকুম, আমি মিলাদ ড্রিংকিং ওয়াটার (মিরবক্সটুলা, সিলেট) থেকে পানি অর্ডার করতে চাই।'
      : 'Hello, I would like to order pure drinking water from Milad Drinking Water (Mirboxtula, Sylhet).';
    const url = createWhatsAppChatUrl('+8801711102448', msg);
    window.open(url, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <MiladLogo size="md" textColor="text-white" subtextColor="text-sky-400" />
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-sky-300 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> {t.quality.bstiBadge}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 font-semibold">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> {t.quality.isoBadge}
              </span>
            </div>

            {/* Direct App Install Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setInstallModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>{t.footer.installApp}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.servicesHeading}
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button 
                  onClick={() => setCurrentView('home')} 
                  className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                >
                  {t.footer.quickOrderLink}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('products')} 
                  className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                >
                  {t.footer.catalogLink}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('subscriptions')} 
                  className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                >
                  {t.footer.subscriptionLink}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('events')} 
                  className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                >
                  {t.footer.eventLink}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentView('calculator')} 
                  className="hover:text-sky-400 transition-colors text-left cursor-pointer"
                >
                  {t.footer.calculatorLink}
                </button>
              </li>
            </ul>
          </div>

          {/* Sylhet Coverage */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.coverageHeading}
            </h4>
            <p className="text-slate-400 text-xs">
              {t.footer.coverageSub}
            </p>
            <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
              <li>• {language === 'bn' ? 'মিরবক্সটুলা' : 'Mirboxtula'}</li>
              <li>• {language === 'bn' ? 'জিন্দাবাজার' : 'Zindabazar'}</li>
              <li>• {language === 'bn' ? 'আম্বরখানা' : 'Amberkhana'}</li>
              <li>• {language === 'bn' ? 'দরগাহ গেট' : 'Dargah Gate'}</li>
              <li>• {language === 'bn' ? 'শিবগঞ্জ' : 'Shibganj'}</li>
              <li>• {language === 'bn' ? 'টিলাগড়' : 'Tilagarh'}</li>
              <li>• {language === 'bn' ? 'লামাবাজার' : 'Lamabazar'}</li>
              <li>• {language === 'bn' ? 'উপশহর' : 'Uposhohor'}</li>
              <li>• {language === 'bn' ? 'সুবিদবাজার' : 'Subidbazar'}</li>
              <li>• {language === 'bn' ? 'দক্ষিণ সুরমা' : 'South Surma'}</li>
            </ul>
          </div>

          {/* Factory & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {t.footer.contactHeading}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{t.footer.addressLine}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href="tel:+8801711102448" 
                  onClick={() => trackPhoneCall('footer_contact_link', '+8801711102448')}
                  className="hover:text-white font-bold text-slate-200"
                >
                  +8801711102448 ({t.footer.callDirect})
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <button onClick={handleWhatsAppQuickChat} className="hover:text-white text-slate-300 cursor-pointer">
                  +8801711102448 ({t.footer.whatsappDirect})
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>miladdrinkingwater@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{t.footer.deliveryHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>{t.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('customer_portal')} className="hover:text-sky-400 cursor-pointer">
              {t.footer.customerPortalLink}
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('admin_dashboard')} className="hover:text-sky-400 font-bold text-slate-300 cursor-pointer">
              {t.footer.adminPanelLink}
            </button>
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
