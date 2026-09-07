import React, { useState } from 'react';
import { ArrowDown, BookOpen, Dna, Plus, Sparkles, Trash2, X, Zap } from 'lucide-react';
import { CREATURES, findCreatureByIngredients, INGREDIENTS } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { Creature, Ingredient } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { MixAnimationModal } from './MixAnimationModal';
import { RecipeBookModal } from './RecipeBookModal';

export const LabView: React.FC = () => {
  const {
    inventory,
    discoveredCreatures,
    placedCreatures,
    maxCreatureCapacity,
    mixIngredients,
    placeCreature,
    addCreatureToBackpack,
    setActiveTab,
    tutorialStep,
    advanceTutorial,
  } = useGame();

  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [isRecipeBookOpen, setIsRecipeBookOpen] = useState(false);
  const [activeAnimationResult, setActiveAnimationResult] = useState<{
    creature: Creature;
    isNew: boolean;
    isMutation?: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPressingMix, setIsPressingMix] = useState(false);

  // Available ingredients with count >= 1
  const availableIngredients = INGREDIENTS.filter((ing) => (inventory[ing.id] || 0) > 0);

  // Get ingredient meta for slots
  const ingA = slotA ? INGREDIENTS.find((i) => i.id === slotA) : null;
  const ingB = slotB ? INGREDIENTS.find((i) => i.id === slotB) : null;

  // Check if can mix
  const canMix = slotA !== null && slotB !== null;

  // Check if current slot combination is an exact recipe
  const directRecipe = slotA && slotB ? findCreatureByIngredients(slotA, slotB) : null;

  // Check which ingredients in the tray match with the active single slot
  const isCompatibleWithSlot = (ingId: string) => {
    const activeSlot = slotA && !slotB ? slotA : !slotA && slotB ? slotB : null;
    if (!activeSlot) return false;
    return !!findCreatureByIngredients(activeSlot, ingId);
  };

  const handleSelectIngredient = (ingId: string) => {
    soundManager.playClick();
    setErrorMessage(null);

    // If slotA is empty, put in slotA
    if (!slotA) {
      setSlotA(ingId);
      return;
    }

    // If slotA has it, and slotB is empty
    if (!slotB) {
      // If same ingredient, check if we have at least 2 in inventory
      if (slotA === ingId && (inventory[ingId] || 0) < 2) {
        setErrorMessage('У тебя всего 1 такой ингредиент в рюкзаке!');
        return;
      }
      setSlotB(ingId);
      return;
    }

    // If both filled, overwrite slotB
    setSlotB(ingId);
  };

  const handleClearSlot = (slot: 'A' | 'B') => {
    soundManager.playClick();
    if (slot === 'A') setSlotA(null);
    if (slot === 'B') setSlotB(null);
    setErrorMessage(null);
  };

  const handleMixClick = () => {
    if (!slotA || !slotB) return;

    // Squash & stretch on button
    setIsPressingMix(true);
    setTimeout(() => setIsPressingMix(false), 220);

    const result = mixIngredients(slotA, slotB);
    if (!result.success) {
      setErrorMessage(result.message || 'Ошибка скрещивания');
      soundManager.playPop();
      return;
    }

    // Clear slots
    setSlotA(null);
    setSlotB(null);
    setErrorMessage(null);

    if (result.creature) {
      setActiveAnimationResult({
        creature: result.creature,
        isNew: !!result.isNew,
        isMutation: !!result.isMutation,
      });
    }
  };

  const handlePlace = () => {
    if (activeAnimationResult) {
      if (placedCreatures.length < maxCreatureCapacity) {
        placeCreature(activeAnimationResult.creature.id);
        setActiveAnimationResult(null);
        setActiveTab('home');
      } else {
        // Territory is full, put into backpack and open inventory
        addCreatureToBackpack(activeAnimationResult.creature.id);
        setActiveAnimationResult(null);
        setActiveTab('inventory');
      }
    }
  };

  const handleToBackpack = () => {
    if (activeAnimationResult) {
      addCreatureToBackpack(activeAnimationResult.creature.id);
      setActiveAnimationResult(null);
      setActiveTab('inventory');
    }
  };

  const handleSelectFormula = (idA: string, idB: string) => {
    setSlotA(idA);
    setSlotB(idB);
    setErrorMessage(null);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] flex flex-col justify-between p-3 sm:p-5 select-none bg-slate-950 overflow-y-auto">
      {/* HEADER */}
      <div className="text-center mt-1">
        <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
          <Dna className="w-3.5 h-3.5" />
          <span>ГЕНЕТИЧЕСКИЙ РЕАКТОР</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white mt-1">ЛАБОРАТОРИЯ МЕМОВ</h1>
        <p className="text-xs text-slate-400">Соединяй ингредиенты и создавай безумных мемов!</p>

        {/* Recipe Book Button */}
        <button
          id="open-recipe-book-btn"
          onClick={() => {
            soundManager.playClick();
            setIsRecipeBookOpen(true);
          }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-md active:scale-95 transition-all mt-2 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>КНИГА РЕЦЕПТОВ ({discoveredCreatures.length}/{CREATURES.length})</span>
        </button>
      </div>

      {/* TUTORIAL STEP PROMPT */}
      {tutorialStep === 0 && (
        <div className="mt-2 mx-auto max-w-sm bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-4 py-2 rounded-2xl font-black text-xs text-center shadow-lg border-2 border-white animate-bounce">
          🍌 Выбери Банан и Кота 🐱 из списка внизу, затем нажми «СМЕШАТЬ»!
        </div>
      )}

      {/* ERROR NOTICE IF ANY */}
      {errorMessage && (
        <div className="mt-2 mx-auto max-w-sm bg-red-900/60 border border-red-500/50 text-red-200 text-xs font-bold px-3 py-1.5 rounded-xl text-center animate-shake">
          {errorMessage}
        </div>
      )}

      {/* MIXING WORKBENCH */}
      <div className="flex flex-col items-center my-3 max-w-md mx-auto w-full">
        {/* The Two Slots */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
          {/* SLOT A */}
          <div className="flex flex-col items-center">
            <div
              id="lab-slot-a"
              onClick={() => ingA && handleClearSlot('A')}
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
                ingA
                  ? 'bg-slate-800/90 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/70 border-dashed border-slate-700 hover:border-slate-500'
              }`}
            >
              {ingA ? (
                <>
                  <span className="text-4xl sm:text-5xl animate-gentle-bounce select-none">
                    {ingA.emoji}
                  </span>
                  <span className="text-xs font-black text-white mt-1.5 truncate max-w-[80px]">
                    {ingA.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('A');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-[10px] font-bold mt-1">Слот 1</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Ингредиент A</span>
          </div>

          {/* Plus Sign */}
          <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-lg font-black text-amber-400 shadow-md">
            +
          </div>

          {/* SLOT B */}
          <div className="flex flex-col items-center">
            <div
              id="lab-slot-b"
              onClick={() => ingB && handleClearSlot('B')}
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg ${
                ingB
                  ? 'bg-slate-800/90 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/70 border-dashed border-slate-700 hover:border-slate-500'
              }`}
            >
              {ingB ? (
                <>
                  <span className="text-4xl sm:text-5xl animate-gentle-bounce select-none">
                    {ingB.emoji}
                  </span>
                  <span className="text-xs font-black text-white mt-1.5 truncate max-w-[80px]">
                    {ingB.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('B');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-500">
                  <Plus className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-[10px] font-bold mt-1">Слот 2</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Ингредиент B</span>
          </div>
        </div>

        {/* Down Arrow Indicator */}
        <ArrowDown className="w-4 h-4 text-slate-600 my-1.5 animate-bounce" />

        {/* Dynamic Formula Outcome Hint */}
        {canMix && (
          <div className="mb-2 text-center animate-fade-in">
            {directRecipe ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black shadow-md animate-pulse">
                <span>✨</span>
                <span>
                  Гарантированная формула:{' '}
                  {discoveredCreatures.includes(directRecipe.id)
                    ? directRecipe.name
                    : 'Новый мем!'}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 text-xs font-black shadow-md">
                <span>🧪</span>
                <span>Экспериментальная мутация: случайный исход!</span>
              </div>
            )}
          </div>
        )}

        {/* BIG MIX BUTTON with squash animation */}
        <button
          id="lab-mix-btn"
          onClick={handleMixClick}
          disabled={!canMix}
          className={`relative w-full max-w-xs py-3.5 px-6 rounded-3xl font-black text-lg tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all duration-150 active:scale-90 ${
            isPressingMix ? 'scale-90' : ''
          } ${
            canMix
              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 hover:brightness-110 shadow-orange-500/30 cursor-pointer animate-pulse border-2 border-amber-200'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/80 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>СМЕШАТЬ</span>
        </button>
      </div>

      {/* INGREDIENTS TRAY */}
      <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-3 shadow-inner">
        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-xs font-black text-slate-300 uppercase tracking-wide">
            Твои Ингредиенты в рюкзаке:
          </span>
          <button
            onClick={() => setActiveTab('shop')}
            className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
          >
            Купить ещё в магазине →
          </button>
        </div>

        {availableIngredients.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
            {availableIngredients.map((ing) => {
              const count = inventory[ing.id] || 0;
              const isSelectedA = slotA === ing.id;
              const isSelectedB = slotB === ing.id;
              const isCompatible = isCompatibleWithSlot(ing.id);

              return (
                <button
                  key={ing.id}
                  id={`lab-pick-${ing.id}`}
                  onClick={() => handleSelectIngredient(ing.id)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                    isSelectedA || isSelectedB
                      ? 'bg-amber-500/20 border-amber-400 shadow-md ring-2 ring-amber-400/40'
                      : isCompatible
                      ? 'bg-emerald-950/40 border-emerald-400/80 hover:bg-emerald-900/40 shadow-emerald-500/20 shadow-md animate-pulse'
                      : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  {isCompatible && (
                    <span className="absolute -top-1 -left-1 text-xs">✨</span>
                  )}
                  <span className="text-2xl sm:text-3xl select-none">{ing.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-200 mt-1 truncate max-w-full">
                    {ing.name}
                  </span>
                  <span className="absolute top-1 right-1 bg-slate-950/90 text-amber-300 text-[9px] font-black px-1 rounded-md border border-slate-700">
                    x{count}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            У тебя закончились ингредиенты! Зайди в Магазин 🛒 или собери фрукты на полянке.
          </div>
        )}
      </div>

      {/* RECIPE BOOK MODAL */}
      <RecipeBookModal
        isOpen={isRecipeBookOpen}
        onClose={() => setIsRecipeBookOpen(false)}
        onSelectFormula={handleSelectFormula}
      />

      {/* ANIMATED MIX RESULT MODAL */}
      {activeAnimationResult && (
        <MixAnimationModal
          creature={activeAnimationResult.creature}
          isNew={activeAnimationResult.isNew}
          isMutation={activeAnimationResult.isMutation}
          isTerritoryFull={placedCreatures.length >= maxCreatureCapacity}
          placedCount={placedCreatures.length}
          capacity={maxCreatureCapacity}
          onPlace={handlePlace}
          onToBackpack={handleToBackpack}
        />
      )}
    </div>
  );
};
