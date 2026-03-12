import { useCallback } from 'react';
import { nanoid } from 'nanoid';
import { getItem, setItem, removeItem, getPhotoKey } from '../utils/storage';
import { isNativeBridge } from '../utils/bridge';

/**
 * 토스 앱: SDK openCamera / fetchAlbumPhotos → base64 반환
 * 브라우저: <input type="file"> → canvas 리사이즈 → base64
 */

// ── 브라우저 폴백용 ──

function resizeImage(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function pickFileBrowser(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => resolve(input.files?.[0] ?? null);
    input.click();
  });
}

// ── 토스 앱 SDK ──

async function pickPhotoNative(): Promise<string | null> {
  try {
    // 동적 import로 SDK 로드 (브라우저에서 import 에러 방지)
    const sdk = await import('@apps-in-toss/web-framework');

    // fetchAlbumPhotos: 앨범에서 사진 1장 선택, base64로 받기
    const photos = await sdk.fetchAlbumPhotos({ maxCount: 1, maxWidth: 600, base64: true });
    if (!photos || photos.length === 0) return null;

    const photo = photos[0]!;
    return `data:image/jpeg;base64,${photo.dataUri}`;
  } catch (e) {
    console.error('Native photo pick failed:', e);
    return null;
  }
}

// ── 훅 ──

export function usePhotoPicker() {
  const addPhoto = useCallback(async (): Promise<string | null> => {
    let dataUri: string | null = null;

    if (isNativeBridge()) {
      // 토스 앱 → SDK 앨범 API
      dataUri = await pickPhotoNative();
    } else {
      // 로컬 브라우저 → file input + canvas 리사이즈
      const file = await pickFileBrowser();
      if (!file) return null;
      dataUri = await resizeImage(file, 600, 0.5);
    }

    if (!dataUri) return null;

    // Storage에 저장
    const id = nanoid();
    await setItem(getPhotoKey(id), dataUri);
    return id;
  }, []);

  const loadPhoto = useCallback(async (photoId: string): Promise<string | null> => {
    return getItem<string>(getPhotoKey(photoId));
  }, []);

  const deletePhoto = useCallback(async (photoId: string): Promise<void> => {
    await removeItem(getPhotoKey(photoId));
  }, []);

  return { addPhoto, loadPhoto, deletePhoto };
}
