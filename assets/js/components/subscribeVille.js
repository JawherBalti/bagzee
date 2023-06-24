import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import Footer from "./Footer";
import {Container} from "react-bootstrap";
import Header from "./Header";
import { LazyLoadImage } from 'react-lazy-load-image-component';

var bgHeader = '/images/Groupeamis.png';

class subscribeVille extends Component {

    constructor() {
        super();
        this.state = {
            ville: [],
            preInscription:
                {
                    email: "",
                    ville: "",
                }
        }
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        axios.get('api/ville/get').then(res => {
            this.setState({ville: res.data.ville})
        })
        let user = JSON.parse(localStorage.getItem('client'));
        if (user) {
            this.setState(prevState => ({
                preInscription: {
                    ...prevState.preInscription,
                    email: user.client.email
                }
            }), () => console.log(this.state));
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState(prevState => ({
            preInscription: {
                ...prevState.preInscription,
                [name]: value
            }
        }), () => console.log(this.state.preInscription));


    }

    formSubmit(event) {

        event.preventDefault();

        axios.post('api/preinscription/create', {
            email: this.state.preInscription.email,
            ville: this.state.preInscription.ville
        }).then(res => {
            console.log()
            event.target.elements[0].value = ''
            event.target.elements[1].value = ''
            /* this.setState({
                 preInscription:{
                     email:'',
                     ville:''
                 }
             })*/
            if (res.data.status == true) {
                Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-success pt-2"}>Votre Inscription est bien pris en compte, vous serez
                                informé de l'arrivée de Bagzee dans votre ville.</p>
                            <span>L'équipe Bagzee vous remercie</span>
                        </div>),
                    okText: 'Ok',
                });
            } else {
                Modal.success({
                    content: (
                        <div className={"text-center"}>
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
            <div className={"profil_blocks Messagerie h-100"}>
                <Header/>
                <div className={"Header py-2 px-4"}
                     style={{
                         backgroundImage: 'url(/images/bgHoverHeader.png),url(' + bgHeader + ')',
                         minHeight: 'calc(100vh - 386px)',height:'max-content'
                     }}>
                    <div className={"row justify-content-center mt-5 mb-3"}>
                        <div className={"col-md-7 p-4"}>
                            <h2 className={'text-white text-center h1 mb-3'}>Bagzee arrive bientôt <br/>dans ta ville</h2>
                            <h6 className={'grayText text-center mb-3'}>5€ offerts à chaque pré-inscription<br/>
                                Tu recevras seulement 1 mail pour t'informer quand<br/>Bagzee arrive dans ta ville 👇👇
                            </h6>
                            <form style={{maxWidth: '300px'}} className={'mx-auto preinscription'}
                                  onSubmit={this.formSubmit}>
                                <div className={"mb-4"}>
                                    <div className={"d-block"}>
                                        <input type={"email"} required placeholder={'Mon e-mail'} name={"email"}
                                               style={{backgroundImage: 'url(/images/email-icon.png'}}
                                               value={this.state.preInscription.email}
                                               onChange={this.handleChange}/>
                                    </div>
                                </div>

                                <div className={"mb-4"}>

                                    <div className={"d-block"}>
                                        <select multiple={false} name={"ville"} required onChange={this.handleChange}
                                                style={{backgroundImage: 'url(/images/ville-icon.png'}}>

                                            <option value={''} disabled selected>Ma ville</option>

                                            {this.state.ville.map(ville =>
                                                ville.hasActivity ? null :
                                                    <option style={{color: '#000'}} key={ville.id}
                                                            value={ville.id}>{ville.name}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className={"d-block text-center"}>
                                    <button className="btn-blue w-100" type="submit">
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

}

export default subscribeVille;