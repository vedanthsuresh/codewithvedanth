import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, LearningPaths, DifficultyLevels, AgeRanges } from '../services/api';

export default function LessonsList() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    path_id: '',
    age_range: '',
    difficulty: ''
  });

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await api.getLessons(filters);
      setLessons(data);
      setFilteredLessons(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  useEffect(() => {
    // Apply filters client-side
    let filtered = lessons;
    if (filters.path_id) {
      filtered = filtered.filter(l => l.path_id === filters.path_id);
    }
    if (filters.age_range) {
      filtered = filtered.filter(l => l.age_range === filters.age_range);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(l => l.difficulty_level === filters.difficulty);
    }
    setFilteredLessons(filtered);
  }, [filters, lessons]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      await api.deleteLesson(id);
      setLessons(lessons.filter(l => l.id !== id));
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const getPathColor = (pathId) => {
    const colors = {
      [LearningPaths.PYTHON]: 'bg-blue-100 text-blue-800 border-blue-200',
      [LearningPaths.WEB_DEVELOPMENT]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      [LearningPaths.MOBILE_DEVELOPMENT]: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[pathId] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (level) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lessons Management</h1>
        <Link
          to="/lessons/new"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          + New Lesson
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Learning Path</label>
            <select
              value={filters.path_id}
              onChange={(e) => setFilters({ ...filters, path_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Paths</option>
              <option value={LearningPaths.PYTHON}>Python</option>
              <option value={LearningPaths.WEB_DEVELOPMENT}>Web Development</option>
              <option value={LearningPaths.MOBILE_DEVELOPMENT}>Mobile Development</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
            <select
              value={filters.age_range}
              onChange={(e) => setFilters({ ...filters, age_range: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Ages</option>
              {AgeRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              {DifficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Showing {filteredLessons.length} of {lessons.length} lessons</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Lessons List */}
      <div className="grid gap-4">
        {filteredLessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPathColor(lesson.path_id)}`}>
                    {lesson.path_id.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty_level)}`}>
                    {lesson.difficulty_level}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {lesson.age_range}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{lesson.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                  <span>⏱ {lesson.duration_minutes} min</span>
                  <span>💰 ${lesson.price_on_one} / ${lesson.price_group}</span>
                  <span>📚 {lesson.objectives?.length || 0} objectives</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link
                  to={`/lessons/${lesson.id}/edit`}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredLessons.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No lessons found</p>
            <p className="text-sm mt-1">Create your first lesson to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
