'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Localize } from '@deriv-com/translations';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppTranslations } from '@/components/custom/i18n-provider';
import type { ContractMode, TradeType, DurationLimits, ProposalInfo, BuyResult } from '../lib/types';

interface TradeControlsProps {
  tradeType: TradeType;
  contractMode: ContractMode;
  onContractModeChange: (mode: ContractMode) => void;
  selectedDigit: number;
  isConnected: boolean;
  stake: string;
  onStakeChange: (value: string) => void;
  duration: number;
  onDurationChange: (value: number) => void;
  durationLimits: DurationLimits;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  onBuy: () => void;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  onClearBuyResult: () => void;
  isAuthenticated?: boolean;
  isMobile?: boolean;
}

function getContractModeOptions(localize: (text: string) => string): Record<TradeType, { value: ContractMode; label: string }[]> {
  return {
    'matches-differs': [{ value: 'DIGITMATCH', label: localize('Matches') }, { value: 'DIGITDIFF', label: localize('Differs') }],
    'over-under': [{ value: 'DIGITOVER', label: localize('Over') }, { value: 'DIGITUNDER', label: localize('Under') }],
    'even-odd': [{ value: 'DIGITEVEN', label: localize('Even') }, { value: 'DIGITODD', label: localize('Odd') }],
  };
}

export function TradeControls({ tradeType, contractMode, onContractModeChange, isConnected, proposal, onBuy, isBuying, buyResult, buyError, onClearBuyResult, isAuthenticated }: TradeControlsProps) {
  const { localize } = useAppTranslations();

  useEffect(() => {
    if (buyError) {
      toast.error(localize('Purchase Failed'), { description: buyError });
      onClearBuyResult();
    }
  }, [buyError, onClearBuyResult, localize]);

  useEffect(() => {
    if (buyResult) {
      toast.success(localize('Contract Purchased'));
      onClearBuyResult();
    }
  }, [buyResult, onClearBuyResult, localize]);

  const options = getContractModeOptions(localize)[tradeType];

  return (
    <div className="space-y-4">
      <ToggleGroup type="single" value={contractMode} onValueChange={value => { if (value) onContractModeChange(value as ContractMode); }} className="w-full gap-1 rounded-full bg-muted p-1">
        {options.map(option => (
          <ToggleGroupItem key={option.value} value={option.value} className="flex-1 rounded-full text-sm font-medium text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:font-bold data-[state=on]:shadow-sm">
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Button className="h-11 w-full rounded-full" disabled={!isConnected || !proposal || isBuying} onClick={onBuy}>
        {isBuying ? localize('Purchasing...') : localize('Buy Contract')}
      </Button>
      {isAuthenticated && (
        <Button asChild variant="ghost" className="w-full text-sm text-muted-foreground hover:text-foreground">
          <Link href="/reports"><Localize i18n_default_text="View your positions →" /></Link>
        </Button>
      )}
    </div>
  );
}
