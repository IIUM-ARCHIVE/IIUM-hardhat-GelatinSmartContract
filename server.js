import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Use absolute path for public directory
const publicPath = path.resolve(__dirname, "public");
console.log("Serving static files from:", publicPath);

app.use(express.json());
app.use(express.static(publicPath));

// Contract details (update after deployment)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";

// Generate QR code for batch tracking
app.post("/api/generate-qr", async (req, res) => {
  try {
    const { batchId } = req.body;
    if (!batchId) {
      return res.status(400).json({ error: "batchId is required" });
    }

    // Create tracking URL
    const trackingUrl = `${process.env.BASE_URL || `http://localhost:${PORT}`}/track.html?batchId=${encodeURIComponent(batchId)}&contract=${CONTRACT_ADDRESS}`;
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(trackingUrl);
    
    res.json({
      success: true,
      qrCode,
      trackingUrl,
      batchId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve main pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin.html"));
});

app.get("/producer", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/producer.html"));
});

app.get("/authority", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/authority.html"));
});

app.get("/distributor", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/distributor.html"));
});

app.get("/retailer", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/retailer.html"));
});

app.get("/track.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/track.html"));
});

// Provide contract details to frontend
app.get("/api/config", (req, res) => {
  res.json({
    contractAddress: CONTRACT_ADDRESS,
    rpcUrl: RPC_URL,
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 HalalGelatin Interface running on http://localhost:${PORT}`);
  console.log(`\n📋 Routes:`);
  console.log(`   http://localhost:${PORT}/ - Main Dashboard`);
  console.log(`   http://localhost:${PORT}/admin - Admin Panel`);
  console.log(`   http://localhost:${PORT}/producer - Producer Dashboard`);
  console.log(`   http://localhost:${PORT}/authority - Authority Dashboard`);
  console.log(`   http://localhost:${PORT}/distributor - Distributor Dashboard`);
  console.log(`   http://localhost:${PORT}/retailer - Retailer Dashboard`);
  console.log(`   http://localhost:${PORT}/track.html?batchId=... - Batch Tracking (Consumer)\n`);
  console.log(`⚙️  Environment:`);
  console.log(`   CONTRACT_ADDRESS: ${CONTRACT_ADDRESS}`);
  console.log(`   RPC_URL: ${RPC_URL}\n`);
});
