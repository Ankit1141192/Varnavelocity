// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBoM5qYxCZUAX5uObDj_nghM-d2AAOcLz0",
  authDomain: "varnavelocity-244c1.firebaseapp.com",
  projectId: "varnavelocity-244c1",
  storageBucket: "varnavelocity-244c1.appspot.com",
  messagingSenderId: "373530436495",
  appId: "1:373530436495:web:407c14b24e7dfe6f3f61fa",
  measurementId: "G-Y5X290T2F5",
  databaseURL: "https://varnavelocity-244c1-default-rtdb.firebaseio.com" // Add this for Realtime DB!
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
