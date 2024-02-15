import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const db = getFirestore();
  console.log("CCC", currentUser.uid);
  useEffect(() => {
    const getChats = async () => {
      try {
        const docRef = doc(db, "userChats", currentUser.uid);
        console.log("hereeeeee", docRef);
        const snapshot = await getDoc(docRef);
        console.log("1233232123132", snapshot);
        if (snapshot.exists()) {
          console.log("hereeeeee");
          console.log("Document data:", snapshot.data());
          setChats(snapshot.data());
        } else {
          // console.log("Document does not exist");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    if (currentUser && currentUser.uid) {
      getChats();
    }
  }, [currentUser]);

  const handleSelect = (u) => {
    console.log("u", u);
    // dispatch({ type: "CHANGE_USER", payload: u });
  };
  console.log("chats", JSON.stringify(chats.userInfo, null, 2));
  return (
    <>
      {chats.userInfo && (
        <div className="chats">
          <div
            className="userChat"
            key={chats}
            onClick={() => handleSelect(chats.userInfo)}
          >
            <img src={chats.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chats.userInfo.displayName}</span>
              <p>{chats.lastMessage?.text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chats;
