'use client';

import { Star } from 'lucide-react';

const reviews = [
  { n: "María García", t: "Experiencia increíble. El lugar es precioso y muy bien mantenido." },
  { n: "Carlos López", t: "Perfecto para pasar un fin de semana en familia. Todo limpio." },
  { n: "Ana Rodríguez", t: "Los vinos son excelentes y la casa tiene todo. Volveremos." }
];

export function Reviews() {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="container mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-tighter">
          Lo que dicen los huéspedes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
              <div className="flex text-yellow-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-zinc-300 italic mb-6">
                "{review.t}"
              </p>

              <p className="font-bold text-white text-lg">
                — {review.n}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
