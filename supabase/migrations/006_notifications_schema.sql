-- 1. Preferencias de notificación por usuario
create table public.notification_preferences (
  user_id uuid references public.profiles on delete cascade primary key,
  email boolean default true,
  push boolean default false,
  task_assignment boolean default true,
  mentions boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabla de notificaciones
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  type text not null check (type in ('task_assigned', 'comment', 'mention', 'deadline')),
  title text not null,
  message text,
  link text,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices
create index idx_notifications_user on public.notifications (user_id, created_at desc);
create index idx_notifications_unread on public.notifications (user_id, is_read) where is_read = false;

-- 3. Habilitar RLS
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;

-- 4. Políticas RLS para notifications
create policy "Usuarios pueden ver sus notificaciones"
  on public.notifications for select
  using ( auth.uid() = user_id );

create policy "Usuarios pueden marcar sus notificaciones como leídas"
  on public.notifications for update
  using ( auth.uid() = user_id );

create policy "Sistema puede insertar notificaciones"
  on public.notifications for insert
  with check ( true );

create policy "Usuarios pueden eliminar sus notificaciones"
  on public.notifications for delete
  using ( auth.uid() = user_id );

-- 5. Políticas RLS para notification_preferences
create policy "Usuarios pueden ver sus preferencias"
  on public.notification_preferences for select
  using ( auth.uid() = user_id );

create policy "Usuarios pueden crear sus preferencias"
  on public.notification_preferences for insert
  with check ( auth.uid() = user_id );

create policy "Usuarios pueden actualizar sus preferencias"
  on public.notification_preferences for update
  using ( auth.uid() = user_id );

-- 6. Trigger function: notificar asignación de tarea
create or replace function public.handle_task_assignment_notification()
returns trigger as $$
declare
  assigner_name text;
  pref_exists boolean;
begin
  if new.assignee_id is not null and (old.assignee_id is distinct from new.assignee_id) then
    select exists (
      select 1 from public.notification_preferences
      where user_id = new.assignee_id and task_assignment = true
    ) into pref_exists;

    if pref_exists then
      select coalesce(full_name, email) into assigner_name
      from public.profiles where id = auth.uid();

      insert into public.notifications (user_id, type, title, message, link)
      values (
        new.assignee_id,
        'task_assigned',
        new.title,
        assigner_name || ' te asignó esta tarea',
        '/projects/' || new.project_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para asignación
create trigger on_task_assignment_notification
  after update of assignee_id on public.tasks
  for each row
  execute function public.handle_task_assignment_notification();

-- 7. Trigger function: notificar comentario en tarea asignada
create or replace function public.handle_comment_notification()
returns trigger as $$
declare
  task_info record;
  commenter_name text;
  pref_exists boolean;
begin
  select t.assignee_id, t.title, t.project_id into task_info
  from public.tasks where id = new.task_id;

  if task_info.assignee_id is not null and task_info.assignee_id <> new.user_id then
    select exists (
      select 1 from public.notification_preferences
      where user_id = task_info.assignee_id and mentions = true
    ) into pref_exists;

    if pref_exists then
      select coalesce(full_name, email) into commenter_name
      from public.profiles where id = new.user_id;

      insert into public.notifications (user_id, type, title, message, link)
      values (
        task_info.assignee_id,
        'comment',
        task_info.title,
        commenter_name || ' comentó en tu tarea',
        '/projects/' || task_info.project_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para comentarios
create trigger on_comment_notification
  after insert on public.task_comments
  for each row
  execute function public.handle_comment_notification();

-- 8. Agregar a Realtime
do $$
declare
  tbl text;
  tables text[] := array['notifications'];
begin
  foreach tbl in array tables
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    exception
      when duplicate_object then
        null;
    end;
  end loop;
end $$;
