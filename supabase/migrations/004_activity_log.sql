-- 1. Tabla de comentarios en tareas
create table public.task_comments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índice para cargar comentarios por tarea ordenados
create index idx_task_comments_task_id on public.task_comments (task_id, created_at asc);

-- Habilitar RLS
alter table public.task_comments enable row level security;

-- Políticas RLS para task_comments
create policy "Miembros pueden ver comentarios de sus tareas"
  on public.task_comments for select
  using ( public.is_project_member(
    (select project_id from public.tasks where id = task_id),
    auth.uid()
  ));

create policy "Miembros pueden comentar en sus tareas"
  on public.task_comments for insert
  with check (
    user_id = auth.uid()
    and public.is_project_member(
      (select project_id from public.tasks where id = task_id),
      auth.uid()
    )
  );

create policy "Autor puede eliminar su comentario"
  on public.task_comments for delete
  using ( user_id = auth.uid() );

-- 2. Tabla de activity log (feed del proyecto)
create table public.activity_log (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  task_id uuid references public.tasks on delete set null,
  user_id uuid references public.profiles on delete cascade not null,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index idx_activity_log_project on public.activity_log (project_id, created_at desc);
create index idx_activity_log_task on public.activity_log (task_id);

-- Habilitar RLS
alter table public.activity_log enable row level security;

-- Políticas RLS para activity_log
create policy "Miembros pueden ver activity log del proyecto"
  on public.activity_log for select
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Sistema puede insertar activity log"
  on public.activity_log for insert
  with check (
    user_id = auth.uid()
    and public.is_project_member(project_id, auth.uid())
  );

-- 3. Función para registrar actividad automática desde triggers
create or replace function public.log_task_activity()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (project_id, task_id, user_id, action, metadata)
    values (
      new.project_id,
      new.id,
      coalesce(new.created_by, auth.uid()),
      'task_created',
      jsonb_build_object('title', new.title, 'status', new.status)
    );
  elsif tg_op = 'UPDATE' then
    if old.status <> new.status then
      insert into public.activity_log (project_id, task_id, user_id, action, metadata)
      values (
        new.project_id,
        new.id,
        auth.uid(),
        'task_moved',
        jsonb_build_object('title', new.title, 'from_status', old.status, 'to_status', new.status)
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para log automático de tareas
create trigger on_task_activity
  after insert or update on public.tasks
  for each row execute function public.log_task_activity();

-- 4. Agregar tablas a la publicación Realtime de Supabase
-- (requerido para que postgres_changes funcione en todas)
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.project_members;
alter publication supabase_realtime add table public.task_comments;
alter publication supabase_realtime add table public.activity_log;
