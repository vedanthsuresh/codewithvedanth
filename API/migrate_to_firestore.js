/**
 * Migration Script: SQLite to Firestore
 *
 * This script migrates all data from the SQLite database to Firestore.
 * It preserves custom document IDs (py-001, ts-001, etc.)
 *
 * Usage:
 *   node migrate_to_firestore.js
 *
 * Prerequisites:
 *   - npm install firebase-admin better-sqlite3
 *   - Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable (path to service account JSON)
 */

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Firebase Service Account (required for admin SDK)
// Get this from Firebase Console > Project Settings > Service Accounts
let serviceAccount;
try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    path.join(__dirname, '../firebase-service-account.json');

  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  } else {
    console.error('❌ Firebase service account key not found!');
    console.error('Please download your service account key from Firebase Console and save it as:');
    console.error('  - firebase-service-account.json in the project root, or');
    console.error('  - Set the FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
    console.error('\nGet your key at: https://console.firebase.google.com/u/0/project/code-with-vedanth/settings/serviceaccounts/adminsdk');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error loading Firebase service account:', error.message);
  process.exit(1);
}

// Initialize Firebase Admin SDK
const app = admin.initializeApp({
  credential: admin.cert(serviceAccount)
});

const db = getFirestore(app);

// SQLite database path
const dbPath = path.join(__dirname, 'vedanth_classes.db');
const sqlite = new Database(dbPath, { readonly: true });

// Migration statistics
const stats = {
  units: 0,
  modules: 0,
  time_slots: 0,
  bookings: 0,
  errors: []
};

/**
 * Migrate Units table
 */
async function migrateUnits() {
  console.log('\n📦 Migrating Units...');

  const rows = sqlite.prepare('SELECT * FROM units').all();

  for (const row of rows) {
    try {
      await db.collection('units').doc(row.id).set({
        id: row.id,
        path_id: row.path_id,
        title: row.title,
        description: row.description || '',
        order: row.order || 0
      });
      stats.units++;
      console.log(`  ✓ Migrated unit: ${row.id} - ${row.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate unit ${row.id}:`, error.message);
      stats.errors.push({ table: 'units', id: row.id, error: error.message });
    }
  }

  console.log(`✅ Units: ${stats.units} migrated`);
}

/**
 * Migrate Modules table
 */
async function migrateModules() {
  console.log('\n📚 Migrating Modules...');

  const rows = sqlite.prepare('SELECT * FROM modules').all();

  for (const row of rows) {
    try {
      // Parse JSON fields
      const objectives = typeof row.objectives === 'string'
        ? JSON.parse(row.objectives || '[]')
        : (row.objectives || []);

      const prerequisites = typeof row.prerequisites === 'string'
        ? JSON.parse(row.prerequisites || '[]')
        : (row.prerequisites || []);

      await db.collection('modules').doc(row.id).set({
        id: row.id,
        path_id: row.path_id,
        unit_id: row.unit_id || null,
        title: row.title,
        description: row.description,
        difficulty_level: row.difficulty_level,
        objectives,
        prerequisites,
        order: row.order || 0
      });
      stats.modules++;
      console.log(`  ✓ Migrated module: ${row.id} - ${row.title}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate module ${row.id}:`, error.message);
      stats.errors.push({ table: 'modules', id: row.id, error: error.message });
    }
  }

  console.log(`✅ Modules: ${stats.modules} migrated`);
}

/**
 * Migrate Time Slots table
 */
async function migrateTimeSlots() {
  console.log('\n🕐 Migrating Time Slots...');

  const rows = sqlite.prepare('SELECT * FROM time_slots').all();

  for (const row of rows) {
    try {
      await db.collection('time_slots').doc(row.id).set({
        id: row.id,
        date: row.date,
        time: row.time,
        capacity: row.capacity,
        created_at: row.created_at,
        updated_at: row.updated_at
      });
      stats.time_slots++;
      console.log(`  ✓ Migrated time slot: ${row.id} - ${row.date} ${row.time}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate time slot ${row.id}:`, error.message);
      stats.errors.push({ table: 'time_slots', id: row.id, error: error.message });
    }
  }

  console.log(`✅ Time Slots: ${stats.time_slots} migrated`);
}

/**
 * Migrate Bookings table
 */
async function migrateBookings() {
  console.log('\n📝 Migrating Bookings...');

  const rows = sqlite.prepare('SELECT * FROM bookings').all();

  for (const row of rows) {
    try {
      await db.collection('bookings').doc(row.id).set({
        id: row.id,
        time_slot_id: row.time_slot_id,
        user_id: row.user_id,
        student_name: row.student_name,
        student_email: row.student_email,
        student_phone: row.student_phone,
        student_age: row.student_age,
        booked_at: row.booked_at,
        status: row.status || 'confirmed'
      });
      stats.bookings++;
      console.log(`  ✓ Migrated booking: ${row.id} - ${row.student_name}`);
    } catch (error) {
      console.error(`  ✗ Failed to migrate booking ${row.id}:`, error.message);
      stats.errors.push({ table: 'bookings', id: row.id, error: error.message });
    }
  }

  console.log(`✅ Bookings: ${stats.bookings} migrated`);
}

/**
 * Verify migration by counting documents
 */
async function verifyMigration() {
  console.log('\n🔍 Verifying migration...');

  const collections = ['units', 'modules', 'time_slots', 'bookings'];

  for (const name of collections) {
    const snapshot = await db.collection(name).count().get();
    console.log(`  ${name}: ${snapshot.data().count} documents`);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('========================================');
  console.log('🔥 SQLite to Firestore Migration');
  console.log('========================================');
  console.log(`Database: ${dbPath}`);
  console.log(`Firestore Project: ${serviceAccount.project_id}`);

  try {
    // Check database exists
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Database file not found: ${dbPath}`);
    }

    // Show current data counts
    console.log('\n📊 Current SQLite data:');
    console.log(`  Units: ${sqlite.prepare('SELECT COUNT(*) FROM units').get()['COUNT(*)']}`);
    console.log(`  Modules: ${sqlite.prepare('SELECT COUNT(*) FROM modules').get()['COUNT(*)']}`);
    console.log(`  Time Slots: ${sqlite.prepare('SELECT COUNT(*) FROM time_slots').get()['COUNT(*)']}`);
    console.log(`  Bookings: ${sqlite.prepare('SELECT COUNT(*) FROM bookings').get()['COUNT(*)']}`);

    // Run migrations
    await migrateUnits();
    await migrateModules();
    await migrateTimeSlots();
    await migrateBookings();

    // Verify
    await verifyMigration();

    // Summary
    console.log('\n========================================');
    console.log('📈 Migration Summary');
    console.log('========================================');
    console.log(`✅ Units: ${stats.units}`);
    console.log(`✅ Modules: ${stats.modules}`);
    console.log(`✅ Time Slots: ${stats.time_slots}`);
    console.log(`✅ Bookings: ${stats.bookings}`);
    console.log(`Total: ${stats.units + stats.modules + stats.time_slots + stats.bookings} documents`);

    if (stats.errors.length > 0) {
      console.log(`\n⚠️  ${stats.errors.length} errors occurred:`);
      stats.errors.forEach(err => {
        console.log(`  - ${err.table}/${err.id}: ${err.error}`);
      });
    }

    console.log('\n✨ Migration complete! Check your Firestore console to verify.');
    console.log('https://console.firebase.google.com/project/' + serviceAccount.project_id + '/firestore');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

// Run migration
migrate().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
