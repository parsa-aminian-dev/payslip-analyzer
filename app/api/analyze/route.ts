import { NextRequest, NextResponse } from 'next/server';
import { PayslipData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Get PDF file from request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Keine Datei hochgeladen' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Nur PDF-Dateien werden unterstützt' },
        { status: 400 }
      );
    }

    // For now, return mock data
    // In production, use AI to extract data from PDF
    const payslipData: PayslipData = {
      employeeName: 'Max Mustermann',
      employeeId: 'EMP-001',
      period: 'Dezember 2024',
      workHours: {
        regular: 160,
        overtime: 5,
        total: 165,
      },
      salary: {
        gross: 3500,
        net: 2350,
        hourlyRate: 21.88,
      },
      deductions: {
        taxAmount: 520,
        socialSecurity: 315,
        healthInsurance: 185,
        pensionInsurance: 94,
        unemploymentInsurance: 36,
        totalDeductions: 1150,
      },
      vacationDays: {
        taken: 2,
        remaining: 18,
      },
    };

    return NextResponse.json(payslipData);
  } catch (error) {
    console.error('API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    
    return NextResponse.json(
      { 
        error: 'Fehler beim Analysieren der PDF',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
