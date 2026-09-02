import React, { useEffect, useState } from 'react';
import { Crown, Sparkles, Gem, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Stage 0: Initial glow
    const t1 = setTimeout(() => setStage(1), 300);
    // Stage 1: Logo and crown bloom
    const t2 = setTimeout(() => setStage(2), 800);
    // Stage 2: Subtitle & heritage badge
    const t3 = setTimeout(() => setStage(3), 1400);
    // Stage 3: Smooth fade-out and transition into home
    const t4 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onComplete, 500);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  const handleSkip = () => {
    triggerHaptic('light');
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-stone-950 flex flex-col items-center justify-between p-6 select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Opulent Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-600/10 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* Top Header & Skip Button */}
      <div className="w-full flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-400/80 font-bold">
          <Gem className="w-3.5 h-3.5 text-amber-400" />
          <span>Bespoke Concierge</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-xs text-stone-400 hover:text-amber-300 px-3 py-1 rounded-full bg-stone-900/80 border border-stone-800 transition-colors flex items-center gap-1"
        >
          <span>Skip</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Centerpiece Emblem & Branding */}
      <div className="flex flex-col items-center justify-center text-center space-y-5 z-10 my-auto">
        {/* Animated Royal Insignia */}
        <div className="relative">
          <div
            className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[2px] shadow-[0_0_50px_rgba(245,158,11,0.35)] transition-all duration-700 ${
              stage >= 1 ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
            }`}
          >
            <div className="w-full h-full bg-stone-950 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-amber-300/10" />
              <Crown className="w-11 h-11 sm:w-13 sm:h-13 text-amber-400 filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)] animate-bounce" />
              <div className="text-[9px] font-bold tracking-widest text-amber-200 uppercase mt-0.5">
                Est. 2026
              </div>
            </div>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin duration-3000" />
        </div>

        {/* Brand Name */}
        <div
          className={`space-y-1.5 transition-all duration-700 delay-100 ${
            stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 tracking-wider">
            ROLDY GOLDY
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-stone-400 font-semibold">
            Pure 1-Gram &amp; 22K Micro Polish
          </p>
        </div>

        {/* Heritage Trust Badges */}
        <div
          className={`flex items-center gap-2 pt-2 transition-all duration-700 delay-200 ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-[10px] bg-amber-500/15 text-amber-300 font-medium px-2.5 py-1 rounded-full border border-amber-500/30">
            ⚡ 20m Doorstep Trial
          </span>
          <span className="text-[10px] bg-amber-500/15 text-amber-300 font-medium px-2.5 py-1 rounded-full border border-amber-500/30">
            🪞 3D AR Try-On
          </span>
          <span className="text-[10px] bg-amber-500/15 text-amber-300 font-medium px-2.5 py-1 rounded-full border border-amber-500/30">
            🤖 AI Jeweller
          </span>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full max-w-xs space-y-2 text-center z-10 pb-4">
        <div className="w-full bg-stone-900 h-1 rounded-full overflow-hidden border border-stone-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, stage * 33 + 10)}%` }}
          />
        </div>
        <p className="text-[11px] text-stone-400">
          Opening certified artisanal boutique collections...
        </p>
      </div>
    </div>
  );
};
