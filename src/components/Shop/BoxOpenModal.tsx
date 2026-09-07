import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, X } from 'lucide-react';
import { RARITY_CONFIG } from '../../data/gameData';
import { Ingredient, MysteryBox } from '../../types/game';
import { soundManager } from '../../utils/audio';

interface BoxOpenModalProps {
  box: MysteryBox;
  results: {
    items: { ingredient: Ingredient; count: number }[];
    bonusCoins: number;
  };
  onClose: () => void;
}

export const BoxOpenModal: React.FC<BoxOpenModalProps> = ({ box, results, onClose }) => {
  const [stage, setStage] = useState<'shaking' | 'burst' | 'items'>('shaking');

  useEffect(() => {
    soundManager.playPop();

    // Shaking chest
    const burstTimer = setTimeout(() => {
      setStage('burst');
      soundManager.playExplosion();
    }, 1100);

    // Items reveal
    const itemsTimer = setTimeout(() => {
      setStage('items');
      soundManager.playNewMemeFanfare(true);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback
      }
    }, 1600);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(itemsTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-6 flex flex-col items-center text-center">
        {/* Shaking Stage */}
        {stage === 'shaking' && (
          <div className="py-12 flex flex-col items-center">
            <div className="text-7xl sm:text-8xl animate-wiggle filter drop-shadow-xl">
              {box.icon}
            </div>
            <h3 className="text-lg font-black text-amber-300 mt-6 animate-pulse">
              ОТКРЫВАЕМ {box.name.toUpperCase()}...
            </h3>
          </div>
        )}

        {/* Burst Stage */}
        {stage === 'burst' && (
          <div className="py-12 flex flex-col items-center animate-ping">
            <div className="text-8xl">💥</div>
          </div>
        )}

        {/* Items Revealed Stage */}
        {stage === 'items' && (
          <div className="w-full flex flex-col items-center animate-pop-in">
            <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ТВОЯ ДОБЫЧА!</span>
            </div>

            <h2 className="text-xl font-black text-white">{box.name}</h2>

            {/* Grid of obtained ingredients */}
            <div className="grid grid-cols-2 gap-2.5 w-full my-4">
              {results.items.map((item, idx) => {
                const rarityMeta = RARITY_CONFIG[item.ingredient.rarity];
                return (
                  <div
                    key={idx}
                    className={`relative rounded-2xl bg-slate-800 p-3 border-2 ${rarityMeta.border} ${rarityMeta.glow} flex flex-col items-center shadow`}
                  >
                    <span className="text-4xl my-1 animate-gentle-bounce">
                      {item.ingredient.emoji}
                    </span>
                    <span className="text-xs font-black text-white truncate max-w-full">
                      {item.ingredient.name}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.2 rounded-full mt-1 ${rarityMeta.bgBadge}`}
                    >
                      {rarityMeta.label}
                    </span>
                    <span className="absolute top-1 right-1.5 bg-slate-900 text-amber-300 text-[10px] font-black px-1.5 rounded-md border border-slate-700">
                      +{item.count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bonus coins */}
            {results.bonusCoins > 0 && (
              <div className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-1.5 px-3 flex items-center justify-center gap-1 text-xs font-black text-amber-300 mb-4">
                <span>Бонусные монеты:</span>
                <span>+{results.bonusCoins} 🪙</span>
              </div>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-lg active:scale-95 transition-transform"
            >
              ОТЛИЧНО, ЗАБРАТЬ!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
