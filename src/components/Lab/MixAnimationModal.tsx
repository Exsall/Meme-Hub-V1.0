import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Check, Backpack, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import { RARITY_CONFIG } from '../../data/gameData';
import { Creature, Rarity } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

interface MixAnimationModalProps {
  creature: Creature;
  isNew: boolean;
  isMutation?: boolean;
  isTerritoryFull?: boolean;
  placedCount?: number;
  capacity?: number;
  onPlace: () => void;
  onToBackpack: () => void;
}

export const MixAnimationModal: React.FC<MixAnimationModalProps> = ({
  creature,
  isNew,
  isMutation,
  isTerritoryFull = false,
  placedCount = 0,
  capacity = 0,
  onPlace,
  onToBackpack,
}) => {
  // Sequence stages: 'shake' -> 'flash' -> 'silhouette' -> 'revealed'
  const [stage, setStage] = useState<'shake' | 'flash' | 'silhouette' | 'revealed'>('shake');

  const rarityMeta = RARITY_CONFIG[creature.rarity];
  const isHighRarity = ['rare', 'epic', 'legendary', 'secret'].includes(creature.rarity);

  useEffect(() => {
    // 1. Shaking machine & sound
    soundManager.playMixEngine();

    // 2. Flash after 2.0s
    const flashTimer = setTimeout(() => {
      setStage('flash');
      soundManager.playExplosion();
    }, 2000);

    // 3. Silhouette after 2.3s
    const silhouetteTimer = setTimeout(() => {
      setStage('silhouette');
    }, 2300);

    // 4. Reveal after 3.6s
    const revealTimer = setTimeout(() => {
      setStage('revealed');
      soundManager.playNewMemeFanfare(isHighRarity);

      // Launch confetti
      try {
        confetti({
          particleCount: isHighRarity ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: [rarityMeta.color, '#f59e0b', '#ec4899', '#38bdf8'],
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 3600);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(silhouetteTimer);
      clearTimeout(revealTimer);
    };
  }, [creature, isHighRarity, rarityMeta.color]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md select-none animate-fade-in overflow-hidden">
      {/* Screen flash effect */}
      {stage === 'flash' && (
        <div className="absolute inset-0 bg-white z-50 animate-ping opacity-90" />
      )}

      {/* Main container */}
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-6 flex flex-col items-center text-center overflow-hidden">
        {/* Machine Shaking Phase */}
        {stage === 'shake' && (
          <div className="flex flex-col items-center py-10 animate-bounce">
            <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 border-4 border-indigo-400 flex items-center justify-center text-5xl shadow-[0_0_50px_rgba(99,102,241,0.6)] animate-wiggle">
              <span className="animate-spin" style={{ animationDuration: '0.8s' }}>
                ⚙️
              </span>
              <div className="absolute -top-3 text-2xl animate-ping">✨</div>
            </div>
            <h3 className="text-xl font-black text-amber-400 mt-6 tracking-wider animate-pulse">
              СЛИЯНИЕ В ПРОЦЕССЕ...
            </h3>
            <p className="text-xs text-slate-400 mt-1">Реактор соединяет гены мемов</p>
          </div>
        )}

        {/* Silhouette Phase */}
        {stage === 'silhouette' && (
          <div className="flex flex-col items-center py-10 animate-scale-in">
            <div className="relative w-36 h-36 rounded-3xl bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden">
              <CreatureAvatar creature={creature} size="xl" isSilhouette={true} showGlow={false} />
            </div>
            <h3 className="text-lg font-black text-slate-400 mt-6 animate-pulse">
              ЧТО ЭТО БУДЕТ?!
            </h3>
          </div>
        )}

        {/* Revealed Phase */}
        {stage === 'revealed' && (
          <div className="flex flex-col items-center w-full animate-pop-in">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
              {isNew && (
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border border-amber-300 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>НОВЫЙ МЕМ!</span>
                </div>
              )}
              {creature.isFusion ? (
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-950 to-pink-950 border border-purple-400 text-purple-200 font-black text-xs px-2.5 py-1 rounded-full shadow-md shadow-purple-500/20">
                  <span>🧬</span>
                  <span>ГИПЕР-ФЬЮЖН</span>
                </div>
              ) : isMutation ? (
                <div className="inline-flex items-center gap-1 bg-purple-950 border border-purple-500 text-purple-200 font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                  <span>🧪</span>
                  <span>ГЕНЕТИЧЕСКАЯ МУТАЦИЯ</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 bg-emerald-950 border border-emerald-500 text-emerald-200 font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                  <span>✨</span>
                  <span>ТОЧНЫЙ РЕЦЕПТ</span>
                </div>
              )}
            </div>

            {/* Creature Avatar Frame with rarity glow */}
            <div
              className={`relative w-32 h-32 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-4 ${rarityMeta.border} ${rarityMeta.glow} flex items-center justify-center shadow-2xl mb-4`}
            >
              <CreatureAvatar creature={creature} size="xl" showGlow={true} />
            </div>

            {/* Title & Rarity */}
            <h2 className="text-2xl font-black text-white tracking-tight">{creature.name}</h2>
            <div className="mt-1">
              <span className={`text-xs font-black px-3 py-0.5 rounded-full ${rarityMeta.bgBadge}`}>
                ★ {rarityMeta.label.toUpperCase()}
              </span>
            </div>

            {/* Income info */}
            <div className="mt-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl px-4 py-2 flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Доход</span>
                <span className="text-sm font-black text-amber-300">
                  +{creature.baseIncome} Монет/сек
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 italic mt-3 px-2 line-clamp-2">
              "{creature.description}"
            </p>

            {/* Warning if no space on creature placement zone */}
            {isTerritoryFull && (
              <div className="w-full mt-3 p-2.5 rounded-2xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs font-black text-center flex items-center justify-center gap-2 shadow-lg animate-pulse">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Нет места на зоне размещения существ ({placedCount}/{capacity})!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <button
                id="modal-place-creature-btn"
                onClick={isTerritoryFull ? undefined : onPlace}
                disabled={isTerritoryFull}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg transition-all ${
                  !isTerritoryFull
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 active:scale-95 cursor-pointer shadow-emerald-500/20'
                    : 'bg-slate-800/90 text-slate-500 border border-slate-700/80 cursor-not-allowed opacity-60'
                }`}
                title={isTerritoryFull ? 'Нет свободного места на полянке' : undefined}
              >
                {isTerritoryFull ? <Lock className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                <span>{isTerritoryFull ? 'НЕТ МЕСТА' : 'РАЗМЕСТИТЬ'}</span>
              </button>

              <button
                id="modal-to-backpack-btn"
                onClick={onToBackpack}
                className={`py-3 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                  isTerritoryFull
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/30 ring-2 ring-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200'
                }`}
              >
                <Backpack className={`w-4 h-4 ${isTerritoryFull ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>В РЮКЗАК</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
