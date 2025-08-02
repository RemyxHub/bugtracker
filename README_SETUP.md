# Bug Tracking System - Local Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bug-tracking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables Setup**
   
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase project details:
   
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_PROJECT_ID=your-project-id
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_KEY=your-service-role-key-here
   
   # Tempo Configuration
   VITE_TEMPO=true
   
   # Development Configuration
   NODE_ENV=development
   VITE_BASE_PATH=/
   ```

## Supabase Setup

### 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key from Settings > API

### 2. Database Setup

Run the migration file located at `supabase/migrations/20241201000001_create_bug_tracking_system.sql` in your Supabase SQL editor.

### 3. Get Your Environment Variables

**From Supabase Dashboard:**
- Go to Settings > API
- Copy the following:
  - `Project URL` → `VITE_SUPABASE_URL` and `SUPABASE_URL`
  - `anon public` key → `VITE_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_KEY`
  - Project ID from URL → `SUPABASE_PROJECT_ID`

## Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Application Features

### Public Features
- **Bug Report Submission**: Users can submit bug reports at `/`
- **Ticket Tracking**: Users can track their tickets at `/track-ticket`

### Admin Features
- **Admin Login**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard` (Analytics and overview)
- **View All Tickets**: `/admin/view-tickets` (Comprehensive ticket management)

### Call Centre Features
- **Staff Login**: `/callcentre/login`
- **Staff Dashboard**: `/callcentre/dashboard`

## Demo Credentials

### Admin Users
- Email: `remy@ryotek.my` / Password: `admin123`
- Email: `admin@company.com` / Password: `admin123`

### Call Centre Staff
- Employee ID: `CC001` / Password: `staff123`
- Employee ID: `CC002` / Password: `staff123`

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" Error**
   - Ensure all environment variables are set in your `.env` file
   - Check that variable names match exactly (case-sensitive)
   - Restart the development server after changing environment variables

2. **Database Connection Issues**
   - Verify your Supabase URL and keys are correct
   - Ensure your Supabase project is active
   - Check that the database migration has been run

3. **Authentication Issues**
   - Verify the demo credentials are set up in your database
   - Check that the users table has the correct data

### Environment Variable Locations

The following files contain Supabase environment variable references:
- `src/lib/supabase.ts` (Main configuration)
- `src/components/BugReportForm.tsx`
- `src/components/TicketTracker.tsx`
- `src/components/auth/AdminLoginPage.tsx`
- `src/components/auth/CallCentreLoginPage.tsx`
- `src/components/admin/AnalyticsDashboard.tsx`
- `src/components/admin/TicketManagement.tsx`
- `src/components/admin/ViewTickets.tsx`

## Support

If you encounter any issues during setup, please check:
1. All environment variables are correctly set
2. Supabase project is active and accessible
3. Database migration has been executed
4. Node.js version is compatible (v16+)
