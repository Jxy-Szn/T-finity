import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    message: "Promo code application is not available.",
  });
}
