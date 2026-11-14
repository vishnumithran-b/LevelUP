import React from 'react';
import { useApp, ThemeId } from '../context/AppContext.js';
import { 
  Sparkles, 
  X, 
  Check, 
  Layers, 
  Eye, 
  Sliders, 
  ShieldCheck, 
  Palette,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  baseColor: string;
  glassColor: string;
  accentColor: string;
  accentSecondary: string;
  highlightColor: string;
  mood: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: 'midnight-emerald',
    name: 'Midnight Emerald',
    tagline: 'Deep Obsidian & Malachite Glass',
    description: 'Subtle dark luxury with deep pine-emerald refractions and crisp mint highlights.',
    baseColor: '#090C0B',
    glassColor: '#111A16',
    accentColor: '#10B981',
    accentSecondary: '#34D399',
    highlightColor: 'rgba(52, 211, 153, 0.25)',
    mood: 'Prestigious & Focused',
  },
  {
    id: 'arctic-blue',
    name: 'Arctic Blue',
    tagline: 'Glacial Navy & Iceberg Cyan',
    description: 'Pristine Nordic crystalline glass with frozen ocean depths and crystalline azure refractions.',
    baseColor: '#080C14',
    glassColor: '#111B2E',
    accentColor: '#38BDF8',
    accentSecondary: '#60A5FA',
    highlightColor: 'rgba(96, 165, 250, 0.28)',
    mood: 'Crisp & Modern',
  },
  {
    id: 'champagne-obsidian',
    name: 'Champagne Obsidian',
    tagline: 'Smoked Onyx & Champagne Gold',
    description: 'Ultra-luxe horology aesthetic with velvety smoked obsidian and warm burnished amber.',
    baseColor: '#0D0B0A',
    glassColor: '#1E1815',
    accentColor: '#F59E0B',
    accentSecondary: '#FBBF24',
    highlightColor: 'rgba(251, 191, 36, 0.28)',
    mood: 'Warm Elegance & Power',
  },
  {
    id: 'lavender-graphite',
    name: 'Lavender Graphite',
    tagline: 'Amethyst Slate & Silky Lilac',
    description: 'Refined creative studio atmosphere with titanium graphite and soft lilac luminescence.',
    baseColor: '#0B0A10',
    glassColor: '#1A1726',
    accentColor: '#A78BFA',
    accentSecondary: '#C084FC',
    highlightColor: 'rgba(196, 181, 253, 0.28)',
    mood: 'Futuristic & Visionary',
  },
  {
    id: 'terracotta-sand',
    name: 'Terracotta Sand',
    tagline: 'Tuscan Charcoal & Burnt Copper',
    description: 'Sun-drenched earth tones and warm terracotta glass over deep smoked volcanic stone.',
    baseColor: '#0F0C0B',
    glassColor: '#221916',
    accentColor: '#FB923C',
    accentSecondary: '#F97316',
    highlightColor: 'rgba(251, 146, 60, 0.25)',
    mood: 'Artisanal & Grounded',
  },
  {
    id: 'pearl-sage',
    name: 'Pearl Sage',
    tagline: 'Botanical Jade & Pearl Eucalyptus',
    description: 'Serene organic clarity with frosted matcha and muted eucalyptus highlights.',
    baseColor: '#0A0D0B',
    glassColor: '#151F19',
    accentColor: '#6EE7B7',
    accentSecondary: '#A7F3D0',
    highlightColor: 'rgba(167, 243, 208, 0.27)',
    mood: 'Serene & Minimalist',
  },
];

