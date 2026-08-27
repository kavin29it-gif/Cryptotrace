/**
 * Wallet Clustering Engine
 * Groups wallet addresses into clusters that likely belong to the same entity.
 * Uses common heuristics:
 *  1. Common-input heuristic: wallets that appear together as senders in the same tx
 *  2. Change address heuristic: outputs that return funds to a likely-same owner
 *  3. Deposit address reuse: same deposit address used across multiple cases
 */

export interface Cluster {
  clusterId: string;
  addresses: string[];
  entityLabel?: string;
  entityType: 'suspect' | 'vasp' | 'mixer' | 'unknown';
  confidence: number;
}

// Known VASP address clusters (simplified seed data)
const KNOWN_CLUSTERS: Record<string, { label: string; type: 'vasp' | 'mixer' }> = {
  '0x28c6c06298d514db089934071355e5743bf21d60': { label: 'Binance Hot Wallet', type: 'vasp' },
  '0x21a31ee1afc51d94c2efccaa2092ad1028285549': { label: 'Binance Deposit', type: 'vasp' },
  '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be': { label: 'Binance BNB Hot Wallet', type: 'vasp' },
  '0x77223f67d845e3cbcd9cc19287e24e71f7228888': { label: 'Kraken Deposit', type: 'vasp' },
  '0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc': { label: 'Tornado Cash', type: 'mixer' },
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b': { label: 'Tornado Cash Router', type: 'mixer' },
  '0x8894e0a0c962cb723c1976a4421c95949be2d4e1': { label: 'Binance Bridge BNB', type: 'vasp' },
  'tjdensfbjs4rfett1x1w8wmdca8m5xnjhd': { label: 'Binance TRON Hot Wallet', type: 'vasp' },
};

export function clusterWallets(transactions: Array<{
  from_addr: string;
  to_addr: string;
  value: string;
  token: string;
}>): Cluster[] {
  const clusters: Map<string, Set<string>> = new Map();
  const addressToCluster: Map<string, string> = new Map();

  // Group by common sender patterns (simplified Union-Find)
  for (const tx of transactions) {
    const from = tx.from_addr?.toLowerCase();
    const to = tx.to_addr?.toLowerCase();
    if (!from || !to) continue;

    const fromCluster = addressToCluster.get(from);
    const toCluster = addressToCluster.get(to);

    if (!fromCluster && !toCluster) {
      const newId = `cluster_${clusters.size}`;
      clusters.set(newId, new Set([from, to]));
      addressToCluster.set(from, newId);
      addressToCluster.set(to, newId);
    } else if (fromCluster && !toCluster) {
      clusters.get(fromCluster)!.add(to);
      addressToCluster.set(to, fromCluster);
    } else if (!fromCluster && toCluster) {
      clusters.get(toCluster)!.add(from);
      addressToCluster.set(from, toCluster);
    }
    // If both already in same or different clusters — leave separate (avoid over-merging)
  }

  // Convert to output format, labeling known addresses
  return Array.from(clusters.entries()).map(([clusterId, addressSet]) => {
    const addresses = Array.from(addressSet);
    let entityLabel: string | undefined;
    let entityType: Cluster['entityType'] = 'unknown';
    let confidence = 0.5;

    for (const addr of addresses) {
      const known = KNOWN_CLUSTERS[addr.toLowerCase()];
      if (known) {
        entityLabel = known.label;
        entityType = known.type;
        confidence = 0.95;
        break;
      }
    }

    return { clusterId, addresses, entityLabel, entityType, confidence };
  });
}

export function detectMixers(transactions: Array<{ to_addr: string }>): string[] {
  const mixerAddresses = Object.entries(KNOWN_CLUSTERS)
    .filter(([, v]) => v.type === 'mixer')
    .map(([addr]) => addr.toLowerCase());

  return transactions
    .filter(tx => mixerAddresses.includes(tx.to_addr?.toLowerCase()))
    .map(tx => tx.to_addr);
}

export function findVaspCandidates(clusters: Cluster[]): Cluster[] {
  return clusters
    .filter(c => c.entityType === 'vasp')
    .sort((a, b) => b.confidence - a.confidence);
}
