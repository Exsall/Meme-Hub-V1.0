import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const FortuneWheelNotification: React.FC = () => {
  const {
    wheelSpinsCount,
    canClaimDailyWheelSpin,
    canClaimAdWheelSpin,
    getWheelCooldownRemaining,
    getWheelAdCooldownRemaining,
    setIsWheelOpen,
  } = useGame();

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

  const handleClick = () => {
    soundManager.playClick();
    setIsWheelOpen(true);
  };

  const hasBankedSpins = wheelSpinsCount > 0;
  const hasSpinsToClaim = canClaimDailyWheelSpin || canClaimAdWheelSpin;
  const isNotificationActive = hasBankedSpins || hasSpinsToClaim;

  // If both on cooldown, show shortest remaining time
  const minCooldownSec = Math.min(cooldownSec, adCooldownSec);

  return (
    <div className="absolute left-2.5 sm:left-3 top-[44%] -translate-y-1/2 z-30 select-none animate-fade-in pointer-events-auto">
      {isNotificationActive ? (
        /* READY TO SPIN OR CLAIM - ONLY ICON WITH BADGE */
        <button
          id="left-fortune-wheel-notification-btn"
          onClick={handleClick}
          className={`group relative flex items-center justify-center p-1.5 sm:p-2 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 hover:scale-110 active:scale-95 transition-all duration-300 ${
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
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity" />

          {/* Badge count indicator */}
          <span className="absolute -top-1.5 -right-1.5 z-20 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black shadow-md border-2 border-white animate-bounce">
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
          onClick={handleClick}
          className="group relative flex items-center justify-center bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl shadow-lg border border-slate-700/80 hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title={`Колесо фортуны: доступно через ${formatTimer(minCooldownSec)}`}
        >
          {/* Wheel icon */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950/80 flex items-center justify-center text-lg sm:text-xl border border-slate-800 opacity-70 group-hover:opacity-100 shrink-0">
            <span>🎡</span>
          </div>
        </button>
      )}
    </div>
  );
};

