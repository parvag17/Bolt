import { Currency } from '../types';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
  { code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'en-HK' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', locale: 'nb-NO' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', locale: 'da-DK' },
  { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', locale: 'pl-PL' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', locale: 'ru-RU' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', locale: 'tr-TR' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', locale: 'th-TH' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', locale: 'ms-MY' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', locale: 'id-ID' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', locale: 'en-PH' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', locale: 'vi-VN' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', locale: 'ar-AE' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', locale: 'ar-SA' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£', locale: 'ar-EG' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', locale: 'he-IL' },
];

export const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  
  if (!currency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    minimumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' || currency.code === 'VND' ? 0 : 2,
    maximumFractionDigits: currency.code === 'JPY' || currency.code === 'KRW' || currency.code === 'VND' ? 0 : 2,
  }).format(amount);
};

export const getCurrencySymbol = (currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.symbol || '$';
};

export const getCurrencyName = (currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.name || 'US Dollar';
};