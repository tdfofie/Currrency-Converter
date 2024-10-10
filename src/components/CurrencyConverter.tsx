"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { fetchHistoricalRates } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR','GHS', 'NGN'];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('');
  const [historicalRates, setHistoricalRates] = useState([]);
  const { rates, loading, error } = useExchangeRates(fromCurrency);
  

  const handleConvert = () => {
    if (rates && rates[toCurrency]) {
      const convertedAmount = (parseFloat(amount) * rates[toCurrency]).toFixed(2);
      setResult(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const today = new Date();
        const dates = Array.from({length: 7}, (_, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        const historicalData: {
            date: string;
            rate: number;
        }[] = await Promise.all(dates.map(async (date) => {
          const data = await fetchHistoricalRates(date, fromCurrency);
          return { date, rate: data.rates[toCurrency] };
        }));

        setHistoricalRates(historicalData);
      } catch (error) {
        console.error('Error fetching historical rates:', error);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchHistoricalData();
    }
  }, [fromCurrency, toCurrency]);

  if (loading) return <Loader2 className="h-12 w-12 animate-spin text-blue-500" />;
  if (error) return <div className="text-red-500 font-semibold text-center">Error: {error.message}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto px-4"
    >
      <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl rounded-2xl overflow-hidden border-t border-l border-white/50 dark:border-gray-700/50">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <CardTitle className="text-3xl font-bold text-center">Convert Currency</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl transition-all duration-300"
            />
            <div className="flex items-center space-x-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl transition-all duration-300">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSwapCurrencies} variant="outline" size="icon" className="rounded-full p-2 bg-white/50 dark:bg-gray-700/50 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300">
                <ArrowRightLeft className="h-6 w-6 text-blue-500 dark:text-blue-400" />
              </Button>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-full bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400 rounded-xl transition-all duration-300">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleConvert} className="w-full text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl py-3 transition-all duration-300 transform hover:scale-105">
              Convert
            </Button>
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-center font-semibold text-xl bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-xl shadow-inner"
                >
                  {result}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {historicalRates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Historical Exchange Rates</h3>
              <div className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 shadow-inner">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalRates}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#9CA3AF" />
                    <XAxis dataKey="date" stroke="#4B5563" />
                    <YAxis stroke="#4B5563" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '0.5rem' }} />
                    <Line type="monotone" dataKey="rate" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6, fill: '#2563EB' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
