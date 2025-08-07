-- Add image_urls and video_urls columns to tickets table
ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS image_urls TEXT[],
ADD COLUMN IF NOT EXISTS video_urls TEXT[];
