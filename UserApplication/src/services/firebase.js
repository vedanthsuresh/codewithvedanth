// Firebase configuration
// To get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select an existing one
// 3. Enable Authentication (Email/Password provider)
// 4. Enable Cloud Firestore (for storing additional user data)
// 5. Go to Project Settings > General > Your apps > Web app
// 6. Copy the config values to .env (see .env.example)

import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);
// Use localStorage persistence (matches current behavior)
auth.setPersistence(browserLocalPersistence);

// Initialize Firestore (for storing additional user data like name, phone, age)
export const db = getFirestore(app);

export default app;
