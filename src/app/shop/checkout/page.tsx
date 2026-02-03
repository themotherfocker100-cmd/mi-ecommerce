'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@king/context/CartContext';
import { Product } from '@king/lib/types';
import { formatCurrency } from '@king/lib/utils';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    paymentMethod: 'card',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [cart]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress) {
      setMessage('Por favor completa todos los campos requeridos');
      return;
    }

    if (cart.length === 0) {
      setMessage('Tu carrito está vacío');
      return;
    }

    try {
      const totalPrice = getTotalPrice(products);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          totalPrice: totalPrice * 1.19, // Incluir impuestos
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderPlaced(true);
        clearCart();
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          shippingAddress: '',
          paymentMethod: 'card',
        });
      } else {
        setMessage('Error al procesar la orden');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al procesar la orden');
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <p className="text-xl text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 py-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-6">✓</div>
            <h1 className="text-3xl font-bold mb-4 text-green-600">¡Compra Exitosa!</h1>
            <p className="text-gray-600 mb-8">
              Gracias por tu compra. Hemos enviado un correo de confirmación a tu email con los detalles de tu pedido.
            </p>
            <Link
              href="/shop"
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition inline-block"
            >
              Volver a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 py-16 px-4 min-h-screen">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
            <Link
              href="/shop"
              className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition inline-block"
            >
              Ir a la Tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice(products);
  const totalWithTax = totalPrice * 1.19;

  return (
    <div className="bg-gray-50 py-16 px-4 min-h-screen">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-12">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Información de Envío</h2>

            {message && (
              <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block font-semibold mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  placeholder="+57 (1) 555-0123"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Dirección de Envío *</label>
                <textarea
                  required
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  className="w-full border rounded-lg p-3"
                  placeholder="Calle, número, apartamento, ciudad, código postal"
                  rows={3}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Método de Pago *</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full border rounded-lg p-3"
                >
                  <option value="card">💳 Tarjeta de Crédito/Débito</option>
                  <option value="transfer">🏦 Transferencia Bancaria</option>
                  <option value="cash">💵 Efectivo Contraentrega</option>
                </select>
              </div>
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Los datos de pago serán procesados de forma segura. Para esta demostración, use cualquier tarjeta válida.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
            >
              Confirmar Compra
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-8 sticky top-4 h-fit">
            <h2 className="text-2xl font-bold mb-6">Resumen de Orden</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(product.price * item.quantity)}</p>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b">
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

            <div className="text-2xl font-bold">
              <div className="flex justify-between mb-6">
                <span>Total a Pagar:</span>
                <span className="text-green-600">{formatCurrency(totalWithTax)}</span>
              </div>
            </div>

            <Link
              href="/shop/cart"
              className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition text-center block"
            >
              Volver al Carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
