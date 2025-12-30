
import React, { useState, useEffect } from 'react';
import FinanceForm from './components/FinanceForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import { FinancialData, AIAdvice } from './types';
import { analyzeFinance, generateAppLogo } from './services/geminiService';

const App: React.FC = () => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [lastData, setLastData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    generateAppLogo().then(setLogoUrl);
  }, []);

  const handleFormSubmit = async (data: FinancialData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFinance(data);
      setAdvice(result);
      setLastData(data);
      setTimeout(() => {
        const resultEl = document.getElementById('analysis-result');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. Please check your data or API connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={logoUrl} alt="WealthWisdom" className="w-9 h-9 rounded-xl shadow-sm object-cover ring-1 ring-slate-200" />
            ) : (
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            )}
            <span className="text-xl font-bold tracking-tight text-slate-900">
              WealthWisdom
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">AI Powered</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16 space-y-16">
        {/* Simplified Header Section */}
        <section className="text-center space-y-6">
          {logoUrl && (
            <div className="flex justify-center mb-6">
              <img src={logoUrl} alt="App Logo" className="w-24 h-24 rounded-[2rem] shadow-xl ring-1 ring-slate-100" />
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Secure your financial <br/>
            <span className="text-indigo-600">future today.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
            Professional AI analysis for savings, health coverage, and life protection in a single glance.
          </p>
        </section>

        {/* Cleaner Mission Section */}
        <section className="max-w-3xl mx-auto">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm text-center">
            <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Our Commitment</h2>
            <p className="text-lg md:text-xl text-slate-700 font-bold leading-snug">
              "We leverage advanced AI to simplify financial planning. WealthWisdom provides unbiased, data-driven insights to help you build a robust financial foundation."
            </p>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center max-w-2xl mx-auto">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="space-y-16">
          <FinanceForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {advice && lastData && (
            <div id="analysis-result" className="pt-4">
              <AnalysisDashboard advice={advice} data={lastData} />
            </div>
          )}
        </div>

        {/* Professional Data Safety Section */}
        <section className="max-w-2xl mx-auto pt-12">
          <div className="bg-indigo-50/30 p-8 rounded-3xl border border-indigo-100/50 flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0 border border-indigo-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Privacy First</h3>
              <p className="text-sm text-slate-600 font-medium">
                Analysis is performed in transient memory. No personal financial records are stored.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-32 py-12 border-t border-slate-200 text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-4">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
            WealthWisdom AI • Gemini 2.5 Powered
          </p>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest opacity-60">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
