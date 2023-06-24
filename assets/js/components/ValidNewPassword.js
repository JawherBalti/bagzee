import React, {Component} from "react";
import Footer from "./Footer";
import { Form, Input, Modal} from "antd";
import axios from "axios";
import {Redirect} from 'react-router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Header from "./Header";


class ValidNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '', valid: true, validP: false, redirect: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        console.log(props.match.params.token)
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    redirectNow = () => {

        this.setState({redirect: true});
    }

    formSubmit(event) {
        let token = this.props.match.params.token
        event.preventDefault();
        axios.post('api/profil/forget/password/update', {password: this.state.password,token:token}).then(res => {
            let status = res.data.status
            let message = res.data.message
            setTimeout( ()=> {
                console.log(message)
                const modal = Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={status?"text-success pt-2":"text-danger pt-2"}>
                                {message}
                            </p>

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
                if (status) {
                    this.redirectNow();
                }
            }, 50)
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;

        this.setState({password: value}, () => {
            console.log(this.state)
        });
    }

    render() {

        if (this.state.redirect) {
            return <Redirect to='/'/>;
        } else {
            return (
                <div className={'HomeSection landing'}>
                    <Header/>
                    <form name={'new_pasword'} onSubmit={this.formSubmit}
                          className={'container text-center my-5 validPassword '}
                          style={{width: 'max-content'}}>
                        <h4 className={'mb-5'}>Entrez votre nouveau mot de passe</h4>
                        <Form.Item
                            name="password"
                            label="Mot de passe"
                            rules={[
                                {
                                    required: true,
                                    message: 'Mot de passe ne doit pas être vide!',
                                },{
                                    pattern: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$',
                                    message: 'Mot de passe doit être à 6 caractéres au minimum avec une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial',
                                }
                            ]}

                        >
                            <Input.Password onChange={this.handleChange}/>
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirmation mot de passe"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Confirmer mot de passe ne doit pas être vide!',
                                }
                            ]}
                        >
                            <Input.Password onChange={(e) => {
                                if (e.target.value !== this.state.password) {
                                    return this.setState({valid: false})

                                } else {
                                    return this.setState({valid: true, validP: true})

                                }
                            }}/>
                            {!this.state.valid ?
                                <p className={'text-danger'}>Les deux mot de passe ne sont pas identiques</p> : null}
                        </Form.Item>
                        <button className={!(this.state.valid && this.state.validP) ? "btn-blue disabled" : "btn-blue "}
                                type="submit">
                            Enregistrer
                        </button>
                    </form>
                    <Footer/>
                </div>
            )
        }

    }
}

export default ValidNewPassword;
