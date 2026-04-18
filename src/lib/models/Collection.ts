import { Schema, Document, model, models } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  category: "boys" | "girls" | "infants" | "unisex" | "all";
  backgroundImage?: string;
}

const CollectionSchema = new Schema<ICollection>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    backgroundImage: { type: String },
    category: { 
      type: String, 
      required: true, 
      enum: ["boys", "girls", "infants", "unisex", "all"],
      default: "all"
    },
  },
  { timestamps: true }
);

// Force delete to update schema if needed in development
if (models.Collection) {
  delete models.Collection;
}

const Collection = model<ICollection>("Collection", CollectionSchema);

export default Collection;
