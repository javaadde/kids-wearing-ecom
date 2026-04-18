import { Schema, Document, model, models } from "mongoose";

export interface IOrder extends Document {
  items: {
    productId: string;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
  }[];
  total: number;
  status: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      zip: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
