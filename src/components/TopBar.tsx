import React, { useState, useEffect } from 'react';
import { Award, Calendar, HelpCircle, Settings, Tv, Volume2, VolumeX } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';

export const TopBar: React.FC = () => {
  const {
    level,
    xp,
    xpForNextLevel,
    coins,
    totalIncomePerSec,
    soundEnabled,
    toggleSound,
    setIsDailyRewardOpen,
    setIsQuestsOpen,
    setIsSettingsOpen,
    setIsAdRewardOpen,
    setIsWheelOpen,
    setIsWelcomeOpen,
    wheelSpinsCount,
    canClaimDailyWheelSpin,
    canClaimAdWheelSpin,
    getAdCooldownRemaining,
    lastDailyClaimDate,
    claimableQuestsCount,
  } = useGame();

  const [adCooldownSec, setAdCooldownSec] = useState<number>(getAdCooldownRemaining());

  useEffect(() => {
    setAdCooldownSec(getAdCooldownRemaining());
    const interval = setInterval(() => {
      setAdCooldownSec(getAdCooldownRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getAdCooldownRemaining]);

  const canClaimAd = adCooldownSec === 0;
  const today = new Date().toISOString().split('T')[0];
  const canClaimDaily = lastDailyClaimDate !== today;

  const xpPercent = Math.min(100, Math.round((xp / Math.max(1, xpForNextLevel)) * 100));

  const formatCoins = (num: number) => {
    if (num < 100000) return num.toLocaleString();
    if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const formatIncome = (num: number) => {
    if (num < 10000) return `+${num.toLocaleString()}/с`;
    if (num < 1000000) return `+${(num / 1000).toFixed(1)}k/с`;
    return `+${(num / 1000000).toFixed(1)}M/с`;
  };

  return (
    <header className="relative z-30 flex flex-col bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-2 sm:px-3 py-1.5 sm:py-2 select-none shadow-md">
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Level & XP Progress */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 shrink-0 cursor-default"
          title={`Уровень ${level} • Опыт: ${xp}/${xpForNextLevel} (${xpPercent}%)`}
        >
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-xs sm:text-sm shadow-md border border-amber-300 shrink-0">
            {level}
            <span className="absolute -bottom-1 -right-1 text-[8px] bg-slate-950 px-1 py-0.2 rounded-full font-bold border border-amber-400/60 leading-none text-amber-300">
              УР
            </span>
          </div>

          <div className="flex flex-col w-16 sm:w-28 min-w-0">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-300 leading-tight">
              <span className="hidden sm:inline">Опыт</span>
              <span className="text-amber-400 font-mono text-[9px] sm:text-[11px] truncate">
                {xp}/{xpForNextLevel}
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Currency & Income */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl border border-slate-700 shadow-inner shrink-0"
          title={`${coins.toLocaleString()} монет (+${totalIncomePerSec.toLocaleString()}/сек)`}
        >
          <span className="text-base sm:text-xl shrink-0 leading-none">🪙</span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs sm:text-sm font-black text-amber-300 tracking-tight">
              {formatCoins(coins)}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-emerald-400 mt-0.5">
              {formatIncome(totalIncomePerSec)}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Triggers */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Wheel of Fortune button */}
          <button
            id="topbar-wheel-btn"
            onClick={() => {
              soundManager.playClick();
              setIsWheelOpen(true);
            }}
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              wheelSpinsCount > 0
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse'
                : canClaimDailyWheelSpin || canClaimAdWheelSpin
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title={`Мемное Колесо Фортуны (${wheelSpinsCount} спинов)`}
          >
            <span className="text-xs sm:text-sm leading-none">🎡</span>
            {wheelSpinsCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-0.5 text-[8px] font-black bg-amber-400 text-slate-950 rounded-full flex items-center justify-center ring-1 ring-slate-950 shadow">
                {wheelSpinsCount}
              </span>
            ) : (canClaimDailyWheelSpin || canClaimAdWheelSpin) && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-slate-900 animate-ping" />
            )}
          </button>

          {/* Daily Reward button */}
          <button
            id="topbar-daily-btn"
            onClick={() => {
              soundManager.playClick();
              setIsDailyRewardOpen(true);
            }}
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              canClaimDaily
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Ежедневная награда"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {canClaimDaily && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-slate-900" />
            )}
          </button>

          {/* Quests button */}
          <button
            id="topbar-quests-btn"
            onClick={() => {
              soundManager.playClick();
              setIsQuestsOpen(true);
            }}
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              claimableQuestsCount > 0
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Задания"
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {claimableQuestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 text-[8px] font-black bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center ring-1 ring-slate-900">
                {claimableQuestsCount}
              </span>
            )}
          </button>

          {/* Watch Ad for +10,000 Coins */}
          <button
            id="topbar-ad-btn"
            onClick={() => {
              soundManager.playClick();
              setIsAdRewardOpen(true);
            }}
            className={`relative p-1.5 sm:p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              canClaimAd
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)] animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title={canClaimAd ? 'Смотри рекламу: +10 000 монет!' : `Реклама: через ${Math.ceil(adCooldownSec / 60)} мин`}
          >
            <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {canClaimAd ? (
              <span className="absolute -top-1 -right-1 px-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[7px] rounded-full shadow border border-amber-200">
                +10k
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-0.5 text-[7px] font-mono font-bold bg-slate-950 text-slate-400 px-0.5 rounded-full border border-slate-700">
                {Math.ceil(adCooldownSec / 3600)}ч
              </span>
            )}
          </button>

          {/* Audio toggle (Visible on larger screens or in Settings on mobile) */}
          <button
            id="topbar-sound-btn"
            onClick={() => {
              toggleSound();
            }}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 active:scale-95 transition-all"
            title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Help / Guide button (Visible on larger screens or in Settings on mobile) */}
          <button
            id="topbar-help-btn"
            onClick={() => {
              soundManager.playClick();
              setIsWelcomeOpen(true);
            }}
            className="hidden sm:flex p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 active:scale-95 hover:text-amber-300 transition-all"
            title="Как играть и правила игры"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            id="topbar-settings-btn"
            onClick={() => {
              soundManager.playClick();
              setIsSettingsOpen(true);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 active:scale-95 hover:text-white transition-all flex items-center justify-center"
            title="Настройки, звук и правила"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

