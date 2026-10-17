import React, { useState, useEffect } from 'react';
import { AnalysisResult, DecisionOption, ComparisonCriterion, ProConItem } from './types';
import {
  SAMPLE_STARTUP_ANALYSIS,
  SAMPLE_HOUSING_ANALYSIS,
  SAMPLE_BUSINESS_ANALYSIS,
  SAMPLE_TECH_ANALYSIS,
  DilemmaTemplate,
} from './data/templates';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { BalanceScale } from './components/BalanceScale';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTable } from './components/ComparisonTable';
import { SWOTView } from './components/SWOTView';
import { VerdictAndPressureTest } from './components/VerdictAndPressureTest';
import { DecisionConsultantChat } from './components/DecisionConsultantChat';
import { CoinFlipModal } from './components/CoinFlipModal';
import { QuickTiebreakerModal } from './components/QuickTiebreakerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import confetti from 'canvas-confetti';
import {
  Scale,
  Layers,
  ShieldAlert,
  Clock,
  MessageSquare,
  Download,
  Share2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'proscons' | 'matrix' | 'swot' | 'pressure' | 'chat'>('proscons');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Modals state
  const [showQuickModal, setShowQuickModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Saved Decisions in LocalStorage
  const [savedDecisions, setSavedDecisions] = useState<AnalysisResult[]>(() => {
    try {
      const stored = localStorage.getItem('tiebreaker_decisions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
    }
    return [
      SAMPLE_STARTUP_ANALYSIS,
      SAMPLE_HOUSING_ANALYSIS,
      SAMPLE_BUSINESS_ANALYSIS,
      SAMPLE_TECH_ANALYSIS,
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tiebreaker_decisions', JSON.stringify(savedDecisions));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [savedDecisions]);

  // Handle Form Submission for AI Deep Analysis
  const handleAnalyze = async (formData: {
    title: string;
    category: string;
    context: string;
    urgency: 'low' | 'medium' | 'high';
    reversible: 'type1_irreversible' | 'type2_reversible';
    options: DecisionOption[];
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysis(result);
      setActiveTab('proscons');

      // Save to history automatically
      setSavedDecisions((prev) => [result, ...prev.filter((d) => d.id !== result.id)]);

      // Confetti burst on successful verdict formulation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (confettiErr) {
        console.warn('Confetti animation suppressed:', confettiErr);
      }
    } catch (err: any) {
      console.error('Error analyzing decision:', err);
      setErrorMessage(
        err.message || 'Unable to analyze decision right now. Please verify server connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load a preset template
  const handleLoadTemplate = (template: DilemmaTemplate) => {
    if (template.prebuiltAnalysis) {
      setAnalysis(template.prebuiltAnalysis);
      setActiveTab('proscons');
    }
  };

  // Weight Slider Update (Live physics scale adjustment)
  const handleUpdateWeight = (
    optionId: string,
    type: 'pros' | 'cons',
    itemId: string,
    newWeight: number
  ) => {
    if (!analysis) return;

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        [type]: opt[type].map((item) => (item.id === itemId ? { ...item, weight: newWeight } : item)),
      };
    });

    setAnalysis({
      ...analysis,
      options: updatedOptions,
    });
  };

  // Delete a pro or con
  const handleDeleteItem = (optionId: string, type: 'pros' | 'cons', itemId: string) => {
    if (!analysis) return;
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        [type]: opt[type].filter((item) => item.id !== itemId),
      };
    });
    setAnalysis({ ...analysis, options: updatedOptions });
  };

  // Add custom pro or con
  const handleAddItem = (
    optionId: string,
    type: 'pros' | 'cons',
    item: Omit<ProConItem, 'id'>
  ) => {
    if (!analysis) return;
    const newItem: ProConItem = {
      ...item,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        [type]: [newItem, ...opt[type]],
      };
    });
    setAnalysis({ ...analysis, options: updatedOptions });
  };

  // Add custom comparison criterion
  const handleAddCriterion = (criterion: ComparisonCriterion) => {
    if (!analysis) return;
    setAnalysis({
      ...analysis,
      comparisonMatrix: {
        criteria: [criterion, ...analysis.comparisonMatrix.criteria],
      },
    });
  };

  // Add SWOT item
  const handleAddSWOTItem = (
    optionId: string,
    quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
    text: string
  ) => {
    if (!analysis) return;
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: [...opt.swot[quadrant], text],
        },
      };
    });
    setAnalysis({ ...analysis, options: updatedOptions });
  };

  // Delete SWOT item
  const handleDeleteSWOTItem = (
    optionId: string,
    quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats',
    index: number
  ) => {
    if (!analysis) return;
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id !== optionId) return opt;
      return {
        ...opt,
        swot: {
          ...opt.swot,
          [quadrant]: opt.swot[quadrant].filter((_, i) => i !== index),
        },
      };
    });
    setAnalysis({ ...analysis, options: updatedOptions });
  };

  // Export Executive Markdown Report
  const handleExportMarkdown = () => {
    if (!analysis) return;

    let md = `# Decision Dossier: ${analysis.decisionInput.title}\n`;
    md += `Evaluated on ${new Date(analysis.timestamp).toLocaleDateString()}\n\n`;
    md += `## Executive Verdict\n`;
    md += `**Recommended Option:** ${analysis.verdict.recommendedOptionName} (${analysis.verdict.confidencePercentage}% confidence)\n\n`;
    md += `> "${analysis.verdict.headline}"\n\n`;
    md += `${analysis.verdict.executiveRationale}\n\n`;
    md += `### The Tiebreaker Factor\n${analysis.verdict.theTiebreakerFactor}\n\n`;

    md += `## 10/10/10 Rule Analysis\n`;
    md += `- **In 10 Minutes:** ${analysis.verdict.rule101010.in10Minutes}\n`;
    md += `- **In 10 Months:** ${analysis.verdict.rule101010.in10Months}\n`;
    md += `- **In 10 Years:** ${analysis.verdict.rule101010.in10Years}\n\n`;

    md += `## Options Breakdown\n`;
    analysis.options.forEach((opt) => {
      md += `### ${opt.name}\n_${opt.tagline}_\n\n`;
      md += `#### Pros:\n`;
      opt.pros.forEach((p) => {
        md += `- **${p.text}** (Weight: ${p.weight}/10) - ${p.explanation}\n`;
      });
      md += `\n#### Cons:\n`;
      opt.cons.forEach((c) => {
        md += `- **${c.text}** (Penalty: ${c.weight}/10) - ${c.explanation}\n`;
      });
      md += `\n`;
    });

    // Copy to clipboard
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Delete decision from history
  const handleDeleteDecision = (id: string) => {
    setSavedDecisions((prev) => prev.filter((d) => d.id !== id));
    if (analysis?.id === id) {
      setAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenQuickModal={() => setShowQuickModal(true)}
        onOpenCoinModal={() => setShowCoinModal(true)}
        onOpenHistory={() => setShowHistory(true)}
        onNewDecision={() => setAnalysis(null)}
        savedCount={savedDecisions.length}
        hasActiveAnalysis={Boolean(analysis)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Error message banner */}
        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-800 dark:text-rose-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold">Analysis Notice: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* If no analysis active, show Hero & Form */}
        {!analysis ? (
          <div className="space-y-10">
            {/* Hero Banner */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3.5 w-3.5" /> The Intelligent Multi-Perspective Arbiter
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.15]">
                When Logic Is Deadlocked,{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent">
                  Break The Tie.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Turn overwhelming choices into structured clarity. Deeply evaluate options with
                weighted pros & cons, dynamic physics scales, side-by-side matrices, and SWOT quadrants.
              </p>
            </div>

            {/* Input Form */}
            <DecisionForm
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              onLoadTemplate={handleLoadTemplate}
            />
          </div>
        ) : (
          /* Active Analysis Workspace */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Dilemma Title Bar & Actions */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {analysis.decisionInput.category}
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
                    Urgency: {analysis.decisionInput.urgency}
                  </span>
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-400">
                    {analysis.decisionInput.reversible === 'type1_irreversible'
                      ? 'Type 1: One-way door'
                      : 'Type 2: Reversible'}
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {analysis.decisionInput.title}
                </h1>
                {analysis.decisionInput.context && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2">
                    "{analysis.decisionInput.context}"
                  </p>
                )}
              </div>

              {/* Utility Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                  title="Copy formatted markdown dossier"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span>Export Dossier</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowCoinModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 px-3.5 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 text-indigo-500" />
                  <span>Coin Test</span>
                </button>
              </div>
            </div>

            {/* Live Dynamic Balance Scale */}
            <BalanceScale options={analysis.options} />

            {/* Navigation Tabs for Views */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('proscons')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'proscons'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Scale className="h-4 w-4" />
                <span>Weighted Pros & Cons</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'matrix'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>Comparison Table</span>
              </button>

              <button
                onClick={() => setActiveTab('swot')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'swot'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>SWOT Analysis</span>
              </button>

              <button
                onClick={() => setActiveTab('pressure')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'pressure'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Verdict & 10/10/10 Test</span>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'chat'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Arbitrator AI Chat</span>
              </button>
            </div>

            {/* Active Tab Content */}
            <div>
              {activeTab === 'proscons' && (
                <ProsConsView
                  options={analysis.options}
                  onUpdateWeight={handleUpdateWeight}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                />
              )}

              {activeTab === 'matrix' && (
                <ComparisonTable
                  options={analysis.options}
                  criteria={analysis.comparisonMatrix.criteria}
                  onAddCriterion={handleAddCriterion}
                />
              )}

              {activeTab === 'swot' && (
                <SWOTView
                  options={analysis.options}
                  onAddSWOTItem={handleAddSWOTItem}
                  onDeleteSWOTItem={handleDeleteSWOTItem}
                />
              )}

              {activeTab === 'pressure' && (
                <VerdictAndPressureTest
                  verdict={analysis.verdict}
                  decisionInput={analysis.decisionInput}
                />
              )}

              {activeTab === 'chat' && (
                <DecisionConsultantChat analysis={analysis} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p className="flex items-center justify-center gap-1.5">
          <span>The Tiebreaker</span> • <span>Objective AI Arbitration & Strategic Evaluation</span>
        </p>
      </footer>

      {/* Quick Tiebreaker Modal */}
      {showQuickModal && <QuickTiebreakerModal onClose={() => setShowQuickModal(false)} />}

      {/* Psychology Coin Flip Modal */}
      {showCoinModal && (
        <CoinFlipModal
          optionA={analysis?.options[0]?.name || 'Option A'}
          optionB={analysis?.options[1]?.name || 'Option B'}
          onClose={() => setShowCoinModal(false)}
        />
      )}

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={(dec) => {
          setAnalysis(dec);
          setActiveTab('proscons');
        }}
        onDeleteDecision={handleDeleteDecision}
      />
    </div>
  );
}
