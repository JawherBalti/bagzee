import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import {withTranslation} from "react-i18next";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link} from "react-router-dom";

class Etape1 extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <Header/>
                <section className={'depotAnnonce container text-center py-5'}>
                    <LazyLoadImage src={"/images/imgDepotAnn_etap1.png"} className={'my-3'} alt={"imgDepotAnn_etap1"}/>
                    <div className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                        <Link to={'/confier-lieu-depot'}
                              className={'btnBlueLight'}>{t('circuit_depot_annonce.btnConfier')}</Link>
                        <Link to={'/porter-lieu-retrait'}
                              className={'btnTransparentOrange'}>{t('circuit_depot_annonce.btnPorter')}</Link>
                    </div>

                </section>
                <Footer/>
            </div>
        )
    }
}

export default withTranslation()(Etape1);