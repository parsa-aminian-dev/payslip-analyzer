'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              <Image 
                src="/logo.png" 
                alt="Payslip Analyzer" 
                width={56} 
                height={56}
                className="object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
              Payslip Analyzer
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`group px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-2.5 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              <Image src="/home-icon.png" alt="Home" width={22} height={22} className={`object-contain ${isActive('/') ? 'brightness-0 invert' : ''}`} />
              Home
            </Link>
            <Link
              href="/abrechnung"
              className={`group px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-2.5 ${
                isActive('/abrechnung')
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-500/30 scale-105'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
              }`}
            >
              <Image src="/payslip.png" alt="Abrechnung" width={22} height={22} className={`object-contain ${isActive('/abrechnung') ? 'brightness-0 invert' : ''}`} />
              Abrechnung
            </Link>
            <Link
              href="/vertrag"
              className={`group px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-2.5 ${
                isActive('/vertrag')
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-500/30 scale-105'
                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105'
              }`}
            >
              <Image src="/contract.png" alt="Vertrag" width={22} height={22} className={`object-contain ${isActive('/vertrag') ? 'brightness-0 invert' : ''}`} />
              Vertrag
            </Link>
            <Link
              href="/vergleich"
              className={`group px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-2.5 ${
                isActive('/vergleich')
                  ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-xl shadow-violet-500/30 scale-105'
                  : 'text-gray-700 hover:bg-violet-50 hover:text-violet-600 hover:scale-105'
              }`}
            >
              <Image src="/statistic.png" alt="Vergleich" width={22} height={22} className={`object-contain ${isActive('/vergleich') ? 'brightness-0 invert' : ''}`} />
              Vergleich
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
