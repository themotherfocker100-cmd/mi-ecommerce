'use client';

import Link from 'next/link';
import { Product } from '@king/lib/types';
import { formatCurrency } from '@king/lib/utils';
import { useCart } from '@king/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative bg-gray-200 h-48 flex items-center justify-center">
        <div className="text-gray-400 text-4xl">🍷</div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-green-600">{formatCurrency(product.price)}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            product.stock > 10 ? 'bg-green-100 text-green-700' : 
            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Agregar al carrito
          </button>
          <Link href={`/shop/product/${product.id}`} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-center">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
