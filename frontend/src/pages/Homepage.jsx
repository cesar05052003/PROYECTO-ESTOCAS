import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Shield, Users, TrendingUp, CheckCircle2, Lock, AlertTriangle, FileText, BarChart3, Map, Eye, Zap, Award } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export default function Homepage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleCards, setVisibleCards] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY > 300) {
        setVisibleCards(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maturityLevels = [
    {
      level: 'Nivel Básico',
      steps: '18 pasos esenciales',
      color: 'from-blue-400 to-blue-600',
      icon: Shield,
      items: [
        'Política de seguridad',
        'Diagnóstico inicial',
        'Capacitación básica',
        'Auditorías anuales'
      ]
    },
    {
      level: 'Nivel Estándar',
      steps: '22 pasos',
      color: 'from-cyan-400 to-blue-500',
      icon: Users,
      items: [
        'Comité de Seguridad Vial',
        'Gestión de contratistas',
        'Investigación de siniestros',
        'Evaluación de riesgos'
      ]
    },
    {
      level: 'Nivel Avanzado',
      steps: '24 pasos completos',
      color: 'from-indigo-400 to-indigo-600',
      icon: TrendingUp,
      items: [
        'Registro estadístico',
        'Comunicación avanzada',
        'Participación organizacional',
        'Mejora continua'
      ]
    }
  ];

  const keyComponents = [
    {
      icon: Users,
      title: 'Líder Estratégico del PESV',
      description: 'Responsable de la coordinación, implementación y sostenibilidad del plan de seguridad vial.'
    },
    {
      icon: FileText,
      title: 'Política de Seguridad Vial',
      description: 'Fundamento que define el compromiso organizacional con la seguridad en el tránsito.'
    },
    {
      icon: AlertTriangle,
      title: 'Evaluación y Control de Riesgos',
      description: 'Identificación sistemática de peligros en el desplazamiento laboral.'
    },
    {
      icon: Map,
      title: 'Planeación de Desplazamientos',
      description: 'Gestión estratégica de rutas seguras y desplazamientos laborales.'
    },
    {
      icon: Eye,
      title: 'Inspección de Vehículos',
      description: 'Verificación periódica del estado mecánico y de seguridad de la flota.'
    },
    {
      icon: Lock,
      title: 'Integración Normativa',
      description: 'Alineación con ISO 39001 y Decreto 1072 de 2015.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=900&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/70 to-slate-900/85"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="mb-8 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-200">Resolución 40595 de 2022</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Planes Estratégicos de <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Seguridad Vial</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            La metodología integral para el diseño, implementación y verificación de PESV, derogando la resolución 1565 de 2014.
          </p>

          <p className="text-base sm:text-lg text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            Reduce siniestros viales mediante gestión sistémica articulada con el SG-SST, siguiendo el ciclo PHVA: Planear, Hacer, Verificar y Actuar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/60" />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              ¿Qué es la Resolución 40595?
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                La Resolución 40595 de 2022 del Ministerio de Transporte de Colombia adopta la metodología para el diseño, implementación y verificación de los Planes Estratégicos de Seguridad Vial (PESV).
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Esta normativa deroga la resolución anterior 1565 de 2014 y busca reducir los siniestros viales mediante una gestión sistémica articulada con el Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST).
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Implementa el ciclo PHVA (Planear, Hacer, Verificar y Actuar) como marco de mejora continua en la seguridad vial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Normativa Actualizada</h3>
                <p className="text-sm text-slate-600">Deroga Resolución 1565 de 2014</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Seguridad Integral</h3>
                <p className="text-sm text-slate-600">Gestión sistémica articulada</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Mejora Continua</h3>
                <p className="text-sm text-slate-600">Ciclo PHVA implementado</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Reducción de Riesgos</h3>
                <p className="text-sm text-slate-600">Disminución de siniestros</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Image Section - Seguridad Vial */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Main Image */}
            <div
              className="relative h-96 md:h-[500px] lg:h-[600px] w-full"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%), url('${CLOUDINARY_CONFIG.IMAGES.HERO_BACKGROUND}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Blue Gradient Overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-cyan-900/40 flex items-center justify-center">
                <div className="text-center px-4 md:px-8 max-w-2xl">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    Seguridad Vial en Movimiento
                  </h2>
                  <p className="text-lg md:text-xl text-blue-50 leading-relaxed drop-shadow-md">
                    Implementa estrategias efectivas para reducir siniestros viales en tu organización
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Stats under image */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">+40%</div>
              <p className="text-slate-700 font-semibold">Reducción de Siniestros</p>
              <p className="text-sm text-slate-500 mt-2">Empresas que implementan PESV</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-cyan-600 mb-3">3 Niveles</div>
              <p className="text-slate-700 font-semibold">De Madurez</p>
              <p className="text-sm text-slate-500 mt-2">Progresión estructurada</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-3">24 Pasos</div>
              <p className="text-slate-700 font-semibold">Implementación Completa</p>
              <p className="text-sm text-slate-500 mt-2">Nivel Avanzado PESV</p>
            </div>
          </div>
        </div>
      </section>

      {/* Maturity Levels Section */}
      <section id="niveles" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Niveles de Madurez PESV
            </h2>
            <p className="text-xl text-slate-600">Progresión estructurada hacia la excelencia en seguridad vial</p>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-6"></div>
          </div>

          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 ${visibleCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {maturityLevels.map((level, idx) => {
              const IconComponent = level.icon;
              return (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${level.color}`}></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {level.level}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mb-6">
                      {level.steps}
                    </p>

                    {/* Divider */}
                    <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-cyan-400 mb-6"></div>

                    {/* Items */}
                    <ul className="space-y-4">
                      {level.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                      Conocer más
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Components Section */}
      <section id="componentes" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Componentes Clave del PESV
            </h2>
            <p className="text-xl text-slate-600">Elementos fundamentales para una implementación exitosa</p>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-6"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyComponents.map((component, idx) => {
              const IconComponent = component.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 bg-white rounded-xl border border-slate-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">
                    {component.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {component.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mb-48"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Comienza tu Transformación Hoy
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Implementa un PESV completo y efectivo con nuestra plataforma digital diseñada conforme a la Resolución 40595 de 2022.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Inicia Gratis Ahora
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold rounded-lg transition-all duration-300">
              Solicitar Demo
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
