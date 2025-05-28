import { NextResponse } from "next/server";
import { Resend } from "resend";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/db/schema";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get request body
    const body = await req.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otp = {
      code: otp,
      expiresAt: otpExpiry,
    };
    await user.save();

    // Send OTP email
    try {
      console.log("Attempting to send email with Resend...");
      const emailResponse = await resend.emails.send({
        from: "T-finity <onboarding@resend.dev>",
        to: email,
        subject: "🔑 New Verification Code for T-finity",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Verification Code</title>
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
                  <h1 style="color: white; margin: 0;">🔑 New Verification Code</h1>
                </div>
                <div class="content">
                  <p>Hello,</p>
                  <p>You've requested a new verification code for your T-finity account. Here it is:</p>
                  
                  <div class="verification-code">
                    ${otp}
                  </div>
                  
                  <p class="expiry">⏰ This code will expire in 10 minutes</p>
                  
                  <p>If you didn't request this verification code, please ignore this email or contact our support team if you have concerns about your account security.</p>
                  
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
      console.log("Resend API Response:", emailResponse);
    } catch (error: any) {
      console.error("Failed to send OTP email. Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }

    return NextResponse.json(
      { message: "New OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    );
  }
}
