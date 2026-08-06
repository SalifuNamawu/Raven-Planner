import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Nav } from '@/components/nav';
import { FeatureCard } from '@/components/feature-card';
import { 
  Rocket, 
  Smartphone, 
  LayoutDashboard, 
  Users, 
  Search, 
  LineChart, 
  MessageCircle, 
  Palette 
} from 'lucide-react';

export default function Home() {
  const features = [
    { icon: Rocket, title: 'Ready in 7 Days', tagline: 'Speed without compromising quality.' },
    { icon: Smartphone, title: 'Mobile Friendly', tagline: 'Flawless across all devices.' },
    { icon: LayoutDashboard, title: 'Admin Dashboard', tagline: 'Control your business effortlessly.' },
    { icon: Users, title: 'Customer Dashboard', tagline: 'Premium portals for your clients.' },
    { icon: Search, title: 'SEO Ready', tagline: 'Built to rank from day one.' },
    { icon: LineChart, title: 'Analytics Dashboard', tagline: 'Real data, real decisions.' },
    { icon: MessageCircle, title: 'WhatsApp Integration', tagline: 'Connect instantly with customers.' },
    { icon: Palette, title: 'Professional UI', tagline: 'Design that builds immediate trust.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Nav />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex-1 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[1.1]">
            Take Your Business Global
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Professional websites that help businesses attract more customers, build trust and grow online.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/planner" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
              Build My Website
            </Link>
            
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              See Packages
            </button>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 md:px-12 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                tagline={feature.tagline}
                delay={i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section id="pricing" className="py-32 px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-2xl mx-auto p-12 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">Premium Websites</h2>
          <div className="text-5xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            <span className="text-2xl font-semibold text-muted-foreground align-top mr-2">GH</span>
            1,199
          </div>
          <p className="text-xl text-foreground/80 mb-10 font-medium">
            Everything you need to establish a world-class presence online.
          </p>
          
          <Link href="/planner" className="inline-flex px-10 py-4 bg-foreground text-background rounded-full font-semibold text-lg hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2 focus:ring-offset-card shadow-md">
            Build My Website
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-medium">
        <div className="font-bold tracking-tighter text-foreground text-lg">RAVEN</div>
        <div className="flex gap-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-foreground transition-colors">Home</button>
          <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors">Packages</button>
          <a href="mailto:hello@ravendigital.com" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <div>&copy; {new Date().getFullYear()} Raven Digital.</div>
      </footer>
    </div>
  );
}
