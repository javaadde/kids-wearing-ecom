import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.create(body);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
