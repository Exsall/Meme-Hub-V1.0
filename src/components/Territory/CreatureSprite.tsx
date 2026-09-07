import React, { useEffect, useState } from 'react';
import { calculateCreatureIncome, CREATURES, RARITY_CONFIG } from '../../data/gameData';
import { PlacedCreature } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { CreatureAvatar } from '../Creatures/CreatureAvatar';

interface CreatureSpriteProps {
  placed: PlacedCreature;
  onSelect: (p: PlacedCreature) => void;
  onPet: (instanceId: string) => number;
}

export const CreatureSprite: React.FC<CreatureSpriteProps> = ({ placed, onSelect, onPet }) => {
  const creature = CREATURES.find((c) => c.id === placed.creatureId);
  const [posX, setPosX] = useState(placed.x);
  const [posY, setPosY] = useState(placed.y);
  const [isSquashing, setIsSquashing] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string }[]>([]);
  const [moodEmoji, setMoodEmoji] = useState<string | null>(null);

  // Wandering logic without turning or inverting
  useEffect(() => {
    const wanderInterval = setInterval(() => {
      // 40% chance to move slightly
      if (Math.random() < 0.45) {
        const deltaX = (Math.random() - 0.5) * 8;
        const deltaY = (Math.random() - 0.5) * 6;

        setPosX((prev) => Math.max(10, Math.min(85, prev + deltaX)));
        setPosY((prev) => Math.max(20, Math.min(80, prev + deltaY)));

        // Random cute mood
        if (Math.random() < 0.25) {
          const moods = ['❤️', '✨', '🎵', '😋', '🔥', '⭐'];
          setMoodEmoji(moods[Math.floor(Math.random() * moods.length)]);
          setTimeout(() => setMoodEmoji(null), 2500);
        }
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(wanderInterval);
  }, []);

  if (!creature) return null;

  const rarityMeta = RARITY_CONFIG[creature.rarity];
  const incomePerSec = calculateCreatureIncome(creature, placed.level);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSquashing(true);
    setTimeout(() => setIsSquashing(false), 220);

    const bonus = onPet(placed.instanceId);
    if (bonus > 0) {
      const id = Date.now() + Math.random();
      setFloatingTexts((prev) => [...prev, { id, text: `+${bonus} 🪙` }]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
      }, 1000);
    }

    // Also notify parent modal for inspect
    onSelect(placed);
  };

  return (
    <div
      id={`creature-${placed.instanceId}`}
      onClick={handleClick}
      className="absolute cursor-pointer select-none transition-all duration-1000 ease-out z-10 hover:z-20 group"
      style={{
        left: `${posX}%`,
        top: `${posY}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Floating text notifications (+12 🪙) */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          className="absolute -top-12 left-1/2 -translate-x-1/2 text-sm font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none animate-float-up whitespace-nowrap z-30"
        >
          {item.text}
        </div>
      ))}

      {/* Mood bubble */}
      {moodEmoji && (
        <div className="absolute -top-8 -right-1 bg-white/95 border border-slate-300 text-slate-900 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md animate-bounce pointer-events-none z-20">
          {moodEmoji}
        </div>
      )}

      {/* Income bubble hovering directly above */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-sm border border-amber-500/40 text-amber-300 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all pointer-events-none whitespace-nowrap z-20">
        <span>🪙</span>
        <span>{incomePerSec}/с</span>
      </div>

      {/* Ground contact shadow directly on the meadow */}
      <div className="w-14 sm:w-16 h-3 bg-black/40 rounded-full mx-auto -mb-1 filter blur-[2px] transition-transform duration-300 group-hover:scale-125" />

      {/* Main creature body: always upright, NEVER flipped horizontally */}
      <div
        className={`relative flex flex-col items-center justify-center transition-transform duration-150 ${
          isSquashing ? 'scale-x-120 scale-y-80' : 'hover:scale-110'
        }`}
      >
        {/* Freestanding character sprite: pet holding item, NO background box */}
        <CreatureAvatar creature={creature} size="lg" showGlow={true} />

        {/* Compact docked level & name pill directly under the pet */}
        <div
          className={`mt-0.5 backdrop-blur-sm text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 max-w-[105px] truncate tracking-tight z-20 ${
            creature.isFusion
              ? 'bg-purple-950/95 border border-purple-400/80 shadow-purple-500/25'
              : 'bg-slate-900/95 border border-slate-700/80'
          }`}
        >
          <span
            className={`font-black text-[9px] px-1 py-0.2 rounded ${
              creature.isFusion
                ? 'bg-purple-900 text-amber-300 border border-purple-400/40'
                : 'bg-slate-950 text-amber-400 border border-amber-400/30'
            }`}
          >
            Ур.{placed.level}
          </span>
          {creature.isFusion && <span className="text-[8px] leading-none">🧬</span>}
          <span className="truncate">{creature.name}</span>
        </div>
      </div>
    </div>
  );
};

