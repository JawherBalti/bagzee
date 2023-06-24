import React, {Component} from 'react';
import Footer from "./Footer";
import Annonces from "./profil-blocks/Annonces";
import Avis from "./profil-blocks/Avis";
import Informations from "./profil-blocks/sousMenu/Informations";
import {BrowserRouter, Link, NavLink, Route, Switch} from "react-router-dom";
import {Redirect} from 'react-router';
import Seo from "../hooks/seo";
import DetailActivity from "./DetailActivity";
import TchatGroup from "./profil-blocks/TchatGroup";
import Statut from "./profil-blocks/Statut";
import VitrinePartenaire from "./VitrinePartenaire";
import {messageService} from "../lib/Services";
import Profil from "./profil-blocks/Profil";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {Button, Modal, notification} from "antd";
import Header from "./Header";
import {withTranslation, Trans} from "react-i18next";
import RecapAnnonceDemandeListeProp from "./profil-blocks/RecapAnnonceDemandeListeProp";
import RecapAnnonceDemandeListPort from "./profil-blocks/RecapAnnonceDemandeListPort";
import {signOut} from "firebase/auth";
import {auth} from "../hooks/firebase";
import {user} from '../app'
import {FacebookShareButton} from "react-share";
import Horaires from "./profil-partenaire-blocks/profil-blocks/Horaires";
import ReservationPaiement from "./profil-blocks/ReservationPaiement";

class ProfilClient extends Component {
    constructor() {
        super();
        this.state = {
            client: {
                badge: [],
                birdh: "1991-06-01",
                centre_interet: [],
                createdAt: "10-02-2022 12:16",
                customerId: "cus_MdrHHdDfvQAvV0",
                departement: null,
                description: "",
                email: "chokri1985@gmail.com",
                firstName: "chokri",
                gender: "Mr",
                id: 132,
                lastName: "siala",
                nbreTicket: 10,
                phone: "06000000",
                photo: "",
                token: "xxx",
                nationalite: "france"
            },
            redirect: false,
            showModal: false

        };
        if (user) {

            this.state.client.token = user.client.token
            this.state.client.photo = user.client.photo
            this.state.client.firstName = user.client.firstName
        }
        this.logout = this.logout.bind(this);
        window.scrollTo(0, 0);
    }

