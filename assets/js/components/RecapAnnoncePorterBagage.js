import React, {Component, useContext} from 'react';
import {withTranslation} from "react-i18next";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link, Redirect} from "react-router-dom";
import {Checkbox, Modal, Upload} from "antd";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Autocomplete from "react-google-autocomplete";
import {createFilter} from "react-search-input";
import {user} from "../app";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "./chatComponents/AuthContext";
import {collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from "../hooks/firebase";

const KEYS_TO_FILTERSA = ['adress.ville']


function getBase64PP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class RecapAnnoncePorterBagage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            disabled: false,
            ville_arrivee: '',
            ville_depart: '',
            idPointRelaisArr: '',
            idPointRelaisDep: '',
            price: 30,
            newprice: 30,
            myReservation: {},
            listeContenu: [],
            bagages: {
                ville_depart: '',
                ville_arrivee: '',
                heureDepart: '',
                heureArrivee: '',
                dateArrivee: '',
                dateDepart: '',
                dimensionsLong: '',
                dimensionsH: '',
                dimensionsLarg: '',
                dimensionsKg: '',
            },
            arrivee: {
                ville_arrivee: '',
                heure: '',
                date: '',
                isPointRelais: false,
                isDomicile: false,
                isAutre: false,
                isIndifferent: false,
                pointRelais: [],
                domicile: [],
                autreLieux: [],
                placeHolderSelect: props.t('circuit_depot_annonce.point_relais')
            },
            depart: {
                ville_depart: '',
                heure: '',
                date: '',
                isPointRelais: false,
                isDomicile: false,
                isAutre: false,
                isIndifferent: false,
                pointRelais: [],
                domicile: [],
                autreLieux: [],
                placeHolderSelect: props.t('circuit_depot_annonce.point_relais')
            },


            adresse_point_depart: '',
            lat_adresse_point_depart: 0,
            long_adresse_point_depart: 0,
            assurancePriceDep: 0,
            assurancePriceArr: 0,
            adresse_point_arrivee: '',
            lat_adresse_point_arrivee: 0,
            long_adresse_point_arrivee: 0,
            loading: true,
            loadingPhoto: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            gellery: [],

        }
        this.handleChangeConfierRetrait = this.handleChangeConfierRetrait.bind(this);
        this.handleChangeDescBagage = this.handleChangeDescBagage.bind(this);

        window.scrollTo(0, 0);
    }

    handleChangeConfierRetrait(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            arrivee: {
                ...prevState.arrivee,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }

    handleChangeDescBagage(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            bagages: {
                ...prevState.bagages,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }


    componentDidMount() {
        axios.get('api/relay_point/list').then(res => {
            if (res.data.status) {
                this.setState(prev => ({
                    depart: {
                        ...prev.depart,
                        pointRelais: res.data.point_relais
                    },
                    arrivee: {
                        ...prev.arrivee,
                        pointRelais: res.data.point_relais
                    }
                }))
            }
        })

        axios.post('api/address/list', {token: user?.client?.token}).then(res => {
            if (res.data.status) {
                this.setState(prevState => ({
                        depart: {
                            ...prevState.depart,    // keep all other key-value pairs
                            domicile: res.data.mesAdresses
                        }, arrivee: {
                            ...prevState.arrivee,    // keep all other key-value pairs
                            domicile: res.data.mesAdresses
                        }
                    })
                );
            }
        })
        axios.get('api/payment/setting/price').then(res => {
            let neww = JSON.parse(JSON.stringify(res.data.setting_price));
            if (res.data.status) {
                this.setState({
                    settingPriceDep: res.data.setting_price,
                    settingPriceArr: neww

                }, () => {
                    console.log(this.state.settingPriceDep)
                    console.log(this.state.settingPriceArr)
                })
            }

        })
        if (this.props.location?.state?.myReservation) {
            /*page je veux porter un bagage vers recapitulatif annonce*/
            this.setState({
                myReservation: this.props.location.state.myReservation,
                price: this.props.location.state.myReservation.price,
                newprice: this.props.location.state.myReservation.price,
                listeContenu: this.props.location.state.myReservation.listeContenu,
                gellery: this.props.location.state.myReservation.gallery
            }, () => {
                console.log(this.props.location.state.myReservation)
                this.setState({loading: false})
            })
        } else {
            /*modifier annonce demande reservation vers recapitulatif annonce */

            axios.post('api/profil/adverts/query/by/id', {
                id_order: this.props.match.params.id,
                token: user.client.token
            }).then(res => {
                let advert = res.data.advert_query
                this.setState(prevState => ({
                    orderId: advert.orderId,
                    depart: {
                        ...prevState.depart,
                        nomEntreprise: advert.type_adresse_depart == "Point relais" && advert.nomEntrepriseDep,
                        isPointRelais: advert.type_adresse_depart == "Point relais" ? true : false,
                        isDomicile: advert.type_adresse_depart == "Domicile" ? true : false,
                        isAutre: advert.type_adresse_depart == "Autre lieux" ? true : false,
                        isIndifferent: advert.type_adresse_depart == "Indifferent" ? true : false,
                        adresse_point_depart: advert.adresse_point_depart,
                        lat_adresse_point_depart: advert.lat_adresse_point_depart,
                        long_adresse_point_depart: advert.long_adresse_point_depart,
                    },
                    arrivee: {
                        ...prevState.arrivee,
                        nomEntreprise: advert.type_adresse_arrivee == "Point relais" && advert.nomEntrepriseArr,
                        isPointRelais: advert.type_adresse_arrivee == "Point relais" ? true : false,
                        isDomicile: advert.type_adresse_arrivee == "Domicile" ? true : false,
                        isAutre: advert.type_adresse_arrivee == "Autre lieux" ? true : false,
                        isIndifferent: advert.type_adresse_arrivee == "Indifferent" ? true : false,
                        adresse_point_arrivee: advert.adresse_point_arrivee,
                        lat_adresse_point_arrivee: advert.lat_adresse_point_arrivee,
                        long_adresse_point_arrivee: advert.long_adresse_point_arrivee,
                    },
                    bagages: {
                        ...prevState.bagages,
                        dimensionsLong: advert.dimensionsLong,
                        dimensionsH: advert.dimensionsH,
                        dimensionsKg: advert.dimensionsKg,
                        dimensionsLarg: advert.dimensionsLarg,
                        ville_depart: advert.ville_depart,
                        ville_arrivee: advert.ville_arrivee,
                        heureDepart: advert.heureDepart,
                        dateDepart: advert.dateDepart,
                        heureArrivee: advert.heureArrivee,
                        dateArrivee: advert.dateArrivee,
                    },
                    myReservation: advert.infoAnnonce,
                    settingPriceDep: advert.porteurs.objectRelaisDepart.length ? advert.porteurs.objectRelaisDepart : this.state.settingPriceDep,
                    settingPriceArr: advert.porteurs.objectRelaisArriv.length ? advert.porteurs.objectRelaisArriv : this.state.settingPriceArr,

                    infoAvis: {
                        total: advert.porteurs.totalAvis,
                        nbrAvis: advert.porteurs.nbrAvis,
                    },
                    adresse_point_depart: advert.adresse_point_depart,
                    lat_adresse_point_depart: advert.lat_adresse_point_depart,
                    long_adresse_point_depart: advert.long_adresse_point_depart,
                    adresse_point_arrivee: advert.adresse_point_arrivee,
                    lat_adresse_point_arrivee: advert.lat_adresse_point_arrivee,
                    long_adresse_point_arrivee: advert.long_adresse_point_arrivee,
                    idPointRelaisDep: advert.idPointRelaisDep,
                    idPointRelaisArr: advert.idPointRelaisArr,
                    listeContenu: advert.listeContenu,
                    price: advert.porteurs.price_porteur,
                    newprice: advert.porteurs.price_porteur,
                    gellery: advert.gallery,
                    fileList: advert.gallery,

                }), () => {
                    let oldRelaisArr= 0;
                    let oldRelaisDep=0;
                    this.state.myReservation?.objectRelaisDepart?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisDep=oldRelaisDep+item.price)
                    this.state.myReservation?.objectRelaisArriv?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisArr=oldRelaisArr+item.price)

                    this.state.settingPriceDep?.map(working =>
                        (working.checked && this.setState({assurancePriceDep: (this.state.assurancePriceDep + working.price) - oldRelaisDep }, () => {
                            console.log(working.price)
                            console.log(this.state.assurancePriceDep)

                        })))

                    this.state.settingPriceArr?.map(working =>
                        (working.checked && this.setState({assurancePriceArr: (this.state.assurancePriceArr + working.price)-oldRelaisArr}, () => {
                            console.log(this.state.assurancePriceArr)

                        })))

                    this.setState(prevState => ({
                        myReservation: {
                            ...prevState.myReservation,
                            client: advert.porteurs
                        }, loading: false
                    }))
                    console.log(advert.gallery)
                });


            })
        }
    }

    handleCancel = () => this.setState({previewVisible: false});
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64PP(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    onCheckboxChangeAssDep(event, price) {
        const target = event.target;
        console.log(target.checked)
        const value = target.checked;
        const name = target.name;
        let oldRelaisDep=0;
        this.state.myReservation?.objectRelaisDepart?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisDep=oldRelaisDep+item.price)

        this.setState(prevState => ({
            settingPriceDep: prevState.settingPriceDep.map(working =>
                ('dep-' + working.name === name ? Object.assign(working, {checked: true}) : Object.assign(working, {checked: false}))),

            newprice: this.state.assurancePriceDep ? (this.state.newprice - this.state.assurancePriceDep) + price : (this.state.newprice-oldRelaisDep) + price,
            price: this.state.assurancePriceDep ? (this.state.newprice - this.state.assurancePriceDep) + price : (this.state.newprice-oldRelaisDep) + price,
            assurancePriceDep: price
        }), () => {
            console.log(this.state.settingPriceDep)
            console.log(this.state.settingPriceArr)
        });


    }

    onCheckboxChangeAssArr(event, price) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        let oldRelaisArr= 0;
        this.state.myReservation?.objectRelaisArriv?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisArr=oldRelaisArr+item.price)
        this.setState(prevState => ({
            settingPriceArr: prevState.settingPriceArr.map(working =>
                ('arr-' + working.name === name ? Object.assign(working, {checked: true}) : Object.assign(working, {checked: false}))),
            newprice: this.state.assurancePriceArr ? (this.state.newprice - this.state.assurancePriceArr) + price :  (this.state.newprice-oldRelaisArr) + price,
            price: this.state.assurancePriceArr ? (this.state.newprice - this.state.assurancePriceArr) + price :  (this.state.newprice-oldRelaisArr) + price,
            assurancePriceArr: price


        }), () => console.log(this.state.settingPriceArr));


    }

    onRemoveAllCheck(type) {
        console.log(type)
        let oldRelaisArr= 0;
        let oldRelaisDep= 0;
        this.state.myReservation?.objectRelaisDepart?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisDep=oldRelaisDep+item.price)
        this.state.myReservation?.objectRelaisArriv?.filter(val=>val.checked&&val.isRelais).map(item=>oldRelaisArr=oldRelaisArr+item.price)
        if (type == 'assurancePriceDep') {
            this.setState(prevState => ({
                settingPriceDep: prevState.settingPriceDep.map(working =>
                    (Object.assign(working, {checked: false}))),
                newprice: this.state.assurancePriceDep!=0?(this.state.newprice - this.state.assurancePriceDep)+oldRelaisDep:this.state.newprice,
                price: this.state.assurancePriceDep!=0?(this.state.newprice - this.state.assurancePriceDep)+oldRelaisDep:this.state.price,
                assurancePriceDep: 0

            }), () => {
                console.log(this.state.assurancePriceDep)
                console.log(this.state.newprice)
            })
        } else {
            this.setState(prevState => ({
                settingPriceArr: prevState.settingPriceArr.map(working =>
                    (Object.assign(working, {checked: false}))),
                newprice: this.state.assurancePriceArr!=0?(this.state.newprice - this.state.assurancePriceArr)+oldRelaisArr:this.state.newprice,
                price: this.state.assurancePriceArr!=0?(this.state.newprice - this.state.assurancePriceArr)+oldRelaisArr:this.state.newprice,
                assurancePriceArr: 0,

            }), () => {
                console.log(this.state.assurancePriceArr)
                console.log(this.state.newprice)
            })
        }

    }

    soumettre() {
        const {depart, arrivee, bagages} = this.state
        let type_adresse_depart = ""
        let type_adresse_arrivee = ""

        depart.isPointRelais ? type_adresse_depart = "Point relais" :
            depart.isDomicile ? type_adresse_depart = "Domicile" :
                depart.isAutre ? type_adresse_depart = "Autre lieux" :
                    depart.isIndifferent ? type_adresse_depart = "Indifferent" : null
        arrivee.isPointRelais ? type_adresse_arrivee = "Point relais" :
            arrivee.isDomicile ? type_adresse_arrivee = "Domicile" :
                arrivee.isAutre ? type_adresse_arrivee = "Autre lieux" :
                    arrivee.isIndifferent ? type_adresse_arrivee = "Indifferent" : null
        axios.post(this.props.location?.state?.myReservation ? 'api/advert/query/create' : 'api/advert/query/update', {
            "id": this.props.match.params.id && this.props.match.params.id,
            "settingPriceDep": this.state.settingPriceDep,
            "settingPriceArr": this.state.settingPriceArr,
            "idPointRelaisDep": this.state.idPointRelaisDep,
            "idPointRelaisArr": this.state.idPointRelaisArr,
            "ville_depart": bagages.ville_depart,
            "ville_arrivee": bagages.ville_arrivee,
            "type_adresse_depart": type_adresse_depart,
            "type_adresse_arrivee": type_adresse_arrivee,
            "adresse_point_arrivee": this.state.adresse_point_arrivee,
            "lat_adresse_point_arrivee": this.state.lat_adresse_point_arrivee,
            "long_adresse_point_arrivee": this.state.long_adresse_point_arrivee,
            "adresse_point_depart": this.state.adresse_point_depart,
            "lat_adresse_point_depart": this.state.lat_adresse_point_depart,
            "long_adresse_point_depart": this.state.long_adresse_point_depart,
            "fromDate": bagages.dateDepart,
            "fromTime": bagages.heureDepart,
            "toDate": bagages.dateArrivee,
            "toTime": bagages.heureArrivee,
            "dimensionsLong": bagages.dimensionsLong != '' ? bagages.dimensionsLong : 0,
            "dimensionsH": bagages.dimensionsH != '' ? bagages.dimensionsH : 0,
            "dimensionsKg": bagages.dimensionsKg != 0 ? bagages.dimensionsKg : 0,
            "dimensionsLarg": bagages.dimensionsLarg != '' ? bagages.dimensionsLarg : 0,
            "token": user.client.token,
            "listeContenu": this.state.listeContenu,
            "gallery": this.state.gellery,
            "price": this.state.newprice,
            "advert_id": this.props.location?.state?.myReservation ? this.state.myReservation.id : this.state.orderId

        }).then(res => {
            Modal.success({
                content: (
                    <div className={"text-center"} key={'onCreateAnnConf' + Math.random()}>
                        <LazyLoadImage src={res.data.status ? "/images/demandeSoumise.png" : "/images/logo.png"}
                                       alt={"demande"}/>
                        <p className={"text-gris fs-5 py-4"}>
                            {res.data.status ? this.props.t('recap.demandeSoumise') : res.data.message}
                        </p>

                    </div>),
                okText: 'ok',
                onOk: () => {
                    this.setState({redirect: true})

                }
            });

        })

    }

    render() {
        const {t} = this.props;
        const {loading, myReservation, price, listeContenu, previewVisible, depart, arrivee, previewImage} = this.state;
        let objArr = this.state.assurancePriceArr ? this.state.settingPriceArr : myReservation?.objectRelaisArriv
        let objDep = this.state.assurancePriceDep ? this.state.settingPriceDep : myReservation?.objectRelaisDepart

        const CombinerChat = ({emailClient, orderInfo}) => {
            const {currentUser} = useContext(AuthContext);
            return (
                <div onClick={async () => {
                    let myUser = {};
                    try {
                        const q = query(
                            collection(db, "users"),
                            where("email", "==", emailClient) //order.client.email
                        );
                        const querySnapshot = await getDocs(q);
                        console.log("querySnapshot", querySnapshot);

                        querySnapshot.forEach((doc) => {
                            myUser = doc.data();
                            console.log(doc.data());
                        });
                    } catch (e) {
                        console.log(e);
                    }
                    const combinedId =
                        currentUser.uid > myUser.uid
                            ? currentUser.uid + myUser.uid
                            : myUser.uid + currentUser.uid;
                    try {
                        const res = await getDoc(doc(db, "chats", combinedId));
                        console.log("combinedId", combinedId);
                        console.log("res", res);
                        if (!res.exists()) {
                            //create a chat in chats collection
                            await setDoc(doc(db, "chats", combinedId), {messages: []});

                            //create user chats
                            await updateDoc(doc(db, "userChats", currentUser.uid), {
                                [combinedId + ".userInfo"]: {
                                    uid: myUser.uid,
                                    displayName: myUser.displayName,
                                    photoURL: myUser.photoURL ? myUser.photoURL : "/images/avatar-person.png"

                                },
                                [combinedId + ".date"]: serverTimestamp(),
                            });

                            await updateDoc(doc(db, "userChats", myUser.uid), {
                                [combinedId + ".userInfo"]: {
                                    uid: currentUser.uid,
                                    displayName: currentUser.displayName,
                                    photoURL: currentUser.photoURL ? currentUser.photoURL : "/images/avatar-person.png",
                                },
                                [combinedId + ".date"]: serverTimestamp(),
                            });

                            this.setState({myUser: myUser, orderInfo: myReservation}, () => {
                                console.log(this.state.orderInfo)
                                this.setState({redirectChat: true});
                            });
                        } else {
                            this.setState({myUser: myUser, orderInfo: myReservation}, () => {
                                console.log(this.state.orderInfo)
                                this.setState({redirectChat: true});
                            });
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }} className={"mb-0 text-orange pointer"}>{t('btns.contacter')}</div>

            );
        };

        if (this.state.redirectChat) {
            return (
                <Redirect
                    to={{
                        pathname: "/tchat-group",
                        state: {
                            myUser: this.state.myUser,
                            orderInfo: this.state.orderInfo,
                        },
                    }}
                />
            );
        } else if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/annonces',
                state: {statusName: t('page_annonce.reservation_demande_enAttente'), status: 0}
            }}/>;
        } else
            return (
                loading ?
                    <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                    </p> :
                    <div>
                        <Header/>
                        <section className={'depotAnnonce container text-center py-5'}>

                            <p className={'text-dark-blue'}>{t('circuit_depot_annonce.recapAnn')}</p>

                            <div className={"recapBorderedBlock"}>
                                <div className={"d-flex flex-column flex-lg-row align-items-center"}>
                                    <div className="d-flex justify-content-between w-100">

                                        <div className={"col-md-2 text-capitalize"}>
                                            <svg style={{
                                                position: 'absolute',
                                                top: '-18px',
                                                left: 0,
                                            }} xmlns="http://www.w3.org/2000/svg" width="27.515" height="35.661"
                                                 viewBox="0 0 27.515 35.661">
                                                <g id="pin-svgrepo-com_2_" data-name="pin-svgrepo-com (2)"
                                                   transform="translate(52.386 35.411) rotate(180)">
                                                    <g id="Groupe_4899" data-name="Groupe 4899"
                                                       transform="translate(25.121)">
                                                        <g id="Groupe_4898" data-name="Groupe 4898"
                                                           transform="translate(0)">
                                                            <path id="Tracé_6731" data-name="Tracé 6731"
                                                                  d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                  transform="translate(-25.121)" fill="#4bbded"
                                                                  stroke="#4bbded" strokeWidth="0.5"/>
                                                            <path id="Tracé_6732" data-name="Tracé 6732"
                                                                  d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                  transform="translate(-68.326 -99.979)"
                                                                  fill="#4bbded"
                                                                  stroke="#4bbded" strokeWidth="0.5"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            {myReservation.ville_depart}<br/>
                                            <LazyLoadImage
                                                src={"/images/" + myReservation.type_adresse_depart.toLowerCase().replace(' ', '') + ".png"}
                                                alt={myReservation.type_adresse_depart}/>
                                            <br/> <sup style={{
                                            fontSize: 'x-small',
                                            color: '#b9b9b9'
                                        }}>{myReservation.type_adresse_depart}</sup>
                                        </div>

                                        <div className={'col-5 col-md-8'}>
                                            <div
                                                className={'d-flex flex-md-row flex-column justify-content-center align-items-center gap-2'}>
                                                {myReservation.objectTransport.includes("Voiture") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="35.965" height="17.26"
                                                         viewBox="0 0 35.965 17.26">
                                                        <g id="car-svgrepo-com_1_"
                                                           data-name="car-svgrepo-com (1)"
                                                           transform="translate(0 0)">
                                                            <g id="Groupe_3569"
                                                               data-name="Groupe 3569">
                                                                <path id="Tracé_4987"
                                                                      data-name="Tracé 4987"
                                                                      d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                                      transform="translate(19.229 -6.929)"
                                                                />
                                                                <path id="Tracé_4988"
                                                                      data-name="Tracé 4988"
                                                                      d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                                      transform="translate(0 -8.177)"
                                                                />
                                                                <path id="Tracé_4989"
                                                                      data-name="Tracé 4989"
                                                                      d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                                      transform="translate(-16.083 -6.929)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Car") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="32.58" height="16.883"
                                                         viewBox="0 0 32.58 16.883">
                                                        <g id="bus-svgrepo-com_2_"
                                                           data-name="bus-svgrepo-com (2)"
                                                           transform="translate(0 -83.368)">
                                                            <g id="Groupe_4744"
                                                               data-name="Groupe 4744"
                                                               transform="translate(0 83.368)">
                                                                <path id="Tracé_6610"
                                                                      data-name="Tracé 6610"
                                                                      d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                                      transform="translate(0 -83.368)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Camion") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="33.884" height="17.048"
                                                         viewBox="0 0 33.884 17.048">
                                                        <path id="truck-svgrepo-com_1_"
                                                              data-name="truck-svgrepo-com (1)"
                                                              d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                              transform="translate(0 -96.384)"
                                                        />
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Avion") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="32.625" height="17.048"
                                                         viewBox="0 0 32.625 17.048">
                                                        <g id="XMLID_909_"
                                                           transform="translate(0 -110.089)">
                                                            <g id="Groupe_4745"
                                                               data-name="Groupe 4745"
                                                               transform="translate(0 110.089)">
                                                                <path id="Tracé_6611"
                                                                      data-name="Tracé 6611"
                                                                      d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                                      transform="translate(0 -110.089)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Train") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="21.018" height="18.048"
                                                         viewBox="0 0 21.018 18.048">
                                                        <g id="train-svgrepo-com_2_"
                                                           data-name="train-svgrepo-com (2)"
                                                           transform="translate(0 -20.392)">
                                                            <path id="Tracé_6612"
                                                                  data-name="Tracé 6612"
                                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                            />
                                                            <path id="Tracé_6613"
                                                                  data-name="Tracé 6613"
                                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                                  transform="translate(-40.553 -154.141)"
                                                            />
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Bateau") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="24.57" height="20.641"
                                                         viewBox="0 0 24.57 20.641">
                                                        <path id="boat-svgrepo-com"
                                                              d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                              transform="translate(0 -16.99)"
                                                        />
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Indifferent") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="15.308" height="26.276"
                                                         viewBox="0 0 15.308 26.276">
                                                        <g id="standing-man-svgrepo-com"
                                                           transform="translate(-25.906)">
                                                            <g id="Groupe_8941"
                                                               data-name="Groupe 8941"
                                                               transform="translate(25.906 0)">
                                                                <path id="Tracé_7680"
                                                                      data-name="Tracé 7680"
                                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                      transform="translate(-25.906 -20.81)"
                                                                />
                                                                <circle id="Ellipse_139"
                                                                        data-name="Ellipse 139"
                                                                        cx="2.719"
                                                                        cy="2.719"
                                                                        r="2.719"
                                                                        transform="translate(4.914)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                            </div>
                                            <div
                                                className={'d-flex flex-row align-items-center justify-content-center'}>
                                                <hr style={{
                                                    minWidth: '80%',
                                                    borderTop: '3px solid #EF7723'
                                                }}/>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     width="18.571" height="26"
                                                     viewBox="0 0 18.571 26">
                                                    <g id="Polygone_9"
                                                       data-name="Polygone 9"
                                                       transform="translate(18.571) rotate(90)"
                                                       fill="#EF7723">
                                                        <path
                                                            d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                            stroke="none"/>
                                                        <path
                                                            d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                            stroke="none"
                                                            fill="#EF7723"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div
                                                className={'d-flex flex-md-row flex-column justify-content-between'}>
                                                                <span>
                                                                    <LazyLoadImage src={"/images/poids.png"}
                                                                                   alt={'poids'}/> <sub>{myReservation.dimensionsKg} Kg</sub>
                                                                </span>
                                                <span>
                                                                    {myReservation.objectType.includes("Bagage") ?
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="17.483"
                                                                             className={"mx-1"} height="26.251"
                                                                             viewBox="0 0 17.483 26.251">
                                                                            <path id="suitcase-svgrepo-com_1_"
                                                                                  data-name="suitcase-svgrepo-com (1)"
                                                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                                                  transform="translate(-17.6 -1.3)"/>
                                                                        </svg> : null}
                                                    {myReservation.objectType.includes("Sac à dos") ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22.633"
                                                             className={"mx-1"} height="24.048"
                                                             viewBox="0 0 22.633 24.048">
                                                            <g id="backpack-svgrepo-com_1_"
                                                               data-name="backpack-svgrepo-com (1)"
                                                               transform="translate(-8.735)">
                                                                <path id="Tracé_6614" data-name="Tracé 6614"
                                                                      d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                                      transform="translate(0 -155.838)"
                                                                />
                                                                <path id="Tracé_6615" data-name="Tracé 6615"
                                                                      d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                                      transform="translate(-232.971 -155.837)"
                                                                />
                                                                <path id="Tracé_6616" data-name="Tracé 6616"
                                                                      d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                                      transform="translate(-2.048 -14.56)"
                                                                />
                                                                <path id="Tracé_6617" data-name="Tracé 6617"
                                                                      d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                                      transform="translate(-30.854)"
                                                                />
                                                                <rect id="Rectangle_5839"
                                                                      data-name="Rectangle 5839"
                                                                      width="11.4"
                                                                      height="4.826"
                                                                      transform="translate(14.407 16.226)"
                                                                />
                                                                <path id="Tracé_6618" data-name="Tracé 6618"
                                                                      d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                                      transform="translate(-34.631 -95.675)"
                                                                />
                                                                <path id="Tracé_6619" data-name="Tracé 6619"
                                                                      d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                                      transform="translate(-239.381 -14.561)"
                                                                />
                                                            </g>
                                                        </svg> : null}


                                                    {myReservation.objectType.includes("Hors format") ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="33.502"
                                                             className={"mx-1"} height="22.131"
                                                             viewBox="0 0 33.502 22.131">
                                                            <g id="bike-svgrepo-com"
                                                               transform="translate(0.001 -50.317)">
                                                                <path id="Tracé_6621" data-name="Tracé 6621"
                                                                      d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                                      transform="translate(0)"/>
                                                            </g>
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Petits objets') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="35.79"
                                                             className={"mx-1"} height="21.048"
                                                             viewBox="0 0 35.79 21.048">
                                                            <g id="trainers-svgrepo-com"
                                                               transform="translate(0 -61.013)">
                                                                <path id="Tracé_6622" data-name="Tracé 6622"
                                                                      d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                                      transform="translate(0)"/>
                                                            </g>
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Chat') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16.371"
                                                             className={"mx-1"} height="23"
                                                             viewBox="0 0 16.371 23">
                                                            <path id="cat-svgrepo-com"
                                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                                  transform="translate(-32.398)"
                                                            />
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Indifferent') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15.308"
                                                             className={"mx-1"} height="26.276"
                                                             viewBox="0 0 15.308 26.276">
                                                            <g id="standing-man-svgrepo-com"
                                                               transform="translate(-25.906)">
                                                                <g id="Groupe_8941" data-name="Groupe 8941"
                                                                   transform="translate(25.906 0)">
                                                                    <path id="Tracé_7680" data-name="Tracé 7680"
                                                                          d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                          transform="translate(-25.906 -20.81)"
                                                                    />
                                                                    <circle id="Ellipse_139"
                                                                            data-name="Ellipse 139"
                                                                            cx="2.719"
                                                                            cy="2.719"
                                                                            r="2.719"
                                                                            transform="translate(4.914)"
                                                                    />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                        : null}
                                                    <sub>{myReservation.dimensionsLong} x {myReservation.dimensionsLarg} x {myReservation.dimensionsH} Cm</sub>
                                                                </span>
                                            </div>
                                        </div>
                                        <div className={"col-md-2 text-capitalize"}>
                                            {myReservation.ville_arrivee}
                                            <svg style={{
                                                position: 'absolute',
                                                top: '-18px',
                                                right: 0
                                            }} xmlns="http://www.w3.org/2000/svg" width="27.515" height="35.661"
                                                 viewBox="0 0 27.515 35.661">
                                                <g id="pin-svgrepo-com_2_" data-name="pin-svgrepo-com (2)"
                                                   transform="translate(52.386 35.411) rotate(180)">
                                                    <g id="Groupe_4899" data-name="Groupe 4899"
                                                       transform="translate(25.121)">
                                                        <g id="Groupe_4898" data-name="Groupe 4898"
                                                           transform="translate(0)">
                                                            <path id="Tracé_6731" data-name="Tracé 6731"
                                                                  d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                  transform="translate(-25.121)" fill="#ef7723"
                                                                  stroke="#ef7723" strokeWidth="0.5"/>
                                                            <path id="Tracé_6732" data-name="Tracé 6732"
                                                                  d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                  transform="translate(-68.326 -99.979)"
                                                                  fill="#ef7723"
                                                                  stroke="#ef7723" strokeWidth="0.5"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            <br/>
                                            <LazyLoadImage
                                                src={"/images/" + myReservation.type_adresse_arrivee.toLowerCase().replace(' ', '') + ".png"}
                                                alt={myReservation.type_adresse_arrivee}/>
                                            <br/> <sup style={{
                                            fontSize: 'x-small',
                                            color: '#b9b9b9'
                                        }}>{myReservation.type_adresse_arrivee}</sup>
                                        </div>
                                    </div>
                                    <div className={"col-lg-3"}>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.dateDep')}
                                            <span
                                                className="text-gris float-right">{myReservation.dateDepart}</span>
                                        </p>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.heureDep')}
                                            <span
                                                className="text-gris float-right">{myReservation.heureDepart}</span>
                                        </p>
                                        <br/>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.dateArr')}
                                            <span
                                                className="text-gris float-right">{myReservation.dateArrivee}</span>
                                        </p>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.heureArr')}
                                            <span
                                                className="text-gris float-right">{myReservation.heureArrivee}</span>
                                        </p>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div className={"recapBorderedBlock text-left px-5 py-4 mt-4"}>
                                <div className={'row'}>

                                    <div className={'col-md-12 '}
                                         style={(this.props.location?.state?.myReservation || window.location.pathname.includes("modifier")) ? {pointerEvents: 'auto'} : {pointerEvents: 'none'}}>
                                        <p className={'text-left'}>{t('circuit_depot_annonce.listeContenu')}</p>
                                        <div className={"recapBorderedBlock p-3"} style={{borderRadius: 50}}>
                                            {listeContenu.map(cont =>
                                                <label style={{
                                                    borderRadius: 5,
                                                    padding: 5,
                                                    margin: '5px 10px',
                                                    minWidth: 'max-content',
                                                    border: '1px solid #e8e8e8'
                                                }}> {cont}</label>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <p className={'text-left mt-4'}>{t('circuit_depot_annonce.galerie')}</p>
                                <div className={"recapBorderedBlock p-3"} style={{borderRadius: 50}}>
                                    <div className="clearfix text-md-left text-center">
                                        <Upload
                                            action=""
                                            listType="picture-card"
                                            fileList={this.state.gellery}
                                            onPreview={this.handlePreview}
                                        >
                                        </Upload>
                                        <Modal open={previewVisible} footer={null}
                                               onCancel={this.handleCancel}
                                               className={'text-center'}>
                                            <LazyLoadImage alt="example" src={previewImage}/>
                                        </Modal>
                                    </div>
                                </div>

                                <div className={'row text-left'}
                                     style={(this.props.location?.state?.myReservation || window.location.pathname.includes("modifier")) ? {pointerEvents: 'auto'} : {pointerEvents: 'none'}}>
                                    <div className={'col-md-6 text-left'}>
                                        <div className={'row text-left'}>

                                            <div className={'col-md-6 text-left'}>
                                                <label>{t('page_home.date')}</label>
                                                <input type={"date"} name={"dateDepart"}
                                                       value={this.state.bagages.dateDepart}
                                                       onChange={this.handleChangeDescBagage}/>

                                            </div>
                                            <div className={'col-md-6 text-left'}>
                                                <label>{t('circuit_depot_annonce.heure')}</label>
                                                <input type={"time"} name={"heureDepart"}
                                                       value={this.state.bagages.heureDepart}
                                                       onChange={this.handleChangeDescBagage}/>
                                            </div>
                                            <div
                                                className='d-flex gap-3 mb-3 justify-content-center align-items-end w-100'>
                                                <div className="pointer text-center" onClick={() => {
                                                    console.log(depart.type_adresse_depart)
                                                    this.setState(prev => ({
                                                        depart: {
                                                            ...prev.depart,
                                                            isPointRelais: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.point_relais'),
                                                            isDomicile: false,
                                                            isAutre: false,
                                                            isIndifferent: false,
                                                        },
                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_depart: ''
                                                        },
                                                        adresse_point_depart: '',
                                                        lat_adresse_point_depart: 0,
                                                        long_adresse_point_depart: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20.354"
                                                         height="21.502"
                                                         viewBox="0 0 20.354 21.502">
                                                        <g id="store-svgrepo-com_2_" data-name="store-svgrepo-com (2)"
                                                           transform="translate(-12.151)">
                                                            <path id="Tracé_6624" data-name="Tracé 6624"
                                                                  d="M37.628,90.221h-17.6L18.974,92.46H38.683Z"
                                                                  transform="translate(-6.501 -85.957)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6625" data-name="Tracé 6625"
                                                                  d="M321.723,167.6a2.947,2.947,0,0,0,5.724,0Z"
                                                                  transform="translate(-294.942 -159.675)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6626" data-name="Tracé 6626"
                                                                  d="M169.8,169.839a2.954,2.954,0,0,0,2.862-2.244h-5.724A2.954,2.954,0,0,0,169.8,169.839Z"
                                                                  transform="translate(-147.472 -159.675)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6627" data-name="Tracé 6627"
                                                                  d="M17.875,167.6H12.151a2.947,2.947,0,0,0,5.724,0Z"
                                                                  transform="translate(0 -159.675)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6628" data-name="Tracé 6628"
                                                                  d="M56.742,203.057a4.362,4.362,0,0,1-7.315,0,4.362,4.362,0,0,1-4.994,1.776v10.131h4.886v-8.091h7.53v8.091h4.886V204.833a4.362,4.362,0,0,1-4.994-1.776Z"
                                                                  transform="translate(-30.756 -193.461)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <rect id="Rectangle_5840" data-name="Rectangle 5840"
                                                                  width="13.004"
                                                                  height="2.846" transform="translate(15.826)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <rect id="Rectangle_5841" data-name="Rectangle 5841"
                                                                  width="4.695"
                                                                  height="6.673" transform="translate(19.981 14.829)"
                                                                  fill={depart.isPointRelais ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={depart.isPointRelais ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.point_relais')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (depart.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceDep')
                                                    }
                                                    this.setState(prev => ({
                                                        depart: {
                                                            ...prev.depart,
                                                            isPointRelais: false,
                                                            isDomicile: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                            isAutre: false,
                                                            isIndifferent: false,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_depart: ''
                                                        },
                                                        adresse_point_depart: '',
                                                        lat_adresse_point_depart: 0,
                                                        long_adresse_point_depart: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22.449"
                                                         height="21.502"
                                                         viewBox="0 0 22.449 21.502">
                                                        <path id="home-svgrepo-com"
                                                              d="M22.055,15.317l-2.809-2.289V9.366a.749.749,0,0,0-.748-.748H16.731a.749.749,0,0,0-.748.748v1L12.23,7.309a1.648,1.648,0,0,0-2.01,0L.394,15.317c-.446.364-.42.681-.364.837s.234.418.808.418H2.183V27.105a1.363,1.363,0,0,0,1.36,1.363H7.792a1.33,1.33,0,0,0,1.326-1.363V22.786a.739.739,0,0,1,.714-.707h2.855a.679.679,0,0,1,.646.707v4.319a1.4,1.4,0,0,0,1.394,1.363h4.181a1.363,1.363,0,0,0,1.36-1.363V16.572h1.345c.573,0,.752-.262.808-.418S22.5,15.68,22.055,15.317Z"
                                                              transform="translate(0 -6.966)"
                                                              fill={depart.isDomicile ? "#ef7615" : "#000"}/>
                                                    </svg>

                                                    <br/>
                                                    <span style={depart.isDomicile ? {
                                                            color: "#ef7615",
                                                            fontSize: 12
                                                        } :
                                                        {
                                                            color: "#000",
                                                            fontSize: 12
                                                        }}>{t('circuit_depot_annonce.domicile')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (depart.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceDep')
                                                    }
                                                    this.setState(prev => ({
                                                        depart: {
                                                            ...prev.depart,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                            isIndifferent: false,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_depart: ''
                                                        },
                                                        adresse_point_depart: '',
                                                        lat_adresse_point_depart: 0,
                                                        long_adresse_point_depart: 0,
                                                    }))
                                                }}>
                                                    <svg id="pin-maps-and-location-svgrepo-com"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         width="26.307" height="26.307" viewBox="0 0 26.307 26.307">
                                                        <g id="Groupe_5066" data-name="Groupe 5066">
                                                            <path id="Tracé_6963" data-name="Tracé 6963"
                                                                  d="M14.637,19.751l.254-6.6h.017a.438.438,0,0,0,.438-.438V10.96a5.7,5.7,0,1,0-4.384,0v1.755a.438.438,0,0,0,.438.438h.017l.254,6.6C7.131,19.874,0,20.681,0,23.018c0,2.413,7.866,3.288,13.153,3.288s13.153-.876,13.153-3.288C26.307,20.681,19.176,19.874,14.637,19.751Zm-.168-8.464v.99H11.838v-.99c.261.033.479.058.679.075.086.01.173.013.26.019l.141.007c.078,0,.156.012.235.012s.157-.009.235-.012l.141-.007c.087-.006.174-.009.26-.019C13.989,11.344,14.208,11.32,14.469,11.286ZM10.084,5.7a.438.438,0,0,1-.877,0,3.951,3.951,0,0,1,3.946-3.946.438.438,0,0,1,0,.877A3.073,3.073,0,0,0,10.084,5.7Zm3.069,19.73C5.659,25.43.877,24,.877,23.018c0-.774,3.618-2.21,10.827-2.392l.1,2.629a1.35,1.35,0,0,0,2.7,0l.1-2.629c7.209.182,10.826,1.618,10.826,2.392C25.43,24,20.647,25.43,13.153,25.43Z"
                                                                  fill={depart.isAutre ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={depart.isAutre ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.autreLieu')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (depart.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceDep')
                                                    }
                                                    this.setState(prev => ({
                                                        depart: {
                                                            ...prev.depart,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: false,
                                                            isIndifferent: true,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_depart: ''
                                                        },
                                                        adresse_point_depart: '',
                                                        lat_adresse_point_depart: 0,
                                                        long_adresse_point_depart: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30.375"
                                                         height="30.208"
                                                         viewBox="1 0 37.375 55.208">
                                                        <g id="Groupe_9221" data-name="Groupe 9221"
                                                           transform="translate(-420.649 -1460.159)">
                                                            <path id="pin-svgrepo-com_4_"
                                                                  data-name="pin-svgrepo-com (4)"
                                                                  d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                                                                  transform="translate(403.25 1460.159)"
                                                                  fill={depart.isIndifferent ? "#ef7615" : "#000"}/>
                                                            <g id="Groupe_5100" data-name="Groupe 5100"
                                                               transform="translate(421.127 1488.99)">
                                                                <path id="Tracé_6965" data-name="Tracé 6965"
                                                                      d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                                                                      transform="translate(2053.208 -7072.97)"
                                                                      fill="none"
                                                                      stroke={depart.isIndifferent ? "#ef7615" : "#000"}
                                                                      strokeWidth="1"/>
                                                                <path id="Tracé_6966" data-name="Tracé 6966"
                                                                      d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                                                                      transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                                                                      fill="none"
                                                                      stroke={depart.isIndifferent ? "#ef7615" : "#000"}
                                                                      strokeWidth="1"/>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                    <br/>
                                                    <span style={depart.isIndifferent ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.indifferent')}</span>

                                                </div>
                                            </div>
                                            {depart.isIndifferent ? <div className={'col-12 text-left'}>
                                                <label>{t('page_home.ville_depart_propose')}
                                                </label>
                                                <input type={"text"} name={"ville_depart"}
                                                       value={this.state.bagages.ville_depart}
                                                       onChange={this.handleChangeDescBagage}/>

                                            </div> : depart.isAutre ?
                                                <Autocomplete
                                                    value={this.state.adresse_point_depart}
                                                    className={"d-flex flex-column flex-md-row gap-3 mb-3 justify-content-center align-items-end w-100"}
                                                    apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                    options={{
                                                        types: ["geocode", "establishment"],
                                                        strictBounds: true,
                                                        componentRestrictions: {country: "fr"},
                                                    }}
                                                    onChange={(e) => this.setState({adresse_point_depart: e.target.value})}
                                                    onPlaceSelected={(place) => {
                                                        place.address_components.map(res => res.types[0] == 'locality' ?
                                                            this.setState(prevState => ({
                                                                depart: {
                                                                    ...prevState.depart,    // keep all other key-value pairs
                                                                    autreLieux: place.formatted_address,
                                                                },
                                                                bagages: {
                                                                    ...prevState.bagages,
                                                                    ville_depart: res.long_name,
                                                                },
                                                                adresse_point_depart: place.formatted_address,
                                                                lat_adresse_point_depart: place.geometry.location.lat(),
                                                                long_adresse_point_depart: place.geometry.location.lng(),

                                                            })) : null);
                                                    }}
                                                /> : (depart.isDomicile || depart.isPointRelais) ?

                                                    <div className={'mx-auto'} style={{maxWidth: 800}}>
                                                        {depart.isPointRelais ? <div className={'text-left mb-2'}>
                                                            <label>{t('page_home.ville_depart_propose')}
                                                            </label>
                                                            <input type={"text"} name={"ville_depart"}
                                                                   value={this.state.bagages.ville_depart}
                                                                   onChange={this.handleChangeDescBagage}/>
                                                        </div> : null}
                                                        <select name={"adresse_point_depart"}
                                                                value={(depart.isPointRelais && this.state.depart.nomEntreprise) ?
                                                                    !this.state.idPointRelaisDep ? '' : this.state.depart.nomEntreprise + '-' + this.state.adresse_point_depart + '&lat=' + this.state.lat_adresse_point_depart + '&long=' + this.state.long_adresse_point_depart + '&id=' + this.state.idPointRelaisDep
                                                                    : this.state.lat_adresse_point_depart == 0 ? '' :
                                                                        this.state.adresse_point_depart + '&lat=' + this.state.lat_adresse_point_depart + '&long=' + this.state.long_adresse_point_depart}
                                                                onChange={(e) => {
                                                                    if (depart.isDomicile) {
                                                                        let myLat = e.target.value.split('&lat=')[1]
                                                                        myLat = myLat.split('&long=')[0]
                                                                        depart.domicile.map(res => res.name == e.target.value.split('&lat=')[0] ?
                                                                            this.setState(
                                                                                prev => ({
                                                                                    depart: {
                                                                                        ...prev.depart,
                                                                                        ville_depart: res.ville
                                                                                    },
                                                                                    adresse_point_depart: e.target.value.split('&lat=')[0],
                                                                                    lat_adresse_point_depart: myLat,
                                                                                    long_adresse_point_depart: e.target.value.split('&long=')[1],
                                                                                })) : null)
                                                                    } else {
                                                                        let nomE = e.target.value.split('-')[0]
                                                                        console.log(nomE)
                                                                        let myLat = e.target.value.split('&lat=')[1]
                                                                        myLat = myLat.split('&long=')[0]
                                                                        let myLng = e.target.value.split('&long=')[1]
                                                                        myLng = myLng.split('&id=')[0]
                                                                        let adr = e.target.value.split('&lat=')[0]
                                                                        console.log(adr)
                                                                        this.setState(prev => ({
                                                                            depart: {
                                                                                ...prev.depart,
                                                                                nomEntreprise: nomE
                                                                            },
                                                                            adresse_point_depart: adr.split('-')[1],
                                                                            lat_adresse_point_depart: myLat,
                                                                            long_adresse_point_depart: myLng,
                                                                            idPointRelaisDep: e.target.value.split('&id=')[1]
                                                                        }), () => {

                                                                            console.log(this.state.depart.nomEntreprise + '-' + this.state.adresse_point_depart + '&lat=' + this.state.lat_adresse_point_depart + '&long=' + this.state.long_adresse_point_depart + '&id=' + this.state.idPointRelaisDep)
                                                                        })
                                                                    }
                                                                }}>
                                                            <option key={'-1'} value={''} disabled={true}
                                                                    selected={(depart.isPointRelais && !this.state.idPointRelaisDep) || (depart.isDomicile && !this.state.lat_adresse_point_depart) ? true : false}>{depart.placeHolderSelect}
                                                            </option>
                                                            {depart.isPointRelais ?
                                                                depart.pointRelais.filter(createFilter(this.state.bagages.ville_depart, KEYS_TO_FILTERSA)).map(lieu =>
                                                                    !lieu.adress.name ? null : <option key={lieu.id}
                                                                                                       value={lieu.nomEntreprise + '-' + lieu.adress.name + '&lat=' + lieu.adress.lat + '&long=' + lieu.adress.lng + '&id=' + lieu.id}>
                                                                        {lieu.nomEntreprise + '-' + lieu.adress.name}
                                                                    </option>
                                                                ) : depart.isDomicile ?
                                                                    depart.domicile.map(lieu =>
                                                                        <option key={lieu.id}
                                                                                value={lieu.name + '&lat=' + lieu.lat + '&long=' + lieu.long}>{lieu.name}</option>
                                                                    ) : null}
                                                        </select>
                                                        {depart.isPointRelais ?
                                                            <div
                                                                className={"btnCustomColor mb-3 text-gris border-blue bg-transparent w-50 mx-auto"}
                                                                style={{minWidth: "max-content", maxWidth: '100%'}}>
                                                                {this.state.settingPriceDep?.filter(val => val.isRelais == true).map(setting =>
                                                                    <div
                                                                        className={'d-flex justify-content-between py-2'}>
                                                                        <Checkbox className={'text-gris'}
                                                                                  name={'dep-' + setting.name}
                                                                                  checked={setting.checked}
                                                                                  onChange={(e) => this.onCheckboxChangeAssDep(e, setting.price)}
                                                                        >
                                                                            {setting.name}
                                                                        </Checkbox>
                                                                        <span>{setting.price ? setting.price + '€' : '_'}</span>
                                                                    </div>
                                                                )}</div> : null}
                                                    </div> : null}

                                        </div>
                                    </div>
                                    <div className={'col-md-6 text-left'}>
                                        <div className={'row text-left'}>

                                            <div className={'col-md-6 text-left'}>
                                                <label>{t('page_home.date')}</label>
                                                <input type={"date"} name={"dateArrivee"}
                                                       value={this.state.bagages.dateArrivee}

                                                       onChange={this.handleChangeDescBagage}/>

                                            </div>
                                            <div className={'col-md-6 text-left'}>
                                                <label>{t('circuit_depot_annonce.heure')}</label>
                                                <input type={"time"} name={"heureArrivee"}
                                                       value={this.state.bagages.heureArrivee}

                                                       onChange={this.handleChangeDescBagage}/>

                                            </div>
                                            <div
                                                className='d-flex gap-3 mb-3 justify-content-center align-items-end w-100'>
                                                <div className="pointer text-center" onClick={() => {

                                                    this.setState(prev => ({
                                                        arrivee: {
                                                            ...prev.arrivee,
                                                            isPointRelais: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.point_relais'),
                                                            isDomicile: false,
                                                            isAutre: false,
                                                            isIndifferent: false,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_arrivee: '',
                                                        },
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20.354"
                                                         height="21.502"
                                                         viewBox="0 0 20.354 21.502">
                                                        <g id="store-svgrepo-com_2_" data-name="store-svgrepo-com (2)"
                                                           transform="translate(-12.151)">
                                                            <path id="Tracé_6624" data-name="Tracé 6624"
                                                                  d="M37.628,90.221h-17.6L18.974,92.46H38.683Z"
                                                                  transform="translate(-6.501 -85.957)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6625" data-name="Tracé 6625"
                                                                  d="M321.723,167.6a2.947,2.947,0,0,0,5.724,0Z"
                                                                  transform="translate(-294.942 -159.675)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6626" data-name="Tracé 6626"
                                                                  d="M169.8,169.839a2.954,2.954,0,0,0,2.862-2.244h-5.724A2.954,2.954,0,0,0,169.8,169.839Z"
                                                                  transform="translate(-147.472 -159.675)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6627" data-name="Tracé 6627"
                                                                  d="M17.875,167.6H12.151a2.947,2.947,0,0,0,5.724,0Z"
                                                                  transform="translate(0 -159.675)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6628" data-name="Tracé 6628"
                                                                  d="M56.742,203.057a4.362,4.362,0,0,1-7.315,0,4.362,4.362,0,0,1-4.994,1.776v10.131h4.886v-8.091h7.53v8.091h4.886V204.833a4.362,4.362,0,0,1-4.994-1.776Z"
                                                                  transform="translate(-30.756 -193.461)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <rect id="Rectangle_5840" data-name="Rectangle 5840"
                                                                  width="13.004"
                                                                  height="2.846" transform="translate(15.826)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                            <rect id="Rectangle_5841" data-name="Rectangle 5841"
                                                                  width="4.695"
                                                                  height="6.673" transform="translate(19.981 14.829)"
                                                                  fill={arrivee.isPointRelais ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={arrivee.isPointRelais ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.point_relais')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (arrivee.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceArr')
                                                    }
                                                    this.setState(prev => ({
                                                        arrivee: {
                                                            ...prev.arrivee,
                                                            isPointRelais: false,
                                                            isDomicile: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                            isAutre: false,
                                                            isIndifferent: false,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_arrivee: '',
                                                        },
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22.449"
                                                         height="21.502"
                                                         viewBox="0 0 22.449 21.502">
                                                        <path id="home-svgrepo-com"
                                                              d="M22.055,15.317l-2.809-2.289V9.366a.749.749,0,0,0-.748-.748H16.731a.749.749,0,0,0-.748.748v1L12.23,7.309a1.648,1.648,0,0,0-2.01,0L.394,15.317c-.446.364-.42.681-.364.837s.234.418.808.418H2.183V27.105a1.363,1.363,0,0,0,1.36,1.363H7.792a1.33,1.33,0,0,0,1.326-1.363V22.786a.739.739,0,0,1,.714-.707h2.855a.679.679,0,0,1,.646.707v4.319a1.4,1.4,0,0,0,1.394,1.363h4.181a1.363,1.363,0,0,0,1.36-1.363V16.572h1.345c.573,0,.752-.262.808-.418S22.5,15.68,22.055,15.317Z"
                                                              transform="translate(0 -6.966)"
                                                              fill={arrivee.isDomicile ? "#ef7615" : "#000"}/>
                                                    </svg>

                                                    <br/>
                                                    <span style={arrivee.isDomicile ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.domicile')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (arrivee.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceArr')
                                                    }
                                                    this.setState(prev => ({
                                                        arrivee: {
                                                            ...prev.arrivee,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                            isIndifferent: false,
                                                        },

                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_arrivee: '',
                                                        },
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0,
                                                    }))
                                                }}>
                                                    <svg id="pin-maps-and-location-svgrepo-com"
                                                         xmlns="http://www.w3.org/2000/svg"
                                                         width="26.307" height="26.307" viewBox="0 0 26.307 26.307">
                                                        <g id="Groupe_5066" data-name="Groupe 5066">
                                                            <path id="Tracé_6963" data-name="Tracé 6963"
                                                                  fill={arrivee.isAutre ? "#ef7615" : "#000"}
                                                                  d="M14.637,19.751l.254-6.6h.017a.438.438,0,0,0,.438-.438V10.96a5.7,5.7,0,1,0-4.384,0v1.755a.438.438,0,0,0,.438.438h.017l.254,6.6C7.131,19.874,0,20.681,0,23.018c0,2.413,7.866,3.288,13.153,3.288s13.153-.876,13.153-3.288C26.307,20.681,19.176,19.874,14.637,19.751Zm-.168-8.464v.99H11.838v-.99c.261.033.479.058.679.075.086.01.173.013.26.019l.141.007c.078,0,.156.012.235.012s.157-.009.235-.012l.141-.007c.087-.006.174-.009.26-.019C13.989,11.344,14.208,11.32,14.469,11.286ZM10.084,5.7a.438.438,0,0,1-.877,0,3.951,3.951,0,0,1,3.946-3.946.438.438,0,0,1,0,.877A3.073,3.073,0,0,0,10.084,5.7Zm3.069,19.73C5.659,25.43.877,24,.877,23.018c0-.774,3.618-2.21,10.827-2.392l.1,2.629a1.35,1.35,0,0,0,2.7,0l.1-2.629c7.209.182,10.826,1.618,10.826,2.392C25.43,24,20.647,25.43,13.153,25.43Z"/>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={arrivee.isAutre ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.autreLieu')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    if (arrivee.isPointRelais) {
                                                        this.onRemoveAllCheck('assurancePriceArr')
                                                    }
                                                    this.setState(prev => ({
                                                        arrivee: {
                                                            ...prev.arrivee,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: false,
                                                            isIndifferent: true,
                                                        },
                                                        bagages: {
                                                            ...prev.bagages,
                                                            ville_arrivee: '',
                                                        },
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0,
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="30.375"
                                                         height="30.208"
                                                         viewBox="1 0 37.375 55.208">
                                                        <g id="Groupe_9221" data-name="Groupe 9221"
                                                           transform="translate(-420.649 -1460.159)">
                                                            <path id="pin-svgrepo-com_4_"
                                                                  data-name="pin-svgrepo-com (4)"
                                                                  d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                                                                  transform="translate(403.25 1460.159)"
                                                                  fill={arrivee.isIndifferent ? "#ef7615" : "#000"}/>
                                                            <g id="Groupe_5100" data-name="Groupe 5100"
                                                               transform="translate(421.127 1488.99)">
                                                                <path id="Tracé_6965" data-name="Tracé 6965"
                                                                      d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                                                                      transform="translate(2053.208 -7072.97)"
                                                                      fill="none"
                                                                      stroke={arrivee.isIndifferent ? "#ef7615" : "#000"}
                                                                      strokeWidth="1"/>
                                                                <path id="Tracé_6966" data-name="Tracé 6966"
                                                                      d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                                                                      transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                                                                      fill="none"
                                                                      stroke={arrivee.isIndifferent ? "#ef7615" : "#000"}
                                                                      strokeWidth="1"/>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                    <br/>
                                                    <span style={arrivee.isIndifferent ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.indifferent')}</span>

                                                </div>

                                            </div>
                                            {arrivee.isIndifferent ? <div className={'col-12 text-left'}>
                                                <label>{t('page_home.ville_arrivee_propose')}
                                                </label>
                                                <input type={"text"} name={"ville_arrivee"}
                                                       value={this.state.bagages.ville_arrivee}
                                                       onChange={this.handleChangeDescBagage}/>

                                            </div> : arrivee.isAutre ?
                                                <Autocomplete
                                                    value={this.state.adresse_point_arrivee}
                                                    className={"d-flex flex-column flex-md-row gap-3 mb-3 justify-content-center align-items-end w-100"}
                                                    apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                    options={{
                                                        types: ["geocode", "establishment"],
                                                        strictBounds: true,
                                                        componentRestrictions: {country: "fr"},
                                                    }}
                                                    onChange={(e) => this.setState({adresse_point_arrivee: e.target.value})}
                                                    onPlaceSelected={(place) => {
                                                        place.address_components.map(res => res.types[0] == 'locality' ?
                                                            this.setState(prevState => ({
                                                                arrivee: {
                                                                    ...prevState.arrivee,    // keep all other key-value pairs
                                                                    autreLieux: place.formatted_address,
                                                                },
                                                                bagages: {
                                                                    ...prevState.bagages,
                                                                    ville_arrivee: res.long_name,
                                                                },
                                                                adresse_point_arrivee: place.formatted_address,
                                                                lat_adresse_point_arrivee: place.geometry.location.lat(),
                                                                long_adresse_point_arrivee: place.geometry.location.lng(),


                                                            })) : null);
                                                    }}
                                                /> : (arrivee.isDomicile || arrivee.isPointRelais) ?

                                                    <div className={'mx-auto'} style={{maxWidth: 800}}>
                                                        {arrivee.isPointRelais ?
                                                            <div className={'text-left mb-2'}>
                                                                <label>{t('page_home.ville_arrivee_propose')}
                                                                </label>
                                                                <input type={"text"} name={"ville_arrivee"}
                                                                       value={this.state.bagages.ville_arrivee}
                                                                       onChange={this.handleChangeDescBagage}/>
                                                            </div> : null}
                                                        <select name={"adresse_point_arrivee"}
                                                                value={(arrivee.isPointRelais && this.state.arrivee.nomEntreprise) ?
                                                                    !this.state.idPointRelaisArr ? '' : this.state.arrivee.nomEntreprise + '-' + this.state.adresse_point_arrivee + '&lat=' + this.state.lat_adresse_point_arrivee + '&long=' + this.state.long_adresse_point_arrivee + '&id=' + this.state.idPointRelaisArr
                                                                    :
                                                                    this.state.lat_adresse_point_arrivee == 0 ? '' :
                                                                        this.state.adresse_point_arrivee + '&lat=' + this.state.lat_adresse_point_arrivee + '&long=' + this.state.long_adresse_point_arrivee
                                                                }
                                                                onChange={(e) => {
                                                                    if (arrivee.isDomicile) {
                                                                        let myLat = e.target.value.split('&lat=')[1]
                                                                        myLat = myLat.split('&long=')[0]
                                                                        arrivee.domicile.map(res => res.name == e.target.value.split('&lat=')[0] ?
                                                                            this.setState(
                                                                                prev => (
                                                                                    {
                                                                                        arrivee: {
                                                                                            ...prev.arrivee,
                                                                                            ville_arrivee: res.ville
                                                                                        },
                                                                                        adresse_point_arrivee: e.target.value.split('&lat=')[0],
                                                                                        lat_adresse_point_arrivee: myLat,
                                                                                        long_adresse_point_arrivee: e.target.value.split('&long=')[1],
                                                                                    })) : null)
                                                                    } else {
                                                                        let nomE = e.target.value.split('-')[0]
                                                                        let myLat = e.target.value.split('&lat=')[1]
                                                                        myLat = myLat.split('&long=')[0]
                                                                        let myLng = e.target.value.split('&long=')[1]
                                                                        myLng = myLng.split('&id=')[0]
                                                                        let adr = e.target.value.split('&lat=')[0]
                                                                        this.setState(prev => ({
                                                                            arrivee: {
                                                                                ...prev.arrivee,
                                                                                nomEntreprise: nomE
                                                                            },
                                                                            adresse_point_arrivee: adr.split('-')[1],
                                                                            lat_adresse_point_arrivee: myLat,
                                                                            long_adresse_point_arrivee: myLng,

                                                                            idPointRelaisArr: e.target.value.split('&id=')[1]
                                                                        }))
                                                                    }
                                                                }}>
                                                            <option key={'-1'} value={''}
                                                                    selected={(arrivee.isPointRelais && !this.state.idPointRelaisArr) || (arrivee.isDomicile && !this.state.lat_adresse_point_arrivee) ? true : false}
                                                                    disabled={true}>{arrivee.placeHolderSelect}
                                                            </option>
                                                            {arrivee.isPointRelais ?
                                                                arrivee.pointRelais.filter(createFilter(this.state.bagages.ville_arrivee, KEYS_TO_FILTERSA)).map(lieu =>
                                                                    !lieu.adress.name ? null : <option key={lieu.id}
                                                                                                       value={lieu.nomEntreprise + '-' + lieu.adress.name + '&lat=' + lieu.adress.lat + '&long=' + lieu.adress.lng + '&id=' + lieu.id}>{lieu.nomEntreprise + '-' + lieu.adress.name}</option>
                                                                ) : arrivee.isDomicile ?
                                                                    arrivee.domicile.map(lieu =>
                                                                        <option key={lieu.id}
                                                                                value={lieu.name + '&lat=' + lieu.lat + '&long=' + lieu.long}>{lieu.name}</option>
                                                                    ) : null}
                                                        </select>
                                                        {arrivee.isPointRelais ?
                                                            <div
                                                                className={"btnCustomColor mb-3 text-gris border-blue bg-transparent w-50 mx-auto"}
                                                                style={{minWidth: "max-content", maxWidth: '100%'}}>
                                                                {this.state.settingPriceArr.filter(val => val.isRelais == true).map(setting =>
                                                                    <div
                                                                        className={'d-flex justify-content-between py-2'}>
                                                                        <Checkbox className={'text-gris'}
                                                                                  name={'arr-' + setting.name}
                                                                                  checked={setting.checked}
                                                                                  onChange={(e) => this.onCheckboxChangeAssArr(e, setting.price)}
                                                                        >
                                                                            {setting.name}
                                                                        </Checkbox>
                                                                        <span>{setting.price ? setting.price + '€' : '_'}</span>
                                                                    </div>
                                                                )}</div> : null}
                                                    </div> : null}
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className={"row "}>
                                <div className={"col-md-7 "}>
                                    <div className={"recapBorderedBlock p-0 mt-4"}>
                                        <div className={"row m-0"}>
                                            <div className={"col-lg-7 text-left py-5 pl-5 pr-3"}
                                                 style={{borderRight: '1px solid #EAEAEA'}}>
                                                <div
                                                    className="d-flex flex-row gap-3 justify-content-start align-items-start">
                                                    <div className={'mx-2'}>{myReservation.client.photo ?
                                                        <div className={'position-relative'}>
                                                            <LazyLoadImage
                                                                src={myReservation.client.photo}
                                                                alt={myReservation.client.firstName}
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit:'cover',
                                                                    borderRadius: '50%',
                                                                }}/>
                                                        </div> :
                                                        <LazyLoadImage
                                                            src={"/images/avatar-person.png"}
                                                            alt={myReservation.client.firstName}
                                                            style={{
                                                                width: '60px',
                                                                borderRadius: '50%',
                                                            }}/>}
                                                    </div>
                                                    <p className={'d-flex flex-column justify-content-around align-items-center mb-0'}>
                                                        <span>{myReservation.client.firstName}</span>
                                                        <div>
                                            <span
                                                className={'text-orange mr-2'}>{myReservation.client.infoAvis ? myReservation.client.infoAvis.total : 0}</span>
                                                            <LazyLoadImage src={"/images/star.png"} alt={'avis'}
                                                                           className={'mr-2'}/>
                                                            <span
                                                                className={'text-gris'}>{myReservation.client.infoAvis ? myReservation.client.infoAvis.nbrAvis : 0} {t('page_avis.avis')}</span>
                                                        </div>
                                                    </p>

                                                </div>
                                            </div>
                                            <div
                                                className={"col-lg-5 d-flex justify-content-center flex-column text-center p-0"}>
                                                <CombinerChat
                                                    emailClient={myReservation.client.email}
                                                    orderInfo={{myReservation}}
                                                />
                                                <div className={"mb-0"}>
                                                    <hr style={{width: '100%', borderColor: '#eaeaea'}}/>
                                                </div>
                                                <div className={"mb-0 text-gris"}>{t('btns.signaler')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"col-md-5"}>
                                    {!this.props.location.state?.page == "details" ? null : <div
                                        className={"btnCustomColor d-flex flex-column w-100 text-gris border-blue bg-transparent"}
                                        style={{borderWidth: 2}}>
                                        <div className={'d-flex justify-content-between py-2'}>
                                            <span>{t('btns.details')}</span>
                                            <FontAwesomeIcon
                                                icon={this.state.isDetails ? faChevronUp : faChevronDown}/>
                                        </div>
                                        <div className={'d-flex justify-content-between p-2'}>
                                            <label>{t('recap.prixAnnonce')}</label>
                                            <label>{myReservation.client.priceNet ? myReservation.client.priceNet : 30}€</label>
                                        </div>
                                        <div className={'d-flex justify-content-between p-2'}>
                                            <label>{t('recap.assurance')}</label>
                                            <label>
                                                <FontAwesomeIcon
                                                    className={'text-blue'}
                                                    icon={faCheck}/>
                                            </label>
                                        </div>
                                        {myReservation.client?.setting_price?.filter(val => val.isRelais == false).map(setting =>
                                            <div className={'d-flex justify-content-between py-2 '}>
                                                <Checkbox className={'text-gris'} name={setting.name}
                                                          checked={setting.checked} style={{pointerEvents: 'none'}}
                                                >
                                                    {setting.name}
                                                </Checkbox>
                                                <span>{setting.price ? setting.price + '€' : '_'}</span>
                                            </div>)}
                                        {objDep.filter(val => val.isRelais == true && val.checked == true).map(setting =>
                                            <div className={'d-flex justify-content-between py-2 demandeListeProp'}>
                                                <Checkbox className={'text-gris'} name={setting.name}
                                                          style={{pointerEvents: 'none'}}
                                                          checked={setting.checked}
                                                >
                                                    {setting.name}
                                                </Checkbox>
                                                <span>{setting.price ? setting.price + '€' : '_'}</span>
                                            </div>)}
                                        {objArr.filter(val => val.isRelais == true && val.checked == true).map(setting =>
                                            <div className={'d-flex justify-content-between py-2 demandeListeProp'}>
                                                <Checkbox className={'text-gris'} name={setting.name}
                                                          style={{pointerEvents: 'none'}}
                                                          checked={setting.checked}
                                                >
                                                    {setting.name}
                                                </Checkbox>
                                                <span>{setting.price ? setting.price + '€' : '_'}</span>
                                            </div>)}

                                    </div>}
                                    <div
                                        className={"btnCustomColor mb-3 d-flex flex-row align-items-center justify-content-between w-100 text-blue border-blue bg-transparent mt-4"}>
                                        <div>{t('circuit_depot_annonce.pricePorteur')}:</div>
                                        <div className={"d-flex flex-row align-items-center"}>
                                            {this.props.location.state?.page == "details" ? null :
                                                <button className="btnCircleBleu" onClick={() => {
                                                    this.state.newprice > price ? this.setState({newprice: this.state.newprice - 1}) : null
                                                }}>-
                                                </button>}
                                            <span
                                                className="fs-3 fw-bold">{this.state.newprice ? this.state.newprice : price} €</span>
                                            {this.props.location.state?.page == "details" ? null :
                                                <button className="btnCircleBleu" onClick={() => {
                                                    console.log(this.state.newprice)
                                                    this.state.newprice < 99 ? this.setState({newprice: this.state.newprice + 1}) : null
                                                }}>+
                                                </button>}
                                        </div>
                                    </div>
                                    {this.props.location.state?.page == "details" ? null :
                                        <button onClick={() => this.soumettre()}
                                                disabled={
                                                    (depart.isPointRelais &&
                                                        (this.state.bagages.ville_depart==''||this.state.assurancePriceDep==0||
                                                            this.state.adresse_point_depart=='')) ||
                                                    (arrivee.isPointRelais &&
                                                        (this.state.bagages.ville_arrivee==''||this.state.assurancePriceArr==0||
                                                            this.state.adresse_point_arrivee=='')) ||
                                                    ((depart.isDomicile||depart.isAutre||depart.isIndifferent) &&
                                                        (this.state.bagages.ville_depart=='')) ||
                                                    ((arrivee.isDomicile||arrivee.isAutre||arrivee.isIndifferent) &&
                                                        (this.state.bagages.ville_arrivee=='')) ||
                                                    this.state.disabled || !user?.client?.token || user?.client?.isPointRelais ? true : false}
                                                className={"btnBlue w-100"}>{t('btns.soumettreDemandeProprietaire')} {this.state.disabled ?
                                            <span
                                                className="fa fa-spin fa-spinner "></span> : null}</button>}
                                </div>
                            </div>
                        </section>
                        <div className={'container-fluid'}>
                            <Link to={'/faq'}
                                  className={'btnFAQ'}>FAQ
                            </Link>
                        </div>
                        <Footer/>
                    </div>
            )
    }

}

export default withTranslation()(RecapAnnoncePorterBagage);