const API_BASE_URL = 'https://api.exchangerate-api.com/v4';

async function handleApiResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchExchangeRates(baseCurrency: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/latest/${baseCurrency}`);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates. Please check your internet connection and try again.');
  }
}

export async function fetchHistoricalRates(date: string, baseCurrency: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/historical/${date}/${baseCurrency}`);
    return handleApiResponse(response);
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    throw new Error('Failed to fetch historical rates. Please check your internet connection and try again.');
  }
}