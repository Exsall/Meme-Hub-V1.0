import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { TerritoryView } from './components/Territory/TerritoryView';
import { LabView } from './components/Lab/LabView';
import { InventoryView } from './components/Inventory/InventoryView';
import { MemedexView } from './components/Memedex/MemedexView';
import { ShopView } from './components/Shop/ShopView';
import { DailyRewardModal } from './components/DailyReward/DailyRewardModal';
import { QuestsModal } from './components/Quests/QuestsModal';
import { SettingsModal } from './components/SettingsModal';
import { OfflineIncomeModal } from './components/OfflineIncomeModal';
import { AdRewardModal } from './components/Modals/AdRewardModal';
import { RandomEventModal } from './components/Modals/RandomEventModal';
import { FortuneWheelModal } from './components/FortuneWheel/FortuneWheelModal';
import { LeftActionsStack } from './components/Territory/LeftActionsStack';
import { WelcomeModal } from './components/Modals/WelcomeModal';

const GameShell: React.FC = () => {
  const {
    activeTab,
    isDailyRewardOpen,
    setIsDailyRewardOpen,
    isQuestsOpen,
    setIsQuestsOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isAdRewardOpen,
    setIsAdRewardOpen,
    isWheelOpen,
    setIsWheelOpen,
    currentRandomEvent,
    dismissRandomEvent,
  } = useGame();

  return (
    <div className="relative flex flex-col w-full h-screen max-w-2xl mx-auto bg-slate-950 overflow-hidden shadow-2xl border-x border-slate-800/60 font-['Nunito',sans-serif]">
      {/* Top Header Bar */}
      <TopBar />

      {/* Main View Area */}
      <main className="relative flex-1 w-full overflow-hidden">
        {activeTab === 'home' && <TerritoryView />}
        {activeTab === 'lab' && <LabView />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'memedex' && <MemedexView />}
        {activeTab === 'shop' && <ShopView />}
      </main>

      {/* Floating Left Side Lab & Fortune Wheel Actions Stack (Only on Meadow/Home screen) */}
      {activeTab === 'home' && <LeftActionsStack />}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      {isDailyRewardOpen && (
        <DailyRewardModal onClose={() => setIsDailyRewardOpen(false)} />
      )}
      {isWheelOpen && (
        <FortuneWheelModal onClose={() => setIsWheelOpen(false)} />
      )}
      {isQuestsOpen && <QuestsModal onClose={() => setIsQuestsOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isAdRewardOpen && <AdRewardModal onClose={() => setIsAdRewardOpen(false)} />}
      {currentRandomEvent && (
        <RandomEventModal event={currentRandomEvent} onClose={dismissRandomEvent} />
      )}
      <OfflineIncomeModal />
      <WelcomeModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}
