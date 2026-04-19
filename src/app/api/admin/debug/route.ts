import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";
import bcrypt from "bcryptjs";

// TEMPORARY DEBUG ENDPOINT - Remove after fixing auth
export async function GET() {
  try {
    await connectDB();

    const testEmail = "admin@kidostudio.com";
    const testPassword = "admin123";

    // 1. Find the admin
    const admin = await Admin.findOne({ email: testEmail });
    if (!admin) {
      return NextResponse.json({ 
        step: "FIND_ADMIN", 
        error: "No admin found with email: " + testEmail,
        allAdmins: await Admin.find({}, { email: 1, name: 1, _id: 0 })
      });
    }

    // 2. Check the stored hash
    const storedHash = admin.password;
    
    // 3. Compare
    const isMatch = await bcrypt.compare(testPassword, storedHash);

    // 4. Also test lowercase lookup
    const adminLower = await Admin.findOne({ email: testEmail.toLowerCase() });

    return NextResponse.json({
      step: "FULL_CHECK",
      adminFound: true,
      adminEmail: admin.email,
      adminName: admin.name,
      hashLength: storedHash?.length,
      hashPrefix: storedHash?.substring(0, 7),
      passwordMatch: isMatch,
      lowercaseLookupFound: !!adminLower,
      mongooseVersion: require("mongoose").version,
      nodeEnv: process.env.NODE_ENV,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL || "NOT SET",
    });
  } catch (error) {
    return NextResponse.json(
      { step: "ERROR", error: String(error) },
      { status: 500 }
    );
  }
}
