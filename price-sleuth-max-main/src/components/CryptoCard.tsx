
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  iconUrl: string;
  onClick: () => void;
}

const CryptoCard = ({ name, symbol, price, change24h, iconUrl, onClick }: CryptoCardProps) => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [price]);
  
  const isPositive = change24h >= 0;
  
  return (
    <Card 
      onClick={onClick}
      className={`glass-card overflow-hidden p-4 hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
        animate ? (isPositive ? 'bg-green-50/30' : 'bg-red-50/30') : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
            <img src={iconUrl} alt={name} className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{symbol}</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-semibold">${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <div className={`flex items-center justify-end text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(change24h).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CryptoCard;
