
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyArcLYVPFpbkIrvlqPD2C2Ua7z5nMIrHDo",
  authDomain: "food-hot-hai.firebaseapp.com",
  projectId: "food-hot-hai",
  storageBucket: "food-hot-hai.appspot.com",
  messagingSenderId: "636629752258",
  appId: "1:636629752258:web:256ced668a7c5a27989e5b",
  measurementId: "G-BJ7Z9GSP8D"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app)