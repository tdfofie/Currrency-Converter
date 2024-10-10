"use client"

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightLeft, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { fetchHistoricalRates } from '@/lib/api';
import { useToast } from "@/hooks/use-toast"

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'GHS', 'NGN'];

interface HistoricalRate {
  date: string;
  rate: number;
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const { rates, loading, error, refreshRates } = useExchangeRates(fromCurrency);
  const { toast } = useToast()

  const convertCurrency = useCallback(() => {
    if (rates && rates[toCurrency]) {
      const result = parseFloat(amount) * rates[toCurrency];
      setConvertedAmount(result);
    }
  }, [amount, rates, toCurrency]);

  const fetchHistoricalData = useCallback(async () => {
    try {
      const today = new Date();
      const data: HistoricalRate[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = date.toISOString().split('T')[0];
        const historicalRates = await fetchHistoricalRates(formattedDate, fromCurrency);
        data.push({
          date: formattedDate,
          rate: historicalRates.rates[toCurrency],
        });
      }
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch historical data. Please try again later.",
        variant: "destructive",
      })
    }
  }, [fromCurrency, toCurrency, toast]);

  useEffect(() => {
    if (rates) {
      convertCurrency();
      fetchHistoricalData();
    }
  }, [rates, fromCurrency, toCurrency, convertCurrency, fetchHistoricalData]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleRefresh = () => {
    refreshRates();
    fetchHistoricalData();
    toast({
      title: "Refreshed",
      description: "Currency rates have been updated.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Convert Currency</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-[180px]">
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
            <Button variant="outline" size="icon" onClick={handleSwapCurrencies}>
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-[180px]">
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
          {convertedAmount !== null && (
            <div className="text-2xl font-bold text-center">
              {parseFloat(amount).toFixed(2)} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
            </div>
          )}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}