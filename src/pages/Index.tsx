import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-mountains.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Compass,
    title: "AI-Powered Planning",
    desc: "Realistic itineraries that feel like a local friend planned your trip — not a brochure.",
  },
  {
    icon: Clock,
    title: "Hour-Wise Schedules",
    desc: "Every hour accounted for with transport, meals, rest breaks, and human-paced timing.",
  },
  {
    icon: Wallet,
    title: "Budget Aware",
    desc: "Plans built around your real budget — with honest cost breakdowns, not hidden fees.",
  },
];

const testimonials = [
  { name: "Priya S.", place: "Manali Trip", text: "The itinerary felt like my best friend who lives there wrote it. Every tip was gold." },
  { name: "Rahul M.", place: "Goa Weekend", text: "Saved me hours of research. The budget breakdown was spot on — I actually spent less than planned." },
  { name: "Ananya K.", place: "Kerala Tour", text: "We traveled with elderly parents. The pacing suggestions were incredibly thoughtful." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Mountain landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 text-accent mb-6"
            >
              <Compass className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Travel Planning</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-primary-foreground leading-[1.1] mb-6">
              Travel Like a
              <br />
              <span className="gradient-text">Local Planned</span>
              <br />
              Your Trip
            </h1>

            <p className="text-lg text-primary-foreground/70 max-w-lg mb-8 leading-relaxed">
              Realistic, budget-aware itineraries that respect your time, your wallet, and how real humans actually travel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/plan">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                  Plan My Trip
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/destinations">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-xl border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Destinations
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              Why Kro Travel Is Different
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No promotional fluff. No generic lists. Just real, human-friendly travel plans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-2xl p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Three simple steps to your perfect trip</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Share Your Preferences", desc: "Tell us where, when, how many, and your budget. We handle the rest." },
              { step: "02", title: "Get Your Itinerary", desc: "Preview a free rough plan or unlock a fully personalized hour-wise itinerary." },
              { step: "03", title: "Travel With Confidence", desc: "Download, share, or access your plan anytime. Updated and saved to your account." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-heading font-bold gradient-text mb-4">{item.step}</div>
                <h3 className="text-xl font-heading font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Travelers Love Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-8"
              >
                <p className="text-foreground italic mb-4 leading-relaxed">"{t.text}"</p>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">{t.name}</span>
                  <span className="text-muted-foreground ml-2">— {t.place}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Ready to Travel Smarter?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              Stop spending hours on research. Let our AI create a plan that actually works for you.
            </p>
            <Link to="/plan">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-10 py-6 rounded-xl animate-pulse-glow">
                Plan My Trip — It's Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
