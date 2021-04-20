// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3rV6DE8trbFRnRgng0Tn2ZnUWa_uyr8A",
  authDomain: "greem-77dfc.firebaseapp.com",
  projectId: "greem-77dfc",
  storageBucket: "greem-77dfc.appspot.com",
  messagingSenderId: "764608700073",
  appId: "1:764608700073:web:3c61c77f01a991e8d513b8",
  measurementId: "G-0344TLEFTM",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
