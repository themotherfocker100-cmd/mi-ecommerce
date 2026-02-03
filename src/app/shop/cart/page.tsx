'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@king/context/CartContext';
import { Product } from '@king/lib/types';
import { formatCurrency } from '@king/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xl text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice(products);

  return (
    <div className="bg-gray-50 py-16 px-4 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-12">Mi Carrito</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
            <Link
              href="/shop"
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition inline-block"
            >
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 p-6 border-b hover:bg-gray-50 transition"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                        🍷
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <p className="text-green-600 font-semibold mt-1">{formatCurrency(product.price)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity - 1)}
                          className="bg-gray-200 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-12 text-center border rounded p-1"
                        />
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity + 1)}
                          className="bg-gray-200 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-24">
                        <p className="font-bold text-lg">{formatCurrency(product.price * item.quantity)}</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-red-500 hover:text-red-700 font-bold ml-4"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Resumen</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos (19%):</span>
                    <span>{formatCurrency(totalPrice * 0.19)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envío:</span>
                    <span className="text-green-600 font-semibold">Gratis</span>
                  </div>
                </div>

                <div className="text-2xl font-bold mb-6">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="text-green-600">{formatCurrency(totalPrice * 1.19)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition text-center block mb-3"
                >
                  Proceder al Pago
                </Link>

                <button
                  onClick={() => clearCart()}
                  className="w-full border-2 border-red-500 text-red-500 font-bold py-2 rounded-lg hover:bg-red-50 transition"
                >
                  Vaciar Carrito
                </button>

                <Link
                  href="/shop"
                  className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-center block mt-3"
                >
                  Seguir Comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
