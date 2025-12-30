
import React from 'react';
import { FinancialData, SUPPORTED_CURRENCIES, formatCurrency } from '../types';

interface FinanceFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
}

const FinanceForm: React.FC<FinanceFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<FinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyEMI: 0,
    healthExpenses: 0,
    hasHealthInsurance: false,
    dependents: 0,
    currency: 'INR',
    savings: {
      mutualFunds: 0,
      fixedDeposits: 0,
      bankSavings: 0,
      gold: 0,
      generalSavings: 0
    },
    termInsurance: { hasPolicy: false, premium: 0, frequency: 'monthly' },
    lifeInsurance: { hasPolicy: false, premium: 0, frequency: 'monthly' }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('savings.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        savings: { ...prev.savings, [field]: parseFloat(value) || 0 }
      }));
    } else if (name.startsWith('term.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        termInsurance: { 
          ...prev.termInsurance, 
          [field]: type === 'checkbox' ? checked : (field === 'premium' ? (parseFloat(value) || 0) : value)
        }
      }));
    } else if (name.startsWith('life.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        lifeInsurance: { 
          ...prev.lifeInsurance, 
          [field]: type === 'checkbox' ? checked : (field === 'premium' ? (parseFloat(value) || 0) : value)
        }
      }));
    } else if (name === 'hasHealthInsurance') {
      setFormData(prev => ({ ...prev, hasHealthInsurance: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'currency' ? value : (parseFloat(value) || 0)
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const InputField = ({ label, name, value, onChange, isPeople = false }: any) => (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value === 0 ? '' : value}
          onChange={onChange}
          placeholder="0"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white font-semibold transition-all text-sm"
        />
        {value > 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded pointer-events-none flex items-center gap-1">
            {isPeople ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                {value} {value === 1 ? 'Member' : 'Members'}
              </>
            ) : (
              formatCurrency(value, formData.currency)
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Financial Profile</h2>
          <p className="text-sm text-slate-500 font-medium">Complete the details below for a precision AI assessment.</p>
        </div>
        <select 
          name="currency" 
          value={formData.currency} 
          onChange={handleChange}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-3 py-2 outline-none uppercase tracking-widest"
        >
          {SUPPORTED_CURRENCIES.map(curr => <option key={curr.code} value={curr.code}>{curr.symbol} {curr.code}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Column 1: Core Cashflow */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Monthly Cashflow</h3>
            <div className="space-y-4">
              <InputField label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} />
              <InputField label="Monthly Expenses" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleChange} />
              <InputField label="Monthly EMI / Loans" name="monthlyEMI" value={formData.monthlyEMI} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Health & Wellness</h3>
            <div className="space-y-4">
              <InputField label="Average Health Spending" name="healthExpenses" value={formData.healthExpenses} onChange={handleChange} />
              <label className="flex items-center space-x-3 cursor-pointer group pt-1">
                <input type="checkbox" name="hasHealthInsurance" checked={formData.hasHealthInsurance} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">I have active health insurance</span>
              </label>
            </div>
          </div>
        </section>

        {/* Column 2: Savings & Protection */}
        <section className="space-y-8">
           <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Monthly Savings</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="General" name="savings.generalSavings" value={formData.savings.generalSavings} onChange={handleChange} />
              <InputField label="SIP / Mutual Funds" name="savings.mutualFunds" value={formData.savings.mutualFunds} onChange={handleChange} />
              <InputField label="Fixed Deposits" name="savings.fixedDeposits" value={formData.savings.fixedDeposits} onChange={handleChange} />
              <InputField label="Gold/Other" name="savings.gold" value={formData.savings.gold} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Insurance Policies</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" name="term.hasPolicy" checked={formData.termInsurance.hasPolicy} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Active Term Insurance</span>
                </label>
                {formData.termInsurance.hasPolicy && (
                  <div className="pl-7 space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <InputField label="Term Premium Amount" name="term.premium" value={formData.termInsurance.premium} onChange={handleChange} />
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Cycle</label>
                      <select name="term.frequency" value={formData.termInsurance.frequency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half-yearly">Half Yearly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" name="life.hasPolicy" checked={formData.lifeInsurance.hasPolicy} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Active Life Insurance</span>
                </label>
                {formData.lifeInsurance.hasPolicy && (
                  <div className="pl-7 space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <InputField label="Life Premium Amount" name="life.premium" value={formData.lifeInsurance.premium} onChange={handleChange} />
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Cycle</label>
                      <select name="life.frequency" value={formData.lifeInsurance.frequency} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="half-yearly">Half Yearly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-56">
          <InputField label="Family Members (Dependents)" name="dependents" value={formData.dependents} onChange={handleChange} isPeople={true} />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black active:scale-[0.98]'}`}
        >
          {isLoading ? 'ANALYZING PROFILE...' : 'GENERATE ANALYSIS'}
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;
