// app/api/import/route.ts
import { kb } from "@/lib/knowledge-base";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { data } = await request.json(); // [{subject, predicate, object}]
  data.forEach(([s, p, o]: string[]) => kb.addTriple(s, p, o));
  return NextResponse.json({ status: "imported", count: data.length });
}
