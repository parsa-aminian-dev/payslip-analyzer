'use client';

import { PayslipData } from '@/types';

interface DebugPanelProps {
  payslipData: PayslipData;
  extractedText?: string;
}

export default function DebugPanel({ payslipData, extractedText }: DebugPanelProps) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-6 mb-6 font-mono text-xs">
      <h3 className="text-lg font-bold mb-4 text-yellow-400">🐛 Debug Info</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-green-400 font-semibold mb-2">📄 Extrahierte Daten (JSON):</h4>
          <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
            {JSON.stringify(payslipData, null, 2)}
          </pre>
        </div>
        
        {extractedText && (
          <div>
            <h4 className="text-green-400 font-semibold mb-2">📝 PDF Text (erste 1000 Zeichen):</h4>
            <pre className="bg-gray-800 p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
              {extractedText.substring(0, 1000)}
              {extractedText.length > 1000 && '\n... (gekürzt)'}
            </pre>
          </div>
        )}

        <div>
          <h4 className="text-green-400 font-semibold mb-2">🔍 Wichtige Werte:</h4>
          <div className="bg-gray-800 p-3 rounded space-y-1">
            <p><span className="text-yellow-400">Name:</span> {payslipData.employeeName}</p>
            <p><span className="text-yellow-400">Zeitraum:</span> {payslipData.period}</p>
            <p><span className="text-yellow-400">Brutto:</span> {payslipData.salary.gross}€</p>
            <p><span className="text-yellow-400">Netto:</span> {payslipData.salary.net}€</p>
            <p><span className="text-yellow-400">Stundenlohn:</span> {payslipData.salary.hourlyRate || 'nicht gesetzt'}€</p>
            <p><span className="text-yellow-400">Stunden (regulär):</span> {payslipData.workHours.regular}h</p>
            <p><span className="text-yellow-400">Überstunden:</span> {payslipData.workHours.overtime}h</p>
            <p><span className="text-yellow-400">Abzüge gesamt:</span> {payslipData.deductions.totalDeductions}€</p>
          </div>
        </div>

        <div className="text-yellow-300 text-xs">
          💡 Tipp: Kopiere diese Daten und sende sie an den Entwickler, wenn etwas nicht stimmt.
        </div>
      </div>
    </div>
  );
}
