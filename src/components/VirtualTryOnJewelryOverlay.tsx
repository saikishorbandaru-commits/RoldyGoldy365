import React, { useMemo } from 'react';
import { Product } from '../types';

interface VirtualTryOnJewelryOverlayProps {
  product: Product;
  activeImage: string;
  itemType: 'choker' | 'earrings' | 'tikka' | 'necklace' | 'bangles';
  scale: number;
  rotation: number;
  opacity: number;
  skinWarmth?: { r: number; g: number; b: number; warmthFactor: number };
}

export const VirtualTryOnJewelryOverlay: React.FC<VirtualTryOnJewelryOverlayProps> = ({
  product,
  itemType,
  opacity,
  skinWarmth,
}) => {
  // Ambient skin warmth reflection styling for photorealism
  const warmthGlow = skinWarmth
    ? `rgba(${Math.min(255, Math.round(skinWarmth.r * 1.15))}, ${Math.min(255, Math.round(skinWarmth.g * 0.85))}, ${Math.min(255, Math.round(skinWarmth.b * 0.5))}, 0.45)`
    : 'rgba(217, 119, 6, 0.4)';

  // Determine sub-archetype from product name and details
  const nameLower = (product.name || '').toLowerCase();
  const isHoop = nameLower.includes('hoop') || nameLower.includes('huggie') || nameLower.includes('korean');
  const isJhumka = nameLower.includes('jhumka') || nameLower.includes('chandbali') || nameLower.includes('temple');
  const isChain = nameLower.includes('chain') || nameLower.includes('paperclip') || nameLower.includes('minimalist');
  const isHaram = nameLower.includes('haram') || nameLower.includes('kasu') || nameLower.includes('long');
  const isKundanChoker = itemType === 'choker' || nameLower.includes('choker') || nameLower.includes('rajwada');

  // Render photorealistic high-fidelity 3D jewellery structure
  const renderPhotorealisticAsset = () => {
    // 1. EARRINGS CATEGORY
    if (itemType === 'earrings') {
      if (isHoop) {
        // Modern 18K Yellow/Rose Gold Dipped Minimalist Huggie Hoops with Embedded Diamond Baguettes
        return (
          <div className="relative w-80 sm:w-96 flex items-center justify-between px-6 pointer-events-none select-none">
            {/* Left Earring */}
            <svg viewBox="0 0 110 130" className="w-16 sm:w-20 h-auto overflow-visible filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]">
              <defs>
                <linearGradient id="hoopGoldGradL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="25%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#fef9c3" />
                  <stop offset="75%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <linearGradient id="diamondShine" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#e0f2fe" />
                  <stop offset="100%" stopColor="#bae6fd" />
                </linearGradient>
              </defs>
              {/* Ear Lobe Post Clip */}
              <rect x="52" y="10" width="6" height="14" rx="3" fill="url(#hoopGoldGradL)" stroke="#78350f" strokeWidth="0.8" />
              {/* Main 3D Chunky Tube Hoop */}
              <circle cx="55" cy="65" r="42" fill="none" stroke="url(#hoopGoldGradL)" strokeWidth="12" strokeLinecap="round" />
              {/* Inner Specular Highlight Tube */}
              <circle cx="53" cy="63" r="42" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" strokeDasharray="30 60" />
              {/* Pavé Diamond Channel Inlay */}
              {[-25, -12, 0, 12, 25].map((ang, i) => (
                <g key={i} transform={`translate(55, 65) rotate(${ang}) translate(0, 42)`}>
                  <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="url(#diamondShine)" stroke="#0284c7" strokeWidth="0.5" />
                  <circle cx="-1.5" cy="-1" r="1.2" fill="#ffffff" />
                </g>
              ))}
              {/* Sparkling light glint */}
              <polygon points="55,100 58,107 65,107 60,111 62,118 55,114 48,118 50,111 45,107 52,107" fill="#ffffff" opacity="0.9" className="animate-pulse" />
            </svg>

            {/* Spacer representing facial anatomy width */}
            <div className="flex-1" />

            {/* Right Earring (Mirrored Angle) */}
            <svg viewBox="0 0 110 130" className="w-16 sm:w-20 h-auto overflow-visible filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] -scale-x-100">
              <rect x="52" y="10" width="6" height="14" rx="3" fill="url(#hoopGoldGradL)" stroke="#78350f" strokeWidth="0.8" />
              <circle cx="55" cy="65" r="42" fill="none" stroke="url(#hoopGoldGradL)" strokeWidth="12" strokeLinecap="round" />
              <circle cx="53" cy="63" r="42" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.85" strokeDasharray="30 60" />
              {[-25, -12, 0, 12, 25].map((ang, i) => (
                <g key={i} transform={`translate(55, 65) rotate(${ang}) translate(0, 42)`}>
                  <rect x="-4" y="-3" width="8" height="6" rx="1.5" fill="url(#diamondShine)" stroke="#0284c7" strokeWidth="0.5" />
                  <circle cx="-1.5" cy="-1" r="1.2" fill="#ffffff" />
                </g>
              ))}
              <polygon points="55,100 58,107 65,107 60,111 62,118 55,114 48,118 50,111 45,107 52,107" fill="#ffffff" opacity="0.9" className="animate-pulse" />
            </svg>
          </div>
        );
      } else {
        // Traditional Royal Temple Antique Kemp Jhumka Earrings with Micro-pearl Seed Chimes
        return (
          <div className="relative w-80 sm:w-96 flex items-center justify-between px-4 pointer-events-none select-none">
            {/* Left Antique Kemp Jhumka */}
            <svg viewBox="0 0 130 190" className="w-20 sm:w-24 h-auto overflow-visible filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)]">
              <defs>
                <linearGradient id="antiqueGoldMatte" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="30%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <radialGradient id="kempRuby" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="40%" stopColor="#e11d48" />
                  <stop offset="85%" stopColor="#9f1239" />
                  <stop offset="100%" stopColor="#4c0519" />
                </radialGradient>
              </defs>

              {/* Stud Top: Kemp Flower with Gilded Center */}
              <g transform="translate(65, 26)">
                <circle cx="0" cy="0" r="18" fill="url(#antiqueGoldMatte)" stroke="#451a03" strokeWidth="1.5" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const rad = (i * 45 * Math.PI) / 180;
                  return (
                    <circle
                      key={i}
                      cx={Math.cos(rad) * 11}
                      cy={Math.sin(rad) * 11}
                      r="4"
                      fill="url(#kempRuby)"
                      stroke="#451a03"
                      strokeWidth="0.8"
                    />
                  );
                })}
                <circle cx="0" cy="0" r="6" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
                <circle cx="-1.5" cy="-1.5" r="2" fill="#ffffff" opacity="0.9" />
              </g>

              {/* Connecting Filigree Hinge Loop */}
              <path d="M 62,44 C 62,56 68,56 68,44" fill="none" stroke="url(#antiqueGoldMatte)" strokeWidth="3" />

              {/* 3D Bell Jhumka Dome */}
              <g transform="translate(65, 96)">
                <path
                  d="M -36,0 C -36,-38 36,-38 36,0 C 36,12 -36,12 -36,0 Z"
                  fill="url(#antiqueGoldMatte)"
                  stroke="#451a03"
                  strokeWidth="2"
                />
                {/* Filigree Arch bands on bell */}
                <path d="M -32,-8 Q 0,-24 32,-8" fill="none" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M -34,0 Q 0,-12 34,0" fill="none" stroke="#fef08a" strokeWidth="2" />
                
                {/* Embedded ruby band around jhumka perimeter */}
                {[-26, -13, 0, 13, 26].map((x, idx) => (
                  <circle key={idx} cx={x} cy="-2" r="3.2" fill="url(#kempRuby)" stroke="#78350f" strokeWidth="0.6" />
                ))}

                {/* Hanging Cluster of Basra Seed Pearls */}
                {[-28, -19, -10, 0, 10, 19, 28].map((xOff, i) => (
                  <g key={i} transform={`translate(${xOff}, 12)`}>
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#78350f" strokeWidth="1.2" />
                    {/* Natural Pearl Luster */}
                    <circle cx="0" cy="14" r="4.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                    <circle cx="-1" cy="13" r="1.5" fill="#ffffff" />
                  </g>
                ))}
              </g>
            </svg>

            {/* Anatomical Face Gap */}
            <div className="flex-1" />

            {/* Right Antique Kemp Jhumka (Mirrored) */}
            <svg viewBox="0 0 130 190" className="w-20 sm:w-24 h-auto overflow-visible filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)] -scale-x-100">
              <g transform="translate(65, 26)">
                <circle cx="0" cy="0" r="18" fill="url(#antiqueGoldMatte)" stroke="#451a03" strokeWidth="1.5" />
                {Array.from({ length: 8 }).map((_, i) => {
                  const rad = (i * 45 * Math.PI) / 180;
                  return (
                    <circle
                      key={i}
                      cx={Math.cos(rad) * 11}
                      cy={Math.sin(rad) * 11}
                      r="4"
                      fill="url(#kempRuby)"
                      stroke="#451a03"
                      strokeWidth="0.8"
                    />
                  );
                })}
                <circle cx="0" cy="0" r="6" fill="#fef08a" stroke="#78350f" strokeWidth="1" />
                <circle cx="-1.5" cy="-1.5" r="2" fill="#ffffff" opacity="0.9" />
              </g>

              <path d="M 62,44 C 62,56 68,56 68,44" fill="none" stroke="url(#antiqueGoldMatte)" strokeWidth="3" />

              <g transform="translate(65, 96)">
                <path
                  d="M -36,0 C -36,-38 36,-38 36,0 C 36,12 -36,12 -36,0 Z"
                  fill="url(#antiqueGoldMatte)"
                  stroke="#451a03"
                  strokeWidth="2"
                />
                <path d="M -32,-8 Q 0,-24 32,-8" fill="none" stroke="#78350f" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M -34,0 Q 0,-12 34,0" fill="none" stroke="#fef08a" strokeWidth="2" />
                {[-26, -13, 0, 13, 26].map((x, idx) => (
                  <circle key={idx} cx={x} cy="-2" r="3.2" fill="url(#kempRuby)" stroke="#78350f" strokeWidth="0.6" />
                ))}
                {[-28, -19, -10, 0, 10, 19, 28].map((xOff, i) => (
                  <g key={i} transform={`translate(${xOff}, 12)`}>
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#78350f" strokeWidth="1.2" />
                    <circle cx="0" cy="14" r="4.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                    <circle cx="-1" cy="13" r="1.5" fill="#ffffff" />
                  </g>
                ))}
              </g>
            </svg>
          </div>
        );
      }
    }

    // 2. CHOKER & BRIDAL COLLAR CATEGORY
    if (itemType === 'choker' || isKundanChoker) {
      return (
        <div className="relative w-80 sm:w-96 flex flex-col items-center pointer-events-none select-none">
          <svg viewBox="0 0 380 200" className="w-full h-auto overflow-visible filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.92)]">
            <defs>
              <linearGradient id="choker22k" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="20%" stopColor="#fde047" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="hydroEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="40%" stopColor="#059669" />
                <stop offset="85%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              <radialGradient id="polkiFacet" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fef9c3" />
                <stop offset="100%" stopColor="#fde047" />
              </radialGradient>
            </defs>

            {/* Adjustable Zari / Gold Thread Back Neck Ties */}
            <path d="M 40,15 Q 110,65 190,75 Q 270,65 340,15" fill="none" stroke="#78350f" strokeWidth="3" strokeDasharray="6 3" />
            <circle cx="190" cy="74" r="6" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />

            {/* Upper Pearl Choker Strand */}
            {Array.from({ length: 27 }).map((_, i) => {
              const t = (i + 1) / 28;
              const x = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 190 + t * t * 330;
              const y = (1 - t) * (1 - t) * 45 + 2 * (1 - t) * t * 105 + t * t * 45;
              return (
                <circle key={i} cx={x} cy={y - 6} r="3.2" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
              );
            })}

            {/* Solid Kundan 22K Gold Arch Structure */}
            <path
              d="M 50,45 Q 190,118 330,45 Q 338,68 322,82 Q 190,150 58,82 Q 42,68 50,45 Z"
              fill="url(#choker22k)"
              stroke="#451a03"
              strokeWidth="2"
            />

            {/* Polki Diamond Vitrines along Neck Band */}
            {Array.from({ length: 15 }).map((_, i) => {
              const t = (i + 1) / 16;
              const x = (1 - t) * (1 - t) * 58 + 2 * (1 - t) * t * 190 + t * t * 322;
              const y = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * 128 + t * t * 62;
              return (
                <g key={i}>
                  {/* Gold Bezel Frame */}
                  <rect
                    x={x - 8}
                    y={y - 10}
                    width="16"
                    height="20"
                    rx="3.5"
                    fill="url(#polkiFacet)"
                    stroke="#78350f"
                    strokeWidth="1.2"
                  />
                  {/* Center Gem Facet Line */}
                  <circle cx={x} cy={y} r="3.5" fill="#fef08a" />
                  <circle cx={x - 2} cy={y - 3} r="1.8" fill="#ffffff" opacity="0.95" />
                </g>
              );
            })}

            {/* Hydro Emerald Teardrops and Pearl Jhumkis */}
            {Array.from({ length: 11 }).map((_, i) => {
              const t = (i + 1) / 12;
              const x = (1 - t) * (1 - t) * 75 + 2 * (1 - t) * t * 190 + t * t * 305;
              const y = (1 - t) * (1 - t) * 80 + 2 * (1 - t) * t * 144 + t * t * 80;
              const isCenter = i === 5;
              const dropLen = isCenter ? 44 : i === 4 || i === 6 ? 36 : 28;

              return (
                <g key={i}>
                  {/* Gold Connector Ring */}
                  <circle cx={x} cy={y + 5} r="2.8" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                  {/* Pearl Bead */}
                  <circle cx={x} cy={y + 13} r="3.8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                  {/* Emerald Gem Drop */}
                  <path
                    d={`M ${x},${y + 17} C ${x - 7},${y + 22} ${x - 8},${y + dropLen} ${x},${y + dropLen + 5} C ${x + 8},${y + dropLen} ${x + 7},${y + 22} ${x},${y + 17} Z`}
                    fill="url(#hydroEmerald)"
                    stroke="#064e3b"
                    strokeWidth="1.2"
                  />
                  {/* Emerald Specular Highlight */}
                  <path
                    d={`M ${x - 3},${y + 22} C ${x - 5},${y + 26} ${x - 5},${y + dropLen - 4} ${x - 1},${y + dropLen}`}
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    // 3. LONG HARAM / CHAIN / NECKLACE CATEGORY
    if (itemType === 'necklace') {
      if (isChain) {
        // Modern 18K Yellow Gold Sleek Paperclip Link Chain with Solitaire Pendant
        return (
          <div className="relative w-80 sm:w-96 flex flex-col items-center pointer-events-none select-none">
            <svg viewBox="0 0 340 240" className="w-full h-auto overflow-visible filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.85)]">
              <defs>
                <linearGradient id="paperclipGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>

              {/* Elongated Interlinked Paperclip Links along chest contour */}
              {Array.from({ length: 23 }).map((_, i) => {
                const t = i / 22;
                const x = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 170 + t * t * 280;
                const y = (1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 190 + t * t * 20;
                const angle = (t - 0.5) * 65;

                return (
                  <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                    <rect
                      x="-7"
                      y="-4"
                      width="14"
                      height="8"
                      rx="3.5"
                      fill="none"
                      stroke="url(#paperclipGold)"
                      strokeWidth="2.8"
                    />
                    <line x1="-5" y1="0" x2="5" y2="0" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
                  </g>
                );
              })}

              {/* Center Moissanite Solitaire Floating Pendant */}
              <g transform="translate(170, 195)">
                {/* Gold Bezel Bail */}
                <rect x="-4" y="-12" width="8" height="10" rx="2" fill="url(#paperclipGold)" stroke="#78350f" strokeWidth="1" />
                {/* 2ct Brilliant Round Moissanite */}
                <circle cx="0" cy="6" r="14" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Brilliant Star Facets */}
                <polygon points="0,-4 3,4 10,6 3,8 0,16 -3,8 -10,6 -3,4" fill="#e0f2fe" />
                <circle cx="-3" cy="2" r="3" fill="#ffffff" />
                {/* Glint Sparkle */}
                <polygon points="0,-12 2,-2 12,0 2,2 0,12 -2,2 -12,0 -2,-2" fill="#ffffff" opacity="0.9" className="animate-pulse" />
              </g>
            </svg>
          </div>
        );
      } else {
        // Grand 22K Lakshmi Kasu Haram / Temple Coin Long Necklace
        return (
          <div className="relative w-80 sm:w-96 flex flex-col items-center pointer-events-none select-none">
            <svg viewBox="0 0 380 300" className="w-full h-auto overflow-visible filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]">
              <defs>
                <linearGradient id="antiqueKasuGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#78350f" />
                  <stop offset="25%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="75%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <radialGradient id="rubyCenter" cx="40%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="60%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#881337" />
                </radialGradient>
              </defs>

              {/* Silk Dori String */}
              <path d="M 50,15 Q 190,100 330,15" fill="none" stroke="#78350f" strokeWidth="3.5" strokeDasharray="6 3" />

              {/* Kasu Coin Garland */}
              {Array.from({ length: 21 }).map((_, i) => {
                const t = i / 20;
                const x = (1 - t) * (1 - t) * 60 + 2 * (1 - t) * t * 190 + t * t * 320;
                const y = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 250 + t * t * 40;
                const angle = (t - 0.5) * 80;

                return (
                  <g key={i} transform={`translate(${x}, ${y}) rotate(${angle})`}>
                    {/* Coin Base */}
                    <circle cx="0" cy="0" r="11" fill="url(#antiqueKasuGold)" stroke="#451a03" strokeWidth="1.2" />
                    <circle cx="0" cy="0" r="8.5" fill="none" stroke="#fef08a" strokeWidth="1" />
                    {/* Lakshmi Motif Emboss */}
                    <circle cx="0" cy="-2" r="3.5" fill="#92400e" />
                    <path d="M -3,2 Q 0,5 3,2" stroke="#92400e" strokeWidth="1" fill="none" />
                    {/* Top Ruby Floret */}
                    <circle cx="0" cy="-11" r="3.5" fill="url(#rubyCenter)" stroke="#78350f" strokeWidth="0.8" />
                  </g>
                );
              })}

              {/* Grand Central Temple Lakshmi Pendant */}
              <g transform="translate(190, 255)">
                <path
                  d="M -34,-18 C -40,-6 -30,30 0,42 C 30,30 40,-6 34,-18 C 22,-30 -22,-30 -34,-18 Z"
                  fill="url(#antiqueKasuGold)"
                  stroke="#451a03"
                  strokeWidth="2.2"
                />
                {/* Center Faceted Oval Ruby */}
                <circle cx="0" cy="6" r="13" fill="url(#rubyCenter)" stroke="#78350f" strokeWidth="1.5" />
                <circle cx="-3" cy="3" r="3" fill="#ffffff" opacity="0.8" />
                {/* Hanging Pearl Bell Tassels */}
                <circle cx="-14" cy="46" r="4.5" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="0" cy="52" r="5.5" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="14" cy="46" r="4.5" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
              </g>
            </svg>
          </div>
        );
      }
    }

    // 4. MAANGTIKKA / PASSA FOREHEAD CATEGORY
    if (itemType === 'tikka') {
      return (
        <div className="relative w-44 sm:w-56 flex flex-col items-center pointer-events-none select-none">
          <svg viewBox="0 0 180 240" className="w-full h-auto overflow-visible filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)]">
            <defs>
              <linearGradient id="tikkaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Hairline Hanging Pearl & Gold Chain */}
            <line x1="90" y1="10" x2="90" y2="115" stroke="url(#tikkaGoldGrad)" strokeWidth="3.2" strokeDasharray="5 2" />
            <circle cx="90" cy="18" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
            <circle cx="90" cy="65" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

            {/* Center Mughal Polki Medallion */}
            <g transform="translate(90, 155)">
              <circle cx="0" cy="0" r="35" fill="url(#tikkaGoldGrad)" stroke="#451a03" strokeWidth="2.2" />
              {/* Petal Gems */}
              {Array.from({ length: 8 }).map((_, i) => {
                const ang = (i * 45 * Math.PI) / 180;
                return (
                  <circle
                    key={i}
                    cx={Math.cos(ang) * 22}
                    cy={Math.sin(ang) * 22}
                    r="6.5"
                    fill="#fffbeb"
                    stroke="#78350f"
                    strokeWidth="1.2"
                  />
                );
              })}
              {/* Center Solitaire Polki */}
              <circle cx="0" cy="0" r="12" fill="#ffffff" stroke="#b45309" strokeWidth="1.8" />
              <circle cx="-3" cy="-3" r="3" fill="#fef08a" />

              {/* Bottom Pearl Drops */}
              {[-16, 0, 16].map((xOff, i) => (
                <g key={i} transform={`translate(${xOff}, 40)`}>
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#78350f" strokeWidth="1.2" />
                  <circle cx="0" cy="12" r="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      );
    }

    // 5. BANGLES / KADA / BRACELETS CATEGORY
    if (itemType === 'bangles') {
      return (
        <div className="relative w-72 sm:w-80 flex items-center justify-center gap-5 pointer-events-none select-none">
          {[1, 2].map((k) => (
            <svg key={k} viewBox="0 0 150 150" className="w-32 h-auto overflow-visible filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.9)]">
              <defs>
                <linearGradient id={`bangle3D-${k}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#b45309" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
              </defs>
              {/* Main Kada Ring */}
              <circle cx="75" cy="75" r="58" fill="none" stroke={`url(#bangle3D-${k})`} strokeWidth="15" />
              <circle cx="75" cy="75" r="58" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="3 3" />
              {/* 3D Sheen Rings */}
              <circle cx="73" cy="73" r="50" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
              <circle cx="73" cy="73" r="66" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
              {/* Embossed Floral Filigree Studs */}
              {Array.from({ length: 8 }).map((_, i) => {
                const ang = (i * 45 * Math.PI) / 180;
                return (
                  <circle
                    key={i}
                    cx={75 + Math.cos(ang) * 58}
                    cy={75 + Math.sin(ang) * 58}
                    r="4"
                    fill="#e11d48"
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="relative pointer-events-none select-none flex items-center justify-center transition-all duration-75"
      style={{
        opacity,
        filter: `drop-shadow(0 16px 36px rgba(0,0,0,0.95)) drop-shadow(0 4px 16px ${warmthGlow}) contrast(1.1) brightness(1.02)`,
      }}
    >
      {renderPhotorealisticAsset()}
    </div>
  );
};
