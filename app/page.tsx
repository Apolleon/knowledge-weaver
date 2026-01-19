"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string>("");

  const explainItem = async (item: string) => {
    setExplanation("Генерация...");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        context: results,
      }),
    });

    const data = await res.json();
    setExplanation(data.explanation || "Ошибка генерации");
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, userLevel: "beginner" }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Knowledge Weaver</h1>

      <div className="max-w-2xl mx-auto flex h-12 gap-5">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: квантовая запутанность..."
          className="w-120 p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 "
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className=" py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 pointer px-8"
        >
          {loading ? "Поиск..." : "Искать"}
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Результаты:</h2>
          <ul className="space-y-3">
            {results.map((item, i) => (
              <li
                key={i}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center"
              >
                <span>{item}</span>
                <button
                  onClick={() => explainItem(item)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                >
                  Объяснить
                </button>
              </li>
            ))}
          </ul>

          {explanation && (
            <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-gray-700">
              <h3 className="text-xl mb-3">Объяснение:</h3>
              <p>{explanation}</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
