import React, {Component, useContext} from 'react';
import {faEdit, faImage, faPenSquare, faSpinner, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {DatePicker, message, Modal, Select, Tooltip, Upload} from "antd";
import moment from "moment";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";
import {user} from '../../../app';
import Autocomplete from 'react-google-autocomplete'
import {app, auth, db} from "../../../hooks/firebase";
import {
    updatePassword,
    updateProfile,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential
} from "firebase/auth";
import {uploadFile} from "react-s3";
import {InfoCircleOutlined} from "@ant-design/icons";


function beforeUpload(file) {
    console.log(file.type)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!isJpgOrPng) {
        message.error('Vous ne pouvez télécharger que des fichiers JPG/PNG/PDF !');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('L\'image doit être inférieure à 2 Mo !');
    }
    return isJpgOrPng && isLt2M;
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

class Informations extends Component {

    constructor() {
        super();
        this.state = {
            client: {},
            loading: true,
            isEdit: true,
            myAdresse: '',
            password: '',
            oldpassword: '',
            confirmPassword: '',
            mesAdresses: []
        };
        this.onValueChange = this.onValueChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangePwd = this.handleChangePwd.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.onChangePhoto = this.onChangePhoto.bind(this);
    }

    showInfo() {
        if (user) {
            this.setState({client: user.client}, () => {
                axios.post('api/address/list', {token: this.state.client.token}).then(res => {
                    if (res.data.status) {
                        if (this.state.client.isPointRelais && res.data.mesAdresses.length) {
                            this.setState({myAdresse: res.data.mesAdresses[0].name})
                        } else {
                            this.setState({mesAdresses: res.data.mesAdresses})
                        }
                        if (!this.state.client.isPointRelais) {
                            let birdh = this.state.client.birdh
                            if (birdh.split('-')[2].length == 4) {
                                const [dd, mm, yy] = birdh.split('-');
                                let newBirth = yy + '-' + mm + '-' + dd
                                this.setState(prevState => ({
                                    client: {
                                        ...prevState.client,
                                        birdh: newBirth
                                    },
                                }), () => {
                                    this.setState({loading: false})
                                    console.log(this.state.client)
                                });
                            } else {
                                this.setState({loading: false})
                                console.log(this.state.client)
                            }
                        } else {
                            this.setState({loading: false})
                            console.log(this.state.client)
                        }
                    }
                })


            });
        }


    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.showInfo()


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
        }), () => console.log(name, value));
    }

    handleChangePwd(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name == "confirmPassword") {
            if (value != this.state.password) {
                this.setState({isError: true})
            } else {
                this.setState({isError: false})

            }

        }
        this.setState({[name]: value});
        this.setState(prevState => ({
            client: {
                ...prevState.client,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }

    onValueChange(event) {

        this.setState(prevState => ({
            client: {                   // object that we want to update
                ...prevState.client,    // keep all other key-value pairs
                gender: event.target.value       // update the value of specific key
            }
        }))
    }

    onChangePhoto = (e) => {
        console.log(e.file)
        this.setState({loadingPhoto: true}, () => {
            if (e.file.status === 'done') {
                console.log(e.file.originFileObj)
                // Get this url from response in real world.
                this.handleUpload(e.file.originFileObj)

            }
        })


    }
    handleUpload = async (file) => {
        console.log(file)
        var fileExtension = '.' + file.name.split('.')[1];
        var prefix = file.name.split('.')[0];
        var name = prefix.replace(/[^A-Z]/gi, '') + Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
        var newFile = new File([file], name, {type: file.type});
        uploadFile(newFile, config)
            .then(data => {
                console.log(data)

                this.setState(prevState => ({
                    client: {                   // object that we want to update
                        ...prevState.client,    // keep all other key-value pairs
                        photo: data.location       // update the value of specific key
                    }
                }), () => {
                    this.setState({loadingPhoto: false,})
                })

            })
            .catch(err => console.error(err))

    }

    firebaseUpdateM2P = async () => {
        await updatePassword(auth.currentUser, this.state.client.password).then(() => {
            console.log("success")
        }).catch(e => console.log(e))
    }

    fireBaseUpdateDisplayName = async () => {
        await updateProfile(auth.currentUser, {
            displayName: this.state.client.firstName,
        });

    }
    fireBaseUpdateEmail = async () => {
        await updateEmail(auth.currentUser,
            this.state.client.email
        );

    }

    formSubmit(event) {
        event.preventDefault();

        if (!this.state.client.isPointRelais && this.state.client.email != auth.currentUser?.email && this.state.oldpassword == "") {

            const modal = Modal.success({
                content: (
                    <div className={"text-center"}>
                        <FontAwesomeIcon icon={faTimes} fontSize={60}
                                         color={'red'}/>
                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                            {this.props.t('requiredPwd')}
                        </p>

                    </div>),
                okText: 'ok',
            });
            setTimeout(() => {
                modal.destroy();
            }, 5000);
        } else {
            if (!this.state.client.isPointRelais) {
                console.log('this.state.client.email===', this.state.client.email)
                console.log('auth.currentUser.email===', auth.currentUser.email)
                if (this.state.password != "" || (this.state.oldpassword != "" && this.state.client.email != auth.currentUser.email)) {
                    console.log('pasword not null ou email modifier')
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, this.state.oldpassword);
                    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                        console.log("reauthenticateWithCredential ok")
                        if (this.state.password != '') {
                            console.log("password")
                            this.firebaseUpdateM2P()
                        }
                        if (this.state.client.email != auth.currentUser.email) {
                            this.fireBaseUpdateEmail()
                        }
                    }).catch((error) => {
                        console.log(error)
                        Modal.success({
                            content: (
                                <div className={"text-center"} key={'reservation-modal-' + Math.random()}>
                                    <div>
                                        <FontAwesomeIcon icon={faTimes} fontSize={60}
                                                         color={'red'}/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>
                                            {this.props.t('m2p_non_valid')}
                                        </p>
                                    </div>
                                </div>),
                            okText: 'ok',
                        });
                    });
                }

                if (this.state.client.firstName != auth.currentUser.displayName) {
                    this.fireBaseUpdateDisplayName()
                }
            } else {
                if (this.state.nouvelleAdress) {
                    axios.post('api/address/add',
                        {
                            "token": this.state.client.token,
                            "lat": this.state.nouvelleAdress.geometry.location.lat(),
                            "long": this.state.nouvelleAdress.geometry.location.lng(),
                            "name": this.state.nouvelleAdress.formatted_address,
                            "ville": this.state.client.ville,
                        }).then(res => {
                        if (res.data.status) {
                            axios.post('api/address/list', {token: this.state.client.token}).then(res => {
                                if (res.data.status) {
                                    this.setState({
                                        mesAdresses: res.data.mesAdresses,
                                    })
                                }
                            })
                        }
                    })
                }
            }
            axios.post('api/profil/update', this.state.client).then(response => {
                this.setState({isEdit: true});
                if (response.data.status == true) {
                    console.log('ws running')
                    localStorage.setItem('client', JSON.stringify({client: this.state.client}));

                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"}>
                                <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                                <h4 className={" pt-2"}>
                                    {this.props.t('modif_profil')}
                                </h4>
                                <p className={"text-success pt-2"}>
                                    {this.props.t('infos_bien_traite')}
                                </p>
                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                        window.location.reload(false)
                    }, 5000);
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
    }

    render() {
        console.log(auth?.currentUser?.displayName)

        const {t} = this.props;
        const center = {lat: 50.064192, lng: -130.605469};
        // Create a bounding box with sides ~10km away from the center point
        const defaultBounds = {
            north: center.lat + 0.1,
            south: center.lat - 0.1,
            east: center.lng + 0.1,
            west: center.lng - 0.1,
        };
        const uploadButton = (
            <div className={'position-relative'}>
                {this.state.loadingPhoto ? <span className="fa fa-spin fa-spinner fa-2x"/> :
                    <LazyLoadImage src={"/images/avatar-person.png"} alt={"avatar-person"}
                                   style={{width: '60px', borderRadius: '50%'}}/>}
                <sub className={"addPhoto"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                         viewBox="0 0 26.492 26.492">
                        <path id="plus-svgrepo-com"
                              d="M13.246,0A13.246,13.246,0,1,0,26.492,13.246,13.261,13.261,0,0,0,13.246,0Zm6.368,14.265H14.265v5.6a1.019,1.019,0,1,1-2.038,0v-5.6H6.878a1.019,1.019,0,1,1,0-2.038h5.349V7.132a1.019,1.019,0,0,1,2.038,0v5.095h5.349a1.019,1.019,0,1,1,0,2.038Z"
                              fill="#53bfed"/>
                    </svg>
                </sub>
            </div>
        );
        const loading = this.state.loading;

        return (
            <div className={"profil_blocks Information"}>
                <div className={"container py-2 px-4"} style={{border: 'none'}}>

                    {loading ?
                        <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x"/>
                        </p>
                        :
                        <div className={"row"}>
                            <div className={"col-md-3"}>
                                <div className={"row mb-3"}>

                                    <div
                                        className={this.state.isEdit ? "col-md-12 readOnly photo-profil-client" : "col-md-12 photo-profil-client"}>
                                        <Upload
                                            previewFile={this.state.client.photo}
                                            style={{width: '60px', borderRadius: '50%'}}
                                            name="avatar"
                                            listType="picture-card"
                                            className="avatar-uploader d-block text-center"
                                            showUploadList={false}
                                            action=""
                                            beforeUpload={beforeUpload}
                                            onChange={this.onChangePhoto}>
                                            {this.state.client.photo ?
                                                <div className={'position-relative'}>
                                                    <LazyLoadImage src={this.state.client.photo} alt="avatar"
                                                                   style={{width: '100%'}}/>
                                                    <sub className={"addPhoto"}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                             viewBox="0 0 26.492 26.492">
                                                            <path id="plus-svgrepo-com"
                                                                  d="M13.246,0A13.246,13.246,0,1,0,26.492,13.246,13.261,13.261,0,0,0,13.246,0Zm6.368,14.265H14.265v5.6a1.019,1.019,0,1,1-2.038,0v-5.6H6.878a1.019,1.019,0,1,1,0-2.038h5.349V7.132a1.019,1.019,0,0,1,2.038,0v5.095h5.349a1.019,1.019,0,1,1,0,2.038Z"
                                                                  fill="#53bfed"/>
                                                        </svg>
                                                    </sub>
                                                </div> : uploadButton}

                                        </Upload>

                                        <p className={"aide text-center"}> {t('msg_btnEditer')}
                                        </p>

                                    </div>

                                    <div className={"col-md-12"}>
                                        <label className={"w-100 text-center"}>{t('photo_profil')}</label>
                                    </div>
                                    <div className={"col-md-12 text-center"}>
                                        <button className={"edit"} onClick={() => {
                                            this.setState({isEdit: !this.state.isEdit});
                                        }}>
                                            <FontAwesomeIcon icon={faPenSquare}/>
                                            <span className={'pl-3'}>{t('btns.editer')}</span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className={"col-md-9"}>
                                <form onSubmit={this.formSubmit}>
                                    <div className={"row mb-3"}>
                                        <div className={"col-md-12"}>
                                            {!this.state.isEdit ? <textarea rows="4" cols="50" name={"description"}
                                                                            onChange={this.handleChange}
                                                                            className={'fs-small'}>
                                                {this.state.client.description ? this.state.client.description :
                                                    "Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minimveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo consequat."
                                                }</textarea> :
                                                <p className={'fs-small'}>
                                                    {this.state.client.description ? this.state.client.description :  "Lorem ipsum dolor sit amet, consectetur adipiscingelit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minimveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex eacommodo consequat."}</p>}

                                        </div>
                                        {this.state.client.isPointRelais ? null : <div
                                            className={"col-md-12 d-flex flex-column flex-md-row align-items-center"}>
                                            <button className={'btnTransparent text-blue mr-3 mb-3  ml-0'}
                                                    style={{borderColor: '#53BFED'}} onClick={() => {
                                            }}>{t('particuler')}
                                            </button>
                                            <a href={`/mes-avis-${this.state.client.firstName.replace(/[^a-zA-Z0-9 ]/g, '').replace(" ", "")}-${this.state.client.id}`}
                                               className={'btnTransparent mr-3 mb-3 ml-0'}
                                               style={{
                                                   borderColor: '#B5B5B5',
                                                   color: '#B5B5B5'
                                               }}>{t('mon_profil_public')}
                                            </a>
                                        </div>}
                                    </div>
                                    {this.state.client.nomEntreprise && this.state.client.numSiret ?
                                        <div className={"row mb-3"}>
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className="requis">{this.state.client.isPointRelais ? t('nomCommerce') : t('nomEntreprise')}</label>
                                                <br/>
                                                <input type={"text"} name={"nomEntreprise"}
                                                       value={this.state.client.nomEntreprise}
                                                       className={'mb-2'}
                                                       required
                                                       placeholder={t('nomEntreprise')} onChange={this.handleChange}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className="requis"
                                                >{t('numSiret')}</label>
                                                <br/>
                                                <input type={"text"} name={"numSiret"}
                                                       value={this.state.client.numSiret}
                                                       className={'mb-2'}
                                                       required
                                                       placeholder={t('numSiret')} onChange={this.handleChange}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                        </div> : null}
                                    {this.state.client.isPointRelais ? null :
                                        <div className={"row mb-3"}>
                                            <div className={"col-md-3"}>
                                                <label
                                                    className="requis"
                                                >{t('je_suis_un')} </label>
                                            </div>
                                            <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                                <div className={"d-inline-block mr-4"}>
                                                    <input id={"Mme"} type={"radio"} value={"Mme"}
                                                           checked={this.state.client.gender === "Mme"}
                                                           onChange={this.onValueChange}/>
                                                    <label htmlFor={"Mme"} style={{paddingLeft: 7}}>{t('femme')}</label>
                                                </div>
                                                <div className={"d-inline-block mr-4"}>
                                                    <input id={"Mr"} type={"radio"} value={"Mr"}
                                                           checked={this.state.client.gender === "Mr"}
                                                           onChange={this.onValueChange}/>
                                                    <label htmlFor={"Mr"} style={{paddingLeft: 7}}>{t('homme')}</label>
                                                </div>
                                                <div className={"d-inline-block mr-4"}>
                                                    <input id={"Mr"} type={"radio"} value={"Mr"}
                                                           checked={this.state.client.gender === "Neutre"}
                                                           onChange={this.onValueChange}/>
                                                    <label htmlFor={"Mr"}
                                                           style={{paddingLeft: 7}}>{t('ne_pas_precise')}</label>
                                                </div>
                                                <p className={"aide"}>
                                                    {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                        </div>}
                                    <div className={"row mb-3"}>
                                        <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                            <label className="requis">{t('nom')}</label>
                                            <br/>
                                            <input type={"text"} name={"lastName"} value={this.state.client.lastName}
                                                   className={'mb-2'}
                                                   required
                                                   placeholder={t('nom')} onChange={this.handleChange}/>
                                            <p className={"aide"}> {t('msg_btnEditer')}
                                            </p>
                                        </div>
                                        <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                            <label
                                                className="requis"
                                            >{t('prenom')}</label>
                                            <br/>
                                            <input type={"text"} name={"firstName"} value={this.state.client.firstName}
                                                   className={'mb-2'}
                                                   required
                                                   placeholder={t('prenom')} onChange={this.handleChange}/>
                                            <p className={"aide"}> {t('msg_btnEditer')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={"row mb-3"}>
                                        {this.state.client.isPointRelais ? null :
                                            <div
                                                className={this.state.isEdit ? "col-lg-6 mb-3 readOnly" : "col-lg-6 mb-3"}>
                                                <label
                                                    className="requis"
                                                >{t('date_naiss')}</label>
                                                <br/>
                                                <input type={"date"} name={"birdh"} value={this.state.client.birdh}
                                                       required
                                                       max={moment('2004-01-01').format("YYYY-MM-DD")}
                                                       onChange={this.handleChange}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                        }
                                        <div className={this.state.isEdit ? "col-lg-6 mb-3 readOnly" : "col-lg-6 mb-3"}>
                                            <label
                                                className="requis"
                                            >{t('num_tel')}</label>
                                            <br/>
                                            <input type={"tel"} minLength={10} maxLength={10} placeholder={'0600000000'}
                                                   required className={'mb-2'} onChange={this.handleChange}
                                                   name={"phone"} value={this.state.client.phone}/>
                                        </div>

                                        {this.state.client.isPointRelais ? null :
                                            <div
                                                className={this.state.isEdit ? "col-lg-6 mb-3 readOnly" : "col-lg-6 mb-3"}>
                                                <label
                                                    className="requis"
                                                >{t('nationalite')}</label>
                                                <br/>
                                                <select name="nationalite" onChange={this.handleChange}
                                                        className={"mt-0"}
                                                        value={this.state.client.nationalite ? this.state.client.nationalite : ''}
                                                        required>
                                                    <option key={'nationalite-' + Math.random()} value="" selected
                                                            disabled>--Selectionner une nationnalité--
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="France">France
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Afghanistan">Afghanistan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Afrique_Centrale">Afrique_Centrale
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Afrique_du_sud">Afrique_du_Sud
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Albanie">Albanie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Algerie">Algerie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Allemagne">Allemagne
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Andorre">Andorre
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Angola">Angola
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Anguilla">Anguilla
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Arabie_Saoudite">Arabie_Saoudite
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Argentine">Argentine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Armenie">Armenie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Australie">Australie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Autriche">Autriche
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Azerbaidjan">Azerbaidjan
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Bahamas">Bahamas
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Bangladesh">Bangladesh
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Barbade">Barbade
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Bahrein">Bahrein
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Belgique">Belgique
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Belize">Belize
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Benin">Benin
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Bermudes">Bermudes
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Bielorussie">Bielorussie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Bolivie">Bolivie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Botswana">Botswana
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Bhoutan">Bhoutan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Boznie_Herzegovine">Boznie_Herzegovine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Bresil">Bresil
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Brunei">Brunei
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Bulgarie">Bulgarie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Burkina_Faso">Burkina_Faso
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Burundi">Burundi
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Caiman">Caiman
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Cambodge">Cambodge
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Cameroun">Cameroun
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Canada">Canada
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Canaries">Canaries
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Cap_vert">Cap_Vert
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Chili">Chili
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Chine">Chine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Chypre">Chypre
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Colombie">Colombie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Comores">Colombie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Congo">Congo
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Congo_democratique">Congo_democratique
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Cook">Cook
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Coree_du_Nord">Coree_du_Nord
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Coree_du_Sud">Coree_du_Sud
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Costa_Rica">Costa_Rica
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Cote_d_Ivoire">Côte_d_Ivoire
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Croatie">Croatie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Cuba">Cuba
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Danemark">Danemark
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Djibouti">Djibouti
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Dominique">Dominique
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Egypte">Egypte
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Emirats_Arabes_Unis">Emirats_Arabes_Unis
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Equateur">Equateur
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Erythree">Erythree
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Espagne">Espagne
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Estonie">Estonie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Etats_Unis">Etats_Unis
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Ethiopie">Ethiopie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Falkland">Falkland
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Feroe">Feroe
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Fidji">Fidji
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Finlande">Finlande
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="France">France
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Gabon">Gabon
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Gambie">Gambie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Georgie">Georgie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Ghana">Ghana
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Gibraltar">Gibraltar
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Grece">Grece
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Grenade">Grenade
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Groenland">Groenland
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guadeloupe">Guadeloupe
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Guam">Guam
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guatemala">Guatemala
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guernesey">Guernesey
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Guinee">Guinee
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guinee_Bissau">Guinee_Bissau
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guinee equatoriale">Guinee_Equatoriale
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Guyana">Guyana
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Guyane_Francaise ">Guyane_Francaise
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Haiti">Haiti
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Hawaii">Hawaii
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Honduras">Honduras
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Hong_Kong">Hong_Kong
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Hongrie">Hongrie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Inde">Inde
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Indonesie">Indonesie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Iran">Iran
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Iraq">Iraq
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Irlande">Irlande
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Islande">Islande
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Israel">Israel
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Italie">italie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Jamaique">Jamaique
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Jan Mayen">Jan
                                                        Mayen
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Japon">Japon
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Jersey">Jersey
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Jordanie">Jordanie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Kazakhstan">Kazakhstan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Kenya">Kenya
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Kirghizstan">Kirghizistan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Kiribati">Kiribati
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Koweit">Koweit
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Laos">Laos
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Lesotho">Lesotho
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Lettonie">Lettonie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Liban">Liban
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Liberia">Liberia
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Liechtenstein">Liechtenstein
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Lituanie">Lituanie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Luxembourg">Luxembourg
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Lybie">Lybie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Macao">Macao
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Macedoine">Macedoine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Madagascar">Madagascar
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Madère">Madère
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Malaisie">Malaisie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Malawi">Malawi
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Maldives">Maldives
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Mali">Mali
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Malte">Malte
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Man">Man
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Mariannes du Nord">Mariannes du Nord
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Maroc">Maroc
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Marshall">Marshall
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Martinique">Martinique
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Maurice">Maurice
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Mauritanie">Mauritanie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Mayotte">Mayotte
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Mexique">Mexique
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Micronesie">Micronesie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Midway">Midway
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Moldavie">Moldavie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Monaco">Monaco
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Mongolie">Mongolie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Montserrat">Montserrat
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Mozambique">Mozambique
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Namibie">Namibie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Nauru">Nauru
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Nepal">Nepal
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Nicaragua">Nicaragua
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Niger">Niger
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Nigeria">Nigeria
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Niue">Niue
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Norfolk">Norfolk
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Norvege">Norvege
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Nouvelle_Caledonie">Nouvelle_Caledonie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Nouvelle_Zelande">Nouvelle_Zelande
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Oman">Oman
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Ouganda">Ouganda
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Ouzbekistan">Ouzbekistan
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Pakistan">Pakistan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Palau">Palau
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Palestine">Palestine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Panama">Panama
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Papouasie_Nouvelle_Guinee">Papouasie_Nouvelle_Guinee
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Paraguay">Paraguay
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Pays_Bas">Pays_Bas
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Perou">Perou
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Philippines">Philippines
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Pologne">Pologne
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Polynesie">Polynesie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Porto_Rico">Porto_Rico
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Portugal">Portugal
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Qatar">Qatar
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Republique_Dominicaine">Republique_Dominicaine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Republique_Tcheque">Republique_Tcheque
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Reunion">Reunion
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Roumanie">Roumanie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Royaume_Uni">Royaume_Uni
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Russie">Russie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Rwanda">Rwanda
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Sahara Occidental">Sahara Occidental
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Sainte_Lucie">Sainte_Lucie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Saint_Marin">Saint_Marin
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Salomon">Salomon
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Salvador">Salvador
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Samoa_Occidentales">Samoa_Occidentales
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Samoa_Americaine">Samoa_Americaine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Sao_Tome_et_Principe">Sao_Tome_et_Principe
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Senegal">Senegal
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Seychelles">Seychelles
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Sierra Leone">Sierra
                                                        Leone
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Singapour">Singapour
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Slovaquie">Slovaquie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Slovenie">Slovenie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Somalie">Somalie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Soudan">Soudan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Sri_Lanka">Sri_Lanka
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Suede">Suede
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Suisse">Suisse
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Surinam">Surinam
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Swaziland">Swaziland
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Syrie">Syrie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Tadjikistan">Tadjikistan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Taiwan">Taiwan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Tonga">Tonga
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Tanzanie">Tanzanie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Tchad">Tchad
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Thailande">Thailande
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Tibet">Tibet
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Timor_Oriental">Timor_Oriental
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Togo">Togo
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Trinite_et_Tobago">Trinite_et_Tobago
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Tristan da cunha">Tristan de cuncha
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Tunisie">Tunisie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Turkmenistan">Turmenistan
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Turquie">Turquie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Ukraine">Ukraine
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Uruguay">Uruguay
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Vanuatu">Vanuatu
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Vatican">Vatican
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Venezuela">Venezuela
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Vierges_Americaines">Vierges_Americaines
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Vierges_Britanniques">Vierges_Britanniques
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()} value="Vietnam">Vietnam
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Wake">Wake
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Wallis et Futuma">Wallis et Futuma
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Yemen">Yemen
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Yougoslavie">Yougoslavie
                                                    </option>

                                                    <option key={'nationalite-' + Math.random()} value="Zambie">Zambie
                                                    </option>
                                                    <option key={'nationalite-' + Math.random()}
                                                            value="Zimbabwe">Zimbabwe
                                                    </option>

                                                </select>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>}
                                        <div className={this.state.isEdit ? "col-lg-6 mb-3 readOnly" : "col-lg-6 mb-3"}>
                                            <label
                                                className="requis"
                                            >{t('email')}</label>
                                            <br/>
                                            <input type={"email"} name={"email"} onChange={this.handleChange}
                                                   required value={this.state.client.email}
                                                   className={'mb-2'}
                                                   placeholder={"Email*"}/>
                                        </div>

                                    </div>

                                    {this.state.client.isPointRelais ? null :
                                        <div className={"row mb-3"}>
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className={this.state.password !== '' && "requis"}
                                                >{t('mot_de_passe')}</label>
                                                <br/>
                                                <input name={'oldpassword'} type={'password'} className={'mb-2'}
                                                       pattern={'.{6,}'}
                                                       onChange={this.handleChangePwd}
                                                       value={this.state.oldpassword}
                                                       placeholder={t('votre_mot_de_passe')}
                                                       required={this.state.password == '' ? false : true}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className={this.state.password !== '' && "requis"}
                                                >{t('nv_mot_de_passe')} <span>
                                    <Tooltip
                                        title="Mot de passe doit être à 6 caractéres au minimum avec un lettre majuscule, un chiffre et un caractère spécial"><InfoCircleOutlined/></Tooltip>
                                </span></label>
                                                <br/>
                                                <input name={'password'} type={'password'} className={'mb-2'}
                                                       pattern={'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'}
                                                       onChange={this.handleChangePwd}
                                                       value={this.state.password}
                                                       placeholder={t('votre_mot_de_passe')}
                                                       required={this.state.password == '' ? false : true}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div>
                                        </div>}
                                    <div className={"row mb-3"}>
                                        {this.state.client.isPointRelais ?
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className='requis'
                                                >{t('ville')}</label>
                                                <br/>
                                                <input type={"text"} name={"ville"} value={this.state.client.ville}
                                                       className={'mb-2'}
                                                       required
                                                       placeholder={t('ville')} onChange={this.handleChange}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                            </div> :
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label
                                                    className={this.state.password !== '' && "requis"}
                                                >{t('confirmation')}* <span>
                                    <Tooltip
                                        title="Mot de passe doit être à 6 caractéres au minimum avec une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"><InfoCircleOutlined/></Tooltip>
                                </span></label>
                                                <br/>
                                                <input name={'confirmPassword'} type={'password'}
                                                       pattern={'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$'}
                                                       onChange={this.handleChangePwd}
                                                       value={this.state.confirmPassword}
                                                       placeholder={t('confirmation2')}
                                                       required={this.state.password == '' ? false : true}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                                {this.state.isError ?
                                                    <p className={'text-danger'}>Les deux mot de passe ne sont pas
                                                        identiques</p> : null}
                                            </div>}
                                        {!this.state.client.isPointRelais ? null :
                                            <div className={this.state.isEdit ? "col-lg-6 readOnly" : "col-lg-6"}>
                                                <label>{t('adresse')}* </label>
                                                <br/>

                                                <Autocomplete bounds={defaultBounds}
                                                              style={{margin: "0 auto"}}
                                                              value={this.state.myAdresse}
                                                              onChange={(e) => this.setState({myAdresse: e.target.value})}
                                                              options={{
                                                                  types: ["geocode", "establishment"],
                                                                  strictBounds: true,
                                                                  componentRestrictions: {country: "fr"},
                                                              }}
                                                              apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                              onPlaceSelected={(place) => {
                                                                  place.address_components.map(res => res.types[0] == 'locality' ?
                                                                      this.setState({
                                                                          nouvelleAdress: place,
                                                                          myAdresse: place.formatted_address,
                                                                          ville: res.long_name,
                                                                      }) : null)
                                                              }}/>
                                                <p className={"aide"}> {t('msg_btnEditer')}
                                                </p>
                                                {this.state.isError ?
                                                    <p className={'text-danger'}>Les deux mot de passe ne sont pas
                                                        identiques</p> : null}
                                            </div>}
                                    </div>
                                    <div className={"row mb-3"}>
                                        <div className={"col-md-12 text-center"}>
                                            {(this.state.isEdit === false) ?
                                                <button className="btnBlue" type="submit"
                                                        disabled={this.state.isError ? true : false}>
                                                    {t('btns.enregistrer')}
                                                </button> : null}
                                        </div>
                                    </div>

                                </form>
                                {this.state.client.isPointRelais ? null : <div className={"row mb-3"}>
                                    <div className={"col-md-12"}>
                                        <label
                                        >{t('mesAdresses')} </label>
                                    </div>
                                    <div className={"col-md-12 py-3"}>
                                        {this.state.mesAdresses.length ? this.state.mesAdresses.map(adr => <p
                                            className={'mb-3'}><LazyLoadImage src={'/images/pinArrive.png'}
                                                                              height={'25px'} style={{marginRight: 7}}
                                                                              alt={'pinArrive'}/>{adr.name}
                                            <LazyLoadImage className={"pointer"} src={'/images/trash.png'}
                                                           height={'25px'}
                                                           style={{float: 'right'}} onClick={() => {
                                                axios.post('api/address/delete', {
                                                    token: this.state.client.token,
                                                    id: adr.id
                                                }).then(res => {
                                                    if (res.data.status) {
                                                        axios.post('api/address/list', {token: this.state.client.token}).then(res => {
                                                            if (res.data.status) {
                                                                this.setState({mesAdresses: res.data.mesAdresses})
                                                            }
                                                        })
                                                    }
                                                })
                                            }}
                                                           alt={'trash'}/></p>) : "nous n'avez pas encore des adresses"}
                                    </div>
                                </div>}
                                {this.state.client.isPointRelais ? null : <div className={"row mb-3"}>
                                    <div className={"col-md-12"}>
                                        <label
                                        >{t('addNewAdress')} </label>
                                    </div>
                                    <div className={"col-md-8"}>
                                        <Autocomplete bounds={defaultBounds} style={{margin: "10px auto"}}
                                                      value={this.state.myAdresse}
                                                      onChange={(e) => this.setState({myAdresse: e.target.value})}
                                                      options={{
                                                          types: ["geocode", "establishment"],
                                                          strictBounds: true,
                                                          componentRestrictions: {country: "fr"},
                                                      }}
                                                      apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                                                      onPlaceSelected={(place) => {
                                                          place.address_components.map(res => res.types[0] == 'locality' ?
                                                              this.setState({
                                                                  nouvelleAdress: place,
                                                                  myAdresse: place.formatted_address,
                                                                  ville: res.long_name,
                                                              }) : null)
                                                      }}/>
                                    </div>
                                    <div className={"col-md-4"}>
                                        <button className="btnBlue" onClick={() => {
                                            axios.post('api/address/add',
                                                {
                                                    "token": this.state.client.token,
                                                    "lat": this.state.nouvelleAdress.geometry.location.lat(),
                                                    "long": this.state.nouvelleAdress.geometry.location.lng(),
                                                    "name": this.state.nouvelleAdress.formatted_address,
                                                    "ville": this.state.ville,
                                                }).then(res => {
                                                if (res.data.status) {
                                                    axios.post('api/address/list', {token: this.state.client.token}).then(res => {
                                                        if (res.data.status) {
                                                            this.setState({
                                                                mesAdresses: res.data.mesAdresses,
                                                                myAdresse: '',
                                                                ville: '',
                                                                nouvelleAdress: {}
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }}
                                                disabled={this.state.nouvelleAdress ? false : true}>
                                            {t('btns.enregistrer')}
                                        </button>
                                    </div>
                                </div>}

                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default withTranslation()(Informations);
