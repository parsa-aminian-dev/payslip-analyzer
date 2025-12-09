'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
      <div className="absolute top-40 right-10 w-[500px] h-[500px] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/2 w-[500px] h-[500px] bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24 pt-16">
          <div className="mb-8 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative animate-float">
                <Image 
                  src="/logo.png" 
                  alt="Payslip Analyzer" 
                  width={200} 
                  height={200}
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent leading-tight tracking-tight">
            Payslip Analyzer
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 max-w-3xl mx-auto leading-relaxed mb-4">
            Überprüfen Sie Ihre Gehaltsabrechnung automatisch
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Laden Sie Ihre PDF-Dokumente hoch und erhalten Sie eine präzise Analyse durch KI-Technologie
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-xl">✨</span>
                KI-gestützt
              </span>
            </div>
            <div className="group px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-xl">⚡</span>
                Schnell & Präzise
              </span>
            </div>
            <div className="group px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-xl">🔒</span>
                100% Sicher
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Link href="/abrechnung" className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:border-blue-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Image src="/payslip.png" alt="" width={32} height={32} className="object-contain brightness-0 invert" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">Abrechnung analysieren</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              PDF hochladen und automatische Extraktion aller relevanten Daten wie Stundenlohn, Arbeitsstunden und Abzüge.
            </p>
            <div className="text-base font-bold text-blue-600 group-hover:text-blue-700 flex items-center gap-2">
              <span>Jetzt starten</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          <Link href="/vertrag" className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:border-indigo-200">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Image src="/contract.png" alt="" width={32} height={32} className="object-contain brightness-0 invert" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">Vertrag prüfen</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Arbeitsvertrag hochladen und wichtigste Vertragsbedingungen automatisch extrahieren lassen.
            </p>
            <div className="text-base font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-2">
              <span>Jetzt starten</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          <Link href="/vergleich" className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 hover:border-violet-200">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Image src="/statistic.png" alt="" width={32} height={32} className="object-contain brightness-0 invert" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-violet-600 transition-colors">Automatischer Vergleich</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Vergleich von Abrechnung und Vertrag. Erkennung von Abweichungen bei Stundenlohn und Arbeitszeit.
            </p>
            <div className="text-base font-bold text-violet-600 group-hover:text-violet-700 flex items-center gap-2">
              <span>Jetzt starten</span>
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-24">
          <Link
            href="/abrechnung"
            className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Image src="/payslip.png" alt="" width={24} height={24} className="object-contain brightness-0 invert relative z-10" />
            <span className="relative z-10">Abrechnung hochladen</span>
          </Link>
          <Link
            href="/vertrag"
            className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-lg rounded-2xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 shadow-2xl hover:shadow-indigo-500/50 hover:scale-110 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Image src="/contract.png" alt="" width={24} height={24} className="object-contain brightness-0 invert relative z-10" />
            <span className="relative z-10">Vertrag hochladen</span>
          </Link>
          <Link
            href="/vergleich"
            className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-violet-600 to-violet-700 text-white font-bold text-lg rounded-2xl hover:from-violet-700 hover:to-violet-800 transition-all duration-300 shadow-2xl hover:shadow-violet-500/50 hover:scale-110 flex items-center justify-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <Image src="/statistic.png" alt="" width={24} height={24} className="object-contain brightness-0 invert relative z-10" />
            <span className="relative z-10">Vergleich starten</span>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 shadow-2xl border border-gray-200 mb-20">
          <h2 className="text-4xl font-black mb-12 text-center bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">So funktioniert's</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">1</span>
                </div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">PDF hochladen</h4>
              <p className="text-gray-600 leading-relaxed">Laden Sie Ihre Dokumente als PDF hoch</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">2</span>
                </div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Automatische Analyse</h4>
              <p className="text-gray-600 leading-relaxed">KI extrahiert alle wichtigen Daten</p>
            </div>
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-violet-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                  <span className="text-3xl font-black text-white">3</span>
                </div>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Ergebnisse erhalten</h4>
              <p className="text-gray-600 leading-relaxed">Übersichtliche Darstellung aller Abweichungen</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-12 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-5 text-white">Über das Projekt</h3>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                Tool zur automatischen Überprüfung von Gehaltsabrechnungen mit moderner <span className="font-bold text-blue-300">KI-Technologie</span>
              </p>
              <div className="inline-flex items-center justify-center space-x-4 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 shadow-xl">
                <span className="text-gray-300 font-medium">Entwickelt von</span>
                <span className="font-black text-xl text-white">Parsa Aminian</span>
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-sm text-gray-400 mt-8 font-medium">© 2025 Payslip Analyzer • Made with ❤️ in Germany</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
