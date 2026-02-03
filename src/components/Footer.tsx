import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16" role="contentinfo" aria-label="Pie de página">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Los Palomos</h3>
            <p className="text-gray-400">
              Tu destino ideal para disfrutar de la naturaleza, relax y buena compañía.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Contacto</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="tel:+5715550123" className="text-gray-400 hover:text-yellow-400"><span aria-hidden="true">📞</span> +57 (1) 555-0123</a></li>
              <li><a href="mailto:info@lospalomos.com" className="text-gray-400 hover:text-yellow-400"><span aria-hidden="true">✉️</span> info@lospalomos.com</a></li>
              <li><span aria-hidden="true">📍</span> Cundinamarca, Colombia</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Horario</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Lunes - Viernes: 8:00 - 18:00</li>
              <li>Sábado - Domingo: 9:00 - 20:00</li>
              <li>Atención 24/7 para huéspedes</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <p className="text-gray-500">&copy; 2024 Los Palomos. Todos los derechos reservados.</p>
            <Link 
              href="/admin" 
              className="text-gray-500 hover:text-yellow-400 transition text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 
