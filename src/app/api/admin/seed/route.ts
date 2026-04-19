import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // Force-reset specific admin for production recovery
    const email = "admin@kidostudio.com";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.findOneAndUpdate(
      { email },
      {
        name: "Main Admin",
        email,
        password: hashedPassword,
        role: "admin",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { 
        message: "EMERGENCY RESET SUCCESSFUL",
        email: admin.email,
        info: "You can now login with admin@kidostudio.com and admin123"
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Recovery failed", error: String(error) },
      { status: 500 }
    );
  }
}
