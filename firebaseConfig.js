// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgMuMLPcK7ZHFtnQEak-JV7ayh1Xbf2Lc",
  authDomain: "kbcpfifirebase.firebaseapp.com",
  projectId: "kbcpfifirebase",
  storageBucket: "kbcpfifirebase.firebasestorage.app",
  messagingSenderId: "936805463768",
  appId: "1:936805463768:web:92124771c926800aa049ad",
  measurementId: "G-3G7QY3Y69B"
};

export default firebaseConfig;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);