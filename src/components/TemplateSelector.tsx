'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { TemplateName } from '@/types';
import { templates, templateKeys } from '@/lib/templates';

interface TemplateSelectorProps {
  selected: TemplateName;
  onChange: (template: TemplateName) => void;
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {templateKeys.map((key) => {
        const template = templates[key];
        const isSelected = selected === key;
        return (
          <motion.button key={key} type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onChange(key)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-medium ${isSelected ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card hover:border-muted-foreground/30 text-muted-foreground'}`}
            aria-label={`Select ${template.label} template`} aria-pressed={isSelected}>
            {isSelected && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
            <div className={`w-8 h-8 rounded-lg ${template.cardBg} ${template.cardBorder} ${template.cardShadow} flex items-center justify-center`}>
              <div className={`w-4 h-4 rounded`} style={{ backgroundColor: template.qrColor }} />
            </div>
            <span>{template.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
