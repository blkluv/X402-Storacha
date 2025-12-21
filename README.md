# x402-Gated Storacha API ✅

A pay-per-use storage API that combines x402 payments with Storacha decentralized storage. Agents can upload and retrieve files by paying with cryptocurrency - no API keys or signup required.

## ✅ Working Features

- **Pay-per-upload**: Dynamic pricing based on file size ($0.001 per MB)
- **Pay-per-retrieve**: $0.0005 per file retrieved  
- **Real Storacha integration**: Actual IPFS storage via Storacha client
- **Payment verification**: Coinbase CDP SDK integration
- **No signup required**: Just pay and store
- **402 Payment Required**: Proper x402 protocol responses
- **Payment headers**: Address, network, and pricing info

## Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (`.env.local`):
```bash
# x402 Configuration
PAYMENT_ADDRESS=your-payment-address
NETWORK=base-sepolia

# Storacha Configuration  
STORACHA_EMAIL=your-email@example.com
STORACHA_SPACE_DID=did:key:your-space-did

# Coinbase CDP
CDP_API_KEY_NAME=your-cdp-key
CDP_PRIVATE_KEY=your-private-key
```

3. **Run the API**:
```bash
npm run dev
```

4. **Test the API**:
```bash
npm test
```

## API Usage

### Upload File (Requires Payment)
```bash
curl -X POST http://localhost:3002/api/upload \
  -F "file=@yourfile.txt"
# Returns: 402 Payment Required with exact pricing

# With payment:
curl -X POST http://localhost:3002/api/upload \
  -F "file=@yourfile.txt" \
  -H "x402-payment: tx:your-payment-hash"
# Returns: Real CID from Storacha
```

### Retrieve File (Requires Payment)
```bash
curl "http://localhost:3002/api/retrieve?cid=your-cid"
# Returns: 402 Payment Required

# With payment:
curl "http://localhost:3002/api/retrieve?cid=your-cid" \
  -H "x402-payment: tx:your-payment-hash"
# Returns: Actual file data from IPFS
```

## Payment Integration

When you get a 402 response:
1. Pay to the address in `X-Payment-Address` header
2. Include payment proof in `x402-payment` header format: `tx:transaction-hash`
3. Retry the request

## Architecture

- **Next.js API Routes**: Handle HTTP requests and x402 protocol
- **Storacha Client**: Real IPFS storage and retrieval
- **Coinbase CDP SDK**: Payment verification on Base Sepolia
- **Dynamic Pricing**: Exact costs calculated per file size

## Status: ✅ COMPLETE

Full x402-gated Storacha implementation with:
- Real decentralized storage
- Cryptocurrency payment verification
- Dynamic pricing
- No signup required