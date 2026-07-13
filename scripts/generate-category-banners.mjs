import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('src/assets/images/category-banners');

const categories = [
  { id: 'sacs-emballages-boutique', label: 'Sacs & Emballages Boutique', baseA: '#F6E7D6', baseB: '#FFF8F2', glow: '#D9B79A', accent: '#9B6D42', accentSoft: '#CEAB84', paper: '#FBF4EC', side: 'left', motif: 'grid' },
  { id: 'emballages-alimentaires', label: 'Emballages Alimentaires', baseA: '#F4ECD9', baseB: '#FFF9F1', glow: '#D9C07D', accent: '#9F7A3E', accentSoft: '#CDB884', paper: '#FBF6EA', side: 'right', motif: 'bars' },
  { id: 'gobelets-emballages-boissons', label: 'Gobelets & Emballages Boissons', baseA: '#E9F1EF', baseB: '#F8FCFB', glow: '#A7C8C0', accent: '#5D8C86', accentSoft: '#8FB8B2', paper: '#F3F9F7', side: 'left', motif: 'rings' },
  { id: 'bols-saladiers-pots', label: 'Bols, Saladiers & Pots', baseA: '#E8F0E7', baseB: '#F7FBF5', glow: '#A9C7A5', accent: '#6B8F63', accentSoft: '#94B88E', paper: '#F2F8F0', side: 'right', motif: 'stack' },
  { id: 'fast-food-restauration', label: 'Fast-food & Restauration', baseA: '#F8E7D6', baseB: '#FFF7EF', glow: '#E1A88B', accent: '#B06A42', accentSoft: '#D39A73', paper: '#FBF1E8', side: 'left', motif: 'labels' },
  { id: 'patisserie-boulangerie', label: 'Pâtisserie & Boulangerie', baseA: '#F8E8EE', baseB: '#FFF8FB', glow: '#E2B2C2', accent: '#B26D84', accentSoft: '#D496A7', paper: '#FBF2F5', side: 'right', motif: 'arch' },
  { id: 'bouteilles-personnalisees', label: 'Bouteilles Personnalisées', baseA: '#E8F4F6', baseB: '#F8FCFD', glow: '#A9D1DB', accent: '#5A8A96', accentSoft: '#8DB5BE', paper: '#F1F8FA', side: 'left', motif: 'bars' },
  { id: 'parfumerie-cosmetique', label: 'Parfumerie & Cosmétique', baseA: '#F0E9F5', baseB: '#FCF9FE', glow: '#C3B0D8', accent: '#8D6BA6', accentSoft: '#B49BC7', paper: '#F6F0FA', side: 'right', motif: 'dots' },
  { id: 'etiquettes-stickers', label: 'Étiquettes & Stickers', baseA: '#F6E9E0', baseB: '#FFF8F4', glow: '#E0BCA8', accent: '#A46A4D', accentSoft: '#C7967B', paper: '#FBF2EC', side: 'left', motif: 'grid' },
  { id: 'packaging-cadeaux', label: 'Packaging Cadeaux', baseA: '#F4E8DF', baseB: '#FFF9F5', glow: '#D9BDAE', accent: '#9A6D58', accentSoft: '#C5A28E', paper: '#FAF2EC', side: 'left', motif: 'ribbon' },
  { id: 'articles-personnalises', label: 'Articles Personnalisés', baseA: '#EFE9E2', baseB: '#FBF8F4', glow: '#C9BAAC', accent: '#7E6A58', accentSoft: '#A89887', paper: '#F6F1EC', side: 'right', motif: 'dots' },
  { id: 'solutions-impression', label: "Solutions d'Impression", baseA: '#ECEBF2', baseB: '#FAFAFD', glow: '#B5B3D0', accent: '#716B9A', accentSoft: '#9B97BD', paper: '#F4F4FA', side: 'left', motif: 'labels' },
  { id: 'solutions-entreprises', label: 'Solutions Entreprises', baseA: '#E9EEE9', baseB: '#F8FAF8', glow: '#B6C4B5', accent: '#657C63', accentSoft: '#92A690', paper: '#F2F7F1', side: 'right', motif: 'stack' },
];

