import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { db } from "../../hooks/firebase";
import Message from "./Message";
import TchatGroup from "../profil-blocks/TchatGroup";

const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
     // console.log(doc)
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

 // console.log(messages)

  return (
    <div className="messages">
      {messages.map((m) => (
        <Message message={m} key={m.id}  {...props}/>
      ))}
    </div>
  );
};

export default Messages;
