
import React, { useState, useEffect } from 'react';
import { AIAdvice, FinancialData, HealthStatus, formatCurrency } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AnalysisDashboardProps {
  advice: AIAdvice;
  data: FinancialData;
}

const StatusLabel: React.FC<{ status: HealthStatus }> = ({ status }) => {
  const config = {
    Good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Average: 'bg-amber-50 text-amber-700 border-amber-100',
    Risky: 'bg-rose-50 text-rose-700 border-rose-100',
  };
  return (
    <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${config[status]}`}>
      {status}
    </div>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ advice, data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Health Score Chart Data
  const healthChartData = [
    { name: 'Score', value: advice.healthScore },
    { name: 'Remaining', value: 100 - advice.healthScore }
  ];
  const HEALTH_COLORS = [
    advice.healthStatus === 'Good' ? '#4f46e5' : advice.healthStatus === 'Average' ? '#f59e0b' : '#ef4444',
    '#f1f5f9'
  ];

  // Budget Breakdown Chart Data
  const totalSavings = data.savings.mutualFunds + data.savings.fixedDeposits + data.savings.bankSavings + data.savings.gold + data.savings.generalSavings;
  const surplus = Math.max(0, data.monthlyIncome - (data.monthlyExpenses + data.monthlyEMI + totalSavings));
  
  const budgetChartData = [
    { name: 'Expenses', value: data.monthlyExpenses, color: '#6366f1' }, // Indigo 500
    { name: 'EMIs', value: data.monthlyEMI, color: '#f43f5e' }, // Rose 500
    { name: 'Savings', value: totalSavings, color: '#10b981' }, // Emerald 500
    { name: 'Surplus', value: surplus, color: '#94a3b8' } // Slate 400
  ].filter(item => item.value > 0);

  if (!isMounted) return <div className="min-h-[400px]" />;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score & Verdict Card */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center justify-center space-y-3 flex-shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Use fixed dimensions for small gauges to avoid ResponsiveContainer warnings */}
              <PieChart width={128} height={128}>
                <Pie 
                  data={healthChartData} 
                  cx={64} 
                  cy={64} 
                  innerRadius={45} 
                  outerRadius={55} 
                  startAngle={90} 
                  endAngle={-270} 
                  dataKey="value" 
                  stroke="none"
                >
                  {healthChartData.map((_, index) => (
                    <Cell key={index} fill={HEALTH_COLORS[index]} cornerRadius={index === 0 ? 10 : 0} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-800">{advice.healthScore}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Health</span>
              </div>
            </div>
            <StatusLabel status={advice.healthStatus} />
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Verdict</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${advice.riskLevel === 'High' ? 'text-rose-600 border-rose-100 bg-rose-50' : advice.riskLevel === 'Medium' ? 'text-amber-600 border-amber-100 bg-amber-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}>
                RISK: {advice.riskLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
              "{advice.explanation}"
            </p>
          </div>
        </div>

        {/* Budget Allocation Chart Card */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Budget Allocation</h3>
           <div className="w-full h-48 min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={budgetChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {budgetChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value, data.currency)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Actions Card */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-sm text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <span className="text-indigo-400 mr-2 text-xl">✦</span> Recommendations
          </h3>
          <ul className="space-y-3">
            {advice.smartActions.map((action, i) => (
              <li key={i} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                <span className="text-indigo-400 font-bold mr-3">•</span>
                <span className="text-sm font-medium leading-snug">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Insights Card */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
               <span className="text-slate-400 mr-2 text-xl">◎</span> Observations
            </h3>
            <ul className="space-y-4">
              {advice.advicePoints.map((point, i) => (
                <li key={i} className="flex items-start text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {advice.warnings.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Critical Warnings</h4>
                <div className="flex flex-wrap gap-2">
                  {advice.warnings.map((warn, i) => (
                    <span key={i} className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-100 rounded-lg flex items-center animate-in fade-in zoom-in duration-300">
                      <div className="w-1 h-1 bg-rose-600 rounded-full mr-2"></div>
                      {warn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          Verified by Gemini Neural Engine
        </span>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
