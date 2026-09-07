import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, CheckCircle2, Play, Tv, Coins, Award, Volume2, VolumeX, Flame, Zap } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BOOSTERS } from '../../data/gameData';
import { soundManager } from '../../utils/audio';

interface AdRewardModalProps {
  onClose: () => void;
}

// Fun animated sponsors for the in-game meme advertisement
const AD_SPONSORS = [
  {
    brand: 'Кото-Кола 🥤🐾',
    slogan: 'Освежающий напиток для самых мемных исследователей!',
    tagline: 'Содержит 100% натуральный экстракт валерьянки и пузырьков радости.',
    icon: '🥤',
    color: 'from-rose-600 to-amber-600',
  },
  {
    brand: 'Энергетик «Шаур-Мяу» 🌯⚡',
    slogan: 'Заряжает на скрещивание редких мутантов за секунду!',
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

export const AdRewardModal: React.FC<AdRewardModalProps> = ({ onClose }) => {
  const {
    adModalConfig,
    claimAdReward,
    getAdCooldownRemaining,
    getBoosterTimeRemaining,
  } = useGame();

  const rewardType = adModalConfig?.rewardType || 'coins';
  const boosterId = adModalConfig?.boosterId;
  const booster = boosterId ? BOOSTERS.find((b) => b.id === boosterId) : null;
  const isBoosterAd = rewardType === 'booster' && !!booster;

  const [remainingSec, setRemainingSec] = useState<number>(getAdCooldownRemaining());
  const activeBoosterTime = booster ? getBoosterTimeRemaining(booster.id) : 0;

  // Ad playback states
  const [isPlayingAd, setIsPlayingAd] = useState<boolean>(false);
  const [adTimer, setAdTimer] = useState<number>(5);
  const [adFinished, setAdFinished] = useState<boolean>(false);
  const [currentSponsor, setCurrentSponsor] = useState(AD_SPONSORS[0]);
  const [adMuted, setAdMuted] = useState<boolean>(false);

  // Live cooldown timer for coins reward
  useEffect(() => {
    if (isBoosterAd) return;
    setRemainingSec(getAdCooldownRemaining());
    const interval = setInterval(() => {
      setRemainingSec(getAdCooldownRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, [getAdCooldownRemaining, isBoosterAd]);

  // Handle playing simulated ad
  const handleStartAd = () => {
    if (!isBoosterAd && remainingSec > 0) return;
    if (isPlayingAd) return;
    soundManager.playClick();

    // Pick random sponsor
    const randomSponsor = AD_SPONSORS[Math.floor(Math.random() * AD_SPONSORS.length)];
    setCurrentSponsor(randomSponsor);

    setIsPlayingAd(true);
    setAdTimer(5);
    setAdFinished(false);
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
      // Ad is completed!
      if (isBoosterAd && booster) {
        claimAdReward('booster', booster.id);
      } else {
        claimAdReward('coins');
      }
      setIsPlayingAd(false);
      setAdFinished(true);
    }
  }, [isPlayingAd, adTimer, isBoosterAd, booster, claimAdReward]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatCooldownTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button (disabled during active ad playback) */}
        {!isPlayingAd && (
          <button
            id="close-ad-reward-modal-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isPlayingAd ? (
          /* ACTIVE AD PLAYBACK SCREEN */
          <div className="w-full flex flex-col items-center py-2 animate-fade-in">
            {/* Ad header */}
            <div className="w-full flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-1.5 bg-slate-800/90 text-amber-300 px-3 py-1 rounded-full border border-slate-700 font-bold">
                <Tv className="w-3.5 h-3.5 animate-pulse" />
                <span>Рекламный ролик спонсора</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdMuted(!adMuted)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  {adMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <div className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full font-black font-mono">
                  {adTimer} сек
                </div>
              </div>
            </div>

            {/* Simulated Video Player Container */}
            <div className={`relative w-full aspect-video rounded-2xl bg-gradient-to-br ${currentSponsor.color} p-6 flex flex-col justify-between items-center text-white shadow-xl overflow-hidden border border-white/20`}>
              {/* Animated decorative shapes */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/20 rounded-full blur-xl pointer-events-none" />

              <div className="z-10 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
                <span>{currentSponsor.icon}</span>
                <span>{currentSponsor.brand}</span>
              </div>

              <div className="z-10 text-center my-auto">
                <p className="text-xl sm:text-2xl font-black drop-shadow-md">
                  {currentSponsor.slogan}
                </p>
                <p className="text-xs text-white/80 mt-1 max-w-xs drop-shadow">
                  {currentSponsor.tagline}
                </p>
              </div>

              <div className="z-10 w-full flex items-center justify-between text-[11px] font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl">
                <span>Награда за просмотр:</span>
                {isBoosterAd && booster ? (
                  <span className="text-amber-300 font-black">
                    {booster.emoji} {booster.name} (+5 мин)
                  </span>
                ) : (
                  <span className="text-amber-300 font-black">+1 000 🪙</span>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Пожалуйста, досмотрите ролик до конца — бонус будет активирован автоматически!
            </p>
          </div>
        ) : adFinished ? (
          /* AD COMPLETED & REWARD CLAIMED SCREEN */
          <div className="w-full flex flex-col items-center py-4 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl mb-3 shadow-lg shadow-amber-500/20 animate-bounce">
              {isBoosterAd && booster ? booster.emoji : '🪙'}
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Реклама просмотрена</span>
            </div>

            <h2 className="text-2xl font-black text-white">
              {isBoosterAd && booster ? 'Буст активирован!' : 'Спасибо за просмотр!'}
            </h2>

            {isBoosterAd && booster ? (
              <>
                <div className="text-2xl font-black text-amber-300 my-2 flex items-center justify-center gap-2 drop-shadow">
                  <span>{booster.name}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-300 font-bold text-xs">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>+5:00 минут добавлено к таймеру!</span>
                </div>
                <p className="text-xs text-slate-300 max-w-xs mt-3 leading-relaxed">
                  {booster.description}
                </p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-amber-300 my-2 flex items-center justify-center gap-1.5 drop-shadow">
                  <span>+10 000</span>
                  <span className="text-2xl">🪙</span>
                </div>
                <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
                  Вы успешно посмотрели рекламный ролик спонсора и получили 10 000 золотых монет на свой баланс!
                </p>
              </>
            )}

            <button
              id="ad-reward-done-btn"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-lg hover:brightness-110 active:scale-98 transition-all"
            >
              {isBoosterAd ? 'Отлично, к игре!' : 'Забрать монеты!'}
            </button>
          </div>
        ) : isBoosterAd && booster ? (
          /* BOOSTER AD ACTIVATION SCREEN */
          <div className="w-full flex flex-col items-center py-2">
            {/* Header badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Tv className="w-3.5 h-3.5" />
              <span>Буст за рекламу</span>
            </div>

            <h2 className="text-2xl font-black text-white">{booster.name}</h2>

            <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
              Посмотри короткую рекламу спонсора (всего 5 сек) и{' '}
              <span className="text-amber-300 font-bold">активируй буст на 5 минут</span>!
            </p>

            {/* Central preview card */}
            <div className="relative my-4 flex flex-col items-center justify-center w-full bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-inner">
              <div className="text-5xl filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.3)] animate-pulse">
                {booster.emoji}
              </div>

              <div className="text-xl font-black text-amber-300 mt-2 flex items-center justify-center gap-1.5">
                <span>{booster.bonusBadge}</span>
              </div>

              {activeBoosterTime > 0 ? (
                <div className="flex items-center gap-2 mt-2.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span>Уже активно: {formatTimer(activeBoosterTime)}</span>
                  <span className="text-emerald-400">(продлит +5м)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-2 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Длительность: 5 минут</span>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
                {booster.description}
              </p>
            </div>

            {/* Start Ad Button */}
            <div className="w-full flex flex-col items-center">
              <button
                id="watch-ad-for-booster-btn"
                onClick={handleStartAd}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>
                  {activeBoosterTime > 0
                    ? 'Продлить за рекламу (+5 мин)'
                    : 'Смотреть рекламу (5 мин)'}
                </span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                Длительность ролика: 5 сек • 100% бесплатно
              </p>
            </div>
          </div>
        ) : (
          /* REGULAR 10000 COINS AD SCREEN */
          <div className="w-full flex flex-col items-center py-2">
            {/* Header badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Tv className="w-3.5 h-3.5" />
              <span>10 000 Монет за рекламу</span>
            </div>

            <h2 className="text-2xl font-black text-white">Смотри рекламу — получай монеты!</h2>

            <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
              Посмотрите короткий рекламный ролик спонсора (всего 5 секунд), чтобы поддержать лабораторию и{' '}
              <span className="text-amber-300 font-bold">гарантированно получить 10 000 золотых монет</span>!
            </p>

            {/* Central reward preview card */}
            <div className="relative my-4 flex flex-col items-center justify-center w-full bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 shadow-inner">
              <div className="text-5xl filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.3)] animate-pulse">
                📺✨
              </div>
              <div className="text-3xl font-black text-amber-300 mt-2 flex items-center justify-center gap-1.5">
                <span>+10 000</span>
                <span className="text-2xl">🪙</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Награда выдаётся после просмотра ролика</span>
              </div>
            </div>

            {/* Action buttons / cooldown state */}
            {remainingSec > 0 ? (
              <div className="w-full flex flex-col items-center">
                <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-2xl text-slate-300 mb-3 w-full justify-center">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-400">Следующий ролик через:</span>
                  <span className="font-mono font-black text-amber-300 text-sm">
                    {formatCooldownTime(remainingSec)}
                  </span>
                </div>

                <button
                  disabled
                  className="w-full py-3.5 rounded-2xl bg-slate-800 text-slate-500 font-black text-sm cursor-not-allowed border border-slate-700/50 flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Перезарядка (доступно раз в 3 часа)</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                <button
                  id="watch-ad-for-coins-btn"
                  onClick={handleStartAd}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Смотреть рекламу (+10 000 🪙)</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-2">
                  Длительность: 5 сек • Награда мгновенно
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
