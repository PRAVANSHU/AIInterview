// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app"

import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH1ua1qWSZ7WG69WzNhdQ0-9v1Q7fuYNg",
  authDomain: "aiinterview-53de5.firebaseapp.com",
  projectId: "aiinterview-53de5",
  storageBucket: "aiinterview-53de5.firebasestorage.app",
  messagingSenderId: "102613054929",
  appId: "1:102613054929:web:1c1ae426b06f165fe69cf0",
  measurementId: "G-FDVNM5BNCC"
};

// Initialize Firebase
const app = !getApps.length? initializeApp(firebaseConfig):getApp();


export const auth=getAuth(app);
export const db=getFirestore(app);