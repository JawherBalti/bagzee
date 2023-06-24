import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {user} from '../../app'


class Messagerie extends Component {

    constructor() {
        super();
        this.state = {
            messagerie: [
                {
                    email: "",
                    sujet: "",
                    message: "",
                }
            ]

        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState(prevState => ({
            messagerie: [{
                ...prevState.messagerie[0],
                email: user.client.email
            }]
        }));
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            messagerie: [{
                ...prevState.messagerie[0],
                [name]: value
            }], disabled: false
        }));
    }

    formSubmit(event) {
        this.setState({disabled: true});
        event.preventDefault();
        axios.post('api/contact/create', {messagerie: this.state.messagerie}).then(res => {
            this.setState(prevState => ({
                disabled: false,
                messagerie: [
                    {
                        ...prevState.messagerie[0],
                        sujet: "",
                        message: "",
                    }
                ]
            }))
            if (res.data.status == true) {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'Messagerie-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-success pt-2"}>votre message a bien été transmis et sera traité sous
                                48h</p>
                            <span>L'équipe Bagzee vous remercie</span>
                        </div>),
                    okText: 'Ok',
                });
            } else {
                Modal.success({
                    content: (
                        <div className={"text-center"} key={'Messagerie-error-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-danger pt-2"}>{res.data.message}</p>
                        </div>),
                    okText: 'Ok',
                });
            }
        })


    }

    render() {

        return (
            <div className={"profil_blocks Messagerie"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-12 my-3"}>
                            <h5 className={"centrage-y"}>Mon compte > Messagerie</h5>
                        </div>
                    </div>
                </div>
                <div className={"container py-2 px-4"}>
                    <div className={"row justify-content-center mt-5 mb-3"}>
                        <div className={"col-md-7 bg-white p-4"}>
                            <form onSubmit={this.formSubmit}>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Email</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"email"} name={"email"} value={this.state.messagerie[0].email}
                                               onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Sujet</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <input type={"text"} name={"sujet"} value={this.state.messagerie[0].sujet}
                                               onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <label className={"centrage-y"}>Message</label>
                                    </div>
                                    <div className={"d-block"}>
                                        <textarea name={"message"} value={this.state.messagerie[0].message}
                                                  onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <div className={"d-block text-md-right"}>
                                    <button className={this.state.disabled ? "btn-blue disabled" : "btn-blue"}
                                            type="submit">
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Messagerie;