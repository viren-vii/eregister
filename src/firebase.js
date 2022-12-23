// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getDatabase, ref, set, child, get, update } from "firebase/database";
import { getDate, getDateTime } from "./utils";

const provider = new GoogleAuthProvider();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP__MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP__MEASUREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase();

const auth = getAuth();
export async function signInUsingGoogle(setBackgroundOverlay, setLoading) {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const date = getDate();
      const dbRef = ref(database);
      const userId = user.email.split("@")[0];
      const dateTime = getDateTime();
      get(child(dbRef, `${date}/${userId}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            if (snapshot.val().isIn) {
              const updates = {};
              updates[date + "/" + userId + "/isIn"] = false;
              updates[date + "/" + userId + "/" + dateTime] = "exit";
              return update(ref(database), updates);
            } else {
              const updates = {};
              updates[date + "/" + userId + "/isIn"] = true;
              updates[date + "/" + userId + "/" + dateTime] = "entry";
              return update(ref(database), updates);
            }
          } else {
            const userData = {
              user: user.displayName,
              email: user.email,
            };
            writeRecord(userData);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("No one is logged in");
      signInWithPopup(auth, provider)
        .then((result) => {
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential.accessToken;
          const user = result.user;
          console.log(`Logged in:`, user);
          if (!user.email.includes("sggs.ac.in")) {
            signOut(auth)
              .then(() => {
                console.log("Signed out succesfully");
                alert("Please use your institute email id");
                return;
              })
              .catch((error) => {
                console.log("Not able to sign out", error);
                alert("Please use your institute email id");
                return;
              });
          }
          const userData = {
            user: user.displayName,
            email: user.email,
          };
          writeRecord(userData);
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          // const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
          console.log(
            "Error occured while signing in",
            errorCode,
            errorMessage,
            email
          );
        });
    }
  });
}

const writeRecord = async (data) => {
  const date = getDate();
  const db = getDatabase();
  await set(ref(db, date + "/" + data.email.split("@")[0]), {
    username: data.user,
    isIn: true,
    [getDateTime()]: "entry",
  });
};
export const getStatus = async (setBackground, setLoading, setIsIn) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const date = getDate();
      const dbRef = ref(getDatabase());
      get(child(dbRef, `${date}/${user.email.split("@")[0]}`))
        .then(async (snapshot) => {
          if (snapshot.exists()) {
            setBackground(snapshot.val().isIn ? "#66B032" : "#FF3800");
            setIsIn(snapshot.val().isIn);
            console.log("Logging", snapshot.val().isIn);
          } else {
            setIsIn(false);
            setBackground(false ? "#66B032" : "#FF3800");
            console.log("No data available");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setBackground("#fff");
      setLoading(false);
      console.log("No one is logged in");
    }
  });
};
