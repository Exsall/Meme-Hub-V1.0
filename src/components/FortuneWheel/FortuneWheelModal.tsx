import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  Trophy,
  Clock,
  CheckCircle2,
  RotateCw,
  Gift,
  Coins,
  Tv,
  Play,
  Volume2,
  VolumeX,
  Award,
  PlusCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { WHEEL_SECTORS } from '../../data/gameData';
import { WheelSector } from '../../types/game';
import { soundManager } from '../../utils/audio';
import { GAME_CONFIG } from '../../config/gameConfig';

interface FortuneWheelModalProps {
  onClose: () => void;
}

// Fun meme sponsors for the ad spin
const WHEEL_SPONSORS = [
  {
    brand: 'Кото-Кола 🥤🐾',
    slogan: 'Освежающий напиток для самых мемных исследователей!',
    tagline: 'Содержит 100% натуральный экстракт валерьянки и пузырьков радости.',
    icon: '🥤',
    color: 'from-rose-600 to-amber-600',
  },
  {
    brand: 'Энергетик «Шаур-Мяу» 🌯⚡',
    slogan: 'Заряжает на мега-вращение колеса и выбивание Джекпота!',
    tagline: 'Одобрено ассоциацией боевых хомяков и капибар.',
    icon: '⚡',
    color: 'from-amber-600 to-yellow-500',
  },
  {
    brand: 'Лаборатория Будущего 2077 🧬✨',
    slogan: 'Создавай немыслимых существ вместе с нами!',
    tagline: 'Больше мемности — больше пассивного дохода на твоей полянке.',
    icon: '🧬',
    color: 'from-purple-600 to-indigo-600',
  },
  {
    brand: 'Доставка Пиццы «Чебурек-Кэт» 🍕😼',
    slogan: 'Самая хрустящая пицца для твоих покемемов!',
    tagline: 'Доставляем на капибаре прямо к твоей палатке за 5 минут.',
    icon: '🍕',
    color: 'from-orange-600 to-red-600',
  },
];

