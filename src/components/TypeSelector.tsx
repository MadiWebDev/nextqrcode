"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Search,
  ChevronDown,
  Globe,
  Check,
  X,
  History,
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
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QRType } from "@/types";
import { qrTypeConfigs, QR_CATEGORIES } from "@/lib/qr-helpers";
import { useLocalStorage } from "@/hooks/useLocalStorage";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const ICONS: Record<string, LucideIcon> = {
  Type,
  Globe,
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
};

const CATEGORY_LABELS: Record<string, string> = {
  popular: "Popular",
  social: "Social",
  payments: "Payments",
  business: "Business",
  utilities: "Utilities",
};

const GRID_COLUMNS_SM = 2;
const GRID_COLUMNS_MD = 3;
const MAX_RECENT = 5;

type TypeConfig = (typeof qrTypeConfigs)[number];

function TypeIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && ICONS[name]) || Globe;
  return <Icon className={className ?? "h-5 w-5"} aria-hidden="true" />;
}

/* -------------------------------------------------------------------------- */
/*  TypeCard — defined at module level so it is not remounted on every render */
/* -------------------------------------------------------------------------- */

interface TypeCardProps {
  config: TypeConfig;
  isSelected: boolean;
  isTabStop: boolean;
  onSelect: (type: QRType) => void;
}

