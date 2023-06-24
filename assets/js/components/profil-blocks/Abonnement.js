import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faComments, faTimes} from "@fortawesome/free-solid-svg-icons";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Button, Modal, Tooltip} from "antd";
import axios from "axios";
import {BrowserRouter, Link, NavLink, Redirect, Route, Switch} from "react-router-dom";
import DetailActivity from "../DetailActivity";
import moment from "moment";
import { LazyLoadImage } from 'react-lazy-load-image-component';


class Abonnement extends Component {
    constructor() {
        super();
        this.state = {abonnement: [], historique: [], token: '', loading: true};
        /* this.state = {
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

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('client'))
        if (user)
            this.state.token = user.client.token
        this.getabonnement();
        ///  this.setState({loading: false})
    }

    getabonnement() {
        axios.get(`api/subscription/get/` + this.state.token + '/-1').then(abonnement => {
            this.setState({abonnement: abonnement.data.subscription}, () => this.getHistorique())
        })
    }

    getHistorique() {
        axios.get(`api/subscription/historique/` + this.state.token).then(res => {
            this.setState({historique: res.data.subscription, loading: false})
        })
    }


    render() {
        let loading = this.state.loading

        if (this.state.redirectOffre) {
            return <Redirect to='/abonnement-encours'/>;
        } else return (
            <div className={"profil_blocks Reservation"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-12 my-3"}>
                            <h5 className={"centrage-y"}>Mon compte > Abonnement en cours</h5>
                        </div>
                    </div>
                </div>
                {loading ?
                    <p className={'text-center my-5'}>
                        <span className="fa fa-spin fa-spinner fa-4x"></span>
                    </p>
                    :
                    <>
                        <div className={"container p-4"}>


                            {this.state.abonnement.length > 0 ?
                                <div className={"row mb-3 bg-white "} style={{borderRadius: 20}}>
                                    <div className={"col-12 pt-4 mb-4"}>
                                        {this.state.abonnement.map((order, key) =>
                                            <div className={"row"} key={'abonnment-' + order.id}>
                                                <div className={' col-md-12 px-2 py-4 '}>
                                                    <div className={"row"}>
                                                        <div className={"col-md-6 text-left mb-3"}>


                                                            <h6>
                                                                <p style={{color: '#a2a2a2'}}>Votre abonnement activé
                                                                </p>
                                                                {order.abonnement.name == 'Mois' ? "Pass Découverte" : "Pass Liberté"}
                                                            </h6>
                                                        </div>
                                                        <div className={"col-md-6 text-right  mb-3"}>
                                                            {order.canceled ?
                                                                <span className={"btnCancel"} style={{borderRadius: 9}}>
                                                                    Annulé

                                                                </span> : <button className={"btnCancel"}
                                                                                  style={{borderRadius: 9}}
                                                                                  onClick={() => {
                                                                                      this.setState({
                                                                                          showModalAnn: true,
                                                                                          orderId: order.id
                                                                                      })
                                                                                  }}>Annuler Mon abonnement

                                                                </button>}


                                                        </div>
                                                        <div className={"col-md-6 text-left"}>
                                                            <h6 className={"DarkgrayText"}>Abonné</h6>
                                                        </div>
                                                        <div className={"col-md-6 text-right"}>
                                                            <p className={"DarkgrayText"}>{order.nameUser}</p>
                                                        </div>

                                                        <div className={"col-md-6 text-left"}>
                                                            <h6 className={"DarkgrayText"}>Durée</h6>
                                                        </div>
                                                        <div className={"col-md-6 text-right"}>
                                                            <p
                                                                className={"DarkgrayText"}>{order.abonnement.name}</p>
                                                        </div>

                                                        <div className={"col-md-6 text-left"}>
                                                            <h6 className={"DarkgrayText"}>Début de l'abonnement</h6>
                                                        </div>
                                                        <div className={"col-md-6 text-right"}>
                                                            <p className={"DarkgrayText"}> {order.start}</p>
                                                        </div>
                                                        <div className={"col-md-6 text-left"}>
                                                            <h6 className={"DarkgrayText"}>Date de renouvellement</h6>
                                                        </div>
                                                        <div className={"col-md-6 text-right"}>
                                                            <p className={"DarkgrayText"}> {order.end}</p>
                                                        </div>
                                                        <div className={"col-md-12 "}>
                                                            <hr/>
                                                        </div>

                                                        <div className={"col-md-12 text-right"}>
                                                            <p style={{whiteSpace: 'nowrap'}}>
                                                                <big style={{
                                                                    fontSize: "xxx-large",
                                                                    fontFamily: 'Gordita_Bold'
                                                                }}>{order.abonnement.amount / 100} €
                                                                </big>
                                                                <sub>/{order.abonnement.name}</sub>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                :
                                <div className={"row "}>
                                    <div className={'col-12 pt-5 mb-4 text-center'}>
                                        <LazyLoadImage src={"/images/noAbnmnt.png"} alt={"rocket"}
                                             style={{marginBottom: 20}}
                                             width={'120px'}/>
                                        <br/>Aucun abonnement pour le moment, tu rates un super bon plan !
                                    </div>
                                </div>
                            }


                        </div>
                        {this.state.historique.length ?
                            <>
                                <div className={"container py-2 px-4"}>
                                    <div className={"row"}>
                                        <div className={"col-12 my-3"}>
                                            <h5 className={"centrage-y"}>Historique de facturation</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className={"container p-4"}>
                                    <div className={"row headerHisFact"}>
                                        <div className={"col-md-5"}>
                                            <label>Facture</label>
                                        </div>
                                        <div className={"col-md-2"}>
                                            <label>Montant</label>
                                        </div>
                                        <div className={"col-md-3"}>
                                            <label>Date</label>
                                        </div>
                                        <div className={"col-md-2"}>
                                            <label>Status</label>
                                        </div>
                                    </div>
                                    <div className={"row bodyHisFact"}>
                                        {this.state.historique.map(his =>
                                            <div className={"colHisFact col-md-12 p-2 bg-white"}
                                                 key={'historique-' + Math.random()}>
                                                <div className={"row "}>
                                                    <div className={"col-md-5"} style={{justifyContent: 'left'}}>
                                                        {his.abonnement.name == 'Mois' ? "Pass Découverte" : "Pass Liberté"}
                                                    </div>
                                                    <div className={"col-md-2"}>
                                                        {his.abonnement.amount / 100} €
                                                    </div>
                                                    <div className={"col-md-3 text-capitalize"}>
                                                        {moment(new Date(his.start.split('-')[2] + "-" + his.start.split('-')[1] + "-" + his.start.split('-')[0] + "T" + "12:00")).locale('fr').format('MMMM YYYY')}
                                                    </div>

                                                    <div className={"col-md-2"}>
                                                        <span
                                                            className={his.status == 'Payé' ? 'btnValider' : 'btnCancel'}
                                                            style={{borderRadius: 50, fontSize: 12}}>
                                                            <FontAwesomeIcon style={{fontSize: 12, marginRight: 5}}
                                                                             icon={his.status == 'Payé' ? faCheck : faTimes}/>
                                                            {his.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </> : null}
                    </>
                }
                <Modal visible={this.state.showModalAnn}
                       title={'Annulation'}
                       className={'annulationPopup'}
                       footer={
                           [
                               <Button className={'alertAnn'} onClick={() => {
                                   this.setState({showModalAnn: false})
                                   axios.get(`api/subscription/cancel/` + this.state.orderId + `/` + this.state.token).then(res => {
                                       const modal = Modal.success({
                                           content: (
                                               <div className={"text-center"}
                                                    key={'cancel-order-' + Math.random()}>
                                                   <LazyLoadImage src={"/images/logo.png"}
                                                        alt={"bagzee"}
                                                        width={'65px'}/>

                                                   <p className={"text-success pt-2"}>
                                                       {res.data.message}
                                                   </p>

                                               </div>),
                                           okText: 'ok',
                                       });
                                       setTimeout(() => {
                                           this.setState({redirectOffre: true})
                                       }, 2000);
                                       // this.getabonnement()
                                   })
                               }}>Oui</Button>,
                               <Button className={'alertAnn'}
                                       onClick={() => this.setState({showModalAnn: false})}>
                                   Non</Button>
                           ]
                       }
                >
                    <div className={"container"}>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <p>Êtes-vous certain de vouloir annuler
                                    <br/>
                                    votre
                                    abonnement ?
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default Abonnement;
