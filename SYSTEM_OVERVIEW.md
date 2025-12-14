# Halal Gelatin Supply Chain - Complete System Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CONSUMER                                 │
│                    Scans QR Code                                 │
│                        ↓                                          │
│            http://localhost:3000/track.html                      │
│            (Shows complete batch history)                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│     WEB INTERFACE (Express Server)    │
│         http://localhost:3000         │
├──────────────────────────────────────┤
│ ✓ Admin Dashboard       → Role Mgmt   │
│ ✓ Producer Dashboard    → Create/Send │
│ ✓ Authority Dashboard   → Certify     │
│ ✓ Distributor Dashboard → Process     │
│ ✓ Retailer Dashboard    → QR Codes    │
│ ✓ Tracking Page         → Public View │
└──────────────────────────────────────┘
         ↓ (Web3.js/ethers.js)
┌──────────────────────────────────────┐
│    SMART CONTRACT (HalalGelatin)     │
│      Ethereum Blockchain              │
├──────────────────────────────────────┤
│ Functions:                            │
│ • createBatch()                      │
│ • setHalalCertificate()              │
│ • transferBatch()                    │
│ • updateStatus()                     │
│ • getBatch()                         │
├──────────────────────────────────────┤
│ Events:                               │
│ • BatchCreated                       │
│ • HalalCertified                     │
│ • BatchTransferred                   │
│ • StatusUpdated                      │
└──────────────────────────────────────┘
```

## Supply Chain Flow with Interface

```
1. ADMIN SETUP
   ├─ Go to: http://localhost:3000/admin
   ├─ Connect MetaMask (Deployer Account)
   └─ Grant roles to:
      ├─ Producer Address
      ├─ Authority Address
      ├─ Distributor Address
      └─ Retailer Address

2. PRODUCER CREATES BATCH
   ├─ Go to: http://localhost:3000/producer
   ├─ Connect MetaMask (Producer Account)
   ├─ Create Batch:
   │  └─ BatchID: GEL-2025-001
   │     ProductName: Raw Bovine Bones
   └─ Status: "Slaughtered"
      Owner: Producer

3. AUTHORITY CERTIFIES
   ├─ Go to: http://localhost:3000/authority
   ├─ Connect MetaMask (Authority Account)
   ├─ Certify Batch:
   │  ├─ BatchID: GEL-2025-001
   │  └─ CertHash: QmXxxx... (IPFS)
   └─ Status: "Halal Certified"
      Certified: ✅ YES

4. PRODUCER TRANSFERS
   ├─ Go to: http://localhost:3000/producer
   ├─ Transfer to Factory:
   │  ├─ BatchID: GEL-2025-001
   │  └─ Factory Address: 0x...
   └─ Status: "In Transit"
      Owner: Distributor

5. DISTRIBUTOR PROCESSES
   ├─ Go to: http://localhost:3000/distributor
   ├─ Update Status:
   │  ├─ BatchID: GEL-2025-001
   │  ├─ Status: Processed & Extracted
   │  └─ ProductName: Gelatin Powder Grade A
   └─ Transfer to Retailer:
      ├─ BatchID: GEL-2025-001
      └─ Retailer Address: 0x...

6. RETAILER FINALIZES & QR
   ├─ Go to: http://localhost:3000/retailer
   ├─ Update Status:
   │  ├─ Status: Ready for Consumer
   │  └─ ProductName: Gummy Bears - Halal
   ├─ Generate QR Code:
   │  ├─ BatchID: GEL-2025-001
   │  └─ QR Code URL: http://localhost:3000/track.html?batchId=GEL-2025-001
   └─ Print QR on Packaging

7. CONSUMER SCANS QR
   ├─ Scans QR code on product
   ├─ Redirected to: http://localhost:3000/track.html?batchId=GEL-2025-001
   ├─ Sees:
   │  ├─ Batch Information
   │  ├─ ✅ HALAL CERTIFIED Badge
   │  ├─ Producer: Farm Address
   │  ├─ Certification Hash
   │  └─ Supply Chain Timeline:
   │     ├─ 🌾 Farm - Slaughter
   │     ├─ ✔️  Halal Authority Certification
   │     ├─ 🏭 Factory Processing
   │     ├─ 📦 Distribution
   │     └─ 🛍️ Consumer Ready
   └─ Verifies: Farm → JAKIM → Factory → Retailer
