import React, { useState } from 'react';
import { ArrowDown, BookOpen, Check, Dna, Plus, Sparkles, Trash2, X, Zap } from 'lucide-react';
import { CREATURES, findCreatureByIngredients, getItemMeta, INGREDIENTS, RARITY_CONFIG } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { Creature, Ingredient } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';
import { MixAnimationModal } from './MixAnimationModal';
import { RecipeBookModal } from './RecipeBookModal';

export const LabView: React.FC = () => {
  const {
    inventory,
    discoveredCreatures,
    backpackCreatures,
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
  const [trayTab, setTrayTab] = useState<'ingredients' | 'creatures'>('ingredients');
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

  // Calculate creature counts currently stored in backpack
  const backpackCreatureCounts: Record<string, number> = {};
  backpackCreatures.forEach((b) => {
    backpackCreatureCounts[b.creatureId] = (backpackCreatureCounts[b.creatureId] || 0) + 1;
  });

  // Only creatures currently in the player's backpack can be used for fusion!
  const availableCreatures = CREATURES.filter(
    (c) => (backpackCreatureCounts[c.id] || 0) > 0
  );

  // Get metadata for slots
  const metaA = slotA ? getItemMeta(slotA) : null;
  const metaB = slotB ? getItemMeta(slotB) : null;

  // Check if can mix
  const canMix = slotA !== null && slotB !== null;

  // Check if current slot combination is an exact recipe
  const directRecipe = slotA && slotB ? findCreatureByIngredients(slotA, slotB) : null;

  // Check if mixing two creatures (Hyper-Fusion)
  const isCreatureFusion = metaA?.isCreature && metaB?.isCreature;
  const isHybridMix = (metaA?.isCreature && !metaB?.isCreature) || (!metaA?.isCreature && metaB?.isCreature);

  // Check which items in the tray match with the active single slot
  const isCompatibleWithSlot = (itemId: string) => {
    const activeSlot = slotA && !slotB ? slotA : !slotA && slotB ? slotB : null;
    if (!activeSlot) return false;
    return !!findCreatureByIngredients(activeSlot, itemId);
  };

  const handleSelectItem = (itemId: string) => {
    soundManager.playClick();
    setErrorMessage(null);

    const meta = getItemMeta(itemId);

    // If slotA is empty, put in slotA
    if (!slotA) {
      setSlotA(itemId);
      return;
    }

    // If slotA has it, and slotB is empty
    if (!slotB) {
      // If same item
      if (slotA === itemId) {
        if (!meta.isCreature && (inventory[itemId] || 0) < 2) {
          setErrorMessage('У тебя всего 1 такой ингредиент в инвентаре!');
          return;
        }
        if (meta.isCreature && (backpackCreatureCounts[itemId] || 0) < 2) {
          setErrorMessage('У тебя всего 1 такое существо в рюкзаке! Нужно 2 шт. для скрещивания одинаковых.');
          return;
        }
      }
      setSlotB(itemId);
      return;
    }

    // If both filled, overwrite slotB
    setSlotB(itemId);
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
          <Dna className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>ГЕНЕТИЧЕСКИЙ РЕАКТОР & ФЬЮЖН</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white mt-1">ЛАБОРАТОРИЯ МЕМОВ</h1>
        <p className="text-xs text-slate-400">
          Смешивай ингредиенты или скрещивай созданных существ для Мега-Фьюжна!
        </p>

        {/* Recipe Book Button */}
        <button
          id="open-recipe-book-btn"
          onClick={() => {
            soundManager.playClick();
            setIsRecipeBookOpen(true);
          }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 hover:brightness-110 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-black shadow-md active:scale-95 transition-all mt-2 cursor-pointer"
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
      <div className="flex flex-col items-center my-2 max-w-md mx-auto w-full">
        {/* The Two Slots */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
          {/* SLOT A */}
          <div className="flex flex-col items-center">
            <div
              id="lab-slot-a"
              onClick={() => metaA && handleClearSlot('A')}
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg p-1.5 ${
                metaA
                  ? metaA.isCreature
                    ? 'bg-slate-900/90 border-purple-400 shadow-purple-500/30'
                    : 'bg-slate-800/90 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/70 border-dashed border-slate-700 hover:border-slate-500'
              }`}
            >
              {metaA ? (
                <>
                  {metaA.isCreature ? (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner border border-purple-500/40">
                        {(() => {
                          const creature = CREATURES.find((c) => c.id === metaA.id);
                          return creature ? (
                            <CreatureAvatar creature={creature} size="sm" showGlow={false} />
                          ) : (
                            <span className="text-3xl">{metaA.emoji}</span>
                          );
                        })()}
                      </div>
                      <span className="text-[11px] font-black text-white mt-1 truncate max-w-[85px]">
                        {metaA.name}
                      </span>
                      <span className="text-[8px] font-black uppercase text-purple-300 bg-purple-950/80 px-1 rounded">
                        🐾 Существо
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl sm:text-5xl animate-gentle-bounce select-none">
                        {metaA.emoji}
                      </span>
                      <span className="text-xs font-black text-white mt-1.5 truncate max-w-[85px]">
                        {metaA.name}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-amber-300 bg-amber-950/80 px-1 rounded">
                        🧪 Ингредиент
                      </span>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('A');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow cursor-pointer"
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
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
              {metaA?.isCreature ? 'Родитель 1' : 'Элемент A'}
            </span>
          </div>

          {/* Plus Sign */}
          <div className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-lg font-black text-amber-400 shadow-md">
            {isCreatureFusion ? '🧬' : '+'}
          </div>

          {/* SLOT B */}
          <div className="flex flex-col items-center">
            <div
              id="lab-slot-b"
              onClick={() => metaB && handleClearSlot('B')}
              className={`relative w-24 h-28 sm:w-28 sm:h-32 rounded-3xl border-3 flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg p-1.5 ${
                metaB
                  ? metaB.isCreature
                    ? 'bg-slate-900/90 border-purple-400 shadow-purple-500/30'
                    : 'bg-slate-800/90 border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/70 border-dashed border-slate-700 hover:border-slate-500'
              }`}
            >
              {metaB ? (
                <>
                  {metaB.isCreature ? (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner border border-purple-500/40">
                        {(() => {
                          const creature = CREATURES.find((c) => c.id === metaB.id);
                          return creature ? (
                            <CreatureAvatar creature={creature} size="sm" showGlow={false} />
                          ) : (
                            <span className="text-3xl">{metaB.emoji}</span>
                          );
                        })()}
                      </div>
                      <span className="text-[11px] font-black text-white mt-1 truncate max-w-[85px]">
                        {metaB.name}
                      </span>
                      <span className="text-[8px] font-black uppercase text-purple-300 bg-purple-950/80 px-1 rounded">
                        🐾 Существо
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-4xl sm:text-5xl animate-gentle-bounce select-none">
                        {metaB.emoji}
                      </span>
                      <span className="text-xs font-black text-white mt-1.5 truncate max-w-[85px]">
                        {metaB.name}
                      </span>
                      <span className="text-[8px] font-bold uppercase text-amber-300 bg-amber-950/80 px-1 rounded">
                        🧪 Ингредиент
                      </span>
                    </>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSlot('B');
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-300 hover:text-white flex items-center justify-center text-xs shadow cursor-pointer"
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
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
              {metaB?.isCreature ? 'Родитель 2' : 'Элемент B'}
            </span>
          </div>
        </div>

        {/* Down Arrow Indicator */}
        <ArrowDown className="w-4 h-4 text-slate-600 my-1 animate-bounce" />

        {/* Dynamic Formula Outcome Hint */}
        {canMix && (
          <div className="mb-2 text-center animate-fade-in px-2">
            {isCreatureFusion ? (
              directRecipe ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/90 border border-purple-400 text-purple-200 text-xs font-black shadow-lg shadow-purple-900/30 animate-pulse">
                  <Dna className="w-3.5 h-3.5 text-pink-400" />
                  <span>🧬 ГИПЕР-ФЬЮЖН: {directRecipe.name} (Гарантированно!)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/60 text-purple-300 text-xs font-black shadow-md">
                  <Dna className="w-3.5 h-3.5 text-purple-400" />
                  <span>🧬 Экспериментальное скрещивание видов: Супер-Мутация!</span>
                </div>
              )
            ) : directRecipe ? (
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
          className={`relative w-full max-w-xs py-3 px-6 rounded-3xl font-black text-base sm:text-lg tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all duration-150 active:scale-90 ${
            isPressingMix ? 'scale-90' : ''
          } ${
            canMix
              ? isCreatureFusion
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-slate-950 hover:brightness-110 shadow-purple-500/40 cursor-pointer animate-pulse border-2 border-purple-200'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-slate-950 hover:brightness-110 shadow-orange-500/30 cursor-pointer animate-pulse border-2 border-amber-200'
              : 'bg-slate-800/80 text-slate-500 border border-slate-700/80 cursor-not-allowed'
          }`}
        >
          {isCreatureFusion ? <Dna className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          <span>{isCreatureFusion ? 'СКРЕСТИТЬ ВИДЫ' : 'СМЕШАТЬ'}</span>
        </button>
      </div>

      {/* TRAY CONTAINER WITH TABS */}
      <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-md rounded-3xl border border-slate-800 p-3 shadow-inner">
        {/* Tray Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                soundManager.playClick();
                setTrayTab('ingredients');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                trayTab === 'ingredients'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white'
              }`}
            >
              🧪 Ингредиенты ({availableIngredients.length})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setTrayTab('creatures');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                trayTab === 'creatures'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/70 text-slate-400 hover:text-white'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-purple-300" />
              <span>🐾 Существа ({availableCreatures.length})</span>
            </button>
          </div>

          {trayTab === 'ingredients' ? (
            <button
              onClick={() => setActiveTab('shop')}
              className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer shrink-0"
            >
              Магазин →
            </button>
          ) : (
            <span className="text-[10px] text-purple-300 font-bold shrink-0">
              Гипер-Фьюжн 🧬
            </span>
          )}
        </div>

        {/* TAB 1: INGREDIENTS */}
        {trayTab === 'ingredients' && (
          <>
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
                      onClick={() => handleSelectItem(ing.id)}
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
          </>
        )}

        {/* TAB 2: CREATURES FOR HYPER-FUSION */}
        {trayTab === 'creatures' && (
          <>
            <div className="flex items-center justify-between text-[10px] text-purple-300 font-bold mb-1.5 px-1">
              <span>⚠️ При скрещивании существа расходуются из рюкзака</span>
              <span className="text-slate-400">На поле: {placedCreatures.length}</span>
            </div>

            {availableCreatures.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                {availableCreatures.map((creature) => {
                  const isSelectedA = slotA === creature.id;
                  const isSelectedB = slotB === creature.id;
                  const isCompatible = isCompatibleWithSlot(creature.id);
                  const rarityMeta = RARITY_CONFIG[creature.rarity];
                  const backpackCount = backpackCreatureCounts[creature.id] || 0;

                  return (
                    <button
                      key={creature.id}
                      id={`lab-pick-creature-${creature.id}`}
                      onClick={() => handleSelectItem(creature.id)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
                        isSelectedA || isSelectedB
                          ? 'bg-purple-500/30 border-purple-400 shadow-md ring-2 ring-purple-400/40'
                          : isCompatible
                          ? 'bg-purple-950/50 border-pink-400 shadow-pink-500/20 shadow-md animate-pulse'
                          : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800'
                      }`}
                    >
                      {isCompatible && (
                        <span className="absolute -top-1 -left-1 text-xs">🧬</span>
                      )}
                      <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center overflow-hidden border border-slate-700/60 shadow-inner">
                        <CreatureAvatar creature={creature} size="sm" showGlow={false} />
                      </div>
                      <span className="text-[10px] font-black text-white mt-1 truncate max-w-full">
                        {creature.name}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full ${rarityMeta.bgBadge}`}>
                          {rarityMeta.label}
                        </span>
                        {backpackCount > 0 && (
                          <span className="text-[8px] font-black bg-purple-950 text-purple-300 px-1 rounded border border-purple-500/40">
                            x{backpackCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-5 px-3 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80">
                <p className="text-slate-300 text-xs font-bold mb-1">
                  🎒 В рюкзаке пока нет существ для скрещивания
                </p>
                <p className="text-slate-400 text-[11px] mb-3 leading-relaxed">
                  Существа на полянке защищены от случайного слияния. Чтобы использовать существо, откройте его на полянке и нажмите «Убрать в рюкзак».
                </p>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs hover:brightness-110 shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
                >
                  🌾 Перейти на Полянку
                </button>
              </div>
            )}
          </>
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
