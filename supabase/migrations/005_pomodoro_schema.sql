CREATE TABLE pomodoro_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_minutes int NOT NULL,
  type text NOT NULL CHECK (type IN ('focus', 'break', 'long_break')),
  completed boolean NOT NULL DEFAULT false
);

ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read_own_sessions"
  ON pomodoro_sessions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "users_can_insert_own_sessions"
  ON pomodoro_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "users_can_update_own_sessions"
  ON pomodoro_sessions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);
