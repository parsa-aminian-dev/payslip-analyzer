// lib/mockData.ts
import { PayslipData, ContractData } from '@/types';

export const mockPayslipData: PayslipData = {
  employeeName: "Max Mustermann",
  employeeId: "EMP-12345",
  period: "November 2024",
  
  workHours: {
    regular: 160,
    overtime: 8,
    total: 168
  },
  
  salary: {
    gross: 3500.00,
    net: 2245.50,
    hourlyRate: 21.88
  },
  
  deductions: {
    taxAmount: 625.00,
    socialSecurity: 315.00,
    healthInsurance: 185.50,
    pensionInsurance: 94.00,
    unemploymentInsurance: 35.00,
    totalDeductions: 1254.50
  },
  
  vacationDays: {
    taken: 12,
    remaining: 18
  }
};

export const mockContractData: ContractData = {
  employeeName: "Max Mustermann",
  hourlyRate: 21.88,
  weeklyHours: 40,
  monthlyHours: 160,
  expectedGrossSalary: 3500.00,
  taxClass: "I",
  vacationDaysPerYear: 30
};

// Beispiel für eine Abrechnung mit Fehlern
export const mockPayslipDataWithErrors: PayslipData = {
  employeeName: "Max Mustermann",
  employeeId: "EMP-12345",
  period: "November 2024",
  
  workHours: {
    regular: 160,
    overtime: 8,
    total: 168
  },
  
  salary: {
    gross: 3200.00, // Zu wenig!
    net: 2045.50,
    hourlyRate: 20.00 // Falscher Stundenlohn!
  },
  
  deductions: {
    taxAmount: 625.00,
    socialSecurity: 315.00,
    healthInsurance: 185.50,
    pensionInsurance: 94.00,
    unemploymentInsurance: 35.00,
    totalDeductions: 1254.50
  },
  
  vacationDays: {
    taken: 12,
    remaining: 18
  }
};