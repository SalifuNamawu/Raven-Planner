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
  MessageCircle,
  Clock,
  Send,
  Layers,
  Receipt,
  ScanLine,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '233546106790';

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

const DELIVERY_TIMES: Record<string, string> = {
  'Launch Website': '7 Business Days',
  'Business Pro': 'Custom Timeline',
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

type Phase = 'collecting' | 'review' | 'success';

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; errorMsg: string };

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

function calcTotal(data: StepData): number | null {
  if (data.package === 'Business Pro') return null;
  if (!data.package) return null;
  let total = BASE_PRICES[data.package] || 0;
  data.features.forEach((f) => { total += FEATURE_PRICES[f] || 0; });
  data.brandingAddons.forEach((b) => { total += BRANDING_PRICES[b] || 0; });
  return total;
}

function buildWhatsAppMessage(data: StepData, total: number | null): string {
  const isCustom = data.package === 'Business Pro';
  const lines: string[] = [
    'Hello Raven Digital.',
    '',
    'I have completed the Website Planner.',
    '',
  ];

  if (data.businessType) lines.push(`*Business Type:*\n${data.businessType}`, '');
  if (data.package) lines.push(`*Selected Package:*\n${data.package}`, '');
  if (data.brandingStatus) lines.push(`*Branding:*\n${data.brandingStatus}`, '');
  if (data.brandingAddons.length > 0) lines.push(`*Branding Services:*\n${data.brandingAddons.join(', ')}`, '');

  if (data.logoOption) {
    const logoLine = data.logoOption === 'upload'
      ? 'I have a logo (will share separately)'
      : `Please design one${data.logoStyle ? ` — Style: ${data.logoStyle}` : ''}`;
    lines.push(`*Logo:*\n${logoLine}`, '');
  }

  if (data.brandColour) lines.push(`*Preferred Colours:*\n${data.brandColour}`, '');

  if (data.features.length > 0) {
    lines.push(`*Selected Features:*\n${data.features.join('\n')}`, '');
  }

  lines.push(`*Estimated Total:*\n${isCustom ? 'Custom Quote Required' : `GH₵${total?.toLocaleString()}`}`, '');

  if (data.businessDescription.trim()) {
    lines.push(`*Business Description:*\n${data.businessDescription.trim()}`, '');
  }

  const c = data.contact;
  const contactLines = [`*Contact Details:*`];
  if (c.businessName) contactLines.push(`Business Name: ${c.businessName}`);
  if (c.contactName) contactLines.push(`Contact Name: ${c.contactName}`);
  if (c.phone) contactLines.push(`Phone: ${c.phone}`);
  if (c.email) contactLines.push(`Email: ${c.email}`);
  if (c.city) contactLines.push(`City: ${c.city}`);
  if (c.website) contactLines.push(`Website: ${c.website}`);
  lines.push(contactLines.join('\n'), '');
  lines.push('Thank you.');

  return lines.join('\n');
}

// ─── Slide variants ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 60 : -60, opacity: 0 }),
};

const fadeUp = {
  hidden: { y: 20, opacity: 0 },
  show: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.06, type: 'spring', stiffness: 300, damping: 28 },
  }),
};

