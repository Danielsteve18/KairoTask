import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
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
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para crear un proyecto." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { name, description, color } = body;

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "El nombre del proyecto es obligatorio." },
      { status: 400 }
    );
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: project, error: projectError } = await supabaseAdmin
    .from("projects")
    .insert([{
      name: name.trim(),
      description: description || null,
      color: color || "#22C55E",
      owner_id: user.id,
    }])
    .select()
    .single();

  if (projectError) {
    return NextResponse.json(
      { error: projectError.message },
      { status: 500 }
    );
  }

  const { error: memberError } = await supabaseAdmin
    .from("project_members")
    .insert([{
      project_id: project.id,
      user_id: user.id,
      role: "owner",
    }]);

  if (memberError) {
    console.error("Error adding owner to project_members:", memberError);
  }

  return NextResponse.json(project, { status: 201 });
}
