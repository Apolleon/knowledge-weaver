import { kb } from "./knowledge-base";

export async function hybridSemanticSearch(
  query: string,
  userLevel: "beginner" | "advanced" = "beginner",
  topK: number = 5,
): Promise<string[]> {
  // Шаг 1. Эмуляция получения векторного представления запроса
  // В реальном проекте здесь должен быть вызов sentence-transformers или API
  const queryVector = Array.from(query)
    .slice(0, 64)
    .map((char) => (char.charCodeAt(0) % 100) / 100);

  // Шаг 2. Векторный префильтр — ANN-поиск по эмбеддингам (V)
  // В реальности: Qdrant HNSW или Faiss
  const vectorCandidates = kb.approximateSearch(query, topK * 5);

  // Шаг 3. Графовая навигация — расширяем кандидатов по графу (G)
  // Берём только топ-3 от векторного поиска как "зёрна" и идём по соседям
  const graphCandidates: Set<string> = new Set();

  const seedNodes = vectorCandidates.slice(0, 3); // берём лучшие 3 для ускорения
  for (const seedId of seedNodes) {
    const neighbors = kb.getNeighbors(seedId);
    neighbors.forEach((edge) => {
      // Добавляем соседей (и from, и to)
      graphCandidates.add(edge.from === seedId ? edge.to : edge.from);
    });
  }

  // Шаг 4. Онтологический фильтр (O) — отсеиваем неподходящее по уровню пользователя
  const filteredCandidates = Array.from(graphCandidates).filter((id) => {
    const node = kb.nodes.get(id);

    if (!node) return false;

    // Пример простого правила онтологии
    if (userLevel === "beginner") {
      // Скрываем слишком сложные темы
      return !node.label.includes("Белла") && !node.label.includes("Эйнштейн");
    }
    // Для продвинутых — ничего не фильтруем
    return true;
  });

  // Шаг 5. Финальное ранжирование
  //  взвешенная сумма графового расстояния + векторной близости + онтологического соответствия
  const ranked = filteredCandidates.map((id) => {
    const node = kb.nodes.get(id)!;
    const vectorScore = kb.vectors.has(id) ? cosineSimilarity(queryVector, kb.vectors.get(id)!) : 0;

    // Пример графового скора: количество соседей (чем больше связей — тем лучше)
    const graphScore = kb.getNeighbors(id).length / 10; // нормализация

    // Итоговый скор — можно настраивать коэффициенты
    const finalScore = 0.6 * vectorScore + 0.4 * graphScore;

    return { id: node.label, score: finalScore };
  });

  // Сортируем и возвращаем топ-K
  return ranked
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((item) => item.id);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    magA = 0,
    magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB)) || 0;
}

export async function contextWeightedRecommender(userHistory: string[]) {
  const weights = { alpha: 0.4, beta: 0.4, gamma: 0.2 }; // контекстные веса

  const seeds = userHistory.slice(0, 3);
  const candidates: string[] = [];

  for (const seed of seeds) {
    const neighbors = kb.getNeighbors(seed);
    candidates.push(...neighbors.map((e) => e.to));
  }

  // Ранжирование
  const scored = candidates.map((c) => ({
    id: c,
    score: weights.alpha * 0.8 + weights.beta * Math.random() + weights.gamma * 0.9,
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.id);
}