const squares = [
  [114, 62], [146, 94], [1310, 58], [1340, 92], [732, 34], [764, 66], [1190, 132], [1222, 164],
];

const motif = (theme) => {
  const x = theme.side === 'left' ? 292 : 1078;
  switch (theme.motif) {
    case 'stack':
      return `
        <g opacity="0.82" transform="translate(${theme.side === 'left' ? 292 : 1102} 126)">
          <rect x="0" y="0" width="300" height="204" rx="40" fill="none" stroke="${theme.accent}" stroke-opacity="0.24" stroke-width="5" />
          <rect x="34" y="30" width="300" height="204" rx="40" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.24" stroke-width="5" />
          <rect x="18" y="18" width="300" height="204" rx="40" fill="${theme.paper}" fill-opacity="0.28" stroke="${theme.accent}" stroke-opacity="0.18" stroke-width="3" />
        </g>`;
    case 'bars':
      return `
        <g opacity="0.8" transform="translate(${theme.side === 'left' ? 310 : 1080} 98)">
          <rect x="0" y="66" width="260" height="166" rx="84" fill="${theme.paper}" fill-opacity="0.2" stroke="${theme.accent}" stroke-opacity="0.18" stroke-width="3" />
          <rect x="36" y="26" width="28" height="170" rx="14" fill="${theme.accent}" fill-opacity="0.28" />
          <rect x="88" y="0" width="28" height="196" rx="14" fill="${theme.accentSoft}" fill-opacity="0.32" />
          <rect x="140" y="34" width="28" height="162" rx="14" fill="${theme.accent}" fill-opacity="0.24" />
          <rect x="192" y="12" width="28" height="184" rx="14" fill="${theme.accentSoft}" fill-opacity="0.28" />
        </g>`;
    case 'grid':
      return `
        <g opacity="0.82" transform="translate(${theme.side === 'left' ? 330 : 1062} 96)">
          ${[0,1,2].map((row)=>`
            <g transform="translate(0 ${row * 68})">
              ${[0,1,2].map((col)=>`
                <rect x="${col * 66}" y="0" width="40" height="40" rx="11" fill="none"
                  stroke="${col === 1 ? theme.accentSoft : theme.accent}"
                  stroke-opacity="${col === 1 ? 0.38 : 0.24}" stroke-width="4" />
              `).join('')}
            </g>
          `).join('')}
        </g>`;
    case 'arch':
      return `
        <g opacity="0.82" transform="translate(${theme.side === 'left' ? 284 : 1050} 102)">
          <rect x="0" y="84" width="300" height="150" rx="40" fill="none" stroke="${theme.accent}" stroke-opacity="0.2" stroke-width="4" />
          <path d="M40 164c18-70 54-104 100-104s82 34 100 104" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.34" stroke-width="10" stroke-linecap="round" />
          <path d="M156 164c18-70 54-104 100-104s82 34 100 104" fill="none" stroke="${theme.accent}" stroke-opacity="0.22" stroke-width="10" stroke-linecap="round" />
        </g>`;
    case 'dots':
      return `
        <g opacity="0.85" transform="translate(${theme.side === 'left' ? 320 : 1068} 128)">
          ${[0,1,2].map((row)=>`
            <g transform="translate(0 ${row * 58})">
              ${[0,1,2,3].map((col)=>`
                <circle cx="${col * 56 + (row % 2) * 18}" cy="0" r="${col === 1 ? 10 : 7}"
                  fill="${col % 2 === 0 ? theme.accent : theme.accentSoft}"
                  fill-opacity="${col === 1 ? 0.34 : 0.22}" />
              `).join('')}
            </g>
          `).join('')}
        </g>`;
    case 'ribbon':
      return `
        <g opacity="0.84" transform="translate(${theme.side === 'left' ? 304 : 1080} 108)">
          <rect x="0" y="84" width="298" height="142" rx="36" fill="none" stroke="${theme.accent}" stroke-opacity="0.2" stroke-width="4" />
          <path d="M24 154c52-48 98-72 146-72 26 0 54 8 82 22 20 10 43 14 68 12" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.3" stroke-width="14" stroke-linecap="round" />
          <path d="M36 188c60-10 98-4 140 20 20 12 40 18 58 18 24 0 49-8 76-24" fill="none" stroke="${theme.accent}" stroke-opacity="0.22" stroke-width="12" stroke-linecap="round" />
        </g>`;
    case 'labels':
      return `
        <g opacity="0.84" transform="translate(${theme.side === 'left' ? 294 : 1080} 108)">
          ${[0,1,2].map((row)=>`
            <g transform="translate(0 ${row * 54})">
              <rect x="0" y="0" width="320" height="34" rx="17" fill="${theme.accent}" fill-opacity="0.16" />
              <rect x="0" y="0" width="320" height="34" rx="17" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.22" stroke-width="4" />
            </g>
          `).join('')}
        </g>`;
    case 'rings':
    default:
      return `
        <g opacity="0.82" transform="translate(${theme.side === 'left' ? 292 : 1078} 112)">
          <circle cx="136" cy="136" r="102" fill="none" stroke="${theme.accent}" stroke-opacity="0.22" stroke-width="6" />
          <circle cx="182" cy="114" r="72" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.34" stroke-width="8" />
          <circle cx="98" cy="170" r="42" fill="${theme.paper}" fill-opacity="0.2" stroke="${theme.accent}" stroke-opacity="0.18" stroke-width="5" />
        </g>`;
  }
};

