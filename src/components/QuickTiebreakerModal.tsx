import React, { useState } from 'react';
import { Zap, X, Sparkles, Loader2, Trophy, HelpCircle } from 'lucide-react';

interface QuickTiebreakerModalProps {
  onClose: () => void;
}

export const QuickTiebreakerModal: React.FC<QuickTiebreakerModalProps> = ({ onClose }) => {
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [mood, setMood] = useState('energetic');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    winner: string;
    punchline: string;
    rationale: string;
    gutCheck: string;
  } | null>(null);

  const handleBreak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!optionA.trim() || !optionB.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/quick-tiebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionA: optionA.trim(), optionB: optionB.trim(), mood }),
      });
      if (!res.ok) throw new Error('Failed to resolve quick tiebreaker');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        winner: Math.random() > 0.5 ? optionA : optionB,
        punchline: 'Indecision is the thief of momentum. Go with this and don’t look back!',
        rationale: 'Momentum and decisiveness produce far higher compound returns than endless deliberation.',
        gutCheck: 'If your heart sank when reading this winner, immediately pick the other!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Instant 30s Tiebreaker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For everyday dilemmas that don't need a full corporate dossier
            </p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={handleBreak} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Option A
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Go for a 3-mile run"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-center font-bold text-xs uppercase tracking-widest text-slate-400">
              — VS —
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Option B
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Take a 20-min power nap"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Current Mood / Priority
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="energetic">High Energy & Discipline</option>
                <option value="relaxing">Chill, Low Stress & Recovery</option>
                <option value="bold">Bold & Spontaneous</option>
                <option value="practical">Practical & Frugal</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !optionA.trim() || !optionB.trim()}
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-bold py-3 text-sm shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deciding immediately...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-current" />
                  <span>Break This Tie</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 p-5 text-white border border-emerald-500/30">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <Trophy className="h-3.5 w-3.5" /> Instant Pick
              </span>
              <h4 className="mt-1 text-xl font-black text-white">{result.winner}</h4>
              <p className="mt-2 text-xs text-emerald-200 italic font-medium leading-relaxed">
                "{result.punchline}"
              </p>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{result.rationale}</p>
            </div>

            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3.5 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Gut Check:</strong> {result.gutCheck}
              </span>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Another Quick Tiebreaker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
