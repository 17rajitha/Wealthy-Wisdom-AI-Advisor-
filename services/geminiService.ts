
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, AIAdvice, formatCurrency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFinance = async (data: FinancialData): Promise<AIAdvice> => {
  const formattedIncome = formatCurrency(data.monthlyIncome, data.currency);
  const totalMonthlySavings = data.savings.mutualFunds + data.savings.fixedDeposits + data.savings.bankSavings + data.savings.gold + data.savings.generalSavings;
  
  const prompt = `
    Act as a professional personal finance advisor. Analyze this data to provide a risk assessment:
    - Currency: ${data.currency}
    - Monthly Income: ${formattedIncome}
    - Total Monthly Savings: ${formatCurrency(totalMonthlySavings, data.currency)} 
      (General Savings: ${data.savings.generalSavings}, MFs: ${data.savings.mutualFunds}, FDs: ${data.savings.fixedDeposits}, Bank: ${data.savings.bankSavings}, Gold: ${data.savings.gold})
    - Monthly Expenses: ${formatCurrency(data.monthlyExpenses, data.currency)}
    - Monthly EMI/Loans: ${formatCurrency(data.monthlyEMI, data.currency)}
    - Monthly Health Expenses: ${formatCurrency(data.healthExpenses, data.currency)}
    - Has Health Insurance: ${data.hasHealthInsurance ? 'Yes' : 'No'}
    - Term Insurance: ${data.termInsurance.hasPolicy ? `Yes (Premium: ${data.termInsurance.premium})` : 'No'}
    - Life Insurance: ${data.lifeInsurance.hasPolicy ? `Yes (Premium: ${data.lifeInsurance.premium})` : 'No'}
    - Dependents: ${data.dependents}

    Specific logic to apply:
    1. If Savings < 20% of Income, warn: "You are not saving enough for emergencies."
    2. If Health Expenses > 10% of Income and Has Health Insurance is No, warn: "Your health expenses are high. You should consider a health insurance plan."
    3. If Dependents > 0 and Term Insurance is No, warn: "You do not have term insurance, which is risky for a family with dependents."
    4. Provide exactly 3 Smart Actions.
    5. Financial Risk Level must be one of: Low, Medium, High.

    Provide response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING },
          healthScore: { type: Type.NUMBER },
          healthStatus: { type: Type.STRING },
          explanation: { type: Type.STRING },
          advicePoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          smartActions: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          savingsHealthScore: { type: Type.NUMBER },
          protectionScore: { type: Type.NUMBER }
        },
        required: ['riskLevel', 'healthScore', 'healthStatus', 'explanation', 'advicePoints', 'smartActions', 'warnings', 'savingsHealthScore', 'protectionScore']
      }
    }
  });

  return JSON.parse(response.text.trim()) as AIAdvice;
};

export const generateAppLogo = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: "A sophisticated, ultra-minimalist luxury fintech logo icon. A single elegant symbol combining a stylized diamond and a subtle upward trend line. Monochromatic Indigo and Slate. Clean, sharp vector lines. High contrast, isolated on white background. Professional, high-end corporate identity style."
        }]
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (e) {
    console.error("Logo generation failed", e);
    return null;
  }
};
