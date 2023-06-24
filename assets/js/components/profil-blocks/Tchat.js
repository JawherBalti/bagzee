import React, {Component} from 'react';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {Modal} from "antd";
import {Link, NavLink} from "react-router-dom";


class Tchat extends Component {

    constructor() {
        super();
        this.state = {
            messagerie: [],
            sender: {},
            receiver: {},
            send: '',
            loading: true,
            client: {token: '', id: ''},
            orders: [],
            idActSelected: '',
            users: [],
            idUserSelected: ''

        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.getMsgByuser = this.getMsgByuser.bind(this);

    }

    handleChange(event) {
        this.setState({
            send: event.target.value
        });
    }

    getActivities() {
        axios.get(`api/order/getDistinct?token=` + this.state.client.token).then(orders => {
            this.setState({orders: orders.data.orders, loading: false})
        })
    }

    getMsgByuser(idUser) {
        axios.get('api/tchat/message/get?token=' + this.state.client.token + '&id_activity=' + this.state.idActSelected + '&id_user=' + idUser).then(res => {
            this.setState({
                messagerie: res.data.messagerie,
                receiver: res.data.receiver,
                sender: res.data.sender,
                idUserSelected: idUser
            })
        })
    }

    formSubmit(event) {
        event.preventDefault();
        axios.post(' api/tchat/message/send', {
                "token": this.state.client.token,
                "id_activity": this.state.idActSelected,
                "message": this.state.send,
                "id_user": this.state.idUserSelected
            }
        ).then(res => {
            if (res.status) {
                this.getMsgByuser(this.state.idUserSelected)
                this.state.send = '';
            }
        })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('client'))
        if (user)
            this.state.client.token = user.client.token
        this.state.client.id = user.client.id
        this.setState({
            client: {
                token: user.client.token,
                id: user.client.id
            }
        })
        this.getActivities()
    }

    getUsersbyActivity() {
        axios.get('api/tchat/users/all?token=' + this.state.client.token + '&id_activity=' + this.state.idActSelected).then(res => {
            this.setState({users: res.data.users}, () => {
                this.setState({loading: false})
            })
        })
    }

    render() {
        let loading = this.state.loading
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
                        {loading ?
                            <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">
                                </span>
                            </p> :
                            <>
                                {this.state.orders.length > 0 ?
                                    <div className={"col-md-7 bg-white p-4"}>
                                        <div className={"row"}>
                                            <div className={"col-md-4 premier-block d-sm-block d-none"}>
                                                {this.state.orders.map(order =>
                                                    <div className={"row  mb-2"} key={'reservation-' + order.id}
                                                         onClick={() => {
                                                             axios.get('api/tchat/users/all?token=' + this.state.client.token + '&id_activity=' + order.activity.id).then(res => {
                                                                 this.setState({
                                                                     users: res.data.users,
                                                                     idActSelected: order.activity.id
                                                                 })
                                                             })
                                                         }}>
                                                        {order.status == 1 ?
                                                            <Link activeClassName={"active"}
                                                                  className={' col-md-12 p-2 bg-white'}>
                                                                <div className={"row"}>
                                                                    <div className={"col-md-12"}>
                                                                        <label
                                                                            className={'d-flex align-items-center mb-0'}>
                                                                            {order.activity.img === "" ?
                                                                                <div className={'imgActResTchat'}
                                                                                     style={{backgroundImage: 'url(/images/avatar-person.png)'}}>

                                                                                </div> :
                                                                                <div className={'imgActResTchat'}
                                                                                     style={{backgroundImage: 'url(/uploads/' + order.activity.sousCentreInteret + ')'}}>

                                                                                </div>
                                                                            }
                                                                            <span>{order.activity.name}</span>
                                                                        </label>


                                                                    </div>
                                                                </div>
                                                            </Link> : null}
                                                    </div>
                                                )}
                                            </div>
                                            <ul className={'col-md-4 premier-block mobile-activity mb-3 d-sm-none d-block'}>
                                                {this.state.orders.map(order =>
                                                    <li key={'reservation-' + order.id} onClick={() => {
                                                        axios.get('api/tchat/users/all?token=' + this.state.client.token + '&id_activity=' + order.activity.id).then(res => {
                                                            this.setState({
                                                                users: res.data.users,
                                                                idActSelected: order.activity.id
                                                            })
                                                        })
                                                    }}>
                                                        {order.photo === "" ?
                                                            <div className={'imgActResTchat'}
                                                                 style={{backgroundImage: 'url(/images/avatar-person.png)'}}>

                                                            </div> :
                                                            <div className={'imgActResTchat'}
                                                                 style={{backgroundImage: 'url(/uploads/' + order.activity.sousCentreInteret + ')'}}>

                                                            </div>
                                                        }
                                                        <p className={'mb-0'}>{order.activity.name}</p>
                                                    </li>
                                                )}</ul>
                                            <div className={"col-md-8  deuxieme-block"}>
                                                <div className={"row"}>
                                                    <div className={"col-md-12 users"}>
                                                        {this.state.users.length ?
                                                            <ul className={this.state.users.length ? 'Navbar_Profil text-center' : null}>
                                                                {this.state.users.map(user =>
                                                                    <li key={user.id}
                                                                        onClick={() => this.getMsgByuser(user.id)}>
                                                                        {user.photo === "" ?
                                                                            <div className={'imgActResTchat'}
                                                                                 style={{backgroundImage: 'url(/images/avatar-person.png)'}}>

                                                                            </div> :
                                                                            <div className={'imgActResTchat'}
                                                                                 style={{backgroundImage: 'url(' + user.photo + ')'}}>

                                                                            </div>
                                                                        }
                                                                        <p className={'mb-0'}>{user.firstName}</p>
                                                                    </li>
                                                                )}</ul> : <p>Pas de participants pour le moment.</p>}
                                                    </div>
                                                    {(this.state.users.length && this.state.messagerie.length) ?
                                                        <div
                                                            className={this.state.messagerie.length == 0 ? null : "col-md-12 msgs"}>
                                                            {this.state.messagerie.map(msg =>
                                                                <div className={"row m-0"} key={'messagerie-' + msg.id}>

                                                                    <div className={'col-md-12 px-2 ' + msg.sender}>
                                                                        {msg.sender == 'vous' ?

                                                                            <h6>{this.state.sender.lastName} {this.state.sender.firstName}
                                                                                <small>{msg.date}</small></h6> :
                                                                            <h6>{this.state.receiver.lastName} {this.state.receiver.firstName}
                                                                                <small>{msg.date}</small></h6>
                                                                        }

                                                                        <p className={'mb-0'}
                                                                           style={{whiteSpace: "pre-wrap"}}>  {msg.message}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        </div> : null}
                                                    {(this.state.users.length && this.state.receiver.id) ?
                                                        <div className={'col-md-12 text-center mt-3'}>
                                            <textarea rows={'2'} name={'send'} value={this.state.send}
                                                      className={'w-100'}
                                                      onChange={this.handleChange}/>
                                                            <button className={'btn-default'}
                                                                    onClick={this.formSubmit}>Envoyer
                                                            </button>
                                                        </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <form onSubmit={this.formSubmit}>
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
                                    <button className="btn-blue" type="submit">
                                        Envoyer
                                    </button>
                                </div>
                            </form>*/}
                                    </div> :
                                    <div className={'col-12 pt-5 mt-5 mb-4 text-center'}>
                                        Aucune réservation à afficher pour le moment, réserve vite afin de découvrir
                                        Bagzee avec tes amis 😁</div>
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Tchat;