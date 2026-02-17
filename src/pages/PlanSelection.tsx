import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight, Clock, MapPin, DollarSign, Hotel } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PlanSelection = () => {
  const stored = sessionStorage.getItem("tripPreferences");
  const tripPrefs = stored ? JSON.parse(stored) : null;
  const destination = tripPrefs?.arrival?.trim().toLowerCase() || "";

  const freePlan = {
    name: "Free Plan",
    features: [
      { icon: Check, text: "Rough Overview" },
      { icon: Check, text: "General Places" },
      { icon: Check, text: "Approx Budget" },
    ],
    cta: "View Free Plan",
    link: destination ? `/itinerary/${destination}` : "/destinations",
  };

  const paidPlan = {
    name: "Paid Plan",
    features: [
      { icon: Clock, text: "Hour-by-hour Flow" },
      { icon: MapPin, text: "Transport Logic" },
      { icon: DollarSign, text: "Exact Budget" },
      { icon: Hotel, text: "Hotel Picks" },
    ],
    cta: "Get Detailed Plan",
    link: "/auth",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="text-3xl sm:text-5xl font-heading mb-3">Choose Your Plan</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              {destination
                ? `Pick how you want to explore ${destination.charAt(0).toUpperCase() + destination.slice(1)}`
                : "The decisive moment where value is established."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="warm-card rounded-2xl p-8 sm:p-10 bg-muted/50"
            >
              <h2 className="text-2xl font-heading mb-6">{freePlan.name}</h2>
              <ul className="space-y-4 mb-8">
                {freePlan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-foreground/80">
                    <f.icon className="w-5 h-5 text-muted-foreground" />
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link to={freePlan.link}>
                <Button size="lg" variant="outline" className="w-full py-6 rounded-full text-base border-2">
                  {freePlan.cta}
                </Button>
              </Link>
            </motion.div>

            {/* Paid Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="warm-card rounded-2xl p-8 sm:p-10 border-2 border-primary/20 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wide">
                  <Star className="w-3 h-3" /> Recommended
                </span>
              </div>

              <h2 className="text-2xl font-heading text-primary mb-6">{paidPlan.name}</h2>
              <ul className="space-y-4 mb-8">
                {paidPlan.features.map((f) => (
                  <li key={f.text} className="flex items-center gap-3 text-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <f.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link to={paidPlan.link}>
                <button className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 group">
                  {paidPlan.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlanSelection;
