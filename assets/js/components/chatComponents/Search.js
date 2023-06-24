import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { AuthContext } from "./AuthContext";
import {user} from "../../app";
import {withTranslation} from "react-i18next";
const Search = (props) => {
  const t=props.t
  const [username, setUsername] = useState("");
  const [secUser, setSecUser] = useState([]);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  let avatar = ""
  if (user.client.photo) {
    avatar = user.client.photo
  } else if (currentUser.photoURL) {
    avatar = currentUser.photoURL
  } else {
    avatar = "/images/avatar-person.png"
  }
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      let myUser=[]
      querySnapshot.forEach((doc) => {
       myUser.push(doc.data())
     //   console.log(doc.data())
      });
      setSecUser(myUser);
      console.log(myUser)

    } catch (err) {
     // console.log("error ")
      console.log(err)

      setErr(true);
    }
  };

  const handleKey = (e) => {
    console.log(e)
    e.code.includes("Enter") && handleSearch();
  };

  const handleSelect = async (user) => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        console.log(res)
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL?user.photoURL:"/images/avatar-person.png"

          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: avatar,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log("err")
      console.log(err)

    }

    setSecUser([]);
    setUsername("")
  };
  return (
    <div className="search">
      <p>{t('messages')}</p>
      <div className="searchForm">
        <input
          type="text"
          placeholder= {t('page_home.recherche')}
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>{t('userNotFound')}!</span>}
      {secUser?.map(item=> (
        <div className="userChat" onClick={()=>handleSelect(item)}>
          <img src={item.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{item.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default withTranslation()(Search);
