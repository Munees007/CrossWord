// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAAfo3x4H-sBIlC8YbOT2MLpw5IRrHzZBs",
  authDomain: "crossword-18799.firebaseapp.com",
  databaseURL: "https://crossword-18799-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crossword-18799",
  storageBucket: "crossword-18799.appspot.com",
  messagingSenderId: "313914597761",
  appId: "1:313914597761:web:4ff3dd74074f6a02978880"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


export {app,db};