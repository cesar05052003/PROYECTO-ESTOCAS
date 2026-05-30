import React, { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isScrolled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-b from-slate-900/70 to-slate-900/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow ${isScrolled ? 'from-blue-500 to-blue-600' : 'from-blue-400 to-blue-600'}`}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className={`font-bold text-lg transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                PESV Digital
              </p>
              <p className={`text-xs font-semibold transition-colors ${isScrolled ? 'text-slate-600' : 'text-blue-200'}`}>
                Resolución 40595
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavClick('inicio')} className={`font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
              Inicio
            </button>
            <button onClick={() => handleNavClick('niveles')} className={`font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
              Características
            </button>
            <button onClick={() => handleNavClick('componentes')} className={`font-medium transition-colors hover:text-blue-500 ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white/90 hover:text-white'}`}>
              Acerca de
            </button>
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleLoginClick}
              className={`px-6 py-2 font-semibold rounded-lg transition-all duration-300 ${
                isScrolled
                  ? 'text-blue-600 hover:text-blue-700 bg-transparent'
                  : 'text-white hover:bg-white/10 bg-transparent'
              }`}
            >
              Iniciar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-slate-900 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 space-y-4">
            <button onClick={() => handleNavClick('inicio')} className="w-full text-left block px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
              Inicio
            </button>
            <button onClick={() => handleNavClick('niveles')} className="w-full text-left block px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
              Características
            </button>
            <button onClick={() => handleNavClick('componentes')} className="w-full text-left block px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 rounded-lg">
              Acerca de
            </button>
            <div className="px-4 py-2 border-t border-slate-200 flex flex-col gap-2 mt-4">
              <button
                onClick={handleLoginClick}
                className="w-full px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
