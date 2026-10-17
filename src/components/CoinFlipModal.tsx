import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, X, HeartHandshake, Eye } from 'lucide-react';

interface CoinFlipModalProps {
  optionA: string;
  optionB: string;
  onClose: () => void;
  onSelectOption?: (optionName: string) => void;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  optionA,
  optionB,
  onClose,
  onSelectOption,
}) => {
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [rotations, setRotations] = useState(0);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);

    // Random outcome: A or B
    const outcome = Math.random() > 0.5 ? 'A' : 'B';
    const extraRotations = 1800 + (outcome === 'A' ? 0 : 180);
    const newRot = rotations + extraRotations;
    setRotations(newRot);

    setTimeout(() => {
      setResult(outcome);
      setFlipping(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti animation suppressed:', e);
      }
    }, 2200);
  };

  const winningName = result === 'A' ? optionA : optionB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 p-6 md:p-8 text-white shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-400/20">
            <Sparkles className="h-3.5 w-3.5" /> Sigmund Freud's Gut-Check
          </span>
          <h3 className="text-2xl font-black tracking-tight text-white">
            The Psychology Coin Flip
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            While the coin is spinning mid-air, notice what your heart secretly roots for!
          </p>
        </div>

        {/* 3D Coin Graphic */}
        <div className="my-8 flex justify-center items-center perspective-1000">
          <div
            className="relative h-40 w-40 rounded-full transition-transform duration-[2200ms] ease-out shadow-2xl"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateY(${rotations}deg)`,
            }}
          >
            {/* Heads - Side A */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-slate-950 p-4 border-4 border-amber-300 shadow-inner"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-950">
                Option A
              </span>
              <p className="text-sm font-black text-center line-clamp-2 px-1 text-amber-950 mt-1">
                {optionA}
              </p>
              <div className="mt-2 h-1.5 w-6 rounded-full bg-amber-900/40" />
            </div>

            {/* Tails - Side B */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-400 to-sky-200 text-slate-950 p-4 border-4 border-indigo-300 shadow-inner"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-950">
                Option B
              </span>
              <p className="text-sm font-black text-center line-clamp-2 px-1 text-indigo-950 mt-1">
                {optionB}
              </p>
              <div className="mt-2 h-1.5 w-6 rounded-full bg-indigo-900/40" />
            </div>
          </div>
        </div>

        {/* Flip Result & Gut Check Callout */}
        {result && (
          <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-4 text-center space-y-2 animate-in fade-in zoom-in duration-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              The Coin Chose:
            </span>
            <h4 className="text-lg font-extrabold text-white">{winningName}</h4>
            <div className="pt-2 border-t border-slate-700/80 text-xs text-slate-300 flex items-start gap-2 text-left">
              <Eye className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>The Gut Test:</strong> Did you feel slight relief or disappointment when it landed? If disappointment, your real answer is the opposite option!
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={flipCoin}
            disabled={flipping}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-bold py-3.5 text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <RotateCcw className={`h-4 w-4 ${flipping ? 'animate-spin' : ''}`} />
            {flipping ? 'Coin is in mid-air...' : result ? 'Toss Again' : 'Toss The Coin'}
          </button>

          {result && onSelectOption && (
            <button
              onClick={() => {
                onSelectOption(winningName);
                onClose();
              }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 text-xs shadow-md transition-all"
            >
              <HeartHandshake className="h-4 w-4" /> Accept {winningName} as Final Choice
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
