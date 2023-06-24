import {doc, onSnapshot} from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import {ChatContext} from "./ChatContext";
import {AuthContext} from "./AuthContext";
import {db} from "../../hooks/firebase";
import {user} from "../../app";

const Chats = (props) => {
    const [chats, setChats] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const {dispatch, data} = useContext(ChatContext);
    useEffect(() => {
        const getChats = () => {
            console.log("currentUser.uid=====", currentUser.uid)
            let unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                console.log("doc data===", doc.data())
                setChats(doc.data());
                //console.log(Object.keys(doc.data()).length)
                // console.log(Object.entries(doc.data())?.sort((a, b) => b[1].date - a[1].date)[0][1].userInfo.uid)
                // console.log(Object.entries(doc.data()).filter(val => val[1].userInfo?.displayName == props.location.state?.myUser?.displayName))
                if (doc.data()) {
                    if (Object.keys(doc.data()).length) {
                        Object.entries(doc.data()).filter(val => val[1].userInfo?.displayName == props.location.state?.myUser?.displayName).length ?
                            handleSelect1(Object.entries(doc.data()).filter(val => val[1].userInfo?.displayName == props.location.state.myUser?.displayName)[0][1].userInfo)
                            :
                            handleSelect2(Object.entries(doc.data())?.sort((a, b) => b[1].date - a[1].date)[0][1].userInfo)
                    }
                }
            });


            return () => {

                unsub();
            };
        };

        currentUser.uid && getChats();
    }, [currentUser.uid]);

    const handleSelect1 = (u) => {
        dispatch({type: "CHANGE_USER", payload: u});
    };
    const handleSelect2 = (u) => {
        dispatch({type: "CHANGE_USER", payload: u});
        window.history.replaceState({}, document.title)

    };

    function convertDate(elem) {
        if (elem) {
            let date = elem.toDate();
            let mm = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            let dd = date.getDate();
            let yyyy = date.getFullYear();

            date = dd + '/' + mm + '/' + yyyy;
            return date
        }
    }

    function convertHeur(elem) {
        if (elem) {
            let date = elem.toDate();
            let hh = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
            let min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

            return hh + ':' + min
        }
    }

    return (
        <div className="chats">
            {!chats?null:
                !Object.keys(chats).length ? null :
                    Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                <div
                    className="userChat"
                    key={chat[0]}
                    onClick={() => handleSelect2(chat[1].userInfo)}
                >
                    <img src={chat[1].userInfo?.photoURL ? chat[1].userInfo?.photoURL : "/images/avatar-person.png"}
                         alt=""/>
                    <div className="userChatInfo">
                        <span>{chat[1].userInfo?.displayName} <small>{convertDate(chat[1].date)}</small>
                    <small>{convertHeur(chat[1].date)}</small></span>
                        <p>{chat[1].lastMessage?.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chats;
