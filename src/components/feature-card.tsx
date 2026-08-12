import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, tagline, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col items-start p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 tracking-tight text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium">{tagline}</p>
    </motion.div>
  );
}
