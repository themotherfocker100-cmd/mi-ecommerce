"use client";

import { motion } from "framer-motion";
import { FeatureCard } from "../FeatureCard";
import { features } from "../data/features";

export default function Features() {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="container mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
            ¿Por qué elegirnos?
          </h2>
          <div className="h-1.5 w-24 bg-yellow-500 mx-auto" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="relative group">
              {feature.special && (
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-t from-orange-700 via-red-600 to-yellow-500 rounded-[2.5rem] blur-2xl opacity-30 -z-10"
                  animate={{
                    scale: [1, 1.05, 0.98, 1.03, 1],
                    opacity: [0.2, 0.4, 0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              )}

              <FeatureCard
                title={feature.title}
                desc={feature.desc}
                Icon={feature.Icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
