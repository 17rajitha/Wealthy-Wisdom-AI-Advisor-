
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type HealthStatus = 'Good' | 'Average' | 'Risky';
export type InsuranceFrequency = 'none' | 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
];

export interface FinancialData {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyEMI: number;
  healthExpenses: number;
  hasHealthInsurance: boolean;
  dependents: number;
  currency: string;
  // Specific Savings
  savings: {
    mutualFunds: number;
    fixedDeposits: number;
    bankSavings: number;
    gold: number;
    generalSavings: number;
  };
  // Detailed Insurance
  termInsurance: {
    hasPolicy: boolean;
    premium: number;
    frequency: InsuranceFrequency;
  };
  lifeInsurance: {
    hasPolicy: boolean;
    premium: number;
    frequency: InsuranceFrequency;
  };
}

export interface AIAdvice {
  riskLevel: RiskLevel;
  healthScore: number;
  healthStatus: HealthStatus;
  explanation: string;
  advicePoints: string[];
  smartActions: string[];
  warnings: string[];
  savingsHealthScore: number;
  protectionScore: number;
}

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(amount);
};
