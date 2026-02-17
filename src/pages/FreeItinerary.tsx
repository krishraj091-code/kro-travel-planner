import { motion } from "framer-motion";
import { MapPin, Clock, Wallet, Star, Mountain, Utensils, Bus, Calendar, Lightbulb, Heart, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import manaliHero from "@/assets/manali-hero.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const places = [
  {
    name: "Hadimba Devi Temple",
    time: "8–10 AM",
    cost: "Free",
    tip: "Walk behind the temple into cedar forest",
    maps: "https://maps.google.com/?q=Hadimba+Temple+Manali",
    vibe: "Feels less like a temple, more like a forest breathing.",
  },
  {
    name: "Old Manali",
    time: "Afternoon to sunset",
    cost: "Free walking",
    tip: "Cross the bridge, don't stay on café row",
    maps: "https://maps.google.com/?q=Old+Manali",
    vibe: "This is where backpackers slow down and locals speed down slopes.",
  },
  {
    name: "Solang Valley",
    time: "Before 9 AM",
    cost: "₹1,500–₹3,000",
    tip: "Bargain hard after 2 PM",
    maps: "https://maps.google.com/?q=Solang+Valley",
    vibe: "Touristy, yes — but mountains here hit different.",
  },
  {
    name: "Jogini Falls",
    time: "40–50 min trek",
    cost: "Free",
    tip: "Carry water, no shops after start",
    maps: "https://maps.google.com/?q=Jogini+Falls",
    vibe: "The sound of water drowns everything else.",
  },
  {
    name: "Vashisht",
    time: "Morning",
    cost: "₹50–₹100 donation",
    tip: "Use old bath rooms, not new ones",
    maps: "https://maps.google.com/?q=Vashisht+Manali",
    vibe: "Smells weird, feels heavenly.",
  },
];

const foodSpots = [
  { name: "Rocky's Café", area: "Old Manali", dish: "Thukpa", cost: "₹150–200" },
  { name: "Johnson's Bar Kitchen", area: "", dish: "Trout", cost: "₹600–800" },
  { name: "Local dhabas", area: "Vashisht", dish: "Siddu", cost: "₹80–120" },
  { name: "Tibetan Kitchen", area: "", dish: "Momos", cost: "₹120–180" },
  { name: "Small bakeries", area: "Old Manali", dish: "Apple pie", cost: "₹100" },
];

const hiddenGems = [
  "Goshal Road walk — silent pine stretch near Solang",
  "Shuru village fields — apple orchards, no crowds",
  "Beas river back trails — muddy, calm, cold wind",
  "Old Manali upper lanes — wooden homes, wood smoke",
  "Left bank road cafés — cheaper, quieter",
];

