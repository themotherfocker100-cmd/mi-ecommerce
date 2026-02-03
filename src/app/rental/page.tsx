'use client';

import { useState, useEffect } from 'react';
import ReservationCard from '@king/components/rental/ReservationCard';
import { Reservation } from '@king/lib/types';
import { formatCurrency, calculateRentalPrice } from '@king/lib/utils';

export default function RentalPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '15:00',
    numberOfGuests: 1,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate) {
      const price = calculateRentalPrice(formData.checkInDate, formData.checkOutDate);
      setCalculatedPrice(price);
    }
  }, [formData.checkInDate, formData.checkOutDate]);

  async function fetchReservations() {
    try {
      const res = await fetch('/api/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');

    if (!formData.guestName || !formData.guestEmail || !formData.guestPhone || !formData.checkInDate || !formData.checkOutDate) {
      setMessage('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('¡Reserva creada exitosamente! Nos pondremos en contacto pronto.');
        setFormData({
          checkInDate: '',
          checkOutDate: '',
          checkInTime: '15:00',
          numberOfGuests: 1,
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          specialRequests: '',
        });
        fetchReservations();
        setShowForm(false);
      } else {
        setMessage('Error al crear la reserva');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al procesar la reserva');
    }
  }

  async function handleCancelReservation(id: string) {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        setMessage('Reserva cancelada exitosamente');
        fetchReservations();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="container mx-auto">
        {/* Hero */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-lg p-12 mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Alquila la Casa de Campo Los Palomos</h1>
          <p className="text-lg max-w-2xl mx-auto">Vive una experiencia única con tu familia. Piscina, horno, parrilla y mucho más te esperan.</p>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {['🏡', '🏊', '🔥', '🍷', '🌳', '👨‍🍳'].map((icon, i) => (
            <div key={i} className="bg-white rounded-lg h-48 flex items-center justify-center text-7xl shadow-md">
              {icon}
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-8 mb-12 shadow-md">
          <h2 className="text-2xl font-bold mb-6">Lo que incluye tu alquiler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Casa de 2 pisos completamente amueblada</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Múltiples cuartos cómodos y bien decorados</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Piscina recreativa con áreas de descanso</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Horno de leña y parrilla de asado</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Cocina mejorada con equipamiento completo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Zona bar con vistas al jardín</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Amplia área verde para actividades</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span>Parqueadero y seguridad 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition mb-6"
            >
              {showForm ? 'Ocultar Formulario' : 'Crear Nueva Reserva'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-2xl font-bold mb-6">Formulario de Reserva</h3>

                {message && (
                  <div className={`p-4 rounded-lg mb-6 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold mb-2">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="w-full border rounded-lg p-2"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      className="w-full border rounded-lg p-2"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      required
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                      className="w-full border rounded-lg p-2"
                      placeholder="+57 (1) 555-0123"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Fecha de Entrada *</label>
                    <input
                      type="date"
                      required
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Hora de Entrada *</label>
                    <input
                      type="time"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Fecha de Salida *</label>
                    <input
                      type="date"
                      required
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Número de Huéspedes *</label>
                    <select
                      value={formData.numberOfGuests}
                      onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) })}
                      className="w-full border rounded-lg p-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Peticiones Especiales</label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                      className="w-full border rounded-lg p-2"
                      placeholder="Cuéntanos si tienes necesidades especiales"
                      rows={3}
                    />
                  </div>

                  {calculatedPrice > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-gray-600 text-sm mb-2">Precio total estimado:</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(calculatedPrice)}</p>
                      <p className="text-gray-500 text-xs mt-2">* Descuentos disponibles para alquileres prolongados</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-green-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition mt-6"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Reservations List */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Mis Reservas</h3>
            {reservations.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-600">
                <p>No hay reservas aún.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onCancel={handleCancelReservation}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
