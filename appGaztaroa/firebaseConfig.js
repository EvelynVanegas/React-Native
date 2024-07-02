import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import { initializeApp } from "firebase/auth";
import { getDatabase  } from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
import { getStorage  } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCi9NARiBce9uqWhTSA250pvBeBp-IxGjo",
    authDomain: "proyecto-final---react-native.firebaseapp.com",
    databaseURL: "https://proyecto-final---react-native-default-rtdb.firebaseio.com",
    projectId: "proyecto-final---react-native",
    storageBucket: "proyecto-final---react-native.appspot.com",
    messagingSenderId: "377510723246",
    appId: "1:377510723246:web:c18a4f1c1bc8ac6468373f",
    measurementId: "G-RT41Q84PG7"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, storage };