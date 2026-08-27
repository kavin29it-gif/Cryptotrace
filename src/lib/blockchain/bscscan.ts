// BscScan API mirrors Etherscan exactly — just a different base URL
// Etherscan keys also work on BscScan (same company)
export async function fetchBscTransactions(address: string) {
  const apiKey = process.env.BSCSCAN_API_KEY || process.env.ETHERSCAN_API_KEY;

  if (!apiKey) {
    console.warn("No BSCSCAN_API_KEY provided. Returning mock BNB data.");
    return generateMockBnbTransactions(address);
  }

  try {
    const response = await fetch(
      `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data.status === '1' && data.result) {
      return normalizeTransactions(data.result);
    }

    console.warn("BscScan API error:", data.message);
    return generateMockBnbTransactions(address);
  } catch (error) {
    console.error("Failed to fetch from BscScan:", error);
    return generateMockBnbTransactions(address);
  }
}

function normalizeTransactions(rawTxs: any[]) {
  return rawTxs.map(tx => ({
    tx_hash: tx.hash,
    from_addr: tx.from,
    to_addr: tx.to,
    value: (parseInt(tx.value) / 1e18).toString(), // Wei → BNB
    token: 'BNB',
    block_time: new Date(parseInt(tx.timeStamp) * 1000).toISOString()
  }));
}

function generateMockBnbTransactions(address: string) {
  return [
    {
      tx_hash: `0xbnb_mock_${Math.random().toString(16).substring(2, 10)}`,
      from_addr: address,
      to_addr: '0x8894e0a0c962cb723c1976a4421c95949be2d4e1', // Binance BNB bridge
      value: '2.5',
      token: 'BNB',
      block_time: new Date().toISOString()
    },
    {
      tx_hash: `0xbnb_mock_${Math.random().toString(16).substring(2, 10)}`,
      from_addr: '0x8894e0a0c962cb723c1976a4421c95949be2d4e1',
      to_addr: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', // Binance hot wallet
      value: '2.3',
      token: 'BNB',
      block_time: new Date().toISOString()
    }
  ];
}
