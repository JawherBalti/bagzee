import React, {Component} from 'react';
import {Modal} from 'antd';
import axios from "axios";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {user} from '../../app'

import {Redirect} from 'react-router';

class Signalement extends Component {

    constructor() {
        super();
        this.state = {
            redirect: false,
            orders: [], token: '', loading: true,
            signalement: [
                {
                    evenement: "",
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
        if (user)
            this.state.token = user.client.token
        this.getOrders();
    }

    getOrders() {
        axios.get(`api/order/getDistinct?token=` + this.state.token).then(orders => {
            this.setState({orders: orders.data.orders, loading: false})
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name == 'evenement') {

            const index = target.selectedIndex;
            const el = target.childNodes[index]
            const option = el.getAttribute('id');
            this.setState(precState => ({
                signalement: [{
                    ...precState.signalement[0],
                    [name]: value,
                    id: option
                }]
            }), () => console.log(this.state.signalement[0]));
        } else {
            this.setState(precState => ({
                signalement: [{
                    ...precState.signalement[0],
                    [name]: value
                }]
            }));
        }
    }

    formSubmit(event) {
        event.preventDefault();
        let state = this.state.signalement[0];
        console.log(state)
        axios.post('api/signalement/create?token=' + this.state.token, {signalement: this.state.signalement}).then(res => {
            if (res.data.status == true) {

                const modal = Modal.success({
                    content: (
                        <div className={"text-center"}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-success pt-2"}>votre message a bien été transmis et sera traité sous
                                48h</p>
                            <span style={{color: '#8d8d8d', paddingTop: '10px'}}>L'équipe Bagzee vous remercie</span>
                        </div>),
                    okText: 'Revenir aux activités',

                });
                setTimeout(() => {
                    modal.destroy();
                    this.setState({redirect: true}, () => {
                        window.location.reload(false);
                    })
                }, 5000);
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
        let loading = this.state.loading;
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        } else {
            return (
                <div className={"profil_blocks Sinalement "}>
                    <div className={"container py-2 px-4"}>
                        <div className={"row"}>
                            <div className={"col-12 my-3"}>
                                <h5 className={"centrage-y"}>Mon compte > Signalement</h5>
                            </div>
                        </div>
                    </div>
                    <div className={"container py-2 px-4"}>
                        <div className={"row justify-content-center mt-5 mb-3"}>
                            {loading ?
                                <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                                </p>
                                :
                                <>
                                    {this.state.orders.length > 0 ?
                                        <div className={"col-md-7 bg-white p-4"}>
                                            <form onSubmit={this.formSubmit}>
                                                <div className={"mb-4"}>
                                                    <div className={"d-block"}>
                                                        <label className={"requis centrage-y"}>Événements</label>
                                                    </div>
                                                    <div className={"d-block"}>
                                                        <select required={true} name={"evenement"}
                                                                style={{color: '#000'}}
                                                                value={this.state.signalement[0].evenement}
                                                                onChange={this.handleChange}>
                                                            <option value="" disabled>Sélectionner un événement</option>
                                                            {this.state.orders.map(order =>
                                                                <option style={{color: '#000'}} key={order.id}
                                                                        id={order.activity.id}
                                                                        value={order.activity.name}> {order.activity.name}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className={"mb-4"}>
                                                    <div className={"d-block"}>
                                                        <label className={"requis centrage-y"}>Sujet</label>
                                                    </div>
                                                    <div className={"d-block"}>
                                                        <input required={true} type={"text"} name={"sujet"}
                                                               value={this.state.signalement[0].sujet}
                                                               onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                                <div className={"mb-4"}>
                                                    <div className={"d-block"}>
                                                        <label className={"requis centrage-y"}>Message</label>
                                                    </div>
                                                    <div className={"d-block"}>
                                        <textarea required={true} name={"message"}
                                                  value={this.state.signalement[0].message}
                                                  onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                                <div className={"d-block text-md-right"}>
                                                    <button className="btn-blue" type="submit">
                                                        Envoyer
                                                    </button>
                                                </div>


                                            </form>
                                        </div> :
                                        <div className={'col-12 text-center'}>Aucune réservation à afficher pour le
                                            moment,
                                            réserve vite afin de découvrir Bagzee avec tes amis 😁</div>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Signalement;