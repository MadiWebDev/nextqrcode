'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STEPS = [
  { title: 'Choose a QR Type', description: 'Pick from 40+ QR code types organised by category — URL, WiFi, vCard, Bitcoin, UPI, and more. Use the search to find any type instantly.', icon: '🎯' },
  { title: 'Fill in Your Content', description: 'Each type has a smart form with smart validation. Required fields are marked with an asterisk and everything is checked as you type.', icon: '✏️' },
  { title: 'Customize & Download', description: 'Change colors, pick dot styles, add a logo, set a frame with a call-to-action, then download PNG, SVG, or PDF in one click — no sign-up needed.', icon: '🎨' },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction * -60, opacity: 0 }),
};

export function OnboardingTour() {
  const [onboarded, setOnboarded] = useLocalStorage<boolean>('qr-onboarded', false);
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [dontShow, setDontShow] = useState(false);
  const [direction, setDirection] = useState(1);

  // Don't show if already onboarded (handled via useLocalStorage hydration)
  if (onboarded) return null;

  const handleClose = () => {
    if (dontShow) setOnboarded(true);
    setOpen(false);
  };
  const goNext = () => {
    if (step < STEPS.length - 1) { setDirection(1); setStep(s => s + 1); }
    else { setOnboarded(true); setOpen(false); }
  };
  const goPrev = () => { if (step > 0) { setDirection(-1); setStep(s => s - 1); } };
  const currentStep = STEPS[step];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="onboarding-desc">
        <DialogTitle className="sr-only">Welcome to QR Studio</DialogTitle>
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }} className="text-center py-4 px-2">
              <div className="text-5xl mb-4 select-none" aria-hidden="true">{currentStep?.icon}</div>
              <h2 className="text-xl font-bold mb-2">{currentStep?.title}</h2>
              <p id="onboarding-desc" className="text-sm text-muted-foreground leading-relaxed">{currentStep?.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 my-2" role="tablist" aria-label="Onboarding steps">
          {STEPS.map((_, i) => (
            <button key={i} role="tab" aria-selected={i === step} aria-label={`Step ${i + 1}`} onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-4' : 'bg-muted-foreground/30'}`} />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Checkbox id="dont-show" checked={dontShow} onCheckedChange={checked => { if (typeof checked === 'boolean') setDontShow(checked); }} />
          <label htmlFor="dont-show" className="text-xs text-muted-foreground cursor-pointer select-none">Don&apos;t show this again</label>
        </div>
        <div className="flex gap-2 mt-4">
          {step > 0 && <Button variant="outline" onClick={goPrev} className="flex-1">Back</Button>}
          <Button onClick={goNext} className="flex-1">{step < STEPS.length - 1 ? 'Next' : 'Get Started'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
