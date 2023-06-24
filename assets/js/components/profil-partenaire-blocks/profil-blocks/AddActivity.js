import React, {Component, useState} from 'react';
import {Button, Form, Input, Modal, Tooltip} from "antd";
import axios from "axios";
import {Link} from "react-router-dom";
import {faCheck, faClone, faCopy, faEdit, faTimes, faTimesCircle, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class AddActivity extends Component {
    constructor() {
        super();
        this.state = {
            activity: [], id_centre: '', loading: true
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getAllActiviesByCentre()
    }

    getAllActiviesByCentre() {
        let user = JSON.parse(localStorage.getItem('partenaire'))
        let partenaire = user.partenaire
        this.setState({partenaire: partenaire}, () => {
            axios.get('api/centre/get?token=' + this.state.partenaire.token).then(res => {
                this.setState({
                    id_centre: res.data.centres[0].id,
                }, () => {
                    axios.get('api/activity/get?token=' + partenaire.token + '&id=' + this.state.id_centre).then(res => {
                        this.setState({activity: res.data.activity}, () => {
                                this.setState({loading: false})
                            }
                        )
                    })
                });
            })

        })
    }

    validActivity(id) {
        this.setState({disabled: true})
        let partenaire = this.state.partenaire
        axios.get(`api/activity/validate?token=` + partenaire.token + `&id=` + id).then(res => {
            const modal = Modal.success({
                content: (
                    <div className={"text-center"} key={'valid-' + Math.random()}>
                        <LazyLoadImage src={"/images/logo.png"} width={'65px'}
                             alt={"bagzee"}/>

                        <p className={"text-success pt-2"}>
                            {res.data.message}
                        </p>

                    </div>),
                okText: 'ok',
            });
            setTimeout(() => {
                modal.destroy();
                this.getAllActiviesByCentre()

            }, 5000);
            this.setState({disabled: false})
        })
    }

    secondsToTime(secs) {
        let obj = ''
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);


        if (minutes > 0 && hours > 0) {
            if (hours < 10) {
                hours = '0' + hours
            }
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            obj = hours + ':' + minutes + 'h'
        } else if (minutes === 0) {
            obj = hours + 'h'

        } else if (hours === 0) {
            obj = minutes + 'min'

        }
        return obj;
    }

    startDuree(hfrom, hto) {
        const [hoursF, minutesF] = hfrom.split(':');
        const [hoursT, minutesT] = hto.split(':');
        const totalSecondeFrom = (hoursF * 60 * 60) + (minutesF * 60)
        const totalSecondsTo = (hoursT * 60 * 60) + (minutesT * 60)
        let newTotalSeconds = totalSecondsTo - totalSecondeFrom
        return this.secondsToTime(newTotalSeconds)
    }

    render() {
        let partenaire = this.state.partenaire
        let loading = this.state.loading
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
                        name="form_cause_annulation"
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
                this.setState({disabled: true})
                axios.post(`api/activity/cancel`, {
                    token: partenaire.token,
                    id: props.id,
                    cause: values.cause
                }).then(res => {
                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"} key={'cancel-' + Math.random()}>
                                <LazyLoadImage src={"/images/logo.png"} width={'65px'}
                                     alt={"bagzee"}/>

                                <p className={"text-success pt-2"}>
                                    {res.data.message}
                                </p>

                            </div>),
                        okText: 'ok',
                    });
                    this.setState({disabled: false})
                    setTimeout(() => {
                        modal.destroy();

                    }, 5000);
                })
                this.getAllActiviesByCentre()
                /* window.location.reload(false);*/

                setVisibleCause(false);

            };

            return (
                <>
                    <button className={this.state.disabled ? 'btn-blue bg-warning disabled' : 'btn-blue bg-warning'}
                            onClick={() => {
                                setVisibleCause(true);
                            }}>
                        <FontAwesomeIcon icon={faTimesCircle}/>
                    </button>
                    <CollectionCreateFormCause key={'Annuler-Activite-' + Math.random()}
                                               visibleCause={visibleCause}
                                               onCreateCause={onCreateCause}
                                               onCancelCause={() => {
                                                   setVisibleCause(false);
                                               }}
                    />
                </>
            );
        };
        return (
            <div className={"add-activity"}>
                <div className="row">

                    {loading ?
                        <p className={'text-center my-5 col-12'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                                </span>
                        </p> :
                        <div className={"col-12 pt-4 mb-4"}>
                            <div className={"row mb-3 headerTab"}>
                                <div className={"col-md-2"}>
                                    <label>Catégorie</label>
                                </div>
                                <div className={"col-md-2"}>
                                    <label>Réservation</label>
                                </div>
                                <div className={"col-md-1"}>
                                    <label>Min
                                    </label>
                                </div>
                                <div className={"col-md-1"}>
                                    <label>Durée</label>
                                </div>
                                <div className={"col-md-2"}>
                                    <label>Date</label>
                                </div>
                                <div className={"col-md-2"}>
                                    <label>Heure</label>
                                </div>
                                <div className={"col-md-2"}>
                                    <label>Action</label>
                                </div>
                            </div>
                            {this.state.activity.map(act =>
                                <div className={"row text-center text-md-left"} key={'reservation-' + act.id}>
                                    <div className={' col-md-12 px-2 py-4 bg-white '}>
                                        <div className={act.canceled ? "row text-danger" : 'row'}>
                                            <div className={"col-md-2"}>
                                                <label>
                                                    {act.name}
                                                </label>
                                            </div>
                                            <div className={"col-md-2"}>
                                                <label>
                                                    {act.nbrPlaceRest}/{act.nbreOfPlace}
                                                </label>
                                            </div>
                                            <div className={"col-md-1"}>
                                                <label>
                                                    {act.nbreOfPlaceMin}
                                                </label>
                                            </div>
                                            <div className={"col-md-1"}>
                                                <label>
                                                    {this.startDuree(act.hFrom, act.hTo)}
                                                </label>
                                            </div>
                                            <div className={"col-md-2"}>
                                                <label>
                                                    {act.date}
                                                </label>
                                            </div>
                                            <div className={"col-md-2"}>
                                                <label>
                                                    {act.hFrom} - {act.hTo}
                                                </label>
                                            </div>
                                            <div
                                                className={act.nbrPlaceRest > 0 || act.nbreFavoris != '0' ? "col-md-2 btnsMethod status" : "col-md-2 status btnsMethod"}>
                                                <Link to={{
                                                    pathname: '/dupliquer-activité',
                                                    state: {
                                                        activity: act,
                                                        partenaire: partenaire,
                                                        duplicate: true,
                                                        id_centre: this.state.id_centre
                                                    }
                                                }} className={'btn-blue duplicate'}
                                                      style={{background: '#eee !important'}}><FontAwesomeIcon
                                                    icon={faClone}/></Link>
                                                {(act.nbrPlaceRest > 0) ?
                                                    (act.nbreOfPlaceMin > act.nbrPlaceRest && !act.canceled) ?
                                                        <CollectionsPageCause id={act.id}/> :
                                                        (act.nbreOfPlaceMin <= act.nbrPlaceRest && !act.validate && !act.canceled) ?
                                                            <button
                                                                className={this.state.disabled ? 'btn-blue bg-success disabled' : 'btn-blue bg-success'}
                                                                onClick={() => this.validActivity(act.id)}>
                                                                <FontAwesomeIcon icon={faCheck}/></button>
                                                            : null
                                                    : act.nbreFavoris == '0' ?
                                                        <> <Link to={{
                                                            pathname: '/update-activite',
                                                            state: {
                                                                activity: act,
                                                                duplicate: false,
                                                                partenaire: partenaire
                                                            }
                                                        }} className={'btn-blue'}><FontAwesomeIcon
                                                            icon={faEdit}/></Link>

                                                            <button className={'btn-blue bg-danger'} onClick={() => {
                                                                axios.get(`api/activity/delete?token=` + partenaire.token + `&id=` + act.id).then(res => {
                                                                    const modal = Modal.success({
                                                                        content: (
                                                                            <div className={"text-center"}
                                                                                 key={'delete-' + Math.random()}>
                                                                                <LazyLoadImage src={"/images/logo.png"}
                                                                                     alt={"bagzee"}
                                                                                     width={'65px'}/>

                                                                                <p className={"text-success pt-2"}>
                                                                                    {res.data.message}
                                                                                </p>

                                                                            </div>),
                                                                        okText: 'ok',
                                                                    });
                                                                    setTimeout(() => {
                                                                        modal.destroy();
                                                                    }, 5000);
                                                                    axios.get('api/activity/get?token=' + partenaire.token + '&id=' + this.state.id_centre).then(res => {
                                                                        this.setState({activity: res.data.activity})
                                                                    })
                                                                })
                                                            }}><FontAwesomeIcon icon={faTrash}/>
                                                            </button>
                                                        </>
                                                        :
                                                        <button className={'btn-blue bg-danger'} onClick={() => {
                                                            axios.get(`api/activity/delete?token=` + partenaire.token + `&id=` + act.id).then(res => {
                                                                const modal = Modal.success({
                                                                    content: (
                                                                        <div className={"text-center"}
                                                                             key={'delete-' + Math.random()}>
                                                                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}
                                                                                 width={'65px'}/>

                                                                            <p className={"text-success pt-2"}>
                                                                                {res.data.message}
                                                                            </p>

                                                                        </div>),
                                                                    okText: 'ok',
                                                                });
                                                                setTimeout(() => {
                                                                    modal.destroy();
                                                                }, 5000);
                                                                axios.get('api/activity/get?token=' + partenaire.token + '&id=' + this.state.id_centre).then(res => {
                                                                    this.setState({activity: res.data.activity})
                                                                })
                                                            })
                                                        }}><FontAwesomeIcon icon={faTrash}/>
                                                        </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default AddActivity;