import { NextRequest, NextResponse } from "next/server";
import { retrieveFromStoracha } from "../../../lib/storacha";
import { verifyPayment } from "../../../lib/payment";

const RETRIEVE_PRICE = "$0.0005";

export async function GET(request: NextRequest) {
  try {
    const paymentHeader = request.headers.get('x402-payment');
    
    if (!paymentHeader) {
      return NextResponse.json(
        { error: "Payment required" },
        { 
          status: 402,
          headers: {
            'X-Payment-Required': 'true',
            'X-Price': RETRIEVE_PRICE,
            'X-Payment-Address': process.env.PAYMENT_ADDRESS || '0x742d35Cc6634C0532925a3b8D0C9e3e0C0C0C0C0',
            'X-Network': process.env.NETWORK || 'base-sepolia'
          }
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');
    
    if (!cid) {
      return NextResponse.json({ error: 'CID parameter required' }, { status: 400 });
    }

    // Verify payment
    const paymentValid = await verifyPayment(paymentHeader, RETRIEVE_PRICE);
    if (!paymentValid) {
      return NextResponse.json(
        { error: "Invalid payment" },
        { status: 402 }
      );
    }

    // Retrieve from Storacha
    const fileData = await retrieveFromStoracha(cid);
    
   return new NextResponse(fileData as any,  {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Cost': RETRIEVE_PRICE,
        'X-CID': cid
      }
    });
  } catch (error) {
    console.error('Retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}