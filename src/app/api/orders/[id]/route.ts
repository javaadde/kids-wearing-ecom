import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

interface Params { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { status } = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
