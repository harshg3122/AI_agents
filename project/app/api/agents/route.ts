import { NextResponse } from "next/server";

export async function GET() {
  // optional: serve a count without loading files (client loads from /public)
  return NextResponse.json({ status: "ok" });
}