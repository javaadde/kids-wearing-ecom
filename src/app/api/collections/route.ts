import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/lib/models/Collection";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    
    const query: any = {};
    if (category) {
      query.$or = [{ category: category }, { category: "all" }];
    }

    const collections = await Collection.find(query).sort({ name: 1 }).lean();
    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Auto-generate slug if not provided
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const collection = await Collection.create(body);
    return NextResponse.json({ collection }, { status: 201 });
  } catch (error: any) {
    const msg = error.code === 11000 ? "Collection already exists" : error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
