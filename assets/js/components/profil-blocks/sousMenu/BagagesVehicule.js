import React, {Component} from 'react';
import {Button, message, Modal, Upload} from 'antd';
import axios from "axios";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faImage, faPlusCircle, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {withTranslation} from "react-i18next";
import {uploadFile} from "react-s3";
import {user} from '../../../app'


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

class BagagesVehicule extends Component {

    constructor() {
        super();
        this.state = {
            fileList_bagages: [],
            fileList_vehicule: {url: ''},
            nom_vehicule: '',
            bagage: [],
            vehicule: [],
            addNewVehicule: {},
            addNewBagages: {},

            loading: true,
            loadingV: false,
            loadingB: false


        };
        this.submit_vehicule = this.submit_vehicule.bind(this);
        this.onChangeBagages = this.onChangeBagages.bind(this);
        this.onChangeVehicule = this.onChangeVehicule.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (user)
            this.state.token = user.client.token

        axios.post('api/profil/photo/list', {token: this.state.token}).then(res => {
            this.setState({bagage: res.data.tabGallery, fileList_bagages: res.data.tabGallery},()=>{
                axios.post('api/vehicule/list', {token: this.state.token}).then(res => {
                    if(res.data.status)
                        this.setState({
                            vehicule: res.data.vehicules,
                            fileList_vehicule: res.data.vehicules,
                            nom_vehicule: res.data.vehicules.nom_vehicule
                        },()=>{
                            this.setState({loading:false})
                        })
                })
            })
        })

    }


    bagagesAdd(addNewBagages) {
        this.setState(prevState => ({
            bagage: [...prevState.bagage, addNewBagages]
        }), () => {
            console.log(this.state.bagage)
            let that=this
            axios.post('api/profil/photo/add', addNewBagages).then((res) => {
                if (res.data.status) {
                    Modal.success({
                        content: (
                            <div className={"text-center"} key={'ops' + Math.random()}>
                                <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                                <p className={"text-success py-4"}>
                                    {res.data.message}
                                </p>

                            </div>),
                        okText: 'ok',
                        onOk(){
                            that.setState({loading:true},()=>{
                                axios.post('api/profil/photo/list', {token: that.state.token}).then(res => {
                                    that.setState({bagage: res.data.tabGallery, fileList_bagages: res.data.tabGallery},()=>{
                                        that.setState({loading:false})
                                    })
                                })
                            })


                        }
                    })
                }
            })
        })

    }

