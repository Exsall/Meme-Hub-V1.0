import React, { useState } from 'react';
import {
  Activity,
  Award,
  ChevronRight,
  Database,
  Music,
  RefreshCw,
  Sliders,
  Sparkles,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { analytics } from '../utils/analytics';
import { soundManager } from '../utils/audio';
import { GAME_CONFIG } from '../config/gameConfig';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const {
    soundEnabled,
    musicEnabled,
    volume,
    toggleSound,
    toggleMusic,
    setVolume,
    devAddCoins,
    devGiveAllIngredients,
    devUnlockAllZones,
    devResetProgress,
    config,
    updateConfig,
    triggerRandomEvent,
  } = useGame();

  const showAdmin = GAME_CONFIG.features.enableAdminPanel;
  const showAnalytics = GAME_CONFIG.features.enableAnalytics;

  const [activeTab, setActiveTab] = useState<'settings' | 'admin' | 'analytics'>('settings');
  const [offlineHours, setOfflineHours] = useState(config.offlineMaxHours);
  const events = analytics.getEvents();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-5 flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-black text-white">Настройки игры</h2>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (only if Admin or Analytics enabled) */}
        {(showAdmin || showAnalytics) && (
          <div className="flex bg-slate-950 rounded-2xl p-1 border border-slate-800 my-3 shrink-0">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔊 Звук
            </button>
            {showAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛠️ Админка
              </button>
            )}
            {showAnalytics && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 Аналитика
              </button>
            )}
          </div>
        )}

        {/* TAB 1: BASIC SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-1">
            {/* Volume Slider */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-col gap-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {volume === 0 || !soundEnabled ? (
                    <VolumeX className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-amber-400" />
                  )}
                  <div>
                    <span className="text-sm font-bold text-white block">Громкость звука</span>
                    <span className="text-xs text-slate-400">Убавление и прибавление звуков</span>
                  </div>
                </div>
                <span className="text-sm font-black text-amber-300 font-mono bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  {volume}%
                </span>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    setVolume(0);
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Выключить звук"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
                <input
                  id="settings-volume-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={volume}
                  onChange={(e) => {
                    const newVol = Number(e.target.value);
                    setVolume(newVol);
                  }}
                  onMouseUp={() => soundManager.playClick()}
                  onTouchEnd={() => soundManager.playClick()}
                  className="flex-1 accent-amber-400 h-2 bg-slate-950 rounded-lg cursor-pointer appearance-none border border-slate-700/60"
                />
                <button
                  onClick={() => {
                    setVolume(100);
                    soundManager.playClick();
                  }}
                  className="p-1 text-slate-400 hover:text-amber-300 transition-colors"
                  title="Максимум"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-sm font-bold text-white block">Звуковые эффекты</span>
                  <span className="text-xs text-slate-400">Клики, взрывы, монеты, фанфары</span>
                </div>
              </div>
              <button
                onClick={toggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Music className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-sm font-bold text-white block">Фоновая музыка</span>
                  <span className="text-xs text-slate-400">Процедурный чиптюн-синтезатор</span>
                </div>
              </div>
              <button
                onClick={toggleMusic}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  musicEnabled ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    musicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center mt-2">
              <span className="text-xs font-black text-amber-300 block tracking-wide">
                {GAME_CONFIG.meta.appName} {GAME_CONFIG.meta.version}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1 font-semibold">
                {GAME_CONFIG.meta.author}
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPER / ADMIN PANEL */}
        {activeTab === 'admin' && showAdmin && (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-1 pr-1">
            <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl">
              <span className="text-xs font-black text-amber-300 block">
                🛠️ ПАНЕЛЬ УПРАВЛЕНИЯ / АДМИНКА
              </span>
              <p className="text-[11px] text-slate-300 mt-1">
                Быстрое тестирование экономики, слияний, шансов и зон.
              </p>
            </div>

            {/* Currency Cheats */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-xs font-black text-slate-300 block mb-2">
                ДОБАВИТЬ МОНЕТЫ 🪙
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => devAddCoins(1000)}
                  className="py-1.5 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-amber-300 active:scale-95"
                >
                  +1 000
                </button>
                <button
                  onClick={() => devAddCoins(10000)}
                  className="py-1.5 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-amber-300 active:scale-95"
                >
                  +10 000
                </button>
                <button
                  onClick={() => devAddCoins(100000)}
                  className="py-1.5 px-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-amber-300 active:scale-95"
                >
                  +100 000
                </button>
              </div>
            </div>

            {/* Quick Unlocks */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700 flex flex-col gap-2">
              <span className="text-xs font-black text-slate-300 block">БЫСТРЫЙ ДОСТУП</span>
              <button
                onClick={devGiveAllIngredients}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Выдать все 20+ ингредиентов (x5)</span>
              </button>

              <button
                onClick={devUnlockAllZones}
                className="w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Открыть все 5 территорий (+25 мест)</span>
              </button>
            </div>

            {/* Random Events Trigger */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-amber-500/40 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-300 block">
                  🎲 СЛУЧАЙНЫЕ ИВЕНТЫ (ТЕСТ)
                </span>
                <span className="text-[10px] text-slate-400">Авто: раз в 35-75 сек</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Вызови событие мгновенно для проверки плашки, баффов или происшествий:
              </p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => {
                    onClose();
                    triggerRandomEvent('positive');
                  }}
                  className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center gap-1 active:scale-95 shadow"
                >
                  <span>✨ Положительное</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    triggerRandomEvent('negative');
                  }}
                  className="py-2 px-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-black flex items-center justify-center gap-1 active:scale-95 shadow"
                >
                  <span>⚠️ Происшествие</span>
                </button>
              </div>
              <button
                onClick={() => {
                  onClose();
                  triggerRandomEvent();
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center justify-center gap-1 active:scale-95 shadow"
              >
                <span>🎲 Случайный ивент (50/50)</span>
              </button>
            </div>

            {/* Live Config Tuning */}
            <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-xs font-black text-slate-300 block mb-2">
                НАСТРОЙКА КОНФИГА ЭКОНОМИКИ
              </span>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Макс. оффлайн доход (часы):</span>
                  <div className="flex items-center gap-1">
                    {[4, 8, 12, 24].map((h) => (
                      <button
                        key={h}
                        onClick={() => {
                          setOfflineHours(h);
                          updateConfig({ offlineMaxHours: h });
                        }}
                        className={`px-2 py-0.5 rounded-lg font-bold ${
                          offlineHours === h
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {h}ч
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reset Save */}
            <button
              onClick={() => {
                if (confirm('Сбросить весь прогресс и начать заново?')) {
                  devResetProgress();
                }
              }}
              className="w-full py-2.5 rounded-2xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/50 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 mt-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Сбросить прогресс игры</span>
            </button>
          </div>
        )}

        {/* TAB 3: ANALYTICS VIEWER */}
        {activeTab === 'analytics' && showAnalytics && (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 py-1 pr-1">
            <div className="bg-indigo-950/30 border border-indigo-500/40 p-3 rounded-2xl">
              <span className="text-xs font-black text-indigo-300 block">
                📊 ЖУРНАЛ АНАЛИТИЧЕСКИХ СОБЫТИЙ
              </span>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Отслеживание жизненного цикла игрока (mix, upgrades, discovery).
              </p>
            </div>

            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
              {events.length > 0 ? (
                events.map((ev, i) => (
                  <div
                    key={i}
                    className="bg-slate-950/80 border border-slate-800 p-2 rounded-xl text-[11px] font-mono flex flex-col"
                  >
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-amber-400 font-bold">{ev.event}</span>
                      <span className="text-[10px]">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {ev.details && (
                      <span className="text-slate-400 text-[10px] mt-0.5 truncate">
                        {JSON.stringify(ev.details)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">Событий пока нет</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
