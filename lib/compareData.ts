// lib/compareData.ts
import { PayslipData, ContractData, ComparisonResult, AnalysisResult } from '@/types';

export function comparePayslipWithContract(
  payslip: PayslipData,
  contract: ContractData
): AnalysisResult {
  const comparisons: ComparisonResult[] = [];

  // 1. Stundenlohn prüfen
  if (payslip.salary.hourlyRate) {
    const diff = Math.abs(payslip.salary.hourlyRate - contract.hourlyRate);
    const tolerance = 0.01; // 1 Cent Toleranz
    
    if (diff > tolerance) {
      comparisons.push({
        status: 'error',
        field: 'Stundenlohn',
        expected: contract.hourlyRate,
        actual: payslip.salary.hourlyRate,
        difference: payslip.salary.hourlyRate - contract.hourlyRate,
        message: `Stundenlohn stimmt nicht überein. Differenz: ${diff.toFixed(2)}€`
      });
    } else {
      comparisons.push({
        status: 'correct',
        field: 'Stundenlohn',
        expected: contract.hourlyRate,
        actual: payslip.salary.hourlyRate,
        message: 'Stundenlohn korrekt'
      });
    }
  }

  // 2. Arbeitsstunden prüfen
  const expectedHours = contract.monthlyHours;
  const actualRegularHours = payslip.workHours.regular;
  
  if (actualRegularHours !== expectedHours) {
    const diff = actualRegularHours - expectedHours;
    comparisons.push({
      status: diff > 0 ? 'warning' : 'error',
      field: 'Arbeitsstunden',
      expected: expectedHours,
      actual: actualRegularHours,
      difference: diff,
      message: `Arbeitsstunden ${diff > 0 ? 'überschritten' : 'unterschritten'}: ${Math.abs(diff)}h`
    });
  } else {
    comparisons.push({
      status: 'correct',
      field: 'Arbeitsstunden',
      expected: expectedHours,
      actual: actualRegularHours,
      message: 'Arbeitsstunden korrekt'
    });
  }

  // 3. Brutto-Gehalt prüfen
  const expectedGross = contract.expectedGrossSalary;
  const actualGross = payslip.salary.gross;
  const grossDiff = Math.abs(actualGross - expectedGross);
  const grossTolerance = 10; // 10€ Toleranz
  
  if (grossDiff > grossTolerance) {
    comparisons.push({
      status: 'error',
      field: 'Brutto-Gehalt',
      expected: expectedGross,
      actual: actualGross,
      difference: actualGross - expectedGross,
      message: `Brutto-Gehalt weicht ab. Differenz: ${grossDiff.toFixed(2)}€`
    });
  } else {
    comparisons.push({
      status: 'correct',
      field: 'Brutto-Gehalt',
      expected: expectedGross,
      actual: actualGross,
      message: 'Brutto-Gehalt korrekt'
    });
  }

  // 4. Überstunden prüfen
  if (payslip.workHours.overtime > 0) {
    comparisons.push({
      status: 'warning',
      field: 'Überstunden',
      expected: 0,
      actual: payslip.workHours.overtime,
      difference: payslip.workHours.overtime,
      message: `${payslip.workHours.overtime} Überstunden angefallen`
    });
  }

  // 5. Abzüge Plausibilität (grobe Prüfung)
  const deductionRate = (payslip.deductions.totalDeductions / actualGross) * 100;
  if (deductionRate < 20 || deductionRate > 50) {
    comparisons.push({
      status: 'warning',
      field: 'Abzüge',
      expected: '30-40%',
      actual: `${deductionRate.toFixed(1)}%`,
      message: `Abzüge erscheinen ungewöhnlich: ${deductionRate.toFixed(1)}%`
    });
  } else {
    comparisons.push({
      status: 'correct',
      field: 'Abzüge',
      expected: '30-40%',
      actual: `${deductionRate.toFixed(1)}%`,
      message: 'Abzüge im normalen Bereich'
    });
  }

  // Overall Status bestimmen
  const hasErrors = comparisons.some(c => c.status === 'error');
  const hasWarnings = comparisons.some(c => c.status === 'warning');
  
  const overallStatus = hasErrors ? 'error' : hasWarnings ? 'warning' : 'correct';
  
  // Confidence Score (für später wenn wir AI integrieren)
  const correctCount = comparisons.filter(c => c.status === 'correct').length;
  const confidence = (correctCount / comparisons.length) * 100;

  return {
    payslipData: payslip,
    comparisons,
    overallStatus,
    confidence
  };
}
