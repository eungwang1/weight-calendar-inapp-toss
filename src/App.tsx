import { useState, useCallback } from 'react';
import { TabBar } from './components/TabBar';
import { RecordPage } from './pages/RecordPage';
import { GraphPage } from './pages/GraphPage';
import { useBackHandler } from './hooks/useBackHandler';

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const goBackToFirstTab = useCallback(() => setActiveTab(0), []);
  // 탭 1이 아닐 때만 뒤로가기로 탭 1 복귀
  useBackHandler(activeTab !== 0, goBackToFirstTab);

  return (
    <div className="app-root">
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 0 ? <RecordPage /> : <GraphPage />}
    </div>
  );
}

export default App;
