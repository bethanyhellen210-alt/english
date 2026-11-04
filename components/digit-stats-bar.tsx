'use client';

import { Localize } from '@deriv-com/translations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  latestDigit: number | null;
  onDigitSelect: (digit: number) => void;
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  latestDigit,
  onDigitSelect,
}: DigitStatsBarProps) {
  // Rank distinct frequencies so ties share a colour instead of receiving
  // arbitrary positions. With no tick data, all digits remain neutral.
  const distinct = Array.from(new Set(digitStats.percentages)).sort((a, b) => a - b);
  const low = distinct[0];
  const secondLow = distinct[1];
  const secondHigh = distinct[distinct.length - 2];
  const high = distinct[distinct.length - 1];
  const hasData = digitStats.totalTicks > 0;

  const rankClass = (pct: number) => {
    if (!hasData || distinct.length < 2) return 'bg-muted text-muted-foreground border-border';
    if (pct === high) return 'bg-emerald-500 text-white border-emerald-600';
    if (distinct.length >= 4 && pct === secondHigh) return 'bg-blue-500 text-white border-blue-600';
    if (pct === low) return 'bg-red-500 text-white border-red-600';
    if (distinct.length >= 4 && pct === secondLow) return 'bg-amber-400 text-slate-950 border-amber-500';
    return 'bg-muted text-foreground border-border';
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 sm:mb-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          <Localize i18n_default_text="Last digit prediction" />
        </span>
        <span className="text-[10px] text-muted-foreground">
          {digitStats.totalTicks.toLocaleString()} ticks
        </span>
      </div>
      <div className="grid grid-cols-5 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-6 place-items-center w-full py-2">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const isLatest = digit === latestDigit;
          return (
            <div key={digit} className="relative flex flex-col items-center gap-1.5">
              {isLatest && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce text-blue-500 text-base leading-none" aria-label="Latest tick digit">
                  ▼
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                aria-label={`Digit ${digit}, ${pct.toFixed(1)} percent${isLatest ? ', latest tick' : ''}`}
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full border-2 p-0 text-base font-bold shadow-sm transition-all duration-300 sm:h-14 sm:w-14 sm:text-xl',
                  rankClass(pct),
                  isSelected && 'ring-2 ring-offset-2 ring-primary scale-105',
                  isLatest && 'ring-2 ring-blue-300 ring-offset-2',
                )}
              >
                {digit}
              </Button>
              <span className={cn(
                'font-mono text-[11px] sm:text-xs',
                hasData && pct === high && 'text-emerald-600 dark:text-emerald-400 font-bold',
                hasData && distinct.length >= 4 && pct === secondHigh && 'text-blue-600 dark:text-blue-400 font-bold',
                hasData && pct === low && 'text-red-600 dark:text-red-400 font-bold',
                hasData && distinct.length >= 4 && pct === secondLow && 'text-amber-600 dark:text-amber-400 font-bold',
                (!hasData || (pct !== high && (distinct.length < 4 || pct !== secondHigh) && pct !== low && (distinct.length < 4 || pct !== secondLow))) && 'text-muted-foreground',
              )}>
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500" />Highest</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-blue-500" />2nd highest</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-400" />2nd lowest</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500" />Lowest</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-muted border border-border" />Others</span>
      </div>
    </div>
  );
}
