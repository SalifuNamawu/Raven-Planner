import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearch } from 'wouter';
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
  Edit2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const WHATSAPP_NUMBER = '233240110523';

const BASE_PRICES: Record<string, number> = {
  'Launch Website': 1199,
  'Business Pro': 2499,
};

const LOGO_DESIGN_PRICE = 250;
const COMPLETE_BRANDING_PRICE = 450;

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

const DELIVERY_TIMES: Record<string, string> = {
  'Launch Website': '7 Business Days',
  'Business Pro': 'Custom Timeline',
};

type StepData = {
  package: string;
  businessType: string;
  features: string[];
  brandIdentityOption: 'have' | 'logo-design' | 'complete-branding' | '';
  logoStyle: string;
  brandColour: string;
  customColours: string;
  colourPreference: string;
  uploadedLogo: File | null;
  uploadedColours: File | null;
  businessDescription: string;
  contact: {
    businessName: string;
    contactName: string;
    phone: string;
    email: string;
    city: string;
    website: string;
  };
};

type Phase = 'collecting' | 'review' | 'saving-lead' | 'success';

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; errorMsg: string }
  | { status: 'lead-saved'; leadId: string };

const initial: StepData = {
  package: '',
  businessType: '',
  features: [],
  brandIdentityOption: '',
  logoStyle: '',
  brandColour: '',
  customColours: '',
  colourPreference: '',
  uploadedLogo: null,
  uploadedColours: null,
  businessDescription: '',
  contact: {
    businessName: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    website: '',
  },
};

const TOTAL_STEPS_LAUNCH = 7;
const TOTAL_STEPS_PRO = 6;

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

const LAUNCH_FEATURES = ['Responsive Website', 'Up to 6 Pages', 'Contact Form', 'WhatsApp Button', 'Google Maps', 'Social Links', 'Admin Dashboard', 'Customer Dashboard', 'Analytics Dashboard', 'Ready in 7 Days'];
const PRO_FEATURES = ['Booking Systems', 'Payments', 'CRM', 'Inventory', 'Membership', 'Advanced Analytics', 'API Integrations', 'Custom Development'];

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

const LOGO_STYLES = [
  { label: 'Minimal', icon: AlignLeft },
  { label: 'Modern', icon: Zap },
  { label: 'Luxury', icon: Diamond },
  { label: 'Corporate', icon: Briefcase },
  { label: 'Creative', icon: Palette },
  { label: 'Typography', icon: PenTool },
  { label: 'Icon-Based', icon: LayoutGrid },
  { label: 'Abstract', icon: Sparkles },
];

const COLOUR_PALETTES = [
  { label: 'Royal Blue', colors: ['#1D4ED8', '#3B82F6', '#93C5FD'] },
  { label: 'Blue & White', colors: ['#1E40AF', '#3B82F6', '#FFFFFF'] },
  { label: 'Purple', colors: ['#7C3AED', '#A855F7', '#C4B5FD'] },
  { label: 'Black & Gold', colors: ['#111827', '#B45309', '#FCD34D'] },
  { label: 'Green', colors: ['#16A34A', '#22C55E', '#86EFAC'] },
  { label: 'Orange', colors: ['#EA580C', '#F97316', '#FDB082'] },
  { label: 'Red', colors: ['#DC2626', '#EF4444', '#FCA5A5'] },
  { label: 'Minimal', colors: ['#F9FAFB', '#E5E7EB', '#D1D5DB'] },
  { label: 'Luxury Dark', colors: ['#0F172A', '#1E293B', '#334155'] },
  { label: 'Modern Neutral', colors: ['#374151', '#6B7280', '#F3F4F6'] },
];

function calcTotal(data: StepData): number | null {
  if (!data.package) return null;
  let total = BASE_PRICES[data.package] || 0;
  data.features.forEach((f: string) => { total += FEATURE_PRICES[f] || 0; });
  if (data.brandIdentityOption === 'logo-design' && data.logoStyle) {
    total += LOGO_DESIGN_PRICE;
  } else if (data.brandIdentityOption === 'complete-branding') {
    total += COMPLETE_BRANDING_PRICE;
  }
  return total;
}

function getTotalSteps(data: StepData): number {
  return data.package === 'Business Pro' ? TOTAL_STEPS_PRO : TOTAL_STEPS_LAUNCH;
}

