import React, { useId } from 'react';

type CategoryBannerTheme = {
  baseA: string;
  baseB: string;
  glow: string;
  accent: string;
  accentSoft: string;
  paper: string;
  side: 'left' | 'right';
  motif: 'rings' | 'stack' | 'bars' | 'grid' | 'arch' | 'dots' | 'ribbon' | 'labels';
};

const DEFAULT_THEME: CategoryBannerTheme = {
  baseA: '#F6E8D7',
  baseB: '#FDF7F0',
  glow: '#E8C9AE',
  accent: '#A67C52',
  accentSoft: '#D8B89A',
  paper: '#FBF2E8',
  side: 'left',
  motif: 'rings',
};

const THEMES: Record<string, CategoryBannerTheme> = {
  'sacs-emballages-boutique': {
    baseA: '#F6E7D6',
    baseB: '#FFF8F2',
    glow: '#D9B79A',
    accent: '#9B6D42',
    accentSoft: '#CEAB84',
    paper: '#FBF4EC',
    side: 'left',
    motif: 'grid',
  },
  'emballages-alimentaires': {
    baseA: '#F4ECD9',
    baseB: '#FFF9F1',
    glow: '#D9C07D',
    accent: '#9F7A3E',
    accentSoft: '#CDB884',
    paper: '#FBF6EA',
    side: 'right',
    motif: 'bars',
  },
  'gobelets-emballages-boissons': {
    baseA: '#E9F1EF',
    baseB: '#F8FCFB',
    glow: '#A7C8C0',
    accent: '#5D8C86',
    accentSoft: '#8FB8B2',
    paper: '#F3F9F7',
    side: 'left',
    motif: 'rings',
  },
  'bols-saladiers-pots': {
    baseA: '#E8F0E7',
    baseB: '#F7FBF5',
    glow: '#A9C7A5',
    accent: '#6B8F63',
    accentSoft: '#94B88E',
    paper: '#F2F8F0',
    side: 'right',
    motif: 'stack',
  },
  'fast-food-restauration': {
    baseA: '#F8E7D6',
    baseB: '#FFF7EF',
    glow: '#E1A88B',
    accent: '#B06A42',
    accentSoft: '#D39A73',
    paper: '#FBF1E8',
    side: 'left',
    motif: 'labels',
  },
  'patisserie-boulangerie': {
    baseA: '#F8E8EE',
    baseB: '#FFF8FB',
    glow: '#E2B2C2',
    accent: '#B26D84',
    accentSoft: '#D496A7',
    paper: '#FBF2F5',
    side: 'right',
    motif: 'arch',
  },
  'bouteilles-personnalisees': {
    baseA: '#E8F4F6',
    baseB: '#F8FCFD',
    glow: '#A9D1DB',
    accent: '#5A8A96',
    accentSoft: '#8DB5BE',
    paper: '#F1F8FA',
    side: 'left',
    motif: 'bars',
  },
  'parfumerie-cosmetique': {
    baseA: '#F0E9F5',
    baseB: '#FCF9FE',
    glow: '#C3B0D8',
    accent: '#8D6BA6',
    accentSoft: '#B49BC7',
    paper: '#F6F0FA',
    side: 'right',
    motif: 'dots',
  },
  'etiquettes-stickers': {
    baseA: '#F6E9E0',
    baseB: '#FFF8F4',
    glow: '#E0BCA8',
    accent: '#A46A4D',
    accentSoft: '#C7967B',
    paper: '#FBF2EC',
    side: 'left',
    motif: 'grid',
  },
  evenementiel: {
    baseA: '#F6E6D5',
    baseB: '#FFF8F1',
    glow: '#E2C19E',
    accent: '#B08949',
    accentSoft: '#D4B37D',
    paper: '#FCF3E9',
    side: 'right',
    motif: 'rings',
  },
  'packaging-cadeaux': {
    baseA: '#F4E8DF',
    baseB: '#FFF9F5',
    glow: '#D9BDAE',
    accent: '#9A6D58',
    accentSoft: '#C5A28E',
    paper: '#FAF2EC',
    side: 'left',
    motif: 'ribbon',
  },
  'articles-personnalises': {
    baseA: '#EFE9E2',
    baseB: '#FBF8F4',
    glow: '#C9BAAC',
    accent: '#7E6A58',
    accentSoft: '#A89887',
    paper: '#F6F1EC',
    side: 'right',
    motif: 'dots',
  },
  'solutions-impression': {
    baseA: '#ECEBF2',
    baseB: '#FAFAFD',
    glow: '#B5B3D0',
    accent: '#716B9A',
    accentSoft: '#9B97BD',
    paper: '#F4F4FA',
    side: 'left',
    motif: 'labels',
  },
  'solutions-entreprises': {
    baseA: '#E9EEE9',
    baseB: '#F8FAF8',
    glow: '#B6C4B5',
    accent: '#657C63',
    accentSoft: '#92A690',
    paper: '#F2F7F1',
    side: 'right',
    motif: 'stack',
  },
};

