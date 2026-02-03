'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'admin@lospalomos.com',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
            LP
          </div>
          <h1 className="text-3xl font-bold">Admin Los Palomos</h1>
          <p className="text-gray-600 mt-2">Panel de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border rounded-lg p-3"
              placeholder="admin@lospalomos.com"
              disabled
            />
            <p className="text-gray-500 text-sm mt-1">Demo: admin@lospalomos.com</p>
          </div>

          <div>
            <label className="block font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border rounded-lg p-3"
              placeholder="Contraseña"
              required
            />
            <p className="text-gray-500 text-sm mt-1">Demo: admin123</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p className="mb-4">Datos de demo:</p>
          <ul className="text-sm space-y-1">
            <li><strong>Email:</strong> admin@lospalomos.com</li>
            <li><strong>Contraseña:</strong> admin123</li>
          </ul>
        </div>

        <Link
          href="/"
          className="block text-center mt-6 text-green-600 hover:text-green-700 font-semibold"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
