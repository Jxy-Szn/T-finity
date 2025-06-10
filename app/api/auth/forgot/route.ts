import { NextResponse } from "next/server";
import { User } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";
import mongoose from "mongoose";

// This schema will be used to store password reset tokens
const passwordResetTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const user = await User.findOne({ email });
  if (!user) {
    // Respond with success to prevent email enumeration
    return NextResponse.json({ success: true });
  }
  // Generate a secure token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
  // Remove any existing tokens for this user
  await PasswordResetToken.deleteMany({ userId: user._id });
  // Save the new token
  await PasswordResetToken.create({ userId: user._id, token, expiresAt });
  // Send the email (implement sendPasswordResetEmail in lib/email.ts)
  await sendPasswordResetEmail(user.email, token);
  return NextResponse.json({ success: true });
}
