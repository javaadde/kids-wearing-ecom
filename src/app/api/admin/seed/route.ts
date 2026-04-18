import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || "admin@kidostudio.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update or create the admin user
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
        message: "Admin user synchronized successfully!",
        email: admin.email
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: String(error) },
      { status: 500 }
    );
  }
}
