# 💼 Payslip Analyzer

Eine moderne Next.js-Anwendung zur automatischen Analyse von Gehaltsabrechnungen mit KI-Unterstützung (Google Gemini AI).

## ✨ Features

- **PDF-Upload & Analyse**: Upload von Gehaltsabrechnungen im PDF-Format mit automatischer Texterkennung
- **KI-gestützte Auswertung**: Intelligente Datenextraktion durch Google Gemini 1.5 Flash API
- **Vertragsanalyse**: Vergleich zwischen Arbeitsvertrag und tatsächlicher Abrechnung
- **Detaillierter Vergleich**: Übersichtliche Darstellung von Abweichungen und Berechnungen
- **Moderne UI**: Responsive Design mit Tailwind CSS, Animationen und Glassmorphismus-Effekten

## 🚀 Quick Start

### Voraussetzungen

- Node.js 18+ 
- npm/yarn/pnpm
- Google Gemini API Key ([hier anfordern](https://makersuite.google.com/app/apikey))

### Installation

1. **Repository klonen**
```bash
git clone <your-repo-url>
cd payslip-analyzer
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Umgebungsvariablen konfigurieren**

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
GOOGLE_API_KEY=dein_api_key_hier
```

4. **Development Server starten**
```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## 📂 Projektstruktur

```
payslip-analyzer/
├── app/
│   ├── page.tsx                 # Homepage mit Hero & Features
│   ├── abrechnung/              # Gehaltsabrechnung analysieren
│   ├── vertrag/                 # Vertragsanalyse
│   ├── vergleich/               # Vergleichsansicht
│   └── api/
│       ├── analyze/             # PDF-Analyse-Endpoint
│       ├── analyze-contract/    # Vertragsanalyse-Endpoint
│       └── analyze-with-ai/     # KI-gestützte Analyse
├── components/
│   ├── Navbar.tsx               # Navigation
│   ├── FileUpload.tsx           # PDF-Upload-Komponente
│   ├── ContractForm.tsx         # Vertragseingabe
│   └── ResultsDashboard.tsx     # Ergebnisdarstellung
├── lib/
│   ├── pdfExtractor.ts          # PDF-Textextraktion
│   ├── taxCalculator.ts         # Steuerberechnungen
│   └── compareData.ts           # Datenvergleich
└── types/
    └── index.ts                 # TypeScript Definitionen
```

## 🛠️ Technologie-Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 3.4
- **Sprache**: TypeScript 5
- **KI**: Google Generative AI (Gemini 1.5 Flash)
- **PDF-Verarbeitung**: pdf-parse, pdfjs-dist
- **Styling**: PostCSS, Autoprefixer

## 📖 Verwendung

### 1. Gehaltsabrechnung analysieren
- Navigiere zu "Abrechnung"
- Lade eine PDF-Gehaltsabrechnung hoch
- Die KI extrahiert automatisch: Gehalt, Abzüge, Netto-Betrag, Steuern, etc.
- Ergebnisse werden im Dashboard angezeigt

### 2. Vertrag analysieren
- Navigiere zu "Vertrag"
- Gib Vertragsdaten manuell ein oder lade PDF hoch
- Systemberechnet erwartetes Gehalt und Abzüge

### 3. Vergleich durchführen
- Navigiere zu "Vergleich"
- System vergleicht Vertragsdaten mit tatsächlicher Abrechnung
- Zeigt Abweichungen und mögliche Fehler an

## 🔑 API-Konfiguration

Die Anwendung nutzt die Google Gemini API für intelligente Textanalyse. Stelle sicher, dass:

1. Ein gültiger API-Key in `.env.local` gesetzt ist
2. Die API-Quota nicht überschritten wurde
3. Die Gemini 1.5 Flash API aktiviert ist

## 🎨 Customization

### Logo & Icons anpassen

Ersetze die Dateien in `/public`:
- `logo.png` - Haupt-Logo (empfohlen: 200x200px)
- `home-icon.png`, `payslip.png`, `contract.png`, `statistic.png` - Navigation Icons

### Farben anpassen

Bearbeite `/app/globals.css` und `/tailwind.config.js` für Theme-Anpassungen.

## 📝 Scripts

```bash
npm run dev      # Development Server starten
npm run build    # Production Build erstellen
npm start        # Production Server starten
npm run lint     # ESLint ausführen
```

## 🤝 Contributing

Contributions sind willkommen! Bitte:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details in [LICENSE](LICENSE).

## 🙏 Credits

Entwickelt mit Next.js, Tailwind CSS und Google Gemini AI.
