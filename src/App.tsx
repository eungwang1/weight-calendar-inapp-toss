import { useState, useCallback } from 'react';
import { RecordPage } from './pages/RecordPage';
import { GraphPage } from './pages/GraphPage';
import { useBackHandler } from './hooks/useBackHandler';
import { TabBar } from './components/TabBar';
import { Onboarding } from './components/Onboarding';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem('onboarding_done')
  );

  const goBackToFirstTab = useCallback(() => setActiveTab(0), []);
  useBackHandler(activeTab !== 0, goBackToFirstTab);

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          localStorage.setItem('onboarding_done', '1');
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <div className="app-root">
      <div style={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 0 ? <RecordPage /> : <GraphPage />}
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
