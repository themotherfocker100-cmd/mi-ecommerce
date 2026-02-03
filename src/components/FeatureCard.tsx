import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  desc: string;
  Icon: LucideIcon;
}

export const FeatureCard = ({ title, desc, Icon }: Props) => (
  // Cambio a fondo oscuro (zinc-900), borde sutil y efectos hover brillantes
  <div className="group p-8 bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-800/80 transition-all duration-500">
    <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-zinc-900 transition-all duration-300 shadow-lg shadow-yellow-500/10" aria-hidden="true" role="img">
      <Icon size={26} aria-hidden="true" focusable={false} />
    </div>
    {/* Uso de la nueva fuente para títulos */}
    <h3 className="text-2xl font-heading font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-zinc-400 leading-relaxed font-light">{desc}</p>
  </div>
);