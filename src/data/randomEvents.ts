import React from 'react';
import { CREATURES, INGREDIENTS } from './gameData';
import { PlacedCreature, BackpackCreature, RandomEventData } from '../types/game';
import { soundManager } from '../utils/audio';
import { GAME_CONFIG } from '../config/gameConfig';

const MAX_EVENT_COINS = 1_000_000_000_000;
const MAX_EVENT_INVENTORY_COUNT = 999_999;
const MAX_EVENT_BOOSTER_MS = 24 * 60 * 60 * 1000;

const clampInt = (value: unknown, min: number, max: number, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
};

const clampCoins = (value: unknown): number => clampInt(value, 0, MAX_EVENT_COINS, 0);

export interface EventExecutionContext {
  coins: number;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  level: number;
  placedCreatures: PlacedCreature[];
  setPlacedCreatures: React.Dispatch<React.SetStateAction<PlacedCreature[]>>;
  backpackCreatures: BackpackCreature[];
  setBackpackCreatures: React.Dispatch<React.SetStateAction<BackpackCreature[]>>;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  activeBoosters: Record<string, number>;
  setActiveBoosters: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  discoveredCreatures: string[];
  setDiscoveredCreatures: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Generates and applies a random positive or negative event based on current game state.
 * Returns the event data for displaying in the centered modal.
 */
export function triggerRandomGameEvent(ctx: EventExecutionContext, forcedType?: 'positive' | 'negative'): RandomEventData {
  // 50/50 chance between positive and negative unless forced
  const isPositive = forcedType ? forcedType === 'positive' : Math.random() < 0.52;

  if (isPositive) {
    return triggerPositiveEvent(ctx);
  } else {
    return triggerNegativeEvent(ctx);
  }
}

/**
 * Handles positive game events (buffs, stray pets, coins, ingredients, fast spawn)
 */
function triggerPositiveEvent(ctx: EventExecutionContext): RandomEventData {
  const roll = Math.random();

  // 1. Meme Carnival (x2 income) - 25%
  if (roll < 0.25) {
    const durationMin = GAME_CONFIG.randomEvents.buffDurationMinutes;
    const durationMs = durationMin * 60 * 1000;
    ctx.setActiveBoosters((prev) => {
      const currentExpiry = prev.event_double_income && prev.event_double_income > Date.now() ? prev.event_double_income : Date.now();
      return {
        ...prev,
        event_double_income: clampInt(currentExpiry + durationMs, Date.now(), Date.now() + MAX_EVENT_BOOSTER_MS, Date.now()),
      };
    });

    soundManager.playPositiveEvent();

    return {
      id: `ev_carnival_${Date.now()}`,
      type: 'positive',
      title: '🎪 Мемный Карнавал!',
      icon: '🎪',
      cause: 'На вашу полянку приехал бродячий цирк мемов! Питомцы устроили грандиозный парад, а восхищённые зрители осыпают их золотом и аплодисментами.',
      outcomeHeadline: 'Вы получили мощный бафф!',
      outcomeBadge: `⚡ x2 Доход на ${durationMin} минуты!`,
      consequenceText: 'Все существа приносят вдвое больше монет в секунду на время карнавала!',
      accentColor: 'amber',
    };
  }

  // 2. Stray Pet (A creature joins the backpack) - 25%
  if (roll < 0.5) {
    // Pick an interesting creature (common/uncommon/rare)
    const candidates = CREATURES.filter((c) => c.rarity === 'common' || c.rarity === 'uncommon' || c.rarity === 'rare');
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || CREATURES[0];

    const newBackpackItem: BackpackCreature = {
      instanceId: `backpack_stray_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      creatureId: chosen.id,
      level: 1,
      obtainedAt: Date.now(),
    };

    ctx.setBackpackCreatures((prev) => [...prev, newBackpackItem]);
    ctx.setDiscoveredCreatures((prev) => (prev.includes(chosen.id) ? prev : [...prev, chosen.id]));

    soundManager.playPositiveEvent();

    return {
      id: `ev_pet_${Date.now()}`,
      type: 'positive',
      title: '🐾 Бродячий Покемем!',
      icon: chosen.emoji || '🐾',
      cause: `Одинокий и любопытный покемем блуждал в чаще леса, учуял аромат вкусных бананов и с радостью прибился к вашей ферме в поисках дома!`,
      outcomeHeadline: 'Вы нашли нового друга!',
      outcomeBadge: `+1 Питомец: «${chosen.name}» ${chosen.emoji}`,
      consequenceText: 'Новое существо бережно помещено в ваш рюкзак. Вы можете разместить его на полянке!',
      accentColor: 'emerald',
    };
  }

  // 3. Golden Meteorite (Coins reward) - 25%
  if (roll < 0.75) {
    const baseCoins = Math.max(800, ctx.level * 250 + Math.floor(Math.random() * 800));
    ctx.setCoins((prev) => clampCoins(prev + baseCoins));
    soundManager.playPositiveEvent();

    return {
      id: `ev_gold_${Date.now()}`,
      type: 'positive',
      title: '🌠 Золотой Метеорит!',
      icon: '🌠',
      cause: 'В небе раздался космический хлопок, и прямо посреди полянки приземлился блестящий осколок метеорита, оказавшийся чистейшим золотом!',
      outcomeHeadline: 'Вы нашли ценное сокровище!',
      outcomeBadge: `+ 🪙 ${baseCoins.toLocaleString()} монет!`,
      consequenceText: 'Золотые самородки были благополучно собраны и зачислены на ваш баланс!',
      accentColor: 'amber',
    };
  }

  // 4. Supply Drone Drop (Useful ingredients) - 25%
  const availableIngs = INGREDIENTS.filter((i) => i.unlockLevel <= Math.max(ctx.level, 1));
  const shuffled = [...availableIngs].sort(() => 0.5 - Math.random());
  const selectedIngs = shuffled.slice(0, 2);

  ctx.setInventory((prev) => {
    const next = { ...prev };
    selectedIngs.forEach((ing) => {
      next[ing.id] = clampInt((next[ing.id] || 0) + 2, 0, MAX_EVENT_INVENTORY_COUNT, 0);
    });
    return next;
  });

  soundManager.playPositiveEvent();

  const namesList = selectedIngs.map((i) => `2x ${i.emoji} ${i.name}`).join(' и ');

  return {
    id: `ev_drone_${Date.now()}`,
    type: 'positive',
    title: '📦 Космическая Посылка!',
    icon: '📦',
    cause: 'Орбитальный транспорт снабжения по ошибке сбросил над вашей территорией герметичный ящик с первоклассными ингредиентами для опытов!',
    outcomeHeadline: 'Вы получили ценные ресурсы!',
    outcomeBadge: `+ ${namesList}`,
    consequenceText: 'Ресурсы уже добавлены в ваш инвентарь и готовы для скрещивания в лаборатории!',
    accentColor: 'emerald',
  };
}

/**
 * Handles negative game events (escaped pet, stolen ingredients, lab repair, sleepy fog, inspector fine)
 */
function triggerNegativeEvent(ctx: EventExecutionContext): RandomEventData {
  // Check conditions:
  const canLoseCreature = ctx.placedCreatures.length >= 2;
  const ownedIngredients = Object.entries(ctx.inventory).filter(([_, count]) => count > 0);
  const canLoseIngredients = ownedIngredients.length > 0;

  const choices: ('creature' | 'ingredients' | 'lab_accident' | 'sleepy_fog' | 'fine')[] = [];

  if (canLoseCreature) choices.push('creature');
  if (canLoseIngredients) choices.push('ingredients');
  choices.push('lab_accident');
  choices.push('sleepy_fog');
  choices.push('fine');

  const picked = choices[Math.floor(Math.random() * choices.length)];

  // 1. Creature Got Scared & Escaped
  if (picked === 'creature') {
    const randomIndex = Math.floor(Math.random() * ctx.placedCreatures.length);
    const lostTarget = ctx.placedCreatures[randomIndex];
    const creatureData = CREATURES.find((c) => c.id === lostTarget.creatureId) || CREATURES[0];

    // Remove from placed creatures
    ctx.setPlacedCreatures((prev) => prev.filter((p) => p.instanceId !== lostTarget.instanceId));
    soundManager.playNegativeEvent();

    return {
      id: `ev_escape_${Date.now()}`,
      type: 'negative',
      title: '🌩️ Испуганный Беглец!',
      icon: creatureData.emoji || '🐾',
      cause: `Внезапный грозовой раскат грома напугал обитателей полянки! Питомец «${creatureData.name}» сильно испугался вспышек молний, перепрыгнул забор и убежал в лес!`,
      outcomeHeadline: 'Вы потеряли существо с полянки:',
      outcomeBadge: `– 1 существо: «${creatureData.name}» ${creatureData.emoji}`,
      consequenceText: 'На полянке освободилось место. Вы можете разместить другого питомца из рюкзака или создать нового в лаборатории.',
      accentColor: 'rose',
    };
  }

  // 2. Raccoons Stole Ingredients
  if (picked === 'ingredients') {
    // Pick 1 or 2 owned ingredients
    const shuffled = [...ownedIngredients].sort(() => 0.5 - Math.random());
    const victim1 = shuffled[0];
    const victim2 = shuffled[1];

    const stolenDetails: { name: string; emoji: string; count: number }[] = [];

    ctx.setInventory((prev) => {
      const next = { ...prev };
      if (victim1) {
        const stealCount = Math.min(clampInt(next[victim1[0]], 0, MAX_EVENT_INVENTORY_COUNT, 0), Math.floor(Math.random() * 2) + 1);
        next[victim1[0]] = Math.max(0, next[victim1[0]] - stealCount);
        const ingData = INGREDIENTS.find((i) => i.id === victim1[0]);
        if (ingData) {
          stolenDetails.push({ name: ingData.name, emoji: ingData.emoji, count: stealCount });
        }
      }
      if (victim2 && Math.random() > 0.5) {
        const stealCount = Math.min(clampInt(next[victim2[0]], 0, MAX_EVENT_INVENTORY_COUNT, 0), 1);
        next[victim2[0]] = Math.max(0, next[victim2[0]] - stealCount);
        const ingData = INGREDIENTS.find((i) => i.id === victim2[0]);
        if (ingData) {
          stolenDetails.push({ name: ingData.name, emoji: ingData.emoji, count: stealCount });
        }
      }
      return next;
    });

    soundManager.playNegativeEvent();

    const stolenText = stolenDetails.map((s) => `${s.count}x ${s.emoji} ${s.name}`).join(' и ') || 'ингредиенты';

    return {
      id: `ev_raccoons_${Date.now()}`,
      type: 'negative',
      title: '🦝 Нашествие Енотов-Воришек!',
      icon: '🦝',
      cause: 'Хитрая банда енотов в масках прокралась ночью в ваш кладовой сарай, пока охрана дремала, и утащила свежие запасы!',
      outcomeHeadline: 'У вас похитили припасы:',
      outcomeBadge: `– ${stolenText}`,
      consequenceText: 'Припасы исчезли из инвентаря. Будьте осторожны и собирайте новые ресурсы на карте!',
      accentColor: 'rose',
    };
  }

  // 3. Lab Explosion Repair
  if (picked === 'lab_accident') {
    const lostCoins = Math.max(50, Math.min(500, Math.floor(ctx.coins * 0.15) || 150));
    ctx.setCoins((prev) => clampCoins(prev - lostCoins));
    soundManager.playNegativeEvent();

    return {
      id: `ev_lab_${Date.now()}`,
      type: 'negative',
      title: '💥 Авария в Лаборатории!',
      icon: '💥',
      cause: 'Во время ночной реакции в одной из колб вскипела мемная эссенция! Раздался хлопок, разбились трубки и залило контрольную панель.',
      outcomeHeadline: 'Расходы на срочный ремонт:',
      outcomeBadge: `– 🪙 ${lostCoins.toLocaleString()} монет`,
      consequenceText: 'Пришлось оплатить услуги ремонтной бригады гоблинов для восстановления аппаратуры.',
      accentColor: 'rose',
    };
  }

  // 4. Sleepy Fog (Temporary debuff -30% income, stacks additively!)
  if (picked === 'sleepy_fog') {
    const durationMin = GAME_CONFIG.randomEvents.debuffDurationMinutes;
    const durationMs = durationMin * 60 * 1000;
    ctx.setActiveBoosters((prev) => {
      const currentExpiry = prev.sleepy_fog && prev.sleepy_fog > Date.now() ? prev.sleepy_fog : Date.now();
      return {
        ...prev,
        sleepy_fog: clampInt(currentExpiry + durationMs, Date.now(), Date.now() + MAX_EVENT_BOOSTER_MS, Date.now()),
      };
    });

    soundManager.playNegativeEvent();

    return {
      id: `ev_fog_${Date.now()}`,
      type: 'negative',
      title: '💤 Сонный Час на Полянке!',
      icon: '🌫️',
      cause: 'С болот приполз густой фиолетовый туман лени и дрёмы. Все покемемы на полянке дружно зевнули, свернулись клубочком и уснули!',
      outcomeHeadline: 'Временное замедление дохода:',
      outcomeBadge: `– 30% к доходу на ${durationMin} минуты!`,
      consequenceText: 'Питомцы крепко спят, поэтому выработка монет временно снижена, пока туман не рассеется.',
      accentColor: 'rose',
    };
  }

  // 5. Meme Inspector Fine
  const fineCoins = Math.max(40, Math.min(400, Math.floor(ctx.coins * 0.1) || 120));
  ctx.setCoins((prev) => clampCoins(prev - fineCoins));
  soundManager.playNegativeEvent();

  return {
    id: `ev_fine_${Date.now()}`,
    type: 'negative',
    title: '📜 Штраф Мемного Надзора!',
    icon: '📜',
    cause: 'Инспектор сказочного надзора зафиксировал превышение допустимого уровня шума от мемных песен и выписал вам официальный штраф.',
    outcomeHeadline: 'С вашего счёта списано:',
    outcomeBadge: `– 🪙 ${fineCoins.toLocaleString()} монет штрафа`,
    consequenceText: 'Штраф автоматически списан местным казначейством за нарушение ночного покоя.',
    accentColor: 'rose',
  };
}
