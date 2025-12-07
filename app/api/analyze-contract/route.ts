import { NextRequest, NextResponse } from 'next/server';
import { ContractData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate contract data
    const contractData: ContractData = {
      employeeName: body.employeeName || '',
      hourlyRate: body.hourlyRate || 0,
      weeklyHours: body.weeklyHours || 40,
      monthlyHours: body.monthlyHours || 160,
      expectedGrossSalary: body.expectedGrossSalary || 0,
      taxClass: body.taxClass || '1',
      vacationDaysPerYear: body.vacationDaysPerYear || 20,
      state: body.state,
      city: body.city,
      supplements: body.supplements,
    };

    // Validate required fields
    if (!contractData.employeeName || !contractData.hourlyRate) {
      return NextResponse.json(
        { error: 'Erforderliche Felder fehlen' },
        { status: 400 }
      );
    }

    return NextResponse.json(contractData);
  } catch (error) {
    console.error('API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    
    return NextResponse.json(
      { 
        error: 'Fehler beim Verarbeiten des Vertrags',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
