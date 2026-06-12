import React from 'react';
const logoImg = 'https://images.unsplash.com/photo-1515378960830-ce8ecca36b6f?auto=format&fit=crop&q=80&w=200';interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: { img: 'w-8 h-8', title: 'text-xs', sub: 'text-[8px]' },
    md: { img: 'w-10 h-10', title: 'text-sm', sub: 'text-[9px]' },
    lg: { img: 'w-14 h-14', title: 'text-lg', sub: 'text-[10px]' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={logoImg}
        alt="Art de Table"
        className={`${s.img} object-contain shrink-0`}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-serif font-black text-[#1B1115] tracking-wide ${s.title}`}>
          Art de Table
        </span>
        <span className={`text-gray-400 tracking-wider uppercase font-medium mt-0.5 ${s.sub}`}>
          Packaging · Emballage · Personnalisation
        </span>
      </div>
    </div>
  );
};