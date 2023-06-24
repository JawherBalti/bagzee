import React, {Component} from 'react';
import {Select} from "antd";
import "antd/dist/antd.css";

import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CardForm from "../../demos/CardForm";
import axios from "axios";
import settings from "../../../app";
import {messageService} from "../../../lib/Services";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";


const {Option} = Select;
let token = ""

class Alertes extends Component {

    constructor() {
        super();
        this.state = {
           loading: false

        };
    }


    componentDidMount() {
        window.scrollTo(0, 0);
    }



    render() {
        let loading = this.state.loading
        const { t } = this.props;

        return (
            <div className={"profil_blocks Paiement"}>

                <div className={"container py-2 px-4"}>
                    {loading ?
                        <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                        </p> :
                        <>
                            <div className={"row mb-3"}>
                            <div className={"col-md-4"}>
                                <p>{t('mes_notifications')}</p>
                            </div>
                            <div className={"col-md-8"}>
                             <p>
                                 <LazyLoadImage src={"/images/notification.png"} alt={"notification"} className={'mr-2'}/>
                                 J'aimerais recevoir la Newsletter et les offres commerciales Bagzee
                             </p>
                            </div>
                            </div>
                        </>}
                </div>
            </div>
        )
    }
}

export default withTranslation()(Alertes);