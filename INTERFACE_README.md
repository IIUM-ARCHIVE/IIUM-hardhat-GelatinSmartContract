# Halal Gelatin Supply Chain Interface

A complete web-based interface for managing halal gelatin supply chain with QR code tracking, built with Express, Web3.js, and ethers.js.

## Features

- **Role-Based Dashboards**: Separate interfaces for Admin, Producer, Authority, Distributor, and Retailer
- **QR Code Generation**: Generate scannable QR codes for final products with batch tracking links
- **Consumer Tracking**: Public-facing page to track batch journey from farm to consumer
- **Blockchain Integration**: Direct contract interaction via MetaMask or other Web3 wallets
- **Real-time Status Updates**: Track batch status at each stage of supply chain
- **Complete Audit Trail**: Full transparency of halal certification and ownership transfers

## Quick Start

### 1. Install Dependencies

```powershell
npm install
```

### 2. Deploy the Smart Contract

```powershell
npm run deploy
```

This will deploy to the hardhatMainnet (simulated network) and output the contract address. Update the address in `server.js` if needed.

### 3. Start the Server

```powershell
npm run server
```

The interface will be available at: **http://localhost:3000**

### 4. (Optional) Run with Hardhat Node

For local blockchain testing:

```powershell
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npm run deploy

# Terminal 3: Start web server
npm run server
```

## Dashboard Routes

| Route | Purpose | User |
|-------|---------|------|
| `/` | Main dashboard with navigation | Everyone |
| `/admin` | Grant roles to participants | Admin (Deployer) |
| `/producer` | Create and transfer batches | Farm/Slaughterhouse |
| `/authority` | Certify batches | JAKIM/Halal Authority |
| `/distributor` | Process and distribute | Gelatin Factory |
| `/retailer` | Generate QR codes | Candy Manufacturer |
| `/track.html` | Track batch (public) | Consumers |

## Terminal-only Usage (no frontend)

If you can’t or don’t want to use the web UI, you can drive the contract from the Hardhat console.

```powershell
# 1) Start a local node (or use your chosen network)
npx hardhat node

# 2) In a new terminal, open the console on that network
npx hardhat console --network hardhatMainnet
# or for the local node: npx hardhat console --network localhost
```

Inside the console, run commands like these (replace the contract address if different):

```javascript
const { viem } = await hre.network.connect();
const wallets = await viem.getWalletClients();
const [admin, producer, authority, distributor, retailer] = wallets;
const contract = await viem.getContractAt(
  "HalalGelatinSupplyChain",
  "0x5fbdb2315678afecb367f032d93f642f64180aa3"
);

// Grant roles (admin signs by default)
await contract.write.addProducer([producer.account.address]);
await contract.write.addAuthority([authority.account.address]);
await contract.write.addDistributor([distributor.account.address]);
await contract.write.addRetailer([retailer.account.address]);

// Producer creates a batch
await contract.write.createBatch([
  "GEL-CLI-001",
  "Raw Bovine Bones"
], { account: producer.account });

// Authority certifies
await contract.write.setHalalCertificate([
  "GEL-CLI-001",
  "QmCertHash123"
], { account: authority.account });

// Producer transfers to distributor
await contract.write.transferBatch([
  "GEL-CLI-001",
  distributor.account.address
], { account: producer.account });

// Distributor updates status
await contract.write.updateStatus([
  "GEL-CLI-001",
  "Processed & Extracted",
  "Gelatin Powder Grade A"
], { account: distributor.account });

// Distributor transfers to retailer
await contract.write.transferBatch([
  "GEL-CLI-001",
  retailer.account.address
], { account: distributor.account });

// Retailer marks ready for consumer
await contract.write.updateStatus([
  "GEL-CLI-001",
  "Ready for Consumer",
  "Gummy Bears - Halal"
], { account: retailer.account });

// Read batch
await contract.read.getBatch(["GEL-CLI-001"]);
```

If you are on another network, swap `--network hardhatMainnet` for the correct network and replace the contract address accordingly.

## How to Use

### Admin Setup

1. Go to **http://localhost:3000/admin**
2. Connect your wallet (should be the deployer address)
3. Add addresses for each role:
   - Producer address
   - Halal Authority address
   - Distributor address
   - Retailer address

### Producer Workflow

1. Go to **http://localhost:3000/producer**
2. Connect wallet
3. **Create Batch**: Enter Batch ID (e.g., `GEL-2025-001`) and Product Name
4. **Transfer to Factory**: After certification, transfer to factory address

