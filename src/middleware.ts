import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/cursos(.*)",
  "/meus-cursos(.*)",
  "/api/checkout(.*)",
  "/api/subscription(.*)",
  "/profile(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/nossos-cursos(.*)",
  "/quem-somos(.*)",
  "/depoimentos(.*)",
  "/aula-experimental(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Não proteger webhooks e rotas públicas
  if (!isPublicRoute(req) && isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};