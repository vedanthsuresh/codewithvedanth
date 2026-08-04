import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, LearningPaths, DifficultyLevels } from '../services/api';

const pathInfo = {
  [LearningPaths.PYTHON]: {
    name: 'Python',
    emoji: '🐍',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  [LearningPaths.WEB_DEVELOPMENT]: {
    name: 'Web Dev',
    emoji: '🌐',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200',
  },
  [LearningPaths.MOBILE_DEVELOPMENT]: {
    name: 'Mobile',
    emoji: '📱',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-700',
    borderColor: 'border-violet-200',
  },
};

const difficultyInfo = {
  beginner: { name: 'Beginner', emoji: '🌱', color: 'from-green-400 to-green-500' },
  intermediate: { name: 'Intermediate', emoji: '🌿', color: 'from-amber-400 to-amber-500' },
  advanced: { name: 'Advanced', emoji: '🌳', color: 'from-red-400 to-red-500' },
};

export default function ModulesList() {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    path_id: '',
    difficulty: ''
  });

  const loadModules = async () => {
    try {
      setLoading(true);
      const data = await api.getModules(filters);
      setModules(data);
      setFilteredModules(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    let filtered = modules;
    if (filters.path_id) {
      filtered = filtered.filter(l => l.path_id === filters.path_id);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(l => l.difficulty_level === filters.difficulty);
    }
    setFilteredModules(filtered);
  }, [filters, modules]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this module?')) return;
    try {
      await api.deleteModule(id);
      setModules(modules.filter(l => l.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading modules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Modules</h1>
          <p className="text-gray-500 mt-1">Manage your module content and settings</p>
        </div>
        <Link
          to="/modules/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Module
        </Link>
      </div>

      {/* Filters Card */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={() => setFilters({ path_id: '', difficulty: '' })}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Learning Path</label>
              <select
                value={filters.path_id}
                onChange={(e) => setFilters({ ...filters, path_id: e.target.value })}
                className="select-base"
              >
                <option value="">All Paths</option>
                {Object.entries(pathInfo).map(([key, info]) => (
                  <option key={key} value={key}>{info.emoji} {info.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="select-base"
              >
                <option value="">All Levels</option>
                {Object.entries(difficultyInfo).map(([key, info]) => (
                  <option key={key} value={key}>{info.emoji} {info.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Showing <span className="font-semibold text-gray-700">{filteredModules.length}</span> of <span className="font-semibold text-gray-700">{modules.length}</span> modules
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Modules Grid */}
      {filteredModules.length > 0 ? (
        <div className="grid gap-4">
          {filteredModules.map((module) => {
            const path = pathInfo[module.path_id] || pathInfo[LearningPaths.PYTHON];
            const difficulty = difficultyInfo[module.difficulty_level] || difficultyInfo.beginner;
            return (
              <div
                key={module.id}
                className="card group hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header with badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${path.bgColor} ${path.textColor} border ${path.borderColor}`}>
                          <span>{path.emoji}</span>
                          <span>{path.name}</span>
                        </div>
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${difficulty.color} text-white`}>
                          <span>{difficulty.emoji}</span>
                          <span>{difficulty.name}</span>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{module.title}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{module.description}</p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{module.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>${module.price_on_one} / ${module.price_group}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{module.objectives?.length || 0} objectives</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:ml-4">
                      <Link
                        to={`/modules/${module.id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(module.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 font-medium rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No modules found</h3>
            <p className="text-gray-500 mb-4">Create your first module to get started</p>
            <Link
              to="/modules/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Module
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
