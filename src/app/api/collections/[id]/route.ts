import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Collection from "@/lib/models/Collection";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Update slug if name changed
    if (body.name) {
      body.slug = body.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    }

    const collection = await Collection.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ collection });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Collection.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Delete failed" }, { status: 500 });
  }
}
