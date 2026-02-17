import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight, Clock, MapPin, DollarSign, Hotel, Camera, Film, Cloud, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PlanSelection = () => {
  const stored = sessionStorage.getItem("tripPreferences");
  const tripPrefs = stored ? JSON.parse(stored) : null;
  const destination = tripPrefs?.arrival?.trim().toLowerCase() || "";

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      badge: null,
      features: [
        "Rough overview of destination",
        "General places to visit",
        "Approximate budget estimate",
      ],
      cta: "View Free Plan",
      link: destination ? `/itinerary/${destination}` : "/destinations",
      highlight: false,
    },
    {
      id: "basic",
      name: "Basic Plan",
      price: "Per Trip",
      badge: "Popular",
      features: [
        "Hour-by-hour itinerary",
        "Transport & hotel picks",
        "Exact budget breakdown",
        "PDF download",
        "1 GB trip cloud storage",
        "Auto virtual album",
        "1 instant reel",
      ],
      cta: "Get Basic Plan",
      link: "/paid-itinerary",
      highlight: true,
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: "₹799/year",
      badge: "Best Value",
      features: [
        "Everything in Basic",
        "40 GB total cloud storage",
        "3 reels per trip",
        "1 virtual album per trip",
        "Priority support",
        "Multi-city trip planning",
        "Unlimited regenerations",
      ],
      cta: "Go Premium",
      link: "/paid-itinerary",
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <h1 className="text-3xl sm:text-5xl font-heading mb-3">Choose Your Plan</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              {destination
                ? `Pick how you want to explore ${destination.charAt(0).toUpperCase() + destination.slice(1)}`
                : "From free exploration to premium travel memories"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`warm-card rounded-2xl p-7 sm:p-8 relative flex flex-col ${
                  plan.highlight ? "border-2 border-primary/30 scale-[1.02]" : "bg-muted/30"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide">
                      <Star className="w-3 h-3" /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className={`text-xl font-heading mb-1 ${plan.highlight ? "text-primary" : ""}`}>{plan.name}</h2>
                  <p className="text-2xl font-heading text-foreground">{plan.price}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to={plan.link}>
                  {plan.highlight ? (
                    <button className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 group">
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Button size="lg" variant="outline" className="w-full py-6 rounded-full text-base border-2">
                      {plan.cta}
                    </Button>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Cloud Storage Feature Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="warm-card rounded-2xl p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-heading mb-2">🎁 Free With Every Paid Trip</h2>
                <p className="text-muted-foreground">Your memories, preserved forever</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Cloud, title: "1 GB Cloud", desc: "Private trip photo storage" },
                  { icon: Camera, title: "Auto Album", desc: "10-15 page virtual album" },
                  { icon: Film, title: "Instant Reel", desc: "Template-based video reel" },
                  { icon: Crown, title: "Shared Space", desc: "Invite friends to share" },
                ].map((f) => (
                  <div key={f.title} className="text-center p-4 rounded-xl bg-primary/5">
                    <f.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h4 className="font-heading text-sm">{f.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanSelection;
