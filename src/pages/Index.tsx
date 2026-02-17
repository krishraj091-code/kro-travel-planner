import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Clock, Wallet, Star, ChevronRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-traveler.jpg";

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

const steps = [
  { icon: "👤", title: "Profile", desc: "Tell us your preferences" },
  { icon: "🤖", title: "AI Plan", desc: "We craft your itinerary" },
  { icon: "😊", title: "Enjoy", desc: "Travel with confidence" },
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Travel adventure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading text-white leading-[1.1] mb-6">
              Plan your entire trip in minutes —{" "}
              <span className="italic">realistically.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 max-w-lg mb-10 leading-relaxed font-body">
              Within budget, without stress. AI-powered itineraries that feel like a local planned your trip.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/plan">
                <button className="btn-primary text-base px-10 py-4 flex items-center gap-2 group">
                  Plan My Trip
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/destinations">
                <button className="rounded-full px-10 py-4 font-semibold border-2 border-white/30 text-white transition-all duration-300 hover:bg-white/10 text-base">
                  Explore Destinations
                </button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>AI + Human Verified</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-card">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-heading text-foreground mb-4">
              How KroTravel Works
            </h2>
            <p className="text-muted-foreground text-lg">Three simple steps to your perfect trip</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 text-2xl">
                  {step.icon}
                </div>
                <h3 className="text-xl font-heading text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl sm:text-5xl font-heading text-foreground mb-4">
              Why KroTravel Is <span className="text-primary">Different</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              No promotional fluff. No generic lists. Just real, human-friendly travel plans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="warm-card-hover rounded-2xl p-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <f.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-card">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-heading text-foreground mb-4">
              Travelers <span className="text-primary">Love Us</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="warm-card-hover rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/85 mb-6 leading-relaxed font-body">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{t.name[0]}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground text-sm">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.place}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="warm-card rounded-3xl p-12 sm:p-16 glow-primary">
              <h2 className="text-3xl sm:text-5xl font-heading text-foreground mb-5">
                Ready to Travel <span className="text-primary italic">Smarter</span>?
              </h2>
              <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-lg">
                Stop spending hours on research. Let our AI create a plan that actually works for you.
              </p>
              <Link to="/plan">
                <button className="btn-primary text-base px-12 py-5 animate-pulse-glow flex items-center gap-2 mx-auto">
                  Plan My Trip — It's Free
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
