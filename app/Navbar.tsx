"use client"; // Este componente es de cliente

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-100 md:bg-white p-4 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <Link href="/" className="text-gray-900 text-lg font-bold">
              Asociación ALCO
            </Link>
          </div>
          <div className="hidden md:flex md:space-x-8">
            <Link href="/" className="text-gray-900 hover:text-blue-600">Inicio</Link>
            <Link href="/calculadora-imc" className="text-gray-900 hover:text-blue-600">Calculadora IMC</Link>
            <Link href="/eventos" className="text-gray-900 hover:text-blue-600">Eventos</Link>
            <Link href="/profesionales" className="text-gray-900 hover:text-blue-600">Profesionales</Link>
            <Link href="/recursos" className="text-gray-900 hover:text-blue-600">Recursos</Link>
            <Link href="/noticias" className="text-gray-900 hover:text-blue-600">Noticias</Link>
          </div>
          {/* Botón del menú para móviles */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-900 hover:text-blue-600 focus:outline-none">
              {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </div>
      {/* Menú colapsable */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-100">
          <div className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/" className="text-gray-900 hover:text-blue-600">Inicio</Link>
            <Link href="/calculadora-imc" className="text-gray-900 hover:text-blue-600">Calculadora IMC</Link>
            <Link href="/eventos" className="text-gray-900 hover:text-blue-600">Eventos</Link>
            <Link href="/profesionales" className="text-gray-900 hover:text-blue-600">Profesionales</Link>
            <Link href="/recursos" className="text-gray-900 hover:text-blue-600">Recursos</Link>
            <Link href="/noticias" className="text-gray-900 hover:text-blue-600">Noticias</Link>
          </div>
        </div>
      )}
    </header>
  );
}
