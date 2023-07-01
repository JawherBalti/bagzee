import React, {Component, useEffect, useRef, useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import Footer from "../Footer";
import Header from "../Header";
import {withTranslation} from "react-i18next";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link, Redirect} from "react-router-dom";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Input, Modal, Upload, Tag, Checkbox} from "antd";
import axios from "axios";
import {TweenOneGroup} from 'rc-tween-one';
import {uploadFile} from "react-s3";
import {user} from '../../app'
import Autocomplete from "react-google-autocomplete";
import {createFilter} from "react-search-input";

const KEYS_TO_FILTERSA = ['adress.ville']

function getBase64PP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const S3_BUCKET = 'bagzee';
const REGION = 'us-east-1';
const ACCESS_KEY = 'AKIAWNNX6P6PM5THZEOA';
const SECRET_ACCESS_KEY = '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';

const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
}
window.Buffer = window.Buffer || require("buffer").Buffer;

class ConfierLieuDepot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            isUploaded: true,
            etape: 1,
            assurancePriceDep: 0,
            assurancePriceArr: 0,
            price: 30,
            newprice: 30,
            idPointRelaisArr: '',
            idPointRelaisDep: '',
            listeContenu: [],
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
            loading: true,
            loading1: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            gellery: [],
            adresse_point_depart: '',
            adresse_point_arrivee: '',
            lat_adresse_point_arrivee: 0,
            long_adresse_point_arrivee: 0,
            lat_adresse_point_depart: 0,
            long_adresse_point_depart: 0,

            bagages: {
                dimensionsLong: 0,
                dimensionsH: 0,
                dimensionsLarg: 0,
                dimensionsKg: 0,
                isBagage: false,
                isSacDos: false,
                isHorsFormat: false,
                isPetitObj: false,
                isIndifferent: false,
                isChat: false,
                isVoiture: false,
                isCar: false,
                isCamion: false,
                isAvion: false,
                isTrain: false,
                isBateau: false,
                isIndifferentV: false,
            },
        }
        this.handleChangedepart = this.handleChangedepart.bind(this);
        this.publier = this.publier.bind(this);
        this.handleChangeConfierRetrait = this.handleChangeConfierRetrait.bind(this);
        this.handleChangeDescBagage = this.handleChangeDescBagage.bind(this);
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        axios.get('api/payment/setting/price').then(res => {
            let neww = JSON.parse(JSON.stringify(res.data.setting_price));
            if (res.data.status) {
                this.setState({
                    settingPriceDep: res.data.setting_price,
                    settingPriceArr: neww

                }, () => {
                })
            }

        })
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
        if (user) {

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
                        }), () => this.props.location.state ? {} : this.setState({loading: false})
                    );
                }
            })
            axios.post('api/profil/photo/list', {token: user?.client?.token}).then(res => {
                this.setState({mesBagages: res.data.tabGallery},()=>{
                    console.log(this.state.mesBagages)
                    console.log(this.state.fileList)
                    if (this.props.location.state) {
                        axios.get('api/advert/get/' + this.props.location.state.id).then(res => {
                            console.log(res.data)
                            let advert = res.data.advert
                            let placeholderdepart = advert.type_adresse_depart == "Point relais" ? this.props.t('circuit_depot_annonce.point_relais') :
                                advert.type_adresse_depart == "Domicile" ? this.props.t('circuit_depot_annonce.domicile') :
                                    advert.type_adresse_depart == "Autre lieux" ? this.props.t('circuit_depot_annonce.autreLieu') :
                                        advert.type_adresse_depart == "Indifferent" ? this.props.t('circuit_depot_annonce.indifferent') : this.props.t('circuit_depot_annonce.point_relais')
                            let placeholderarrivee = advert.type_adresse_arrivee == "Point relais" ? this.props.t('circuit_depot_annonce.point_relais') :
                                advert.type_adresse_arrivee == "Domicile" ? this.props.t('circuit_depot_annonce.domicile') :
                                    advert.type_adresse_arrivee == "Autre lieux" ? this.props.t('circuit_depot_annonce.autreLieu') :
                                        advert.type_adresse_arrivee == "Indifferent" ? this.props.t('circuit_depot_annonce.indifferent') : this.props.t('circuit_depot_annonce.point_relais')
                            this.setState(prevState => ({
                                idPointRelaisDep: advert.idPointRelaisDep,
                                idPointRelaisArr: advert.idPointRelaisArr,
                                adresse_point_depart: advert.adresse_point_depart,
                                lat_adresse_point_depart: advert.lat_adresse_point_depart,
                                long_adresse_point_depart: advert.long_adresse_point_depart,
                                adresse_point_arrivee: advert.adresse_point_arrivee,
                                lat_adresse_point_arrivee: advert.lat_adresse_point_arrivee,
                                long_adresse_point_arrivee: advert.long_adresse_point_arrivee,
                                price: advert.price,
                                newprice: advert.price,
                                statusAnn: advert.status,
                                listeContenu: advert.listeContenu,
                                depart: {
                                    ...prevState.depart,    // keep all other key-value pairs
                                    ville_depart: advert.ville_depart,
                                    heure: advert.heureDepart,
                                    date: advert.dateDepart,
                                    nomEntreprise: advert.type_adresse_depart == "Point relais" && advert.nomEntrepriseDep,
                                    isPointRelais: advert.type_adresse_depart == "Point relais" ? true : false,
                                    isDomicile: advert.type_adresse_depart == "Domicile" ? true : false,
                                    isAutre: advert.type_adresse_depart == "Autre lieux" ? true : false,
                                    isIndifferent: advert.type_adresse_depart == "Indifferent" ? true : false,
                                    placeHolderSelect: placeholderdepart,
                                },
                                settingPriceDep: advert.settingPriceDep.length ? advert.settingPriceDep : this.state.settingPriceDep,
                                settingPriceArr: advert.settingPriceArr.length ? advert.settingPriceArr : this.state.settingPriceArr,
                                arrivee: {
                                    ...prevState.arrivee,    // keep all other key-value pairs
                                    ville_arrivee: advert.ville_arrivee,
                                    heure: advert.heureArrivee,
                                    date: advert.dateArrivee,
                                    nomEntreprise: advert.type_adresse_arrivee == "Point relais" && advert.nomEntrepriseArr,
                                    isPointRelais: advert.type_adresse_arrivee == "Point relais" ? true : false,
                                    isDomicile: advert.type_adresse_arrivee == "Domicile" ? true : false,
                                    isAutre: advert.type_adresse_arrivee == "Autre lieux" ? true : false,
                                    isIndifferent: advert.type_adresse_arrivee == "Indifferent" ? true : false,
                                    placeHolderSelect: placeholderarrivee,
                                },
                                gellery: advert.gallery,
                                fileList: advert.gallery,
                                bagages: {
                                    ...prevState.bagages,    // keep all other key-value pairs
                                    dimensionsLong: advert.dimensionsLong,
                                    dimensionsH: advert.dimensionsH,
                                    dimensionsLarg: advert.dimensionsLarg,
                                    dimensionsKg: advert.dimensionsKg,
                                    isBagage: advert.objectType.includes("Bagage") ? true : false,
                                    isSacDos: advert.objectType.includes("Sac à dos") ? true : false,
                                    isHorsFormat: advert.objectType.includes("Hors format") ? true : false,
                                    isPetitObj: advert.objectType.includes("Petits objets") ? true : false,
                                    isIndifferent: advert.objectType.includes("Indifferent") ? true : false,
                                    isChat: advert.objectType.includes("Chat") ? true : false,
                                    isVoiture: advert.objectTransport.includes("Voiture") ? true : false,
                                    isCar: advert.objectTransport.includes("Car") ? true : false,
                                    isCamion: advert.objectTransport.includes("Camion") ? true : false,
                                    isAvion: advert.objectTransport.includes("Avion") ? true : false,
                                    isTrain: advert.objectTransport.includes("Train") ? true : false,
                                    isBateau: advert.objectTransport.includes("Bateau") ? true : false,
                                    isIndifferentV: advert.objectTransport.includes("IndifferentV") ? true : false,
                                },
                            }),()=>{
                                this.setState(prev=>({
                                    mesBagages:prev.mesBagages?.map(item=>
                                        (this.state.fileList.filter(val=>val.url===item.url).length>0 ? Object.assign(item, {checked: true}) : item),
                                    )}))
                            })
                            this.state.settingPriceDep?.map(working =>
                                (working.checked && this.setState({assurancePriceDep: this.state.assurancePriceDep + working.price}, () => {
                                    console.log(working.price)
                                    console.log(this.state.assurancePriceDep)

                                })))

                            this.state.settingPriceArr?.map(working =>
                                (working.checked && this.setState({assurancePriceArr: this.state.assurancePriceArr + working.price}, () => {
                                    console.log(this.state.assurancePriceArr)

                                })))


                            this.setState({loading: false})
                        });


                    }


                })
            })

        } else {
            this.setState({loading: false})
        }





    }


    publier(status) {
        const {depart, arrivee, bagages} = this.state
        let myArr = []
        bagages.isBagage && myArr.push('Bagage')
        bagages.isChat && myArr.push('Chat')
        bagages.isHorsFormat && myArr.push('Hors format')
        bagages.isSacDos && myArr.push('Sac à dos')
        bagages.isPetitObj && myArr.push('Petits objets')
        bagages.isIndifferent && myArr.push('Indifferent')

        let myArr2 = []
        bagages.isVoiture && myArr2.push('Voiture')
        bagages.isCar && myArr2.push('Car')
        bagages.isCamion && myArr2.push('Camion')
        bagages.isAvion && myArr2.push('Avion')
        bagages.isBateau && myArr2.push('Bateau')
        bagages.isTrain && myArr2.push('Train')
        bagages.isIndifferentV && myArr2.push('IndifferentV')
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
        axios.post(this.props.location.state ? 'api/advert/update' : 'api/advert/create', {

            id: this.props.location.state ? this.props.location.state.id : null,
            type_adresse_depart: type_adresse_depart,
            type_adresse_arrivee: type_adresse_arrivee,
            idPointRelaisDep: this.state.idPointRelaisDep,
            idPointRelaisArr: this.state.idPointRelaisArr,
            settingPriceDep: this.state.settingPriceDep,
            settingPriceArr: this.state.settingPriceArr,
            statusAnn: this.state.status,
            listeContenu: this.state.listeContenu,
            ville_depart: depart.ville_depart,
            fromDate: depart.date,
            fromTime: depart.heure,
            price: this.state.newprice,
            priceNet: this.state.newprice - (this.state.assurancePriceDep + this.state.assurancePriceArr),
            gellery: this.state.fileList,
            ville_arrivee: arrivee.ville_arrivee,
            toDate: arrivee.date,
            toTime: arrivee.heure,
            adresse_point_depart: this.state.adresse_point_depart,
            lat_adresse_point_depart: this.state.lat_adresse_point_depart,
            long_adresse_point_depart: this.state.long_adresse_point_depart,
            adresse_point_arrivee: this.state.adresse_point_arrivee,
            lat_adresse_point_arrivee: this.state.lat_adresse_point_arrivee,
            long_adresse_point_arrivee: this.state.long_adresse_point_arrivee,
            dimensionsLong: bagages.dimensionsLong,
            dimensionsH: bagages.dimensionsH,
            dimensionsLarg: bagages.dimensionsLarg,
            dimensionsKg: bagages.dimensionsKg,
            objectType: myArr,
            objectTransport: myArr2,
            token: user ? user.client.token : '',
            status: status
        }).then((res) => {
            if (res.data.status) {
                this.setState({status: status}, () => {
                    /*status == 1 ? */
                    this.setState({redirect: true,}, () => {
                        console.log(this.state.status)
                    })
                    /*: Modal.success({
                        content: (
                            <div className={"text-center"} key={'reservation-modal-' + Math.random()}>
                                <div>
                                    <LazyLoadImage src={"/images/logo.png"} width={'80px'} alt={"bagzee"}/>
                                    <br/>
                                    <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                        {res.data.message}
                                    </p>
                                </div>
                            </div>),
                        okText: 'ok',
                    })*/
                })
            } else {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'reservation-modal-' + Math.random()}>
                            <div>
                                <FontAwesomeIcon icon={faTimes} fontSize={60}
                                                 color={'red'}/>
                                <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                    {res.data.message}
                                </p>
                            </div>
                        </div>),
                    okText: 'ok',
                });
            }
        }).catch((e) => {

            Modal.success({
                content: (
                    <div className={"text-center"} key={'ops' + Math.random()}>
                        <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                        <p className={"text-danger pt-2"}>
                            {user ? JSON.stringify(e) : 'vous devez vous connecter'}
                        </p>

                    </div>),
                okText: 'ok',
            });
        })
    }

    handleUpload = async (file) => {

        console.log(file)
        var fileExtension = '.' + file.name.split('.')[1];
        var prefix = file.name.split('.')[0];
        var name = prefix.replace(/[^A-Z]/gi, '') + Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
        var newFile = new File([file], name, {type: file.type});
        uploadFile(newFile, config)
            .then((data, key) => {
                this.setState(prevState => ({
                    gellery: [...prevState.gellery, {
                        id: key,
                        url: data.location
                    }],
                    fileList: prevState.fileList.map(val =>
                        (val.name === file.name ? Object.assign(val, {
                            id: key,
                            url: data.location
                        }) : val))

                }), () => {
                    this.setState({isUploaded: true})
                    console.log(this.state.fileList)
                })


            })
            .catch(err => console.error(err))

    }
    handleDropPhotosPresentation = (e) => {
        console.log(e)
    }
    handleChangePhotosPresentation = (e) => {
        this.setState({loading1: true, isUploaded: false});
        let lengthFileList = e.fileList.length - 1
        //console.log('length filelist'+lengthFileList)
        if (e.file.status == 'done') {
            this.handleUpload(e.file.originFileObj)
            console.log(e.file)
        } else if (e.file.status == "removed") {
            let isRemovedMesBgg= this.state.fileList.filter(val =>
                (val.url === e.file.url))
            console.log(isRemovedMesBgg.length)
            if(isRemovedMesBgg.length===1){
                this.setState(prev=>({
                    mesBagages:prev.mesBagages.map(item=>
                        (item.url === e.file.url ? Object.assign(item, {checked: false}) : item),
                    )
                }),()=>console.log(this.state.mesBagages))
                console.log(this.state.mesBagages)
            }
        this.setState({isUploaded: true})
        }

        this.setState(({fileList: e.fileList, loading1: false}), () => {
            console.log(e.fileList)
        })
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

    handleChangedepart(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            depart: {
                ...prevState.depart,    // keep all other key-value pairs
                [name]: value
            }
        }));
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

    onCheckboxChangeAssDep(event, price) {
        const target = event.target;
        console.log(target.checked)
        const value = target.checked;
        const name = target.name;
        this.setState(prevState => ({
            settingPriceDep: prevState.settingPriceDep.map(working =>
                ('dep-' + working.name === name ? Object.assign(working, {checked: true}) : Object.assign(working, {checked: false}))),

            newprice: this.state.assurancePriceDep ? (this.state.newprice - this.state.assurancePriceDep) + price : this.state.newprice + price,
            price: this.state.assurancePriceDep ? (this.state.newprice - this.state.assurancePriceDep) + price : this.state.newprice + price,
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
        this.setState(prevState => ({
            settingPriceArr: prevState.settingPriceArr.map(working =>
                ('arr-' + working.name === name ? Object.assign(working, {checked: true}) : Object.assign(working, {checked: false}))),
            newprice: this.state.assurancePriceArr ? (this.state.newprice - this.state.assurancePriceArr) + price : this.state.newprice + price,
            price: this.state.assurancePriceArr ? (this.state.newprice - this.state.assurancePriceArr) + price : this.state.newprice + price,
            assurancePriceArr: price


        }), () => console.log(this.state.settingPriceArr));


    }

    onRemoveAllCheck(type) {
        let fraisRelaisDep = this.state.assurancePriceDep //+ 3
        let fraisRelaisArr = this.state.assurancePriceArr //+ 3
        console.log(type)
        if (type == 'assurancePriceDep') {
            this.setState(prevState => ({
                settingPriceDep: prevState.settingPriceDep.map(working =>
                    (Object.assign(working, {checked: false}))),
                newprice: this.state.newprice - fraisRelaisDep,
                price: this.state.newprice - fraisRelaisDep,
                assurancePriceDep: 0

            }), () => {
                console.log(fraisRelaisDep)
                console.log(this.state.newprice)
            })
        } else {
            this.setState(prevState => ({
                settingPriceArr: prevState.settingPriceArr.map(working =>
                    (Object.assign(working, {checked: false}))),
                newprice: this.state.newprice - fraisRelaisArr,
                price: this.state.newprice - fraisRelaisArr,
                assurancePriceArr: 0,

            }), () => {
                console.log(fraisRelaisDep)
                console.log(this.state.newprice)
            })
        }

    }

    render() {

        const {t} = this.props;
        const {price, previewVisible, previewImage, fileList, etape, depart, arrivee, bagages, listeContenu} = this.state;

        const Tags = () => {
            const [inputVisible, setInputVisible] = useState(false);
            const [inputValue, setInputValue] = useState('');
            const inputRef = useRef(null);
            useEffect(() => {
                if (inputVisible) {
                    inputRef.current?.focus();
                }
            }, [inputVisible]);
            const handleClose = (removedTag) => {
                const newTags = listeContenu.filter((tag) => tag !== removedTag);
                console.log(newTags);
                this.setState({listeContenu: newTags});
            };
            const showInput = () => {
                setInputVisible(true);
            };
            const handleInputChange = (e) => {
                setInputValue(e.target.value);
            };
            const handleInputConfirm = () => {
                if (inputValue && listeContenu.indexOf(inputValue) === -1) {
                    this.setState(prev =>
                            ({
                                listeContenu: [...prev.listeContenu, inputValue
                                ]
                            })
                        , () => {
                            console.log(inputValue)
                            console.log(listeContenu)
                        });
                }
                setInputVisible(false);
                setInputValue('');
            };
            const forMap = (tag) => {
                const tagElem = (
                    <Tag
                        className='bttn gap-2 d-flex justify-content-around align-items-center mx-2'
                        style={{
                            background: '#53BFED',
                            color: '#fff',
                            display: 'inline-block',
                            fontSize: '1rem',
                            minWidth: 'max-content',
                            border: '1px solid #53BFED'
                        }} closable
                        onClose={(e) => {
                            e.preventDefault();
                            handleClose(tag);
                        }}
                    >
                        {tag}
                    </Tag>
                );
                return (
                    <span
                        key={tag}
                        style={{
                            display: 'inline-block',
                            color: '#fff',
                        }}
                    >
        {tagElem}
      </span>
                );
            };
            const tagChild = listeContenu.map(forMap);
            return (
                <>
                    <div
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <TweenOneGroup
                            enter={{
                                scale: 0.8,
                                opacity: 0,
                                type: 'from',
                                duration: 100,
                            }}
                            onEnd={(e) => {
                                if (e.type === 'appear' || e.type === 'enter') {
                                    e.target.style = 'display: inline-block';
                                }
                            }}
                            leave={{
                                opacity: 0,
                                width: 0,
                                scale: 0,
                                duration: 200,
                            }}
                            appear={false}
                        >
                            {tagChild}
                        </TweenOneGroup>
                    </div>
                    {inputVisible ? (
                        <Input
                            ref={inputRef}
                            type="text"
                            className='bttn mx-0 inputVisible'
                            style={{
                                fontSize: '1rem',
                                width: 'auto',
                                minWidth: 'max-content',
                                border: '1px solid #e8e8e8'
                            }}
                            value={inputValue}
                            onChange={handleInputChange}
                            onBlur={handleInputConfirm}
                            onPressEnter={handleInputConfirm}
                        />
                    ) : (
                        <Tag onClick={showInput} className='bttn gap-2 d-flex justify-content-around align-items-center'
                             style={{
                                 fontSize: '1rem',
                                 minWidth: 'max-content',
                                 border: '1px solid #e8e8e8'
                             }}>
                            <PlusOutlined/> Ajouter
                        </Tag>
                    )}
                </>
            );
        };

        const uploadButtonPP = (
            <div className={'d-flex justify-content-center align-items-center flex-column'}
                 style={{border: "1px dashed #8F8F8F", borderRadius: 12, width: 170, height: 170}}>
                <FontAwesomeIcon icon={faImage} className={'text-blue fs-1'}/>
                <div className="ant-upload-text text-gris">{t('circuit_depot_annonce.ajoutUnePhoto')}
                </div>
            </div>
        );


        if (this.state.redirect) {
            return <Redirect
                to={{pathname: '/annonces',
                    state: {
                        role: t('proprietaire'),
                        status: this.state.status,
                        statusName: this.state.status == 1 && t("page_annonce.ann_enCours")
                    }
                }}/>;
        } else {
            return (
                this.state.loading ?
                    <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                    </p> : <div>
                        <Header/>

                        <div className={"depotAnnonce container text-center"}>
                            {user ? null :
                                <p className={"text-danger mb-3  py-3"}>Vous devez vous connecter afin de poster
                                    l'annonce.</p>}

                        </div>
                        {etape == 1 ?
                            <section className={'depotAnnonce container text-center'}>
                                <div className={'etapes d-flex flex-row justify-content-center align-items-center'}>
                                    <span className={'circle'}>1</span>
                                    <span className={'tiretCircle'}/>
                                    <span className={'circleOutline'}>2</span>
                                    <span className={'tiretCircle'}/>
                                    <span className={'circleOutline'}>3</span>
                                    <span className={'tiretCircle'}/>
                                    <span className={'circleOutline'}>4</span>
                                    <span className={'tiretCircle'}/>
                                    <span className={'circleOutline'}>5</span>
                                </div>
                                {/* <p className={'text-dark-blue'}>{t('circuit_depot_annonce.lieuDepot')}</p>
                                <LazyLoadImage src={"/images/imgConfierLieuDepot.png"} className={'my-3'}
                                               alt={"imgConfierLieuDepot"}/> */}
                                <div className={'row mx-auto'} style={{maxWidth: 800}}>

                                    <div className={'col-md-6 text-left'}>
                                        <label className='requis'>{t('page_home.date')}</label>
                                        <input type={"date"} name={"date"} value={depart.date} required
                                               min={moment().format("YYYY-MM-DD")}
                                               onChange={this.handleChangedepart}/>

                                    </div>
                                    <div className={'col-md-6 text-left'}>
                                        <label className='requis'>{t('circuit_depot_annonce.heure')}</label>
                                        <input type={"time"} name={"heure"} value={depart.heure} required
                                               onChange={this.handleChangedepart}/>

                                    </div>
                                </div>

                                <div className='d-flex gap-md-5 gap-3 justify-content-center my-3'>
                                    <div className="pointer" onClick={() => {
                                        this.setState(prev => ({
                                            depart: {
                                                ...prev.depart,
                                                isPointRelais: true,
                                                placeHolderSelect: t('circuit_depot_annonce.point_relais'),
                                                isDomicile: false,
                                                isAutre: false,
                                                isIndifferent: false,
                                                ville_depart: ''
                                            },
                                            adresse_point_depart: '',
                                            lat_adresse_point_depart: 0,
                                            long_adresse_point_depart: 0
                                        }))


                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="39.985" height="42.41"
                                             viewBox="0 0 42.985 45.41">
                                            <g id="store-svgrepo-com_2_" data-name="store-svgrepo-com (2)"
                                               transform="translate(-12.151)">
                                                <path id="Tracé_6624" data-name="Tracé 6624"
                                                      d="M58.368,90.221H21.2l-2.228,4.728H60.6Z"
                                                      transform="translate(-6.142 -81.217)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <path id="Tracé_6625" data-name="Tracé 6625"
                                                      d="M321.723,167.6a6.224,6.224,0,0,0,12.089,0Z"
                                                      transform="translate(-278.676 -150.869)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <path id="Tracé_6626" data-name="Tracé 6626"
                                                      d="M172.982,172.333a6.239,6.239,0,0,0,6.044-4.738H166.938A6.239,6.239,0,0,0,172.982,172.333Z"
                                                      transform="translate(-139.339 -150.869)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <path id="Tracé_6627" data-name="Tracé 6627"
                                                      d="M24.24,167.6H12.151a6.224,6.224,0,0,0,12.089,0Z"
                                                      transform="translate(0 -150.869)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <path id="Tracé_6628" data-name="Tracé 6628"
                                                      d="M70.428,203.057a9.211,9.211,0,0,1-15.448,0,9.211,9.211,0,0,1-10.547,3.75V228.2H54.752V211.115h15.9V228.2H80.974V206.807a9.211,9.211,0,0,1-10.547-3.75Z"
                                                      transform="translate(-29.06 -182.791)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <rect id="Rectangle_5840" data-name="Rectangle 5840" width="27.463"
                                                      height="6.01"
                                                      transform="translate(19.912)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                                <rect id="Rectangle_5841" data-name="Rectangle 5841" width="9.914"
                                                      height="14.093"
                                                      transform="translate(28.686 31.317)"
                                                      fill={depart.isPointRelais ? "#4dbded" : "#000"}/>
                                            </g>
                                        </svg>
                                        <br/>
                                        <span style={depart.isPointRelais ? {
                                            color: "#4dbded",
                                            lineHeight: 2.5
                                        } : {
                                            color: "#000",
                                            lineHeight: 2.5
                                        }}>{t('circuit_depot_annonce.point_relais')}</span>
                                    </div>
                                    <div className="pointer" onClick={() => {
                                        if (depart.isPointRelais) {
                                            this.onRemoveAllCheck('assurancePriceDep')
                                            console.log(price)
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    isPointRelais: false,
                                                    isDomicile: true,
                                                    placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                    isAutre: false,
                                                    isIndifferent: false,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))

                                        } else {
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    isPointRelais: false,
                                                    isDomicile: true,
                                                    placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                    isAutre: false,
                                                    isIndifferent: false,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))
                                        }

                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="44.411" height="42.41"
                                             viewBox="0 0 47.411 45.41">
                                            <path id="home-svgrepo-com"
                                                  d="M46.578,24.6l-5.932-4.835V12.035a1.581,1.581,0,0,0-1.579-1.579H35.334a1.581,1.581,0,0,0-1.579,1.579v2.116l-7.927-6.46a3.48,3.48,0,0,0-4.246,0L.833,24.6c-.943.768-.886,1.437-.769,1.768s.5.883,1.706.883H4.611V49.5a2.878,2.878,0,0,0,2.871,2.879h8.973a2.81,2.81,0,0,0,2.8-2.879V40.375a1.56,1.56,0,0,1,1.507-1.494h6.03a1.435,1.435,0,0,1,1.364,1.494V49.5A2.95,2.95,0,0,0,31.1,52.376h8.829A2.878,2.878,0,0,0,42.8,49.5V27.253H45.64c1.211,0,1.589-.553,1.706-.883S47.521,25.37,46.578,24.6Z"
                                                  transform="translate(0 -6.966)"
                                                  fill={depart.isDomicile ? "#4dbded" : "#000"}/>
                                        </svg>
                                        <br/>
                                        <span
                                            style={depart.isDomicile ? {color: "#4dbded", lineHeight: 2.5} : {
                                                color: "#000",
                                                lineHeight: 2.5
                                            }}>{t('circuit_depot_annonce.domicile')}</span>
                                    </div>
                                    <div className="pointer" onClick={() => {
                                        if (depart.isPointRelais) {
                                            this.onRemoveAllCheck('assurancePriceDep')
                                            console.log(price)
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    isPointRelais: false,
                                                    isDomicile: false,
                                                    isAutre: true,
                                                    placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                    isIndifferent: false,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))
                                        } else {
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    isPointRelais: false,
                                                    isDomicile: false,
                                                    isAutre: true,
                                                    placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                    isIndifferent: false,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))
                                        }

                                    }}>
                                        <svg id="pin-maps-and-location-svgrepo-com" xmlns="http://www.w3.org/2000/svg"
                                             width="46.167" height="42.167" viewBox="0 0 49.167 49.167">
                                            <g id="Groupe_5066" data-name="Groupe 5066">
                                                <path id="Tracé_6963" data-name="Tracé 6963"
                                                      d="M27.355,36.913l.474-12.33h.031a.819.819,0,0,0,.819-.819v-3.28a10.653,10.653,0,1,0-8.194,0v3.28a.819.819,0,0,0,.819.819h.031l.474,12.33C13.327,37.144,0,38.651,0,43.021c0,4.509,14.7,6.146,24.583,6.146s24.583-1.636,24.583-6.146C49.167,38.651,35.839,37.144,27.355,36.913Zm-.314-15.819v1.85H22.125v-1.85c.488.062.9.108,1.269.141.161.018.324.025.487.035l.263.013c.147.006.291.022.439.022s.293-.016.439-.022l.263-.013c.163-.011.326-.017.487-.035C26.146,21.2,26.554,21.156,27.042,21.094ZM18.847,10.653a.819.819,0,0,1-1.639,0,7.383,7.383,0,0,1,7.375-7.375.819.819,0,0,1,0,1.639A5.743,5.743,0,0,0,18.847,10.653Zm5.736,36.875c-14.006,0-22.944-2.67-22.944-4.507,0-1.447,6.761-4.131,20.235-4.471l.189,4.913a2.523,2.523,0,0,0,5.041,0l.189-4.913c13.473.34,20.234,3.024,20.234,4.471C47.528,44.858,38.589,47.528,24.583,47.528Z"
                                                      fill={depart.isAutre ? "#4dbded" : "#000"}/>
                                            </g>
                                        </svg>
                                        <br/>
                                        <span style={depart.isAutre ? {color: "#4dbded", lineHeight: 2.5} : {
                                            color: "#000",
                                            lineHeight: 2.5
                                        }}>{t('circuit_depot_annonce.autreLieu')}</span>

                                    </div>
                                    <div className="pointer" onClick={() => {
                                        if (depart.isPointRelais) {
                                            this.onRemoveAllCheck('assurancePriceDep')
                                            console.log(price)
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    placeHolderSelect: 'indifferent',
                                                    isPointRelais: false,
                                                    isDomicile: false,
                                                    isAutre: false,
                                                    isIndifferent: true,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))
                                        } else {
                                            this.setState(prev => ({
                                                depart: {
                                                    ...prev.depart,
                                                    placeHolderSelect: 'indifferent',
                                                    isPointRelais: false,
                                                    isDomicile: false,
                                                    isAutre: false,
                                                    isIndifferent: true,
                                                    ville_depart: ''
                                                },
                                                idPointRelaisDep: '',
                                                adresse_point_depart: '',
                                                lat_adresse_point_depart: 0,
                                                long_adresse_point_depart: 0
                                            }))
                                        }
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="37.375" height="42.208"
                                             viewBox="1 0 37.375 55.208">
                                            <g id="Groupe_9221" data-name="Groupe 9221"
                                               transform="translate(-420.649 -1460.159)">
                                                <path id="pin-svgrepo-com_4_" data-name="pin-svgrepo-com (4)"
                                                      d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                                                      transform="translate(403.25 1460.159)"
                                                      fill={depart.isIndifferent ? "#4dbded" : "#000"}/>
                                                <g id="Groupe_5100" data-name="Groupe 5100"
                                                   transform="translate(421.127 1488.99)">
                                                    <path id="Tracé_6965" data-name="Tracé 6965"
                                                          d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                                                          transform="translate(2053.208 -7072.97)" fill="none"
                                                          stroke={depart.isIndifferent ? "#4dbded" : "#000"}
                                                          strokeWidth="1"/>
                                                    <path id="Tracé_6966" data-name="Tracé 6966"
                                                          d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                                                          transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                                                          fill="none"
                                                          stroke={depart.isIndifferent ? "#4dbded" : "#000"}
                                                          strokeWidth="1"/>
                                                </g>
                                            </g>
                                        </svg>
                                        <br/>
                                        <span style={depart.isIndifferent ? {
                                            color: "#4dbded",
                                            lineHeight: 2.5
                                        } : {
                                            color: "#000",
                                            lineHeight: 2.5
                                        }}>{t('circuit_depot_annonce.indifferent')}</span>

                                    </div>
                                </div>
                                {depart.isIndifferent ?
                                    <div className={'col-12 text-left mb-2 mx-auto'} style={{maxWidth: 800}}>
                                        <label className='requis'>{t('page_home.ville_depart')}</label>
                                               <Autocomplete value={depart.ville_depart}
                                                             name={"ville_depart"}
                                                             apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                             options={{
                                                                 types: ["locality"],
                                                                 componentRestrictions: { country: "fr" },
                                                             }}
                                                             onPlaceSelected={(place) => {
                                                                 place.address_components.map(res => res.types[0] == 'locality' ?
                                                                     this.setState(prevState => ({
                                                                         depart: {
                                                                             ...prevState.depart,    // keep all other key-value pairs
                                                                             ville_depart: res.long_name
                                                                         },
                                                                     }), () => console.log(place)) : null);
                                                             }}
                                                             required onChange={this.handleChangedepart}/>

                                    </div> : depart.isAutre ?
                                        <Autocomplete style={{maxWidth: 800}}
                                                      value={this.state.adresse_point_depart}
                                                      apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                      options={{
                                                          types: ["geocode", "establishment"],
                                                          strictBounds: true,
                                                          componentRestrictions: {country: "fr"},
                                                      }}
                                                      onChange={(e) => this.setState({adresse_point_depart: e.target.value}, () => {
                                                          console.log(e.target.value)
                                                          console.log(e)
                                                          console.log(this.state.adresse_point_depart)
                                                      })}
                                                      onPlaceSelected={(place) => {
                                                          place.address_components.map(res => res.types[0] == 'locality' ?
                                                              this.setState(prevState => ({
                                                                  depart: {
                                                                      ...prevState.depart,    // keep all other key-value pairs
                                                                      autreLieux: place.formatted_address,
                                                                      ville_depart: res.long_name
                                                                  },
                                                                  adresse_point_depart: place.formatted_address,
                                                                  lat_adresse_point_depart: place.geometry.location.lat(),
                                                                  long_adresse_point_depart: place.geometry.location.lng(),
                                                              }), () => console.log(place)) : null);
                                                      }}
                                        /> : (depart.isDomicile || depart.isPointRelais) ?
                                            <div className={'mx-auto'} style={{maxWidth: 800}}>
                                                {depart.isPointRelais ?
                                                    <div className={'text-left mb-2'}>
                                                        <label className="requis">{t('page_home.ville_depart')}</label>
                                                        <Autocomplete value={depart.ville_depart}
                                                                      name={"ville_depart"}
                                                                      apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                                      options={{
                                                                          types: ["locality"],
                                                                          componentRestrictions: { country: "fr" },
                                                                      }}
                                                                      onPlaceSelected={(place) => {
                                                                          place.address_components.map(res => res.types[0] == 'locality' ?
                                                                              this.setState(prevState => ({
                                                                                  depart: {
                                                                                      ...prevState.depart,    // keep all other key-value pairs
                                                                                      ville_depart: res.long_name
                                                                                  },
                                                                              }), () => console.log(place)) : null);
                                                                      }}
                                                                      required onChange={this.handleChangedepart}/>
                                                        <br/>
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
                                                                let myLat = e.target.value.split('&lat=')[1]
                                                                myLat = myLat.split('&long=')[0]
                                                                let myLng = e.target.value.split('&long=')[1]
                                                                myLng = myLng.split('&id=')[0]
                                                                let adr = e.target.value.split('&lat=')[0]
                                                                this.setState(prev => ({
                                                                    depart: {...prev.depart, nomEntreprise: nomE},
                                                                    adresse_point_depart: adr.split('-')[1],
                                                                    lat_adresse_point_depart: myLat,
                                                                    long_adresse_point_depart: myLng,
                                                                    idPointRelaisDep: e.target.value.split('&id=')[1]
                                                                }))
                                                            }
                                                        }}>
                                                    <option key={'-1'} value={''} disabled={true}
                                                            selected={(depart.isPointRelais && !this.state.idPointRelaisDep) || (depart.isDomicile && !this.state.lat_adresse_point_depart) ? true : false}>{depart.placeHolderSelect}
                                                    </option>
                                                    {depart.isPointRelais ?
                                                        depart.pointRelais.filter(createFilter(depart.ville_depart, KEYS_TO_FILTERSA)).map(lieu =>
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
                                                            <div className={'d-flex justify-content-between py-2'}>
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
                                {this.state.statusAnn?null:<div
                                    className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                    <button onClick={() => this.publier(0)}
                                            className={"btnWhite"}>{t('btns.enregistrer')}</button>
                                </div>}
                                <div
                                    className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                    <Link to={'/deposer-annonce'}
                                          className="btnDeposer bttn">{t('btns.retour')}</Link>

                                    <button
                                        disabled={((this.state.assurancePriceDep == 0 && depart.isPointRelais) || depart.ville_depart == '' || depart.date == '' || depart.heure == '' || (!depart.isIndifferent && this.state.adresse_point_depart == '')) ? true : false}
                                        onClick={() => {
                                            window.scrollTo(0, 0);
                                            this.setState({etape: etape + 1})
                                        }}
                                        className="btnBlue bttn">{t('btns.suivant')}</button>
                                </div>

                            </section> :
                            etape == 2 ?
                                <section className={'depotAnnonce container text-center'}>
                                    <div className={'etapes d-flex flex-row justify-content-center align-items-center'}>
                                        <span className={'circle'}>1</span>
                                        <span className={'tiretCircle'}/>
                                        <span className={'circle'}>2</span>
                                        <span className={'tiretCircle'}/>
                                        <span className={'circleOutline'}>3</span>
                                        <span className={'tiretCircle'}/>
                                        <span className={'circleOutline'}>4</span>
                                        <span className={'tiretCircle'}/>
                                        <span className={'circleOutline'}>5</span>
                                    </div>
                                    {/* <p className={'text-dark-blue'}>{t('circuit_depot_annonce.lieuRetrait')}</p>
                                    <LazyLoadImage src={"/images/imgConfierLieuRetrait.png"} className={'my-3'}
                                                   alt={"imgConfierLieuRetrait"}/> */}
                                    <div className={'row mx-auto'} style={{maxWidth: 800}}>

                                        <div className={'col-md-6 text-left'}>
                                            <label className="requis">{t('page_home.date')}</label>
                                            <input type={"date"} name={"date"} value={arrivee.date} required
                                                   min={moment().format("YYYY-MM-DD")}
                                                   onChange={this.handleChangeConfierRetrait}/>

                                        </div>
                                        <div className={'col-md-6 text-left'}>
                                            <label className="requis">{t('circuit_depot_annonce.heure')}</label>
                                            <input type={"time"} name={"heure"} value={arrivee.heure} required
                                                   onChange={this.handleChangeConfierRetrait}/>

                                        </div>
                                    </div>

                                    <div className='d-flex gap-md-5 gap-3  justify-content-center my-3'>
                                        <div className="pointer" onClick={() => {
                                            this.setState(prevState => ({
                                                arrivee: {
                                                    ...prevState.arrivee,
                                                    isPointRelais: true,
                                                    placeHolderSelect: t('circuit_depot_annonce.point_relais'),
                                                    isDomicile: false,
                                                    isAutre: false,
                                                    isIndifferent: false,
                                                    ville_arrivee: ''
                                                },
                                                adresse_point_arrivee: '',
                                                lat_adresse_point_arrivee: 0,
                                                long_adresse_point_arrivee: 0
                                            }))
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="39.985" height="42.41"
                                                 viewBox="0 0 42.985 45.41">
                                                <g id="store-svgrepo-com_2_" data-name="store-svgrepo-com (2)"
                                                   transform="translate(-12.151)">
                                                    <path id="Tracé_6624" data-name="Tracé 6624"
                                                          d="M58.368,90.221H21.2l-2.228,4.728H60.6Z"
                                                          transform="translate(-6.142 -81.217)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <path id="Tracé_6625" data-name="Tracé 6625"
                                                          d="M321.723,167.6a6.224,6.224,0,0,0,12.089,0Z"
                                                          transform="translate(-278.676 -150.869)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <path id="Tracé_6626" data-name="Tracé 6626"
                                                          d="M172.982,172.333a6.239,6.239,0,0,0,6.044-4.738H166.938A6.239,6.239,0,0,0,172.982,172.333Z"
                                                          transform="translate(-139.339 -150.869)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <path id="Tracé_6627" data-name="Tracé 6627"
                                                          d="M24.24,167.6H12.151a6.224,6.224,0,0,0,12.089,0Z"
                                                          transform="translate(0 -150.869)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <path id="Tracé_6628" data-name="Tracé 6628"
                                                          d="M70.428,203.057a9.211,9.211,0,0,1-15.448,0,9.211,9.211,0,0,1-10.547,3.75V228.2H54.752V211.115h15.9V228.2H80.974V206.807a9.211,9.211,0,0,1-10.547-3.75Z"
                                                          transform="translate(-29.06 -182.791)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <rect id="Rectangle_5840" data-name="Rectangle 5840" width="27.463"
                                                          height="6.01" transform="translate(19.912)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                    <rect id="Rectangle_5841" data-name="Rectangle 5841" width="9.914"
                                                          height="14.093" transform="translate(28.686 31.317)"
                                                          fill={arrivee.isPointRelais ? "#4dbded" : "#000"}/>
                                                </g>
                                            </svg>
                                            <br/>
                                            <span style={arrivee.isPointRelais ? {
                                                color: "#4dbded",
                                                lineHeight: 2.5
                                            } : {color: "#000", lineHeight: 2.5}}>Point relais</span>
                                        </div>
                                        <div className="pointer" onClick={() => {
                                            if (arrivee.isPointRelais) {
                                                this.onRemoveAllCheck('assurancePriceArr')
                                                console.log(price)
                                                this.setState(prevState => ({
                                                    arrivee: {
                                                        ...prevState.arrivee,
                                                        isPointRelais: false,
                                                        isDomicile: true,
                                                        placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                        isAutre: false,
                                                        isIndifferent: false,
                                                        ville_arrivee: ''
                                                    },
                                                    idPointRelaisArr: '',
                                                    adresse_point_arrivee: '',
                                                    lat_adresse_point_arrivee: 0,
                                                    long_adresse_point_arrivee: 0
                                                }))
                                            } else {
                                                this.setState(prevState => ({
                                                    arrivee: {
                                                        ...prevState.arrivee,
                                                        isPointRelais: false,
                                                        isDomicile: true,
                                                        placeHolderSelect: t('circuit_depot_annonce.domicile'),
                                                        isAutre: false,
                                                        isIndifferent: false,
                                                        ville_arrivee: ''
                                                    },
                                                    idPointRelaisArr: '',
                                                    adresse_point_arrivee: '',
                                                    lat_adresse_point_arrivee: 0,
                                                    long_adresse_point_arrivee: 0
                                                }))
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="44.411" height="42.41"
                                                 viewBox="0 0 47.411 45.41">
                                                <path id="home-svgrepo-com"
                                                      d="M46.578,24.6l-5.932-4.835V12.035a1.581,1.581,0,0,0-1.579-1.579H35.334a1.581,1.581,0,0,0-1.579,1.579v2.116l-7.927-6.46a3.48,3.48,0,0,0-4.246,0L.833,24.6c-.943.768-.886,1.437-.769,1.768s.5.883,1.706.883H4.611V49.5a2.878,2.878,0,0,0,2.871,2.879h8.973a2.81,2.81,0,0,0,2.8-2.879V40.375a1.56,1.56,0,0,1,1.507-1.494h6.03a1.435,1.435,0,0,1,1.364,1.494V49.5A2.95,2.95,0,0,0,31.1,52.376h8.829A2.878,2.878,0,0,0,42.8,49.5V27.253H45.64c1.211,0,1.589-.553,1.706-.883S47.521,25.37,46.578,24.6Z"
                                                      transform="translate(0 -6.966)"
                                                      fill={arrivee.isDomicile ? "#4dbded" : "#000"}/>
                                            </svg>
                                            <br/>
                                            <span style={arrivee.isDomicile ? {
                                                color: "#4dbded",
                                                lineHeight: 2.5
                                            } : {color: "#000", lineHeight: 2.5}}>Domicie</span>
                                        </div>
                                        <div className="pointer" onClick={() => {
                                            if (arrivee.isPointRelais) {
                                                this.onRemoveAllCheck('assurancePriceArr')
                                                console.log(price)
                                                this.setState(prevState => ({
                                                        arrivee: {
                                                            ...prevState.arrivee,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                            isIndifferent: false,
                                                            ville_arrivee: ''
                                                        },
                                                        idPointRelaisArr: '',
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0
                                                    })
                                                )
                                            } else {
                                                this.setState(prevState => ({
                                                        arrivee: {
                                                            ...prevState.arrivee,
                                                            isPointRelais: false,
                                                            isDomicile: false,
                                                            isAutre: true,
                                                            placeHolderSelect: t('circuit_depot_annonce.autreLieu'),
                                                            isIndifferent: false,
                                                            ville_arrivee: ''
                                                        },
                                                        idPointRelaisArr: '',
                                                        adresse_point_arrivee: '',
                                                        lat_adresse_point_arrivee: 0,
                                                        long_adresse_point_arrivee: 0
                                                    })
                                                )
                                            }
                                        }}>
                                            <svg id="pin-maps-and-location-svgrepo-com" xmlns="http://www.w3.org/2000/svg"
                                                 width="46.167" height="42.167" viewBox="0 0 49.167 49.167">
                                                <g id="Groupe_5066" data-name="Groupe 5066">
                                                    <path id="Tracé_6963" data-name="Tracé 6963"
                                                          d="M27.355,36.913l.474-12.33h.031a.819.819,0,0,0,.819-.819v-3.28a10.653,10.653,0,1,0-8.194,0v3.28a.819.819,0,0,0,.819.819h.031l.474,12.33C13.327,37.144,0,38.651,0,43.021c0,4.509,14.7,6.146,24.583,6.146s24.583-1.636,24.583-6.146C49.167,38.651,35.839,37.144,27.355,36.913Zm-.314-15.819v1.85H22.125v-1.85c.488.062.9.108,1.269.141.161.018.324.025.487.035l.263.013c.147.006.291.022.439.022s.293-.016.439-.022l.263-.013c.163-.011.326-.017.487-.035C26.146,21.2,26.554,21.156,27.042,21.094ZM18.847,10.653a.819.819,0,0,1-1.639,0,7.383,7.383,0,0,1,7.375-7.375.819.819,0,0,1,0,1.639A5.743,5.743,0,0,0,18.847,10.653Zm5.736,36.875c-14.006,0-22.944-2.67-22.944-4.507,0-1.447,6.761-4.131,20.235-4.471l.189,4.913a2.523,2.523,0,0,0,5.041,0l.189-4.913c13.473.34,20.234,3.024,20.234,4.471C47.528,44.858,38.589,47.528,24.583,47.528Z"
                                                          fill={arrivee.isAutre ? "#4dbded" : "#000"}/>
                                                </g>
                                            </svg>
                                            <br/>
                                            <span style={arrivee.isAutre ? {
                                                color: "#4dbded",
                                                lineHeight: 2.5
                                            } : {color: "#000", lineHeight: 2.5}}>Autre lieux</span>

                                        </div>
                                        <div className="pointer" onClick={() => {
                                            if (arrivee.isPointRelais) {
                                                this.onRemoveAllCheck('assurancePriceArr')
                                                console.log(price)

                                                this.setState(prevState => ({
                                                    arrivee: {
                                                        ...prevState.arrivee,
                                                        placeHolderSelect: 'indifferent',
                                                        isPointRelais: false,
                                                        isDomicile: false,
                                                        isAutre: false,
                                                        isIndifferent: true,
                                                        ville_arrivee: ''
                                                    },
                                                    idPointRelaisArr: '',
                                                    adresse_point_arrivee: '',
                                                    lat_adresse_point_arrivee: 0,
                                                    long_adresse_point_arrivee: 0
                                                }))
                                            } else {
                                                this.setState(prevState => ({
                                                    arrivee: {
                                                        ...prevState.arrivee,
                                                        placeHolderSelect: 'indifferent',
                                                        isPointRelais: false,
                                                        isDomicile: false,
                                                        isAutre: false,
                                                        isIndifferent: true,
                                                        ville_arrivee: ''
                                                    },
                                                    idPointRelaisArr: '',
                                                    adresse_point_arrivee: '',
                                                    lat_adresse_point_arrivee: 0,
                                                    long_adresse_point_arrivee: 0
                                                }))
                                            }
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="37.375" height="42.208"
                                                 viewBox="1 0 37.375 55.208">
                                                <g id="Groupe_9221" data-name="Groupe 9221"
                                                   transform="translate(-420.649 -1460.159)">
                                                    <path id="pin-svgrepo-com_4_" data-name="pin-svgrepo-com (4)"
                                                          d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                                                          transform="translate(403.25 1460.159)"
                                                          fill={arrivee.isIndifferent ? "#4dbded" : "#000"}/>
                                                    <g id="Groupe_5100" data-name="Groupe 5100"
                                                       transform="translate(421.127 1488.99)">
                                                        <path id="Tracé_6965" data-name="Tracé 6965"
                                                              d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                                                              transform="translate(2053.208 -7072.97)" fill="none"
                                                              stroke={arrivee.isIndifferent ? "#4dbded" : "#000"}
                                                              strokeWidth="1"/>
                                                        <path id="Tracé_6966" data-name="Tracé 6966"
                                                              d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                                                              transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                                                              fill="none"
                                                              stroke={arrivee.isIndifferent ? "#4dbded" : "#000"}
                                                              strokeWidth="1"/>
                                                    </g>
                                                </g>
                                            </svg>
                                            <br/>
                                            <span style={arrivee.isIndifferent ? {
                                                color: "#4dbded",
                                                lineHeight: 2.5
                                            } : {color: "#000", lineHeight: 2.5}}>Indifférent</span>

                                        </div>
                                    </div>
                                    {arrivee.isIndifferent ?
                                        <div className={'col-12 text-left mb-2 mx-auto'} style={{maxWidth: 800}}>
                                            <label className="requis">{t('page_home.ville_arrivee')}</label>
                                            <Autocomplete value={arrivee.ville_arrivee}
                                                          name={"ville_arrivee"}
                                                          apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                          options={{
                                                              types: ["locality"],
                                                              componentRestrictions: { country: "fr" },
                                                          }}
                                                          onPlaceSelected={(place) => {
                                                              place.address_components.map(res => res.types[0] == 'locality' ?
                                                                  this.setState(prevState => ({
                                                                      arrivee: {
                                                                          ...prevState.arrivee,    // keep all other key-value pairs
                                                                          ville_arrivee: res.long_name
                                                                      },
                                                                  }), () => console.log(place)) : null);
                                                          }}
                                                          required onChange={this.handleChangeConfierRetrait}/>

                                        </div> : arrivee.isAutre ?
                                            <Autocomplete value={this.state.adresse_point_arrivee} style={{maxWidth: 800}}
                                                          options={{
                                                              types: ["geocode", "establishment"],
                                                              strictBounds: true,
                                                              componentRestrictions: {country: "fr"},
                                                          }}
                                                          apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                          onChange={(e) => this.setState({adresse_point_arrivee: e.target.value})}
                                                          onPlaceSelected={(place) => {
                                                              place.address_components.map(res => res.types[0] == 'locality' ?

                                                                  this.setState(prevState => ({
                                                                      arrivee: {
                                                                          ...prevState.arrivee,    // keep all other key-value pairs
                                                                          autreLieux: place.formatted_address,
                                                                          ville_arrivee: res.long_name,
                                                                      },
                                                                      adresse_point_arrivee: place.formatted_address,
                                                                      lat_adresse_point_arrivee: place.geometry.location.lat(),
                                                                      long_adresse_point_arrivee: place.geometry.location.lng(),
                                                                  })) : null);
                                                          }}
                                            /> :
                                            <div className={'mx-auto'} style={{maxWidth: 800}}>
                                                {arrivee.isPointRelais ?
                                                    <div className={'text-left mb-2'}>
                                                        <label className="requis">{t('page_home.ville_arrivee')}</label>
                                                        <Autocomplete value={arrivee.ville_arrivee}
                                                                      name={"ville_arrivee"}
                                                                      apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                                      options={{
                                                                          types: ["locality"],
                                                                          componentRestrictions: { country: "fr" },
                                                                      }}
                                                                      onPlaceSelected={(place) => {
                                                                          place.address_components.map(res => res.types[0] == 'locality' ?
                                                                              this.setState(prevState => ({
                                                                                  arrivee: {
                                                                                      ...prevState.arrivee,    // keep all other key-value pairs
                                                                                      ville_arrivee: res.long_name
                                                                                  },
                                                                              }), () => console.log(place)) : null);
                                                                      }}
                                                                      required onChange={this.handleChangeConfierRetrait}/>
                                                        <br/>
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
                                                                        prev => ({
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
                                                                    arrivee: {...prev.arrivee, nomEntreprise: nomE},
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
                                                        arrivee.pointRelais.filter(createFilter(arrivee.ville_arrivee, KEYS_TO_FILTERSA)).map(lieu =>
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
                                                            <div className={'d-flex justify-content-between py-2'}>
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
                                            </div>}
                                    {this.state.statusAnn?null:<div
                                        className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                        <button onClick={() => this.publier(0)}
                                                className={"btnWhite"}>{t('btns.enregistrer')}</button>
                                    </div>}
                                    <div
                                        className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                        <button onClick={() => {
                                            window.scrollTo(0, 0);
                                            this.setState({etape: etape - 1})
                                        }}
                                                className="btnDeposer bttn">{t('btns.retour')}</button>

                                        <button
                                            disabled={((this.state.assurancePriceArr == 0 && arrivee.isPointRelais) || arrivee.ville_arrivee == '' || arrivee.date == '' || arrivee.heure == '') ? true : false}
                                            className="btnBlue bttn" onClick={() => {
                                            window.scrollTo(0, 0);
                                            this.setState({etape: etape + 1})
                                        }}>{t('btns.suivant')}</button>
                                    </div>

                                </section> :
                                etape == 3 ?
                                    <section className={'depotAnnonce container text-center'}>
                                        <div className={'etapes d-flex flex-row justify-content-center align-items-center'}>
                                            <span className={'circle'}>1</span>
                                            <span className={'tiretCircle'}/>
                                            <span className={'circle'}>2</span>
                                            <span className={'tiretCircle'}/>
                                            <span className={'circle'}>3</span>
                                            <span className={'tiretCircle'}/>
                                            <span className={'circleOutline'}>4</span>
                                            <span className={'tiretCircle'}/>
                                            <span className={'circleOutline'}>5</span>
                                        </div>
                                        {/* <p className={'text-dark-blue'}>{t('circuit_depot_annonce.descriptionBagage')}</p>
                                        <LazyLoadImage src={"/images/imgDescriptionBagages.png"} className={'my-3'}
                                                       alt={"imgDescriptionBagages"}/> */}
                                        <div className='my-3 mx-auto' style={{maxWidth: 800}}>
                                            <p className={'text-left'}>{t('circuit_depot_annonce.typeObj')} <span
                                                style={{color: "red"}}>*</span></p>
                                            <div className='d-flex gap-3 align-items-center justify-content-start'>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({

                                                        bagages: {
                                                            ...prev.bagages,
                                                            isBagage: !bagages.isBagage,

                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17.483" height="26.251"
                                                         viewBox="0 0 17.483 26.251">
                                                        <path id="suitcase-svgrepo-com_1_"
                                                              data-name="suitcase-svgrepo-com (1)"
                                                              d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                              transform="translate(-17.6 -1.3)"
                                                              fill={bagages.isBagage ? "#ef7615" : "#000"}/>
                                                    </svg>
                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isBagage ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.bagage')}</span>
                                                </div>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages, isSacDos: !bagages.isSacDos,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22.633" height="24.048"
                                                         viewBox="0 0 22.633 24.048">
                                                        <g id="backpack-svgrepo-com_1_" data-name="backpack-svgrepo-com (1)"
                                                           transform="translate(-8.735)">
                                                            <path id="Tracé_6614" data-name="Tracé 6614"
                                                                  d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                                  transform="translate(0 -155.838)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6615" data-name="Tracé 6615"
                                                                  d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                                  transform="translate(-232.971 -155.837)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6616" data-name="Tracé 6616"
                                                                  d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                                  transform="translate(-2.048 -14.56)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6617" data-name="Tracé 6617"
                                                                  d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                                  transform="translate(-30.854)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <rect id="Rectangle_5839" data-name="Rectangle 5839"
                                                                  width="11.4"
                                                                  height="4.826"
                                                                  transform="translate(14.407 16.226)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6618" data-name="Tracé 6618"
                                                                  d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                                  transform="translate(-34.631 -95.675)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6619" data-name="Tracé 6619"
                                                                  d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                                  transform="translate(-239.381 -14.561)"
                                                                  fill={bagages.isSacDos ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>


                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isSacDos ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.sacDos')}</span>
                                                </div>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isHorsFormat: !bagages.isHorsFormat,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="33.502" height="22.131"
                                                         viewBox="0 0 33.502 22.131">
                                                        <g id="bike-svgrepo-com" transform="translate(0.001 -50.317)">
                                                            <path id="Tracé_6621" data-name="Tracé 6621"
                                                                  d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                                  transform="translate(0)"
                                                                  fill={bagages.isHorsFormat ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>
                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isHorsFormat ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.horsFormat')}</span>
                                                </div>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isPetitObj: !bagages.isPetitObj,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35.79" height="21.048"
                                                         viewBox="0 0 35.79 21.048">
                                                        <g id="trainers-svgrepo-com" transform="translate(0 -61.013)">
                                                            <path id="Tracé_6622" data-name="Tracé 6622"
                                                                  d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                                  transform="translate(0)"
                                                                  fill={bagages.isPetitObj ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isPetitObj ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.petitsObj')}</span>

                                                </div>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages, isChat: !bagages.isChat,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16.371" height="23"
                                                         viewBox="0 0 16.371 23">
                                                        <path id="cat-svgrepo-com"
                                                              d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                              transform="translate(-32.398)"
                                                              fill={bagages.isChat ? "#ef7615" : "#000"}/>
                                                    </svg>

                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isChat ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.chat')}</span>

                                                </div>
                                                <div className="pointer" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isIndifferent: !bagages.isIndifferent,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15.308" height="26.276"
                                                         viewBox="0 0 15.308 26.276">
                                                        <g id="standing-man-svgrepo-com" transform="translate(-25.906)">
                                                            <g id="Groupe_8941" data-name="Groupe 8941"
                                                               transform="translate(25.906 0)">
                                                                <path id="Tracé_7680" data-name="Tracé 7680"
                                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                      transform="translate(-25.906 -20.81)"
                                                                      fill={bagages.isIndifferent ? "#ef7615" : "#000"}/>
                                                                <circle id="Ellipse_139" data-name="Ellipse 139" cx="2.719"
                                                                        cy="2.719"
                                                                        r="2.719" transform="translate(4.914)"
                                                                        fill={bagages.isIndifferent ? "#ef7615" : "#000"}/>
                                                            </g>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span className="pointer-text" style={bagages.isIndifferent ? {
                                                        color: "#ef7615",
                                                        lineHeight: 2.5
                                                    } : {
                                                        color: "#000",
                                                        lineHeight: 2.5
                                                    }}>{t('circuit_depot_annonce.autre')}</span>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='my-3 mx-auto' style={{maxWidth: 800}}>
                                            <p className={'text-left'}>{t('circuit_depot_annonce.typeTrans')} <span
                                                style={{color: "red"}}>*</span></p>
                                            <div className='d-flex gap-3 align-items-center justify-content-start'>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isVoiture: !bagages.isVoiture,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="35.965" height="17.26"
                                                         viewBox="0 0 35.965 17.26">
                                                        <g id="car-svgrepo-com_1_" data-name="car-svgrepo-com (1)"
                                                           transform="translate(0 0)">
                                                            <g id="Groupe_3569" data-name="Groupe 3569">
                                                                <path id="Tracé_4987" data-name="Tracé 4987"
                                                                      d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                                      transform="translate(19.229 -6.929)"
                                                                      fill={bagages.isVoiture ? "#ef7615" : "#000"}/>
                                                                <path id="Tracé_4988" data-name="Tracé 4988"
                                                                      d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                                      transform="translate(0 -8.177)"
                                                                      fill={bagages.isVoiture ? "#ef7615" : "#000"}/>
                                                                <path id="Tracé_4989" data-name="Tracé 4989"
                                                                      d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                                      transform="translate(-16.083 -6.929)"
                                                                      fill={bagages.isVoiture ? "#ef7615" : "#000"}/>
                                                            </g>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={bagages.isVoiture ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.voiture')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isCar: !bagages.isCar,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32.58" height="16.883"
                                                         viewBox="0 0 32.58 16.883">
                                                        <g id="bus-svgrepo-com_2_" data-name="bus-svgrepo-com (2)"
                                                           transform="translate(0 -83.368)">
                                                            <g id="Groupe_4744" data-name="Groupe 4744"
                                                               transform="translate(0 83.368)">
                                                                <path id="Tracé_6610" data-name="Tracé 6610"
                                                                      d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                                      transform="translate(0 -83.368)"
                                                                      fill={bagages.isCar ? "#ef7615" : "#000"}/>
                                                            </g>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={bagages.isCar ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.car')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isCamion: !bagages.isCamion,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="33.884" height="17.048"
                                                         viewBox="0 0 33.884 17.048">
                                                        <path id="truck-svgrepo-com_1_" data-name="truck-svgrepo-com (1)"
                                                              d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                              transform="translate(0 -96.384)"
                                                              fill={bagages.isCamion ? "#ef7615" : "#000"}/>
                                                    </svg>

                                                    <br/>
                                                    <span style={bagages.isCamion ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.camion')}</span>
                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isAvion: !bagages.isAvion,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32.625" height="17.048"
                                                         viewBox="0 0 32.625 17.048">
                                                        <g id="XMLID_909_" transform="translate(0 -110.089)">
                                                            <g id="Groupe_4745" data-name="Groupe 4745"
                                                               transform="translate(0 110.089)">
                                                                <path id="Tracé_6611" data-name="Tracé 6611"
                                                                      d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                                      transform="translate(0 -110.089)"
                                                                      fill={bagages.isAvion ? "#ef7615" : "#000"}/>
                                                            </g>
                                                        </g>
                                                    </svg>

                                                    <br/>
                                                    <span style={bagages.isAvion ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.avion')}</span>

                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isTrain: !bagages.isTrain,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21.018" height="18.048"
                                                         viewBox="0 0 21.018 18.048">
                                                        <g id="train-svgrepo-com_2_" data-name="train-svgrepo-com (2)"
                                                           transform="translate(0 -20.392)">
                                                            <path id="Tracé_6612" data-name="Tracé 6612"
                                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                                  fill={bagages.isTrain ? "#ef7615" : "#000"}/>
                                                            <path id="Tracé_6613" data-name="Tracé 6613"
                                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                                  transform="translate(-40.553 -154.141)"
                                                                  fill={bagages.isTrain ? "#ef7615" : "#000"}/>
                                                        </g>
                                                    </svg>


                                                    <br/>
                                                    <span style={bagages.isTrain ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.train')}</span>

                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isBateau: !bagages.isBateau,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24.57" height="20.641"
                                                         viewBox="0 0 24.57 20.641">
                                                        <path id="boat-svgrepo-com"
                                                              d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                              transform="translate(0 -16.99)"
                                                              fill={bagages.isBateau ? "#ef7615" : "#000"}/>
                                                    </svg>

                                                    <br/>
                                                    <span style={bagages.isBateau ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.bateau')}</span>

                                                </div>
                                                <div className="pointer text-center" onClick={() => {
                                                    this.setState(prev => ({
                                                        bagages: {
                                                            ...prev.bagages,
                                                            isIndifferentV: !bagages.isIndifferentV,
                                                        }
                                                    }))
                                                }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15.308" height="26.276"
                                                         viewBox="0 0 15.308 26.276">
                                                        <g id="standing-man-svgrepo-com" transform="translate(-25.906)">
                                                            <g id="Groupe_8941" data-name="Groupe 8941"
                                                               transform="translate(25.906 0)">
                                                                <path id="Tracé_7680" data-name="Tracé 7680"
                                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                      transform="translate(-25.906 -20.81)"
                                                                      fill={bagages.isIndifferentV ? "#ef7615" : "#000"}/>
                                                                <circle id="Ellipse_139" data-name="Ellipse 139" cx="2.719"
                                                                        cy="2.719"
                                                                        r="2.719" transform="translate(4.914)"
                                                                        fill={bagages.isIndifferentV ? "#ef7615" : "#000"}/>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                    <br/>
                                                    <span style={bagages.isIndifferentV ? {
                                                        color: "#ef7615",
                                                        fontSize: 12
                                                    } : {
                                                        color: "#000",
                                                        fontSize: 12
                                                    }}>{t('circuit_depot_annonce.indifferent')}</span>

                                                </div>
                                            </div>
                                        </div>
                                        <div className={'row mx-auto'} style={{maxWidth: 800}}>
                                            <div className={'col-md-9 text-left'}>
                                                <div className={'row text-left'}>
                                                    <div className={'col-md-12 text-left'}>
                                                        <label
                                                            className="requis">{t('circuit_depot_annonce.dimensions')}</label>
                                                    </div>
                                                    <div className={'col-md-4 suffix text-left'}>
                                                        <Input type={"number"} name={"dimensionsLong"} suffix={'Cm'}
                                                               value={bagages.dimensionsLong} min={1}
                                                               placeholder={t('circuit_depot_annonce.dimensionsLong')}
                                                               required
                                                               onChange={this.handleChangeDescBagage}/>

                                                    </div>
                                                    <div className={'col-md-4 suffix text-left'}>
                                                        <Input type={"number"} name={"dimensionsLarg"} suffix={"Cm"}
                                                               value={bagages.dimensionsLarg} min={1}
                                                               placeholder={t('circuit_depot_annonce.dimensionsLarg')}
                                                               required
                                                               onChange={this.handleChangeDescBagage}/>

                                                    </div>
                                                    <div className={'col-md-4 suffix text-left'}>
                                                        <Input type={"number"} name={"dimensionsH"}
                                                               value={bagages.dimensionsH} suffix={"Cm"} min={1}
                                                               placeholder={t('circuit_depot_annonce.dimensionsH')}
                                                               required
                                                               onChange={this.handleChangeDescBagage}/>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className={'col-md-3  text-left'}>
                                                <div className={'row text-left'}>
                                                    <div className={'col-md-12 text-left'}>
                                                        <label
                                                            className="requis">{t('circuit_depot_annonce.poidsMax')}</label>
                                                    </div>
                                                    <div className={'col-md-12 suffix text-left'}>
                                                        <Input type={"number"} name={"dimensionsKg"} min={1}
                                                               suffix={'Kg'}
                                                               value={bagages.dimensionsKg ? bagages.dimensionsKg : 'kg'}
                                                               required
                                                               onChange={this.handleChangeDescBagage}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={"col-12 recapBorderedBlock text-left px-5 py-4 mt-4"}>
                                                <div className={'row'}>
                                                    <div className={'col-md-12'}>
                                                        <p className={'text-left'}>{t('circuit_depot_annonce.listeContenu')}</p>
                                                        <Tags/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        {this.state.statusAnn?null:<div
                                            className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                            <button onClick={() => this.publier(0)}
                                                    className={"btnWhite"}>{t('btns.enregistrer')}</button>
                                        </div>}
                                        <div
                                            className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                            <button onClick={() => {
                                                window.scrollTo(0, 0);
                                                this.setState({etape: etape - 1})
                                            }}
                                                    className="btnDeposer bttn">{t('btns.retour')}</button>

                                            <button disabled={
                                                (bagages.dimensionsLong == '' ||
                                                    bagages.dimensionsLarg == '' ||
                                                    bagages.dimensionsH == '' ||
                                                    bagages.dimensionsKg == '' ||
                                                    !((bagages.isBagage || bagages.isSacDos || bagages.isHorsFormat || bagages.isPetitObj || bagages.isIndifferent || bagages.isChat) &&
                                                        (bagages.isCar || bagages.isVoiture || bagages.isCamion || bagages.isAvion || bagages.isTrain || bagages.isBateau || bagages.isIndifferentV))
                                                ) ? true : false} onClick={() => {

                                                window.scrollTo(0, 0);
                                                this.setState({etape: etape + 1})
                                            }}
                                                    className="btnBlue bttn">{t('btns.suivant')}</button>
                                        </div>

                                    </section>
                                    :
                                    etape == 4 ?
                                        <section className={'depotAnnonce container text-center'}>
                                            <div
                                                className={'etapes d-flex flex-row justify-content-center align-items-center'}>
                                                <span className={'circle'}>1</span>
                                                <span className={'tiretCircle'}/>
                                                <span className={'circle'}>2</span>
                                                <span className={'tiretCircle'}/>
                                                <span className={'circle'}>3</span>
                                                <span className={'tiretCircle'}/>
                                                <span className={'circle'}>4</span>
                                                <span className={'tiretCircle'}/>
                                                <span className={'circleOutline'}>5</span>
                                            </div>
                                            {/* <p className={'text-dark-blue'}>{t('circuit_depot_annonce.photoBagage')}</p>
                                            <LazyLoadImage src={"/images/imgConfierPhotoBagage.png"} className={'my-3'}
                                                           alt={"imgConfierPhotoBagage"}/> */}
                                            <div className='mx-auto' style={{maxWidth: 800}}>
                                                <div className="text-center">
                                                    <label
                                                        className={'requis d-block w-100 text-left'}>{t('circuit_depot_annonce.ajoutPhoto')}
                                                    </label>
                                                    {this.state.mesBagages?.map(bgg=><Checkbox checked={bgg.checked} className={"checkMeInImg"} name={bgg.url} onChange={(e)=>{
                                                        console.log(e)
                                                        this.setState(prev=>({
                                                            mesBagages:prev.mesBagages?.map(item=>
                                                                (item.url === e.target.name ? Object.assign(item, {checked: e.target.checked}) : item),
                                                            )
                                                        }),()=>console.log(this.state.mesBagages))
                                                        if(e.target.checked) {

                                                            let dejaUploaded=false
                                                            this.state.fileList.map(val =>
                                                                (val.url === e.target.name? dejaUploaded=true: null))
                                                            if(!dejaUploaded) {
                                                                this.setState(prevState => ({
                                                                    gellery: [...prevState.gellery, {
                                                                        url: e.target.name
                                                                    }],
                                                                    fileList: [...prevState.fileList, {
                                                                        url: e.target.name
                                                                    }]

                                                                }), () => {
                                                                    this.setState({isUploaded: true})
                                                                    console.log(this.state.fileList)
                                                                })
                                                            }
                                                        }else{
                                                            this.setState(prevState=>({
                                                                gellery: prevState.gellery.filter(val =>
                                                                    (val.url !== e.target.name)),
                                                                fileList: prevState.fileList.filter(val =>
                                                                    (val.url !== e.target.name))
                                                            }))
                                                        }
                                                    }}><LazyLoadImage src={bgg.url} style={{height:150,width:'auto'}}/> </Checkbox>)}
                                                    <div className="clearfix text-md-left text-center mt-3">
                                                        <Upload
                                                            action=""
                                                            listType="picture-card"
                                                            fileList={fileList}
                                                            onPreview={this.handlePreview}
                                                            onChange={this.handleChangePhotosPresentation}
                                                            onDrop={this.handleDropPhotosPresentation}
                                                        >
                                                            {fileList.length >= 10 ? null : uploadButtonPP}
                                                        </Upload>

                                                        <Modal open={previewVisible} footer={null}
                                                               onCancel={this.handleCancel}
                                                               className={'text-center'}>
                                                            <LazyLoadImage alt="example" src={previewImage}/>
                                                        </Modal>
                                                        <p>{t('maxUpload')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.statusAnn?null:<div
                                                className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                                <button disabled={!this.state.isUploaded ? true : false}
                                                        onClick={() => this.publier(0)}
                                                        className={"btnWhite"}>{t('btns.enregistrer')}</button>
                                            </div>}
                                            <div
                                                className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                                <button onClick={() => {
                                                    window.scrollTo(0, 0);
                                                    this.setState({etape: etape - 1})
                                                }}
                                                        className="btnDeposer bttn">{t('btns.retour')}</button>

                                                <button disabled={!fileList.length || !this.state.isUploaded ? true : false}
                                                        onClick={() => {
                                                            window.scrollTo(0, 0);
                                                            this.setState({etape: this.state.etape + 1})
                                                        }}
                                                        className="btnBlue bttn">{t('btns.suivant')}</button>
                                            </div>

                                        </section> :
                                        etape == 5 ?
                                            <section className={'depotAnnonce container text-center'}>
                                                <div
                                                    className={'etapes d-flex flex-row justify-content-center align-items-center'}>
                                                    <span className={'circle'}>1</span>
                                                    <span className={'tiretCircle'}/>
                                                    <span className={'circle'}>2</span>
                                                    <span className={'tiretCircle'}/>
                                                    <span className={'circle'}>3</span>
                                                    <span className={'tiretCircle'}/>
                                                    <span className={'circle'}>4</span>
                                                    <span className={'tiretCircle'}/>
                                                    <span className={'circle'}>5</span>
                                                </div>
                                                <p className={'text-dark-blue'}>{t('circuit_depot_annonce.recapAnn')}</p>

                                                <div className={"recapBorderedBlock"}>
                                                    <div className={"d-flex flex-column flex-lg-row"}>
                                                        <div
                                                            className="d-flex justify-content-between w-100">
                                                            <div className={"col-md-2 text-capitalize"}>
                                                                <svg
                                                                    style={{
                                                                        position: "relative",
                                                                        top: "-18px",
                                                                        left: 0,
                                                                    }}
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="27.515"
                                                                    height="35.661"
                                                                    viewBox="0 0 27.515 35.661"
                                                                >
                                                                    <g
                                                                        id="pin-svgrepo-com_2_"
                                                                        data-name="pin-svgrepo-com (2)"
                                                                        transform="translate(52.386 35.411) rotate(180)"
                                                                    >
                                                                        <g
                                                                            id="Groupe_4899"
                                                                            data-name="Groupe 4899"
                                                                            transform="translate(25.121)"
                                                                        >
                                                                            <g
                                                                                id="Groupe_4898"
                                                                                data-name="Groupe 4898"
                                                                                transform="translate(0)"
                                                                            >
                                                                                <path
                                                                                    id="Tracé_6731"
                                                                                    data-name="Tracé 6731"
                                                                                    d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                                    transform="translate(-25.121)"
                                                                                    fill="#4bbded"
                                                                                    stroke="#4bbded"
                                                                                    strokeWidth="0.5"
                                                                                />
                                                                                <path
                                                                                    id="Tracé_6732"
                                                                                    data-name="Tracé 6732"
                                                                                    d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                                    transform="translate(-68.326 -99.979)"
                                                                                    fill="#4bbded"
                                                                                    stroke="#4bbded"
                                                                                    strokeWidth="0.5"
                                                                                />
                                                                            </g>
                                                                        </g>
                                                                    </g>
                                                                </svg>
                                                                {depart.ville_depart}
                                                                <br/>
                                                                <LazyLoadImage
                                                                    src={
                                                                        "/images/" +
                                                                        depart.placeHolderSelect
                                                                            .toLowerCase()
                                                                            .replace(" ", "") +
                                                                        ".png"
                                                                    }
                                                                    alt={depart.placeHolderSelect}
                                                                />
                                                                <br/>{" "}
                                                                <sup
                                                                    style={{
                                                                        fontSize: "x-small",
                                                                        color: "#b9b9b9",
                                                                    }}
                                                                >
                                                                    {depart.placeHolderSelect}
                                                                </sup>
                                                            </div>

                                                            <div className={'col-6 col-md-8'}>
                                                                <div
                                                                    className={
                                                                        "d-flex flex-md-row flex-column justify-content-center align-items-center gap-2"
                                                                    }
                                                                >
                                                                    {bagages.isVoiture ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="35.965"
                                                                            height="17.26"
                                                                            viewBox="0 0 35.965 17.26"
                                                                        >
                                                                            <g
                                                                                id="car-svgrepo-com_1_"
                                                                                data-name="car-svgrepo-com (1)"
                                                                                transform="translate(0 0)"
                                                                            >
                                                                                <g id="Groupe_3569" data-name="Groupe 3569">
                                                                                    <path
                                                                                        id="Tracé_4987"
                                                                                        data-name="Tracé 4987"
                                                                                        d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                                                        transform="translate(19.229 -6.929)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_4988"
                                                                                        data-name="Tracé 4988"
                                                                                        d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                                                        transform="translate(0 -8.177)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_4989"
                                                                                        data-name="Tracé 4989"
                                                                                        d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                                                        transform="translate(-16.083 -6.929)"
                                                                                    />
                                                                                </g>
                                                                            </g>
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isCar ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="32.58"
                                                                            height="16.883"
                                                                            viewBox="0 0 32.58 16.883"
                                                                        >
                                                                            <g
                                                                                id="bus-svgrepo-com_2_"
                                                                                data-name="bus-svgrepo-com (2)"
                                                                                transform="translate(0 -83.368)"
                                                                            >
                                                                                <g
                                                                                    id="Groupe_4744"
                                                                                    data-name="Groupe 4744"
                                                                                    transform="translate(0 83.368)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_6610"
                                                                                        data-name="Tracé 6610"
                                                                                        d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                                                        transform="translate(0 -83.368)"
                                                                                    />
                                                                                </g>
                                                                            </g>
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isCamion ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="33.884"
                                                                            height="17.048"
                                                                            viewBox="0 0 33.884 17.048"
                                                                        >
                                                                            <path
                                                                                id="truck-svgrepo-com_1_"
                                                                                data-name="truck-svgrepo-com (1)"
                                                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                                                transform="translate(0 -96.384)"
                                                                            />
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isAvion ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="32.625"
                                                                            height="17.048"
                                                                            viewBox="0 0 32.625 17.048"
                                                                        >
                                                                            <g id="XMLID_909_"
                                                                               transform="translate(0 -110.089)">
                                                                                <g
                                                                                    id="Groupe_4745"
                                                                                    data-name="Groupe 4745"
                                                                                    transform="translate(0 110.089)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_6611"
                                                                                        data-name="Tracé 6611"
                                                                                        d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                                                        transform="translate(0 -110.089)"
                                                                                    />
                                                                                </g>
                                                                            </g>
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isTrain ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="21.018"
                                                                            height="18.048"
                                                                            viewBox="0 0 21.018 18.048"
                                                                        >
                                                                            <g
                                                                                id="train-svgrepo-com_2_"
                                                                                data-name="train-svgrepo-com (2)"
                                                                                transform="translate(0 -20.392)"
                                                                            >
                                                                                <path
                                                                                    id="Tracé_6612"
                                                                                    data-name="Tracé 6612"
                                                                                    d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                                                />
                                                                                <path
                                                                                    id="Tracé_6613"
                                                                                    data-name="Tracé 6613"
                                                                                    d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                                                    transform="translate(-40.553 -154.141)"
                                                                                />
                                                                            </g>
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isBateau ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="24.57"
                                                                            height="20.641"
                                                                            viewBox="0 0 24.57 20.641"
                                                                        >
                                                                            <path
                                                                                id="boat-svgrepo-com"
                                                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                                                transform="translate(0 -16.99)"
                                                                            />
                                                                        </svg>
                                                                    ) : null}
                                                                    {bagages.isIndifferentV ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="15.308"
                                                                            height="26.276"
                                                                            viewBox="0 0 15.308 26.276"
                                                                        >
                                                                            <g
                                                                                id="standing-man-svgrepo-com"
                                                                                transform="translate(-25.906)"
                                                                            >
                                                                                <g
                                                                                    id="Groupe_8941"
                                                                                    data-name="Groupe 8941"
                                                                                    transform="translate(25.906 0)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_7680"
                                                                                        data-name="Tracé 7680"
                                                                                        d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                                        transform="translate(-25.906 -20.81)"
                                                                                    />
                                                                                    <circle
                                                                                        id="Ellipse_139"
                                                                                        data-name="Ellipse 139"
                                                                                        cx="2.719"
                                                                                        cy="2.719"
                                                                                        r="2.719"
                                                                                        transform="translate(4.914)"
                                                                                    />
                                                                                </g>
                                                                            </g>
                                                                        </svg>
                                                                    ) : null}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        "d-flex flex-row align-items-center justify-content-center"
                                                                    }
                                                                >
                                                                    <hr
                                                                        style={{
                                                                            minWidth: "80%",
                                                                            borderTop: "3px solid #EF7723",
                                                                        }}
                                                                    />
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="18.571"
                                                                        height="26"
                                                                        viewBox="0 0 18.571 26"
                                                                    >
                                                                        <g
                                                                            id="Polygone_9"
                                                                            data-name="Polygone 9"
                                                                            transform="translate(18.571) rotate(90)"
                                                                            fill="#EF7723"
                                                                        >
                                                                            <path
                                                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                                                stroke="none"
                                                                            />
                                                                            <path
                                                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                                                stroke="none"
                                                                                fill="#EF7723"
                                                                            />
                                                                        </g>
                                                                    </svg>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        "d-flex flex-md-row flex-column justify-content-between"
                                                                    }
                                                                >
                      <span>
                        <LazyLoadImage
                            src={"/images/poids.png"}
                            alt={"poids"}
                        />{" "}
                          <sub>{bagages.dimensionsKg} Kg</sub>
                      </span>
                                                                    <span>
                        {bagages.isBagage ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17.483"
                                className={"mx-1"}
                                height="26.251"
                                viewBox="0 0 17.483 26.251"
                            >
                                <path
                                    id="suitcase-svgrepo-com_1_"
                                    data-name="suitcase-svgrepo-com (1)"
                                    d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                    transform="translate(-17.6 -1.3)"
                                />
                            </svg>
                        ) : null}
                                                                        {bagages.isSacDos ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="22.633"
                                                                                className={"mx-1"}
                                                                                height="24.048"
                                                                                viewBox="0 0 22.633 24.048"
                                                                            >
                                                                                <g
                                                                                    id="backpack-svgrepo-com_1_"
                                                                                    data-name="backpack-svgrepo-com (1)"
                                                                                    transform="translate(-8.735)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_6614"
                                                                                        data-name="Tracé 6614"
                                                                                        d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                                                        transform="translate(0 -155.838)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_6615"
                                                                                        data-name="Tracé 6615"
                                                                                        d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                                                        transform="translate(-232.971 -155.837)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_6616"
                                                                                        data-name="Tracé 6616"
                                                                                        d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                                                        transform="translate(-2.048 -14.56)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_6617"
                                                                                        data-name="Tracé 6617"
                                                                                        d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                                                        transform="translate(-30.854)"
                                                                                    />
                                                                                    <rect
                                                                                        id="Rectangle_5839"
                                                                                        data-name="Rectangle 5839"
                                                                                        width="11.4"
                                                                                        height="4.826"
                                                                                        transform="translate(14.407 16.226)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_6618"
                                                                                        data-name="Tracé 6618"
                                                                                        d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                                                        transform="translate(-34.631 -95.675)"
                                                                                    />
                                                                                    <path
                                                                                        id="Tracé_6619"
                                                                                        data-name="Tracé 6619"
                                                                                        d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                                                        transform="translate(-239.381 -14.561)"
                                                                                    />
                                                                                </g>
                                                                            </svg>
                                                                        ) : null}

                                                                        {bagages.isHorsFormat ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="33.502"
                                                                                className={"mx-1"}
                                                                                height="22.131"
                                                                                viewBox="0 0 33.502 22.131"
                                                                            >
                                                                                <g
                                                                                    id="bike-svgrepo-com"
                                                                                    transform="translate(0.001 -50.317)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_6621"
                                                                                        data-name="Tracé 6621"
                                                                                        d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                                                        transform="translate(0)"
                                                                                    />
                                                                                </g>
                                                                            </svg>
                                                                        ) : null}
                                                                        {bagages.isPetitObj ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="35.79"
                                                                                className={"mx-1"}
                                                                                height="21.048"
                                                                                viewBox="0 0 35.79 21.048"
                                                                            >
                                                                                <g
                                                                                    id="trainers-svgrepo-com"
                                                                                    transform="translate(0 -61.013)"
                                                                                >
                                                                                    <path
                                                                                        id="Tracé_6622"
                                                                                        data-name="Tracé 6622"
                                                                                        d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                                                        transform="translate(0)"
                                                                                    />
                                                                                </g>
                                                                            </svg>
                                                                        ) : null}
                                                                        {bagages.isChat ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="16.371"
                                                                                className={"mx-1"}
                                                                                height="23"
                                                                                viewBox="0 0 16.371 23"
                                                                            >
                                                                                <path
                                                                                    id="cat-svgrepo-com"
                                                                                    d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                                                    transform="translate(-32.398)"
                                                                                />
                                                                            </svg>
                                                                        ) : null}
                                                                        {bagages.isIndifferent ? (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="15.308"
                                                                                className={"mx-1"}
                                                                                height="26.276"
                                                                                viewBox="0 0 15.308 26.276"
                                                                            >
                                                                                <g
                                                                                    id="standing-man-svgrepo-com"
                                                                                    transform="translate(-25.906)"
                                                                                >
                                                                                    <g
                                                                                        id="Groupe_8941"
                                                                                        data-name="Groupe 8941"
                                                                                        transform="translate(25.906 0)"
                                                                                    >
                                                                                        <path
                                                                                            id="Tracé_7680"
                                                                                            data-name="Tracé 7680"
                                                                                            d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                                            transform="translate(-25.906 -20.81)"
                                                                                        />
                                                                                        <circle
                                                                                            id="Ellipse_139"
                                                                                            data-name="Ellipse 139"
                                                                                            cx="2.719"
                                                                                            cy="2.719"
                                                                                            r="2.719"
                                                                                            transform="translate(4.914)"
                                                                                        />
                                                                                    </g>
                                                                                </g>
                                                                            </svg>
                                                                        ) : null}
                                                                        <sub>
                          {bagages.dimensionsLong} x {bagages.dimensionsLarg} x{" "}
                                                                            {bagages.dimensionsH} Cm
                        </sub>
                      </span>
                                                                </div>
                                                            </div>
                                                            <div className={"col-md-2 text-capitalize"}>
                                                                {arrivee.ville_arrivee}
                                                                <svg
                                                                    style={{
                                                                        position: "relative",
                                                                        top: "-18px",
                                                                        right: 0,
                                                                    }}
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="27.515"
                                                                    height="35.661"
                                                                    viewBox="0 0 27.515 35.661"
                                                                >
                                                                    <g
                                                                        id="pin-svgrepo-com_2_"
                                                                        data-name="pin-svgrepo-com (2)"
                                                                        transform="translate(52.386 35.411) rotate(180)"
                                                                    >
                                                                        <g
                                                                            id="Groupe_4899"
                                                                            data-name="Groupe 4899"
                                                                            transform="translate(25.121)"
                                                                        >
                                                                            <g
                                                                                id="Groupe_4898"
                                                                                data-name="Groupe 4898"
                                                                                transform="translate(0)"
                                                                            >
                                                                                <path
                                                                                    id="Tracé_6731"
                                                                                    data-name="Tracé 6731"
                                                                                    d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                                    transform="translate(-25.121)"
                                                                                    fill="#ef7723"
                                                                                    stroke="#ef7723"
                                                                                    strokeWidth="0.5"
                                                                                />
                                                                                <path
                                                                                    id="Tracé_6732"
                                                                                    data-name="Tracé 6732"
                                                                                    d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                                    transform="translate(-68.326 -99.979)"
                                                                                    fill="#ef7723"
                                                                                    stroke="#ef7723"
                                                                                    strokeWidth="0.5"
                                                                                />
                                                                            </g>
                                                                        </g>
                                                                    </g>
                                                                </svg>
                                                                <br/>
                                                                <LazyLoadImage
                                                                    src={
                                                                        "/images/" +
                                                                        arrivee.placeHolderSelect
                                                                            .toLowerCase()
                                                                            .replace(" ", "") +
                                                                        ".png"
                                                                    }
                                                                    alt={arrivee.placeHolderSelect}
                                                                />
                                                                <br/>{" "}
                                                                <sup
                                                                    style={{
                                                                        fontSize: "x-small",
                                                                        color: "#b9b9b9",
                                                                    }}
                                                                >
                                                                    {arrivee.placeHolderSelect}
                                                                </sup>
                                                            </div>
                                                        </div>
                                                        <div className={"col-lg-3"}>
                                                            <p className={"fs-small mb-0 text-left"}>
                                                                {t("circuit_depot_annonce.dateDep")}
                                                                <span className="text-gris float-right">
                        {depart.date}
                      </span>
                                                            </p>
                                                            <p className={"fs-small mb-0 text-left"}>
                                                                {t("circuit_depot_annonce.heureDep")}
                                                                <span className="text-gris float-right">
                        {depart.heure}
                      </span>
                                                            </p>
                                                            <br/>
                                                            <p className={"fs-small mb-0 text-left"}>
                                                                {t("circuit_depot_annonce.dateArr")}
                                                                <span className="text-gris float-right">
                        {arrivee.date}
                      </span>
                                                            </p>
                                                            <p className={"fs-small mb-0 text-left"}>
                                                                {t("circuit_depot_annonce.heureArr")}
                                                                <span className="text-gris float-right">
                        {arrivee.heure}
                      </span>
                                                            </p>
                                                            <br/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"col-12 recapBorderedBlock text-left px-5 py-4 mt-4"}>
                                                    <div className={'row'}>
                                                        <div className={'col-md-12'}>
                                                            <p className={'text-left'}>{t('circuit_depot_annonce.listeContenu')}</p>
                                                            {listeContenu.map(cont =>
                                                                <label className={'bttn m-2'} style={{
                                                                    backgroundColor: '#53BFED',
                                                                    color: 'white',
                                                                    minWidth: 'max-content',
                                                                }}>{cont} </label>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={"recapBorderedBlock text-left px-5 py-4 mt-4"}>
                                                    <p className={'text-left'}>{t('circuit_depot_annonce.galerie')}</p>
                                                    <Upload
                                                        action=""
                                                        listType="picture-card"
                                                        fileList={fileList}
                                                        onPreview={this.handlePreview}
                                                    />
                                                    <Modal open={previewVisible} footer={null}
                                                           onCancel={this.handleCancel}
                                                           className={'text-center'}>
                                                        <LazyLoadImage alt="example" src={previewImage}/>
                                                    </Modal>
                                                </div>
                                                <div
                                                    className='prix w-75 mx-auto my-4 text-blue d-flex flex-row align-items-center justify-content-between p-2 rounded-pill '>
                                                    <div>{t('circuit_depot_annonce.priceTotal')}: <small>{t('circuit_depot_annonce.remunerationPorteurCommissionBagzee')}</small></div>
                                                    <div className={"d-flex flex-row align-items-center"}>
                                                        <button className="btnCircleBleu" onClick={() => {
                                                            this.state.newprice > price ? this.setState({newprice: this.state.newprice - 1}) : null
                                                        }}>-
                                                        </button>
                                                        <span
                                                            className="fs-3 fw-bold">
                                                            {this.state.newprice ? this.state.newprice : price} €</span>
                                                        <button className="btnCircleBleu" onClick={() => {
                                                            this.state.newprice < 99 ? this.setState({newprice: this.state.newprice + 1}) : null
                                                        }}>+
                                                        </button>
                                                    </div>
                                                </div>
                                                {this.state.statusAnn?null:<div
                                                    className='d-flex flex-column flex-md-row gap-2 justify-content-center align-items-center my-5'>
                                                    <button onClick={() => {
                                                        this.setState({canDepose: fileList.length ? true : false}, () => this.publier(0))
                                                    }}
                                                            className={"btnWhite"}>{t('btns.enregistrer')}</button>
                                                </div>}
                                                <div
                                                    className={"d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 my-4"}>
                                                    <button onClick={() => {
                                                        window.scrollTo(0, 0);
                                                        this.setState({etape: etape - 1})
                                                    }}
                                                            className="btnDeposer bttn">{t('btns.retour')}</button>
                                                    <button disabled={!fileList.length ? true : false}
                                                            onClick={() => {
                                                                this.publier(1)
                                                            }}
                                                            className={"btnBlue bttn"}>{t('circuit_depot_annonce.publier')}</button>

                                                </div>
                                                {fileList.length ? null :
                                                    <p className={'text-danger'}>Vous devez remplir tout les champs pour
                                                        publier</p>}
                                            </section> : null

                        }
                        <Footer/>
                    </div>
            )
        }
    }

}

export default withTranslation()(ConfierLieuDepot);