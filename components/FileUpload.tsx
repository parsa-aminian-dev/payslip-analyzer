'use client';

import { useState, useCallback } from 'react';
import { PayslipData } from '@/types';
import { extractPayslipData } from '@/lib/pdfExtractor';

interface FileUploadProps {
  onFileUpload: (data: PayslipData) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Bitte nur PDF-Dateien hochladen');
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      console.log('🔍 Starte PDF-Extraktion für:', selectedFile.name);
      
      // PDF Text extrahieren und Daten parsen
      const extractedData = await extractPayslipData(selectedFile);
      
      console.log('✅ PDF-Extraktion abgeschlossen:', extractedData);
      
      if (extractedData) {
        // Validiere die extrahierten Daten
        if (extractedData.salary.gross === 0 || extractedData.workHours.total === 0) {
          console.warn('⚠️ Extrahierte Daten könnten unvollständig sein');
          setError('Die extrahierten Daten scheinen unvollständig zu sein. Bitte prüfe sie im nächsten Schritt.');
        }
        onFileUpload(extractedData);
      } else {
        const extractionMethod = (window as any).__extractionMethod;
        let errorMessage = 'Konnte keine Daten aus der PDF extrahieren.';
        
        if (extractionMethod === 'failed-empty') {
          errorMessage = '❌ PDF-Text konnte nicht extrahiert werden. Mögliche Ursachen:\n' +
                        '• Das PDF ist ein gescanntes Bild (kein Text-Layer)\n' +
                        '• Das PDF ist passwortgeschützt\n' +
                        '• Das PDF-Format wird nicht unterstützt\n\n' +
                        '💡 Tipp: Öffne die Browser-Console (F12) für Details.';
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Fehler beim Verarbeiten der PDF:', err);
      setError('Fehler beim Verarbeiten der PDF. Bitte versuche es erneut.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gehaltsabrechnung hochladen
        </h2>
        <p className="text-gray-600">
          Lade deine PDF-Abrechnung hoch, um sie automatisch zu analysieren
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-12 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="text-center">
          {!selectedFile ? (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Datei hierher ziehen oder klicken
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Unterstützt: PDF (max. 10MB)
              </p>
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                📄 Datei auswählen
              </label>
            </>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setError(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`w-full px-6 py-3 font-medium rounded-lg transition-colors ${
                  isProcessing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verarbeite PDF...
                  </span>
                ) : (
                  'PDF analysieren →'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Hinweis:</p>
            <p>Die PDF-Extraktion funktioniert am besten mit standardisierten deutschen Gehaltsabrechnungen. Bei ungewöhnlichen Formaten können Daten fehlen oder unvollständig sein.</p>
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>PDF Format</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Deutsche Abrechnungen</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Sicher & Lokal</span>
        </div>
      </div>
    </div>
  );
}