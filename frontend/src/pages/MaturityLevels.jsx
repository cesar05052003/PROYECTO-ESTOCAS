import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Shield, Users, TrendingUp, Info, X } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function MaturityLevels() {
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('basic');
  const [isScrolled, setIsScrolled] = useState(false);
  const [modalLevel, setModalLevel] = useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    console.log('modalLevel cambió:', modalLevel);
    if (modalLevel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalLevel]);

  const maturityData = {
    basic: {
      title: 'Nivel Básico',
      badge: '🟢',
      steps: '18 Pasos',
      color: 'from-blue-400 to-blue-600',
      icon: Shield,
      description: 'Obligatorio para organizaciones con flotas entre 10 y 50 vehículos. Se enfoca en la gestión fundamental de seguridad vial.',
      items: [
        'Líder del diseño e implementación del PESV: Designar un responsable.',
        'Política de Seguridad Vial: Formalizar el compromiso de la organización.',
        'Liderazgo y compromiso directivo: Involucramiento activo de la alta gerencia.',
        'Diagnóstico: Evaluar el estado actual de la seguridad vial.',
        'Caracterización, evaluación y control de riesgos: Identificar peligros en rutas y conductores.',
        'Objetivos y metas: Definir qué se quiere lograr en seguridad vial.',
        'Programas de gestión de riesgos críticos: Acciones para los riesgos más altos.',
        'Plan anual de trabajo: Cronograma de ejecución.',
        'Competencia y plan anual de formación: Capacitación obligatoria para conductores.',
        'Plan de preparación y respuesta ante emergencias: Protocolos de actuación.',
        'Vías seguras administradas: Gestión de infraestructura propia (parqueaderos, patios).',
        'Planificación de desplazamientos laborales: Control de rutas y tiempos.',
        'Inspección de vehículos y equipos: Revisión pre-operacional y técnica.',
        'Mantenimiento y control de vehículos: Garantizar la mecánica segura.',
        'Indicadores y reporte de autogestión: Medición de cumplimiento.',
        'Auditoría anual: Verificación interna del sistema.',
        'Mejora continua: Acciones correctivas y preventivas.',
        'Mecanismos de comunicación y participación: Canales de difusión y feedback.'
      ]
    },
    standard: {
      title: 'Nivel Estándar',
      badge: '🟡',
      steps: '22 Pasos',
      color: 'from-cyan-400 to-blue-500',
      icon: Users,
      description: 'Para organizaciones de mayor complejidad o riesgo medio-alto. Incluye los 18 pasos básicos más 4 adicionales enfocados en estructura organizacional y gestión de terceros.',
      items: [
        'Líder del diseño e implementación del PESV: Designar un responsable.',
        'Política de Seguridad Vial: Formalizar el compromiso de la organización.',
        'Liderazgo y compromiso directivo: Involucramiento activo de la alta gerencia.',
        'Diagnóstico: Evaluar el estado actual de la seguridad vial.',
        'Caracterización, evaluación y control de riesgos: Identificar peligros en rutas y conductores.',
        'Objetivos y metas: Definir qué se quiere lograr en seguridad vial.',
        'Programas de gestión de riesgos críticos: Acciones para los riesgos más altos.',
        'Plan anual de trabajo: Cronograma de ejecución.',
        'Competencia y plan anual de formación: Capacitación obligatoria para conductores.',
        'Plan de preparación y respuesta ante emergencias: Protocolos de actuación.',
        'Vías seguras administradas: Gestión de infraestructura propia (parqueaderos, patios).',
        'Planificación de desplazamientos laborales: Control de rutas y tiempos.',
        'Inspección de vehículos y equipos: Revisión pre-operacional y técnica.',
        'Mantenimiento y control de vehículos: Garantizar la mecánica segura.',
        'Indicadores y reporte de autogestión: Medición de cumplimiento.',
        'Auditoría anual: Verificación interna del sistema.',
        'Mejora continua: Acciones correctivas y preventivas.',
        'Mecanismos de comunicación y participación: Canales de difusión y feedback.',
        '(Nuevo) Comité de seguridad vial: Creación formal del comité paritario o de apoyo.',
        '(Nuevo) Investigación interna de siniestros viales: Análisis de causa raíz de accidentes e incidentes.',
        '(Nuevo) Gestión del cambio y gestión de contratistas: Control de seguridad vial a terceros y proveedores.',
        '(Nuevo) Archivo y retención documental: Sistema organizado de evidencia documental.'
      ]
    },
    advanced: {
      title: 'Nivel Avanzado',
      badge: '🔴',
      steps: '24 Pasos',
      color: 'from-indigo-400 to-indigo-600',
      icon: TrendingUp,
      description: 'Para organizaciones de alto riesgo o gran tamaño. Incluye los 22 pasos estándar más 2 adicionales enfocados en cultura profunda y análisis de datos.',
      items: [
        'Líder del diseño e implementación del PESV: Designar un responsable.',
        'Política de Seguridad Vial: Formalizar el compromiso de la organización.',
        'Liderazgo y compromiso directivo: Involucramiento activo de la alta gerencia.',
        'Diagnóstico: Evaluar el estado actual de la seguridad vial.',
        'Caracterización, evaluación y control de riesgos: Identificar peligros en rutas y conductores.',
        'Objetivos y metas: Definir qué se quiere lograr en seguridad vial.',
        'Programas de gestión de riesgos críticos: Acciones para los riesgos más altos.',
        'Plan anual de trabajo: Cronograma de ejecución.',
        'Competencia y plan anual de formación: Capacitación obligatoria para conductores.',
        'Plan de preparación y respuesta ante emergencias: Protocolos de actuación.',
        'Vías seguras administradas: Gestión de infraestructura propia (parqueaderos, patios).',
        'Planificación de desplazamientos laborales: Control de rutas y tiempos.',
        'Inspección de vehículos y equipos: Revisión pre-operacional y técnica.',
        'Mantenimiento y control de vehículos: Garantizar la mecánica segura.',
        'Indicadores y reporte de autogestión: Medición de cumplimiento.',
        'Auditoría anual: Verificación interna del sistema.',
        'Mejora continua: Acciones correctivas y preventivas.',
        'Mecanismos de comunicación y participación: Canales de difusión y feedback.',
        'Comité de seguridad vial: Creación formal del comité paritario o de apoyo.',
        'Investigación interna de siniestros viales: Análisis de causa raíz de accidentes e incidentes.',
        'Gestión del cambio y gestión de contratistas: Control de seguridad vial a terceros y proveedores.',
        'Archivo y retención documental: Sistema organizado de evidencia documental.',
        '(Nuevo) Responsabilidad y comportamiento seguro: Programas avanzados de psicología del tránsito y cultura.',
        '(Nuevo) Registro y análisis estadístico de siniestros viales: Estudio profundo de tendencias y estadísticas históricas de accidentalidad.'
      ]
    }
  };

  const current = maturityData[selectedLevel];
  const IconComponent = current.icon;

  return (
    <div className="min-h-screen bg-white">
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Volver al inicio
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Niveles de Madurez PESV</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Selecciona un nivel para conocer todos los pasos y requisitos que debe cumplir tu organización.
          </p>
        </div>
      </section>

      {/* Level Selector */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['basic', 'standard', 'advanced'].map((level) => {
              const data = maturityData[level];
              const LevelIcon = data.icon;
              const isSelected = selectedLevel === level;
              return (
                <div
                  key={level}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-slate-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <button
                    onClick={() => setSelectedLevel(level)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`text-3xl`}>{data.badge}</div>
                      <LevelIcon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{data.title}</h3>
                    <p className={`text-sm font-semibold ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}>
                      {data.steps}
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      console.log('Botón clickeado, nivel:', level);
                      setModalLevel(level);
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    <Info className="w-4 h-4" />
                    Conocer más
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className={`bg-gradient-to-r ${current.color} p-4 rounded-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl">{current.badge}</div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{current.title}</h2>
            <p className="text-lg text-slate-600 mb-6">{current.description}</p>
            <div className={`inline-block px-6 py-2 bg-gradient-to-r ${current.color} text-white font-semibold rounded-full`}>
              {current.steps}
            </div>
          </div>

          {/* Steps List */}
          <div className="bg-slate-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Pasos a implementar:</h3>
            <div className="space-y-4">
              {current.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 mt-1" />
                  </div>
                  <div>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-semibold">Paso {index + 1}:</span> {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
            <h4 className="text-lg font-bold text-blue-900 mb-3">💡 Información importante</h4>
            <ul className="space-y-2 text-blue-800">
              {selectedLevel === 'basic' && (
                <>
                  <li>✓ Obligatorio para organizaciones con flotas entre 10 y 50 vehículos</li>
                  <li>✓ Se enfoca en la gestión fundamental de seguridad vial</li>
                  <li>✓ Incluye políticas, capacitación, inspección de vehículos y auditoría anual</li>
                </>
              )}
              {selectedLevel === 'standard' && (
                <>
                  <li>✓ Para organizaciones de mayor complejidad o riesgo medio-alto</li>
                  <li>✓ Agrega estructura organizacional y gestión de terceros</li>
                  <li>✓ Incluye comité de seguridad vial, investigación de siniestros y gestión de contratistas</li>
                  <li>✓ Suma 4 pasos nuevos a los 18 básicos (total 22)</li>
                </>
              )}
              {selectedLevel === 'advanced' && (
                <>
                  <li>✓ Para organizaciones de alto riesgo o gran tamaño</li>
                  <li>✓ Enfocado en cultura profunda y análisis estadístico de datos</li>
                  <li>✓ Incluye programas de psicología del tránsito y análisis estadístico avanzado</li>
                  <li>✓ Suma 2 pasos nuevos a los 22 estándar (total 24)</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Modal Moderno */}
      {modalLevel && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setModalLevel(null)}
        >
          <div
            className="bg-white rounded-2xl flex flex-col max-h-[90vh] w-full max-w-2xl shadow-2xl transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-slate-50 to-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {modalLevel === 'basic' && '🟢'}
                  {modalLevel === 'standard' && '🟡'}
                  {modalLevel === 'advanced' && '🔴'}
                </span>
                <h2 className="text-xl font-bold text-gray-900">
                  {modalLevel === 'basic' && 'Nivel Básico (18 Pasos)'}
                  {modalLevel === 'standard' && 'Nivel Estándar (22 Pasos)'}
                  {modalLevel === 'advanced' && 'Nivel Avanzado (24 Pasos)'}
                </h2>
              </div>
              <button
                onClick={() => setModalLevel(null)}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Descripción */}
                <p className="text-gray-700 leading-relaxed text-base">
                  {modalLevel === 'basic' && 'Este nivel es obligatorio para organizaciones con flotas entre 10 y 50 vehículos (o según clasificación de riesgo). Se enfoca en la gestión fundamental de la seguridad vial.'}
                  {modalLevel === 'standard' && 'Incluye todos los pasos del Nivel Básico más 4 pasos adicionales enfocados en estructura organizacional y gestión de terceros.'}
                  {modalLevel === 'advanced' && 'Incluye todos los pasos del Nivel Estándar más 2 pasos adicionales enfocados en cultura organizacional y análisis estadístico.'}
                </p>

                {/* Mensaje informativo para niveles superiores */}
                {(modalLevel === 'standard' || modalLevel === 'advanced') && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-800 text-sm font-medium">
                      {modalLevel === 'standard' && 'Este nivel incluye también los 18 pasos del Nivel Básico.'}
                      {modalLevel === 'advanced' && 'Este nivel incluye todos los requisitos de los niveles Básico y Estándar.'}
                    </p>
                  </div>
                )}

                {/* Pasos */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {modalLevel === 'basic' && 'Pasos a implementar:'}
                    {modalLevel === 'standard' && 'Pasos adicionales:'}
                    {modalLevel === 'advanced' && 'Pasos adicionales:'}
                  </h3>
                  <div className="space-y-3">
                    {modalLevel === 'basic' && (
                      <>
                        {maturityData.basic.items.map((item, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 text-sm leading-relaxed">
                              <span className="font-semibold text-gray-900">{index + 1}.</span> {item.split(':')[0]}
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                    {modalLevel === 'standard' && (
                      <>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">19.</span> Comité de Seguridad Vial
                          </p>
                        </div>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">20.</span> Investigación interna de siniestros viales
                          </p>
                        </div>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">21.</span> Gestión del cambio y gestión de contratistas
                          </p>
                        </div>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">22.</span> Archivo y retención documental
                          </p>
                        </div>
                      </>
                    )}
                    {modalLevel === 'advanced' && (
                      <>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">23.</span> Responsabilidad y comportamiento seguro
                          </p>
                        </div>
                        <div className="flex gap-3 items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm leading-relaxed">
                            <span className="font-semibold text-gray-900">24.</span> Registro y análisis estadístico de siniestros viales
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Información importante */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <span>Información importante</span>
                  </h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    {modalLevel === 'basic' && (
                      <>
                        <li>✓ Obligatorio para organizaciones con flotas entre 10 y 50 vehículos</li>
                        <li>✓ Se enfoca en la gestión fundamental de seguridad vial</li>
                        <li>✓ Incluye políticas, capacitación, inspección de vehículos y auditoría anual</li>
                      </>
                    )}
                    {modalLevel === 'standard' && (
                      <>
                        <li>✓ Para organizaciones de mayor complejidad o riesgo medio-alto</li>
                        <li>✓ Agrega estructura organizacional y gestión de terceros</li>
                        <li>✓ Incluye comité de seguridad vial, investigación de siniestros y gestión de contratistas</li>
                        <li>✓ Suma 4 pasos nuevos a los 18 básicos (total 22)</li>
                      </>
                    )}
                    {modalLevel === 'advanced' && (
                      <>
                        <li>✓ Para organizaciones de alto riesgo o gran tamaño</li>
                        <li>✓ Enfocado en cultura profunda y análisis estadístico de datos</li>
                        <li>✓ Incluye programas de psicología del tránsito y análisis estadístico avanzado</li>
                        <li>✓ Suma 2 pasos nuevos a los 22 estándar (total 24)</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setModalLevel(null)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
