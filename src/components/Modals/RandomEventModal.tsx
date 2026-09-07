import React from 'react';
import { RandomEventData } from '../../types/game';
import { Sparkles, AlertTriangle, Check } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface RandomEventModalProps {
  event: RandomEventData;
  onClose: () => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({ event, onClose }) => {
  const isPositive = event.type === 'positive';

  const handleConfirm = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div
        className={`relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-200 ${
          isPositive
            ? 'bg-slate-900 border-amber-400 shadow-[0_0_50px_rgba(251,191,36,0.35)]'
            : 'bg-slate-900 border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.35)]'
        }`}
      >
        {/* TOP AMBIENT GLOW */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-48 rounded-full blur-3xl pointer-events-none ${
            isPositive ? 'bg-amber-500/30' : 'bg-rose-600/30'
          }`}
        />

        {/* HEADER STRIP */}
        <div
          className={`px-6 pt-5 pb-3 flex items-center justify-between border-b ${
            isPositive
              ? 'bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-amber-500/10 border-amber-500/20'
              : 'bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-rose-500/10 border-rose-500/20'
          }`}
        >
          <div className="flex items-center gap-2">
            {isPositive ? (
              <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Удачное Событие
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" />
                Происшествие
              </span>
            )}
          </div>

          <span className="text-xs font-bold text-slate-400">Случайный ивент</span>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="p-6 flex flex-col items-center text-center relative z-10">
          {/* BIG ICON BADGE */}
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 border-2 shadow-lg animate-bounce ${
              isPositive
                ? 'bg-gradient-to-br from-amber-400/20 to-emerald-500/20 border-amber-400/50 text-amber-300'
                : 'bg-gradient-to-br from-rose-500/20 to-orange-500/20 border-rose-500/50 text-rose-300'
            }`}
            style={{ animationDuration: '2.5s' }}
          >
            <span>{event.icon}</span>
          </div>

          {/* EVENT TITLE */}
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            {event.title}
          </h2>

          {/* CAUSE / STORY BOX */}
          <div className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 mb-4 text-left">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <span>📖 Что произошло:</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {event.cause}
            </p>
          </div>

          {/* OUTCOME CONSEQUENCES BOX */}
          <div
            className={`w-full rounded-2xl p-4 border flex flex-col items-center gap-1.5 shadow-inner mb-6 ${
              isPositive
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
              {event.outcomeHeadline}
            </span>

            <div className="text-base sm:text-lg font-black flex items-center justify-center gap-2 text-center">
              <span>{event.outcomeBadge}</span>
            </div>

            {event.consequenceText && (
              <p className="text-xs opacity-90 text-center font-medium mt-0.5">
                {event.consequenceText}
              </p>
            )}
          </div>

          {/* ACTION BUTTON */}
          <button
            id="confirm-random-event-btn"
            onClick={handleConfirm}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl ${
              isPositive
                ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/25'
                : 'bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 text-white hover:brightness-110 shadow-rose-500/25'
            }`}
          >
            <Check className="w-5 h-5 stroke-[2.5]" />
            <span>{isPositive ? 'Отлично, принять!' : 'Понятно, принять последствия'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
