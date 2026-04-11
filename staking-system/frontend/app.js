import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.16.0/+esm";
import { STAKING_ABI, STAKING_CONTRACT_ADDRESS, TIPMAS_NETWORK } from "./config.js";

const state = {
  provider: null,
  signer: null,
  account: null,
  staking: null,
};

const els = {
  connectBtn: document.getElementById("connectBtn"),
  refreshBtn: document.getElementById("refreshBtn"),
  stakeBtn: document.getElementById("stakeBtn"),
  unstakeBtn: document.getElementById("unstakeBtn"),
  claimBtn: document.getElementById("claimBtn"),
  fundBtn: document.getElementById("fundBtn"),
  status: document.getElementById("status"),
  wallet: document.getElementById("wallet"),
  network: document.getElementById("network"),
  contract: document.getElementById("contract"),
  apr: document.getElementById("apr"),
  lock: document.getElementById("lock"),
  totalStaked: document.getElementById("totalStaked"),
  rewardPool: document.getElementById("rewardPool"),
  myStake: document.getElementById("myStake"),
  myRewards: document.getElementById("myRewards"),
  unlockAt: document.getElementById("unlockAt"),
  stakeAmount: document.getElementById("stakeAmount"),
  unstakeAmount: document.getElementById("unstakeAmount"),
  fundAmount: document.getElementById("fundAmount"),
  txList: document.getElementById("txList"),
};

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.className = isError ? "error" : "";
}

function formatMol(value) {
  return `${ethers.formatEther(value)} MOL`;
}

function pushTx(hash, label) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = `${TIPMAS_NETWORK.txExplorerBase}/${hash}`;
  a.target = "_blank";
  a.rel = "noreferrer";
  a.textContent = `${label}: ${hash}`;
  li.appendChild(a);
  els.txList.prepend(li);
}

async function ensureTipmasNetwork() {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId.toLowerCase() === TIPMAS_NETWORK.chainIdHex) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: TIPMAS_NETWORK.chainIdHex }],
    });
  } catch (switchError) {
    if (switchError.code !== 4902) throw switchError;
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: TIPMAS_NETWORK.chainIdHex,
          chainName: TIPMAS_NETWORK.chainName,
          rpcUrls: TIPMAS_NETWORK.rpcUrls,
          nativeCurrency: TIPMAS_NETWORK.nativeCurrency,
          blockExplorerUrls: TIPMAS_NETWORK.blockExplorerUrls,
        },
      ],
    });
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("MetaMask is required for this dashboard.", true);
    return;
  }
  if (STAKING_CONTRACT_ADDRESS.startsWith("0x0000")) {
    setStatus("Set frontend/config.js with your deployed contract address first.", true);
    return;
  }

  try {
    await ensureTipmasNetwork();
    state.provider = new ethers.BrowserProvider(window.ethereum);
    await state.provider.send("eth_requestAccounts", []);
    state.signer = await state.provider.getSigner();
    state.account = await state.signer.getAddress();
    state.staking = new ethers.Contract(STAKING_CONTRACT_ADDRESS, STAKING_ABI, state.signer);

    const network = await state.provider.getNetwork();
    els.wallet.textContent = state.account;
    els.network.textContent = `${network.name || "TIPMAS"} (${network.chainId})`;
    els.contract.textContent = STAKING_CONTRACT_ADDRESS;
    setStatus("Wallet connected.");
    await refreshData();
  } catch (error) {
    console.error(error);
    setStatus(error.shortMessage || error.message || "Wallet connect failed.", true);
  }
}

async function refreshData() {
  if (!state.staking || !state.account) return;

  try {
    const [aprBps, lockDuration, totalStaked, rewardPool, position, pending] = await Promise.all([
      state.staking.aprBps(),
      state.staking.lockDuration(),
      state.staking.totalStaked(),
      state.staking.availableRewardsPool(),
      state.staking.positionOf(state.account),
      state.staking.pendingRewards(state.account),
    ]);

    els.apr.textContent = `${Number(aprBps) / 100}%`;
    els.lock.textContent = `${Number(lockDuration)} seconds`;
    els.totalStaked.textContent = formatMol(totalStaked);
    els.rewardPool.textContent = formatMol(rewardPool);
    els.myStake.textContent = formatMol(position.amount);
    els.myRewards.textContent = formatMol(pending);
    els.unlockAt.textContent =
      Number(position.unlockAt) === 0
        ? "-"
        : new Date(Number(position.unlockAt) * 1000).toLocaleString();
  } catch (error) {
    console.error(error);
    setStatus("Failed to refresh dashboard data.", true);
  }
}

async function stake() {
  const amount = els.stakeAmount.value.trim();
  if (!amount) return setStatus("Enter stake amount.", true);

  try {
    const tx = await state.staking.stake({ value: ethers.parseEther(amount) });
    setStatus("Stake transaction sent.");
    pushTx(tx.hash, "Stake");
    await tx.wait();
    await refreshData();
    setStatus("Stake successful.");
  } catch (error) {
    console.error(error);
    setStatus(error.shortMessage || error.message || "Stake failed.", true);
  }
}

async function unstake() {
  const amount = els.unstakeAmount.value.trim();
  if (!amount) return setStatus("Enter unstake amount.", true);

  try {
    const tx = await state.staking.unstake(ethers.parseEther(amount));
    setStatus("Unstake transaction sent.");
    pushTx(tx.hash, "Unstake");
    await tx.wait();
    await refreshData();
    setStatus("Unstake successful.");
  } catch (error) {
    console.error(error);
    setStatus(error.shortMessage || error.message || "Unstake failed.", true);
  }
}

async function claimRewards() {
  try {
    const tx = await state.staking.claimRewards();
    setStatus("Claim transaction sent.");
    pushTx(tx.hash, "Claim");
    await tx.wait();
    await refreshData();
    setStatus("Rewards claimed.");
  } catch (error) {
    console.error(error);
    setStatus(error.shortMessage || error.message || "Claim failed.", true);
  }
}

async function fundRewards() {
  const amount = els.fundAmount.value.trim();
  if (!amount) return setStatus("Enter funding amount.", true);

  try {
    const tx = await state.staking.fundRewards({ value: ethers.parseEther(amount) });
    setStatus("Funding transaction sent.");
    pushTx(tx.hash, "Fund rewards");
    await tx.wait();
    await refreshData();
    setStatus("Reward pool funded.");
  } catch (error) {
    console.error(error);
    setStatus(error.shortMessage || error.message || "Funding failed.", true);
  }
}

els.connectBtn.addEventListener("click", connectWallet);
els.refreshBtn.addEventListener("click", refreshData);
els.stakeBtn.addEventListener("click", stake);
els.unstakeBtn.addEventListener("click", unstake);
els.claimBtn.addEventListener("click", claimRewards);
els.fundBtn.addEventListener("click", fundRewards);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", connectWallet);
  window.ethereum.on("chainChanged", connectWallet);
}
