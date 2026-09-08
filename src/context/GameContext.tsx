import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  BOOSTERS,
  calculateCreatureIncome,
  calculateUpgradeCost,
  computeMixResult,
  CREATURES,
  DAILY_REWARDS,
  DEFAULT_CONFIG,
  getXpForNextLevel,
  INGREDIENTS,
  MYSTERY_BOXES,
  pickWheelWinnerSector,
  QUESTS,
  WHEEL_SECTORS,
  ZONES,
} from '../data/gameData';
import {
  AdModalConfig,
  BackpackCreature,
  Creature,
  GameConfig,
  GroundItem,
  Ingredient,
  PlacedCreature,
  PlayerSaveData,
  Quest,
  RandomEventData,
  Rarity,
  WheelSector,
} from '../types/game';
import { analytics } from '../utils/analytics';
import { soundManager } from '../utils/audio';
import { triggerRandomGameEvent } from '../data/randomEvents';
import { GAME_CONFIG } from '../config/gameConfig';
import { yandexSdk } from '../utils/yandexSdk';

const STORAGE_KEY = 'meme_lab_save_v1';
const MAX_COINS = 1_000_000_000_000;
const MAX_XP = 1_000_000_000;
const MAX_LEVEL = 500;
const MAX_INVENTORY_COUNT = 999_999;
const MAX_BACKPACK_CREATURES = 500;
const MAX_ACTIVE_BOOSTER_MS = 24 * 60 * 60 * 1000;

const STARTER_INVENTORY: Record<string, number> = {
  banana: 1,
  cat: 1,
};

const isAdminToolsEnabled = () => Boolean(GAME_CONFIG.features.enableAdminPanel);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const clampInt = (value: unknown, min: number, max: number, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
};

const clampCoins = (value: unknown): number => clampInt(value, 0, MAX_COINS, 0);

const makeInstanceId = (prefix: string): string => {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Date.now() + '_' + Math.random().toString(36).slice(2, 10);
  return prefix + '_' + random;
};

const knownIngredientIds = new Set(INGREDIENTS.map((item) => item.id));
const knownCreatureIds = new Set(CREATURES.map((item) => item.id));
const knownZoneIds = new Set(ZONES.map((item) => item.id));
const knownQuestIds = new Set(QUESTS.map((item) => item.id));
const knownBoosterIds = new Set(BOOSTERS.map((item) => item.id));

