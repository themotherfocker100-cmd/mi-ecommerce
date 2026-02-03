import { Reservation } from '@king/lib/types';
import { formatCurrency, formatDate } from '@king/lib/utils';

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
}

export default function ReservationCard({ reservation, onCancel }: ReservationCardProps) {
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };

  const statusLabel = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    completed: 'Completada',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{reservation.guestName}</h3>
          <p className="text-gray-600 text-sm">{reservation.guestEmail}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[reservation.status]}`}>
          {statusLabel[reservation.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Entrada</p>
          <p className="font-semibold">{formatDate(reservation.checkInDate)} {reservation.checkInTime}</p>
        </div>
        <div>
          <p className="text-gray-600">Salida</p>
          <p className="font-semibold">{formatDate(reservation.checkOutDate)}</p>
        </div>
        <div>
          <p className="text-gray-600">Huéspedes</p>
          <p className="font-semibold">{reservation.numberOfGuests} personas</p>
        </div>
        <div>
          <p className="text-gray-600">Total</p>
          <p className="font-semibold text-green-600">{formatCurrency(reservation.totalPrice)}</p>
        </div>
      </div>

      {reservation.specialRequests && (
        <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
          <p className="text-gray-600">Peticiones especiales:</p>
          <p>{reservation.specialRequests}</p>
        </div>
      )}

      <div className="flex gap-2">
        {reservation.status === 'pending' && onCancel && (
          <button
            onClick={() => onCancel(reservation.id)}
            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cancelar reserva
          </button>
        )}
      </div>
    </div>
  );
}
