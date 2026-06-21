-- Webhooks & Email notifications for KairoTask

-- 1. WEBHOOKS TABLE
create table public.project_webhooks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  url text not null,
  events text[] not null default '{}',
  is_active boolean default true,
  secret text,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create trigger handle_webhook_updated_at before update on public.project_webhooks
  for each row execute procedure moddatetime (updated_at);

create index idx_project_webhooks on public.project_webhooks (project_id);

alter table public.project_webhooks enable row level security;

create policy "Miembros pueden ver webhooks"
  on public.project_webhooks for select
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden crear webhooks"
  on public.project_webhooks for insert
  with check ( public.is_project_member(project_id, auth.uid()) and created_by = auth.uid() );

create policy "Miembros pueden actualizar webhooks"
  on public.project_webhooks for update
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden eliminar webhooks"
  on public.project_webhooks for delete
  using ( public.is_project_member(project_id, auth.uid()) );

-- 2. NOTIFICATION LOG (for email/push tracking)
alter table public.notifications add column if not exists email_sent boolean default false;
alter table public.notifications add column if not exists email_sent_at timestamp with time zone;

-- 3. Add task_assignment notification for new tasks (not just updates)
create or replace function public.handle_new_task_notification()
returns trigger as $$
begin
  if new.assignee_id is not null then
    insert into public.notifications (user_id, type, title, message, link)
    values (
      new.assignee_id,
      'task_assigned',
      new.title,
      'Te asignaron una nueva tarea',
      '/projects/' || new.project_id
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_new_task_notification
  after insert on public.tasks
  for each row
  execute function public.handle_new_task_notification();

-- 4. Add webhook event publication table (for edge function consumption)
create table public.webhook_queue (
  id uuid default gen_random_uuid() primary key,
  webhook_id uuid references public.project_webhooks on delete cascade,
  event text not null,
  payload jsonb not null default '{}'::jsonb,
  status text default 'pending' check (status in ('pending', 'sent', 'failed')),
  retries integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_webhook_queue_status on public.webhook_queue (status, created_at);

alter table public.webhook_queue enable row level security;
create policy "Sistema puede gestionar webhook_queue"
  on public.webhook_queue for all
  using ( true )
  with check ( true );

-- 5. Add to realtime
do $$
declare
  tbl text;
  tables text[] := array['project_webhooks', 'webhook_queue'];
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
