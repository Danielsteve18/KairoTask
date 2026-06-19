-- Creación de la tabla tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  title text not null,
  description text,
  status text not null default 'backlog' check (status in ('backlog', 'in-progress', 'review', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  assignee_id uuid references auth.users on delete set null,
  due_date timestamp with time zone,
  tags text[] default '{}',
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger para updated_at
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before update on public.tasks 
  for each row execute procedure moddatetime (updated_at);

-- Habilitar Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Política: Usuarios pueden ver tareas si son dueños del proyecto (simplificación inicial)
create policy "Users can view tasks of their projects"
  on public.tasks for select
  using ( 
    exists (
      select 1 from public.projects 
      where id = tasks.project_id 
      and owner_id = auth.uid()
    )
  );

-- Política: Usuarios pueden crear tareas en sus proyectos
create policy "Users can create tasks in their projects"
  on public.tasks for insert
  with check ( 
    exists (
      select 1 from public.projects 
      where id = project_id 
      and owner_id = auth.uid()
    )
    and created_by = auth.uid()
  );

-- Política: Usuarios pueden actualizar tareas de sus proyectos
create policy "Users can update tasks of their projects"
  on public.tasks for update
  using ( 
    exists (
      select 1 from public.projects 
      where id = tasks.project_id 
      and owner_id = auth.uid()
    )
  );

-- Política: Usuarios pueden eliminar tareas de sus proyectos
create policy "Users can delete tasks of their projects"
  on public.tasks for delete
  using ( 
    exists (
      select 1 from public.projects 
      where id = tasks.project_id 
      and owner_id = auth.uid()
    )
  );
