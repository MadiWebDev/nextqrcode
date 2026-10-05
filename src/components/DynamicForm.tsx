'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { QRType, QRData, QRField } from '@/types';
import { getTypeConfig, validateField } from '@/lib/qr-helpers';
import { MediaUploader } from '@/components/MediaUploader';
import { DigitalCardBuilder } from '@/components/DigitalCardBuilder';

interface DynamicFormProps {
  type: QRType;
  data: QRData;
  onChange: (data: QRData) => void;
}

export function DynamicForm({ type, data, onChange }: DynamicFormProps) {
  const config = getTypeConfig(type);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setErrors({});
    setTouched({});
  }, [type]);

  const validateFieldValue = useCallback((field: QRField, value: string) => validateField(field, value), []);

  const handleChange = useCallback(
    (field: QRField, value: string) => {
      onChange({ ...data, [field.name]: value });
      if (touched[field.name]) {
        const error = validateFieldValue(field, value);
        setErrors((prev) => ({ ...prev, [field.name]: error || '' }));
      }
    },
    [data, onChange, touched, validateFieldValue]
  );

  const handleBlur = useCallback(
    (field: QRField) => {
      setTouched((prev) => ({ ...prev, [field.name]: true }));
      const error = validateFieldValue(field, data[field.name] || '');
      setErrors((prev) => ({ ...prev, [field.name]: error || '' }));
    },
    [data, validateFieldValue]
  );

  if (!config) return null;

  const isMediaType = type === 'image' || type === 'video' || type === 'audio';
  const isCardType = type === 'business_card' || type === 'vcard';
  const usePremiumViewer = data['usePremiumViewer'] !== 'false';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={type}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <div>
            <h3 className="font-semibold text-base">{config.label}</h3>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>
        </div>

        {/* Cloudinary Media Uploader for Image, Video, Audio */}
        {isMediaType && (
          <div className="space-y-3">
            <MediaUploader
              type={type}
              currentUrl={data['url']}
              onUploadSuccess={(uploadedUrl) => {
                onChange({ ...data, url: uploadedUrl });
              }}
            />

            {/* Premium Viewer Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-border/60">
              <div className="space-y-0.5 pr-2">
                <Label
                  htmlFor="premium-viewer-toggle"
                  className="text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Premium Mobile Landing Viewer</span>
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  When scanned, visitors see a luxury custom player/lightbox with download & share options
                </p>
              </div>
              <Switch
                id="premium-viewer-toggle"
                checked={usePremiumViewer}
                onCheckedChange={(checked) => {
                  onChange({ ...data, usePremiumViewer: checked ? 'true' : 'false' });
                }}
              />
            </div>
          </div>
        )}

        {/* MongoDB Digital Business Card Builder */}
        {isCardType && (
          <DigitalCardBuilder
            data={data}
            onChange={onChange}
          />
        )}

        {/* Regular Type Fields */}
        {config.fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label htmlFor={field.name} className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                value={data[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className={`resize-none ${errors[field.name] ? 'border-destructive' : ''}`}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            ) : field.type === 'select' ? (
              <Select
                value={data[field.name] || ''}
                onValueChange={(value) => handleChange(field, value)}
              >
                <SelectTrigger
                  className={errors[field.name] ? 'border-destructive' : ''}
                  aria-invalid={!!errors[field.name]}
                >
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                value={data[field.name] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                placeholder={field.placeholder}
                className={errors[field.name] ? 'border-destructive' : ''}
                aria-invalid={!!errors[field.name]}
                aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}
              />
            )}
            <AnimatePresence>
              {errors[field.name] && (
                <motion.p
                  id={`${field.name}-error`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors[field.name]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
