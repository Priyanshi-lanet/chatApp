import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const db = getFirestore();
  useEffect(() => {
    const getChats = async () => {
      try {
        const userChatsRef = doc(db, `usersChats/${currentUser.uid}`);
        const snapshot = await getDoc(userChatsRef);

        if (snapshot.exists()) {
          setChats(snapshot.data());
        } else {
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
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  console.log("chats", JSON.stringify(chats, null, 2));
  return (
    <div className="chats">
      {Object.keys(chats).map((key) => {
        const user = chats[key];

        if (
          user.userInfo &&
          user.userInfo.displayName &&
          user.userInfo.photoURL
        ) {
          const { displayName, photoURL } = user.userInfo;

          return (
            <div
              className="userChat"
              key={key}
              onClick={() => handleSelect(user.userInfo.uid)}
            >
              <img src={photoURL} alt={`${displayName}'s Photo`} />
              <div className="userChatInfo">
                <span>{displayName}</span>
                {/* <p>{chat[1].lastMessage?.text}</p> */}
              </div>
            </div>
          );
        } else {
          return null; // Skip rendering if userInfo or required fields are missing
        }
      })}
    </div>
  );
};

export default Chats;
