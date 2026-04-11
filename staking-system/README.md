# TIPMAS MOL Staking System

Staking system for **TIPMAS** network using native **Mollies Coin (MOL)**.

## Network Wiring

- Chain ID: `46498`
- RPC: `https://rpc.tipmas.co`
- Explorer tx URL: `https://explorer.tipmas.co/tx/<txHash>`

## Features

- Stake native MOL
- Lockup-based unstaking
- Time-based APR rewards
- Claim rewards in MOL
- Fund reward pool in MOL
- Simple frontend dashboard (MetaMask + explorer links)

## Project Structure

```text
staking-system/
  contracts/TipmasMOLStaking.sol
  scripts/deploy.js
  test/TipmasMOLStaking.test.js
  frontend/
    index.html
    app.js
    config.js
    style.css
```

## Setup

```bash
cd staking-system
npm install
cp .env.example .env
```

Update `.env`:

- `DEPLOYER_PRIVATE_KEY`: deployer key with MOL funds
- optional `INITIAL_APR_BPS`
- optional `LOCK_DURATION_SECONDS`

## Compile & Test

```bash
npm run compile
npm run test
```

## Deploy to TIPMAS

```bash
npm run deploy:tipmas
```

Deployment prints:

- Contract address
- Deployment tx hash
- Explorer URL using `https://explorer.tipmas.co/tx`

## Connect Frontend

1. Open `frontend/config.js`
2. Replace `STAKING_CONTRACT_ADDRESS` with deployed address
3. Run frontend:

```bash
npm run frontend
```

Visit `http://localhost:5173` and connect MetaMask.

The app auto-adds/switches to TIPMAS:

- chainId: `0xb5a2` (`46498`)
- RPC: `https://rpc.tipmas.co`
- Explorer: `https://explorer.tipmas.co`

Every transaction in the UI links to:

`https://explorer.tipmas.co/tx/<txHash>`
