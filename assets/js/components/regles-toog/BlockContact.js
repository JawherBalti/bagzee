import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";
import {user} from '../../app'
class Messagerie extends Component {

    constructor() {
        super();
        this.state = {
            messagerie:
                {
                    firstName: "",
                    lastName: "",
                    phone: "",
                    email: "",
                    subject: "",
                    content: "",

                }
            , disabled: false

        };
        console.log('contact constr')
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);

    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log(event)
        this.setState(prevState => ({
            messagerie: {
                ...prevState.messagerie,
                [name]: value
            }
        }));
    }

    formSubmit(event) {
        event.preventDefault();
        this.setState({disabled: true});
        axios.post('/api/contact/create', this.state.messagerie).then(res => {
            this.setState(prevState => ({
                disabled: false,
                messagerie:
                    {
                        ...prevState.messagerie,
                        subject: "",
                        content: "",
                    }
            }))
            if (res.data.status == true) {
                Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}/>
                            <p className={"text-success pt-2"}>{this.props.t('page_contact.success_modal')}</p>
                            <span>{this.props.t('remerciment')}</span>
                        </div>),
                    okText: 'Ok',
                });
            } else {
                Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}/>
                            <p className={"text-danger pt-2"}>{res.data.message}</p>
                        </div>),
                    okText: 'Ok',
                });
            }
        })

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if (user) {
            this.setState(prevState => ({
                messagerie: {
                    ...prevState.messagerie,
                    firstName: user.client.firstName,
                    lastName: user.client.lastName,
                    email: user.client.email,
                    phone: user.client.phone
                }
            }));
        }

    }

    render() {
        const {t} = this.props;
        return (
            <div className={"profil_blocks Information"}>
                <div className={"container-fluid "}>
                    <div className={"m-xl-5 p-xl-5 m-2 p-2"}>
                        <div className={"row"}>
                            <div className={"col-md-5 my-3"}>

                                <p className={'d-flex justify-content-start align-items-center'}>
                                    <LazyLoadImage src={"/images/icontel.png"} alt={"iconmail"}
                                                   className={'mr-4'}/>
                                    <span>{t('tel')}<br/>06 25 45 43 50</span>
                                </p>
                            </div>
                            <div className={"col-md-5 my-3"}>
                                <p className={'d-flex justify-content-start align-items-center'}>
                                    <LazyLoadImage src={"/images/iconmail.png"} alt={"iconmail"}
                                                   className={'mr-4'}/>
                                    <span>{t('email')}<br/>hugo.serres@bagzee.fr</span></p><br/>

                            </div>
                            <div className={"col-md-6 my-3"}>

                                <form onSubmit={this.formSubmit}>
                                    <div className={"row mb-4"}>
                                        <div className={"col-lg-6 mb-4"}>
                                            <div className={"d-block"}>
                                                <label className={"centrage-y requis"}>{t('prenom')}</label>
                                            </div>
                                            <div className={"d-block"}>
                                                <input type={"text"} name={"firstName"}
                                                       required   value={this.state.messagerie.firstName}
                                                       onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className={"col-lg-6 mb-4"}>
                                            <div className={"d-block"}>
                                                <label className={"centrage-y requis"}>{t('nom')}</label>
                                            </div>
                                            <div className={"d-block"}>
                                                <input type={"text"} name={"lastName"}
                                                       required    value={this.state.messagerie.lastName}
                                                       onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"row mb-4"}>
                                        <div className={"col-lg-6 mb-4"}>
                                            <div className={"d-block"}>
                                                <label className={"centrage-y requis"}>{t('email')}</label>
                                            </div>
                                            <div className={"d-block"}>
                                                <input type={"email"} name={"email"}
                                                       required     value={this.state.messagerie.email}
                                                       onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className={"col-lg-6 mb-4"}>
                                            <div className={"d-block"}>
                                                <label className={"centrage-y requis"}>{t('num')}</label>
                                            </div>
                                            <div className={"d-block"}>
                                                <input type={"tel"} minLength={10} maxLength={10}
                                                       required     placeholder={'0600000000'} name={"phone"}
                                                       value={this.state.messagerie.phone}
                                                       onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={"mb-4"}>
                                        <div className={"d-block"}>
                                            <label className={"centrage-y requis"}>{t('page_contact.sujet')}</label>
                                        </div>
                                        <div className={"d-block"}>
                                            <input type={"text"} name={"subject"} value={this.state.messagerie.subject}
                                                   required   onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className={"mb-4"}>
                                        <div className={"d-block"}>
                                            <label className={"centrage-y requis"}>{t('page_contact.message')}</label>
                                        </div>
                                        <div className={"d-block"}>
                                        <textarea name={"content"} value={this.state.messagerie.content} rows={'4'}
                                               required   onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                    <div className={"d-block text-center"}>
                                        <button className={this.state.disabled ? "btn-blue disabled" : "btn-blue"}
                                                type="submit">
                                            {t('btns.envoyer')}
                                        </button>
                                    </div>
                                </form>

                            </div>
                            <div className={"col-md-6 my-3"}>
                                <div style={{
                                    backgroundImage: "url(/images/contact_Bagzee.png)",
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    height: '100%',
                                    minHeight: '300px'
                                }}>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withTranslation()(Messagerie);