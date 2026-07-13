import React from 'react';
import logoImg from '../assets/images/logo-adt.png';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  variant?: 'inline' | 'stacked';
  showTagline?: boolean;
  showWordmark?: boolean;
  cropBottom?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  theme = 'dark',
  variant = 'inline',
  showTagline = true,
  showWordmark = true,
  cropBottom = false,
}) => {
  const sizes = {
    sm: { box: 'w-8 h-8', title: 'text-xs', sub: 'text-[8px]' },
    md: { box: 'w-12 h-12', title: 'text-sm', sub: 'text-[9px]' },
    lg: { box: 'w-16 h-16', title: 'text-lg', sub: 'text-[10px]' },
  };
  const s = sizes[size];
  const titleColor = theme === 'light' ? 'text-white' : 'text-[#1B1115]';
  const taglineColor = theme === 'light' ? 'text-white/70' : 'text-gray-400';
  const isStacked = variant === 'stacked';

  const imageSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  return (
    <div className={`${isStacked ? 'flex flex-col items-center' : 'flex items-center gap-2.5'} ${className}`}>
      <div className={`shrink-0 overflow-hidden ${imageSizeClass} ${isStacked ? 'rounded-2xl' : 'rounded-[1rem]'}`}>
        <img
          src={logoImg}
          alt="Art de Table"
          className={[
            'h-full w-full object-contain',
            cropBottom ? 'object-[center_18%] scale-[1.06]' : 'object-center',
          ].join(' ')}
        />
      </div>

      {showWordmark && (
        <div className={isStacked ? 'mt-3 flex flex-col items-center leading-none text-center' : 'flex flex-col leading-none'}>
          <span className={`font-serif font-black tracking-wide ${s.title} ${titleColor}`}>
            Art de Table
          </span>
          {showTagline && (
            <span className={`tracking-wider uppercase font-medium mt-0.5 ${s.sub} ${taglineColor}`}>
              Packaging · Emballage · Personnalisation
            </span>
          )}
        </div>
      )}
    </div>
  );
};
