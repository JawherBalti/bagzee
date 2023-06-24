import React, {Component, useState} from 'react';
import {Redirect} from 'react-router';
import {LazyLoadImage} from 'react-lazy-load-image-component';

const script = document.createElement("script");
script.src = 'https://js.stripe.com/v3/';
let strip; // new line
script.onload = function () {
    strip = Stripe(settings.stripe.publishableKey);

};
document.body.appendChild(script);
import {
    Form,
    Input,
    Checkbox,
    Button,
    Radio,
    Modal
} from 'antd';
import "antd/dist/antd.css";
import {faLock} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FacebookLogin from 'react-facebook-login';
import Profil from "./ProfilClient";
import axios from "axios";
import {Link} from "react-router-dom";
import settings from "../app";
import {messageService} from "../lib/Services";

class SubscribePartenaire extends Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            visibleSubscribePartenaire: false,
            visibleLoginPartenaire: false,
        };
    }

    render() {

        const redirectNow = () => {
            this.setState({redirect: true});
        }
        const CollectionCreateFormSubscribePartenaire = ({
                                                             visibleSubscribePartenaire,
                                                             onCreateSubscribePartenaire,
                                                             onCancelSubscribePartenaire
                                                         }) => {
            const [form] = Form.useForm();

            const onFinish = (values) => {
                console.log('Received values of form: ', values);
            };

            return (
                <Modal
                    visible={visibleSubscribePartenaire}
                    onCancel={onCancelSubscribePartenaire}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateSubscribePartenaire(values);

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
                                    onCreateSubscribePartenaire(values);
                                })
                                .catch((info) => {
                                    console.log('Ooops !! Validate Failed:', info);
                                });
                        }}>Envoyer ma demande
                        </Button>


                    ]}

                >

                    <div className={'text-center w-100'}>
                        <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} className={'mb-3'}/><br/>
                        <h5>Inscription</h5>
                    </div>

                    <Form
                        form={form}
                        name="registerPartenaire"
                        onFinish={onFinish}
                        scrollToFirstError
                        requiredMark={false}
                    >

                        <Form.Item
                            name="nomStructure"
                            label={
                                <span>
                                    Nom de la structure
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Nom de la structure ne doit pas être vide!',
                                    whitespace: true,
                                },
                            ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="siret"
                            label="Numéro SIRET"
                            rules={[
                                {
                                    required: true,
                                    message: 'Numéro SIRET ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"text"}/>
                        </Form.Item>
                        <Form.Item>
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
                                ]}
                                className={'d-inline-block col-6 pl-0'}
                                hasFeedback
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
                                ]}
                                className={'d-inline-block col-6 pr-0'}
                                hasFeedback
                            >
                                <Input/>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Form.Item
                            name="phone"
                            label="Téléphone"
                            className={'d-inline-block col-6 pl-0'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Numéro de téléphone ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type='tel' minLength={10} maxLength={10} placeholder={'0600000000'}
                                   onKeyPress={(event) => {
                                       if (!/[0-9]/.test(event.key)) {
                                           event.preventDefault();
                                       }
                                   }}/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            className={'d-inline-block col-6 pr-0'}
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
                        </Form.Item>
                        <Form.Item
                            name="adresse"
                            label="Adresse"
                            rules={[
                                {
                                    required: true,
                                    message: 'Adresse ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"text"}/>
                        </Form.Item>

                        <Form.Item>
                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            className={'d-inline-block col-6 pl-0'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Mot de passe ne doit pas être vide!',
                                },{
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
                            className={'d-inline-block col-6 pr-0'}
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
                        </Form.Item>

                        {/*<Form.Item
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
                                vous conformer aux <Link to={'/conditions-generales-de-vente'}
                                                         style={{color: '#30A3F2'}}> Conditions Générales de
                                Bagzee. </Link>
                                Conformément à la loi Informatique et Libertés,
                                Vous disposez d’un droit d’accès et de rectification
                                aux données vous concernant. <Link style={{color: '#30A3F2'}}
                                                                   to={"/politique-de-confidentialite"}> En savoir plus
                                ici.</Link>
                            </Checkbox>
                        </Form.Item>*/}

                    </Form>
                </Modal>
            );
        };
        const CollectionsPageSubscribePartenaire = () => {
            //With this, we will get all field values.
            const onCreateSubscribePartenaire = (values) => {
                localStorage.clear();

                axios.post('api/partenaire/create', {
                    "firstName": values.firstName,
                    "lastName": values.lastName,
                    "email": values.email,
                    "password": values.password,
                    "phone": values.phone.replace(/ /g, ''),
                    "adresse": values.adresse,
                    "siret": values.siret,
                    "nomStructure": values.nomStructure,

                }).then(function (response) {
                    let status = response.data.status
                    let message = response.data.message
                    setTimeout(function () {
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"} key={'partenaire' + Math.random()}>
                                    <LazyLoadImage src={"/images/demandePartenaire.png"} alt={"bagzee"}
                                                   className={'mb-3'}/>
                                    {status ?
                                        <>
                                            <p style={{color: '#707070'}}>Demande envoyée</p>
                                        </> :
                                        <p className={"text-danger pt-2"}>
                                            {message}
                                        </p>
                                    }


                                </div>),
                            okText: 'Ok',
                        });
                        setTimeout(() => {
                            modal.destroy();
                        }, 5000);

                    }, 1000)
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.setState({visibleSubscribePartenaire: false}, () => {
                    messageService.sendMessage('closeLoginPartenaire');
                })

            };

            return (
                <span>
                    <span
                        onClick={() => {
                            this.setState({visibleSubscribePartenaire: true})
                        }}
                    >
                        Devenir Partenaire
                    </span>
                    <CollectionCreateFormSubscribePartenaire key={'subscribe-partenaire' + Math.random()}
                                                             visibleSubscribePartenaire={this.state.visibleSubscribePartenaire}
                                                             onCreateSubscribePartenaire={onCreateSubscribePartenaire}
                                                             onCancelSubscribePartenaire={() => {
                                                                 this.setState({
                                                                     visibleSubscribePartenaire: false,
                                                                     visibleLoginPartenaire: false
                                                                 })
                                                                 messageService.sendMessage('closeLoginPartenaire');
                                                             }}
                    />
                </span>
            );
        };
        const CollectionCreateFormLoginPartenaire = ({
                                                         visibleLoginPartenaire,
                                                         onCreateLoginPartenaire,
                                                         onCancelLoginPartenaire
                                                     }) => {
            const [form] = Form.useForm();
            const [formM2p] = Form.useForm();
            return (
                <Modal
                    className={this.state.visibleSubscribePartenaire ? 'd-none' : null}
                    visible={visibleLoginPartenaire}
                    okText="Connexion"
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateLoginPartenaire(values);

                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={onCancelLoginPartenaire}
                    footer={[
                        <Button key="submit" type="primary" className={'w-100'} onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    onCreateLoginPartenaire(values);
                                })
                                .catch((info) => {
                                    console.log('Validate Failed:', info);
                                });

                        }}>Connexion
                        </Button>,
                        <p style={{color: '#B3B3B1', margin: 0, paddingTop: '10px'}}>Je ne suis pas encore
                            partenaire</p>
                        ,
                        <CollectionsPageSubscribePartenaire/>,


                    ]}
                >
                    <div className={'text-center'}>
                        <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} className={'mb-3'}/><br/>
                        <p className={"text-center"} style={{fontSize: '23px'}}>Connexion</p>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_connexion_partenaire"
                        requiredMark={false}

                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Veuillez saisir votre email',
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
                                    <div className={'my-3'} key={'m2b_oublier' + Math.random()}>
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
                                                type: "2",
                                                email: values.email
                                            }).then(res => {
                                                const modal = Modal.success({
                                                    content: (
                                                        <div className={"text-center"} key={'formM2p' + Math.random()}>
                                                            <LazyLoadImage src={"/images/logo.png"} className={'mb-3'}
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
                        }}>mot de passe oublié ?</p>
                    </Form>
                </Modal>
            );
        };
        const CollectionsPageLoginPartenaire = () => {

            const onCreateLoginPartenaire = (values) => {
                localStorage.clear();
                this.state.redirect = false
                axios.post('api/signIn/partenaire', {
                    "email": values.email,
                    "password": values.password,

                }).then(function (response) {
                    localStorage.setItem('partenaire', JSON.stringify(response.data));
                    let message = response.data.message
                    let status = response.data.status

                    if (!response.data.partenaire.stripeAccount) {
                        let accountResult = strip.createToken('account', {
                            business_type: 'individual',
                            individual: {
                                phone:  response.data.partenaire.phone,
                                email: response.data.partenaire.email,
                                first_name: response.data.partenaire.firstName,
                                last_name: response.data.partenaire.lastName,
                                gender: 'male',
                                address: {
                                    line1: response.data.partenaire.adresse,
                                    city: 'paris',
                                    state: 'fr',
                                    postal_code: '75001'
                                },
                                dob: {
                                    day: '11',
                                    month: '10',
                                    year: '1980'
                                },

                            },
                            tos_shown_and_accepted: true,


                        }).then((result) => {

                            axios.post('api/signIn/partenaire', {
                                "email": values.email,
                                "password": values.password,
                                "token": result.token.id

                            }).then(function (response) {
                                setTimeout(function () {
                                    if (status) {
                                        redirectNow();
                                    } else {
                                        const modal = Modal.success({
                                            content: (
                                                <div className={"text-center"} key={'connexion' + Math.random()}>
                                                    <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"}
                                                                   className={'mb-3'}/>
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
                                }, 50)
                            })


                        });
                    } else {
                        setTimeout(function () {
                            if (status) {
                                redirectNow();
                            } else {
                                const modal = Modal.success({
                                    content: (
                                        <div className={"text-center"} key={'connexion' + Math.random()}>
                                            <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"}
                                                           className={'mb-3'}/>
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
                        }, 50)
                    }
                })
                    .catch(function (error) {
                        console.log(error);
                    });

                this.setState({visibleLoginPartenaire: false}, () => {
                    messageService.sendMessage('closeLoginPartenaire');
                })

            };

            return (
                <span>
                    <span

                        onClick={() => {
                            this.setState({visibleLoginPartenaire: true})
                            messageService.sendMessage('visibleLoginPartenaire');
                        }}
                    >
                        Devenir Partenaire
                    </span>
                    <CollectionCreateFormLoginPartenaire key={'login-partenaire' + Math.random()}
                                                         visibleLoginPartenaire={this.state.visibleLoginPartenaire}
                                                         onCreateLoginPartenaire={onCreateLoginPartenaire}
                                                         onCancelLoginPartenaire={() => {
                                                             this.setState({visibleLoginPartenaire: false}, () => {
                                                                 messageService.sendMessage('closeLoginPartenaire');
                                                             })
                                                         }}
                    />
                </span>
            );
        };
        if (this.state.redirect) {
            return <Redirect to='/profil-partenaire'/>;
        } else {
            return (
                <CollectionsPageSubscribePartenaire/>
            );
        }

    }
}

export default SubscribePartenaire;
