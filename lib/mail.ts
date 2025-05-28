import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error("SENDGRID_API_KEY is not set in environment variables");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    if (!process.env.VERIFIED_SENDER_EMAIL) {
      throw new Error(
        "VERIFIED_SENDER_EMAIL is not set in environment variables"
      );
    }

    const msg = {
      to,
      from: process.env.VERIFIED_SENDER_EMAIL,
      subject,
      html,
      // Basic tracking to help with deliverability
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    };

    console.log("Attempting to send email with SendGrid...", {
      to,
      from: msg.from,
      subject,
    });

    const response = await sgMail.send(msg);
    console.log("SendGrid response:", response[0].statusCode);
    return response[0].statusCode === 202;
  } catch (error: any) {
    // Log detailed error information
    if (error.response) {
      console.error("SendGrid API Error Details:", {
        statusCode: error.response.statusCode,
        body: error.response.body,
        headers: error.response.headers,
      });

      // Log specific error messages if available
      if (error.response.body?.errors) {
        console.error(
          "SendGrid Error Messages:",
          error.response.body.errors.map((err: any) => ({
            message: err.message,
            field: err.field,
            help: err.help,
          }))
        );
      }
    }

    // In development, log the error but don't fail
    if (process.env.NODE_ENV === "development") {
      console.warn("Email sending failed in development mode:", {
        message: error.message,
        code: error.code,
        response: error.response?.body,
      });
      return true; // Return true in development to allow testing
    }

    throw error;
  }
}
