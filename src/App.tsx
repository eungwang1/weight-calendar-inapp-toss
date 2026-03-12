import { useState, useCallback } from 'react';
import { RecordPage } from './pages/RecordPage';
import { GraphPage } from './pages/GraphPage';
import { useBackHandler } from './hooks/useBackHandler';
import { TabBar } from './components/TabBar';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const goBackToFirstTab = useCallback(() => setActiveTab(0), []);
  useBackHandler(activeTab !== 0, goBackToFirstTab);

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