### Authority Workflow

1. Go to **http://localhost:3000/authority**
2. Connect wallet
3. **Certify Batch**: Enter batch ID and certification hash (IPFS hash or URL)
4. Batch now shows as certified

### Distributor Workflow

1. Go to **http://localhost:3000/distributor**
2. Connect wallet
3. **Update Status**: Change status and optionally update product name (e.g., "Raw Bones" → "Gelatin Powder")
4. **Transfer to Retailer**: Send processed batch to retailer

### Retailer Workflow

1. Go to **http://localhost:3000/retailer**
2. Connect wallet
3. **Update Status**: Mark as "Ready for Consumer" and add final product name
4. **Generate QR Code**: Create scannable QR code for product packaging
5. Print and attach QR code to packaging

### Consumer Tracking

1. Customer scans QR code on product packaging
2. Automatically redirected to tracking page
3. **OR** manually enter batch ID on **http://localhost:3000/track.html**
4. See:
   - Batch information
   - Halal certification status
   - Complete supply chain timeline
   - Producer, factory, and retailer info

## Environment Variables

If you are on another network, swap `--network hardhatMainnet` for the correct network and replace the contract address accordingly.

Optional configuration in `.env`:

```
PORT=3000
CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
RPC_URL=http://localhost:8545
BASE_URL=http://localhost:3000
```

## API Endpoints

### POST `/api/generate-qr`

Generate QR code for a batch.

**Request:**
```json
{
  "batchId": "GEL-2025-001"
}
```

**Response:**
```json
{
  "success": true,
  "qrCode": "data:image/png;base64,...",
  "trackingUrl": "http://localhost:3000/track.html?batchId=...",
  "batchId": "GEL-2025-001"
}
```

### GET `/api/config`

Get contract configuration.

**Response:**
```json
{
  "contractAddress": "0x...",
  "rpcUrl": "http://localhost:8545"
}
```

## Testing the Flow

### Using MetaMask Testnet Accounts

The Hardhat network provides 20 test accounts. You can import them into MetaMask using the private keys from `npx hardhat node` output.

**Example Test Flow:**
```
Admin (Account 0) → Deploy contract & grant roles
Producer (Account 1) → Create batch GEL-TEST-001
Authority (Account 2) → Certify batch
Distributor (Account 3) → Process and transfer
Retailer (Account 4) → Generate QR and finalize
Consumer → Scan QR and track
```

## File Structure

```
├── public/
│   ├── index.html              # Main dashboard
│   ├── admin.html              # Admin panel
│   ├── producer.html           # Producer dashboard
│   ├── authority.html          # Authority dashboard
│   ├── distributor.html        # Distributor dashboard
│   ├── retailer.html           # Retailer dashboard (QR generation)
│   ├── track.html              # Consumer tracking page
│   └── js/
│       ├── config.js           # Configuration helper
│       └── abi.js              # Contract ABI
├── scripts/
│   └── deploy.js               # Deployment script
├── contracts/
│   └── HalalGelatin.sol        # Smart contract
├── server.js                   # Express server
└── package.json
```

## Troubleshooting

### "Cannot find package 'express'"
```powershell
npm install
```

### "Contract Address is undefined"
Make sure to:
1. Deploy the contract: `npm run deploy`
2. Copy the contract address from deployment output
3. Update `CONTRACT_ADDRESS` in `server.js` or set in `.env`

### "MetaMask not detected"
- Ensure MetaMask browser extension is installed
- Switch to appropriate network (Hardhat, Sepolia, etc.)
- Reload the page

### RPC Connection Error
If using localhost and contract is not found:
1. Start Hardhat node: `npx hardhat node`
2. Deploy contract to that node: `npx hardhat run scripts/deploy.js --network localhost`
3. Set `RPC_URL=http://localhost:8545` in server config

## Security Notes

⚠️ **For Development Only**

This interface is designed for development and testing. For production:
- Use HTTPS
- Implement proper authentication
- Add CSRF protection
- Validate all inputs on backend
- Use environment variables for sensitive data
- Add rate limiting
- Implement proper error handling and logging

## License

MIT

## Support

For issues or questions, check:
- `contracts/HalalGelatin.sol` - Contract documentation
- `test/HalalGelatin.js` - Test examples
- Hardhat docs: https://hardhat.org
