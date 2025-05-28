import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/mongodb";
import { User, UnverifiedUser } from "@/lib/db/schema";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const body = await req.json();
    const { email, name, password } = body;

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists (either verified or unverified)
    const existingUser = await User.findOne({ email });
    const existingUnverifiedUser = await UnverifiedUser.findOne({ email });

    if (existingUser || existingUnverifiedUser) {
      return NextResponse.json(
        {
          error:
            "This email is already registered. Please try logging in instead.",
          code: "USER_EXISTS",
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Try to send the verification email
    const emailResult = await sendEmail({
      to: email,
      subject: "🎉 Welcome to T-finity! Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                padding: 20px 0;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .verification-code {
                background: #f3f4f6;
                padding: 15px;
                border-radius: 6px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 4px;
                margin: 20px 0;
                color: #4f46e5;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
              }
              .expiry {
                color: #ef4444;
                font-size: 14px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: white; margin: 0;">🎉 Welcome to T-finity!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for joining T-finity! We're excited to have you on board. 🚀</p>
                <p>To get started, please verify your email address using the code below:</p>
                
                <div class="verification-code">
                  ${otp}
                </div>
                
                <p class="expiry">⏰ This code will expire in 10 minutes</p>
                
                <p>If you didn't request this verification code, you can safely ignore this email.</p>
                
                <div class="footer">
                  <p>Best regards,<br>The T-finity Team</p>
                  <p>💫 Making your experience extraordinary</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Store user data in the database
    await UnverifiedUser.create({
      email,
      name,
      password: hashedPassword,
      otp: {
        code: otp,
        expiresAt: otpExpiry,
      },
    });

    // Return success message if email was sent successfully
    if (emailResult) {
      return NextResponse.json(
        {
          message:
            "Verification email sent successfully. Please check your inbox.",
        },
        { status: 201 }
      );
    }

    // If email sending failed, remove the unverified user and return error
    await UnverifiedUser.deleteOne({ email });
    return NextResponse.json(
      {
        error: "Failed to send verification email. Please try again later.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    );
  }
}
