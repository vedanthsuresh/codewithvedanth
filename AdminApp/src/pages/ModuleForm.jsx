import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, LearningPaths, DifficultyLevels, AgeRanges } from '../services/api';

const pathInfo = {
  [LearningPaths.PYTHON]: { name: 'Python', emoji: '🐍' },
  [LearningPaths.WEB_DEVELOPMENT]: { name: 'Web Development', emoji: '🌐' },
  [LearningPaths.MOBILE_DEVELOPMENT]: { name: 'Mobile Development', emoji: '📱' },
};

const difficultyInfo = {
  beginner: { name: 'Beginner', emoji: '🌱' },
  intermediate: { name: 'Intermediate', emoji: '🌿' },
  advanced: { name: 'Advanced', emoji: '🌳' },
};

export default function ModuleForm() {
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
      loadModule();
    }
  }, [id]);

  const loadModule = async () => {
    try {
      const data = await api.getModule(id);
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

    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter(o => o.trim()),
      prerequisites: formData.prerequisites.filter(p => p.trim())
    };

    try {
      if (isEditing) {
        await api.updateModule(id, cleanedData);
      } else {
        await api.createModule(cleanedData);
      }
      navigate('/modules');
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
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-medium">Loading module...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isEditing ? 'Edit Module' : 'Create New Module'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEditing ? 'Update module details and content' : 'Fill in the details to create a new module'}
          </p>
        </div>
        <Link
          to="/modules"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 mb-6">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <div className="p-8 space-y-8">
          {/* Learning Path */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Learning Path <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(pathInfo).map(([key, info]) => (
                <label
                  key={key}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    formData.path_id === key
                      ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500 ring-offset-2'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="path_id"
                    value={key}
                    checked={formData.path_id === key}
                    onChange={(e) => setFormData({ ...formData, path_id: e.target.value })}
                    className="sr-only"
                  />
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="font-medium text-gray-900">{info.name}</span>
                  {formData.path_id === key && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Module Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-base"
              placeholder="e.g., Introduction to Python Variables"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="input-base resize-none"
              placeholder="Provide a brief description of what students will learn in this module..."
              required
            />
          </div>

          {/* Age Range, Duration, Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age Range <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.age_range}
                onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
                className="select-base"
                required
              >
                {AgeRanges.map(range => (
                  <option key={range} value={range}>{range} years</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (min) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                className="input-base"
                min="15"
                step="5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.difficulty_level}
                onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                className="select-base"
                required
              >
                {Object.entries(difficultyInfo).map(([key, info]) => (
                  <option key={key} value={key}>{info.emoji} {info.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                1-on-1 Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={formData.price_on_one}
                  onChange={(e) => setFormData({ ...formData, price_on_one: parseFloat(e.target.value) })}
                  className="input-base pl-8"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Group Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  value={formData.price_group}
                  onChange={(e) => setFormData({ ...formData, price_group: parseFloat(e.target.value) })}
                  className="input-base pl-8"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Learning Objectives <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-500">What students will learn</span>
            </div>
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-semibold mt-2">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="input-base"
                      placeholder={`Objective ${index + 1}...`}
                      required={index === 0}
                    />
                  </div>
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addObjective}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Objective
              </button>
            </div>
          </div>

          {/* Prerequisites */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Prerequisites
              </label>
              <span className="text-xs text-gray-500">Module IDs (optional)</span>
            </div>
            <div className="space-y-3">
              {formData.prerequisites.length === 0 ? (
                <button
                  type="button"
                  onClick={addPrerequisite}
                  className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl transition-colors w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Prerequisite
                </button>
              ) : (
                <>
                  {formData.prerequisites.map((prereq, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={prereq}
                          onChange={(e) => updatePrerequisite(index, e.target.value)}
                          className="input-base"
                          placeholder="e.g., py-001"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrerequisite(index)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPrerequisite}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Prerequisite
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
            <Link
              to="/modules"
              className="inline-flex items-center justify-center px-6 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center px-6 py-2.5 font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : isEditing ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Module
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Module
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
