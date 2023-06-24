import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "./ChatContext";
import {withTranslation} from "react-i18next";
import Sidebar from "./Sidebar";

const Chat = (props) => {
    const t=props.t
    const { data } = useContext(ChatContext);
  return (
      data.user.displayName?
          <div className="chat">
      {/*<div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={"/images/cam.png"} alt="" />
          <img src={"/images/add.png"} alt="" />
          <img src={"/images/more.png"} alt="" />
        </div>
      </div>*/}
      <Messages  {...props}/>
       <Input/>
    </div>:<div className="chat">
          <div className="messages d-flex align-items-center justify-content-center" style={{minHeight:100}}>
              <span>Chercher et Sélectionner un utilisateur pour démarrer une discussion</span>
          </div>
      </div>
  );
};

export default withTranslation()(Chat);
