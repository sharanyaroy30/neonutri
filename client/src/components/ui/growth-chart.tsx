import { GrowthRecord } from "@shared/schema";
import { formatDateShort } from "@/lib/utils/dates";

interface GrowthChartProps {
  records: GrowthRecord[];
  chartType: 'weight' | 'height';
}

export default function GrowthChart({ records, chartType }: GrowthChartProps) {
  // No records case
  if (records.length === 0) {
    return (
      <div className="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p className="text-neutral-500">No growth records found. Add your first record using the form above.</p>
      </div>
    );
  }

  // Calculate chart heights based on values
  const getChartHeight = (record: GrowthRecord) => {
    if (chartType === 'weight') {
      const maxWeight = Math.max(...records.map(r => parseFloat(r.weight)));
      return (parseFloat(record.weight) / maxWeight) * 100;
    } else {
      const maxHeight = Math.max(...records.map(r => parseFloat(r.height)));
      return (parseFloat(record.height) / maxHeight) * 100;
    }
  };

  return (
    <div className="h-64 bg-neutral-100 rounded-lg p-4 relative">
      <div className="absolute inset-0 p-4 pt-10">
        <div className="flex h-full items-end justify-between">
          {records.map((record, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <div className="w-full px-1">
                <div 
                  className="chart-bar bg-primary rounded-t w-full transition-all duration-500"
                  style={{ height: `${getChartHeight(record)}%` }}
                >
                </div>
              </div>
              <span className="text-xs text-neutral-500 mt-2">
                {formatDateShort(record.date)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
