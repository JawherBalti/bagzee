import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockEquipe from "./BlockEquipe";

class PageEquipe extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div >
                <Header/>
                <BlockEquipe/>
                <Footer/>
            </div>
        )
    }
}

export default PageEquipe;