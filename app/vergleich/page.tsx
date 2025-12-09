'use client';

import { useState, useEffect } from 'react';
import ResultsDashboard from '@/components/ResultsDashboard';
import { PayslipData, ContractData, AnalysisResult } from '@/types';
import { comparePayslipWithContract } from '@/lib/compareData';

export default function VergleichPage() {
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedPayslipData = localStorage.getItem('payslipData');
    const savedContractData = localStorage.getItem('contractData');

    if (savedPayslipData) {
      setPayslipData(JSON.parse(savedPayslipData));
    }
    if (savedContractData) {
      setContractData(JSON.parse(savedContractData));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (payslipData && contractData) {
      const result = comparePayslipWithContract(payslipData, contractData);
      setAnalysisResult(result);
    }
  }, [payslipData, contractData]);

  const handleReset = () => {
    localStorage.removeItem('payslipData');
    localStorage.removeItem('contractData');
    setPayslipData(null);
    setContractData(null);
    setAnalysisResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Lade Daten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slideUp">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-float inline-block">📊</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Vergleich: Abrechnung vs. Vertrag
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Überprüfen Sie, ob Ihre Gehaltsabrechnung mit Ihren Vertragsdaten übereinstimmt.
          </p>
        </div>

        {/* Missing Data Warning */}
        {(!payslipData || !contractData) && (
          <div className="glass-card rounded-3xl p-10 shadow-2xl mb-10 border-2 border-yellow-300">
            <div className="flex items-start gap-6">
              <span className="text-5xl">⚠️</span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                  Fehlende Daten
                </h2>
                <p className="text-yellow-700 mb-6 text-lg">
                  Um einen Vergleich durchzuführen, benötigen Sie beide Datensätze:
                </p>
                <ul className="space-y-3 text-yellow-700 text-lg">
                  {!payslipData && (
                    <li className="flex items-center gap-3">
                      <span className="text-red-500 text-2xl">✗</span>
                      <span>
                        Gehaltsabrechnung fehlt -{' '}
                        <a href="/abrechnung" className="text-blue-600 hover:underline font-bold">
                          PDF hochladen
                        </a>
                      </span>
                    </li>
                  )}
                  {!contractData && (
                    <li className="flex items-center gap-3">
                      <span className="text-red-500 text-2xl">✗</span>
                      <span>
                        Vertragsdaten fehlen -{' '}
                        <a href="/vertrag" className="text-blue-600 hover:underline font-bold">
                          Daten eingeben
                        </a>
                      </span>
                    </li>
                  )}
                  {payslipData && (
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-2xl">✓</span>
                      <span className="font-semibold">Gehaltsabrechnung vorhanden</span>
                    </li>
                  )}
                  {contractData && (
                    <li className="flex items-center gap-3">
                      <span className="text-green-500 text-2xl">✓</span>
                      <span className="font-semibold">Vertragsdaten vorhanden</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard */}
        {analysisResult && payslipData && contractData && (
          <div className="animate-slideUp">
            <ResultsDashboard result={analysisResult} onReset={handleReset} />
            
            <div className="glass-card rounded-3xl p-10 shadow-2xl mt-10">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Aktionen</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 font-semibold"
                >
                  🗑️ Alle Daten löschen
                </button>
                <a
                  href="/abrechnung"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 font-semibold inline-block"
                >
                  📄 Neue Abrechnung
                </a>
                <a
                  href="/vertrag"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 font-semibold inline-block"
                >
                  📋 Vertrag bearbeiten
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}