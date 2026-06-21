-- ============================================================
-- Migration 008: Complete Management Features
-- Sprints, task dependencies, invitations, custom fields
-- ============================================================

-- 1. SPRINTS
create table public.sprints (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  goal text,
  start_date date not null,
  end_date date not null,
  status text not null default 'planning' check (status in ('planning', 'active', 'completed', 'cancelled')),
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_sprint_name_per_project unique (project_id, name)
);

create index idx_sprints_project on public.sprints (project_id, created_at desc);

alter table public.sprints enable row level security;

create policy "Miembros pueden ver sprints"
  on public.sprints for select
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden crear sprints"
  on public.sprints for insert
  with check (
    public.is_project_member(project_id, auth.uid())
    and created_by = auth.uid()
  );

create policy "Miembros pueden actualizar sprints"
  on public.sprints for update
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden eliminar sprints"
  on public.sprints for delete
  using ( public.is_project_member(project_id, auth.uid()) );

-- 2. SPRINT TASKS (junction)
create table public.sprint_tasks (
  id uuid default gen_random_uuid() primary key,
  sprint_id uuid references public.sprints on delete cascade not null,
  task_id uuid references public.tasks on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_sprint_task unique (sprint_id, task_id)
);

alter table public.sprint_tasks enable row level security;

create policy "Miembros pueden ver sprint_tasks"
  on public.sprint_tasks for select
  using ( exists (
    select 1 from public.sprints s
    where s.id = sprint_id and public.is_project_member(s.project_id, auth.uid())
  ));

create policy "Miembros pueden gestionar sprint_tasks"
  on public.sprint_tasks for insert
  with check ( auth.uid() is not null );

create policy "Miembros pueden eliminar sprint_tasks"
  on public.sprint_tasks for delete
  using ( true );

-- 3. TASK DEPENDENCIES
create table public.task_dependencies (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks on delete cascade not null,
  depends_on_task_id uuid references public.tasks on delete cascade not null,
  dependency_type text not null default 'blocks' check (dependency_type in ('blocks', 'requires')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_dependency unique (task_id, depends_on_task_id),
  constraint no_self_dependency check (task_id <> depends_on_task_id)
);

create index idx_task_dependencies_task on public.task_dependencies (task_id);
create index idx_task_dependencies_depends on public.task_dependencies (depends_on_task_id);

alter table public.task_dependencies enable row level security;

create policy "Miembros pueden ver dependencias"
  on public.task_dependencies for select
  using ( exists (
    select 1 from public.tasks t
    where (t.id = task_id or t.id = depends_on_task_id)
    and public.is_project_member(t.project_id, auth.uid())
  ));

create policy "Miembros pueden crear dependencias"
  on public.task_dependencies for insert
  with check ( true );

create policy "Miembros pueden eliminar dependencias"
  on public.task_dependencies for delete
  using ( true );

-- 4. PROJECT INVITATIONS
create table public.project_invitations (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  invited_email text not null,
  invited_by uuid references auth.users not null,
  role text not null default 'collaborator' check (role in ('collaborator', 'viewer')),
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'expired')),
  message text,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_project_invitations_email on public.project_invitations (invited_email, status);
create index idx_project_invitations_token on public.project_invitations (token);

alter table public.project_invitations enable row level security;

create policy "Dueños pueden ver invitaciones de su proyecto"
  on public.project_invitations for select
  using ( exists (
    select 1 from public.projects where id = project_id and owner_id = auth.uid()
  ));

create policy "Dueños pueden crear invitaciones"
  on public.project_invitations for insert
  with check ( exists (
    select 1 from public.projects where id = project_id and owner_id = auth.uid()
  ));

create policy "Invitado puede ver su invitación por token"
  on public.project_invitations for select
  using ( token = current_setting('app.invitation_token', true) );

create policy "Invitado puede aceptar/rechazar"
  on public.project_invitations for update
  using ( token = current_setting('app.invitation_token', true) );

-- 5. TASK CUSTOM FIELDS (schema definition per project)
create table public.task_custom_fields (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  name text not null,
  field_type text not null check (field_type in ('text', 'number', 'date', 'select', 'boolean')),
  options jsonb default '[]'::jsonb,
  required boolean default false,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_field_name_per_project unique (project_id, name)
);

create index idx_custom_fields_project on public.task_custom_fields (project_id, sort_order);

alter table public.task_custom_fields enable row level security;

