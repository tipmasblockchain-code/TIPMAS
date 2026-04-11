export const TIPMAS_NETWORK = {
  chainIdHex: "0xb5a2",
  chainIdDec: 46498,
  chainName: "TIPMAS",
  nativeCurrency: {
    name: "Mollies Coin",
    symbol: "MOL",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.tipmas.co"],
  blockExplorerUrls: ["https://explorer.tipmas.co"],
  txExplorerBase: "https://explorer.tipmas.co/tx",
};

// Replace with your deployed contract address after `npm run deploy:tipmas`.
export const STAKING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const STAKING_ABI = [
  "function aprBps() view returns (uint16)",
  "function lockDuration() view returns (uint64)",
  "function totalStaked() view returns (uint256)",
  "function pendingRewards(address account) view returns (uint256)",
  "function availableRewardsPool() view returns (uint256)",
  "function positionOf(address account) view returns (uint256 amount, uint256 unclaimedRewards, uint64 startedAt, uint64 unlockAt, uint64 lastRewardAt)",
  "function stake() payable",
  "function unstake(uint256 amount)",
  "function claimRewards()",
  "function fundRewards() payable",
];
