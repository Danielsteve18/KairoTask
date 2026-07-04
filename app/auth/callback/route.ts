import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabaseResponse = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
      const errorUrl = new URL("/login", origin);
      errorUrl.searchParams.set("error", "AuthError");
      return NextResponse.redirect(errorUrl);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isNew = user?.created_at === user?.updated_at;

    const confirmedUrl = isNew
      ? new URL("/auth/confirmed?first=true", origin)
      : new URL("/auth/confirmed", origin);

    return NextResponse.redirect(confirmedUrl);
  }

  const errorUrl = new URL("/login", origin);
  errorUrl.searchParams.set("error", "NoCode");
  return NextResponse.redirect(errorUrl);
}
