'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { PayslipData } from '@/types';

export default function AbrechnungPage() {
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);

  const handleFileUpload = (data: PayslipData) => {
    setPayslipData(data);
    localStorage.setItem('payslipData', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute -bottom-32 right-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slideUp">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-float inline-block">📄</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Gehaltsabrechnung analysieren
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Laden Sie Ihre PDF-Gehaltsabrechnung hoch. Die App extrahiert automatisch alle relevanten Daten.
          </p>
        </div>

        {/* File Upload */}
        <div className="glass-card rounded-3xl p-10 shadow-2xl mb-10">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        {/* Extracted Data Display */}
        {payslipData && (
          <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slideUp">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ✅ Extrahierte Daten
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Mitarbeiter</p>
                  <p className="text-xl font-bold text-gray-800">{payslipData.employeeName}</p>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Abrechnungsperiode</p>
                  <p className="text-xl font-bold text-gray-800">{payslipData.period}</p>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Arbeitsstunden</p>
                  <p className="text-xl font-bold text-gray-800">{payslipData.workHours.total} Stunden</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Regular: {payslipData.workHours.regular}h | Überstunden: {payslipData.workHours.overtime}h
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Bruttolohn</p>
                  <p className="text-2xl font-bold text-green-600">{payslipData.salary.gross.toFixed(2)} €</p>
                </div>
                
                <div className="bg-red-50 rounded-2xl p-6">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Abzüge</p>
                  <p className="text-xl font-bold text-red-600">{payslipData.deductions.totalDeductions.toFixed(2)} €</p>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p>Steuern: {payslipData.deductions.taxAmount.toFixed(2)} €</p>
                    <p>Sozialversicherung: {payslipData.deductions.socialSecurity.toFixed(2)} €</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Nettolohn</p>
                  <p className="text-3xl font-bold text-indigo-600">{payslipData.salary.net.toFixed(2)} €</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-indigo-50 rounded-2xl p-6">
              <p className="text-gray-700">
                💡 <strong>Tipp:</strong> Gehen Sie jetzt zur{' '}
                <a href="/vergleich" className="text-indigo-600 hover:underline font-bold">
                  Vergleich-Seite
                </a>
                , um Ihre Abrechnung mit den Vertragsdaten zu vergleichen.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}