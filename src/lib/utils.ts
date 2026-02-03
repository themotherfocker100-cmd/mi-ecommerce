import fs from 'fs';
import path from 'path';
import { Reservation, Product, Order } from './types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'data', 'db.json');

export function readDatabase() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { reservations: [], orders: [], users: {}, products: { wines: [], general: [] } };
  }
}

export function writeDatabase(data: any) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

export function generateId(): string {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export function calculateRentalPrice(checkInDate: string, checkOutDate: string, basePrice: number = 150000): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days <= 0) return 0;
  
  // Precio base por día
  let totalPrice = days * basePrice;
  
  // Descuento por más de 7 días
  if (days > 7) {
    totalPrice *= 0.9;
  }
  // Descuento por más de 30 días
  if (days > 30) {
    totalPrice *= 0.85;
  }
  
  return Math.round(totalPrice);
}

export function validateReservationDates(checkInDate: string, checkOutDate: string): boolean {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return checkIn >= today && checkOut > checkIn;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}