export const FortuneWheelModal: React.FC<FortuneWheelModalProps> = ({ onClose }) => {
  const {
    wheelSpinsCount,
    canClaimDailyWheelSpin,
    canClaimAdWheelSpin,
    canSpinWheelNow,
    getWheelCooldownRemaining,
    getWheelAdCooldownRemaining,
    claimDailyWheelSpin,
    claimAdWheelSpin,
    spinWheel,
    claimWheelReward,
    devResetWheelCooldown,
    devAddWheelSpins,
    setIsQuestsOpen,
  } = useGame();

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [wonSector, setWonSector] = useState<WheelSector | null>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timers
  const [cooldownSec, setCooldownSec] = useState<number>(getWheelCooldownRemaining());
  const [adCooldownSec, setAdCooldownSec] = useState<number>(getWheelAdCooldownRemaining());

  // Ad playback simulation states
  const [isPlayingAd, setIsPlayingAd] = useState<boolean>(false);
  const [isAdFinished, setIsAdFinished] = useState<boolean>(false);
  const [adTimer, setAdTimer] = useState<number>(5);
  const [adSponsor, setAdSponsor] = useState(WHEEL_SPONSORS[0]);
  const [adMuted, setAdMuted] = useState<boolean>(false);

  const spinDurationMs = GAME_CONFIG.wheel?.spinDurationMs || 4500;
  const tickIntervalRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef<number>(0);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Live countdown timers
  useEffect(() => {
    setCooldownSec(getWheelCooldownRemaining());
    setAdCooldownSec(getWheelAdCooldownRemaining());

    const interval = setInterval(() => {
      setCooldownSec(getWheelCooldownRemaining());
      setAdCooldownSec(getWheelAdCooldownRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getWheelCooldownRemaining, getWheelAdCooldownRemaining]);

  // Clean up tick intervals on unmount
  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
      }
    };
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Claim daily free spin
  const handleClaimDaily = () => {
    if (!canClaimDailyWheelSpin) return;
    const success = claimDailyWheelSpin();
    if (success) {
      showToast('🎉 +1 Бесплатный спин добавлен в копилку!');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#10b981'],
        });
      } catch (e) {}
    }
  };

  // Start watching ad for bonus spin
  const handleStartAdSpin = () => {
    if (isSpinning || (!canClaimAdWheelSpin && adCooldownSec > 0)) return;
    soundManager.playClick();

    const randomSponsor = WHEEL_SPONSORS[Math.floor(Math.random() * WHEEL_SPONSORS.length)];
    setAdSponsor(randomSponsor);
    setIsPlayingAd(true);
    setIsAdFinished(false);
    setAdTimer(5);
  };

  // Timer countdown while ad is playing
  useEffect(() => {
    if (!isPlayingAd) return;

    if (adTimer > 0) {
      const timer = setTimeout(() => {
        setAdTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Ad playback completed -> show claim screen
      setIsAdFinished(true);
      soundManager.playPositiveEvent();
    }
  }, [isPlayingAd, adTimer]);

  // Claim spin after ad completion
  const handleClaimAdSpin = () => {
    const success = claimAdWheelSpin();
    setIsPlayingAd(false);
    setIsAdFinished(false);
    if (success) {
      showToast('📺 +1 Рекламный спин добавлен в копилку!');
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#ec4899', '#f59e0b'],
        });
      } catch (e) {}
    }
  };

  // Perform physical wheel spinning
  const executeSpin = () => {
    if (isSpinning || wheelSpinsCount <= 0) return;
    soundManager.playClick();

    const result = spinWheel();
    if (!result.success || !result.sector) return;

    const winner = result.sector;
    const sectorCount = WHEEL_SECTORS.length;
    const sectorAngle = 360 / sectorCount; // 45 deg
    const sectorIndex = WHEEL_SECTORS.findIndex((s) => s.id === winner.id);

    const extraFullRotations = 360 * (5 + Math.floor(Math.random() * 2)); // 5-6 full turns
    const sectorCenterOffset = sectorIndex * sectorAngle + sectorAngle / 2;
    const randomSliceOffset = (Math.random() - 0.5) * (sectorAngle * 0.65);
    const nextTargetDegrees =
      rotationDegrees +
      extraFullRotations +
      (360 - (rotationDegrees % 360)) +
      (360 - sectorCenterOffset + randomSliceOffset);

    setIsSpinning(true);
    setWonSector(null);
    setIsClaimed(false);
    setRotationDegrees(nextTargetDegrees);

    // Play procedural ticking sounds during the spin
    let currentDeg = rotationDegrees;
    const startTime = Date.now();
    lastTickAngleRef.current = currentDeg;

    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

    tickIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / spinDurationMs);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const estimatedCurrentDeg = rotationDegrees + (nextTargetDegrees - rotationDegrees) * easeOut;

      if (Math.abs(estimatedCurrentDeg - lastTickAngleRef.current) >= sectorAngle * 0.8) {
        soundManager.playWheelTick();
        lastTickAngleRef.current = estimatedCurrentDeg;
      }

      if (progress >= 1) {
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      }
    }, 50);

    // Spin completion
    setTimeout(() => {
      setIsSpinning(false);
      setWonSector(winner);
      soundManager.playPositiveEvent();

      try {
        confetti({
          particleCount: winner.rarity === 'legendary' ? 120 : winner.rarity === 'epic' ? 80 : 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#f97316'],
        });
      } catch (e) {
        // Fallback
      }
    }, spinDurationMs + 100);
  };

  const handleClaimReward = () => {
    if (!wonSector || isClaimed) return;
    claimWheelReward(wonSector);
    setIsClaimed(true);
    showToast(`🎁 Награда «${wonSector.label}» получена!`);
    setTimeout(() => {
      setWonSector(null);
      setIsClaimed(false);
    }, 1200);
  };

  const numSectors = WHEEL_SECTORS.length;
  const radius = 140;
  const center = 150;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col items-center text-center my-auto">
        {/* Glow ambient effects */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs px-4 py-2 rounded-full shadow-2xl border-2 border-white animate-bounce flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Close Button */}
        {!isSpinning && !isPlayingAd && (
          <button
            id="close-fortune-wheel-modal-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 z-20"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isPlayingAd ? (
          /* AD PLAYBACK & CLAIM SCREEN */
          <div className="w-full flex flex-col items-center py-2 animate-fade-in">
            {/* Ad header */}
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/90 text-amber-300 px-3 py-1 rounded-full border border-slate-700 font-bold">
                <Tv className="w-3.5 h-3.5 animate-pulse" />
                <span>Спонсорский ролик за +1 Спин</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdMuted(!adMuted)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  {adMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black font-mono">
                  {isAdFinished ? 'Готово!' : `${adTimer} сек`}
                </div>
              </div>
            </div>

            {/* Video Player Box */}
            <div
              className={`relative w-full aspect-video rounded-2xl bg-gradient-to-br ${adSponsor.color} p-6 flex flex-col justify-between items-center text-white shadow-xl overflow-hidden border border-white/20`}
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

              <div className="z-10 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
                <span>{adSponsor.icon}</span>
                <span>{adSponsor.brand}</span>
              </div>

              <div className="z-10 text-center my-auto">
                <p className="text-xl sm:text-2xl font-black drop-shadow-md">
                  {adSponsor.slogan}
                </p>
                <p className="text-xs text-white/80 mt-1 max-w-xs drop-shadow">
                  {adSponsor.tagline}
                </p>
              </div>

              <div className="z-10 w-full flex items-center justify-between text-[11px] font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <span>Награда за просмотр:</span>
                <span className="text-amber-300 font-black">🎡 +1 Спин в копилку!</span>
              </div>
            </div>

            {/* Progress Bar or Claim Button */}
            {!isAdFinished ? (
              <div className="w-full mt-4">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Досмотрите ролик (5 сек), чтобы забрать прокрут!
                </p>
              </div>
            ) : (
              <div className="w-full mt-4 flex flex-col items-center animate-fade-in">
                <button
                  id="claim-ad-spin-after-video-btn"
                  onClick={handleClaimAdSpin}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5 fill-current" />
                  <span>Забрать прокрут (+1 🎡)</span>
                </button>
                <p className="text-[11px] text-emerald-400 font-bold mt-2">
                  Ролик завершен! Нажмите кнопку, чтобы добавить спин в баланс.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* MAIN WHEEL & SPIN BANK VIEW */
          <>
            {/* Header Badge & Quest shortcut */}
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Колесо Фортуны (24ч)</span>
              </div>

              {/* Shortcut to wheel achievements */}
              <button
                id="wheel-achievements-btn"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                  setIsQuestsOpen(true);
                }}
                className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-700 transition-all"
                title="Посмотреть достижения за прокруты колеса"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Задания</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🎡 Мемное Колесо Фортуны</span>
            </h2>

            {/* Prominent Banked Spins Counter */}
            <div className="my-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400/60 flex items-center gap-2.5 shadow-lg shadow-amber-500/10">
              <span className="text-xl">🎡</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Доступно прокрутов:
                </span>
                <span className="text-xl font-black text-amber-300 font-mono">
                  {wheelSpinsCount}
                </span>
              </div>
              {wheelSpinsCount > 0 && (
                <span className="ml-auto bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                  ГОТОВО К СПИНУ
                </span>
              )}
            </div>

            {/* WHEEL CANVAS */}
            <div className="relative my-2 flex items-center justify-center">
              {/* Top Pointer Indicator */}
              <div
                className="absolute -top-3 z-30 flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] animate-bounce"
                style={{ animationDuration: '1.5s' }}
              >
                <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-yellow-400 filter drop-shadow" />
                <div className="w-3 h-3 -mt-6 bg-red-600 rounded-full border-2 border-white" />
              </div>

              {/* Outer Ring */}
              <div className="relative p-2 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 shadow-[0_0_30px_rgba(245,158,11,0.4)] border-4 border-slate-900">
                {/* SVG Wheel */}
                <svg
                  width="270"
                  height="270"
                  viewBox="0 0 300 300"
                  className="rounded-full shadow-inner"
                  style={{
                    transform: `rotate(${rotationDegrees}deg)`,
                    transition: isSpinning
                      ? `transform ${spinDurationMs}ms cubic-bezier(0.15, 0.9, 0.22, 1)`
                      : 'none',
                  }}
                >
                  <defs>
                    <radialGradient id="wheelHubGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="60%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </radialGradient>
                  </defs>

                  {WHEEL_SECTORS.map((sector, index) => {
                    const anglePerSector = 360 / numSectors;
                    const startAngle = index * anglePerSector - 90;
                    const endAngle = (index + 1) * anglePerSector - 90;

                    const startRad = (startAngle * Math.PI) / 180;
                    const endRad = (endAngle * Math.PI) / 180;

                    const x1 = center + radius * Math.cos(startRad);
                    const y1 = center + radius * Math.sin(startRad);
                    const x2 = center + radius * Math.cos(endRad);
                    const y2 = center + radius * Math.sin(endRad);

                    const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;

                    const midAngle = startAngle + anglePerSector / 2;
                    const midRad = (midAngle * Math.PI) / 180;
                    const textRadius = radius * 0.65;
                    const tx = center + textRadius * Math.cos(midRad);
                    const ty = center + textRadius * Math.sin(midRad);

                    return (
                      <g key={sector.id}>
                        <path
                          d={pathData}
                          fill={sector.color}
                          stroke="#0f172a"
                          strokeWidth="2.5"
                        />

                        {/* Sector Content */}
                        <g transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90})`}>
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            y="-14"
                            fontSize="18"
                          >
                            {sector.icon}
                          </text>
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            y="6"
                            fill={sector.textColor}
                            fontWeight="900"
                            fontSize="10"
                            letterSpacing="0.2"
                          >
                            {sector.label}
                          </text>
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            y="17"
                            fill={sector.textColor}
                            opacity="0.85"
                            fontWeight="700"
                            fontSize="7"
                          >
                            {sector.sublabel}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  {/* Decorative Studs */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const studAngle = (i * (360 / 16) * Math.PI) / 180;
                    const sx = center + (radius - 5) * Math.cos(studAngle);
                    const sy = center + (radius - 5) * Math.sin(studAngle);
                    return (
                      <circle
                        key={`stud-${i}`}
                        cx={sx}
                        cy={sy}
                        r="2.5"
                        fill="#ffffff"
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>

                {/* Center Core Hub Spin Button */}
                <button
                  id="center-wheel-spin-btn"
                  disabled={isSpinning || wheelSpinsCount <= 0}
                  onClick={executeSpin}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black border-4 border-slate-900 z-20 transition-all ${
                    isSpinning
                      ? 'bg-amber-400 scale-95 opacity-80 cursor-not-allowed'
                      : wheelSpinsCount > 0
                      ? 'bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.7)] cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                  title={wheelSpinsCount > 0 ? 'Крутить колесо (1 спин)' : 'У вас нет накопленных прокрутов'}
                >
                  {isSpinning ? (
                    <RotateCw className="w-6 h-6 animate-spin text-slate-950" />
                  ) : wheelSpinsCount > 0 ? (
                    <>
                      <span className="text-[11px] uppercase tracking-tighter leading-none font-black">
                        КРУТИ
                      </span>
                      <span className="text-[8px] bg-slate-950 text-amber-300 px-1 py-0.2 rounded-full font-mono font-black mt-0.5">
                        x{wheelSpinsCount}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">🔒</span>
                      <span className="text-[7px] uppercase font-bold text-slate-400 mt-0.5">
                        0 СПИНОВ
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* WINNING REWARD CARD */}
            {wonSector && (
              <div className="w-full bg-slate-950/90 border-2 border-amber-400/80 rounded-2xl p-3.5 my-2 flex flex-col items-center shadow-xl animate-fade-in">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Ваш Выигрыш!</span>
                </div>

                <div className="flex items-center gap-3 my-1">
                  <span className="text-4xl">{wonSector.icon}</span>
                  <div className="flex flex-col text-left">
                    <span className="text-lg font-black text-white">{wonSector.label}</span>
                    <span className="text-xs text-amber-300 font-bold">{wonSector.sublabel}</span>
                  </div>
                </div>

                <button
                  id="claim-wheel-reward-btn"
                  onClick={handleClaimReward}
                  disabled={isClaimed}
                  className={`mt-2 w-full py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isClaimed
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 hover:brightness-110 active:scale-98 shadow-amber-500/25'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Награда получена!</span>
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      <span>Забрать приз!</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* MAIN SEPARATE SPIN BUTTON */}
            {!wonSector && (
              <div className="w-full my-1">
                {wheelSpinsCount > 0 ? (
                  <button
                    id="main-spin-wheel-btn"
                    disabled={isSpinning}
                    onClick={executeSpin}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950 fill-current" />
                    <span>
                      {isSpinning
                        ? 'Колесо вращается...'
                        : `Крутить Колесо (Осталось: ${wheelSpinsCount} 🎡)`}
                    </span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-slate-800/80 text-slate-400 font-bold text-xs border border-slate-700/60 flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>Нет спинов. Заберите бесплатную прокрутку или посмотрите рекламу ниже!</span>
                  </button>
                )}
              </div>
            )}

            {/* SPIN ACCUMULATION MODULES (Free 24h & Ad 24h) */}
            <div className="w-full flex flex-col gap-2 mt-2 pt-2.5 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>Копилка прокрутов:</span>
                <span className="text-amber-300">Забирай и копи спины!</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Daily Free Spin Claim Button */}
                {canClaimDailyWheelSpin ? (
                  <button
                    id="claim-daily-wheel-spin-btn"
                    onClick={handleClaimDaily}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Забрать прокрутку (+1 🎡)</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Бесплатный:</span>
                    </div>
                    <span className="font-mono font-bold text-amber-300 text-xs">
                      {formatTimer(cooldownSec)}
                    </span>
                  </div>
                )}

                {/* 2. Ad Bonus Spin Claim / Watch Button */}
                {canClaimAdWheelSpin ? (
                  <button
                    id="watch-ad-for-wheel-spin-btn"
                    onClick={handleStartAdSpin}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white font-black text-xs shadow-md border border-indigo-400/40 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Tv className="w-4 h-4 text-amber-300" />
                    <span>Реклама (+1 спин 📺)</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <Tv className="w-3 h-3 text-indigo-400" />
                      <span>Реклама:</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-300 text-xs">
                      {formatTimer(adCooldownSec)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* SECTORS PREVIEW */}
            <div className="w-full mt-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Сектора и награды:
                </span>
                <span className="text-[10px] text-amber-400/90 font-bold">
                  8 уникальных призов
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {WHEEL_SECTORS.map((s) => (
                  <div
                    key={`preview-${s.id}`}
                    className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="text-[10px] font-bold text-slate-200 truncate w-full mt-0.5">
                      {s.label}
                    </span>
                    <span
                      className={`text-[8px] font-black uppercase px-1 rounded ${
                        s.rarity === 'legendary'
                          ? 'bg-amber-500/20 text-amber-400'
                          : s.rarity === 'epic'
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : s.rarity === 'rare'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s.rarity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DEV TOOLS */}
            {GAME_CONFIG.features.enableAdminPanel && (
              <div className="w-full mt-2 pt-2 border-t border-dashed border-slate-800 flex items-center justify-between">
                <button
                  id="dev-add-spins-btn"
                  onClick={() => {
                    devAddWheelSpins(5);
                    showToast('🔧 [Dev] Добавлено +5 спинов!');
                  }}
                  className="text-[10px] bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 px-2 py-0.5 rounded-lg font-mono hover:bg-emerald-800/60 transition-all"
                >
                  [Dev: +5 Спинов]
                </button>

                <button
                  id="dev-reset-wheel-btn"
                  onClick={() => {
                    devResetWheelCooldown();
                    setCooldownSec(0);
                    setAdCooldownSec(0);
                    setWonSector(null);
                    showToast('🔧 [Dev] Кулдауны сброшены!');
                  }}
                  className="text-[10px] bg-red-900/40 border border-red-700/50 text-red-300 px-2 py-0.5 rounded-lg font-mono hover:bg-red-800/60 transition-all"
                >
                  [Dev: Сброс КД]
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
