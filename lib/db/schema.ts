import mongoose, { Schema } from "mongoose";

// Define the User interface
export interface IUser {
  email: string;
  name: string;
  password: string;
  role: "admin" | "customer";
  isVerified: boolean;
  image?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the UnverifiedUser interface
export interface IUnverifiedUser {
  email: string;
  name: string;
  password: string;
  otp: {
    code: string;
    expiresAt: Date;
  };
  createdAt: Date;
}

// Define the Order interface
export interface IOrder {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    variant?: string;
  }>;
  shipping: {
    id: string;
    name: string;
    price: number;
  };
  total: number;
  customerInfo: {
    email: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  updatedAt: Date;
}

// Define the Promocode interface
export interface IPromocode {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  status: "active" | "expired" | "used";
  usageCount: number;
  maxUsage: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create the UnverifiedUser schema
const unverifiedUserSchema = new Schema<IUnverifiedUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    code: String,
    expiresAt: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // Automatically delete unverified users after 1 hour
  },
});

// Create the Order schema
const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        color: String,
        variant: String,
      },
    ],
    shipping: {
      id: String,
      name: String,
      price: Number,
    },
    total: {
      type: Number,
      required: true,
    },
    customerInfo: {
      email: String,
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create the Promocode schema
const promocodeSchema = new Schema<IPromocode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "expired", "used"],
      default: "active",
    },
    usageCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    maxUsage: {
      type: Number,
      required: true,
      min: 1,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
promocodeSchema.index({ code: 1 });
promocodeSchema.index({ status: 1 });
promocodeSchema.index({ expiresAt: 1 });

// Create and export the models
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export const UnverifiedUser =
  mongoose.models.UnverifiedUser ||
  mongoose.model<IUnverifiedUser>("UnverifiedUser", unverifiedUserSchema);
export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);
export const Promocode =
  mongoose.models.Promocode ||
  mongoose.model<IPromocode>("Promocode", promocodeSchema);
