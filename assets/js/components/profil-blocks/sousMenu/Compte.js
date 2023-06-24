import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";
import {loadStripe} from "@stripe/stripe-js";
import settings from "../../../app";
import {Elements} from "@stripe/react-stripe-js";
import {user} from '../../../app'

const script = document.createElement("script");
script.src = 'https://js.stripe.com/v3/';
let strip; // new line
script.onload = function () {
    strip = Stripe(settings.stripe.publishableKey);

};
document.body.appendChild(script);

class Compte extends Component {

    constructor() {
        super();
        this.state = {
            last4: "",
            bic: "",
            client: {}, loading: true, disabled: false


        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.showInfo = this.showInfo.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.showInfo()

    }
    showInfo() {
        this.setState({
            client: user.client,

        },()=>{
            axios.post('api/banque/show' , {tokenClient:user.client.token}).then(res => {
                if (res.data.banque.length) {
                    this.setState({last4: '**************' + res.data.banque.last4, loading: false})
                }else{
                    this.setState({loading: false})

                }
            })
        });
    }
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
                [name]: value
            , disabled: false
        });
    }

     formSubmit= async event=> {
        this.setState({disabled: true});
        event.preventDefault();
        let user = JSON.parse(localStorage.getItem('client'));
        const client = user.client;
        let bankAccount = {
            country: 'FR',
            currency: 'EUR',
            account_holder_type: 'individual',
            account_holder_name: client.lastName + ' ' + client.firstName,
            account_number: this.state.last4,
        };

    strip.createToken('bank_account', bankAccount).then((result) => {
        axios.post('api/banque/create', {tokenClient: this.state.client.token,
            tokenBanque: result.token.id,
        }).then(res => {
            this.setState({disabled: false})
            if (res.data.status == true) {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'compte-' + Math.random()}>
                            <h4 className={" pt-2"}>
                                {this.props.t('modif_profil')}
                            </h4>
                            <p className={"text-success pt-2"}>
                                {this.props.t('infos_bien_traite')}
                            </p>
                        </div>),
                    okText: 'Ok',
                });
            } else {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'Messagerie-error-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-danger pt-2"}>{res.data.message}</p>
                        </div>),
                    okText: 'Ok',
                });
            }
        })

    });

    }

    render() {
        const { t } = this.props;

        return (
            <div className={"profil_blocks Messagerie"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row justify-content-center mb-3"}>
                        <div className={"col-md-7 bg-white p-4"}>
                            <form onSubmit={this.formSubmit}>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>{t('nom')} & {t('prenom')}</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"email"} value={this.state.client.firstName+' '+this.state.client.lastName}
                                              /* onChange={this.handleChange} */ readOnly/>
                                    </div>
                                </div>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>{t('code_iban')}</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <Elements stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                            <input type={'text'} name={'last4'} value={this.state.last4}
                                                   placeholder={''} onChange={(e) => {
                                              this.setState({last4:e.target.value})
                                            }}/>
                                        </Elements>
                                    </div>
                                </div>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>{t('code_bic')}</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"bic"} value={this.state.bic}
                                               onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className={"d-block text-center"}>
                                    <button className={this.state.disabled ? "btnBlue disabled" : "btnBlue"}
                                            type="submit">
                                        {t('btns.modifier')}{this.state.disabled?<span className="fa fa-spin fa-spinner "> </span>:null}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default withTranslation()(Compte);