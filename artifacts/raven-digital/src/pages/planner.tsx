import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Utensils,
  Hotel,
  School,
  Church,
  HardHat,
  Building2,
  HeartPulse,
  Scale,
  Sparkles,
  ShoppingBag,
  Store,
  HelpCircle,
  CreditCard,
  CalendarCheck,
  BookOpen,
  Package,
  UserCheck,
  Clock3,
  MessageSquare,
  Bell,
  Mail,
  Star,
  Rss,
  Globe,
  Palette,
  Upload,
  Wand2,
  AlignLeft,
  Diamond,
  Briefcase,
  Zap,
  PenTool,
  LayoutGrid,
  CheckCheck,
} from 'lucide-react';

// ─── Pricing constants ────────────────────────────────────────────────────────
const BASE_PRICES: Record<string, number> = {
  'Launch Website': 1199,
  'Business Pro': 0,
};

const FEATURE_PRICES: Record<string, number> = {
  'Online Payments': 200,
  'Booking System': 300,
  Blog: 150,
  Inventory: 250,
  'Customer Login': 200,
  'Appointment Booking': 300,
  'Live Chat': 150,
  'SMS Notifications': 200,
  Newsletter: 150,
  'Google Reviews': 100,
  'Social Feed': 150,
  'Multi-language': 250,
};

const BRANDING_PRICES: Record<string, number> = {
  'Logo Design': 500,
  'Business Card': 200,
  Letterhead: 150,
  'Brand Guidelines': 400,
  'Social Media Kit': 300,
  'Email Signature': 100,
};

// ─── State shape ──────────────────────────────────────────────────────────────
type StepData = {
  businessType: string;
  package: string;
  features: string[];
  brandingStatus: string;
  brandingAddons: string[];
  brandColour: string;
  logoOption: string;
  logoStyle: string;
  businessDescription: string;
  contact: {
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    city: string;
    website: string;
  };
  uploadedLogo: File | null;
  uploadedColours: File | null;
};

const initial: StepData = {
  businessType: '',
  package: '',
  features: [],
  brandingStatus: '',
  brandingAddons: [],
  brandColour: '',
  logoOption: '',
  logoStyle: '',
  businessDescription: '',
  contact: {
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    website: '',
  },
  uploadedLogo: null,
  uploadedColours: null,
};

const TOTAL_STEPS = 8;

function calcPrice(data: StepData): number | null {
  if (data.package === 'Business Pro') return null; // custom quote
  if (!data.package) return null;
  let total = BASE_PRICES[data.package] || 0;
  data.features.forEach((f) => {
    total += FEATURE_PRICES[f] || 0;
  });
  data.brandingAddons.forEach((b) => {
    total += BRANDING_PRICES[b] || 0;
  });
  return total;
}

// ─── Animation variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

