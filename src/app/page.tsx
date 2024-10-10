import CurrencyConverter from '@/components/CurrencyConverter';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <h1 className="text-6xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 animate-fade-in-down">
        Currency Converter
      </h1>
      <CurrencyConverter />
    </div>
  );
}
