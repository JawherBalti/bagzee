import {Form, Input, Modal} from "antd";
import axios from "axios";
import {LazyLoadImage} from "react-lazy-load-image-component";
import React, {useState} from 'react';
import Footer from "./Footer";
import Header from "./Header";
import {Link} from "react-router-dom";
import {Trans, withTranslation} from "react-i18next";
import {auth} from "../hooks/firebase";
import {sendPasswordResetEmail,} from "firebase/auth";
const ForgetPassword = (props) => {


    const [formM2p] = Form.useForm();
    return (
        <div >
            <Header/>
            <div className={'container m2b_oublier mt-5'}>
                <div className={'my-3'} key={'m2b_oublier' + Math.random()}>
                    <p className={'text-center mb-5'} style={{color: '#38BFEF'}}>
                        {props.t('mot_de_passe_oublie')}
                    </p>
                    <div className={'row'}>
                        <div className={'col-md-6'}>
                            <LazyLoadImage src={"/images/m2pOublier.png"} alt={"m2pOublier"}/>
                        </div>
                        <div className={'col-md-6'}>
                            <div style={{background: 'url(/images/m2pOublierTriangle.png)',backgroundPosition: '40% 90%',
                                height: '250px',
                                backgroundRepeat: 'no-repeat'}}>
                            <div className={'dialogueBleu'}>
                                <h4 className={'text-white text-uppercase'}>
                                    <Trans i18nKey={'tu_as_oublie_m2p'}>
                                        Tu as oublié<br/>ton mot de passe ?
                                    </Trans>
                                    </h4>
                                <p className={'text-white'}>
                                    <Trans i18nKey={'parag_m2p_oublie'}>
                                        Pas de problème, nous t’envoyons <br/>un e-mail pour changer ton mot de passe.
                                    </Trans>
                                </p>
                            </div>
                            </div>
                            <p style={{color:'#1C2D5A'}}>
                                <Trans i18nKey={'parag_form_m2p_oublie'}>
                                    Veuillez entrer votre adresse e-mail pour réinitialiser<br/>votre mot de passe.
                                </Trans>
                                </p>
                            <Form form={formM2p} name={'m2b_oublier'}>
                                <Form.Item name={'email'} label={props.t('adr_mail')} rules={[{
                                    type: 'email',
                                    message: 'Votre email ' +
                                        'n\'est pas valide !',
                                }, {
                                    required: true,
                                    message: 'Email ne doit pas être vide!',
                                    whitespace: true
                                }]} hasFeedback>
                                    <Input className={'py-2'} type={'email'}/>

                                </Form.Item>
                            </Form>

                        </div>
                        <div className={'col-12 d-flex gap-3 justify-content-center'}>
                            <button type={'cancel'} className={'btnTransparent my-0 mx-2'}>
                                {props.t('btns.annuler')}
                            </button>
                            <button onClick={() => {
                                formM2p
                                    .validateFields()
                                    .then((values) => {
                                        formM2p.resetFields();
                                        axios.post('api/profil/forget/password', {
                                            email: values.email
                                        }).then(res => {
                                           /* sendPasswordResetEmail(auth, values.email)
                                                .then(() => {
                                                    // Password reset email sent!
                                                    // ..
                                                })
                                                .catch((error) => {
                                                    const errorCode = error.code;
                                                    const errorMessage = error.message;
                                                    // ..
                                                });*/
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
                                    })
                            }} className={'btnBlue my-0 mx-2'}>Envoyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>

    )

}

export default withTranslation()(ForgetPassword);
