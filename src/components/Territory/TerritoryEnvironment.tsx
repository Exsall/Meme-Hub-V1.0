import React from 'react';
import { ZONES } from '../../data/gameData';

interface TerritoryEnvironmentProps {
  zoneId: number;
  tutorialStep?: number;
  children: React.ReactNode;
}

export const TerritoryEnvironment: React.FC<TerritoryEnvironmentProps> = ({
  zoneId,
  children,
}) => {
  const currentZone = ZONES.find((z) => z.id === zoneId) || ZONES[0];
  const rawBackgroundImage = currentZone.backgroundImage || './assets/cartoon_meadow.png';
  // Yandex archive games can be hosted under a nested path, so public assets must
  // resolve relative to index.html instead of from the domain root.
  const bgImage = rawBackgroundImage.startsWith('/') ? `.${rawBackgroundImage}` : rawBackgroundImage;

  return (
    <div className="relative w-full h-full min-h-[540px] flex-1 overflow-hidden select-none bg-slate-950 transition-all duration-700">
      {/* =========================================================================
          LOCATION 1: ЗЕЛЁНАЯ ПОЛЯНА (Мультяшная полянка с ромашками - вид сверху)
          ========================================================================= */}
      {zoneId === 1 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Base cartoon meadow background texture */}
          <div
            className="absolute inset-0 bg-[#84c225]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: bgImage.endsWith('.svg') ? 'repeat' : 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: bgImage.endsWith('.svg') ? '480px 480px' : 'cover',
            }}
          />

          {/* Gentle sunbeam ambiance */}
          <div className="absolute -top-16 -left-12 w-[600px] h-[600px] bg-gradient-to-br from-yellow-100/20 via-amber-100/5 to-transparent blur-3xl transform rotate-12 pointer-events-none" />

          {/* Floating Friendly Butterflies */}
          <div className="absolute top-[32%] left-[18%] text-xl opacity-90 animate-bounce" style={{ animationDuration: '3.2s' }}>
            🦋
          </div>
          <div className="absolute top-[62%] right-[22%] text-lg opacity-85 animate-bounce" style={{ animationDuration: '4s' }}>
            🦋
          </div>

          {/* Ambient Spores / Dandelion Fluff */}
          <div className="absolute top-1/4 left-1/3 text-yellow-100 text-xs animate-ember-1">✨</div>
          <div className="absolute bottom-1/3 right-1/4 text-amber-100 text-xs animate-ember-2">✨</div>
          <div className="absolute bottom-20 left-1/4 text-emerald-100 text-xs animate-ember-3">✨</div>

          {/* Soft Vignettes for crisp UI contrast */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>
      )}

      {/* =========================================================================
          LOCATION 2: ТРОПИЧЕСКИЙ ОСТРОВ (Top-Down Cartoon Island with Lagoons & Reefs)
          ========================================================================= */}
      {zoneId === 2 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Base Tropical Island Map Asset */}
          <div
            className="absolute inset-0 bg-[#00a8e8]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />

          {/* Tropical Ocean Water Ripple & Caustics Motion Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#ffffff_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-25 animate-pulse pointer-events-none" />

          {/* Animated Water Caustics Shimmer */}
          <div className="absolute top-[8%] left-[8%] text-cyan-100 text-xs animate-ember-1">✨</div>
          <div className="absolute top-[16%] right-[14%] text-cyan-200 text-sm animate-ember-2">✨</div>
          <div className="absolute bottom-[24%] left-[12%] text-amber-100 text-xs animate-ember-3">✨</div>
          <div className="absolute bottom-[16%] right-[16%] text-cyan-100 text-sm animate-ember-1">✨</div>

          {/* Dynamic Floating Animated Tropical Butterflies over the Island */}
          <div
            className="absolute top-[32%] left-[36%] text-2xl filter drop-shadow-md animate-bounce pointer-events-none"
            style={{ animationDuration: '3.6s' }}
          >
            🦋
          </div>
          <div
            className="absolute top-[52%] right-[28%] text-xl filter drop-shadow-md animate-bounce pointer-events-none"
            style={{ animationDuration: '4.4s', animationDelay: '1.2s' }}
          >
            🦋
          </div>
          <div
            className="absolute top-[66%] left-[24%] text-lg filter drop-shadow-md animate-bounce pointer-events-none"
            style={{ animationDuration: '5s', animationDelay: '0.8s' }}
          >
            🦋
          </div>

          {/* Soft vignettes for crisp UI text readability */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        </div>
      )}

      {/* =========================================================================
          LOCATION 3: НЕОНОВЫЙ КИБЕР-МЕГАПОЛИС (Top-Down Cyberpunk City & Maglev Highway)
          ========================================================================= */}
      {zoneId === 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Base Cyberpunk Metropolis Map Asset */}
          <div
            className="absolute inset-0 bg-[#090a16]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />

          {/* Cyber Scanline & Hologram Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] [background-size:100%_4px] opacity-25 pointer-events-none" />

          {/* Animated Neon Light Pulses & Cyber Sparkles */}
          <div className="absolute top-[26%] left-[32%] text-cyan-300 text-sm animate-ping opacity-60" style={{ animationDuration: '3s' }}>
            ✦
          </div>
          <div className="absolute top-[43%] right-[20%] text-fuchsia-400 text-sm animate-ping opacity-60" style={{ animationDuration: '3.6s', animationDelay: '1s' }}>
            ✦
          </div>
          <div className="absolute top-[12%] right-[35%] text-cyan-200 text-xs animate-ember-1">✨</div>
          <div className="absolute top-[52%] left-[18%] text-pink-300 text-xs animate-ember-2">✨</div>
          <div className="absolute bottom-[30%] right-[24%] text-cyan-300 text-xs animate-ember-3">✨</div>
          <div className="absolute bottom-[20%] left-[26%] text-fuchsia-300 text-xs animate-ember-1">✨</div>

          {/* Floating Holographic Glitch Particles */}
          <div
            className="absolute top-[28%] left-[28%] text-xl filter drop-shadow-[0_0_12px_rgba(6,182,212,0.9)] animate-pulse pointer-events-none"
            style={{ animationDuration: '2.5s' }}
          >
            🔮
          </div>
          <div
            className="absolute top-[44%] right-[22%] text-xl filter drop-shadow-[0_0_12px_rgba(236,72,153,0.9)] animate-pulse pointer-events-none"
            style={{ animationDuration: '3s', animationDelay: '0.8s' }}
          >
            🌸
          </div>

          {/* Soft vignettes for crisp UI text readability */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
        </div>
      )}

      {/* =========================================================================
          LOCATION 4: ЛАВОВЫЕ ЗЕМЛИ (Top-Down Magma Caldera & Basalt Ridges)
          ========================================================================= */}
      {zoneId === 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 bg-[#180a0a]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />

          {/* Magma Embers & Sparks */}
          <div className="absolute top-1/4 left-1/3 text-orange-400 text-xs animate-ember-1">✨</div>
          <div className="absolute bottom-1/3 right-1/4 text-amber-300 text-xs animate-ember-2">✨</div>
          <div className="absolute bottom-20 left-1/4 text-red-400 text-xs animate-ember-3">✨</div>
          <div className="absolute top-[40%] right-[15%] text-orange-300 text-sm animate-pulse">🔥</div>

          {/* Soft Vignettes */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        </div>
      )}

      {/* =========================================================================
          LOCATION 5: КОСМИЧЕСКИЙ ОАЗИС (Top-Down Orbital Station & Deep Nebula)
          ========================================================================= */}
      {zoneId === 5 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div
            className="absolute inset-0 bg-[#030208]"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
            }}
          />

          {/* Stardust motes */}
          <div className="absolute top-1/4 left-1/4 text-purple-300 text-xs animate-ember-1">✨</div>
          <div className="absolute top-[30%] right-1/3 text-cyan-300 text-xs animate-ember-2">✨</div>
          <div className="absolute bottom-1/3 right-1/4 text-indigo-200 text-xs animate-ember-3">✨</div>

          {/* Soft Vignettes */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
        </div>
      )}

      {/* RENDER ACTIVE CREATURES AND GROUND PICKUPS */}
      {children}
    </div>
  );
};
