import React, { useState } from 'react';
import { OptionAnalysis, ProConItem, CategoryType } from '../types';
import { Plus, Trash2, Sliders, ThumbsUp, ThumbsDown, Info, Tag } from 'lucide-react';

interface ProsConsViewProps {
  options: OptionAnalysis[];
  onUpdateWeight: (optionId: string, type: 'pros' | 'cons', itemId: string, newWeight: number) => void;
  onDeleteItem: (optionId: string, type: 'pros' | 'cons', itemId: string) => void;
  onAddItem: (optionId: string, type: 'pros' | 'cons', item: Omit<ProConItem, 'id'>) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  options,
  onUpdateWeight,
  onDeleteItem,
  onAddItem,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState<{ open: boolean; type: 'pros' | 'cons'; optionId: string }>({
    open: false,
    type: 'pros',
    optionId: '',
  });

  const [newItemText, setNewItemText] = useState('');
  const [newItemExplanation, setNewItemExplanation] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryType>('Personal');
  const [newItemWeight, setNewItemWeight] = useState(7);

  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  const handleOpenAdd = (type: 'pros' | 'cons', optionId: string) => {
    setShowAddModal({ open: true, type, optionId });
    setNewItemText('');
    setNewItemExplanation('');
    setNewItemWeight(7);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    onAddItem(showAddModal.optionId, showAddModal.type, {
      text: newItemText.trim(),
      explanation: newItemExplanation.trim() || 'Custom user consideration.',
      category: newItemCategory,
      weight: Number(newItemWeight),
    });

    setShowAddModal({ open: false, type: 'pros', optionId: '' });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
      case 'Career':
      case 'Growth':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800';
      case 'Lifestyle':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
      case 'Risk':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
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
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {idx + 1}
              </span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Sliders className="h-4 w-4" />
          <span>Drag sliders (1-10) to adjust weights to your personal values</span>
        </div>
      </div>

      {/* Active Option Header */}
      {activeOption && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200 dark:border-slate-700/60">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{activeOption.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">{activeOption.tagline}</p>
        </div>
      )}

      {/* Grid: Pros on left, Cons on right */}
      {activeOption && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* PROS COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm">
                  <ThumbsUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Pros & Upsides</h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300/80">
                    Total weight:{' '}
                    <span className="font-semibold">
                      +{activeOption.pros.reduce((acc, p) => acc + (p.weight || 5), 0)} pts
                    </span>{' '}
                    ({activeOption.pros.length} items)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenAdd('pros', activeOption.id)}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Pro
              </button>
            </div>

            {/* Pros List */}
            <div className="space-y-3">
              {activeOption.pros.map((pro) => (
                <div
                  key={pro.id}
                  className="group relative rounded-xl bg-white dark:bg-slate-900/80 p-4 shadow-sm border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border ${getCategoryColor(
                            pro.category
                          )}`}
                        >
                          <Tag className="h-3 w-3" /> {pro.category}
                        </span>
                        <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          Weight: {pro.weight}/10
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                        {pro.text}
                      </h5>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {pro.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteItem(activeOption.id, 'pros', pro.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-md transition-all"
                      title="Delete this pro"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Weight Slider */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      Importance:
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={pro.weight || 5}
                      onChange={(e) =>
                        onUpdateWeight(activeOption.id, 'pros', pro.id, Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 w-5 text-right">
                      {pro.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONS COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-rose-500/10 p-3.5 border border-rose-500/20 text-rose-900 dark:text-rose-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm">
                  <ThumbsDown className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Cons & Downsides</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300/80">
                    Total weight:{' '}
                    <span className="font-semibold">
                      -{activeOption.cons.reduce((acc, c) => acc + (c.weight || 5), 0)} pts
                    </span>{' '}
                    ({activeOption.cons.length} items)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenAdd('cons', activeOption.id)}
                className="flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> Add Con
              </button>
            </div>

            {/* Cons List */}
            <div className="space-y-3">
              {activeOption.cons.map((con) => (
                <div
                  key={con.id}
                  className="group relative rounded-xl bg-white dark:bg-slate-900/80 p-4 shadow-sm border border-rose-500/20 hover:border-rose-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border ${getCategoryColor(
                            con.category
                          )}`}
                        >
                          <Tag className="h-3 w-3" /> {con.category}
                        </span>
                        <span className="rounded-md bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 text-xs font-mono font-bold text-rose-700 dark:text-rose-400">
                          Penalty: {con.weight}/10
                        </span>
                      </div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                        {con.text}
                      </h5>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {con.explanation}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteItem(activeOption.id, 'cons', con.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1 rounded-md transition-all"
                      title="Delete this con"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Weight Slider */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      Penalty Severity:
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={con.weight || 5}
                      onChange={(e) =>
                        onUpdateWeight(activeOption.id, 'cons', con.id, Number(e.target.value))
                      }
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 w-5 text-right">
                      {con.weight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Item Modal */}
      {showAddModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {showAddModal.type === 'pros' ? (
                <>
                  <ThumbsUp className="h-5 w-5 text-emerald-500" /> Add Custom Pro
                </>
              ) : (
                <>
                  <ThumbsDown className="h-5 w-5 text-rose-500" /> Add Custom Con
                </>
              )}
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Inject your personal circumstances or unique priorities into {activeOption.name}.
            </p>

            <form onSubmit={handleSaveNewItem} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    showAddModal.type === 'pros'
                      ? 'e.g. My spouse loves the school district'
                      : 'e.g. Daily commute will reduce gym time'
                  }
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Detailed Explanation / Why it matters
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this has high or low impact on your life..."
                  value={newItemExplanation}
                  onChange={(e) => setNewItemExplanation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as CategoryType)}
                    className="mt-1 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Financial">Financial</option>
                    <option value="Career">Career</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Growth">Growth</option>
                    <option value="Risk">Risk</option>
                    <option value="Emotional">Emotional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Weight: {newItemWeight}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(Number(e.target.value))}
                    className={`mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer ${
                      showAddModal.type === 'pros' ? 'accent-emerald-500' : 'accent-rose-500'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal({ open: false, type: 'pros', optionId: '' })}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-all ${
                    showAddModal.type === 'pros'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Save Point
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
