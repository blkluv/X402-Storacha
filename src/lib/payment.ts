// REMOVE THIS LINE:
// import { Coinbase } from '@coinbase/cdp-sdk';

let coinbase: any = null;

try {
  if (process.env.CDP_API_KEY_NAME && process.env.CDP_PRIVATE_KEY) {
    console.log('CDP configured but using mock implementation');
  }
} catch (error) {
  console.warn('Coinbase CDP not configured:', error);
}

export async function verifyPayment(paymentProof: string, expectedAmount: string): Promise<boolean> {
  console.log('Mock payment verification:', paymentProof, expectedAmount);
  return paymentProof.startsWith('tx:') && paymentProof.length > 5;
}

export function calculatePrice(sizeInBytes: number, pricePerMB: number): string {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  const cost = Math.max(sizeInMB * pricePerMB, 0.001);
  return `$${cost.toFixed(6)}`;
}