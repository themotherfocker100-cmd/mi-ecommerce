'use client';

const stats = [
  { n: "500+", t: "Huéspedes Satisfechos" },
  { n: "4.9★", t: "Calificación" },
  { n: "15", t: "Años Experiencia" },
  { n: "24/7", t: "Soporte" }
];

export function Stats() {
  return (
    <section className="bg-zinc-900 py-20 border-y border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-6xl font-black text-yellow-500 mb-2">
                {stat.n}
              </div>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest">
                {stat.t}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
