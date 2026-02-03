"use client";

import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-4 bg-yellow-500 text-black text-center">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
          ¿Listo para disfrutar?
        </h2>

        <p className="text-xl mb-10 font-medium">
          Realiza tu reserva hoy y disfruta de un fin de semana inolvidable
          en Los Palomos.
        </p>

        <Link
          href="/rental"
          className="inline-block bg-black text-white font-black py-5 px-12 rounded-full text-xl hover:scale-105 transition-transform"
        >
          RESERVAR AHORA
        </Link>
      </div>
    </section>
  );
}
