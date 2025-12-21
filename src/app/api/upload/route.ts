import { NextRequest, NextResponse } from "next/server";
import { uploadToStoracha } from "../../../lib/storacha";
import { verifyPayment, calculatePrice } from "../../../lib/payment";

const PRICE_PER_MB = 0.001;

export async function POST(request: NextRequest) {
  try {
    const paymentHeader = request.headers.get('x402-payment');
    
    // Get file first to calculate exact price
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const exactPrice = calculatePrice(file.size, PRICE_PER_MB);
    
    if (!paymentHeader) {
      return NextResponse.json(
        { error: "Payment required" },
        { 
          status: 402,
          headers: {
            'X-Payment-Required': 'true',
            'X-Price': exactPrice,
            'X-Payment-Address': process.env.PAYMENT_ADDRESS || '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0',
            'X-Network': process.env.NETWORK || 'base-sepolia'
          }
        }
      );
    }

    // Verify payment
    const paymentValid = await verifyPayment(paymentHeader, exactPrice);
    if (!paymentValid) {
      return NextResponse.json(
        { error: "Invalid payment" },
        { status: 402 }
      );
    }

    // Upload to Storacha
    const cid = await uploadToStoracha(file);
    
    return NextResponse.json({
      success: true,
      cid,
      filename: file.name,
      size: file.size,
      cost: exactPrice
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const paymentHeader = request.headers.get('x402-payment');
  
  if (!paymentHeader) {
    return NextResponse.json(
      { error: "Payment required" },
      { 
        status: 402,
        headers: {
          'X-Payment-Required': 'true',
          'X-Price': '$0.001',
          'X-Payment-Address': process.env.PAYMENT_ADDRESS || '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0',
          'X-Network': process.env.NETWORK || 'base-sepolia'
        }
      }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Upload API working with payment",
    timestamp: new Date().toISOString()
  });
}