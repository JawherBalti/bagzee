import React, {Component} from 'react';
import {faEdit, faSpinner, faTruckLoading} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {Input, Modal} from "antd";
import {Elements} from "@stripe/react-stripe-js";
import IbanForm from "../demos/IbanForm";
import {loadStripe} from "@stripe/stripe-js";
import settings from "../../app";
import { LazyLoadImage } from 'react-lazy-load-image-component';


class Informations extends Component {

    constructor() {
        super();
        this.state = {
            last4: ""

            , firstName: '', selectedCard: "visa",
            partenaire: {}, disabled: false
            , loading: true, isEdit: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.showInfo = this.showInfo.bind(this);
        let user = JSON.parse(localStorage.getItem('partenaire'))
        const token = user.partenaire.token;
        axios.get('api/stripe/banque/show?token_partenaire=' + token).then(res => {
            if (res.data.banque.last4 == null) {
                this.setState({loading: false})
            }
            this.setState({last4: '**************' + res.data.banque.last4, loading: false})
        })
    }

    showInfo() {
        let user = JSON.parse(localStorage.getItem('partenaire'))
        const token = user.partenaire.token;
        this.setState({
            partenaire: user.partenaire,

        });
        this.state.firstName = user.partenaire.firstName
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.state.loading = true;
        this.showInfo()
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            partenaire: {
                ...prevState.partenaire,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }


    formSubmit(event) {
        event.preventDefault();
        this.setState({disabled: true});
        axios.put(' api/info/partenaire?token=' + this.state.partenaire.token, this.state.partenaire).then(response => {
            if (response.data.status == true) {
                localStorage.setItem('partenaire', JSON.stringify({partenaire: this.state.partenaire}));
                this.setState({disabled: false}, () => {
                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"}>
                                <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                                <h4 className={" pt-2"}>
                                    Modification profil
                                </h4>
                                <p className={"text-success pt-2"}>
                                    Vos informations ont bien été traitées.
                                </p>

                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                    }, 5000);
                });

            }
        }).catch(function (error) {
            console.log(error);
        });


    }

    render() {

        const loading = this.state.loading;

        return (
            <div className={"profil_blocks Information"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-sm-8 my-3"}>
                            <h5 className={"centrage-y"}>Mon compte > Mes Informations</h5>
                        </div>
                        <div className={"col-sm-4 my-3 text-right"}>
                            <button className={"edit"} onClick={() => {
                                this.setState({isEdit: !this.state.isEdit});
                            }}><FontAwesomeIcon icon={faEdit}/> Editer
                            </button>
                        </div>
                    </div>
                </div>
                <div className={"container py-2 px-4"}>
                    {loading ?
                        <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x"></span></p>
                        :
                        <>
                            <form onSubmit={this.formSubmit}>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y"}>Nom de la structure</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                        <input type={"text"} name={"nomStructure"}
                                               value={this.state.partenaire.nomStructure} required
                                               placeholder={"Nom de la structure*"} onChange={this.handleChange}/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y"}>Nom</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly requis" : "col-md-9 requis"}>
                                        <input type={"text"} name={"lastName"} value={this.state.partenaire.lastName} required
                                               placeholder={"Nom*"} onChange={this.handleChange}/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y"}>Prénom</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly requis" : "col-md-9 requis"}>
                                        <input type={"text"} name={"firstName"} value={this.state.partenaire.firstName} required
                                               placeholder={"Prénom*"} onChange={this.handleChange}/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y requis"}>Téléphone portable</label>
                                    </div>
                                    <div className={"col-md-9"}>
                                        <input type={"tel"} minLength={10} maxLength={10} placeholder={'0600000000'} readOnly
                                               name={"phone"} value={this.state.partenaire.phone}/>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y requis"}>Téléphone fixe</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                        <input type={"tel"} minLength={10} maxLength={10} placeholder={'0600000000'}
                                               name={"phone2"} value={this.state.partenaire.phone2}
                                               onKeyPress={(event) => {
                                                   if (!/[0-9]/.test(event.key)) {
                                                       event.preventDefault();
                                                   }
                                               }} onChange={this.handleChange}/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y requis"}>email</label>
                                    </div>
                                    <div className={ "col-md-9"}>
                                        <input type={"email"} name={"email"} value={this.state.partenaire.email}
                                               placeholder={"Email*"} readOnly=""/>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y requis"}>Adresse</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                        <input type={"text"} name={"adresse"} value={this.state.partenaire.adresse}
                                               placeholder={"Adresse*"} onChange={this.handleChange} required/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y requis"}>Siret</label>
                                    </div>
                                    <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                        <input type={"text"} name={"siret"} value={this.state.partenaire.siret}
                                               placeholder={"Siret*"} onChange={this.handleChange} required/>
                                        <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez
                                            modifier vos infos </p>
                                    </div>
                                </div>
                                {/* FR1420041010050500013M02606*/}
                                <div
                                    className={this.state.isEdit ? "readOnly Iban overflow-hidden" : "overflow-hidden"}>
                                    <Elements stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                        <IbanForm last4={this.state.last4}/>
                                    </Elements>
                                    <p className={"aide"}>Veuillez activer le bouton "editer" si vous voulez modifier
                                        vos infos </p>
                                </div>
                                {/*
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Mot de passe</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <button className={"edit"}>Changer le mot de passe</button>
                                </div>
                            </div>*/}

                                {(this.state.isEdit === false) ?
                                    <button className={this.state.disabled ? "btn-blue disabled" : "btn-blue"}
                                            type="submit">
                                        Enregistrer
                                    </button> : null}


                            </form>

                        </>
                    }
                </div>
            </div>
        )
    }

}

export default Informations;