import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query: Record<string, unknown> = {};

    if (searchParams.get("category")) query.category = searchParams.get("category");
    if (searchParams.get("season")) query.season = searchParams.get("season");
    if (searchParams.get("featured") === "true") query.featured = true;
    if (searchParams.get("newArrival") === "true") query.newArrival = true;

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
