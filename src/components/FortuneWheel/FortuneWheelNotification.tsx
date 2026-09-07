import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Tv } from 'lucide-react';
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
    <div className="absolute left-3 top-[46%] -translate-y-1/2 z-30 select-none animate-fade-in pointer-events-auto">
      {isNotificationActive ? (
        /* READY TO SPIN OR CLAIM - ACTIVE ATTENTION-GRABBING NOTIFICATION */
        <button
          id="left-fortune-wheel-notification-btn"
          onClick={handleClick}
          className={`group relative flex items-center gap-2 text-slate-950 p-1.5 sm:p-2 pr-3 sm:pr-3.5 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.6)] border-2 hover:scale-105 active:scale-95 transition-all duration-300 ${
            hasBankedSpins
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 border-yellow-100'
              : canClaimDailyWheelSpin
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 border-yellow-200'
              : 'bg-gradient-to-r from-indigo-500 via-purple-400 to-amber-400 border-indigo-200 text-slate-950'
          }`}
          title={
            hasBankedSpins
              ? `У вас накоплено ${wheelSpinsCount} прокрут(ов)! Нажмите, чтобы покрутить.`
              : canClaimDailyWheelSpin
              ? 'Заберите бесплатный спин в копилку!'
              : 'Посмотрите рекламу и заберите +1 спин!'
          }
        >
          {/* Pulsing halo ring */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity" />

          {/* Badge count indicator */}
          <span className="absolute -top-1.5 -left-1.5 flex h-5.5 min-w-[22px] px-1 items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-black shadow-md border-2 border-white animate-bounce">
            {hasBankedSpins ? `${wheelSpinsCount}` : '!'}
          </span>

          {/* Wheel icon with continuous smooth rotation */}
          <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 flex items-center justify-center text-xl sm:text-2xl shadow-inner border border-amber-300/40">
            <span className="animate-[spin_6s_linear_infinite]">🎡</span>
          </div>

          {/* Text labels */}
          <div className="relative z-10 flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-950 bg-white/80 px-1.5 py-0.2 rounded-md">
                {hasBankedSpins ? `СПИНЫ: ${wheelSpinsCount}` : canClaimDailyWheelSpin ? 'СПИН ГОТОВ' : 'РЕКЛАМА'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-950 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-950 drop-shadow-sm leading-tight mt-0.5 flex items-center gap-1">
              {hasBankedSpins ? 'КРУТИТЬ 🎡' : canClaimDailyWheelSpin ? 'ЗАБРАТЬ 🎁' : '+1 СПИН 📺'}
            </span>
          </div>
        </button>
      ) : (
        /* ON COOLDOWN - SLEEK MINI TIMER WIDGET */
        <button
          id="left-fortune-wheel-cooldown-btn"
          onClick={handleClick}
          className="group relative flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md text-slate-300 p-1.5 sm:p-2 pr-2.5 sm:pr-3 rounded-2xl shadow-lg border border-slate-700 hover:border-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Колесо фортуны на перезарядке (нажмите для подробностей)"
        >
          {/* Wheel icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-950 flex items-center justify-center text-lg sm:text-xl border border-slate-800 opacity-80 group-hover:opacity-100">
            <span>🎡</span>
          </div>

          {/* Cooldown time text */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-amber-400" />
              Колесо
            </span>
            <span className="font-mono text-[11px] sm:text-xs font-bold text-amber-300/90 leading-tight">
              {formatTimer(minCooldownSec)}
            </span>
          </div>
        </button>
      )}
    </div>
  );
};

