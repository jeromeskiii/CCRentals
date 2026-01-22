import React, { useState } from 'react';
import { 
  Check, 
  ScanLine, 
  AlertTriangle, 
  ShieldCheck,
  Loader2
} from 'lucide-react';

// --- THEME CONFIGURATION (Injected CSS) ---
const ThemeProvider = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&family=Switzer:wght@300;400;500;600&display=swap');

    :root {
      /* COASTAL INDUSTRIAL PALETTE MAPPED TO YOUR VARS */
      /* Base Paper: #F2F0E9 -> oklch(0.95 0.01 90) approx */
      --background: oklch(0.95 0.02 95); 
      --foreground: oklch(0.15 0.02 90); /* Carbon Black */
      
      /* Card: Slightly lighter paper for contrast */
      --card: oklch(0.97 0.01 95);
      --card-foreground: oklch(0.15 0.02 90);
      
      /* Primary: Carbon Black for strong actions */
      --primary: oklch(0.15 0.02 90);
      --primary-foreground: oklch(0.97 0.01 95);
      
      /* Secondary: Muted Steel */
      --secondary: oklch(0.92 0.01 95);
      --secondary-foreground: oklch(0.15 0.02 90);
      
      /* Accent: Safety Orange #FF4D00 */
      --accent: oklch(0.65 0.22 35); 
      --accent-foreground: oklch(1.0 0 0);
      
      /* Destructive: Deep Red */
      --destructive: oklch(0.6 0.2 25);
      --destructive-foreground: oklch(1.0 0 0);
      
      /* Borders: Sharp, Visible Steel */
      --border: oklch(0.80 0.02 90);
      --input: oklch(0.95 0.01 95);
      --ring: oklch(0.65 0.22 35); /* Orange Focus Ring */
      
      /* Typography overrides */
      --font-sans: 'Switzer', sans-serif;
      --font-serif: 'Cormorant Garamond', serif;
      --font-mono: 'JetBrains Mono', monospace;
      
      --radius: 0px; /* Industrial = No rounded corners */
    }

    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: var(--font-sans);
    }
    
    .font-serif { font-family: var(--font-serif); }
    .font-mono { font-family: var(--font-mono); }
  `}</style>
);

// --- COMPONENT PRIMITIVES ---

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, variant = "primary", className = "", onClick, disabled }: ButtonProps) => {
  const base = "h-12 px-8 flex items-center justify-center text-xs font-mono uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed border";
  const variants = {
    primary: "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] hover:bg-[var(--accent)] hover:border-[var(--accent)]",
    outline: "bg-transparent border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]",
    ghost: "border-transparent text-[var(--foreground)] hover:bg-[var(--secondary)]"
  };
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

const Input = ({ label, placeholder, value, onChange, autoFocus }: InputProps) => (
  <div className="group">
    <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-2 group-focus-within:text-[var(--accent)] transition-colors">
      {label}
    </label>
    <div className="relative">
      <input 
        autoFocus={autoFocus}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-[var(--border)] py-3 text-xl font-serif italic focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-stone-300 placeholder:not-italic placeholder:font-sans"
      />
      <div className="absolute right-0 bottom-3">
        <div className="w-1.5 h-1.5 bg-[var(--accent)] opacity-0 group-focus-within:opacity-100 transition-opacity" />
      </div>
    </div>
  </div>
);

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-1 mb-12">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={`h-0.5 transition-all duration-500 ${i < current ? 'w-8 bg-[var(--accent)]' : i === current ? 'w-16 bg-[var(--foreground)]' : 'w-4 bg-[var(--border)]'}`} 
      />
    ))}
  </div>
);

// --- FLOW STEPS ---

// STEP 1: IDENTIFY (Matches "Sign Up" clean layout)
const StepIdentify = ({ onNext }: { onNext: (data: { id: string }) => void }) => {
  const [id, setId] = useState("");
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif italic mb-4 text-[var(--foreground)]">
          Initiate Return
        </h1>
        <p className="text-stone-500 max-w-md">
          Enter the unique asset tag ID or scan the QR code located on the chassis.
        </p>
      </div>

      <div className="space-y-8 max-w-md">
        <Input 
          label="Asset Identifier" 
          placeholder="CCR-XXXX" 
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoFocus
        />
        
        <div className="flex gap-4">
          <Button onClick={() => onNext({ id })} className="flex-1">
            Proceed to Inspection
          </Button>
          <Button variant="outline" className="px-4">
            <ScanLine className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-[var(--border)] flex gap-8 text-[10px] font-mono uppercase text-stone-400">
        <span className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" /> Secure Gateway
        </span>
        <span className="flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> System Online
        </span>
      </div>
    </div>
  );
};

// STEP 2: CONDITION (Matches "Getting to know you" form)
const StepCondition = ({ onNext, data }: { onNext: (data: { condition: string }) => void; data: any }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const conditions = [
    { id: 'mint', label: 'Mint / A+', desc: 'No visible wear. Lenses pristine.' },
    { id: 'good', label: 'Standard / B', desc: 'Minor cosmetic scuffs. Functional.' },
    { id: 'damaged', label: 'Damaged / F', desc: 'Needs repair. Flag for maintenance.', alert: true },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8 flex items-baseline justify-between border-b border-[var(--border)] pb-4">
        <h1 className="text-3xl font-serif italic">Condition Report</h1>
        <span className="font-mono text-sm bg-stone-100 px-2 py-1">{data.id}</span>
      </div>

      <div className="grid gap-4 mb-8">
        {conditions.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`text-left p-4 border transition-all relative group
              ${selected === c.id 
                ? 'border-[var(--accent)] bg-white shadow-lg scale-[1.01]' 
                : 'border-[var(--border)] bg-transparent hover:border-stone-400'
              }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`font-mono text-xs uppercase tracking-widest ${selected === c.id ? 'text-[var(--accent)]' : 'text-stone-500'}`}>
                {c.id === 'damaged' && <AlertTriangle className="w-3 h-3 inline mr-2" />}
                {c.label}
              </span>
              {selected === c.id && <Check className="w-4 h-4 text-[var(--accent)]" />}
            </div>
            <p className="font-serif text-lg text-[var(--foreground)]">{c.desc}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Input label="Notes (Optional)" placeholder="Missing caps, scratches..." />
        <Button onClick={() => selected && onNext({ condition: selected })} disabled={!selected} className="w-full">
          Submit Report
        </Button>
      </div>
    </div>
  );
};

