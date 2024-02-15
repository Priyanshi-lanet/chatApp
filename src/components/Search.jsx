import React, { useContext, useEffect, useState } from "react";
import {
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  getFirestore,
  getDocs,
  collection,
} from "firebase/firestore";

import { getFStore } from "../firebase";

import { AuthContext } from "../context/AuthContext";
import { isEmpty } from "lodash";

const Search = () => {
  const db = getFirestore();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [fuser, setfUser] = useState(null);
  const [err, setErr] = useState(false);
  const [list, setlist] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // const handleSearch = async () => {
  //   const usersCollectionRef = doc(db, "users");
  //   console.log("usersCollectionRef", usersCollectionRef);
  //   // const cityRef = db.collection("users").doc(currentUser.uid);
  //   // const doc = await cityRef.get();
  //   // if (!doc.exists) {
  //   //   console.log("No such document!");
  //   // } else {
  //   //   console.log("Document data:", doc.data());
  //   // }

  //   // const querySnapshot = await getDocs(q);
  //   // querySnapshot.forEach((doc) => {
  //   //   console.log("-====================");
  //   //   console.log(doc.id, " => ", doc.data());
  //   //   console.log("-====================");
  //   // });

  //   // try {
  //   //   const querySnapshot = await getDocs(q);
  //   //   querySnapshot.forEach((doc) => {
  //   //     console.log("inside search", doc.data());
  //   //     setUser(doc.data());
  //   //   });
  //   // } catch (err) {
  //   //   setErr(true);
  //   // }
  // };
  const bookCollectionRef = collection(db, "users");
  const bookCollectionRef1 = collection(db, "usersChats");

  useEffect(() => {
    const callApi = async () => {
      try {
        const usersSnapshot = await getDocs(bookCollectionRef);
        const usersSnapshot1 = await getDocs(bookCollectionRef1);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        setlist(usersData);
        setUser(usersData);
      } catch (error) {
        console.error("Error updating document:", error);
      }
    };

    callApi();
  }, []);

  const handleSelect = async (s_user) => {
    const combinedId =
      currentUser.uid > s_user.uid
        ? currentUser.uid + s_user.uid
        : s_user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        console.log("Chat document created successfully!");
      }
      const updateData = {
        [`${combinedId}.userInfo`]: {
          uid: s_user.uid,
          displayName: s_user.displayName,
          photoURL: s_user.photoURL,
        },
        [`${combinedId}.date`]: serverTimestamp(),
      };

      //updatett
      const userChatsRef = doc(db, `usersChats/${currentUser.uid}`);
      await updateDoc(userChatsRef, updateData);

      const selectChatsRef1 = doc(db, `usersChats/${s_user.id}`);
      await updateDoc(selectChatsRef1, updateData);
      const index = list.findIndex(
        (userChat) => userChat.uid === currentUser.uid
      );

      if (index !== -1) {
        list[index].uid = currentUser.uid;

        try {
          console.log("UserChats document updated successfully!");
        } catch (error) {
          console.error("Error updating userChats document:", error);
        }
      } else {
        console.error("Specified uid not found in userChats array.");
      }
    } catch (err) {
      console.error("Error handling chats:", err);
    }
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found!</span>}
      {user &&
        user.map((s_user) => {
          return (
            <div
              className="userChat"
              onClick={() => {
                handleSelect(s_user);
              }}
            >
              <img src={s_user.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{s_user.displayName}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Search;
