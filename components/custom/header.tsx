'use client';

import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AuthState, DerivAccount } from '@deriv/core';

interface HeaderProps {
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;
  onSignUp?: () => Promise<void>;
  logoSrc?: string;
  appName?: string;
  showAppName?: boolean;
  actions?: React.ReactNode;
}

function formatBalance(balance: string): string {
  return Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function Header({ authState, accounts, activeAccount, onSwitchAccount, logoSrc, appName, showAppName }: HeaderProps) {
  const [logoError, setLogoError] = useState(false);
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const resolvedName = appName?.trim() || process.env.NEXT_PUBLIC_DERIV_APP_NAME?.trim() || 'Deriv Analysis';
  const shouldShowName = showAppName ?? process.env.NEXT_PUBLIC_DERIV_SHOW_APP_NAME !== 'false';
  const isAuthenticated = authState === 'authenticated';

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {!logoSrc || logoError ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-sm font-bold text-primary">
            {resolvedName.charAt(0).toUpperCase() || 'D'}
          </div>
        ) : (
          <img src={logoSrc} alt="App logo" className="h-8 w-auto object-contain" onError={() => setLogoError(true)} />
        )}
        {shouldShowName && <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{resolvedName}</h1>}
      </div>
      {isAuthenticated && activeAccount && (
        <Popover open={accountSwitcherOpen} onOpenChange={setAccountSwitcherOpen}>
          <PopoverTrigger asChild>
            <button className="flex min-w-0 items-center gap-2 rounded-lg border border-border px-3 py-2 text-left hover:bg-muted/50">
              <span className={cn('text-xs font-semibold', activeAccount.account_type === 'demo' ? 'text-orange-400' : 'text-emerald-400')}>
                {activeAccount.account_type === 'demo' ? 'DEMO' : 'REAL'}
              </span>
              <span className="truncate text-sm font-bold">{formatBalance(activeAccount.balance)} {activeAccount.currency}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="z-[100] w-64 p-2">
            <div className="space-y-1">
              {accounts.map(account => (
                <button key={account.account_id} onClick={() => { void onSwitchAccount(account.account_id); setAccountSwitcherOpen(false); }} className={cn('w-full rounded-lg px-3 py-2.5 text-left hover:bg-muted/50', account.account_id === activeAccount.account_id && 'bg-muted')}>
                  <span className={cn('text-xs font-semibold', account.account_type === 'demo' ? 'text-orange-400' : 'text-emerald-400')}>{account.account_type === 'demo' ? 'DEMO' : 'REAL'}</span>
                  <p className="text-sm font-bold">{formatBalance(account.balance)} {account.currency}</p>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