const squares = [
  { x: 114, y: 62 },
  { x: 146, y: 94 },
  { x: 1310, y: 58 },
  { x: 1340, y: 92 },
  { x: 732, y: 34 },
  { x: 764, y: 66 },
  { x: 1190, y: 132 },
  { x: 1222, y: 164 },
];

const Motif: React.FC<{ theme: CategoryBannerTheme }> = ({ theme }) => {
  switch (theme.motif) {
    case 'stack':
      return (
        <g opacity="0.82" transform={theme.side === 'left' ? 'translate(292 126)' : 'translate(1102 126)'}>
          <rect x="0" y="0" width="300" height="204" rx="40" fill="none" stroke={theme.accent} strokeOpacity="0.24" strokeWidth="5" />
          <rect x="34" y="30" width="300" height="204" rx="40" fill="none" stroke={theme.accentSoft} strokeOpacity="0.24" strokeWidth="5" />
          <rect x="18" y="18" width="300" height="204" rx="40" fill={theme.paper} fillOpacity="0.28" stroke={theme.accent} strokeOpacity="0.18" strokeWidth="3" />
        </g>
      );
    case 'bars':
      return (
        <g opacity="0.8" transform={theme.side === 'left' ? 'translate(310 98)' : 'translate(1080 98)'}>
          <rect x="0" y="66" width="260" height="166" rx="84" fill={theme.paper} fillOpacity="0.2" stroke={theme.accent} strokeOpacity="0.18" strokeWidth="3" />
          <rect x="36" y="26" width="28" height="170" rx="14" fill={theme.accent} fillOpacity="0.28" />
          <rect x="88" y="0" width="28" height="196" rx="14" fill={theme.accentSoft} fillOpacity="0.32" />
          <rect x="140" y="34" width="28" height="162" rx="14" fill={theme.accent} fillOpacity="0.24" />
          <rect x="192" y="12" width="28" height="184" rx="14" fill={theme.accentSoft} fillOpacity="0.28" />
        </g>
      );
    case 'grid':
      return (
        <g opacity="0.82" transform={theme.side === 'left' ? 'translate(330 96)' : 'translate(1062 96)'}>
          {[0, 1, 2].map((row) => (
            <g key={row} transform={`translate(0 ${row * 68})`}>
              {[0, 1, 2].map((col) => (
                <rect
                  key={col}
                  x={col * 66}
                  y="0"
                  width="40"
                  height="40"
                  rx="11"
                  fill="none"
                  stroke={col === 1 ? theme.accentSoft : theme.accent}
                  strokeOpacity={col === 1 ? 0.38 : 0.24}
                  strokeWidth="4"
                />
              ))}
            </g>
          ))}
        </g>
      );
    case 'arch':
      return (
        <g opacity="0.82" transform={theme.side === 'left' ? 'translate(284 102)' : 'translate(1050 102)'}>
          <rect x="0" y="84" width="300" height="150" rx="40" fill="none" stroke={theme.accent} strokeOpacity="0.2" strokeWidth="4" />
          <path d="M40 164c18-70 54-104 100-104s82 34 100 104" fill="none" stroke={theme.accentSoft} strokeOpacity="0.34" strokeWidth="10" strokeLinecap="round" />
          <path d="M156 164c18-70 54-104 100-104s82 34 100 104" fill="none" stroke={theme.accent} strokeOpacity="0.22" strokeWidth="10" strokeLinecap="round" />
        </g>
      );
    case 'dots':
      return (
        <g opacity="0.85" transform={theme.side === 'left' ? 'translate(320 128)' : 'translate(1068 128)'}>
          {[0, 1, 2].map((row) => (
            <g key={row} transform={`translate(0 ${row * 58})`}>
              {[0, 1, 2, 3].map((col) => (
                <circle
                  key={col}
                  cx={col * 56 + (row % 2) * 18}
                  cy="0"
                  r={col === 1 ? 10 : 7}
                  fill={col % 2 === 0 ? theme.accent : theme.accentSoft}
                  fillOpacity={col === 1 ? 0.34 : 0.22}
                />
              ))}
            </g>
          ))}
        </g>
      );
    case 'ribbon':
      return (
        <g opacity="0.84" transform={theme.side === 'left' ? 'translate(304 108)' : 'translate(1080 108)'}>
          <rect x="0" y="84" width="298" height="142" rx="36" fill="none" stroke={theme.accent} strokeOpacity="0.2" strokeWidth="4" />
          <path d="M24 154c52-48 98-72 146-72 26 0 54 8 82 22 20 10 43 14 68 12" fill="none" stroke={theme.accentSoft} strokeOpacity="0.3" strokeWidth="14" strokeLinecap="round" />
          <path d="M36 188c60-10 98-4 140 20 20 12 40 18 58 18 24 0 49-8 76-24" fill="none" stroke={theme.accent} strokeOpacity="0.22" strokeWidth="12" strokeLinecap="round" />
        </g>
      );
    case 'labels':
      return (
        <g opacity="0.84" transform={theme.side === 'left' ? 'translate(294 108)' : 'translate(1080 108)'}>
          {[0, 1, 2].map((row) => (
            <g key={row} transform={`translate(0 ${row * 54})`}>
              <rect x="0" y="0" width="320" height="34" rx="17" fill={theme.accent} fillOpacity="0.16" />
              <rect x="0" y="0" width="320" height="34" rx="17" fill="none" stroke={theme.accentSoft} strokeOpacity="0.22" strokeWidth="4" />
            </g>
          ))}
        </g>
      );
    case 'rings':
    default:
      return (
        <g opacity="0.82" transform={theme.side === 'left' ? 'translate(292 112)' : 'translate(1078 112)'}>
          <circle cx="136" cy="136" r="102" fill="none" stroke={theme.accent} strokeOpacity="0.22" strokeWidth="6" />
          <circle cx="182" cy="114" r="72" fill="none" stroke={theme.accentSoft} strokeOpacity="0.34" strokeWidth="8" />
          <circle cx="98" cy="170" r="42" fill={theme.paper} fillOpacity="0.2" stroke={theme.accent} strokeOpacity="0.18" strokeWidth="5" />
        </g>
      );
  }
};

