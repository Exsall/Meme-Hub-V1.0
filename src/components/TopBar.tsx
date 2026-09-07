import React, { useState, useEffect } from 'react';
import { Award, Calendar, CheckCircle, Flame, Gift, HelpCircle, Settings, Tv, Volume2, VolumeX } from 'lucide-react';
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

  return (
    <header className="relative z-30 flex flex-col bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-3 py-2 select-none shadow-md">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Level & XP */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-sm shadow-md border-2 border-amber-300 shrink-0">
            {level}
            <span className="absolute -bottom-1 -right-1 text-[9px] bg-slate-900 px-1 py-0.2 rounded-full font-bold border border-amber-400/50">
              УР.
            </span>
          </div>

          <div className="flex flex-col w-24 sm:w-36">
            <div className="flex justify-between text-[11px] font-bold text-slate-300">
              <span>Опыт</span>
              <span className="text-amber-400">
                {xp}/{xpForNextLevel}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Currency & Income per sec */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700 shadow-inner">
          <div className="text-xl sm:text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            🪙
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-amber-300 leading-tight">
              {coins.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 leading-tight">
              +{totalIncomePerSec.toLocaleString()}/сек
            </span>
          </div>
        </div>

        {/* Right: Quick triggers */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Wheel of fortune button */}
          <button
            id="topbar-wheel-btn"
            onClick={() => {
              soundManager.playClick();
              setIsWheelOpen(true);
            }}
            className={`relative p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              wheelSpinsCount > 0
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
                : canClaimDailyWheelSpin || canClaimAdWheelSpin
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
            title={`Мемное Колесо Фортуны (${wheelSpinsCount} спинов в копилке)`}
          >
            <span className="text-sm leading-none">🎡</span>
            {wheelSpinsCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 text-[9px] font-black bg-amber-400 text-slate-950 rounded-full flex items-center justify-center ring-1 ring-slate-950 shadow">
                {wheelSpinsCount}
              </span>
            ) : (canClaimDailyWheelSpin || canClaimAdWheelSpin) && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900 animate-ping" />
            )}
          </button>

          {/* Daily reward button */}
          <button
            id="topbar-daily-btn"
            onClick={() => {
              soundManager.playClick();
              setIsDailyRewardOpen(true);
            }}
            className={`relative p-2 rounded-xl border transition-all active:scale-95 ${
              canClaimDaily
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
            title="Ежедневная награда"
          >
            <Calendar className="w-4 h-4" />
            {canClaimDaily && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {/* Quests button */}
          <button
            id="topbar-quests-btn"
            onClick={() => {
              soundManager.playClick();
              setIsQuestsOpen(true);
            }}
            className={`relative p-2 rounded-xl border transition-all active:scale-95 ${
              claimableQuestsCount > 0
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
            title="Задания"
          >
            <Award className="w-4 h-4" />
            {claimableQuestsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-black bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center ring-1 ring-slate-900">
                {claimableQuestsCount}
              </span>
            )}
          </button>

          {/* Watch Ad for 10,000 Coins */}
          <button
            id="topbar-ad-btn"
            onClick={() => {
              soundManager.playClick();
              setIsAdRewardOpen(true);
            }}
            className={`relative p-2 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              canClaimAd
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse'
                : 'bg-slate-800/70 border-slate-700 text-slate-400'
            }`}
            title={canClaimAd ? 'Смотри рекламу: получи 10 000 монет!' : `Реклама за 10 000 монет: доступна через ${Math.ceil(adCooldownSec / 60)} мин`}
          >
            <Tv className="w-4 h-4" />
            {canClaimAd ? (
              <span className="absolute -top-1.5 -right-1 px-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[8px] rounded-full shadow border border-amber-200">
                +10k
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 text-[8px] font-mono font-bold bg-slate-950/90 text-slate-400 px-1 rounded-full border border-slate-700">
                {Math.ceil(adCooldownSec / 3600)}ч
              </span>
            )}
          </button>

          {/* Audio toggle */}
          <button
            id="topbar-sound-btn"
            onClick={() => {
              toggleSound();
            }}
            className="p-2 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 active:scale-95 transition-all"
            title={soundEnabled ? 'Звук включен' : 'Звук выключен'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Settings button */}
          <button
            id="topbar-settings-btn"
            onClick={() => {
              soundManager.playClick();
              setIsSettingsOpen(true);
            }}
            className="p-2 rounded-xl bg-slate-800/70 border border-slate-700 text-slate-300 active:scale-95 hover:text-white transition-all"
            title="Настройки и админ-панель"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
