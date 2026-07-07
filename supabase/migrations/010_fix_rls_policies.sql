-- ============================================================
-- Migration 010: Fix weak RLS policies
-- Varias tablas tenían políticas INSERT/DELETE sin verificar
-- membresía del proyecto, permitiendo a cualquier usuario
-- autenticado modificar datos de cualquier proyecto.
-- ============================================================

-- 1. SPRINT TASKS
drop policy if exists "Miembros pueden gestionar sprint_tasks" on public.sprint_tasks;
create policy "Miembros pueden gestionar sprint_tasks"
  on public.sprint_tasks for insert
  with check (
    exists (
      select 1 from public.sprints s
      where s.id = sprint_id and public.is_project_member(s.project_id, auth.uid())
    )
  );

drop policy if exists "Miembros pueden eliminar sprint_tasks" on public.sprint_tasks;
create policy "Miembros pueden eliminar sprint_tasks"
  on public.sprint_tasks for delete
  using (
    exists (
      select 1 from public.sprints s
      where s.id = sprint_id and public.is_project_member(s.project_id, auth.uid())
    )
  );

-- 2. TASK DEPENDENCIES
drop policy if exists "Miembros pueden crear dependencias" on public.task_dependencies;
create policy "Miembros pueden crear dependencias"
  on public.task_dependencies for insert
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and public.is_project_member(t.project_id, auth.uid())
    )
  );

drop policy if exists "Miembros pueden eliminar dependencias" on public.task_dependencies;
create policy "Miembros pueden eliminar dependencias"
  on public.task_dependencies for delete
  using (
    exists (
      select 1 from public.tasks t
      where (t.id = task_id or t.id = depends_on_task_id)
      and public.is_project_member(t.project_id, auth.uid())
    )
  );

-- 3. TASK CUSTOM FIELD VALUES
drop policy if exists "Miembros pueden insertar/actualizar valores" on public.task_custom_field_values;
create policy "Miembros pueden insertar/actualizar valores"
  on public.task_custom_field_values for insert
  with check (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and public.is_project_member(t.project_id, auth.uid())
    )
  );

drop policy if exists "Miembros pueden actualizar valores" on public.task_custom_field_values;
create policy "Miembros pueden actualizar valores"
  on public.task_custom_field_values for update
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and public.is_project_member(t.project_id, auth.uid())
    )
  );

drop policy if exists "Miembros pueden eliminar valores" on public.task_custom_field_values;
create policy "Miembros pueden eliminar valores"
  on public.task_custom_field_values for delete
  using (
    exists (
      select 1 from public.tasks t
      where t.id = task_id and public.is_project_member(t.project_id, auth.uid())
    )
  );
