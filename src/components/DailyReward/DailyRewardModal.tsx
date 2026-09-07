import React from 'react';
import { Calendar, Check, Gift, Sparkles, X } from 'lucide-react';
import { DAILY_REWARDS } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

interface DailyRewardModalProps {
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClose }) => {
  const { dailyStreak, lastDailyClaimDate, claimDailyReward } = useGame();

  const today = new Date().toISOString().split('T')[0];
  const canClaimToday = lastDailyClaimDate !== today;
  const currentClaimDay = canClaimToday ? (dailyStreak % 7) + 1 : dailyStreak % 7 || 7;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-5 flex flex-col items-center text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top close */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl mb-2">
          🎁
        </div>
        <h2 className="text-xl font-black text-white">Ежедневный Бонус</h2>
        <p className="text-xs text-slate-400 mt-0.5">Заходи каждый день и получай мега-награды!</p>

        {/* 7-Day Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full my-4">
          {DAILY_REWARDS.map((item) => {
            const isPast = item.day <= dailyStreak && (!canClaimToday || item.day < currentClaimDay);
            const isTodayActive = canClaimToday && item.day === currentClaimDay;

            return (
              <div
                key={item.day}
                className={`relative rounded-2xl p-2.5 flex flex-col items-center border transition-all ${
                  item.day === 7 ? 'col-span-3 sm:col-span-4 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20' : ''
                } ${
                  isTodayActive
                    ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse'
                    : isPast
                    ? 'bg-slate-950/60 border-slate-800 opacity-60'
                    : 'bg-slate-800/70 border-slate-700'
                }`}
              >
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  День {item.day}
                </span>
                <span className="text-3xl my-1">{item.icon}</span>
                <span className="text-[10px] font-black text-white truncate max-w-full">
                  {item.label}
                </span>

                {isPast && (
                  <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-emerald-400 font-black">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Claim button */}
        {canClaimToday ? (
          <button
            id="claim-daily-btn"
            onClick={() => {
              claimDailyReward();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform animate-bounce"
          >
            <Sparkles className="w-4 h-4" />
            <span>ЗАБРАТЬ НАГРАДУ ДНЯ {currentClaimDay}</span>
          </button>
        ) : (
          <div className="w-full py-3 rounded-2xl bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700 text-center">
            Следующая награда будет доступна завтра!
          </div>
        )}
      </div>
    </div>
  );
};
