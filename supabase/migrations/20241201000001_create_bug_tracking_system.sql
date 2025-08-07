CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'callcentre')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  reset_token TEXT,
  reset_token_expires TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  application_name TEXT NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  assigned_to UUID REFERENCES public.users(id),
  image_urls TEXT[],
  video_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.ticket_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_change NUMERIC,
  metric_increased BOOLEAN,
  metric_label TEXT,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chart_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chart_type TEXT NOT NULL CHECK (chart_type IN ('sales', 'activity')),
  month TEXT NOT NULL,
  value NUMERIC NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.users (email, password_hash, name, employee_id, role, status) VALUES 
('remy@ryotek.my', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Remy Admin', 'ADM001', 'admin', 'active'),
('admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'ADM002', 'admin', 'active'),
('john.smith@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Smith', 'CC001', 'callcentre', 'active'),
('sarah.johnson@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'CC002', 'callcentre', 'active')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.analytics_data (metric_name, metric_value, metric_change, metric_increased, metric_label) VALUES 
('orders', 201, 8.2, true, 'since last month'),
('approved', 36, 3.4, true, 'since last month'),
('users', 4890, null, null, 'since last month'),
('subscriptions', 1201, null, null, 'since last month'),
('month_total', 25410, 0.2, false, 'since last month'),
('revenue', 1352, 1.2, false, 'since last month'),
('paid_invoices', 30256.23, 15, true, 'Current Fiscal Year'),
('funds_received', 150256.23, 8, true, 'Current Fiscal Year');

INSERT INTO public.chart_data (chart_type, month, value, year) VALUES 
('sales', 'JAN', 120, 2024),
('sales', 'FEB', 150, 2024),
('sales', 'MAR', 180, 2024),
('sales', 'APR', 140, 2024),
('sales', 'MAY', 200, 2024),
('sales', 'JUN', 170, 2024),
('sales', 'JUL', 190, 2024),
('sales', 'AUG', 220, 2024),
('sales', 'SEP', 160, 2024),
('sales', 'OCT', 180, 2024),
('sales', 'NOV', 210, 2024),
('sales', 'DEC', 240, 2024),
('activity', 'JAN', 80, 2024),
('activity', 'FEB', 95, 2024),
('activity', 'MAR', 110, 2024),
('activity', 'APR', 85, 2024),
('activity', 'MAY', 130, 2024),
('activity', 'JUN', 120, 2024),
('activity', 'JUL', 140, 2024),
('activity', 'AUG', 160, 2024),
('activity', 'SEP', 100, 2024),
('activity', 'OCT', 115, 2024),
('activity', 'NOV', 135, 2024),
('activity', 'DEC', 150, 2024);

INSERT INTO public.tickets (ticket_number, title, application_name, description, steps_to_reproduce, severity, status, customer_name, customer_email, customer_phone, created_at) VALUES 
('TCK01122024-0001', 'Login button not working', 'Main Website', 'The login button does not respond when clicked', '1. Go to login page 2. Enter credentials 3. Click login button', 'high', 'open', 'Press Johnson', 'press@example.com', '+1234567890', NOW() - INTERVAL '2 days'),
('TCK01122024-0002', 'Page loading slowly', 'Mobile App', 'The dashboard page takes too long to load', '1. Open mobile app 2. Navigate to dashboard 3. Wait for page to load', 'medium', 'assigned', 'Marina Smith', 'marina@example.com', '+1234567891', NOW() - INTERVAL '1 day'),
('TCK01122024-0003', 'Data not saving', 'Admin Panel', 'Form data is not being saved to database', '1. Fill out form 2. Click save 3. Check if data persists', 'critical', 'in_progress', 'Alex Brown', 'alex@example.com', null, NOW() - INTERVAL '3 hours'),
('TCK01122024-0004', 'Email notifications missing', 'Notification System', 'Users are not receiving email notifications', '1. Trigger notification event 2. Check email inbox', 'high', 'resolved', 'Robert Wilson', 'robert@example.com', '+1234567892', NOW() - INTERVAL '5 days');

alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.tickets;
alter publication supabase_realtime add table public.ticket_notes;
alter publication supabase_realtime add table public.analytics_data;
alter publication supabase_realtime add table public.chart_data;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();