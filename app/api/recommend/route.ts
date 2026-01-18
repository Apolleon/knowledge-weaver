import { contextWeightedRecommender } from "@/lib/algorithms";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  const { history } = await request.json();
  const recommendations = await contextWeightedRecommender(history);
  return NextResponse.json({ recommendations });
}
