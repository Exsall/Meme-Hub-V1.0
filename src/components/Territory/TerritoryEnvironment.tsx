import React from 'react';
import { Dna, Sparkles, Zap, Radio, Sun, Moon, Flame } from 'lucide-react';
import { ZONES } from '../../data/gameData';

interface TerritoryEnvironmentProps {
  zoneId: number;
  onLabClick: () => void;
  tutorialStep: number;
  children: React.ReactNode;
}

export const TerritoryEnvironment: React.FC<TerritoryEnvironmentProps> = ({
  zoneId,
  onLabClick,
  tutorialStep,
  children,
}) => {
  const currentZone = ZONES.find((z) => z.id === zoneId) || ZONES[0];

  return (
    <div className="relative w-full h-full min-h-[520px] flex-1 overflow-hidden select-none transition-all duration-700">
      {/* =========================================================================
          LOCATION 1: ЗЕЛЁНАЯ ПОЛЯНА (Fairytale Emerald Valley)
          ========================================================================= */}
      {zoneId === 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Sunny Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300/80 to-emerald-200/60" />

          {/* Golden Warm Sun */}
          <div className="absolute top-4 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 blur-xs shadow-[0_0_60px_rgba(251,191,36,0.8)] opacity-90 animate-pulse" />
          <div className="absolute top-7 right-13 text-3xl opacity-90">☀️</div>

          {/* Drifting Clouds */}
          <div className="absolute top-6 left-8 text-3xl opacity-75 animate-float-slow">☁️</div>
          <div className="absolute top-14 left-1/3 text-2xl opacity-60 animate-float-slow" style={{ animationDelay: '2s' }}>
            ☁️
          </div>
          <div className="absolute top-8 right-1/3 text-3xl opacity-70 animate-float-slow" style={{ animationDelay: '3.5s' }}>
            ☁️
          </div>

          {/* Flying Songbirds & Butterflies */}
          <div className="absolute top-12 left-1/4 text-sm opacity-80 animate-float-up" style={{ animationDuration: '6s' }}>
            🕊️
          </div>
          <div className="absolute top-28 right-16 text-base opacity-90 animate-bounce" style={{ animationDuration: '2.5s' }}>
            🦋
          </div>
          <div className="absolute bottom-40 left-12 text-sm opacity-90 animate-bounce" style={{ animationDuration: '3.2s' }}>
            🐝
          </div>

          {/* Distant Hills Silhouette (SVG) */}
          <svg
            className="absolute bottom-28 w-full h-36 opacity-35 preserve-3d"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#065f46"
              d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,202.7C672,213,768,203,864,176C960,149,1056,107,1152,106.7C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>

          {/* Rolling Foreground Green Hills (SVG) */}
          <svg
            className="absolute bottom-0 w-full h-72 preserve-3d opacity-95 drop-shadow-md"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#10b981"
              d="M0,96L60,117.3C120,139,240,181,360,176C480,171,600,117,720,112C840,107,960,149,1080,165.3C1200,181,1320,171,1380,165.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>

          {/* Lush Grassy Meadow base floor */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-emerald-800 via-emerald-600 to-emerald-500 opacity-95" />

          {/* Meadow Dots / Flowers Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:28px_28px]" />

          {/* Charming Fairytale Flora & Trees */}
          <div className="absolute bottom-28 left-4 text-4xl filter drop-shadow">🌳</div>
          <div className="absolute bottom-44 left-10 text-2xl filter drop-shadow opacity-90">🌲</div>
          <div className="absolute bottom-32 right-6 text-4xl filter drop-shadow">🌳</div>
          <div className="absolute bottom-48 right-14 text-2xl filter drop-shadow opacity-90">🍎</div>
          <div className="absolute bottom-12 left-16 text-2xl animate-bounce" style={{ animationDuration: '4s' }}>
            🍄
          </div>
          <div className="absolute bottom-8 right-20 text-2xl">🌸</div>
          <div className="absolute bottom-16 right-1/4 text-2xl">🌼</div>
          <div className="absolute bottom-6 left-1/3 text-xl">🌷</div>
          <div className="absolute bottom-20 left-1/4 text-lg">🌾</div>
          <div className="absolute bottom-10 right-1/3 text-xl">🌿</div>

          {/* Wooden Fence silhouette */}
          <div className="absolute bottom-28 inset-x-0 flex justify-between px-6 opacity-30 text-xs font-black text-amber-950 pointer-events-none">
            <span>||==||==||==||</span>
            <span>||==||==||==||</span>
            <span>||==||==||==||</span>
          </div>

          {/* Dandelion & Firefly Sparkles */}
          <div className="absolute bottom-36 left-1/2 text-sm text-yellow-200 animate-pulse">✨</div>
          <div className="absolute bottom-20 left-20 text-xs text-yellow-100 animate-pulse" style={{ animationDelay: '1s' }}>
            ✨
          </div>
          <div className="absolute bottom-40 right-28 text-xs text-yellow-100 animate-pulse" style={{ animationDelay: '2.5s' }}>
            ✨
          </div>
        </div>
      )}

      {/* =========================================================================
          LOCATION 2: ТРОПИЧЕСКОЕ ПОБЕРЕЖЬЕ (Sunny Beach & Ocean Waves)
          ========================================================================= */}
      {zoneId === 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Azure Tropical Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-sky-300 to-amber-100" />

          {/* Blazing Tropical Sun */}
          <div className="absolute top-4 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 blur-xs shadow-[0_0_80px_rgba(245,158,11,0.85)] animate-pulse" />
          <div className="absolute top-8 left-14 text-4xl">☀️</div>

          {/* Tropical Island Clouds */}
          <div className="absolute top-8 right-8 text-3xl opacity-80 animate-float-slow">☁️</div>
          <div className="absolute top-16 right-1/3 text-2xl opacity-60 animate-float-slow" style={{ animationDelay: '2.2s' }}>
            ☁️
          </div>
          <div className="absolute top-10 left-1/3 text-xl opacity-70 animate-float-slow" style={{ animationDelay: '4s' }}>
            🕊️
          </div>

          {/* Distant Volcanic Island Mountain Silhouette */}
          <svg
            className="absolute bottom-36 w-full h-32 opacity-40 preserve-3d"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#0d9488"
              d="M0,224L80,213.3C160,203,320,181,480,186.7C640,192,800,224,960,218.7C1120,213,1280,171,1360,149.3L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>

          {/* Deep Turquoise Ocean Water */}
          <div className="absolute bottom-32 inset-x-0 h-32 bg-gradient-to-b from-teal-500 via-cyan-600 to-teal-700 opacity-90" />

          {/* Animated Rolling Ocean Waves */}
          <div className="absolute bottom-40 inset-x-0 flex justify-around text-2xl opacity-60 animate-pulse">
            <span>🌊</span>
            <span>🌊</span>
            <span>🌊</span>
            <span>🌊</span>
            <span>🌊</span>
          </div>
          <div className="absolute bottom-34 inset-x-0 flex justify-around text-xl opacity-75 animate-bounce" style={{ animationDuration: '3s' }}>
            <span>🌊</span>
            <span>🏄</span>
            <span>🌊</span>
            <span>🌊</span>
            <span>⛵</span>
          </div>

          {/* White Seafoam Edge */}
          <div className="absolute bottom-30 inset-x-0 h-3 bg-white/70 filter blur-xs animate-pulse" />

          {/* Golden Beach Sand Shoreline (SVG) */}
          <svg
            className="absolute bottom-0 w-full h-44 preserve-3d drop-shadow-lg"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#fbbf24"
              d="M0,64L80,85.3C160,107,320,149,480,144C640,139,800,85,960,90.7C1120,96,1280,160,1360,192L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>

          {/* Warm Sand Base */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-amber-400 via-amber-300 to-yellow-200" />

          {/* Swaying Palm Trees & Tropical Beach Props */}
          <div className="absolute bottom-28 left-4 text-5xl filter drop-shadow animate-wiggle" style={{ animationDuration: '5s' }}>
            🌴
          </div>
          <div className="absolute bottom-36 left-12 text-3xl filter drop-shadow">🥥</div>
          <div className="absolute bottom-24 right-5 text-5xl filter drop-shadow animate-wiggle" style={{ animationDuration: '6s' }}>
            🌴
          </div>
          <div className="absolute bottom-16 right-16 text-3xl filter drop-shadow">⛱️</div>

          {/* Coastal Beach Details */}
          <div className="absolute bottom-8 left-16 text-xl">🐚</div>
          <div className="absolute bottom-12 right-28 text-xl">⭐</div>
          <div className="absolute bottom-6 left-1/3 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>
            🦀
          </div>
          <div className="absolute bottom-10 right-1/4 text-2xl">🌺</div>
          <div className="absolute bottom-5 right-12 text-xl">🍍</div>

          {/* Sunny Water Sparkles */}
          <div className="absolute bottom-44 left-1/4 text-sm text-cyan-200 animate-pulse">✨</div>
          <div className="absolute bottom-48 right-1/3 text-sm text-cyan-100 animate-pulse" style={{ animationDelay: '1.5s' }}>
            ✨
          </div>
        </div>
      )}

      {/* =========================================================================
          LOCATION 3: НЕОНОВЫЙ КИБЕРПАРК (Cyberpunk Synthwave Megacity)
          ========================================================================= */}
      {zoneId === 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep Synthwave Night Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-fuchsia-950/90 to-slate-950" />

          {/* Giant Cyber Neon Moon */}
          <div className="absolute top-4 right-8 w-24 h-24 rounded-full bg-gradient-to-br from-fuchsia-400 via-pink-500 to-purple-600 blur-xs shadow-[0_0_80px_rgba(236,72,153,0.9)] animate-pulse" />
          <div className="absolute top-7 right-11 text-4xl">🌙</div>

          {/* Laser Sky Grid */}
          <div className="absolute top-0 inset-x-0 h-40 opacity-25 bg-[linear-gradient(to_right,#a855f7_1px,transparent_1px),linear-gradient(to_bottom,#a855f7_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Flying Cyber Drones & Lasers */}
          <div className="absolute top-10 left-10 text-2xl opacity-80 animate-float-slow">🛸</div>
          <div className="absolute top-20 right-1/3 text-xl opacity-75 animate-float-slow" style={{ animationDelay: '2.5s' }}>
            🛸
          </div>
          <div className="absolute top-14 left-1/2 text-base text-cyan-400 animate-pulse">⚡</div>

          {/* Cyber Megacity Skyline Silhouettes with Neon Windows */}
          <div className="absolute bottom-36 inset-x-0 flex items-end justify-between px-2 opacity-50 text-4xl pointer-events-none">
            <span>🏙️</span>
            <span>🏢</span>
            <span>🏙️</span>
            <span>🌆</span>
            <span>🏢</span>
            <span>🏙️</span>
          </div>

          {/* Neon Grid Plaza Floor */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-slate-950 via-purple-950/80 to-indigo-950 border-t-2 border-cyan-400/60 shadow-[0_-10px_30px_rgba(6,182,212,0.4)]" />

          {/* Glowing Digital Grid Floor Perspective */}
          <div className="absolute bottom-0 inset-x-0 h-48 opacity-35 bg-[linear-gradient(to_right,#06b6d4_2px,transparent_2px),linear-gradient(to_bottom,#ec4899_2px,transparent_2px)] [background-size:32px_32px]" />

          {/* Holographic Trees & High-Tech Cyber Props */}
          <div className="absolute bottom-28 left-4 text-4xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
            🔮
          </div>
          <div className="absolute bottom-38 left-14 text-2xl filter drop-shadow animate-pulse">💎</div>
          <div className="absolute bottom-28 right-5 text-4xl filter drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
            🔮
          </div>
          <div className="absolute bottom-36 right-16 text-3xl filter drop-shadow">👾</div>

          {/* Cyber Pavement Details */}
          <div className="absolute bottom-10 left-16 text-xl text-cyan-300">⚡</div>
          <div className="absolute bottom-14 right-24 text-xl text-pink-400">⚡</div>
          <div className="absolute bottom-6 left-1/3 text-2xl">🤖</div>
          <div className="absolute bottom-8 right-1/4 text-2xl">🕹️</div>
          <div className="absolute bottom-12 left-1/4 text-lg text-cyan-400">💿</div>

          {/* Drifting Cyber Sparks */}
          <div className="absolute bottom-40 left-1/2 text-sm text-cyan-300 animate-pulse">✨</div>
          <div className="absolute bottom-24 left-24 text-xs text-fuchsia-300 animate-pulse" style={{ animationDelay: '1.2s' }}>
            ✨
          </div>
          <div className="absolute bottom-32 right-32 text-xs text-cyan-200 animate-pulse" style={{ animationDelay: '2s' }}>
            ✨
          </div>
        </div>
      )}

      {/* =========================================================================
          LOCATION 4: ЛАВОВЫЕ ЗЕМЛИ (Volcanic Magma Caldera & Fire Geysers)
          ========================================================================= */}
      {zoneId === 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep Dark Crimson Volcanic Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-red-950 to-orange-950" />

          {/* Blazing Red/Orange Magma Caldera Glow */}
          <div className="absolute top-4 left-1/3 w-32 h-32 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 blur-2xl opacity-60 animate-pulse" />
          <div className="absolute top-6 left-1/3 text-4xl">🌋</div>

          {/* Smoke and Ash Clouds */}
          <div className="absolute top-8 left-10 text-3xl opacity-60 animate-float-slow">☁️</div>
          <div className="absolute top-16 right-16 text-3xl opacity-50 animate-float-slow" style={{ animationDelay: '2s' }}>
            💨
          </div>

          {/* Distant Volcanic Mountains Silhouette */}
          <svg
            className="absolute bottom-36 w-full h-36 opacity-70 preserve-3d"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#450a0a"
              d="M0,192L80,181.3C160,171,320,149,480,165.3C640,181,800,235,960,229.3C1120,224,1280,160,1360,128L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            />
          </svg>

          {/* Molten Lava River Ground Base */}
          <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-slate-950 via-red-950 to-orange-900 border-t-2 border-orange-500/70 shadow-[0_-10px_35px_rgba(249,115,22,0.45)]" />

          {/* Fiery Magma Crack Lines */}
          <div className="absolute bottom-0 inset-x-0 h-44 opacity-40 bg-[radial-gradient(#ea580c_1.5px,transparent_1.5px)] [background-size:20px_20px]" />

          {/* Animated Lava Geysers and Volcanic Props */}
          <div className="absolute bottom-28 left-4 text-4xl filter drop-shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-bounce" style={{ animationDuration: '2.5s' }}>
            🔥
          </div>
          <div className="absolute bottom-36 left-16 text-2xl filter drop-shadow animate-pulse">🪨</div>
          <div className="absolute bottom-28 right-5 text-4xl filter drop-shadow-[0_0_15px_rgba(249,115,22,0.9)] animate-bounce" style={{ animationDuration: '3s' }}>
            🔥
          </div>
          <div className="absolute bottom-36 right-16 text-3xl filter drop-shadow">☄️</div>

          {/* Obsidian Ground Details */}
          <div className="absolute bottom-10 left-16 text-xl">🪨</div>
          <div className="absolute bottom-12 right-24 text-xl">🔥</div>
          <div className="absolute bottom-6 left-1/3 text-2xl animate-pulse">💎</div>
          <div className="absolute bottom-8 right-1/4 text-2xl">🌋</div>
          <div className="absolute bottom-12 left-1/4 text-lg">✨</div>

          {/* Drifting Sparks & Fire Embers */}
          <div className="absolute bottom-40 left-1/2 text-sm text-orange-400 animate-pulse">✨</div>
          <div className="absolute bottom-24 left-24 text-xs text-amber-300 animate-pulse" style={{ animationDelay: '1s' }}>
            ✨
          </div>
          <div className="absolute bottom-32 right-32 text-xs text-red-400 animate-pulse" style={{ animationDelay: '2s' }}>
            ✨
          </div>
        </div>
      )}

      {/* =========================================================================
          LOCATION 5: КОСМИЧЕСКИЙ ОАЗИС (Interstellar Nebula & Asteroid Base)
          ========================================================================= */}
      {zoneId === 5 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Deep Cosmic Void */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-950 to-purple-950" />

          {/* Interstellar Nebula Clouds */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/20 filter blur-3xl" />
          <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-cyan-600/20 filter blur-3xl" />

          {/* Majestic Ringed Planet Saturn */}
          <div className="absolute top-6 left-8 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-300 via-purple-400 to-indigo-700 blur-xs shadow-[0_0_60px_rgba(129,140,248,0.7)] animate-pulse" />
          <div className="absolute top-8 left-10 text-4xl">🪐</div>

          {/* Spiral Galaxy & Stars */}
          <div className="absolute top-10 right-12 text-3xl opacity-85 animate-spin" style={{ animationDuration: '40s' }}>
            🌌
          </div>
          <div className="absolute top-20 right-1/3 text-xl opacity-90 animate-bounce" style={{ animationDuration: '4s' }}>
            🌠
          </div>

          {/* Starfield particles */}
          <div className="absolute top-16 left-1/3 text-xs text-white animate-pulse">⭐</div>
          <div className="absolute top-32 right-20 text-xs text-yellow-200 animate-pulse" style={{ animationDelay: '1s' }}>
            ⭐
          </div>
          <div className="absolute top-24 left-1/2 text-sm text-cyan-200 animate-pulse" style={{ animationDelay: '2.5s' }}>
            ✨
          </div>
          <div className="absolute top-44 left-14 text-xs text-fuchsia-200 animate-pulse" style={{ animationDelay: '1.8s' }}>
            ✨
          </div>

          {/* Low-Gravity Floating Asteroid Platform (SVG) */}
          <svg
            className="absolute bottom-0 w-full h-56 preserve-3d drop-shadow-2xl"
            viewBox="0 0 1440 320"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              fill="#1e1b4b"
              d="M0,128L60,117.3C120,107,240,85,360,106.7C480,128,600,192,720,186.7C840,181,960,107,1080,85.3C1200,64,1320,96,1380,112L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>

          {/* Asteroid Lunar Rock Base */}
          <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-slate-950 via-slate-900 to-indigo-950 border-t border-purple-500/40" />

          {/* Bioluminescent Cosmic Flora & Space Gear */}
          <div className="absolute bottom-28 left-6 text-4xl filter drop-shadow-[0_0_15px_rgba(192,132,252,0.9)] animate-pulse">
            🔮
          </div>
          <div className="absolute bottom-36 left-16 text-3xl filter drop-shadow animate-float-slow">💎</div>
          <div className="absolute bottom-28 right-6 text-4xl filter drop-shadow-[0_0_15px_rgba(56,189,248,0.9)] animate-pulse">
            📡
          </div>
          <div className="absolute bottom-36 right-16 text-3xl filter drop-shadow">🛸</div>

          {/* Alien Minerals & Details */}
          <div className="absolute bottom-8 left-16 text-2xl">🍄</div>
          <div className="absolute bottom-12 right-24 text-2xl">🚀</div>
          <div className="absolute bottom-6 left-1/3 text-2xl animate-float-slow">👽</div>
          <div className="absolute bottom-10 right-1/4 text-2xl">🛰️</div>
          <div className="absolute bottom-4 left-1/2 text-xl">☄️</div>

          {/* Cosmic Stardust Sparkles */}
          <div className="absolute bottom-40 left-1/2 text-sm text-purple-300 animate-pulse">✨</div>
          <div className="absolute bottom-24 left-24 text-xs text-cyan-300 animate-pulse" style={{ animationDelay: '1s' }}>
            ✨
          </div>
          <div className="absolute bottom-32 right-32 text-xs text-indigo-200 animate-pulse" style={{ animationDelay: '2s' }}>
            ✨
          </div>
        </div>
      )}

      {/* =========================================================================
          CENTRAL LABORATORY BUILDING (THEMED SKIN PER LOCATION)
          ========================================================================= */}
      <div
        id="territory-lab-building"
        onClick={onLabClick}
        className={`absolute top-12 left-1/2 -translate-x-1/2 z-10 cursor-pointer group flex flex-col items-center transition-transform active:scale-95 ${
          tutorialStep === 0 ? 'animate-pulse' : ''
        }`}
      >
        {/* Tutorial Pointer Hint */}
        {tutorialStep === 0 && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce whitespace-nowrap z-30">
            👉 НАЖМИ НА ЛАБОРАТОРИЮ!
          </div>
        )}

        {/* Building Skin by Zone */}
        {zoneId === 1 && (
          /* Fairytale Alchemist Cottage */
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl bg-gradient-to-b from-emerald-700 via-teal-900 to-slate-900 border-4 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] flex flex-col items-center justify-center group-hover:scale-105 transition-all">
            {/* Glass Turret with bubbling potion */}
            <div className="absolute -top-4 w-14 h-8 bg-emerald-400/30 rounded-t-full border-t-2 border-x-2 border-emerald-300 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs animate-ping opacity-70">✨</span>
            </div>
            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform">
              🧪
            </span>
            <div className="mt-1 bg-slate-950/90 border border-emerald-400/60 px-2.5 py-0.5 rounded-full text-[11px] font-black text-emerald-200 tracking-wider flex items-center gap-1">
              <Dna className="w-3 h-3 text-emerald-400" />
              <span>ЛАБОРАТОРИЯ</span>
            </div>
          </div>
        )}

        {zoneId === 2 && (
          /* Tropical Tiki Beach Cabana Lab */
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl bg-gradient-to-b from-amber-600 via-orange-800 to-amber-950 border-4 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] flex flex-col items-center justify-center group-hover:scale-105 transition-all">
            {/* Palm Thatch Roof */}
            <div className="absolute -top-4 w-16 h-8 bg-amber-400/40 rounded-t-full border-t-2 border-x-2 border-amber-300 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs">🌴</span>
            </div>
            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform">
              🍹
            </span>
            <div className="mt-1 bg-slate-950/90 border border-amber-400/60 px-2.5 py-0.5 rounded-full text-[11px] font-black text-amber-200 tracking-wider flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>ПЛЯЖНАЯ ЛАБА</span>
            </div>
          </div>
        )}

        {zoneId === 3 && (
          /* Cyberpunk Matrix Lab */
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl bg-gradient-to-b from-fuchsia-800 via-purple-900 to-slate-950 border-4 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.7)] flex flex-col items-center justify-center group-hover:scale-105 transition-all">
            {/* Neon Quantum Emitter */}
            <div className="absolute -top-4 w-14 h-8 bg-cyan-400/40 rounded-t-full border-t-2 border-x-2 border-cyan-300 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs animate-pulse text-cyan-200">⚡</span>
            </div>
            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform">
              🧬
            </span>
            <div className="mt-1 bg-slate-950/90 border border-cyan-400/70 px-2.5 py-0.5 rounded-full text-[11px] font-black text-cyan-200 tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>КИБЕР-РЕАКТОР</span>
            </div>
          </div>
        )}

        {zoneId === 4 && (
          /* Volcanic Magma Forge Lab */
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl bg-gradient-to-b from-orange-700 via-red-900 to-slate-950 border-4 border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.7)] flex flex-col items-center justify-center group-hover:scale-105 transition-all">
            {/* Volcanic Chimney with sparks */}
            <div className="absolute -top-4 w-14 h-8 bg-orange-500/40 rounded-t-full border-t-2 border-x-2 border-orange-300 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs animate-pulse text-amber-200">🔥</span>
            </div>
            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform">
              🌋
            </span>
            <div className="mt-1 bg-slate-950/90 border border-orange-400/70 px-2.5 py-0.5 rounded-full text-[11px] font-black text-orange-200 tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(249,115,22,0.5)]">
              <Flame className="w-3 h-3 text-orange-400" />
              <span>ЛАВО-КУЗНЯ</span>
            </div>
          </div>
        )}

        {zoneId === 5 && (
          /* Orbital Space Station Lab */
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 rounded-3xl bg-gradient-to-b from-indigo-700 via-slate-900 to-black border-4 border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.7)] flex flex-col items-center justify-center group-hover:scale-105 transition-all">
            {/* Orbital Dome & Antenna */}
            <div className="absolute -top-4 w-14 h-8 bg-purple-400/40 rounded-t-full border-t-2 border-x-2 border-purple-300 backdrop-blur-xs flex items-center justify-center">
              <Radio className="w-3.5 h-3.5 text-purple-200 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform">
              🛰️
            </span>
            <div className="mt-1 bg-slate-950/90 border border-purple-400/70 px-2.5 py-0.5 rounded-full text-[11px] font-black text-purple-200 tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>ОРБИТА-1</span>
            </div>
          </div>
        )}
      </div>

      {/* RENDER ACTIVE CREATURES AND GROUND PICKUPS */}
      {children}
    </div>
  );
};
