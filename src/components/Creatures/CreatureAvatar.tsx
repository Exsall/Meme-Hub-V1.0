import React from 'react';
import { getCreaturePetAndItem, RARITY_CONFIG } from '../../data/gameData';
import { Creature } from '../../types/game';

interface CreatureAvatarProps {
  creature: Creature;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isSilhouette?: boolean;
  showGlow?: boolean;
  animate?: boolean;
  className?: string;
}

export const CreatureAvatar: React.FC<CreatureAvatarProps> = ({
  creature,
  size = 'md',
  isSilhouette = false,
  showGlow = true,
  animate = true,
  className = '',
}) => {
  const { petEmoji, itemEmoji, itemName, petId } = getCreaturePetAndItem(creature);
  const rarityMeta = RARITY_CONFIG[creature.rarity];

  // Size configurations
  const sizeStyles = {
    sm: {
      container: 'w-10 h-10',
      pet: 'text-2xl sm:text-3xl',
      item: 'text-xs sm:text-sm',
      itemWrapper: '-bottom-0.5 -right-0.5',
      paw: 'text-[8px] -bottom-0.5 -left-0.5',
      glow: 'inset-0 blur-xs opacity-40',
    },
    md: {
      container: 'w-14 h-14 sm:w-16 sm:h-16',
      pet: 'text-4xl sm:text-5xl',
      item: 'text-lg sm:text-xl',
      itemWrapper: '-bottom-1 -right-1',
      paw: 'text-[10px] -bottom-0.5 -left-1',
      glow: 'inset-0.5 blur-sm opacity-40',
    },
    lg: {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      pet: 'text-5xl sm:text-6xl',
      item: 'text-2xl sm:text-[32px]',
      itemWrapper: '-bottom-1 -right-1 sm:-right-1.5',
      paw: 'text-[11px] -bottom-0.5 -left-1',
      glow: 'inset-1 blur-md opacity-45',
    },
    xl: {
      container: 'w-28 h-28 sm:w-32 sm:h-32',
      pet: 'text-7xl sm:text-8xl',
      item: 'text-4xl sm:text-5xl',
      itemWrapper: '-bottom-2 -right-2 sm:-right-3',
      paw: 'text-sm -bottom-1 -left-1.5',
      glow: 'inset-2 blur-xl opacity-50',
    },
    '2xl': {
      container: 'w-36 h-36 sm:w-44 sm:h-44',
      pet: 'text-8xl sm:text-9xl',
      item: 'text-5xl sm:text-6xl',
      itemWrapper: '-bottom-3 -right-3',
      paw: 'text-base -bottom-1.5 -left-2',
      glow: 'inset-3 blur-2xl opacity-60',
    },
  }[size];

  const hasPaw = ['cat', 'dog', 'capybara', 'hamster', 'monkey', 'panda', 'fox', 'frog'].includes(petId);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeStyles.container} ${className}`}
      title={`${creature.name} (${itemName})`}
    >
      {/* Rarity colored ambient aura */}
      {showGlow && !isSilhouette && (
        <div
          className={`absolute rounded-full pointer-events-none transition-all ${sizeStyles.glow}`}
          style={{ backgroundColor: rarityMeta.color }}
        />
      )}

      {/* Silhouette wrapper or Normal character body */}
      <div
        className={`relative flex items-center justify-center w-full h-full transition-all ${
          isSilhouette
            ? 'filter brightness-0 contrast-200 opacity-85 scale-110'
            : ''
        }`}
      >
        {/* Main Pet Body */}
        <span
          className={`leading-none select-none filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)] relative z-10 ${
            sizeStyles.pet
          } ${animate && !isSilhouette ? 'animate-gentle-bounce' : ''}`}
        >
          {petEmoji}
        </span>

        {/* Item held in hands/paws! */}
        <div
          className={`absolute z-20 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] ${sizeStyles.itemWrapper}`}
        >
          <div className="relative flex items-center justify-center">
            <span
              className={`leading-none select-none transform -rotate-12 ${
                sizeStyles.item
              } ${animate && !isSilhouette ? 'animate-pulse' : ''}`}
              style={{ animationDuration: '3s' }}
            >
              {itemEmoji}
            </span>

            {/* Cute holding paw mark for furry pets */}
            {hasPaw && !isSilhouette && (
              <span
                className={`absolute select-none pointer-events-none opacity-90 drop-shadow ${sizeStyles.paw}`}
              >
                🐾
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
