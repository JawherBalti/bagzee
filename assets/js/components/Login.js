import React, {Component, useState} from 'react';
import {Link} from "react-router-dom";
import {
    Form,
    Input,
    Checkbox,
    Button,
    Radio, Select, Space,
    Modal, DatePicker, Upload, message
} from 'antd';
import "antd/dist/antd.css";
import {faLock, faSpinner, faUserAlt} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {messageService} from "../lib/Services";
import moment from "moment";
import ReseauSociaux from "./ReseauSociaux";
import 'moment/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import {auth, db, storage} from "../hooks/firebase";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {doc, setDoc} from "firebase/firestore";
import {uploadFile} from "react-s3";
import ReactSelect from 'react-select';

const {Option} = Select;

function beforeUpload(file) {
    console.log(file.type)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
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
let prefixPhone = ''

class Login extends Component {
    constructor() {
        super();
        this.state = {
            visibleSubscribe: false,
            visibleLogin: false,
            listePays: [],
            indicatifTel: []
        }

    }

    componentDidMount() {
        axios.get("https://restcountries.com/v2/all").then(res => this.setState({listePays: res.data.sort((a, b) => parseInt(a.callingCodes[0].replace(/\s/g, '')) - parseInt(b.callingCodes[0].replace(/\s/g, '')))}))
    }

    render() {
        const {t, isPRelais} = this.props;

        const disabledDate = (current) => {
            // Can not select days before today and today
            return current && current > moment('01-01-2004', 'DD-MM-YYYY');
        };

        const CollectionCreateFormSubscribe = ({visibleSubscribe, onCreateSubscribe, onCancelSubscribe}) => {
            const [form] = Form.useForm();
            const [is_professionel, setIs_professionel] = useState(false)
            const [loading, setLoading] = useState(false)
            const [photo, setPhoto] = useState('')
            const onChangePhoto = (e) => {
                console.log(e.file)
                setLoading(true)
                if (e.file.status === 'done') {
                    console.log(e.file.originFileObj)
                    // Get this url from response in real world.
                    handleUpload(
                        e.file.originFileObj)

                }

            }
            const uploadButton = (
                <div className={'position-relative'}>
                    {loading ? <span className="fa fa-spin fa-spinner fa-2x"/> :
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
            const handleUpload = async (file) => {
                var fileExtension = '.' + file.name.split('.')[1];
                var prefix = file.name.split('.')[0];
                var name = prefix.replace(/[^A-Z]/gi, '') + Math.random().toString(36).substring(7) + new Date().getTime() + fileExtension;
                var newFile = new File([file], name, {type: file.type});
                uploadFile(newFile, config)
                    .then(data => {
                        console.log(data.location)
                        setPhoto(data.location)

                        setLoading(false)
                    })
                    .catch(err => console.error(err))
                console.log(photo)

            }
            const onFinish = (values) => {
                console.log('Received values of form: ', values);
            };
            const onCheckboxChangePro = (e) => {
                console.log(e)
                setIs_professionel(e.target.value == 'professionel' ? true : false);
            };

            const Option = ({innerProps, label, data}) => (
                <div {...innerProps}>
                    <LazyLoadImage src={data.flags.svg} alt={label}
                                   style={{border: "1px solid #000", width: '30px', marginRight: '10px'}}/>
                    <span>+ {data.callingCodes[0]}</span>
                </div>
            )

            const customStyles = {
                control: base => ({
                    ...base,
                    "&:hover": {
                        border: "1px solid #40a9ff"
                    },
                    height: "45px",
                    borderRadius: 0,
                    borderTopLeftRadius: "50px",
                    borderBottomLeftRadius: "50px",
                })
            };

            return (
                <Modal
                    open={visibleSubscribe}
                    onCancel={onCancelSubscribe}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                values.photo = photo
                                form.resetFields();
                                onCreateSubscribe(values);

                            })
                            .catch((info) => {
                                info.values.photo = photo

                                console.log('Ooops !! Validate Failed:', info);
                            });
                    }}
                    footer={[

                        <Button key="submit" type="primary" className={isPRelais ? "bg-orange" : null} onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    values.photo = photo
                                    form.resetFields();
                                    onCreateSubscribe(values);

                                })
                                .catch((info) => {
                                    info.values.photo = photo
                                    console.log(prefixPhone + info.values.phone)

                                    console.log('Ooops !! Validate Failed:', info);
                                });
                        }}>{t('subscribe.rejoindre')}
                        </Button>


                    ]}

                >

                    {/* <ReseauSociaux/>
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
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                        requiredMark={true}
                    >
                        <Form.Item name={"isPointRelais"} style={{display: 'none'}}
                                   initialValue={isPRelais ? true : false}>
                            <Checkbox checked={isPRelais ? true : false}/>
                        </Form.Item>
                        <Form.Item name={"photo"} label={<span>{t('photo_profil')}</span>}>
                            <Upload
                                previewFile={photo}

                                listType="picture-card"
                                className="avatar-uploader d-block left"
                                beforeUpload={beforeUpload}
                                showUploadList={false}
                                action=""
                                onChange={onChangePhoto}>
                                {photo ?
                                    <div className={'position-relative'}>
                                        <LazyLoadImage src={photo} alt="avatar"
                                                       style={{width: '100%'}}/>
                                    </div> : uploadButton}

                            </Upload>
                        </Form.Item>
                        {isPRelais ? null : <Form.Item
                            name="isProfessionel"
                            label={
                                <span>
                                        Je suis un
                                    </span>
                            }
                            valuePropName="checked"
                            rules={[
                                {
                                    required: is_professionel,
                                },
                            ]}
                        >
                            <Radio.Group onChange={onCheckboxChangePro}>
                                <Radio value={'particulier'}>Particulier</Radio>
                                <Radio value={'professionel'}>Professionel</Radio>
                            </Radio.Group>
                        </Form.Item>}
                        {is_professionel || isPRelais ?
                            <>
                                <Form.Item
                                    name="entreprise"
                                    label={
                                        <span>
                                  {isPRelais ? "Nom du commerce" : " Nom entreprise"}
                                </span>
                                    }
                                    rules={[
                                        {
                                            required: false,
                                            whitespace: true,
                                        },
                                    ]} hasFeedback
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="siret"
                                    label={
                                        <span>
                                    Numéro de siret
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
                            </>
                            : null}
                        <Form.Item className={'text-center'}
                                   name="gender"
                                   label={
                                       <span>
                                           Je suis un
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
                                <Radio value={'Neutre'}>Je ne précise pas</Radio>
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
                        {isPRelais ? null :
                            <Form.Item label="Date de naissance" initialValue={moment('01-01-2000', 'DD-MM-YYYY')}
                                       name="birdh" rules={[
                                {
                                    required: true,
                                    message: 'Date de naissance ne doit pas être vide!',
                                },
                            ]} hasFeedback>
                                <DatePicker disabledDate={disabledDate} locale={locale}
                                            defaultValue={moment('01-01-2000', 'DD-MM-YYYY')}
                                            placeholder={'aaaa-mm-jj'} format={'DD-MM-YYYY'}/>
                                {/*<Select onChange={handleChange} defaultValue="01">
                                    {jour}
                                </Select>*/}

                            </Form.Item>}
                        <Form.Item  name={['phoneStripe', 'phone']}
                                    label={<span className={'requis'}>Numéro de téléphone</span>}
                        >
                            <Space.Compact style={{width: '100%'}}>
                                <Form.Item

                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (prefixPhone > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Pays obligatoire'));
                                            },

                                            whitespace: true,
                                        },
                                    ]} hasFeedback
                                    name="prefix" noStyle>
                                    <div style={{width: "35%"}}>
                                        <ReactSelect
                                            styles={customStyles}
                                            placeholder="Pays"
                                            menuPlacement="auto"
                                            menuPosition="fixed"
                                            options={this.state.listePays}
                                            components={{Option}}
                                            getOptionLabel={(option) =>
                                                <>
                                                    <LazyLoadImage src={option.flags.svg} alt={option.name} style={{
                                                        border: "1px solid #000",
                                                        width: '30px',
                                                        marginRight: '10px'
                                                    }}/>
                                                    <span>{"+" + option.callingCodes[0]}</span>
                                                </>
                                            }
                                            getOptionValue={(option) => option.name}
                                            onChange={selectedOption => {
                                                console.log(selectedOption);
                                                prefixPhone = selectedOption.callingCodes[0]
                                            }
                                            }
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item noStyle
                                           name="phone"
                                           rules={[
                                               {
                                                   required: true,
                                                   message: 'Numéro de téléphone ne doit pas être vide!',
                                               },
                                               /*{
                                                   pattern: '^((06)|(07))[0-9]{8}$',
                                                   message: 'Numéro de téléphone doit être à 10 chiffres et commencer par 06 ou 07',
                                               },*/
                                           ]} hasFeedback
                                >
 


                                    <Input type='tel' minLength={10} maxLength={10} placeholder={'0600000000'} style={{
                                        borderRadius: 0,
                                        borderTopRightRadius: "50px",
                                        borderBottomRightRadius: "50px",
                                        width: "65%",
                                        height: 45
                                    }}/>

                                </Form.Item>
                            </Space.Compact>
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
                            name="password"
                            label={t('mot_de_passe')}
                            rules={[
                                {
                                    required: true,
                                    message: 'Mot de passe ne doit pas être vide!',
                                },
                                {
                                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$',
                                    message: 'Mot de passe doit être à 6 caractéres au minimum avec une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
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

                        {isPRelais ? null : <Form.Item
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
                                {t('accept')}
                                <Link to={'/conditions-generales-utilisation'}
                                      style={{
                                          color: '#30A3F2',
                                          paddingLeft: 7,
                                          paddingRight: 7
                                      }}> {t('condGenUt')} </Link>
                            </Checkbox>
                        </Form.Item>}
                        {isPRelais ? null : <Form.Item
                            name="agreement2"
                            valuePropName="checked"
                            /*  rules={[
                                  {
                                      validator: (_, value) =>
                                          value ? Promise.resolve() : Promise.reject('Vous devez accepter le conditions générales'),
                                  },
                              ]}*/
                        >
                            <Checkbox>
                                J'accepte de recevoir la Newsletter Bagzee.
                            </Checkbox>
                        </Form.Item>}

                    </Form>
                </Modal>
            );
        };
        const firebase = async (e) => {
            console.log(e)
            const displayName = e.firstName;
            const email = e.email;
            const password = e.password;
            const file = e.photo?.file?.originFileObj ? e.photo.file.originFileObj : '/images/avatar-person.png';

            try {
                //Create user
                const res = await createUserWithEmailAndPassword(auth, email, password);

                //Create a unique image name
                const date = new Date().getTime();
                const storageRef = ref(storage, `${displayName + date}`);

                await uploadBytesResumable(storageRef, file).then(() => {
                    console.log(storageRef)
                    getDownloadURL(storageRef).then(async (downloadURL) => {
                        console.log(downloadURL)
                        try {
                            //Update profile
                            await updateProfile(res.user, {
                                displayName,
                                photoURL: file,
                            });
                            //create user on firestore
                            await setDoc(doc(db, "users", res.user.uid), {
                                uid: res.user.uid,
                                displayName,
                                email,
                                photoURL: file,
                            });

                            //create empty user chats on firestore
                            await setDoc(doc(db, "userChats", res.user.uid), {});
                            Modal.success({
                                content: (
                                    <div className={"text-center"} key={'onCreateSubscribe' + Math.random()}>
                                        <LazyLoadImage src={"/images/logo.png"}
                                                       width={'65px'} alt={"bagzee"}/>
                                        <p className={"text-success pt-2"}>
                                            votre inscription a été pris en compte
                                        </p>

                                    </div>),
                                okText: 'ok',
                            });
                            /**login apres inscription**/
                            signOut(auth).then(() => {
                                localStorage.clear();
                            }).catch((error) => {
                                // An error happened.
                            });
                            axios.post('api/signIn/client', {values: e}).then(function (response) {
                                let status = response.data.status
                                setTimeout(async () => {
                                    if (status) {
                                        localStorage.setItem('client', JSON.stringify(response.data));
                                        await signInWithEmailAndPassword(auth, e.email, e.password)
                                            .then(async (userCredential) => {
                                                const user = userCredential.user;
                                                let myuser = JSON.parse(localStorage.getItem("client"));
                                                await updateProfile(res.user, {
                                                    displayName: myuser.client.firstName,
                                                    photoURL: myuser.client.photo ? myuser.client.photo : "/images/avatar-person.png",
                                                });
                                                window.location.reload(false);
                                                console.log(JSON.stringify(user))
                                                window.location.reload(false);
                                            })
                                            .catch((error) => {
                                                const errorCode = error.code;
                                                const errorMessage = error.message;
                                                alert(errorCode, errorMessage)
                                                // ..
                                            });
                                    }
                                }, 50)
                            })
                                .catch(function (error) {
                                    console.log(error);
                                });
                            this.setState({visibleSubscribe: false, visibleLogin: false})
                            messageService.sendMessage('closeLoginPartenaire');

                            /***/


                        } catch (err) {
                            console.log(err);
                            const modal = Modal.success({
                                content: (
                                    <div className={"text-center"} key={'onCreateSubscribe' + Math.random()}>
                                        <LazyLoadImage src={"/images/logo.png"}
                                                       width={'65px'} alt={"bagzee"}/>
                                        <p className={"text-danger pt-2"}>
                                            Email déjà existe
                                        </p>

                                    </div>),
                                okText: 'ok',
                            });
                            setTimeout(() => {
                                modal.destroy();
                            }, 5000);
                            // setErr(true);
                            //setLoading(false);
                        }
                    });
                });
            } catch (err) {
                console.log(err)
                //setErr(true);
                // setLoading(false);
            }
        };

        const CollectionsPageSubscribe = () => {
            //With this, we will get all field values.
            const onCreateSubscribe = (values) => {
                signOut(auth).then(() => {
                    localStorage.clear();
                    values.phone = '+' + prefixPhone + values.phone;
                    axios.post('api/client/subscription', {values}).then(function (response) {
                        let status = response.data.status
                        let message = response.data.message
                        if (!isPRelais) {
                            if (status) {
                                firebase(values)
                            } else {
                                Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'onCreateSubscribe' + Math.random()}>
                                            <LazyLoadImage src={"/images/logo.png"}
                                                           width={'65px'} alt={"bagzee"}/>
                                            <p className={"text-danger pt-2"}>
                                                {message}
                                            </p>

                                        </div>),
                                    okText: 'ok',
                                });
                            }
                        } else {
                            setTimeout(() => {
                                const modal = Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'onCreateSubscribe' + Math.random()}>
                                            <LazyLoadImage
                                                src={isPRelais ? "/images/logoPRelais.png" : "/images/logo.png"}
                                                width={'65px'} alt={"bagzee"}/>
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
                                signOut(auth).then(() => {
                                    localStorage.clear();
                                }).catch((error) => {
                                    // An error happened.
                                });
                                axios.post('api/signIn/client', {values}).then(function (response) {
                                    let status = response.data.status
                                    let message = response.data.message
                                    setTimeout(async () => {
                                        if (status) {
                                            localStorage.setItem('client', JSON.stringify(response.data));
                                            let myuser = JSON.parse(localStorage.getItem("client"));
                                            if (!isPRelais && !myuser.client.isPointRelais) {
                                                await signInWithEmailAndPassword(auth, values.email, values.password)
                                                    .then(async (userCredential) => {
                                                        const user = userCredential.user;
                                                        await updateProfile(res.user, {
                                                            displayName: myuser.client.firstName,
                                                            photoURL: myuser.client.photo ? myuser.client.photo : "/images/avatar-person.png",
                                                        });
                                                        window.location.reload(false);
                                                        console.log(JSON.stringify(user))
                                                        window.location.reload(false);
                                                    })
                                                    .catch((error) => {
                                                        const errorCode = error.code;
                                                        const errorMessage = error.message;
                                                        alert(errorCode, errorMessage)
                                                        // ..
                                                    });
                                            } else {
                                                window.location.reload(false);

                                            }
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
                        }


                    })
                        .catch(function (error) {
                            console.log(error);
                        });
                    this.setState({visibleSubscribe: false, visibleLogin: false})
                    messageService.sendMessage('closeLoginPartenaire');
                }).catch((error) => {
                    // An error happened.
                });

            };

            return (
                <div>
                    Nouveau sur Bagzee ?
                    <Button
                        type="primary"
                        className={'clear'}
                        onClick={() => {
                            this.setState({visibleSubscribe: true})
                        }}
                    >
                        S'inscrire !
                    </Button>
                    <CollectionCreateFormSubscribe key={'subscribe-' + Math.random()}
                                                   visibleSubscribe={this.state.visibleSubscribe}
                                                   onCreateSubscribe={onCreateSubscribe}
                                                   onCancelSubscribe={() => {
                                                       this.setState({visibleSubscribe: false, visibleLogin: false})
                                                       messageService.sendMessage('closeLoginPartenaire');
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
                    open={visibleLogin}
                    okText="Connexion"
                    key={'login-' + Math.random()}
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
                        </svg>
                        ,
                        <ReseauSociaux/>,

                        <Link to={'/mot-de-passe-oublie'} style={{
                            display: 'block',
                            color: '#1C2D5A',
                            textDecoration: "underline",
                            cursor: 'pointer',
                            textAlign: "right",
                            marginBottom: '10px'
                        }}>mot de passe oublié ?
                        </Link>, <Button key="submit" type="primary" className={'w-100 bg-orange'} onClick={() => {
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
                        </Button>, <CollectionsPageSubscribe key={'CollectionsPageSubscribe-' + Math.random()}/>,


                    ]}
                >
                    <LazyLoadImage src={isPRelais ? "/images/logoPRelais.png" : "/images/logo.png"} alt={"bagzee"}
                                   className={'d-block mx-auto mb-3'}/>
                    <p className={"text-center"} style={{fontSize: '23px'}}>Connexion</p>
                    <p className={"text-center"} style={{color: '#6E6E6E'}}>Vous êtes déjà inscrit, connectez-vous
                    </p>
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_connexion"
                        requiredMark={true}
                        key={'form_connexion-' + Math.random()}
                    >
                        <Form.Item
                            name="email"
                            label={t('adr_mail')}
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez saisir votre adresse email',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item name="password" label={t('mot_de_passe')}
                                   rules={[
                                       {
                                           required: true,
                                           message: 'Veuillez saisir votre mot de passe',
                                       },
                                   ]}
                        >
                            <Input type="password"/>
                        </Form.Item>


                    </Form>
                </Modal>
            );
        };
        const CollectionsPageLogin = () => {
            const onCreateLogin = (values) => {
                signOut(auth).then(() => {
                    localStorage.clear();
                    axios.post('api/signIn/client', {values}).then(function (response) {
                        let status = response.data.status
                        setTimeout(function () {
                            if (status) {
                                localStorage.setItem('client', JSON.stringify(response.data));

                                let myuser = JSON.parse(localStorage.getItem("client"));
                                if (!isPRelais && !myuser.client.isPointRelais) {
                                    signInWithEmailAndPassword(auth, values.email, values.password)
                                        .then((userCredential) => {
                                            const user = userCredential.user;
                                            console.log(JSON.stringify(user))
                                            window.location.reload(false);
                                        })
                                        .catch((error) => {
                                            const errorCode = error.code;
                                            const errorMessage = error.message;
                                            alert(errorCode, errorMessage)
                                            // ..
                                        });
                                } else {
                                    window.location.reload(false);

                                }
                            } else {
                                Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'onlogin' + Math.random()}>
                                            <LazyLoadImage
                                                src={isPRelais ? "/images/logoPRelais.png" : "/images/logo.png"}
                                                width={'65px'} alt={"bagzee"}/>
                                            <p className={"text-danger pt-2"}>
                                                {response.data.message}
                                            </p>

                                        </div>),
                                    okText: 'ok',
                                });
                            }
                        }, 50)
                    })
                        .catch(function (error) {
                            console.log(error);
                        });

                    this.setState({visibleLogin: false}, () => {
                        messageService.sendMessage('closeLoginPartenaire');
                    })
                }).catch((error) => {
                    // An error happened.
                });


            };

            return (
                <>
                    {isPRelais ?
                        <span><span
                            onClick={() => {
                                this.setState({visibleLogin: true})
                            }}
                        > {t('footer.devenir_pointRelais')}</span></span> :
                        <><Button style={{
                            width: 45,
                            height: 45,
                            background: "#4BBEED"
                        }}
                                  className={'d-none d-lg-block rounded-circle text-white border-none'}
                                  onClick={() => {
                                      this.setState({visibleLogin: true})
                                      messageService.sendMessage('visibleLoginPartenaire');
                                  }}
                        >
                            <FontAwesomeIcon
                                icon={faUserAlt}/>
                        </Button>
                            <span
                                className={'d-block d-lg-none'}
                                onClick={() => {
                                    this.setState({visibleLogin: true})
                                    messageService.sendMessage('visibleLoginPartenaire');
                                }}
                            >
                        Se connecter
                        </span>
                        </>}
                    <CollectionCreateFormLogin key={'login-' + Math.random()}
                                               visibleLogin={this.state.visibleLogin}
                                               onCreateLogin={onCreateLogin}
                                               onCancelLogin={() => {
                                                   this.setState({visibleLogin: false}, () => {
                                                       messageService.sendMessage('closeLoginPartenaire');
                                                   })
                                               }}
                    />
                </>
            );
        };

        return (

            <CollectionsPageLogin key={'CollectionsPageLogin-' + Math.random()}/>
        );


    }
}

export default withTranslation()(Login);
