
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft } from "lucide-react";

const CurrencyConversion = () => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [rate, setRate] = useState(75.5); // Fixed rate as fallback
  const [convertedAmount, setConvertedAmount] = useState(0);
  
  useEffect(() => {
    // In a real app, you would fetch the current exchange rate from an API
    // For demo purposes, we'll use a fixed rate
    if (from === 'USD' && to === 'INR') {
      setRate(75.5);
    } else if (from === 'INR' && to === 'USD') {
      setRate(1 / 75.5);
    }
  }, [from, to]);
  
  useEffect(() => {
    setConvertedAmount(amount * rate);
  }, [amount, rate]);
  
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };
  
  return (
    <Card className="glass-panel p-6">
      <h3 className="text-lg font-medium mb-4">Currency Conversion</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="glass-input"
            />
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={handleSwap} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Converted</p>
            <Input
              type="number"
              value={convertedAmount.toFixed(2)}
              readOnly
              className="glass-input bg-gray-50 dark:bg-gray-800/50"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <select 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="glass-input w-full"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
          
          <div className="w-10"></div>
          
          <div className="flex-1">
            <select 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="glass-input w-full"
            >
              <option value="USD">USD</option>
              <option value="INR">INR</option>
            </select>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          Exchange Rate: 1 {from} = {rate.toFixed(4)} {to}
        </p>
      </div>
    </Card>
  );
};

export default CurrencyConversion;
