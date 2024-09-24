// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import Constants from "expo-constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyA0ZUn0-va6HuiubWsnQHpuXhao97E0i80",
  authDomain: "todo-6ca78.firebaseapp.com",
  projectId: "todo-6ca78",
  storageBucket: "todo-6ca78.appspot.com",
  messagingSenderId: "310653806249",
  appId: "1:310653806249:web:538aa4ee2b8c201ce7ebb8",
  measurementId: "G-Q4BVSBG0DH"
};

// Initialize Firebase
// initialize firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();