// ./assets/js/components/HomePageXD.js

import React, {Component,useRef} from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faHeart, faLock, faSignOutAlt, faTimes, faUsers} from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import ReactHorizontalDatePicker from "react-horizontal-strip-datepicker";
import 'react-horizontal-strip-datepicker/dist/ReactHorizontalDatePicker.css'
import axios from "axios";
import moment from "moment"
import Subscribe from "./Login";
import {Button, Input, Modal} from "antd";
import {Container, Nav, Navbar} from "react-bootstrap";
import DetailActivity from "./DetailActivity";
import PartageBlock from "./PartageBlock";
import Block404 from "./Block404";
import SubscribePartenaire from "./subscribePartenaire";

var bgHeader = '/images/bgHeader.png';



class Home extends Component {
    constructor() {
        super();

        this.state = {
            allActivities: [
                {
                    adresse: "Agen",
                    date: moment().format("YYYY-MM-DD"),
                    token: "",
                    villePhoto:''
                }
            ],
            isNotToday: false,
            activity: [],
            showModal: false,
            myAct: {},
            qty: 1,
            time: {},
            seconds: 5000,
            client: {
                photo: '',
                token: '',
                firstName: ''
            },
            partenaire: {
                token: '',
                firstName: ''
            },
            ville: [],
            myTimer:[{timer: '', value: ''}]
        };

        this.handleChange = this.handleChange.bind(this);
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.checkFavoris = this.checkFavoris.bind(this);
        let user = JSON.parse(localStorage.getItem('client'))
        let part = JSON.parse(localStorage.getItem('partenaire'))
        if (user) {

            this.state.client.token = user.client.token
            this.state.client.photo = user.client.photo
            this.state.client.firstName = user.client.firstName
        }
        if (part) {
            this.state.partenaire.token = part.partenaire.token
            this.state.partenaire.firstName = part.partenaire.firstName
        }
    }

    secondsToTime(secs) {

        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        hours=hours<10?('0'+hours):hours;
        minutes=minutes<10?('0'+minutes):minutes;
        seconds=seconds<10?('0'+seconds):seconds;
        //  let obj = hours + ':' + minutes + ':' + seconds
        let obj = hours + ':' + minutes + ':' + seconds;

        return obj;
    }

    startTimer(hfrom,x) {

        // this.refs.current[x]="poisdf";


        const hms = moment().format("H:mm:ss");

        const [hours, minutes, seconds] = hms.split(':');
        const [hoursF, minutesF] = hfrom.split(':');
        const totalSecondeFrom = (hoursF * 60 * 60) + (minutesF * 60)
        const totalSeconds = (hours * 60 * 60) + (minutes * 60) + (seconds * 1)
        let newTotalSeconds = totalSecondeFrom - totalSeconds;

        if(newTotalSeconds<0){
            clearInterval(this.state.myTimer[x].timer)
        }else{


            this.myTimer[x].value=this.secondsToTime(newTotalSeconds);
            this.setState(prev=>({
                myTimer:prev.myTimer.map((myTime,i)=>
                    (x===i ?Object.assign(myTime, {timer: myTime.timer,value:this.secondsToTime(newTotalSeconds)}) : myTime)
                )
            }))

            //return this.secondsToTime(newTotalSeconds)
        }
    }


