import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, Trash2, Share2, Film, BookOpen, Loader2, X, Plus, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TripGallery = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showAlbum, setShowAlbum] = useState(false);

  useEffect(() => {
    init();
  }, [tripId]);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth?redirect=/trip-gallery/" + tripId); return; }
    setUser(user);

    const { data: tripData } = await supabase
      .from("saved_itineraries")
      .select("*")
      .eq("id", tripId)
      .single();

    if (!tripData) { navigate("/my-trips"); return; }
    setTrip(tripData);
    await fetchPhotos(user.id);
    setLoading(false);
  };

  const fetchPhotos = async (userId: string) => {
    const { data } = await supabase
      .from("trip_photos")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });
    setPhotos(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/${tripId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("trip-photos")
        .upload(path, file);

      if (!uploadError) {
        await supabase.from("trip_photos").insert({
          user_id: user.id,
          trip_id: tripId,
          storage_path: path,
          caption: file.name,
        });
      }
    }

    await fetchPhotos(user.id);
    setUploading(false);
    toast({ title: `${files.length} photo(s) uploaded!` });
  };

  const deletePhoto = async (photo: any) => {
    await supabase.storage.from("trip-photos").remove([photo.storage_path]);
    await supabase.from("trip_photos").delete().eq("id", photo.id);
    setPhotos(prev => prev.filter(p => p.id !== photo.id));
    toast({ title: "Photo deleted" });
  };

  const handleShare = async () => {
    if (!shareEmail || !user || !tripId) return;
    await supabase.from("shared_trips").insert({
      trip_id: tripId,
      owner_id: user.id,
      shared_with_email: shareEmail,
    });
    setShareEmail("");
    toast({ title: "Trip shared!", description: `Invited ${shareEmail}` });
  };

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage.from("trip-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading mb-2">
              📸 {trip?.destination} Gallery
            </h1>
            <p className="text-muted-foreground">
              {photos.length} photos · Your private trip memories
            </p>
          </motion.div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-full">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              {uploading ? "Uploading..." : "Upload Photos"}
            </Button>
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleUpload} />

            {photos.length >= 5 && (
              <Button variant="outline" className="rounded-full" onClick={() => setShowAlbum(true)}>
                <BookOpen className="w-4 h-4 mr-2" /> View Album
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Share2 className="w-4 h-4 mr-2" /> Share Trip
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Trip Gallery</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">
                  Invite friends who traveled with you. They can view and download all photos.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="friend@email.com"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="rounded-xl"
                  />
                  <Button onClick={handleShare} className="rounded-xl">Invite</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Photo Grid */}
          {photos.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading mb-2">No photos yet</h2>
              <p className="text-muted-foreground mb-6">Upload your trip photos to create albums and reels</p>
              <Button onClick={() => fileInputRef.current?.click()} className="rounded-full">
                <Upload className="w-4 h-4 mr-2" /> Upload First Photo
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPhoto(getPhotoUrl(photo.storage_path))}
                >
                  <img
                    src={getPhotoUrl(photo.storage_path)}
                    alt={photo.caption || "Trip photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); deletePhoto(photo); }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive/80 text-white hover:bg-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {/* Upload tile */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Plus className="w-8 h-8" />
                <span className="text-xs">Add More</span>
              </button>
            </div>
          )}

          {/* Lightbox */}
          {selectedPhoto && (
            <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
              <button className="absolute top-4 right-4 text-white p-2" onClick={() => setSelectedPhoto(null)}>
                <X className="w-8 h-8" />
              </button>
              <img src={selectedPhoto} alt="Full size" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
            </div>
          )}

          {/* Virtual Album Modal */}
          {showAlbum && (
            <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4" onClick={() => setShowAlbum(false)}>
              <button className="absolute top-4 right-4 text-white p-2" onClick={() => setShowAlbum(false)}>
                <X className="w-8 h-8" />
              </button>
              <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-white text-2xl font-heading text-center mb-6">
                  ✨ {trip?.destination} — Virtual Album
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {photos.slice(0, 15).map((photo, i) => {
                    const spans: Record<number, string> = {
                      0: "col-span-2 row-span-2",
                      4: "col-span-2",
                      9: "col-span-2",
                    };
                    return (
                      <div key={photo.id} className={`${spans[i] || ""} rounded-lg overflow-hidden`}>
                        <img
                          src={getPhotoUrl(photo.storage_path)}
                          alt={photo.caption || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-center text-white/60 text-sm mt-6">
                  KroTravel · Your memories, beautifully preserved
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TripGallery;
