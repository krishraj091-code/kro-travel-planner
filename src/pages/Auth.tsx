import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin");
        
        if (roles && roles.length > 0) {
          navigate("/admin");
        } else {
          navigate(redirectTo);
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent you a verification link." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎒</span>
            </div>
            <h1 className="text-3xl font-heading mb-2">
              {isLogin ? "Login to save your trip" : "Join KroTravel"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? "and access it anytime." : "Create an account to save your trips"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium"><User className="w-4 h-4 text-primary" /> Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" required className="rounded-xl border-border bg-card py-3" />
              </div>
            )}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium"><Mail className="w-4 h-4 text-primary" /> Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="rounded-xl border-border bg-card py-3" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium"><Lock className="w-4 h-4 text-primary" /> Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="rounded-xl border-border bg-card py-3" />
            </div>

            <Button type="submit" disabled={loading} className="w-full py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 group text-base font-semibold">
              {loading ? "Loading..." : isLogin ? "Continue with Email" : "Create Account"}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
