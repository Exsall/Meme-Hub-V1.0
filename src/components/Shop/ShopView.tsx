import React, { useState, useEffect } from 'react';
import {
  Box,
  Check,
  HelpCircle,
  Package,
  ShoppingCart,
  Sparkles,
  Clock,
  Play,
  Gift,
  Zap,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { BOOSTERS, INGREDIENTS, MYSTERY_BOXES, RARITY_CONFIG } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { BoosterItem, Ingredient, MysteryBox } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { BoxOpenModal } from './BoxOpenModal';

export const ShopView: React.FC = () => {
  const {
    coins,
    level,
    buyIngredient,
    openBox,
    setIsAdRewardOpen,
    openAdModal,
    getAdCooldownRemaining,
    buyBooster,
    isPerkPurchased,
    getBoosterTimeRemaining,
  } = useGame();

  const [adCooldownSec, setAdCooldownSec] = useState<number>(getAdCooldownRemaining());
  const [activeTab, setActiveShopTab] = useState<'boosters' | 'boxes' | 'ingredients'>('boosters');
  const [, setTimerTick] = useState<number>(0);

  useEffect(() => {
    setAdCooldownSec(getAdCooldownRemaining());
    const interval = setInterval(() => {
      setAdCooldownSec(getAdCooldownRemaining());
      setTimerTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [getAdCooldownRemaining]);

  const canClaimAd = adCooldownSec === 0;

  const [activeBoxResult, setActiveBoxResult] = useState<{
    box: MysteryBox;
    results: {
      items: { ingredient: Ingredient; count: number }[];
      bonusCoins: number;
    };
  } | null>(null);

  const handleOpenBox = (box: MysteryBox) => {
    if (coins < box.cost) return;
    const res = openBox(box.id);
    if (res) {
      setActiveBoxResult({
        box,
        results: res,
      });
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}м ${s.toString().padStart(2, '0')}с`;
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-120px)] flex flex-col p-3 sm:p-5 select-none bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
            <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
            <span>МАГАЗИН МЕМОЛОГА</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Товары, Способности и Коробки</h1>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-2xl border border-slate-700">
          <span className="text-base">🪙</span>
          <span className="text-sm font-black text-amber-300">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* 1,000 Coins Ad Reward Banner */}
      <div className="mt-3 p-3.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            📺
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-300">1 000 🪙 за рекламу</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                Спонсор
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {canClaimAd
                ? 'Посмотри ролик спонсора и получи 1 000 монет!'
                : `Следующая реклама через: ${Math.floor(adCooldownSec / 3600)}ч ${Math.floor((adCooldownSec % 3600) / 60)}м`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            setIsAdRewardOpen(true);
          }}
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 active:scale-95 ${
            canClaimAd
              ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:brightness-110 animate-pulse'
              : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
          }`}
        >
          {canClaimAd ? (
            <>
              <Tv className="w-3.5 h-3.5" />
              <span>Смотреть</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Таймер</span>
            </>
          )}
        </button>
      </div>

      {/* Categories Switcher */}
      <div className="flex bg-slate-900 rounded-2xl p-1 border border-slate-800 my-3 gap-1">
        <button
          id="shop-tab-boosters"
          onClick={() => {
            soundManager.playClick();
            setActiveShopTab('boosters');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'boosters'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Бустеры и Умения</span>
        </button>

        <button
          id="shop-tab-boxes"
          onClick={() => {
            soundManager.playClick();
            setActiveShopTab('boxes');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'boxes'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🎁 Коробки</span>
        </button>

        <button
          id="shop-tab-ingredients"
          onClick={() => {
            soundManager.playClick();
            setActiveShopTab('ingredients');
          }}
          className={`flex-1 py-2 px-1.5 sm:px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'ingredients'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🍎 Ингредиенты</span>
        </button>
      </div>

      {/* BOOSTERS & ABILITIES TAB */}
      {activeTab === 'boosters' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-8">
          {BOOSTERS.map((booster) => {
            const isPurchased = booster.type === 'permanent' && isPerkPurchased(booster.id);
            const remainingTime = booster.type === 'active_timer' ? getBoosterTimeRemaining(booster.id) : 0;
            const isTimerActive = remainingTime > 0;
            const isLevelUnlocked = level >= booster.requiredLevel;
            const canAfford = coins >= booster.cost && isLevelUnlocked;

            return (
              <div
                key={booster.id}
                className={`relative rounded-3xl border p-4 flex flex-col justify-between shadow-xl transition-all ${
                  isPurchased
                    ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : isTimerActive
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : isLevelUnlocked
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/70 border-slate-800/80 opacity-60'
                }`}
              >
                <div>
                  {/* Top row: Emoji & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-13 h-13 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-3xl shadow-inner">
                        {booster.emoji}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white leading-tight">
                          {booster.name}
                        </h3>
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {booster.bonusBadge}
                        </span>
                      </div>
                    </div>

                    {booster.type === 'permanent' ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        Пассивно
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 flex items-center gap-1">
                        <Tv className="w-3 h-3" />
                        <span>Реклама</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {booster.description}
                  </p>

                  {/* Active status / Timer */}
                  {isTimerActive && (
                    <div className="mt-3 flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-300">
                      <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                      <span className="text-xs font-bold">Активно:</span>
                      <span className="font-mono font-black text-xs">
                        {formatTimer(remainingTime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom action button */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  {isPurchased ? (
                    <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center gap-1.5 shadow-inner">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Активно навсегда</span>
                    </div>
                  ) : booster.type === 'active_timer' ? (
                    <button
                      id={`booster-ad-btn-${booster.id}`}
                      onClick={() => {
                        soundManager.playClick();
                        openAdModal('booster', booster.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        {isTimerActive
                          ? 'Продлить за рекламу (+5 мин)'
                          : 'Смотреть рекламу (5 мин)'}
                      </span>
                    </button>
                  ) : !isLevelUnlocked ? (
                    <div className="w-full text-center py-2 px-3 rounded-xl bg-slate-950 text-slate-500 text-xs font-bold border border-slate-800">
                      Требуется {booster.requiredLevel} уровень
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const ok = buyBooster(booster.id);
                        if (ok) soundManager.playUpgrade();
                      }}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:brightness-110'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Купить: 🪙 {booster.cost.toLocaleString()}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* BOXES TAB */}
      {activeTab === 'boxes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-8">
          {MYSTERY_BOXES.map((box) => {
            const canAfford = coins >= box.cost;

            return (
              <div
                key={box.id}
                className="relative rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/10"
                        style={{ backgroundColor: `${box.color}25` }}
                      >
                        {box.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{box.name}</h3>
                        <span className="text-xs text-slate-400">
                          {box.guaranteedCount} ингредиента
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                    {box.description}
                  </p>

                  {/* Chances Pill List */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {Object.entries(box.chances).map(([rarity, chance]) => {
                      const meta = RARITY_CONFIG[rarity as keyof typeof RARITY_CONFIG];
                      if (!chance || !meta) return null;
                      return (
                        <span
                          key={rarity}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.bgBadge}`}
                        >
                          {meta.label}: {Math.round(chance * 100)}%
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  id={`open-box-${box.id}`}
                  onClick={() => handleOpenBox(box)}
                  disabled={!canAfford}
                  className={`w-full mt-5 py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    canAfford
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>🪙 {box.cost.toLocaleString()}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* DIRECT INGREDIENTS TAB */}
      {activeTab === 'ingredients' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-8">
          {INGREDIENTS.map((ing) => {
            const isUnlocked = level >= ing.unlockLevel;
            const canAfford = coins >= ing.cost && isUnlocked;
            const rarityMeta = RARITY_CONFIG[ing.rarity];

            return (
              <div
                key={ing.id}
                className={`relative rounded-3xl border p-3 flex flex-col items-center text-center shadow-lg transition-all ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-950/80 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl shadow-inner my-1">
                  {ing.emoji}
                </div>

                <span className="text-xs font-black text-white mt-1 truncate max-w-full">
                  {ing.name}
                </span>

                <span
                  className={`text-[9px] font-bold px-2 py-0.2 rounded-full mt-1 ${rarityMeta.bgBadge}`}
                >
                  {rarityMeta.label}
                </span>

                {isUnlocked ? (
                  <button
                    id={`buy-ing-${ing.id}`}
                    onClick={() => buyIngredient(ing.id, 1)}
                    disabled={!canAfford}
                    className={`w-full mt-3 py-1.5 px-2 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-amber-500 text-slate-950 hover:brightness-110 shadow-sm'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <span>🪙 {ing.cost}</span>
                  </button>
                ) : (
                  <div className="mt-3 text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    С {ing.unlockLevel} уровня
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BOX OPENING ANIMATION MODAL */}
      {activeBoxResult && (
        <BoxOpenModal
          box={activeBoxResult.box}
          results={activeBoxResult.results}
          onClose={() => setActiveBoxResult(null)}
        />
      )}
    </div>
  );
};
