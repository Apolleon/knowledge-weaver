import { hybridSemanticSearch } from "@/lib/algorithms";
import { ensureKnowledgeBaseInitialized } from "@/lib/init-knowledge";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { query, userLevel } = await request.json();
  await ensureKnowledgeBaseInitialized();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const results = await hybridSemanticSearch(query, userLevel);

  return NextResponse.json({ results });
}
