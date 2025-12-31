<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1m40MhERkZZZQ-ZoVUBqxhgnuAkHZi7YO

# WealthWisdom AI Advisor

**Live App:**  
https://ai.studio/apps/drive/1m40MhERkZZZQ-ZoVUBqxhgnuAkHZi7YO

WealthWisdom AI Advisor is an AI-powered personal finance assistant that helps individuals and families understand their income, expenses, loans, savings, and financial risk using Google Gemini.

It provides clear, friendly, and data-driven insights to support better financial decisions.

---

## What it does

Users enter:
- Monthly income
- Expenses
- EMIs
- Savings
- Health expenses
- Insurance and emergency fund

The AI then:
- Calculates financial risk
- Identifies cash flow stress or surplus
- Explains results in simple language
- Gives actionable suggestions
- Displays a visual breakdown of income vs expenses

---

## Golden Prompt

Build an AI-powered personal finance advisor called "WealthWisdom AI Advisor" that takes user inputs like income, expenses, EMIs, savings, health expenses, insurance, and emergency fund, and uses AI to analyze financial risk, savings ability, and future money stress. The app should show results in simple, friendly language like a financial coach and provide actionable advice. Include a clean UI and a simple chart to visualize income vs expenses.

---


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
