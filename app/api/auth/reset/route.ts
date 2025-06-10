import { NextResponse } from "next/server";
import { User } from "@/lib/db/schema";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const passwordResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json(
      { error: "Token and new password are required." },
      { status: 400 }
    );
  }
  const resetToken = await PasswordResetToken.findOne({ token });
  if (!resetToken || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired token." },
      { status: 400 }
    );
  }
  const user = await User.findById(resetToken.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await PasswordResetToken.deleteMany({ userId: user._id });
  return NextResponse.json({ success: true });
}
