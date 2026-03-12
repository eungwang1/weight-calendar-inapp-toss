/**
 * 토스 앱 WebView 내부인지 판별.
 * 네이티브 브릿지가 있으면 SDK API 사용, 없으면 브라우저 폴백.
 */
export function isNativeBridge(): boolean {
  try {
    return typeof window !== 'undefined' && !!(window as any).__granite_bridge__;
  } catch {
    return false;
  }
}
