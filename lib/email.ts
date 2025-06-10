import sgMail from "@sendgrid/mail";

interface OrderConfirmationEmailProps {
  email: string;
  name: string;
  orderId: string;
  items: any[];
  total: number;
  shipping: {
    name: string;
    price: number;
  };
  orderDate: string;
  estimatedDelivery: string;
}

export async function sendOrderConfirmationEmail({
  email,
  name,
  orderId,
  items,
  total,
  shipping,
  orderDate,
  estimatedDelivery,
}: OrderConfirmationEmailProps) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

  const itemsList = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 20px; border-bottom: 1px solid #eee;">
          <img src="${item.images[0]}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;" />
        </td>
        <td style="padding: 20px; border-bottom: 1px solid #eee;">
          <p style="font-weight: 600; margin: 0;">${item.name}</p>
          <p style="color: #666; margin: 5px 0;">Quantity: ${item.quantity}</p>
          <p style="color: #666; margin: 0;">Size: ${item.size || "Standard"}</p>
        </td>
        <td style="padding: 20px; border-bottom: 1px solid #eee; text-align: right;">
          <p style="font-weight: 600; margin: 0;">$${item.price.toFixed(2)}</p>
        </td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
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
            padding: 40px 20px;
            background-color: #ffffff;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .header img {
            max-width: 200px;
            margin-bottom: 20px;
          }
          .order-details {
            margin-bottom: 40px;
          }
          .order-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .order-info p {
            margin: 5px 0;
            color: #666;
          }
          .order-info strong {
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            text-align: left;
            padding: 15px 20px;
            background-color: #f8f9fa;
            font-weight: 600;
            color: #333;
          }
          .total {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .total p {
            margin: 5px 0;
            display: flex;
            justify-content: space-between;
          }
          .total .grand-total {
            font-size: 1.2em;
            font-weight: 600;
            color: #333;
            border-top: 2px solid #eee;
            padding-top: 10px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            color: #666;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #000;
            color: #fff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
          }
          .delivery-info {
            background-color: #f0f7ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .delivery-info h3 {
            color: #0066cc;
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Store Logo" />
            <h1 style="color: #333; margin: 0;">Order Confirmation</h1>
            <p style="color: #666;">Thank you for your order!</p>
          </div>
          
          <div class="order-details">
            <div class="order-info">
              <p><strong>Order Number:</strong> #${orderId}</p>
              <p><strong>Order Date:</strong> ${orderDate}</p>
              <p><strong>Customer Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
            </div>

            <div class="delivery-info">
              <h3>Shipping Information</h3>
              <p><strong>Shipping Method:</strong> ${shipping.name}</p>
              <p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Order Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Details</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            
            <div class="total">
              <p>
                <span>Subtotal</span>
                <span>$${(total - shipping.price).toFixed(2)}</span>
              </p>
              <p>
                <span>Shipping (${shipping.name})</span>
                <span>$${shipping.price.toFixed(2)}</span>
              </p>
              <p class="grand-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p>If you have any questions about your order, please contact our customer service.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="button">View Order Status</a>
            <p style="margin-top: 20px;">© 2024 Your Store Name. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Order Confirmation - #${orderId}`,
    html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to set a new password. If you did not request this, you can ignore this email.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 4px;">Reset Password</a>
      <p style="margin-top: 20px; color: #888;">This link will expire in 1 hour.</p>
    </div>
  `;
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "Password Reset Request",
    html,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}
