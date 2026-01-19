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
  kb.addTriple("Квантовая механика", "explains", "Суперпозиция");
  kb.addTriple("Квантовая механика", "explains", "Декогеренция");
  kb.addTriple("Квантовая механика", "relatedTo", "Теория относительности");
  kb.addTriple("Квантовая механика", "contradicts", "Классическая физика");

  kb.addTriple("Альберт Эйнштейн", "criticized", "Запутанность");
  kb.addTriple("Альберт Эйнштейн", "discovered", "Теория относительности");
  kb.addTriple("Альберт Эйнштейн", "coauthored", "EPR парадокс");
  kb.addTriple("Нильс Бор", "debatedWith", "Альберт Эйнштейн");
  kb.addTriple("Нильс Бор", "developed", "Квантовая механика");
  kb.addTriple("Эрвин Шрёдингер", "discovered", "Уравнение Шрёдингера");
  kb.addTriple("Эрвин Шрёдингер", "proposed", "Кот Шрёдингера");
  kb.addTriple("Джон Белл", "proved", "Теорема Белла");
  kb.addTriple("Вернер Гейзенберг", "discovered", "Принцип неопределённости");

  kb.addTriple("Запутанность", "demonstratedBy", "Эксперимент Белла");
  kb.addTriple("Эксперимент Белла", "prerequisite", "Квантовая механика");
  kb.addTriple("EPR парадокс", "relatedTo", "Запутанность");
  kb.addTriple("EPR парадокс", "resolvedBy", "Теорема Белла");
  kb.addTriple("Кот Шрёдингера", "illustrates", "Суперпозиция");
  kb.addTriple("Двойная щель", "demonstrates", "Интерференция частиц");
  kb.addTriple("Двойная щель", "relatedTo", "Квантовая механика");

  kb.addTriple("Запутанность", "usedIn", "Квантовая криптография");
  kb.addTriple("Запутанность", "usedIn", "Квантовая телепортация");
  kb.addTriple("Суперпозиция", "usedIn", "Квантовые компьютеры");
  kb.addTriple("Квантовые компьютеры", "basedOn", "Квантовая механика");
  kb.addTriple("Квантовая криптография", "provides", "Безопасная связь");
  kb.addTriple("Квантовая телепортация", "transfers", "Квантовые состояния");

  kb.addTriple("Теория относительности", "contradicts", "Запутанность");
  kb.addTriple("Принцип неопределённости", "relatedTo", "Суперпозиция");
  kb.addTriple("Интерференция частиц", "explains", "Волновая функция");
  kb.addTriple("Волновая функция", "collapsedBy", "Измерение");
  kb.addTriple("Измерение", "causes", "Декогеренция");
  kb.addTriple("Декогеренция", "resolves", "Кот Шрёдингера");
  kb.addTriple("Кот Шрёдингера", "thoughtExperimentBy", "Эрвин Шрёдингер");
  kb.addTriple("Теорема Белла", "violates", "Локальный реализм");
  kb.addTriple("Локальный реализм", "supportedBy", "Альберт Эйнштейн");

  kb.addTriple("Нильс Бор", "interpreted", "Копенгагенская интерпретация");
  kb.addTriple("Копенгагенская интерпретация", "explains", "Измерение");
  kb.addTriple("Много миров интерпретация", "alternativeTo", "Копенгагенская интерпретация");
  kb.addTriple("Много миров интерпретация", "proposedBy", "Хью Эверетт");
}
