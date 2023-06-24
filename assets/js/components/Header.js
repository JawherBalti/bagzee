import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faEnvelope, faSignOutAlt, faUserAlt} from "@fortawesome/free-solid-svg-icons";
import Login from "./Login";
import {Container, Nav, Navbar} from "react-bootstrap";
import {Button, Select} from "antd";
import 'moment/locale/fr';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import MySelectLang from "./MySelectLang";
import {withTranslation} from "react-i18next";
import {auth} from "../hooks/firebase";
import {signOut} from "firebase/auth";
import {user} from '../app'

const {Option} = Select;

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            client: {},
            partenaire: {
                token: '',
                firstName: ''
            },
            lang: [{
                id: '0',
                name: 'Fr'
            }, {
                id: '0',
                name: 'En'
            },],
            visibleSubscribe: false,
            loading: true
        };

        let part = JSON.parse(localStorage.getItem('partenaire'))
        if (user) {
            console.log(user)
            this.state.client.token = user.client.token
            this.state.client.photo = user.client.photo
            this.state.client.firstName = user.client.firstName
        }
        if (part) {
            this.state.partenaire.token = part.partenaire.token
            this.state.partenaire.firstName = part.partenaire.firstName
        }
        if (window.location.pathname.split('-')[0] + window.location.pathname.includes("detail-activite-")) {
            this.detail = true;
        }
    }


    logout() {
        localStorage.clear();

        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
        window.location.reload(false);
        //go to home page
    }

    render() {

        const {t} = this.props;

        const jour = [];
        for (let i = 1; i <= 31; i++) {
            jour.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{(i < 10 ? "0" : "") + i.toString()}</Option>);
        }
        const mois = [];
        for (let i = 1; i <= 12; i++) {
            mois.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{(i < 10 ? "0" : "") + i.toString()}</Option>);
        }
        const annee = [];
        for (let i = 1900; i <= 2004; i++) {
            annee.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{i.toString()}</Option>);
        }

        function handleChange(jours) {
            console.log(`Selected: ${jours}`);
        }


        return (
            <>

                <div className="container-fluid bg-white px-5 sticky-top">
                    <nav className="navbar row d-none d-lg-flex  py-0">
                        <div style={{width: 145}}>
                            <Link className={"navbar-brand mr-0"} to={"/"}>
                                <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}/>
                            </Link>
                        </div>
                        <ul className="ul-list mb-0 justify-content-end gap-xl-3 gap-2"
                            style={{width: 'calc( 100% - 160px )'}}>
                            {this.state.client.token ? <>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"/comment-ca-marche"}>
                                        {t('page_home.comment_ca_marche')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"/pourquoi-bagzee"}>
                                        {t('page_home.pourquoi_bagzee')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"/partenaires-points-relais"}>
                                        {t('page_home.partenaires_points_relais')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"/securite"}>
                                        {t('page_home.proteger_vos_bagages')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"/contact"}>
                                        {t('page_home.contact')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link"} to={"https://blog.bagzee.fr/"}>
                                        {t('page_home.blog')}
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <MySelectLang key={"mySelect"+Math.random()} children={this.state.lang}/>

                                </li>
                                <li className="list-item">
                                    <Link className={"nav-link p-0"} to={"/informations"}>
                                        <Button style={{width: 45, height: 45, background: "#4BBEED"}}
                                                className={'rounded-circle text-white border-none d-block'}
                                        >
                                            <FontAwesomeIcon icon={faUserAlt}/>
                                        </Button>
                                    </Link>
                                </li>

                                {user.client.isPointRelais?null:<li className="list-item">
                                    <Link className={"nav-link p-0"} to={"/tchat-group"}>
                                        <FontAwesomeIcon icon={faEnvelope}/>
                                    </Link>
                                </li>}
                                <li className="list-item">
                                    <Link className={"nav-link p-0"} to={"/mes-alertes"}>
                                        <FontAwesomeIcon icon={faBell}/>
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <button className={"logout"} onClick={() => this.logout()}>
                                        <FontAwesomeIcon icon={faSignOutAlt}/>
                                    </button>
                                </li>
                            </> : this.state.partenaire.token ? <>
                                    <li className="list-item partenaire">
                                        <Link className={"nav-link d-inline-block"} to={"/profil-partenaire"}>
                                            <span
                                                className={' firstLetterUpper pl-2'}> {this.state.partenaire.nomStructure}</span>
                                        </Link>
                                        <button className={"logout d-inline-block "} onClick={this.logout}>
                                            <FontAwesomeIcon icon={faSignOutAlt}/>
                                        </button>
                                    </li>
                                </> :
                                <>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/comment-ca-marche"}>
                                            {t('page_home.comment_ca_marche')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/pourquoi-bagzee"}>
                                            {t('page_home.pourquoi_bagzee')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/partenaires-points-relais"}>
                                            {t('page_home.partenaires_points_relais')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/securite"}>
                                            {t('page_home.proteger_vos_bagages')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/contact"}>
                                            {t('page_home.contact')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"https://blog.bagzee.fr/"}>
                                            {t('page_home.blog')}
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <MySelectLang key={"mySelect"+Math.random()} children={this.state.lang}/>

                                    </li>
                                    <li className="list-item">
                                        <Login isPRelais={false}/>
                                    </li>
                                    {/*<li className="list-item">
                                        <CollectionsPageSubscribe/>
                                    </li>
                                    <li className="list-item">
                                        <Login/>
                                    </li>
                                    <li className="list-item" style={{cursor: 'pointer'}}>
                                        <SubscribePartenaire/>
                                    </li>*/}
                                </>
                            }

                        </ul>
                    </nav>
                </div>
                <Navbar fixed={'top'} bg='light' expand={'lg'} className={'d-block d-lg-none p-1'}>
                    <Container>
                        <Navbar.Brand>
                            <Link className={"navbar-brand ml-2"} to={"/"}>
                                <LazyLoadImage src={"/images/logo.png"} width={'80px'} alt={"bagzee"}/>
                            </Link>
                        </Navbar.Brand>
                        <MySelectLang key={"mySelect"+Math.random()} children={this.state.lang}/>
                        {this.state.client.token ?
                            <>
                                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto text-right p-2">
                                        <Nav.Link href={"/comment-ca-marche"}>
                                            {t('page_home.comment_ca_marche')}
                                        </Nav.Link>
                                        <Nav.Link href={"/pourquoi-bagzee"}>
                                            {t('page_home.pourquoi_bagzee')}
                                        </Nav.Link>
                                        <Nav.Link href={"/partenaires-points-relais"}>
                                            {t('page_home.partenaires_points_relais')}
                                        </Nav.Link>
                                        <Nav.Link href={"/securite"}>
                                            {t('page_home.proteger_vos_bagages')}
                                        </Nav.Link>
                                        <Nav.Link href={"/contact"}>
                                            {t('page_home.contact')}
                                        </Nav.Link>
                                        <Nav.Link href={"https://blog.bagzee.fr/"}>
                                            {t('page_home.blog')}
                                        </Nav.Link>
                                        <Nav.Link href={"/informations"}>
                                            <span className={' firstLetterUpper pl-2'}>{t('mes_informations')}</span>
                                        </Nav.Link>
                                        <Nav.Link className={"nav-link"} to={"/tchat-group"}>
                                            {t('mes_messages')}
                                        </Nav.Link>
                                        <Nav.Link className={"nav-link"} to={"/mes-alertes"}>
                                           {t('mes_alertes')}
                                        </Nav.Link>
                                        <Nav.Link onClick={this.logout}>
                                            <span className={' firstLetterUpper pl-2'}>
                                                {t('deconnexion')}
                                            </span>
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>

                            </> :
                            this.state.partenaire.token ?
                                <>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto text-right p-2">
                                            <Nav.Link href={"/profil-partenaire"}>
                                                Mon profil
                                            </Nav.Link>
                                            <Nav.Link onClick={this.logout}>
                                                <span className={' firstLetterUpper pl-2'}>
                                                    <FontAwesomeIcon
                                                        icon={faSignOutAlt}/>
                                                    {t('deconnexion')}
                                                </span>
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                </> :
                                /*<>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto text-right p-2">
                                            <Nav.Link>
                                                <CollectionsPageSubscribe/>
                                            </Nav.Link>

                                            <Nav.Link>
                                                <Login/>
                                            </Nav.Link>
                                            <Nav.Link>
                                                <SubscribePartenaire/>
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </>*/
                                <>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto text-right p-2">
                                            <Nav.Link href={"/comment-ca-marche"}>
                                                {t('page_home.comment_ca_marche')}
                                            </Nav.Link>
                                            <Nav.Link
                                                href={"/pourquoi-bagzee"}>{t('page_home.pourquoi_bagzee')}</Nav.Link>
                                            <Nav.Link href={"/partenaires-points-relais"}>
                                                {t('page_home.partenaires_points_relais')}
                                            </Nav.Link>
                                            <Nav.Link href={"/securite"}>
                                                {t('page_home.proteger_vos_bagages')}
                                            </Nav.Link>
                                            <Nav.Link href={"/contact"}>
                                                {t('page_home.contact')}
                                            </Nav.Link>
                                            <Nav.Link href={"https://blog.bagzee.fr/"}>
                                                {t('page_home.blog')}
                                            </Nav.Link>
                                            <Nav.Link href={"https://blog.bagzee.fr/"}>
                                                <Login isPRelais={false}/>
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                </>
                        }

                    </Container>
                </Navbar>
            </>
        )
    }
}

export default withTranslation()(Header);