export const CategoryBannerArt: React.FC<{
  categoryId: string;
  className?: string;
}> = ({ categoryId, className }) => {
  const uid = useId().replace(/:/g, '');
  const theme = THEMES[categoryId] || DEFAULT_THEME;
  const bgId = `banner-bg-${uid}`;
  const glowId = `banner-glow-${uid}`;
  const washId = `banner-wash-${uid}`;

  return (
    <svg
      viewBox="0 0 1600 520"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <defs>
        <linearGradient id={bgId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={theme.baseA} />
          <stop offset="100%" stopColor={theme.baseB} />
        </linearGradient>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.glow} stopOpacity="0.8" />
          <stop offset="100%" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={washId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
        </linearGradient>
        <filter id={`banner-soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      <rect width="1600" height="520" fill={`url(#${bgId})`} />
      <ellipse
        cx={theme.side === 'left' ? 298 : 1300}
        cy="390"
        rx="300"
        ry="120"
        fill={`url(#${glowId})`}
        filter={`url(#banner-soft-${uid})`}
      />
      <path
        d="M0 290C168 262 290 286 404 308C517 329 628 355 804 348C985 340 1102 280 1261 260C1383 244 1498 250 1600 266V520H0V290Z"
        fill={theme.paper}
        fillOpacity="0.82"
      />
      <path
        d="M0 338C178 312 312 330 454 356C598 382 704 404 840 398C1008 390 1128 332 1262 316C1392 301 1498 303 1600 317V520H0V338Z"
        fill={theme.paper}
        fillOpacity="0.54"
      />

      {squares.map(({ x, y }) => (
        <g key={`${x}-${y}`} opacity="0.55" transform={`translate(${x} ${y})`}>
          <rect x="0" y="0" width="28" height="28" rx="5" fill="none" stroke={theme.accent} strokeOpacity="0.45" strokeWidth="2.5" />
          <rect x="24" y="24" width="28" height="28" rx="5" fill="none" stroke={theme.accentSoft} strokeOpacity="0.3" strokeWidth="2.5" />
        </g>
      ))}

      <g opacity="0.35">
        <path d="M148 118h140" stroke={theme.accent} strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
        <path d="M1272 136h150" stroke={theme.accent} strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
        <path d="M742 56h116" stroke={theme.accentSoft} strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
      </g>

      <Motif theme={theme} />
      <rect width="1600" height="520" fill="none" stroke={theme.accent} strokeOpacity="0.10" strokeWidth="2" />
    </svg>
  );
};
