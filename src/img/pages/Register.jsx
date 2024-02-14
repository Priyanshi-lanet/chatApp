import React, { useState } from "react";
import Add from "../add.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate, Link } from "react-router-dom";
import { set } from "firebase/database";
import { auth, db, storage, getFStore } from "../../firebase";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    function createDatabasesForUser(userId) {
      console.log("userId", userId);
      // Access Firestore instance
      // const firestore = firebase.firestore();

      // Create user document in 'users' collection using userId
      const userRef = getFStore.collection("users").doc(userId);
      userRef
        .set({
          data: 1,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document:", error);
        });

      // Create userChats document in 'userChats' collection using userId
      // const userChatsRef = db.collection("userChats").doc(userId);
      // userChatsRef.set({
      //   /* Initial userChats data */
      // });
    }
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      createDatabasesForUser(res.user.uid);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        console.log("1", storageRef, file);
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            console.log("sucess");
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await set(ref(db, `users`, res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await set(ref(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            console.log("err", err);
            console.log("falilses");
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      console.log("errww", err);
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}

          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account? <Link to="/register">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
