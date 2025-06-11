// scripts/migrate-orders-payment-method.cjs
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/t-finity";

const orderSchema = new mongoose.Schema({}, { strict: false });
const Order = mongoose.model("Order", orderSchema, "orders");

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  const result = await Order.updateMany(
    { paymentMethod: { $exists: false } },
    { $set: { paymentMethod: "cod" } }
  );
  console.log(`Updated ${result.modifiedCount} orders.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
