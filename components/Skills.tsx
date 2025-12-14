'use client';

import { motion } from 'motion/react';
import { skills } from '@/lib/portfolio-data';

export default function Skills() {
  return (
    <section className="py-24 px-6 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A diverse toolkit for building modern, scalable applications.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="group relative px-6 py-4 bg-neutral-800 rounded-lg border border-neutral-700 hover:border-primary/50 transition-all duration-300 text-center"
            >
              <span className="text-neutral-200 font-medium group-hover:text-primary transition-colors duration-300">
                {skill}
              </span>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
