-- Create team_members table for admin-managed team entries
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Anyone can view active team members (public page)
CREATE POLICY "Anyone can view active team members"
  ON public.team_members FOR SELECT
  USING (is_active = true);

-- Admins can manage all team members
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for team / founder photos
INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Public read policy for team photos
CREATE POLICY "Team photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-photos');

-- Admins can upload team photos
CREATE POLICY "Admins can upload team photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'team-photos' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete team photos
CREATE POLICY "Admins can delete team photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'team-photos' AND has_role(auth.uid(), 'admin'::app_role));
