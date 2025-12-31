
import React, { useState, useEffect } from 'react';
import { AIAdvice, FinancialData, HealthStatus, formatCurrency } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ advice, data }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Small delay ensures the parent container has settled in the DOM before Recharts measures it
    const timer = setTimeout(() => setIsMounted(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const healthChartData = [
    { name: 'Score', value: advice.healthScore },
    { name: 'Remaining', value: 100 - advice.healthScore }
  ];
  
  const HEALTH_COLORS = [
    advice.healthStatus === 'Good' ? '#10b981' : advice.healthStatus === 'Average' ? '#f59e0b' : '#ef4444',
    '#f1f5f9'
  ];

  const totalSavings = Object.values(data.savings).reduce((a, b) => a + b, 0);
  const totalOutflow = data.monthlyExpenses + data.monthlyEMI + totalSavings;
  const surplus = Math.max(0, data.monthlyIncome - totalOutflow);
  
  const budgetChartData = [
    { name: 'Expenses', value: data.monthlyExpenses, color: '#0ea5e9' },
    { name: 'EMIs', value: data.monthlyEMI, color: '#f43f5e' },
    { name: 'Savings', value: totalSavings, color: '#10b981' },
    { name: 'Surplus', value: surplus, color: '#94a3b8' }
  ].filter(item => item.value > 0);

  if (!isMounted) return <div className="min-h-[600px] flex items-center justify-center text-slate-400 font-medium">Preparing Dashboard...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex flex-col items-center justify-center space-y-3 flex-shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <PieChart width={128} height={128}>
                <Pie data={healthChartData} cx={64} cy={64} innerRadius={45} outerRadius={55} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                  {healthChartData.map((_, index) => <Cell key={index} fill={HEALTH_COLORS[index]} cornerRadius={index === 0 ? 10 : 0} />)}
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${advice.riskLevel === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>RISK: {advice.riskLevel.toUpperCase()}</span>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 whitespace-pre-wrap">
              <FormattedText text={advice.explanation} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Budget Split</h3>
           {/* Parent div with explicit dimensions for ResponsiveContainer */}
           <div className="w-full h-48 min-h-[192px] relative overflow-hidden flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie data={budgetChartData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value">
                    {budgetChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value, data.currency)} 
                    contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-4 flex flex-wrap justify-center gap-3">
             {budgetChartData.map((item, i) => (
               <div key={i} className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{item.name}</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* New Goal Analysis Section */}
      {advice.goalFeasibility && advice.goalFeasibility.length > 0 && (
        <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 shadow-sm">
          <h3 className="text-lg font-bold text-blue-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Goal Feasibility Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advice.goalFeasibility.map((goal, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-blue-200/50 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{goal.goalName}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${goal.isFeasible ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {goal.isFeasible ? 'On Track' : 'Adjustment Needed'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{goal.suggestion}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl shadow-sm text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center text-emerald-400">✦ Recommendations</h3>
          <ul className="space-y-3">
            {advice.smartActions.map((action, i) => (
              <li key={i} className="flex items-start bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="text-emerald-400 font-bold mr-3">•</span>
                <span className="text-sm font-medium leading-snug"><FormattedText text={action} /></span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">◎ Critical Insights</h3>
          <ul className="space-y-4">
            {advice.advicePoints.map((point, i) => (
              <li key={i} className="flex items-start text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 mr-3 flex-shrink-0"></span>
                <span><FormattedText text={point} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
