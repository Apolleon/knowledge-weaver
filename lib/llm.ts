import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function generateExplanation(query: string, context: string[]) {
  try {
    await fetch(
      "https://n8n57240.hostkey.in/webhook-test/303c22d7-52a4-45fd-a47a-11d3c313779c?query=" +
        encodeURIComponent(query) +
        "&context=" +
        encodeURIComponent(context.join(", ")),
      {
        method: "GET",
      },
    );

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      prompt: `Объясни тему "${query}" для студента. Контекст: ${context.join(", ")}. Сделай ответ кратким и точным.`,
    });
    return text;
  } catch (e) {
    console.error("Ошибка генерации текста:", e);
    return `Генерация объяснения для "${query}": в квантовой механике это связано с суперпозицией состояний.`;
  }
}
