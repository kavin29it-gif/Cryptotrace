"use client";

import { Download } from 'lucide-react';

interface ExportCsvButtonProps {
  data: any[];
}

export default function ExportCsvButton({ data }: ExportCsvButtonProps) {
  const exportToCsv = () => {
    if (!data || data.length === 0) return;

    // Header row
    const headers = ["Case ID", "Suspect Wallet", "Network", "Category", "Status", "Risk Level", "Confidence", "Created At"];
    
    // Data rows
    const rows = data.map(c => {
      const topAttribution = c.attributions?.[0];
      return [
        c.id,
        c.wallet_address,
        c.chain,
        c.crime_category || '',
        c.status,
        topAttribution?.risk || 'N/A',
        topAttribution?.confidence ? `${topAttribution.confidence}%` : 'N/A',
        c.created_at
      ];
    });

    // Construct CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    // Download action
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cryptotrace-cases-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={exportToCsv}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 shadow-sm text-sm"
    >
      <Download size={16} />
      Export CSV
    </button>
  );
}
