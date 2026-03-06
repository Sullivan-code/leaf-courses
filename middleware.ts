import { clerkMiddleware } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = (req: any) => {
  const protectedPaths = [
    '/meus-cursos', 
    '/profile', 
    '/checkout', 
    '/dashboard',
    '/notifications'
  ];
  return protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));
};

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Use auth.protect() diretamente - não precisa de await
    auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};