const normalizeIdList = (value: unknown, allowed: Set<string>): string[] => {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((id): id is string => {
    if (typeof id !== 'string' || !allowed.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const sanitizeInventory = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return { ...STARTER_INVENTORY };

  const next: Record<string, number> = {};
  Object.entries(value).forEach(([id, count]) => {
    if (!knownIngredientIds.has(id)) return;
    const safeCount = clampInt(count, 0, MAX_INVENTORY_COUNT, 0);
    if (safeCount > 0) next[id] = safeCount;
  });

  return Object.keys(next).length > 0 ? next : { ...STARTER_INVENTORY };
};

const sanitizePlacedCreatures = (value: unknown, capacity: number): PlacedCreature[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  return value
    .filter(isRecord)
    .map((item, index): PlacedCreature | null => {
      const creatureId = typeof item.creatureId === 'string' ? item.creatureId : '';
      const creature = CREATURES.find((c) => c.id === creatureId);
      if (!creature || !knownCreatureIds.has(creatureId)) return null;

      const rawInstanceId = typeof item.instanceId === 'string' ? item.instanceId.slice(0, 100) : '';
      const instanceId = rawInstanceId && !seen.has(rawInstanceId) ? rawInstanceId : makeInstanceId('placed_recovered_' + index);
      seen.add(instanceId);

      return {
        instanceId,
        creatureId,
        level: clampInt(item.level, 1, creature.maxLevel, 1),
        x: clampInt(item.x, 0, 100, 50),
        y: clampInt(item.y, 0, 100, 50),
        direction: item.direction === 'left' || item.direction === 'right' ? item.direction : 'right',
        currentAction:
          item.currentAction === 'walk' || item.currentAction === 'sleep' || item.currentAction === 'dance'
            ? item.currentAction
            : 'idle',
        placedAt: clampInt(item.placedAt, 0, Date.now(), Date.now()),
        lastCollectAt: clampInt(item.lastCollectAt, 0, Date.now(), Date.now()),
      };
    })
    .filter((item): item is PlacedCreature => item !== null)
    .slice(0, Math.max(0, capacity));
};

const sanitizeBackpackCreatures = (value: unknown): BackpackCreature[] => {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  return value
    .filter(isRecord)
    .map((item, index): BackpackCreature | null => {
      const creatureId = typeof item.creatureId === 'string' ? item.creatureId : '';
      const creature = CREATURES.find((c) => c.id === creatureId);
      if (!creature || !knownCreatureIds.has(creatureId)) return null;

      const rawInstanceId = typeof item.instanceId === 'string' ? item.instanceId.slice(0, 100) : '';
      const instanceId = rawInstanceId && !seen.has(rawInstanceId) ? rawInstanceId : makeInstanceId('backpack_recovered_' + index);
      seen.add(instanceId);

      return {
        instanceId,
        creatureId,
        level: clampInt(item.level, 1, creature.maxLevel, 1),
        obtainedAt: clampInt(item.obtainedAt, 0, Date.now(), Date.now()),
      };
    })
    .filter((item): item is BackpackCreature => item !== null)
    .slice(0, MAX_BACKPACK_CREATURES);
};

const sanitizeNumberRecord = (value: unknown, allowed: Set<string>, max: number): Record<string, number> => {
  if (!isRecord(value)) return {};

  const next: Record<string, number> = {};
  Object.entries(value).forEach(([id, amount]) => {
    if (!allowed.has(id)) return;
    const safeAmount = clampInt(amount, 0, max, 0);
    if (safeAmount > 0) next[id] = safeAmount;
  });
  return next;
};

const sanitizeActiveBoosters = (value: unknown): Record<string, number> => {
  if (!isRecord(value)) return {};

  const now = Date.now();
  const next: Record<string, number> = {};
  Object.entries(value).forEach(([id, expiry]) => {
    if (!knownBoosterIds.has(id) && id !== 'event_double_income' && id !== 'sleepy_fog') return;
    const safeExpiry = clampInt(expiry, now, now + MAX_ACTIVE_BOOSTER_MS, 0);
    if (safeExpiry > now) next[id] = safeExpiry;
  });
  return next;
};

const sanitizeSaveData = (value: unknown): PlayerSaveData => {
  const raw = isRecord(value) ? value : {};
  const unlockedZones = Array.isArray(raw.unlockedZones)
    ? [...new Set(raw.unlockedZones.map((id) => clampInt(id, 1, Number.MAX_SAFE_INTEGER, 1)).filter((id) => knownZoneIds.has(id)))]
    : [1];
  if (!unlockedZones.includes(1)) unlockedZones.unshift(1);

  const capacity = unlockedZones.reduce((acc, zId) => acc + (ZONES.find((zone) => zone.id === zId)?.maxCreatures || 0), 0);
  const placedCreatures = sanitizePlacedCreatures(raw.placedCreatures, capacity);
  const backpackCreatures = sanitizeBackpackCreatures(raw.backpackCreatures);
  const discoveredCreatures = normalizeIdList(raw.discoveredCreatures, knownCreatureIds);
  [...placedCreatures, ...backpackCreatures].forEach((item) => {
    if (!discoveredCreatures.includes(item.creatureId)) discoveredCreatures.push(item.creatureId);
  });

  const settings = isRecord(raw.settings) ? raw.settings : {};
  const lastDailyClaimDate =
    typeof raw.lastDailyClaimDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.lastDailyClaimDate)
      ? raw.lastDailyClaimDate
      : '';

  return {
    version: '1.0',
    coins: clampInt(raw.coins, 0, MAX_COINS, GAME_CONFIG.economy.starterCoins),
    xp: clampInt(raw.xp, 0, MAX_XP, 0),
    level: clampInt(raw.level, 1, MAX_LEVEL, 1),
    inventory: sanitizeInventory(raw.inventory),
    placedCreatures,
    backpackCreatures,
    discoveredCreatures,
    unlockedZones,
    completedQuests: normalizeIdList(raw.completedQuests, knownQuestIds),
    questProgress: sanitizeNumberRecord(raw.questProgress, knownQuestIds, MAX_INVENTORY_COUNT),
    dailyStreak: clampInt(raw.dailyStreak, 0, 7, 0),
    lastDailyClaimDate,
    wheelSpinsCount: clampInt(raw.wheelSpinsCount, 0, 9999, 0),
    lastWheelSpinTimestamp: clampInt(raw.lastWheelSpinTimestamp, 0, Date.now(), 0),
    lastWheelAdSpinTimestamp: clampInt(raw.lastWheelAdSpinTimestamp, 0, Date.now(), 0),
    lastAdRewardTimestamp: clampInt(raw.lastAdRewardTimestamp, 0, Date.now(), 0),
    purchasedPerks: normalizeIdList(raw.purchasedPerks, knownBoosterIds).filter((id) => BOOSTERS.find((b) => b.id === id)?.type === 'permanent'),
    activeBoosters: sanitizeActiveBoosters(raw.activeBoosters),
    lastActiveTimestamp: clampInt(
      raw.lastActiveTimestamp,
      Date.now() - GAME_CONFIG.economy.offlineMaxHours * 3600 * 1000,
      Date.now(),
      Date.now(),
    ),
    tutorialStep: clampInt(raw.tutorialStep, 0, 3, 0),
    settings: {
      soundEnabled: typeof settings.soundEnabled === 'boolean' ? settings.soundEnabled : GAME_CONFIG.audio.defaultSoundEnabled,
      musicEnabled: typeof settings.musicEnabled === 'boolean' ? settings.musicEnabled : GAME_CONFIG.audio.defaultMusicEnabled,
      volume: clampInt(settings.volume, 0, 100, GAME_CONFIG.audio.defaultVolume),
    },
  };
};


interface GameContextType {
  // Player state
  coins: number;
  xp: number;
  level: number;
  xpForNextLevel: number;
  inventory: Record<string, number>;
  placedCreatures: PlacedCreature[];
  backpackCreatures: BackpackCreature[];
  discoveredCreatures: string[];
  unlockedZones: number[];
  completedQuests: string[];
  questProgress: Record<string, number>;
  dailyStreak: number;
  lastDailyClaimDate: string;

  // Boosters & Passive Perks
  purchasedPerks: string[];
  activeBoosters: Record<string, number>;
  buyBooster: (boosterId: string) => boolean;
  isPerkPurchased: (perkId: string) => boolean;
  getBoosterTimeRemaining: (boosterId: string) => number;
  tutorialStep: number;
  config: GameConfig;

  // Sound settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (val: number) => void;

  // Dynamic values
  totalIncomePerSec: number;
  maxCreatureCapacity: number;
  groundItems: GroundItem[];

  // Offline earnings
  offlineEarnedCoins: number;
  offlineElapsedMinutes: number;
  claimOfflineEarnings: () => void;

  // Actions
  mixIngredients: (idA: string, idB: string) => { success: boolean; creature?: Creature; isNew?: boolean; isMutation?: boolean; message?: string };
  placeCreature: (creatureId: string, level?: number) => boolean;
  addCreatureToBackpack: (creatureId: string, level?: number) => BackpackCreature | null;
  placeCreatureFromBackpack: (instanceId: string) => boolean;
  recallCreature: (instanceId: string) => void;
  upgradeCreature: (instanceId: string) => boolean;
  collectCreatureCoins: (instanceId: string) => number;
  collectGroundItem: (itemId: string) => void;
  buyIngredient: (ingredientId: string, count?: number) => boolean;
  openBox: (boxId: string) => { items: { ingredient: Ingredient; count: number }[]; bonusCoins: number } | null;
  unlockZone: (zoneId: number) => boolean;
  claimDailyReward: () => boolean;
  claimQuestReward: (questId: string) => boolean;
  getQuestCurrentProgress: (quest: Quest) => number;
  claimableQuestsCount: number;
  advanceTutorial: (step: number) => void;

  // 24-Hour Meme Wheel of Fortune & Accumulated Spins System
  wheelSpinsCount: number;
  lastWheelSpinTimestamp: number;
  lastWheelAdSpinTimestamp: number;
  isWheelOpen: boolean;
  setIsWheelOpen: (open: boolean) => void;
  canClaimDailyWheelSpin: boolean;
  canClaimAdWheelSpin: boolean;
  canSpinWheel: boolean; // Alias for canClaimDailyWheelSpin / has spins
  canSpinWheelAd: boolean; // Alias for canClaimAdWheelSpin
  canSpinWheelNow: boolean; // true if wheelSpinsCount > 0
  getWheelCooldownRemaining: () => number;
  getWheelAdCooldownRemaining: () => number;
  claimDailyWheelSpin: () => boolean;
  claimAdWheelSpin: () => boolean;
  spinWheel: () => { sector: WheelSector; success: boolean; message?: string };
  claimWheelReward: (sector: WheelSector) => void;
  devAddWheelSpins: (count?: number) => void;

  // 3-Hour Ad Reward (1000 coins) & Ad Boosters
  lastAdRewardTimestamp: number;
  adModalConfig: AdModalConfig | null;
  openAdModal: (rewardType: 'coins' | 'booster', boosterId?: string) => void;
  closeAdModal: () => void;
  claimAdReward: (rewardType?: 'coins' | 'booster', boosterId?: string) => boolean;
  activateBoosterByAd: (boosterId: string) => boolean;
  getAdCooldownRemaining: () => number;
  isAdRewardOpen: boolean;
  setIsAdRewardOpen: (open: boolean) => void;

  // Welcome modal & pause system
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;
  isGamePaused: boolean;
  startGame: () => void;

  // Active view navigation
  activeTab: 'home' | 'lab' | 'inventory' | 'memedex' | 'shop';
  setActiveTab: (tab: 'home' | 'lab' | 'inventory' | 'memedex' | 'shop') => void;

  // Active modals
  inspectedCreature: PlacedCreature | null;
  setInspectedCreature: (c: PlacedCreature | null) => void;
  isDailyRewardOpen: boolean;
  setIsDailyRewardOpen: (open: boolean) => void;
  isQuestsOpen: boolean;
  setIsQuestsOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Random Events (Положительные и отрицательные события)
  currentRandomEvent: RandomEventData | null;
  dismissRandomEvent: () => void;
  triggerRandomEvent: (forcedType?: 'positive' | 'negative') => void;

  // Dev tools
  devAddCoins: (amount: number) => void;
  devAddLevel: (levelsToAdd: number) => void;
  devSetLevel: (targetLevel: number) => void;
  devAddXp: (amount: number) => void;
  devUpgradeAllPlacedCreatures: () => void;
  devGiveAllIngredients: () => void;
  devUnlockAllZones: () => void;
  devResetWheelCooldown: () => void;
  devResetProgress: () => void;
  updateConfig: (newConfig: Partial<GameConfig>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<number>(GAME_CONFIG.economy.starterCoins);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [inventory, setInventory] = useState<Record<string, number>>({ ...STARTER_INVENTORY });
  const [placedCreatures, setPlacedCreatures] = useState<PlacedCreature[]>([]);
  const [backpackCreatures, setBackpackCreatures] = useState<BackpackCreature[]>([]);
  const [discoveredCreatures, setDiscoveredCreatures] = useState<string[]>([]);
  const [unlockedZones, setUnlockedZones] = useState<number[]>([1]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [questProgress, setQuestProgress] = useState<Record<string, number>>({});
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [lastDailyClaimDate, setLastDailyClaimDate] = useState<string>('');
  const [wheelSpinsCount, setWheelSpinsCount] = useState<number>(0);
  const [lastWheelSpinTimestamp, setLastWheelSpinTimestamp] = useState<number>(0);
  const [lastWheelAdSpinTimestamp, setLastWheelAdSpinTimestamp] = useState<number>(0);
  const [lastAdRewardTimestamp, setLastAdRewardTimestamp] = useState<number>(0);
  const [purchasedPerks, setPurchasedPerks] = useState<string[]>([]);
  const [activeBoosters, setActiveBoosters] = useState<Record<string, number>>({});
  const [adModalConfig, setAdModalConfig] = useState<AdModalConfig | null>(null);
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);

  const openAdModal = (rewardType: 'coins' | 'booster', boosterId?: string) => {
    if (rewardType === 'booster') {
      const booster = BOOSTERS.find((b) => b.id === boosterId);
      if (!booster || booster.type !== 'active_timer') return;
    }
    setAdModalConfig({ isOpen: true, rewardType, boosterId });
  };

  const closeAdModal = () => {
    setAdModalConfig(null);
  };

  const isAdRewardOpen = !!adModalConfig?.isOpen;
  const setIsAdRewardOpen = (open: boolean) => {
    if (open) {
      setAdModalConfig({ isOpen: true, rewardType: 'coins' });
    } else {
      setAdModalConfig(null);
    }
  };
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(GAME_CONFIG.audio.defaultSoundEnabled);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(GAME_CONFIG.audio.defaultMusicEnabled);
  const [volume, setVolumeState] = useState<number>(GAME_CONFIG.audio.defaultVolume);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'lab' | 'inventory' | 'memedex' | 'shop'>('home');
  const [inspectedCreature, setInspectedCreature] = useState<PlacedCreature | null>(null);
  const [isDailyRewardOpen, setIsDailyRewardOpen] = useState<boolean>(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentRandomEvent, setCurrentRandomEvent] = useState<RandomEventData | null>(null);

  // Welcome / Onboarding modal (Game starts in paused state until player starts playing)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);

  // Offline earnings modal
  const [offlineEarnedCoins, setOfflineEarnedCoins] = useState<number>(0);
  const [offlineElapsedMinutes, setOfflineElapsedMinutes] = useState<number>(0);

  // Dynamic pause state: whenever the player is not on the home meadow or any modal/dialog is open, the game is paused
  const isGamePaused = useMemo(() => {
    return (
      isWelcomeOpen ||
      activeTab !== 'home' ||
      isWheelOpen ||
      isDailyRewardOpen ||
      isQuestsOpen ||
      isSettingsOpen ||
      isAdRewardOpen ||
      currentRandomEvent !== null ||
      offlineEarnedCoins > 0 ||
      inspectedCreature !== null
    );
  }, [
    isWelcomeOpen,
    activeTab,
    isWheelOpen,
    isDailyRewardOpen,
    isQuestsOpen,
    isSettingsOpen,
    isAdRewardOpen,
    currentRandomEvent,
    offlineEarnedCoins,
    inspectedCreature,
  ]);

  const startGame = useCallback(() => {
    setIsWelcomeOpen(false);
    soundManager.playPop();
    soundManager.playNewMemeFanfare(false);
  }, []);

  // Ground items on territory
  const [groundItems, setGroundItems] = useState<GroundItem[]>([]);

  // Refs for loop
  const isLoadedRef = useRef<boolean>(false);

  // Initialize Yandex SDK and load from Cloud / Local storage
  useEffect(() => {
    let isCancelled = false;

    const initAndLoad = async () => {
      try {
        // 1. Initialize Yandex SDK
        await yandexSdk.init();

        // 2. Load save data from Yandex Cloud (with fallback to localStorage)
        const rawSave = await yandexSdk.loadData(STORAGE_KEY);

        if (isCancelled) return;

        if (rawSave) {
          const saved = sanitizeSaveData(rawSave);
          setCoins(saved.coins);
          setXp(saved.xp);
          setLevel(saved.level);
          setInventory(saved.inventory);
          setPlacedCreatures(saved.placedCreatures);
          setBackpackCreatures(saved.backpackCreatures || []);
          setDiscoveredCreatures(saved.discoveredCreatures);
          setUnlockedZones(saved.unlockedZones);
          setCompletedQuests(saved.completedQuests);
          setQuestProgress(saved.questProgress);
          setDailyStreak(saved.dailyStreak);
          setLastDailyClaimDate(saved.lastDailyClaimDate);
          setWheelSpinsCount(saved.wheelSpinsCount || 0);
          setLastWheelSpinTimestamp(saved.lastWheelSpinTimestamp || 0);
          setLastWheelAdSpinTimestamp(saved.lastWheelAdSpinTimestamp || 0);
          setLastAdRewardTimestamp(saved.lastAdRewardTimestamp || 0);
          setPurchasedPerks(saved.purchasedPerks || []);
          setActiveBoosters(saved.activeBoosters || {});
          setTutorialStep(saved.tutorialStep);
          setSoundEnabled(saved.settings.soundEnabled);
          setMusicEnabled(saved.settings.musicEnabled);
          setVolumeState(saved.settings.volume || GAME_CONFIG.audio.defaultVolume);
          soundManager.setSoundEnabled(saved.settings.soundEnabled);
          soundManager.setMusicEnabled(saved.settings.musicEnabled);
          soundManager.setVolume(saved.settings.volume || GAME_CONFIG.audio.defaultVolume);

          if (saved.lastActiveTimestamp && saved.placedCreatures.length > 0) {
            const now = Date.now();
            const elapsedSec = Math.max(0, Math.floor((now - saved.lastActiveTimestamp) / 1000));
            if (elapsedSec > 15) {
              const rate = saved.placedCreatures.reduce((sum, pc) => {
                const cr = CREATURES.find((c) => c.id === pc.creatureId);
                return cr ? sum + calculateCreatureIncome(cr, pc.level) : sum;
              }, 0);
              const cappedSec = Math.min(elapsedSec, (config.offlineMaxHours || GAME_CONFIG.economy.offlineMaxHours) * 3600);
              const earned = clampCoins(Math.floor(rate * cappedSec));
              if (earned > 0) {
                setOfflineEarnedCoins(earned);
                setOfflineElapsedMinutes(Math.floor(cappedSec / 60));
              }
            }
          }
        } else {
          analytics.track('tutorial_start', { step: 0 });
        }
      } catch (e) {
        console.error('Failed to load save from Yandex / Storage:', e);
      } finally {
        if (!isCancelled) {
          isLoadedRef.current = true;
        }
      }
    };

    initAndLoad();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Save to storage (LocalStorage & Yandex Cloud Save)
  useEffect(() => {
    if (!isLoadedRef.current || !GAME_CONFIG.features.enableAutoSave) return;
    try {
      const saveData = sanitizeSaveData({
        version: '1.0',
        coins,
        xp,
        level,
        inventory,
        placedCreatures,
        backpackCreatures,
        discoveredCreatures,
        unlockedZones,
        completedQuests,
        questProgress,
        dailyStreak,
        lastDailyClaimDate,
        wheelSpinsCount,
        lastWheelSpinTimestamp,
        lastWheelAdSpinTimestamp,
        lastAdRewardTimestamp,
        purchasedPerks,
        activeBoosters,
        lastActiveTimestamp: Date.now(),
        tutorialStep,
        settings: {
          soundEnabled,
          musicEnabled,
          volume,
        },
      });

      // Saves to both localStorage and player.setData(..., true)
      yandexSdk.saveData(STORAGE_KEY, saveData as unknown as Record<string, unknown>);
    } catch (e) {
      console.error('Save failed:', e);
    }
  }, [

    coins,
    xp,
    level,
    inventory,
    placedCreatures,
    backpackCreatures,
    discoveredCreatures,
    unlockedZones,
    completedQuests,
    questProgress,
    dailyStreak,
    lastDailyClaimDate,
    wheelSpinsCount,
    lastWheelSpinTimestamp,
    lastWheelAdSpinTimestamp,
    lastAdRewardTimestamp,
    purchasedPerks,
    activeBoosters,
    tutorialStep,
    soundEnabled,
    musicEnabled,
    volume,
  ]);

  // Capacity calculation
  const maxCreatureCapacity = useMemo(() => {
    return unlockedZones.reduce((acc, zId) => {
      const z = ZONES.find((zone) => zone.id === zId);
      return acc + (z ? z.maxCreatures : 0);
    }, 0);
  }, [unlockedZones]);

  // Total income per second with booster multipliers
  const totalIncomePerSec = useMemo(() => {
    const base = placedCreatures.reduce((sum, pc) => {
      const creature = CREATURES.find((c) => c.id === pc.creatureId);
      if (!creature) return sum;
      return sum + calculateCreatureIncome(creature, pc.level);
    }, 0);

    let mult = 1;
    // x2 Active Booster
    if (activeBoosters['double_income'] && activeBoosters['double_income'] > Date.now()) {
      mult *= 2;
    }
    // x2 Event Carnival Booster (2 min event buff)
    if (activeBoosters['event_double_income'] && activeBoosters['event_double_income'] > Date.now()) {
      mult *= 2;
    }
    // -30% Event Sleepy Fog (debuff)
    if (activeBoosters['sleepy_fog'] && activeBoosters['sleepy_fog'] > Date.now()) {
      mult *= 0.7;
    }
    // +25% Permanent Coin Magnet perk
    if (purchasedPerks.includes('coin_magnet')) {
      mult *= 1.25;
    }

    return clampCoins(Math.round(base * mult));
  }, [placedCreatures, activeBoosters, purchasedPerks]);

  // Passive income ticker (1 second tick) - paused when isGamePaused is true
  useEffect(() => {
    if (isGamePaused || totalIncomePerSec <= 0) return;
    const interval = setInterval(() => {
      setCoins((prev) => clampCoins(prev + totalIncomePerSec));
    }, 1000);
    return () => clearInterval(interval);
  }, [isGamePaused, totalIncomePerSec]);

  // Auto-collector Drone: automatically vacuums any ground items when perk is active!
  useEffect(() => {
    if (isGamePaused || !purchasedPerks.includes('auto_collector') || groundItems.length === 0) return;
    const timer = setTimeout(() => {
      groundItems.forEach((item) => {
        collectGroundItem(item.id);
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [isGamePaused, groundItems, purchasedPerks]);

  // Immediate initial ground item spawn if empty so the map is never desolate
  useEffect(() => {
    if (isGamePaused) return;
    setGroundItems((prev) => {
      if (prev.length > 0) return prev;
      const availableIngredients = ['banana', 'apple', 'strawberry', 'cat', 'dog', 'orange', 'watermelon', 'coffee'];
      const now = Date.now();
      return [
        {
          id: `item_${now}_1`,
          ingredientId: availableIngredients[Math.floor(Math.random() * availableIngredients.length)],
          x: Math.floor(20 + Math.random() * 60),
          y: Math.floor(32 + Math.random() * 44),
          spawnTime: now,
        },
        {
          id: `item_${now}_2`,
          ingredientId: availableIngredients[Math.floor(Math.random() * availableIngredients.length)],
          x: Math.floor(20 + Math.random() * 60),
          y: Math.floor(32 + Math.random() * 44),
          spawnTime: now - 3000,
        },
      ];
    });
  }, [isGamePaused]);

  // Map pickup spawner (8s regular, 4s with fast_spawn booster)
  useEffect(() => {
    if (isGamePaused) return;
    const isFast = activeBoosters['fast_spawn'] && activeBoosters['fast_spawn'] > Date.now();
    const intervalSec = isFast ? 4 : 8;

    const spawnTimer = setInterval(() => {
      setGroundItems((prev) => {
        if (prev.length >= 6) return prev;
        const availableIngredients = ['banana', 'apple', 'strawberry', 'cat', 'dog', 'orange', 'watermelon', 'coffee'];
        const chosen = availableIngredients[Math.floor(Math.random() * availableIngredients.length)];
        const newItem: GroundItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          ingredientId: chosen,
          x: Math.floor(18 + Math.random() * 64),
          y: Math.floor(32 + Math.random() * 44),
          spawnTime: Date.now(),
        };
        return [...prev, newItem];
      });
    }, intervalSec * 1000);

    return () => clearInterval(spawnTimer);
  }, [isGamePaused, activeBoosters]);

  // 15-second ground item despawn timer (items disappear after 15 seconds)
  useEffect(() => {
    if (isGamePaused) return;
    const despawnInterval = setInterval(() => {
      const now = Date.now();
      setGroundItems((prev) => {
        const remaining = prev.filter((item) => now - item.spawnTime < 15000);
        if (remaining.length === prev.length) return prev;
        return remaining;
      });
    }, 500);

    return () => clearInterval(despawnInterval);
  }, [isGamePaused]);

  // XP & Level calculations
  const xpForNextLevel = useMemo(() => getXpForNextLevel(level), [level]);

  const addXp = (amount: number) => {
    const safeAmount = clampInt(amount, 0, MAX_XP, 0);
    if (safeAmount <= 0) return;

    setXp((prevXp) => {
      let currentXp = clampInt(prevXp + safeAmount, 0, MAX_XP, 0);
      let curLevel = level;
      let needed = getXpForNextLevel(curLevel);

      while (currentXp >= needed && curLevel < MAX_LEVEL) {
        currentXp -= needed;
        curLevel += 1;
        needed = getXpForNextLevel(curLevel);
        setLevel(curLevel);
        soundManager.playNewMemeFanfare(true);
        analytics.track('level_up', { level: curLevel });
      }
      return clampInt(currentXp, 0, MAX_XP, 0);
    });
  };

  const updateQuestCounter = (type: Quest['type'], incrementBy = 1) => {
    const safeIncrement = clampInt(incrementBy, 0, MAX_INVENTORY_COUNT, 0);
    if (safeIncrement <= 0) return;
    QUESTS.forEach((q) => {
      if (q.type === type && !completedQuests.includes(q.id)) {
        setQuestProgress((prev) => ({
          ...prev,
          [q.id]: clampInt((prev[q.id] || 0) + safeIncrement, 0, MAX_INVENTORY_COUNT, 0),
        }));
      }
    });
  };

  const getQuestCurrentProgress = (quest: Quest): number => {
    switch (quest.type) {
      case 'creature_count':
        return discoveredCreatures.length;
      case 'placed_count':
        return placedCreatures.length;
      case 'zone_count':
        return unlockedZones.length;
      case 'reach_level':
        return level;
      case 'earn_coins':
        return Math.max(coins, questProgress[quest.id] || 0);
      case 'upgrade_level': {
        const maxLevel = placedCreatures.length > 0 ? Math.max(...placedCreatures.map((p) => p.level)) : 1;
        return Math.max(maxLevel, questProgress[quest.id] || 0);
      }
      default:
        return questProgress[quest.id] || 0;
    }
  };

  const claimableQuestsCount = useMemo(() => {
    return QUESTS.filter((q) => {
      if (completedQuests.includes(q.id)) return false;
      return getQuestCurrentProgress(q) >= q.target;
    }).length;
  }, [completedQuests, discoveredCreatures.length, placedCreatures, unlockedZones.length, level, coins, questProgress]);

  // Sound toggles & volume
  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    soundManager.setSoundEnabled(newVal);
  };

  const toggleMusic = () => {
    const newVal = !musicEnabled;
    setMusicEnabled(newVal);
    soundManager.setMusicEnabled(newVal);
  };

  const setVolume = (val: number) => {
    const clamped = clampInt(val, 0, 100, GAME_CONFIG.audio.defaultVolume);
    setVolumeState(clamped);
    soundManager.setVolume(clamped);
  };

  // Offline earnings claim
  const claimOfflineEarnings = () => {
    if (offlineEarnedCoins > 0) {
      setCoins((prev) => clampCoins(prev + offlineEarnedCoins));
      soundManager.playCoin();
      analytics.track('offline_income_claimed', { coins: offlineEarnedCoins });
      setOfflineEarnedCoins(0);
      setOfflineElapsedMinutes(0);
    }
  };

  // Mix operation (Server-authoritative check)
  const mixIngredients = (idA: string, idB: string) => {
    const isCreatureA = knownCreatureIds.has(idA);
    const isCreatureB = knownCreatureIds.has(idB);
    const isIngA = knownIngredientIds.has(idA);
    const isIngB = knownIngredientIds.has(idB);

    if ((!isIngA && !isCreatureA) || (!isIngB && !isCreatureB)) {
      return { success: false, message: 'Неизвестный элемент для слияния!' };
    }

    analytics.track('mix_started', { itemA: idA, itemB: idB, isCreatureA, isCreatureB });

    const countA = inventory[idA] || 0;
    const countB = inventory[idB] || 0;

    // Validate creature backpack availability
    const backpackCounts: Record<string, number> = {};
    backpackCreatures.forEach((b) => {
      backpackCounts[b.creatureId] = (backpackCounts[b.creatureId] || 0) + 1;
    });

    if (isCreatureA && isCreatureB) {
      if (idA === idB) {
        if ((backpackCounts[idA] || 0) < 2) {
          return { success: false, message: 'Недостаточно таких существ в рюкзаке для слияния (нужно 2 шт.)!' };
        }
      } else {
        if ((backpackCounts[idA] || 0) < 1 || (backpackCounts[idB] || 0) < 1) {
          return { success: false, message: 'Оба существа для скрещивания должны быть в рюкзаке (не на полянке)!' };
        }
      }
    } else {
      if (isCreatureA && (backpackCounts[idA] || 0) < 1) {
        return { success: false, message: 'Существо должно быть в вашем рюкзаке (заберите его с полянки)!' };
      }
      if (isCreatureB && (backpackCounts[idB] || 0) < 1) {
        return { success: false, message: 'Существо должно быть в вашем рюкзаке (заберите его с полянки)!' };
      }
    }

    // Validate ingredient availability
    if (isIngA && isIngB) {
      if (idA === idB) {
        if (countA < 2) {
          return { success: false, message: 'Недостаточно ингредиентов для слияния!' };
        }
      } else {
        if (countA < 1 || countB < 1) {
          return { success: false, message: 'Недостаточно ингредиентов для слияния!' };
        }
      }
    } else {
      if (isIngA && countA < 1) {
        return { success: false, message: 'Недостаточно ингредиентов для слияния!' };
      }
      if (isIngB && countB < 1) {
        return { success: false, message: 'Недостаточно ингредиентов для слияния!' };
      }
    }

    // Deduct ingredients
    if (isIngA) {
      setInventory((prev) => {
        const next = { ...prev };
        next[idA] = (next[idA] || 1) - 1;
        if (next[idA] <= 0) delete next[idA];
        return next;
      });
    }
    if (isIngB) {
      setInventory((prev) => {
        const next = { ...prev };
        next[idB] = (next[idB] || 1) - 1;
        if (next[idB] <= 0) delete next[idB];
        return next;
      });
    }

    // Deduct creatures from backpack (consumed in fusion!)
    if (isCreatureA || isCreatureB) {
      setBackpackCreatures((prev) => {
        const next = [...prev];
        if (isCreatureA) {
          const idxA = next.findIndex((b) => b.creatureId === idA);
          if (idxA !== -1) {
            next.splice(idxA, 1);
          }
        }
        if (isCreatureB) {
          const idxB = next.findIndex((b) => b.creatureId === idB);
          if (idxB !== -1) {
            next.splice(idxB, 1);
          }
        }
        return next;
      });
    }

    // Check recipe & compute result (exact recipe or smart dynamic mutation)
    const { creature: found, isMutation } = computeMixResult(idA, idB, discoveredCreatures);

    const isNew = !discoveredCreatures.includes(found.id);
    const isSuperLucky = activeBoosters['super_lucky'] && activeBoosters['super_lucky'] > Date.now();
    const luckyMultiplier = isSuperLucky ? 2 : 1;

    if (isNew) {
      setDiscoveredCreatures((prev) => [...prev, found.id]);
      const baseXpReward =
        found.rarity === 'common'
          ? 40
          : found.rarity === 'uncommon'
          ? 85
          : found.rarity === 'rare'
          ? 180
          : found.rarity === 'epic'
          ? 400
          : found.rarity === 'legendary'
          ? 900
          : 2000;
      const xpReward = (purchasedPerks.includes('happy_flask') ? Math.round(baseXpReward * 1.5) : baseXpReward) * luckyMultiplier;
      addXp(xpReward);
      if (isSuperLucky) {
        setCoins((prev) => clampCoins(prev + 300)); // Lucky bonus coins on new discovery
      }
      analytics.track('creature_discovered', { creatureId: found.id, rarity: found.rarity, isMutation });
    } else {
      // Repeat mix gives small consolation XP
      const repeatXp = (purchasedPerks.includes('happy_flask') ? 8 : 5) * luckyMultiplier;
      addXp(repeatXp);
      if (isSuperLucky) {
        setCoins((prev) => clampCoins(prev + 50)); // Lucky bonus coins on repeat
      }
    }

    updateQuestCounter('mix_count', 1);
    updateQuestCounter('creature_count', isNew ? 1 : 0);

    if (tutorialStep === 1) {
      setTutorialStep(2);
    }

    analytics.track('mix_completed', { creatureId: found.id, isNew, isMutation });
    return { success: true, creature: found, isNew, isMutation };
  };

  // Place creature on territory directly (e.g. from Lab or starter)
  const placeCreature = (creatureId: string, level = 1): boolean => {
    const creature = CREATURES.find((c) => c.id === creatureId);
    if (!creature) return false;

    if (placedCreatures.length >= maxCreatureCapacity) {
      soundManager.playPop();
      return false;
    }

    const newPlaced: PlacedCreature = {
      instanceId: makeInstanceId('placed'),
      creatureId,
      level: clampInt(level, 1, creature.maxLevel, 1),
      x: Math.floor(16 + Math.random() * 68),
      y: Math.floor(32 + Math.random() * 46),
      direction: Math.random() > 0.5 ? 'right' : 'left',
      currentAction: 'idle',
      placedAt: Date.now(),
      lastCollectAt: Date.now(),
    };

    setPlacedCreatures((prev) => [...prev, newPlaced]);
    soundManager.playPop();
    analytics.track('creature_placed', { creatureId, instanceId: newPlaced.instanceId });

    if (tutorialStep === 2) {
      setTutorialStep(3);
      analytics.track('tutorial_complete');
    }

    return true;
  };

  // Add creature to backpack (inventory)
  const addCreatureToBackpack = (creatureId: string, level = 1): BackpackCreature | null => {
    const creature = CREATURES.find((c) => c.id === creatureId);
    if (!creature) return null;

    const newItem: BackpackCreature = {
      instanceId: makeInstanceId('backpack'),
      creatureId,
      level: clampInt(level, 1, creature.maxLevel, 1),
      obtainedAt: Date.now(),
    };

    setBackpackCreatures((prev) => [...prev, newItem]);
    soundManager.playPop();
    analytics.track('creature_added_to_backpack', { creatureId, level });
    return newItem;
  };

  // Place creature from backpack onto territory (removes from backpack)
  const placeCreatureFromBackpack = (instanceId: string): boolean => {
    if (placedCreatures.length >= maxCreatureCapacity) {
      soundManager.playPop();
      return false;
    }

    const item = backpackCreatures.find((b) => b.instanceId === instanceId);
    if (!item) return false;
    const creature = CREATURES.find((c) => c.id === item.creatureId);
    if (!creature) return false;

    const newPlaced: PlacedCreature = {
      instanceId: makeInstanceId('placed'),
      creatureId: item.creatureId,
      level: clampInt(item.level, 1, creature.maxLevel, 1),
      x: Math.floor(16 + Math.random() * 68),
      y: Math.floor(32 + Math.random() * 46),
      direction: Math.random() > 0.5 ? 'right' : 'left',
      currentAction: 'idle',
      placedAt: Date.now(),
      lastCollectAt: Date.now(),
    };

    // Remove from backpack
    setBackpackCreatures((prev) => prev.filter((b) => b.instanceId !== instanceId));
    // Add to placed
    setPlacedCreatures((prev) => [...prev, newPlaced]);
    soundManager.playPop();

    if (tutorialStep === 2) {
      setTutorialStep(3);
      analytics.track('tutorial_complete');
    }

    analytics.track('creature_placed_from_backpack', {
      creatureId: item.creatureId,
      level: item.level,
      instanceId: newPlaced.instanceId,
    });
    return true;
  };

  // Recall creature from territory to backpack (removes from territory, adds to backpack)
  const recallCreature = (instanceId: string) => {
    const target = placedCreatures.find((p) => p.instanceId === instanceId);
    if (!target) return;

    const backpackItem: BackpackCreature = {
      instanceId: makeInstanceId('backpack'),
      creatureId: target.creatureId,
      level: target.level,
      obtainedAt: Date.now(),
    };

    // Add to backpack
    setBackpackCreatures((prev) => [...prev, backpackItem]);
    // Remove from placed territory
    setPlacedCreatures((prev) => prev.filter((p) => p.instanceId !== instanceId));
    soundManager.playPop();

    if (inspectedCreature?.instanceId === instanceId) {
      setInspectedCreature(null);
    }

    analytics.track('creature_recalled_to_backpack', {
      creatureId: target.creatureId,
      level: target.level,
    });
  };

  // Upgrade creature level
  const upgradeCreature = (instanceId: string): boolean => {
    const target = placedCreatures.find((p) => p.instanceId === instanceId);
    if (!target) return false;

    const creature = CREATURES.find((c) => c.id === target.creatureId);
    if (!creature) return false;

    if (target.level >= creature.maxLevel) return false;

    const cost = calculateUpgradeCost(creature, target.level);
    if (coins < cost) return false;

    setCoins((prev) => clampCoins(prev - cost));
    setPlacedCreatures((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, level: p.level + 1 } : p)),
    );

    if (inspectedCreature && inspectedCreature.instanceId === instanceId) {
      setInspectedCreature({ ...inspectedCreature, level: inspectedCreature.level + 1 });
    }

    addXp(Math.max(3, Math.floor(cost * 0.03)));
    soundManager.playUpgrade();
    updateQuestCounter('upgrade_count', 1);
    updateQuestCounter('upgrade_level', target.level + 1);
    analytics.track('upgrade', { creatureId: target.creatureId, newLevel: target.level + 1, cost });
    return true;
  };

  // Click on creature to collect immediate petting bonus coins
  const collectCreatureCoins = (instanceId: string): number => {
    const target = placedCreatures.find((p) => p.instanceId === instanceId);
    if (!target) return 0;
    const creature = CREATURES.find((c) => c.id === target.creatureId);
    if (!creature) return 0;

    let bonus = Math.max(1, Math.floor(calculateCreatureIncome(creature, target.level) * 0.25));
    if (purchasedPerks.includes('golden_touch')) {
      bonus *= 5;
    }
    setCoins((prev) => clampCoins(prev + bonus));
    soundManager.playCoin();
    updateQuestCounter('pet_count', 1);
    analytics.track('creature_petted', { creatureId: creature.id, bonus });
    return bonus;
  };

  // Ground item pickup
  const collectGroundItem = (itemId: string) => {
    const item = groundItems.find((i) => i.id === itemId);
    if (!item || !knownIngredientIds.has(item.ingredientId)) return;

    setGroundItems((prev) => prev.filter((i) => i.id !== itemId));
    setInventory((prev) => ({
      ...prev,
      [item.ingredientId]: clampInt((prev[item.ingredientId] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
    }));

    soundManager.playPop();
    updateQuestCounter('pick_map_item', 1);
    analytics.track('ingredient_received', { source: 'ground_pickup', ingredientId: item.ingredientId });
  };

  // Buy ingredient with coins
  const buyIngredient = (ingredientId: string, count = 1): boolean => {
    const ing = INGREDIENTS.find((i) => i.id === ingredientId);
    const safeCount = clampInt(count, 1, 100, 0);
    if (!ing || safeCount <= 0) return false;

    const totalCost = ing.cost * safeCount;
    if (totalCost <= 0 || coins < totalCost) return false;

    setCoins((prev) => clampCoins(prev - totalCost));
    setInventory((prev) => ({
      ...prev,
      [ingredientId]: clampInt((prev[ingredientId] || 0) + safeCount, 0, MAX_INVENTORY_COUNT, 0),
    }));

    soundManager.playCoin();
    analytics.track('ingredient_bought', { ingredientId, count: safeCount, totalCost });
    return true;
  };

  // Open Mystery Box
  const openBox = (boxId: string) => {
    const box = MYSTERY_BOXES.find((b) => b.id === boxId);
    if (!box) return null;

    if (coins < box.cost) return null;
    setCoins((prev) => clampCoins(prev - box.cost));

    // Roll random ingredients matching rarity chances
    const results: { ingredient: Ingredient; count: number }[] = [];
    const chances = box.chances;
    const rollsCount = clampInt(box.guaranteedCount, 1, 20, 1);

    for (let r = 0; r < rollsCount; r++) {
      const rand = Math.random();
      let cumulative = 0;
      let chosenRarity: Rarity = 'common';

      for (const [rarity, chance] of Object.entries(chances)) {
        cumulative += chance || 0;
        if (rand <= cumulative) {
          chosenRarity = rarity as Rarity;
          break;
        }
      }

      // Find matching ingredients
      const pool = INGREDIENTS.filter((i) => i.rarity === chosenRarity);
      const selected = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : INGREDIENTS[0];

      results.push({ ingredient: selected, count: 1 });
      setInventory((prev) => ({
        ...prev,
        [selected.id]: clampInt((prev[selected.id] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
      }));
    }

    const bonusCoins = Math.floor(box.cost * 0.1);
    if (bonusCoins > 0) {
      setCoins((prev) => clampCoins(prev + bonusCoins));
    }

    addXp(Math.floor(box.cost * 0.25));
    updateQuestCounter('open_box', 1);
    analytics.track('box_opened', { boxId, itemsReceived: results.map((r) => r.ingredient.id) });

    return { items: results, bonusCoins };
  };

  // Unlock territory zone
  const unlockZone = (zoneId: number): boolean => {
    const zone = ZONES.find((z) => z.id === zoneId);
    if (!zone) return false;
    if (unlockedZones.includes(zoneId)) return false;
    if (level < zone.requiredLevel || coins < zone.price) return false;

    setCoins((prev) => clampCoins(prev - zone.price));
    setUnlockedZones((prev) => [...prev, zoneId]);
    addXp(500);
    soundManager.playNewMemeFanfare(true);
    analytics.track('zone_unlocked', { zoneId, name: zone.name });
    return true;
  };

  // Claim Daily Reward
  const claimDailyReward = (): boolean => {
    const today = new Date().toISOString().split('T')[0];
    if (lastDailyClaimDate === today) return false;

    const nextStreak = (dailyStreak % 7) + 1;
    const rewardInfo = DAILY_REWARDS[nextStreak - 1];

    if (rewardInfo.reward.coins) {
      setCoins((prev) => clampCoins(prev + rewardInfo.reward.coins));
    }
    if (rewardInfo.reward.xp) {
      addXp(rewardInfo.reward.xp);
    }
    if (rewardInfo.reward.ingredientId) {
      setInventory((prev) => ({
        ...prev,
        [rewardInfo.reward.ingredientId!]: clampInt((prev[rewardInfo.reward.ingredientId!] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
      }));
    }

    setDailyStreak(nextStreak);
    setLastDailyClaimDate(today);
    soundManager.playCoin();
    analytics.track('daily_reward_claimed', { day: nextStreak });
    return true;
  };

  // Claim Quest Reward
  const claimQuestReward = (questId: string): boolean => {
    const q = QUESTS.find((quest) => quest.id === questId);
    if (!q || completedQuests.includes(questId)) return false;

    const progress = getQuestCurrentProgress(q);
    if (progress < q.target) return false;

    setCompletedQuests((prev) => [...prev, questId]);

    if (q.reward.coins) setCoins((prev) => clampCoins(prev + q.reward.coins!));
    if (q.reward.xp) addXp(q.reward.xp!);
    if (q.reward.ingredientId) {
      setInventory((prev) => ({
        ...prev,
        [q.reward.ingredientId!]: clampInt((prev[q.reward.ingredientId!] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
      }));
    }
    if (q.reward.boxId) {
      const box = MYSTERY_BOXES.find((b) => b.id === q.reward.boxId);
      if (box) {
        for (let r = 0; r < box.guaranteedCount; r++) {
          const rand = Math.random();
          let cumulative = 0;
          let chosenRarity: Rarity = 'common';
          for (const [rarity, chance] of Object.entries(box.chances)) {
            cumulative += chance || 0;
            if (rand <= cumulative) {
              chosenRarity = rarity as Rarity;
              break;
            }
          }
          const pool = INGREDIENTS.filter((i) => i.rarity === chosenRarity);
          const selected = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : INGREDIENTS[0];
          setInventory((prev) => ({
            ...prev,
            [selected.id]: clampInt((prev[selected.id] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
          }));
        }
      }
    }

    soundManager.playUpgrade();
    analytics.track('quest_completed', { questId });
    return true;
  };

  const advanceTutorial = (step: number) => {
    setTutorialStep(step);
    if (step >= 3) {
      analytics.track('tutorial_complete');
    }
  };

  // 3-hour Ad Reward (1000 coins)
  const AD_COOLDOWN_SEC = GAME_CONFIG.boosters.adRewardCooldownHours * 3600;

  const getAdCooldownRemaining = () => {
    if (!lastAdRewardTimestamp) return 0;
    const elapsedSec = Math.floor((Date.now() - lastAdRewardTimestamp) / 1000);
    return Math.max(0, AD_COOLDOWN_SEC - elapsedSec);
  };

  const activateBoosterByAd = (boosterId: string): boolean => {
    const booster = BOOSTERS.find((b) => b.id === boosterId);
    if (!booster || booster.type !== 'active_timer') return false;

    const durationMs = clampInt(booster.durationSec, 1, GAME_CONFIG.boosters.activeBoosterDurationSec, GAME_CONFIG.boosters.activeBoosterDurationSec) * 1000;
    setActiveBoosters((prev) => {
      const currentExpiry = prev[boosterId] || 0;
      const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
      return {
        ...prev,
        [boosterId]: clampInt(baseTime + durationMs, Date.now(), Date.now() + MAX_ACTIVE_BOOSTER_MS, Date.now()),
      };
    });

    soundManager.playUpgrade();
    soundManager.playNewMemeFanfare(false);
    updateQuestCounter('ad_watch', 1);
    analytics.track('booster_ad_activated', { boosterId, durationSec: booster.durationSec || 300 });
    return true;
  };

  const claimAdReward = (rewardType: 'coins' | 'booster' = 'coins', boosterId?: string): boolean => {
    if (rewardType === 'booster' && boosterId) {
      return activateBoosterByAd(boosterId);
    }

    const remaining = getAdCooldownRemaining();
    if (remaining > 0) return false;

    const now = Date.now();
    setLastAdRewardTimestamp(now);
    setCoins((prev) => clampCoins(prev + GAME_CONFIG.boosters.adRewardCoins));
    soundManager.playCoin();
    updateQuestCounter('ad_watch', 1);
    analytics.track('ad_reward_claimed', { coins: GAME_CONFIG.boosters.adRewardCoins, timestamp: now });
    return true;
  };

  // Boosters & Passive Perks system
  const isPerkPurchased = (perkId: string): boolean => {
    return purchasedPerks.includes(perkId);
  };

  const getBoosterTimeRemaining = (boosterId: string): number => {
    const expiry = activeBoosters[boosterId];
    if (!expiry) return 0;
    const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
    return remaining;
  };

  const buyBooster = (boosterId: string): boolean => {
    const booster = BOOSTERS.find((b) => b.id === boosterId);
    if (!booster) return false;

    // All active timer boosters are unlocked and activated via watching an ad!
    if (booster.type === 'active_timer') {
      openAdModal('booster', boosterId);
      return true;
    }

    // Permanent perks
    if (level < booster.requiredLevel || coins < booster.cost) return false;
    if (purchasedPerks.includes(boosterId)) return false;

    setCoins((prev) => clampCoins(prev - booster.cost));
    setPurchasedPerks((prev) => [...prev, boosterId]);
    soundManager.playNewMemeFanfare(true);
    analytics.track('booster_purchased', { boosterId, type: 'permanent' });
    return true;
  };

  // 24-Hour Meme Wheel of Fortune methods (Accumulated Spins System)
  const getWheelCooldownRemaining = useCallback(() => {
    if (!lastWheelSpinTimestamp) return 0;
    const cooldownMs = (GAME_CONFIG.wheel?.cooldownHours || 24) * 3600 * 1000;
    const elapsedMs = Date.now() - lastWheelSpinTimestamp;
    return Math.max(0, Math.ceil((cooldownMs - elapsedMs) / 1000));
  }, [lastWheelSpinTimestamp]);

  const canClaimDailyWheelSpin = useMemo(() => {
    return getWheelCooldownRemaining() === 0;
  }, [getWheelCooldownRemaining]);

  const getWheelAdCooldownRemaining = useCallback(() => {
    if (!lastWheelAdSpinTimestamp) return 0;
    const cooldownMs = (GAME_CONFIG.wheel?.cooldownHours || 24) * 3600 * 1000;
    const elapsedMs = Date.now() - lastWheelAdSpinTimestamp;
    return Math.max(0, Math.ceil((cooldownMs - elapsedMs) / 1000));
  }, [lastWheelAdSpinTimestamp]);

  const canClaimAdWheelSpin = useMemo(() => {
    return getWheelAdCooldownRemaining() === 0;
  }, [getWheelAdCooldownRemaining]);

  // Overall indicator: ready if can claim or if has banked spins
  const canSpinWheel = useMemo(() => {
    return canClaimDailyWheelSpin || wheelSpinsCount > 0;
  }, [canClaimDailyWheelSpin, wheelSpinsCount]);

  const canSpinWheelAd = useMemo(() => {
    return canClaimAdWheelSpin;
  }, [canClaimAdWheelSpin]);

  const canSpinWheelNow = useMemo(() => {
    return wheelSpinsCount > 0;
  }, [wheelSpinsCount]);

  // Claim Daily Free Spin (+1 Spin)
  const claimDailyWheelSpin = useCallback((): boolean => {
    if (!canClaimDailyWheelSpin && !isAdminToolsEnabled()) return false;
    const now = Date.now();
    setLastWheelSpinTimestamp(now);
    setWheelSpinsCount((prev) => clampInt(prev + 1, 0, 9999, 0));
    soundManager.playUpgrade();
    soundManager.playNewMemeFanfare(false);
    analytics.track('wheel_daily_spin_claimed', { timestamp: now });
    return true;
  }, [canClaimDailyWheelSpin]);

  // Claim Ad Bonus Spin (+1 Spin)
  const claimAdWheelSpin = useCallback((): boolean => {
    if (!canClaimAdWheelSpin && !isAdminToolsEnabled()) return false;
    const now = Date.now();
    setLastWheelAdSpinTimestamp(now);
    setWheelSpinsCount((prev) => clampInt(prev + 1, 0, 9999, 0));
    updateQuestCounter('ad_watch', 1);
    soundManager.playUpgrade();
    soundManager.playNewMemeFanfare(false);
    analytics.track('wheel_ad_spin_claimed', { timestamp: now });
    return true;
  }, [canClaimAdWheelSpin]);

  // Spin the wheel using 1 accumulated spin
  const spinWheel = useCallback((): { sector: WheelSector; success: boolean; message?: string } => {
    if (wheelSpinsCount <= 0 && !isAdminToolsEnabled()) {
      return { sector: WHEEL_SECTORS[0], success: false, message: 'У вас нет накопленных прокрутов! Заберите бесплатный спин или посмотрите рекламу.' };
    }
    // Deduct 1 spin
    setWheelSpinsCount((prev) => Math.max(0, prev - 1));
    const winner = pickWheelWinnerSector();
    return { sector: winner, success: true };
  }, [wheelSpinsCount]);

  // Claim the reward won from a wheel spin
  const claimWheelReward = useCallback((sector: WheelSector) => {
    const { reward } = sector;

    if (reward.coins) {
      setCoins((prev) => clampCoins(prev + reward.coins!));
    }
    if (reward.xp) {
      addXp(reward.xp!);
    }
    if (reward.ingredientId && reward.ingredientCount) {
      const ingId = reward.ingredientId;
      const count = reward.ingredientCount;
      setInventory((prev) => ({
        ...prev,
        [ingId]: clampInt((prev[ingId] || 0) + count, 0, MAX_INVENTORY_COUNT, 0),
      }));
    }
    if (reward.boosterId) {
      const boosterId = reward.boosterId;
      const durationMs = (reward.boosterDurationSec || 600) * 1000;
      setActiveBoosters((prev) => {
        const currentExpiry = prev[boosterId] || 0;
        const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
        return {
          ...prev,
          [boosterId]: clampInt(baseTime + durationMs, Date.now(), Date.now() + MAX_ACTIVE_BOOSTER_MS, Date.now()),
        };
      });
    }
    if (reward.boxId) {
      const pool = INGREDIENTS.filter((i) => i.rarity === 'rare' || i.rarity === 'epic');
      for (let i = 0; i < 2; i++) {
        const item = pool[Math.floor(Math.random() * pool.length)] || INGREDIENTS[0];
        setInventory((prev) => ({
          ...prev,
          [item.id]: clampInt((prev[item.id] || 0) + 1, 0, MAX_INVENTORY_COUNT, 0),
        }));
      }
    }

    updateQuestCounter('spin_wheel', 1);
    soundManager.playCoin();
    analytics.track('wheel_spin_claimed', { sectorId: sector.id, rarity: sector.rarity });
  }, [addXp]);

  const devAddWheelSpins = useCallback((count = 5) => {
    setWheelSpinsCount((prev) => clampInt(prev + count, 0, 9999, 0));
  }, []);

  const devResetWheelCooldown = () => {
    if (!isAdminToolsEnabled()) return;
    setLastWheelSpinTimestamp(0);
    setLastWheelAdSpinTimestamp(0);
    soundManager.playUpgrade();
  };

  const dismissRandomEvent = useCallback(() => {
    setCurrentRandomEvent(null);
  }, []);

  const stateRef = useRef({
    coins,
    setCoins,
    level,
    placedCreatures,
    setPlacedCreatures,
    backpackCreatures,
    setBackpackCreatures,
    inventory,
    setInventory,
    activeBoosters,
    setActiveBoosters,
    discoveredCreatures,
    setDiscoveredCreatures,
    currentRandomEvent,
    isWelcomeOpen,
    isDailyRewardOpen,
    isQuestsOpen,
    isSettingsOpen,
    isAdRewardOpen,
    tutorialStep,
  });

  useEffect(() => {
    stateRef.current = {
      coins,
      setCoins,
      level,
      placedCreatures,
      setPlacedCreatures,
      backpackCreatures,
      setBackpackCreatures,
      inventory,
      setInventory,
      activeBoosters,
      setActiveBoosters,
      discoveredCreatures,
      setDiscoveredCreatures,
      currentRandomEvent,
      isWelcomeOpen,
      isDailyRewardOpen,
      isQuestsOpen,
      isSettingsOpen,
      isAdRewardOpen,
      tutorialStep,
    };
  });

  const triggerRandomEvent = useCallback((forcedType?: 'positive' | 'negative') => {
    if (!GAME_CONFIG.features.enableRandomEvents) return;
    if (forcedType && !isAdminToolsEnabled()) return;

    const s = stateRef.current;
    const eventData = triggerRandomGameEvent(
      {
        coins: s.coins,
        setCoins: s.setCoins,
        level: s.level,
        placedCreatures: s.placedCreatures,
        setPlacedCreatures: s.setPlacedCreatures,
        backpackCreatures: s.backpackCreatures,
        setBackpackCreatures: s.setBackpackCreatures,
        inventory: s.inventory,
        setInventory: s.setInventory,
        activeBoosters: s.activeBoosters,
        setActiveBoosters: s.setActiveBoosters,
        discoveredCreatures: s.discoveredCreatures,
        setDiscoveredCreatures: s.setDiscoveredCreatures,
      },
      forcedType
    );
    setCurrentRandomEvent(eventData);
  }, []);

  // Periodic unprompted random events: completely random autonomous triggers (paused while welcome modal / game is paused)
  useEffect(() => {
    if (isGamePaused || !GAME_CONFIG.features.enableRandomEvents) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const runEventCycle = () => {
      if (isCancelled) return;

      const s = stateRef.current;
      const isAnyModalOpen =
        s.isWelcomeOpen ||
        !!s.currentRandomEvent ||
        s.isDailyRewardOpen ||
        s.isQuestsOpen ||
        s.isSettingsOpen ||
        s.isAdRewardOpen;

      if (isAnyModalOpen) {
        // If welcome modal or another modal is currently open, retry soon (in 5 seconds) so the event is not missed
        timeoutId = setTimeout(runEventCycle, 5000);
        return;
      }

      // Trigger the random event autonomously
      triggerRandomEvent();

      // Schedule next event randomly between 35 and 75 seconds
      const nextDelayMs = Math.floor(
        GAME_CONFIG.randomEvents.cycleMinDelayMs +
          Math.random() * (GAME_CONFIG.randomEvents.cycleMaxDelayMs - GAME_CONFIG.randomEvents.cycleMinDelayMs),
      );
      timeoutId = setTimeout(runEventCycle, nextDelayMs);
    };

    // First event occurs quickly (between 8 and 14 seconds) after starting the game,
    // so the player actually sees events happening without waiting minutes
    const initialDelayMs = Math.floor(
      GAME_CONFIG.randomEvents.initialMinDelayMs +
        Math.random() * (GAME_CONFIG.randomEvents.initialMaxDelayMs - GAME_CONFIG.randomEvents.initialMinDelayMs),
    );
    timeoutId = setTimeout(runEventCycle, initialDelayMs);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isGamePaused, triggerRandomEvent]);

  // Dev tools per Section 35
  const devAddCoins = (amount: number) => {
    if (!isAdminToolsEnabled()) return;
    setCoins((prev) => clampCoins(prev + clampInt(amount, 0, MAX_COINS, 0)));
    soundManager.playCoin();
  };

  const devAddLevel = (levelsToAdd: number) => {
    if (!isAdminToolsEnabled()) return;
    const safeAdd = clampInt(levelsToAdd, 1, MAX_LEVEL, 1);
    setLevel((prev) => {
      const nextLevel = clampInt(prev + safeAdd, 1, MAX_LEVEL, MAX_LEVEL);
      soundManager.playNewMemeFanfare(true);
      analytics.track('level_up', { level: nextLevel, source: 'admin' });
      return nextLevel;
    });
    setXp(0);
  };

  const devSetLevel = (targetLevel: number) => {
    if (!isAdminToolsEnabled()) return;
    const safeLevel = clampInt(targetLevel, 1, MAX_LEVEL, 1);
    setLevel(safeLevel);
    setXp(0);
    soundManager.playNewMemeFanfare(true);
    analytics.track('level_up', { level: safeLevel, source: 'admin' });
  };

  const devAddXp = (amount: number) => {
    if (!isAdminToolsEnabled()) return;
    addXp(clampInt(amount, 1, MAX_XP, 100));
    soundManager.playCoin();
  };

  const devUpgradeAllPlacedCreatures = () => {
    if (!isAdminToolsEnabled()) return;
    setPlacedCreatures((prev) =>
      prev.map((pc) => {
        const creature = CREATURES.find((c) => c.id === pc.creatureId);
        const max = creature?.maxLevel || 10;
        return {
          ...pc,
          level: Math.min(max, pc.level + 1),
        };
      }),
    );
    soundManager.playUpgrade();
  };

  const devGiveAllIngredients = () => {
    if (!isAdminToolsEnabled()) return;
    const full: Record<string, number> = {};
    INGREDIENTS.forEach((i) => {
      full[i.id] = clampInt((inventory[i.id] || 0) + 5, 0, MAX_INVENTORY_COUNT, 0);
    });
    setInventory(full);
    soundManager.playUpgrade();
  };

  const devUnlockAllZones = () => {
    if (!isAdminToolsEnabled()) return;
    setUnlockedZones(ZONES.map((zone) => zone.id));
    soundManager.playNewMemeFanfare(true);
  };

  const devResetProgress = () => {
    if (!isAdminToolsEnabled()) return;
    localStorage.removeItem(STORAGE_KEY);
    analytics.clearEvents();
    window.location.reload();
  };

  const updateConfig = (newCfg: Partial<GameConfig>) => {
    if (!isAdminToolsEnabled()) return;
    setConfig((prev) => ({
      ...prev,
      priceMultiplier: clampInt(newCfg.priceMultiplier, 1, 10, prev.priceMultiplier),
      incomeMultiplier: clampInt(newCfg.incomeMultiplier, 0, 10, prev.incomeMultiplier),
      offlineMaxHours: clampInt(newCfg.offlineMaxHours, 1, 24, prev.offlineMaxHours),
      mapSpawnIntervalSec: clampInt(newCfg.mapSpawnIntervalSec, 1, 300, prev.mapSpawnIntervalSec),
    }));
  };

  return (
    <GameContext.Provider
      value={{
        coins,
        xp,
        level,
        xpForNextLevel,
        inventory,
        placedCreatures,
        backpackCreatures,
        discoveredCreatures,
        unlockedZones,
        completedQuests,
        questProgress,
        dailyStreak,
        lastDailyClaimDate,
        purchasedPerks,
        activeBoosters,
        buyBooster,
        isPerkPurchased,
        getBoosterTimeRemaining,
        tutorialStep,
        config,
        soundEnabled,
        musicEnabled,
        volume,
        toggleSound,
        toggleMusic,
        setVolume,
        totalIncomePerSec,
        maxCreatureCapacity,
        groundItems,
        offlineEarnedCoins,
        offlineElapsedMinutes,
        claimOfflineEarnings,
        mixIngredients,
        placeCreature,
        addCreatureToBackpack,
        placeCreatureFromBackpack,
        recallCreature,
        upgradeCreature,
        collectCreatureCoins,
        collectGroundItem,
        buyIngredient,
        openBox,
        unlockZone,
        claimDailyReward,
        claimQuestReward,
        getQuestCurrentProgress,
        claimableQuestsCount,
        advanceTutorial,
        wheelSpinsCount,
        lastWheelSpinTimestamp,
        lastWheelAdSpinTimestamp,
        isWheelOpen,
        setIsWheelOpen,
        canClaimDailyWheelSpin,
        canClaimAdWheelSpin,
        canSpinWheel,
        canSpinWheelAd,
        canSpinWheelNow,
        getWheelCooldownRemaining,
        getWheelAdCooldownRemaining,
        claimDailyWheelSpin,
        claimAdWheelSpin,
        spinWheel,
        claimWheelReward,
        devAddWheelSpins,
        lastAdRewardTimestamp,
        adModalConfig,
        openAdModal,
        closeAdModal,
        claimAdReward,
        activateBoosterByAd,
        getAdCooldownRemaining,
        isAdRewardOpen,
        setIsAdRewardOpen,
        isWelcomeOpen,
        setIsWelcomeOpen,
        isGamePaused,
        startGame,
        activeTab,
        setActiveTab,
        inspectedCreature,
        setInspectedCreature,
        isDailyRewardOpen,
        setIsDailyRewardOpen,
        isQuestsOpen,
        setIsQuestsOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        currentRandomEvent,
        dismissRandomEvent,
        triggerRandomEvent,
        devAddCoins,
        devAddLevel,
        devSetLevel,
        devAddXp,
        devUpgradeAllPlacedCreatures,
        devGiveAllIngredients,
        devUnlockAllZones,
        devResetWheelCooldown,
        devResetProgress,
        updateConfig,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
