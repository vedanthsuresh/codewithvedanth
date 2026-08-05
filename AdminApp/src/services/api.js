const API_BASE_URL = 'http://127.0.0.1:8000';

// Learning paths enum
export const LearningPaths = {
  PYTHON: 'python',
  WEB_DEVELOPMENT: 'web_development',
  MOBILE_DEVELOPMENT: 'mobile_development'
};

// Difficulty levels
export const DifficultyLevels = ['beginner', 'intermediate', 'advanced'];

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

  // Units
  async getUnits(filters = {}) {
    const params = new URLSearchParams();
    if (filters.path_id) params.append('path_id', filters.path_id);
    const queryString = params.toString();
    return this.request(`/modules/units${queryString ? `?${queryString}` : ''}`);
  }

  async getUnit(id) {
    return this.request(`/modules/units/${id}`);
  }

  async createUnit(unitData) {
    return this.request('/modules/units', {
      method: 'POST',
      body: JSON.stringify(unitData),
    });
  }

  async updateUnit(id, unitData) {
    return this.request(`/modules/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(unitData),
    });
  }

  async deleteUnit(id) {
    return this.request(`/modules/units/${id}`, {
      method: 'DELETE',
    });
  }

  async getUnitModules(unitId) {
    return this.request(`/modules/units/${unitId}/modules`);
  }

  // ============ TIME SLOTS (Admin) ============

  async getTimeSlotsAdmin(filters = {}) {
    const params = new URLSearchParams();
    if (filters.available_only !== undefined) {
      params.append('available_only', filters.available_only);
    }
    const queryString = params.toString();
    return this.request(`/bookings/admin/slots${queryString ? `?${queryString}` : ''}`);
  }

  async getTimeSlot(id) {
    return this.request(`/bookings/slots/${id}`);
  }

  async createTimeSlot(slotData) {
    return this.request('/bookings/admin/slots', {
      method: 'POST',
      body: JSON.stringify(slotData),
    });
  }

  async updateTimeSlot(id, slotData) {
    return this.request(`/bookings/admin/slots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(slotData),
    });
  }

  async deleteTimeSlot(id) {
    return this.request(`/bookings/admin/slots/${id}`, {
      method: 'DELETE',
    });
  }

  // ============ BOOKINGS (Admin) ============

  async getBookingsAdmin() {
    return this.request('/bookings/admin/bookings');
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/admin/bookings/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  async deleteBooking(id) {
    return this.request(`/bookings/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new APIService();
