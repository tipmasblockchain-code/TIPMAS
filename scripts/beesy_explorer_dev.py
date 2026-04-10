#!/usr/bin/env python3
"""
Generate BEESY Explorer development artifacts for CAROLIES (CARO).

Outputs:
1) JSON configuration for explorer/team tooling.
2) Markdown handoff for developers.
3) Plain-text forwarding note.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import List


@dataclass(frozen=True)
class G24CRpc:
    code: str
    company_name: str
    rpc_url: str
    multiplier: float
    function_working_mechanism: str


COIN_SPEC = {
    "explorer_name": "BEESY Explorer",
    "company": "BEESY",
    "coin_name": "CAROLIES",
    "symbol": "CARO",
    "total_supply": "5,000,000,000 CARO",
    "chain_id": 25910,
    "network": "TRON",
    "token_standard": "TRC-20",
}


def g24c_rpc_registry() -> List[G24CRpc]:
    # Multipliers are routing weights. Higher values receive more traffic.
    return [
        G24CRpc(
            "G24C-01",
            "Asterion Nodeworks",
            "https://rpc01.beesy-tron.net",
            1.00,
            "Primary balanced endpoint for read/write JSON-RPC flow.",
        ),
        G24CRpc(
            "G24C-02",
            "Boreal Chain Systems",
            "https://rpc02.beesy-tron.net",
            1.10,
            "High-availability failover for transaction broadcasting.",
        ),
        G24CRpc(
            "G24C-03",
            "Citrine Ledger Tech",
            "https://rpc03.beesy-tron.net",
            0.95,
            "Archive-backed reads for historic account and contract state.",
        ),
        G24CRpc(
            "G24C-04",
            "Delta Trust Infrastructure",
            "https://rpc04.beesy-tron.net",
            1.20,
            "Low-latency regional edge endpoint for explorer UI queries.",
        ),
        G24CRpc(
            "G24C-05",
            "Everline Distributed",
            "https://rpc05.beesy-tron.net",
            1.05,
            "Smart-contract event log retrieval with cached bloom filters.",
        ),
        G24CRpc(
            "G24C-06",
            "Flux Harbor Cloud",
            "https://rpc06.beesy-tron.net",
            0.90,
            "Elastic backup node pool activated on traffic bursts.",
        ),
        G24CRpc(
            "G24C-07",
            "Granite RPC Labs",
            "https://rpc07.beesy-tron.net",
            1.30,
            "Priority endpoint for mempool-aware pending transaction reads.",
        ),
        G24CRpc(
            "G24C-08",
            "Helios ChainOps",
            "https://rpc08.beesy-tron.net",
            1.15,
            "Geo-routed endpoint optimized for wallet API calls.",
        ),
        G24CRpc(
            "G24C-09",
            "Ion Frontier Nodes",
            "https://rpc09.beesy-tron.net",
            1.00,
            "General purpose request path with strict rate shaping.",
        ),
        G24CRpc(
            "G24C-10",
            "Jasper Relay Networks",
            "https://rpc10.beesy-tron.net",
            0.85,
            "Cold standby route for disaster recovery replication.",
        ),
        G24CRpc(
            "G24C-11",
            "Kepler Validator Services",
            "https://rpc11.beesy-tron.net",
            1.25,
            "Block ingestion endpoint for explorer index synchronization.",
        ),
        G24CRpc(
            "G24C-12",
            "Lumina Core Hosting",
            "https://rpc12.beesy-tron.net",
            1.35,
            "Fast-finality path for near-real-time block tracking widgets.",
        ),
        G24CRpc(
            "G24C-13",
            "Meridian DataGrid",
            "https://rpc13.beesy-tron.net",
            0.92,
            "Cost-optimized read endpoint for non-critical analytics jobs.",
        ),
        G24CRpc(
            "G24C-14",
            "Northstar Chain Fabric",
            "https://rpc14.beesy-tron.net",
            1.18,
            "Heavy-query route for contract ABI decoding and traces.",
        ),
        G24CRpc(
            "G24C-15",
            "Orchid Network Engines",
            "https://rpc15.beesy-tron.net",
            1.05,
            "Balanced endpoint with aggressive connection reuse.",
        ),
        G24CRpc(
            "G24C-16",
            "Prism Route Compute",
            "https://rpc16.beesy-tron.net",
            0.98,
            "Redundant endpoint for scheduled crawler backfills.",
        ),
        G24CRpc(
            "G24C-17",
            "Quasar Integration Cloud",
            "https://rpc17.beesy-tron.net",
            1.22,
            "Partner-facing API route with strict SLA monitoring.",
        ),
        G24CRpc(
            "G24C-18",
            "Radial Consensus Labs",
            "https://rpc18.beesy-tron.net",
            1.08,
            "Secondary path for token transfer and allowance validation.",
        ),
        G24CRpc(
            "G24C-19",
            "Solace Node Matrix",
            "https://rpc19.beesy-tron.net",
            1.12,
            "Read-heavy endpoint tuned for account portfolio pages.",
        ),
        G24CRpc(
            "G24C-20",
            "Titan RPC Infrastructure",
            "https://rpc20.beesy-tron.net",
            1.40,
            "High-capacity batch RPC endpoint for indexer workers.",
        ),
        G24CRpc(
            "G24C-21",
            "Umbra Ledger Services",
            "https://rpc21.beesy-tron.net",
            0.88,
            "Backup endpoint reserved for maintenance windows.",
        ),
        G24CRpc(
            "G24C-22",
            "Vortex Edge Compute",
            "https://rpc22.beesy-tron.net",
            1.16,
            "Latency-focused route for explorer search suggestions.",
        ),
        G24CRpc(
            "G24C-23",
            "Wavefront Protocol Ops",
            "https://rpc23.beesy-tron.net",
            1.28,
            "Primary endpoint for high-frequency transaction polling.",
        ),
        G24CRpc(
            "G24C-24",
            "Zenith RPC Partners",
            "https://rpc24.beesy-tron.net",
            1.50,
            "Top-weight route for mission-critical production requests.",
        ),
    ]


def write_json(out_dir: Path, rpc_items: List[G24CRpc]) -> Path:
    json_path = out_dir / "beesy_explorer_caro_config.json"
    payload = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "coin_spec": COIN_SPEC,
        "g24c_rpcs": [asdict(item) for item in rpc_items],
    }
    json_path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    return json_path


def write_markdown(out_dir: Path, rpc_items: List[G24CRpc]) -> Path:
    md_path = out_dir / "BEESY_EXPLORER_CARO_DEVELOPER_BRIEF.md"
    lines = [
        "# BEESY Explorer - CAROLIES (CARO) Development Brief",
        "",
        "## Network Parameters",
        "",
        f"- **Coin Name:** {COIN_SPEC['coin_name']}",
        f"- **Symbol:** {COIN_SPEC['symbol']}",
        f"- **Total Supply:** {COIN_SPEC['total_supply']}",
        f"- **Chain ID:** {COIN_SPEC['chain_id']}",
        f"- **Network:** {COIN_SPEC['network']}",
        f"- **Token Standard:** {COIN_SPEC['token_standard']}",
        "",
        "## G-24C RPC Registry",
        "",
        "| Code | Company Name | RPC URL | Multiplier | Function / Working Mechanism |",
        "|---|---|---|---:|---|",
    ]
    for item in rpc_items:
        lines.append(
            f"| {item.code} | {item.company_name} | {item.rpc_url} | "
            f"{item.multiplier:.2f} | {item.function_working_mechanism} |"
        )
    lines.extend(
        [
            "",
            "## Routing Note",
            "",
            (
                "Use `multiplier` as a weighted balancing factor in the BEESY "
                "Explorer RPC router. Higher multiplier values should receive "
                "proportionally higher request share, while low-multiplier "
                "entries act as reserve capacity."
            ),
            "",
        ]
    )
    md_path.write_text("\n".join(lines), encoding="utf-8")
    return md_path


def write_send_note(out_dir: Path, md_path: Path, json_path: Path) -> Path:
    note_path = out_dir / "SEND_TO_DEVELOPERS.txt"
    body = [
        "Subject: BEESY Explorer Development Script - CAROLIES (CARO)",
        "",
        "Team,",
        "",
        "Please use the attached BEESY Explorer developer packet for CAROLIES.",
        "",
        "Included files:",
        f"- {md_path.name}: Developer-facing summary and G-24C RPC table.",
        f"- {json_path.name}: Machine-readable configuration for tooling.",
        "",
        "Network constants:",
        f"- Coin: {COIN_SPEC['coin_name']} ({COIN_SPEC['symbol']})",
        f"- Supply: {COIN_SPEC['total_supply']}",
        f"- Chain ID: {COIN_SPEC['chain_id']}",
        f"- Network: {COIN_SPEC['network']} / {COIN_SPEC['token_standard']}",
        "",
        "Regards,",
        "BEESY Explorer Automation",
        "",
    ]
    note_path.write_text("\n".join(body), encoding="utf-8")
    return note_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate BEESY Explorer development artifacts for CARO."
    )
    parser.add_argument(
        "--out-dir",
        default="developer_packet",
        help="Directory where generated files are written.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    rpc_items = g24c_rpc_registry()
    json_path = write_json(out_dir, rpc_items)
    md_path = write_markdown(out_dir, rpc_items)
    note_path = write_send_note(out_dir, md_path, json_path)

    print("BEESY Explorer developer packet generated:")
    print(f"- {json_path}")
    print(f"- {md_path}")
    print(f"- {note_path}")


if __name__ == "__main__":
    main()
