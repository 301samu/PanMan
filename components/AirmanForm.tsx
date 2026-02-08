
import React, { useState, useEffect } from 'react';
import { Rank, Trade, Flight, Accom, Airman } from '../types';
import { calculateAge, calculateYearsMonths, calculateYearsNumeric, generateId } from '../utils';
import { Save, AlertCircle, Info } from 'lucide-react';

interface Props {
  onSubmit: (data: Airman) => void;
  initialData?: Partial<Airman>;
}

const AirmanForm: React.FC<Props> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<Airman>>({
    bdNo: '',
    nidNo: '',
    totalChildren: 0,
    rank: Rank.AC,
    nameEn: '',
    nameBn: '',
    trade: Trade.SecAsstGD,
    flight: Flight.Admin,
    mobile: '',
    dob: '',
    doe: '',
    arrivalDate: '',
    serviceCategory: 'Below 15 Years',
    heightFeet: 5,
    heightInches: 0,
    bloodGroup: 'O+',
    religion: 'Islam',
    isMarried: false,
    spouseName: '',
    accommodation: Accom.AirmenMess,
    lOutDate: '',
    accomAddress: '',
    ...initialData
  });

  const [message, setMessage] = useState('');

  // Auto-calculate Service Category when DOE changes
  useEffect(() => {
    if (formData.doe) {
      const years = calculateYearsNumeric(formData.doe);
      const category = years >= 15 ? 'Above 15 Years' : 'Below 15 Years';
      if (formData.serviceCategory !== category) {
        setFormData(prev => ({ ...prev, serviceCategory: category }));
      }
    }
  }, [formData.doe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (type === 'number' ? Number(value) : value);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cleanup data: Convert empty strings to undefined so Supabase handles them as NULL
    const cleanedData = { ...formData };
    
    const optionalFields: (keyof Airman)[] = ['lOutDate', 'spouseName', 'nidNo', 'accomAddress'];
    optionalFields.forEach(field => {
      if (cleanedData[field] === '') {
        delete cleanedData[field];
      }
    });

    // If not married, remove spouse name regardless
    if (!cleanedData.isMarried) {
      delete cleanedData.spouseName;
    }

    const newRecord: Airman = {
      ...cleanedData as Airman,
      id: generateId(), // This will be removed by App.tsx before insert to let Supabase gen UUID
      createdAt: Date.now(),
      status: 'active'
    };
    
    onSubmit(newRecord);
    setMessage('Record successfully submitted!');
    setTimeout(() => setMessage(''), 3000);
    
    // Reset form if not edit mode
    if (!initialData) {
      setFormData({
        bdNo: '',
        nidNo: '',
        totalChildren: 0,
        rank: Rank.AC,
        nameEn: '',
        nameBn: '',
        trade: Trade.SecAsstGD,
        flight: Flight.Admin,
        mobile: '',
        dob: '',
        doe: '',
        arrivalDate: '',
        serviceCategory: 'Below 15 Years',
        heightFeet: 5,
        heightInches: 0,
        bloodGroup: 'O+',
        religion: 'Islam',
        isMarried: false,
        spouseName: '',
        accommodation: Accom.AirmenMess,
        lOutDate: '',
        accomAddress: ''
      });
    }
  };

  const isLOutActive = [Accom.LOSQ, Accom.LOOA, Accom.LOOAT].includes(formData.accommodation as Accom);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2 animate-bounce">
          <Save size={20} />
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Personal Information (ব্যক্তিগত তথ্য)</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">BD No (বিডি নং)</label>
            <input required type="number" name="bdNo" value={formData.bdNo} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rank (পদবী)</label>
            <select name="rank" value={formData.rank} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {Object.values(Rank).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trade (পেশা)</label>
            <select name="trade" value={formData.trade} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {Object.values(Trade).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
            <input required type="text" name="nameEn" value={formData.nameEn} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name in English" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">নাম (বাংলা)</label>
            <input required type="text" name="nameBn" value={formData.nameBn} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="সম্পূর্ণ নাম বাংলায়" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile No</label>
            <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">NID No</label>
            <input type="text" name="nidNo" value={formData.nidNo} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="National ID Number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Children</label>
            <input type="number" name="totalChildren" value={formData.totalChildren} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" min="0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Important Dates & Calculations</h3>
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Automated Processing</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DOB (জন্ম তারিখ)</label>
            <input required type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 font-bold">
              <Info size={12} />
              Calculated Age: {calculateAge(formData.dob || '')} Years
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">DOE (যোগদানের তারিখ)</label>
            <input required type="date" name="doe" value={formData.doe} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 font-bold">
              <Info size={12} />
              T_Svc: {calculateYearsMonths(formData.doe || '')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Arrival Date (ইউনিটে আগমন)</label>
            <input required type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <div className="mt-1 flex items-center gap-1 text-xs text-blue-600 font-bold">
              <Info size={12} />
              Duration: {calculateYearsMonths(formData.arrivalDate || '')}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Category</label>
            <div className="relative">
              <select 
                name="serviceCategory" 
                value={formData.serviceCategory} 
                onChange={handleChange} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 font-bold text-blue-700 appearance-none outline-none cursor-not-allowed"
                disabled
              >
                <option value="Above 15 Years">Above 15 Years</option>
                <option value="Below 15 Years">Below 15 Years</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Info size={16} />
              </div>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">Auto-updated based on DOE</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Flight (ফ্লাইট)</label>
            <select name="flight" value={formData.flight} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {Object.values(Flight).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Physical & Social Details</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Height (উচ্চতা)</label>
            <div className="flex gap-2">
              <input type="number" name="heightFeet" value={formData.heightFeet} onChange={handleChange} className="w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ft" />
              <input type="number" name="heightInches" value={formData.heightInches} onChange={handleChange} className="w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="In" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Religion</label>
            <select name="religion" value={formData.religion} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {['Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name="isMarried" checked={formData.isMarried} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium text-slate-700">Married (বিবাহিত)</span>
            </label>
          </div>
          {formData.isMarried && (
            <div className="col-span-full md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Spouse Name (স্ত্রী'র নাম)</label>
              <input type="text" name="spouseName" value={formData.spouseName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Accommodation (বাসস্থান)</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Accom Mode</label>
            <select name="accommodation" value={formData.accommodation} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              {Object.values(Accom).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isLOutActive ? 'text-slate-700' : 'text-slate-300'}`}>L/Out Date</label>
            <input 
              type="date" 
              name="lOutDate" 
              disabled={!isLOutActive} 
              value={formData.lOutDate} 
              onChange={handleChange} 
              className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${isLOutActive ? 'border-slate-300 focus:ring-2 focus:ring-blue-500' : 'bg-slate-50 border-slate-200 cursor-not-allowed'}`} 
            />
            {!isLOutActive && <p className="text-[10px] text-slate-400 mt-1">Only active for Living Out options</p>}
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Accommodation Address (পূর্ণ ঠিকানা)</label>
            <textarea name="accomAddress" value={formData.accomAddress} onChange={handleChange} rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter complete address..." />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 no-print">
        <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
          <Save size={20} />
          {initialData ? 'Update Record' : 'Save Airman Record'}
        </button>
      </div>
    </form>
  );
};

export default AirmanForm;
