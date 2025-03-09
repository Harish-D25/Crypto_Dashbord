
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface PredictionTableProps {
  symbol: string;
  predictionData: any[];
}

const PredictionTable = ({ symbol, predictionData }: PredictionTableProps) => {
  // Group prediction data by timeframe
  const getTimeframePredictions = () => {
    if (!predictionData.length) return [];
    
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    const lastKnownPrice = predictionData[0]?.price || 0;
    
    // 24h prediction - average of first 24 entries
    const next24h = predictionData
      .filter(d => d.timestamp < now + day)
      .slice(0, 24);
    
    // 1 week prediction - average of entries between day 6 and 7
    const oneWeek = predictionData
      .filter(d => d.timestamp > now + 6 * day && d.timestamp < now + 7 * day)
      .slice(0, 24);
    
    // 1 month prediction - last few entries
    const oneMonth = predictionData
      .filter(d => d.timestamp > now + 29 * day)
      .slice(-24);
    
    const getAverage = (data: any[]) => {
      if (!data.length) return 0;
      return data.reduce((sum, item) => sum + item.price, 0) / data.length;
    };
    
    return [
      {
        timeframe: "24 Hours",
        price: getAverage(next24h),
        change: getPercentChange(lastKnownPrice, getAverage(next24h)),
      },
      {
        timeframe: "1 Week",
        price: getAverage(oneWeek),
        change: getPercentChange(lastKnownPrice, getAverage(oneWeek)),
      },
      {
        timeframe: "1 Month",
        price: getAverage(oneMonth),
        change: getPercentChange(lastKnownPrice, getAverage(oneMonth)),
      },
    ];
  };
  
  const getPercentChange = (startPrice: number, endPrice: number) => {
    if (!startPrice) return 0;
    return ((endPrice - startPrice) / startPrice) * 100;
  };
  
  const predictions = getTimeframePredictions();
  
  return (
    <Card className="glass-panel h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          {symbol} Price Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm font-medium text-gray-500 pb-2">Timeframe</th>
                <th className="text-right text-sm font-medium text-gray-500 pb-2">Predicted Price</th>
                <th className="text-right text-sm font-medium text-gray-500 pb-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((pred, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="py-3 text-sm">{pred.timeframe}</td>
                  <td className="py-3 text-sm text-right font-medium">
                    ${pred.price.toFixed(2)}
                  </td>
                  <td className={`py-3 text-sm text-right font-medium ${
                    pred.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {pred.change >= 0 ? '+' : ''}{pred.change.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">
          Predictions are based on historical trends and market analysis.
          Actual results may vary.
        </p>
      </CardContent>
    </Card>
  );
};

export default PredictionTable;
