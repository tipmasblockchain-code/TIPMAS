import { defineConfig } from "hardhat/config";
import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config();

const TIPMAS_RPC_URL = process.env.TIPMAS_RPC_URL ?? "https://rpc.tipmas.co";
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY ?? "";

export default defineConfig({
  plugins: [hardhatEthers],
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    tipmas: {
      type: "http",
      url: TIPMAS_RPC_URL,
      chainId: 46498,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
});
