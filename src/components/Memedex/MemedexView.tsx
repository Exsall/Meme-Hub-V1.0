import React, { useState } from 'react';
import { BookOpen, Check, HelpCircle, Lock, Sparkles } from 'lucide-react';
import { CREATURES, INGREDIENTS, RARITY_CONFIG } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { Creature, Rarity } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

export const MemedexView: React.FC = () => {
  const { discoveredCreatures, placedCreatures, backpackCreatures, setActiveTab } = useGame();
  const [selectedRarity, setSelectedRarity] = useState<'all' | Rarity>('all');
  const [inspectCreature, setInspectCreature] = useState<Creature | null>(null);

  const rarities: ('all' | Rarity)[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'secret'];

  // Filter creatures
  const filteredCreatures = CREATURES.filter((c) => {
    if (selectedRarity !== 'all' && c.rarity !== selectedRarity) return false;
    return true;
  });

  const discoveredCount = discoveredCreatures.length;
  const totalCount = CREATURES.length;
  const progressPercent = Math.round((discoveredCount / totalCount) * 100);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] flex flex-col p-3 sm:p-5 select-none bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>МЕМНАЯ ЭНЦИКЛОПЕДИЯ</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">КОЛЛЕКЦИЯ МЕМОВ</h1>
        </div>

        {/* Counter */}
        <div className="flex flex-col items-end">
          <div className="text-sm font-black text-amber-300">
            {discoveredCount} / {totalCount}
          </div>
          <span className="text-[10px] font-bold text-slate-400">{progressPercent}% открыто</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Rarity Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
        {rarities.map((r) => {
          const isAll = r === 'all';
          const label = isAll ? 'Все' : RARITY_CONFIG[r].label;

          return (
            <button
              key={r}
              onClick={() => {
                soundManager.playClick();
                setSelectedRarity(r);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all active:scale-95 ${
                selectedRarity === r
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid of Creatures */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-8">
        {filteredCreatures.map((creature) => {
          const isDiscovered = discoveredCreatures.includes(creature.id);
          const rarityMeta = RARITY_CONFIG[creature.rarity];
          const isAlreadyPlaced = placedCreatures.some((pc) => pc.creatureId === creature.id);

          const ing1 = INGREDIENTS.find((i) => i.id === creature.ingredients[0]);
          const ing2 = INGREDIENTS.find((i) => i.id === creature.ingredients[1]);

          return (
            <div
              key={creature.id}
              onClick={() => {
                soundManager.playClick();
                setInspectCreature(creature);
              }}
              className={`relative rounded-3xl border p-3.5 flex flex-col items-center text-center transition-all cursor-pointer shadow-lg active:scale-95 ${
                isDiscovered
                  ? `bg-slate-900 ${rarityMeta.border} hover:border-slate-400`
                  : 'bg-slate-950/80 border-slate-800/80 opacity-70 hover:opacity-90'
              }`}
            >
              {/* Rarity Tag */}
              <div className="w-full flex justify-between items-center text-[10px] font-bold mb-1">
                <span className={`px-2 py-0.2 rounded-full ${isDiscovered ? rarityMeta.bgBadge : 'bg-slate-800 text-slate-500'}`}>
                  {rarityMeta.label}
                </span>
                {isDiscovered ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-600" />
                )}
              </div>

              {/* Avatar */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center my-2 shadow-inner overflow-hidden ${
                  isDiscovered
                    ? 'bg-slate-800/90'
                    : 'bg-slate-950'
                }`}
              >
                <CreatureAvatar
                  creature={creature}
                  size="md"
                  isSilhouette={!isDiscovered}
                  showGlow={isDiscovered}
                />
              </div>

              {/* Name */}
              <span className="text-sm font-black text-white truncate max-w-full">
                {isDiscovered ? creature.name : '???'}
              </span>

              {/* Recipe formula or Hint */}
              {isDiscovered ? (
                <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-300 mt-1.5">
                  <span>{ing1?.emoji}</span>
                  <span>+</span>
                  <span>{ing2?.emoji}</span>
                </div>
              ) : (
                <p className="text-[10px] text-amber-400/90 italic mt-1.5 line-clamp-2 px-1">
                  💡 {creature.hint}
                </p>
              )}

              {/* Income */}
              {isDiscovered && (
                <div className="text-[11px] font-black text-amber-300 mt-1">
                  +{creature.baseIncome} 🪙/сек
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* INSPECT CREATURE MODAL */}
      {inspectCreature && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setInspectCreature(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-5 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {discoveredCreatures.includes(inspectCreature.id) ? (
              <>
                <div
                  className={`w-28 h-28 rounded-3xl bg-slate-800 border-4 ${RARITY_CONFIG[inspectCreature.rarity].border} flex items-center justify-center shadow-xl mb-3 overflow-hidden`}
                >
                  <CreatureAvatar creature={inspectCreature} size="xl" showGlow={true} />
                </div>

                <h2 className="text-xl font-black text-white">{inspectCreature.name}</h2>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full mt-1 ${RARITY_CONFIG[inspectCreature.rarity].bgBadge}`}
                >
                  {RARITY_CONFIG[inspectCreature.rarity].label}
                </span>

                {/* Recipe */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-2.5 mt-3 w-full">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    РЕЦЕПТ СЛИЯНИЯ:
                  </span>
                  <div className="flex items-center justify-center gap-2 text-sm font-black text-white mt-1">
                    <span>{INGREDIENTS.find((i) => i.id === inspectCreature.ingredients[0])?.emoji}</span>
                    <span>{INGREDIENTS.find((i) => i.id === inspectCreature.ingredients[0])?.name}</span>
                    <span className="text-amber-400">+</span>
                    <span>{INGREDIENTS.find((i) => i.id === inspectCreature.ingredients[1])?.emoji}</span>
                    <span>{INGREDIENTS.find((i) => i.id === inspectCreature.ingredients[1])?.name}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic mt-3 px-2">"{inspectCreature.description}"</p>

                <div className="flex items-center justify-between w-full mt-4 text-xs font-black text-amber-300 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30">
                  <span className="text-slate-400">Базовый доход:</span>
                  <span>+{inspectCreature.baseIncome} Монет/сек</span>
                </div>

                {/* Status chips */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 w-full">
                  {placedCreatures.some((p) => p.creatureId === inspectCreature.id) && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      На полянке ({placedCreatures.filter((p) => p.creatureId === inspectCreature.id).length} шт.)
                    </span>
                  )}
                  {backpackCreatures.some((b) => b.creatureId === inspectCreature.id) && (
                    <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                      🎒 В рюкзаке ({backpackCreatures.filter((b) => b.creatureId === inspectCreature.id).length} шт.)
                    </span>
                  )}
                  {!placedCreatures.some((p) => p.creatureId === inspectCreature.id) &&
                    !backpackCreatures.some((b) => b.creatureId === inspectCreature.id) && (
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-xl">
                        Создайте в Лаборатории для размещения
                      </span>
                    )}
                </div>

                <button
                  id="memedex-close-inspect-btn"
                  onClick={() => setInspectCreature(null)}
                  className="w-full mt-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition-all"
                >
                  Закрыть
                </button>
              </>
            ) : (
              <>
                <div className="w-28 h-28 rounded-3xl bg-slate-950 border-4 border-slate-800 flex items-center justify-center shadow-inner mb-3 overflow-hidden">
                  <CreatureAvatar creature={inspectCreature} size="xl" isSilhouette={true} showGlow={false} />
                </div>

                <h2 className="text-xl font-black text-slate-400">СЕКРЕТНЫЙ МЕМ</h2>
                <span className="text-xs font-bold text-slate-500 mt-1">Ещё не открыт</span>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mt-4 w-full">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                    💡 ПОДСКАЗКА:
                  </span>
                  <p className="text-xs text-slate-200 font-bold mt-1">
                    {inspectCreature.hint}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setInspectCreature(null);
                    setActiveTab('lab');
                  }}
                  className="w-full mt-4 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs sm:text-sm active:scale-95 transition-transform"
                >
                  Попробовать в Лаборатории 🧬
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
