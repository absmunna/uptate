import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmOrderButtonProps {
  isAuthorizing: boolean;
  onClick: () => void;
  className?: string;
}

export const ConfirmOrderButton: React.FC<ConfirmOrderButtonProps> = ({
  isAuthorizing,
  onClick,
  className
}) => {
  return (
    <Button
      disabled={isAuthorizing}
      onClick={onClick}
      className={className}
    >
      {isAuthorizing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>Processing ledger...</span>
        </>
      ) : (
        <>
          <ShieldCheck className="w-4.5 h-4.5" />
          <span>Authorize & Secure</span>
        </>
      )}
    </Button>
  );
};
