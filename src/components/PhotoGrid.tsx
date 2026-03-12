import { useEffect, useState } from 'react';
import { usePhotoPicker } from '../hooks/usePhotoPicker';
import style from './PhotoGrid.module.css';

interface Props {
  photoKeys: string[];
  onPhotoKeysChange: (keys: string[]) => void;
}

export function PhotoGrid({ photoKeys, onPhotoKeysChange }: Props) {
  const { addPhoto, loadPhoto, deletePhoto } = usePhotoPicker();
  const [photos, setPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    photoKeys.forEach(async (key) => {
      if (!photos[key]) {
        const data = await loadPhoto(key);
        if (data) {
          setPhotos((prev) => ({ ...prev, [key]: data }));
        }
      }
    });
  }, [photoKeys]);

  const handleAdd = async () => {
    if (photoKeys.length >= 4) return;
    const id = await addPhoto();
    if (!id) return;
    const data = await loadPhoto(id);
    if (data) {
      setPhotos((prev) => ({ ...prev, [id]: data }));
    }
    onPhotoKeysChange([...photoKeys, id]);
  };

  const handleRemove = async (key: string) => {
    await deletePhoto(key);
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    onPhotoKeysChange(photoKeys.filter((k) => k !== key));
  };

  return (
    <div className={style.container}>
      <span className={style.label}>사진 (선택사항)</span>
      <div className={style.grid}>
        {photoKeys.map((key) => (
          <div key={key} className={style.photoItem}>
            {photos[key] && <img className={style.photo} src={photos[key]} alt="" />}
            <button className={style.removeBtn} onClick={() => handleRemove(key)}>
              ×
            </button>
          </div>
        ))}
        {photoKeys.length < 4 && (
          <button className={style.addBtn} onClick={handleAdd}>
            +
          </button>
        )}
      </div>
    </div>
  );
}