    logout() {
        localStorage.clear();

        signOut(auth).then(() => {
            this.setState({redirect: true});
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
        //go to home page
    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.villeHistory.unsubscribe();
    }

    componentDidMount() {

        this.villeHistory = messageService.getMessage().subscribe(message => {
            if (this.props.location.state) {
                console.log('my ville (location state) === ' + this.props.location.state.myville)
                this.setState({okVille: 'ville-' + this.props.location.state.myville});
            } else if (message.text.includes('ville-')) {
                console.log('okVille (message text)' + JSON.stringify(message.text))
                this.setState({okVille: message.text});

            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });

    }

    render() {
        const {t} = this.props;

        function canUseWebP(img) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') > -1) {
                if (ua.indexOf('chrome') > -1) {
                    return '/images/' + img + '.webp'
                } else {
                    return '/images/' + img + '.png'
                }
            }
        }


        if (this.state.redirect || user == null) {
            return <Redirect to='/'/>;
        } else {
            return (
                <div className={"profil h-100"}>
                    <Header/>
                    <BrowserRouter>
                        <div className={"container mt-3"}>
                            <div className={"row"}>
                                <div className={"col-md-12 py-0 text-left"}>
                                    <ul className={"Navbar_Profil"}>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={"/informations"}>{user.client.isPointRelais ? t('mesInfoPro') : t('mon_profil')}</NavLink>
                                        </li>
                                        {user.client.isPointRelais ? null :
                                            <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                         to={"/tchat-group"}>{t('mes_messages')}</NavLink></li>}
                                        {user.client.isPointRelais ?
                                            <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                         to={"/reservations-paiements"}>{ t('reservationPaiement')}</NavLink>
                                            </li>
                                            : <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                           to={"/annonces"}>{t('mes_annonces')}</NavLink>
                                            </li>}
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={"/mes-avis"}>{t('mes_avis')}</NavLink></li>
                                        {user.client.isPointRelais ? null :
                                            <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                         to={"/mon-statut"}>{t('mon_statut')}</NavLink></li>}
                                        {!user.client.isPointRelais ? null :
                                            <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                         to={"/horaires"}>{t('horaires')}</NavLink></li>}
                                        {user.client.isPointRelais ? null : <li>
                                            <button className={"nav-link"} onClick={() => {
                                                /*this.reserver(act)*/
                                                this.setState({showModal: true})
                                            }}>{t('inviter_ami')}
                                            </button>
                                            <Modal open={this.state.showModal} className={'invit_ami'}
                                                   onCancel={() => this.setState({showModal: false})} footer={
                                                [<FacebookShareButton className={'ant-btn ant-btn-default btnBlue'}
                                                                      url={"https://dev.bagzee.fr/"}
                                                                      quote={"Bagzee"}
                                                                      hashtag="#Bagzee">{t('btns.share_fb')}</FacebookShareButton>,
                                                    <a href={"mailto:?body=" + window.location.origin + "&subject=Bagzee"}
                                                       key={'email'} className={'ant-btn ant-btn-default btnBlue'}
                                                       onClick={() => {
                                                       }}>{t('btns.envoyerEmail')}</a>,
                                                    <Button key={'email'} className={'btnBlue'}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(window.location.origin);
                                                                notification.open({
                                                                    message: `Copié`,
                                                                    placement: 'topLeft',

                                                                });
                                                            }}>{t('btns.copyLink')}</Button>,
                                                    <div className={'text-center'}>
                                                        <small>{t('paragFooter_modal_invit_ami1')}</small>
                                                        <br/>
                                                        <small>{t('paragFooter_modal_invit_ami2')}</small>
                                                    </div>]}>
                                                <div style={{
                                                    position: 'absolute',
                                                    background: 'url(/images/invitAmiTriangle.png',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: '100% 100%',
                                                    backgroundSize: 'auto',
                                                    maxWidth: '320px'
                                                }}>
                                                    <div className={'dialogueOrange w-100'}
                                                         style={{marginBottom: '45px', backgroundColor: '#F68A2B'}}>
                                                        <h4 className={'text-white text-uppercase text-left'}>
                                                            <Trans i18nKey={'dialogue_invit_ami'}>PARTAGE<br/>TON BON
                                                                PLAN<br/>BAGZEE AVEC<br/>TES AMIS</Trans>
                                                        </h4>

                                                    </div>
                                                </div>
                                                <LazyLoadImage src={canUseWebP("imgInvitAmi")} alt={"imgInvitAmi"}
                                                               className={'mx-auto'}
                                                               style={{padding: '10% 10px 10px', width: '80%'}}/>

                                                <br/>
                                                <h2 className={'text-center mb-3'}>
                                                    <Trans i18nKey={'modal_invit_ami'}>
                                                        Gagne 10% *<br/>sur ton prochain trajet
                                                    </Trans>
                                                </h2>
                                                <p className={'text-center'}>
                                                    <Trans i18nKey={'parag_modal_invit_ami'}>
                                                        Choisis l'une des 3 options ci-dessous<br/>
                                                        pour inviter un ami sur Bagzee !

                                                    </Trans>
                                                </p>

                                            </Modal></li>}


                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={"container-fluid"}
                             style={{minHeight: 'calc(100% - 454px)'}}>

                            <Route path="/*" render={(props) => <Seo {...props} /* possible prop injection */ />}/>
                            <Switch>
                                <Route path="/demande-liste-proprietaire"
                                       render={(props) => <RecapAnnonceDemandeListeProp {...props}/>}/>
                                <Route path="/demande-liste-porteur"
                                       render={(props) => <RecapAnnonceDemandeListPort {...props}/>}/>
                                <Route exact path={user.client.isPointRelais ? "/(informations|profil)" : "/profil"}
                                       render={(props) => <Informations {...props}/>}/>
                                <Route exact path="/profil" components={this.props.location.pathname.split('/')}/>
                                <Route path="/annonces" render={(props) => <Annonces {...props}/>}/>
                                <Route path="/reservations-paiements" render={(props) => <ReservationPaiement {...props}/>}/>
                                <Route path="/mes-avis" render={(props) => <Avis {...props}/>}/>
                                {!user.client.isPointRelais ? null :
                                    <Route path="/horaires" render={(props) => <Horaires {...props}/>}/>}
                                {user.client.isPointRelais ? null :
                                    <Route path="/mon-statut" render={(props) => <Statut {...props}/>}/>}
                                {user.client.isPointRelais ? null :
                                    <Route path="/tchat-group" render={(props) => <TchatGroup {...props}/>}/>}
                                {user.client.isPointRelais ? null : <Route
                                    path="/(mes-documents|informations|mes-bagages-mon-vehicule|mes-alertes|moyen-paiement|mon-compte)/"
                                    render={(props) => <Profil {...props}/>}/>}
                            </Switch>
                        </div>
                    </BrowserRouter>
                    <Footer/>
                </div>
            )
        }
    }
}

export default withTranslation()(ProfilClient);