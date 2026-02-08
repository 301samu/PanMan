
import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export const calculateYearsMonths = (dateStr: string) => {
  if (!dateStr) return '0y 0m';
  const date = parseISO(dateStr);
  const now = new Date();
  const years = differenceInYears(now, date);
  const totalMonths = differenceInMonths(now, date);
  const months = totalMonths % 12;
  return `${years}y ${months}m`;
};

export const calculateAge = (dob: string) => {
  if (!dob) return 0;
  return differenceInYears(new Date(), parseISO(dob));
};

export const calculateYearsNumeric = (dateStr: string) => {
  if (!dateStr) return 0;
  return differenceInYears(new Date(), parseISO(dateStr));
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const downloadAsExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => 
    Object.values(obj).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',')
  );
  
  // Adding UTF-8 BOM (\uFEFF) to ensure Excel opens Bangla characters correctly
  const csvContent = "\uFEFF" + [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
