export async function fetchTronScanTransactions(address: string) {
  const apiKey = process.env.TRONSCAN_API_KEY;

  if (!apiKey) {
    console.warn("No TRONSCAN_API_KEY provided. Returning mock TRON data.");
    return generateMockTronTransactions(address);
  }

  try {
    const response = await fetch(
      `https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=50&address=${address}`,
      {
        headers: {
          'TRON-PRO-API-KEY': apiKey
        }
      }
    );
    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      return data.data.map((tx: any) => ({
        tx_hash: tx.hash,
        from_addr: tx.ownerAddress,
        to_addr: tx.toAddress,
        value: (tx.amount / 1e6).toString(), // Sun → TRX
        token: 'TRX',
        block_time: new Date(tx.timestamp).toISOString()
      }));
    }

    console.warn("TronScan returned no data.");
    return generateMockTronTransactions(address);
  } catch (error) {
    console.error("Failed to fetch from TronScan:", error);
    return generateMockTronTransactions(address);
  }
}

function generateMockTronTransactions(address: string) {
  return [
    {
      tx_hash: `trx_mock_${Math.random().toString(16).substring(2, 10)}`,
      from_addr: address,
      to_addr: 'TJDENsfBJs4RFETt1X1W8wMDc8M5XnJhd', // Binance TRON hot wallet
      value: '500',
      token: 'TRX',
      block_time: new Date().toISOString()
    }
  ];
}
