'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ContractForm from '@/components/ContractForm';
import ResultsDashboard from '@/components/ResultsDashboard';
import { ContractData, AnalysisResult, PayslipData } from '@/types';
import { comparePayslipWithContract } from '@/lib/compareData';
import { mockPayslipData, mockContractData } from '@/lib/mockData';

type Step = 'upload' | 'payslip-review' | 'contract' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [payslipData, setPayslipData] = useState<PayslipData | null>(null);
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = (data: PayslipData) => {
    setPayslipData(data);
    setStep('payslip-review');
  };

  const handlePayslipReviewComplete = () => {
    setStep('contract');
  };

  const handleContractSubmit = (data: ContractData) => {
    setContractData(data);
    
    if (payslipData) {
      const result = comparePayslipWithContract(payslipData, data);
      setAnalysisResult(result);
      setStep('results');
    }
  };

  const handleReset = () => {
    setStep('upload');
    setPayslipData(null);
    setContractData(null);
    setAnalysisResult(null);
  };

  const handleUseMockData = () => {
    setPayslipData(mockPayslipData);
    setStep('payslip-review');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                💼 Payslip Analyzer
              </h1>
              <p className="text-gray-600 mt-1">
                Gehaltsabrechnungen automatisch prüfen und verifizieren
              </p>
            </div>
            {step !== 'upload' && (
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Neu starten
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps - 4 Steps */}
        <div className="flex items-center justify-center space-x-2 mb-12 flex-wrap gap-y-2">
          {/* Step 1: Upload */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step === 'upload' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}>
              {step === 'upload' ? '1' : '✓'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Upload</span>
          </div>
          
          <div className="w-6 h-0.5 bg-gray-300"></div>
          
          {/* Step 2: Payslip Review */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step === 'payslip-review' ? 'bg-blue-600 text-white' : 
              ['contract', 'results'].includes(step) ? 'bg-green-600 text-white' : 
              'bg-gray-300 text-gray-600'
            }`}>
              {['contract', 'results'].includes(step) ? '✓' : '2'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Abrechnung</span>
          </div>
          
          <div className="w-6 h-0.5 bg-gray-300"></div>
          
          {/* Step 3: Contract */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step === 'contract' ? 'bg-blue-600 text-white' : 
              step === 'results' ? 'bg-green-600 text-white' : 
              'bg-gray-300 text-gray-600'
            }`}>
              {step === 'results' ? '✓' : '3'}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Vertrag</span>
          </div>
          
          <div className="w-6 h-0.5 bg-gray-300"></div>
          
          {/* Step 4: Results */}
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              step === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              4
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">Vergleich</span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div>
              <FileUpload onFileUpload={handleFileUpload as any} />
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Keine PDF zur Hand? Probiere die Demo-Funktion:
                </p>
                <button
                  onClick={handleUseMockData}
                  className="px-6 py-3 bg-purple-100 text-purple-700 font-medium rounded-lg hover:bg-purple-200 transition-colors"
                >
                  🎯 Mit Demo-Daten testen
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payslip Review */}
          {step === 'payslip-review' && payslipData && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📊 Extrahierte Abrechnung
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Employee Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Mitarbeiter</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{payslipData.employeeName}</span>
                    </div>
                    {payslipData.employeeId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">ID:</span>
                        <span className="font-medium">{payslipData.employeeId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Periode:</span>
                      <span className="font-medium">{payslipData.period}</span>
                    </div>
                  </div>
                </div>

                {/* Salary Info */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Gehalt</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brutto:</span>
                      <span className="font-medium text-green-600">{payslipData.salary.gross.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Netto:</span>
                      <span className="font-medium text-green-600">{payslipData.salary.net.toFixed(2)} €</span>
                    </div>
                    {payslipData.salary.hourlyRate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stundensatz:</span>
                        <span className="font-medium">{payslipData.salary.hourlyRate.toFixed(2)} €/h</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Work Hours */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Arbeitszeiten</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Regulär:</span>
                      <span className="font-medium">{payslipData.workHours.regular} Stunden</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Überstunden:</span>
                      <span className="font-medium">{payslipData.workHours.overtime} Stunden</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-semibold">Gesamt:</span>
                      <span className="font-bold">{payslipData.workHours.total} Stunden</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Abzüge</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Steuern:</span>
                      <span className="font-medium text-red-600">-{payslipData.deductions.taxAmount.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sozialversicherung:</span>
                      <span className="font-medium text-red-600">-{payslipData.deductions.socialSecurity.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-semibold">Gesamt:</span>
                      <span className="font-bold text-red-600">-{payslipData.deductions.totalDeductions.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Vacation Days */}
                {payslipData.vacationDays && (
                  <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🏖️ Urlaubstage</h3>
                    <div className="flex justify-around">
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-blue-600">{payslipData.vacationDays.taken}</span>
                        <span className="text-gray-600 text-sm">Genommen</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-green-600">{payslipData.vacationDays.remaining}</span>
                        <span className="text-gray-600 text-sm">Verbleibend</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePayslipReviewComplete}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Weiter zum Vertrag →
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contract */}
          {step === 'contract' && (
            <ContractForm onSubmit={handleContractSubmit} />
          )}

          {/* Step 4: Results */}
          {step === 'results' && analysisResult && (
            <ResultsDashboard result={analysisResult} onReset={handleReset} />
          )}
        </div>

        {/* Info Box */}
        {step === 'upload' && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              🔒 Datenschutz & Sicherheit
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Alle Daten werden lokal verarbeitet</li>
              <li>✓ Keine Speicherung auf externen Servern</li>
              <li>✓ Deine Dokumente bleiben privat</li>
            </ul>
          </div>
        )}
      </div>

      <footer className="mt-16 pb-8 text-center text-sm text-gray-500">
        <p>Entwickelt als Portfolio-Projekt | Informatikstudent</p>
        <p className="mt-1">Technologie: Next.js, TypeScript, Tailwind CSS</p>
      </footer>
    </main>
  );
}
