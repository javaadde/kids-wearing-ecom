import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "kido-secret-change-me",
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/products/:path*",
    "/admin/collections/:path*",
    "/admin/orders/:path*",
    // Protect the root admin path but carefully
    "/admin", 
  ],
};
