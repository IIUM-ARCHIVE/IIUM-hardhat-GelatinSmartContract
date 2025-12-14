import { network } from "hardhat";

async function main() {
  console.log("Deploying HalalGelatinSupplyChain contract...");
  
  const { viem } = await network.connect();
  const [deployer] = await viem.getWalletClients();
  
  console.log("Deploying with account:", deployer.account.address);

  // Deploy the contract
  const contract = await viem.deployContract("HalalGelatinSupplyChain", [], {
    client: deployer,
  });

  console.log("\n✅ HalalGelatinSupplyChain deployed to:", contract.address);
  console.log("Admin (deployer):", deployer.account.address);
  
  console.log("\n📋 Next steps:");
  console.log("1. Save this contract address for future interactions");
  console.log("2. Use addProducer(), addAuthority(), addDistributor(), addRetailer()");
  console.log("   to grant roles to specific addresses");
  console.log("\nExample role assignment:");
  console.log(`await contract.write.addProducer(["<farm_address>"])`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
