import React from 'react';
import { Verdict, DecisionInput } from '../types';
import {
  Trophy,
  Flame,
  Clock,
  Skull,
  Compass,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface VerdictAndPressureTestProps {
  verdict: Verdict;
  decisionInput: DecisionInput;
}

export const VerdictAndPressureTest: React.FC<VerdictAndPressureTestProps> = ({
  verdict,
  decisionInput,
}) => {
  return (
    <div className="space-y-6">
      {/* Grand Verdict Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-6 md:p-8 text-white shadow-2xl border border-indigo-500/30">
        <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Header & Confidence Badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/20">
                <Trophy className="h-6 w-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                  The Official Tiebreaker Verdict
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                  {verdict.recommendedOptionName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10">
              <div className="text-right">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                  Confidence
                </span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {verdict.confidencePercentage}%
                </span>
              </div>
              <div className="h-8 w-1 rounded-full bg-emerald-500/40" />
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
          </div>

          {/* Headline & Executive Rationale */}
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-bold text-emerald-200 leading-snug">
              "{verdict.headline}"
            </h3>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              {verdict.executiveRationale}
            </p>
          </div>

          {/* The Tiebreaker Factor Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 p-4 border border-amber-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold">
                <Flame className="h-4 w-4 fill-current" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  The Tiebreaker Factor (The Decisive Tipping Point)
                </span>
                <p className="mt-1 text-sm font-medium text-white leading-relaxed">
                  {verdict.theTiebreakerFactor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suzy Welch's 10/10/10 Rule */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              The 10/10/10 Temporal Stress Test
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How will you feel about selecting <span className="font-semibold text-indigo-600 dark:text-indigo-400">{verdict.recommendedOptionName}</span> across three time horizons?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 10 Minutes */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                10 Minutes In
              </span>
              <span className="text-xs text-slate-400">Immediate aftermath</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {verdict.rule101010.in10Minutes}
            </p>
          </div>

          {/* 10 Months */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-indigo-100 dark:bg-indigo-950/80 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                10 Months In
              </span>
              <span className="text-xs text-slate-400">The messy middle</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {verdict.rule101010.in10Months}
            </p>
          </div>

          {/* 10 Years */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 text-xs font-mono font-bold text-purple-700 dark:text-purple-300">
                10 Years In
              </span>
              <span className="text-xs text-slate-400">Regret minimization</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {verdict.rule101010.in10Years}
            </p>
          </div>
        </div>
      </div>

      {/* Devil's Advocate & 48-Hour Experiment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Devil's Advocate */}
        <div className="rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 p-6 border border-rose-500/20">
          <div className="flex items-center gap-3 border-b border-rose-500/20 pb-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
              <Skull className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-rose-900 dark:text-rose-200">
                Devil's Advocate Audit
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300/80">
                Pressure-testing your choice against confirmation bias
              </p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="rounded-xl bg-white/80 dark:bg-slate-900/80 p-3.5 border border-rose-500/10">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                The Blindspot
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {verdict.devilsAdvocate.blindspot}
              </p>
            </div>

            <div className="rounded-xl bg-white/80 dark:bg-slate-900/80 p-3.5 border border-rose-500/10">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">
                The Uncomfortable Truth
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {verdict.devilsAdvocate.harshTruth}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 dark:bg-emerald-950/40 p-3.5 border border-emerald-500/20">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Mitigation Playbook
              </span>
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {verdict.devilsAdvocate.howToMitigate}
              </p>
            </div>
          </div>
        </div>

        {/* 48-Hour Test Drive Experiment */}
        <div className="rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 p-6 border border-indigo-500/20">
          <div className="flex items-center gap-3 border-b border-indigo-500/20 pb-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-indigo-900 dark:text-indigo-200">
                Low-Risk Test Drive Experiment
              </h4>
              <p className="text-xs text-indigo-700 dark:text-indigo-300/80">
                Simulation before irreversible commitment
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/90 dark:bg-slate-900/90 p-4 border border-indigo-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                {verdict.testDriveExperiment.title}
              </h5>
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
                {verdict.testDriveExperiment.duration}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {verdict.testDriveExperiment.description}
            </p>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Perform this micro-test before signing contracts or breaking ties.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
