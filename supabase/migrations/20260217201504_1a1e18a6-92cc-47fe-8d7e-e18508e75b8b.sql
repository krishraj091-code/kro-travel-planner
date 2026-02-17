
-- Add place_name column to trip_photos for destination/place tagging
ALTER TABLE public.trip_photos ADD COLUMN IF NOT EXISTS place_name text;