    handleChange(event) {

        if (event.target.name == 'adresse') {
            const index = event.target.selectedIndex;
            const el = event.target.childNodes[index]
            const option =  el.getAttribute('id');
            this.setState({
                allActivities: [{
                    token: this.state.client.token,
                    date: this.state.allActivities[0].date,
                    adresse: event.target.value,
                    villePhoto:option,
                }]
            });
            axios.post('api/activity/all', {
                "date": this.state.allActivities[0].date,
                "adresse": event.target.value,
                "token": this.state.client.token,

            }).then(response => {

                    this.myTimer=Array(response.data.activity.length).fill({timer:null,value:0});
                    (response.data.activity).forEach((el, index) => {
                        this.myTimer[index]= {timer:setInterval(() => {this.startTimer(el.hFrom,index)},1000),value:50};
                    });
                    this.setState({myTimer: this.myTimer})
                    this.setState({activity: response.data.activity})
                }
            )
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

        componentDidMount() {
     window.scrollTo(0, 0);
        // this.refs.current = [];
        let villeName = this.props.location.state.villeName
        let villePhoto = this.props.location.state.villePhoto
        this.setState(prev => ({
            allActivities: [{
                ...prev.allActivities[0],
                adresse: villeName,
                villePhoto:villePhoto
            }]
        }), () => this.getAllActivities())

        axios.get('api/ville/get').then(res => {
            this.setState({ville: res.data.ville})
        })

    }



    getAllActivities() {

        axios.post('api/activity/all', {
            "date": this.state.allActivities[0].date,
            "adresse": this.state.allActivities[0].adresse,
            "token": this.state.client.token,

        }).then(response => {
                let timeLeftVar = this.secondsToTime(this.state.seconds);
                this.myTimer=Array(response.data.activity.length).fill({timer:null,value:0});
                (response.data.activity).forEach((el, index) => {
                  /*  let idTimer= setInterval(() => {this.startTimer(el.hFrom,index)},1000);*/
                    let idTimer =this.startTimer(el.date, el.hFrom)
                    this.myTimer[index]= {timer:idTimer,value:0};
                });
                this.setState({myTimer: this.myTimer})

                this.setState({activity: response.data.activity, time: timeLeftVar})

            }
        )
            .catch(function (error) {
                console.log(error);
            });
        //  this.startTimer();
    }

    checkFavoris(token, idCentre) {
        axios.post('api/check/activity/create', {
            "token": token,
            "id": idCentre,

        }).then(response => {
                if (response.data.status == false) {

                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"}>
                                <img src={"/images/logo.png"} alt={"bagzee"}  width={'65px'}/>
                                <p className={"text-danger pt-2"}>
                                    {response.data.message}
                                </p>

                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                    }, 5000);
                } else
                    this.getAllActivities();
            }
        )
            .catch(function (error) {
                console.log(error);
            });
    }
    logout() {
        localStorage.clear();
        //go to home page
    }
    reserver(item) {
        axios.post('api/order/create', {
            "activity":
                {
                    "id": item.id,
                    "date": item.date,
                    "hFrom": item.hFrom,
                    "hTo": item.hTo,
                    "price": item.price,
                    "reduce": item.reduce,
                    "nbreOfPlace": item.nbreOfPlace,

                },
            "token": this.state.client.token,
            "friend": 0

        }).then(response => {
                const modal = Modal.success({
                    content: (
                        <div className={"text-center"}>
                            {(response.data.status == false && response.data.message == 'Vous devez vous connecter') ?
                                <div>
                                    <FontAwesomeIcon icon={faTimes}/>
                                    <br/>
                                    <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez vous connecter</p>
                                </div>
                                :
                                (response.data.status == false && response.data.message == 'Activity exist in your order') ?
                                    <div>
                                        <FontAwesomeIcon icon={faTimes}/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous avez déjà réservé cette activité</p>
                                    </div>
                                    :
                                    <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                             viewBox="0 0 116 116">
                                            <g id="ok-svgrepo-com_2_" data-name="ok-svgrepo-com (2)"
                                               transform="translate(-3 -3.2)">
                                                <circle id="Ellipse_40" data-name="Ellipse 40" cx="58" cy="58" r="58"
                                                        transform="translate(3 3.2)" fill="#4caf50"/>
                                                <path id="Tracé_204" data-name="Tracé 204"
                                                      d="M73.467,14.6,35.84,52.227,20.347,36.733,12.6,44.48,35.84,67.72,81.213,22.347Z"
                                                      transform="translate(16.96 20.493)" fill="#ccff90"/>
                                            </g>
                                        </svg>
                                        <br/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}> Félicitations, votre réservation a bien été pris en compte. Vous pouvez discuter avec les autres participants de l’activité 🙂.
                                         <br/> Nous revenons vers vous dès que le partenaire aura bien validé le créneau 🙂
                                           
                                           </p>
                                    </div>}

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
            }
        )
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const calendar = (today) => {
            this.setState({
                allActivities: [{
                    token: this.state.client.token,
                    date: today,
                    adresse: this.state.allActivities[0].adresse
                }], isNotToday: true,
            });
            axios.post('api/activity/all', {
                "date": today,
                "adresse": this.state.allActivities[0].adresse,
                "token": this.state.client.token,

            }).then(response => {
                    this.setState({activity: response.data.activity})
                }
            )
                .catch(function (error) {
                    console.log(error);
                });
        }
        const selectedDay = () => {
            var today = '';
            setTimeout(function () {
                today = new Date(document.getElementsByClassName('datepicker-month-label')[0].innerHTML);
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = yyyy + '-' + mm + '-' + dd;
                calendar(today)
            }, 1000)


        };

        return (

            <div className="HomeSection">
                <div className="Header "
                     style={{backgroundImage: 'url(/images/bgHoverHeader.png),url(' + this.state.allActivities[0].villePhoto + ')'}}>
                    <div className="container">
                        <nav className="navbar row d-none d-sm-flex">
                            <div>
                                <Link className={"navbar-brand"} to={"/"}><img src={"/images/logo.png"}  width={'65px'}
                                                                               alt={"bagzee"}/>
                                </Link>
                                <select name={"adresse"} value={this.state.allActivities[0].adresse}
                                        onChange={this.handleChange}>
                                    {this.state.ville.map(ville =>
                                        <option key={ville.id} id={ville.photo} value={ville.name}>{ville.name}</option>
                                    )}
                                </select>
                            </div>
                            <ul className="ul-list">
                                {this.state.client.token ? <>
                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/favoris"}> <FontAwesomeIcon
                                            icon={faHeart}/>
                                        </Link>
                                    </li>

                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/reservation"}> Mes réservations </Link>
                                    </li>

                                    <li className="list-item">
                                        <Link className={"nav-link"} to={"/profil"}>
                                            {this.state.client.photo != '' ?
                                                <img src={this.state.client.photo}
                                                     alt={this.state.client.firstName}
                                                /> :
                                                <img src={"/images/avatar-person.png"} alt={this.state.client.firstName}
                                                />} <span
                                            className={' firstLetterUpper pl-2'}> {this.state.client.firstName}</span>
                                        </Link>

                                    </li>

                                    <li className="list-item">

                                        <button className={"logout"} onClick={this.logout}>
                                            <FontAwesomeIcon icon={faSignOutAlt}/>
                                        </button>
                                    </li>
                                </> : this.state.partenaire.token ? <>
                                        <li className="list-item partenaire">
                                            <Link className={"nav-link d-inline-block"} to={"/profil-partenaire"}>
                                                <span
                                                    className={' firstLetterUpper pl-2'}> {this.state.partenaire.firstName}</span>
                                            </Link>
                                            <button className={"logout d-inline-block"} onClick={this.logout}>
                                                <FontAwesomeIcon icon={faSignOutAlt}/>
                                            </button>

                                        </li>
                                    </> :
                                    <>
                                        <li className="list-item">
                                            <Subscribe/>
                                        </li>
                                        <li className="list-item devenirPartenaire" style={{cursor: 'pointer'}}>
                                            <SubscribePartenaire/>
                                        </li>
                                    </>
                                }


                            </ul>
                        </nav>
                    </div>
                    <Navbar fixed={'top'} bg='light' expand={'lg'} className={'d-block d-sm-none p-1'}>
                        <Container>
                            <Navbar.Brand>
                                <Link className={"navbar-brand ml-2"} to={"/"}>
                                    <img src={"/images/logo.png"} width={'40px'} alt={"bagzee"}/>
                                </Link>
                            </Navbar.Brand>
                            <select style={{maxWidth: '50%', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}
                                    name={"adresse"} value={this.state.allActivities[0].adresse}
                                    onChange={this.handleChange}>
                                {this.state.ville.map(ville =>
                                    <option key={ville.id} value={ville.name}>{ville.name}</option>
                                )}
                            </select>
                            {this.state.client.token ? <>
                                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="me-auto text-right p-2">
                                        <Nav.Link href={"/favoris"}>
                                            Mes favoris
                                        </Nav.Link>
                                        <Nav.Link href={"/reservation"}> Mes réservations </Nav.Link>
                                        <Nav.Link href={"/profil"}>
                                            <span className={' firstLetterUpper pl-2'}> Mes informations</span>
                                        </Nav.Link>
                                        <Nav.Link onClick={this.logout}>
                                            <span className={' firstLetterUpper pl-2'}> <FontAwesomeIcon icon={faSignOutAlt}/> Déconnexion</span>
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>

                            </> :this.state.partenaire.token ? <>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                                    <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto text-right p-2">
                                            <Nav.Link href={"/profil-partenaire"}>
                                                Mon profil
                                            </Nav.Link>
                                            <Nav.Link onClick={this.logout}>
                                                <span className={' firstLetterUpper pl-2'}> <FontAwesomeIcon icon={faSignOutAlt}/> Déconnexion</span>
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>

                                </> :
                                <ul className="ul-list">
                                    <li className="list-item">
                                        <Subscribe/>
                                    </li>
                                    <li className="list-item">
                                        <SubscribePartenaire/>
                                    </li>
                                </ul>
                            }

                        </Container>
                    </Navbar>

                    <h1 className={"text-center"}>Vivre une expérience à <span className={'firstLetterUpper'}
                                                                               style={{fontFamily: 'inherit',whiteSpace:'nowrap'}}>{this.state.allActivities[0].adresse} ?</span>
                    </h1>
                </div>

                <ul className="Days container">
                    <ReactHorizontalDatePicker
                        selectedDay={selectedDay}
                        enableScroll={true}

                        enableDays={80}
                        enableDaysBefore={0}
                    />
                </ul>

                {/* <ul className="Days container">
                    <li className=" selected">lundi 20 octobre</li>
                    <li>lundi 21 octobre</li>
                    <li>lundi 22 octobre</li>
                    <li>lundi 23 octobre</li>
                    <li>lundi 24 octobre</li>
                    <li>lundi 25 octobre</li>
                    <li>lundi 26 octobre</li>
                    <li className="more"><FontAwesomeIcon icon={faArrowRight}/></li>
                </ul>*/}

                <div className="Activities container">
                    <div className="row">
                        <h4 className="col-md-12 mb-5">Toutes les activités près de chez toi 👇</h4>
                        {this.state.activity.length ?
                            <>{this.state.activity.map((act,i) =>
                                <div className={'col-md-3'} key={'activity-' + act.id}>
                                    <div className="Activity">
                                        <Link to={{pathname: '/detail-activity-' + act.id, state: {myActDetail: act}}}>
                                            <div className="imgActivity"
                                                 style={{backgroundImage: `url(/images/imgHoverActuality.png),url(uploads/` + act.sousCentreInteret + `)`}}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="51.669" height="42.635"
                                                     style={{cursor: "pointer"}}
                                                     onClick={() => {
                                                         this.checkFavoris(this.state.client.token, act.id)
                                                     }} viewBox="0 0 51.669 42.635" className="favoris">
                                                    {act.isFavoris ?
                                                        <>
                                                            <g id="heart-svgrepo-com_12_"
                                                               data-name="heart-svgrepo-com (12)"
                                                               transform="translate(2.498 2.5)">
                                                                <g id="Artwork_15_1" transform="translate(0 0)">
                                                                    <g id="Layer_5_15_1" transform="translate(0 0)">
                                                                        <path id="Tracé_51" data-name="Tracé 5"
                                                                              d="M34.627,33.251c-6.327,0-10.341,7.053-11.291,7.053-.831,0-4.68-7.053-11.291-7.053A12.286,12.286,0,0,0,.021,44.976a14.092,14.092,0,0,0,2.624,8.888c3.292,5,17.686,17.022,20.713,17.022,3.092,0,17.357-11.983,20.67-17.022a14.09,14.09,0,0,0,2.624-8.888A12.285,12.285,0,0,0,34.627,33.251"
                                                                              transform="translate(0 -33.251)"
                                                                              fill="#30a3f2"
                                                                              stroke="#fff"
                                                                              strokeWidth="5"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <text id={'_' + act.nbreFavoris}
                                                                  data-name={'_' + act.nbreFavoris}
                                                                  transform="translate(19.863 30.208)"
                                                                  fill="#fff"
                                                                  fontSize="21" fontFamily="Gordita_Regular">
                                                                <tspan x="0" y="0">{act.nbreFavoris}</tspan>
                                                            </text>
                                                        </> :
                                                        <>
                                                            <g id="heart-svgrepo-com_1_"
                                                               data-name="heart-svgrepo-com (1)"
                                                               transform="translate(2.498 2.5)">
                                                                <g id="Artwork_151_" transform="translate(0 0)">
                                                                    <g id="Layer_5_15_1" transform="translate(0 0)">
                                                                        <path id="Tracé_51" data-name="Tracé 51"
                                                                              d="M34.627,33.251c-6.327,0-10.341,7.053-11.291,7.053-.831,0-4.68-7.053-11.291-7.053A12.286,12.286,0,0,0,.021,44.976a14.092,14.092,0,0,0,2.624,8.888c3.292,5,17.686,17.022,20.713,17.022,3.092,0,17.357-11.983,20.67-17.022a14.09,14.09,0,0,0,2.624-8.888A12.285,12.285,0,0,0,34.627,33.251"
                                                                              transform="translate(0 -33.251)"
                                                                              fill="#fff"
                                                                              stroke="#30a3f2"
                                                                              strokeWidth="5"/>
                                                                    </g>
                                                                </g>
                                                            </g>
                                                            <text id={'_' + act.nbreFavoris}
                                                                  data-name={'_' + act.nbreFavoris}
                                                                  transform="translate(19.863 30.208)"
                                                                  fill="#30a3f2"
                                                                  fontSize="21" fontFamily="Gordita_Regular">
                                                                <tspan x="0" y="0">{act.nbreFavoris}</tspan>
                                                            </text>
                                                        </>
                                                    }
                                                </svg>
                                                {this.state.isNotToday ? null : <span className="timer" key={i} >
                                           <h3>{this.state.myTimer[i].value} </h3>
                                        </span>}
                                            </div>
                                        </Link>
                                        <div className={"contentActivity px-3"}>
                                            <h5>{act.name}</h5>
                                            {act.price ? <h6 className="oldPrice text-right"> {act.price} €</h6> :
                                                <h6 className="text-right text-success"
                                                    style={{textDecoration: "none !important"}}>Gratuit</h6>}
                                            <p className="group"  style={{minHeight:'25px'}}>
                                                        <span className="float-left">
                                                            <FontAwesomeIcon icon={faUsers}/> {act.nbreOfPlaceRest}/{act.nbreOfPlace} participants
                                                        </span>
                                                <span className="float-right">
                                                            <span className="newPrice">{act.price ? act.price - ((act.price * act.reduce) / 100) + '€' : null}</span>
                                                        </span>

                                            </p>
                                            <p className="horaire"  style={{minHeight:'25px'}} >
                                                <span className="float-left">
                                                    <FontAwesomeIcon icon={faClock}/> {act.hFrom}-{act.hTo}
                                                </span>
                                                <span className="float-right">
                                                    {act.reduce > 0 ? '-' + act.reduce + '%' : null}
                                                </span>
                                            </p>
                                            {/* button isReserver*/}
                                            <button className={"btn-default w-100 isReserver"} onClick={() => {
                                                /*this.reserver(act)*/
                                                this.setState({showModal: true,myAct:act})
                                            }}>Réserver
                                            </button>
                                            <Modal visible={this.state.showModal}
                                                   onCancel={() => this.setState({showModal: false})} footer={
                                                [<Button key={'submit'} type={'primary'} className={'w-100'} onClick={() => {
                                                    this.reserver(this.state.myAct);
                                                    this.setState({showModal: false})
                                                }
                                                }>Payer</Button>,
                                                    <div className={'text-left'}>
                                                        <h5 className={'mt-5'}>Vos informations de paiement</h5>
                                                        <p style={{color: '#939393'}}><FontAwesomeIcon icon={faLock}/> Paiement
                                                            100% sécurisé</p>
                                                        <img src={"/images/masterCard.png"} alt={'masterCard'} width={"40px"}
                                                             className={'pr-2'}/>
                                                        <img src={"/images/visa.png"} alt={'visa'} width={"40px"}
                                                             className={'pr-2'}/>
                                                        <img src={"/images/amex.png"} alt={'amex'} width={"40px"}/><br/>
                                                        <img src={"/images/stripe.png"} alt={'amex'} height={"30px"}/>
                                                    </div>]}>
                                                <img src={'uploads/' + this.state.myAct.sousCentreInteret} alt={this.state.myAct.name}
                                                     className={'imgInmodal'}/>
                                                <h6 className={'mb-4'}>{this.state.myAct.name}</h6>
                                                <p className={'pl-3'}
                                                   style={{color: '#939393'}}>{this.state.myAct.date}<br/>X {this.state.qty} Réservation{this.state.qty > 1 ? <>s</> : null}
                                                </p>
                                                <br/>
                                                {this.state.qty > 1 ? <div className={'my-3'}>
                                                    <h5>Renseignez l’email de votre/vos
                                                        accompagnant(s)</h5>
                                                    <label style={{
                                                        color: '#939393',
                                                        fontFamily: 'Gordita_Medium'
                                                    }}>Email</label>
                                                    <Input className={'py-2'} type={'email'} required={false}
                                                           placeholder={'Exemple: email-1@xx.com,email-2@xx.com'}/>

                                                </div> : null}
                                                {this.state.myAct.price ?
                                                    <div className={'row'}>
                                                        <div className={'col-8'}><h5>Total</h5></div>
                                                        <div className={'col-4 text-right'}><h5 className="newPrice">
                                                            {(this.state.myAct.price - ((this.state.myAct.price * this.state.myAct.reduce) / 100)) * this.state.qty} €
                                                        </h5></div>
                                                    </div>
                                                    : <div className={'row'}>
                                                        <div className={'col-12'}>
                                                            <h5 className="newPrice text-center text-success">
                                                                Gratuit
                                                            </h5>
                                                        </div>
                                                    </div>}
                                                <p style={{color: '#939393'}}>Politique de Confidentialité
                                                    Conditions générales d'utilisation et de vente.</p>

                                            </Modal>
                                        </div>
                                    </div>

                                </div>
                            )}</>
                            :
                            <Block404/>
                        }

                    </div>
                </div>
                <PartageBlock/>
                <Footer/>
            </div>
        )

    }
}

export default Home;