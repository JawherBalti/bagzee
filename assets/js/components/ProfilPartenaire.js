import React, {Component} from 'react';
import Footer from "./Footer";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Informations from "./profil-partenaire-blocks/Informations";
import Profil from "./profil-partenaire-blocks/Profil";
import Dashbord from "./profil-partenaire-blocks/Dashbord";
import {BrowserRouter, Link, NavLink, Route, Switch} from "react-router-dom";
import {Redirect} from 'react-router';
import Seo from "../hooks/seo";
import Evenement from "./profil-partenaire-blocks/Evenement";
import Contact from "./profil-partenaire-blocks/Contact";
import ModalAddActivity from "./profil-partenaire-blocks/profil-blocks/ModalAddActivity";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class ProfilPartenaire extends Component {
    constructor() {
        super();
        this.state = {
            partenaire: {
                photo: '',
                token: '',
                firstName: ''
            },
            redirect: false

        };
        let user = JSON.parse(localStorage.getItem('partenaire'))
        if (user) {
            this.state.partenaire = user.partenaire
        }
        this.logout = this.logout.bind(this);
        window.scrollTo(0, 0);
    }

    logout() {
        localStorage.clear();
        this.setState({redirect: true});
        //go to home page
    }

    render() {
        let user = JSON.parse(localStorage.getItem('partenaire'))
        if (this.state.redirect || user == null) {
            return <Redirect to='/'/>;
        } else {
            return (
                <div className={"profil h-100"}>
                    <BrowserRouter>
                        <div className={"Header_Profil p-3"}>
                            <div className={"row"}>
                                <div className={"col-md-8 text-left"}>
                                    <Link className={"navbar-brand"} to={'/profil-partenaire'}>
                                        <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} width={'65px'}/>
                                    </Link>
                                    <ul className={"Navbar_Profil d-block d-sm-inline-flex"}>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={{
                                                         pathname: "/dashbord-partenaire",
                                                         state: {partenaire: this.state.partenaire}
                                                     }}>Tableau de bord</NavLink></li>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={{
                                                         pathname: "/evenement-partenaire",
                                                         state: {partenaire: this.state.partenaire}
                                                     }}>Évènenement</NavLink></li>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={{
                                                         pathname: "/mon-profil-partenaire",
                                                         state: {partenaire: this.state.partenaire}
                                                     }}>Mon profil</NavLink></li>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={{
                                                         pathname: "/informations-partenaire",
                                                         state: {partenaire: this.state.partenaire}
                                                     }}>Mes informations</NavLink></li>
                                        <li><NavLink activeClassName={"active"} className={"nav-link"}
                                                     to={{
                                                         pathname: "/contact-partenaire",
                                                         state: {partenaire: this.state.partenaire}
                                                     }}>Contact</NavLink></li>
                                    </ul>

                                    <button className={"logout d-block d-md-none position-absolute"} style={{right:'10px',top:'10px'}} onClick={this.logout}>
                                        <FontAwesomeIcon icon={faSignOutAlt}/>
                                    </button>
                                </div>
                                <div className={"col-md-4 text-right  d-none d-md-inline-block"}>
                                    <button className={"btnProfil"}>
                                    <span
                                        className={' firstLetterUpper pl-2'}> {this.state.partenaire.nomStructure}</span>

                                    </button>
                                    <button className={"logout"} onClick={this.logout}>
                                        <FontAwesomeIcon icon={faSignOutAlt}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={"container-fluid  py-5"} style={{minHeight:'calc(100% - 418px)'}}>
                            <div className="col-md-12 text-right">
                                <ModalAddActivity token={user.partenaire.token}/>
                            </div>
                            <Route path="/*" render={() => <Seo /* possible prop injection */ />}/>
                            <Switch>
                                <Route exact path="/profil-partenaire" render={(props) => <Informations {...props}/>}/>
                                <Route exact path="/profil-partenaire"
                                       components={this.props.location.pathname.split('/')}/>
                                <Route
                                    path="/(photos|horaires|activités|info-vitrine|mon-profil-partenaire|dupliquer-activité|update-activite)"
                                    component={(props) => <Profil {...props}/>}/>
                                <Route path="/evenement-partenaire" render={(props) => <Evenement {...props}/>}/>
                                <Route path="/informations-partenaire" render={(props) => <Informations {...props}/>}/>
                                <Route path="/dashbord-partenaire" render={(props) => <Dashbord {...props}/>}/>
                                <Route path="/contact-partenaire" render={(props) => <Contact {...props}/>}/>
                            </Switch>
                        </div>
                    </BrowserRouter>
                    <Footer/>
                </div>
            )
        }
    }
}

export default ProfilPartenaire;