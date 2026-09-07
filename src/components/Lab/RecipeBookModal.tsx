import React, { useState } from 'react';
import { BookOpen, Check, ExternalLink, Lock, Sparkles, X, Zap } from 'lucide-react';
import { CREATURES, INGREDIENTS, RARITY_CONFIG } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { Creature } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

interface RecipeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormula: (idA: string, idB: string) => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({
  isOpen,
  onClose,
  onSelectFormula,
}) => {
  const { inventory, discoveredCreatures } = useGame();
  const [filter, setFilter] = useState<'all' | 'ready' | 'discovered'>('all');

  if (!isOpen) return null;

  const getIngredient = (id: string) => INGREDIENTS.find((i) => i.id === id);

  const hasIngredient = (id: string) => (inventory[id] || 0) > 0;

  const canCraftCreature = (c: Creature) => {
    const [idA, idB] = c.ingredients;
    if (idA === idB) {
      return (inventory[idA] || 0) >= 2;
    }
    return hasIngredient(idA) && hasIngredient(idB);
  };

  const filteredCreatures = CREATURES.filter((c) => {
    const isDiscovered = discoveredCreatures.includes(c.id);
    const canCraft = canCraftCreature(c);

    if (filter === 'ready') return canCraft;
    if (filter === 'discovered') return isDiscovered;
    return true;
  });

  const discoveredCount = discoveredCreatures.length;
  const readyCount = CREATURES.filter(canCraftCreature).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-xl shadow-md">
              📖
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                КНИГА РЕЦЕПТОВ
              </h2>
              <p className="text-xs text-slate-400">
                Открыто {discoveredCount} из {CREATURES.length} мемов • Готово к синтезу: {readyCount}
              </p>
            </div>
          </div>
          <button
            id="close-recipe-book-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            Все ({CREATURES.length})
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('ready');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              filter === 'ready'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            <span>В наличии</span>
            <span className="bg-slate-900/60 px-1.5 py-0.2 rounded-full text-[10px]">
              {readyCount}
            </span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setFilter('discovered');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              filter === 'discovered'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            Открытые ({discoveredCount})
          </button>
        </div>

        {/* Recipes List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 flex-1">
          {filteredCreatures.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              В этой категории пока ничего нет. Собери ингредиенты или открой коробки в магазине!
            </div>
          ) : (
            filteredCreatures.map((creature) => {
              const isDiscovered = discoveredCreatures.includes(creature.id);
              const [idA, idB] = creature.ingredients;
              const ingA = getIngredient(idA);
              const ingB = getIngredient(idB);
              const hasA = hasIngredient(idA);
              const hasB = hasIngredient(idB);
              const canCraft = canCraftCreature(creature);
              const rarityMeta = RARITY_CONFIG[creature.rarity];

              return (
                <div
                  key={creature.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    canCraft
                      ? 'bg-slate-800/90 border-emerald-500/60 shadow-md'
                      : isDiscovered
                      ? 'bg-slate-800/50 border-slate-700/60'
                      : 'bg-slate-900/50 border-slate-800 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {/* Left: Creature Preview */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border overflow-hidden ${
                          isDiscovered
                            ? `${rarityMeta.border} bg-slate-800`
                            : 'border-slate-700 bg-slate-950 text-slate-600'
                        }`}
                      >
                        {isDiscovered ? (
                          <CreatureAvatar creature={creature} size="sm" showGlow={false} />
                        ) : (
                          <span className="text-xl">❓</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-white">
                            {isDiscovered ? creature.name : 'Неизвестный мем'}
                          </h4>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${rarityMeta.bgBadge}`}
                          >
                            {rarityMeta.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                          💡 {creature.hint}
                        </p>
                      </div>
                    </div>

                    {/* Right: Quick Load Button */}
                    {canCraft && (
                      <button
                        onClick={() => {
                          soundManager.playPop();
                          onSelectFormula(idA, idB);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 shadow-md active:scale-95 transition-transform"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>В СЛОТЫ</span>
                      </button>
                    )}
                  </div>

                  {/* Formula Row */}
                  <div className="mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Ingredient A */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-bold ${
                          hasA
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>{ingA?.emoji || '❓'}</span>
                        <span>{ingA?.name || idA}</span>
                        {hasA ? <Check className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 opacity-40" />}
                      </span>

                      <span className="text-slate-500 font-bold">+</span>

                      {/* Ingredient B */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border font-bold ${
                          hasB
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        <span>{ingB?.emoji || '❓'}</span>
                        <span>{ingB?.name || idB}</span>
                        {hasB ? <Check className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 opacity-40" />}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-amber-300 shrink-0 ml-2">
                      +{creature.baseIncome} 🪙/сек
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            🧪 Экспериментируй! Даже если рецепта нет в книге, ингредиенты могут создать неожиданную мутацию!
          </p>
        </div>
      </div>
    </div>
  );
};
