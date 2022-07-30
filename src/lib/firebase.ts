import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);





// Initialize Firebase Authentication and get a reference to the service
export const fireAuth = getAuth(app);

if (process.env.REACT_APP_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(fireAuth, 'http://localhost:9099');
}


export const db = getFirestore();

if (process.env.REACT_APP_FIREBASE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export const storage = getStorage();

if (process.env.REACT_APP_FIREBASE_EMULATOR === 'true') {
  connectStorageEmulator(storage, 'localhost', 9199);
}
export default db;