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
const defaultMockCases: LocalCase[] = [];


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
