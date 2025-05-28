import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Email } from "@/lib/models/email";
import { ObjectId } from "mongodb";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is not set in environment variables");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface SessionPayload {
  userId: {
    buffer: {
      [key: string]: number;
    };
  };
  email: string;
  role: string;
}

export async function GET(req: Request) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "inbox";
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    await connectToDatabase();

    let query: any = {};

    if (type === "inbox") {
      query.to = session.email;
    } else if (type === "sent") {
      query.from = session.email;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { from: { $regex: search, $options: "i" } },
        { to: { $regex: search, $options: "i" } },
      ];
    }

    const emails = await Email.find(query).sort({ date: -1 }).lean();

    return NextResponse.json(emails);
  } catch (error) {
    console.error("[EMAILS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = (await getSession()) as SessionPayload | null;
    if (!session?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { to, subject, content, category } = body;

    if (!to || !subject || !content || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();

    // Create email record in database
    const email = await Email.create({
      from: session.email,
      to,
      subject,
      content,
      category,
      status: "pending",
      date: new Date(),
    });

    // Send actual email using SendGrid
    try {
      if (!process.env.VERIFIED_SENDER_EMAIL) {
        throw new Error(
          "VERIFIED_SENDER_EMAIL is not set in environment variables"
        );
      }

      const msg = {
        to,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: `T-finity Support: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${subject}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f9fafb;
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
                .message {
                  margin: 20px 0;
                  padding: 20px;
                  background-color: #f3f4f6;
                  border-radius: 6px;
                  border-left: 4px solid #6366f1;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  font-size: 14px;
                  color: #6b7280;
                }
                .logo {
                  max-width: 150px;
                  margin-bottom: 20px;
                }
                .button {
                  display: inline-block;
                  color: #6366f1;
                  text-decoration: none;
                  border-bottom: 1px dashed #6366f1;
                  padding: 4px 0;
                  margin: 20px 0;
                  transition: all 0.2s;
                }
                .button:hover {
                  color: #8b5cf6;
                  border-bottom: 1px solid #8b5cf6;
                }
                .meta {
                  font-size: 12px;
                  color: #6b7280;
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                }
                .icon {
                  display: inline-block;
                  vertical-align: middle;
                  margin-right: 8px;
                }
                .icon-text {
                  display: flex;
                  align-items: center;
                  margin: 10px 0;
                }
                .support-badge {
                  display: inline-block;
                  padding: 4px 12px;
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 20px;
                  font-size: 14px;
                  margin-bottom: 10px;
                }
                .link {
                  color: #6366f1;
                  text-decoration: none;
                  border-bottom: 1px dashed #6366f1;
                  transition: all 0.2s;
                }
                .link:hover {
                  color: #8b5cf6;
                  border-bottom: 1px solid #8b5cf6;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="support-badge">👨‍💼 Customer Support</div>
                  <h1 style="color: white; margin: 0;">
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    T-finity
                  </h1>
                </div>
                <div class="content">
                  <div style="text-align: center;">
                    <img src="https://your-logo-url.com/logo.png" alt="T-finity Logo" class="logo">
                  </div>
                  
                  <h2 style="color: #1f2937; margin-bottom: 20px;">
                    <svg class="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    ${subject}
                  </h2>
                  
                  <div class="message">
                    ${content}
                  </div>

                  <div style="text-align: center;">
                    <a href="https://your-app-url.com" class="button">
                      <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                      🚀 Visit T-finity
                    </a>
                  </div>

                  <div class="meta">
                    <div class="icon-text">
                      <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <p>This email was sent from T-finity Customer Support. If you didn't expect this email, you can safely ignore it.</p>
                    </div>
                    <div class="icon-text">
                      <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M9 21V9"></path>
                      </svg>
                      <p>© ${new Date().getFullYear()} T-finity. All rights reserved.</p>
                    </div>
                  </div>
                </div>
                <div class="footer">
                  <div class="icon-text" style="justify-content: center;">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <p>💫 Making your experience extraordinary</p>
                  </div>
                  <div class="icon-text" style="justify-content: center;">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <p>Need help? <a href="mailto:support@t-finity.com" class="link">📧 Contact our support team</a></p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
        trackingSettings: {
          clickTracking: { enable: true },
          openTracking: { enable: true },
        },
      };

      const response = await sgMail.send(msg);

      if (response[0].statusCode === 202) {
        // Update email status to delivered
        await Email.findByIdAndUpdate(email._id, { status: "delivered" });
        return NextResponse.json(email);
      } else {
        // Update email status to failed
        await Email.findByIdAndUpdate(email._id, { status: "failed" });
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("[EMAIL_SEND_ERROR]", error);
      // Update email status to failed
      await Email.findByIdAndUpdate(email._id, { status: "failed" });
      return new NextResponse("Failed to send email", { status: 500 });
    }
  } catch (error) {
    console.error("[EMAILS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
