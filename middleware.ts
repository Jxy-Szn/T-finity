import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET!;

// Convert JWT_SECRET to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

console.log("[Middleware] Using jose for JWT verification");

// Define route configuration types
type ProtectedRouteConfig = {
  requiresAuth: true;
  allowedRoles: string[];
};

type AuthRedirectRouteConfig = {
  requiresAuth: false;
  redirectIfAuth: true;
};

type RouteConfig = ProtectedRouteConfig | AuthRedirectRouteConfig;

// Define protected routes and their required access
const protectedRoutes: Record<string, RouteConfig> = {
  "/dashboard": {
    requiresAuth: true,
    allowedRoles: ["admin", "customer"],
  },
  "/signin": {
    requiresAuth: false,
    redirectIfAuth: true,
  },
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Debug logging
  console.log("[Middleware] Request details:", {
    path,
    hasToken: !!token,
    cookies: request.cookies
      .getAll()
      .map((c) => ({ name: c.name, value: c.value ? "present" : "missing" })),
    headers: Object.fromEntries(request.headers.entries()),
  });

  // Check if the route is protected or needs auth check
  const routeConfig = Object.entries(protectedRoutes).find(([route]) =>
    path.startsWith(route)
  )?.[1];

  if (routeConfig) {
    // If route requires auth (like dashboard)
    if (routeConfig.requiresAuth) {
      if (!token) {
        console.log("[Middleware] No token found, redirecting to signin");
        return NextResponse.redirect(new URL("/signin", request.url));
      }

      try {
        // Verify token using jose
        const { payload } = await jwtVerify(token, secret);
        const decoded = payload as {
          userId: string;
          email: string;
          role: "admin" | "customer";
        };

        console.log("[Middleware] Token verified:", {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });

        // Check if user's role is allowed
        if (!routeConfig.allowedRoles.includes(decoded.role)) {
          console.log("[Middleware] Role not allowed, redirecting to home");
          return NextResponse.redirect(new URL("/", request.url));
        }

        console.log("[Middleware] Access granted to protected route");
        return NextResponse.next();
      } catch (error) {
        console.error("[Middleware] Token verification failed:", error);
        // If token is invalid, redirect to login
        return NextResponse.redirect(new URL("/signin", request.url));
      }
    }

    // If route should redirect when authenticated (like signin)
    if (
      !routeConfig.requiresAuth &&
      "redirectIfAuth" in routeConfig &&
      routeConfig.redirectIfAuth &&
      token
    ) {
      try {
        // Verify token using jose
        const { payload } = await jwtVerify(token, secret);
        const decoded = payload as {
          userId: string;
          email: string;
          role: "admin" | "customer";
        };

        console.log("[Middleware] Authenticated user on signin page:", {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });

        // Redirect based on role
        if (decoded.role === "admin") {
          console.log("[Middleware] Redirecting admin to dashboard");
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        console.log("[Middleware] Redirecting user to home");
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        console.error(
          "[Middleware] Token verification failed on signin:",
          error
        );
        // If token is invalid, clear it and stay on signin
        const response = NextResponse.next();
        response.cookies.set("token", "", { expires: new Date(0) });
        return response;
      }
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