    submit_vehicule = () => {
        console.log(this.state.fileList_vehicule)
        axios.post('api/vehicule/create', {
            uid: this.state.fileList_vehicule.uid,
            photo: this.state.fileList_vehicule.photo,
            url: this.state.fileList_vehicule.url,
            name: this.state.fileList_vehicule.name,
            nom_vehicule: this.state.nom_vehicule,
            token: this.state.token
        }).then((res) => {
            if (res.data.status) {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'ops' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>
                            <p className={"text-success  py-4"}>
                                {res.data.message}
                            </p>

                        </div>),
                    okText: 'ok',
                })
            }
        })

    }
    handleUpload = async (myState, file) => {
        console.log(file)
        var fileExtension = '.' + file.name.split('.')[1];
        var prefix = file.name.split('.')[0];
        var name = prefix.replace(/[^A-Z]/gi, '') + Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
        var newFile = new File([file], name, {type: file.type});
        uploadFile(newFile, config)
            .then(data => {
                if (myState == 'addNewVehicule') {
                    this.setState({
                        fileList_vehicule: {
                            uid: data.uid,
                            photo: data.location,
                            url: data.location,
                            name: name,
                        }
                    },()=>{
                      console.log(this.state.fileList_vehicule)
                    })
                } else
                    //  while (this.state.bagage.length <= key) {
                    this.bagagesAdd({
                        uid: data.uid,
                        photo: data.location,
                        url: data.location,
                        name: name,
                        token: this.state.token
                    })
                //}


            })
            .catch(err => console.error(err))

    }
    onChangeBagages = (e) => {

        console.log(e.file)
        let gall = [];
        this.setState({loadingB: true});
        if (e.file.name && e.file.status == 'done') {
            console.log(e.file.originFileObj)
            this.handleUpload(
                'addNewBagages', e.file.originFileObj)
        }

        this.setState(({fileList_bagages: e.fileList, loadingB: false}))

    }
    onChangeVehicule = (e) => {

        console.log(e.file)
        this.setState({loadingV: true});
        if (e.file.status == 'done') {
            console.log(e.file.originFileObj)
            this.handleUpload(
                'addNewVehicule', e.file.originFileObj)
        }

    }
    handleCancel = () => {
        this.setState({previewVisible: false})
    };

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64PP(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    removeBagage(e) {
        console.log(e)

        axios.get(`api/profil/photo/delete?token=` + this.state.token + `&uid=` + e.uid).then(res => {
            const modal = Modal.success({
                content: (
                    <div className={"text-center"}
                         key={'delete-' + Math.random()}>
                        <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}
                                       width={'65px'}/>

                        <p className={"text-success pt-2"}>
                            {res.data.message}
                        </p>

                    </div>),
                okText: 'ok',
            });
        })
    }

    removeVehicule(e) {
        console.log(e)

        axios.get(`api/vehicule/delete?token=` + this.state.token + `&uid=` + e.uid).then(res => {
            const modal = Modal.success({
                content: (
                    <div className={"text-center"}
                         key={'delete-' + Math.random()}>
                        <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}
                                       width={'65px'}/>

                        <p className={"text-success pt-2"}>
                            {res.data.message}
                        </p>

                    </div>),
                okText: 'ok',
            });
        })
    }

    render() {
        const {t} = this.props;
        const {previewVisible, previewImage, fileList_bagages, fileList_vehicule} = this.state;
        const uploadButtonB = (
            <div className={'position-relative'}>
                {this.state.loadingB ? <span className="fa fa-spin fa-spinner fa-2x"/> :
                    <Button className={"btnBlue"}>{t('ajouter_bagage')}</Button>}
            </div>
        );
        const uploadButtonV = (
            <div className={'position-relative'}>
                {this.state.loadingV ? <span className="fa fa-spin fa-spinner fa-2x"/> :
                    <div className={'d-flex justify-content-center align-items-center flex-column'}
                         style={{border: "1px solid #8F8F8F", borderRadius: 12, width: 170, height: 170}}>
                        <LazyLoadImage src={"/images/picture.png"} alt={"picture"} style={{maxWidth: '50px'}}/>
                        <div className="ant-upload-text text-gris py-2">{t('circuit_depot_annonce.ajoutUnePhoto')}
                            <FontAwesomeIcon icon={faPlusCircle} style={{marginRight: 7}}/>
                        </div>
                    </div>
                }
            </div>
        );
        return (
            this.state.loading ?<p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
            </p> : <div className={"profil_blocks Messagerie"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-md-6"}>
                            <label className={'d-block w-100 text-center'}>{t('bagages_objets')}
                            </label>
                            <br/>
                            <div className="clearfix text-center">
                                <Upload
                                    action=""
                                    listType="picture-card"
                                    fileList={fileList_bagages}
                                    onPreview={this.handlePreview}
                                    onChange={(e) => this.onChangeBagages(e)}
                                    onRemove={(e) => this.removeBagage(e)}
                                >
                                    {fileList_bagages.length >= 10 ? null : uploadButtonB}
                                </Upload>
                                <Modal open={previewVisible} footer={null} onCancel={this.handleCancel}
                                       className={'text-center'}>
                                    <LazyLoadImage alt="example" src={previewImage}/>
                                </Modal>
                                <p>{t('maxUpload')}</p>
                            </div>
                        </div>
                        <div className={"col-md-6"}>
                            <label className={'d-block w-100 text-center'}>{t('mon_vehicule')}
                            </label>
                            <br/>
                            <div className="clearfix text-center">
                                <Upload
                                    previewFile={fileList_vehicule.url}
                                    action=""
                                    className="avatar-uploader d-block left"
                                    showUploadList={false}
                                    //onPreview={this.handlePreview}
                                    onChange={this.onChangeVehicule}
                                    // onRemove={(e) => this.removeVehicule(e)}
                                >
                                    {fileList_vehicule.url != '' ? <div className={'position-relative'}>
                                        <LazyLoadImage src={fileList_vehicule.url} alt="avatar"
                                                       style={{maxWidth: '170px'}}/>

                                    </div> : uploadButtonV}
                                </Upload>
                                <div className="d-flex flex-column-reverse">
                                    <input type={"text"} style={{ maxWidth: '235px'}}
                                           name={"nom_vehicule"}
                                           value={this.state.nom_vehicule}
                                           required className={"nom_vehicule d-block mx-auto"}
                                           onChange={(e) => {
                                               this.setState({nom_vehicule: e.target.value})
                                           }}/>
                                    <label className={"text-left w-100 pt-2 nom_vehicule"} style={{maxWidth: '235px'}}>{t('nom')}</label>
                                </div>
                                <Button className={"btnBlue mt-3"}
                                        onClick={this.submit_vehicule}>{t('ajouter_vehicule')}</Button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default withTranslation()(BagagesVehicule);