import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import manaliHero from "@/assets/manali-hero.jpg";

const destinations = [
  {
    name: "Manali",
    tagline: "Where mountains quietly watch you live",
    image: manaliHero,
    link: "/itinerary/manali",
    available: true,
  },
  {
    name: "Goa",
    tagline: "Sun, sand, and stories that stay",
    image: null,
    link: "#",
    available: false,
  },
  {
    name: "Kerala",
    tagline: "God's own country, at your pace",
    image: null,
    link: "#",
    available: false,
  },
  {
    name: "Jaipur",
    tagline: "Pink city, golden memories",
    image: null,
    link: "#",
    available: false,
  },
];

const Destinations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">Explore Destinations</h1>
            <p className="text-muted-foreground">Free local guides written by people who actually live there</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {dest.available ? (
                  <Link to={dest.link} className="block group">
                    <div className="glass-card rounded-2xl overflow-hidden hover-lift">
                      <div className="h-48 bg-muted overflow-hidden">
                        {dest.image ? (
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-12 h-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-heading font-bold mb-1">{dest.name}</h3>
                        <p className="text-sm text-muted-foreground italic mb-3">{dest.tagline}</p>
                        <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                          Read Guide <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="glass-card rounded-2xl overflow-hidden opacity-60">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold mb-1">{dest.name}</h3>
                      <p className="text-sm text-muted-foreground italic mb-3">{dest.tagline}</p>
                      <span className="text-sm text-muted-foreground">Coming Soon</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Destinations;
