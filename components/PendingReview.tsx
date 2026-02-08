
import React from 'react';
import { Airman } from '../types';
import { calculateAge, calculateYearsMonths } from '../utils';
import { Check, X, Eye, Clock } from 'lucide-react';

interface Props {
  data: Airman[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingReview: React.FC<Props> = ({ data, onApprove, onReject }) => {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="bg-slate-50 p-4 rounded-full mb-4">
          <Clock size={40} className="text-slate-300" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Pending Reviews</h3>
        <p className="text-slate-500">New submissions from the public link will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((item) => (
        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-yellow-50/50 border-b border-yellow-100 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Pending Approval</span>
              <span className="text-xs text-slate-400">Submitted: {new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <Eye size={18} />
            </button>
          </div>
          
          <div className="p-6 flex-1 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{item.rank.split(' ')[0]} {item.bdNo}</h4>
                <p className="text-slate-600 font-medium">{item.nameEn}</p>
                <p className="text-sm text-slate-400 italic">{item.nameBn}</p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-bold text-slate-800">{item.trade.split(' - ')[0]}</span>
                <span className="block text-xs text-slate-500 uppercase">{item.flight} Flight</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-xl">
              <div><span className="text-slate-400 uppercase font-bold tracking-tighter">Mobile:</span> {item.mobile}</div>
              <div><span className="text-slate-400 uppercase font-bold tracking-tighter">Age:</span> {calculateAge(item.dob)} Years</div>
              <div><span className="text-slate-400 uppercase font-bold tracking-tighter">Service:</span> {calculateYearsMonths(item.doe)}</div>
              <div><span className="text-slate-400 uppercase font-bold tracking-tighter">Blood:</span> {item.bloodGroup}</div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3">
            <button 
              onClick={() => onApprove(item.id)}
              className="flex-1 bg-green-600 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
            >
              <Check size={18} /> Approve
            </button>
            <button 
              onClick={() => onReject(item.id)}
              className="flex-1 bg-white border border-slate-200 text-red-600 font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <X size={18} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingReview;
