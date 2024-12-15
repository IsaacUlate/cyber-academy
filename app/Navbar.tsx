"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-[#0B1F48] p-4 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Circular */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo-alco.png" // Asegúrate que esté en /public/images/logo-alco.png
              alt="Logo ALCO"
              className="w-12 h-12 rounded-full object-cover"
            />
            <Link href="/" className="text-white text-xl font-bold">
              Asociación ALCO
            </Link>
          </div>

          {/* Menú para escritorio */}
          <div className="hidden md:flex md:space-x-8">
            <Link href="/" className="text-white hover:text-[#F4A300] transition">
              Inicio
            </Link>
            <Link href="/noticias" className="text-white hover:text-[#F4A300] transition">
              Noticias
            </Link>
            <Link href="/calculadora-imc" className="text-white hover:text-[#F4A300] transition">
              Calculadora IMC
            </Link>
            <Link href="/eventos" className="text-white hover:text-[#F4A300] transition">
              Eventos
            </Link>
            <Link href="/profesionales" className="text-white hover:text-[#F4A300] transition">
              Profesionales
            </Link>
            <Link href="/recursos" className="text-white hover:text-[#F4A300] transition">
              Recursos
            </Link>
          </div>

          {/* Botón del menú para móviles */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-[#F4A300] focus:outline-none"
            >
              {isMenuOpen ? 'Cerrar' : 'Menú'}
            </button>
          </div>
        </div>
      </div>

      {/* Menú colapsable para móviles */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0B1F48]">
          <div className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/" className="text-white hover:text-[#F4A300] transition">
              Inicio
            </Link>
            <Link href="/noticias" className="text-white hover:text-[#F4A300] transition">
              Noticias
            </Link>
            <Link href="/calculadora-imc" className="text-white hover:text-[#F4A300] transition">
              Calculadora IMC
            </Link>
            <Link href="/eventos" className="text-white hover:text-[#F4A300] transition">
              Eventos
            </Link>
            <Link href="/profesionales" className="text-white hover:text-[#F4A300] transition">
              Profesionales
            </Link>
            <Link href="/recursos" className="text-white hover:text-[#F4A300] transition">
              Recursos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
