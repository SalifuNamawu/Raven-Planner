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
  Palette,
  ArrowRight,
  CheckCircle2
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
              onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
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

      {/* PACKAGES SECTION */}
      <section id="packages" className="py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
              Choose Your Package
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the package that fits your business. Both include everything you need to launch.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Launch Website */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
              className="relative rounded-3xl border-2 p-8 md:p-10 flex flex-col border-primary bg-primary/5 shadow-xl shadow-primary/10"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full">
                Most Popular
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-black text-foreground mb-2">Launch Website</h3>
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">GH&#x20B5;1,199</div>
                <p className="text-base text-muted-foreground font-medium mb-8">For businesses that need a professional online presence.</p>
                
                <ul className="space-y-3 mb-8">
                  {['Responsive Website', 'Up to 6 Pages', 'Contact Form', 'WhatsApp Button', 'Google Maps', 'Social Links', 'Admin Dashboard', 'Customer Dashboard', 'Analytics Dashboard', 'Ready in 7 Days'].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/planner?package=launch" 
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-lg shadow-primary/25"
              >
                Build My Website
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </Link>
            </motion.div>

            {/* Business Pro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="relative rounded-3xl border-2 p-8 md:p-10 flex flex-col border-border bg-card hover:border-primary/30 hover:shadow-lg"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-2xl" />
              
              <div className="flex-1">
                <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-3">Enterprise</span>
                <h3 className="text-2xl font-black text-foreground mb-2">Business Pro</h3>
                <div className="text-4xl md:text-5xl font-black text-foreground mb-2">GH&#x20B5;2,499</div>
                <p className="text-base text-muted-foreground font-medium mb-8">For businesses that need a more advanced and professional website.</p>
                
                <ul className="space-y-3 mb-8">
                  {['Booking Systems', 'Payments', 'CRM', 'Inventory', 'Membership', 'Advanced Analytics', 'API Integrations', 'Custom Development'].map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground/80">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link 
                href="/planner?package=pro" 
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 bg-foreground text-background hover:bg-foreground/90 focus:ring-foreground shadow-md"
              >
                Get Business Pro
                <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-medium">
        <div className="font-bold tracking-tighter text-foreground text-lg">RAVEN</div>
        <div className="flex gap-6">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-foreground transition-colors">Home</button>
          <button onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-foreground transition-colors">Packages</button>
          <a href="mailto:hello@ravendigital.com" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <div>&copy; {new Date().getFullYear()} Raven Digital.</div>
      </footer>
    </div>
  );
}