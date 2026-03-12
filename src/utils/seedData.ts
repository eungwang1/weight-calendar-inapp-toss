/**
 * 로컬스토리지에 2025-01-01 ~ 2026-03-12 샘플 데이터를 채워넣는 유틸.
 * 한번 실행 후 localStorage에 'seeded' 플래그를 남겨 중복 실행 방지.
 */
export function seedIfEmpty() {
  if (localStorage.getItem('seeded')) return;

  // 시작 체중 75kg에서 서서히 감량하는 시나리오
  let weight = 75.0;
  const start = new Date(2025, 0, 1);
  const end = new Date(2026, 2, 12);

  const monthBuckets: Record<string, Record<string, any>> = {};

  const cursor = new Date(start);
  let id = 1;

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const monthKey = `weight:${y}-${String(m).padStart(2, '0')}`;

    if (!monthBuckets[monthKey]) monthBuckets[monthKey] = {};

    // 매일 아침 기록, 약 60% 확률로 저녁도 기록
    const morningW = Math.round((weight + (Math.random() - 0.5) * 0.6) * 10) / 10;
    const now = cursor.getTime();

    const dayRecord: any = {
      morning: {
        id: `seed-${id++}`,
        date: dateStr,
        timeOfDay: 'morning',
        weight: morningW,
        memo: '',
        photoKeys: [],
        createdAt: now,
        updatedAt: now,
      },
    };

    if (Math.random() < 0.6) {
      const eveningW = Math.round((morningW + (Math.random() - 0.3) * 0.4) * 10) / 10;
      dayRecord.evening = {
        id: `seed-${id++}`,
        date: dateStr,
        timeOfDay: 'evening',
        weight: eveningW,
        memo: '',
        photoKeys: [],
        createdAt: now + 36000000,
        updatedAt: now + 36000000,
      };
    }

    monthBuckets[monthKey][dateStr] = dayRecord;

    // 체중 트렌드: 천천히 감량 (하루 평균 -0.01~-0.02kg) + 약간의 노이즈
    weight += -0.015 + (Math.random() - 0.5) * 0.05;
    weight = Math.round(weight * 10) / 10;
    if (weight < 60) weight = 60;

    cursor.setDate(cursor.getDate() + 1);
  }

  for (const [key, data] of Object.entries(monthBuckets)) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  localStorage.setItem('seeded', '1');
  console.log('Seed data inserted: 2025-01-01 ~ 2026-03-12');
}
