-- Creación de la tabla projects
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'review', 'pending', 'done')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  color text not null default '#22C55E',
  owner_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS)
alter table public.projects enable row level security;

-- Política: Los usuarios solo pueden ver sus propios proyectos
create policy "Users can view their own projects"
  on public.projects for select
  using ( auth.uid() = owner_id );

-- Política: Los usuarios pueden crear proyectos asignándose a sí mismos como dueños
create policy "Users can create their own projects"
  on public.projects for insert
  with check ( auth.uid() = owner_id );

-- Política: Los usuarios pueden actualizar sus propios proyectos
create policy "Users can update their own projects"
  on public.projects for update
  using ( auth.uid() = owner_id );

-- Política: Los usuarios pueden eliminar sus propios proyectos
create policy "Users can delete their own projects"
  on public.projects for delete
  using ( auth.uid() = owner_id );
