import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAJNpp0csO5KxVAWBw1EA5Wx791uyQXbzk",
  authDomain: "varnavelocity-3b735.firebaseapp.com",
  projectId: "varnavelocity-3b735",
  storageBucket: "varnavelocity-3b735.appspot.com", 
  messagingSenderId: "633814059546",
  appId: "1:633814059546:web:f876a48663c21f95a45fa3",
  measurementId: "G-S9S6KVEPF3"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, remove };
