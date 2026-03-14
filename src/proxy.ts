import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = path.includes("/dashboard") || path.includes("/admin");

  if (isProtected) {
    const sessionCookie = req.cookies.get("session");

    if (!sessionCookie) {
      const url = req.nextUrl.clone();
      const segments = url.pathname.split("/");
      const currentLocale = routing.locales.includes(segments[1] as any)
        ? segments[1]
        : routing.defaultLocale;

      url.pathname = `/${currentLocale}/login`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
