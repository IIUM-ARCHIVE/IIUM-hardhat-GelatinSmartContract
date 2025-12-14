import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { network } from "hardhat";

describe("Halal Gelatin Supply Chain", async function () {
  const { viem } = await network.connect();
  let publicClient;
  let wallets;
  let admin, farm, jakim, factory, candyMaker;
  let contract;

  beforeEach(async function () {
    publicClient = await viem.getPublicClient();
    wallets = await viem.getWalletClients();
    [admin, farm, jakim, factory, candyMaker] = wallets;

    contract = await viem.deployContract("HalalGelatinSupplyChain", [], { client: admin });

    await contract.write.addProducer([farm.account.address], { client: admin, account: admin.account });
    await contract.write.addAuthority([jakim.account.address], { client: admin, account: admin.account });
    await contract.write.addDistributor([factory.account.address], { client: admin, account: admin.account });
    await contract.write.addRetailer([candyMaker.account.address], { client: admin, account: admin.account });
  });

  it("executes full flow Farm -> JAKIM -> Factory", async function () {
    const batchId = "GEL-101";

    await contract.write.createBatch([batchId, "Raw Bovine Bones"], { client: farm, account: farm.account });
    const batchAfterCreate = await contract.read.getBatch([batchId]);
    assert.equal(batchAfterCreate.status, "Slaughtered");

    await contract.write.setHalalCertificate([batchId, "IPFS_HASH_CERT_123"], { client: jakim, account: jakim.account });
    const batchAfterCert = await contract.read.getBatch([batchId]);
    assert.equal(batchAfterCert.isCertified, true);

    await contract.write.transferBatch([batchId, factory.account.address], { client: farm, account: farm.account });
    const batchAfterTransfer = await contract.read.getBatch([batchId]);
    assert.equal(batchAfterTransfer.currentOwner.toLowerCase(), factory.account.address.toLowerCase());

    await contract.write.updateStatus([batchId, "Processed & Extracted", "Gelatin Powder Grade A"], { client: factory, account: factory.account });
    const finalBatch = await contract.read.getBatch([batchId]);
    assert.equal(finalBatch.productName, "Gelatin Powder Grade A");
    assert.equal(finalBatch.status, "Processed & Extracted");
  });
});