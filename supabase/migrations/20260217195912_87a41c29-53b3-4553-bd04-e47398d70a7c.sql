
-- Create storage bucket for trip photos
INSERT INTO storage.buckets (id, name, public) VALUES ('trip-photos', 'trip-photos', true);

-- Storage policies for trip photos
CREATE POLICY "Users can upload trip photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trip-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view trip photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'trip-photos');

CREATE POLICY "Users can delete own trip photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'trip-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trip_photos table to track photos metadata
CREATE TABLE public.trip_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trip_id UUID REFERENCES public.saved_itineraries(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trip_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trip photos"
ON public.trip_photos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trip photos"
ON public.trip_photos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trip photos"
ON public.trip_photos FOR DELETE
USING (auth.uid() = user_id);

-- Shared trip access table
CREATE TABLE public.shared_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.saved_itineraries(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, shared_with_email)
);

ALTER TABLE public.shared_trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage shared trips"
ON public.shared_trips FOR ALL
USING (auth.uid() = owner_id);

CREATE POLICY "Shared users can view"
ON public.shared_trips FOR SELECT
USING (auth.uid() = shared_with_id);

-- Allow shared users to view trip photos
CREATE POLICY "Shared users can view shared trip photos"
ON public.trip_photos FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.shared_trips
    WHERE shared_trips.trip_id = trip_photos.trip_id
    AND shared_trips.shared_with_id = auth.uid()
  )
);

-- Add persona column to trip_preferences
ALTER TABLE public.trip_preferences ADD COLUMN IF NOT EXISTS travel_persona TEXT DEFAULT 'explorer';

-- Add multi-city support
ALTER TABLE public.trip_preferences ADD COLUMN IF NOT EXISTS multi_city_stops JSONB DEFAULT '[]'::jsonb;

-- Add user subscription tier tracking
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'free',
  storage_used_mb NUMERIC NOT NULL DEFAULT 0,
  storage_limit_mb NUMERIC NOT NULL DEFAULT 1024,
  albums_remaining INTEGER NOT NULL DEFAULT 1,
  reels_remaining INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
ON public.user_subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
ON public.user_subscriptions FOR UPDATE
USING (auth.uid() = user_id);
