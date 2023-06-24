import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockContact from "./BlockContact";

class PageContact extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                <Header/>
                <BlockContact/>
                <Footer/>
            </div>
        )
    }
}

export default PageContact;