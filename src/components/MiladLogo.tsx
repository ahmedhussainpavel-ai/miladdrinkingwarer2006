import React from 'react';
import officialLogoImg from '../assets/images/milad_official_logo.png';

interface MiladLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  showSubtitle?: boolean;
  compactText?: boolean;
  textColor?: string;
  subtextColor?: string;
  className?: string;
}

export const MiladLogo: React.FC<MiladLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  compactText = false,
  textColor = 'text-slate-900',
  subtextColor = 'text-cyan-800',
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18',
    '2xl': 'w-24 h-24'
  };

  const textSizes = {
    xs: { title: 'text-xs', sub: 'text-[8px]' },
    sm: { title: 'text-sm', sub: 'text-[9px]' },
    md: { title: 'text-base font-extrabold', sub: 'text-[10px]' },
    lg: { title: 'text-xl font-black', sub: 'text-xs' },
    xl: { title: 'text-2xl font-black', sub: 'text-sm' },
    '2xl': { title: 'text-3xl font-black', sub: 'text-base' }
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Clean Official Logo Display */}
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center`}>
        <img
          src={officialLogoImg}
          alt="মিলাদ ড্রিংকিং ওয়াটার (Milad Drinking Water) - সিলেট"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="leading-tight select-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading ${textColor} ${textSizes[size].title} tracking-tight whitespace-nowrap`}>
              {compactText ? 'মিলাদ ওয়াটার' : 'মিলাদ ড্রিংকিং ওয়াটার'}
            </span>
            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-cyan-600 text-white">
              সিলেট
            </span>
          </div>
          {showSubtitle && (
            <p className={`font-bold tracking-wider uppercase mt-0.5 hidden sm:block ${subtextColor} ${textSizes[size].sub} whitespace-nowrap`}>
              MIRBOXTULA • SYLHET
            </p>
          )}
        </div>
      )}
    </div>
  );
};
