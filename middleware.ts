import { clerkMiddleware } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = (req: any) => {
  const protectedPaths = ['/meus-cursos', '/profile', '/checkout', '/dashboard'];
  return protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
};

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Fix: await the auth() promise
    const authObj = await auth();
    authObj.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};