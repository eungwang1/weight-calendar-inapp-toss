import { isNativeBridge } from './bridge';

type HapticType = 'tickWeak' | 'tap' | 'softMedium' | 'success' | 'error';

/**
 * 토스 앱 → 네이티브 햅틱 진동
 * 브라우저 → 무시 (에러 안 남)
 */
export async function haptic(type: HapticType = 'softMedium'): Promise<void> {
  if (!isNativeBridge()) return;
  try {
    const { generateHapticFeedback } = await import('@apps-in-toss/web-framework');
    await generateHapticFeedback({ type });
  } catch {
    // 브릿지 없으면 무시
  }
}
