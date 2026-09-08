import React from 'react';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

export const LabNotification: React.FC = () => {
  const { setActiveTab, inventory, backpackCreatures, tutorialStep } = useGame();

  const totalIngredientsCount = (Object.values(inventory) as number[]).reduce((a, b) => a + b, 0);
  const backpackCreaturesCount = backpackCreatures.length;
  const canMix = totalIngredientsCount >= 2 || (totalIngredientsCount >= 1 && backpackCreaturesCount >= 1);
  const hasItems = totalIngredientsCount > 0 || backpackCreaturesCount > 0;

  const handleClick = () => {
    soundManager.playClick();
    setActiveTab('lab');
  };

  return (
    <div className="absolute left-2.5 sm:left-3 top-[32%] -translate-y-1/2 z-30 select-none animate-fade-in pointer-events-auto">
      <button
        id="left-lab-notification-btn"
        onClick={handleClick}
        className={`group relative flex items-center justify-center p-1.5 sm:p-2 rounded-2xl border-2 hover:scale-110 active:scale-95 transition-all duration-300 ${
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
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 opacity-75 blur-sm animate-pulse group-hover:opacity-100 transition-opacity" />
        )}

        {/* Badge indicator if ready to mix */}
        {(canMix || tutorialStep === 0) && (
          <span className="absolute -top-1.5 -right-1.5 z-20 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-black shadow-md border-2 border-white animate-bounce">
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
    </div>
  );
};
