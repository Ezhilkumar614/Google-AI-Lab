import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, FollowupMessage } from '../types';
import { Send, Bot, User, Sparkles, Loader2, MessageSquare } from 'lucide-react';

interface DecisionConsultantChatProps {
  analysis: AnalysisResult;
}

export const DecisionConsultantChat: React.FC<DecisionConsultantChatProps> = ({ analysis }) => {
  const [messages, setMessages] = useState<FollowupMessage[]>([
    {
      id: 'm_welcome',
      sender: 'assistant',
      text: `Hello! I have formulated the verdict for "${analysis.decisionInput.title}". Leaning towards **${analysis.verdict.recommendedOptionName}** (${analysis.verdict.confidencePercentage}% confidence). What doubts, counter-arguments, or specific questions would you like to explore?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    `How do I negotiate if I choose ${analysis.verdict.recommendedOptionName}?`,
    `What if my gut strongly prefers the other option?`,
    `Draft a polite announcement email for this decision.`,
    `What are the 3 biggest risks in the first 90 days?`,
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim() || loading) return;

    const userMsg: FollowupMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: question.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: analysis.decisionInput.title,
          verdict: analysis.verdict,
          question: question.trim(),
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const assistantMsg: FollowupMessage = {
        id: `a_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've analyzed your question and stand by the decision logic.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `Apologies, I encountered an issue: ${err.message || 'Unable to connect to AI server'}. Please try again.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              The Arbitrator's Chamber
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Online
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Stress-test the verdict, ask for tactics, or explore alternatives
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400">Powered by Gemini 3.8</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-sm rounded-tr-xs'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/60 rounded-tl-xs whitespace-pre-wrap'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Consulting decision models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      {messages.length < 4 && (
        <div className="border-t border-slate-100 dark:border-slate-800/60 px-4 py-2 bg-slate-50/50 dark:bg-slate-900/40">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500" /> Quick Inquiries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="rounded-lg bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="border-t border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question or challenge the verdict..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm transition-all"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
