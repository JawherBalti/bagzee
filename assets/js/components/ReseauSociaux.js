import React, {Component} from 'react';
import FacebookLogin from "react-facebook-login";
import {GoogleLogin} from "react-google-login";
import {Modal} from "antd";
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class ReseauSociaux extends Component {
    constructor() {
        super();
    }

    responseGoogle(response) {

        console.log(response)
        axios.post('api/signIn/google', {
            googleId: response.profileObj.googleId,
            email: response.profileObj.email
        }).then(res => {

            localStorage.clear();
            let status = res.data.status
            let message = res.data.message
            let enabled = res.data.enabled
            setTimeout(function () {
                if (status && enabled) {
                    localStorage.setItem('client', JSON.stringify(res.data));
                    window.location.reload(false);
                } else {
                    if (!enabled && message == 'verif') {
                        Modal.success({
                            content: (
                                <div>
                                    <FontAwesomeIcon icon={faTimes}/>
                                    <br/>
                                    <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez verifier votre
                                        compte</p>
                                </div>
                            ),
                            okText: 'ok',
                        })
                    } else {
                        console.log(message)
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"}>
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
        }).catch(e => {
            console.log(e)
        })


    }

    render() {
        const responseFacebook = (response) => {
            axios.post('api/signIn/facebook', {facebookId: response.userID, email: response.email}).then(res => {
                localStorage.clear();
                let status = res.data.status
                let message = res.data.message
                let enabled = res.data.enabled
                setTimeout(function () {
                    if (status) {
                        localStorage.setItem('client', JSON.stringify(res.data));
                        window.location.reload(false);
                    } else {
                            console.log(message)
                            const modal = Modal.success({
                                content: (
                                    <div className={"text-center"}>
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
                }, 50)
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            console.log(response);
        }
        const responseGoogle = (response) => {
            console.log(response)
            axios.post('api/signIn/google', {
                googleId: response.profileObj.googleId,
                email: response.profileObj.email
            }).then(res => {
                localStorage.clear();
                let status = res.data.status
                let message = res.data.message
                let enabled = res.data.enabled
                setTimeout(function () {
                    if (status && enabled) {
                        localStorage.setItem('client', JSON.stringify(res.data));
                        window.location.reload(false);
                    } else {
                        if (!enabled && message == 'verif') {
                            Modal.success({
                                content: (
                                    <div>
                                        <FontAwesomeIcon icon={faTimes}/>
                                        <br/>
                                        <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez verifier votre
                                            compte</p>
                                    </div>
                                ),
                                okText: 'ok',
                            })
                        } else {
                            console.log(message)
                            const modal = Modal.success({
                                content: (
                                    <div className={"text-center"}>
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
            }).catch(e => {
                console.log(e)
            })

        }
        return (
            <>
                <FacebookLogin
                    appId="791225542229076"
                    autoLoad={false}
                    fields="name,email,picture"
                    textButton={'Se connecter avec Facebook'}
                    cssClass="my-facebook-button-class btn-default fb"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="9.643" height="16.151" viewBox="0 0 6.643 13.151" style={{marginRight:10}}>
                        <path id="facebook-svgrepo-com_1_" data-name="facebook-svgrepo-com (1)" d="M126.894,7h1.442v5.935a.212.212,0,0,0,.212.212h2.444a.212.212,0,0,0,.212-.212V7.032h1.657a.212.212,0,0,0,.211-.188l.252-2.185a.212.212,0,0,0-.211-.236H131.2V3.053c0-.413.222-.622.661-.622h1.248a.212.212,0,0,0,.212-.212V.214A.212.212,0,0,0,133.113,0h-1.72l-.079,0a3.3,3.3,0,0,0-2.155.812,2.26,2.26,0,0,0-.752,2.009v1.6h-1.513a.212.212,0,0,0-.212.212V6.792A.212.212,0,0,0,126.894,7Z" transform="translate(-126.682)" fill="#fff"/>
                    </svg>
                    }
                    callback={responseFacebook}
                />
                <GoogleLogin
                    autoLoad={false}
                    clientId="450685082903-8j677khs4a89usna8e2be8ph875r8qfe.apps.googleusercontent.com"
                    className={'btn-default w-100 mx-0 mb-4 edit google'}
                    buttonText="Se connecter avec Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    icon={<LazyLoadImage src={"/images/google-icon.png"} alt={"google"} width={'15px'} className={'mr-2 p-0'}/>}
                   /* cookiePolicy={'single_host_origin'}*/

                />
            </>
        )
    }
}

export default ReseauSociaux;
