import { generateExplanation } from "@/lib/llm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { query, context } = await request.json();
  const explanation = await generateExplanation(query, context);
  return NextResponse.json({ explanation });
}
