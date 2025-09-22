'use client';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { OTPInput, SlotProps } from 'input-otp';
import { useState } from 'react';

interface LockUpProps {
  check: boolean;
  setCheck: (check: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export default function LockUp({ check, setCheck, setLoading }: LockUpProps) {
  const [password, setPassword] = useState<string | undefined>('');
  const [error, setError] = useState('');
  const Passwork = process.env.NEXT_PUBLIC_PASSWORD || 'code';

  const handlePasswordChange = async (value: string) => {
    setPassword(value);
    setError(''); // Clear any previous errors
    
    // Auto-check when all 4 digits are filled
    if (value.length === 4) {
      try {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (value === Passwork) {
          setCheck(true);
        } else {
          setError('Invalid password!');
          setPassword('');
        }
      } catch (errr) {
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    try {
      if (e.key === 'Enter' && password) {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (password === Passwork) {
          setCheck(true);
        } else {
          setError('Invalid password!');
          setPassword('');
        }
      }
    } catch (errr) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="justify-center text-white">Password input (spaced)</Label>
      <OTPInput
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handleKeyPress}
        containerClassName="flex items-center gap-3 has-[:disabled]:opacity-50"
        maxLength={4}
        render={({ slots }) => (
          <div className="flex gap-2">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
      {error && (
        <p className="mt-2 text-xs text-red-400 text-center" role="region" aria-live="polite">
          {error}
        </p>
      )}
      <p
        className="mt-2 text-xs text-zinc-300 text-center"
        role="region"
        aria-live="polite"
      >
        Enter to Access
      </p>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'flex size-9 items-center justify-center rounded-[10px] border-2 border-input bg-background font-medium text-foreground shadow-sm shadow-black/5 transition-shadow',
        { 'z-10 border-2 border-ring ring-[3px] ring-ring/20': props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
