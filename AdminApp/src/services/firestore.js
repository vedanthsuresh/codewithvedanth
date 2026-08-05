/**
 * Firestore Service for AdminApp
 * Provides admin-level CRUD operations for modules, units, time slots, and bookings
 * Replaces the previous REST API service
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';

// Learning paths enum
export const LearningPaths = {
  PYTHON: 'python',
  WEB_DEVELOPMENT: 'web_development',
  MOBILE_DEVELOPMENT: 'mobile_development'
};

// Difficulty levels
export const DifficultyLevels = ['beginner', 'intermediate', 'advanced'];

// Path prefixes for ID generation
const PATH_PREFIXES = {
  python: 'py',
  web_development: 'web',
  mobile_development: 'mob'
};

class FirestoreService {
  // ==================== LEARNING PATHS ====================

  async getLearningPaths() {
    return [
      {
        id: 'python',
        name: 'Python',
        description: 'Learn programming fundamentals and projects with Python',
        icon: '🐍',
        color: '#306998'
      },
      {
        id: 'web_development',
        name: 'Web Development',
        description: 'Build websites and web applications',
        icon: '🌐',
        color: '#E34F26'
      },
      {
        id: 'mobile_development',
        name: 'Mobile Development',
        description: 'Create mobile applications',
        icon: '📱',
        color: '#61DAFB'
      }
    ];
  }

  // ==================== MODULES (Admin CRUD) ====================

  async getModules(filters = {}) {
    try {
      const modulesRef = collection(db, 'modules');
      let q = modulesRef;

      const constraints = [];
      if (filters.path_id) {
        constraints.push(where('path_id', '==', filters.path_id));
      }
      if (filters.difficulty) {
        constraints.push(where('difficulty_level', '==', filters.difficulty));
      }
      constraints.push(orderBy('order'));

      if (constraints.length > 0) {
        q = query(modulesRef, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching modules:', error);
      throw new Error('Failed to fetch modules');
    }
  }

  async getModule(id) {
    try {
      const docRef = doc(db, 'modules', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Module not found');
      }

      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error fetching module:', error);
      throw new Error('Failed to fetch module');
    }
  }

  async createModule(moduleData) {
    try {
      // Generate custom ID
      const pathId = moduleData.path_id;
      const prefix = PATH_PREFIXES[pathId] || 'mod';

      // Get current count to generate next ID
      const modulesRef = collection(db, 'modules');
      const q = query(modulesRef, where('path_id', '==', pathId));
      const snapshot = await getDocs(q);
      const count = snapshot.size;
      const moduleId = `${prefix}-${String(count + 1).padStart(3, '0')}`;

      // Create with custom ID
      const docRef = doc(db, 'modules', moduleId);
      const dataToSave = {
        ...moduleData,
        order: moduleData.order || count
      };

      await setDoc(docRef, dataToSave);

      return { id: moduleId, ...dataToSave };
    } catch (error) {
      console.error('Error creating module:', error);
      throw new Error('Failed to create module');
    }
  }

  async updateModule(id, updates) {
    try {
      const docRef = doc(db, 'modules', id);

      // Remove undefined values
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanUpdates);

      // Return updated document
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error updating module:', error);
      throw new Error('Failed to update module');
    }
  }

  async deleteModule(id) {
    try {
      const docRef = doc(db, 'modules', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting module:', error);
      throw new Error('Failed to delete module');
    }
  }

  // ==================== UNITS (Admin CRUD) ====================

  async getUnits(filters = {}) {
    try {
      const unitsRef = collection(db, 'units');
      let q = unitsRef;

      const constraints = [];
      if (filters.path_id) {
        constraints.push(where('path_id', '==', filters.path_id));
      }
      constraints.push(orderBy('order'));

      if (constraints.length > 0) {
        q = query(unitsRef, ...constraints);
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching units:', error);
      throw new Error('Failed to fetch units');
    }
  }

  async getUnit(id) {
    try {
      const docRef = doc(db, 'units', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Unit not found');
      }

      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error fetching unit:', error);
      throw new Error('Failed to fetch unit');
    }
  }

  async createUnit(unitData) {
    try {
      // Generate custom ID
      const pathId = unitData.path_id;
      const prefix = PATH_PREFIXES[pathId] || 'unit';

      // Get current count
      const unitsRef = collection(db, 'units');
      const q = query(unitsRef, where('path_id', '==', pathId));
      const snapshot = await getDocs(q);
      const count = snapshot.size;
      const unitId = `${prefix}-u${String(count + 1).padStart(3, '0')}`;

      // Create with custom ID
      const docRef = doc(db, 'units', unitId);
      const dataToSave = {
        ...unitData,
        order: unitData.order || count
      };

      await setDoc(docRef, dataToSave);

      return { id: unitId, ...dataToSave };
    } catch (error) {
      console.error('Error creating unit:', error);
      throw new Error('Failed to create unit');
    }
  }

  async updateUnit(id, updates) {
    try {
      const docRef = doc(db, 'units', id);

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanUpdates);

      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error updating unit:', error);
      throw new Error('Failed to update unit');
    }
  }

  async deleteUnit(id) {
    try {
      const docRef = doc(db, 'units', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting unit:', error);
      throw new Error('Failed to delete unit');
    }
  }

  async getUnitModules(unitId) {
    try {
      const modulesRef = collection(db, 'modules');
      const q = query(
        modulesRef,
        where('unit_id', '==', unitId),
        orderBy('order')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching unit modules:', error);
      throw new Error('Failed to fetch unit modules');
    }
  }

  // ==================== TIME SLOTS (Admin CRUD) ====================

  async getTimeSlotsAdmin(filters = {}) {
    try {
      const slotsRef = collection(db, 'time_slots');
      const q = query(slotsRef, orderBy('date'), orderBy('time'));
      const snapshot = await getDocs(q);

      const slots = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const slot = { id: docSnap.id, ...docSnap.data() };

          // Count confirmed bookings
          const bookingsRef = collection(db, 'bookings');
          const bookingQuery = query(
            bookingsRef,
            where('time_slot_id', '==', slot.id),
            where('status', '==', 'confirmed')
          );
          const bookingSnapshot = await getDocs(bookingQuery);
          const bookingCount = bookingSnapshot.size;

          return {
            ...slot,
            available: bookingCount < slot.capacity,
            bookings_count: bookingCount
          };
        })
      );

      // Filter if available_only is requested
      if (filters.available_only) {
        return slots.filter(slot => slot.available);
      }

      return slots;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw new Error('Failed to fetch time slots');
    }
  }

  async getTimeSlot(id) {
    try {
      const docRef = doc(db, 'time_slots', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Time slot not found');
      }

      const slot = { id: docSnap.id, ...docSnap.data() };

      // Count bookings
      const bookingsRef = collection(db, 'bookings');
      const bookingQuery = query(
        bookingsRef,
        where('time_slot_id', '==', id),
        where('status', '==', 'confirmed')
      );
      const bookingSnapshot = await getDocs(bookingQuery);

      return {
        ...slot,
        available: bookingSnapshot.size < slot.capacity,
        bookings_count: bookingSnapshot.size
      };
    } catch (error) {
      console.error('Error fetching time slot:', error);
      throw new Error('Failed to fetch time slot');
    }
  }

  async createTimeSlot(slotData) {
    try {
      // Get current count for ID generation
      const slotsRef = collection(db, 'time_slots');
      const snapshot = await getDocs(slotsRef);
      const count = snapshot.size;
      const slotId = `ts-${String(count + 1).padStart(3, '0')}`;

      // Create with custom ID
      const docRef = doc(db, 'time_slots', slotId);
      const now = new Date().toISOString();
      const dataToSave = {
        ...slotData,
        created_at: now,
        updated_at: now
      };

      await setDoc(docRef, dataToSave);

      return { id: slotId, ...dataToSave };
    } catch (error) {
      console.error('Error creating time slot:', error);
      throw new Error('Failed to create time slot');
    }
  }

  async updateTimeSlot(id, updates) {
    try {
      const docRef = doc(db, 'time_slots', id);

      // If updating capacity, check against confirmed bookings
      if (updates.capacity !== undefined) {
        const bookingsRef = collection(db, 'bookings');
        const bookingQuery = query(
          bookingsRef,
          where('time_slot_id', '==', id),
          where('status', '==', 'confirmed')
        );
        const bookingSnapshot = await getDocs(bookingQuery);
        const confirmedCount = bookingSnapshot.size;

        if (updates.capacity < confirmedCount) {
          throw new Error(`Cannot reduce capacity below ${confirmedCount} confirmed bookings`);
        }
      }

      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      // Add updated_at timestamp
      cleanUpdates.updated_at = new Date().toISOString();

      await updateDoc(docRef, cleanUpdates);

      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      console.error('Error updating time slot:', error);
      throw error;
    }
  }

  async deleteTimeSlot(id) {
    try {
      // Check if there are confirmed bookings
      const bookingsRef = collection(db, 'bookings');
      const bookingQuery = query(
        bookingsRef,
        where('time_slot_id', '==', id),
        where('status', '==', 'confirmed')
      );
      const bookingSnapshot = await getDocs(bookingQuery);

      if (!bookingSnapshot.empty) {
        throw new Error('Cannot delete time slot with confirmed bookings');
      }

      const docRef = doc(db, 'time_slots', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting time slot:', error);
      throw error;
    }
  }

  // ==================== BOOKINGS (Admin) ====================

  async getBookingsAdmin() {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('booked_at', 'desc'));
      const snapshot = await getDocs(q);

      const bookings = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const booking = { id: docSnap.id, ...docSnap.data() };

          // Get time slot details
          const slotRef = doc(db, 'time_slots', booking.time_slot_id);
          const slotSnap = await getDoc(slotRef);

          // Count total bookings for this slot
          const countQuery = query(
            bookingsRef,
            where('time_slot_id', '==', booking.time_slot_id),
            where('status', '==', 'confirmed')
          );
          const countSnapshot = await getDocs(countQuery);

          return {
            ...booking,
            time_slot_date: slotSnap.exists() ? slotSnap.data().date : 'N/A',
            time_slot_time: slotSnap.exists() ? slotSnap.data().time : 'N/A',
            bookings_count: countSnapshot.size
          };
        })
      );

      return bookings;
    } catch (error) {
      console.error('Error fetching admin bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async updateBookingStatus(id, status) {
    try {
      const docRef = doc(db, 'bookings', id);
      await updateDoc(docRef, { status });
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }

  async deleteBooking(id) {
    try {
      const docRef = doc(db, 'bookings', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw new Error('Failed to delete booking');
    }
  }
}

export const firestoreService = new FirestoreService();
