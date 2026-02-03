'use client';

import Header from "./../components/sections/Header";
import Hero from "./../components/sections/Hero";
import Features from "./../components/sections/Features";
import Stats from "./../components/sections/Stats";
import Reviews from "./../components/sections/Reviews";
import CTA from "./../components/sections/CTA";

export default function Home() {
  return (
    <div className="bg-zinc-950 text-white selection:bg-yellow-500/30">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Reviews />
      <CTA />
    </div>
  );
}
