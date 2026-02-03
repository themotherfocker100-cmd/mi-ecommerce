'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Reservation, Order } from '@king/lib/types';
import { formatCurrency, formatDate } from '@king/lib/utils';

type TabType = 'reservations' | 'orders' | 'analytics';

export default function AdminDashboard() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('reservations');
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [resRes, ordRes] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/orders'),
      ]);

      const reservations = await resRes.json();
      const orders = await ordRes.json();

      setReservations(reservations);
      setOrders(orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateReservationStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
        setSelectedReservation(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateOrderStatus(id: string, status: string) {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchData();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700',
  };

  const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    processing: 'Procesando',
    shipped: 'Enviada',
    delivered: 'Entregada',
    cancelled: 'Cancelada',
    completed: 'Completada',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingReservations = reservations.filter((r) => r.status === 'pending').length;
  const confirmedReservations = reservations.filter((r) => r.status === 'confirmed').length;
  const totalGuests = reservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((sum, r) => sum + r.numberOfGuests, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Los Palomos - Admin</h1>
            <p className="text-green-200 text-sm">Panel de Administración</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Reservas Pendientes</p>
            <p className="text-4xl font-bold text-yellow-600">{pendingReservations}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Reservas Confirmadas</p>
            <p className="text-4xl font-bold text-green-600">{confirmedReservations}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Huéspedes Totales</p>
            <p className="text-4xl font-bold text-blue-600">{totalGuests}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm">Ingresos (Órdenes Completadas)</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'reservations'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-green-600'
            }`}
          >
            Reservas ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-green-600'
            }`}
          >
            Órdenes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'analytics'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-green-600'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'reservations' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {reservations.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">
                    <p>No hay reservas aún</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Huésped</th>
                          <th className="px-6 py-3 text-left font-semibold">Entrada</th>
                          <th className="px-6 py-3 text-left font-semibold">Salida</th>
                          <th className="px-6 py-3 text-left font-semibold">Total</th>
                          <th className="px-6 py-3 text-left font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => (
                          <tr
                            key={reservation.id}
                            onClick={() => setSelectedReservation(reservation)}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold">{reservation.guestName}</p>
                              <p className="text-sm text-gray-600">{reservation.guestEmail}</p>
                            </td>
                            <td className="px-6 py-4">{formatDate(reservation.checkInDate)}</td>
                            <td className="px-6 py-4">{formatDate(reservation.checkOutDate)}</td>
                            <td className="px-6 py-4 font-semibold">{formatCurrency(reservation.totalPrice)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[reservation.status]}`}>
                                {statusLabel[reservation.status]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {selectedReservation && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 h-fit">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Detalles</h3>
                  <button onClick={() => setSelectedReservation(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Huésped</p>
                    <p className="font-semibold">{selectedReservation.guestName}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{selectedReservation.guestEmail}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Teléfono</p>
                    <p className="font-semibold">{selectedReservation.guestPhone}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Entrada</p>
                    <p className="font-semibold">{formatDate(selectedReservation.checkInDate)} a las {selectedReservation.checkInTime}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Salida</p>
                    <p className="font-semibold">{formatDate(selectedReservation.checkOutDate)}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Huéspedes</p>
                    <p className="font-semibold">{selectedReservation.numberOfGuests}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="font-semibold text-green-600">{formatCurrency(selectedReservation.totalPrice)}</p>
                  </div>

                  {selectedReservation.specialRequests && (
                    <div>
                      <p className="text-gray-600 text-sm">Peticiones Especiales</p>
                      <p className="font-semibold">{selectedReservation.specialRequests}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}
                    disabled={selectedReservation.status === 'confirmed'}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    Confirmar Reserva
                  </button>
                  <button
                    onClick={() => updateReservationStatus(selectedReservation.id, 'cancelled')}
                    disabled={selectedReservation.status === 'cancelled'}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition"
                  >
                    Cancelar Reserva
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">
                    <p>No hay órdenes aún</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                          <th className="px-6 py-3 text-left font-semibold">Artículos</th>
                          <th className="px-6 py-3 text-left font-semibold">Total</th>
                          <th className="px-6 py-3 text-left font-semibold">Estado</th>
                          <th className="px-6 py-3 text-left font-semibold">Pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold">{order.customerName}</p>
                              <p className="text-sm text-gray-600">{order.customerEmail}</p>
                            </td>
                            <td className="px-6 py-4">{order.items.length} artículo(s)</td>
                            <td className="px-6 py-4 font-semibold">{formatCurrency(order.totalPrice)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[order.status]}`}>
                                {statusLabel[order.status]}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[order.paymentStatus]}`}>
                                {statusLabel[order.paymentStatus]}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {selectedOrder && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 h-fit">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">Detalles</h3>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700">
                    ✕
                  </button>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-gray-600 text-sm">Cliente</p>
                    <p className="font-semibold">{selectedOrder.customerName}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold">{selectedOrder.customerEmail}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Teléfono</p>
                    <p className="font-semibold">{selectedOrder.customerPhone}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Dirección</p>
                    <p className="font-semibold text-sm">{selectedOrder.shippingAddress}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Total</p>
                    <p className="font-semibold text-green-600 text-lg">{formatCurrency(selectedOrder.totalPrice)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status !== 'pending'}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
                  >
                    Procesando
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition text-sm"
                  >
                    Enviar
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition text-sm"
                  >
                    Entregada
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Resumen de Reservas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Reservas</span>
                  <span className="text-2xl font-bold text-green-600">{reservations.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pendientes</span>
                  <span className="text-2xl font-bold text-yellow-600">{pendingReservations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Confirmadas</span>
                  <span className="text-2xl font-bold text-green-600">{confirmedReservations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Canceladas</span>
                  <span className="text-2xl font-bold text-red-600">
                    {reservations.filter((r) => r.status === 'cancelled').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span>Huéspedes Totales</span>
                  <span className="text-2xl font-bold text-blue-600">{totalGuests}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-6">Resumen de Órdenes</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total de Órdenes</span>
                  <span className="text-2xl font-bold text-green-600">{orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pendientes</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {orders.filter((o) => o.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Enviadas</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {orders.filter((o) => o.status === 'shipped').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Entregadas</span>
                  <span className="text-2xl font-bold text-green-600">
                    {orders.filter((o) => o.status === 'delivered').length}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span>Ingresos Totales</span>
                  <span className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center py-8">
        <Link href="/" className="text-green-600 hover:text-green-700 font-semibold">
          ← Volver al sitio público
        </Link>
      </div>
    </div>
  );
}
