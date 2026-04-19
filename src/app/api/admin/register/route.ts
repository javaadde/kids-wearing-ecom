import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Check if any admin already exists to prevent unauthorized registrations
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { message: "Admin already exists. Registration is disabled." },
        { status: 403 }
      );
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the first admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    return NextResponse.json(
      { 
        message: "First admin created successfully!",
        email: admin.email 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: String(error) },
      { status: 500 }
    );
  }
}

// Helper to check if registration is needed
export async function GET() {
  try {
    await connectDB();
    const adminCount = await Admin.countDocuments();
    return NextResponse.json({ needsSetup: adminCount === 0 });
  } catch (error) {
    return NextResponse.json({ needsSetup: false, error: String(error) });
  }
}
