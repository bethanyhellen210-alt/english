'use client';

import { useMemo } from 'react';
import type { DigitStats } from '@/lib/types';

type Pair = { left: string; right: string; leftPct: number; rightPct: number; leftColor: string; rightColor: string };

function Circle({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 23;
  const dash = circumference * Math.max(0, Math.min(100, value)) / 100;
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
      <svg viewBox="0 0 52 52" className="h-14 w-14 shrink-0" role="img" aria-label={`${label} ${value.toFixed(1)} percent`}>
        <circle cx="26" cy="26" r="23" fill="none" stroke="currentColor" strokeOpacity=".13" strokeWidth="5" />
        <circle cx="26" cy="26" r="23" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} transform="rotate(-90 26 26)" />
        <text x="26" y="29" textAnchor="middle" className="fill-current" fontSize="10" fontWeight="700">{value.toFixed(0)}%</text>
      </svg>
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

function PairRow({ title, pair }: { title: string; pair: Pair }) {
  return (
    <section className="min-w-0 rounded-xl border border-border bg-card p-3">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <div className="flex items-center justify-between gap-2">
        <Circle value={pair.leftPct} label={pair.left} color={pair.leftColor} />
        <div className="h-10 w-px bg-border" />
        <Circle value={pair.rightPct} label={pair.right} color={pair.rightColor} />
      </div>
    </section>
  );
}

export function OutcomeStats({ digitStats, prices, selectedDigit }: { digitStats: DigitStats; prices: number[]; selectedDigit: number }) {
  const pairs = useMemo(() => {
    const over = digitStats.counts.reduce((sum, count, digit) => sum + (digit > selectedDigit ? count : 0), 0);
    const under = digitStats.counts.reduce((sum, count, digit) => sum + (digit < selectedDigit ? count : 0), 0);
    const barrierTotal = over + under;
    const even = digitStats.counts.reduce((sum, count, digit) => sum + (digit % 2 === 0 ? count : 0), 0);
    const odd = digitStats.counts.reduce((sum, count, digit) => sum + (digit % 2 === 1 ? count : 0), 0);
    let rises = 0;
    let falls = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) rises++;
      else if (prices[i] < prices[i - 1]) falls++;
    }
    const movementTotal = rises + falls;
    const pct = (count: number, total: number) => total ? (count / total) * 100 : 0;
    return [
      { title: 'OVER / UNDER', pair: { left: 'OVER', right: 'UNDER', leftPct: pct(over, barrierTotal), rightPct: pct(under, barrierTotal), leftColor: '#16a34a', rightColor: '#dc2626' } },
      { title: 'EVEN / ODD', pair: { left: 'EVEN', right: 'ODD', leftPct: pct(even, even + odd), rightPct: pct(odd, even + odd), leftColor: '#16a34a', rightColor: '#dc2626' } },
      { title: 'RISE / FALL', pair: { left: 'RISE', right: 'FALL', leftPct: pct(rises, movementTotal), rightPct: pct(falls, movementTotal), leftColor: '#16a34a', rightColor: '#dc2626' } },
    ] as { title: string; pair: Pair }[];
  }, [digitStats, prices, selectedDigit]);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {pairs.map(({ title, pair }) => <PairRow key={title} title={title} pair={pair} />)}
    </div>
  );
}
