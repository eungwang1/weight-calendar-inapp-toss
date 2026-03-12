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

export function getMonthKey(year: number, month: number): string {
  const m = String(month).padStart(2, '0');
  return `weight:${year}-${m}`;
}

export function getPhotoKey(id: string): string {
  return `photo::${id}`;
}
