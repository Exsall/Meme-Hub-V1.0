import React, { useState } from 'react';
import { Backpack, Check, Dna, Lock, PlusCircle, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { calculateCreatureIncome, CREATURES, INGREDIENTS, RARITY_CONFIG } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { IngredientCategory, Rarity } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

export const InventoryView: React.FC = () => {
  const {
    inventory,
    backpackCreatures,
    placedCreatures,
    maxCreatureCapacity,
    placeCreatureFromBackpack,
    setActiveTab,
  } = useGame();

  // Tab between Creatures in Backpack and Ingredients in Backpack
  const [activeSection, setActiveSection] = useState<'creatures' | 'ingredients'>(() => {
    return backpackCreatures.length > 0 ? 'creatures' : 'ingredients';
  });

  const [selectedCategory, setSelectedCategory] = useState<'all' | IngredientCategory>('all');
  const [selectedRarity, setSelectedRarity] = useState<'all' | Rarity>('all');

  const categories: { id: 'all' | IngredientCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Все', icon: '🎒' },
    { id: 'animals', label: 'Животные', icon: '🐱' },
    { id: 'fruits', label: 'Фрукты', icon: '🍌' },
    { id: 'objects', label: 'Предметы', icon: '👟' },
    { id: 'elements', label: 'Стихии', icon: '⚡' },
  ];

  const rarities: ('all' | Rarity)[] = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'secret'];

  // Filtered ingredients that player owns at least 1 of
  const ownedIngredients = INGREDIENTS.filter((ing) => {
    const count = inventory[ing.id] || 0;
    if (count <= 0) return false;
    if (selectedCategory !== 'all' && ing.category !== selectedCategory) return false;
    if (selectedRarity !== 'all' && ing.rarity !== selectedRarity) return false;
    return true;
  });

  const totalIngredientsCount = (Object.values(inventory) as number[]).reduce((acc, c) => acc + c, 0);
  const isTerritoryFull = placedCreatures.length >= maxCreatureCapacity;

  const handlePlaceCreature = (instanceId: string) => {
    soundManager.playClick();
    const success = placeCreatureFromBackpack(instanceId);
    if (success) {
      setActiveTab('home');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] flex flex-col p-3 sm:p-5 select-none bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
            <Backpack className="w-3.5 h-3.5 text-amber-400" />
            <span>РЮКЗАК И СУМКА</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Инвентарь</h1>
        </div>

        <button
          onClick={() => setActiveTab('shop')}
          className="px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-all active:scale-95"
        >
          + Магазин
        </button>
      </div>

      {/* Main Section Switcher: Creatures vs Ingredients */}
      <div className="flex items-center gap-2 mt-3 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shrink-0">
        <button
          id="inv-tab-creatures"
          onClick={() => {
            soundManager.playClick();
            setActiveSection('creatures');
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            activeSection === 'creatures'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🐾 Существа в рюкзаке</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSection === 'creatures'
                ? 'bg-slate-950/30 text-slate-950'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {backpackCreatures.length}
          </span>
        </button>

        <button
          id="inv-tab-ingredients"
          onClick={() => {
            soundManager.playClick();
            setActiveSection('ingredients');
          }}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all ${
            activeSection === 'ingredients'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🧪 Ингредиенты</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeSection === 'ingredients'
                ? 'bg-slate-950/30 text-slate-950'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {totalIngredientsCount}
          </span>
        </button>
      </div>

      {/* CREATURES TAB CONTENT */}
      {activeSection === 'creatures' && (
        <div className="mt-3 flex flex-col flex-1 pb-6">
          {/* Capacity banner */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/80 border border-slate-800 rounded-2xl mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Места на полянке:</span>
              <span className="text-xs font-black text-amber-300">
                {placedCreatures.length} / {maxCreatureCapacity}
              </span>
            </div>
            {isTerritoryFull ? (
              <span className="text-[10px] font-black text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                {maxCreatureCapacity >= 25 ? 'Максимум 25 мест' : 'Лимит • Открой локацию: +5 мест'}
              </span>
            ) : (
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Свободно {maxCreatureCapacity - placedCreatures.length} из {maxCreatureCapacity} мест
              </span>
            )}
          </div>

          {backpackCreatures.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {backpackCreatures.map((item) => {
                const creature = CREATURES.find((c) => c.id === item.creatureId);
                if (!creature) return null;

                const rarityMeta = RARITY_CONFIG[creature.rarity];
                const income = calculateCreatureIncome(creature, item.level);

                return (
                  <div
                    key={item.instanceId}
                    className="relative rounded-3xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col items-center text-center shadow-lg group hover:border-emerald-500/50 transition-all"
                  >
                    {/* Top badges: Level & Rarity */}
                    <div className="w-full flex justify-between items-center text-[10px] font-bold mb-1">
                      <span className={`px-2 py-0.5 rounded-full ${rarityMeta.bgBadge}`}>
                        {rarityMeta.label}
                      </span>
                      <span className="bg-slate-950 text-amber-400 font-black px-2 py-0.5 rounded-full border border-slate-800">
                        Ур. {item.level}
                      </span>
                    </div>

                    {/* Creature Avatar */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center shadow-inner my-1.5 overflow-hidden group-hover:scale-105 transition-transform">
                      <CreatureAvatar creature={creature} size="md" showGlow={true} />
                    </div>

                    {/* Name */}
                    <span className="text-sm font-black text-white truncate max-w-full">
                      {creature.name}
                    </span>

                    {/* Income rate */}
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span>+{income} 🪙/сек</span>
                    </div>

                    {/* Place Button */}
                    <button
                      id={`backpack-place-btn-${item.instanceId}`}
                      onClick={() => handlePlaceCreature(item.instanceId)}
                      disabled={isTerritoryFull}
                      className={`w-full mt-3 py-2 px-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow transition-all active:scale-95 ${
                        !isTerritoryFull
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 cursor-pointer shadow-emerald-500/20'
                          : 'bg-slate-800/90 text-slate-500 border border-slate-700/80 cursor-not-allowed opacity-60'
                      }`}
                      title={isTerritoryFull ? 'Нет места на зоне размещения существ' : undefined}
                    >
                      {isTerritoryFull ? <Lock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{isTerritoryFull ? 'Нет места на зоне' : 'Разместить на поле'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800/60 p-6 mt-2">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🎒
              </div>
              <h3 className="text-base font-black text-slate-200">В рюкзаке сейчас нет существ</h3>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                Чтобы убрать существо с поляны в рюкзак, нажмите на него на Полянке и выберите{' '}
                <strong className="text-slate-300">«Убрать в рюкзак»</strong>.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all"
                >
                  Перейти на Поляну
                </button>
                <button
                  onClick={() => setActiveTab('lab')}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Dna className="w-3.5 h-3.5" />
                  <span>Создать в Лаборатории</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* INGREDIENTS TAB CONTENT */}
      {activeSection === 'ingredients' && (
        <div className="mt-3 flex flex-col flex-1 pb-6">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                id={`inv-cat-${cat.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Rarity Pills Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
            {rarities.map((r) => {
              const isAll = r === 'all';
              const label = isAll ? 'Все редкости' : RARITY_CONFIG[r].label;

              return (
                <button
                  key={r}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRarity(r);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                    selectedRarity === r
                      ? 'bg-slate-700 text-white border border-slate-500'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Grid of ingredients */}
          {ownedIngredients.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-1">
              {ownedIngredients.map((ing) => {
                const count = inventory[ing.id] || 0;
                const rarityMeta = RARITY_CONFIG[ing.rarity];

                return (
                  <div
                    key={ing.id}
                    className="relative rounded-3xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col items-center text-center shadow-lg group hover:border-slate-700 transition-all"
                  >
                    {/* Count badge */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/90 text-amber-300 text-xs font-black px-2 py-0.5 rounded-full border border-slate-700">
                      x{count}
                    </div>

                    {/* Emoji graphic */}
                    <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-4xl shadow-inner my-1 group-hover:scale-105 transition-transform">
                      <span className="animate-gentle-bounce">{ing.emoji}</span>
                    </div>

                    {/* Name */}
                    <span className="text-sm font-black text-white mt-1">{ing.name}</span>

                    {/* Rarity */}
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full mt-1 ${rarityMeta.bgBadge}`}>
                      {rarityMeta.label}
                    </span>

                    <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 px-1 leading-snug">
                      {ing.description}
                    </p>

                    {/* Quick send to Lab button */}
                    <button
                      id={`inv-mix-btn-${ing.id}`}
                      onClick={() => {
                        soundManager.playClick();
                        setActiveTab('lab');
                      }}
                      className="w-full mt-3 py-1.5 px-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all"
                    >
                      <Dna className="w-3.5 h-3.5" />
                      <span>В Лабораторию</span>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="text-4xl mb-3">🎒</div>
              <h3 className="text-base font-black text-slate-300">В этом разделе ничего нет</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Купи новые ингредиенты или открой Коробку в Магазине 🛒!
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-4 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md active:scale-95"
              >
                Перейти в Магазин
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
