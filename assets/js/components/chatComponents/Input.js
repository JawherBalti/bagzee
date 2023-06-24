import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../hooks/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      console.log(img)
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          alert(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      }).then(()=>{
        console.log("success")
      }).catch(e=>console.log(e));
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    }).then(()=>{
      console.log("success")
    }).catch(e=>console.log(e));

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    }).then(()=>{
      console.log("success")
    }).catch(e=>console.log(e));

    setText("");
    setImg("");
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="btnSend">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => {
            console.log(e.target.files[0])
            setImg(e.target.files[0])
          }}
        />
        <label htmlFor="file">
          <img src={"/images/img.png"} alt="" />
        </label>
        <button onClick={handleSend}> <FontAwesomeIcon color={'#fff'} icon={faPaperPlane}/></button>
      </div>
    </div>
  );
};

export default Input;
