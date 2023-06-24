import React, {Component} from 'react';
import {Upload, message, Modal} from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faSpinner,faTimes} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Redirect} from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function getBase64PP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Vous ne pouvez télécharger que des fichiers JPG/PNG !');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('L\'image doit être inférieure à 2 Mo !');
    }
    return isJpgOrPng && isLt2M;
}

class Brand extends Component {
    constructor() {
        super();
        this.state = {

            loading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],

            photos:
                {
                    bg_photo: "",
                    logo: "",
                    gellery: [
                        {
                            id: "",
                            photo: ""
                        }
                    ]
                }
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('partenaire'));
        this.setState({partenaire: user.partenaire}, () => {
            let partenaire = this.state.partenaire
            axios.get('api/centre/get?token=' + partenaire.token).then(res => {
                this.setState({
                    id_centre: res.data.centres[0].id,
                    loading: false
                }, () => {

                    if (this.state.id_centre != "") {
                       
                        axios.get('api/centre/photo/list?id=' + partenaire.id).then(res => {
                            console.log(res.data.photos)
                            if (res.data.photos.gellery.length > 0) {
                                this.setState({photos: res.data.photos, fileList: res.data.photos.gellery})

                            } else {
                                this.setState({photos: res.data.photos})
                            }
                        })
                    } else {
                        this.setState({
                            redirect: true
                        });
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"} key={'horaire' + Math.random()}>
                                    <div>
                                        <FontAwesomeIcon icon={faTimes}/>
                                        <br/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez configurer votre
                                            vitrine.
                                        </p>
                                    </div>

                                </div>),
                            okText: 'ok',
                        });
                        setTimeout(() => {
                            modal.destroy();
                        }, 5000);
                    }

                });
            })

        })

    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl => {
                    axios.post('api/photo/create', {image: imageUrl}).then(res => {
                        this.setState(prevState => ({
                            loading: false,
                            photos: {
                                ...prevState.photos,
                                logo: res.data.file
                            }

                        }))
                    })

                }
            );
        }
    };
    handleChangeCouverture = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrlC => {
                    axios.post('api/photo/create', {image: imageUrlC}).then(res => {
                        this.setState(prev => ({
                            loading: false,
                            photos: {
                                ...prev.photos,
                                bg_photo: res.data.file
                            }

                        }))
                    })


                }
            );
        }
    };
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
    handleChangePhotosPresentation = ({fileList}) => {
        let gall = [];
        this.setState({loading: true});
        let lengthFileList = fileList.length-1
        //console.log('length filelist'+lengthFileList)
        Array.from(fileList, (option, key) => {
            if (option.url) {
                gall.push({photo: option.url})
            } else if(option.status == 'done' ) {
                console.log('done ')

                getBase64(option.originFileObj, imageUrl =>
                    axios.post('api/photo/create', {image: imageUrl}).then(res => {
                        gall.push({"photo": res.data.file})
                        console.log('base64 api/photo/create ok' + JSON.stringify(res.data.file))
                    }))
            }
        })

        this.setState(prev => ({
                photos: {
                    ...prev.photos,
                    gellery: gall
                }
            }
        ), () => {
            this.setState(({fileList, loading: false}))
        });
    }
    formSubmit = () => {
        let partenaire = this.state.partenaire
        let config = {headers: {'content-type': 'multipart/form-data'}}
        axios.put('api/centre/photo/update?token=' + partenaire.token, {
            photos: this.state.photos,
            fileList: this.state.fileList
        }, config).then(function (response) {

            if (response.data.status == true) {
                const modal = Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <h4 className={" pt-2"}>
                                Modification Photos
                            </h4>
                            <p className={"text-success pt-2"}>
                                Vos photos ont été mises à jour
                            </p>

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {
        const uploadButton = (
            <div>
                <FontAwesomeIcon icon={this.state.loading ? faSpinner : faImage}/>
                <div className="ant-upload-text">
                    Ajouter votre logo
                    <br/>
                    <small style={{position: 'absolute', bottom: '10px', right: '50px', color: '#B7B7B7'}}>235*235
                        png/jpg
                    </small>
                </div>
            </div>
        );
        const uploadButtonCouverture = (
            <div>
                <FontAwesomeIcon icon={this.state.loading ? faSpinner : faImage}/>
                <div className="ant-upload-text">
                    Ajouter une image de couverture
                    <br/>
                    <small style={{position: 'absolute', bottom: '10px', right: '50px', color: '#B7B7B7'}}>815*315
                        png/jpg
                    </small>
                </div>
            </div>
        );
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButtonPP = (
            <div>
                <FontAwesomeIcon icon={faImage}/>
                <div className="ant-upload-text">Ajouter des
                    photos
                    <br/>
                    <small>{fileList.length} photos</small>
                </div>
            </div>
        );
        const {logo, bg_photo} = this.state.photos;
        if (this.state.redirect) 
          return <Redirect to='/info-vitrine'/>
           else return (
            <div className={"Brand mw-100"}>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {/* brand {partenaire.email}*/}
                        <label className={'d-block w-100 text-left'}>Ajouter mon logo</label>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader d-block"
                            showUploadList={false}
                            action=""
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}

                        >
                            {logo ? <LazyLoadImage src={logo} alt="avatar" style={{width: '100%'}}/> : uploadButton}
                        </Upload>

                    </div>
                    <div className="col-md-12 text-center mt-5">
                        {/* brand {partenaire.email}*/}
                        <label className={'d-block w-100 text-left'}>Ajouter une image de couverture</label>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader d-block couverture"
                            showUploadList={false}
                            action=""
                            beforeUpload={beforeUpload}
                            onChange={this.handleChangeCouverture}

                        >
                            {bg_photo ?
                                <LazyLoadImage src={bg_photo} alt="avatar" style={{width: '100%'}}/> : uploadButtonCouverture}
                        </Upload>

                    </div>
                    <div className="col-md-12 text-center mt-5">
                        {/* brand {partenaire.email}*/}
                        <label className={'d-block w-100 text-left'}>Ajouter des photos de présentation du lieu :
                            <b>(Vous
                                pouvez ajouter jusqu'à 10 images)
                            </b>
                        </label>
                        <div className="clearfix text-md-left text-center">
                            <Upload
                                action=""
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={this.handlePreview}
                                onChange={this.handleChangePhotosPresentation}
                            >
                                {fileList.length >= 10 ? null : uploadButtonPP}
                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}
                                   className={'text-center'}>
                                <LazyLoadImage alt="example" src={previewImage}/>
                            </Modal>
                        </div>
                    </div>
                    <div className={"col-md-12 text-md-left text-center mt-5"}>
                        <button className={this.state.loading ? "btn-blue disabled" : "btn-blue"}
                                onClick={this.formSubmit}>
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Brand;