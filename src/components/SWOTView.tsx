import React, { useState } from 'react';
import { OptionAnalysis } from '../types';
import { Shield, AlertTriangle, Zap, ShieldAlert, Sparkles, Plus, Trash2, ArrowRight } from 'lucide-react';

interface SWOTViewProps {
  options: OptionAnalysis[];
  onAddSWOTItem?: (optionId: string, quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', text: string) => void;
  onDeleteSWOTItem?: (optionId: string, quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => void;
}

export const SWOTView: React.FC<SWOTViewProps> = ({
  options,
  onAddSWOTItem,
  onDeleteSWOTItem,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [newInputs, setNewInputs] = useState<Record<string, string>>({});

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  if (!activeOption) return null;

  const handleAdd = (quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    const text = newInputs[quadrant]?.trim();
    if (!text || !onAddSWOTItem) return;

    onAddSWOTItem(activeOption.id, quadrant, text);
    setNewInputs({ ...newInputs, [quadrant]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              onClick={() => setSelectedOptionId(opt.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                selectedOptionId === opt.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {idx + 1}
              </span>
              <span>{opt.name} SWOT</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>Strategic matrix analyzing internal & external factors</span>
        </div>
      </div>

      {/* Option Header */}
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700/60">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          SWOT Framework: {activeOption.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{activeOption.tagline}</p>
      </div>

      {/* 2x2 SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STRENGTHS (Internal, Positive) */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 p-5 shadow-sm transition-all hover:border-emerald-500/40">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                  Strengths
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/80">
                  Internal capabilities & competitive advantages
                </p>
              </div>
            </div>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
              {activeOption.swot.strengths.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {activeOption.swot.strengths.map((str, idx) => (
              <li
                key={idx}
                className="group flex items-start justify-between gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 p-3 shadow-xs border border-emerald-500/10"
              >
                <div className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{str}</span>
                </div>
                {onDeleteSWOTItem && (
                  <button
                    onClick={() => onDeleteSWOTItem(activeOption.id, 'strengths', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onAddSWOTItem && (
            <div className="mt-4 flex gap-2 pt-2 border-t border-emerald-500/10">
              <input
                type="text"
                placeholder="Add another strength..."
                value={newInputs['strengths'] || ''}
                onChange={(e) => setNewInputs({ ...newInputs, strengths: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('strengths')}
                className="w-full rounded-xl border border-emerald-500/20 bg-white/80 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleAdd('strengths')}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-medium shrink-0 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* WEAKNESSES (Internal, Negative) */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20 p-5 shadow-sm transition-all hover:border-amber-500/40">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                  Weaknesses
                </h4>
                <p className="text-[11px] text-amber-700 dark:text-amber-400/80">
                  Internal limitations, deficits & bottlenecks
                </p>
              </div>
            </div>
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
              {activeOption.swot.weaknesses.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {activeOption.swot.weaknesses.map((weak, idx) => (
              <li
                key={idx}
                className="group flex items-start justify-between gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 p-3 shadow-xs border border-amber-500/10"
              >
                <div className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span>{weak}</span>
                </div>
                {onDeleteSWOTItem && (
                  <button
                    onClick={() => onDeleteSWOTItem(activeOption.id, 'weaknesses', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onAddSWOTItem && (
            <div className="mt-4 flex gap-2 pt-2 border-t border-amber-500/10">
              <input
                type="text"
                placeholder="Add another weakness..."
                value={newInputs['weaknesses'] || ''}
                onChange={(e) => setNewInputs({ ...newInputs, weaknesses: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('weaknesses')}
                className="w-full rounded-xl border border-amber-500/20 bg-white/80 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                onClick={() => handleAdd('weaknesses')}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-medium shrink-0 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* OPPORTUNITIES (External, Positive) */}
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 p-5 shadow-sm transition-all hover:border-indigo-500/40">
          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  Opportunities
                </h4>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-400/80">
                  External tailwinds, leverage & growth potentials
                </p>
              </div>
            </div>
            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-bold text-indigo-800 dark:text-indigo-300">
              {activeOption.swot.opportunities.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {activeOption.swot.opportunities.map((opp, idx) => (
              <li
                key={idx}
                className="group flex items-start justify-between gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 p-3 shadow-xs border border-indigo-500/10"
              >
                <div className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{opp}</span>
                </div>
                {onDeleteSWOTItem && (
                  <button
                    onClick={() => onDeleteSWOTItem(activeOption.id, 'opportunities', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onAddSWOTItem && (
            <div className="mt-4 flex gap-2 pt-2 border-t border-indigo-500/10">
              <input
                type="text"
                placeholder="Add another opportunity..."
                value={newInputs['opportunities'] || ''}
                onChange={(e) => setNewInputs({ ...newInputs, opportunities: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('opportunities')}
                className="w-full rounded-xl border border-indigo-500/20 bg-white/80 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleAdd('opportunities')}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-medium shrink-0 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* THREATS (External, Negative) */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-950/20 p-5 shadow-sm transition-all hover:border-rose-500/40">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-rose-900 dark:text-rose-300">
                  Threats
                </h4>
                <p className="text-[11px] text-rose-700 dark:text-rose-400/80">
                  External headwinds, risks & failure scenarios
                </p>
              </div>
            </div>
            <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-mono font-bold text-rose-800 dark:text-rose-300">
              {activeOption.swot.threats.length}
            </span>
          </div>

          <ul className="mt-4 space-y-2.5">
            {activeOption.swot.threats.map((threat, idx) => (
              <li
                key={idx}
                className="group flex items-start justify-between gap-2 rounded-xl bg-white/90 dark:bg-slate-900/90 p-3 shadow-xs border border-rose-500/10"
              >
                <div className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                  <span>{threat}</span>
                </div>
                {onDeleteSWOTItem && (
                  <button
                    onClick={() => onDeleteSWOTItem(activeOption.id, 'threats', idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-0.5 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {onAddSWOTItem && (
            <div className="mt-4 flex gap-2 pt-2 border-t border-rose-500/10">
              <input
                type="text"
                placeholder="Add another threat..."
                value={newInputs['threats'] || ''}
                onChange={(e) => setNewInputs({ ...newInputs, threats: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd('threats')}
                className="w-full rounded-xl border border-rose-500/20 bg-white/80 dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                onClick={() => handleAdd('threats')}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-medium shrink-0 transition-colors"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
