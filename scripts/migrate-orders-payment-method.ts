// scripts/migrate-orders-payment-method.ts
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/t-finity";

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", orderSchema, "orders");

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  const result = await Order.updateMany(
    { paymentMethod: { $exists: false } },
    { $set: { paymentMethod: "cod" } } // Default to 'cod' for legacy orders
  );
  console.log(`Updated ${result.modifiedCount} orders.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
