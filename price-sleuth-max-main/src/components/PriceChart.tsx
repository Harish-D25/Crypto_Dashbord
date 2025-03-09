
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface PriceChartProps {
  symbol: string;
  data: any[];
  predictionData?: any[];
}

const PriceChart = ({ symbol, data, predictionData = [] }: PriceChartProps) => {
  const [activeTab, setActiveTab] = useState("7d");
  const [chartData, setChartData] = useState(data);
  
  useEffect(() => {
    // Filter data based on active tab
    let filtered = [...data];
    if (activeTab === "1d") {
      filtered = data.slice(-24);
    } else if (activeTab === "7d") {
      filtered = data.slice(-7 * 24);
    } else if (activeTab === "30d") {
      filtered = data.slice(-30 * 24);
    } else if (activeTab === "prediction") {
      filtered = [...data.slice(-7 * 24), ...predictionData];
    }
    
    setChartData(filtered);
  }, [activeTab, data, predictionData]);
  
  const isPositive = chartData.length > 1 && 
    chartData[chartData.length - 1].price > chartData[0].price;
    
  const gradientOffset = () => {
    if (chartData.length <= 0) return 0;
    
    const dataMax = Math.max(...chartData.map(i => i.price));
    const dataMin = Math.min(...chartData.map(i => i.price));
    
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    
    return dataMax / (dataMax - dataMin);
  };
  
  const formattedChartData = chartData.map(item => ({
    ...item,
    isPrediction: item.isPrediction || false
  }));
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500">{new Date(label).toLocaleDateString()} {new Date(label).toLocaleTimeString()}</p>
          <p className="font-medium">${payload[0].value.toFixed(2)}</p>
          {payload[0].payload.isPrediction && (
            <p className="text-xs text-gray-400 italic">Predicted</p>
          )}
        </div>
      );
    }
    return null;
  };
  
  const getStrokeColor = (d: any) => {
    if (activeTab === "prediction") {
      return d.isPrediction ? "#6366f1" : (isPositive ? "#10b981" : "#ef4444");
    }
    return isPositive ? "#10b981" : "#ef4444";
  };

  const getFillColor = (d: any) => {
    if (activeTab === "prediction") {
      return d.isPrediction ? "url(#predictionGradient)" : "url(#colorPrice)";
    }
    return "url(#colorPrice)";
  };
  
  return (
    <Card className="glass-panel p-5 w-full h-[400px] md:h-[500px]">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">{symbol} Price Chart</h3>
          <Tabs defaultValue="7d" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isPositive ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"} />
                  <stop offset="95%" stopColor={isPositive ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)"} />
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(99, 102, 241, 0.3)" />
                  <stop offset="95%" stopColor="rgba(99, 102, 241, 0.05)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(tick) => {
                  if (activeTab === "1d") {
                    return new Date(tick).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                  return new Date(tick).toLocaleDateString([], { month: 'short', day: 'numeric' });
                }}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['dataMin - 1%', 'dataMax + 1%']}
                tickFormatter={(tick) => `$${tick.toFixed(2)}`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;
