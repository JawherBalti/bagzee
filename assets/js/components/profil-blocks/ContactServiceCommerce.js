import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';


class ContactServiceCommerce extends Component {

    constructor() {
        super();
        this.state = {
            messagerie:
                {
                    nom: "",
                    prenom: "",
                    nomEntreprise: "",
                    tel: "",
                    email: "",
                    ville: "",
                    typeEntreprise: "",
                    prixMoyTicket: 0,
                    nbrMoyPart: 0,
                    evenementParAn: "",
                }


        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let dataClient = JSON.parse(localStorage.getItem('client'));
        this.setState(prevState => ({
            messagerie: {
                ...prevState.messagerie,
                email: dataClient.client.email,
                prenom: dataClient.client.firstName,
                nom: dataClient.client.lastName,
                tel: dataClient.client.phone,
                ville: dataClient.client.ville?dataClient.client.ville:'',
            }
        }));
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            messagerie: {
                ...prevState.messagerie,
                [name]: value
            }, disabled: false
        }));
    }

    formSubmit(event) {
        this.setState({disabled: true});
        event.preventDefault();
        axios.post('api/subscription/contact', {messagerie: this.state.messagerie}).then(res => {
            this.setState(prevState => ({
                disabled: false,
                messagerie:
                    {
                        ...prevState.messagerie,
                        nomEntreprise: "",
                        typeEntreprise: "",
                        prixMoyTicket: 0,
                        nbrMoyPart: 0,
                        evenementParAn: 0,
                    }
            }))
            if (res.data.status == true) {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'Messagerie-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-success pt-2"}>votre message a bien été transmis et sera traité sous
                                48h</p>
                            <span>L'équipe Bagzee vous remercie</span>
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


    }

    render() {

        return (
            <div className={"profil_blocks Messagerie"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-12 my-3"}>
                            <h5 className={"centrage-y"}>Contacter notre service commercial
                            </h5>
                        </div>
                    </div>
                </div>
                <div className={"container py-2 px-4"}>
                    <div className={"row justify-content-center mt-5 bg-white"} style={{borderRadius:20}}>
                        <div className={"col-md-7 bg-white p-4"}>
                            <form onSubmit={this.formSubmit} className={"row"}>
                                <div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y requis"}>Nom</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"nom"} value={this.state.messagerie.nom}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y requis"}>Prénom</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"prenom"} value={this.state.messagerie.prenom}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-12 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Nom de l'entreprise/ École</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"nomEntreprise"} value={this.state.messagerie.nomEntreprise}
                                               onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className={"col-md-12 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y requis"}>Numéro de téléphone</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"tel"} minLength={10} maxLength={10}
                                               name={"tel"} value={this.state.messagerie.tel}
                                               onKeyPress={(event) => {
                                                   if (!/[0-9]/.test(event.key)) {
                                                       event.preventDefault();
                                                   }
                                               }} onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-12 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y requis"}>Email</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"email"} name={"email"} value={this.state.messagerie.email}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-12 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y requis"}>Ville</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"ville"} value={this.state.messagerie.ville}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                {/*<div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Type d'entreprise</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"typeEntreprise"} value={this.state.messagerie.typeEntreprise}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Prix moyen de tickets</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"number"} name={"prixMoyTicket"} value={this.state.messagerie.prixMoyTicket} min={1} step={0.1}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>
                                <div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Nombre moyen des participants</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"number"} name={"nbrMoyPart"} value={this.state.messagerie.nbrMoyPart} min={1}
                                               onChange={this.handleChange} required={true}/>

                                    </div>
                                </div>
                                <div className={"col-md-6 mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Nombres d'événements par an</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"number"} name={"evenementParAn"} value={this.state.messagerie.evenementParAn} min={1}
                                               onChange={this.handleChange} required={true}/>
                                    </div>
                                </div>*/}
                                <div className={"d-block text-md-center w-100"}>
                                    <button className={this.state.disabled ? "btn-blue disabled" : "btn-blue"}
                                            type="submit">
                                        Contacter Bagzee
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

export default ContactServiceCommerce;