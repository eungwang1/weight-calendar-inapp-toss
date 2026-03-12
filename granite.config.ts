import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'weight-calendar',
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  permissions: [
    { name: 'camera', access: 'access' },
    { name: 'photos', access: 'read' },
  ],
  outdir: 'dist',
  brand: {
    displayName: '몸무게 캘린더',
    icon: '',
    primaryColor: '#3182F6',
    bridgeColorMode: 'basic',
  },
  webViewProps: {
    type: 'partner',
  },
});
