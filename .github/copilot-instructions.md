# Payslip Analyzer - AI Agent Instructions

## Project Overview
Payslip Analyzer is a Next.js application that helps German employees verify their monthly salary payments against employment contracts. Users upload PDF payslips, enter contract details, and the app compares them to identify discrepancies in wages, working hours, and deductions.

## Architecture & Data Flow

### Core Data Model (types/index.ts)
- **PayslipData**: Extracted from PDF (hours, salary, deductions, vacation days)
- **ContractData**: User-entered contract terms (hourly rate, monthly hours, tax class)
- **ComparisonResult**: Individual field-level comparison with status ('correct'|'warning'|'error')
- **AnalysisResult**: Complete analysis with all comparisons and confidence score

### Multi-Step Workflow (app/page.tsx)
1. **Upload Step**: User uploads PDF → `FileUpload` component → calls `extractPayslipData()`
2. **Contract Step**: User enters contract details → `ContractForm` component
3. **Results Step**: `comparePayslipWithContract()` runs, displays findings in `ResultsDashboard`
State management uses React `useState` with step tracking ('upload'|'contract'|'results').

### Key Processing Functions
- **pdfExtractor.ts**: Extracts text from PDFs using PDF.js (browser-side). Uses `pdfjs-dist` with CloudFlare CDN worker.
- **compareData.ts**: Implements business logic (hourly rate verification, working hours checks, gross salary validation, vacation day tracking). Returns aggregated analysis with error/warning/correct status.
- **taxCalculator.ts & mockData.ts**: Tax calculation utilities and sample payslip/contract data for testing.

## Development Workflow

### Build & Run
```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build (next.js)
npm run start      # Run production build
npm run lint       # Run ESLint
```

### Common Tasks
- **Adding comparison logic**: Edit `compareData.ts` → add new ComparisonResult to comparisons array
- **Modifying UI components**: Components are in `components/` folder, use Tailwind CSS (v4 with PostCSS)
- **Testing with mock data**: Use `mockPayslipData` and `mockContractData` from `lib/mockData.ts`
- **PDF extraction issues**: Check `next.config.ts` webpack config (PDF.js worker compatibility)

## Project-Specific Patterns

### German Language Localization
All user-facing text is in German (e.g., "Vertragsdaten eingeben", "Stundenlohn"). Error messages and field names follow German employment terminology.

### Comparison Result Structure
Each comparison includes: status (determines icon/color), field name, expected vs. actual values, difference (for numeric), and user-friendly message. See `ResultsDashboard.tsx` for rendering patterns.

### Tailwind + TypeScript Best Practices
- Use `'use client'` directive for interactive components
- Gradient backgrounds: `bg-gradient-to-br from-blue-50 via-white to-purple-50`
- Status colors: Green (correct), Yellow (warning), Red (error)
- Form inputs: `focus:ring-2 focus:ring-blue-500 focus:border-transparent` pattern

## Integration Points & Dependencies

### External APIs (Optional)
- **OpenAI, Anthropic, Google Generative AI SDKs**: Imported but not currently used. May be used for future AI-powered PDF analysis instead of mock data.
- **PDF Processing**: `pdfjs-dist` (browser) for text extraction; `pdf-parse` (Node) available but currently unused.

### Build Configuration
- **Next.js 16** with TypeScript strict mode
- **Turbopack** enabled (next.config.ts)
- **Webpack custom config**: Disables canvas/encoding aliases to prevent PDF.js errors
- **Tailwind CSS v4**: Configured via postcss.config.mjs

### Type Safety
All React components and functions are fully typed. Use `types/index.ts` as single source of truth for data shapes.

## Common Gotchas & How-To's

1. **PDF extraction fails in browser**: Check if `pdfjs-dist` worker URL is accessible. Config in `pdfExtractor.ts` uses CDN fallback.
2. **State not updating after upload**: Ensure component calls `onFileUpload()` callback; check step state transitions in main page.
3. **Styling inconsistencies**: All colors/spacing use Tailwind. Check `globals.css` for custom font variables (Geist fonts).
4. **Adding new comparisons**: Follow the pattern in `compareData.ts` - calculate difference, check tolerance, push result with appropriate status and message.
