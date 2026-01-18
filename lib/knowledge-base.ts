import { ensureKnowledgeBaseInitialized } from "./init-knowledge";

export type Node = { id: string; label: string; type: "concept" | "article" | "person" };
export type Edge = { from: string; to: string; relation: string; weight?: number };

export class KnowledgeBase {
  nodes: Map<string, Node> = new Map();
  private edges: Edge[] = [];
  vectors: Map<string, number[]> = new Map();

  // Основной метод добавления триплета
  addTriple(subject: string, predicate: string, object: string) {
    if (!this.nodes.has(subject)) {
      this.nodes.set(subject, { id: subject, label: subject, type: "concept" });
    }
    if (!this.nodes.has(object)) {
      this.nodes.set(object, { id: object, label: object, type: "concept" });
    }

    this.edges.push({ from: subject, to: object, relation: predicate });

    // Простой детерминированный вектор
    const seed = subject + predicate + object;
    const vector = new Array(64).fill(0).map((_, i) => {
      return ((seed.charCodeAt(i % seed.length) + i) % 256) / 255;
    });

    this.vectors.set(subject, vector);
    this.vectors.set(object, vector);
  }

  getNeighbors(nodeId: string): Edge[] {
    return this.edges.filter((e) => e.from === nodeId || e.to === nodeId);
  }

  approximateSearch(query: string, topK = 5): string[] {
    const results: string[] = [];

    // Ищем по label ноды, если запрос — подстрока
    for (const [id, node] of this.nodes) {
      if (node.label.toLowerCase().includes(query.toLowerCase().trim())) {
        results.push(id);
      }
    }

    // Если ничего не нашли — ищем по всем соседям
    if (results.length === 0) {
      for (const edge of this.edges) {
        if (
          edge.from.toLowerCase().includes(query.toLowerCase()) ||
          edge.to.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(edge.from, edge.to);
        }
      }
    }

    return [...new Set(results)].slice(0, topK);
  }
}

// Глобальный экземпляр
export const kb = new KnowledgeBase();
ensureKnowledgeBaseInitialized();

// Инициализация тестовыми данными (вызывается один раз при старте)
export function initKnowledgeBase() {
  kb.addTriple("Квантовая механика", "explains", "Запутанность");
  kb.addTriple("Запутанность", "relatedTo", "Эксперимент Белла");
  kb.addTriple("Альберт Эйнштейн", "criticizes", "Запутанность");
  kb.addTriple("Эксперимент Белла", "prerequisite", "Квантовая механика");
}
