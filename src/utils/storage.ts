import { Storage } from '@apps-in-toss/web-framework';
import { isNativeBridge } from './bridge';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    let raw: string | null;
    if (isNativeBridge()) {
      raw = await Storage.getItem(key);
    } else {
      raw = localStorage.getItem(key);
    }
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    if (isNativeBridge()) {
      await Storage.setItem(key, json);
    } else {
      localStorage.setItem(key, json);
    }
  } catch (e) {
    console.error('Storage setItem error:', e);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    if (isNativeBridge()) {
      await Storage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.error('Storage removeItem error:', e);
  }
}

export async function clearAll(): Promise<void> {
  try {
    if (isNativeBridge()) {
      // Native Storage에 clear가 없을 수 있으므로 fallback
      try {
        await (Storage as any).clear();
      } catch {
        // clear 미지원 시 알려진 키 패턴 삭제
        await removeKnownKeys();
      }
    } else {
      localStorage.clear();
    }
  } catch (e) {
    console.error('Storage clearAll error:', e);
  }
}

async function removeKnownKeys(): Promise<void> {
  // 최근 2년치 월별 데이터 삭제
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    await removeItem(getMonthKey(d.getFullYear(), d.getMonth() + 1));
  }
  await removeItem('goal');
  await removeItem('onboarding_done');
}

export function getMonthKey(year: number, month: number): string {
  const m = String(month).padStart(2, '0');
  return `weight:${year}-${m}`;
}

export function getPhotoKey(id: string): string {
  return `photo::${id}`;
}