```

## Tech Stack

```
Frontend:
├─ HTML5 / CSS3 / JavaScript
├─ ethers.js (Web3 Library)
├─ MetaMask Integration
└─ QR Code JS Library

Backend:
├─ Node.js
├─ Express.js
├─ QRCode npm package
└─ Port: 3000

Blockchain:
├─ Solidity Smart Contract
├─ Hardhat (Development Framework)
├─ Ethereum EVM Compatible Chain
└─ JSON-RPC Interface

Database:
└─ Blockchain (Immutable Ledger)
```

## User Roles & Permissions Matrix

```
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Function │  Admin   │ Producer │Authority │Distributor│ Retailer │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ addRole  │    ✅    │    ❌    │    ❌    │    ❌    │    ❌    │
│ create   │    ❌    │    ✅    │    ❌    │    ❌    │    ❌    │
│ certify  │    ❌    │    ❌    │    ✅    │    ❌    │    ❌    │
│ transfer │    ❌    │   Owner  │    ❌    │   Owner  │   Owner  │
│ update   │    ❌    │   Owner  │    ❌    │   Owner  │   Owner  │
│ view     │    ✅    │    ✅    │    ✅    │    ✅    │    ✅    │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘

Owner: Only if you currently own the batch
```

## Key Features

### 1. Real-time Web Interface
- Dashboard for each role
- Live MetaMask wallet integration
- Transaction status feedback
- Success/Error notifications

### 2. QR Code System
```
Product Packaging
     ↓
   [QR CODE]
     ↓
http://localhost:3000/track.html?batchId=GEL-2025-001
     ↓
Batch Details + Timeline
```

### 3. Public Tracking Page
- No wallet required
- Shows batch info
- Displays halal certification status
- Timeline visualization
- Accessible via QR code

### 4. Role-Based Access
- Each role has dedicated dashboard
- Restricted functions (modifiers in contract)
- Progressive workflow enforcement

## Installation & Running

### Quick Start
```powershell
# Option 1: Using setup script
.\setup.ps1

# Option 2: Manual steps
npm install
npm run deploy
npm run server
# Then visit http://localhost:3000
```

### With Local Hardhat Node
```powershell
# Terminal 1: Start blockchain
npx hardhat node

# Terminal 2: Deploy contract
npm run deploy

# Terminal 3: Start web server
npm run server
```

## Example Batch Tracking

### Batch ID: GEL-2025-001

**Timeline:**
```
Date: 2025-01-15
🌾 Farm Creation
├─ Batch: GEL-2025-001
├─ Product: Raw Bovine Bones
├─ Producer: 0x8ba1f109551bd432803012645ac136ddd64dba72
└─ Status: Slaughtered

Date: 2025-01-16
✔️ Halal Certification
├─ Authority: 0xfcd52cd098633e0aaef40767fa8fbffb2a3c7a8f
├─ Hash: QmXxxx...
└─ Status: Halal Certified ✅

Date: 2025-01-17
🏭 Factory Processing
├─ Owner: 0x227762c6ba0f59b34d4e6bdc2f6fae5cf6f6ddf4
├─ Product: Gelatin Powder Grade A
└─ Status: Processed & Extracted

Date: 2025-01-18
📦 Distribution
├─ Owner: 0x5d4f8b7e9c1d3f2a4b6e8c0d2a4f6e8c0d2a4b6e
└─ Status: In Transit

Date: 2025-01-19
🛍️ Ready for Consumer
├─ Retailer: 0x5d4f8b7e9c1d3f2a4b6e8c0d2a4f6e8c0d2a4b6e
├─ Final Product: Gummy Bears - Halal
└─ Status: Ready for Consumer ✅
```

## Security & Transparency

✅ **Immutable Records**: All transactions recorded on blockchain
✅ **Halal Verification**: Authority certification stored on-chain
✅ **Ownership Tracking**: Clear chain of custody
✅ **Public Auditability**: Consumers can verify entire supply chain
✅ **Role-Based Access**: Only authorized parties can perform actions

## Support & Troubleshooting

See `INTERFACE_README.md` for detailed setup and troubleshooting guide.

---

**System Status**: 🟢 All Components Ready
- Smart Contract: ✅ Deployed
- Web Server: ✅ Running on port 3000
- QR System: ✅ Functional
- Blockchain: ✅ Connected
