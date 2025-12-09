'use client';

import { useState } from 'react';
import ContractForm from '@/components/ContractForm';
import { ContractData } from '@/types';

export default function VertragPage() {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (data: ContractData) => {
    setContractData(data);
    setShowForm(false);
    localStorage.setItem('contractData', JSON.stringify(data));
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute -bottom-32 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slideUp">
          <div className="inline-block mb-6">
            <span className="text-7xl animate-float inline-block">📋</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            Vertragsdaten eingeben
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Geben Sie Ihre Vertragsdaten ein, um sie später mit Ihrer Gehaltsabrechnung zu vergleichen.
          </p>
        </div>

        {/* Contract Form or Display */}
        {showForm ? (
          <div className="glass-card rounded-3xl p-10 shadow-2xl">
            <ContractForm onSubmit={handleSubmit} />
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-10 shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✅ Vertragsdaten gespeichert
              </h2>
              <button
                onClick={handleEdit}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300 font-semibold"
              >
                Bearbeiten
              </button>
            </div>
            
            {contractData && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Mitarbeiter</p>
                    <p className="text-xl font-bold text-gray-800">{contractData.employeeName}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Stundenlohn</p>
                    <p className="text-xl font-bold text-gray-800">{contractData.hourlyRate.toFixed(2)} €</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Wochenstunden</p>
                    <p className="text-xl font-bold text-gray-800">{contractData.weeklyHours} Stunden</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Erwartetes Bruttogehalt</p>
                    <p className="text-2xl font-bold text-green-600">{contractData.expectedGrossSalary.toFixed(2)} €</p>
                  </div>
                  
                  <div className="bg-pink-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Steuerklasse</p>
                    <p className="text-xl font-bold text-gray-800">{contractData.taxClass}</p>
                  </div>
                  
                  <div className="bg-pink-50 rounded-2xl p-6">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Urlaubstage pro Jahr</p>
                    <p className="text-xl font-bold text-gray-800">{contractData.vacationDaysPerYear} Tage</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 bg-purple-50 rounded-2xl p-6">
              <p className="text-gray-700">
                💡 <strong>Tipp:</strong> Gehen Sie jetzt zur{' '}
                <a href="/vergleich" className="text-purple-600 hover:underline font-bold">
                  Vergleich-Seite
                </a>
                , um Ihre Vertragsdaten mit der Gehaltsabrechnung zu vergleichen.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}