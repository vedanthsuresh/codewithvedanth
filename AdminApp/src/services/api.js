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
    return this.request('/modules/paths');
  }

  // Get all modules with optional filters
  async getModules(filters = {}) {
    const params = new URLSearchParams();
    if (filters.path_id) params.append('path_id', filters.path_id);
    if (filters.age_range) params.append('age_range', filters.age_range);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);

    const queryString = params.toString();
    return this.request(`/modules${queryString ? `?${queryString}` : ''}`);
  }

  // Get single module by ID
  async getModule(id) {
    return this.request(`/modules/${id}`);
  }

  // Create new module
  async createModule(moduleData) {
    return this.request('/modules', {
      method: 'POST',
      body: JSON.stringify(moduleData),
    });
  }

  // Update module
  async updateModule(id, moduleData) {
    return this.request(`/modules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(moduleData),
    });
  }

  // Delete module
  async deleteModule(id) {
    return this.request(`/modules/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new APIService();
