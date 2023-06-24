import React, {Component} from 'react';
import BlockCookies from "./BlockCookies";
import Footer from "../Footer";
import Header from "../Header";
import BlockSecurite from "./BlockSecurite";
import {Link} from "react-router-dom";
import {LazyLoadImage} from "react-lazy-load-image-component";
import Iframe from "react-iframe";

class PageSecurite extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div>
                <Header/>
                <BlockSecurite/>
                <div className={'mx-xl-5 px-xl-5 mx-2 px-2'}>
                    <h2 className="col-md-12 pb-5 fs-4 text-center">Nos tutoriels
                    </h2>
                    <div className={'container mb-5'}>
                        <div className={'row'}>
                            <LazyLoadImage src={"images/imgSectionBleu.png"} alt={"imgSectionBleu"}
                                           className={'col-md-6 mb-3'}/>
                            <LazyLoadImage src={"images/imgSectionBleu.png"} alt={"imgSectionBleu"}
                                           className={'col-md-6 mb-3'}/>
                        </div>
                    </div>
                    <div className={'mx-xl-5 px-xl-5 mx-2 px-2'}>
                        <h2 className="col-md-12 pb-5 fs-4 text-center">Les règlementations douanières par pays
                        </h2>
                        <div className={'mb-5'}>
                            <div className={'d-flex justify-content-center'}>
                                <Iframe
                                        url="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13115.563997824309!2d10.7573637!3d34.7331418!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x9e9acf7a7266b964!2sSifo-consulting%20sous%20traitance%2C%20creation%20site%20web%20et%20mobile%20tunisie!5e0!3m2!1sfr!2stn!4v1674056845589!5m2!1sfr!2stn"
                                        width="100%" height="450" frameBorder="0" allowFullScreen="" loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"/>
                            </div>
                        </div>
                    </div>
                    <div className={'container-fluid'}>
                        <Link to={'/faq'}
                              className={'btnFAQ'}>FAQ
                        </Link>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default PageSecurite;