
import React, { useState, useMemo } from 'react';
import { Airman, Rank, Trade, Flight, Accom } from '../types';
import { calculateAge, calculateYearsMonths, downloadAsExcel } from '../utils';
import { Search, Download, Printer, Filter, Trash2, Edit2, ChevronDown, ChevronUp, X, User, Activity, Globe, MapPin, CheckCircle, Home } from 'lucide-react';

interface Props {
  data: Airman[];
  onDelete: (id: string) => void;
  onUpdate: (airman: Airman) => void;
}

const Dashboard: React.FC<Props> = ({ data, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    rank: '',
    trade: '',
    flight: '',
    bloodGroup: '',
    serviceCategory: '',
    statusType: '', // tdy, det, med
  });
  const [showFilters, setShowFilters] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Airman | null>(null);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      
      const searchFields = [
        item.bdNo,
        item.nidNo,
        item.nameEn,
        item.nameBn,
        item.mobile,
        item.rank,
        item.trade,
        item.flight,
        item.bloodGroup,
        item.religion,
        item.accommodation,
        item.accomAddress,
        item.spouseName || '',
        item.tdyLocation || '',
        item.detLocation || '',
        item.medCat || ''
      ];
      
      const matchesSearch = searchTerm === '' || searchFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      );

      const matchesRank = !filters.rank || item.rank === filters.rank;
      const matchesTrade = !filters.trade || item.trade === filters.trade;
      const matchesFlight = !filters.flight || item.flight === filters.flight;
      const matchesBlood = !filters.bloodGroup || item.bloodGroup === filters.bloodGroup;
      const matchesCategory = !filters.serviceCategory || item.serviceCategory === filters.serviceCategory;
      
      let matchesStatus = true;
      if (filters.statusType === 'tdy') matchesStatus = !!item.tdyLocation;
      else if (filters.statusType === 'det') matchesStatus = !!item.detLocation;
      else if (filters.statusType === 'med') matchesStatus = !!item.medCat;

      return matchesSearch && matchesRank && matchesTrade && matchesFlight && matchesBlood && matchesCategory && matchesStatus;
    });
  }, [data, searchTerm, filters]);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const exportData = filteredData.map(item => ({
      'BD No': item.bdNo,
      'Rank': item.rank,
      'Name (EN)': item.nameEn,
      'Name (BN)': item.nameBn, // Now correctly exported via BOM
      'TDY': item.tdyLocation || 'N/A',
      'DET': item.detLocation || 'N/A',
      'Med Cat': item.medCat || 'N/A',
      'Trade': item.trade,
      'Flight': item.flight,
      'Mobile': item.mobile,
      'Accom Mode': item.accommodation,
      'Accom Address': item.accomAddress
    }));
    downloadAsExcel(exportData, `Airmen_Status_Export_${new Date().toISOString().split('T')[0]}`);
  };

  const handleResetFilters = () => {
    setFilters({ rank: '', trade: '', flight: '', bloodGroup: '', serviceCategory: '', statusType: '' });
    setSearchTerm('');
  };

  const handleUpdateField = (field: keyof Airman, value: any) => {
    if (!editingStatus) return;
    const updated = { ...editingStatus, [field]: value || undefined };
    onUpdate(updated);
    setEditingStatus(updated);
  };

  const removeStatus = (type: 'tdy' | 'det' | 'med') => {
    if (!editingStatus) return;
    const updated = { ...editingStatus };
    if (type === 'tdy') delete updated.tdyLocation;
    if (type === 'det') delete updated.detLocation;
    if (type === 'med') delete updated.medCat;
    onUpdate(updated);
    setEditingStatus(updated);
  };

  const isLOutActive = (mode: Accom) => [Accom.LOSQ, Accom.LOOA, Accom.LOOAT].includes(mode);

  return (
    <div className="space-y-6">
      {/* Search & Global Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between no-print sticky top-0 z-10 bg-slate-50/90 backdrop-blur-md py-4">
        <div className="relative w-full md:w-[600px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={22} />
          <input 
            type="text" 
            placeholder="Search Records, TDY, DET, Med Cat..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-14 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-md text-xl font-medium tracking-tight"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <X size={22} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl transition-all shadow-lg border font-bold whitespace-nowrap ${showFilters ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter size={20} />
            Filters
            {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all shadow-lg font-bold whitespace-nowrap active:scale-95"
          >
            <Printer size={20} />
            Print List
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/40 font-bold whitespace-nowrap active:scale-95"
          >
            <Download size={20} />
            Excel Export
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="p-8 bg-white border border-slate-200 rounded-[32px] shadow-2xl no-print animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-slate-800 flex items-center gap-3 text-2xl uppercase tracking-tighter">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Filter size={24} /></div>
              Data Filtering Criteria
            </h3>
            <button onClick={handleResetFilters} className="px-4 py-2 text-sm font-black text-red-600 hover:bg-red-50 rounded-xl transition-colors">RESET ALL</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <FilterSelect label="Rank" value={filters.rank} options={Object.values(Rank)} onChange={(v) => setFilters({...filters, rank: v})} />
            <FilterSelect label="Trade" value={filters.trade} options={Object.values(Trade)} onChange={(v) => setFilters({...filters, trade: v})} />
            <FilterSelect label="Flight" value={filters.flight} options={Object.values(Flight)} onChange={(v) => setFilters({...filters, flight: v})} />
            <FilterSelect label="Category" value={filters.serviceCategory} options={['Above 15 Years', 'Below 15 Years']} onChange={(v) => setFilters({...filters, serviceCategory: v})} />
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Deployment Status</label>
              <select 
                value={filters.statusType} 
                onChange={(e) => setFilters({...filters, statusType: e.target.value})}
                className="w-full p-4 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50 transition-all shadow-sm appearance-none"
              >
                <option value="">Any Deployment</option>
                <option value="tdy">On TDY</option>
                <option value="det">On DET</option>
                <option value="med">With Med Cat</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Records Count */}
      <div className="flex items-center justify-between no-print px-2">
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">
          Total Airmen Found: <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{filteredData.length}</span>
        </p>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden overflow-x-auto no-print">
        <table className="w-full text-left border-collapse min-w-[1600px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Identification</th>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</th>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Deployment / Med / Accom</th>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Assignment</th>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Svc Details</th>
              <th className="px-6 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-32 text-center">
                  <div className="flex flex-col items-center max-w-xs mx-auto opacity-30">
                    <User size={80} className="mb-4 text-slate-300" />
                    <p className="text-2xl font-black italic text-slate-500 tracking-tighter">No matching records found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-6">
                    <div className="font-black text-slate-900 text-lg leading-none mb-1">{item.rank.split(' ')[0]}</div>
                    <div className="text-sm text-blue-700 font-black bg-blue-100 px-3 py-1 rounded-xl inline-block shadow-sm">BD/{item.bdNo}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-black text-slate-900 text-base">{item.nameEn}</div>
                    <div className="text-sm text-slate-500 font-bold tracking-tight">{item.nameBn}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-2">
                      {item.tdyLocation && (
                        <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-1 rounded-lg border border-orange-200 uppercase flex items-center gap-1">
                          <Globe size={10} /> TDY: {item.tdyLocation}
                        </span>
                      )}
                      {item.detLocation && (
                        <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-200 uppercase flex items-center gap-1">
                          <MapPin size={10} /> DET: {item.detLocation}
                        </span>
                      )}
                      {item.medCat && (
                        <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-1 rounded-lg border border-red-200 uppercase flex items-center gap-1">
                          <Activity size={10} /> Med Cat: {item.medCat}
                        </span>
                      )}
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100 uppercase flex items-center gap-1">
                        <Home size={10} /> {item.accommodation}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-black text-slate-800">{item.trade.split(' - ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.flight} Flight</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1 text-sm font-black">
                      <div>Svc: <span className="text-blue-600">{calculateYearsMonths(item.doe)}</span></div>
                      <div className="text-[10px] text-slate-400 uppercase">{item.serviceCategory}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingStatus(item)}
                        title="Manage Status & Accommodation"
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm active:scale-90 border border-slate-100"
                      >
                        <Activity size={18} />
                      </button>
                      <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-2xl transition-all shadow-sm active:scale-90">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-2xl transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status & Accommodation Management Modal */}
      {editingStatus && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 no-print">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Personnel Logistics & Status</h3>
                <p className="text-xs text-slate-400 font-bold">{editingStatus.rank.split(' ')[0]} {editingStatus.bdNo} • {editingStatus.nameEn}</p>
              </div>
              <button onClick={() => setEditingStatus(null)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
              {/* LEFT COLUMN: Deployment & Med */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Activity size={14} /> Deployment Status
                </h4>
                {/* TDY */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">TDY Location</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter TDY..."
                      defaultValue={editingStatus.tdyLocation || ''}
                      onBlur={(e) => handleUpdateField('tdyLocation', e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-bold text-sm"
                    />
                    {editingStatus.tdyLocation && (
                      <button onClick={() => removeStatus('tdy')} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* DET */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">DET Station</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter DET..."
                      defaultValue={editingStatus.detLocation || ''}
                      onBlur={(e) => handleUpdateField('detLocation', e.target.value)}
                      className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-sm"
                    />
                    {editingStatus.detLocation && (
                      <button onClick={() => removeStatus('det')} className="p-3 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Med Cat */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Category</label>
                  <select 
                    value={editingStatus.medCat || ''}
                    onChange={(e) => handleUpdateField('medCat', e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-sm appearance-none"
                  >
                    <option value="">Standard (AYE)</option>
                    <option value="BEE">BEE</option>
                    <option value="CEE">CEE</option>
                    <option value="DEE">DEE</option>
                    <option value="EEE">EEE</option>
                    <option value="PERMANENT LOW">PERMANENT LOW</option>
                  </select>
                </div>
              </div>

              {/* RIGHT COLUMN: Accommodation */}
              <div className="space-y-6">
                <h4 className="text-xs font-black text-green-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                  <Home size={14} /> Accommodation Data
                </h4>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Living Mode</label>
                  <select 
                    value={editingStatus.accommodation}
                    onChange={(e) => handleUpdateField('accommodation', e.target.value as Accom)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-bold text-sm"
                  >
                    {Object.values(Accom).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                {isLOutActive(editingStatus.accommodation) && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">L/Out Effective Date</label>
                    <input 
                      type="date" 
                      value={editingStatus.lOutDate || ''}
                      onChange={(e) => handleUpdateField('lOutDate', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-bold text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Address / Details</label>
                  <textarea 
                    rows={3}
                    defaultValue={editingStatus.accomAddress || ''}
                    onBlur={(e) => handleUpdateField('accomAddress', e.target.value)}
                    placeholder="Enter full accommodation address..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-bold text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setEditingStatus(null)}
                className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PRINT VIEW */}
      <div className="print-only">
        <div className="text-center mb-8 border-b-4 border-slate-900 pb-6">
          <div className="text-3xl font-black uppercase tracking-tighter mb-1">Bangladesh Air Force</div>
          <div className="text-xl font-black uppercase tracking-widest text-slate-700">Deployment & Deployment Status Report</div>
          <div className="flex justify-center gap-10 mt-4 text-[12px] font-bold uppercase">
            <span>Date: {new Date().toLocaleDateString()}</span>
            <span>Total Personnel: {filteredData.length}</span>
          </div>
        </div>

        <table className="w-full text-[10px] border-2 border-black border-collapse">
          <thead>
            <tr className="bg-slate-200">
              <th className="border-2 border-black p-2 font-black uppercase">Rank/BD</th>
              <th className="border-2 border-black p-2 font-black uppercase">Name (EN/BN)</th>
              <th className="border-2 border-black p-2 font-black uppercase">Status (TDY/DET/Med)</th>
              <th className="border-2 border-black p-2 font-black uppercase">Accomodation</th>
              <th className="border-2 border-black p-2 font-black uppercase">Trade/Flight</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td className="border border-black p-2 font-black">{item.rank.split(' ')[0]} {item.bdNo}</td>
                <td className="border border-black p-2">
                  <div className="font-bold">{item.nameEn}</div>
                  <div className="italic">{item.nameBn}</div>
                </td>
                <td className="border border-black p-2">
                  {[item.tdyLocation && `TDY: ${item.tdyLocation}`, item.detLocation && `DET: ${item.detLocation}`, item.medCat && `MED: ${item.medCat}`].filter(Boolean).join(' | ') || 'Standard'}
                </td>
                <td className="border border-black p-2">
                  <div className="font-bold">{item.accommodation}</div>
                  <div className="text-[8px]">{item.accomAddress}</div>
                </td>
                <td className="border border-black p-2">{item.trade.split(' - ')[0]} / {item.flight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FilterSelect: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 border border-slate-200 rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bg-slate-50 transition-all shadow-sm appearance-none"
    >
      <option value="">ALL {label.toUpperCase()}S</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default Dashboard;