// STEP 3: SUCCESS (Matches "Verify Email" / "Welcome")
const StepSuccess = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center animate-in zoom-in-95 duration-500 max-w-md mx-auto py-12 border border-[var(--border)] bg-[var(--card)] relative overflow-hidden">
    {/* Decorative background stamps */}
    <div className="absolute top-0 right-0 p-4 opacity-10 font-mono text-9xl leading-none pointer-events-none select-none">
      OK
    </div>

    <div className="mb-6 flex justify-center">
      <div className="w-16 h-16 border-2 border-[var(--accent)] flex items-center justify-center">
        <Check className="w-8 h-8 text-[var(--accent)]" />
      </div>
    </div>
    
    <h2 className="text-4xl font-serif italic mb-2">Asset Processed</h2>
    <p className="text-stone-500 mb-8 font-sans">
      Return logged successfully. Digital receipt generated.<br/>
      Asset is now locked for maintenance cycle.
    </p>

    <div className="bg-[var(--background)] mx-8 p-4 mb-8 border border-[var(--border)] text-left">
      <div className="flex justify-between text-[10px] font-mono uppercase text-stone-500 mb-2">
        <span>Transaction ID</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
      <div className="font-mono text-sm truncate">
        TX-992-881-ALPHA
      </div>
    </div>

    <Button onClick={onReset} variant="outline" className="mx-auto">
      Scan Next Item
    </Button>
  </div>
);

// --- MAIN LAYOUT ---

export default function IntakeFlow() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const next = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <ThemeProvider />
      
      {/* Background Grid Texture */}
      <div className="absolute inset-0 z-[-1]" style={{ 
        backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        opacity: 0.5
      }} />

      {/* Main Card Container */}
      <div className="w-full max-w-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl p-8 md:p-16 relative">
        {/* Top Branding */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="w-4 h-4 bg-[var(--foreground)]" />
          <span className="font-mono text-xs font-bold tracking-widest">CC RENTALS</span>
        </div>

        {/* Progress */}
        <div className="absolute top-6 right-6">
          <span className="font-mono text-[10px] text-stone-400">STEP 0{step + 1} / 03</span>
        </div>

        <div className="mt-12">
           {step < 2 && <StepIndicator current={step} total={3} />}
           
           {step === 0 && <StepIdentify onNext={next} />}
           {step === 1 && <StepCondition onNext={next} data={formData} />}
           {step === 2 && <StepSuccess onReset={() => setStep(0)} />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-[10px] font-mono uppercase text-stone-400 tracking-[0.2em]">
          Restricted Access • Logistics Dept Only
        </p>
      </div>
    </div>
  );
}
