
import React, { useMemo } from 'react';
import { Airman, Rank, Flight } from '../types';
import { Users, Shield, Plane, TrendingUp, PieChart } from 'lucide-react';

interface Props {
  data: Airman[];
}

const Overview: React.FC<Props> = ({ data }) => {
  const rankStats = useMemo(() => {
    const stats: Record<string, number> = {};
    Object.values(Rank).forEach(r => stats[r] = 0);
    data.forEach(item => {
      if (stats[item.rank] !== undefined) {
        stats[item.rank]++;
      }
    });
    return stats;
  }, [data]);

  const flightStats = useMemo(() => {
    const stats: Record<string, Record<string, number>> = {};
    Object.values(Flight).forEach(f => {
      stats[f] = {};
      Object.values(Rank).forEach(r => {
        stats[f][r] = 0;
      });
    });

    data.forEach(item => {
      if (stats[item.flight] && stats[item.flight][item.rank] !== undefined) {
        stats[item.flight][item.rank]++;
      }
    });
    return stats;
  }, [data]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Force" value={data.length} icon={<Users size={24} />} color="blue" />
        <StatCard title="Officers (WO+)" value={rankStats[Rank.MWO] + rankStats[Rank.SWO] + rankStats[Rank.WO]} icon={<Shield size={24} />} color="indigo" />
        <StatCard title="NCO Force" value={rankStats[Rank.Sgt] + rankStats[Rank.Cpl]} icon={<Plane size={24} />} color="purple" />
        <StatCard title="Other Ranks" value={rankStats[Rank.LAC] + rankStats[Rank.AC]} icon={<TrendingUp size={24} />} color="slate" />
      </div>

      {/* Rank Wise Breakdown */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
          <PieChart className="text-blue-600" />
          Rank-wise distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {Object.entries(rankStats).map(([rank, count]) => (
            <div key={rank} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <div className="text-3xl font-black text-slate-900 mb-1">{count}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{rank.split(' (')[0]}</div>
              <div className="text-[10px] text-slate-400 font-bold">{rank.split('(')[1]?.replace(')', '')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Flight-wise Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter flex items-center gap-3">
          <Plane className="text-blue-600" />
          Flight & Section Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(flightStats).map(([flight, ranks]) => {
            const totalInFlight = Object.values(ranks).reduce((a, b) => a + b, 0);
            return (
              <div key={flight} className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                  <h4 className="font-black text-lg uppercase tracking-tight">{flight}</h4>
                  <span className="bg-blue-600 text-white text-xs font-black px-2 py-1 rounded-lg">{totalInFlight}</span>
                </div>
                <div className="p-4 flex-1 space-y-2">
                  {Object.entries(ranks).map(([rank, count]) => count > 0 && (
                    <div key={rank} className="flex justify-between items-center px-2 py-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{rank.split(' (')[0]}</span>
                      <span className="text-sm font-black text-slate-900">{count}</span>
                    </div>
                  ))}
                  {totalInFlight === 0 && (
                    <div className="text-center py-6 text-slate-300 italic text-xs font-bold uppercase tracking-widest">No Active Personnel</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 shadow-blue-600/20',
    indigo: 'bg-indigo-600 shadow-indigo-600/20',
    purple: 'bg-purple-600 shadow-purple-600/20',
    slate: 'bg-slate-700 shadow-slate-700/20'
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:scale-[1.02] transition-transform">
      <div className={`${colors[color]} p-4 rounded-2xl text-white shadow-xl`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</div>
        <div className="text-3xl font-black text-slate-900 leading-none">{value}</div>
      </div>
    </div>
  );
};

export default Overview;
