import React, {Component, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faFilter, faSearch} from "@fortawesome/free-solid-svg-icons";
import {InfoCircleOutlined} from "@ant-design/icons";
import {Button, Form, Input, Modal, Tooltip} from "antd";
import axios from "axios";
import moment from "moment";
import Search from "antd/es/input/Search";
import SearchInput, {createFilter} from 'react-search-input'
import { LazyLoadImage } from 'react-lazy-load-image-component';

const KEYS_TO_FILTERS = ['activity.name', 'detail.nom', 'detail.email']


class Evenement extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            loading: true,
            encours: true,
            historique: false,
            nbreOrderAccepter: 0,
            nbreOrderRefuse: 0,
            dateDeb: '',
            dateFin: '',
            dateDebLongFormat: '',
            dateFinLongFormat: '',
            searchTerm: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSearch = this.onSearch.bind(this)
    }

    onSearch = value => {
        this.setState({searchTerm: value})
    };

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('partenaire'));
        this.setState({partenaire: user.partenaire}, () => {
            let token = this.state.partenaire.token
            this.getOrders(token, this.state.dateDeb, this.state.dateFin)
        })

    }

    getOrders(token, dateDeb, dateFin) {
        axios.post(`api/order/partenaire/get`, {"token": token, "start": dateDeb, "end": dateFin}).then(res => {
            let length = res.data.orders.length
            if (length > 0) {
                let dateDeb = res.data.orders[length - 1].activity.date
                let dateDebAr = this.arabDate(res.data.orders[length - 1].activity.date)
                let dateFin = res.data.orders[0].activity.date
                let dateFinAr = this.arabDate(res.data.orders[0].activity.date)
                this.setState({
                    orders: res.data.orders,
                    token: token,
                    nbreOrderAccepter: res.data.nbreOrderAccepter,
                    nbreOrderRefuse: res.data.nbreOrderRefuse,
                    dateDeb: dateDebAr,
                    dateFin: dateFinAr
                }, () => {
                    this.longFormat(dateDeb, dateFin)
                    this.setState({loading: false})
                })
            } else {
                this.setState({loading: false})
            }
        })
    }

    longFormat(dateDeb, dateFin) {
        const [ddd, mdd, ydd] = dateDeb.split('-')
        const date1 = new Date(ydd, mdd - 1, ddd);  // 2009-11-10
        const dateD1 = date1.toLocaleString('fr', {dateStyle: 'medium'});

        const [ddf, mdf, ydf] = dateFin.split('-')
        const date2 = new Date(ydf, mdf - 1, ddf);  // 2009-11-10
        const dateF1 = date2.toLocaleString('fr', {dateStyle: 'medium'})

        const dateF = dateF1.split('.')[0];
        const dateD = dateD1.split('.')[0];
        this.setState({dateDebLongFormat: dateD, dateFinLongFormat: dateF})
    }

    startDuree(hfrom, hto) {
        const [hoursF, minutesF] = hfrom.split(':');
        const [hoursT, minutesT] = hto.split(':');
        const totalSecondeFrom = (hoursF * 60 * 60) + (minutesF * 60)
        const totalSecondsTo = (hoursT * 60 * 60) + (minutesT * 60)
        let newTotalSeconds = totalSecondsTo - totalSecondeFrom
        return this.secondsToTime(newTotalSeconds)
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        if (hours < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        let obj = hours + ':' + minutes + 'h'

        return obj;
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            ...prevState,    // keep all other key-value pairs
            [name]: value

        }));
    }

    getOrdersByDate(date1, date2) {
        const [dd1, mm1, yy1] = date1.split('-');
        const [dd2, mm2, yy2] = date2.split('-');
        let date11 = yy1 + '-' + mm1 + '-' + dd1
        let date22 = yy2 + '-' + mm2 + '-' + dd2
        axios.post(`api/order/partenaire/get`, {"token": this.state.token, "start": date1, "end": date2}).then(res => {
            this.setState({
                orders: res.data.orders,
                nbreOrderAccepter: res.data.nbreOrderAccepter,
                nbreOrderRefuse: res.data.nbreOrderRefuse,
            }, () => {
                this.setState({loading: false})
            })
        })
        this.longFormat(date11, date22)
    }

    arabDate(date) {
        const [dd, mm, yy] = date.split('-');
        date = yy + '-' + mm + '-' + dd
        return date
    }

    render() {
        let loading = this.state.loading

        const filteredOrders = this.state.orders.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
        const CollectionCreateFormCause = ({
                                               visibleCause,
                                               onCreateCause,
                                               onCancelCause
                                           }) => {
            const [form] = Form.useForm();
            return (
                <Modal
                    visible={visibleCause}
                    okText="Annuler la reservation"
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateCause(values);

                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    onCancel={onCancelCause}
                    footer={[
                        <Button key="submit" type="primary" className={'w-100'} onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    onCreateCause(values);
                                })
                                .catch((info) => {
                                    console.log('Validate Failed:', info);
                                });

                        }}>Annuler la reservation
                        </Button>,


                    ]}
                >
                    <div className={'text-center'}>
                        <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} width={'65px'}/><br/>
                    </div>
                    <Form
                        form={form}
                        layout="vertical"
                        name="form_cause_in_evenement"
                        requiredMark={false}

                    >
                        <Form.Item
                            name="cause"
                            label="Cause de l'annulation"
                            rules={[
                                {
                                    required: true,
                                    message: 'Cause ne doit pas etre vide',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                    </Form>
                </Modal>
            );
        };
        const CollectionsPageCause = (props) => {
            const [visibleCause, setVisibleCause] = useState(false);

            const onCreateCause = (values) => {
                axios.post(`api/order/partenaire/refuser`, {
                    "token": this.state.token, "id": props.order, "cause": values.cause
                }).then(function (res) {
                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"} key={'cancel-order-' + Math.random()}>
                                <LazyLoadImage src={"/images/logo.png"} width={'65px'} alt={"bagzee"}/>

                                <p className={"text-success pt-2"}>
                                    {res.data.message}
                                </p>

                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                    }, 5000);
                })
                window.location.reload(false);

                setVisibleCause(false);

            };

            return (
                <span>
                    <span

                        onClick={() => {
                            setVisibleCause(true);
                        }}
                    >
                        Annuler
                    </span>
                    <CollectionCreateFormCause key={'annuler-order-' + Math.random()}
                                               visibleCause={visibleCause}
                                               onCreateCause={onCreateCause}
                                               onCancelCause={() => {
                                                   setVisibleCause(false);
                                               }}
                    />
                </span>
            );
        };

        return (
            <div className={"profil_blocks Reservation evenement Information"}>
                <div className={"container-fluid py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-12 my-3"}>
                            <h5 className={"centrage-y"}>Mon compte > Réservations</h5>
                        </div>
                    </div>
                </div>
                {loading ?
                    <div className={"container-fluid py-2 px-4 statistique bg-white"}>
                        <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">
                        </span>
                        </p>
                    </div> : <>
                        <div className={"container-fluid py-2 px-4 statistique bg-white"}>
                            <div className={"row mb-3"}>
                                <div className={"col-lg-3 col-md-4 pt-4 mb-4"}>
                                    <p className={'whiteBlock m-0'}
                                       style={{backgroundImage: "url('/images/nbrAct.png')"}}>
                                        <label>Nombre de réservation(s)</label>
                                        <h4>{this.state.orders.length}</h4>
                                    </p>
                                </div>
                                <div className={"col-lg-3 col-md-4 pt-4 mb-4"}>
                                    <p className={'whiteBlock m-0'}
                                       style={{backgroundImage: "url('/images/validee.png')"}}>
                                        <label>Validé(s)</label>
                                        <h4>{this.state.nbreOrderAccepter}</h4>
                                    </p>
                                </div>
                                <div className={"col-lg-3 col-md-4 pt-4 mb-4"}>
                                    <p className={'whiteBlock m-0'}
                                       style={{backgroundImage: 'url(/images/annulee.png)'}}>
                                        <label>Annulé(s)</label>
                                        <h4>{this.state.nbreOrderRefuse}</h4>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={"container-fluid tableau py-2"}>
                            <div className={"row mb-3 mx-0"}>
                                <div className={"col-12 p-0"}>
                                    <ul className={" Navbar_Profil pt-4 mb-4"} style={{borderBottom: '1px solid #eee'}}>
                                        <li>
                                            <button className={this.state.encours ? 'clicked' : null} onClick={() => {
                                                this.getOrders(this.state.token, '', '')
                                                this.setState({encours: true, historique: false})
                                            }}>En Cours
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={() => {
                                                this.setState({encours: false, historique: true})
                                            }}>Historique
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className={"row mx-0"}>
                                <div className={'col-6 order-1 col-lg-3 mb-3'}>
                                    <SearchInput placeholder={'Chercher'} onChange={this.onSearch}
                                                 style={{width: '100%'}}/>

                                </div>
                                <div className={'order-3 order-lg-2 col-4 col-lg-2 mb-3'}>
                                    <input type={'date'} onChange={this.handleChange} name={'dateDeb'}
                                           style={{minWidth: 'max-content'}}
                                           value={this.state.dateDeb}/>
                                </div>
                                <div className={'order-4 order-lg-3 col-4 col-lg-2 mb-3'}>
                                    <input type={'date'} onChange={this.handleChange} name={'dateFin'}
                                           style={{minWidth: 'max-content'}}
                                           value={this.state.dateFin}/>
                                </div>
                                <div className={'col-4 order-5 order-lg-4 col-lg-1 mb-3'}>
                                    <button className={'filter'} onClick={() => {
                                        this.getOrdersByDate(this.state.dateDeb, this.state.dateFin)
                                    }}>
                                        <FontAwesomeIcon icon={faFilter}/> Filter
                                    </button>
                                </div>
                                <div className={'col-6 order-2 order-lg-5 col-lg-4 text-md-right text-center'}>
                                    <h4 className={'text-capitalize'}>
                                        {this.state.dateDebLongFormat} - {this.state.dateFinLongFormat}
                                    </h4>

                                </div>
                            </div>
                            <div className={"row mb-3"}>

                                <div className={"col-12 pt-4 mb-4"}>
                                    <div className={"row mb-3 headerTab"}>
                                        <div className={"col-md-2"}>
                                            <label>Activité</label>
                                        </div>
                                        <div className={"col-md-2"}>
                                            <label>Client</label>
                                        </div>
                                        <div className={"col-md-2"}>
                                            <label>Réservation</label>
                                        </div>
                                        <div className={"col-md-1"}>
                                            <label>Durée</label>
                                        </div>
                                        <div className={"col-md-3"}>
                                            <label>Date/Heure</label>
                                        </div>
                                        <div className={"col-md-2"}>
                                            <label><span>Statut <Tooltip title="statut de l'événement">
                                        <InfoCircleOutlined/>
                                    </Tooltip>
                                        </span></label>
                                        </div>
                                    </div>
                                    {this.state.historique ?
                                        filteredOrders.map(order =>
                                            <div className={"row "} key={'reservation-' + order.id}>
                                                {order.status != 0 ?
                                                    <div className={' col-md-12 px-2 py-4 bg-white '}>
                                                        <div className={"row"}>
                                                            <div className={"col-md-2"}>
                                                                <label>
                                                                    {order.activity.name}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-2 text-center"}>
                                                                <label style={{minHeight: '80px'}}>
                                                                    {order.detail.nom} {order.detail.prenom} <br/>
                                                                    {order.detail.phone}<br/>
                                                                    {order.detail.email}<br/>
                                                                    {order.detail.emails.length>0?order.detail.emails.map(e=>
                                                                        e.email?<>{e.email}<br/></> :null
                                                                    ):null}
                                                                    {order.nbreTicket} Ticket{order.nbreTicket > 1 ? 's' : null}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-2"}>
                                                                <label>
                                                                    {order.activity.nbreOfPlaceRest}/{order.activity.nbreOfPlace}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-1"}>
                                                                <label>
                                                                    {this.startDuree(order.activity.hFrom, order.activity.hTo)}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-3"}>
                                                                <label style={{minHeight: '70px'}}>
                                                                    {order.activity.date}<br/>
                                                                    {order.activity.hFrom} - {order.activity.hTo}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-2 status text-center"}>
                                                                {order.status == 0 ?
                                                                    null :
                                                                    order.status == 1 || (order.status == 6 && moment(new Date(order.activity.date.split('-')[2] + "-" + order.activity.date.split('-')[1] + "-" + order.activity.date.split('-')[0] + "T" + order.activity.hFrom + ":00")).diff(moment(new Date()), 'seconds') > 0) ?
                                                                        <span className={'btnValider'}
                                                                              style={{borderRadius: '50px'}}>Confirmé & en attente de validation</span> :
                                                                        order.status == 2 ?
                                                                            <span className={'btnCancel'}
                                                                                  style={{borderRadius: '50px'}}>Non confirmé</span> :
                                                                            order.status == 3 || order.status == -1 ?
                                                                                <span className={'btnCancel'}
                                                                                      style={{borderRadius: '50px'}}>Annulé</span> :
                                                                                order.status == 5 ?
                                                                                    <span className={'btnCancel'}
                                                                                          style={{borderRadius: '50px'}}>Activité Annulé</span> :
                                                                                    (order.status == 6 && moment(new Date(order.activity.date.split('-')[2] + "-" + order.activity.date.split('-')[1] + "-" + order.activity.date.split('-')[0] + "T" + order.activity.hFrom + ":00")).diff(moment(new Date()), 'hours') <= 0) ?
                                                                                        <span
                                                                                            className={'btnValider'}
                                                                                            style={{borderRadius: '50px'}}
                                                                                        >Réalisé</span> : null


                                                                }

                                                            </div>
                                                            <div className={"col-md-12 position-absolute bottom-0"}>
                                                                {order.detail.msg !== "" ?
                                                                    <p className={"mb-0 text-danger text-center font-italic fs-small"}>{order.cause}</p>
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div> : null
                                                }
                                            </div>
                                        ) :
                                        filteredOrders.map(order =>
                                            <div className={"row "} key={'reservation-' + order.id}>
                                                {moment(new Date(order.activity.date.split('-')[2] + "-" + order.activity.date.split('-')[1] + "-" + order.activity.date.split('-')[0] + "T" + order.activity.hFrom + ":00")).diff(moment(new Date()), 'seconds') > 0 ?
                                                    <div className={' col-md-12 px-2 py-4 bg-white '}>
                                                        <div className={"row"}>
                                                            <div className={"col-md-2"}>
                                                                <label>
                                                                    {order.activity.name}
                                                                </label>
                                                            </div>

                                                            <div className={"col-md-2"}>
                                                                <label className={'text-center'}
                                                                       style={{minHeight: '80px'}}>
                                                                    {order.detail.nom} {order.detail.prenom} <br/>
                                                                    {order.detail.phone}<br/>
                                                                    {order.detail.email}<br/>
                                                                    {order.detail.emails.length>0?order.detail.emails.map(e=>
                                                                        e.email?<>{e.email}<br/></> :null
                                                                    ):null}
                                                                    {order.nbreTicket} Ticket{order.nbreTicket > 1 ? 's' : null}

                                                                </label>
                                                            </div>
                                                            <div className={"col-md-2"}>
                                                                <label>
                                                                    {order.activity.nbreOfPlaceRest}/{order.activity.nbreOfPlace}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-1"}>
                                                                <label>
                                                                    {this.startDuree(order.activity.hFrom, order.activity.hTo)}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-3"}>
                                                                <label style={{minHeight: '70px'}}>
                                                                    {order.activity.date}<br/>
                                                                    {order.activity.hFrom} - {order.activity.hTo}
                                                                </label>
                                                            </div>
                                                            <div className={"col-md-2 status text-center"}>
                                                                {order.status == 0 ?
                                                                    <label className={'orderAction'}>
                                                                        <p className={'mb-2 w-100'}>
                                                                            <button className={"btnValider"}
                                                                                    onClick={() => {
                                                                                        axios.get(`/api/order/partenaire/accept?token=` + this.state.token + `&id=` + order.id).then(res => {
                                                                                            const modal = Modal.success({
                                                                                                content: (
                                                                                                    <div
                                                                                                        className={"text-center"}
                                                                                                        key={'accept-partenaire' + Math.random()}>
                                                                                                        <LazyLoadImage
                                                                                                            src={"/images/logo.png"}
                                                                                                            width={'65px'}
                                                                                                            alt={"bagzee"}/>

                                                                                                        <p className={"text-success pt-2"}>
                                                                                                            {res.data.message}
                                                                                                        </p>

                                                                                                    </div>),
                                                                                                okText: 'ok',
                                                                                            });
                                                                                            setTimeout(() => {
                                                                                                modal.destroy();
                                                                                            }, 5000);
                                                                                            window.location.reload(false);
                                                                                        })
                                                                                    }}>Valider
                                                                            </button>
                                                                            <button className={"btnCancel"}>
                                                                                <CollectionsPageCause order={order.id}/>
                                                                            </button>
                                                                            <FontAwesomeIcon icon={faComments}
                                                                                             className={"comment float-right"}/>
                                                                        </p>
                                                                        <p className={'fs-small w-100 text-left m-0'}>En
                                                                            attente de
                                                                            validation</p>
                                                                    </label> :
                                                                    order.status == 1 || (order.status == 6 && moment(new Date(order.activity.date.split('-')[2] + "-" + order.activity.date.split('-')[1] + "-" + order.activity.date.split('-')[0] + "T" + order.activity.hFrom + ":00")).diff(moment(new Date()), 'seconds') > 0) ?
                                                                        <span className={'btnValider'}
                                                                              style={{borderRadius: '50px'}}>Confirmé & en attente de validation</span> :
                                                                        order.status == 2 ?
                                                                            <span className={'btnCancel'}
                                                                                  style={{borderRadius: '50px'}}>Non confirmé</span> :
                                                                            order.status == 3 || order.status == -1 ?
                                                                                <span className={'btnCancel'}
                                                                                      style={{borderRadius: '50px'}}>Annulé</span> :
                                                                                order.status == 5 ?
                                                                                    <span className={'btnCancel'}
                                                                                          style={{borderRadius: '50px'}}>Activité Annulé</span> :
                                                                                    (order.status == 6 && moment(new Date(order.activity.date.split('-')[2] + "-" + order.activity.date.split('-')[1] + "-" + order.activity.date.split('-')[0] + "T" + order.activity.hFrom + ":00")).diff(moment(new Date()), 'hours') <= 0) ?
                                                                                        <span
                                                                                            className={'btnValider'}
                                                                                            style={{borderRadius: '50px'}}
                                                                                        >Réalisé</span> : null
                                                                }

                                                            </div>
                                                            <div className={"col-md-12 position-absolute bottom-0"}>
                                                                {order.detail.msg !== "" ?
                                                                    <p className={"mb-0 text-danger text-center font-italic fs-small"}>{order.cause == 'Vous avez annulé ce créneau' ? 'Ce créneau a été annulé par le client' : order.cause}</p>
                                                                    : null
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                                }
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </>}

            </div>
        )
    }

}

export default Evenement;