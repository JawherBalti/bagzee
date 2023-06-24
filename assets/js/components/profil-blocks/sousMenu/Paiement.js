import React, {Component} from 'react';
import {Modal, Select} from "antd";
import "antd/dist/antd.css";

import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import CardForm from "../../demos/CardForm";
import axios from "axios";
import settings from "../../../app";
import {messageService} from "../../../lib/Services";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";
import {user} from '../../../app'


const {Option} = Select;
let token = ""

class Paiement extends Component {

    constructor() {
        super();
        this.state = {
            paiement: [{
                id: 1,
                type: 'visa',
                exp: 2023,
                last4: '2021',
                firstName: "chokri",

            }], firstName: '', selectedCard: "visa", messages: [], loading: true,
            client: {},

        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if(user) {
            token = user.client.token;
            this.state.firstName = user.client.firstName
            this.subscription = messageService.getMessage().subscribe(message => {

                if (message) {
                    this.setState({messages: [...this.state.messages, message]});
                    axios.post('api/card/show', {token: token}).then(res => {
                        this.setState({paiement: res.data.cards}, () => {
                            this.setState({loading: false})
                        })
                    })
                } else {
                    // clear messages when empty message received
                    this.setState({messages: []});
                }
            });
            axios.post('api/card/show', {token: token}).then(res => {
                //  alert(JSON.stringify(res))

                this.setState({paiement: res.data.cards}, () => {
                    this.setState({loading: false})
                })
            })
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            paiement: [{
                [name]: value
            }]
        });
    }

    onValueChange(event) {
        this.setState({
            selectedCard: event.target.value

        });
    }


    render() {
        let loading = this.state.loading
        const {t} = this.props;

        return (
            <div className={"profil_blocks Paiement"}>
                <div className={"container py-2 px-4"}>
                    {loading ?
                        <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                        </p> :
                        <>

                            <div className={"row mb-4"}>
                                {this.state.paiement.length ? this.state.paiement.map(card =>
                                    <div className={"col-md-12 px-2 py-4 mb-3 bg-white"} key={card.id}>
                                        <div className={"row "}>
                                            <div className={"col-md-1"}>
                                                <label htmlFor={"key-" + card.type}>
                                                    {card.type === "" ? null :
                                                        <LazyLoadImage src={"/images/" + card.type + ".png"}
                                                                       width={"50px"} alt={card.type}/>}
                                                </label>
                                            </div>
                                            <div className={"col-md-9"}>
                                                <label htmlFor={"key-" + card.type}>
                                                    xxxx xxxx xxxx {card.last4}
                                                </label>
                                            </div>
                                            <div className={"col-md-2 justify-content-center"}>
                                                <button className={"trash"} onClick={() => {
                                                    axios.post(`api/card/delete`, {
                                                        token: token,
                                                        pm: card.pm
                                                    }).then(res => {
                                                        Modal.success({
                                                            content: (
                                                                <div className={"text-center"} key={'compte-' + Math.random()}>
                                                                    <p className={"text-success pt-2"}>
                                                                        {res.data.message}
                                                                    </p>
                                                                </div>),
                                                            okText: 'Ok',
                                                        });
                                                        this.setState({
                                                            paiement: this.state.paiement.filter(function (elm) {

                                                                if (elm.pm !== card.pm)
                                                                    return elm
                                                            })
                                                        });
                                                    });
                                                }}>
                                                    <LazyLoadImage src={'/images/trash.png'} width={'35px'}
                                                                   alt={'trash'}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : <div className={'col-12 pt-5 mt-5 mb-4 text-center'}>{t('paiement.noCard')}</div>}
                            </div>
                            <div className={"row justify-content-center mb-3"}>
                                <Elements stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                    <CardForm children={t('paiement.add_card')}/>
                                </Elements>
                            </div>
                        </>}
                </div>
            </div>
        )
    }
}

export default withTranslation()(Paiement);