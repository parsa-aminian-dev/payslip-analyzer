// types/index.ts

export interface PayslipData {
  employeeName: string;
  employeeId?: string;
  period: string;
  
  workHours: {
    regular: number;
    overtime: number;
    total: number;
  };
  
  salary: {
    gross: number;
    net: number;
    hourlyRate?: number;
  };
  
  deductions: {
    taxAmount: number;
    socialSecurity: number;
    healthInsurance: number;
    pensionInsurance: number;
    unemploymentInsurance: number;
    totalDeductions: number;
  };
  
  vacationDays?: {
    taken: number;
    remaining: number;
  };
}

export interface ContractData {
  employeeName: string;
  hourlyRate: number;
  weeklyHours: number;
  monthlyHours: number;
  expectedGrossSalary: number;
  taxClass: string;
  vacationDaysPerYear: number;
  state?: string;
  city?: string;
  supplements?: {
    overtime: number | null;
    nightShift: number | null;
    weekend: number | null;
    holiday: number | null;
    other: string | null;
  };
}

export interface ComparisonResult {
  status: 'correct' | 'warning' | 'error';
  field: string;
  expected: number | string;
  actual: number | string;
  difference?: number;
  message: string;
}

export interface AnalysisResult {
  payslipData: PayslipData | null;
  comparisons: ComparisonResult[];
  overallStatus: 'correct' | 'warning' | 'error';
  confidence: number;
}



