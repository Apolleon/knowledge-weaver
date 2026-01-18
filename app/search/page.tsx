// app/search/page.tsx
"use client";
import { useState } from "react";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import AdaptiveUI from "@/components/AdaptiveUI";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [userLevel, setUserLevel] = useState<"beginner" | "advanced">("beginner");

  const handleSearch = async () => {
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query, userLevel }),
    });
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Семантический поиск</h1>

      <select
        value={userLevel}
        onChange={(e) => setUserLevel(e.target.value as "beginner" | "advanced")}
        className="mb-4 p-2 bg-gray-800 rounded"
      >
        <option value="beginner">Новичок</option>
        <option value="advanced">Эксперт</option>
      </select>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-4 mb-4 bg-gray-800 rounded-lg"
        placeholder="Квантовая запутанность..."
      />
      <button onClick={handleSearch} className="px-6 py-3 bg-blue-600 rounded-lg mb-8">
        Поиск
      </button>

      <AdaptiveUI userLevel={userLevel}>
        <KnowledgeGraph nodes={results} />
        <ul className="mt-4 space-y-2">
          {results.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </AdaptiveUI>
    </div>
  );
}
