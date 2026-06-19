-- 1. Crear tabla de perfiles públicos (profiles)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

-- Políticas para profiles
create policy "Cualquiera puede ver perfiles"
  on public.profiles for select
  using ( true );

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. Función y Trigger para sincronizar auth.users -> profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Sincronizar usuarios existentes (retroactivo)
insert into public.profiles (id, email, full_name, avatar_url)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)), 
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- 3. Crear tabla project_members
create table public.project_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  role text not null default 'collaborator' check (role in ('owner', 'collaborator', 'viewer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_project_member unique (project_id, user_id)
);

-- Habilitar RLS en project_members
alter table public.project_members enable row level security;

-- 4. Función de utilidad para verificar membresía (evita recursión circular en RLS)
create or replace function public.is_project_member(proj_id uuid, usr_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.projects where id = proj_id and owner_id = usr_id
  ) or exists (
    select 1 from public.project_members where project_id = proj_id and user_id = usr_id
  );
end;
$$ language plpgsql security definer;

-- 5. Políticas RLS para project_members
create policy "Miembros pueden ver la lista de miembros del proyecto"
  on public.project_members for select
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Dueño del proyecto puede agregar miembros"
  on public.project_members for insert
  with check (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

create policy "Dueño del proyecto puede actualizar roles"
  on public.project_members for update
  using (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

create policy "Dueño del proyecto puede remover miembros"
  on public.project_members for delete
  using (
    exists (
      select 1 from public.projects
      where id = project_id and owner_id = auth.uid()
    )
  );

-- 6. Actualizar Políticas de la tabla projects para dar acceso a los miembros
drop policy if exists "Users can view their own projects" on public.projects;
create policy "Miembros y dueños pueden ver proyectos"
  on public.projects for select
  using ( public.is_project_member(id, auth.uid()) );

-- 7. Actualizar Políticas de la tabla tasks para dar acceso a los miembros
drop policy if exists "Users can view tasks of their projects" on public.tasks;
create policy "Miembros pueden ver tareas"
  on public.tasks for select
  using ( public.is_project_member(project_id, auth.uid()) );

drop policy if exists "Users can create tasks in their projects" on public.tasks;
create policy "Miembros pueden crear tareas"
  on public.tasks for insert
  with check (
    public.is_project_member(project_id, auth.uid()) 
    and created_by = auth.uid()
  );

drop policy if exists "Users can update tasks of their projects" on public.tasks;
create policy "Miembros pueden actualizar tareas"
  on public.tasks for update
  using ( public.is_project_member(project_id, auth.uid()) );

drop policy if exists "Users can delete tasks of their projects" on public.tasks;
create policy "Miembros pueden eliminar tareas"
  on public.tasks for delete
  using ( public.is_project_member(project_id, auth.uid()) );
