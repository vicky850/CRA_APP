import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyBu51jOzRRRtuq00Zf9fuR8M2RQ50P-RM4",
    authDomain: "cra-db.firebaseapp.com",
    databaseURL: "https://cra-db.firebaseio.com",
    projectId: "cra-db",
    storageBucket: "cra-db.appspot.com",
    messagingSenderId: "823162965959"
  };
  let db = firebase.initializeApp(config);
  export default db;