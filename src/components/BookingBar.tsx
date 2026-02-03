import Link from "next/link";
import { Calendar, Users, ArrowRight } from "lucide-react";

export default function BookingBar() {
  return (
    <div className="max-w-4xl mx-auto bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 p-2">

      <Item icon={<Calendar />} label="Estancia" value="Seleccionar fechas" />
      <Item icon={<Users />} label="Invitados" value="¿Cuántas personas?" />

      <Link
        href="/rental"
        className="bg-yellow-500 hover:bg-white text-black font-black px-10 py-4 rounded-xl md:rounded-full flex items-center justify-center gap-2"
      >
        RESERVAR <ArrowRight size={18} />
      </Link>
    </div>
  );
}

function Item({ icon, label, value }: any) {
  return (
    <div className="flex-1 flex items-center gap-4 px-6 py-3 border-r border-white/5">
      <div className="text-yellow-500">{icon}</div>
      <div className="text-left">
        <p className="text-[10px] uppercase font-bold text-zinc-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
