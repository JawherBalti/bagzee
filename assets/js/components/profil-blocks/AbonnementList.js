import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faCircle, faComments, faDotCircle, faStar, faTimes} from "@fortawesome/free-solid-svg-icons";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Button, Input, Modal, Radio, Tooltip} from "antd";
import axios from "axios";
import {BrowserRouter, Link, NavLink, Redirect, Route, Switch} from "react-router-dom";
import DetailActivity from "../DetailActivity";
import moment from "moment";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import settings from "../../app";
import CardForm from "../demos/CardForm";
import {messageService} from "../../lib/Services";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const script = document.createElement("script");
script.src = 'https://js.stripe.com/v3/';
let strip; // new line
script.onload = function () {
    strip = Stripe(settings.stripe.publishableKey);
};
document.body.appendChild(script);

class AbonnementList extends Component {
    constructor() {
        super();
        this.state = {
            abonnement: [],
            client: [],
            paiement: [],
            messages: [],
            token: '',
            textResponse: '',
            customerId: '',
            loading: true,
            disabled: false,
            redirect: false,
            suivant: false,
            promoValue: '',
            reduce: 0,
            keyy: 999,
            prixAbonnement: 0,
            planId: '',
            stripeCoupon: '',
            showErrorMesg: false
        };
        /*this.state = {
            abonnement: [
                {
                    name: 'abonnement 1',
                    amount: '10',
                    date: '01-05-2022',
                    cardType: 'visa',
                    cardNum: '1234',
                    status: 1
                }
            ], token: '', loading: true
        };*/
        this.handleChangeAbonnement = this.handleChangeAbonnement.bind(this);
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscriptionab.unsubscribe();
    }

