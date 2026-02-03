'use client';

import Link from 'next/link';
import { useCart } from '@king/context/CartContext';
import { Product } from '@king/lib/types';
import { useState } from 'react';

interface HeaderProps {
  allProducts?: Product[];
}

export default function Header({ allProducts = [] }: HeaderProps) {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-green-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center font-bold">
              LP
            </div>
            <span className="font-bold text-xl">Los Palomos</span>
          </Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <span className="sr-only">{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
            <div className="w-6 h-1 bg-white"></div>
            <div className="w-6 h-1 bg-white"></div>
            <div className="w-6 h-1 bg-white"></div>
          </button>

          <nav id="primary-navigation" aria-label="Navegación principal" className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static left-0 right-0 top-16 md:top-auto bg-green-900 md:bg-transparent p-4 md:p-0 z-50`}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Link href="/rental" className="hover:text-yellow-300 transition">
                Casa de Campo
              </Link>
              <Link href="/shop?category=wines" className="hover:text-yellow-300 transition">
                Vinos
              </Link>
              <Link href="/shop" className="hover:text-yellow-300 transition">
                Tienda
              </Link>
              <Link href="/shop/cart" className="relative hover:text-yellow-300 transition flex items-center gap-2" aria-label={`Carrito con ${cartItemsCount} artículos`}>
                <span aria-hidden="true">🛒</span>
                <span>Carrito</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold" aria-live="polite">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
