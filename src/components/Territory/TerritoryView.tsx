import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ChevronDown, Dna, Lock, MapPin, Sparkles, Trees, Waves, Zap } from 'lucide-react';
import { INGREDIENTS, ZONES } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';
import { CreatureModal } from './CreatureModal';
import { CreatureSprite } from './CreatureSprite';
import { TerritoryEnvironment } from './TerritoryEnvironment';

export const TerritoryView: React.FC = () => {
  const {
    placedCreatures,
    unlockedZones,
    maxCreatureCapacity,
    groundItems,
    collectGroundItem,
    collectCreatureCoins,
    inspectedCreature,
    setInspectedCreature,
    upgradeCreature,
    recallCreature,
    coins,
    level,
    unlockZone,
    setActiveTab,
    tutorialStep,
    openAdModal,
    getBoosterTimeRemaining,
  } = useGame();

  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const doubleIncomeTime = getBoosterTimeRemaining('double_income');
  const eventDoubleIncomeTime = getBoosterTimeRemaining('event_double_income');
  const sleepyFogTime = getBoosterTimeRemaining('sleepy_fog');
  const fastSpawnTime = getBoosterTimeRemaining('fast_spawn');
  const superLuckyTime = getBoosterTimeRemaining('super_lucky');

  const formatTimerMinSec = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const [unlockToast, setUnlockToast] = useState<string | null>(null);

  // Active viewing zone (defaults to highest unlocked zone)
  const [activeZoneId, setActiveZoneId] = useState<number>(() => {
    return Math.max(...unlockedZones, 1);
  });

  // When a new zone is unlocked, switch immediately to it
  useEffect(() => {
    const highest = Math.max(...unlockedZones, 1);
    setActiveZoneId(highest);
  }, [unlockedZones]);

  // Find next lockable zone
  const nextLockedZone = ZONES.find((z) => !unlockedZones.includes(z.id));
  const activeZoneData = ZONES.find((z) => z.id === activeZoneId) || ZONES[0];

  const zoneIcons: Record<number, string> = {
    1: '🌱',
    2: '🏖️',
    3: '🌆',
    4: '🌋',
    5: '🌌',
  };

  const zoneShortNames: Record<number, string> = {
    1: 'Поляна',
    2: 'Пляж',
    3: 'Кибер',
    4: 'Лава',
    5: 'Космос',
  };

  const handleUnlockZone = (zoneId: number) => {
    const success = unlockZone(zoneId);
    if (success) {
      setActiveZoneId(zoneId);
      const zone = ZONES.find((z) => z.id === zoneId);
      setUnlockToast(`🎉 Локация «${zone?.name || ''}» открыта! +5 мест для существ!`);
      setTimeout(() => setUnlockToast(null), 4500);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] flex flex-col justify-between overflow-hidden select-none bg-slate-950">
      {/* TOP HEADER: CREATURE CAPACITY PILL (Leaving top area and Laboratory unblocked) */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-700/80 shadow-lg">
          <span className="text-xs font-black text-slate-200">
            🐾 <span className="hidden sm:inline">Существа: </span>
            <span className="text-amber-400 font-black">{placedCreatures.length}</span>/{maxCreatureCapacity}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            ({unlockedZones.length}/5 зон)
          </span>
          {placedCreatures.length >= maxCreatureCapacity && (
            <span className="text-[10px] bg-red-900/60 text-red-300 font-bold px-1.5 py-0.5 rounded-full border border-red-500/40 animate-pulse">
              {maxCreatureCapacity >= 25 ? 'Максимум 25' : 'Лимит • Открой зону (+5 мест)'}
            </span>
          )}
        </div>
      </div>

      {/* TOP-RIGHT: X2 AD BUTTON & ACTIVE BUFFS/DEBUFFS (Stacks vertically downwards) */}
      <div className="absolute top-3 right-3 z-30 flex flex-col items-end gap-2 pointer-events-none">
        {/* Double Income booster button */}
        <button
          id="territory-double-income-ad-btn"
          onClick={() => {
            soundManager.playClick();
            openAdModal('booster', 'double_income');
          }}
          className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg active:scale-95 transition-all ${
            doubleIncomeTime > 0
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'bg-slate-900/90 hover:bg-slate-850 text-amber-300 border border-amber-500/50 shadow-md animate-pulse'
          }`}
          title={
            doubleIncomeTime > 0
              ? 'x2 Доход активен! Нажми, чтобы продлить за рекламу'
              : 'Посмотри рекламу и удвой доход на 5 минут!'
          }
        >
          <span className="text-sm">⚡</span>
          {doubleIncomeTime > 0 ? (
            <div className="flex items-center gap-1">
              <span className="font-black">x2</span>
              <span className="font-mono text-[11px] font-black">{formatTimerMinSec(doubleIncomeTime)}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <span className="font-black">x2 Доход</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                Реклама
              </span>
            </div>
          )}
        </button>

        {/* ACTIVE BUFFS AND DEBUFFS - Stacking downwards on the right edge */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-none">
          {/* 1. Sleepy Fog Debuff (-30% income, time stacks additively) */}
          {sleepyFogTime > 0 && (
            <div
              id="active-debuff-sleepy-fog"
              className="pointer-events-auto flex items-center gap-2 bg-purple-950/95 border-2 border-purple-500/80 text-purple-200 px-3 py-1.5 rounded-2xl text-xs font-black shadow-[0_4px_16px_rgba(168,85,247,0.4)] animate-in slide-in-from-right duration-300 backdrop-blur-md"
              title="Сонный туман: -30% к заработку! Время суммируется при повторном выпадении."
            >
              <span className="text-base animate-pulse">💤</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-purple-300 font-bold leading-tight">Сонный туман (-30%)</span>
                <span className="font-mono text-xs font-black text-purple-100">{formatTimerMinSec(sleepyFogTime)}</span>
              </div>
            </div>
          )}

          {/* 2. Carnival Buff (x2 event income, time stacks additively) */}
          {eventDoubleIncomeTime > 0 && (
            <div
              id="active-buff-carnival"
              className="pointer-events-auto flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 border border-amber-300 text-slate-950 px-3 py-1.5 rounded-2xl text-xs font-black shadow-[0_4px_16px_rgba(245,158,11,0.45)] animate-in slide-in-from-right duration-300 backdrop-blur-md"
              title="Мемный Карнавал: x2 Доход! Время суммируется при повторном выпадении."
            >
              <span className="text-base animate-bounce">🎪</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-amber-950 font-extrabold leading-tight">Карнавал (x2)</span>
                <span className="font-mono text-xs font-black text-slate-950">{formatTimerMinSec(eventDoubleIncomeTime)}</span>
              </div>
            </div>
          )}

          {/* 3. Fast Spawn Booster */}
          {fastSpawnTime > 0 && (
            <button
              id="territory-booster-fast-spawn"
              onClick={() => {
                soundManager.playClick();
                openAdModal('booster', 'fast_spawn');
              }}
              className="pointer-events-auto flex items-center gap-2 bg-blue-950/90 border border-blue-400/60 text-blue-200 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg animate-in slide-in-from-right duration-300 active:scale-95 transition-transform backdrop-blur-md"
              title="Энергетик спавна (x3 частота). Нажми, чтобы продлить за рекламу"
            >
              <span className="text-base">🧪</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-blue-300 font-bold leading-tight">Спавн x3</span>
                <span className="font-mono text-xs font-black text-blue-100">{formatTimerMinSec(fastSpawnTime)}</span>
              </div>
            </button>
          )}

          {/* 4. Super Lucky Booster */}
          {superLuckyTime > 0 && (
            <button
              id="territory-booster-super-lucky"
              onClick={() => {
                soundManager.playClick();
                openAdModal('booster', 'super_lucky');
              }}
              className="pointer-events-auto flex items-center gap-2 bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-black shadow-lg animate-in slide-in-from-right duration-300 active:scale-95 transition-transform backdrop-blur-md"
              title="Мемная Удача (x2 Редкость). Нажми, чтобы продлить за рекламу"
            >
              <span className="text-base">🍀</span>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-emerald-300 font-bold leading-tight">Удача x2</span>
                <span className="font-mono text-xs font-black text-emerald-100">{formatTimerMinSec(superLuckyTime)}</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 2.5D CUSTOM THEMED ENVIRONMENT PER LOCATION */}
      <div className="relative flex-1 w-full flex overflow-hidden">
        <TerritoryEnvironment
          zoneId={activeZoneId}
          onLabClick={() => {
            soundManager.playClick();
            setActiveTab('lab');
          }}
          tutorialStep={tutorialStep}
        >
          {/* WANDERING CREATURES ON TERRITORY */}
          {placedCreatures.map((placed) => (
            <CreatureSprite
              key={placed.instanceId}
              placed={placed}
              onSelect={(p) => setInspectedCreature(p)}
              onPet={(instanceId) => collectCreatureCoins(instanceId)}
            />
          ))}

          {/* WILD GROUND ITEM PICKUPS (Despawns after 15 seconds) */}
          {groundItems.map((item) => {
            const ing = INGREDIENTS.find((i) => i.id === item.ingredientId);
            if (!ing) return null;

            const elapsedSec = Math.floor((Date.now() - item.spawnTime) / 1000);
            const remainingSec = Math.max(0, 15 - elapsedSec);
            const isUrgent = remainingSec <= 4;

            return (
              <div
                key={item.id}
                id={`ground-item-${item.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  collectGroundItem(item.id);
                }}
                className={`absolute z-10 cursor-pointer select-none transition-all hover:scale-125 active:scale-90 animate-bounce ${
                  isUrgent ? 'animate-pulse scale-105' : ''
                }`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  animationDuration: isUrgent ? '0.6s' : '1.2s',
                }}
              >
                <div className="relative flex flex-col items-center">
                  <span className={`text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] ${isUrgent ? 'animate-wiggle' : ''}`}>
                    {ing.emoji}
                  </span>
                  <span
                    className={`border font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md -mt-1 flex items-center gap-0.5 transition-colors ${
                      isUrgent
                        ? 'bg-rose-950/95 border-rose-500 text-rose-300 animate-pulse'
                        : 'bg-slate-900/90 border-slate-700 text-white'
                    }`}
                  >
                    {isUrgent ? `⏳ ${remainingSec}с` : 'Собрать'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* EMPTY STATE HELPER IF NO CREATURES YET */}
          {placedCreatures.length === 0 && tutorialStep > 0 && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-3 rounded-2xl max-w-xs shadow-xl pointer-events-none z-20">
              <p className="text-xs font-black text-amber-300">Твоя полянка пока пуста!</p>
              <p className="text-[11px] text-slate-300 mt-1">
                Зайди в Лабораторию 🧬, скрести ингредиенты и нажми «Разместить»!
              </p>
            </div>
          )}

          {/* UNLOCK CELEBRATION TOAST */}
          {unlockToast && (
            <div className="absolute top-16 inset-x-4 z-40 flex justify-center pointer-events-none animate-bounce">
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-2">
                <span>{unlockToast}</span>
              </div>
            </div>
          )}

          {/* BOTTOM CONTROLS: LOCATION LIST DIRECTLY ABOVE NEXT LOCKED ZONE BANNER */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex flex-col gap-2 pointer-events-none max-w-xl mx-auto">
            {/* Location Selector Grid - strictly no scroll, fits all screens */}
            <div className="pointer-events-auto grid grid-cols-5 w-full gap-1 bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-700/80 shadow-xl">
              {ZONES.map((zone) => {
                const isUnlocked = unlockedZones.includes(zone.id);
                const isActive = activeZoneId === zone.id;

                return (
                  <button
                    key={zone.id}
                    onClick={() => {
                      if (isUnlocked) {
                        soundManager.playClick();
                        setActiveZoneId(zone.id);
                      }
                    }}
                    disabled={!isUnlocked}
                    title={isUnlocked ? `${zone.name} (+5 мест)` : `${zone.name} (+5 мест для существ, с ${zone.requiredLevel} ур.)`}
                    className={`relative py-1.5 px-1 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95 min-w-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                        : isUnlocked
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-slate-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="shrink-0 text-xs sm:text-sm">{zoneIcons[zone.id] || '📍'}</span>
                    <span className="truncate hidden md:inline">{zone.name}</span>
                    <span className="truncate md:hidden">{zoneShortNames[zone.id] || zone.name}</span>
                    {!isUnlocked && <Lock className="w-2.5 h-2.5 shrink-0 ml-0.5 opacity-70" />}
                  </button>
                );
              })}
            </div>

            {/* LOCKED ZONE UNLOCK NOTICE BANNER */}
            {nextLockedZone && (
              <div className="pointer-events-auto flex items-center justify-between bg-slate-900/95 backdrop-blur-md border border-amber-500/40 px-3.5 py-2 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm border border-amber-500/30 shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-white truncate">
                      {nextLockedZone.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-amber-300 font-bold truncate flex items-center gap-1">
                      <span>+{nextLockedZone.maxCreatures} мест для существ</span>
                      <span className="text-slate-400 font-normal">(с {nextLockedZone.requiredLevel} ур.)</span>
                    </span>
                  </div>
                </div>

                <button
                  id={`unlock-zone-btn-${nextLockedZone.id}`}
                  onClick={() => handleUnlockZone(nextLockedZone.id)}
                  disabled={coins < nextLockedZone.price || level < nextLockedZone.requiredLevel}
                  className={`shrink-0 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 transition-all active:scale-95 shadow ${
                    coins >= nextLockedZone.price && level >= nextLockedZone.requiredLevel
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <span>Открыть:</span>
                  <span>🪙 {nextLockedZone.price.toLocaleString()}</span>
                </button>
              </div>
            )}
          </div>
        </TerritoryEnvironment>
      </div>

      {/* INSPECTED CREATURE MODAL */}
      {inspectedCreature && (
        <CreatureModal
          placed={inspectedCreature}
          coins={coins}
          onClose={() => setInspectedCreature(null)}
          onUpgrade={(id) => upgradeCreature(id)}
          onRecall={(id) => recallCreature(id)}
        />
      )}
    </div>
  );
};
