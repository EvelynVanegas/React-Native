import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyArM7FijgkkOcKCm77w30sfBet1a1UpjfY",
    authDomain: "react-native-f84ac.firebaseapp.com",
    databaseURL: "https://react-native-f84ac-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "react-native-f84ac",
    storageBucket: "react-native-f84ac.appspot.com",
    messagingSenderId: "156819458424",
    appId: "1:156819458424:web:76429bccf438c4ec7aa08d",
    measurementId: "G-PL7QGVBRHT"
  };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage };