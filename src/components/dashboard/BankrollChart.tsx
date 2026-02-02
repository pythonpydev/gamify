'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BankrollDataPoint {
  date: string;
  totalChips: number;
}

interface BankrollChartProps {
  className?: string;
}

export function BankrollChart({ className }: BankrollChartProps) {
  const [data, setData] = useState<BankrollDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankrollHistory = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/users/me/bankroll-history', { credentials: 'include' });
        
        if (!res.ok) {
          throw new Error('Failed to fetch bankroll history');
        }

        const responseData = await res.json();
        setData(responseData.history || []);
      } catch (err) {
        console.error('Failed to fetch bankroll history:', err);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankrollHistory();
  }, []);

  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-64 flex items-center justify-center">
          <div className="text-neutral-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (data.length === 0 || (data.length === 1 && data[0].totalChips === 0)) {
    return (
      <div className={className}>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-neutral-400 mb-2">No chip history yet</div>
            <div className="text-sm text-neutral-500">Complete your first session to start tracking!</div>
          </div>
        </div>
      </div>
    );
  }

  // Format date for display (MM/DD)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Format chips with commas
  const formatChips = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-neutral-400 mb-4">Bankroll Tracker</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatChips}
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              });
            }}
            formatter={(value: number) => [formatChips(value) + ' chips', 'Total']}
          />
          <Line
            type="monotone"
            dataKey="totalChips"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: '#f59e0b', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
