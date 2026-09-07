import React from 'react';
import { Clock, Sparkles, TrendingUp } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const OfflineIncomeModal: React.FC = () => {
  const { offlineEarnedCoins, offlineElapsedMinutes, claimOfflineEarnings } = useGame();

  if (offlineEarnedCoins <= 0) return null;

  const hours = Math.floor(offlineElapsedMinutes / 60);
  const minutes = offlineElapsedMinutes % 60;
  const timeFormatted = hours > 0 ? `${hours}ч ${minutes}мин` : `${minutes}мин`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-amber-500/60 shadow-2xl p-6 flex flex-col items-center text-center overflow-hidden">
        {/* Glow halo */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-3xl mb-3 animate-bounce">
          🪙
        </div>

        <h2 className="text-2xl font-black text-white">С ВОЗВРАЩЕНИЕМ!</h2>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Тебя не было: {timeFormatted}</span>
        </div>

        <div className="w-full bg-slate-950/80 rounded-2xl p-4 border border-slate-800 my-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Твои мемы заработали для тебя:
          </span>
          <div className="text-3xl font-black text-amber-300 mt-1 flex items-center justify-center gap-1.5">
            <span>+{offlineEarnedCoins.toLocaleString()}</span>
            <span className="text-2xl">🪙</span>
          </div>
        </div>

        <button
          id="claim-offline-btn"
          onClick={claimOfflineEarnings}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" />
          <span>ЗАБРАТЬ МОНЕТЫ</span>
        </button>
      </div>
    </div>
  );
};
