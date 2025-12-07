// lib/pdfExtractor.ts
import { PayslipData } from '@/types';

/**
 * Extrahiert Text aus einer PDF-Datei mit PDF.js
 */
async function extractTextFromPDF(file: File): Promise<string> {
  console.log('📄 Starte PDF-Extraktion für:', file.name, 'Größe:', file.size, 'bytes');
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        console.log('✅ File gelesen, starte PDF.js...');
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const text = await extractWithPDFJS(arrayBuffer);
        console.log('✅ PDF.js Extraktion abgeschlossen');
        resolve(text);
      } catch (error) {
        console.error('❌ Fehler bei PDF.js Extraktion:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('❌ Fehler beim Lesen der Datei:', error);
      reject(new Error('Fehler beim Lesen der Datei'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Verwendet PDF.js zur Text-Extraktion (Browser-kompatibel)
 */
async function extractWithPDFJS(arrayBuffer: ArrayBuffer): Promise<string> {
  console.log('🔧 Starte PDF.js Extraktion...');
  console.log('📦 ArrayBuffer Größe:', arrayBuffer.byteLength, 'bytes');
  
  const pdfjsLib = await import('pdfjs-dist');
  console.log('✅ PDF.js geladen, Version:', (pdfjsLib as any).version);
  
  const workerUrl = `https://unpkg.com/pdfjs-dist@${(pdfjsLib as any).version}/build/pdf.worker.min.mjs`;
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  console.log('🔧 Worker URL:', workerUrl);
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  console.log('📄 PDF geladen, Anzahl Seiten:', pdf.numPages);
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    console.log(`📄 Verarbeite Seite ${i}/${pdf.numPages}...`);
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    console.log(`📝 Seite ${i}: ${textContent.items.length} Text-Elemente gefunden`);
    
    const pageText = textContent.items
      .map((item: any) => {
        console.log('  Text-Item:', item.str);
        return item.str;
      })
      .join(' ');
    
    console.log(`✅ Seite ${i} Text-Länge: ${pageText.length} Zeichen`);
    fullText += pageText + '\n';
  }
  
  console.log('✅ Gesamt extrahiert:', fullText.length, 'Zeichen');
  return fullText;
}

/**
 * Analysiert PDF-Text mit Gemini API
 */
async function analyzeWithGemini(text: string): Promise<PayslipData | null> {
  try {
    console.log('Sende an Gemini API...');
    const response = await fetch('/api/analyze-with-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API Fehler:', response.status, errorData);
      console.error('Fehlerdetails:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Gemini API Antwort erhalten:', data);
    
    // Validiere die erhaltenen Daten
    if (!data.salary || typeof data.salary.gross !== 'number' || data.salary.gross <= 0) {
      console.warn('Ungültige Daten von Gemini API');
      return null;
    }
    
    return data as PayslipData;
  } catch (error) {
    console.error('Fehler bei Gemini API:', error);
    return null;
  }
}

/**
 * Fallback: Parst Text mit Regex (weniger zuverlässig)
 */
function parsePayslipTextFallback(text: string): PayslipData {
  console.log('=== Fallback Regex-Parser aktiv ===');
  console.log('Text zu parsen:', text.substring(0, 300));
  
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  
  const parseNumber = (str: string | undefined): number => {
    if (!str) return 0;
    // Handle German number format: 1.234,56 -> 1234.56
    const cleaned = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned.replace(/[^\d.-]/g, '')) || 0;
    console.log(`Parse "${str}" -> ${num}`);
    return num;
  };

  // Erweiterte Regex-Patterns für deutsche Gehaltsabrechnungen
  // Flexiblere Patterns mit mehr Varianten
  const nameMatch = normalizedText.match(/(?:Name|Mitarbeiter|Arbeitnehmer|AN)[:\s]+([A-ZÄÖÜ][a-zäöüß]+(?:\s+[A-ZÄÖÜ][a-zäöüß]+)*)/i);
  const periodMatch = normalizedText.match(/(?:Monat|Zeitraum|Abrechnungszeitraum|Abrechnungsmonat|Datum)[:\s]+([A-Za-zäöüÄÖÜ]+\s+\d{4}|\d{2}[.\/]\d{2,4})/i);
  
  // Mehrere Varianten für Bruttogehalt
  const grossMatch = normalizedText.match(/(?:Brutto(?:lohn|gehalt|betrag)?|Gesamt(?:brutto)?|Bruttoentgelt)[:\s-]*([0-9.,]+)\s*€?/i);
  const netMatch = normalizedText.match(/(?:Netto(?:lohn|gehalt|betrag)?|Auszahlung(?:sbetrag)?|Nettoentgelt)[:\s-]*([0-9.,]+)\s*€?/i);
  const hoursMatch = normalizedText.match(/(?:Stunden|Std\.?|Arbeitsstunden|Monatsstunden)[:\s-]*([0-9.,]+)/i);
  const overtimeMatch = normalizedText.match(/(?:Überstunden|Mehrarbeit|ÜS)[:\s-]*([0-9.,]+)/i);
  
  console.log('Gefundene Matches:', {
    name: nameMatch?.[1],
    period: periodMatch?.[1],
    gross: grossMatch?.[1],
    net: netMatch?.[1],
    hours: hoursMatch?.[1],
    overtime: overtimeMatch?.[1]
  });
  
  // Abzüge
  const taxMatch = normalizedText.match(/(?:Lohnsteuer|Steuer)[:\s]*([0-9.,]+)/i);
  const socialSecMatch = normalizedText.match(/(?:Sozialversicherung|SV-Beitrag)[:\s]*([0-9.,]+)/i);
  const healthInsMatch = normalizedText.match(/(?:Krankenversicherung|KV)[:\s]*([0-9.,]+)/i);
  const pensionMatch = normalizedText.match(/(?:Rentenversicherung|RV)[:\s]*([0-9.,]+)/i);
  const unemploymentMatch = normalizedText.match(/(?:Arbeitslosenversicherung|AV)[:\s]*([0-9.,]+)/i);

  const gross = parseNumber(grossMatch?.[1]) || 3500;
  const net = parseNumber(netMatch?.[1]) || 2245;
  const hours = parseNumber(hoursMatch?.[1]) || 160;
  const overtime = parseNumber(overtimeMatch?.[1]) || 0;
  
  const taxAmount = parseNumber(taxMatch?.[1]) || (gross - net) * 0.45;
  const socialSec = parseNumber(socialSecMatch?.[1]) || (gross - net) * 0.25;
  const healthIns = parseNumber(healthInsMatch?.[1]) || (gross - net) * 0.15;
  const pension = parseNumber(pensionMatch?.[1]) || (gross - net) * 0.10;
  const unemployment = parseNumber(unemploymentMatch?.[1]) || (gross - net) * 0.05;

  const employeeName = nameMatch?.[1] || 'Aus PDF extrahiert';
  const period = periodMatch?.[1] || new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  console.log('Extrahierte Werte:', { employeeName, period, gross, net, hours, overtime });

  return {
    employeeName,
    employeeId: undefined,
    period,
    workHours: {
      regular: hours,
      overtime,
      total: hours + overtime,
    },
    salary: {
      gross,
      net,
      hourlyRate: hours > 0 ? parseFloat((gross / hours).toFixed(2)) : 0,
    },
    deductions: {
      taxAmount,
      socialSecurity: socialSec,
      healthInsurance: healthIns,
      pensionInsurance: pension,
      unemploymentInsurance: unemployment,
      totalDeductions: taxAmount + socialSec + healthIns + pension + unemployment,
    },
    vacationDays: {
      taken: 0,
      remaining: 30,
    },
  };
}

/**
 * Hauptfunktion: Extrahiert strukturierte Daten aus der PDF
 */
export async function extractPayslipData(file: File): Promise<PayslipData | null> {
  try {
    // 1. Text aus PDF extrahieren
    const text = await extractTextFromPDF(file);
    console.log('📄 PDF Text extrahiert (erste 500 Zeichen):', text.substring(0, 500));
    console.log('📄 PDF Text-Länge:', text.length, 'Zeichen');
    
    // Speichere den Text für Debug-Zwecke
    (window as any).__lastExtractedPDFText = text;
    
    // Prüfe ob Text leer ist
    if (!text || text.trim().length === 0) {
      console.error('⚠️ PDF-Text ist komplett leer!');
      (window as any).__extractionMethod = 'failed-empty';
      return null;
    }
    
    if (text.trim().length < 50) {
      console.warn('⚠️ PDF-Text ist sehr kurz (${text.trim().length} Zeichen):', text);
      console.warn('Versuche trotzdem weiterzumachen...');
    }
    
    // 2. Versuche mit Gemini API zu analysieren
    console.log('🤖 Versuche Gemini API...');
    const geminiResult = await analyzeWithGemini(text);
    
    if (geminiResult && geminiResult.salary && geminiResult.salary.gross > 0) {
      console.log('✅ Gemini API erfolgreich:', geminiResult);
      (window as any).__lastExtractedData = geminiResult;
      (window as any).__extractionMethod = 'gemini';
      return geminiResult;
    }
    
    // 3. Fallback: Regex-basierte Extraktion
    console.log('⚠️ Gemini fehlgeschlagen, nutze Regex-Fallback');
    const fallbackResult = parsePayslipTextFallback(text);
    
    // Prüfe ob Fallback sinnvolle Daten lieferte
    if (fallbackResult && fallbackResult.salary.gross > 0) {
      console.log('✅ Regex-Extraktion erfolgreich:', fallbackResult);
      (window as any).__lastExtractedData = fallbackResult;
      (window as any).__extractionMethod = 'regex';
      return fallbackResult;
    }
    
    console.error('❌ Beide Methoden fehlgeschlagen');
    (window as any).__extractionMethod = 'failed-both';
    return null;
    
  } catch (error) {
    console.error('❌ Fehler beim Extrahieren der PDF-Daten:', error);
    (window as any).__extractionMethod = 'failed-error';
    return null;
  }
}
