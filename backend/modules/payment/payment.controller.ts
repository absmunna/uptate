import { Request, Response } from 'express';
import { IPaymentProvider } from './interfaces/PaymentProvider';

// Placeholder strategy until actual providers are injected
const providers: Record<string, IPaymentProvider> = {};

export const registerProvider = (provider: IPaymentProvider) => {
  providers[provider.name] = provider;
};

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, providerName, userId } = req.body;
    
    const provider = providers[providerName];
    if (!provider) return res.status(400).json({ error: 'Unsupported provider' });

    const response = await provider.initiate({ orderId, amount, userId });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transactionId, providerName } = req.body;
    const provider = providers[providerName];
    if (!provider) return res.status(400).json({ error: 'Unsupported provider' });
    
    const response = await provider.verify(transactionId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
};
