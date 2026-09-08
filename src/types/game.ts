export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret';

export type IngredientCategory = 'animals' | 'fruits' | 'objects' | 'elements';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  rarity: Rarity;
  emoji: string;
  color: string;
  description: string;
  cost: number;
  unlockLevel: number;
}

export interface Creature {
  id: string;
  name: string;
  rarity: Rarity;
  emoji: string;
  visualType: string;
  ingredients: [string, string]; // [ingredientId1, ingredientId2] or [creatureId1, creatureId2]
  baseIncome: number; // Coins per second at level 1
  baseUpgradePrice: number;
  maxLevel: number;
  hint: string;
  description: string;
  isFusion?: boolean; // Indicates if this creature is a hybrid cross-breed
  fusionParents?: [string, string]; // Creature IDs of the parent creatures
}

export interface PlacedCreature {
  instanceId: string;
  creatureId: string;
  level: number;
  x: number; // Percentage 10-90% on territory canvas
  y: number; // Percentage 15-85% on territory canvas
  vx?: number;
  vy?: number;
  direction?: 'left' | 'right';
  currentAction?: 'idle' | 'walk' | 'sleep' | 'dance';
  placedAt: number;
  lastCollectAt: number;
}

export interface BackpackCreature {
  instanceId: string;
  creatureId: string;
  level: number;
  obtainedAt?: number;
}

export interface Zone {
  id: number;
  name: string;
  price: number;
  requiredLevel: number;
  maxCreatures: number;
  backgroundTheme: string;
  description: string;
  backgroundImage?: string;
}

export interface MysteryBox {
  id: string;
  name: string;
  cost: number;
  icon: string;
  color: string;
  chances: { [rarity in Rarity]?: number };
  guaranteedCount: number;
  description: string;
}

export interface BoosterItem {
  id: string;
  name: string;
  emoji: string;
  type: 'permanent' | 'active_timer';
  cost: number;
  requiredLevel: number;
  durationSec?: number;
  description: string;
  bonusBadge: string;
  isAdReward?: boolean;
}

export interface AdModalConfig {
  isOpen: boolean;
  rewardType: 'coins' | 'booster';
  boosterId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  type:
    | 'mix_count'
    | 'creature_count'
    | 'placed_count'
    | 'earn_coins'
    | 'upgrade_level'
    | 'upgrade_count'
    | 'pick_map_item'
    | 'open_box'
    | 'pet_count'
    | 'zone_count'
    | 'ad_watch'
    | 'reach_level'
    | 'spin_wheel';
  category?: 'beginner' | 'alchemy' | 'territory' | 'master';
  icon?: string;
  reward: {
    coins?: number;
    xp?: number;
    boxId?: string;
    ingredientId?: string;
  };
}

export interface GroundItem {
  id: string;
  ingredientId: string;
  x: number;
  y: number;
  spawnTime: number;
}

export interface AnalyticsEvent {
  event: string;
  timestamp: number;
  details?: Record<string, any>;
}

export interface GameConfig {
  priceMultiplier: number; // 1.18
  incomeMultiplier: number; // 1.45 per level
  offlineMaxHours: number; // 8 hours
  mapSpawnIntervalSec: number; // 15 seconds
}

export type RandomEventType = 'positive' | 'negative';

export interface RandomEventData {
  id: string;
  type: RandomEventType;
  title: string;
  icon: string;
  cause: string; // из-за какой проблемы/ситуации произошел ивент
  outcomeHeadline: string; // "Вы потеряли..." или "Вы получили..."
  outcomeBadge: string;
  consequenceText: string; // Детализация последствий
  accentColor: string; // emerald/amber or rose/red
}

export interface PlayerSaveData {
  version: string;
  coins: number;
  xp: number;
  level: number;
  inventory: Record<string, number>; // ingredientId -> count
  placedCreatures: PlacedCreature[];
  backpackCreatures?: BackpackCreature[];
  discoveredCreatures: string[]; // creature IDs
  unlockedZones: number[]; // zone IDs
  completedQuests: string[]; // quest IDs
  questProgress: Record<string, number>;
  dailyStreak: number;
  lastDailyClaimDate: string; // YYYY-MM-DD
  lastDailyClaimTimestamp?: number;
  wheelSpinsCount?: number; // accumulated banked wheel spins ready to be spun
  lastWheelSpinTimestamp?: number; // timestamp in ms of last 24h wheel spin
  lastWheelAdSpinTimestamp?: number; // timestamp in ms of last 24h ad-supported wheel spin
  lastAdRewardTimestamp?: number; // timestamp in ms when 3-hour 1000 coins free reward was claimed
  purchasedPerks?: string[]; // perk IDs (e.g., 'auto_collector', 'golden_touch')
  activeBoosters?: Record<string, number>; // boosterId -> expiry timestamp in ms
  lastActiveTimestamp: number;
  tutorialStep: number; // 0: tap lab, 1: mix banana+cat, 2: place bananacat, 3: completed
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    volume?: number; // 0 to 100
  };
}

export interface WheelSector {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  textColor: string;
  rarity: Rarity;
  reward: {
    coins?: number;
    xp?: number;
    ingredientId?: string;
    ingredientCount?: number;
    boosterId?: string;
    boosterDurationSec?: number;
    boxId?: string;
  };
  weight: number; // Probability weight for spinning
}
