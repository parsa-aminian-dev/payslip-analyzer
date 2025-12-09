import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PayslipData } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Kein Text vorhanden' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY nicht konfiguriert');
      return NextResponse.json({ error: 'API nicht konfiguriert' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analysiere diese deutsche Gehaltsabrechnung und extrahiere die Daten als JSON.

TEXT:
${text}

Gib NUR gültiges JSON zurück (ohne Markdown-Codeblock), mit genau dieser Struktur:
{
  "employeeName": "Name des Mitarbeiters oder 'Unbekannt'",
  "employeeId": "Personalnummer falls vorhanden oder null",
  "period": "Abrechnungsmonat z.B. 'November 2024'",
  "workHours": {
    "regular": Zahl der regulären Stunden,
    "overtime": Zahl der Überstunden,
    "total": Gesamtstunden
  },
  "salary": {
    "gross": Bruttolohn als Zahl,
    "net": Nettolohn als Zahl,
    "hourlyRate": Stundenlohn als Zahl oder null
  },
  "deductions": {
    "taxAmount": Lohnsteuer als Zahl,
    "socialSecurity": Sozialversicherung als Zahl,
    "healthInsurance": Krankenversicherung als Zahl,
    "pensionInsurance": Rentenversicherung als Zahl,
    "unemploymentInsurance": Arbeitslosenversicherung als Zahl,
    "totalDeductions": Gesamte Abzüge als Zahl
  },
  "vacationDays": {
    "taken": Genommene Urlaubstage,
    "remaining": Verbleibende Urlaubstage
  }
}

Wenn ein Wert nicht gefunden wird, setze 0 für Zahlen. Antworte NUR mit dem JSON-Objekt.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Entferne mögliche Markdown-Codeblocks
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const payslipData: PayslipData = JSON.parse(responseText);
      
      // Validiere wichtige Felder
      if (!payslipData.salary || typeof payslipData.salary.gross !== 'number') {
        throw new Error('Ungültige Gehaltsdaten');
      }
      
      return NextResponse.json(payslipData);
    } catch (parseError) {
      console.error('JSON Parse Fehler:', parseError);
      console.error('Response Text:', responseText);
      return NextResponse.json({ error: 'Konnte Daten nicht parsen' }, { status: 500 });
    }

  } catch (error) {
    console.error('Gemini API Fehler:', error);
    
    // Detailliertere Fehlerausgabe
    if (error && typeof error === 'object') {
      console.error('Fehlerdetails:', JSON.stringify(error, null, 2));
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    
    return NextResponse.json(
      { 
        error: 'KI-Analyse fehlgeschlagen', 
        details: errorMessage,
        suggestion: 'Bitte überprüfen Sie Ihren Google API Key oder versuchen Sie es später erneut.'
      },
      { status: 500 }
    );
  }
}
