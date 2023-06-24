import React, {Component} from 'react';
import Block404 from "./Block404";
import Footer from "./Footer";
import {Link} from "react-router-dom";
import Subscribe from "./Login";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import Header from "./Header";

class Page404 extends Component {
    constructor() {
        super();
      window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                <Header/>
                <Block404/>
                <Footer/>
            </div>
        )
    }
}

export default Page404;