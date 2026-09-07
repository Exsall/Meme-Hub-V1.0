import React from 'react';
import { Backpack, BookOpen, Dna, Home, ShoppingCart } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, inventory, backpackCreatures, discoveredCreatures, tutorialStep } = useGame();

  const totalIngredientsCount = (Object.values(inventory) as number[]).reduce((a, b) => a + b, 0);
  const backpackCreaturesCount = backpackCreatures.length;
  const hasMixPair = totalIngredientsCount >= 2;

  const tabs = [
    {
      id: 'home' as const,
      label: 'Поляна',
      sublabel: 'База',
      icon: Home,
      badge: null,
    },
    {
      id: 'lab' as const,
      label: 'Слияние',
      sublabel: 'Лаборатория',
      icon: Dna,
      badge: tutorialStep === 0 || hasMixPair ? '!' : null,
      glow: tutorialStep === 0 || hasMixPair,
    },
    {
      id: 'inventory' as const,
      label: 'Рюкзак',
      sublabel: 'Инвентарь',
      icon: Backpack,
      badge:
        backpackCreaturesCount > 0
          ? `${backpackCreaturesCount}🐾`
          : totalIngredientsCount > 0
          ? `${totalIngredientsCount}`
          : null,
    },
    {
      id: 'memedex' as const,
      label: 'Коллекция',
      sublabel: 'Мемопедия',
      icon: BookOpen,
      badge: `${discoveredCreatures.length}`,
    },
    {
      id: 'shop' as const,
      label: 'Магазин',
      sublabel: 'Товары',
      icon: ShoppingCart,
      badge: null,
    },
  ];

  return (
    <nav className="relative z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 select-none shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => {
                soundManager.playClick();
                setActiveTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all duration-150 active:scale-90 min-h-[50px] ${
                isActive
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 text-amber-300 font-extrabold border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              } ${tab.glow && !isActive ? 'animate-pulse text-amber-400' : ''}`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 rounded-full text-[10px] font-black flex items-center justify-center shadow-md ${
                      tab.badge === '!'
                        ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white animate-bounce'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-black tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
