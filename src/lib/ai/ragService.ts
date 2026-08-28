export interface AMLDocument {
  title: string;
  source: string;
  topic: string;
  content: string;
  section?: string;
  page?: string;
}

const AML_KNOWLEDGE_BASE: AMLDocument[] = [
  {
    title: "FATF Guidance for a Risk-Based Approach to Virtual Assets and VASPs",
    source: "Financial Action Task Force (FATF)",
    topic: "VASP Risk",
    content: "Under the FATF Risk-Based Approach, countries and Virtual Asset Service Providers (VASPs) must identify, assess, and understand their money laundering and terrorist financing risks. Standard indicators of high risk include interactions with unregulated or shadow VASPs, shell companies, and services operating in high-risk jurisdictions or jurisdictions with weak AML frameworks.",
    section: "Section III",
    page: "Page 22"
  },
  {
    title: "FATF Red Flags Indicators of Money Laundering",
    source: "FATF",
    topic: "Virtual asset AML risk indicators",
    content: "Key red flags include transactions that involve irregular patterns or lack clear commercial justification, transactions involving high-risk jurisdictions, immediate liquidation of funds shortly after deposit, use of shell or nominee structures, and using multiple wallets or hop patterns to obscure the ultimate beneficiary.",
    section: "Annex A",
    page: "Page 45"
  },
  {
    title: "Multi-Hop Transactions & Structuring",
    source: "EGMONT Group of Financial Intelligence Units",
    topic: "Multi-hop transactions",
    content: "Multi-hop transactions represent a classic layering technique where cryptocurrency is routed through multiple intermediate addresses in quick succession. Each hop breaks direct links, attempting to prevent tracing tools from connecting the source of illicit funds to exchange deposit hot wallets.",
    section: "Layering Typologies",
    page: "Page 12"
  },
  {
    title: "AML Typologies: Layering and Peeling Chains",
    source: "FATF Report on Virtual Assets Red Flag Indicators",
    topic: "Peeling chains",
    content: "A peeling chain is an automated or manual technique where a large amount of cryptocurrency is passed through a sequence of addresses. At each step/hop, a small amount is peeled off (e.g. sent to an exchange or mixer) while the majority is sent to a new change address. This obscures the transaction trail.",
    section: "Technical Obfuscation Patterns",
    page: "Page 18"
  },
  {
    title: "Mixers, Bridges, and Privacy Enhancing Services",
    source: "FinCEN Advisory on Illicit Finance",
    topic: "Mixer exposure",
    content: "Using anonymity-enhanced cryptocurrencies (AECs), mixers, tumblers, or decentralized bridges constitutes a significant AML red flag. These services pool funds from multiple users and redistribute them randomly, completely obfuscating the input-output transaction lineage.",
    section: "Section 2: High Risk Services",
    page: "Page 7"
  },
  {
    title: "VASP Exposure and Hot Wallet Attribution",
    source: "FATF Virtual Asset Guidance Update",
    topic: "Exchange/VASP exposure",
    content: "When tracing funds to a VASP, the hop distance and cluster matching are crucial. High-risk exposure occurs when funds travel directly or via minor hops into known exchange deposit clusters. Identifying the final VASP allows law enforcement to subpoena KYC records of the recipient account.",
    section: "Section IV: Attribution",
    page: "Page 34"
  },
  {
    title: "Structuring via Round-Amount Patterns",
    source: "UNODC Cryptocurrency Investigation Manual",
    topic: "Round-amount patterns",
    content: "Transfers of round cryptocurrency amounts (e.g. exactly 10 ETH, 5 ETH, or 1000 USDT) in rapid succession across multiple accounts suggest systematic layering and structuring (smurfing) rather than natural trading behavior. This pattern aims to simplify value reconciliation for the launderer.",
    section: "Chapter 3: Money Laundering Heuristics",
    page: "Page 55"
  },
  {
    title: "Risk-Based Customer Due Diligence for Virtual Assets",
    source: "FATF Guidance",
    topic: "VASP risk-based approach",
    content: "VASPs must conduct customer due diligence (CDD) and transaction monitoring. If a customer's wallet shows direct or close multi-hop exposure to a mixer, bridge, or high-risk entity, the VASP must file a Suspicious Activity Report (SAR) and freeze or restrict the account pending investigation.",
    section: "Section III - CDD",
    page: "Page 28"
  }
];

export function retrieveRelevantKnowledge(
  query: string,
  caseContext: { risk_signals: string[]; network?: string; wallet?: string }
): AMLDocument[] {
  const lowercaseQuery = query.toLowerCase();
  
  // Scoring function to rank knowledge entries based on query, risk signals, and topic matches
  const scoredDocs = AML_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    
    // Match against topic name
    const topic = doc.topic.toLowerCase();
    
    // 1. Match against query terms
    const queryTerms = lowercaseQuery.split(/\s+/);
    queryTerms.forEach(term => {
      if (term.length > 2) {
        if (doc.content.toLowerCase().includes(term)) score += 2;
        if (doc.title.toLowerCase().includes(term)) score += 3;
        if (topic.includes(term)) score += 4;
      }
    });

    // 2. Match against case risk signals
    caseContext.risk_signals.forEach(signal => {
      const lowSignal = signal.toLowerCase();
      if (doc.content.toLowerCase().includes(lowSignal)) score += 3;
      if (topic.includes(lowSignal)) score += 5;
    });

    // 3. Fallback matching on document topics
    if (lowercaseQuery.includes("mixer") && topic.includes("mixer")) score += 10;
    if (lowercaseQuery.includes("peel") && topic.includes("peel")) score += 10;
    if (lowercaseQuery.includes("hop") && topic.includes("hop")) score += 10;
    if (lowercaseQuery.includes("vasp") && topic.includes("vasp")) score += 10;
    if (lowercaseQuery.includes("round") && topic.includes("round")) score += 10;
    if (lowercaseQuery.includes("layer") && topic.includes("layer")) score += 10;

    return { doc, score };
  });

  // Sort descending by score, take top 3
  const sorted = scoredDocs.sort((a, b) => b.score - a.score);
  return sorted.slice(0, 3).map(item => item.doc);
}
