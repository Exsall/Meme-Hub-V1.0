import React, { useState, useMemo } from 'react';
import { Award, CheckCircle2, Gift, Sparkles, X, Filter } from 'lucide-react';
import { QUESTS } from '../../data/gameData';
import { Quest } from '../../types/game';
import { useGame } from '../../context/GameContext';
import { soundManager } from '../../utils/audio';

interface QuestsModalProps {
  onClose: () => void;
}

type QuestCategoryFilter = 'all' | 'beginner' | 'alchemy' | 'territory' | 'master';

const CATEGORY_TABS: { id: QuestCategoryFilter; label: string; icon: string }[] = [
  { id: 'all', label: 'Все', icon: '📜' },
  { id: 'beginner', label: 'Новичок', icon: '🌱' },
  { id: 'alchemy', label: 'Алхимия', icon: '⚗️' },
  { id: 'territory', label: 'Полянка', icon: '🏕️' },
  { id: 'master', label: 'Мастер', icon: '👑' },
];

export const QuestsModal: React.FC<QuestsModalProps> = ({ onClose }) => {
  const { completedQuests, claimQuestReward, getQuestCurrentProgress, claimableQuestsCount } = useGame();
  const [activeCategory, setActiveCategory] = useState<QuestCategoryFilter>('all');

  const totalQuestsCount = QUESTS.length;
  const completedCount = completedQuests.length;
  const totalPercent = Math.round((completedCount / Math.max(1, totalQuestsCount)) * 100);

  // Filter and sort: Claimable first -> In progress -> Completed last
  const filteredQuests = useMemo(() => {
    let list = QUESTS;
    if (activeCategory !== 'all') {
      list = list.filter((q) => q.category === activeCategory);
    }

    return [...list].sort((a, b) => {
      const aDone = completedQuests.includes(a.id);
      const bDone = completedQuests.includes(b.id);
      const aReady = !aDone && getQuestCurrentProgress(a) >= a.target;
      const bReady = !bDone && getQuestCurrentProgress(b) >= b.target;

      if (aReady && !bReady) return -1;
      if (!aReady && bReady) return 1;
      if (aDone && !bDone) return 1;
      if (!aDone && bDone) return -1;
      return 0;
    });
  }, [activeCategory, completedQuests, getQuestCurrentProgress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl p-4 sm:p-5 flex flex-col max-h-[88vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl shadow-md">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">Достижения Мемолога</h2>
                {claimableQuestsCount > 0 && (
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                    +{claimableQuestsCount} готово!
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400">
                Выполняй задания, открывай мемов и получай золото
              </span>
            </div>
          </div>

          <button
            id="close-quests-modal-btn"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span>Общий прогресс достижений:</span>
              <span className="text-amber-400 font-mono font-black">
                {completedCount} / {totalQuestsCount}
              </span>
            </span>
            <span className="text-emerald-400 font-mono font-black">{totalPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${totalPercent}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            const categoryCount =
              tab.id === 'all'
                ? QUESTS.length
                : QUESTS.filter((q) => q.category === tab.id).length;
            const categoryDone =
              tab.id === 'all'
                ? completedCount
                : QUESTS.filter((q) => q.category === tab.id && completedQuests.includes(q.id)).length;

            return (
              <button
                key={tab.id}
                id={`quest-tab-${tab.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(tab.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {categoryDone}/{categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto py-1 flex flex-col gap-2.5 pr-1">
          {filteredQuests.map((quest) => {
            const isCompleted = completedQuests.includes(quest.id);
            const progress = getQuestCurrentProgress(quest);
            const isReadyToClaim = !isCompleted && progress >= quest.target;
            const percent = Math.min(100, Math.round((progress / quest.target) * 100));

            return (
              <div
                key={quest.id}
                id={`quest-card-${quest.id}`}
                className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-950/50 border-slate-800/80 opacity-60'
                    : isReadyToClaim
                    ? 'bg-gradient-to-r from-emerald-950/60 to-slate-900 border-emerald-500/80 shadow-lg shadow-emerald-500/15'
                    : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Quest Icon */}
                  <div className="w-10 h-10 rounded-2xl bg-slate-950/80 border border-slate-700 flex items-center justify-center text-xl shrink-0">
                    {quest.icon || '⭐'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {quest.title}
                      </h4>

                      {/* Reward tags */}
                      <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                        {quest.reward.coins && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                            +{quest.reward.coins.toLocaleString()} 🪙
                          </span>
                        )}
                        {quest.reward.xp && (
                          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                            +{quest.reward.xp} опыта
                          </span>
                        )}
                        {quest.reward.boxId && (
                          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                            📦 Коробка
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {quest.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar or Claim button */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-3">
                  {!isCompleted && !isReadyToClaim && (
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-1">
                        <span>Прогресс:</span>
                        <span className="font-mono text-slate-300">
                          {progress.toLocaleString()} / {quest.target.toLocaleString()} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isReadyToClaim && (
                    <button
                      id={`claim-quest-${quest.id}`}
                      onClick={() => {
                        soundManager.playUpgrade();
                        claimQuestReward(quest.id);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all animate-pulse hover:brightness-110"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>ЗАБРАТЬ НАГРАДУ</span>
                    </button>
                  )}

                  {isCompleted && (
                    <div className="w-full flex items-center justify-end gap-1 text-emerald-400 font-bold text-xs py-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Награда получена</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
