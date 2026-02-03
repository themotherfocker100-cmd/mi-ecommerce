'use client';
import { motion, useReducedMotion } from 'framer-motion';

export const Reveal = ({ children }: { children: React.ReactNode }) => {
  const shouldReduceMotion = useReducedMotion();

  // Respect user's preference for reduced motion
  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};