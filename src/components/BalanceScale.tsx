import React from 'react';
import { OptionAnalysis } from '../types';
import { Scale, Sparkles, TrendingUp } from 'lucide-react';

interface BalanceScaleProps {
  options: OptionAnalysis[];
  activeOptionId?: string;
}

export const BalanceScale: React.FC<BalanceScaleProps> = ({ options }) => {
  if (options.length < 2) return null;

  const optA = options[0];
  const optB = options[1];

  // Calculate scores
  const scoreProsA = optA.pros.reduce((acc, p) => acc + (p.weight || 5), 0);
  const scoreConsA = optA.cons.reduce((acc, c) => acc + (c.weight || 5), 0);
  const netA = scoreProsA - scoreConsA;

  const scoreProsB = optB.pros.reduce((acc, p) => acc + (p.weight || 5), 0);
  const scoreConsB = optB.cons.reduce((acc, c) => acc + (c.weight || 5), 0);
  const netB = scoreProsB - scoreConsB;

  // Difference: positive means B is heavier/better, negative means A is heavier/better
  const diff = netB - netA;
  // Maximum tilt angle clamped to [-22, 22] degrees
  const clampedAngle = Math.max(-22, Math.min(22, diff * 1.5));

  // Determine leader
  let leaderText = 'Dead Heat (Tied)';
  let leaderColor = 'text-amber-600 dark:text-amber-400';
  let advantage = 0;

  if (netA > netB) {
    advantage = netA - netB;
    leaderText = `Leaning towards ${optA.name} (+${advantage} pts)`;
    leaderColor = 'text-emerald-600 dark:text-emerald-400';
  } else if (netB > netA) {
    advantage = netB - netA;
    leaderText = `Leaning towards ${optB.name} (+${advantage} pts)`;
    leaderColor = 'text-indigo-600 dark:text-indigo-400';
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 text-white shadow-xl border border-slate-700/50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -z-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 -z-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-white">Dynamic Balance Scale</h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-400/10 px-2 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-400/20">
                <Sparkles className="h-3 w-3" /> Live Physics
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive weight of pros minus cons. Adjust item weights below to see the beam tip!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700">
          <TrendingUp className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-400">Scale Verdict:</span>
          <span className={`text-xs font-semibold ${leaderColor}`}>{leaderText}</span>
        </div>
      </div>

      {/* SVG Physics Balance Scale */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-6 pb-2">
        <svg
          viewBox="0 0 500 240"
          className="w-full max-w-lg overflow-visible transition-all duration-700 ease-out"
        >
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="glowA" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
            </filter>
            <filter id="glowB" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#6366f1" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Central Pillar & Base */}
          <path
            d="M 235 230 L 265 230 L 254 90 L 246 90 Z"
            fill="url(#baseGrad)"
            stroke="#64748b"
            strokeWidth="1.5"
          />
          {/* Base Platform */}
          <rect x="200" y="224" width="100" height="12" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
          {/* Fulcrum Bearing */}
          <circle cx="250" cy="85" r="10" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
          <circle cx="250" cy="85" r="4" fill="#0f172a" />

          {/* Pointer needle showing tilt on dial */}
          <g transform={`rotate(${clampedAngle}, 250, 85)`} style={{ transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <line x1="250" y1="85" x2="250" y2="40" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="250" cy="40" r="3.5" fill="#f43f5e" />
          </g>
          {/* Dial Arc */}
          <path d="M 220 50 Q 250 42 280 50" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="2,3" />

          {/* Tilting Assembly: Beam + Suspended Pans */}
          <g
            transform={`rotate(${clampedAngle}, 250, 85)`}
            style={{ transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {/* The Main Beam */}
            <rect x="50" y="81" width="400" height="8" rx="4" fill="url(#beamGrad)" stroke="#334155" strokeWidth="1" />
            <circle cx="70" cy="85" r="5" fill="#10b981" />
            <circle cx="430" cy="85" r="5" fill="#6366f1" />

            {/* Left Suspension Strings (Option A) */}
            <line x1="70" y1="85" x2="40" y2="155" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />
            <line x1="70" y1="85" x2="100" y2="155" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />

            {/* Left Pan (Option A) */}
            <g transform="translate(0, 0)">
              <ellipse cx="70" cy="155" rx="36" ry="8" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" filter="url(#glowA)" />
              <path d="M 34 155 Q 70 170 106 155" fill="#10b981" fillOpacity="0.25" />
            </g>

            {/* Right Suspension Strings (Option B) */}
            <line x1="430" y1="85" x2="400" y2="155" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />
            <line x1="430" y1="85" x2="460" y2="155" stroke="#94a3b8" strokeWidth="1.5" opacity="0.8" />

            {/* Right Pan (Option B) */}
            <g transform="translate(0, 0)">
              <ellipse cx="430" cy="155" rx="36" ry="8" fill="#0f172a" stroke="#6366f1" strokeWidth="2.5" filter="url(#glowB)" />
              <path d="M 394 155 Q 430 170 466 155" fill="#6366f1" fillOpacity="0.25" />
            </g>
          </g>
        </svg>

        {/* Score comparison cards underneath each side */}
        <div className="grid w-full grid-cols-2 gap-4 mt-2">
          {/* Side A */}
          <div className={`rounded-xl p-3.5 border transition-all ${
            netA >= netB
              ? 'bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/30'
              : 'bg-slate-800/60 border-slate-700/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Option A</span>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
                Net: {netA > 0 ? `+${netA}` : netA}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-white truncate" title={optA.name}>
              {optA.name}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">+{scoreProsA} pros</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-medium">-{scoreConsA} cons</span>
            </div>
          </div>

          {/* Side B */}
          <div className={`rounded-xl p-3.5 border transition-all ${
            netB >= netA
              ? 'bg-indigo-950/40 border-indigo-500/40 ring-1 ring-indigo-500/30'
              : 'bg-slate-800/60 border-slate-700/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Option B</span>
              <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                Net: {netB > 0 ? `+${netB}` : netB}
              </span>
            </div>
            <p className="mt-1 text-sm font-medium text-white truncate" title={optB.name}>
              {optB.name}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">+{scoreProsB} pros</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-medium">-{scoreConsB} cons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
