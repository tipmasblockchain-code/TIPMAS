# TIPMAS Blockchain

> **MOLLIES (MOL)** — A Clique-based Proof of Authority (PoA) blockchain built on Go Ethereum (Geth).

---

## Overview

| Parameter | Value |
|---|---|
| Blockchain Name | TIPMAS |
| Coin Full Name | MOLLIES |
| Symbol | MOL |
| Total Supply | 1,000,000,000 MOL |
| Consensus | Clique (Proof of Authority) |
| Network ID | 46498 |
| P2P Port | 11850 |
| Sync Mode | Full (Archive) |

---

## Prerequisites

- Linux / macOS (Ubuntu 20.04+ recommended)
- `screen` utility installed (`apt install screen`)
- Sufficient disk space for a full archive node (~20 GB+ recommended)

---

## Getting Started

### 1. Download the Geth Binary

Download the custom TIPMAS Geth binary from the official releases page:

```bash
wget https://github.com/tipmasblockchain-code/TIPMAS/releases/download/v1.0/geth
chmod +x geth
sudo mv geth /usr/local/bin/geth
```

Verify the binary is working:

```bash
geth version
```

---

### 2. Download Chain Configuration

Clone this repository or download `tipmas.json` (the genesis file):

```bash
git clone https://github.com/tipmasblockchain-code/TIPMAS.git
cd TIPMAS
```

---

### 3. Initialize the Genesis Block

Initialize your node's data directory with the TIPMAS genesis configuration:

```bash
geth --datadir ".tipmas" init tipmas.json
```

This creates the initial blockchain state in the `.tipmas` data directory.

---

## Running an RPC Node (Localhost)

The following command starts a full archive RPC node with both HTTP and WebSocket endpoints exposed on localhost. This is the recommended setup for applications and tools that need to query chain state or submit transactions locally.

```bash
screen geth \
  --datadir "/home/tipmas/.tipmas" \
  --networkid 46498 \
  --port 11850 \
  --syncmode 'full' \
  --bootnodes enode://97f250c0e2eda33ac6c55126fa96a1f52a543bdbaa8641317beb6d9cc0a57d73f8abca47dbe1f6c2713a4a0afd278db17bbe44a4a5aa0c051b9019e3704b854f@207.148.14.255:11850 \
  --gcmode=archive \
  --ws \
  --ws.origins="*" \
  --ws.api "eth,net,web3,txpool" \
  --http \
  --http.vhosts="localhost" \
  --http.api "eth,net,web3,txpool" \
  --miner.gasprice "3000000000"
```

### RPC Endpoints

Once the node is running, the following endpoints are available locally:

| Protocol | URL |
|---|---|
| HTTP RPC | `http://localhost:8545` |
| WebSocket | `ws://localhost:8546` |

### Flag Reference

| Flag | Description |
|---|---|
| `--datadir` | Path to the node data directory |
| `--networkid` | TIPMAS network ID (`46498`) |
| `--port` | P2P listening port (`11850`) |
| `--syncmode full` | Full chain synchronization |
| `--bootnodes` | Entry point peer for network discovery |
| `--gcmode=archive` | Retains all historical state (required for full history queries) |
| `--ws` | Enables WebSocket RPC server |
| `--ws.origins="*"` | Allows WebSocket connections from any origin |
| `--ws.api` | Exposed WebSocket namespaces |
| `--http` | Enables HTTP RPC server |
| `--http.vhosts="localhost"` | Restricts HTTP RPC to localhost only |
| `--http.api` | Exposed HTTP namespaces |
| `--miner.gasprice` | Minimum gas price accepted (3 Gwei) |

> **Security Note:** The HTTP RPC is restricted to `localhost` by default. Do **not** change `--http.vhosts` to `"*"` on a publicly accessible server without a proper firewall or reverse proxy in place.

---

### Managing Your Node with `screen`

To detach from the running node session without stopping it:

```
Ctrl + A, then D
```

To reattach to the session:

```bash
screen -r
```

To list all screen sessions:

```bash
screen -ls
```

---

## Connecting to the Node

### Web3.js (JavaScript)

```javascript
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

web3.eth.getBlockNumber().then(console.log);
```

### ethers.js (JavaScript)

```javascript
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('http://localhost:8545');

provider.getBlockNumber().then(console.log);
```

### Geth Console (Interactive)

Attach an interactive JavaScript console to your running node:

```bash
geth attach http://localhost:8545
```

---

## Network Information

| Parameter | Value |
|---|---|
| Network ID | `46498` |
| P2P Port | `11850` |
| Bootnode | `enode://97f250c0e2eda33ac6c55126fa96a1f52a543bdbaa8641317beb6d9cc0a57d73f8abca47dbe1f6c2713a4a0afd278db17bbe44a4a5aa0c051b9019e3704b854f@207.148.14.255:11850` |
| Consensus | Clique PoA |
| Gas Price (minimum) | 3,000,000,000 Wei (3 Gwei) |

---

## Consensus: Clique Proof of Authority

TIPMAS uses the **Clique** consensus protocol, a Proof of Authority mechanism where a defined set of authorized signers take turns sealing blocks. Clique is:

- **Permissioned** — Only authorized signers can produce blocks
- **Energy efficient** — No mining or staking required
- **Fast** — Consistent block times with low latency finality
- **Ideal for private and consortium chains**

---

## License

This project is licensed under the terms specified in the [LICENSE](LICENSE.txt) file.

---

## Contact & Support

For issues, questions, or contributions, please open an issue in this repository or reach out through the official TIPMAS community channels.
