import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PayslipData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Kein Text vorhanden' }, { status: 400 });
    }

    console.log('📄 Erhaltener PDF-Text (erste 500 Zeichen):', text.substring(0, 500));
    console.log('📄 Text-Länge:', text.length, 'Zeichen');

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      console.error('GOOGLE_API_KEY nicht konfiguriert');
      return NextResponse.json({ error: 'API nicht konfiguriert' }, { status: 500 });
    }

    console.log('API Key vorhanden:', apiKey.substring(0, 10) + '...');
    const genAI = new GoogleGenerativeAI(apiKey);

    // Verwende das neueste verfügbare Gemini-Modell
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Extrahiere Daten aus dieser deutschen Gehaltsabrechnung.

TEXT:
${text}

Finde diese Werte im Text und gib sie als JSON zurück (ohne Markdown):

Beispiel wenn Text "Max Mustermann, Brutto: 3.500,00€, Netto: 2.245,00€, Stunden: 160" enthält:
{
  "employeeName": "Max Mustermann",
  "employeeId": null,
  "period": "gefundenes Datum oder 'Dezember 2024'",
  "workHours": {"regular": 160, "overtime": 0, "total": 160},
  "salary": {"gross": 3500, "net": 2245, "hourlyRate": 21.88},
  "deductions": {"taxAmount": 625, "socialSecurity": 315, "healthInsurance": 185, "pensionInsurance": 94, "unemploymentInsurance": 35, "totalDeductions": 1255},
  "vacationDays": {"taken": 0, "remaining": 30}
}

WICHTIG: 
- Zahlenformat: 1.234,56€ wird zu 1234.56
- Wenn Wert nicht im Text: schätze sinnvoll oder nutze 0
- NUR JSON ausgeben, kein Markdown!`;


    console.log('Sende Request an Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('Gemini Response Status:', response);
    
    let responseText = response.text();
    console.log('Gemini Response Text (erste 500 Zeichen):', responseText.substring(0, 500));
    console.log('Gemini Response Text (komplett):', responseText);

    // Entferne ALLE möglichen Markdown-Varianten
    responseText = responseText
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^[\s\n]+/, '')
      .replace(/[\s\n]+$/, '')
      .trim();
    
    console.log('Bereinigter Text (erste 200 Zeichen):', responseText.substring(0, 200));

    try {
      let payslipData: any = JSON.parse(responseText);
      
      // Konvertiere null-Werte zu 0 (Fallback)
      if (payslipData.salary) {
        payslipData.salary.gross = payslipData.salary.gross ?? 0;
        payslipData.salary.net = payslipData.salary.net ?? 0;
        payslipData.salary.hourlyRate = payslipData.salary.hourlyRate ?? 0;
      }
      if (payslipData.workHours) {
        payslipData.workHours.regular = payslipData.workHours.regular ?? 0;
        payslipData.workHours.overtime = payslipData.workHours.overtime ?? 0;
        payslipData.workHours.total = payslipData.workHours.total ?? 0;
      }
      
      // Wenn immer noch ungültig -> Fehler
      if (!payslipData.salary || payslipData.salary.gross === 0) {
        console.error('⚠️ Gemini konnte keine Daten extrahieren');
        throw new Error('Ungültige Gehaltsdaten - verwende Fallback');
      }
      
      console.log('✅ Geparste Daten:', payslipData);
      return NextResponse.json(payslipData);
    } catch (parseError) {
      console.error('JSON Parse Fehler:', parseError);
      console.error('Response Text:', responseText);
      return NextResponse.json({ error: 'Konnte Daten nicht parsen' }, { status: 500 });
    }

  } catch (error) {
    console.error('Gemini API Fehler:', error);
    
    let errorMessage = 'Unbekannter Fehler';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
      console.error('Error Stack:', errorDetails);
    }
    
    // Spezifische Fehlerbehandlung
    if (errorMessage.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'API-Schlüssel ungültig oder abgelaufen' },
        { status: 401 }
      );
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return NextResponse.json(
        { error: 'API-Limit erreicht. Bitte später erneut versuchen.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'KI-Analyse fehlgeschlagen', details: errorMessage },
      { status: 500 }
    );
  }
}
