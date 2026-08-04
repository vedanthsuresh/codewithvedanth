import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, LearningPaths, DifficultyLevels, AgeRanges } from '../services/api';

export default function LessonForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    path_id: LearningPaths.PYTHON,
    title: '',
    description: '',
    age_range: '6-9',
    duration_minutes: 45,
    price_on_one: 10,
    price_group: 8,
    difficulty_level: 'beginner',
    objectives: [''],
    prerequisites: []
  });

  useEffect(() => {
    if (isEditing) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      const data = await api.getLesson(id);
      setFormData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Clean empty objectives
    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter(o => o.trim()),
      prerequisites: formData.prerequisites.filter(p => p.trim())
    };

    try {
      if (isEditing) {
        await api.updateLesson(id, cleanedData);
      } else {
        await api.createLesson(cleanedData);
      }
      navigate('/lessons');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const addObjective = () => {
    setFormData({ ...formData, objectives: [...formData.objectives, ''] });
  };

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData({ ...formData, objectives: newObjectives });
  };

  const updateObjective = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, objectives: newObjectives });
  };

  const addPrerequisite = () => {
    setFormData({ ...formData, prerequisites: [...formData.prerequisites, ''] });
  };

  const removePrerequisite = (index) => {
    const newPrerequisites = formData.prerequisites.filter((_, i) => i !== index);
    setFormData({ ...formData, prerequisites: newPrerequisites });
  };

  const updatePrerequisite = (index, value) => {
    const newPrerequisites = [...formData.prerequisites];
    newPrerequisites[index] = value;
    setFormData({ ...formData, prerequisites: newPrerequisites });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
        </h1>
        <Link
          to="/lessons"
          className="text-purple-600 hover:text-purple-700"
        >
          ← Back to Lessons
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Learning Path */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Path *
          </label>
          <select
            value={formData.path_id}
            onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value={LearningPaths.PYTHON}>Python</option>
            <option value={LearningPaths.WEB_DEVELOPMENT}>Web Development</option>
            <option value={LearningPaths.MOBILE_DEVELOPMENT}>Mobile Development</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range *
            </label>
            <select
              value={formData.age_range}
              onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              {AgeRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes) *
            </label>
            <input
              type="number"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="15"
              step="5"
              required
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level *
            </label>
            <select
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              {DifficultyLevels.map(level => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1-on-1 Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1-on-1 Price ($) *
            </label>
            <input
              type="number"
              value={formData.price_on_one}
              onChange={(e) => setFormData({ ...formData, price_on_one: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="0"
              step="1"
              required
            />
          </div>

          {/* Group Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Price ($) *
            </label>
            <input
              type="number"
              value={formData.price_group}
              onChange={(e) => setFormData({ ...formData, price_group: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              min="0"
              step="1"
              required
            />
          </div>
        </div>

        {/* Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives *
          </label>
          <div className="space-y-2">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="What students will learn..."
                />
                {formData.objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addObjective}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              + Add Objective
            </button>
          </div>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prerequisites (Lesson IDs)
          </label>
          <div className="space-y-2">
            {formData.prerequisites.map((prereq, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={prereq}
                  onChange={(e) => updatePrerequisite(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., py-001"
                />
                <button
                  type="button"
                  onClick={() => removePrerequisite(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPrerequisite}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              + Add Prerequisite
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            to="/lessons"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}
