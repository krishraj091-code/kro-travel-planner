import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Upload, Trash2, Share2, BookOpen, Loader2, X, Plus, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
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

  // Place-based upload state
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [activePlaceUpload, setActivePlaceUpload] = useState<string | null>(null);

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, placeName: string) => {
    const files = e.target.files;
    if (!files || !user || !placeName) return;
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
          place_name: placeName,
        });
      }
    }

    await fetchPhotos(user.id);
    setUploading(false);
    setActivePlaceUpload(null);
    toast({ title: `${files.length} photo(s) added to "${placeName}"` });
    // Reset the file input
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  // Group photos by place_name
  const places = photos.reduce<Record<string, any[]>>((acc, photo) => {
    const place = photo.place_name || "Uncategorized";
    if (!acc[place]) acc[place] = [];
    acc[place].push(photo);
    return acc;
  }, {});

  const placeNames = Object.keys(places);

  // Get itinerary destinations for suggestions
  const itineraryPlaces: string[] = [];
  const itData = trip?.itinerary_data as any;
  if (itData?.days) {
    for (const day of itData.days) {
      if (day.activities) {
        for (const act of day.activities) {
          if (act.activity && !itineraryPlaces.includes(act.activity)) {
            itineraryPlaces.push(act.activity);
          }
        }
      }
    }
  }

  const handleAddPlace = () => {
    if (!newPlaceName.trim()) return;
    setActivePlaceUpload(newPlaceName.trim());
    setNewPlaceName("");
    setShowAddPlace(false);
    // Trigger file input
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const triggerUploadForPlace = (placeName: string) => {
    setActivePlaceUpload(placeName);
    setTimeout(() => fileInputRef.current?.click(), 100);
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
              {photos.length} photos across {placeNames.length} places · Your trip memories
            </p>
          </motion.div>

          {/* Action Bar */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button onClick={() => setShowAddPlace(true)} disabled={uploading} className="rounded-full">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {uploading ? "Uploading..." : "Add Place & Photos"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => activePlaceUpload && handleUpload(e, activePlaceUpload)}
            />

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

          {/* Add Place Dialog */}
          <Dialog open={showAddPlace} onOpenChange={setShowAddPlace}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Add a Place
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground mb-3">
                Name the place you visited (e.g., Cafe, Temple, Market) and then upload photos for it.
              </p>
              <Input
                placeholder="e.g. Hadimba Temple, Mall Road Cafe..."
                value={newPlaceName}
                onChange={(e) => setNewPlaceName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddPlace()}
                className="rounded-xl"
              />
              {/* Suggestions from itinerary */}
              {itineraryPlaces.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">From your itinerary:</p>
                  <div className="flex flex-wrap gap-2">
                    {itineraryPlaces.slice(0, 8).map((place) => (
                      <button
                        key={place}
                        onClick={() => setNewPlaceName(place)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors truncate max-w-[200px]"
                      >
                        {place}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={handleAddPlace} disabled={!newPlaceName.trim()} className="mt-4 rounded-xl w-full">
                <Upload className="w-4 h-4 mr-2" /> Select Photos for "{newPlaceName || "..."}"
              </Button>
            </DialogContent>
          </Dialog>

          {/* Place-wise Photo Sections */}
          {placeNames.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-heading mb-2">No photos yet</h2>
              <p className="text-muted-foreground mb-6">Add places you visited and upload photos for each</p>
              <Button onClick={() => setShowAddPlace(true)} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" /> Add First Place
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {placeNames.map((placeName) => (
                <motion.div
                  key={placeName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {placeName}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        ({places[placeName].length} photos)
                      </span>
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => triggerUploadForPlace(placeName)}
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add More
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {places[placeName].map((photo: any, i: number) => (
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
                  </div>
                </motion.div>
              ))}
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
