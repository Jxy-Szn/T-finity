import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Promocode } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the promocode
    const promocode = await Promocode.findOne({
      code: code.toUpperCase(),
      status: "active",
      expiresAt: { $gt: new Date() },
    });

    if (!promocode) {
      return NextResponse.json(
        { error: "Invalid or expired promo code" },
        { status: 400 }
      );
    }

    // Check if max usage has been reached
    if (promocode.usageCount >= promocode.maxUsage) {
      return NextResponse.json(
        { error: "Promo code has reached its maximum usage" },
        { status: 400 }
      );
    }

    // Return the promocode details
    return NextResponse.json({
      code: promocode.code,
      discount: promocode.discount,
      type: promocode.type,
    });
  } catch (error) {
    console.error("Error applying promo code:", error);
    return NextResponse.json(
      { error: "Failed to apply promo code" },
      { status: 500 }
    );
  }
}
