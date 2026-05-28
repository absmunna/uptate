import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'topup' | 'send' | 'receive' | 'cashback';
  amount: number;
  currency: 'BDT' | 'COIN';
  description: string;
  date: string;
  status: 'Completed' | 'Pending';
}

interface WalletState {
  fiatBalance: number; // BDT
  pkCoinBalance: number;
  transactions: Transaction[];
  updateWallet: (fiat: number, coins: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  topUp: (amount: number) => void;
  sendMoney: (amount: number, receiver: string) => boolean;
  addCoins: (amount: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      fiatBalance: 45280,
      pkCoinBalance: 1250,
      transactions: [
        { id: 'tx-01', type: 'cashback', amount: 250, currency: 'COIN', description: 'পিকে শপ ক্যাশব্যাক', date: 'May 23, 2026', status: 'Completed' },
        { id: 'tx-02', type: 'topup', amount: 5000, currency: 'BDT', description: 'বিকাশ টপ আপ', date: 'May 22, 2026', status: 'Completed' },
        { id: 'tx-03', type: 'send', amount: 1200, currency: 'BDT', description: 'রহিম ইলেকট্রনিক্স পেমেন্ট', date: 'May 20, 2026', status: 'Completed' }
      ],
      updateWallet: (fiat, coins) => set({ fiatBalance: fiat, pkCoinBalance: coins }),
      addTransaction: (tx) => set((state) => ({
        transactions: [
          {
            ...tx,
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          },
          ...state.transactions
        ]
      })),
      topUp: (amount) => set((state) => {
        const newFiat = state.fiatBalance + amount;
        const newTx: Transaction = {
          id: `tx-${Math.random().toString(36).substr(2, 9)}`,
          type: 'topup',
          amount,
          currency: 'BDT',
          description: 'ওয়ালেট টপ আপ (MFS)',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Completed'
        };
        return {
          fiatBalance: newFiat,
          transactions: [newTx, ...state.transactions]
        };
      }),
      sendMoney: (amount, receiver) => {
        const current = get().fiatBalance;
        if (current < amount) return false;
        
        set((state) => {
          const newFiat = state.fiatBalance - amount;
          const newTx: Transaction = {
            id: `tx-${Math.random().toString(36).substr(2, 9)}`,
            type: 'send',
            amount,
            currency: 'BDT',
            description: `${receiver} কে পাঠানো হয়েছে`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Completed'
          };
          return {
            fiatBalance: newFiat,
            transactions: [newTx, ...state.transactions]
          };
        });
        return true;
      },
      addCoins: (amount) => set((state) => {
        const newCoins = state.pkCoinBalance + amount;
        const newTx: Transaction = {
          id: `tx-${Math.random().toString(36).substr(2, 9)}`,
          type: 'cashback',
          amount,
          currency: 'COIN',
          description: 'রিওয়ার্ড পয়েন্ট বোনাস',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'Completed'
        };
        return {
          pkCoinBalance: newCoins,
          transactions: [newTx, ...state.transactions]
        };
      }),
    }),
    {
      name: 'pm-wallet-storage',
    }
  )
);