    updateInputValue(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            promoValue: value
        });

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('client'))
        if (user)
            this.state.token = user.client.token
        this.state.customerId = user.client.customerId
        axios.get('api/stripe/card/show?token=' + this.state.token).then(res => {
            this.setState({paiement: res.data.card, client: user.client})
        })
        this.subscriptionab = messageService.getMessage().subscribe(message => {
            if (message.text == 'ok') {
                this.setState({messages: [...this.state.messages, message]});
                axios.get('api/stripe/card/show?token=' + this.state.token).then(res => {
                    this.setState({paiement: res.data.card})
                    console.log(res.data.card)
                })
            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });
        this.getabonnement();
        // this.setState({loading: false})
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            client: {
                ...prevState.client,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }

    getabonnement() {
        axios.get(`api/abonnement/list`).then(abonnement => {
            this.setState({abonnement: abonnement.data.abonnement, loading: false})
        })
    }


    handleChangeAbonnement(event) {
        console.log(event)

     /*   if(event.target.checked) {
            event.target.className='Checck'
        } else {
            $('.abnmt').removeClass("cheeckeddd");
        }*/

        if (event.target.value != -1) {

            let key = event.target.value.split('**')[1]
            let word = event.target.value.split('**')[0]
            let price = word.split('//')[0]
            let plan = word.split('//')[1]
            console.log(plan)
            this.setState({
                keyy: key,
                prixAbonnement: price,
                planId: plan,
            }, () => {
                console.log(this.state.keyy)
                this.setState({suivant: true})
            })
        } else {
            this.setState({
                keyy: -1,
                prixAbonnement: event.target.value,
            }, () => {
                console.log('key == ' + this.state.keyy)
                this.setState({suivant: true})
            })
        }
    }

    payement(planId) {
        this.setState({disabled: true})
        axios.get('/api/subscription/create?customer=' + this.state.customerId + '&price_id=' + planId + '&stripeCoupon=' + this.state.stripeCoupon + '&nameUser=' + this.state.client.lastName + ' ' + this.state.client.firstName).then(response => {
                if (response.data.status) {
                    const modal = Modal.success({
                        content: (
                            <div style={{textAlign: 'center'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                     viewBox="0 0 116 116">
                                    <g id="ok-svgrepo-com_2_" data-name="ok-svgrepo-com (2)"
                                       transform="translate(-3 -3.2)">
                                        <circle id="Ellipse_40" data-name="Ellipse 40" cx="58" cy="58"
                                                r="58"
                                                transform="translate(3 3.2)" fill="#4caf50"/>
                                        <path id="Tracé_204" data-name="Tracé 204"
                                              d="M73.467,14.6,35.84,52.227,20.347,36.733,12.6,44.48,35.84,67.72,81.213,22.347Z"
                                              transform="translate(16.96 20.493)" fill="#ccff90"/>
                                    </g>
                                </svg>
                                <br/>
                                <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                    Félicitations, ton abonnement a bien été enregistré ! Tu peux maintenant profiter
                                    de tes loisirs en illimité ! 🙂
                                </p>
                            </div>),
                        okText: 'J\'en profite',
                        onOk() {
                            this.setState({disabled: false, redirect: true})
                        }
                    });

                    setTimeout(() => {
                        modal.destroy();
                        this.setState({disabled: false, redirect: true})

                    }, 5000);
                } else {
                    const modal = Modal.success({
                        content: (
                            <div style={{textAlign: 'center'}}>
                                <FontAwesomeIcon icon={faTimes} fontSize={60}
                                                 color={'red'}/>

                                <br/>
                                <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                    {response.data.message}
                                </p>
                            </div>),
                        okText: 'Ok',
                        onOk() {
                            this.setState({disabled: false, redirect: true})
                        }
                    });

                    setTimeout(() => {
                        modal.destroy();
                        this.setState({disabled: false, redirect: true})

                    }, 5000);
                }
            }
        )
            .catch(function (error) {
                console.log(error);
            });

    }


    render() {
        let loading = this.state.loading
        if (this.state.redirect) {
            return <Redirect to='/abonnement-encours'/>;
        } else {
            return (
                <div className={"profil_blocks Reservation abonnement"}>
                    <div className={"container py-2 px-4"}>
                        <div className={"row"}>
                            <div className={"col-12 my-3"}>
                                <h5 className={"centrage-y"}>Mon compte > Offre</h5>
                            </div>
                        </div>
                    </div>
                    <div className={"container py-2 px-4"}>
                        {loading ?
                            <p className={'text-center my-5'}>
                                <span className="fa fa-spin fa-spinner fa-4x"></span>
                            </p>
                            :
                            this.state.suivant ?
                                <div className={"row bg-white "} style={{borderRadius: 20}}>
                                    <div className={"col-10 mt-4 p-2 mx-auto click2"}
                                         style={{background: '#F8F8F8', borderRadius: 20}}>
                                        <div className={"row "}>
                                            <div className={"col-3 text-center"}>
                                                <span className={'etape active'}>1</span>
                                                <span className={'etptitle active'}>OFFRE</span>
                                            </div>
                                            <div className={"col-6 text-center"}>
                                                <span>
                                                    <hr style={{border: '3px solid #32C31B'}}/>
                                                </span>
                                            </div>
                                            <div className={"col-3 text-center"}>
                                                <span className={'etape active'}>2</span>
                                                <span className={'etptitle active'}>VALIDATION</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"col-10 mt-4 py-2 px-3 mb-4 mx-auto"}
                                         style={{background: '#F3F3F3', borderRadius: 20, border: '3px solid #E2E2E2'}}>
                                        <h5 style={{color: '#888888'}}>Récapitulatif</h5>
                                    </div>

                                    <div className={"col-md-8 mx-auto"}>
                                        <div className={"row"}>
                                            <div className={"col-md-6"}>
                                                <div className={"row mb-3"}>
                                                    <div className={"col-md-12"}>
                                                        <label className={"centrage-y mb-3"}>Nom</label>
                                                    </div>
                                                    <div className={"col-md-12"}>
                                                        <input type={"text"} name={"lastName"}
                                                               value={this.state.client.lastName} readOnly
                                                               placeholder={"Nom*"} />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"col-md-6"}>
                                                <div className={"row mb-3"}>
                                                    <div className={"col-md-12"}>
                                                        <label className={"centrage-y mb-3"}>Prénom</label>
                                                    </div>
                                                    <div className={"col-md-12"}>
                                                        <input type={"text"} name={"firstName"}
                                                               value={this.state.client.firstName} readOnly
                                                               placeholder={"Prénom*"}
                                                               onChange={this.handleChange}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"row mb-3"}>
                                            <div className={"col-md-12"}>
                                                <label className={"centrage-y mb-3"}>Numéro de téléphone</label>
                                            </div>
                                            <div className={"col-md-12"}>
                                                <input type={"tel"} minLength={10} maxLength={10} readOnly
                                                       placeholder={'0600000000'}
                                                       name={"phone"} value={this.state.client.phone}
                                                       />
                                            </div>
                                        </div>
                                        <div className={"row mb-3"}>
                                            <div className={"col-md-12"}>
                                                <label className={"centrage-y mb-3"}>Email</label>
                                            </div>
                                            <div className={"col-md-12"}>
                                                <input type={"email"} name={"email"} value={this.state.client.email}
                                                       placeholder={"Email*"} readOnly/>

                                            </div>
                                        </div>
                                        <div className={"row"}>
                                            <div className={"col-md-7 mb-3"}>
                                                <input type={"text"} name={"codeSurMesure"} readOnly
                                                       value={this.state.codeSurMesure} style={{
                                                    height: 40,
                                                    borderRadius: 9,
                                                    background: '#EEEEEE',
                                                }}
                                                       placeholder={"Code sur mesure"}/>
                                            </div>
                                            <div className={"col-md-5 mb-3"}>
                                                <Input.Group compact>
                                                    <Input
                                                        placeholder={'Votre code promo'}
                                                        style={{

                                                            minWidth: 157,
                                                            width: '70%',
                                                            borderRadius: '6px 0 0 6px'
                                                        }}
                                                        id={'codePromo' + Math.random()}
                                                        defaultValue={this.state.promoValue}
                                                        value={this.state.promoValue}

                                                        onFocus={() => {
                                                            this.setState({
                                                                promoValue: ''
                                                            })
                                                        }}
                                                        onChange={(e) => this.setState({promoValue: e.target.value})}/>
                                                    <Button type="primary" onClick={() => {
                                                        axios.get(`api/codePromosSubscription/verif?code=` + this.state.promoValue).then(res => {

                                                            if (res.data.valide) {
                                                                this.state.showErrorMesg = false
                                                                this.setState({reduce: (res.data.data.reduce)})
                                                                this.setState({stripeCoupon: (res.data.data.stripeCoupon)})
                                                            } else {
                                                                this.state.setState({showErrorMesg: true})
                                                            }
                                                        });
                                                    }}>Ok
                                                    </Button>
                                                </Input.Group>

                                                {this.state.showErrorMesg ?
                                                    <span>Code Promo invalide</span> : null}

                                            </div>
                                            <div className={"col-md-12 d-flex justify-content-between"}>
                                                <h6 style={{color: '#aeaaaa'}}>Prix de base</h6>
                                                <h6 style={{color: '#aeaaaa'}}>{this.state.prixAbonnement} €</h6>
                                            </div>
                                            {this.state.reduce==0?null:<div className={"col-md-12 d-flex justify-content-between"}>
                                                <h6 style={{color: '#aeaaaa'}}>Remise</h6>
                                                <h6 style={{color: '#aeaaaa'}}>{this.state.reduce} €</h6>
                                            </div>}
                                            <div className={"col-md-12 mb-3 d-flex justify-content-between"}>
                                                <h6 className={'DarkgrayText'}>Prix à</h6>
                                                <h6>{this.state.prixAbonnement - this.state.reduce} €</h6>
                                            </div>
                                            <div className={"col-md-12 text-center methodPayAbonnement"}>

                                                {this.state.paiement.length == 0 ?
                                                <div className="methodePay pb-3 my-3">
                                                    <Elements
                                                        stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                                        <CardForm children={'Ajouter une carte'}/>

                                                    </Elements>

                                                </div>
                                                :
                                                <div className={'methodePay pb-3 my-3'}>
                                                    {this.state.paiement.map(card =>
                                                        card.checked ?
                                                            <p className={'d-flex justify-content-between'}
                                                               key={card.id}>
                                                                <span> <Elements
                                                                    stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                                                    <CardForm children={'Moyen de paiement'}/>

                                                                </Elements></span>
                                                                <span>
                                                                    <LazyLoadImage
                                                                        src={"/images/" + card.type + ".png"}
                                                                        width={"30px"}
                                                                        alt={card.type}/>
                                                                    xxxx xxxx {card.last4}
                                                                </span>
                                                            </p>
                                                            : null
                                                    )}</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"btnsAbnmt col-md-12 d-flex justify-content-between"}>
                                        <button key={Math.random()} className={"btn-default payer mb-3"}
                                                style={{padding: '12px'}}
                                                onClick={() => this.setState({suivant: false})}>

                                            Précedent
                                        </button>
                                        <button key={Math.random()}
                                                className={this.state.disabled ? "btn-default payer disabled mb-3" : "btn-default payer mb-3"}
                                                style={{padding: '12px'}}
                                                onClick={() => this.payement(this.state.planId)}>{this.state.disabled ?
                                            <span
                                                className="fa fa-spin fa-spinner "></span> : null}
                                            Payer
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className={"row bg-white "} style={{borderRadius: 20}}>
                                    <div className={"col-10 mt-4 p-2 mx-auto click2"}
                                         style={{background: '#F8F8F8', borderRadius: 20}}>
                                        <div className={"row "}>
                                            <div className={"col-3 text-center"}>
                                                <span className={'etape active'}>1</span>
                                                <span className={'etptitle active'}>OFFRE</span>
                                            </div>
                                            <div className={"col-6  text-center"}>
                                                <span>
                                                    <hr/>
                                                </span>
                                            </div>
                                            <div className={"col-3 text-center"}>
                                                <span className={'etape'}>2</span>
                                                <span className="etptitle">VALIDATION</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"col-12 pt-4"}>
                                        <div className={"row "}>
                                            {this.state.abonnement.length > 0 ?
                                                <>
                                                    <h4 className={'col-md-12 my-3 pb-5 text-center DarkgrayText'}>
                                                        Vous êtes à 2 clics de la liberté
                                                        <LazyLoadImage src={"/images/rocket-ship.png"} alt={"rocket"}
                                                             width={'35px'}/>
                                                    </h4>
                                                    <div className={"col-12"}>
                                                        <Radio.Group className={'myChild-'+this.state.keyy+' abnmt row'}
                                                                     style={{border: 'none', margin: 0}}
                                                                     onChange={this.handleChangeAbonnement}
                                                                     value={this.state.prixAbonnement}>
                                                            {this.state.abonnement.map((order,key) =>

                                                                <Radio.Button value={order.amount + '//' + order.planId+'**'+key}
                                                                              style={{border: 'none'}}
                                                                              className={' col-lg-4 my-2'}
                                                                              key={'abonnement-' + Math.random()}>
                                                                    <div
                                                                        className={"row status-0 mx-auto bg-abonnement position-relative"}>
                                                                        {order.name.toLowerCase() == "3 mois" ?
                                                                            <FontAwesomeIcon icon={faStar}
                                                                                             color={'#FFD21D'}
                                                                                             style={{
                                                                                                 position: 'absolute',
                                                                                                 top: -15,
                                                                                                 right: -15,
                                                                                                 fontSize: 'xx-large'
                                                                                             }}/> : null}
                                                                        <div className={"col-md-12 text-center"}>
                                                                            <h4 style={{color:'#000'}}>{this.state.keyy==key.toString()?
                                                                                <FontAwesomeIcon icon={faDotCircle} style={{fontSize:'large',color:'#38B6FF',marginRight:7}}/>
                                                                                :
                                                                                <FontAwesomeIcon icon={faCircle} style={{fontSize:'large',color:'#ddd',marginRight:7}}/>
                                                                        }
                                                                                {order.name == "Mois" ? "Pass Découverte" : "Pass Liberté"}</h4>
                                                                        </div>
                                                                        {order.name == "Mois" ?
                                                                            <LazyLoadImage src={"/images/1mois.png"}
                                                                                 alt={"abonnements"}
                                                                                 style={{
                                                                                     height: '200px',
                                                                                     margin: 'auto'
                                                                                 }}/> :
                                                                            <LazyLoadImage src={"/images/3mois.png"}
                                                                                 alt={"abonnements"}
                                                                                 style={{
                                                                                     height: '200px',
                                                                                     margin: 'auto'
                                                                                 }}/>}

                                                                        <div className={"col-md-12 text-center"}>
                                                                            <p className={'newPrice w-100'}
                                                                               style={{whiteSpace: 'nowrap'}}>
                                                                                <big style={{
                                                                                    fontSize: "xxx-large",
                                                                                    fontFamily: 'Gordita_Bold'
                                                                                }}>{order.amount - this.state.reduce} €
                                                                                </big>
                                                                                <sub>/ {order.name.replace('1 mois','mois')}</sub>
                                                                            </p>
                                                                        </div>
                                                                        <div className={"col-md-12 text-center"}>
                                                                            <p className={'detail-abonnement'}
                                                                               style={{whiteSpace: 'nowrap'}}>
                                                                                <FontAwesomeIcon icon={faCheck}
                                                                                                 color={'#38B6FF'}
                                                                                                 className={'mr-2'}/>
                                                                                Toutes tes activités gratuites
                                                                                <br/>
                                                                                et en illimité
                                                                                <br/>
                                                                                {order.name == 'Mois' ? null : <>
                                                                                    <FontAwesomeIcon icon={faCheck}
                                                                                                     color={'#38B6FF'}
                                                                                                     className={'mr-2'}/>
                                                                                    Plusieurs places offertes pour
                                                                                    <br/>
                                                                                    tes amis
                                                                                    <br/>
                                                                                </>}

                                                                                <FontAwesomeIcon icon={faCheck}
                                                                                                 color={'#38B6FF'}
                                                                                                 className={'mr-2'}/>
                                                                                Sans frais d'inscription
                                                                                <br/>
                                                                                <FontAwesomeIcon icon={faCheck}
                                                                                                 color={'#38B6FF'}
                                                                                                 className={'mr-2'}/>
                                                                                Sans frais de résiliation
                                                                                <br/>
                                                                                {order.name == 'Mois' ? <>
                                                                                    <FontAwesomeIcon icon={faCheck}
                                                                                                     color={'#38B6FF'}
                                                                                                     className={'mr-2'}/>
                                                                                    Sans engagement</> : null}
                                                                            </p>
                                                                        </div>
                                                                        <div className={"col-md-12 text-center"}>
                                                                            <span className={'btn-default'}>J'en profite
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                </Radio.Button>
                                                            )}
                                                            <Radio.Button value={-1}
                                                                          className={' col-lg-4 my-2'}
                                                                          style={{border: 'none'}}
                                                                          key={'abonnement-' + Math.random()}>
                                                                <Link
                                                                      to={"/contact-service-commercial"}>
                                                                    <div
                                                                    className={"row status-0 mx-auto bg-abonnement position-relative"}>
                                                                    <div className={"col-md-12 text-center"}>
                                                                        <h4 style={{color:'#000'}}>{this.state.keyy=='-1'?
                                                                            <FontAwesomeIcon icon={faDotCircle} style={{fontSize:'large',color:'#38B6FF',marginRight:7}}/>
                                                                            :
                                                                            <FontAwesomeIcon icon={faCircle} style={{fontSize:'large',color:'#ddd',marginRight:7}}/>
                                                                        } Sur mesure</h4>
                                                                    </div>
                                                                    <LazyLoadImage src={"/images/personnalise.png"}
                                                                         alt={"abonnements"}
                                                                         style={{height: '200px', margin: 'auto'}}/>

                                                                    <div className={"col-md-12 text-center"}>
                                                                        <p className={'newPrice w-100'}></p>
                                                                    </div>
                                                                    <div className={"col-md-12 text-center"}>
                                                                        <p className={'detail-abonnement'}
                                                                           style={{whiteSpace: 'nowrap'}}>
                                                                            <FontAwesomeIcon icon={faCheck}
                                                                                             color={'#38B6FF'}
                                                                                             className={'mr-2'}/>
                                                                            Ton entreprise ou ton école
                                                                            <br/>
                                                                            n’est pas encore partenaire ?
                                                                            <br/>
                                                                            Contacte-nous pour proposer
                                                                            <br/>
                                                                            Bagzee à ton administration
                                                                            <br/>
                                                                            <FontAwesomeIcon icon={faCheck}
                                                                                             color={'#38B6FF'}
                                                                                             className={'mr-2'}/>
                                                                            Tes activités gratuites et en
                                                                            <br/>
                                                                            illimité
                                                                            <br/>
                                                                            <FontAwesomeIcon icon={faCheck}
                                                                                             color={'#38B6FF'}
                                                                                             className={'mr-2'}/>
                                                                            Un service sur-mesure pour
                                                                            <br/>
                                                                            organiser vos teambuildings
                                                                            <br/>

                                                                        </p>
                                                                    </div>
                                                                    <div className={"col-md-12 text-center"}>
                                                                        <Link className={"btn-default"}
                                                                              to={"/contact-service-commercial"}>Contacter Bagzee
                                                                        </Link>


                                                                    </div>
                                                                    </div></Link>
                                                            </Radio.Button>
                                                        </Radio.Group>
                                                    </div>
                                                    {/* <div className={"col-md-12 my-4 text-right"}>
                                                        {this.state.prixAbonnement == -1 ?
                                                            <Link className={"btn-default suivant"}
                                                                  to={"/contact-service-commercial"}>
                                                                Suivant</Link> :
                                                            this.state.prixAbonnement == 0 ? null :
                                                                <button className={'btn-default suivant'}
                                                                        onClick={() => {
                                                                            this.setState({suivant: true})
                                                                        }}>Suivant</button>
                                                        }
                                                    </div>*/}

                                                </> :
                                                <div className={'col-12 pt-5 mt-5 mb-4 text-center'}>

                                                    Aucun abonnement à
                                                    afficher
                                                    pour le moment</div>
                                            }
                                        </div>

                                    </div>
                                </div>}
                    </div>
                </div>
            )
        }
    }
}

export default AbonnementList;
