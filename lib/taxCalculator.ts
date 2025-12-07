// lib/taxCalculator.ts

interface TaxValidationResult {
  isValid: boolean;
  expectedRange: {
    min: number;
    max: number;
  };
  issues: string[];
}

interface DeductionsData {
  taxAmount: number;
  socialSecurity: number;
  healthInsurance: number;
  pensionInsurance: number;
  unemploymentInsurance: number;
}

// Minimum wage values for Germany by year
const MINIMUM_WAGES: Record<number, number> = {
  2024: 12.41,
  2025: 12.82,
  2026: 13.5,
};

export function getMinimumWage(year: number): number {
  return MINIMUM_WAGES[year] || MINIMUM_WAGES[2025];
}

export function validateTaxes(
  grossSalary: number,
  netSalary: number,
  taxAmount: number,
  deductions: DeductionsData,
  state: string | undefined,
  taxClass: string | number | undefined
): TaxValidationResult {
  const issues: string[] = [];
  
  // Calculate total deductions
  const totalDeductions =
    deductions.taxAmount +
    deductions.socialSecurity +
    deductions.healthInsurance +
    deductions.pensionInsurance +
    deductions.unemploymentInsurance;

  // Verify net salary calculation
  const calculatedNet = grossSalary - totalDeductions;
  const netDifference = Math.abs(calculatedNet - netSalary);
  
  if (netDifference > 1) {
    issues.push(
      `Netto-Berechnung weicht ab: Erwartet ${calculatedNet.toFixed(2)}€, tatsächlich ${netSalary.toFixed(2)}€`
    );
  }

  // Check deduction percentages (roughly)
  const deductionRate = (totalDeductions / grossSalary) * 100;
  
  // Expected deduction range: typically 20-42% depending on tax class and state
  const taxClassNumber = typeof taxClass === 'number' ? taxClass : 
                         (typeof taxClass === 'string' ? parseInt(taxClass, 10) : 1);
  const expectedMin = getExpectedDeductionRange(taxClassNumber).min;
  const expectedMax = getExpectedDeductionRange(taxClassNumber).max;
  
  if (deductionRate < expectedMin - 5) {
    issues.push(
      `Abzüge scheinen zu niedrig: ${deductionRate.toFixed(1)}%, erwartet ${expectedMin.toFixed(1)}-${expectedMax.toFixed(1)}%`
    );
  }
  
  if (deductionRate > expectedMax + 5) {
    issues.push(
      `Abzüge scheinen zu hoch: ${deductionRate.toFixed(1)}%, erwartet ${expectedMin.toFixed(1)}-${expectedMax.toFixed(1)}%`
    );
  }

  // Tax amount sanity check
  const taxRate = (taxAmount / grossSalary) * 100;
  if (taxRate < 0) {
    issues.push('Steuerbetrag kann nicht negativ sein');
  }
  if (taxRate > 45) {
    issues.push('Steuersatz erscheint ungewöhnlich hoch');
  }

  // Social security contributions check (roughly 18.6% each employer/employee)
  const ssRate = (deductions.socialSecurity / grossSalary) * 100;
  if (ssRate < 8 || ssRate > 22) {
    issues.push(
      `Sozialversicherungsbeiträge scheinen ungewöhnlich: ${ssRate.toFixed(1)}%`
    );
  }

  const isValid = issues.length === 0;
  
  return {
    isValid,
    expectedRange: {
      min: (grossSalary * expectedMin) / 100,
      max: (grossSalary * expectedMax) / 100,
    },
    issues,
  };
}

export function validateMinimumWage(
  hourlyRate: number,
  year: number = 2025
): { isValid: boolean; minimumWage: number; difference: number } {
  const minimumWage = getMinimumWage(year);
  const difference = hourlyRate - minimumWage;
  
  return {
    isValid: hourlyRate >= minimumWage,
    minimumWage,
    difference,
  };
}

function getExpectedDeductionRange(
  taxClass: number
): { min: number; max: number } {
  // Tax class based deduction ranges (in percentage)
  // These are rough estimates; actual rates vary by income, state, and personal factors
  
  switch (taxClass) {
    case 1: // Single
      return { min: 20, max: 42 };
    case 2: // Single with child
      return { min: 18, max: 40 };
    case 3: // Married (higher income earner)
      return { min: 15, max: 38 };
    case 4: // Married (equal income)
      return { min: 20, max: 42 };
    case 5: // Married (lower income earner)
      return { min: 25, max: 45 };
    case 6: // Multiple jobs
      return { min: 25, max: 45 };
    default:
      return { min: 20, max: 42 };
  }
}