function getStepMapping(data: StepData): Record<number, string> {
  if (data.package === 'Business Pro') {
    return {
      1: 'package',
      2: 'businessType',
      3: 'branding',
      4: 'brandColour',
      5: 'description',
      6: 'contact',
    };
  }
  return {
    1: 'package',
    2: 'businessType',
    3: 'features',
    4: 'branding',
    5: 'brandColour',
    6: 'description',
    7: 'contact',
  };
}

function generateLeadId(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RD-${year}-${random}`;
}

function getBrandIdentityLabel(option: string): string {
  switch (option) {
    case 'have': return 'I already have my branding';
    case 'logo-design': return 'I need Raven Digital to design my logo';
    case 'complete-branding': return 'I need complete branding';
    default: return 'Not selected';
  }
}

function getColourLabel(data: StepData): string {
  if (data.brandColour) return data.brandColour;
  if (data.customColours) return `Custom: ${data.customColours}`;
  if (data.colourPreference === 'later') return 'Help me choose (will decide later)';
  if (data.uploadedColours) return `${data.uploadedColours.name} (uploaded)`;
  return 'Not selected';
}

function getLogoRequirementLabel(data: StepData): string {
  switch (data.brandIdentityOption) {
    case 'have': return data.uploadedLogo ? `${data.uploadedLogo.name} (uploaded)` : 'I have a logo (will provide later)';
    case 'logo-design': return `Design for me${data.logoStyle ? ` \u2014 ${data.logoStyle} style` : ''}`;
    case 'complete-branding': return 'Included in Complete Branding';
    default: return 'Not selected';
  }
}

function getBrandingPriceBreakdown(data: StepData): { label: string; amount: number }[] {
  const items: { label: string; amount: number }[] = [];
  if (data.brandIdentityOption === 'logo-design' && data.logoStyle) {
    items.push({ label: 'Logo Design', amount: LOGO_DESIGN_PRICE });
  } else if (data.brandIdentityOption === 'complete-branding') {
    items.push({ label: 'Complete Brand Identity', amount: COMPLETE_BRANDING_PRICE });
  }
  return items;
}

function buildWhatsAppMessage(data: StepData, total: number | null, leadId: string): string {
  const lines = [
    'Hello Raven Digital,',
    '',
    'I have completed the Website Planner and would like to discuss my website project.',
    '',
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
    '*LEAD ID*',
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
    '',
    `Lead ID: ${leadId}`,
    '',
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
    '*BUSINESS INFORMATION*',
    '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
    '',
  ];

  lines.push(`Business Type: ${data.businessType || 'Not selected'}`);
  lines.push(`Business Name: ${data.contact.businessName || 'Not provided'}`);
  lines.push(`Business Description: ${data.businessDescription.trim() || 'Not provided'}`);
  lines.push('');

  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('*WEBSITE PACKAGE*');
  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('');
  lines.push(`Package: ${data.package || 'Not selected'}`);
  lines.push(`Base Price: GH₵${data.package ? (BASE_PRICES[data.package] || 0).toLocaleString() : '—'}`);
  lines.push('');

  if (data.features.length > 0) {
    lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
    lines.push('*ADDITIONAL FEATURES*');
    lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
    lines.push('');
    data.features.forEach((f) => lines.push('\u2022 ' + f));
    lines.push('');
  }

  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('*BRAND IDENTITY*');
  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('');
  lines.push(`Brand Identity Option: ${getBrandIdentityLabel(data.brandIdentityOption)}`);
  lines.push(`Logo Requirement: ${getLogoRequirementLabel(data)}`);
  lines.push(`Brand Colours: ${getColourLabel(data)}`);
  lines.push('');

  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('*CONTACT INFORMATION*');
  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('');

  const c = data.contact;
  lines.push(`Name: ${c.contactName || 'Not provided'}`);
  lines.push(`Phone: ${c.phone || 'Not provided'}`);
  lines.push(`Email: ${c.email || 'Not provided'}`);
  lines.push(`City: ${c.city || 'Not provided'}`);
  if (c.website) lines.push(`Website: ${c.website}`);
  lines.push('');

  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('*ESTIMATED PROJECT PRICE*');
  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('');
  lines.push(`GH₵${total?.toLocaleString() || '—'}`);
  lines.push('');
  lines.push('\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501');
  lines.push('');
  lines.push('I would like to discuss the next steps with Raven Digital.');

  return lines.join('\n');
}

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
    transition: { delay: i * 0.06, type: 'spring' as const, stiffness: 300, damping: 28 },
  }),
};

export default function Planner() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initial);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState('collecting');
  const [leadId, setLeadId] = useState('');
  const [savedLeadId, setSavedLeadId] = useState('');

  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const colourInputRef = useRef<HTMLInputElement | null>(null);

  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' });

  // Pre-select package when arriving from homepage (?package=launch|pro)
  const search = useSearch();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const pkg = params.get('package');
    if (pkg === 'launch') {
      setData((d) => ({ ...d, package: 'Launch Website', features: [] }));
      setStep(2);
    } else if (pkg === 'pro') {
      setData((d) => ({ ...d, package: 'Business Pro', features: [] }));
      setStep(2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = calcTotal(data);
  const totalSteps = getTotalSteps(data);
  const stepMap = getStepMapping(data);

  const next = () => { setDirection(1); setStep((s) => Math.min(s + 1, totalSteps)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };
  const goReview = () => { setPhase('review'); };
  const goBack = () => { setPhase('collecting'); };

  const saveLeadToSheets = async (currentLeadId: string, submissionStatus: string, contactMethod: string): Promise<boolean> => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      const leadData = {
        leadId: currentLeadId,
        date: dateStr,
        time: timeStr,
        businessType: data.businessType,
        businessName: data.contact.businessName,
        businessDescription: data.businessDescription,
        package: data.package,
        basePrice: BASE_PRICES[data.package] || 0,
        additionalFeatures: data.features.join(', ') || 'None',
        brandIdentityOption: getBrandIdentityLabel(data.brandIdentityOption),
        logoRequirement: getLogoRequirementLabel(data),
        logoStyle: data.logoStyle || 'N/A',
        logoUploadStatus: data.brandIdentityOption === 'have' ? (data.uploadedLogo ? 'Uploaded' : 'Will provide later') : 'N/A',
        brandColour: getColourLabel(data),
        customColours: data.customColours || 'N/A',
        businessOwnerName: data.contact.contactName,
        phoneNumber: data.contact.phone,
        email: data.contact.email,
        city: data.contact.city,
        website: data.contact.website || 'N/A',
        estimatedTotal: total || 0,
        submissionStatus,
        contactMethod,
        followUpStatus: 'New',
      };

      const res = await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to save lead');
      }

      return true;
    } catch (err) {
      console.error('Save lead error:', err);
      return false;
    }
  };

  const handleSubmit = async () => {
    const newLeadId = generateLeadId();
    setLeadId(newLeadId);
    setPhase('saving-lead');
    setSubmitState({ status: 'loading' });

    const saved = await saveLeadToSheets(newLeadId, 'Completed \u2013 No Contact', 'None');

    if (!saved) {
      setSubmitState({
        status: 'error',
        errorMsg: 'Failed to save lead to Google Sheets. Please try again or continue anyway.'
      });
      setPhase('review');
      return;
    }

    setSavedLeadId(newLeadId);
    setSubmitState({ status: 'lead-saved', leadId: newLeadId });
    setPhase('review');
  };

  const handleWhatsApp = async () => {
    // Generate a lead ID on demand if one hasn't been saved yet
    const currentLeadId = savedLeadId || leadId || generateLeadId();
    if (!leadId) setLeadId(currentLeadId);
    if (!savedLeadId) setSavedLeadId(currentLeadId);

    setSubmitState({ status: 'loading' });
    await saveLeadToSheets(currentLeadId, 'WhatsApp', 'WhatsApp');

    const msg = buildWhatsAppMessage(data, total, currentLeadId);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    setSubmitState({ status: 'idle' });
    setTimeout(() => setPhase('success'), 600);
  };

  const handleEmail = async () => {
    // Generate a lead ID on demand if one hasn't been saved yet
    const currentLeadId = savedLeadId || leadId || generateLeadId();
    if (!leadId) setLeadId(currentLeadId);
    if (!savedLeadId) setSavedLeadId(currentLeadId);

    setSubmitState({ status: 'loading' });
    await saveLeadToSheets(currentLeadId, 'Email', 'Email');

    const subject = encodeURIComponent(`New Website Project Request \u2014 ${currentLeadId}`);
    const body = encodeURIComponent(buildWhatsAppMessage(data, total, currentLeadId));
    window.open(`mailto:raven.dig.mar@gmail.com?subject=${subject}&body=${body}`, '_blank');

    setSubmitState({ status: 'idle' });
    setTimeout(() => setPhase('success'), 600);
  };

  const restart = () => {
    setData(initial);
    setStep(1);
    setDirection(-1);
    setPhase('collecting');
    setSubmitState({ status: 'idle' });
    setLeadId('');
    setSavedLeadId('');
  };

  const showPill = data.package && phase === 'collecting';

  const pageKey = phase === 'collecting' ? `step-${step}` : phase;

  const renderContent = () => {
    if (phase === 'review') return <ReviewPage data={data} total={total} leadId={savedLeadId} onBack={goBack} onWhatsApp={handleWhatsApp} onEmail={handleEmail} submitState={submitState} step={step} setStep={setStep} setDirection={setDirection} setPhase={setPhase} onRetry={handleSubmit} />;
    if (phase === 'success') return <SuccessPage data={data} total={total} refNumber={savedLeadId} onRestart={restart} />;
    if (phase === 'saving-lead') return <SavingLeadPage />;

    const currentStepType = stepMap[step];

    switch (currentStepType) {
      case 'package': return <StepPackage data={data} setData={setData} onNext={next} />;
      case 'businessType': return <StepBusinessType data={data} setData={setData} onNext={next} onBack={prev} />;
      case 'features': return <StepFeatures data={data} setData={setData} onNext={next} onBack={prev} total={total} />;
      case 'branding': return <StepBranding data={data} setData={setData} onNext={next} onBack={prev} total={total} logoInputRef={logoInputRef} />;
      case 'brandColour': return <StepBrandColour data={data} setData={setData} onNext={next} onBack={prev} colourInputRef={colourInputRef} />;
      case 'description': return <StepDescription data={data} setData={setData} onNext={next} onBack={prev} />;
      case 'contact': return <StepContact data={data} setData={setData} onFinish={goReview} onBack={prev} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => setData((d) => ({ ...d, uploadedLogo: e.target.files?.[0] ?? null }))} />
      <input ref={colourInputRef} type="file" accept="image/*,.pdf,.ai,.eps,.svg" className="hidden"
        onChange={(e) => setData((d) => ({ ...d, uploadedColours: e.target.files?.[0] ?? null }))} />

      <header className="h-16 px-6 md:px-12 flex items-center justify-between border-b border-border/50 shrink-0 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <Link href="/" className="text-xl font-black tracking-tighter hover:text-primary transition-colors focus:outline-none">
          RAVEN
        </Link>
        <div className="flex items-center gap-4">
          {showPill && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-primary">
              Estimate: <span className="font-black">GH₵{total?.toLocaleString()}</span>
            </motion.div>
          )}
          {phase === 'collecting' && (
            <span className="text-sm font-semibold text-muted-foreground tracking-widest uppercase">
              {step}/{totalSteps}
            </span>
          )}
          {phase === 'review' && (
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Review</span>
          )}
          {phase === 'saving-lead' && (
            <span className="text-sm font-semibold text-primary tracking-widest uppercase">Saving Lead</span>
          )}
        </div>
      </header>

      <div className="h-0.5 bg-muted w-full shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          animate={{ width: phase === 'review' || phase === 'success' ? '100%' : `${(step / totalSteps) * 100}%` }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
        />
      </div>

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

      {showPill && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-6 py-4 bg-background/95 backdrop-blur border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">Estimated Total</span>
          <span className="text-lg font-black text-primary">GH₵{total?.toLocaleString()}</span>
        </motion.div>
      )}
    </div>
  );
}

function SavingLeadPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[calc(100vh-64px)]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
        className="relative mb-8"
      >
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </motion.div>
      <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-black text-foreground">
        Saving Your Lead
      </motion.h2>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="mt-3 text-muted-foreground max-w-sm mx-auto">
        We're recording your project details securely. This takes just a moment.
      </motion.p>
    </div>
  );
}

function ReviewPage({ data, total, leadId, onBack, onWhatsApp, onEmail, submitState, step, setStep, setDirection, setPhase, onRetry }: { data: StepData; total: number | null; leadId: string; onBack: () => void; onWhatsApp: () => void; onEmail: () => void; submitState: SubmitState; step: number; setStep: React.Dispatch<React.SetStateAction<number>>; setDirection: React.Dispatch<React.SetStateAction<number>>; setPhase: React.Dispatch<React.SetStateAction<Phase>>; onRetry: () => void }) {
  const lineItems: { label: string; amount: number }[] = [];
  if (data.package) {
    lineItems.push({ label: data.package, amount: BASE_PRICES[data.package] || 0 });
    data.features.forEach((f: string) => { const price = FEATURE_PRICES[f] || 0; if (price > 0) lineItems.push({ label: f, amount: price }); });
    getBrandingPriceBreakdown(data).forEach((b) => lineItems.push(b));
  }

  const Section = ({ title, icon: Icon, children, delay = 0, editStep }: { title: string; icon: React.ElementType; children: React.ReactNode; delay?: number; editStep?: string }) => (
    <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}
      className="mt-5 rounded-2xl border-2 border-border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">{title}</span>
        </div>
        {editStep && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => {
              const mapping = getStepMapping(data);
              const targetStep = Object.entries(mapping).find(([_, v]) => v === editStep)?.[0];
              if (targetStep) {
                const targetNum = parseInt(targetStep, 10);
                setDirection(targetNum > step ? 1 : -1);
                setStep(targetNum);
                setPhase('collecting');
              }
            }}
            className="px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </motion.button>
        )}
      </div>
      <div className="px-6 py-4 space-y-4">{children}</div>
    </motion.div>
  );

  const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2 border-b border-border/50 last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right sm:text-left">{value || 'Not selected'}</span>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-10 md:py-14 pb-28 flex flex-col">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit font-medium text-sm">
        <ArrowLeft className="w-4 h-4" /> Back and Edit
      </motion.button>

      <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <ScanLine className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Your Website Plan</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          Review your website plan.
        </h2>
        <p className="mt-2 text-base text-muted-foreground font-medium">
          Everything looks good? Send your details to Raven Digital.
        </p>
        {leadId && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20 inline-flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">Lead ID: {leadId}</span>
          </motion.div>
        )}
      </motion.div>

      <Section title="Business" icon={Briefcase} delay={0.1} editStep="businessType">
        <DetailRow label="Business Type" value={data.businessType || 'Not selected'} />
        <DetailRow label="Business Name" value={data.contact.businessName || 'Not provided'} />
        <DetailRow label="Business Description" value={data.businessDescription || 'Not provided'} />
      </Section>

      <Section title="Website" icon={Globe} delay={0.15} editStep="package">
        <DetailRow label="Selected Package" value={data.package || 'Not selected'} />
        {data.features.length > 0 ? (
          <DetailRow label="Additional Features" value={data.features.join(', ')} />
        ) : (
          <DetailRow label="Additional Features" value="None selected" />
        )}
      </Section>

      <Section title="Brand Identity" icon={Sparkles} delay={0.2} editStep="branding">
        <DetailRow label="Brand Identity Option" value={getBrandIdentityLabel(data.brandIdentityOption)} />
        <DetailRow label="Logo Requirement" value={getLogoRequirementLabel(data)} />
        <DetailRow label="Brand Colours" value={getColourLabel(data)} />
      </Section>

      <Section title="Contact" icon={UserCheck} delay={0.25} editStep="contact">
        <DetailRow label="Name" value={data.contact.contactName || 'Not provided'} />
        <DetailRow label="Phone" value={data.contact.phone || 'Not provided'} />
        <DetailRow label="Email" value={data.contact.email || 'Not provided'} />
        <DetailRow label="City" value={data.contact.city || 'Not provided'} />
        {data.contact.website && <DetailRow label="Existing Website" value={data.contact.website} />}
      </Section>

      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-5 rounded-2xl border-2 border-border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
          <Receipt className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground">Pricing</span>
        </div>
        <div className="px-6 py-4 space-y-3">
          {lineItems.map(({ label, amount }, i) => (
            <motion.div key={label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-sm font-medium text-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">GH₵{amount.toLocaleString()}</span>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + lineItems.length * 0.05 }}
            className="flex items-center justify-between py-3 mt-2 border-t-2 border-primary/20">
            <span className="text-base font-bold text-foreground">Estimated Total</span>
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
      </motion.div>

      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="mt-8 space-y-4">
        <motion.button
          whileHover={submitState.status === 'loading' ? {} : { scale: 1.02, boxShadow: '0 20px 40px rgba(37,211,102,0.3)' }}
          whileTap={submitState.status === 'loading' ? {} : { scale: 0.98 }}
          onClick={submitState.status === 'loading' ? undefined : onWhatsApp}
          disabled={submitState.status === 'loading'}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
        >
          {submitState.status === 'loading' ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Saving...
            </>
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              Send My Website Plan on WhatsApp
              <ChevronRight className="w-5 h-5 opacity-70" />
            </>
          )}
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <p className="text-center text-sm text-muted-foreground mb-2">Prefer Email?</p>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={submitState.status === 'loading' ? undefined : onEmail}
            disabled={submitState.status === 'loading'}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base border-2 border-border text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-50"
          >
            <Mail className="w-5 h-5" />
            Send My Details by Email
          </motion.button>
          <p className="mt-2 text-center text-xs text-muted-foreground">Opens your email client with all project details pre-filled.</p>
        </motion.div>

        {submitState.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 px-5 py-4"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Lead Not Saved</p>
              <p className="mt-0.5 text-sm text-red-600 dark:text-red-500">{submitState.errorMsg}</p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Saving Lead
            </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function SuccessPage({ data, total, onRestart, refNumber }: { data: StepData; total: number | null; onRestart: () => void; refNumber: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 min-h-[calc(100vh-64px)]">
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16, delay: 0.1 }}
        className="relative mb-10"
      >
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary border-4 border-background flex items-center justify-center"
        >
          <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="text-4xl md:text-5xl font-black tracking-tight text-foreground"
      >
        You're Almost There!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.32 }}
        className="mt-4 text-lg text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed"
      >
        Your website requirements have been prepared. Continue the conversation with Raven Digital on WhatsApp so we can review your project and get started.
      </motion.p>

      {refNumber && (
        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}
          className="mt-6 px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 max-w-sm w-full"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lead ID</p>
          <p className="mt-1 text-xl font-black text-primary font-mono tracking-wide">{refNumber}</p>
          <p className="mt-1 text-xs text-muted-foreground">Quote this when you contact us.</p>
        </motion.div>
      )}

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
        className="mt-8 space-y-3 max-w-sm w-full"
      >
        <div className="p-4 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
            <div className="text-left">
              <p className="text-sm font-bold text-green-800 dark:text-green-300">WhatsApp</p>
              <p className="text-sm font-mono text-green-700 dark:text-green-400">+233 240 110 523</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <div className="text-left">
              <p className="text-sm font-bold text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">raven.dig.mar@gmail.com</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-sm"
      >
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => {
            const msg = buildWhatsAppMessage(data, total, refNumber);
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
          }}
          className="flex-1 py-4 px-6 rounded-2xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-600/25 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Open WhatsApp Again
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => {
            const subject = encodeURIComponent(`New Website Project Request \u2014 ${refNumber}`);
            const body = encodeURIComponent(buildWhatsAppMessage(data, total, refNumber));
            window.open(`mailto:raven.dig.mar@gmail.com?subject=${subject}&body=${body}`, '_blank');
          }}
          className="flex-1 py-4 px-6 rounded-2xl border-2 border-border text-foreground font-bold text-lg hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5" />
          Send by Email
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-6"
      >
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

function StepPackage({ data, setData, onNext }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void }) {
  const select = (pkg: string) => { setData((d) => ({ ...d, package: pkg, features: [] })); setTimeout(onNext, 300); };
  return (
    <StepWrapper title="Choose your package." subtitle="Select the package that fits your business. You can change this later if needed.">
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
            <div className="mt-1 text-3xl font-black text-foreground">GH₵2,499</div>
            <p className="mt-1 text-sm text-muted-foreground">For businesses that need a more advanced and professional website.</p>
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

function StepBusinessType({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  return (
    <StepWrapper title="What type of business do you run?" onBack={onBack}>
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

function StepFeatures({ data, setData, onNext, onBack, total }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; total: number | null }) {
  const toggle = (label: string) => {
    setData((d) => ({
      ...d,
      features: d.features.includes(label) ? d.features.filter((f: string) => f !== label) : [...d.features, label],
    }));
  };

  return (
    <StepWrapper title="Choose additional features." subtitle="Select all that apply. Each updates your estimate." onBack={onBack}>
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
                <p className="text-xs text-muted-foreground mt-0.5">+GH₵{FEATURE_PRICES[label]?.toLocaleString()}</p>
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

function StepBranding({ data, setData, onNext, onBack, total, logoInputRef }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; total: number | null; logoInputRef: React.RefObject<HTMLInputElement | null> }) {
  const wantsLogoDesign = data.brandIdentityOption === 'logo-design';
  const wantsCompleteBranding = data.brandIdentityOption === 'complete-branding';
  const hasBrandingSelection = data.brandIdentityOption && (!wantsLogoDesign || data.logoStyle);

  const brandingOptions = [
    {
      value: 'have',
      label: 'I already have my branding',
      description: 'I have a complete brand identity (logo, colours, guidelines)',
      price: 0,
      icon: CheckCircle2,
    },
    {
      value: 'logo-design',
      label: 'I need Raven Digital to design my logo',
      description: 'Create a custom logo for my brand',
      price: LOGO_DESIGN_PRICE,
      icon: Wand2,
    },
    {
      value: 'complete-branding',
      label: 'I need complete branding',
      description: 'Full brand identity including logo, colours & guidelines',
      price: COMPLETE_BRANDING_PRICE,
      icon: Sparkles,
    },
  ];

  return (
    <StepWrapper title="Let's Build Your Brand" subtitle="Already have a brand? Great. Need help creating one? We can take care of that too." onBack={onBack}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {brandingOptions.map(({ value, label, description, price, icon: Icon }) => (
          <motion.button key={value} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={() => setData((d) => ({ ...d, brandIdentityOption: value as StepData['brandIdentityOption'], logoStyle: value === 'logo-design' ? '' : d.logoStyle }))}
            className={`flex flex-col items-start gap-3 p-6 rounded-2xl border-2 text-left transition-all duration-200 h-full
              ${data.brandIdentityOption === value ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-border bg-card hover:border-primary/40'}`}>
            <div className="flex items-center justify-between w-full">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
                ${data.brandIdentityOption === value ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                {data.brandIdentityOption === value && <CheckCircle2 className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />}
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${data.brandIdentityOption === value ? 'text-primary' : 'text-foreground'}`}>
                  {price === 0 ? 'GH₵0' : '+GH₵' + price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <p className={`font-semibold text-base leading-snug ${data.brandIdentityOption === value ? 'text-primary' : 'text-foreground'}`}>{label}</p>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${data.brandIdentityOption === value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Icon className="w-5 h-5" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {wantsLogoDesign && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-8">
            <p className="text-base font-semibold text-foreground mb-2">Choose your preferred logo style</p>
            <p className="text-sm text-muted-foreground mb-4">Logo design adds GH₵{LOGO_DESIGN_PRICE.toLocaleString()} to your estimate.</p>
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
            {data.logoStyle && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Logo Design Added</span>
                <span className="text-lg font-black text-primary">+GH₵{LOGO_DESIGN_PRICE.toLocaleString()}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {wantsCompleteBranding && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="mt-8">
            <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5">
              <p className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Complete Brand Identity \u2014 GH₵{COMPLETE_BRANDING_PRICE.toLocaleString()}
              </p>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" />Logo Design</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" />Brand Colour Palette</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" />Basic Brand Guidelines</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" />Professional Brand Direction</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data.brandIdentityOption === 'have' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <div className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Have your logo ready?</p>
                  <p className="text-xs text-muted-foreground">You can upload it now, or send it to us later through WhatsApp or email.</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => logoInputRef.current?.click()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
                Upload Logo
              </motion.button>
            </div>
            {data.uploadedLogo && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{data.uploadedLogo.name}</span>
                </div>
                <span className="text-xs text-primary font-medium">Uploaded</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {hasBrandingSelection && <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>}
    </StepWrapper>
  );
}

function StepBrandColour({ data, setData, onNext, onBack, colourInputRef }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void; colourInputRef: React.RefObject<HTMLInputElement | null> }) {
  const hasColourSelection = data.brandColour || data.customColours || data.uploadedColours || data.colourPreference === 'later';

  return (
    <StepWrapper title="Brand Colours" onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Choose your preferred colour palette.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
        {COLOUR_PALETTES.map(({ label, colors }) => {
          const selected = data.brandColour === label;
          return (
            <motion.button key={label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setData((d) => ({ ...d, brandColour: label, customColours: '', colourPreference: '' }))}
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

      <div className="mt-6 space-y-4">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setData((d) => ({ ...d, colourPreference: 'custom', brandColour: '', uploadedColours: null }))}
          className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left
            ${data.colourPreference === 'custom' ? 'border-primary bg-primary/5 shadow-md' : 'border-dashed border-border hover:border-primary/50 bg-card'}`}>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Choose My Own Colours</p>
            <p className="text-xs text-muted-foreground mt-0.5">I'll specify my preferred colours</p>
          </div>
          {data.colourPreference === 'custom' && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
        </motion.button>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setData((d) => ({ ...d, colourPreference: 'later', brandColour: '', customColours: '' }))}
          className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 text-left
            ${data.colourPreference === 'later' ? 'border-primary bg-primary/5 shadow-md' : 'border-dashed border-border hover:border-primary/50 bg-card'}`}>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Clock3 className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Help Me Choose My Brand Colours</p>
            <p className="text-xs text-muted-foreground mt-0.5">I don't have brand colours yet \u2014 guide me</p>
          </div>
          {data.colourPreference === 'later' && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
        </motion.button>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => colourInputRef.current?.click()}
          className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed transition-all duration-200 text-left
            ${data.uploadedColours ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'}`}>
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{data.uploadedColours ? data.uploadedColours.name : 'Upload Existing Brand Colours'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{data.uploadedColours ? 'File uploaded' : 'PNG, PDF, AI, EPS, SVG accepted'}</p>
          </div>
        </motion.button>
      </div>

      {data.colourPreference === 'custom' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground mb-2">Enter your colour preferences (hex codes, colour names, or description)</label>
          <textarea
            value={data.customColours || ''}
            onChange={(e) => setData((d) => ({ ...d, customColours: e.target.value }))}
            placeholder="#1D4ED8, #FFFFFF, #FCD34D \u2014 or describe: 'Deep blue with gold accents'"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground text-base placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      )}

      {hasColourSelection && <div className="mt-10 flex justify-end"><ContinueButton onClick={onNext} /></div>}
    </StepWrapper>
  );
}

