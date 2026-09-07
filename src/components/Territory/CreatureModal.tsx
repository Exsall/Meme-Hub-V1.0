import React from 'react';
import { ArrowUpCircle, Backpack, Sparkles, TrendingUp, X } from 'lucide-react';
import { calculateCreatureIncome, calculateUpgradeCost, CREATURES, RARITY_CONFIG } from '../../data/gameData';
import { PlacedCreature } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

interface CreatureModalProps {
  placed: PlacedCreature;
  coins: number;
  onClose: () => void;
  onUpgrade: (instanceId: string) => boolean;
  onRecall: (instanceId: string) => void;
}

export const CreatureModal: React.FC<CreatureModalProps> = ({
  placed,
  coins,
  onClose,
  onUpgrade,
  onRecall,
}) => {
  const creature = CREATURES.find((c) => c.id === placed.creatureId);
  if (!creature) return null;

  const rarityMeta = RARITY_CONFIG[creature.rarity];
  const currentIncome = calculateCreatureIncome(creature, placed.level);
  const nextIncome = calculateCreatureIncome(creature, placed.level + 1);
  const upgradeCost = calculateUpgradeCost(creature, placed.level);
  const canAfford = coins >= upgradeCost && placed.level < creature.maxLevel;
  const isMaxLevel = placed.level >= creature.maxLevel;

  const handleUpgrade = () => {
    if (canAfford) {
      onUpgrade(placed.instanceId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700 shadow-2xl p-5 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creature header */}
        <div className="flex flex-col items-center text-center mt-2">
          {/* Character showcase: pet holding item with soft rarity aura */}
          <div className="relative flex flex-col items-center justify-center my-2 select-none">
            <CreatureAvatar creature={creature} size="xl" showGlow={true} />

            <div className="mt-3 bg-slate-950 border border-slate-700 px-3 py-0.5 rounded-full text-xs font-black text-amber-400 shadow-md">
              Уровень {placed.level}
            </div>
          </div>

          <h2 className="text-xl font-black text-white mt-1">{creature.name}</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${rarityMeta.bgBadge}`}>
              {rarityMeta.label}
            </span>
            {creature.isFusion && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/60 text-purple-300">
                🧬 Гипер-Фьюжн
              </span>
            )}
            <span className="text-xs text-slate-400">
              (макс. ур. {creature.maxLevel})
            </span>
          </div>

          <p className="text-xs text-slate-300 italic mt-2 px-4">{creature.description}</p>
        </div>

        {/* Production stats card */}
        <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/60 mt-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1">
            <span>ДОХОД СУЩЕСТВА</span>
            <span className="flex items-center gap-1 text-emerald-400 font-extrabold">
              <TrendingUp className="w-3.5 h-3.5" />
              Текущий: {currentIncome} 🪙/с
            </span>
          </div>

          {!isMaxLevel && (
            <div className="flex items-center justify-between text-xs font-bold mt-2 pt-2 border-t border-slate-700">
              <span className="text-slate-300">Следующий уровень:</span>
              <span className="text-amber-300 font-black">+{nextIncome - currentIncome} 🪙/с ({nextIncome} 🪙/с)</span>
            </div>
          )}
        </div>

        {/* Upgrade & Actions */}
        <div className="mt-5 flex flex-col gap-2.5">
          {!isMaxLevel ? (
            <button
              id="upgrade-creature-btn"
              onClick={handleUpgrade}
              disabled={!canAfford}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-150 active:scale-95 ${
                canAfford
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5" />
              <span>УЛУЧШИТЬ ДО УР. {placed.level + 1}</span>
              <span className="ml-1 bg-black/20 px-2 py-0.5 rounded-lg text-sm">
                🪙 {upgradeCost.toLocaleString()}
              </span>
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-2xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 font-black text-center text-sm">
              ✨ МАКСИМАЛЬНЫЙ УРОВЕНЬ ДОСТИГНУТ!
            </div>
          )}

          <button
            id="recall-creature-btn"
            onClick={() => {
              onRecall(placed.instanceId);
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
          >
            <Backpack className="w-4 h-4 text-amber-400" />
            <span>Убрать в рюкзак (освободить место)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
