import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

type StepData = {
  businessType: string;
  goal: string;
  currentSite: string;
  features: string[];
  timeline: string;
  budget: string;
  contact: {
    name: string;
    whatsapp: string;
    email: string;
  };
};

const initialData: StepData = {
  businessType: '',
  goal: '',
  currentSite: '',
  features: [],
  timeline: '',
  budget: '',
  contact: { name: '', whatsapp: '', email: '' },
};

const STEPS_COUNT = 7;

export default function Planner() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initialData);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  const { theme } = useTheme(); // Ensuring it triggers theme updates if needed

  const nextStep = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const restart = () => {
    setData(initialData);
    setStep(1);
    setDirection(-1);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // Step Content Renderers
  const renderStep1 = () => {
    const options = [
      'Local Business', 'E-Commerce', 'Professional Services', 
      'Restaurant / Food', 'Healthcare', 'Other'
    ];
    return (
      <StepWrapper title="What type of business do you run?" onBack={undefined}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {options.map((opt) => (
            <OptionCard 
              key={opt}
              label={opt}
              selected={data.businessType === opt}
              onClick={() => {
                setData({ ...data, businessType: opt });
                setTimeout(nextStep, 300);
              }}
            />
          ))}
        </div>
      </StepWrapper>
    );
  };

  const renderStep2 = () => {
    const options = [
      'Attract new customers', 'Sell products online', 
      'Build credibility and trust', 'Generate leads', 'Showcase my portfolio'
    ];
    return (
      <StepWrapper title="What is your main goal for the website?" onBack={prevStep}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {options.map((opt) => (
            <OptionCard 
              key={opt}
              label={opt}
              selected={data.goal === opt}
              onClick={() => {
                setData({ ...data, goal: opt });
                setTimeout(nextStep, 300);
              }}
            />
          ))}
        </div>
      </StepWrapper>
    );
  };

  const renderStep3 = () => {
    const options = [
      'Yes — and I want a redesign', 
      'No — this is my first website', 
      'I have something basic (social page / template)'
    ];
    return (
      <StepWrapper title="Do you currently have a website?" onBack={prevStep}>
        <div className="flex flex-col gap-4 mt-8">
          {options.map((opt) => (
            <OptionCard 
              key={opt}
              label={opt}
              selected={data.currentSite === opt}
              onClick={() => {
                setData({ ...data, currentSite: opt });
                setTimeout(nextStep, 300);
              }}
            />
          ))}
        </div>
      </StepWrapper>
    );
  };

  const renderStep4 = () => {
    const options = [
      'Online Booking / Appointments', 'Product Store', 'WhatsApp Chat Button', 
      'Customer Login Area', 'Blog / News Section', 'SEO Optimization', 
      'Analytics Dashboard', 'Contact / Enquiry Form'
    ];
    
    const toggleFeature = (opt: string) => {
      const current = data.features;
      if (current.includes(opt)) {
        setData({ ...data, features: current.filter(f => f !== opt) });
      } else if (current.length < 3) {
        setData({ ...data, features: [...current, opt] });
      }
    };

    return (
      <StepWrapper title="Which features matter most to you?" subtitle="Select up to 3" onBack={prevStep}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {options.map((opt) => {
            const isSelected = data.features.includes(opt);
            const isDisabled = !isSelected && data.features.length >= 3;
            return (
              <OptionCard 
                key={opt}
                label={opt}
                selected={isSelected}
                disabled={isDisabled}
                onClick={() => toggleFeature(opt)}
                type="multi"
              />
            );
          })}
        </div>
        <div className="mt-12 flex justify-end">
          <button 
            onClick={nextStep}
            disabled={data.features.length === 0}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Continue <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </StepWrapper>
    );
  };

  const renderStep5 = () => {
    const options = [
      'ASAP (within 1-2 weeks)', 'Within a month', 
      'I am flexible (2-3 months)', 'Just exploring for now'
    ];
    return (
      <StepWrapper title="When do you need your website?" onBack={prevStep}>
        <div className="flex flex-col gap-4 mt-8">
          {options.map((opt) => (
            <OptionCard 
              key={opt}
              label={opt}
              selected={data.timeline === opt}
              onClick={() => {
                setData({ ...data, timeline: opt });
                setTimeout(nextStep, 300);
              }}
            />
          ))}
        </div>
      </StepWrapper>
    );
  };

  const renderStep6 = () => {
    const options = [
      'GH 1199 to 2500', 'GH 2500 to 5000', 
      'GH 5000 to 10000', 'GH 10000+'
    ];
    return (
      <StepWrapper title="What is your budget range?" onBack={prevStep}>
        <div className="flex flex-col gap-4 mt-8">
          {options.map((opt) => (
            <OptionCard 
              key={opt}
              label={opt}
              selected={data.budget === opt}
              onClick={() => {
                setData({ ...data, budget: opt });
                setTimeout(nextStep, 300);
              }}
            />
          ))}
        </div>
      </StepWrapper>
    );
  };

  const renderStep7 = () => {
    const isValid = data.contact.name.length > 2 && data.contact.email.includes('@');
    
    return (
      <StepWrapper title="Almost done! How do we reach you?" onBack={prevStep}>
        <div className="mt-8 flex flex-col gap-6 max-w-md mx-auto w-full">
          <div className="relative">
            <input 
              type="text" 
              id="name"
              value={data.contact.name}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, name: e.target.value }})}
              className="peer w-full bg-transparent border-b-2 border-border px-0 py-4 text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors text-foreground"
              placeholder="Name"
            />
            <label htmlFor="name" className="absolute left-0 -top-3.5 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary cursor-text">
              Name
            </label>
          </div>

          <div className="relative mt-4">
            <input 
              type="email" 
              id="email"
              value={data.contact.email}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value }})}
              className="peer w-full bg-transparent border-b-2 border-border px-0 py-4 text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors text-foreground"
              placeholder="Email"
            />
            <label htmlFor="email" className="absolute left-0 -top-3.5 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary cursor-text">
              Email
            </label>
          </div>

          <div className="relative mt-4">
            <input 
              type="tel" 
              id="whatsapp"
              value={data.contact.whatsapp}
              onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value }})}
              className="peer w-full bg-transparent border-b-2 border-border px-0 py-4 text-xl placeholder-transparent focus:outline-none focus:border-primary transition-colors text-foreground"
              placeholder="WhatsApp Number (optional)"
            />
            <label htmlFor="whatsapp" className="absolute left-0 -top-3.5 text-sm font-medium text-muted-foreground transition-all peer-placeholder-shown:text-xl peer-placeholder-shown:top-4 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary cursor-text">
              WhatsApp Number (optional)
            </label>
          </div>

          <button 
            onClick={nextStep}
            disabled={!isValid}
            className="mt-8 w-full py-5 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit Request
          </button>
        </div>
      </StepWrapper>
    );
  };

  const renderSuccess = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={2.5} />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground"
        >
          You are all set.
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-muted-foreground font-medium mb-12 max-w-md mx-auto"
        >
          Our team will review your answers and reach out within 24 hours.
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={restart}
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
          >
            Start Over
          </button>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
          RAVEN
        </Link>
        
        {step <= STEPS_COUNT && (
          <div className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
            Step {step} of {STEPS_COUNT}
          </div>
        )}
      </header>

      {/* Progress Bar */}
      {step <= STEPS_COUNT && (
        <div className="h-1 bg-muted w-full">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(step / STEPS_COUNT) * 100}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>
      )}

      {/* Wizard Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-1 w-full h-full absolute inset-0 flex flex-col"
          >
            <div className="flex-1 overflow-y-auto w-full flex flex-col pb-24">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
              {step === 6 && renderStep6()}
              {step === 7 && renderStep7()}
              {step > STEPS_COUNT && renderSuccess()}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// Subcomponents

function StepWrapper({ title, subtitle, onBack, children }: { title: string; subtitle?: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground font-medium">{subtitle}</p>
      )}
      <div className="mt-8 flex-1">
        {children}
      </div>
    </div>
  );
}

function OptionCard({ label, selected, disabled, onClick, type = 'single' }: { label: string; selected: boolean; disabled?: boolean; onClick: () => void; type?: 'single' | 'multi' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-200 group flex items-start justify-between gap-4
        ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
      `}
    >
      <span className={`text-lg md:text-xl font-semibold leading-tight ${selected ? 'text-primary' : 'text-foreground'}`}>
        {label}
      </span>
      
      {/* Icon for selection state */}
      <div className={`
        flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors
        ${selected ? 'border-primary bg-primary' : 'border-muted-foreground/30'}
        ${type === 'multi' && !selected ? 'rounded-md' : ''}
        ${type === 'multi' && selected ? 'rounded-md' : ''}
      `}>
        {selected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" strokeWidth={3} />}
      </div>
    </button>
  );
}
