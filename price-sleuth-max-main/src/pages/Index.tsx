
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import NavbarAuth from '@/components/NavbarAuth';
import CryptoCard from '@/components/CryptoCard';
import PriceChart from '@/components/PriceChart';
import PredictionTable from '@/components/PredictionTable';
import CurrencyConversion from '@/components/CurrencyConversion';
import { cryptoService, Crypto, PriceData } from '@/services/cryptoService';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  const [predictionData, setPredictionData] = useState<PriceData[]>([]);
  
  const fetchCryptos = useCallback(async () => {
    try {
      const data = await cryptoService.getTopCryptos();
      setCryptos(data);
      if (!selectedCrypto && data.length > 0) {
        setSelectedCrypto(data[0]);
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cryptocurrency data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, selectedCrypto]);
  
  const fetchPriceHistory = useCallback(async (coinId: string) => {
    try {
      const data = await cryptoService.getPriceHistory(coinId);
      setPriceHistory(data);
      
      // Also fetch prediction data
      const prediction = await cryptoService.getPrediction(coinId);
      setPredictionData(prediction);
    } catch (error) {
      console.error('Error fetching price history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch price history data",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  useEffect(() => {
    fetchCryptos();
    
    // Refresh crypto data every 30 seconds
    const interval = setInterval(() => {
      fetchCryptos();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchCryptos]);
  
  useEffect(() => {
    if (selectedCrypto) {
      fetchPriceHistory(selectedCrypto.id);
    }
  }, [selectedCrypto, fetchPriceHistory]);
  
  const handleSelectCrypto = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
    toast({
      title: `${crypto.name} selected`,
      description: `Viewing ${crypto.name} price data`,
      duration: 2000,
    });
  };
  
  return (
    <div className="min-h-screen pb-16">
      <div className="flex justify-between items-center px-4 py-2 bg-background/80 backdrop-blur-sm border-b fixed top-0 w-full z-10">
        <Navbar />
        <NavbarAuth />
      </div>
      
      {/* Hero Section */}
      <section className="pt-28 pb-12 md:pb-20">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 animate-fade-up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Track and Predict Crypto Prices
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real-time cryptocurrency tracking and price prediction platform
            </p>
          </div>
          
          {/* Crypto Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {loading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="glass-card p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                      <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              cryptos.map((crypto) => (
                <CryptoCard
                  key={crypto.id}
                  name={crypto.name}
                  symbol={crypto.symbol}
                  price={crypto.price}
                  change24h={crypto.change24h}
                  iconUrl={crypto.iconUrl}
                  onClick={() => handleSelectCrypto(crypto)}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Chart and Conversion Section */}
      <section className="py-12">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {selectedCrypto && priceHistory.length > 0 ? (
                <PriceChart 
                  symbol={selectedCrypto.symbol}
                  data={priceHistory}
                  predictionData={predictionData}
                />
              ) : (
                <div className="glass-panel p-5 w-full h-[400px] md:h-[500px] flex items-center justify-center">
                  <p className="text-gray-500">Loading chart data...</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-6">
              {selectedCrypto && predictionData.length > 0 ? (
                <PredictionTable 
                  symbol={selectedCrypto.symbol} 
                  predictionData={predictionData} 
                />
              ) : (
                <div className="glass-panel p-5 h-[250px] flex items-center justify-center">
                  <p className="text-gray-500">Loading prediction data...</p>
                </div>
              )}
              
              <CurrencyConversion />
            </div>
          </div>
        </div>
      </section>
      
      {/* Market Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-semibold mb-8 text-center">Market Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedCrypto ? (
              <>
                <div className="glass-panel p-5 text-center">
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-2xl font-semibold">${selectedCrypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                
                <div className="glass-panel p-5 text-center">
                  <p className="text-sm text-gray-500 mb-1">24h Change</p>
                  <p className={`text-2xl font-semibold ${selectedCrypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedCrypto.change24h >= 0 ? '+' : ''}{selectedCrypto.change24h}%
                  </p>
                </div>
                
                <div className="glass-panel p-5 text-center">
                  <p className="text-sm text-gray-500 mb-1">Market Cap</p>
                  <p className="text-2xl font-semibold">${(selectedCrypto.marketCap / 1000000000).toFixed(1)}B</p>
                </div>
                
                <div className="glass-panel p-5 text-center">
                  <p className="text-sm text-gray-500 mb-1">24h Volume</p>
                  <p className="text-2xl font-semibold">${(selectedCrypto.volume24h / 1000000000).toFixed(1)}B</p>
                </div>
              </>
            ) : (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="glass-panel p-5 text-center animate-pulse">
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