export const ThemeStudioModal: React.FC = () => {
  const { theme, setTheme, isThemeStudioOpen, setIsThemeStudioOpen, showNotification } = useApp();

  if (!isThemeStudioOpen) return null;

  const currentThemeObj = THEMES.find((t) => t.id === theme) || THEMES[0];

  const handleSelect = (id: ThemeId) => {
    setTheme(id);
    const selected = THEMES.find((t) => t.id === id);
    showNotification({
      title: 'Theme Applied',
      message: `${selected?.name || id} is now active with responsive liquid glass refractions.`,
      type: 'success',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsThemeStudioOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 z-10 my-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle Top Specular Shine */}
          <div className="absolute top-0 left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-border/80">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-neon-green mb-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>LIQUID GLASS THEME STUDIO</span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-text-primary">
                Visual Material & Aesthetic Calibration
              </h2>
              <p className="text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
                Select from six art-directed translucent themes. Each aesthetic dynamically updates backgrounds, glass refraction curves, specular highlights, and ambient depths instantly.
              </p>
            </div>

            <button
              onClick={() => setIsThemeStudioOpen(false)}
              className="p-2 rounded-xl bg-card/60 hover:bg-card-elevated text-text-secondary hover:text-text-primary border border-border transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Material Specs Strip */}
          <div className="my-5 p-3.5 rounded-2xl liquid-glass-card flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center space-x-2.5">
              <span className="text-text-secondary">Active Material:</span>
              <span className="font-bold text-text-primary flex items-center space-x-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                  style={{ backgroundColor: currentThemeObj.accentColor }}
                />
                <span>{currentThemeObj.name}</span>
              </span>
            </div>

            <div className="flex items-center space-x-6 text-[11px] text-text-secondary">
              <div>
                Blur: <span className="text-text-primary">24px Blur</span>
              </div>
              <div>
                Translucency: <span className="text-text-primary">65% Alpha</span>
              </div>
              <div>
                Highlight: <span className="text-text-primary">1px Inset Sheen</span>
              </div>
              <div>
                Shadows: <span className="text-text-primary">Multi-Tier Diffused</span>
              </div>
            </div>
          </div>

          {/* 6 Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {THEMES.map((item) => {
              const isSelected = theme === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`text-left rounded-2xl p-4 transition-all relative overflow-hidden group flex flex-col justify-between ${
                    isSelected
                      ? 'liquid-glass-elevated border-2'
                      : 'liquid-glass-card hover:border-text-secondary/30'
                  }`}
                  style={{
                    borderColor: isSelected ? item.accentColor : undefined,
                  }}
                >
                  {/* Background Glow preview */}
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-35"
                    style={{ backgroundColor: item.accentColor }}
                  />

                  {/* Top Bar with Palette Dots & Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: item.baseColor }}
                          title="Base Canvas"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: item.glassColor }}
                          title="Translucent Glass"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: item.accentColor }}
                          title="Primary Accent"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: item.accentSecondary }}
                          title="Secondary Accent"
                        />
                      </div>

                      {isSelected ? (
                        <span
                          className="flex items-center space-x-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: `${item.accentColor}25`,
                            color: item.accentColor,
                            border: `1px solid ${item.accentColor}50`,
                          }}
                        >
                          <Check className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded-full bg-border/50">
                          {item.mood}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-sm text-text-primary flex items-center justify-between">
                      <span>{item.name}</span>
                    </h3>
                    <p className="text-[11px] font-mono text-text-secondary mt-0.5">
                      {item.tagline}
                    </p>
                    <p className="text-[11px] text-text-secondary/80 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Mini Interactive Glass Refraction Preview */}
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <div
                      className="p-2.5 rounded-xl border flex items-center justify-between relative overflow-hidden backdrop-blur-md"
                      style={{
                        backgroundColor: item.glassColor,
                        borderColor: isSelected ? `${item.accentColor}40` : 'rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div className="text-[10px] font-mono text-text-secondary">
                        Optic Specular
                      </div>
                      <div
                        className="text-[10px] font-mono font-bold px-2 py-1 rounded-lg"
                        style={{
                          backgroundColor: item.accentColor,
                          color: '#0B0B0D',
                        }}
                      >
                        Sample Pill
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-text-secondary">
              Theme preferences are stored locally and will persist automatically across sessions.
            </span>
            <button
              onClick={() => setIsThemeStudioOpen(false)}
              className="px-6 py-2.5 rounded-xl font-bold font-heading text-xs bg-card-elevated hover:bg-card border border-border text-text-primary transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

