const API_BASE_URL = 'http://127.0.0.1:8000';

// Learning paths enum
export const LearningPaths = {
  PYTHON: 'python',
  WEB_DEVELOPMENT: 'web_development',
  MOBILE_DEVELOPMENT: 'mobile_development'
};

// Difficulty levels
export const DifficultyLevels = ['beginner', 'intermediate', 'advanced'];

// Age ranges
export const AgeRanges = ['6-9', '8-12', '10-12'];

class APIService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || 'Request failed');
    }

    // For 204 No Content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Get all learning paths
  async getLearningPaths() {
    return this.request('/lessons/paths');
  }

  // Get all lessons with optional filters
  async getLessons(filters = {}) {
    const params = new URLSearchParams();
    if (filters.path_id) params.append('path_id', filters.path_id);
    if (filters.age_range) params.append('age_range', filters.age_range);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);

    const queryString = params.toString();
    return this.request(`/lessons${queryString ? `?${queryString}` : ''}`);
  }

  // Get single lesson by ID
  async getLesson(id) {
    return this.request(`/lessons/${id}`);
  }

  // Create new lesson
  async createLesson(lessonData) {
    return this.request('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  // Update lesson
  async updateLesson(id, lessonData) {
    return this.request(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
  }

  // Delete lesson
  async deleteLesson(id) {
    return this.request(`/lessons/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new APIService();
