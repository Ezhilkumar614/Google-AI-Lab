import React, { useState } from 'react';
import { TEMPLATES, DilemmaTemplate } from '../data/templates';
import { DecisionOption } from '../types';
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Flame,
  HelpCircle,
} from 'lucide-react';

interface DecisionFormProps {
  onSubmit: (formData: {
    title: string;
    category: string;
    context: string;
    urgency: 'low' | 'medium' | 'high';
    reversible: 'type1_irreversible' | 'type2_reversible';
    options: DecisionOption[];
  }) => void;
  isLoading: boolean;
  onLoadTemplate: (template: DilemmaTemplate) => void;
}

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  onLoadTemplate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career');
  const [context, setContext] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [reversible, setReversible] = useState<'type1_irreversible' | 'type2_reversible'>('type2_reversible');
  const [options, setOptions] = useState<DecisionOption[]>([
    { id: 'opt_1', name: '', description: '' },
    { id: 'opt_2', name: '', description: '' },
  ]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 4) return;
    setOptions([
      ...options,
      {
        id: `opt_${Date.now()}`,
        name: '',
        description: '',
      },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter out options with names
    const validOptions = options.filter((o) => o.name.trim().length > 0);
    if (validOptions.length < 2) {
      alert('Please enter names for at least 2 options.');
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      context: context.trim(),
      urgency,
      reversible,
      options: validOptions,
    });
  };

  const [loadingStep, setLoadingStep] = useState(0);

  React.useEffect(() => {
    if (!isLoading) {
      setLoadingStep(0);
      return;
    }
    const timer1 = setTimeout(() => setLoadingStep(1), 1800);
    const timer2 = setTimeout(() => setLoadingStep(2), 4000);
    const timer3 = setTimeout(() => setLoadingStep(3), 6500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoading]);

  const loadingSteps = [
    'Mapping decision landscape & conflicting incentives...',
    'Scoring weighted pros & cons across impact dimensions...',
    'Formulating SWOT quadrants & cross-option comparison matrix...',
    'Arbitrating the decisive tiebreaker factor & 10/10/10 test...',
  ];

  const handleSelectTemplate = (tmpl: DilemmaTemplate, instant: boolean) => {
    setTitle(tmpl.title);
    setCategory(tmpl.category);
    setContext(tmpl.context);
    setUrgency(tmpl.urgency);
    setReversible(tmpl.reversible);
    setOptions(tmpl.options.map((o) => ({ id: o.id, name: o.name, description: o.description })));
    if (instant && tmpl.prebuiltAnalysis) {
      onLoadTemplate(tmpl);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-3xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-md p-6 text-center animate-in fade-in duration-300">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner">
            <BrainCircuit className="h-10 w-10 animate-pulse" />
            <div className="absolute inset-0 rounded-3xl border-2 border-indigo-500/40 animate-ping opacity-25" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            The Tiebreaker is Arbitrating...
          </h3>

          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            <span>{loadingSteps[loadingStep]}</span>
          </div>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Evaluating asymmetrical trade-offs, calculating regret probabilities, and establishing your optimal path forward.
          </p>
        </div>
      )}

      {/* Templates / Inspiration Carousel */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Pre-built Dilemma Templates (Instant Breakdown):
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    {tmpl.badge}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Ready
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                  {tmpl.title}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl, true)}
                  className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <span>Instant View</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl, false)}
                  className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Load into form to edit inputs"
                >
                  Customize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
      >
        {/* Title & Dilemma */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            What decision are you wrestling with? <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Join early-stage AI startup as VP vs stay at stable FAANG company"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-4 py-3 text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Options Builder */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Contending Options (Between 2 and 4)
            </label>
            {options.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" /> Add Option
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((opt, index) => (
              <div
                key={opt.id}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2.5 transition-all focus-within:border-indigo-500"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600/10 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={`Option ${String.fromCharCode(65 + index)} (e.g. ${
                      index === 0 ? 'Accept the startup offer' : 'Stay at current corporate job'
                    })`}
                    value={opt.name}
                    onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Short description / details (optional)"
                    value={opt.description || ''}
                    onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced & Personal Context Accordion */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-indigo-500" /> Personal Context, Urgency &
              Decision Type (Improves AI precision)
            </span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvanced && (
            <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              {/* Context text */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Your Personal Context, Core Values & Financial/Family Constraints
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Married with 2 kids (ages 2 and 4). We have 6 months emergency savings. I care about rapid learning and long-term wealth, but cannot afford 70-hour weeks for more than 1 year..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Dilemma Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Career">Career & Work</option>
                    <option value="Financial">Financial & Investments</option>
                    <option value="Lifestyle">Housing & Lifestyle</option>
                    <option value="Business">Entrepreneurship & Strategy</option>
                    <option value="Tech">Tech, Gear & Architecture</option>
                    <option value="Education">Education & Learning</option>
                    <option value="Personal">Personal & Relationships</option>
                  </select>
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Timeline Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="high">High (Decide in 24-72 hours)</option>
                    <option value="medium">Medium (Decide within weeks)</option>
                    <option value="low">Low (Long-range deliberation)</option>
                  </select>
                </div>

                {/* Reversibility */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                    Door Reversibility
                    <span
                      title="Type 1 = One-way door (hard to undo). Type 2 = Two-way door (easy to walk back)."
                      className="cursor-help text-slate-400"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </span>
                  </label>
                  <select
                    value={reversible}
                    onChange={(e) =>
                      setReversible(e.target.value as 'type1_irreversible' | 'type2_reversible')
                    }
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="type2_reversible">Type 2: Reversible (Two-way door)</option>
                    <option value="type1_irreversible">Type 1: Irreversible (One-way door)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-slate-400 text-center sm:text-left">
            Generates Weighted Pros/Cons, Comparison Matrix, SWOT Grid & Decisive Verdict
          </span>

          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold px-8 py-4 text-sm shadow-xl shadow-indigo-600/25 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <BrainCircuit className="h-5 w-5 animate-spin" />
                <span>Arbitrating Dilemma...</span>
              </>
            ) : (
              <>
                <Flame className="h-5 w-5 fill-current text-amber-300" />
                <span>Break The Tie</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
