import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Itinerary {
  id: string;
  destination: string;
  title: string;
  content: any;
  is_published: boolean;
  created_at: string;
}

const Admin = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Itinerary | null>(null);
  const [form, setForm] = useState({ destination: "", title: "", content: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast({ title: "Access denied", description: "You need admin privileges.", variant: "destructive" });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    fetchItineraries();
  };

  const fetchItineraries = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("itineraries")
      .select("*")
      .order("created_at", { ascending: false });
    setItineraries(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let contentJson: any;
    try {
      contentJson = JSON.parse(form.content);
    } catch {
      contentJson = { raw: form.content };
    }

    if (editing) {
      await supabase.from("itineraries").update({
        destination: form.destination,
        title: form.title,
        content: contentJson,
      }).eq("id", editing.id);
      toast({ title: "Updated!" });
    } else {
      await supabase.from("itineraries").insert({
        destination: form.destination,
        title: form.title,
        content: contentJson,
        created_by: user.id,
      });
      toast({ title: "Created!" });
    }

    setEditing(null);
    setForm({ destination: "", title: "", content: "" });
    fetchItineraries();
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("itineraries").update({ is_published: !current }).eq("id", id);
    fetchItineraries();
  };

  const deleteItinerary = async (id: string) => {
    await supabase.from("itineraries").delete().eq("id", id);
    fetchItineraries();
    toast({ title: "Deleted" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          {/* Create / Edit Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 sm:p-8 mb-8"
          >
            <h2 className="text-xl font-heading font-semibold mb-6">
              {editing ? "Edit Itinerary" : "Create New Itinerary"}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input
                    placeholder="e.g., Manali"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g., Manali — A Local's Guide"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content (JSON or raw text)</Label>
                <Textarea
                  placeholder="Paste your itinerary content here (JSON or plain text)..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" /> {editing ? "Update" : "Create"}
                </Button>
                {editing && (
                  <Button variant="outline" onClick={() => { setEditing(null); setForm({ destination: "", title: "", content: "" }); }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Itinerary List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : itineraries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No itineraries yet. Create your first one above.</div>
            ) : (
              itineraries.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-heading font-semibold text-foreground">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.destination}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                      <Switch
                        checked={item.is_published}
                        onCheckedChange={() => togglePublish(item.id, item.is_published)}
                      />
                      {item.is_published ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(item);
                        setForm({
                          destination: item.destination,
                          title: item.title,
                          content: typeof item.content === "string" ? item.content : JSON.stringify(item.content, null, 2),
                        });
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItinerary(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
