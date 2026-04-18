import { Schema, Document, model, models } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  collectionName?: string;
  season: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  sizes: { size: string; stock: number }[];
  featured: boolean;
  newArrival: boolean;
  tags: string[];
}

const SizeStockSchema = new Schema({
  size: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ["boys", "girls", "infants", "unisex"],
    },
    collectionName: { type: String },
    season: {
      type: String,
      required: true,
      enum: ["summer", "winter", "all"],
      default: "all",
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    images: [{ type: String }],
    sizes: [SizeStockSchema],
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
