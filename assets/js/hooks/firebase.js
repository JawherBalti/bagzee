import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCUmdoZj3BrNKdDTgOAH8zhTrhGQZXtXvE",
    authDomain: "bagzee-c81d2.firebaseapp.com",
    projectId: "bagzee-c81d2",
    storageBucket: "bagzee-c81d2.appspot.com",
    messagingSenderId: "883078213839",
    appId: "1:883078213839:web:83670c143748e5c29387ba",
    measurementId: "G-VH7H0JJ2Q7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()