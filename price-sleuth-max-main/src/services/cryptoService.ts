
// Mock data for the demo
// In a real app, you would fetch this data from a cryptocurrency API

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  iconUrl: string;
}

export interface PriceData {
  timestamp: number;
  price: number;
  isPrediction?: boolean;
}

// Mock API service
export const cryptoService = {
  // Get list of popular cryptocurrencies
  getTopCryptos: async (): Promise<Crypto[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 57832.41,
            change24h: 2.54,
            marketCap: 1089420000000,
            volume24h: 32541000000,
            iconUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
          },
          {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            price: 3124.87,
            change24h: -1.27,
            marketCap: 375910000000,
            volume24h: 19874000000,
            iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
          },
          {
            id: 'solana',
            name: 'Solana',
            symbol: 'SOL',
            price: 122.35,
            change24h: 5.73,
            marketCap: 52640000000,
            volume24h: 4785000000,
            iconUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png'
          },
          {
            id: 'binancecoin',
            name: 'Binance Coin',
            symbol: 'BNB',
            price: 417.21,
            change24h: -0.35,
            marketCap: 64290000000,
            volume24h: 2341000000,
            iconUrl: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png'
          },
          {
            id: 'cardano',
            name: 'Cardano',
            symbol: 'ADA',
            price: 1.27,
            change24h: 3.21,
            marketCap: 42910000000,
            volume24h: 1654000000,
            iconUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png'
          },
          {
            id: 'ripple',
            name: 'XRP',
            symbol: 'XRP',
            price: 0.72,
            change24h: -2.14,
            marketCap: 34520000000,
            volume24h: 2134000000,
            iconUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png'
          }
        ]);
      }, 500);
    });
  },
  
  // Get historical price data for a specific cryptocurrency
  getPriceHistory: async (coinId: string): Promise<PriceData[]> => {
    // Generate some mock historical data
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const basePrice = coinId === 'bitcoin' ? 57000 : 
                          coinId === 'ethereum' ? 3100 :
                          coinId === 'solana' ? 120 : 
                          coinId === 'binancecoin' ? 415 :
                          coinId === 'cardano' ? 1.25 : 0.7;
        
        // Generate 30 days of hourly data
        const data: PriceData[] = [];
        for (let i = 0; i < 30 * 24; i++) {
          const timestamp = now - (30 * 24 - i) * 60 * 60 * 1000;
          const randomFactor = 0.95 + Math.random() * 0.1; // Random factor between 0.95 and 1.05
          data.push({
            timestamp,
            price: basePrice * randomFactor * (1 + Math.sin(i / 30) * 0.05)
          });
        }
        
        resolve(data);
      }, 800);
    });
  },
  
  // Get price prediction for the next 7 days
  getPrediction: async (coinId: string): Promise<PriceData[]> => {
    // Generate some mock prediction data
    return new Promise((resolve) => {
      setTimeout(() => {
        const latestData = cryptoService.getPriceHistory(coinId).then(data => {
          const lastPrice = data[data.length - 1].price;
          const lastTimestamp = data[data.length - 1].timestamp;
          const oneDay = 24 * 60 * 60 * 1000;
          
          // Generate 7 days of predicted hourly data
          const predictionData: PriceData[] = [];
          for (let i = 1; i <= 7 * 24; i++) {
            const timestamp = lastTimestamp + i * 60 * 60 * 1000;
            const trend = coinId === 'bitcoin' || coinId === 'solana' || coinId === 'cardano' ? 1.0005 : 0.9995;
            const randomFactor = 0.98 + Math.random() * 0.04; // Random factor between 0.98 and 1.02
            const predictedPrice = lastPrice * Math.pow(trend, i) * randomFactor;
            
            predictionData.push({
              timestamp,
              price: predictedPrice,
              isPrediction: true
            });
          }
          
          resolve(predictionData);
        });
      }, 1000);
    });
  }
};
