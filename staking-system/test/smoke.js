import assert from "node:assert/strict";
import { network } from "hardhat";

async function main() {
  const connection = await network.connect();
  const { ethers, provider } = connection;
  const [owner, alice] = await ethers.getSigners();

  const factory = await ethers.getContractFactory("TipmasMOLStaking");
  const staking = await factory.deploy(1200, 3600);
  await staking.waitForDeployment();

  await staking.connect(owner).fundRewards({ value: ethers.parseEther("20") });
  await staking.connect(alice).stake({ value: ethers.parseEther("5") });

  await provider.send("evm_increaseTime", [3600 * 24 * 14]);
  await provider.send("evm_mine", []);

  const pending = await staking.pendingRewards(alice.address);
  assert.ok(pending > 0n, "expected rewards to accrue");

  await staking.connect(alice).claimRewards();
  const afterClaimPending = await staking.pendingRewards(alice.address);
  assert.equal(afterClaimPending, 0n, "expected pending rewards to reset");

  await provider.send("evm_increaseTime", [3601]);
  await provider.send("evm_mine", []);
  await staking.connect(alice).unstake(ethers.parseEther("5"));

  const [remainingStake] = await staking.positionOf(alice.address);
  assert.equal(remainingStake, 0n, "expected full unstake");

  console.log("Smoke test passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
