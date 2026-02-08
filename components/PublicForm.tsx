
import React, { useState } from 'react';
import { Airman } from '../types';
import AirmanForm from './AirmanForm';
import { ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  onSubmit: (data: Airman) => void;
}

const PublicForm: React.FC<Props> = ({ onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data: Airman) => {
    onSubmit(data);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-slate-200">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Submission Received</h1>
          <p className="text-slate-600 mb-8">
            Thank you for providing your information. Your record has been submitted for review by the administrator. 
            Once approved, it will be added to the BAF Personnel Directory.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all"
          >
            Submit Another Record
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Personnel Data Entry</h1>
              <p className="text-slate-400 text-sm">Bangladesh Air Force Management System</p>
            </div>
          </div>
          <Link to="/" className="hidden lg:flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-blue-800">
            <h2 className="font-bold flex items-center gap-2 mb-1">
              <ShieldCheck size={18} />
              Official Information Gateway
            </h2>
            <p className="text-sm opacity-90">Please ensure all data entered matches your official BAF records. Inaccurate submissions may be rejected during review.</p>
          </div>
          
          <AirmanForm onSubmit={handleSubmit} />
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Bangladesh Air Force. Restricted Access System.</p>
      </footer>
    </div>
  );
};

export default PublicForm;
