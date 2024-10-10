import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '@/lib/api';

export function useExchangeRates(baseCurrency: string) {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cachedRates = localStorage.getItem(`exchangeRates_${baseCurrency}`);
    const cachedTimestamp = localStorage.getItem(`exchangeRatesTimestamp_${baseCurrency}`);

    if (cachedRates && cachedTimestamp) {
      const now = new Date().getTime();
      const cacheAge = now - parseInt(cachedTimestamp);

      if (cacheAge < 60 * 60 * 1000) { // 1 hour
        setRates(JSON.parse(cachedRates));
        setLoading(false);
        return;
      }
    }

    fetchExchangeRates(baseCurrency)
      .then((data) => {
        setRates(data.rates);
        localStorage.setItem(`exchangeRates_${baseCurrency}`, JSON.stringify(data.rates));
        localStorage.setItem(`exchangeRatesTimestamp_${baseCurrency}`, new Date().getTime().toString());
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [baseCurrency]);

  return { rates, loading, error };
}