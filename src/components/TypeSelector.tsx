"use client";
import { useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp, Globe } from "lucide-react";
import {
  Type,
  FileText,
  Music,
  MessageCircle,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Wifi,
  User,
  Share2,
  Video,
  Image,
  UtensilsCrossed,
  Smartphone,
  TicketPercent,
  Calendar,
  Briefcase,
  Code,
  ShoppingCart,
  Sparkles,
  Truck,
  Landmark,
  FileBadge,
  ContactRound,
  Navigation,
  Send,
  Monitor,
  Users,
  Music2,
  CreditCard,
  IndianRupee,
  Bitcoin,
  Coins,
  Building2,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QRType } from "@/types";
import { qrTypeConfigs, QR_CATEGORIES } from "@/lib/qr-helpers";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const iconMap: Record<string, React.ReactNode> = {
  Type: <Type className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Wifi: <Wifi className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  TicketPercent: <TicketPercent className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  ShoppingCart: <ShoppingCart className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  FileBadge: <FileBadge className="w-5 h-5" />,
  ContactRound: <ContactRound className="w-5 h-5" />,
  Navigation: <Navigation className="w-5 h-5" />,
  Send: <Send className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  // Youtube: <Youtube className="w-5 h-5" />,
  // Linkedin: <Linkedin className="w-5 h-5" />,
  Music2: <Music2 className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  IndianRupee: <IndianRupee className="w-5 h-5" />,
  Bitcoin: <Bitcoin className="w-5 h-5" />,
  Coins: <Coins className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  popular: "Popular",
  social: "Social",
  payments: "Payments",
  business: "Business",
  utilities: "Utilities",
};

interface TypeSelectorProps {
  selected: QRType;
  onChange: (type: QRType) => void;
}

export function TypeSelector({ selected, onChange }: TypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [recentTypes, setRecentTypes] = useLocalStorage<QRType[]>(
    "qr-recent-types",
    [],
  );
  const gridRef = useRef<HTMLDivElement>(null);

  const selectedConfig = useMemo(
    () => qrTypeConfigs.find((c) => c.type === selected),
    [selected],
  );
  const filteredTypes = useMemo(() => {
    if (!search.trim()) return qrTypeConfigs;
    const q = search.toLowerCase();
    return qrTypeConfigs.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [search]);
  const recentConfigs = useMemo(
    () =>
      recentTypes
        .map((t) => qrTypeConfigs.find((c) => c.type === t))
        .filter(Boolean),
    [recentTypes],
  );

  const handleSelect = (type: QRType) => {
    onChange(type);
    setRecentTypes((prev) =>
      [type, ...prev.filter((t) => t !== type)].slice(0, 5),
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    type: QRType,
    allTypes: QRType[],
    cols: number,
  ) => {
    const idx = allTypes.indexOf(type);
    let nextIdx = -1;
    if (e.key === "ArrowRight") nextIdx = idx + 1;
    else if (e.key === "ArrowLeft") nextIdx = idx - 1;
    else if (e.key === "ArrowDown") nextIdx = idx + cols;
    else if (e.key === "ArrowUp") nextIdx = idx - cols;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(type);
      return;
    }
    if (nextIdx >= 0 && nextIdx < allTypes.length) {
      e.preventDefault();
      const btn =
        gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-type-btn]")[
          nextIdx
        ];
      btn?.focus();
    }
  };

  const TypeCard = ({
    type,
    allTypes,
    cols = 3,
  }: {
    type: QRType;
    allTypes: QRType[];
    cols?: number;
  }) => {
    const cfg = qrTypeConfigs.find((c) => c.type === type);
    if (!cfg) return null;
    const isSelected = selected === type;
    return (
      <button
        data-type-btn
        type="button"
        role="button"
        aria-pressed={isSelected}
        onClick={() => handleSelect(type)}
        onKeyDown={(e) => handleKeyDown(e, type, allTypes, cols)}
        className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-center cursor-pointer min-h-[72px] ${isSelected ? "ring-2 ring-primary bg-primary/10 border-primary/30" : "border-border/60 hover:border-primary/30 hover:bg-muted/60"}`}
      >
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
        >
          {iconMap[cfg.icon] ?? <Globe className="w-5 h-5" />}
        </div>
        <span className="text-xs font-medium leading-tight line-clamp-2">
          {cfg.label}
        </span>
      </button>
    );
  };

  const TabGrid = ({ types }: { types: QRType[] }) => (
    <div
      ref={gridRef}
      className="grid grid-cols-3 gap-2"
      role="group"
      aria-label="QR type selection"
    >
      {types.map((t) => (
        <TypeCard key={t} type={t} allTypes={types} />
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/60 hover:bg-muted/40 transition-colors"
        aria-expanded={isExpanded}
        aria-controls="type-selector-panel"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {selectedConfig ? (
            (iconMap[selectedConfig.icon] ?? <Globe className="w-5 h-5" />)
          ) : (
            <Globe className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="text-sm font-medium truncate">
            {selectedConfig?.label ?? "Select type"}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {selectedConfig?.description}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="type-selector-panel"
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pt-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search types..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                  aria-label="Search QR types"
                />
              </div>
              {search.trim() ? (
                <div>
                  {filteredTypes.length > 0 ? (
                    <TabGrid types={filteredTypes.map((c) => c.type)} />
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No types found
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {recentConfigs.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">
                        Recently Used
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentConfigs.map((cfg) => {
                          if (!cfg) return null;
                          const isSelected = selected === cfg.type;
                          return (
                            <button
                              key={cfg.type}
                              type="button"
                              onClick={() => handleSelect(cfg.type)}
                              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${isSelected ? "ring-2 ring-primary bg-primary/10 border-primary/30 text-primary" : "border-border/60 hover:border-primary/30 hover:bg-muted/60"}`}
                            >
                              <span className="shrink-0">
                                {iconMap[cfg.icon] ?? (
                                  <Globe className="w-4 h-4" />
                                )}
                              </span>
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <Tabs defaultValue="popular">
                    <TabsList className="flex w-full h-auto flex-wrap gap-1 bg-muted/60 p-1 rounded-lg">
                      {Object.keys(QR_CATEGORIES).map((cat) => (
                        <TabsTrigger
                          key={cat}
                          value={cat}
                          className="text-xs px-2.5 py-1 flex-1 min-w-0"
                        >
                          {CATEGORY_LABELS[cat] ?? cat}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(QR_CATEGORIES).map(([cat, types]) => (
                      <TabsContent key={cat} value={cat} className="mt-3">
                        <TabGrid types={types} />
                      </TabsContent>
                    ))}
                  </Tabs>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
