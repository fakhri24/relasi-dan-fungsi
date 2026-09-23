import React from 'react';

export type CanteenItemIconKey =
  | 'nice-cone'
  | 'teh-kubus'
  | 'le-kristal'
  | 'silver-king'
  | 'dimsum'
  | 'sate'
  | 'donut'
  | 'boba'
  | 'popcorn'
  | 'sandwich';

interface CanteenItemIconProps {
  name: string;
  className?: string;
  title?: string;
}

export const CANTEEN_PRESET_ICONS: { id: CanteenItemIconKey; label: string }[] = [
  { id: 'dimsum', label: 'Dimsum / Siomay' },
  { id: 'sate', label: 'Sate / Cilok' },
  { id: 'donut', label: 'Donat Manis' },
  { id: 'boba', label: 'Es Boba Cup' },
  { id: 'popcorn', label: 'Popcorn Jagung' },
  { id: 'sandwich', label: 'Roti Sandwich' },
];

export const CanteenItemIcon: React.FC<CanteenItemIconProps> = ({ name, className = 'w-10 h-10', title }) => {
  // Mapping dari emoji lama atau nama langsung
  const normalizedKey = (() => {
    switch (name) {
      case '🍦':
      case 'nice-cone':
        return 'nice-cone';
      case '🧃':
      case 'teh-kubus':
        return 'teh-kubus';
      case '💧':
      case 'le-kristal':
        return 'le-kristal';
      case '🍫':
      case 'silver-king':
        return 'silver-king';
      case '🥟':
      case 'dimsum':
        return 'dimsum';
      case '🍢':
      case 'sate':
        return 'sate';
      case '🍩':
      case 'donut':
        return 'donut';
      case '🥤':
      case 'boba':
        return 'boba';
      case '🍿':
      case 'popcorn':
        return 'popcorn';
      case '🥪':
      case 'sandwich':
        return 'sandwich';
      default:
        return 'sandwich';
    }
  })();

  const renderSvgContent = () => {
    switch (normalizedKey) {
      case 'nice-cone':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Nice Cone"}>
            <defs>
              <linearGradient id="coneGrad" x1="50" y1="50" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="iceGrad" x1="50" y1="10" x2="50" y2="58" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.5" stopColor="#fde047" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
              <linearGradient id="chocoSauce" x1="50" y1="12" x2="50" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#451a03" />
                <stop offset="1" stopColor="#78350f" />
              </linearGradient>
              <filter id="coneShadow" x="15" y="10" width="70" height="88" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#coneShadow)">
              {/* Kerucut Waffle */}
              <polygon points="50,96 28,52 72,52" fill="url(#coneGrad)" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
              {/* Garis tekstur waffle grid */}
              <path d="M35 52 L57 82 M44 52 L62 70 M53 52 L68 62 M65 52 L43 82 M56 52 L38 70 M47 52 L32 62" stroke="#78350f" strokeWidth="1.2" opacity="0.65" strokeLinecap="round" />
              
              {/* Lingkaran pembatas waffle rim */}
              <ellipse cx="50" cy="52" rx="23" ry="5.5" fill="#d97706" stroke="#78350f" strokeWidth="2" />

              {/* Krim Es Krim Swirl Bawah */}
              <path
                d="M26 51 C24 43 32 38 40 40 C44 35 56 35 60 40 C68 38 76 43 74 51 C72 55 28 55 26 51 Z"
                fill="url(#iceGrad)"
                stroke="#78350f"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Krim Es Krim Swirl Tengah */}
              <path
                d="M32 41 C30 33 38 27 46 29 C50 24 60 25 64 30 C70 34 67 42 63 42 Z"
                fill="url(#iceGrad)"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Puncak Swirl Melengkung */}
              <path
                d="M42 30 C44 20 54 16 57 14 C55 20 58 24 53 28 Z"
                fill="#fef08a"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Lelehan Saus Cokelat Mewah */}
              <path
                d="M34 38 C35 32 44 26 52 26 C60 26 65 32 64 38 C60 43 58 35 54 36 C50 37 49 46 44 44 C41 42 39 46 34 38 Z"
                fill="url(#chocoSauce)"
              />

              {/* Taburan Meses Warna-Warni */}
              <circle cx="39" cy="34" r="1.5" fill="#ef4444" />
              <circle cx="48" cy="31" r="1.5" fill="#3b82f6" />
              <circle cx="58" cy="34" r="1.5" fill="#10b981" />
              <circle cx="52" cy="41" r="1.5" fill="#ec4899" />
              <circle cx="43" cy="46" r="1.5" fill="#f59e0b" />

              {/* Buah Ceri Merah di Pucuk */}
              <circle cx="57" cy="15" r="5.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <path d="M57 10 C59 5 66 5 67 3" stroke="#15803d" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse cx="55.5" cy="13" rx="1.5" ry="1" fill="#fca5a5" />
            </g>
          </svg>
        );

      case 'teh-kubus':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Teh Kubus"}>
            <defs>
              <linearGradient id="teaFront" x1="28" y1="36" x2="72" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor="#059669" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>
              <linearGradient id="teaTop" x1="28" y1="22" x2="68" y2="36" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="teaSide" x1="72" y1="36" x2="84" y2="84" gradientUnits="userSpaceOnUse">
                <stop stopColor="#047857" />
                <stop offset="1" stopColor="#064e3b" />
              </linearGradient>
              <filter id="boxShadow" x="18" y="10" width="72" height="85" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#boxShadow)">
              {/* Sedotan melengkung menancap */}
              <path
                d="M48 27 L48 14 C48 9 55 7 60 10 L68 15"
                stroke="#f97316"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M48 24 L48 20 M48 15 L50 12 M56 8 L60 10 M64 12 L67 14"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Sisi Atas Karton Persegi */}
              <polygon points="30,36 44,24 82,24 68,36" fill="url(#teaTop)" stroke="#064e3b" strokeWidth="2" strokeLinejoin="round" />
              {/* Lubang sedotan */}
              <circle cx="48" cy="28" r="3" fill="#064e3b" />

              {/* Sisi Muka Utama Karton */}
              <polygon points="30,36 68,36 68,88 30,88" fill="url(#teaFront)" stroke="#064e3b" strokeWidth="2.5" strokeLinejoin="round" />

              {/* Sisi Tebal Samping Karton (Perspektif 2.5D) */}
              <polygon points="68,36 82,24 82,76 68,88" fill="url(#teaSide)" stroke="#064e3b" strokeWidth="2" strokeLinejoin="round" />

              {/* Desain Kemasan: Pita Emas & Logo Daun Teh Segar */}
              <rect x="34" y="44" width="30" height="28" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
              
              {/* Daun Teh Hijau */}
              <path
                d="M49 48 C44 48 40 54 44 60 C48 64 54 62 55 56 C56 50 52 48 49 48 Z"
                fill="#10b981"
                stroke="#047857"
                strokeWidth="1.2"
              />
              <path d="M44 57 C48 56 51 53 53 50" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />

              {/* Tulisan TEH & KUBUS */}
              <text x="49" y="68" fill="#78350f" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                TEH
              </text>
              <rect x="37" y="74" width="24" height="7" rx="2" fill="#d97706" />
              <text x="49" y="79" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                KUBUS
              </text>

              {/* Garis Barcode Mini di Sisi Samping */}
              <line x1="72" y1="42" x2="79" y2="36" stroke="#a7f3d0" strokeWidth="1" />
              <line x1="73" y1="48" x2="80" y2="42" stroke="#a7f3d0" strokeWidth="1.5" />
              <line x1="72" y1="54" x2="79" y2="48" stroke="#a7f3d0" strokeWidth="1" />
              <line x1="72" y1="60" x2="79" y2="54" stroke="#a7f3d0" strokeWidth="2" />
            </g>
          </svg>
        );

      case 'le-kristal':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Le Kristal"}>
            <defs>
              <linearGradient id="waterBody" x1="32" y1="20" x2="68" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="0.5" stopColor="#7dd3fc" stopOpacity="0.75" />
                <stop offset="1" stopColor="#0284c7" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="labelGrad" x1="30" y1="50" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1e3a8a" />
                <stop offset="0.5" stopColor="#2563eb" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="capGrad" x1="42" y1="10" x2="58" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2563eb" />
                <stop offset="1" stopColor="#1e40af" />
              </linearGradient>
              <filter id="bottleShadow" x="25" y="8" width="50" height="88" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#bottleShadow)">
              {/* Tutup Botol Ulir Biru */}
              <rect x="44" y="10" width="12" height="7" rx="1.5" fill="url(#capGrad)" stroke="#1e3a8a" strokeWidth="1.5" />
              <line x1="46" y1="12" x2="46" y2="15" stroke="#93c5fd" strokeWidth="1" />
              <line x1="50" y1="12" x2="50" y2="15" stroke="#93c5fd" strokeWidth="1" />
              <line x1="54" y1="12" x2="54" y2="15" stroke="#93c5fd" strokeWidth="1" />

              {/* Leher Botol */}
              <path d="M45 17 L45 22 L36 32 L36 42 L38 48 L36 54 L36 86 C36 90 40 92 50 92 C60 92 64 90 64 86 L64 54 L62 48 L64 42 L64 32 L55 22 L55 17 Z"
                fill="url(#waterBody)"
                stroke="#0284c7"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Lekukan Tulang Ergonomis Botol Kristal */}
              <path d="M37 36 Q50 39 63 36" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />
              <path d="M38 48 Q50 51 62 48" stroke="#e0f2fe" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8" />

              {/* Label Botol Biru Segar */}
              <path d="M36 53 C42 55 58 55 64 53 L64 73 C58 75 42 75 36 73 Z" fill="url(#labelGrad)" stroke="#1e40af" strokeWidth="1.5" />

              {/* Grafis Gunung & Kilau Air pada Label */}
              <polygon points="43,67 50,57 57,67" fill="#ffffff" />
              <polygon points="50,57 52,60 48,60" fill="#93c5fd" />
              <polygon points="40,68 45,61 49,68" fill="#bae6fd" />
              
              <text x="50" y="71" fill="#ffffff" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">
                LE KRISTAL
              </text>

              {/* Refleksi Kilau Cahaya Vertikal */}
              <path d="M40 26 L40 32 M39 56 L39 70 M39 77 L39 85" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>
        );

      case 'silver-king':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "SilverKing"}>
            <defs>
              <linearGradient id="wrapRed" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e11d48" />
                <stop offset="0.6" stopColor="#be123c" />
                <stop offset="1" stopColor="#881337" />
              </linearGradient>
              <linearGradient id="silverFoil" x1="45" y1="15" x2="75" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f8fafc" />
                <stop offset="0.5" stopColor="#cbd5e1" />
                <stop offset="1" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="chocoTile" x1="45" y1="18" x2="78" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#581c87" stopOpacity="0" />
                <stop stopColor="#451a03" />
                <stop offset="1" stopColor="#270e02" />
              </linearGradient>
              <filter id="chocoShadow" x="18" y="12" width="68" height="80" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#chocoShadow)">
              {/* Cokelat Padat Terbuka di Bagian Atas */}
              <polygon points="32,20 72,20 72,50 32,50" fill="#451a03" stroke="#270e02" strokeWidth="1.5" />
              
              {/* Petak-Petak Cokelat Premium Bertekstur */}
              <rect x="36" y="22" width="14" height="11" rx="1.5" fill="#78350f" stroke="#270e02" strokeWidth="1" />
              <rect x="54" y="22" width="14" height="11" rx="1.5" fill="#78350f" stroke="#270e02" strokeWidth="1" />
              <rect x="36" y="35" width="14" height="11" rx="1.5" fill="#78350f" stroke="#270e02" strokeWidth="1" />
              <rect x="54" y="35" width="14" height="11" rx="1.5" fill="#78350f" stroke="#270e02" strokeWidth="1" />

              {/* Foil Aluminium Perak Sobek Berkerut */}
              <path
                d="M26 40 L76 34 L78 48 L72 45 L66 50 L58 46 L50 51 L42 47 L34 52 L26 46 Z"
                fill="url(#silverFoil)"
                stroke="#64748b"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              {/* Bungkus Merah SilverKing Utama */}
              <path
                d="M26 46 L76 40 L76 86 L26 86 Z"
                fill="url(#wrapRed)"
                stroke="#881337"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Pita Emas Kemasan Mewah */}
              <rect x="26" y="55" width="50" height="16" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
              <line x1="26" y1="57" x2="76" y2="57" stroke="#fef3c7" strokeWidth="0.8" />
              <line x1="26" y1="69" x2="76" y2="69" stroke="#92400e" strokeWidth="0.8" />

              {/* Teks Brand SilverKing */}
              <text x="51" y="66" fill="#78350f" fontSize="6.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.8">
                SILVERKING
              </text>

              {/* Crown / Mahkota Logo Kecil */}
              <path d="M48 52 L51 54 L54 52 L53 55 L49 55 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="0.6" />
              
              <text x="51" y="79" fill="#fecdd3" fontSize="4" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                CHOCOLATE 65g
              </text>

              {/* Zigzag Segel Pinggir Kemasan Bawah */}
              <path
                d="M26 86 L29 88 L32 86 L35 88 L38 86 L41 88 L44 86 L47 88 L50 86 L53 88 L56 86 L59 88 L62 86 L65 88 L68 86 L71 88 L74 86 L76 88"
                stroke="#881337"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          </svg>
        );

      case 'dimsum':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Dimsum / Siomay"}>
            <defs>
              <linearGradient id="steamerGrad" x1="15" y1="55" x2="85" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d97706" />
                <stop offset="1" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="dimsumSkin" x1="30" y1="35" x2="70" y2="75" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef3c7" />
                <stop offset="1" stopColor="#fde68a" />
              </linearGradient>
              <filter id="dimsumShadow" x="12" y="20" width="76" height="75" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#dimsumShadow)">
              {/* Asap Panas Wangi Mengepul */}
              <path d="M42 22 Q40 14 44 8" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" fill="none" />
              <path d="M52 24 Q55 16 51 10" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" fill="none" />
              <path d="M60 22 Q58 15 62 9" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" fill="none" />

              {/* Alas Wadah Kukusan Bambu */}
              <ellipse cx="50" cy="78" rx="36" ry="12" fill="url(#steamerGrad)" stroke="#78350f" strokeWidth="2.5" />
              <ellipse cx="50" cy="74" rx="34" ry="10" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />

              {/* Daun Selada Alas Hijau */}
              <path d="M24 70 C28 64 36 68 42 66 C48 64 56 64 62 66 C68 68 76 65 78 70 C72 74 30 74 24 70 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2" />

              {/* Pangsit Dimsum 1 (Kiri) */}
              <g>
                <path d="M28 62 C26 50 34 44 42 46 C48 48 48 56 46 64 C42 67 32 66 28 62 Z" fill="url(#dimsumSkin)" stroke="#b45309" strokeWidth="1.8" strokeLinejoin="round" />
                <ellipse cx="37" cy="48" rx="6" ry="3.5" fill="#f59e0b" />
                <circle cx="37" cy="48" r="1.5" fill="#ea580c" />
              </g>

              {/* Pangsit Dimsum 2 (Kanan Belakang) */}
              <g>
                <path d="M54 62 C52 50 60 44 68 46 C74 48 74 56 72 64 C68 67 58 66 54 62 Z" fill="url(#dimsumSkin)" stroke="#b45309" strokeWidth="1.8" strokeLinejoin="round" />
                <ellipse cx="63" cy="48" rx="6" ry="3.5" fill="#f59e0b" />
                <circle cx="63" cy="48" r="1.5" fill="#ea580c" />
              </g>

              {/* Pangsit Dimsum 3 Utama (Tengah Depan - Paling Besar) */}
              <g>
                <path d="M38 68 C35 52 45 42 53 43 C63 42 67 52 64 68 C58 72 44 72 38 68 Z" fill="url(#dimsumSkin)" stroke="#b45309" strokeWidth="2.2" strokeLinejoin="round" />
                {/* Lipatan Ruffle Pangsit */}
                <path d="M42 46 C44 49 46 54 45 60 M52 44 C53 49 53 55 52 62 M60 46 C59 50 58 55 59 61" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Isian Daging & Taburan Wortel Gurih */}
                <ellipse cx="51" cy="45" rx="7.5" ry="4.5" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
                <circle cx="49" cy="44" r="1.2" fill="#ef4444" />
                <circle cx="53" cy="45" r="1.2" fill="#ef4444" />
                <circle cx="51" cy="47" r="1.2" fill="#ef4444" />
                <circle cx="52" cy="43.5" r="1" fill="#16a34a" />
              </g>
            </g>
          </svg>
        );

      case 'sate':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Sate / Cilok"}>
            <defs>
              <linearGradient id="meatGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#92400e" />
                <stop offset="0.7" stopColor="#78350f" />
                <stop offset="1" stopColor="#451a03" />
              </linearGradient>
              <linearGradient id="sauceGrad" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#b45309" />
                <stop offset="1" stopColor="#78350f" />
              </linearGradient>
              <filter id="sateShadow" x="12" y="10" width="76" height="80" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#sateShadow)">
              {/* Tusuk Bambu Diagonal Tajam */}
              <line x1="84" y1="16" x2="16" y2="84" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="84" y1="16" x2="16" y2="84" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
              <polygon points="84,16 88,12 85,19" fill="#d97706" />

              {/* Daging / Cilok Tusuk 1 (Atas) */}
              <rect x="58" y="24" width="18" height="15" rx="6" transform="rotate(-45 67 31.5)" fill="url(#meatGrad)" stroke="#451a03" strokeWidth="2" />
              <line x1="62" y1="26" x2="70" y2="34" stroke="#270e02" strokeWidth="1.5" strokeLinecap="round" />

              {/* Daging / Cilok Tusuk 2 (Tengah) */}
              <rect x="42" y="40" width="20" height="17" rx="7" transform="rotate(-45 52 48.5)" fill="url(#meatGrad)" stroke="#451a03" strokeWidth="2" />
              <line x1="46" y1="42" x2="56" y2="52" stroke="#270e02" strokeWidth="1.8" strokeLinecap="round" />

              {/* Daging / Cilok Tusuk 3 (Bawah) */}
              <rect x="26" y="56" width="18" height="15" rx="6" transform="rotate(-45 35 63.5)" fill="url(#meatGrad)" stroke="#451a03" strokeWidth="2" />
              <line x1="30" y1="58" x2="38" y2="66" stroke="#270e02" strokeWidth="1.5" strokeLinecap="round" />

              {/* Siraman Saus Kacang Lezat Mengkilap */}
              <path
                d="M72 26 C68 32 60 36 62 42 C64 48 54 52 50 56 C46 60 40 64 36 66"
                stroke="url(#sauceGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Taburan Irisan Cabai Merah & Bawang */}
              <circle cx="56" cy="38" r="2.2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
              <circle cx="48" cy="46" r="2.2" fill="#10b981" stroke="#065f46" strokeWidth="0.8" />
              <circle cx="42" cy="56" r="2.2" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
              <circle cx="63" cy="33" r="1.5" fill="#fef08a" />
            </g>
          </svg>
        );

      case 'donut':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Donat"}>
            <defs>
              <linearGradient id="donutDough" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.7" stopColor="#d97706" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="pinkGlaze" x1="25" y1="20" x2="75" y2="75" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" />
                <stop offset="0.6" stopColor="#ec4899" />
                <stop offset="1" stopColor="#db2777" />
              </linearGradient>
              <filter id="donutShadow" x="12" y="12" width="76" height="76" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#donutShadow)">
              {/* Adonan Donat Emas Renyah */}
              <ellipse cx="50" cy="50" rx="36" ry="34" fill="url(#donutDough)" stroke="#92400e" strokeWidth="2.5" />
              
              {/* Glaze Manis Stroberi Meleleh */}
              <path
                d="M50 18 C68 18 82 30 82 48 C82 56 78 58 76 54 C74 50 68 62 62 60 C58 58 56 68 50 68 C44 68 40 60 36 62 C32 64 26 52 24 56 C22 60 18 56 18 48 C18 30 32 18 50 18 Z"
                fill="url(#pinkGlaze)"
                stroke="#be185d"
                strokeWidth="1.8"
              />

              {/* Lubang Tengah Donat */}
              <ellipse cx="50" cy="50" rx="13" ry="12" fill="var(--donut-hole-bg, #0b1120)" stroke="#92400e" strokeWidth="2" />

              {/* Kilau Cahaya pada Glaze */}
              <path d="M30 26 C36 22 45 20 54 21" stroke="#fbcfe8" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* Taburan Meses Warna-Warni (Rainbow Sprinkles) */}
              {/* Putih */}
              <line x1="34" y1="36" x2="38" y2="34" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="62" y1="32" x2="66" y2="35" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="46" y1="24" x2="50" y2="24" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
              {/* Kuning */}
              <line x1="28" y1="46" x2="32" y2="48" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="68" y1="44" x2="72" y2="42" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
              {/* Biru / Cyan */}
              <line x1="40" y1="30" x2="44" y2="32" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="60" y1="56" x2="64" y2="53" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
              {/* Hijau */}
              <line x1="36" y1="58" x2="40" y2="56" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="56" y1="28" x2="58" y2="32" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" />
              {/* Cokelat */}
              <line x1="72" y1="52" x2="74" y2="56" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="26" y1="38" x2="30" y2="40" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'boba':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Es Boba Cup"}>
            <defs>
              <linearGradient id="teaGradient" x1="30" y1="40" x2="70" y2="88" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.5" stopColor="#d97706" />
                <stop offset="1" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="foamGrad" x1="30" y1="35" x2="70" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="1" stopColor="#fef3c7" />
              </linearGradient>
              <filter id="bobaShadow" x="18" y="10" width="68" height="85" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#bobaShadow)">
              {/* Sedotan Boba Besar Menancap Miring */}
              <polygon points="56,8 64,10 46,75 38,73" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.8" />
              <ellipse cx="60" cy="9" rx="4" ry="1.5" fill="#c084fc" />

              {/* Tutup Cup Dome Melengkung */}
              <path d="M28 35 C28 22 72 22 72 35 Z" fill="#e2e8f0" fillOpacity="0.75" stroke="#94a3b8" strokeWidth="2" />
              <rect x="25" y="34" width="50" height="5" rx="2.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Badan Gelas Plastik Transparan */}
              <path
                d="M28 38 L34 86 C35 90 40 92 50 92 C60 92 65 90 66 86 L72 38 Z"
                fill="#0f172a"
                fillOpacity="0.3"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Isi Minuman Milk Tea */}
              <path
                d="M29 44 L34 86 C35 90 40 92 50 92 C60 92 65 90 66 86 L71 44 Z"
                fill="url(#teaGradient)"
              />

              {/* Lapisan Cheese Cream / Foam Susu */}
              <path
                d="M29 44 C34 47 66 47 71 44 L71 40 L29 40 Z"
                fill="url(#foamGrad)"
              />

              {/* Es Batu Mengambang */}
              <rect x="38" y="46" width="10" height="9" rx="2" fill="#ffffff" fillOpacity="0.6" stroke="#ffffff" strokeWidth="0.8" transform="rotate(15 43 50)" />
              <rect x="52" y="47" width="10" height="9" rx="2" fill="#ffffff" fillOpacity="0.6" stroke="#ffffff" strokeWidth="0.8" transform="rotate(-10 57 51)" />

              {/* Butiran Pearls Boba Hitam Mengkilap di Dasar */}
              <circle cx="40" cy="85" r="4" fill="#0f172a" stroke="#000000" strokeWidth="1" />
              <circle cx="39" cy="84" r="1.2" fill="#ffffff" opacity="0.6" />
              <circle cx="50" cy="86" r="4.2" fill="#0f172a" stroke="#000000" strokeWidth="1" />
              <circle cx="49" cy="85" r="1.2" fill="#ffffff" opacity="0.6" />
              <circle cx="60" cy="84" r="4" fill="#0f172a" stroke="#000000" strokeWidth="1" />
              <circle cx="59" cy="83" r="1.2" fill="#ffffff" opacity="0.6" />
              <circle cx="44" cy="79" r="3.8" fill="#0f172a" stroke="#000000" strokeWidth="1" />
              <circle cx="43" cy="78" r="1" fill="#ffffff" opacity="0.6" />
              <circle cx="55" cy="80" r="3.8" fill="#0f172a" stroke="#000000" strokeWidth="1" />
              <circle cx="54" cy="79" r="1" fill="#ffffff" opacity="0.6" />

              {/* Kilau Plastik Gelas */}
              <path d="M33 46 L37 84" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </g>
          </svg>
        );

      case 'popcorn':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Popcorn Jagung"}>
            <defs>
              <linearGradient id="cornGrad" x1="30" y1="15" x2="70" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef08a" />
                <stop offset="0.6" stopColor="#fde047" />
                <stop offset="1" stopColor="#ca8a04" />
              </linearGradient>
              <filter id="popcornShadow" x="18" y="10" width="64" height="85" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#popcornShadow)">
              {/* Wadah Kotak Popcorn Garis Merah Putih */}
              <polygon points="28,45 72,45 66,92 34,92" fill="#ffffff" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
              
              {/* Garis-Garis Merah Bioskop */}
              <polygon points="34,45 40,45 39,92 34,92" fill="#ef4444" />
              <polygon points="46,45 54,45 53,92 47,92" fill="#ef4444" />
              <polygon points="60,45 66,45 65,92 61,92" fill="#ef4444" />

              {/* Logo / Badge POPCORN */}
              <ellipse cx="50" cy="68" rx="14" ry="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <text x="50" y="70.5" fill="#991b1b" fontSize="5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
                POPCORN
              </text>

              {/* Butiran Popcorn Mekar Gurih Emas */}
              {/* Lapis Bawah */}
              <circle cx="34" cy="42" r="7" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.2" />
              <circle cx="44" cy="40" r="7" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.2" />
              <circle cx="56" cy="40" r="7" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.2" />
              <circle cx="66" cy="42" r="7" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.2" />

              {/* Lapis Tengah Menggunung */}
              <circle cx="38" cy="32" r="8" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="50" cy="29" r="8.5" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="62" cy="32" r="8" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Puncak Atas Popcorn */}
              <circle cx="44" cy="20" r="7.5" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="55" cy="19" r="7.5" fill="url(#cornGrad)" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Guratan Detail Kernel Mentega Popcorn */}
              <path d="M48 27 C50 25 53 25 54 28" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M36 30 C38 29 40 31 39 34" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M60 30 C62 29 64 31 63 34" stroke="#a16207" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        );

      case 'sandwich':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label={title || "Roti Sandwich"}>
            <defs>
              <linearGradient id="breadCrust" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="0.7" stopColor="#d97706" />
                <stop offset="1" stopColor="#92400e" />
              </linearGradient>
              <linearGradient id="breadCrumb" x1="25" y1="25" x2="75" y2="75" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fffbeb" />
                <stop offset="1" stopColor="#fef3c7" />
              </linearGradient>
              <filter id="sandShadow" x="12" y="15" width="76" height="75" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            <g filter="url(#sandShadow)">
              {/* Roti Bawah (Segitiga Potong) */}
              <polygon points="18,72 82,72 82,24" fill="url(#breadCrust)" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
              <polygon points="23,69 79,69 79,29" fill="url(#breadCrumb)" />

              {/* Lapisan Daging / Smoked Beef */}
              <polygon points="20,62 82,62 82,56 24,56" fill="#be123c" stroke="#881337" strokeWidth="1.5" />

              {/* Keju Cheddar Meleleh Menetes Kuning */}
              <polygon points="18,57 82,57 82,51 22,51" fill="#f59e0b" />
              {/* Tetesan Lelehan Keju */}
              <path d="M42 57 L46 64 L50 57 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
              <path d="M64 57 L68 66 L72 57 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />

              {/* Selada Hijau Keriting Segar */}
              <path
                d="M16,51 Q20,44 26,49 Q32,43 38,48 Q44,42 52,48 Q60,43 68,49 Q74,44 84,49 L84,53 L16,53 Z"
                fill="#22c55e"
                stroke="#15803d"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />

              {/* Irisan Tomat Merah Matang */}
              <rect x="30" y="42" width="16" height="6" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
              <rect x="52" y="38" width="18" height="6" rx="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

              {/* Roti Atas (Segitiga Toasted) */}
              <polygon points="18,44 82,44 82,18" fill="url(#breadCrust)" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
              <polygon points="24,41 79,41 79,24" fill="url(#breadCrumb)" />

              {/* Biji Wijen / Toast Marks di Roti Atas */}
              <ellipse cx="48" cy="35" rx="1.8" ry="1" fill="#92400e" transform="rotate(-15 48 35)" />
              <ellipse cx="62" cy="32" rx="1.8" ry="1" fill="#92400e" transform="rotate(20 62 32)" />
              <ellipse cx="72" cy="28" rx="1.8" ry="1" fill="#92400e" transform="rotate(-10 72 28)" />
            </g>
          </svg>
        );
    }
  };

  return <div className="inline-flex items-center justify-center select-none">{renderSvgContent()}</div>;
};
