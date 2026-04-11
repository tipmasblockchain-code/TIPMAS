import { network } from "hardhat";

const APR_BPS = Number(process.env.INITIAL_APR_BPS ?? 1200); // 12%
const LOCK_DURATION_SECONDS = Number(process.env.LOCK_DURATION_SECONDS ?? 60 * 60 * 24 * 7); // 7 days
const EXPLORER_TX_BASE = "https://explorer.tipmas.co/tx";

async function main() {
  const { ethers } = await network.connect();
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log(`Deploying with ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} MOL`);
  console.log(`Config: APR=${APR_BPS / 100}% lock=${LOCK_DURATION_SECONDS}s`);

  const factory = await ethers.getContractFactory("TipmasMOLStaking");
  const staking = await factory.deploy(APR_BPS, LOCK_DURATION_SECONDS);
  await staking.waitForDeployment();

  const deployTx = staking.deploymentTransaction();
  const address = await staking.getAddress();

  console.log(`TipmasMOLStaking deployed at: ${address}`);
  if (deployTx?.hash) {
    console.log(`Deployment tx: ${deployTx.hash}`);
    console.log(`Explorer: ${EXPLORER_TX_BASE}/${deployTx.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
