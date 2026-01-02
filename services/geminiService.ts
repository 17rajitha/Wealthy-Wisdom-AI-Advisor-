
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { FinancialData, AIAdvice, formatCurrency } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are "WealthWisdom", an AI-powered personal finance assistant.
Your goal is to help users understand their income, expenses, savings, loans, insurance, and financial risk in a simple and friendly way.

Follow these principles:
1. CONTEXT: Support users across life stages — working professionals, families, small business owners, and retirees — with practical financial awareness.
2. KNOWLEDGE: Use general knowledge about budgeting, saving, loans, insurance, and common financial products.
3. TONE: Professional, supportive, and non-judgmental.
4. FORMATTING: Use clear language. Use **bold** for key points.
5. PURPOSE: Help users make better financial decisions by showing patterns, risks, and opportunities.
6. DEBT-VS-GOALS: If a user has a significant loan and a long-term goal (like child education), provide a strategy to balance both.

IMPORTANT: You must include this exact text at the end of every response: 
"\n\nDisclaimer: This is an AI-generated financial insight tool, not professional financial advice."`;

export const analyzeFinance = async (data: FinancialData): Promise<AIAdvice> => {
  const formattedIncome = formatCurrency(data.monthlyIncome, data.currency);
  // Fix: Explicitly cast Object.values to number[] to avoid "unknown" type error in reduce
  const totalMonthlySavings = (Object.values(data.savings) as number[]).reduce((a, b) => a + b, 0);
  
  const prompt = `
    Analyze this financial data:
    - Currency: ${data.currency}
    - Monthly Income: ${formattedIncome}
    - Monthly Expenses: ${formatCurrency(data.monthlyExpenses, data.currency)}
    - Monthly EMI/Loans: ${formatCurrency(data.monthlyEMI, data.currency)}
    - Total Monthly Savings: ${formatCurrency(totalMonthlySavings, data.currency)}
    - Dependents: ${data.dependents}
    - Protection: Health Insurance (${data.healthInsurance.hasPolicy}), Term (${data.termInsurance.hasPolicy})
    - Goals: ${JSON.stringify(data.goals)}

    Provide a strategy to balance current debt/expenses with their listed goals.
    Return JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
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
          protectionScore: { type: Type.NUMBER },
          goalFeasibility: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                goalName: { type: Type.STRING },
                isFeasible: { type: Type.BOOLEAN },
                suggestion: { type: Type.STRING }
              }
            }
          }
        },
        required: ['riskLevel', 'healthScore', 'healthStatus', 'explanation', 'advicePoints', 'smartActions', 'warnings', 'savingsHealthScore', 'protectionScore', 'goalFeasibility']
      }
    }
  });

  // Access .text property directly and handle potential undefined
  const responseText = response.text || "{}";
  return JSON.parse(responseText.trim()) as AIAdvice;
};

export const startChatSession = (context?: FinancialData): Chat => {
  let contextPrompt = "";
  if (context) {
    contextPrompt = `
      CURRENT USER PROFILE CONTEXT:
      - Monthly Income: ${context.monthlyIncome} ${context.currency}
      - Expenses: ${context.monthlyExpenses}, EMI: ${context.monthlyEMI}
      - Goals: ${JSON.stringify(context.goals)}
      User is specifically looking for advice on balancing their ₹2 lakh loan and education savings.
    `;
  }

  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + (contextPrompt ? `\n\n${contextPrompt}` : ""),
    },
  });
};

export const generateAppLogo = async (): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{
          text: "A professional and minimal startup logo for a finance app called WealthWisdom. The icon is a sleek, modern Banyan tree where the trunk looks like a rising currency graph. Primary color is a deep trust-blue (#1a237e) and soft growth-green (#2e7d32). White background, high quality vector style, clean lines, no text in the icon itself"
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
