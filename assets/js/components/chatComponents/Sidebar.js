import React from "react";
import Navbar from "./Navbar"
import Search from "./Search"
import Chats from "./Chats"
import TchatGroup from "../profil-blocks/TchatGroup";

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      {/*<Navbar  {...props}/>*/}
      <Search  {...props}/>
      <Chats  {...props}/>
    </div>
  );
};

export default Sidebar;
