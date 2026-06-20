-- 1. Buckets de storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('task-attachments', 'task-attachments', false, 10485760, null)
on conflict (id) do nothing;

-- 2. RLS para avatars
create policy "Avatars son públicos"
on storage.objects for select
using (bucket_id = 'avatars');

create policy "Usuarios autenticados pueden subir avatars"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
);

create policy "Propietario puede actualizar su avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

create policy "Propietario puede eliminar su avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

-- 3. RLS para task-attachments
create policy "Miembros del proyecto pueden leer adjuntos"
on storage.objects for select
using (
  bucket_id = 'task-attachments'
  and auth.role() = 'authenticated'
  and exists (
    select 1 from public.task_attachments ta
    join public.tasks t on t.id = ta.task_id
    join public.project_members pm on pm.project_id = t.project_id and pm.user_id = auth.uid()
    where ta.storage_path = name
  )
);

create policy "Miembros del proyecto pueden subir adjuntos"
on storage.objects for insert
with check (
  bucket_id = 'task-attachments'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Propietario del archivo puede eliminar adjunto"
on storage.objects for delete
using (
  bucket_id = 'task-attachments'
  and auth.role() = 'authenticated'
  and owner = auth.uid()
);

-- 4. Tabla task_attachments
create table public.task_attachments (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references public.tasks on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_size integer not null,
  mime_type text not null,
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index idx_task_attachments_task on public.task_attachments (task_id, created_at desc);

-- 5. RLS para task_attachments
alter table public.task_attachments enable row level security;

create policy "Miembros pueden ver adjuntos"
on public.task_attachments for select
using (
  exists (
    select 1 from public.project_members pm
    join public.tasks t on t.project_id = pm.project_id
    where t.id = task_id and pm.user_id = auth.uid()
  )
);

create policy "Miembros pueden crear adjuntos"
on public.task_attachments for insert
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.project_members pm
    join public.tasks t on t.project_id = pm.project_id
    where t.id = task_id and pm.user_id = auth.uid()
  )
);

create policy "Creador puede eliminar adjunto"
on public.task_attachments for delete
using (user_id = auth.uid());

-- 6. Agregar a Realtime
alter publication supabase_realtime add table public.task_attachments;
