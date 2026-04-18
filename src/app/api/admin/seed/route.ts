import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { message: "Admin already exists. Cannot seed again." },
        { status: 400 }
      );
    }

    const email = process.env.ADMIN_EMAIL || "admin@kidostudio.com";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin user
    await Admin.create({
      name: "Main Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      { message: "Admin user created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: String(error) },
      { status: 500 }
    );
  }
}