function StepDescription({ data, setData, onNext, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onNext: () => void; onBack: () => void }) {
  const [showError, setShowError] = useState(false);
  const isValid = data.businessDescription.trim().length >= 20;

  const handleNext = () => {
    if (isValid) {
      setShowError(false);
      onNext();
    } else {
      setShowError(true);
    }
  };

  return (
    <StepWrapper title="Tell Us About Your Business" subtitle="Tell us what your business does, who you serve, and what you want your website to achieve. This information helps us create a website that fits your business." onBack={onBack}>
      <div className="mt-8 max-w-2xl">
        <textarea value={data.businessDescription}
          onChange={(e) => { setData((d) => ({ ...d, businessDescription: e.target.value })); setShowError(false); }}
          placeholder="e.g. We are a family-run restaurant in Accra serving authentic Ghanaian cuisine. We pride ourselves on fresh ingredients and a warm, welcoming atmosphere..."
          rows={7}
          className={`w-full px-5 py-4 rounded-2xl border-2 bg-card text-foreground text-base leading-relaxed placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary transition-colors ${showError && !isValid ? 'border-red-500' : 'border-border'}`} />
        {showError && !isValid && (
          <p className="mt-2 text-sm text-red-500 font-medium">Please tell us about your business before continuing. (Minimum 20 characters)</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">This helps us design something truly tailored to your business.</p>
      </div>
      <div className="mt-8 flex justify-end"><ContinueButton onClick={handleNext} /></div>
    </StepWrapper>
  );
}

function StepContact({ data, setData, onFinish, onBack }: { data: StepData; setData: React.Dispatch<React.SetStateAction<StepData>>; onFinish: () => void; onBack: () => void }) {
  const c = data.contact;
  const isValid = c.businessName.trim().length > 1 && c.contactName.trim().length > 1 && c.phone.trim().length > 5 && c.city.trim().length > 1;
  const setField = (field: keyof typeof c, value: string) => setData((d) => ({ ...d, contact: { ...d.contact, [field]: value } }));

  return (
    <StepWrapper title="Contact Details" onBack={onBack}>
      <p className="text-muted-foreground mt-2 text-lg">Almost done \u2014 how do we reach you?</p>
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
