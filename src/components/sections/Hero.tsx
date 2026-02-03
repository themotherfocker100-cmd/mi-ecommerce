'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Reveal } from "../Reveal";
import { ArrowRight, Calendar, Users } from "lucide-react";
import BookingBar from "../BookingBar";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/70 z-10" />
        <motion.div
          className="w-full h-full bg-[url('/hero-los-palomos.jpg')] bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-20 container mx-auto px-4 pt-24 text-center">
        <Reveal>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6">
            Bienvenido a <br />
            <span className="bg-gradient-to-r from-yellow-200 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Los Palomos
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-12">
            Naturaleza, relajación y momentos inolvidables con familia y amigos.
          </p>

          <BookingBar />
        </Reveal>
      </div>
    </section>
  );
}
