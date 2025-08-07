@@ .. @@
 alter publication supabase_realtime add table public.chart_data;
 
+-- Enable RLS on tickets table and add INSERT policy for public submissions
+ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
+
+-- Allow anyone to insert tickets (for public bug submission form)
+CREATE POLICY "Allow public ticket submission" 
+  ON public.tickets 
+  FOR INSERT 
+  WITH CHECK (true);
+
+-- Allow authenticated users to read tickets they created or are assigned to
+CREATE POLICY "Users can read relevant tickets"
+  ON public.tickets
+  FOR SELECT
+  TO authenticated
+  USING (
+    assigned_to = auth.uid() OR 
+    EXISTS (
+      SELECT 1 FROM public.users 
+      WHERE users.id = auth.uid() AND users.role = 'admin'
+    )
+  );
+
+-- Allow authenticated users to update tickets they are assigned to or admins
+CREATE POLICY "Users can update assigned tickets"
+  ON public.tickets
+  FOR UPDATE
+  TO authenticated
+  USING (
+    assigned_to = auth.uid() OR 
+    EXISTS (
+      SELECT 1 FROM public.users 
+      WHERE users.id = auth.uid() AND users.role = 'admin'
+    )
+  );
+
 CREATE OR REPLACE FUNCTION update_updated_at_column()
 RETURNS TRIGGER AS $$