const FreeItinerary = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={manaliHero} alt="Manali valley" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
              <MapPin className="w-3 h-3" /> Free Explorer Itinerary
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight">
              Manali
            </h1>
            <p className="text-primary-foreground/70 mt-3 max-w-xl text-lg italic font-heading">
              Where mornings are slow, nights are colder than promises, and mountains quietly watch you live.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Emotional Hook */}
        <motion.section {...fadeUp} className="py-12 sm:py-16">
          <blockquote className="text-xl sm:text-2xl font-heading italic text-foreground leading-relaxed border-l-4 border-accent pl-6">
            Manali doesn't announce itself loudly. It arrives quietly — with the smell of wet pine, the sound of Beas River brushing stones, and cold air biting your ears before you even unzip your jacket.
          </blockquote>
        </motion.section>

        {/* Local Resident */}
        <motion.section {...fadeUp} className="glass-card rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold">Written by a Local</h3>
              <p className="text-sm text-muted-foreground">Lived in Manali for years — before Instagram cafés, after snowfall chaos</p>
            </div>
          </div>
        </motion.section>

        {/* Vibe */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Mountain className="w-7 h-7 text-primary" /> The Vibe
          </h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            Manali lives in layers. Mall Road is noisy, Old Manali is lazy, Vashisht smells of sulphur, and Solang wakes up only after 9 AM. Locals start their day early, tourists start late, and by evening everyone ends up staring at the same mountains — quietly humbled.
          </p>
        </motion.section>

        {/* Why Special */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Star className="w-7 h-7 text-accent" /> Why Manali Is Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Escape crowds by walking 200 meters away",
              "Mountains feel close, not postcard-distant",
              "Locals are blunt but warm — no fake hospitality",
              "Seasons actually change your mood",
              "Spend ₹300 or ₹3,000 a day — both feel real",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/50"
              >
                <span className="text-accent font-bold">✦</span>
                <span className="text-foreground/80">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Must-Visit Places */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-primary" /> Must-Visit Places
          </h2>
          <div className="space-y-6">
            {places.map((place, i) => (
              <motion.div
                key={place.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 sm:p-8 hover-lift"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">{place.name}</h3>
                    <p className="text-foreground/60 italic font-heading mb-4">{place.vibe}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
                        <Clock className="w-3 h-3" /> {place.time}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent">
                        <Wallet className="w-3 h-3" /> {place.cost}
                      </span>
                    </div>
                  </div>
                  <a
                    href={place.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" /> Maps
                  </a>
                </div>
                <div className="mt-4 flex items-start gap-2 text-sm bg-accent/5 rounded-lg p-3">
                  <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/70"><strong className="text-foreground">Local tip:</strong> {place.tip}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Hidden Gems */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Star className="w-7 h-7 text-accent" /> Hidden Gems Only Locals Know
          </h2>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="space-y-3">
              {hiddenGems.map((gem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground/80">{gem}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Food Spots */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Utensils className="w-7 h-7 text-primary" /> Local Food Spots
          </h2>
          <p className="text-sm text-muted-foreground mb-6 italic">⏰ Eat before 8 PM — kitchens shut early in winter.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {foodSpots.map((spot, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 hover-lift"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{spot.name}</h4>
                    {spot.area && <span className="text-xs text-muted-foreground">{spot.area}</span>}
                  </div>
                  <span className="text-sm font-semibold text-accent">{spot.cost}</span>
                </div>
                <p className="text-sm text-foreground/60 mt-2">Must try: <strong className="text-foreground">{spot.dish}</strong></p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Cost Breakdown */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Wallet className="w-7 h-7 text-accent" /> Daily Cost (2 People)
          </h2>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {[
              { label: "Food", range: "₹600–900" },
              { label: "Local Travel", range: "₹300–500" },
              { label: "Sightseeing", range: "₹300–700" },
              { label: "Hotel", range: "₹1,000–2,000" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                <span className="text-foreground/70">{item.label}</span>
                <span className="font-semibold text-foreground">{item.range}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-primary/20">
              <span className="font-heading font-bold text-lg">Total</span>
              <span className="font-heading font-bold text-lg gradient-text">₹2,200 – ₹4,000 / day</span>
            </div>
          </div>
        </motion.section>

        {/* Transport */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Bus className="w-7 h-7 text-primary" /> Transport Guide
          </h2>
          <div className="space-y-3">
            {[
              { mode: "Volvo bus from Delhi", cost: "₹1,200–1,800", tag: "Cheapest" },
              { mode: "Cab via Chandigarh", cost: "Variable", tag: "Fastest" },
              { mode: "Local auto", cost: "₹200–300", tag: "Short rides" },
              { mode: "Bike rental", cost: "₹800–1,200/day", tag: "Freedom" },
            ].map((t) => (
              <div key={t.mode} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <span className="font-medium text-foreground">{t.mode}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.tag}</span>
                </div>
                <span className="text-sm font-semibold text-accent">{t.cost}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-destructive/80 italic">⚠️ Avoid late-night mountain driving — fog + drunk tourists.</p>
        </motion.section>

        {/* Best Time */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-accent" /> Best Time & Duration
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { period: "Mar–Jun", desc: "Pleasant, crowded", icon: "☀️" },
              { period: "Jul–Aug", desc: "Landslides, fewer tourists", icon: "🌧️" },
              { period: "October", desc: "Best balance", icon: "🍂" },
              { period: "Dec–Jan", desc: "Snow + chaos", icon: "❄️" },
            ].map((s) => (
              <div key={s.period} className="glass-card rounded-xl p-5 text-center hover-lift">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="font-heading font-semibold text-sm">{s.period}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground">Ideal stay: <strong className="text-foreground">3–4 days</strong></p>
        </motion.section>

        {/* Local Tips */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="w-7 h-7 text-accent" /> Local Tips That Make This Gold
          </h2>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <ul className="space-y-3">
              {[
                "Skip Rohtang hype; locals prefer Atal Tunnel side",
                "Bargain everywhere except food",
                "Avoid Mall Road restaurants",
                "Carry cash in winter",
                "Ask locals before trekking",
                "Don't over-plan days",
                "Mornings are gold here",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground/80">
                  <span className="text-accent">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* Sample Itinerary */}
        <motion.section {...fadeUp} className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 flex items-center gap-3">
            <Calendar className="w-7 h-7 text-primary" /> Sample 2-Day Itinerary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                day: "Day 1",
                items: ["Morning — Hadimba → Old Manali walk", "Afternoon — Café + nap", "Evening — River walk"],
                cost: "₹600–800",
              },
              {
                day: "Day 2",
                items: ["Early Solang → Goshal Road", "Lunch — Local dhaba", "Sunset — Vashisht"],
                cost: "₹800–1,200",
              },
            ].map((day) => (
              <div key={day.day} className="glass-card rounded-2xl p-6 sm:p-8 hover-lift">
                <h3 className="text-xl font-heading font-bold mb-4 gradient-text">{day.day}</h3>
                <ul className="space-y-3 mb-4">
                  {day.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground/80">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-border/50 text-sm">
                  <span className="text-muted-foreground">Estimated: </span>
                  <span className="font-semibold text-accent">{day.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Ending Note */}
        <motion.section {...fadeUp} className="mb-16">
          <blockquote className="text-xl sm:text-2xl font-heading italic text-foreground leading-relaxed text-center max-w-2xl mx-auto">
            Manali doesn't try to impress you. It just lives — cold, calm, sometimes chaotic. And if you slow down enough, it quietly becomes a part of you.
          </blockquote>
        </motion.section>

        {/* CTA */}
        <motion.section {...fadeUp} className="mb-20">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-foreground mb-3">
              Want a Fully Personalized Itinerary?
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-6">
              This was just the overview. Get hour-wise planning, transport timing, budget optimization, and comfort-first pacing tailored to <em>your</em> trip.
            </p>
            <Link to="/plans">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 py-6 rounded-xl text-base animate-pulse-glow group">
                Upgrade to Personalized Plan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
};

export default FreeItinerary;
