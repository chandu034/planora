// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDyYD18Ws1bY4WxTbq_6YU0cJ5BPyOBo70",
  authDomain: "planoraa.firebaseapp.com",
  projectId: "planoraa",
  storageBucket: "planoraa.firebasestorage.app",
  messagingSenderId: "887686220526",
  appId: "1:887686220526:web:7eb4400f221b68c78a01ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);