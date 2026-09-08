import React from 'react';
import { Sparkles, FlaskConical, Sprout, Coins, Compass, Play } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const WelcomeModal: React.FC = () => {
  const { isWelcomeOpen, startGame } = useGame();

  if (!isWelcomeOpen) return null;

  return (
    <div
      id="welcome-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md select-none animate-fade-in"
    >
      <div
        id="welcome-modal-card"
        className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl bg-slate-900/95 border-2 border-amber-500/70 shadow-2xl shadow-amber-500/20 text-slate-100 overflow-hidden"
      >
        {/* Background decorative glows */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="relative pt-5 pb-3 px-5 text-center flex flex-col items-center border-b border-slate-800/80 shrink-0">
          {/* Animated Mascot Beaker */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 mb-2 flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-3xl">
              <span className="animate-bounce" style={{ animationDuration: '2s' }}>
                🧪
              </span>
            </div>
            <div className="absolute -top-1 -right-1 text-sm animate-ping" style={{ animationDuration: '3s' }}>
              ✨
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Добро пожаловать!</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 tracking-tight">
            МЕМНЫЙ АЛХИМИК
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-0.5 max-w-xs">
            Лаборатория безумных мутантов и пассивной мем-экономики
          </p>
        </div>

        {/* Scrollable Instruction Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3.5 flex flex-col gap-2.5 text-xs text-slate-300 custom-scrollbar">
          {/* Step 1: Mixing */}
          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0 text-lg">
              <FlaskConical className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-100 text-xs flex items-center gap-1.5">
                <span className="text-purple-400 font-mono text-[11px]">1.</span>
                <span>Скрещивай в Лаборатории</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Выбирай любые два предмета или существа, чтобы открыть уникальных мутантов (Бананокот, Догбургер и 30+ мемов)!
              </p>
            </div>
          </div>

          {/* Step 2: Farming on Meadow */}
          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 text-lg">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-100 text-xs flex items-center gap-1.5">
                <span className="text-emerald-400 font-mono text-[11px]">2.</span>
                <span>Заселяй поляну и получай доход</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Выставляй питомцев на поле: они приносят <span className="text-amber-300 font-bold">монеты 🪙</span> и <span className="text-emerald-300 font-bold">опыт ⭐️</span> каждую секунду даже когда ты не в игре.
              </p>
            </div>
          </div>

          {/* Step 3: Gathering Loot */}
          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 text-lg">
              <Coins className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-100 text-xs flex items-center gap-1.5">
                <span className="text-amber-400 font-mono text-[11px]">3.</span>
                <span>Собирай лут с карты</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                На траве регулярно появляются бананы, клубника, кофе и котики. Нажимай на них, чтобы положить в рюкзак!
              </p>
            </div>
          </div>

          {/* Step 4: Progression */}
          <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-cyan-500/40 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0 text-lg">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-100 text-xs flex items-center gap-1.5">
                <span className="text-cyan-400 font-mono text-[11px]">4.</span>
                <span>Открывай новые миры</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                Прокачивай уровень, разблокируй Пляж, Кибер-город, Лаву и Космос, крути Колесо Фортуны и собирай полную коллекцию!
              </p>
            </div>
          </div>

          {/* Starter Hint Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center gap-2.5">
            <span className="text-2xl">🎁</span>
            <div className="text-[11px] text-amber-200/90 leading-tight">
              <span className="font-black text-amber-300 block">Твой стартовый набор:</span>
              У тебя в запасе уже есть <span className="font-bold text-white">Кот 🐱</span> и <span className="font-bold text-white">Банан 🍌</span> — смешай их в Лаборатории!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 shrink-0 flex flex-col gap-2">
          <button
            id="start-game-btn"
            onClick={startGame}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 border-2 border-amber-300/80 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>НАЧАТЬ ИГРАТЬ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
