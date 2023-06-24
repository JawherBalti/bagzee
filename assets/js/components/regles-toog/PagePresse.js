import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockPresse from "./BlockPresse";

class PagePresse extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div >
                <Header/>
                <BlockPresse/>
                <Footer/>
            </div>
        )
    }
}

export default PagePresse;