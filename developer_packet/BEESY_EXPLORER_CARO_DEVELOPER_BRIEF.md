# BEESY Explorer - CAROLIES (CARO) Development Brief

## Network Parameters

- **Coin Name:** CAROLIES
- **Symbol:** CARO
- **Total Supply:** 5,000,000,000 CARO
- **Chain ID:** 25910
- **Network:** TRON
- **Token Standard:** TRC-20

## G-24C RPC Registry

| Code | Company Name | RPC URL | Multiplier | Function / Working Mechanism |
|---|---|---|---:|---|
| G24C-01 | Asterion Nodeworks | https://rpc01.beesy-tron.net | 1.00 | Primary balanced endpoint for read/write JSON-RPC flow. |
| G24C-02 | Boreal Chain Systems | https://rpc02.beesy-tron.net | 1.10 | High-availability failover for transaction broadcasting. |
| G24C-03 | Citrine Ledger Tech | https://rpc03.beesy-tron.net | 0.95 | Archive-backed reads for historic account and contract state. |
| G24C-04 | Delta Trust Infrastructure | https://rpc04.beesy-tron.net | 1.20 | Low-latency regional edge endpoint for explorer UI queries. |
| G24C-05 | Everline Distributed | https://rpc05.beesy-tron.net | 1.05 | Smart-contract event log retrieval with cached bloom filters. |
| G24C-06 | Flux Harbor Cloud | https://rpc06.beesy-tron.net | 0.90 | Elastic backup node pool activated on traffic bursts. |
| G24C-07 | Granite RPC Labs | https://rpc07.beesy-tron.net | 1.30 | Priority endpoint for mempool-aware pending transaction reads. |
| G24C-08 | Helios ChainOps | https://rpc08.beesy-tron.net | 1.15 | Geo-routed endpoint optimized for wallet API calls. |
| G24C-09 | Ion Frontier Nodes | https://rpc09.beesy-tron.net | 1.00 | General purpose request path with strict rate shaping. |
| G24C-10 | Jasper Relay Networks | https://rpc10.beesy-tron.net | 0.85 | Cold standby route for disaster recovery replication. |
| G24C-11 | Kepler Validator Services | https://rpc11.beesy-tron.net | 1.25 | Block ingestion endpoint for explorer index synchronization. |
| G24C-12 | Lumina Core Hosting | https://rpc12.beesy-tron.net | 1.35 | Fast-finality path for near-real-time block tracking widgets. |
| G24C-13 | Meridian DataGrid | https://rpc13.beesy-tron.net | 0.92 | Cost-optimized read endpoint for non-critical analytics jobs. |
| G24C-14 | Northstar Chain Fabric | https://rpc14.beesy-tron.net | 1.18 | Heavy-query route for contract ABI decoding and traces. |
| G24C-15 | Orchid Network Engines | https://rpc15.beesy-tron.net | 1.05 | Balanced endpoint with aggressive connection reuse. |
| G24C-16 | Prism Route Compute | https://rpc16.beesy-tron.net | 0.98 | Redundant endpoint for scheduled crawler backfills. |
| G24C-17 | Quasar Integration Cloud | https://rpc17.beesy-tron.net | 1.22 | Partner-facing API route with strict SLA monitoring. |
| G24C-18 | Radial Consensus Labs | https://rpc18.beesy-tron.net | 1.08 | Secondary path for token transfer and allowance validation. |
| G24C-19 | Solace Node Matrix | https://rpc19.beesy-tron.net | 1.12 | Read-heavy endpoint tuned for account portfolio pages. |
| G24C-20 | Titan RPC Infrastructure | https://rpc20.beesy-tron.net | 1.40 | High-capacity batch RPC endpoint for indexer workers. |
| G24C-21 | Umbra Ledger Services | https://rpc21.beesy-tron.net | 0.88 | Backup endpoint reserved for maintenance windows. |
| G24C-22 | Vortex Edge Compute | https://rpc22.beesy-tron.net | 1.16 | Latency-focused route for explorer search suggestions. |
| G24C-23 | Wavefront Protocol Ops | https://rpc23.beesy-tron.net | 1.28 | Primary endpoint for high-frequency transaction polling. |
| G24C-24 | Zenith RPC Partners | https://rpc24.beesy-tron.net | 1.50 | Top-weight route for mission-critical production requests. |

## Routing Note

Use `multiplier` as a weighted balancing factor in the BEESY Explorer RPC router. Higher multiplier values should receive proportionally higher request share, while low-multiplier entries act as reserve capacity.
