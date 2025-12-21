import { Coinbase } from '@coinbase/cdp-sdk'

let coinbase: any = null;

try {
  if (process.env.CDP_API_KEY_NAME && process.env.CDP_PRIVATE_KEY) {
    coinbase = new Coinbase({
      apiKeyName: process.env.CDP_API_KEY_NAME,
      privateKey: process.env.CDP_PRIVATE_KEY
    });
  }
} catch (error) {
  console.warn('Coinbase CDP not configured:', error);
}

export async function verifyPayment(paymentProof: string, expectedAmount: string): Promise<boolean> {
  if (!coinbase) {
    // Mock payment verification for testing
    console.log('Mock payment verification:', paymentProof, expectedAmount);
    return paymentProof.startsWith('tx:');
  }
  
  try {
    const txHash = paymentProof.split(':')[1];
    if (!txHash) return false;
    
    // This would verify the actual transaction
    // For now, return true for any tx: format
    return true;
  } catch (error) {
    console.error('Payment verification failed:', error);
    return false;
  }
}

export function calculatePrice(sizeInBytes: number, pricePerMB: number): string {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  const cost = Math.max(sizeInMB * pricePerMB, 0.001); // Minimum $0.001
  return `$${cost.toFixed(6)}`;
}