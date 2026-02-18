-- Enable realtime for admin live activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_itineraries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_usage_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.promo_code_uses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcast_notifications;