import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const LeftActionsStack: React.FC = () => {
  const {
    setActiveTab,
    inventory,
    backpackCreatures,
    tutorialStep,
    wheelSpinsCount,
    canClaimDailyWheelSpin,
    canClaimAdWheelSpin,
    getWheelCooldownRemaining,
    getWheelAdCooldownRemaining,
    setIsWheelOpen,
  } = useGame();

  // Fortune Wheel timer tracking
  const [cooldownSec, setCooldownSec] = useState<number>(getWheelCooldownRemaining());
  const [adCooldownSec, setAdCooldownSec] = useState<number>(getWheelAdCooldownRemaining());

  useEffect(() => {
    setCooldownSec(getWheelCooldownRemaining());
    setAdCooldownSec(getWheelAdCooldownRemaining());

    const interval = setInterval(() => {
      setCooldownSec(getWheelCooldownRemaining());
      setAdCooldownSec(getWheelAdCooldownRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getWheelCooldownRemaining, getWheelAdCooldownRemaining]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Lab status
  const totalIngredientsCount = (Object.values(inventory) as number[]).reduce((a, b) => a + b, 0);
  const backpackCreaturesCount = backpackCreatures.length;
  const canMix = totalIngredientsCount >= 2 || (totalIngredientsCount >= 1 && backpackCreaturesCount >= 1);
  const hasItems = totalIngredientsCount > 0 || backpackCreaturesCount > 0;

  // Fortune wheel status
  const hasBankedSpins = wheelSpinsCount > 0;
  const hasSpinsToClaim = canClaimDailyWheelSpin || canClaimAdWheelSpin;
  const isWheelActive = hasBankedSpins || hasSpinsToClaim;
  const minCooldownSec = Math.min(cooldownSec, adCooldownSec);

  const handleOpenLab = () => {
    soundManager.playClick();
    setActiveTab('lab');
  };

  const handleOpenWheel = () => {
    soundManager.playClick();
    setIsWheelOpen(true);
  };

  return (
    <aside
      aria-label="Быстрые действия"
      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 sm:gap-2.5 max-h-[80vh] overflow-y-auto overflow-x-hidden p-1 py-1.5 select-none pointer-events-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {/* 1. LAB BUTTON (Flask Icon) */}
      <button
        id="left-lab-notification-btn"
        onClick={handleOpenLab}
        className={`group relative flex items-center justify-center p-1.5 sm:p-2 rounded-2xl border-2 hover:scale-110 active:scale-95 transition-all duration-300 shrink-0 ${
          canMix || tutorialStep === 0
            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 border-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
            : hasItems
            ? 'bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-500 border-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
            : 'bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md border-slate-700/80 hover:border-emerald-500/50 shadow-lg'
        }`}
        title={
          canMix
            ? 'Лаборатория: есть ингредиенты для скрещивания!'
            : 'Лаборатория: скрещивание и создание мемов'
        }
      >
        {/* Pulsing halo ring when can mix */}
        {(canMix || tutorialStep === 0) && (
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}

        {/* Badge indicator if ready to mix */}
        {(canMix || tutorialStep === 0) && (
          <span className="absolute -top-1.5 -right-1.5 z-20 flex h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black shadow-md border-2 border-white animate-bounce pointer-events-none">
            !
          </span>
        )}

        {/* Lab flask icon */}
        <div
          className={`relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-inner shrink-0 ${
            canMix || tutorialStep === 0
              ? 'bg-slate-950 border border-emerald-300/40'
              : hasItems
              ? 'bg-slate-950 border border-purple-300/40'
              : 'bg-slate-950/80 border border-slate-800 opacity-80 group-hover:opacity-100'
          }`}
        >
          <span className="group-hover:rotate-12 transition-transform duration-300">🧪</span>
        </div>
      </button>

      {/* 2. FORTUNE WHEEL BUTTON */}
      {isWheelActive ? (
        <button
          id="left-fortune-wheel-notification-btn"
          onClick={handleOpenWheel}
          className={`group relative flex items-center justify-center p-1.5 sm:p-2 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 hover:scale-110 active:scale-95 transition-all duration-300 shrink-0 ${
            hasBankedSpins
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 border-yellow-100'
              : canClaimDailyWheelSpin
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 border-yellow-200'
              : 'bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-400 border-indigo-200'
          }`}
          title={
            hasBankedSpins
              ? `Колесо фортуны: доступно ${wheelSpinsCount} спин(ов)`
              : canClaimDailyWheelSpin
              ? 'Колесо фортуны: бесплатный спин готов!'
              : 'Колесо фортуны: доступен спин за рекламу!'
          }
        >
          {/* Pulsing halo ring */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Badge count indicator */}
          <span className="absolute -top-1.5 -right-1.5 z-20 flex h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 items-center justify-center rounded-full bg-red-600 text-white text-[9px] sm:text-[10px] font-black shadow-md border-2 border-white animate-bounce pointer-events-none">
            {hasBankedSpins ? `${wheelSpinsCount}` : '!'}
          </span>

          {/* Wheel icon with continuous smooth rotation */}
          <div className="relative z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-950 flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-amber-300/40 shrink-0">
            <span className="animate-[spin_6s_linear_infinite]">🎡</span>
          </div>
        </button>
      ) : (
        /* ON COOLDOWN - SLEEK MINI ICON */
        <button
          id="left-fortune-wheel-cooldown-btn"
          onClick={handleOpenWheel}
          className="group relative flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-lg border border-slate-700/80 hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
          title={`Колесо фортуны: доступно через ${formatTimer(minCooldownSec)}`}
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-950/80 flex items-center justify-center text-lg sm:text-xl border border-slate-800 opacity-70 group-hover:opacity-100 shrink-0">
            <span>🎡</span>
          </div>
        </button>
      )}
    </aside>
  );
};