// ─── Main Planner ─────────────────────────────────────────────────────────────
export default function Planner() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<StepData>(initial);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<Phase>('collecting');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const colourInputRef = useRef<HTMLInputElement>(null);

  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });
  const [refNumber, setRefNumber] = useState('');

  const total = calcTotal(data);
  const isCustomQuote = data.package === 'Business Pro';

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };
  const goReview = () => { setPhase('review'); };
  const goBack = () => { setPhase('collecting'); };

  const handleSubmit = async () => {
    // Generate a reference number
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    const ref = `RD-${datePart}-${randPart}`;
    setRefNumber(ref);

    // Open WhatsApp immediately so the browser doesn't block the popup
    const msg = buildWhatsAppMessage(data, total);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    setSubmitState({ status: 'loading' });

    try {
      const payload = {
        refNumber: ref,
        total: total ?? 0,
        markdown: msg,
        contact: data.contact,
        businessType: data.businessType,
        package: data.package,
        features: data.features,
        brandingAddons: data.brandingAddons,
        logoOption: data.logoOption,
        logoStyle: data.logoStyle,
        brandColour: data.brandColour,
        businessDescription: data.businessDescription,
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: string };
        const msg503 = res.status === 503
          ? 'Email delivery is not yet configured — your WhatsApp message is ready to send.'
          : (errBody.error ?? 'Could not send confirmation email. Please send your WhatsApp message to confirm.');
        setSubmitState({ status: 'error', errorMsg: msg503 });
        return;
      }

      setSubmitState({ status: 'idle' });
      setTimeout(() => setPhase('success'), 600);
    } catch {
      setSubmitState({
        status: 'error',
        errorMsg: 'Network error — confirmation email could not be sent. Your WhatsApp message is ready to send.',
      });
    }
  };

  const restart = () => {
    setData(initial);
    setStep(1);
    setDirection(-1);
    setPhase('collecting');
    setSubmitState({ status: 'idle' });
    setRefNumber('');
  };

  // ── Header pricing pill ──────────────────────────────────────────────────────
  const showPill = data.package && phase === 'collecting';

  // ── Page key for AnimatePresence ─────────────────────────────────────────────
  const pageKey = phase === 'collecting' ? `step-${step}` : phase;

  const renderContent = () => {
    if (phase === 'review') return <ReviewPage data={data} total={total} isCustomQuote={isCustomQuote} onBack={goBack} onSubmit={handleSubmit} submitState={submitState} />;
    if (phase === 'success') return <SuccessPage refNumber={refNumber} onRestart={restart} />;

    switch (step) {
      case 1: return <Step1 data={data} setData={setData} onNext={next} />;
      case 2: return <Step2 data={data} setData={setData} onNext={next} onBack={prev} />;
      case 3: return <Step3 data={data} setData={setData} onNext={next} onBack={prev} total={total} isCustomQuote={isCustomQuote} />;
      case 4: return <Step4 data={data} setData={setData} onNext={next} onBack={prev} total={total} isCustomQuote={isCustomQuote} />;
      case 5: return <Step5 data={data} setData={setData} onNext={next} onBack={prev} colourInputRef={colourInputRef} />;
      case 6: return <Step6 data={data} setData={setData} onNext={next} onBack={prev} logoInputRef={logoInputRef} />;
      case 7: return <Step7 data={data} setData={setData} onNext={next} onBack={prev} />;
      case 8: return <Step8 data={data} setData={setData} onFinish={goReview} onBack={prev} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hidden file inputs */}
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => setData((d) => ({ ...d, uploadedLogo: e.target.files?.[0] ?? null }))} />
      <input ref={colourInputRef} type="file" accept="image/*,.pdf,.ai,.eps,.svg" className="hidden"
        onChange={(e) => setData((d) => ({ ...d, uploadedColours: e.target.files?.[0] ?? null }))} />

      {/* Header */}
      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-border/50 shrink-0 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <Link href="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors focus:outline-none">
          RAVEN
        </Link>
        <div className="flex items-center gap-4">
          {showPill && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
              {isCustomQuote ? 'Custom Quote' : <>Estimate: <span className="font-black">GH₵{total?.toLocaleString()}</span></>}
            </motion.div>
          )}
          {phase === 'collecting' && (
            <span className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
              {step}/{TOTAL_STEPS}
            </span>
          )}
          {phase === 'review' && (
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Review</span>
          )}
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-muted w-full shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          animate={{ width: phase === 'review' || phase === 'success' ? '100%' : `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
        />
      </div>

      {/* Main */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={pageKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute inset-0 overflow-y-auto flex flex-col"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile price bar */}
      {showPill && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-background/95 backdrop-blur border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Estimated Total</span>
          <span className="text-lg font-black text-primary">
            {isCustomQuote ? 'Custom Quote' : `GH₵${total?.toLocaleString()}`}
          </span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Review Page ──────────────────────────────────────────────────────────────
function ReviewPage({ data, total, isCustomQuote, onBack, onSubmit, submitState }: {
  data: StepData;
  total: number | null;
  isCustomQuote: boolean;
  onBack: () => void;
  onSubmit: () => void;
  submitState: SubmitState;
}) {
  // Build price breakdown items
  const lineItems: { label: string; amount: number }[] = [];
  if (data.package && !isCustomQuote) {
    lineItems.push({ label: data.package, amount: BASE_PRICES[data.package] || 0 });
    data.brandingAddons.forEach((b) => lineItems.push({ label: b, amount: BRANDING_PRICES[b] || 0 }));
    data.features.forEach((f) => lineItems.push({ label: f, amount: FEATURE_PRICES[f] || 0 }));
  }

  const delivery = data.package ? (DELIVERY_TIMES[data.package] || 'Custom Timeline') : '—';

  const SummaryRow = ({ icon: Icon, label, value, delay = 0 }: { icon: React.ElementType; label: string; value: string; delay?: number }) => (
    <motion.div variants={fadeUp} custom={delay} initial="hidden" animate="show"
      className="flex items-start gap-4 py-4 border-b border-border/50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
        <p className="text-base font-semibold text-foreground leading-snug">{value || '—'}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-10 md:py-14 pb-28 flex flex-col">
      {/* Back */}
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Edit Answers
      </motion.button>

      {/* Header */}
      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <ScanLine className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Your Summary</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Review your order.
        </h2>
        <p className="mt-2 text-base text-muted-foreground font-medium">
          Everything looks good? Continue to WhatsApp to confirm.
        </p>
      </motion.div>

      {/* Summary card */}
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
        className="mt-8 rounded-2xl border-2 border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Project Details</span>
        </div>
        <div className="px-6">
          <SummaryRow icon={Store} label="Business Type" value={data.businessType} delay={0} />
          <SummaryRow icon={Package} label="Selected Package" value={data.package} delay={1} />
          {data.brandingStatus && (
            <SummaryRow icon={Sparkles} label="Branding" value={data.brandingStatus} delay={2} />
          )}
          {data.brandingAddons.length > 0 && (
            <SummaryRow icon={Wand2} label="Branding Services" value={data.brandingAddons.join(', ')} delay={3} />
          )}
          {data.features.length > 0 && (
            <SummaryRow icon={CheckCheck} label="Additional Features" value={data.features.join(', ')} delay={4} />
          )}
          {data.brandColour && (
            <SummaryRow icon={Palette} label="Colour Palette" value={data.brandColour} delay={5} />
          )}
          {data.logoOption && (
            <SummaryRow
              icon={data.logoOption === 'upload' ? Upload : Wand2}
              label="Logo"
              value={data.logoOption === 'upload'
                ? (data.uploadedLogo ? `${data.uploadedLogo.name} (uploaded)` : 'I have a logo')
                : `Design for me${data.logoStyle ? ` — ${data.logoStyle}` : ''}`}
              delay={6}
            />
          )}
          <SummaryRow icon={Clock} label="Estimated Delivery" value={delivery} delay={7} />
        </div>
      </motion.div>

      {/* Price breakdown */}
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}
        className="mt-5 rounded-2xl border-2 border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center gap-3">
          <Receipt className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Price Breakdown</span>
        </div>

        {isCustomQuote ? (
          <div className="px-6 py-8 text-center">
            <p className="text-2xl font-black text-foreground">Custom Quote</p>
            <p className="mt-2 text-sm text-muted-foreground">Our team will prepare a tailored quote for your project.</p>
          </div>
        ) : (
          <div className="px-6 py-4">
            {lineItems.map(({ label, amount }, i) => (
              <motion.div key={label} variants={fadeUp} custom={i} initial="hidden" animate="show"
                className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">GH₵{amount.toLocaleString()}</span>
              </motion.div>
            ))}
            {/* Total row */}
            <motion.div variants={fadeUp} custom={lineItems.length} initial="hidden" animate="show"
              className="flex items-center justify-between py-4 mt-2 border-t-2 border-primary/20">
              <span className="text-base font-bold text-foreground">Total</span>
              <motion.span
                key={total}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-black text-primary"
              >
                GH₵{total?.toLocaleString()}
              </motion.span>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* WhatsApp / submit button */}
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}
        className="mt-8">
        <motion.button
          whileHover={submitState.status === 'loading' ? {} : { scale: 1.02, boxShadow: '0 20px 40px rgba(37,211,102,0.3)' }}
          whileTap={submitState.status === 'loading' ? {} : { scale: 0.98 }}
          onClick={submitState.status === 'loading' ? undefined : onSubmit}
          disabled={submitState.status === 'loading'}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
        >
          {submitState.status === 'loading' ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              Continue on WhatsApp
              <ChevronRight className="w-5 h-5 opacity-70" />
            </>
          )}
        </motion.button>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          Opens WhatsApp with your details pre-filled. You just hit send.
        </p>

        {/* Error banner */}
        {submitState.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-5 py-4"
          >
            <Mail className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Email not sent</p>
              <p className="mt-0.5 text-sm text-red-600 dark:text-red-500">{submitState.errorMsg}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Contact details recap */}
      {(data.contact.contactName || data.contact.phone) && (
        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}
          className="mt-5 rounded-2xl border border-border bg-muted/20 px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Your Contact Info</p>
          <div className="flex flex-wrap gap-4">
            {data.contact.businessName && (
              <div>
                <p className="text-xs text-muted-foreground">Business</p>
                <p className="text-sm font-semibold text-foreground">{data.contact.businessName}</p>
              </div>
            )}
            {data.contact.contactName && (
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="text-sm font-semibold text-foreground">{data.contact.contactName}</p>
              </div>
            )}
            {data.contact.phone && (
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold text-foreground">{data.contact.phone}</p>
              </div>
            )}
            {data.contact.city && (
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p className="text-sm font-semibold text-foreground">{data.contact.city}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Success Page (after WhatsApp) ────────────────────────────────────────────
function SuccessPage({ onRestart, refNumber }: { onRestart: () => void; refNumber: string }) {
  const steps = [
    { label: 'Your details have been prepared', done: true },
    { label: 'WhatsApp opened with your message', done: true },
    { label: 'Send the message to confirm', done: false },
    { label: 'Raven Digital will respond within 24 hours', done: false },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[calc(100vh-64px)]">
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
        className="relative mb-10"
      >
        {/* Glow rings */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.25) 0%, transparent 70%)', transform: 'scale(2)' }}
        />
        <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
          <MessageCircle className="w-14 h-14 text-white" />
        </div>
        {/* Check badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary border-4 border-background flex items-center justify-center"
        >
          <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
      >
        Almost there!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}
        className="mt-4 text-lg text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed"
      >
        Your project details are ready. Just send the WhatsApp message to get started.
      </motion.p>

      {/* Reference number */}
      {refNumber && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}
          className="mt-6 px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 max-w-sm w-full"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Reference Number</p>
          <p className="mt-1 text-xl font-black text-primary font-mono tracking-wide">{refNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">Quote this when you contact us.</p>
        </motion.div>
      )}

      {/* Step checklist */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-10 w-full max-w-sm text-left space-y-3"
      >
        {steps.map(({ label, done }, i) => (
          <motion.div
            key={label}
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.45 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
              ${done ? 'border-green-500 bg-green-500' : 'border-muted-foreground/30 bg-transparent'}`}>
              {done
                ? <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                : <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
              }
            </div>
            <span className={`text-sm font-medium ${done ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* WhatsApp reminder */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-10 px-6 py-5 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 max-w-sm w-full"
      >
        <div className="flex items-start gap-3">
          <Send className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-bold text-green-800 dark:text-green-300">Ready to send?</p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-400">
              Switch to WhatsApp and tap the send button. Your message is pre-filled with all your details.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <Link href="/" className="flex-1">
          <motion.span
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="block text-center py-3 px-6 rounded-full border-2 border-border text-foreground font-semibold hover:border-primary/50 transition-all cursor-pointer"
          >
            Back to Home
          </motion.span>
        </Link>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onRestart}
          className="flex-1 py-3 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
        >
          Start Over
        </motion.button>
      </motion.div>
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
          <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setData((d) => ({ ...d, businessType: label })); setTimeout(onNext, 280); }}
            className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer
              ${data.businessType === label ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
              ${data.businessType === label ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className={`text-sm font-semibold text-center leading-tight transition-colors
              ${data.businessType === label ? 'text-primary' : 'text-foreground'}`}>{label}</span>
          </motion.button>
        ))}
      </div>
    </StepWrapper>
  );
}

// ─── Step 2 — Package ─────────────────────────────────────────────────────────
const LAUNCH_FEATURES = ['Responsive Website', 'Up to 6 Pages', 'Contact Form', 'WhatsApp Button', 'Google Maps', 'Social Links', 'Admin Dashboard', 'Customer Dashboard', 'Analytics Dashboard', 'Ready in 7 Days'];
const PRO_FEATURES = ['Booking Systems', 'Payments', 'CRM', 'Inventory', 'Membership', 'Advanced Analytics', 'API Integrations', 'Custom Development'];

function Step2({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  const select = (pkg: string) => { setData((d) => ({ ...d, package: pkg })); setTimeout(onNext, 300); };
  return (
    <StepWrapper title="Choose your package." onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => select('Launch Website')}
          className={`text-left p-7 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col gap-5
            ${data.package === 'Launch Website' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border bg-card hover:border-primary/40 hover:shadow-md'}`}>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">Most Popular</span>
            <h3 className="text-2xl font-black text-foreground">Launch Website</h3>
            <div className="mt-1 text-3xl font-black text-primary">GH₵1,199</div>
            <p className="mt-1 text-sm text-muted-foreground">Starting price</p>
          </div>
          <ul className="space-y-2">
            {LAUNCH_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{f}
              </li>
            ))}
          </ul>
          {data.package === 'Launch Website' && <div className="flex items-center gap-2 text-primary font-semibold text-sm"><CheckCheck className="w-4 h-4" /> Selected</div>}
        </motion.button>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => select('Business Pro')}
          className={`text-left p-7 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col gap-5 relative overflow-hidden
            ${data.package === 'Business Pro' ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border bg-card hover:border-primary/40 hover:shadow-md'}`}>
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl" />
          <div className="relative">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-3">Enterprise</span>
            <h3 className="text-2xl font-black text-foreground">Business Pro</h3>
            <div className="mt-1 text-3xl font-black text-foreground">Custom Quote</div>
            <p className="mt-1 text-sm text-muted-foreground">For businesses needing advanced systems.</p>
          </div>
          <ul className="space-y-2 relative">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />{f}
              </li>
            ))}
          </ul>
          {data.package === 'Business Pro' && <div className="flex items-center gap-2 text-primary font-semibold text-sm"><CheckCheck className="w-4 h-4" /> Selected</div>}
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

