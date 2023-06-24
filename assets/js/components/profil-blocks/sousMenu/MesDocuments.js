import React, {Component} from 'react';
import axios from "axios";
import {message, Modal, notification, Tooltip, Upload} from "antd";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {withTranslation} from "react-i18next";
import {uploadFile} from "react-s3";
import {user} from '../../../app'

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
class MesDocuments extends Component {

    constructor() {
        super();
        this.state = {
            liste: [],
            code: "",
            loading1: true,
            loading: false,
            client: {
                cin: '',
                permis: '',
                casier: '',
                sanitaire: '',
                kbis: '',
                carteEUR: '',
                facture: '',
                justification: '',
                token:''

            }

        };
        this.onChangeCin = this.onChangeCin.bind(this);
        this.onChangePermis = this.onChangePermis.bind(this);
        this.onChangeSanitaire = this.onChangeSanitaire.bind(this);
        this.onChangeCasier = this.onChangeCasier.bind(this);
        this.onChangeKBIS = this.onChangeKBIS.bind(this);
        this.onChangeFacture = this.onChangeFacture.bind(this);
        this.onChangeJustification = this.onChangeJustification.bind(this);
        this.onChangeCarteEUR = this.onChangeCarteEUR.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (user) {
            console.log(user)
            axios.post('api/profil/document/show' , {token: user.client.token}).then(res => {
                if (res.data.document.length==0) {
                    this.setState(prevState => ({
                        client: {                   // object that we want to update
                            ...prevState.client,    // keep all other key-value pairs
                            token: user.client.token
                        },loading1:false

                    }),()=>console.log(this.state.client))
                }else {
                    this.setState({client: res.data.document}, () => {

                        this.setState(prevState => ({
                            client: {                   // object that we want to update
                                ...prevState.client,    // keep all other key-value pairs
                                token: user.client.token
                            },loading1:false

                        }), () => console.log(this.state.client))
                    })
                }
            })
        }

    }
    handleSend(){
        axios.post('api/profil/document/add',this.state.client).then(res=>{
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'onCreateAnnConf' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"logo"}/>
                            <p className={"text-gris fs-5 py-4"}>
                                {res.data.message}
                            </p>

                        </div>),
                    okText: 'ok',
                });

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
                console.log(data)
                this.setState(prevState => ({
                    client: {                   // object that we want to update
                        ...prevState.client,    // keep all other key-value pairs
                        [myState]: data.location,      // update the value of specific key

                    },loading: false,
                    name: ''

                }),()=>console.log(this.state.client))


            })
            .catch(err => console.error(err))

    }
    onChangeCin = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'cin'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                    this.handleUpload(
                        'cin', e.file.originFileObj)

            }
        });

    }
    onChangePermis = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'permis'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'permis', e.file.originFileObj)

            }
        });
    }
    onChangeCasier = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'casier'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'casier', e.file.originFileObj)

            }
        });
    }
    onChangeSanitaire = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'sanitaire'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'sanitaire', e.file.originFileObj)

            }
        });
    }
    onChangeKBIS = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'kbis'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'kbis', e.file.originFileObj)

            }
        });
    }
    onChangeCarteEUR = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'carteEUR'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'carteEUR', e.file.originFileObj)

            }
        });
    }
    onChangeFacture = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'facture'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'facture', e.file.originFileObj)

            }
        });
    }
    onChangeJustification = (e) => {
        console.log(e.file)

        this.setState({loading: true, name: 'justification'}, () => {
            if (e.file.status === 'done') {
                // Get this url from response in real world.
                this.handleUpload(
                    'justification', e.file.originFileObj)

            }
        });
    }

    notification() {
        navigator.clipboard.writeText(this.state.code);
        notification.open({
            message: `Copié`,
            placement: 'topLeft',

        });
    }

    render() {
        const {t} = this.props;
        const uploadButton = (name) =>
            (<div className={'position-relative'}>
                {this.state.loading && this.state.name == name ? <span className="fa fa-spin fa-spinner fa-3x"/> :
                    this.state.client.cin && name=="cin"?<LazyLoadImage src={this.state.client.cin} alt={'cin'}/>:
                        this.state.client.kbis && name=="kbis"?<LazyLoadImage src={this.state.client.kbis} alt={'kbis'}/>:
                        this.state.client.carteEUR && name=="carteEUR"?<LazyLoadImage src={this.state.client.carteEUR} alt={'carteEUR'}/>:
                        this.state.client.casier && name=="casier"?<LazyLoadImage src={this.state.client.casier} alt={'casier'}/>:
                        this.state.client.facture && name=="facture"?<LazyLoadImage src={this.state.client.casier} alt={'facture'}/>:
                        this.state.client.justification && name=="justification"?<LazyLoadImage src={this.state.client.justification} alt={'justification'}/>:
                        this.state.client.permis && name=="permis"?<LazyLoadImage src={this.state.client.permis} alt={'permis'}/>:
                        this.state.client.sanitaire && name=="sanitaire"?<LazyLoadImage src={this.state.client.sanitaire} alt={'sanitaire'}/>:<LazyLoadImage src={"/images/noFile.png"} alt={'nofile'}/>
                }
            </div>)
        ;
        return (
            this.state.loading1 ?
                <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                </p> :
            <div className={"profil_blocks mesDoc"}>
                <div className={"container px-4"} style={{border: 'none'}}>
                    <div className={"row"}>
                        <div className={"col-md-2"}>
                            <Upload
                                previewFile={this.state.client.cin}
                                name="cin"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeCin}>
                                {this.state.client.cin ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.cin} alt="avatar"
                                                       style={{width: '100%'}}/>
                                    </div> : uploadButton('cin')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.cin')} <span className={"text-danger"}>*</span></p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="permis"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangePermis}>
                                {this.state.client.permis ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.permis} alt="avatar"
                                                       style={{width: '100%'}}/>
                                    </div> : uploadButton('permis')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.permis_conduire')}</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="casier"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeCasier}>
                                {this.state.client.casier ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.casier} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('casier')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.casier_judicaire')}</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="sanitaire"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeSanitaire}>
                                {this.state.client.sanitaire ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.sanitaire} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('sanitaire')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.pass_sanitaire')}</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="KBIS"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeKBIS}>
                                {this.state.client.kbis ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.kbis} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('kbis')}

                            </Upload>
                            <p className={'text-center'}>KBIS</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="carteEUR"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeCarteEUR}>
                                {this.state.client.carteEUR ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.carteEUR} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('carteEUR')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.carte_eur')}</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="facture"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeFacture}>
                                {this.state.client.facture ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.facture} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('facture')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.facture_bagage')}</p>
                        </div>
                        <div className={"col-md-2"}>
                            <Upload
                                name="justification"
                                listType="picture-card"
                                className="avatar-uploader d-block text-center"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={this.onChangeJustification}>
                                {this.state.client.justification ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={this.state.client.justification} alt="avatar"
                                                       style={{width: '100%'}}/>

                                    </div> : uploadButton('justification')}

                            </Upload>
                            <p className={'text-center'}>{t('page_documents.justification_domicile')}</p>
                        </div>
                        <div className={"col-md-12"}>
                            <button className={"btnBlue"}
                                    disabled={(Object.values(this.state.client).every(val=>val==='') || this.state.client.cin==='')?true:false} onClick={()=>this.handleSend()}>{t('btns.valider')}</button>
                            <p className={'text-gris'}>{t('page_documents.format_accepte')}</p>
                        </div>
                    </div>
                </div>
            </div>


        )

    }
}

export default withTranslation()(MesDocuments);