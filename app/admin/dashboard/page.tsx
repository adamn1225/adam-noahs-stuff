'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Project } from '@/lib/portfolio-data';

const categories = ['AI', 'Brand Protection', 'SaaS', 'Video Analysis'] as const;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProjects();
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (editingProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [editingProject]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAI = async (action: string, field: string) => {
    if (!editingProject) return;
    
    setAiLoading(true);
    setAiError('');
    
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          context: {
            title: editingProject.title,
            description: editingProject.description,
            tags: editingProject.tags.join(', '),
          },
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        if (field === 'description') {
          setEditingProject({ ...editingProject, description: data.response });
        } else if (field === 'tags') {
          const tags = data.response.split(',').map((t: string) => t.trim());
          setEditingProject({ ...editingProject, tags });
        } else if (field === 'title') {
          // Show the first suggestion
          const titles = data.response.split('\n').filter((t: string) => t.trim());
          if (titles.length > 0) {
            setEditingProject({ ...editingProject, title: titles[0].trim() });
          }
        }
      } else {
        setAiError(data.error || 'AI request failed');
      }
    } catch (error) {
      console.error('AI error:', error);
      setAiError('Failed to connect to AI. Make sure Ollama is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (project: Project) => {
    try {
      const method = project.id.startsWith('project-') ? 'POST' : 'PUT';
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (res.ok) {
        await fetchProjects();
        setEditingProject(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const startCreating = () => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      image: '',
      tags: [],
      category: 'AI',
    };
    setEditingProject(newProject);
    setIsCreating(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-900 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-accent mb-2">Admin Dashboard</h1>
            <p className="text-neutral-400">Manage your portfolio projects</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="px-6 py-3 border-2 border-neutral-700 text-neutral-200 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-300"
            >
              View Portfolio
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-6 py-3 bg-neutral-800 text-neutral-200 rounded-lg font-semibold hover:bg-neutral-700 transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Add Project Button */}
        <motion.button
          onClick={startCreating}
          className="mb-8 px-6 py-3 bg-primary text-neutral-900 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Add New Project
        </motion.button>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              layout
              className="bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700"
            >
              <div className="relative h-48 bg-neutral-900">
                {project.image && (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-accent mb-2">{project.title}</h3>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="flex-1 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Edit/Create Modal */}
        <AnimatePresence>
          {editingProject && (
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
                className="bg-neutral-800 rounded-2xl border border-neutral-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-accent mb-6">
                  {isCreating ? 'Create New Project' : 'Edit Project'}
                </h2>

                <div className="space-y-4">
                  {aiError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
                    >
                      {aiError}
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">Title</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary"
                        placeholder="Project title"
                      />
                      <button
                        onClick={() => handleAI('improve_title', 'title')}
                        disabled={aiLoading || !editingProject.description}
                        className="px-4 py-3 bg-secondary/20 border border-secondary/30 text-secondary rounded-lg hover:bg-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="AI improve title"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">Description</label>
                    <textarea
                      value={editingProject.description}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary resize-none"
                      placeholder="Project description"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleAI('generate_description', 'description')}
                        disabled={aiLoading || !editingProject.title}
                        className="flex-1 px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {aiLoading ? '✨ Generating...' : '✨ AI Generate'}
                      </button>
                      <button
                        onClick={() => handleAI('enhance_description', 'description')}
                        disabled={aiLoading || !editingProject.description}
                        className="flex-1 px-4 py-2 bg-secondary/20 border border-secondary/30 text-secondary rounded-lg hover:bg-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {aiLoading ? '✨ Enhancing...' : '✨ AI Enhance'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">
                      Tags (comma-separated)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingProject.tags.join(', ')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            tags: e.target.value.split(',').map((t) => t.trim()),
                          })
                        }
                        className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary"
                        placeholder="React, TypeScript, Next.js"
                      />
                      <button
                        onClick={() => handleAI('suggest_tags', 'tags')}
                        disabled={aiLoading || (!editingProject.title && !editingProject.description)}
                        className="px-4 py-3 bg-secondary/20 border border-secondary/30 text-secondary rounded-lg hover:bg-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="AI suggest tags"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-2 font-medium">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const path = await handleImageUpload(file);
                          if (path) {
                            setEditingProject({ ...editingProject, image: path });
                          }
                        }
                      }}
                      className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-400 focus:outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-neutral-900 file:font-semibold hover:file:bg-primary/90"
                    />
                    {uploading && <p className="text-primary text-sm mt-2">Uploading...</p>}
                    {editingProject.image && (
                      <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={editingProject.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 mb-2 font-medium">
                        Live Link (optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.link || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, link: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-2 font-medium">
                        GitHub (optional)
                      </label>
                      <input
                        type="url"
                        value={editingProject.github || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, github: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-lg text-accent focus:outline-none focus:border-primary"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => handleSave(editingProject)}
                    className="flex-1 px-6 py-3 bg-primary text-neutral-900 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                  >
                    Save Project
                  </button>
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setIsCreating(false);
                    }}
                    className="flex-1 px-6 py-3 bg-neutral-700 text-neutral-200 rounded-lg font-semibold hover:bg-neutral-600 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
