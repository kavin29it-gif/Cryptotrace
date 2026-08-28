// Local Storage manager for browser-private cases

export interface LocalCase {
  id: string;
  wallet_address: string;
  chain: string;
  status: 'completed' | 'failed' | 'running';
  crime_category: string;
  created_at: string;
  completed_at?: string;
  attribution?: {
    vasp_name: string;
    vasp_address: string;
    confidence: number;
    risk: 'high' | 'medium' | 'low';
    evidence: any[];
    path: any[];
  };
}

const STORAGE_KEY = 'cryptotrace_cases';

// Default mock data to populate if storage is completely empty
const defaultMockCases: LocalCase[] = [
  {
    id: 'CAS-1297',
    wallet_address: '0x0d0431...eD00',
    chain: 'ethereum',
    status: 'completed',
    crime_category: 'fraud',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    attribution: {
      vasp_name: 'Binance',
      vasp_address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      confidence: 92,
      risk: 'high',
      evidence: [
        { signal: 'Direct Deposit', description: 'Funds deposited directly to known Binance deposit wallet cluster.', weight: 'strong' },
        { signal: 'Cluster Match', description: 'Destination wallet is part of a verified Binance deposit cluster.', weight: 'strong' }
      ],
      path: []
    }
  },
  {
    id: 'CAS-1317',
    wallet_address: 'TYDUutYN...q9QZ',
    chain: 'tron',
    status: 'completed',
    crime_category: 'fraud',
    created_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    attribution: {
      vasp_name: 'Kraken',
      vasp_address: '0x772...8888',
      confidence: 45,
      risk: 'medium',
      evidence: [
        { signal: 'Peeling Chain Detected', description: 'Rapid sequential single-output transactions detected.', weight: 'moderate' }
      ],
      path: []
    }
  },
  {
    id: 'CAS-2347',
    wallet_address: '0x53b693...Bfc1',
    chain: 'ethereum',
    status: 'completed',
    crime_category: 'fraud',
    created_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    completed_at: new Date(Date.now() - 9 * 3600000).toISOString(),
    attribution: {
      vasp_name: 'Binance',
      vasp_address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      confidence: 90,
      risk: 'high',
      evidence: [],
      path: []
    }
  }
];

export function getLocalCases(): LocalCase[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Populate with default mock cases on first load for demo/investigation feel
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMockCases));
    return defaultMockCases;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

export function saveLocalCase(newCase: LocalCase) {
  if (typeof window === 'undefined') return;
  const cases = getLocalCases();
  const existingIndex = cases.findIndex(c => c.id === newCase.id);
  if (existingIndex >= 0) {
    cases[existingIndex] = newCase;
  } else {
    cases.unshift(newCase);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function getLocalCaseById(id: string): LocalCase | null {
  const cases = getLocalCases();
  return cases.find(c => c.id === id) || null;
}
