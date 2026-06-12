import React from 'react';

interface InteractiveMockupRendererProps {
  type: string;
  color: string;
  secondaryColor?: string;
  logoUrl?: string | null;
  text?: string;
  fontFamily?: string;
  textColor?: string;
  textSize?: number;
  logoScale?: number;
  logoRotation?: number;
  selectedView?: 'face' | 'dos' | 'cote';
  className?: string;
}

export const InteractiveMockupRenderer: React.FC<InteractiveMockupRendererProps> = ({
  type,
  color,
  secondaryColor = '#C8A46B', // Gold theme by default
  logoUrl = null,
  text = 'ART DE TABLE',
  fontFamily = 'serif',
  textColor = '#1E1E1E',
  textSize = 12,
  logoScale = 1.0,
  logoRotation = 0,
  selectedView = 'face',
  className = "w-full h-full"
}) => {
  // Safe default colors if color is empty
  const primaryColor = color || '#F7E4E7';
  const accentColor = secondaryColor || '#C8A46B';

  // Math helper for 3D shaders
  const adjustBrightness = (hex: string, percent: number) => {
    try {
      let num = parseInt(hex.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
    } catch (e) {
      return hex;
    }
  };

  const shadowColor = adjustBrightness(primaryColor, -15);
  const darkShadowColor = adjustBrightness(primaryColor, -30);
  const highlightColor = adjustBrightness(primaryColor, 15);

  const getFontFamilyStyle = () => {
    if (fontFamily === 'serif') return '"Playfair Display", "Cormorant Garamond", Georgia, serif';
    if (fontFamily === 'sans') return '"Inter", "Outfit", sans-serif';
    if (fontFamily === 'mono') return '"JetBrains Mono", Courier, monospace';
    if (fontFamily === 'script') return '"Great Vibes", "Sacramento", cursive';
    return 'serif';
  };

  const getFontStyle = () => {
    if (fontFamily === 'serif') return 'italic';
    if (fontFamily === 'script') return 'normal';
    return 'normal';
  };

  const getFontWeight = () => {
    if (fontFamily === 'sans') return '700';
    if (fontFamily === 'serif') return '600';
    return 'normal';
  };

  // Render the actual customization overlay (logo + text)
  const renderCustomizationOverlay = (x: number, y: number, textOffset: number = 22, logoW: number = 44) => {
    const finalLogoSize = logoW * logoScale;
    return (
      <g>
        {/* LOGO INJECTION OR PLACEHOLDER CREST */}
        {logoUrl ? (
          <image
            href={logoUrl}
            x={x - finalLogoSize / 2}
            y={y - finalLogoSize / 2}
            width={finalLogoSize}
            height={finalLogoSize}
            style={{ transform: `rotate(${logoRotation}deg)`, transformOrigin: `${x}px ${y}px`, transition: 'all 0.3s ease-out' }}
          />
        ) : (
          /* High-end luxury crest placeholder */
          <g style={{ transform: `rotate(${logoRotation}deg)`, transformOrigin: `${x}px ${y}px` }}>
            {/* Outer Laurel Garland Vector style */}
            <circle cx={x} cy={y} r={finalLogoSize / 2} fill="none" stroke={accentColor} strokeWidth="1" strokeDasharray="1,1" />
            <path d={`M ${x - finalLogoSize/3} ${y} Q ${x} ${y + finalLogoSize/4} ${x + finalLogoSize/3} ${y}`} fill="none" stroke={accentColor} strokeWidth="1" opacity="0.6"/>
            {/* Elegant Serif central Character */}
            <text
              x={x}
              y={y + 3}
              textAnchor="middle"
              fill={accentColor}
              fontSize={finalLogoSize * 0.44}
              fontFamily="Playfair Display, Georgia, serif"
              fontWeight="bold"
            >
              M
            </text>
          </g>
        )}

        {/* CUSTOM TEXT */}
        {text && (
          <text
            x={x}
            y={y + finalLogoSize / 2 + textOffset}
            textAnchor="middle"
            fill={textColor}
            fontSize={textSize}
            fontFamily={getFontFamilyStyle()}
            fontStyle={getFontStyle()}
            fontWeight={getFontWeight()}
            letterSpacing={fontFamily === 'sans' ? '0.1em' : 'normal'}
          >
            {text}
          </text>
        )}
      </g>
    );
  };

  const baseSvgProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 240 240",
    className: `drop-shadow-2xl transition-all duration-500 ease-out ${className}`
  };

  // Switch representation maps
  switch (type) {
    case "sac":
      return (
        <svg {...baseSvgProps}>
          <defs>
            {/* Real shadow and glossy shine linear gradients for high-fidelity 3D volume */}
            <linearGradient id="bag-gloss" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.25" />
              <stop offset="30%" stopColor="#fff" stopOpacity="0.0" />
              <stop offset="70%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="inside-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Ambient Platform shadow */}
          <ellipse cx="120" cy="205" rx="75" ry="10" fill="#000" opacity="0.08" />

          {/* SIDES AND DEPTH IN PERSPECTIVE (Côté View) */}
          {selectedView === 'cote' ? (
            <g>
              {/* Left Side gusset folding panel */}
              <path d="M48,60 L24,66 L24,184 L44,188 Z" fill={shadowColor} />
              <path d="M24,66 L44,60 L44,188 L24,184 Z" fill="black" opacity="0.08" />
              {/* Front Panel side view */}
              <path d="M48,60 L188,52 L204,180 L44,188 Z" fill={primaryColor} />
              <path d="M48,60 L188,52 L204,180 L44,188 Z" fill="url(#bag-gloss)" />
            </g>
          ) : (
            /* Face / Dos View */
            <g>
              {/* Inside of the bag (dark cardboard tone) */}
              <path d="M52,60 L188,60 L176,82 L64,82 Z" fill="#423133" />
              <path d="M52,60 L188,60 L176,82 L64,82 Z" fill="url(#inside-shadow)" />

              {/* Main front panel */}
              <path d="M52,60 L188,60 L204,188 L36,188 Z" fill={primaryColor} />
              {/* Realistic highlight sheen mapping to give elegant gloss/matte lamination */}
              <path d="M52,60 L188,60 L204,188 L36,188 Z" fill="url(#bag-gloss)" />
              {/* Outer stroke line for vector perfection */}
              <path d="M52,60 L188,60 L204,188 L36,188 Z" fill="none" stroke={shadowColor} strokeWidth="1" />
              {/* Left & Right folding creases */}
              <line x1="52" y1="60" x2="36" y2="188" stroke="#000" opacity="0.06" strokeWidth="2" />
              <line x1="188" y1="60" x2="204" y2="188" stroke="#000" opacity="0.06" strokeWidth="2" />
            </g>
          )}

          {/* Genuine cord ribbon handles looping with gold prestige rivets */}
          <g>
            {/* Back handle (visible inside) */}
            <path d="M96,62 C96,26 144,26 144,62" fill="none" stroke={accentColor} strokeWidth="5.5" strokeLinecap="round" />
            <path d="M96,62 C96,26 144,26 144,62" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="2,3" opacity="0.4" />
            
            {/* Front handle */}
            <path d="M96,62 C96,22 144,22 144,62" fill="none" stroke={accentColor} strokeWidth="6" strokeLinecap="round" />
            <path d="M96,62 C96,22 144,22 144,62" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />

            {/* Rivets */}
            <circle cx="96" cy="62" r="5" fill="#C8A46B" stroke={darkShadowColor} strokeWidth="1" />
            <circle cx="96" cy="62" r="2" fill="#FFE5A3" />
            <circle cx="144" cy="62" r="5" fill="#C8A46B" stroke={darkShadowColor} strokeWidth="1" />
            <circle cx="144" cy="62" r="2" fill="#FFE5A3" />
          </g>

          {/* Customization Overlay positioned optimally */}
          {selectedView !== 'dos' ? renderCustomizationOverlay(120, 116, 20, 48) : null}
        </svg>
      );

    case "boite":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="lid-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
              <stop offset="10%" stopColor="#fff" stopOpacity="0.0" />
              <stop offset="85%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="diagonal-sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#fff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Ground shadow */}
          <rect x="42" y="196" width="156" height="15" rx="7" fill="#000" opacity="0.07" />

          {/* Box Bottom Container base shadow */}
          <rect x="40" y="80" width="160" height="110" rx="6" fill={shadowColor} />

          {/* Front visual representation */}
          <rect x="40" y="80" width="160" height="110" rx="6" fill={primaryColor} />
          {/* Bevel gradient overlay */}
          <rect x="40" y="80" width="160" height="110" rx="6" fill="url(#diagonal-sheen)" />
          
          {/* Top Lid part overlap with shadow strip */}
          <path d="M40,80 L200,80 L200,115 L40,115 Z" fill={highlightColor} opacity="0.3" />
          <rect x="39" y="79" width="162" height="38" rx="5" fill="none" stroke={shadowColor} strokeWidth="1" />
          <line x1="39" y1="117" x2="201" y2="117" stroke="#100508" strokeOpacity="0.14" strokeWidth="2.5" />

          {/* Ribbon Wrap & bow to denote high luxury event packagings */}
          <g>
            {/* Horizontal Satin Ribbon bar */}
            <rect x="40" y="124" width="160" height="18" fill={accentColor} />
            <rect x="40" y="124" width="160" height="3" fill="#fff" opacity="0.15" />
            
            {/* Satin ribbon luxury butterfly knotted bow tied at center */}
            <g transform="translate(192, 133)">
              {/* Left loop */}
              <path d="M -8,0 C -22,-14 -18,-24 -6,-10 C -1,-3 -2,0 -6,0 Z" fill={accentColor} stroke={adjustBrightness(accentColor, -15)} strokeWidth="0.5" />
              {/* Right loop */}
              <path d="M 8,0 C 22,-14 18,-24 6,-10 C 1,-3 2,0 6,0 Z" fill={accentColor} stroke={adjustBrightness(accentColor, -15)} strokeWidth="0.5" />
              {/* Floating strings */}
              <path d="M -3,2 C -11,18 -18,24 -15,24 C -12,24 -2,6 -3,2 Z" fill={accentColor} />
              <path d="M 3,2 C 11,18 18,24 15,24 C 12,24 2,6 3,2 Z" fill={accentColor} />
              {/* Central fold knot node */}
              <circle cx="0" cy="0" r="5.5" fill={accentColor} stroke="#fff" strokeOpacity="0.15" />
            </g>
          </g>

          {/* Custom label/monogram centered inside top of box */}
          {selectedView !== 'dos' ? renderCustomizationOverlay(110, 142, 11, 38) : null}
        </svg>
      );

    case "boite-transparent":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="crystal-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="30%" stopColor="#fff" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#e2e8f0" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Ground drop shadow */}
          <ellipse cx="120" cy="205" rx="80" ry="8" fill="#000" opacity="0.06" />

          {/* Inner delicacies / treats / macarons visible in transparency inside the box */}
          <g opacity="0.75" transform="translate(10, 5)">
            {/* Sweet treats stacks */}
            <circle cx="70" cy="135" r="18" fill="#F7E4E7" stroke="#fff" strokeWidth="1" />
            <circle cx="70" cy="135" r="13" fill="#D78D9B" opacity="0.3" />
            <circle cx="106" cy="135" r="18" fill="#FAF1F1" stroke="#fff" strokeWidth="1" />
            <circle cx="142" cy="135" r="18" fill="#C8A46B" stroke="#fff" strokeWidth="1" />
            <circle cx="142" cy="135" r="13" fill="#8B3A52" opacity="0.2" />
          </g>

          {/* Transparent Acrylic/Crystal Box */}
          <rect x="42" y="80" width="156" height="110" rx="8" fill="url(#crystal-glass)" stroke="#ffffff" strokeWidth="2" />
          
          {/* Glass glare highlight ribbons */}
          <path d="M 45,82 L 95,82 L 52,186 L 44,186 Z" fill="#ffffff" opacity="0.25" />
          <path d="M 180,82 L 195,82 L 115,186 L 100,186 Z" fill="#ffffff" opacity="0.14" />

          {/* Golden printed front decal label wrapper */}
          <g transform="translate(0, 15)">
            <rect x="65" y="90" width="110" height="52" rx="4" fill={primaryColor} stroke={accentColor} strokeWidth="1.5" />
            {selectedView !== 'dos' ? renderCustomizationOverlay(120, 110, 8, 30) : null}
          </g>
        </svg>
      );

    case "bouteille":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="liquid-shading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="20%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="85%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8A6421" />
              <stop offset="30%" stopColor="#E5C158" />
              <stop offset="60%" stopColor="#9E782F" />
              <stop offset="100%" stopColor="#5C4212" />
            </linearGradient>
          </defs>

          {/* Shadow beneath bottle */}
          <ellipse cx="120" cy="216" rx="42" ry="7" fill="#000" opacity="0.09" />

          {/* Glass body background (slightly blue/white clear tint) */}
          <path d="M85,62 L155,62 L155,200 C155,210 85,210 85,200 Z" fill="#F1F5F9" opacity="0.84" stroke="#D1D5DB" strokeWidth="1.5" />

          {/* Inside Liquid (e.g. delicious juice or crystal water tint) */}
          <path d="M87,85 L153,85 L153,198 C153,205 87,205 87,198 Z" fill="#FAF5F5" opacity="0.6" />
          <path d="M87,85 L153,85 L153,198 C153,205 87,205 87,198 Z" fill="url(#liquid-shading)" />

          {/* Precision threaded Metallic Cap */}
          <path d="M102,32 L138,32 L138,62 L102,62 Z" fill="url(#gold-metal)" rx="1" />
          {/* Thread lines */}
          <line x1="102" y1="41" x2="138" y2="41" stroke="#332204" strokeOpacity="0.38" strokeWidth="1.5" />
          <line x1="102" y1="50" x2="138" y2="50" stroke="#332204" strokeOpacity="0.38" strokeWidth="1.5" />

          {/* Outer label custom wrap wrapping perfectly */}
          <g>
            {/* Color-backed printed wrap wrapper */}
            <rect x="85" y="102" width="70" height="74" fill={primaryColor} stroke={accentColor} strokeWidth="1" />
            {/* 3D label curved overlay reflection */}
            <rect x="85" y="102" width="70" height="74" fill="url(#liquid-shading)" />
            
            {/* User Custom logo inside label */}
            {selectedView !== 'dos' ? renderCustomizationOverlay(120, 126, 12, 28) : null}
          </g>

          {/* Clean Glass highlights overlapping */}
          <path d="M89,64 L96,64 L96,198 L89,198 Z" fill="#ffffff" opacity="0.4" />
          <path d="M148,64 L152,64 L152,198 L148,198 Z" fill="#ffffff" opacity="0.18" />
        </svg>
      );

    case "pot":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="jar-shading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="75%" stopColor="#000000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gold-cap" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A37E36" />
              <stop offset="35%" stopColor="#FFECAB" />
              <stop offset="65%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#6E501C" />
            </linearGradient>
          </defs>

          {/* Bottom ground shadow */}
          <ellipse cx="120" cy="198" rx="60" ry="7" fill="#000" opacity="0.1" />

          {/* Glass Jar Container body with chosen principal color */}
          <path d="M64,95 L176,95 L170,186 C170,194 70,194 70,186 Z" fill={primaryColor} stroke={shadowColor} strokeWidth="1" />
          {/* Shading overlay */}
          <path d="M64,95 L176,95 L170,186 C170,194 70,194 70,186 Z" fill="url(#jar-shading)" />

          {/* Curved Elegant Cap (Glass Cosmetic Lid) */}
          <path d="M61,64 L179,64 C183,64 183,88 179,88 L61,88 C57,88 57,64 61,64 Z" fill="url(#gold-cap)" />
          {/* Cap highlight rim */}
          <path d="M60,67 L180,67" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />

          {/* Central personalization content */}
          {selectedView !== 'dos' ? renderCustomizationOverlay(120, 134, 11, 30) : null}
        </svg>
      );

    case "ruban":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="ribbon-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#fff" stopOpacity="0.05" />
              <stop offset="80%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.16" />
            </linearGradient>
          </defs>

          {/* Background drop shadow representing elegant curl */}
          <path d="M 20,115 Q 120,45 220,115 L 220,128 Q 120,58 20,128 Z" fill="#000" opacity="0.07" filter="blur(3px)" />

          {/* Ribbon Wave shape (Principal Color chosen) */}
          <path d="M 20,110 Q 120,40 220,110 L 220,132 Q 120,62 20,132 Z" fill={primaryColor} stroke={shadowColor} strokeWidth="0.5" />
          {/* Highlight sheen for satin reflection */}
          <path d="M 20,110 Q 120,40 220,110 L 220,132 Q 120,62 20,132 Z" fill="url(#ribbon-shine)" />

          {/* Subtle elegant stitching lines along the margins */}
          <path d="M 20,114 Q 120,44 220,114" fill="none" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.4" />
          <path d="M 20,128 Q 120,58 220,128" fill="none" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.4" />

          {/* Monogram stamp embedded on the ribbon curve */}
          {selectedView !== 'dos' ? (
            <g>
              <g transform="translate(120, 86)">
                {logoUrl ? (
                  <image href={logoUrl} x="-11" y="-14" width="22" height="22" />
                ) : (
                  <circle cx="0" cy="-3" r="10" fill="none" stroke={textColor} strokeWidth="1" strokeDasharray="1,2" />
                )}
                
                {text && (
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="7"
                    fontFamily={getFontFamilyStyle()}
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    {text.slice(0, 18).toUpperCase()}
                  </text>
                )}
              </g>
            </g>
          ) : null}
        </svg>
      );

    case "mug":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="mug-sheen" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#fff" stopOpacity="0.0" />
              <stop offset="80%" stopColor="#000" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.14" />
            </linearGradient>
          </defs>

          {/* Bottom shadow */}
          <ellipse cx="115" cy="196" rx="54" ry="7" fill="#000" opacity="0.09" />

          {/* Mug handle (Behind or Side based on chosen view) */}
          <path d="M152,90 C182,90 182,156 152,156" fill="none" stroke={accentColor} strokeWidth="12" strokeLinecap="round" />
          <path d="M152,90 C182,90 182,156 152,156" fill="none" stroke="#000" strokeWidth="12" strokeLinecap="round" opacity="0.08" />

          {/* Ceramic cylinder container (Principal Color chosen) */}
          <rect x="68" y="72" width="88" height="114" rx="10" fill={primaryColor} stroke={shadowColor} strokeWidth="1" />
          <rect x="68" y="72" width="88" height="114" rx="10" fill="url(#mug-sheen)" />

          {/* Inner rim contrast color (slightly tinted) */}
          <ellipse cx="112" cy="72" rx="43" ry="7" fill={highlightColor} />
          <ellipse cx="112" cy="72" rx="43" ry="7" fill="#000" opacity="0.05" />

          {/* Personalization center placement */}
          {selectedView !== 'dos' ? renderCustomizationOverlay(110, 126, 12, 34) : null}
        </svg>
      );

    case "carte":
    case "etiquette":
      return (
        <svg {...baseSvgProps}>
          <defs>
            <linearGradient id="card-soft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Card shadow */}
          <rect x="34" y="60" width="176" height="130" rx="8" fill="#1e1e1e" opacity="0.07" filter="blur(3px)" />

          {/* Clean cotton card base (Principal Color chosen) */}
          <rect x="32" y="56" width="176" height="130" rx="8" fill={primaryColor} stroke="#e2e8f0" strokeWidth="1" />
          <rect x="32" y="56" width="176" height="130" rx="8" fill="url(#card-soft)" />

          {/* Pure luxury double golden border framework */}
          <rect x="42" y="66" width="156" height="110" rx="5" fill="none" stroke={accentColor} strokeWidth="1.5" />
          <rect x="46" y="70" width="148" height="102" rx="3" fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.7" />

          {/* Delicate visual design corners */}
          <circle cx="46" cy="70" r="1.5" fill={accentColor} />
          <circle cx="194" cy="70" r="1.5" fill={accentColor} />
          <circle cx="46" cy="172" r="1.5" fill={accentColor} />
          <circle cx="194" cy="172" r="1.5" fill={accentColor} />

          {/* Central personalization content */}
          {selectedView !== 'dos' ? renderCustomizationOverlay(120, 114, 14, 36) : null}
        </svg>
      );
  }
};
