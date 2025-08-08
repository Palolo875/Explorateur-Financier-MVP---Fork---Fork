import React, { useEffect, useState, Component } from 'react';
// Type definitions
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
  urlToImage?: string;
}
interface StockQuote {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
}
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}
interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}
interface QuoteData {
  content: string;
  author: string;
}
interface AdviceData {
  id: number;
  advice: string;
}
// CryptoData interface
interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}
interface ActivityData {
  activity: string;
  type: string;
  participants: number;
  price: number;
}
interface MarketIndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}
interface CountryEconomicData {
  country: string;
  gdp: number;
  inflation: number;
  unemployment: number;
}
class ExternalAPIService {
  private static instance: ExternalAPIService;
  private cache: Map<string, {
    data: any;
    timestamp: number;
  }>;
  private cacheDuration: number = 30 * 60 * 1000; // 30 minutes par défaut
  private constructor() {
    this.cache = new Map();
    // Réduire la durée du cache pour les données météo et autres données volatiles
    this.setCacheDurationForType('weather', 10 * 60 * 1000); // 10 minutes pour la météo
  }
  // Ajout d'une durée de cache spécifique par type de données
  private cacheDurations: Map<string, number> = new Map();
  // Configurer une durée de cache spécifique pour un type de données
  public setCacheDurationForType(type: string, durationInMs: number): void {
    this.cacheDurations.set(type, durationInMs);
  }
  // Obtenir la durée de cache pour un type spécifique
  private getCacheDurationForType(type: string): number {
    return this.cacheDurations.get(type) || this.cacheDuration;
  }
  public static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }
  // Configurer la durée du cache
  public setCacheDuration(durationInMs: number): void {
    this.cacheDuration = durationInMs;
  }
  // Cache management
  private getCache<T>(key: string): T | null {
    const cachedItem = this.cache.get(key);
    if (cachedItem) {
      // Détecter le type de données pour appliquer la bonne durée de cache
      const dataType = key.split('_')[0]; // ex: weather_Paris_FR => weather
      const cacheDuration = this.getCacheDurationForType(dataType);
      // Check if cache is still valid with the appropriate duration
      if (Date.now() - cachedItem.timestamp < cacheDuration) {
        return cachedItem.data as T;
      }
    }
    return null;
  }
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  // Nouvelle méthode pour gérer les appels API avec fallback
  private async withFallback<T>(apiCall: () => Promise<T>, fallback: () => T, cacheKey: string): Promise<T> {
    try {
      const cachedData = this.getCache<T>(cacheKey);
      if (cachedData) return cachedData;
      const result = await apiCall();
      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.warn(`API call failed, using fallback: ${error}`);
      const fallbackData = fallback();
      this.setCache(cacheKey, fallbackData);
      return fallbackData;
    }
  }
  // Méthode générique pour les appels API avec gestion d'erreur
  private async fetchWithErrorHandling<T>(url: string, options?: RequestInit, mockDataFn?: () => T): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      if (mockDataFn) {
        console.log('Using mock data as fallback');
        return mockDataFn();
      }
      throw error;
    }
  }
  // News API - Get news articles by keywords using Gnews (API gratuite avec limite)
  public async getNewsArticles(keywords: string, count: number = 5): Promise<NewsArticle[]> {
    return this.withFallback(async () => {
      // Utilisation de l'API Gnews (gratuite avec limite)
      const apiKey = 'c01873f1471c862b7b787e3e82f9a561'; // Clé démo - à remplacer par la vôtre
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keywords)}&max=${count}&lang=fr&apikey=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      // Transformer les données au format attendu
      return data.articles?.map((article: any) => ({
        title: article.title,
        description: article.description,
        url: article.url,
        source: {
          name: article.source?.name || 'Source inconnue'
        },
        publishedAt: article.publishedAt,
        urlToImage: article.image
      })) || [];
    }, () => this.getMockNewsData(keywords, count), `news_${keywords}_${count}`);
  }
  // Autres méthodes avec la nouvelle approche
  public async getStockQuote(symbol: string): Promise<StockQuote | null> {
    return this.withFallback(async () => {
      // Alpha Vantage API (gratuite avec limite)
      const apiKey = 'QGQZR6ZV2RSUWPQR'; // Clé démo - à remplacer par la vôtre
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      // Si l'API renvoie une erreur ou pas de données
      if (!data || !data['Global Quote'] || Object.keys(data['Global Quote']).length === 0) {
        throw new Error('No stock data available');
      }
      return {
        symbol: data['Global Quote']['01. symbol'] || symbol,
        price: data['Global Quote']['05. price'] || '0.00',
        change: data['Global Quote']['09. change'] || '0.00',
        changePercent: data['Global Quote']['10. change percent']?.replace('%', '') || '0.00'
      };
    }, () => this.getMockStockQuote(symbol), `stock_${symbol}`);
  }
  // Mock data generators
  private getMockNewsData(keywords: string, count: number): NewsArticle[] {
    const mockArticles: NewsArticle[] = [{
      title: `Dernières tendances en ${keywords}`,
      description: `Découvrez les dernières tendances en matière de ${keywords} et comment elles peuvent affecter votre situation financière.`,
      url: 'https://example.com/article1',
      source: {
        name: 'Finance Actualités'
      },
      publishedAt: new Date().toISOString()
    }, {
      title: `Comment optimiser votre ${keywords}`,
      description: `Des experts partagent leurs conseils pour optimiser votre ${keywords} et maximiser votre rendement.`,
      url: 'https://example.com/article2',
      source: {
        name: 'Économie Plus'
      },
      publishedAt: new Date().toISOString()
    }
    // ... autres articles mock
    ];
    return mockArticles.slice(0, count);
  }
  private getMockStockQuote(symbol: string): StockQuote {
    // Generate random price and change values
    const price = (Math.random() * 1000 + 50).toFixed(2);
    const change = (Math.random() * 10 - 5).toFixed(2);
    const changePercent = (parseFloat(change) / parseFloat(price) * 100).toFixed(2);
    return {
      symbol: symbol,
      price: price,
      change: change,
      changePercent: changePercent
    };
  }
}
// Create singleton instance
export const externalApiService = ExternalAPIService.getInstance();
// Export the hooks
export function useNewsData(keywords: string, count: number = 5) {
  const [data, setData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const newsData = await apiService.getNewsArticles(keywords, count);
        setData(newsData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les actualités');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [keywords, count]);
  return {
    data,
    loading,
    error
  };
}
export function useStockQuote(symbol: string) {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const quoteData = await apiService.getStockQuote(symbol);
        setData(quoteData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les données boursières');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol]);
  return {
    data,
    loading,
    error
  };
}
export function useCryptoData(currency: string = 'eur', limit: number = 5) {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const cryptoData = await apiService.getCryptoData(currency, limit);
        setData(cryptoData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les données crypto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currency, limit]);
  return {
    data,
    loading,
    error
  };
}
export function useActivitySuggestion() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const activityData = await apiService.getActivitySuggestion();
        setActivity(activityData);
        setError(null);
      } catch (err) {
        setError("Impossible de charger la suggestion d'activité");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return {
    activity,
    loading,
    error
  };
}
export function useWeatherData(city: string, country: string = 'FR') {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const weatherData = await apiService.getWeatherData(city, country);
        setData(weatherData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les données météo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [city, country]);
  return {
    data,
    loading,
    error
  };
}
export function useMarketIndices() {
  const [data, setData] = useState<MarketIndexData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const indicesData = await apiService.getMarketIndices();
        setData(indicesData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les indices de marché');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return {
    data,
    loading,
    error
  };
}
export function useCentralBankRates() {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const ratesData = await apiService.getCentralBankRates();
        setData(ratesData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les taux des banques centrales');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return {
    data,
    loading,
    error
  };
}
export function useCountryEconomicData(country: string = 'France') {
  const [data, setData] = useState<CountryEconomicData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiService = ExternalAPIService.getInstance();
        const economicData = await apiService.getCountryEconomicData(country);
        setData(economicData);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les données économiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [country]);
  return {
    data,
    loading,
    error
  };
}