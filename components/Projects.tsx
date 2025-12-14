'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { categories, type Project } from '@/lib/portfolio-data';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xl">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            A selection of work showcasing my expertise in full-stack development,
            AI integration, and modern web technologies.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-neutral-900 shadow-lg shadow-primary/30'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-neutral-800 rounded-xl overflow-hidden cursor-pointer border border-neutral-700 hover:border-primary/50 transition-all duration-300"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative h-64 w-full overflow-hidden bg-neutral-900">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-neutral-900 text-xs font-semibold rounded-full">
                    {project.category}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-accent mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded-md">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-4xl w-full bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 max-h-[90vh] overflow-y-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-neutral-900/90 backdrop-blur-sm rounded-full flex items-center justify-center text-accent hover:bg-primary hover:text-neutral-900 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Modal Image */}
                <div className="relative h-96 w-full bg-neutral-900">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 to-transparent" />
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-3xl font-bold text-accent mb-2">
                        {selectedProject.title}
                      </h3>
                      <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/30 text-primary text-sm font-medium rounded-full">
                        {selectedProject.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-neutral-300 text-lg mb-6 leading-relaxed">
                    {selectedProject.description}
                  </p>

                  {/* All Tags */}
                  <div className="mb-6">
                    <h4 className="text-neutral-400 text-sm font-semibold mb-3 uppercase tracking-wider">
                      Technologies Used
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-neutral-700 text-neutral-200 text-sm rounded-lg font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {(selectedProject.link || selectedProject.github) && (
                    <div className="flex gap-4">
                      {selectedProject.link && (
                        <a
                          href={selectedProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-primary text-neutral-900 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
                        >
                          View Live Project
                        </a>
                      )}
                      {selectedProject.github && (
                        <a
                          href={selectedProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300"
                        >
                          View Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
