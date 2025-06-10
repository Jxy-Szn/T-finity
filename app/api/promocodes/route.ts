import { NextResponse } from "next/server";

// GET /api/promocodes
export async function GET() {
  return NextResponse.json({ message: "Promocodes API" });
}

// POST /api/promocodes
export async function POST(req: Request) {
  return NextResponse.json({ message: "Promocodes API" });
}
