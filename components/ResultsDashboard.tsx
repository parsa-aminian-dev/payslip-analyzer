'use client';

import { AnalysisResult } from '@/types';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const { payslipData, comparisons, overallStatus, confidence } = result;

  const statusConfig = {
    correct: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✓',
      title: 'Alles korrekt!',
      description: 'Deine Abrechnung stimmt mit dem Vertrag überein.',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠',
      title: 'Warnung',
      description: 'Es wurden einige Auffälligkeiten gefunden.',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '✗',
      title: 'Fehler gefunden',
      description: 'Die Abrechnung weicht vom Vertrag ab.',
    },
  };

  const status = statusConfig[overallStatus];

  const getComparisonIcon = (itemStatus: string) => {
    switch (itemStatus) {
      case 'correct': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  const getComparisonColor = (itemStatus: string) => {
    switch (itemStatus) {
      case 'correct': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (value: number | string): string => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
      }).format(value);
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyse-Ergebnis
        </h2>
        <p className="text-gray-600">
          {payslipData?.employeeName} • {payslipData?.period}
        </p>
      </div>

      {/* Overall Status Card */}
      <div className={`${status.bg} ${status.border} border-2 rounded-xl p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full ${status.bg} flex items-center justify-center text-3xl`}>
              {status.icon}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${status.text}`}>
                {status.title}
              </h3>
              <p className={`${status.text} text-sm mt-1`}>
                {status.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${status.text}`}>
              {confidence.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Genauigkeit</div>
          </div>
        </div>
      </div>

      {/* Detailed Comparisons */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Detaillierte Prüfung
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {comparisons.map((comparison, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getComparisonColor(comparison.status)}`}>
                    {getComparisonIcon(comparison.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {comparison.field}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {comparison.message}
                    </p>
                    
                    {/* Comparison Values */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Erwartet (Vertrag)</div>
                        <div className="font-semibold text-gray-900">
                          {typeof comparison.expected === 'number' && comparison.field !== 'Abzüge' 
                            ? formatCurrency(comparison.expected)
                            : comparison.expected}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Tatsächlich (Abrechnung)</div>
                        <div className="font-semibold text-gray-900">
                          {typeof comparison.actual === 'number' && comparison.field !== 'Abzüge'
                            ? formatCurrency(comparison.actual)
                            : comparison.actual}
                        </div>
                      </div>
                    </div>

                    {/* Difference */}
                    {comparison.difference !== undefined && comparison.difference !== 0 && (
                      <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        comparison.difference > 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {comparison.difference > 0 ? '▲' : '▼'} 
                        {' '}
                        {Math.abs(comparison.difference).toFixed(2)}
                        {typeof comparison.expected === 'number' && comparison.field !== 'Abzüge' ? '€' : ''}
                        {' Differenz'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payslip Summary */}
      {payslipData && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Abrechnungs-Übersicht
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Arbeitsstunden</div>
              <div className="text-2xl font-bold text-gray-900">
                {payslipData.workHours.total}h
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {payslipData.workHours.overtime > 0 && `+${payslipData.workHours.overtime}h Überstunden`}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Brutto</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(payslipData.salary.gross)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {payslipData.salary.hourlyRate && `${payslipData.salary.hourlyRate.toFixed(2)}€/h`}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Netto</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(payslipData.salary.net)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {((payslipData.salary.net / payslipData.salary.gross) * 100).toFixed(1)}% vom Brutto
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Abzüge</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(payslipData.deductions.totalDeductions)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Steuern & Sozialabgaben
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={() => window.print()}
          className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          📄 Ergebnis drucken
        </button>
        <button
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          💾 Als PDF speichern
        </button>
      </div>

      {/* Recommendations */}
      {overallStatus !== 'correct' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            💡 Empfehlungen
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Kontaktiere deine Personalabteilung bezüglich der gefundenen Abweichungen</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Bewahre diese Analyse zusammen mit der Original-Abrechnung auf</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Prüfe auch frühere Abrechnungen auf ähnliche Fehler</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}