const svgFor = (theme) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 520" role="img" aria-label="${theme.label}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${theme.baseA}" />
      <stop offset="100%" stop-color="${theme.baseB}" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${theme.glow}" stop-opacity="0" />
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18" />
    </filter>
  </defs>
  <rect width="1600" height="520" fill="url(#bg)" />
  <ellipse cx="${theme.side === 'left' ? 298 : 1300}" cy="390" rx="300" ry="120" fill="url(#glow)" filter="url(#soft)" />
  <path d="M0 290C168 262 290 286 404 308C517 329 628 355 804 348C985 340 1102 280 1261 260C1383 244 1498 250 1600 266V520H0V290Z" fill="${theme.paper}" fill-opacity="0.82"/>
  <path d="M0 338C178 312 312 330 454 356C598 382 704 404 840 398C1008 390 1128 332 1262 316C1392 301 1498 303 1600 317V520H0V338Z" fill="${theme.paper}" fill-opacity="0.54"/>
  ${squares.map(([x, y]) => `
    <g opacity="0.55" transform="translate(${x} ${y})">
      <rect x="0" y="0" width="28" height="28" rx="5" fill="none" stroke="${theme.accent}" stroke-opacity="0.45" stroke-width="2.5" />
      <rect x="24" y="24" width="28" height="28" rx="5" fill="none" stroke="${theme.accentSoft}" stroke-opacity="0.3" stroke-width="2.5" />
    </g>`).join('')}
  <g opacity="0.35">
    <path d="M148 118h140" stroke="${theme.accent}" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />
    <path d="M1272 136h150" stroke="${theme.accent}" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />
    <path d="M742 56h116" stroke="${theme.accentSoft}" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round" />
  </g>
  ${motif(theme)}
  <g transform="translate(800 188)">
    <text text-anchor="middle" fill="${theme.accent}" font-family="Georgia, 'Times New Roman', serif" font-size="84" letter-spacing="-0.02em">
      ${theme.label}
    </text>
  </g>
  <rect width="1600" height="520" fill="none" stroke="${theme.accent}" stroke-opacity="0.10" stroke-width="2" />
</svg>`;

fs.mkdirSync(outDir, { recursive: true });
for (const theme of categories) {
  fs.writeFileSync(path.join(outDir, `${theme.id}.svg`), svgFor(theme), 'utf8');
}

console.log(`Wrote ${categories.length} category banners to ${outDir}`);
