import { useState, useCallback } from 'react';
import { Tab } from '@toss/tds-mobile';
import { RecordPage } from './pages/RecordPage';
import { GraphPage } from './pages/GraphPage';
import { useBackHandler } from './hooks/useBackHandler';

const TABS = ['기록', '그래프'];

function App() {
  const [activeTab, setActiveTab] = useState(0);

  const goBackToFirstTab = useCallback(() => setActiveTab(0), []);
  useBackHandler(activeTab !== 0, goBackToFirstTab);

  return (
    <div className="app-root">
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff' }}>
        <Tab onChange={(index) => setActiveTab(index)}>
          {TABS.map((label, i) => (
            <Tab.Item key={label} selected={activeTab === i}>
              {label}
            </Tab.Item>
          ))}
        </Tab>
      </div>
      {activeTab === 0 ? <RecordPage /> : <GraphPage />}
    </div>
  );
}

export default App;
