import { Link } from "react-router-dom";
import { MapPin, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-heading font-bold">KroTravel</span>
          </Link>
          <p className="text-primary-foreground/60 max-w-sm text-sm leading-relaxed">
            AI-powered travel planning that creates realistic, budget-aware itineraries written like a local friend planned your trip.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm text-primary-foreground/60">
            <Link to="/plan" className="block hover:text-accent transition-colors">Plan a Trip</Link>
            <Link to="/destinations" className="block hover:text-accent transition-colors">Destinations</Link>
            <Link to="/auth" className="block hover:text-accent transition-colors">Sign In</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Connect</h4>
          <div className="flex gap-3">
            {[Instagram, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
        © 2026 Kro Travel. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