// ─── Main Planner ─────────────────────────────────────────────────────────────
export default function Planner() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initial);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const colourInputRef = useRef<HTMLInputElement>(null);

  const price = calcPrice(data);
  const isCustomQuote = data.package === 'Business Pro';

  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const finish = () => setDone(true);
  const restart = () => {
    setData(initial);
    setStep(1);
    setDirection(-1);
    setDone(false);
  };

  // ── Pricing pill ────────────────────────────────────────────────────────────
  const PricingPill = () => {
    if (!data.package) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary"
      >
        {isCustomQuote ? (
          'Custom Quote'
        ) : (
          <>
            Estimate:{' '}
            <span className="font-black">
              GH₵{price?.toLocaleString()}
            </span>
          </>
        )}
      </motion.div>
    );
  };

  // ── Mobile price bar ─────────────────────────────────────────────────────────
  const MobilePriceBar = () => {
    if (!data.package) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-background/95 backdrop-blur border-t border-border flex items-center justify-between"
      >
        <span className="text-sm text-muted-foreground font-medium">
          Estimated Total
        </span>
        <span className="text-lg font-black text-primary">
          {isCustomQuote ? 'Custom Quote' : `GH₵${price?.toLocaleString()}`}
        </span>
      </motion.div>
    );
  };

  // ── Shared StepWrapper ───────────────────────────────────────────────────────
  const renderContent = () => {
    if (done) return <SuccessScreen onRestart={restart} />;
    switch (step) {
      case 1: return <Step1 data={data} setData={setData} onNext={next} />;
      case 2: return <Step2 data={data} setData={setData} onNext={next} onBack={prev} />;
      case 3: return <Step3 data={data} setData={setData} onNext={next} onBack={prev} price={price} isCustomQuote={isCustomQuote} />;
      case 4: return <Step4 data={data} setData={setData} onNext={next} onBack={prev} price={price} isCustomQuote={isCustomQuote} />;
      case 5: return (
        <Step5
          data={data}
          setData={setData}
          onNext={next}
          onBack={prev}
          colourInputRef={colourInputRef}
        />
      );
      case 6: return (
        <Step6
          data={data}
          setData={setData}
          onNext={next}
          onBack={prev}
          logoInputRef={logoInputRef}
        />
      );
      case 7: return <Step7 data={data} setData={setData} onNext={next} onBack={prev} />;
      case 8: return <Step8 data={data} setData={setData} onFinish={finish} onBack={prev} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hidden file inputs */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          setData((d) => ({ ...d, uploadedLogo: e.target.files?.[0] ?? null }))
        }
      />
      <input
        ref={colourInputRef}
        type="file"
        accept="image/*,.pdf,.ai,.eps,.svg"
        className="hidden"
        onChange={(e) =>
          setData((d) => ({
            ...d,
            uploadedColours: e.target.files?.[0] ?? null,
          }))
        }
      />

      {/* Header */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-border/50 shrink-0">
        <Link
          href="/"
          className="text-xl font-black tracking-tighter hover:text-primary transition-colors focus:outline-none"
        >
          RAVEN
        </Link>

        <div className="flex items-center gap-4">
          <PricingPill />
          {!done && (
            <span className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
              {step}/{TOTAL_STEPS}
            </span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      {!done && (
        <div className="h-0.5 bg-muted w-full shrink-0">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ ease: 'easeInOut', duration: 0.5 }}
          />
        </div>
      )}

      {/* Wizard content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={done ? 'success' : step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-0 overflow-y-auto flex flex-col pb-20 sm:pb-8"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <MobilePriceBar />
    </div>
  );
}

// ─── Step 1 — Business Type ───────────────────────────────────────────────────
const BUSINESS_TYPES = [
  { label: 'Restaurant', icon: Utensils },
  { label: 'Hotel', icon: Hotel },
  { label: 'School', icon: School },
  { label: 'Church', icon: Church },
  { label: 'Construction', icon: HardHat },
  { label: 'Real Estate', icon: Building2 },
  { label: 'Clinic', icon: HeartPulse },
  { label: 'Law Firm', icon: Scale },
  { label: 'Beauty', icon: Sparkles },
  { label: 'Fashion', icon: ShoppingBag },
  { label: 'Ecommerce', icon: Store },
  { label: 'Other', icon: HelpCircle },
];

function Step1({ data, setData, onNext }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void }) {
  return (
    <StepWrapper title="What type of business do you run?">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
        {BUSINESS_TYPES.map(({ label, icon: Icon }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setData((d) => ({ ...d, businessType: label }));
              setTimeout(onNext, 280);
            }}
            className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${data.businessType === label
                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
              ${data.businessType === label ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-semibold text-center leading-tight transition-colors
              ${data.businessType === label ? 'text-primary' : 'text-foreground'}`}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>
    </StepWrapper>
  );
}

// ─── Step 2 — Package ─────────────────────────────────────────────────────────
const LAUNCH_FEATURES = [
  'Responsive Website',
  'Up to 6 Pages',
  'Contact Form',
  'WhatsApp Button',
  'Google Maps',
  'Social Links',
  'Admin Dashboard',
  'Customer Dashboard',
  'Analytics Dashboard',
  'Ready in 7 Days',
];

const PRO_FEATURES = [
  'Booking Systems',
  'Payments',
  'CRM',
  'Inventory',
  'Membership',
  'Advanced Analytics',
  'API Integrations',
  'Custom Development',
];

function Step2({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  const select = (pkg: string) => {
    setData((d) => ({ ...d, package: pkg }));
    setTimeout(onNext, 300);
  };

  return (
    <StepWrapper title="Choose your package." onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {/* Launch Website */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => select('Launch Website')}
          className={`text-left p-7 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col gap-5
            ${data.package === 'Launch Website'
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
            }`}
        >
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
              Most Popular
            </span>
            <h3 className="text-2xl font-black text-foreground">Launch Website</h3>
            <div className="mt-1 text-3xl font-black text-primary">GH₵1,199</div>
            <p className="mt-1 text-sm text-muted-foreground">Starting price</p>
          </div>
          <ul className="space-y-2">
            {LAUNCH_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {data.package === 'Launch Website' && (
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCheck className="w-4 h-4" /> Selected
            </div>
          )}
        </motion.button>

        {/* Business Pro */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => select('Business Pro')}
          className={`text-left p-7 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col gap-5 relative overflow-hidden
            ${data.package === 'Business Pro'
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-border bg-card hover:border-primary/40 hover:shadow-md'
            }`}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />
          <div className="relative">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-3">
              Enterprise
            </span>
            <h3 className="text-2xl font-black text-foreground">Business Pro</h3>
            <div className="mt-1 text-3xl font-black text-foreground">Custom Quote</div>
            <p className="mt-1 text-sm text-muted-foreground">
              For businesses needing advanced systems.
            </p>
          </div>
          <ul className="space-y-2 relative">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {data.package === 'Business Pro' && (
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCheck className="w-4 h-4" /> Selected
            </div>
          )}
        </motion.button>
      </div>
    </StepWrapper>
  );
}

// ─── Step 3 — Additional Features ────────────────────────────────────────────
const EXTRA_FEATURES = [
  { label: 'Online Payments', icon: CreditCard },
  { label: 'Booking System', icon: CalendarCheck },
  { label: 'Blog', icon: BookOpen },
  { label: 'Inventory', icon: Package },
  { label: 'Customer Login', icon: UserCheck },
  { label: 'Appointment Booking', icon: Clock3 },
  { label: 'Live Chat', icon: MessageSquare },
  { label: 'SMS Notifications', icon: Bell },
  { label: 'Newsletter', icon: Mail },
  { label: 'Google Reviews', icon: Star },
  { label: 'Social Feed', icon: Rss },
  { label: 'Multi-language', icon: Globe },
];

function Step3({ data, setData, onNext, onBack, price, isCustomQuote }: {
  data: StepData;
  setData: React.Dispatch<React.SetStateAction<StepData>>;
  onNext: () => void;
  onBack: () => void;
  price: number | null;
  isCustomQuote: boolean;
}) {
  const toggle = (label: string) => {
    setData((d) => ({
      ...d,
      features: d.features.includes(label)
        ? d.features.filter((f) => f !== label)
        : [...d.features, label],
    }));
  };

  return (
    <StepWrapper
      title="Choose additional features."
      subtitle="Select all that apply. Each feature is added to your estimate."
      onBack={onBack}
    >
      {/* Live price summary */}
      {!isCustomQuote && (
        <motion.div
          layout
          className="mt-6 p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Current Estimate
            </p>
            <motion.p
              key={price}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl font-black text-primary"
            >
              GH₵{price?.toLocaleString()}
            </motion.p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{data.features.length} feature{data.features.length !== 1 ? 's' : ''} added</p>
            {data.features.length > 0 && (
              <p className="text-primary font-semibold">
                +GH₵{data.features.reduce((a, f) => a + (FEATURE_PRICES[f] || 0), 0).toLocaleString()}
              </p>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {EXTRA_FEATURES.map(({ label, icon: Icon }) => {
          const selected = data.features.includes(label);
          return (
            <motion.button
              key={label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(label)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${selected
                  ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
                }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors
                ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${selected ? 'text-primary' : 'text-foreground'}`}>
                  {label}
                </p>
                {!isCustomQuote && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    +GH₵{FEATURE_PRICES[label]?.toLocaleString()}
                  </p>
                )}
              </div>
              {/* Toggle indicator */}
              <div className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-colors
                ${selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                {selected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex justify-end">
        <ContinueButton onClick={onNext} />
      </div>
    </StepWrapper>
  );
}

// ─── Step 4 — Brand Identity ──────────────────────────────────────────────────
const BRANDING_STATUS = [
  { label: 'I already have branding', needsExtra: false },
  { label: 'I have a logo only', needsExtra: true },
  { label: 'I have brand colours only', needsExtra: true },
  { label: 'I need everything designed', needsExtra: true },
];

const BRANDING_ADDONS = [
  { label: 'Logo Design', icon: Wand2 },
  { label: 'Business Card', icon: CreditCard },
  { label: 'Letterhead', icon: AlignLeft },
  { label: 'Brand Guidelines', icon: BookOpen },
  { label: 'Social Media Kit', icon: Rss },
  { label: 'Email Signature', icon: Mail },
];

function Step4({ data, setData, onNext, onBack, price, isCustomQuote }: {
  data: StepData;
  setData: React.Dispatch<React.SetStateAction<StepData>>;
  onNext: () => void;
  onBack: () => void;
  price: number | null;
  isCustomQuote: boolean;
}) {
  const toggleAddon = (label: string) => {
    setData((d) => ({
      ...d,
      brandingAddons: d.brandingAddons.includes(label)
        ? d.brandingAddons.filter((a) => a !== label)
        : [...d.brandingAddons, label],
    }));
  };

  const needsExtra =
    data.brandingStatus &&
    BRANDING_STATUS.find((b) => b.label === data.brandingStatus)?.needsExtra;

  return (
    <StepWrapper title="Brand Identity." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Do you already have branding?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {BRANDING_STATUS.map(({ label }) => (
          <motion.button
            key={label}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setData((d) => ({ ...d, brandingStatus: label, brandingAddons: [] }))}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
              ${data.brandingStatus === label
                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                : 'border-border bg-card hover:border-primary/40'
              }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
              ${data.brandingStatus === label ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
              {data.brandingStatus === label && <CheckCircle2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />}
            </div>
            <span className={`font-semibold text-sm leading-snug ${data.brandingStatus === label ? 'text-primary' : 'text-foreground'}`}>
              {label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Branding add-ons */}
      <AnimatePresence>
        {needsExtra && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-8"
          >
            <p className="text-base font-semibold text-foreground mb-1">
              Which branding services do you need?
            </p>
            {!isCustomQuote && (
              <p className="text-sm text-muted-foreground mb-4">
                Each service updates your estimate.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BRANDING_ADDONS.map(({ label, icon: Icon }) => {
                const selected = data.brandingAddons.includes(label);
                return (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleAddon(label)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${selected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/40'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors
                      ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                      {!isCustomQuote && (
                        <p className="text-xs text-muted-foreground">+GH₵{BRANDING_PRICES[label]?.toLocaleString()}</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Live price update */}
            {!isCustomQuote && data.brandingAddons.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center"
              >
                <span className="text-sm text-muted-foreground">Current Estimate</span>
                <motion.span key={price} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="text-xl font-black text-primary">
                  GH₵{price?.toLocaleString()}
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {data.brandingStatus && (
        <div className="mt-10 flex justify-end">
          <ContinueButton onClick={onNext} />
        </div>
      )}
    </StepWrapper>
  );
}

// ─── Step 5 — Brand Colours ───────────────────────────────────────────────────
const COLOUR_PALETTES = [
  { label: 'Blue', colors: ['#1D4ED8', '#3B82F6', '#93C5FD'] },
  { label: 'Purple', colors: ['#7C3AED', '#A855F7', '#C4B5FD'] },
  { label: 'Green', colors: ['#16A34A', '#22C55E', '#86EFAC'] },
  { label: 'Orange', colors: ['#EA580C', '#F97316', '#FDB082'] },
  { label: 'Gold', colors: ['#B45309', '#D97706', '#FCD34D'] },
  { label: 'Black', colors: ['#111827', '#374151', '#9CA3AF'] },
  { label: 'Minimal White', colors: ['#F9FAFB', '#E5E7EB', '#D1D5DB'] },
  { label: 'Modern Dark', colors: ['#0F172A', '#1E293B', '#334155'] },
];

function Step5({ data, setData, onNext, onBack, colourInputRef }: {
  data: StepData;
  setData: React.Dispatch<React.SetStateAction<StepData>>;
  onNext: () => void;
  onBack: () => void;
  colourInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <StepWrapper title="Brand Colours." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Choose your preferred colour palette.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {COLOUR_PALETTES.map(({ label, colors }) => {
          const selected = data.brandColour === label;
          return (
            <motion.button
              key={label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setData((d) => ({ ...d, brandColour: label }))}
              className={`group flex flex-col gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                ${selected
                  ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'
                }`}
            >
              {/* Color swatches */}
              <div className="flex gap-1.5">
                {colors.map((c) => (
                  <div
                    key={c}
                    className="flex-1 h-8 rounded-lg shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>
                {label}
              </p>
              {selected && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Upload existing */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => colourInputRef.current?.click()}
        className={`mt-4 w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed transition-all duration-200 text-left
          ${data.uploadedColours
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 bg-card'
          }`}
      >
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {data.uploadedColours ? data.uploadedColours.name : 'Upload Existing Brand Colours'}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {data.uploadedColours ? 'File uploaded' : 'PNG, PDF, AI, EPS, SVG accepted'}
          </p>
        </div>
      </motion.button>

      {(data.brandColour || data.uploadedColours) && (
        <div className="mt-10 flex justify-end">
          <ContinueButton onClick={onNext} />
        </div>
      )}
    </StepWrapper>
  );
}

// ─── Step 6 — Logo ────────────────────────────────────────────────────────────
const LOGO_STYLES = [
  { label: 'Minimal', icon: AlignLeft },
  { label: 'Luxury', icon: Diamond },
  { label: 'Corporate', icon: Briefcase },
  { label: 'Modern', icon: Zap },
  { label: 'Creative', icon: Palette },
  { label: 'Typography', icon: PenTool },
  { label: 'Icon Based', icon: LayoutGrid },
];

function Step6({ data, setData, onNext, onBack, logoInputRef }: {
  data: StepData;
  setData: React.Dispatch<React.SetStateAction<StepData>>;
  onNext: () => void;
  onBack: () => void;
  logoInputRef: React.RefObject<HTMLInputElement>;
}) {
  const wantsDesign = data.logoOption === 'design';

  return (
    <StepWrapper title="Logo." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Do you already have a logo?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {/* Upload logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setData((d) => ({ ...d, logoOption: 'upload' }));
            logoInputRef.current?.click();
          }}
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${data.logoOption === 'upload'
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
            }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
            ${data.logoOption === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Upload className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Upload Logo</p>
            {data.uploadedLogo ? (
              <p className="text-sm text-primary mt-1 font-medium">{data.uploadedLogo.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">PNG, SVG, AI accepted</p>
            )}
          </div>
        </motion.button>

        {/* Design a logo */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setData((d) => ({ ...d, logoOption: 'design' }))}
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer
            ${wantsDesign
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
              : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
            }`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
            ${wantsDesign ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Wand2 className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Design a Logo for Me</p>
            <p className="text-sm text-muted-foreground mt-1">Our team will create it</p>
          </div>
        </motion.button>
      </div>

      {/* Logo style picker */}
      <AnimatePresence>
        {wantsDesign && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-8"
          >
            <p className="text-base font-semibold text-foreground mb-4">Preferred logo style</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {LOGO_STYLES.map(({ label, icon: Icon }) => {
                const selected = data.logoStyle === label;
                return (
                  <motion.button
                    key={label}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setData((d) => ({ ...d, logoStyle: label }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                      ${selected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/40'
                      }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                      ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-semibold text-center ${selected ? 'text-primary' : 'text-foreground'}`}>
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(data.logoOption === 'upload' || (wantsDesign && data.logoStyle)) && (
        <div className="mt-10 flex justify-end">
          <ContinueButton onClick={onNext} />
        </div>
      )}
    </StepWrapper>
  );
}

// ─── Step 7 — Business Description ───────────────────────────────────────────
function Step7({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  return (
    <StepWrapper
      title="Describe your business."
      subtitle="Optional — tell us a little about what you do, who you serve, and what makes you different."
      onBack={onBack}
    >
      <div className="mt-8 max-w-2xl">
        <textarea
          value={data.businessDescription}
          onChange={(e) =>
            setData((d) => ({ ...d, businessDescription: e.target.value }))
          }
          placeholder="e.g. We are a family-run restaurant in Accra serving authentic Ghanaian cuisine. We pride ourselves on fresh ingredients and a warm, welcoming atmosphere..."
          rows={7}
          className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-card text-foreground text-base leading-relaxed placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary transition-colors"
        />
        <p className="mt-2 text-sm text-muted-foreground">
          This helps us design something truly tailored to your business.
        </p>
      </div>

      <div className="mt-8 flex justify-end">
        <ContinueButton onClick={onNext} label="Continue (Optional)" />
      </div>
    </StepWrapper>
  );
}

// ─── Step 8 — Contact Details ─────────────────────────────────────────────────
function Step8({ data, setData, onFinish, onBack }: {
  data: StepData;
  setData: React.Dispatch<React.SetStateAction<StepData>>;
  onFinish: () => void;
  onBack: () => void;
}) {
  const c = data.contact;
  const isValid = c.businessName.trim().length > 1 && c.contactName.trim().length > 1 && c.phone.trim().length > 5 && c.city.trim().length > 1;

  const setField = (field: keyof typeof c, value: string) =>
    setData((d) => ({ ...d, contact: { ...d.contact, [field]: value } }));

  return (
    <StepWrapper title="Contact Details." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Almost done — how do we reach you?</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <FloatingInput
          id="businessName"
          label="Business Name"
          value={c.businessName}
          onChange={(v) => setField('businessName', v)}
          required
        />
        <FloatingInput
          id="contactName"
          label="Contact Name"
          value={c.contactName}
          onChange={(v) => setField('contactName', v)}
          required
        />
        <FloatingInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={c.phone}
          onChange={(v) => setField('phone', v)}
          required
        />
        <FloatingInput
          id="email"
          label="Email (Optional)"
          type="email"
          value={c.email}
          onChange={(v) => setField('email', v)}
        />
        <FloatingInput
          id="city"
          label="City"
          value={c.city}
          onChange={(v) => setField('city', v)}
          required
        />
        <FloatingInput
          id="website"
          label="Existing Website (Optional)"
          type="url"
          value={c.website}
          onChange={(v) => setField('website', v)}
        />
      </div>

      <div className="mt-10 flex justify-end max-w-2xl">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          disabled={!isValid}
          className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25"
        >
          Submit Request <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </StepWrapper>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-125" />
        <div className="relative w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-primary" strokeWidth={2} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
      >
        You are all set.
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 text-xl text-muted-foreground font-medium max-w-md mx-auto leading-relaxed"
      >
        Our team will review your answers and reach out within{' '}
        <span className="text-foreground font-bold">24 hours</span>.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-12 flex flex-col sm:flex-row gap-4 items-center"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="px-8 py-3 rounded-full border-2 border-border bg-card text-foreground font-semibold hover:border-primary/50 transition-all"
        >
          Start Over
        </motion.button>
        <Link href="/">
          <motion.span
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
          >
            Back to Home
          </motion.span>
        </Link>
      </motion.div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StepWrapper({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 md:py-16 flex flex-col">
      {onBack && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>
      )}
      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-3 text-base md:text-lg text-muted-foreground font-medium max-w-xl"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ContinueButton({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
    >
      {label} <ChevronRight className="w-5 h-5" />
    </motion.button>
  );
}

function FloatingInput({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-border bg-card text-foreground text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-4 text-muted-foreground text-sm font-medium pointer-events-none transition-all
          peer-placeholder-shown:text-base peer-placeholder-shown:top-4
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-primary
          peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-2"
      >
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </label>
    </div>
  );
}
