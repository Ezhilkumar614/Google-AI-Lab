import React from 'react';
import { Scale, Zap, RotateCcw, Clock, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onOpenQuickModal: () => void;
  onOpenCoinModal: () => void;
  onOpenHistory: () => void;
  onNewDecision: () => void;
  savedCount: number;
  hasActiveAnalysis: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickModal,
  onOpenCoinModal,
  onOpenHistory,
  onNewDecision,
  savedCount,
  hasActiveAnalysis,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Scale className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                The Tiebreaker
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                AI Arbiter
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Weigh trade-offs, illuminate blindspots & break deadlocks
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasActiveAnalysis && (
            <button
              onClick={onNewDecision}
              className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <PlusCircle className="h-4 w-4 text-indigo-500" />
              <span className="hidden md:inline">New Dilemma</span>
            </button>
          )}

          <button
            onClick={onOpenQuickModal}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 transition-all cursor-pointer"
            title="Rapid everyday decision"
          >
            <Zap className="h-3.5 w-3.5 fill-current text-amber-500" />
            <span className="hidden sm:inline">30s Quick Break</span>
          </button>

          <button
            onClick={onOpenCoinModal}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer"
            title="Sigmund Freud coin toss trick"
          >
            <RotateCcw className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Coin Toss</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            title="Saved decisions"
          >
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Archive</span>
            {savedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
