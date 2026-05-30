import React from 'react';
import { Shield, Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">PESV Digital</p>
                <p className="text-xs text-blue-300 font-semibold">Resolución 40595</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma integral para la implementación y gestión de Planes Estratégicos de Seguridad Vial conforme a la normativa colombiana.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Navegación</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Inicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Características</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Documentación</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Contacto</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Términos de Servicio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">Cookies</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">PESV Normativa</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:info@pesvdigital.com" className="text-gray-400 hover:text-blue-400 transition-colors font-medium break-all">
                  info@pesvdigital.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <a href="tel:+573005551234" className="text-gray-400 hover:text-blue-400 transition-colors font-medium">
                  +57 (300) 555-1234
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 font-medium">Medellín, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-12"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} PESV Digital. Todos los derechos reservados. | Resolución 40595 de 2022 - Ministerio de Transporte de Colombia
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors group">
              <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors group">
              <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors group">
              <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