create policy "Miembros pueden ver campos personalizados"
  on public.task_custom_fields for select
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden crear campos personalizados"
  on public.task_custom_fields for insert
  with check ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden actualizar campos personalizados"
  on public.task_custom_fields for update
  using ( public.is_project_member(project_id, auth.uid()) );

create policy "Miembros pueden eliminar campos personalizados"
  on public.task_custom_fields for delete
  using ( public.is_project_member(project_id, auth.uid()) );

-- 6. TASK CUSTOM FIELD VALUES
create table public.task_custom_field_values (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks on delete cascade not null,
  field_id uuid references public.task_custom_fields on delete cascade not null,
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_task_field unique (task_id, field_id)
);

create trigger handle_custom_field_updated_at before update on public.task_custom_field_values
  for each row execute procedure moddatetime (updated_at);

alter table public.task_custom_field_values enable row level security;

create policy "Miembros pueden ver valores de campos personalizados"
  on public.task_custom_field_values for select
  using ( exists (
    select 1 from public.tasks t
    where t.id = task_id and public.is_project_member(t.project_id, auth.uid())
  ));

create policy "Miembros pueden insertar/actualizar valores"
  on public.task_custom_field_values for insert
  with check ( auth.uid() is not null );

create policy "Miembros pueden actualizar valores"
  on public.task_custom_field_values for update
  using ( true );

create policy "Miembros pueden eliminar valores"
  on public.task_custom_field_values for delete
  using ( true );

-- 7. Update activity_log trigger to support more actions
create or replace function public.log_task_activity()
returns trigger as $$
declare
  v_project_id uuid;
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (project_id, task_id, user_id, action, metadata)
    values (
      new.project_id,
      new.id,
      coalesce(new.created_by, auth.uid()),
      'task_created',
      jsonb_build_object('title', new.title, 'status', new.status, 'priority', new.priority)
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
    if old.assignee_id is distinct from new.assignee_id then
      insert into public.activity_log (project_id, task_id, user_id, action, metadata)
      values (
        new.project_id,
        new.id,
        auth.uid(),
        'task_assigned',
        jsonb_build_object('title', new.title, 'from_assignee', old.assignee_id, 'to_assignee', new.assignee_id)
      );
    end if;
    if old.priority <> new.priority then
      insert into public.activity_log (project_id, task_id, user_id, action, metadata)
      values (
        new.project_id,
        new.id,
        auth.uid(),
        'task_priority_changed',
        jsonb_build_object('title', new.title, 'from_priority', old.priority, 'to_priority', new.priority)
      );
    end if;
  elsif tg_op = 'DELETE' then
    v_project_id := old.project_id;
    insert into public.activity_log (project_id, task_id, user_id, action, metadata)
    values (
      v_project_id,
      null,
      auth.uid(),
      'task_deleted',
      jsonb_build_object('title', old.title)
    );
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

-- 8. Trigger functions for sprint activity
create or replace function public.log_sprint_activity()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (project_id, user_id, action, metadata)
    values (
      new.project_id,
      auth.uid(),
      'sprint_created',
      jsonb_build_object('sprint_name', new.name, 'sprint_status', new.status)
    );
  elsif tg_op = 'UPDATE' and old.status <> new.status then
    insert into public.activity_log (project_id, user_id, action, metadata)
    values (
      new.project_id,
      auth.uid(),
      'sprint_status_changed',
      jsonb_build_object('sprint_name', new.name, 'from_status', old.status, 'to_status', new.status)
    );
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_sprint_activity
  after insert or update on public.sprints
  for each row execute function public.log_sprint_activity();

-- 9. Trigger function for invitation activity
create or replace function public.log_invitation_activity()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (project_id, user_id, action, metadata)
    values (
      new.project_id,
      new.invited_by,
      'member_invited',
      jsonb_build_object('invited_email', new.invited_email, 'role', new.role)
    );
  elsif tg_op = 'UPDATE' and new.status = 'accepted' and old.status = 'pending' then
    insert into public.activity_log (project_id, user_id, action, metadata)
    values (
      new.project_id,
      auth.uid(),
      'member_joined',
      jsonb_build_object('invited_email', new.invited_email)
    );
  end if;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_invitation_activity
  after insert or update on public.project_invitations
  for each row execute function public.log_invitation_activity();

-- 10. Add new tables to realtime publication
do $$
declare
  tbl text;
  tables text[] := array['sprints', 'sprint_tasks', 'task_dependencies', 'project_invitations', 'task_custom_fields', 'task_custom_field_values'];
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
