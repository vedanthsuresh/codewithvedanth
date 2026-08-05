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

  // Get all units with optional filters
  async getUnits(filters = {}) {
    const params = new URLSearchParams();
    if (filters.path_id) params.append('path_id', filters.path_id);
    const queryString = params.toString();
    return this.request(`/modules/units${queryString ? `?${queryString}` : ''}`);
  }

  // Get single unit by ID
  async getUnit(id) {
    return this.request(`/modules/units/${id}`);
  }

  // Get modules for a specific unit
  async getUnitModules(unitId) {
    return this.request(`/modules/units/${unitId}/modules`);
  }

  // ============ BOOKING ENDPOINTS ============

  // Get available time slots for booking
  async getAvailableTimeSlots() {
    return this.request('/bookings/slots?available_only=true');
  }

  // Get time slot details
  async getTimeSlotDetails(id) {
    return this.request(`/bookings/slots/${id}`);
  }

  // Book a free trial slot
  async bookFreeTrial(slotId, bookingData) {
    // Include time_slot_id in the body as required by the API
    const payload = { ...bookingData, time_slot_id: slotId };
    return this.request(`/bookings/slots/${slotId}/book`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new APIService();
