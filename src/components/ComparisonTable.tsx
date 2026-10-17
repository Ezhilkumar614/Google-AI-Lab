import React, { useState } from 'react';
import { ComparisonCriterion, OptionAnalysis } from '../types';
import { Award, CheckCircle2, Filter, Layers, Star, Trophy, Plus } from 'lucide-react';

interface ComparisonTableProps {
  options: OptionAnalysis[];
  criteria: ComparisonCriterion[];
  onAddCriterion?: (criterion: ComparisonCriterion) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  options,
  criteria,
  onAddCriterion,
}) => {
  const [filterImportance, setFilterImportance] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New criterion state
  const [newCritName, setNewCritName] = useState('');
  const [newCritCategory, setNewCritCategory] = useState('Personal');
  const [newCritImportance, setNewCritImportance] = useState<'Critical' | 'High' | 'Medium'>('High');
  const [newCritRatings, setNewCritRatings] = useState<Record<string, { rating: number; rationale: string }>>({});

  const filteredCriteria = criteria.filter((c) => {
    if (filterImportance === 'all') return true;
    return c.importance.toLowerCase() === filterImportance.toLowerCase();
  });

  // Calculate total wins per option
  const winsCount: Record<string, number> = {};
  options.forEach((opt) => {
    winsCount[opt.id] = 0;
  });
  criteria.forEach((c) => {
    if (c.winnerOptionId && winsCount[c.winnerOptionId] !== undefined) {
      winsCount[c.winnerOptionId]++;
    }
  });

  const handleOpenAddModal = () => {
    const initialRatings: Record<string, { rating: number; rationale: string }> = {};
    options.forEach((opt) => {
      initialRatings[opt.id] = { rating: 7, rationale: '' };
    });
    setNewCritRatings(initialRatings);
    setNewCritName('');
    setShowAddModal(true);
  };

  const handleSaveCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim() || !onAddCriterion) return;

    // determine winner
    let maxRating = -1;
    let winnerId = options[0]?.id;
    options.forEach((opt) => {
      const r = newCritRatings[opt.id]?.rating ?? 0;
      if (r > maxRating) {
        maxRating = r;
        winnerId = opt.id;
      }
    });

    onAddCriterion({
      name: newCritName.trim(),
      category: newCritCategory,
      importance: newCritImportance,
      scores: newCritRatings,
      winnerOptionId: winnerId,
    });

    setShowAddModal(false);
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'Critical':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'High':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" /> Matrix Comparison
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Side-by-side evaluation across key strategic criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Importance Filter */}
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <Filter className="h-3.5 w-3.5 ml-2 text-slate-400" />
            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">All Importance</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
            </select>
          </div>

          {onAddCriterion && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Add Criterion
            </button>
          )}
        </div>
      </div>

      {/* Win Tally Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((opt, idx) => {
          const wins = winsCount[opt.id] || 0;
          const isOverallLeader = wins === Math.max(...Object.values(winsCount));
          return (
            <div
              key={opt.id}
              className={`rounded-xl p-3 border transition-all ${
                isOverallLeader
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Option {idx + 1}
                </span>
                {isOverallLeader && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Trophy className="h-3.5 w-3.5" /> Most Wins
                  </span>
                )}
              </div>
              <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-white truncate">
                {opt.name}
              </h4>
              <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Wins {wins} of {criteria.length} criteria
              </p>
            </div>
          );
        })}
      </div>

      {/* Responsive Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60">
              <th className="p-4 font-semibold text-slate-900 dark:text-white w-1/3 min-w-[200px]">
                Decision Criterion
              </th>
              {options.map((opt, idx) => (
                <th
                  key={opt.id}
                  className="p-4 font-semibold text-slate-900 dark:text-white min-w-[220px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {idx + 1}
                    </span>
                    <span>{opt.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredCriteria.map((criterion, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Criterion Details */}
                <td className="p-4 align-top">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {criterion.name}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${getImportanceBadge(
                          criterion.importance
                        )}`}
                      >
                        {criterion.importance}
                      </span>
                    </div>
                    <span className="inline-block text-xs text-slate-500 dark:text-slate-400">
                      Category: {criterion.category}
                    </span>
                  </div>
                </td>

                {/* Scores for Each Option */}
                {options.map((opt) => {
                  const scoreObj = criterion.scores?.[opt.id] || { rating: 5, rationale: 'Standard' };
                  const isWinner = criterion.winnerOptionId === opt.id;
                  const rating = scoreObj.rating ?? 5;

                  return (
                    <td
                      key={opt.id}
                      className={`p-4 align-top transition-colors ${
                        isWinner
                          ? 'bg-emerald-500/5 dark:bg-emerald-500/10'
                          : ''
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Rating header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                              {rating}
                            </span>
                            <span className="text-xs text-slate-400">/10</span>
                          </div>

                          {isWinner && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> Winner
                            </span>
                          )}
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isWinner
                                ? 'bg-emerald-500'
                                : rating >= 7
                                ? 'bg-indigo-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${rating * 10}%` }}
                          />
                        </div>

                        {/* Rationale */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {scoreObj.rationale}
                        </p>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-500" /> Add Custom Criterion
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Measure the options against a factor that specifically matters to you.
            </p>

            <form onSubmit={handleSaveCriterion} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Criterion Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commute Time & Transit Stress"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={newCritCategory}
                    onChange={(e) => setNewCritCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Financial">Financial</option>
                    <option value="Career">Career</option>
                    <option value="Growth">Growth</option>
                    <option value="Risk">Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Importance
                  </label>
                  <select
                    value={newCritImportance}
                    onChange={(e) =>
                      setNewCritImportance(e.target.value as 'Critical' | 'High' | 'Medium')
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              {/* Option score sliders */}
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Rate each option (1-10)
                </p>
                {options.map((opt) => (
                  <div key={opt.id} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>{opt.name}</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {newCritRatings[opt.id]?.rating ?? 7}/10
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newCritRatings[opt.id]?.rating ?? 7}
                      onChange={(e) =>
                        setNewCritRatings({
                          ...newCritRatings,
                          [opt.id]: {
                            rating: Number(e.target.value),
                            rationale: newCritRatings[opt.id]?.rationale || '',
                          },
                        })
                      }
                      className="mt-2 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Brief rationale / justification..."
                      value={newCritRatings[opt.id]?.rationale || ''}
                      onChange={(e) =>
                        setNewCritRatings({
                          ...newCritRatings,
                          [opt.id]: {
                            rating: newCritRatings[opt.id]?.rating ?? 7,
                            rationale: e.target.value,
                          },
                        })
                      }
                      className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all"
                >
                  Save Criterion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
