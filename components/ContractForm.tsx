'use client';

import { useState } from 'react';
import { ContractData } from '@/types';

interface ContractFormProps {
  onSubmit: (data: ContractData) => void;
}

export default function ContractForm({ onSubmit }: ContractFormProps) {
  const [formData, setFormData] = useState<ContractData>({
    employeeName: '',
    hourlyRate: 0,
    weeklyHours: 40,
    monthlyHours: 160,
    expectedGrossSalary: 0,
    taxClass: 'I',
    vacationDaysPerYear: 30,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = ['hourlyRate', 'weeklyHours', 'monthlyHours', 'expectedGrossSalary', 'vacationDaysPerYear'].includes(name)
      ? parseFloat(value) || 0
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const calculateMonthlySalary = () => {
    if (formData.hourlyRate && formData.monthlyHours) {
      const calculated = formData.hourlyRate * formData.monthlyHours;
      setFormData(prev => ({
        ...prev,
        expectedGrossSalary: parseFloat(calculated.toFixed(2))
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vertragsdaten eingeben
        </h2>
        <p className="text-gray-600">
          Gib deine Vertragsdaten ein, um die Abrechnung zu vergleichen
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name des Arbeitnehmers
          </label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            placeholder="Max Mustermann"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Stundenlohn & Wochenstunden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stundenlohn (€)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate || ''}
              onChange={handleChange}
              onBlur={calculateMonthlySalary}
              step="0.01"
              placeholder="21.88"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wochenstunden
            </label>
            <input
              type="number"
              name="weeklyHours"
              value={formData.weeklyHours || ''}
              onChange={handleChange}
              step="0.5"
              placeholder="40"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Monatsstunden & Erwartetes Gehalt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monatsstunden (Soll)
            </label>
            <input
              type="number"
              name="monthlyHours"
              value={formData.monthlyHours || ''}
              onChange={handleChange}
              onBlur={calculateMonthlySalary}
              step="1"
              placeholder="160"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Erwartetes Brutto-Gehalt (€)
            </label>
            <input
              type="number"
              name="expectedGrossSalary"
              value={formData.expectedGrossSalary || ''}
              onChange={handleChange}
              step="0.01"
              placeholder="3500.00"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Steuerklasse & Urlaubstage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Steuerklasse
            </label>
            <select
              name="taxClass"
              value={formData.taxClass}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="I">I - Ledig</option>
              <option value="II">II - Alleinerziehend</option>
              <option value="III">III - Verheiratet</option>
              <option value="IV">IV - Verheiratet (beide berufstätig)</option>
              <option value="V">V - Verheiratet (anderer)</option>
              <option value="VI">VI - Zweitjob</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urlaubstage pro Jahr
            </label>
            <input
              type="number"
              name="vacationDaysPerYear"
              value={formData.vacationDaysPerYear || ''}
              onChange={handleChange}
              step="1"
              placeholder="30"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Abrechnung analysieren →
        </button>
      </form>
    </div>
  );
}
