import ReactDOM from 'react-dom/client';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import './index.css';
import App from './App';
import { seedIfEmpty } from './utils/seedData';

// 브라우저 환경에서 네이티브 브릿지 상수를 모킹하여 TDSMobileAITProvider가 동작하도록 함
if (typeof window !== 'undefined' && !window.__CONSTANT_HANDLER_MAP) {
  (window as any).__CONSTANT_HANDLER_MAP = {
    deploymentId: 'local-dev',
    brandDisplayName: '몸무게 캘린더',
    brandIcon: '',
    brandPrimaryColor: '#3182f6',
    brandBridgeColorMode: 'basic',
    getSafeAreaTop: 0,
    getSafeAreaBottom: 0,
    getPlatformOS: 'web',
    getTossAppVersion: '0.0.0',
    getOperationalEnvironment: 'sandbox',
    getDeploymentId: 'local-dev',
    getClipboardText: '',
    fetchContacts: [],
    fetchAlbumPhotos: [],
    getCurrentLocation: null,
    openCamera: null,
    getLocale: 'ko-KR',
    getSchemeUri: '',
    getDeviceId: 'local-dev',
    setClipboardText: null,
    'loadAdMobInterstitialAd_isSupported': false,
    'loadAdMobRewardedAd_isSupported': false,
    'loadAppsInTossAdMob_isSupported': false,
    'showAdMobInterstitialAd_isSupported': false,
    'showAdMobRewardedAd_isSupported': false,
    'showAppsInTossAdMob_isSupported': false,
  };
}

// 개발용 시드 데이터 삽입 (localStorage에 'seeded' 플래그가 없을 때만)
seedIfEmpty();

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <TDSMobileAITProvider>
      <App />
    </TDSMobileAITProvider>
  );
}
