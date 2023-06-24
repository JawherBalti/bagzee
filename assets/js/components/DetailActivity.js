// ./assets/js/components/HomePageXD.js

import React, {Component, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


import {
    faArrowLeft,
    faCalendar,
    faClock,
    faLock,
    faPlusCircle,
    faTimes,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import axios from "axios";
import {Button, Checkbox, DatePicker, Form, Input, Modal, Select, Radio, InputNumber, Image} from "antd";
import Subscribe from "./Login";
import GoogleMapReact from 'google-map-react';
import PartageBlock from "./PartageBlock";
import Footer from "./Footer";
import {Link, Redirect} from "react-router-dom";
import Header from "./Header";
import Search from "antd/es/input/Search";
import CardForm from "./demos/CardForm";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import ReactInputVerificationCode from "react-verification-code-input";
import settings from "../app";
import {messageService} from "../lib/Services";
import Block404 from "./Block404";
import {FacebookIcon, FacebookShareButton} from "react-share";
import ReseauSociaux from "./ReseauSociaux";
import 'moment/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';
import Seo from "../hooks/seo";
import { LazyLoadImage } from 'react-lazy-load-image-component';


const {Option} = Select;

const script = document.createElement("script");
script.src = 'https://js.stripe.com/v3/';
let strip; // new line
script.onload = function () {
    strip = Stripe(settings.stripe.publishableKey);
};
document.body.appendChild(script);
const AnyReactComponent = ({text}) => <div>{text}</div>;

const user = JSON.parse(localStorage.getItem('client'))
const part = JSON.parse(localStorage.getItem('partenaire'))
const isOpened = localStorage.getItem('isOpened')

class DetailActivity extends Component {
    constructor() {
        super();
        this.state = {
            activity: {},
            time: {},
            centre: {},
            association: {},
            noInterval: false,
            redirect: false,
            seconds: 5000,
            client:  {
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
            messages: [],
            abonnement: [],
            paiement: [],
            isToday: true,
            visibleAlertP: false,
            showModal: false,
            disabled: false,
            qty: 1,
            codePromos: '',
            codeParrainage: '',
            parrainReduce: 0,
            don: 0,
            reduceCodePromo: 0,
            reduceCodePromo2: 0,
            visibleLogin: false,
            visibleSubscribe: false,
            errorPlus: false,
            myTimer: {timer: 0, value: 0},
            errorMinus: false,
            loading: true,
            email: '',
            error: '',
            textResponse: '',
            prixPromo: null,
        }
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.getMyReduce = this.getMyReduce.bind(this);
        this.handleChangeCodePromos = this.handleChangeCodePromos.bind(this);
        this.handleChangeCodeParrainage = this.handleChangeCodeParrainage.bind(this);
        this.handleChangeDon = this.handleChangeDon.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkFavoris = this.checkFavoris.bind(this);
        const isOpened = localStorage.getItem('isOpened')

        setTimeout(() => {
            if (!isOpened) {
                this.setState({visibleAlertP: true});
            }
        }, 1000)
    }

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

    secondsToTime(secs) {
        // let days = Math.floor(secs / (24*60 * 60));
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);
        hours = hours < 10 ? ('0' + hours) : hours;
        minutes = minutes < 10 ? ('0' + minutes) : minutes;
        seconds = seconds < 10 ? ('0' + seconds) : seconds;
        //  let obj = hours + ':' + minutes + ':' + seconds
        let obj = hours + ':' + minutes + ':' + seconds;
        return obj;
    }

    startTimer(mydat, hfrom) {

        const now = moment(new Date());
        const date2 = moment(new Date(mydat.split('-')[2] + "-" + mydat.split('-')[1] + "-" + mydat.split('-')[0] + "T" + hfrom + ":00"));
        let newTotalSeconds = date2.diff(now, 'seconds');

        //return this.secondsToTime(newTotalSeconds)
        let plus6h = moment(new Date('2022-01-31 16:00:00')).diff(moment(new Date('2022-01-31 10:00:00')), 'seconds');


        if (newTotalSeconds < 0 || newTotalSeconds > plus6h || this.state.noInterval) {
            clearInterval(this.state.myTimer.timer)
        } else {
            this.setState(prev => ({
                myTimer:
                    {
                        ...prev.myTimer,
                        value: this.secondsToTime(newTotalSeconds)
                    }

            }))

        }

    }

    checkFavoris(token, idCentre) {
        axios.post('api/check/activity/create', {
            "token": token,
            "id": idCentre,

        }).then(response => {

                const modal = Modal.success({
                    content: (
                        <div className={"text-center"} key={'check-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            {response.data.status == false ?
                                <h6 className={"text-danger pt-2"}> {response.data.message} </h6>
                                :
                                response.data.checkActivity.status ?
                                    <>
                                        <h6 className={'text-success'}>Cette activité a bien été ajoutée à vos favoris.</h6>
                                    </> :
                                    <h6 className={"text-danger pt-2"}>
                                        Cette activité a bien été retirée de vos favoris.
                                    </h6>
                            }


                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
                let nbreFavoris = this.state.activity.nbreFavoris
                if (response.data.checkActivity.status) {
                    this.setState(prev => ({
                        activity: {
                            ...prev.activity,
                            isFavoris: true,
                            nbreFavoris: Number(nbreFavoris) + 1
                        }
                    }))
                } else if (!response.data.checkActivity.status && response.data.status) {

                    this.setState(prev => ({
                        activity: {
                            ...prev.activity,
                            isFavoris: false,
                            nbreFavoris: Number(nbreFavoris) - 1
                        }
                    }))
                }
            }
        )
            .catch(function (error) {
                console.log(error);
            });
    }

    reserver(item, friend) {

        let myData = {
            "activity":
                {
                    "id": item.id,
                    "date": item.date,
                    "hFrom": item.hFrom,
                    "hTo": item.hTo,
                    "price": item.price,
                    "reduce": item.reduce,
                    "commission": this.state.activity.commission,
                    "nbreOfPlace": item.nbreOfPlace,

                },
            "email": this.state.email,
            "nbrePersonne": this.state.qty,
            "token": this.state.client.token,
            "payment_method": null,
            "prixPromos": this.state.prixPromo,
            "codePromos": this.state.codePromos,
            "codeParrainage": this.state.codeParrainage,
            "reduceCodePromo": this.state.reduceCodePromo,
            "don": this.state.don,
            "friend": friend

        };

        axios.post('api/order/create', myData).then(response => {
                if (response.data.requires_action) {
                    strip.handleCardAction(
                        response.data.payment_intent_client_secret
                    ).then(result => {
                        if (result.error) {

                            Modal.success({
                                content: (
                                    <div className={"text-center"} key={'reservation-modal-' + Math.random()}>
                                        <div>
                                            <FontAwesomeIcon icon={faTimes}/>
                                            <p style={{color: '#8D8D8D'}} className={"pt-2"}>Votre paiement à échoué.
                                                🥺
                                                <br/>


                                                Veuillez vous rapprocher de votre banque
                                            </p>
                                        </div>
                                    </div>),
                                okText: 'ok',
                            });
                            this.setState({disabled: false})

                        } else {
                            myData.payment_method = result.paymentIntent.id;
                            axios.post('api/order/create', myData
                            ).then(response => {
                                /*this.setState({disabled:false})*/
                                this.setState({
                                    prixPromo: null,
                                    codePromos: '',
                                    codeParrainage: '',
                                    reduceCodePromo: 0,
                                    reduceCodePromo2: 0,
                                    don: null
                                })
                                const modal = Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'acti-' + Math.random()}>
                                            {(response.data.status == false && response.data.message == 'Activity exist in your order') ?
                                                <div>
                                                    <FontAwesomeIcon icon={faTimes}/>
                                                    <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous avez déjà réservé
                                                        cette
                                                        activité
                                                    </p>
                                                </div>
                                                :
                                                <div>
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
                                                    <p style={{color: '#8D8D8D'}} className={"pt-2"}>Félicitations, votre
                                                        réservation a
                                                        bien été pris en compte. Vous pouvez discuter
                                                        avec les
                                                        participants de votre activité.
                                                        <br/>
                                                        Nous revenons vers vous dés que le partenaire aura bien validé le
                                                        créneau 🙂
                                                    </p>
                                                </div>}
                                        </div>),
                                    okText: 'ok',
                                });
                                setTimeout(() => {
                                    modal.destroy();
                                    this.setState({disabled: false,qty: 1,  redirect: true})
                                }, 5000)
                                this.myFunctionDidMount();

                            })
                        }
                    });


                } else {
                    this.setState({
                        prixPromo: null,
                        codePromos: '',
                        codeParrainage: '',
                        reduceCodePromo: 0,
                        reduceCodePromo2: 0,
                        don: null
                    })
                    let modal =Modal.success({
                        content: (
                            <div className={"text-center"} key={'reservation-modal-' + Math.random()}>
                                {(response.data.error_carte) ?
                                    <div>
                                        <FontAwesomeIcon icon={faTimes}/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                            {response.data.error_carte}
                                            <br/>
                                        </p>
                                    </div>
                                    : <div>
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
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>Félicitations, votre
                                            réservation a
                                            bien été pris en compte. Vous pouvez discuter
                                            avec les
                                            participants de votre activité.
                                            <br/>
                                            Nous revenons vers vous dés que le partenaire aura bien validé le créneau 🙂
                                        </p>
                                    </div>}
                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                        this.setState({disabled: false, qty: 1,  redirect: true})
                    }, 5000)
                    this.myFunctionDidMount()
                }

            }
        )
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        this.setState({
            email: value
        })

    }

    handleChangeCodePromos(event) {

        const target = event.target;
        const value = target.value;
        this.setState({
            codePromos: value
        })

    }

    handleChangeCodeParrainage(event) {

        const target = event.target;
        const value = target.value;
        this.setState({
            codeParrainage: value
        })

    }

    handleChangeDon(event) {
        console.log(event.target.value)
        this.setState({
            don: event.target.value
        }, () => console.log(this.state.don))

    }

    componentWillUnmount() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
        this.visibleLoginPartenaire.unsubscribe();
        this.closeLoginPartenaire.unsubscribe();
        this.villeHistory.unsubscribe();
    }

    componentDidMount() {
        window.scrollTo(0, 0);


        if (user) {
            this.setState({client: user.client})
        }
        this.subscription = messageService.getMessage().subscribe(message => {
            if (message.text == 'ok') {
                this.setState({messages: [...this.state.messages, message]});
                axios.get('api/stripe/card/show?token=' + this.state.client.token).then(res => {
                    this.setState({paiement: res.data.card}, () => {
                        this.setState({showModal: true})
                    })
                })
            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });
        this.visibleLoginPartenaire = messageService.getMessage().subscribe(message => {
            if (message.text == 'visibleLoginPartenaire') {
                console.log('visibleLoginPartenaire' + message)
                this.setState({noInterval: true});

                this.setState({messages: [...this.state.messages, message]});


            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });
        this.closeLoginPartenaire = messageService.getMessage().subscribe(message => {
            if (message.text == 'closeLoginPartenaire') {
                console.log('closeLoginPartenaire ' + message)
                this.setState({noInterval: false});
                this.myFunctionDidMount()
            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });
        if (this.props.location.state) {

            this.setState({okVille: 'ville-' + this.props.location.state.myville});

        }
        this.villeHistory = messageService.getMessage().subscribe(message => {
            // alert('my ville'+JSON.stringify(this.props.location.state))
            if (this.props.location.state) {

                this.setState({okVille: 'ville-' + this.props.location.state.myville});

            } else if (message.text.includes('ville-')) {
                console.log('okVille (message text)' + JSON.stringify(message.text))


            } else {
                // clear messages when empty message received
                this.setState({messages: []});
            }
        });
        this.getAssociation()
        //  this.myFunctionDidMount()


    }

    getAssociation() {
        axios.get('api/association/list').then(res => {
            if (res.data.association) {

                this.setState({association: res.data.association}, () => {
                    this.myFunctionDidMount()
                })
            } else {
                this.myFunctionDidMount()
            }
        })

    }

    myFunctionDidMount() {

        let pieces = (this.props.match.params.id).split('-');
        let idActv = pieces[pieces.length - 1]
        if (user) {
            if (user.client) {
                this.setState({client: user.client, loading: true}, () => {
                    axios.get(`api/subscription/get/` + this.state.client.token + '/' + idActv).then(abonnement => {
                        this.setState({abonnement: abonnement.data.subscription}, () => {
                            axios.get('api/activity/id?id=' + idActv + '&token=' + this.state.client.token).then(res => {
                                if (res.data.status) {
                                    //   this.props.location.state.title = res.data.activity.name
                                    this.setState({
                                        activity: res.data.activity,
                                        centre: res.data.centres,
                                        loading: false
                                    }, () => {
                                        if (this.state.activity.reduce > 0) {
                                            this.getMyReduce(this.state.activity.reduce)
                                        }
                                        if (this.state.activity.date == moment().format("DD-MM-YYYY")) {
                                            this.setState({isToday: true})
                                            let idTimer = setInterval(() => {
                                                this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                                            }, 1000);
                                            //   let idTimer = this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                                            this.setState({
                                                myTimer: {
                                                    timer: idTimer,
                                                    value: this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                                                }
                                            });
                                        } else {
                                            this.setState({isToday: false})

                                        }

                                    })
                                }
                            }).catch(err => {
                                this.setState({NotFound: true, loading: false})
                            })
                        })
                    })
                })

            }
        } else {
            axios.get('api/activity/id?id=' + idActv).then(res => {
                if (res.data.status) {
                    //   this.props.location.state.title = res.data.activity.name
                    this.setState({activity: res.data.activity, centre: res.data.centres, loading: false}, () => {
                        if (this.state.activity.reduce > 0) {
                            this.getMyReduce(this.state.activity.reduce)
                        }
                        if (this.state.activity.date == moment().format("DD-MM-YYYY")) {
                            this.setState({isToday: true})
                            let idTimer = setInterval(() => {
                                this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                            }, 1000);
                            //   let idTimer = this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                            this.setState({
                                myTimer: {
                                    timer: idTimer,
                                    value: this.startTimer(this.state.activity.date, this.state.activity.hFrom)
                                }
                            });
                        } else {
                            this.setState({isToday: false})

                        }

                    })
                }
            }).catch(err => {
                this.setState({NotFound: true, loading: false})
            })
        }

    }

    getMyReduce(reduce) {

        if (reduce >= 20 && reduce <= 99) {//29

            this.setState(prev => ({
                activity:
                    {
                        ...prev.activity,
                        reduce: reduce - 10,
                        commission: 10
                    }

            }))
        } else if (reduce >= 30 && reduce <= 49) {

            this.setState(prev => ({
                activity:
                    {
                        ...prev.activity,
                        reduce: reduce - 15,
                        commission: 15
                    }

            }))
        } else if (reduce >= 50 && reduce <= 99) {

            this.setState(prev => ({
                activity:
                    {
                        ...prev.activity,
                        reduce: reduce - 20,
                        commission: 20
                    }

            }))
        }
    }

    getTotalSecondes(myDate, hFrom) {
        const now = moment(new Date());
        const date2 = moment(new Date(myDate.split('-')[2] + "-" + myDate.split('-')[1] + "-" + myDate.split('-')[0] + "T" + hFrom + ":00"));
        let newTotalSeconds = date2.diff(now, 'seconds');
        if (newTotalSeconds <= 0) {
            return true
        } else {
            return false
        }
    }

    render() {
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

        const CollectionCreateFormSubscribe = ({visibleSubscribe, onCreateSubscribe, onCancelSubscribe}) => {
            const [form] = Form.useForm();

            const onFinish = (values) => {
                console.log('Received values of form: ', values);
            };

            return (

                <Modal
                    visible={visibleSubscribe}
                    onCancel={onCancelSubscribe}
                    key={'subscribe-Detail-' + Math.random()}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateSubscribe(values);

                            })
                            .catch((info) => {
                                console.log('Ooops !! Validate Failed:', info);
                            });
                    }}
                    footer={[

                        <Button key="submit" type="primary" onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    onCreateSubscribe(values);
                                })
                                .catch((info) => {
                                    console.log('Ooops !! Validate Failed:', info);
                                });
                        }}>Prêt à rejoindre Bagzee
                        </Button>,
                        <p>
                            <FontAwesomeIcon icon={faLock} color={"#30A3F2"} style={{paddingRight: 7}}/>
                            Nous ne publions jamais sans ta
                            permission.
                        </p>


                    ]}

                >

                    {/*  <ReseauSociaux/>

                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="30" viewBox="0 0 522 30">
                        <g id="Groupe_194" data-name="Groupe 194" transform="translate(-782 -825)">
                            <text id="ou_" data-name="ou " transform="translate(1028 849)" fill="#a6a6a6"
                                  fontSize="18" fontFamily="SegoeUI-Semibold, Segoe UI" fontWeight="600">
                                <tspan x="0" y="0">ou</tspan>
                            </text>
                            <path id="Tracé_120" data-name="Tracé 120" d="M5317,5712h230.2"
                                  transform="translate(-4535 -4869)" fill="none" stroke="#b9b9b9" strokeWidth="1"/>
                            <path id="Tracé_121" data-name="Tracé 121" d="M5317,5712h230.2"
                                  transform="translate(-4243.2 -4869)" fill="none" stroke="#b9b9b9"
                                  strokeWidth="1"/>
                        </g>
                    </svg>*/}
                    <Form
                        form={form}
                        name={"register_detail" + Math.random()}
                        onFinish={onFinish}
                        scrollToFirstError
                        requiredMark={false}
                    >

                        <Form.Item className={'text-center'}
                                   name="gender"
                                   label={
                                       <span>
                                           Genre
                                       </span>
                                   }
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Genre ne doit pas être vide!',
                                       },
                                   ]} hasFeedback>
                            <Radio.Group>
                                <Radio value={'Mme'}>Femme</Radio>
                                <Radio value={'Mr'}>Homme</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="lastName"
                            label={
                                <span>
                                    Nom
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Nom de famille ne doit pas être vide!',
                                    whitespace: true,
                                },
                            ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="firstName"
                            label={
                                <span>
                                    Prénom
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Prénom ne doit pas être vide!',
                                    whitespace: true,
                                },
                            ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Date de naissance">
                            <Form.Item style={{display: 'inline-block', width: 'calc(33% - 8px)', margin: '0 1%'}}
                                       name="birdh1"
                                       initialValue={'01'}
                                       rules={[

                                           {
                                               required: true,
                                               message: 'Date de naissance ne doit pas être vide!',
                                           },
                                       ]} hasFeedback
                            >
                                {/*<DatePicker locale={locale} defaultValue={moment('01-01-2000', 'DD-MM-YYYY')}
                                        placeholder={'aaaa-mm-jj'} format={'DD-MM-YYYY'}   disabledDate={Home.prototype.disabledDateBirth}/>*/}
                                <Select onChange={handleChange} defaultValue="01">
                                    {jour}
                                </Select>

                            </Form.Item>
                            <Form.Item style={{display: 'inline-block', width: 'calc(33% - 8px)', margin: '0 1%'}}
                                       initialValue={'01'}
                                       name="birdh2"
                                       rules={[

                                           {
                                               required: true,
                                               message: 'Date de naissance ne doit pas être vide!',
                                           },
                                       ]} hasFeedback
                            >
                                {/*<DatePicker locale={locale} defaultValue={moment('01-01-2000', 'DD-MM-YYYY')}
                                        placeholder={'aaaa-mm-jj'} format={'DD-MM-YYYY'}   disabledDate={Home.prototype.disabledDateBirth}/>*/}

                                <Select defaultValue="01" onChange={handleChange}>
                                    {mois}
                                </Select>
                            </Form.Item>
                            <Form.Item style={{display: 'inline-block', width: 'calc(33% - 8px)', margin: '0 1%'}}
                                       initialValue={'2000'}
                                       name="birdh3"
                                       rules={[

                                           {
                                               required: true,
                                               message: 'Date de naissance ne doit pas être vide!',
                                           },
                                       ]} hasFeedback
                            >
                                {/*<DatePicker locale={locale} defaultValue={moment('01-01-2000', 'DD-MM-YYYY')}
                                        placeholder={'aaaa-mm-jj'} format={'DD-MM-YYYY'}   disabledDate={Home.prototype.disabledDateBirth}/>*/}
                                <Select onChange={handleChange} defaultValue="2000">
                                    {annee}
                                </Select>

                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Numéro ( Pour vos réservations )"
                            rules={[
                                {
                                    required: true,
                                    message: 'Numéro de téléphone ne doit pas être vide!',
                                },
                                {
                                    pattern: '^((06)|(07))[0-9]{8}$',
                                    message: 'Numéro de téléphone doit être à 10 chiffres et commencer par 06 ou 07',
                                },
                            ]} hasFeedback
                        >
                            <Input type='tel' minLength={10} maxLength={10} placeholder={'0600000000'}/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Votre email n\'est pas valide !',
                                },
                                {
                                    required: true,
                                    message: 'Email ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"email"}/>
                        </Form.Item>
                        <Form.Item
                            name="ville"
                            label="ville"
                            initialValue={'agen'}
                            rules={[

                                {
                                    required: true,
                                    message: 'ville ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Select name="villes" defaultValue="agen">
                                <Option key={'ville-' + Math.random()} value="bourg">01 - Bourg-en-Bresse</Option>
                                <Option key={'ville-' + Math.random()} value="laon">02 - Laon</Option>
                                <Option key={'ville-' + Math.random()} value="saintQuentin">02 - Saint-Quentin</Option>
                                <Option key={'ville-' + Math.random()} value="soissons">02 - Soissons</Option>
                                <Option key={'ville-' + Math.random()} value="moulins">03 - Moulins</Option>
                                <Option key={'ville-' + Math.random()} value="montluçon">03 - Montluçon</Option>
                                <Option key={'ville-' + Math.random()} value="vichy">03 - Vichy</Option>
                                <Option key={'ville-' + Math.random()} value="digne">04 - Digne-les-Bains</Option>
                                <Option key={'ville-' + Math.random()} value="gap">05 - Gap</Option>
                                <Option key={'ville-' + Math.random()} value="nice">06 - Nice</Option>
                                <Option key={'ville-' + Math.random()} value="privas">07 - Privas</Option>
                                <Option key={'ville-' + Math.random()} value="charleville">08 - Charleville-Mézières
                                </Option>
                                <Option key={'ville-' + Math.random()} value="foix">09 - Foix</Option>
                                <Option key={'ville-' + Math.random()} value="troyes">10 - Troyes</Option>
                                <Option key={'ville-' + Math.random()} value="carcassonne">11 - Carcassonne</Option>
                                <Option key={'ville-' + Math.random()} value="narbonne">11 - Narbonne</Option>
                                <Option key={'ville-' + Math.random()} value="rodez">12 - Rodez</Option>
                                <Option key={'ville-' + Math.random()} value="marseille">13 - Marseille</Option>
                                <Option key={'ville-' + Math.random()} value="aix">13 - Aix-en-Provence</Option>
                                <Option key={'ville-' + Math.random()} value="arles">13 - Arles</Option>
                                <Option key={'ville-' + Math.random()} value="bayeux">14 - Bayeux</Option>
                                <Option key={'ville-' + Math.random()} value="caen">14 - Caen</Option>
                                <Option key={'ville-' + Math.random()} value="aurillac">15 - Aurillac</Option>
                                <Option key={'ville-' + Math.random()} value="angouleme">16 - Angoulême</Option>
                                <Option key={'ville-' + Math.random()} value="cognac">16 - Cognac</Option>
                                <Option key={'ville-' + Math.random()} value="larochelle">17 - La Rochelle</Option>
                                <Option key={'ville-' + Math.random()} value="saintes">17 - Saintes</Option>
                                <Option key={'ville-' + Math.random()} value="bourges">18 - Bourges</Option>
                                <Option key={'ville-' + Math.random()} value="tulle">19 - Tulle</Option>
                                <Option key={'ville-' + Math.random()} value="brive">19 - Brive</Option>
                                <Option key={'ville-' + Math.random()} value="ajaccio">2A - Ajaccio</Option>
                                <Option key={'ville-' + Math.random()} value="bastia">2B - Bastia</Option>
                                <Option key={'ville-' + Math.random()} value="dijon">21 - Dijon</Option>
                                <Option key={'ville-' + Math.random()} value="beaune">21 - Beaune</Option>
                                <Option key={'ville-' + Math.random()} value="saintbrieuc">22 - Saint-Brieuc</Option>
                                <Option key={'ville-' + Math.random()} value="guingamp">22 - Guingamp</Option>
                                <Option key={'ville-' + Math.random()} value="gueret">23 - Guéret</Option>
                                <Option key={'ville-' + Math.random()} value="perigueux">24 - Périgueux</Option>
                                <Option key={'ville-' + Math.random()} value="bergerac">24 - Bergerac</Option>
                                <Option key={'ville-' + Math.random()} value="besancon">25 - Besançon</Option>
                                <Option key={'ville-' + Math.random()} value="montbeliard">25 - Montbéliard</Option>
                                <Option key={'ville-' + Math.random()} value="lille">26 - Valence</Option>
                                <Option key={'ville-' + Math.random()} value="evreux">27 - Evreux</Option>
                                <Option key={'ville-' + Math.random()} value="chartres">28 - Chartres</Option>
                                <Option key={'ville-' + Math.random()} value="brest">29 - Brest</Option>
                                <Option key={'ville-' + Math.random()} value="quimper">29 - Quimper</Option>
                                <Option key={'ville-' + Math.random()} value="nimes">30 - Nîmes</Option>
                                <Option key={'ville-' + Math.random()} value="toulouse">31 - Toulouse</Option>
                                <Option key={'ville-' + Math.random()} value="auch">32 - Auch</Option>
                                <Option key={'ville-' + Math.random()} value="bordeaux">33 - Bordeaux</Option>
                                <Option key={'ville-' + Math.random()} value="libourne">33 - Libourne</Option>
                                <Option key={'ville-' + Math.random()} value="beziers">34 - Béziers</Option>
                                <Option key={'ville-' + Math.random()} value="montpellier">34 - Montpellier</Option>
                                <Option key={'ville-' + Math.random()} value="rennes">35 - Rennes</Option>
                                <Option key={'ville-' + Math.random()} value="saintmalo">35 - Saint-Malo</Option>
                                <Option key={'ville-' + Math.random()} value="chateauroux">36 - Châteauroux</Option>
                                <Option key={'ville-' + Math.random()} value="tours">37 - Tours</Option>
                                <Option key={'ville-' + Math.random()} value="grenoble">38 - Grenoble</Option>
                                <Option key={'ville-' + Math.random()} value="lons">39 - Lons-le-Saunier</Option>
                                <Option key={'ville-' + Math.random()} value="dole">39 - Dole</Option>
                                <Option key={'ville-' + Math.random()} value="montdemarsan">40 - Mont-de-Marsan</Option>
                                <Option key={'ville-' + Math.random()} value="dax">40 - Dax</Option>
                                <Option key={'ville-' + Math.random()} value="blois">41 - Blois</Option>
                                <Option key={'ville-' + Math.random()} value="romorantin">41 - Romorantin-Lanthenay
                                </Option>
                                <Option key={'ville-' + Math.random()} value="saintetienne">42 - Saint-Etienne</Option>
                                <Option key={'ville-' + Math.random()} value="Montbrison">42 - Montbrison</Option>
                                <Option key={'ville-' + Math.random()} value="brioude">43 - Brioude</Option>
                                <Option key={'ville-' + Math.random()} value="lepuyenvelay">43 - Le Puy-en-Velay
                                </Option>
                                <Option key={'ville-' + Math.random()} value="nantes">44 - Nantes</Option>
                                <Option key={'ville-' + Math.random()} value="saintnazaire">44 - Saint-Nazaire</Option>
                                <Option key={'ville-' + Math.random()} value="orleans">45 - Orléans</Option>
                                <Option key={'ville-' + Math.random()} value="montargis">45 - Montargis</Option>
                                <Option key={'ville-' + Math.random()} value="cahors">46 - Cahors</Option>
                                <Option key={'ville-' + Math.random()} value="agen">47 - Agen</Option>
                                <Option key={'ville-' + Math.random()} value="mende">48 - Mende</Option>
                                <Option key={'ville-' + Math.random()} value="angers">49 - Angers</Option>
                                <Option key={'ville-' + Math.random()} value="cholet">49 - Cholet</Option>
                                <Option key={'ville-' + Math.random()} value="saintlo">50 - Saint-Lô</Option>
                                <Option key={'ville-' + Math.random()} value="cherbourg">50 - Cherbourg</Option>
                                <Option key={'ville-' + Math.random()} value="chalons">51 - Châlons-en-Champagne
                                </Option>
                                <Option key={'ville-' + Math.random()} value="reims">51 - Reims</Option>
                                <Option key={'ville-' + Math.random()} value="chaumont">52 - Chaumont</Option>
                                <Option key={'ville-' + Math.random()} value="saintDizier">52 - Saint-Dizier</Option>
                                <Option key={'ville-' + Math.random()} value="laval">53 - Laval</Option>
                                <Option key={'ville-' + Math.random()} value="mayenne">53 - Mayenne</Option>
                                <Option key={'ville-' + Math.random()} value="nancy">54 - Nancy</Option>
                                <Option key={'ville-' + Math.random()} value="barleduc">55 - Bar-le-Duc</Option>
                                <Option key={'ville-' + Math.random()} value="lorient">56 - Lorient</Option>
                                <Option key={'ville-' + Math.random()} value="pontivy">56 - Pontivy</Option>
                                <Option key={'ville-' + Math.random()} value="vannes">56 - Vannes</Option>
                                <Option key={'ville-' + Math.random()} value="metz">57 - Metz</Option>
                                <Option key={'ville-' + Math.random()} value="nevers">58 - Nevers</Option>
                                <Option key={'ville-' + Math.random()} value="dunkerque">59 - Dunkerque</Option>
                                <Option key={'ville-' + Math.random()} value="lille">59 - Lille</Option>
                                <Option key={'ville-' + Math.random()} value="valenciennes">59 - Valenciennes</Option>
                                <Option key={'ville-' + Math.random()} value="beauvais">60 - Beauvais</Option>
                                <Option key={'ville-' + Math.random()} value="alencon">61 - Alençon</Option>
                                <Option key={'ville-' + Math.random()} value="arras">62 - Arras</Option>
                                <Option key={'ville-' + Math.random()} value="boulognesurmer">62 - Boulogne-sur-Mer
                                </Option>
                                <Option key={'ville-' + Math.random()} value="calais">62 - Calais</Option>
                                <Option key={'ville-' + Math.random()} value="Lens">62 - Lens</Option>
                                <Option key={'ville-' + Math.random()} value="letouquet">62 - Le Touquet</Option>
                                <Option key={'ville-' + Math.random()} value="clermont">63 - Clermont-Ferrand</Option>
                                <Option key={'ville-' + Math.random()} value="bayonne">64 - Bayonne</Option>
                                <Option key={'ville-' + Math.random()} value="biarritz">64 - Biarritz</Option>
                                <Option key={'ville-' + Math.random()} value="pau">64 - Pau</Option>
                                <Option key={'ville-' + Math.random()} value="tarbes">65 - Tarbes</Option>
                                <Option key={'ville-' + Math.random()} value="perpignan">66 - Perpignan</Option>
                                <Option key={'ville-' + Math.random()} value="strasbourg">67 - Strasbourg</Option>
                                <Option key={'ville-' + Math.random()} value="colmar">68 - Colmar</Option>
                                <Option key={'ville-' + Math.random()} value="mulhouse">68 - Mulhouse</Option>
                                <Option key={'ville-' + Math.random()} value="lyon">69 - Lyon</Option>
                                <Option key={'ville-' + Math.random()} value="vesoul">70 - Vesoul</Option>
                                <Option key={'ville-' + Math.random()} value="chalonsursaone">71 - Chalon-sur-Saône
                                </Option>
                                <Option key={'ville-' + Math.random()} value="macon">71 - Mâcon</Option>
                                <Option key={'ville-' + Math.random()} value="lafleche">72 - La Flèche</Option>
                                <Option key={'ville-' + Math.random()} value="lemans">72 - Le Mans</Option>
                                <Option key={'ville-' + Math.random()} value="chambery">73 - Chambéry</Option>
                                <Option key={'ville-' + Math.random()} value="annecy">74 - Annecy</Option>
                                <Option key={'ville-' + Math.random()} value="paris">75 - Paris</Option>
                                <Option key={'ville-' + Math.random()} value="lehavre">76 - Le Havre</Option>
                                <Option key={'ville-' + Math.random()} value="rouen">76 - Rouen</Option>
                                <Option key={'ville-' + Math.random()} value="melun">77 - Melun</Option>
                                <Option key={'ville-' + Math.random()} value="versailles">78 - Versailles</Option>
                                <Option key={'ville-' + Math.random()} value="niort">79 - Niort</Option>
                                <Option key={'ville-' + Math.random()} value="amiens">80 - Amiens</Option>
                                <Option key={'ville-' + Math.random()} value="albi">81 - Albi</Option>
                                <Option key={'ville-' + Math.random()} value="castres">81 - Castres</Option>
                                <Option key={'ville-' + Math.random()} value="montauban">82 - Montauban</Option>
                                <Option key={'ville-' + Math.random()} value="brignoles">83 - Brignoles</Option>
                                <Option key={'ville-' + Math.random()} value="draguignan">83 - Draguignan</Option>
                                <Option key={'ville-' + Math.random()} value="toulon">83 - Toulon</Option>
                                <Option key={'ville-' + Math.random()} value="avignon">84 - Avignon</Option>
                                <Option key={'ville-' + Math.random()} value="larochesuryon">85 - La-Roche-sur-Yon
                                </Option>
                                <Option key={'ville-' + Math.random()} value="lessablesdolonne">85 - Les
                                    Sables-d'Olonne
                                </Option>
                                <Option key={'ville-' + Math.random()} value="poitiers">86 - Poitiers</Option>
                                <Option key={'ville-' + Math.random()} value="limoges">87 - Limoges</Option>
                                <Option key={'ville-' + Math.random()} value="epinal">88 - Epinal</Option>
                                <Option key={'ville-' + Math.random()} value="auxerre">89 - Auxerre</Option>
                                <Option key={'ville-' + Math.random()} value="belfort">90 - Belfort</Option>
                                <Option key={'ville-' + Math.random()} value="etampes">91 - Étampes</Option>
                                <Option key={'ville-' + Math.random()} value="evry">91 - Evry</Option>
                                <Option key={'ville-' + Math.random()} value="antony">92 - Antony</Option>
                                <Option key={'ville-' + Math.random()} value="boulognebillancourt">92 -
                                    Boulogne-Billancourt
                                </Option>
                                <Option key={'ville-' + Math.random()} value="nanterre">92 - Nanterre</Option>
                                <Option key={'ville-' + Math.random()} value="bobigny">93 - Bobigny</Option>
                                <Option key={'ville-' + Math.random()} value="leraincy">93 - Le Raincy</Option>
                                <Option key={'ville-' + Math.random()} value="saintdenis">93 - Saint-Denis</Option>
                                <Option key={'ville-' + Math.random()} value="creteil">94 - Créteil</Option>
                                <Option key={'ville-' + Math.random()} value="cergy">95 - Cergy</Option>
                                <Option key={'ville-' + Math.random()} value="pontoise">95 - Pontoise</Option>
                                <Option key={'ville-' + Math.random()} value="basseterre">971 - Basse-Terre</Option>
                                <Option key={'ville-' + Math.random()} value="fortdefrance">972 - Fort-de-France
                                </Option>
                                <Option key={'ville-' + Math.random()} value="cayenne">973 - Cayenne</Option>
                                <Option key={'ville-' + Math.random()} value="saintdenis">974 - Saint-Denis</Option>
                                <Option key={'ville-' + Math.random()} value="mamoudzou">976 - Mamoudzou</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mot de passe ne doit pas être vide!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirmation mot de passe"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Confirmer mot de passe ne doit pas être vide!',
                                },
                                ({getFieldValue}) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }

                                        return Promise.reject('Les deux mot de passe ne sont pas identiques');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item
                            name="agreement"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject('Vous devez accepter le conditions générales'),
                                },
                            ]}
                        >
                            <Checkbox>
                                En créant un compte, vous acceptez de
                                vous conformer aux
                                <Link to={'/conditions-generales-de-vente'}
                                      style={{color: '#30A3F2', paddingLeft: 7, paddingRight: 7}}>Conditions Générales
                                    de Bagzee.
                                </Link>
                                Conformément à la loi Informatique et Libertés,
                                Vous disposez d’un droit d’accès et de rectification
                                aux données vous concernant.
                                <Link style={{color: '#30A3F2', paddingLeft: 7, paddingRight: 7}}
                                      to={'/politique-de-confidentialite'}>En savoir plus
                                    ici.
                                </Link>
                            </Checkbox>
                        </Form.Item>

                    </Form>
                </Modal>
            );
        };
        const CollectionsPageSubscribe = () => {
            //With this, we will get all field values.
            const onCreateSubscribe = (values) => {
                localStorage.clear();

                axios.post('api/subscription/client', {
                    "firstName": values.firstName,
                    "lastName": values.lastName,
                    "email": values.email,
                    "ville": values.ville,
                    "password": values.password,
                    "phone": values.phone.replace(/ /g, ''),
                    "birdh": values.birdh1 + '-' + values.birdh2 + '-' + values.birdh3,
                    "depart": "",
                    "gender": values.gender,
                    "photo": "",
                    "description": ""

                }).then(function (response) {
                    let status = response.data.status
                    let message = response.data.message
                    setTimeout(() => {
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"} key={'subscribe-' + Math.random()}>
                                    <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                                    <p className={status ? "text-success pt-2" : "text-danger pt-2"}>
                                        {message}
                                    </p>

                                </div>),
                            okText: 'ok',
                        });
                        setTimeout(() => {
                            modal.destroy();
                        }, 5000);
                        /**login apres inscription**/
                        localStorage.clear();
                        axios.post('api/signIn/client', {values}).then(function (response) {
                            let status = response.data.status
                            let message = response.data.message
                            let enabled = response.data.enabled
                            setTimeout(function () {
                                if (status && enabled) {
                                    localStorage.setItem('client', JSON.stringify(response.data));
                                    window.location.reload(false);
                                }
                            }, 50)
                        })
                            .catch(function (error) {
                                console.log(error);
                            });
                        this.setState({visibleSubscribe: false, visibleLogin: false})
                        messageService.sendMessage('closeLoginPartenaire');

                        /***/
                    }, 1000)
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.setState({visibleSubscribe: false, visibleLogin: false, noInterval: false})
                messageService.sendMessage('closeLoginPartenaire');
            };

            return (
                <div>
                    Nouveau sur Bagzee ?
                    <Button
                        type="primary"
                        className={'clear'}
                        /*  className={'btn-blue'}*/
                        onClick={() => {
                            this.setState({visibleSubscribe: true, noInterval: true})
                        }}
                    >
                        créer un compte
                    </Button>
                    <CollectionCreateFormSubscribe key={'subscribe_in_detail_' + Math.random()}
                                                   visibleSubscribe={this.state.visibleSubscribe}
                                                   onCreateSubscribe={onCreateSubscribe}
                                                   onCancelSubscribe={() => {
                                                       this.setState({
                                                           visibleSubscribe: false,
                                                           visibleLogin: false,
                                                           noInterval: false
                                                       }, () => this.myFunctionDidMount())
                                                   }}
                    />
                </div>
            );
        };
        const CollectionCreateFormLogin = ({visibleLogin, onCreateLogin, onCancelLogin}) => {
            const [form] = Form.useForm();
            const [formM2p] = Form.useForm();
            return (
                <Modal
                    className={this.state.visibleSubscribe ? 'd-none' : null}
                    visible={visibleLogin}
                    okText="Connexion"
                    key={"Connexion" + Math.random()}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateLogin(values);

                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={onCancelLogin}
                    footer={[

                        <Button key="submit" type="primary" className={'w-100'} onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    onCreateLogin(values);
                                })
                                .catch((info) => {
                                    console.log('Validate Failed:', info);
                                });

                        }}>Connexion
                        </Button>

                        /*,
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="30" viewBox="0 0 522 30">
                            <g id="GroupeLogin_194" data-name="GroupeLogin 194" transform="translate(-782 -825)">
                                <text id="ou" data-name="ou" transform="translate(1028 849)" fill="#a6a6a6"
                                      fontSize="18" fontFamily="SegoeUI-Semibold, Segoe UI" fontWeight="600">
                                    <tspan x="0" y="0">ou</tspan>
                                </text>
                                <path id="TracéL_120" data-name="TracéL 120" d="M5317,5712h230.2"
                                      transform="translate(-4535 -4869)" fill="none" stroke="#b9b9b9" strokeWidth="1"/>
                                <path id="TracéL_121" data-name="TracéL 121" d="M5317,5712h230.2"
                                      transform="translate(-4243.2 -4869)" fill="none" stroke="#b9b9b9"
                                      strokeWidth="1"/>
                            </g>
                        </svg>,<Button className={'btn-default fb mt-4'}>
                            <LazyLoadImage src={"/images/fb.png"} alt={"facebook"} width={'15px'} className={'mr-2'}/> Se
                            connecter avec Facebook
                        </Button>,
                        <Button className={'btn-default w-100 m-0 edit'}>
                            <LazyLoadImage src={"/images/google-icon.png"} alt={"google"} width={'15px'} className={'mr-2'}/> Se
                            connecter avec Google
                        </Button>
                        */, <hr/>, <CollectionsPageSubscribe key={'CollectionsPageSubscribeDetail-' + Math.random()}/>,


                    ]}
                >
                    <h2 className={"text-center"}>Connexion</h2>
                    <p className={"text-center"} style={{color: '#B3B3B1'}}>Identifiez-vous pour profiter de bons
                        <br/>
                        plans loisirs près de chez vous
                    </p>
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_connexion_in_detail"
                        key={"form_connexion_in_detail" + Math.random()}
                        requiredMark={false}

                    >
                        <Form.Item
                            name="phone"
                            label="Numéro de téléphone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez saisir votre numéro de téléphone',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item name="password" label="Mot de passe"
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Veuillez saisir votre mot de passe',
                                       },
                                   ]}
                        >
                            <Input type="password"/>
                        </Form.Item>
                        <p style={{color: '#939393', cursor: 'pointer'}} onClick={() => {
                            return Modal.success({
                                className: 'm2b_oublier',
                                content: (
                                    <div className={'my-3'} key={'m2p-' + Math.random()}>
                                        <h4>
                                            Mot de passe oublié
                                        </h4>
                                        <Form form={formM2p} name={'m2b_oublier'}>
                                            <Form.Item name={'email'} label={'Email'} rules={[{
                                                type: 'email',
                                                message: 'Votre email n\'est pas valide !',
                                            }, {
                                                required: true,
                                                message: 'Email ne doit pas être vide!',
                                                whitespace: true
                                            }]} hasFeedback>
                                                <Input className={'py-2'} type={'email'}/>

                                            </Form.Item>
                                        </Form>

                                    </div>
                                ),
                                okText: 'Envoyer',
                                onOk() {
                                    formM2p
                                        .validateFields()
                                        .then((values) => {
                                            formM2p.resetFields();
                                            axios.post('api/forget/password', {
                                                type: "1",
                                                email: values.email
                                            }).then(res => {
                                                const modal = Modal.success({
                                                    content: (
                                                        <div className={"text-center"} key={'formM2p' + Math.random()}>
                                                            <LazyLoadImage src={"/images/logo.png"} width={'65px'}
                                                                 alt={"bagzee"}/>

                                                            <p className={res.data.status ? "text-success pt-2" : "text-danger pt-2"}>
                                                                {res.data.message}
                                                            </p>

                                                        </div>),
                                                    okText: 'ok',
                                                });
                                                setTimeout(() => {
                                                    modal.destroy();

                                                }, 5000);
                                            })
                                        })
                                        .catch((info) => {
                                            console.log('Ooops !! Validate Failed:', info);
                                        });
                                },
                                cancelText: 'Annuler',
                                okCancel: 'cancel'
                            });
                        }}>mot de passe oublié ?
                        </p>

                    </Form>
                </Modal>
            );
        };
        const CollectionsPageLogin = () => {
            const [visibleCodeV, setVisibleCodeV] = useState(true);

            const onCreateLogin = (values) => {
                const CodeVerification = () => {

                    const [value, setValue] = useState("");
                    const [isInvalid, setIsInvalid] = useState(false);
                    const [error, setError] = useState(null);
                    const [seconds, setSeconds] = useState(null);
                    return (
                        <div>
                            <div className={isInvalid ? 'invalid styledInputReactVerCode' : 'styledInputReactVerCode'}>
                                <ReactInputVerificationCode
                                    value={value}
                                    placeholder={''}
                                    length={6}
                                    onChange={(newValue) => {
                                        setValue(newValue);
                                        this.setState({codeSms: newValue})

                                        if (newValue !== "") {
                                            setError(null);
                                        }
                                    }}
                                />
                            </div>

                            {error && <div className={'StyledError'}>{error}</div>}

                            {seconds && (
                                <div
                                    className={'StyledSeconds'}>{`Verification code has been re-sent (${seconds}s)`}</div>
                            )}
                            <p className={'text-center mt-5 fs-6 mb-0'}>AVEZ-VOUS BESOIN D’AIDE ?</p>

                            <button className={'ant-btn ant-btn-primary send'}
                                    onClick={() => {
                                        axios.post('api/check/sms', {
                                            phone: values.phone.replace(/ /g, ''),
                                            code: this.state.codeSms
                                        }).then(res => {
                                            setVisibleCodeV(false)
                                            if (res.data.status) {
                                                const modal = Modal.success({
                                                    content: (
                                                        <div className={"text-center"} key={'vsible-' + Math.random()}>
                                                            <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                                                            <p className={res.data.status ? "text-success pt-2" : "text-danger pt-2"}>
                                                                Votre compte est vérifié
                                                            </p>

                                                        </div>),
                                                    okText: 'ok',
                                                });
                                                setTimeout(() => {
                                                    modal.destroy();
                                                }, 5000);
                                                localStorage.setItem('client', JSON.stringify(res.data));
                                                window.location.reload(false);
                                            } else {
                                                setValue("");
                                                setError("Code incorrect. Veuillez réessayer");
                                                setIsInvalid(true);

                                                setTimeout(() => {
                                                    setIsInvalid(false);
                                                }, 1000);
                                            }
                                        })

                                    }}
                            >
                                Envoyer le code
                            </button>
                        </div>
                    )
                }
                localStorage.clear();
                axios.post('api/signIn/client', {values}).then(function (response) {
                    let status = response.data.status
                    let message = response.data.message
                    let enabled = response.data.enabled
                    setTimeout(function () {
                        if (status && enabled) {
                            localStorage.setItem('client', JSON.stringify(response.data));
                            window.location.reload(false);
                        } else {
                            if (!enabled && message == 'verif') {
                                Modal.success({
                                    className: 'codeVerif',
                                    visible: visibleCodeV,
                                    content: (
                                        <div key={'codeVerif-' + Math.random()}>
                                            <h4
                                                className={" pt-2 text-center mb-3"}>
                                                Code de vérification
                                            </h4>
                                            <p className={"pt-2 text-center"}>
                                                Veuillez saisir le code de vérification
                                                <br/>
                                                qui vous a été envoyé par
                                                sms.
                                            </p>
                                            <CodeVerification/>
                                        </div>
                                    ),
                                    cancelText: 'Annuler',
                                    okCancel: 'cancel'
                                })
                            } else {
                                const modal = Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'connexion-' + Math.random()}>
                                            <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                                            <h4 className={" pt-2"}>
                                                la connexion a échouée
                                            </h4>
                                            <p className={"text-danger pt-2"}>
                                                {message}
                                            </p>

                                        </div>),
                                    okText: 'ok',
                                });
                                setTimeout(() => {
                                    modal.destroy();
                                }, 5000);
                            }


                        }
                    }, 50)
                })
                    .catch(function (error) {
                        console.log(error);
                    });

                this.setState({visibleLogin: false, noInterval: false})

            };

            return (
                <div>
                    <Button
                        className={this.state.disabled ? "btn-default w-100 isReserver disabled" : "btn-default w-100 isReserver"}
                        onClick={() => {
                            this.setState({visibleLogin: true, noInterval: true})
                        }}
                    >
                        Réserver
                    </Button>
                    <CollectionCreateFormLogin key={'login-detail' + Math.random()}
                                               visibleLogin={this.state.visibleLogin}
                                               onCreateLogin={onCreateLogin}
                                               onCancelLogin={() => {
                                                   this.setState({visibleLogin: false, noInterval: false})
                                               }}
                    />
                </div>
            );
        };
        let act = this.state.activity
        let loading = this.state.loading
        let pieces = (this.props.match.params.id).split('-');
        let idActv = pieces[pieces.length - 1]
        let index = idActv
        if (this.state.redirect) {
            return <Redirect to='/annonces'/>;
        } else {
            return (
                <>
                 
                    <Link to={this.state.okVille ? '/' + this.state.okVille : '/ville-Agen'}>
                        <button className={"retour retourInDetail"} onClick={() => {
                        }
                        }>
                            <FontAwesomeIcon
                                icon={faArrowLeft} style={{marginRight: 7}}/>
                            Retour aux activités
                        </button>
                    </Link>
                    <Header props={this.propsAct}/>
                    <div >
                        <div className="detailActivity Activities  pt-5"
                             style={{backgroundColor: '#EDF2F7', minHeight: 'calc(100vh - 615px)'}}>
                            <div className={" container"}>
                                {loading ?
                                    <p className={'text-center my-5'}>
                                        <span className="fa fa-spin fa-spinner fa-4x">
                                        </span>
                                    </p> : this.state.NotFound ? <Block404/> :
                                        <>
                                            <div className="row">
                                                <div className="col-md-8 text-left mb-5 mb-md-0">
                                                    <div className="Activity h-100">
                                                        <div className="imgActivity" key={'activity-' + act.id}
                                                             style={{backgroundImage: `url(/images/imgHoverActuality.png),url(uploads/` + act.sousCentreInteret + `)`}}>

                                                            <svg xmlns="http://www.w3.org/2000/svg" width="51.669"
                                                                 height="42.635"
                                                                 style={{cursor: "pointer"}}
                                                                 onClick={() => {
                                                                     this.checkFavoris(this.state.client.token, act.id)
                                                                 }} viewBox="0 0 51.669 42.635" className="favoris">
                                                                {act.isFavoris ?
                                                                    <>
                                                                        <g id="heart-svgrepo-com_12_"
                                                                           data-name="heart-svgrepo-com (12)"
                                                                           transform="translate(2.498 2.5)">
                                                                            <g id="Artwork_15_1"
                                                                               transform="translate(0 0)">
                                                                                <g id="Layer_5_15_1"
                                                                                   transform="translate(0 0)">
                                                                                    <path id="Tracé_51"
                                                                                          data-name="Tracé 5"
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
                                                                              fontSize="21"
                                                                              fontFamily="Gordita_Regular">
                                                                            <tspan x="0" y="0">{act.nbreFavoris}</tspan>
                                                                        </text>
                                                                    </> :
                                                                    <>
                                                                        <g id="heart-svgrepo-com_1_"
                                                                           data-name="heart-svgrepo-com (1)"
                                                                           transform="translate(2.498 2.5)">
                                                                            <g id="Artwork_151_"
                                                                               transform="translate(0 0)">
                                                                                <g id="Layer_5_15_1"
                                                                                   transform="translate(0 0)">
                                                                                    <path id="Tracé_51"
                                                                                          data-name="Tracé 51"
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
                                                                              fontSize="21"
                                                                              fontFamily="Gordita_Regular">
                                                                            <tspan x="0" y="0">{act.nbreFavoris}</tspan>
                                                                        </text>
                                                                    </>
                                                                }
                                                            </svg>

                                                        </div>
                                                        <div className={"contentActivity bg-white p-3"}>
                                                            <h2 className="h3">{act.name}
                                                                <Link to={{
                                                                    //pathname: '/vitrine-' + act.nomStructure.replace(/ |-/g, '') + '-' + act.ville.replace(/ |-/g, '') + '-' + this.state.centre.partenaire,
                                                                    pathname: '/vitrine-' + (act.nomStructure).toString().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + act.villeSlug + '-' + (this.state.centre.partenaire).toString().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                                                                    state: {nomStructure: act.nomStructure}
                                                                }} className={'type'}>{act.nomStructure}
                                                                </Link>
                                                                {this.state.isToday && this.state.myTimer.value ?
                                                                    <span className="timer" key={index}>
                                                                        {this.state.myTimer.value}
                                                                    </span> : null}
                                                            </h2>
                                                            <br/>
                                                            <FacebookShareButton className={'btnWhite'}
                                                                                 url={window.location.href}
                                                                                 quote={act.name}
                                                                                 hashtag="#Bagzee">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25.607"
                                                                     height="22.047"
                                                                     viewBox="0 0 35.607 32.047">
                                                                    <g id="arrow-svgrepo-com_1_"
                                                                       data-name="arrow-svgrepo-com (1)"
                                                                       transform="matrix(-0.588, -0.809, 0.809, -0.588, 65.92, 94.697)">
                                                                        <path id="Vintage_Arrow_Down_1_"
                                                                              d="M104.778,31.975l7.058-6.958a1,1,0,0,0,0-1.426,1.026,1.026,0,0,0-1.441,0l-5.321,5.245V17.473l6.778-6.681a1.093,1.093,0,0,0,.3-.714V1a1.028,1.028,0,0,0-1.739-.713l-6.338,6.249L97.737.287a1.023,1.023,0,0,0-1.72.806V9.984a1.078,1.078,0,0,0,.28.807l6.761,6.665v11.4l-5.339-5.263a1.026,1.026,0,0,0-1.441,0,1,1,0,0,0,0,1.426l7.058,6.959a1.038,1.038,0,0,0,.729.288A1.116,1.116,0,0,0,104.778,31.975ZM98.034,9.655V3.425l5.024,4.953v6.229ZM105.075,8.4l5.061-4.989v6.23l-5.061,4.989Z"
                                                                              transform="translate(-12.135 -8.817)"
                                                                              fill="#30a3f2"/>
                                                                    </g>
                                                                </svg>


                                                                Partage-le avec tes amis
                                                            </FacebookShareButton>
                                                            <button className={'btnWhite'} onClick={() => {
                                                                this.checkFavoris(this.state.client.token, act.id)
                                                            }}>
                                                                {act.isFavoris ?
                                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                                         width="18.403"
                                                                         height="15.333" viewBox="0 0 27.696 22.333">
                                                                        <path id="Tracé_377" data-name="Tracé 377"
                                                                              d="M20.548,33.251c-3.755,0-6.136,4.186-6.7,4.186-.493,0-2.777-4.186-6.7-4.186A7.291,7.291,0,0,0,.012,40.208a8.362,8.362,0,0,0,1.557,5.275c1.953,2.965,10.5,10.1,12.291,10.1,1.835,0,10.3-7.111,12.266-10.1a8.361,8.361,0,0,0,1.557-5.275,7.29,7.29,0,0,0-7.135-6.958"
                                                                              transform="translate(0 -33.251)"
                                                                              fill="#30a3f2"/>
                                                                    </svg>
                                                                    : <svg xmlns="http://www.w3.org/2000/svg"
                                                                           width="18.403"
                                                                           height="15.333"
                                                                           viewBox="0 0 25.403 22.333">
                                                                        <path id="Tracé_184" data-name="Tracé 184"
                                                                              d="M23.352,30.574a7.034,7.034,0,0,0-9.947.005l-.695.695L12,30.569a7.027,7.027,0,0,0-9.947-.011,7.027,7.027,0,0,0,.011,9.947L12.182,50.619a.722.722,0,0,0,1.023.005l10.135-10.1a7.047,7.047,0,0,0,.011-9.952ZM22.318,39.5l-9.624,9.586-9.6-9.6A5.575,5.575,0,1,1,10.976,31.6l1.217,1.217a.725.725,0,0,0,1.029,0l1.206-1.206a5.579,5.579,0,0,1,7.89,7.89Z"
                                                                              transform="translate(0 -28.501)"
                                                                              fill="#30a3f2"/>
                                                                    </svg>}

                                                                Ajouter
                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-md-4 text-left">
                                                    <div className="Activity bg-white h-100">
                                                        <h2 className="h3">{act.name}</h2>
                                                        <div className="row mt-3 m-0 group_hour">
                                                            <div
                                                                className="col-6 py-2 d-flex flex-column justify-content-center ">
                                                                <span>
                                                                    <FontAwesomeIcon
                                                                        icon={faUsers} style={{marginRight: 7}}/>
                                                                    Participants
                                                                </span>
                                                                <b className={'d-block w-100'}>
                                                                    {act.nbrPlaceRest > 0 ? act.nbrPlaceRest + '/' + act.nbreOfPlace : act.nbreOfPlace + ' places restantes'}</b>
                                                            </div>
                                                            <div className="col-6 py-2">
                                                                <div className="row">
                                                                    <div className="col-12"
                                                                         style={{borderBottom: '1px solid #E6E6E6'}}>
                                                                        <FontAwesomeIcon icon={faCalendar}
                                                                                         style={{marginRight: 7}}/>
                                                                        Jour
                                                                        <br/>
                                                                        <b className={'d-inline-block firstLetterUpper'}>
                                                                            {moment(new Date(act.date.split('-')[2] + "-" + act.date.split('-')[1] + "-" + act.date.split('-')[0] + "T" + act.hFrom + ":00")).locale('fr').format('dddd D MMMM ')}
                                                                        </b>
                                                                    </div>
                                                                    <div className="col-12">
                                                                        <FontAwesomeIcon icon={faClock}
                                                                                         style={{marginRight: 7}}/>
                                                                        Heure
                                                                        <br/>
                                                                        <b> {act.hFrom}-{act.hTo}</b>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {this.state.abonnement.length >= this.state.qty ? null : act.price ?
                                                            <div className="horaire mt-3 m-0 row">
                                                                <div className="col-6 pl-0">
                                                                    <span className="oldPrice">
                                                                        {act.price * this.state.qty}€
                                                                    </span>
                                                                </div>
                                                                <div className="col-6 pr-0">
                                                                    <span className="newPrice">
                                                                        {((act.price - ((act.price * act.reduce) / 100)) * (this.state.qty - this.state.abonnement.length)).toFixed(2)}€
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            : null}
                                                        <div className={'remise mt-3'}>
                                                            {this.state.abonnement.length >= this.state.qty ?
                                                                'Gratuit' : act.price ?
                                                                    <span>
                                                                        Remise de :
                                                                        <b style={{paddingLeft: '7px'}}>-{act.reduce}
                                                                            %
                                                                        </b>
                                                                    </span> :
                                                                    'Gratuit'
                                                            }
                                                        </div>
                                                        <div
                                                            className={'count my-3 text-center d-flex justify-content-around'}>
                                                            <button className={'minus'} onClick={() => {
                                                                if (this.state.qty > 1) {
                                                                    let newQty = this.state.qty - 1
                                                                    this.setState({
                                                                        qty: newQty,
                                                                        errorPlus: false,
                                                                        errorMinus: false
                                                                    });
                                                                } else {
                                                                    this.setState({errorMinus: true, errorPlus: false});
                                                                }
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="15.209"
                                                                     height="2.093"
                                                                     viewBox="0 0 15.209 2.093">
                                                                    <path id="Tracé_200" data-name="Tracé 200"
                                                                          d="M22.209,191.013a1.78,1.78,0,0,1-1.944,1.547H1.943a2.212,2.212,0,0,1-1.374-.453A1.4,1.4,0,0,1,0,191.014a1.779,1.779,0,0,1,1.944-1.547H20.266A1.779,1.779,0,0,1,22.209,191.013Z"
                                                                          transform="translate(0 -189.467)"
                                                                          fill="#fff"/>
                                                                </svg>
                                                            </button>
                                                            <span>{this.state.qty} ticket{this.state.qty > 1 ?
                                                                <span>s</span> : null}</span>
                                                            <button className={'plus'} onClick={() => {
                                                                let nbrPlace = act.nbreOfPlace - act.nbrPlaceRest
                                                                if (this.state.qty < nbrPlace) {
                                                                    let newQty = this.state.qty + 1
                                                                    this.setState({
                                                                        qty: newQty,
                                                                        errorPlus: false,
                                                                        errorMinus: false
                                                                    });
                                                                } else {
                                                                    this.setState({errorPlus: true, errorMinus: false});
                                                                }
                                                            }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12.208"
                                                                     height="12.208"
                                                                     viewBox="0 0 22.208 22.208">
                                                                    <path id="Tracé_191" data-name="Tracé 191"
                                                                          d="M86.722,97.826H95.05v8.328a1.388,1.388,0,1,0,2.776,0V97.826h8.328a1.388,1.388,0,1,0,0-2.776H97.826V86.722a1.388,1.388,0,1,0-2.776,0V95.05H86.722a1.388,1.388,0,1,0,0,2.776Z"
                                                                          transform="translate(-85.334 -85.334)"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        {this.state.errorPlus || this.state.qty > act.nbreOfPlace ?
                                                            <p className={'text-danger text-center fs-small'}>Vous avez
                                                                atteint
                                                                le nombre
                                                                maximal restant</p> : null}
                                                        {this.state.errorMinus ?
                                                            <p className={'text-danger text-center fs-small'}>Quantité
                                                                doit
                                                                être
                                                                superieur à
                                                                0</p> : null}
                                                        {this.state.client.token == '' ?
                                                            <CollectionsPageLogin
                                                                key={'CollectionsPageLoginDetail-' + Math.random()}/>
                                                            :
                                                            <>
                                                                <button
                                                                    className={this.state.disabled || (act.nbreOfPlace <= act.nbrPlaceRest) || this.getTotalSecondes(act.date, act.hFrom) || act.canceled ? "btn-default w-100 isReserver disabled" : "btn-default w-100 isReserver"}
                                                                    onClick={() => {
                                                                        /*this.reserver(act)*/

                                                                        this.setState({disabled: true})
                                                                        axios.get('api/stripe/card/show?token=' + this.state.client.token).then(res => {
                                                                            this.setState({paiement: res.data.card}, () => {
                                                                                this.setState({showModal: true})
                                                                            })
                                                                        })
                                                                    }}>{this.state.disabled ? <>Réserver
                                                                    <span
                                                                        className="fa fa-spin fa-spinner "></span>
                                                                </> : 'Réserver'}
                                                                </button>
                                                                <Modal visible={this.state.showModal}
                                                                       onCancel={() => this.setState({
                                                                           showModal: false,
                                                                           disabled: false
                                                                       })}
                                                                       footer={
                                                                           [<Button key={'submit'} type={'primary'}
                                                                                    className={(this.state.paiement.length > 0) || (this.state.prixPromo != null && this.state.prixPromo == 0) || act.price == 0 ? ' w-100' : 'disabled w-100'}
                                                                                    onClick={() => {
                                                                                        if (this.state.qty == 1) {
                                                                                            this.reserver(act, 0);

                                                                                        } else {
                                                                                            this.reserver(act, 1);

                                                                                        }
                                                                                        this.setState({showModal: false})
                                                                                    }
                                                                                    }>Payer</Button>,
                                                                               <div className={'text-center mt-4'}>
                                                                                   <LazyLoadImage src={"/images/stripe.png"}
                                                                                        alt={'stripe'}/>
                                                                               </div>]}>
                                                                    <div className="row Activities">
                                                                        <div className="imgActivity"
                                                                             style={{backgroundImage: `url(/images/imgHoverActuality.png),url(uploads/` + act.sousCentreInteret + `)`}}>

                                                                        </div>
                                                                        <div className="col-md-12 imgActivity" style={{
                                                                            backgroundImage: `url(uploads/` + act.sousCentreInteret + `)`,
                                                                            borderRadius: 16,
                                                                            marginBottom: 20
                                                                        }}>

                                                                        </div>
                                                                        <div className="col-md-12">

                                                                            <h2 className={'text-center mb-4'}>{act.name}</h2>
                                                                            <p className={'pl-3'}
                                                                               style={{
                                                                                   color: '#939393',
                                                                                   fontSize: 'large'
                                                                               }}>{act.date.replaceAll('-', '/')}
                                                                                <br/>
                                                                                <span>X{this.state.qty} Réservation
                                                                                </span>
                                                                                {this.state.qty > 1 ? <>s</> : null}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {this.state.qty > 1 ? <div>
                                                                        <h5>Renseignez l’email de votre/vos
                                                                            accompagnant(s)
                                                                        </h5>
                                                                        <label style={{
                                                                            color: '#939393',
                                                                            fontFamily: 'Gordita_Medium'
                                                                        }}>Email
                                                                        </label>
                                                                        <Input className={'py-2 mb-3'} type={'email'}
                                                                               required={false}
                                                                               onChange={this.handleChange}
                                                                               placeholder={'Exemple: email_1@xx.com,email_2@xx.com'}/>


                                                                    </div> : null}
                                                                    <div className={'bgGray'}>
                                                                        <h5 className="my-3">AVANTAGES</h5>
                                                                        <h6 className="my-3">AJOUT CODE PROMO</h6>
                                                                        <Input.Group className={'my-3'} compact>
                                                                            <Input
                                                                                prefix={<LazyLoadImage
                                                                                    src={'/images/codePromo.png'}
                                                                                    alt={'code promo'}/>}
                                                                                placeholder={'Ajouter votre code promo'}
                                                                                style={{
                                                                                    width: '70%',
                                                                                    borderRadius: '6px 0 0 6px'
                                                                                }}
                                                                                id={this.state.textResponse}
                                                                                defaultValue={this.state.codePromos}
                                                                                value={this.state.codePromos}

                                                                                onFocus={() => {
                                                                                    this.setState({
                                                                                        reduceCodePromo: 0,
                                                                                        textResponse: '',
                                                                                        codePromos: '',
                                                                                    })
                                                                                }}
                                                                                onChange={this.handleChangeCodePromos}/>
                                                                            <Button type="primary" onClick={() => {
                                                                                axios.post('api/sponsorship/check', {
                                                                                    token: this.state.client.token,
                                                                                    codePromos: this.state.codePromos
                                                                                }).then(res => {
                                                                                    if (res.data.status) {
                                                                                        let prixPromo = ((((act.price - ((act.price * (act.reduce)) / 100)) * this.state.qty) - res.data.codePromos.reduce) + this.state.don).toFixed(2)
                                                                                        this.setState({
                                                                                            codePromos: res.data.codePromos.name,
                                                                                            prixPromo: prixPromo > 0 ? prixPromo : 0,
                                                                                            reduceCodePromo: res.data.codePromos.reduce,
                                                                                            reduceCodePromo2: res.data.codePromos.reduce,
                                                                                            codeParrainage: '',
                                                                                            parrainReduce: 0,
                                                                                            textResponse: 'text-success',
                                                                                            error: '',
                                                                                        })
                                                                                    } else {
                                                                                        this.setState({

                                                                                            codePromos: '',
                                                                                            reduceCodePromo: 0,
                                                                                            reduceCodePromo2: 0,
                                                                                            error: res.data.message,
                                                                                            textResponse: 'text-danger',
                                                                                        })
                                                                                    }
                                                                                })

                                                                            }}>Valider
                                                                            </Button>
                                                                        </Input.Group>
                                                                        <h6 className="mt-3">AJOUT CODE PARRAINAGE</h6>
                                                                        <Input.Group className={'my-3'} compact>
                                                                            <Input

                                                                                id={this.state.textResponse}
                                                                                prefix={<LazyLoadImage src={'/images/people.png'}
                                                                                             alt={'code parrainage'}/>}
                                                                                placeholder={'Ajouter votre code parrainage'}
                                                                                style={{
                                                                                    width: '70%',
                                                                                    borderRadius: '6px 0 0 6px'
                                                                                }}

                                                                                defaultValue={this.state.codeParrainage}


                                                                                onFocus={() => {
                                                                                    this.setState({
                                                                                        reduceCodePromo: 0,
                                                                                        codeParrainage: '',
                                                                                        textResponse: '',
                                                                                    })
                                                                                }}
                                                                                onChange={this.handleChangeCodeParrainage}/>
                                                                            <Button type="primary" onClick={() => {
                                                                                axios.post('api/check/code/parrain', {
                                                                                    token: this.state.client.token,
                                                                                    codeParrainage: this.state.codeParrainage
                                                                                }).then(res => {
                                                                                    let reduction = this.state.reduce ? this.state.reduce : 0
                                                                                    if (res.data.status) {

                                                                                        let prixPromo = ((((act.price - ((act.price * (act.reduce)) / 100)) * this.state.qty)) - 5 + this.state.don).toFixed(2)

                                                                                        this.setState({
                                                                                            codeParrainage: res.data.codeParrainage,
                                                                                            prixPromo: prixPromo > 0 ? prixPromo : 0,
                                                                                            parrainReduce: -5,
                                                                                            reduceCodePromo: 0,
                                                                                            reduceCodePromo2: 5,
                                                                                            codePromos: "",
                                                                                            textResponse: 'text-success',
                                                                                            error: '',
                                                                                        })

                                                                                    } else {
                                                                                        let prixPromo = ((((act.price - ((act.price * (act.reduce)) / 100)) * this.state.qty)) + this.state.don).toFixed(2)

                                                                                        this.setState({
                                                                                            parrainReduce: 0,
                                                                                            prixPromo: prixPromo > 0 ? prixPromo : 0,
                                                                                            reduceCodePromo: 0,
                                                                                            reduceCodePromo2: 0,
                                                                                            error: res.data.message,
                                                                                            textResponse: 'text-danger',
                                                                                        })
                                                                                    }
                                                                                })

                                                                            }}>Valider
                                                                            </Button>
                                                                        </Input.Group>
                                                                        {this.state.error != '' ?
                                                                            <p className={'text-danger'}>{this.state.error}</p> : null}
                                                                    </div>

                                                                    {this.state.paiement.length == 0 ?
                                                                        <div
                                                                            className="methodePay pb-3 my-3 text-center">
                                                                            <Elements
                                                                                stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                                                                <CardForm
                                                                                    children={'Ajouter une carte'}/>

                                                                            </Elements>

                                                                        </div>
                                                                        :
                                                                        <div className={'methodePay pb-3 my-3'}>
                                                                            {this.state.paiement.map(card =>
                                                                                card.checked ?
                                                                                    <p className={'d-flex flex-md-row flex-column justify-content-between'}
                                                                                       key={card.id}>
                                                                                        <span>
                                                                                            <Elements
                                                                                                stripe={loadStripe(settings.stripe.publishableKey, {locale: 'fr'})}>
                                                                                                <CardForm
                                                                                                    children={'Moyen de paiement'}/>

                                                                                            </Elements>
                                                                                        </span>
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
                                                                    {this.state.association.title ?
                                                                        <>
                                                                            <p style={{
                                                                                color: '#AAAAAA',
                                                                                textAlign: 'center',
                                                                                fontSize: 18
                                                                            }}>Bagzee est
                                                                                partenaire de
                                                                                <u>
                                                                                    <b style={{
                                                                                        color: '#000',
                                                                                        paddingLeft: 7
                                                                                    }}>{this.state.association.title}</b>
                                                                                </u>
                                                                                ,
                                                                                veux-tu leur faire un don ?
                                                                            </p>
                                                                            <Radio.Group className={'btndon mb-3'}
                                                                                         onChange={this.handleChangeDon}
                                                                                         value={this.state.don}>
                                                                                <Radio.Button value={0}>0 €
                                                                                </Radio.Button>
                                                                                <Radio.Button value={0.5}>0.5 €
                                                                                </Radio.Button>
                                                                                <Radio.Button value={1}>1 €
                                                                                </Radio.Button>
                                                                                <Radio.Button value={3}>3 €
                                                                                </Radio.Button>
                                                                            </Radio.Group>
                                                                        </> : null}
                                                                    {this.state.abonnement.length >= this.state.qty && !this.state.don ?
                                                                        <div className={'row'}>
                                                                            <div className={'col-12'}>
                                                                                <h5 className="newPrice text-center text-success">
                                                                                    Gratuit
                                                                                </h5>
                                                                            </div>
                                                                        </div> : act.price || this.state.don ?
                                                                            <div className={'row mb-3'}>
                                                                                {this.state.reduceCodePromo2 || this.state.parrainReduce ?
                                                                                    <>
                                                                                        <div className={'col-8'}>
                                                                                            <h5>Réduction</h5>
                                                                                        </div>
                                                                                        <div
                                                                                            className={'col-4 text-right'}>

                                                                                            <h5 className="newPrice"
                                                                                                style={{color: '#000'}}>

                                                                                                {this.state.reduceCodePromo2 && this.state.parrainReduce?(this.state.reduceCodePromo2-this.state.parrainReduce).toFixed(2):this.state.reduceCodePromo2 ? (this.state.reduceCodePromo2).toFixed(2) : '5.00'}
                                                                                                €
                                                                                            </h5>
                                                                                        </div>
                                                                                    </> : null}
                                                                                {act.reduce ?
                                                                                    <>
                                                                                        <div className={'col-8'}>
                                                                                            <h5>Remise de</h5>
                                                                                        </div>
                                                                                        <div
                                                                                            className={'col-4 text-right'}>
                                                                                            <h5
                                                                                                className="newPrice"
                                                                                                style={{color: '#000'}}>
                                                                                                -{act.reduce}%
                                                                                            </h5>
                                                                                        </div>
                                                                                    </> : null}
                                                                                {this.state.don ? <>
                                                                                    <div className={'col-8'}>
                                                                                        <h5>Don</h5>
                                                                                    </div>
                                                                                    <div className={'col-4 text-right'}>
                                                                                        <h5 className="newPrice"
                                                                                            style={{color: '#000'}}>
                                                                                            {(this.state.don).toFixed(2)}
                                                                                            €
                                                                                        </h5>
                                                                                    </div>
                                                                                </> : null}
                                                                                <div className={'col-8'}>
                                                                                    <h5>Total</h5>
                                                                                </div>
                                                                                <div className={'col-4 text-right'}>
                                                                                    <h5
                                                                                        className="newPrice">
                                                                                        <span className="oldPrice">
                                                                                            {act.price * this.state.qty}€
                                                                                        </span>

                                                                                        {((((act.price - ((act.price * (act.reduce)) / 100)) * (this.state.qty - this.state.abonnement.length)) - this.state.reduceCodePromo2) + this.state.don).toFixed(2) > 0 ? ((((act.price - ((act.price * (act.reduce)) / 100)) * (this.state.qty - this.state.abonnement.length)) - this.state.reduceCodePromo2) + this.state.don).toFixed(2) : 0}
                                                                                        €
                                                                                    </h5>
                                                                                </div>
                                                                            </div>
                                                                            : <div className={'row'}>
                                                                                <div className={'col-12'}>
                                                                                    <h5 className="newPrice text-center text-success">
                                                                                        Gratuit
                                                                                    </h5>
                                                                                </div>
                                                                            </div>}

                                                                </Modal>
                                                            </>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row mt-5">
                                                <div className="col-md-12 text-left mb-5 order-2 order-md-1">
                                                    <div className={'Activity'}>
                                                        <h2 className="h5">Description</h2>
                                                        <p className={'mb-0'}>🎫 Activité</p>
                                                        <div className={'mb-4 mt-3'}
                                                             dangerouslySetInnerHTML={{__html: act.activity}}>
                                                        </div>
                                                        {act.equipement != '' ?
                                                            <>
                                                                <p className={'mb-0'}>👕 Equipement
                                                                </p>
                                                                <div className={'mb-4 mt-3'}
                                                                     dangerouslySetInnerHTML={{__html: act.equipement}}>
                                                                </div>
                                                            </>
                                                            : null}
                                                        {act.lieu != '' ?
                                                            <>
                                                                <p className={'mb-0'}>📅 Horaires & lieu</p>
                                                                <div className={'mb-4 mt-3'}
                                                                     dangerouslySetInnerHTML={{__html: act.lieu}}>
                                                                </div>
                                                            </> : null}
                                                        {act.obligatoire ?
                                                            <>
                                                                <p className={'mb-0'}>📍 Obligatoire</p>
                                                                <div className={'mb-4 mt-3'}
                                                                     dangerouslySetInnerHTML={{__html: act.obligatoire}}>
                                                                </div>
                                                            </>
                                                            : null}
                                                    </div>
                                                </div>
                                                <div className="col-md-6 text-left mb-5 order-1 order-md-2">
                                                    <h2 className="h5">Participants :</h2>
                                                    <div className={'Activity whiteBlock my-4'}>
                                                        {act.client.length > 0 ?
                                                            act.client.map(clt =>
                                                                <div
                                                                    className='row mb-2 align-items-center participants'>
                                                                    <div className={'col-12 text-center mb-2 col-md-2'}>
                                                                        {(clt.nbreTicketTotal > 0 && clt.nbreTicketTotal <= 4) ?
                                                                            <LazyLoadImage src={"/images/badge-1.png"}
                                                                                 alt={'badge'}
                                                                                 style={{maxWidth: '40px'}}/> :
                                                                            (clt.nbreTicketTotal > 5 && clt.nbreTicketTotal <= 9) ?
                                                                                <LazyLoadImage src={"/images/badge-5.png"}
                                                                                     alt={'badge'}
                                                                                     style={{maxWidth: '40px'}}/> :
                                                                                (clt.nbreTicketTotal > 10 && clt.nbreTicketTotal <= 19) ?
                                                                                    <LazyLoadImage src={"/images/badge-10.png"}
                                                                                         alt={'badge'}
                                                                                         style={{maxWidth: '40px'}}/>
                                                                                    : clt.nbreTicketTotal > 19 ?
                                                                                    <LazyLoadImage src={"/images/badge-20.png"}
                                                                                         alt={'badge'}
                                                                                         style={{maxWidth: '40px'}}/> :
                                                                                    <LazyLoadImage src={"/images/badge-0.png"}
                                                                                         alt={'badge'}
                                                                                         style={{maxWidth: '40px'}}/>}
                                                                    </div>
                                                                    <div className={'col-4 col-md-2 mb-2 text-center'}>
                                                                        {clt.photo != '' ?
                                                                            <div style={{
                                                                                width: '50px',
                                                                                height: '50px',
                                                                                backgroundImage: 'url(' + clt.photo + ')',
                                                                                backgroundPosition: 'center',
                                                                                backgroundSize: 'cover',
                                                                                borderRadius: '50px'
                                                                            }}></div> :
                                                                            <LazyLoadImage src={"/images/avatar-person.png"}
                                                                                 alt={clt.firstName}
                                                                                 style={{maxWidth: '50px'}}/>
                                                                        }
                                                                    </div>
                                                                    <div className={'col-8  text-left mb-2 col-md-5'}>
                                                                        {clt.name}</div>
                                                                    <div className={'col-12 col-md-3 mb-2 text-center'}>
                                                                        <span
                                                                            className={'ticket'}>
                                                                            {clt.nbreTicket} ticket
                                                                            {clt.nbreTicket > 1 ?
                                                                                's' :
                                                                                null
                                                                            }</span>
                                                                    </div>
                                                                </div>
                                                            ) :
                                                            <p className={'p-2'}>Premiers arrivés, premiers servis.
                                                                Réserve
                                                                ta place maintenant et d’autres Bagzeeers vont te
                                                                rejoindre !
                                                                😉
                                                                <br/>
                                                                <br/>
                                                                (Pas de panique, tu ne seras débité(e) que si le créneau
                                                                atteint un nombre suffisant de participants)
                                                            </p>}

                                                    </div>
                                                </div>
                                                {/* <div className="col-md-6 text-left mb-5">
                                <div className={'Activity h-100'}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{key: 12545646465}}
                                        defaultCenter={this.props.center}
                                        defaultZoom={this.props.zoom}
                                    >
                                        <AnyReactComponent
                                            lat={59.955413}
                                            lng={30.337844}
                                            text="My Marker"
                                        />
                                    </GoogleMapReact>
                                </div>
                            </div>*/}
                                            </div>
                                        </>}
                            </div>
                        </div>

                        <PartageBlock/>
                        <Footer/>
                    </div>

                </>
            )
        }
    }
}


export default DetailActivity;