function Step3({ data, setData, onNext, onBack, total, isCustomQuote }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; total: number | null; isCustomQuote: boolean }) {
  const toggle = (label: string) => {
    setData((d) => ({
      ...d,
      features: d.features.includes(label) ? d.features.filter((f) => f !== label) : [...d.features, label],
    }));
  };

  return (
    <StepWrapper title="Choose additional features." subtitle="Select all that apply. Each updates your estimate." onBack={onBack}>
      {!isCustomQuote && (
        <motion.div layout className="mt-6 p-5 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Current Estimate</p>
            <motion.p key={total} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black text-primary">
              GH₵{total?.toLocaleString()}
            </motion.p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{data.features.length} feature{data.features.length !== 1 ? 's' : ''} added</p>
            {data.features.length > 0 && <p className="text-primary font-semibold">+GH₵{data.features.reduce((a, f) => a + (FEATURE_PRICES[f] || 0), 0).toLocaleString()}</p>}
          </div>
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
        {EXTRA_FEATURES.map(({ label, icon: Icon }) => {
          const selected = data.features.includes(label);
          return (
            <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => toggle(label)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${selected ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                {!isCustomQuote && <p className="text-xs text-muted-foreground mt-0.5">+GH₵{FEATURE_PRICES[label]?.toLocaleString()}</p>}
              </div>
              <div className={`w-5 h-5 rounded shrink-0 border-2 flex items-center justify-center transition-colors ${selected ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                {selected && <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />}
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>
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

function Step4({ data, setData, onNext, onBack, total, isCustomQuote }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; total: number | null; isCustomQuote: boolean }) {
  const toggleAddon = (label: string) => {
    setData((d) => ({
      ...d,
      brandingAddons: d.brandingAddons.includes(label) ? d.brandingAddons.filter((a) => a !== label) : [...d.brandingAddons, label],
    }));
  };
  const needsExtra = data.brandingStatus && BRANDING_STATUS.find((b) => b.label === data.brandingStatus)?.needsExtra;

  return (
    <StepWrapper title="Brand Identity." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Do you already have branding?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {BRANDING_STATUS.map(({ label }) => (
          <motion.button key={label} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => setData((d) => ({ ...d, brandingStatus: label, brandingAddons: [] }))}
            className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
              ${data.brandingStatus === label ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
              ${data.brandingStatus === label ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
              {data.brandingStatus === label && <CheckCircle2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />}
            </div>
            <span className={`font-semibold text-sm leading-snug ${data.brandingStatus === label ? 'text-primary' : 'text-foreground'}`}>{label}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {needsExtra && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-8">
            <p className="text-base font-semibold text-foreground mb-1">Which branding services do you need?</p>
            {!isCustomQuote && <p className="text-sm text-muted-foreground mb-4">Each service updates your estimate.</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BRANDING_ADDONS.map(({ label, icon: Icon }) => {
                const selected = data.brandingAddons.includes(label);
                return (
                  <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => toggleAddon(label)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                      ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/40'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                      {!isCustomQuote && <p className="text-xs text-muted-foreground">+GH₵{BRANDING_PRICES[label]?.toLocaleString()}</p>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
            {!isCustomQuote && data.brandingAddons.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Estimate</span>
                <motion.span key={total} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-primary">
                  GH₵{total?.toLocaleString()}
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {data.brandingStatus && <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>}
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

function Step5({ data, setData, onNext, onBack, colourInputRef }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; colourInputRef: React.RefObject<HTMLInputElement> }) {
  return (
    <StepWrapper title="Brand Colours." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Choose your preferred colour palette.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {COLOUR_PALETTES.map(({ label, colors }) => {
          const selected = data.brandColour === label;
          return (
            <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setData((d) => ({ ...d, brandColour: label }))}
              className={`group flex flex-col gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer
                ${selected ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/40 hover:shadow-sm'}`}>
              <div className="flex gap-1.5">
                {colors.map((c) => <div key={c} className="flex-1 h-8 rounded-lg shadow-sm" style={{ backgroundColor: c }} />)}
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-sm font-semibold ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
                {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </div>
            </motion.button>
          );
        })}
      </div>
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        onClick={() => colourInputRef.current?.click()}
        className={`mt-4 w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed transition-all duration-200 text-left
          ${data.uploadedColours ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}`}>
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <Upload className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{data.uploadedColours ? data.uploadedColours.name : 'Upload Existing Brand Colours'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{data.uploadedColours ? 'File uploaded' : 'PNG, PDF, AI, EPS, SVG accepted'}</p>
        </div>
      </motion.button>
      {(data.brandColour || data.uploadedColours) && <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>}
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

function Step6({ data, setData, onNext, onBack, logoInputRef }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; logoInputRef: React.RefObject<HTMLInputElement> }) {
  const wantsDesign = data.logoOption === 'design';
  return (
    <StepWrapper title="Logo." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Do you already have a logo?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setData((d) => ({ ...d, logoOption: 'upload' })); logoInputRef.current?.click(); }}
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
            ${data.logoOption === 'upload' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${data.logoOption === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Upload className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Upload Logo</p>
            {data.uploadedLogo ? <p className="text-sm text-primary mt-1 font-medium">{data.uploadedLogo.name}</p> : <p className="text-sm text-muted-foreground mt-1">PNG, SVG, AI accepted</p>}
          </div>
        </motion.button>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setData((d) => ({ ...d, logoOption: 'design' }))}
          className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer
            ${wantsDesign ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${wantsDesign ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <Wand2 className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">Design a Logo for Me</p>
            <p className="text-sm text-muted-foreground mt-1">Our team will create it</p>
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {wantsDesign && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-8">
            <p className="text-base font-semibold text-foreground mb-4">Preferred logo style</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {LOGO_STYLES.map(({ label, icon: Icon }) => {
                const selected = data.logoStyle === label;
                return (
                  <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setData((d) => ({ ...d, logoStyle: label }))}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                      ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/40'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-semibold text-center ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(data.logoOption === 'upload' || (wantsDesign && data.logoStyle)) && (
        <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>
      )}
    </StepWrapper>
  );
}

// ─── Step 7 — Description ─────────────────────────────────────────────────────
function Step7({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  return (
    <StepWrapper title="Describe your business." subtitle="Optional — tell us about what you do, who you serve, and what makes you different." onBack={onBack}>
      <div className="mt-8 max-w-2xl">
        <textarea value={data.businessDescription}
          onChange={(e) => setData((d) => ({ ...d, businessDescription: e.target.value }))}
          placeholder="e.g. We are a family-run restaurant in Accra serving authentic Ghanaian cuisine. We pride ourselves on fresh ingredients and a warm, welcoming atmosphere..."
          rows={7}
          className="w-full px-5 py-4 rounded-2xl border-2 border-border bg-card text-foreground text-base leading-relaxed placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary transition-colors" />
        <p className="mt-2 text-sm text-muted-foreground">This helps us design something truly tailored to your business.</p>
      </div>
      <div className="mt-8 flex justify-end"><ContinueButton onClick={onNext} label="Continue (Optional)" /></div>
    </StepWrapper>
  );
}

// ─── Step 8 — Contact ─────────────────────────────────────────────────────────
function Step8({ data, setData, onFinish, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onFinish: () => void; onBack: () => void }) {
  const c = data.contact;
  const isValid = c.businessName.trim().length > 1 && c.contactName.trim().length > 1 && c.phone.trim().length > 5 && c.city.trim().length > 1;
  const setField = (field: keyof typeof c, value: string) => setData((d) => ({ ...d, contact: { ...d.contact, [field]: value } }));

  return (
    <StepWrapper title="Contact Details." onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Almost done — how do we reach you?</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        <FloatingInput id="businessName" label="Business Name" value={c.businessName} onChange={(v) => setField('businessName', v)} required />
        <FloatingInput id="contactName" label="Contact Name" value={c.contactName} onChange={(v) => setField('contactName', v)} required />
        <FloatingInput id="phone" label="Phone Number" type="tel" value={c.phone} onChange={(v) => setField('phone', v)} required />
        <FloatingInput id="email" label="Email (Optional)" type="email" value={c.email} onChange={(v) => setField('email', v)} />
        <FloatingInput id="city" label="City" value={c.city} onChange={(v) => setField('city', v)} required />
        <FloatingInput id="website" label="Existing Website (Optional)" type="url" value={c.website} onChange={(v) => setField('website', v)} />
      </div>
      <div className="mt-10 flex justify-end max-w-2xl">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onFinish} disabled={!isValid}
          className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base flex items-center gap-2 hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/25">
          Review My Order <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </StepWrapper>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function StepWrapper({ title, subtitle, onBack, children }: { title: string; subtitle?: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 md:py-16 pb-24 flex flex-col">
      {onBack && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </motion.button>
      )}
      <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="mt-3 text-base md:text-lg text-muted-foreground font-medium max-w-xl">
          {subtitle}
        </motion.p>
      )}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}>
        {children}
      </motion.div>
    </div>
  );
}

function ContinueButton({ onClick, label = 'Continue' }: { onClick: () => void; label?: string }) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-base flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
      {label} <ChevronRight className="w-5 h-5" />
    </motion.button>
  );
}

function FloatingInput({ id, label, value, onChange, type = 'text', required = false }: { id: string; label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="relative">
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" "
        className="peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-border bg-card text-foreground text-base focus:outline-none focus:border-primary transition-colors placeholder-transparent" />
      <label htmlFor={id}
        className="absolute left-4 top-4 text-muted-foreground text-sm font-medium pointer-events-none transition-all
          peer-placeholder-shown:text-base peer-placeholder-shown:top-4
          peer-focus:text-xs peer-focus:top-2 peer-focus:text-primary
          peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:top-2">
        {label}{required && <span className="text-primary ml-0.5">*</span>}
      </label>
    </div>
  );
}