function TypeCard({ config, isSelected, isTabStop, onSelect }: TypeCardProps) {
  return (
    <button
      type="button"
      data-type-btn
      aria-pressed={isSelected}
      tabIndex={isTabStop ? 0 : -1}
      title={config.description}
      onClick={() => onSelect(config.type)}
      className={[
        "group relative flex min-h-[68px] sm:min-h-[76px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border p-2 sm:p-2.5 text-center",
        "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "border-primary/40 bg-primary/10"
          : "border-border/60 hover:border-primary/30 hover:bg-muted/60",
      ].join(" ")}
    >
      {isSelected && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
        </span>
      )}
      <span
        className={[
          "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
          isSelected
            ? "bg-primary/20 text-primary"
            : "bg-muted text-muted-foreground group-hover:text-foreground",
        ].join(" ")}
      >
        <TypeIcon name={config.icon} />
      </span>
      <span className="line-clamp-2 text-xs font-medium leading-tight">
        {config.label}
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  TypeGrid — roving tabindex + arrow-key navigation (one ref per grid)       */
/* -------------------------------------------------------------------------- */

interface TypeGridProps {
  types: QRType[];
  selected: QRType;
  onSelect: (type: QRType) => void;
  label: string;
}

function TypeGrid({ types, selected, onSelect, label }: TypeGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const configs = useMemo(
    () =>
      types
        .map((t) => qrTypeConfigs.find((c) => c.type === t))
        .filter((c): c is TypeConfig => Boolean(c)),
    [types],
  );

  // The selected card (or the first one) is the single Tab stop of the grid.
  const selectedIndex = configs.findIndex((c) => c.type === selected);
  const tabStop = focusIndex ?? (selectedIndex >= 0 ? selectedIndex : 0);

  const moveFocus = useCallback((next: number) => {
    const buttons =
      gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-type-btn]");
    if (!buttons || next < 0 || next >= buttons.length) return;
    setFocusIndex(next);
    buttons[next].focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      gridRef.current?.querySelectorAll<HTMLButtonElement>("[data-type-btn]") ??
        [],
    );
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;

    // Detect the actual column count from the rendered grid
    const cols =
      gridRef.current
        ? Math.round(gridRef.current.offsetWidth /
            (gridRef.current.querySelector<HTMLButtonElement>("[data-type-btn]")?.offsetWidth ?? 1))
        : GRID_COLUMNS_MD;
    const safeCol = Math.max(GRID_COLUMNS_SM, Math.min(GRID_COLUMNS_MD, cols));
    const keyMap: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowLeft: current - 1,
      ArrowDown: current + safeCol,
      ArrowUp: current - safeCol,
      Home: 0,
      End: buttons.length - 1,
    };
    if (e.key in keyMap) {
      e.preventDefault();
      moveFocus(keyMap[e.key]);
    }
  };

  return (
    <div
      ref={gridRef}
      role="group"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="grid grid-cols-2 min-[480px]:grid-cols-3 gap-2"
    >
      {configs.map((cfg, i) => (
        <TypeCard
          key={cfg.type}
          config={cfg}
          isSelected={cfg.type === selected}
          isTabStop={i === tabStop}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  TypeSelector                                                              */
/* -------------------------------------------------------------------------- */

interface TypeSelectorProps {
  selected: QRType;
  onChange: (type: QRType) => void;
}

export function TypeSelector({ selected, onChange }: TypeSelectorProps) {
  const [search, setSearch] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("popular");
  const [recentTypes, setRecentTypes] = useLocalStorage<QRType[]>(
    "qr-recent-types",
    [],
  );
  const prefersReducedMotion = useReducedMotion();

  const selectedConfig = useMemo(
    () => qrTypeConfigs.find((c) => c.type === selected),
    [selected],
  );

  // Search across label, description and category name.
  const filteredTypes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const categoryOf = new Map<QRType, string>();
    Object.entries(QR_CATEGORIES).forEach(([cat, types]) =>
      types.forEach((t) => categoryOf.set(t, cat)),
    );
    return qrTypeConfigs.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (CATEGORY_LABELS[categoryOf.get(c.type) ?? ""] ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [search]);

  const recentConfigs = useMemo(
    () =>
      recentTypes
        .map((t) => qrTypeConfigs.find((c) => c.type === t))
        .filter((c): c is TypeConfig => Boolean(c)),
    [recentTypes],
  );

  const handleSelect = useCallback(
    (type: QRType) => {
      onChange(type);
      setRecentTypes((prev) =>
        [type, ...prev.filter((t) => t !== type)].slice(0, MAX_RECENT),
      );
    },
    [onChange, setRecentTypes],
  );

  const isSearching = search.trim().length > 0;

  return (
    <section className="space-y-2" aria-label="QR code type">
      {/* Summary / toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        aria-expanded={isExpanded}
        aria-controls="type-selector-panel"
        className="flex w-full items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <TypeIcon name={selectedConfig?.icon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs text-muted-foreground">QR code type</span>
          <span className="block truncate text-sm font-semibold">
            {selectedConfig?.label ?? "Choose a type"}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id="type-selector-panel"
            key="panel"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-3 p-1">
              {/* Search */}
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Search QR types"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearch("");
                  }}
                  className="h-9 pl-9 pr-9"
                  aria-label="Search QR types"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              {isSearching ? (
                <div className="space-y-2">
                  <p className="px-1 text-xs text-muted-foreground" role="status" aria-live="polite">
                    {filteredTypes.length === 0
                      ? "No matches"
                      : `${filteredTypes.length} ${filteredTypes.length === 1 ? "type" : "types"} found`}
                  </p>
                  {filteredTypes.length > 0 ? (
                    <TypeGrid
                      types={filteredTypes.map((c) => c.type)}
                      selected={selected}
                      onSelect={handleSelect}
                      label="Search results"
                    />
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center">
                      <p className="text-sm font-medium">
                        Nothing matches “{search.trim()}”
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try a shorter word, like “wifi” or “pay”.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-3 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Show all types
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {recentConfigs.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <History className="h-3.5 w-3.5" aria-hidden="true" />
                          Recently used
                        </p>
                        <button
                          type="button"
                          onClick={() => setRecentTypes([])}
                          className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentConfigs.map((cfg) => {
                          const isSelected = selected === cfg.type;
                          return (
                            <button
                              key={cfg.type}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => handleSelect(cfg.type)}
                              className={[
                                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                isSelected
                                  ? "border-primary/40 bg-primary/10 text-primary"
                                  : "border-border/60 hover:border-primary/30 hover:bg-muted/60",
                              ].join(" ")}
                            >
                              <TypeIcon name={cfg.icon} className="h-3.5 w-3.5" />
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 sm:grid-cols-5 h-auto w-full overflow-x-auto flex-nowrap gap-1 rounded-lg bg-muted/60 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {Object.entries(QR_CATEGORIES).map(([cat, types]) => (
                        <TabsTrigger
                          key={cat}
                          value={cat}
                          className="shrink-0 gap-1 px-2.5 py-1 text-xs"
                        >
                          {CATEGORY_LABELS[cat] ?? cat}
                          <span className="text-[10px] text-muted-foreground">
                            {types.length}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(QR_CATEGORIES).map(([cat, types]) => (
                      <TabsContent key={cat} value={cat} className="mt-3">
                        <TypeGrid
                          types={types}
                          selected={selected}
                          onSelect={handleSelect}
                          label={`${CATEGORY_LABELS[cat] ?? cat} QR types`}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}