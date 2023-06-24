import React, {useContext, useEffect, useRef} from "react";
import {AuthContext} from "./AuthContext";
import {ChatContext} from "./ChatContext";
import {Timestamp} from "firebase/firestore";
import {user} from "../../app";

const Message = ({message}) => {
    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: "smooth"});
    }, [message]);

    let date = message.date.toDate();
    let mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
    let dd = date.getDate();
    let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    let yyyy = date.getFullYear();

    date = dd + '/' + mm + '/' + yyyy;
    let heur = hh + ':' + min
    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}
        >
            <div className="messageInfo">
                <img
                    src={
                        message.senderId === currentUser.uid
                            ? user.client.photo
                            : data.user.photoURL
                    }
                    alt=""
                />

            </div>
            <div className="messageContent ">
        <span className={`d-flex justify-content-between w-100 ${message.senderId === currentUser.uid && "flex-row-reverse"}`}>
                  <small>{heur}</small>
                    <small>{date}</small>
        </span>
                {message.text && <p>{message.text}</p>}
                {message.img && <img src={message.img} alt={message.senderId}/>}
            </div>
        </div>
    );
};

export default Message;
