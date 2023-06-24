import React, {Component, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from '@fullcalendar/core/locales/fr';
import axios from "axios";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {Alert, Button, Cascader, Checkbox, Form, Input, InputNumber, Modal, Select, Tooltip} from 'antd'
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import {InfoCircleOutlined} from "@ant-design/icons"; // needed for dayClick

class Dashbord extends Component {
    constructor() {
        super();

        this.state = {
            partenaire: {
                token: ''
            }, loading: true, error: false,
            event: [], myMin: '09:00:00', myMax: '18:00:00', visibleNewActivity: false,
            activity: {},
            centre_interet: [],
            centre_interet1: [],
            id_centre: '',
            ville: []
        }
        this.getNumberOfWeek = this.getNumberOfWeek.bind(this);
        this.renderEventContent = this.renderEventContent.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);


    }


    componentDidMount() {

        window.scrollTo(0, 0);
        let part = JSON.parse(localStorage.getItem('partenaire'))
        if (part) {
            this.state.partenaire.token = part.partenaire.token
        }
        let myyMin = localStorage.getItem('myMin')
        let myyMax = localStorage.getItem('myMax')
        if (myyMin && myyMax) {
            this.setState({myMin: myyMin, myMax: myyMax, loading: false})
        } else {
            let partenaire = this.state.partenaire
            axios.get('api/centre/get?token=' + partenaire.token).then(res => {
                this.setState({
                    id_centre: res.data.centres[0].id
                }, () => {
                    if (this.state.id_centre != '') {
                        axios.get('api/working/get?id=' + this.state.id_centre).then(res => {
                            let working = res.data.working
                            let myMin = 24;
                            let myMax = 0;
                            working.map(hour => {
                                    hour.morningFrom.split(':')[0] < myMin ? myMin = hour.morningFrom.split(':')[0] : null
                                    hour.afternoonTo.split(':')[0] > myMax ? myMax = hour.afternoonTo.split(':')[0] : null
                                }
                            )
                            this.setState({myMin: myMin + ':00:00', myMax: myMax + ':00:00', loading: false})


                        })
                    } else {
                        this.setState({loading: false})

                    }

                });
            }).catch(err => {
                    console.log(err)
                    this.setState({loading: false})
                }
            )
        }
    }

    getNumberOfWeek(dt) {

        const currentdate = new Date(dt.start);
        const oneJan = new Date(currentdate.getFullYear(), 0, 1);
        const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        const result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
        // alert(`The week number of the current date (${currentdate}) is ${result}. and month is ${currentdate.getMonth() + 1}. ${currentdate.getFullYear()}`);
        let part = JSON.parse(localStorage.getItem('partenaire'))
        if (part) {
            axios.get('api/event/partenaire/get?token=' + part.partenaire.token + '&week=' + result).then(res => {
                let events = [...this.state.event];
                events = res.data.events;
                this.setState({event: events})
                /*   let calendarApi = this.fullCalendar.fullCalendar();
  calendarApi.refetchEvents()*/

            })
        }


    }

    handleSelectDate = (eventInfo) => {
        let startTime = (eventInfo.startStr.split('+'))[0].split('T')[1].trim()
        let endTime = (eventInfo.endStr.split('+'))[0].split('T')[1].trim()
        let day = moment(new Date(eventInfo.startStr)).format('YYYY-MM-DD')
        if (moment(new Date(eventInfo.startStr)).diff(moment(new Date()), 'seconds') > 0 && moment(new Date(eventInfo.endStr)).diff(moment(eventInfo.startStr), 'hours') < 12) {
            this.setState({startTime, endTime, day}, () => {
                this.setState({visibleNewActivity: true, error: false})

            })
        } else {
            this.setState({error: true})
        }
    }
    // Event Render Function To Get Images and Titles
    handleEventClick = ({event, el}) => {
        Modal.success({
            content: (<><h6>{event._def.title}</h6>
                <p>{event._def.ui.constraints[0]}</p>
            </>),
            okText: 'ok',
            className: 'text-center'

        })
    };
    renderEventContent = (eventInfo) => {
        console.log(eventInfo)
        return (
            <div className={'dashbord text-center'}>
                <h5>{eventInfo.event.title}</h5>
                <p>{eventInfo.event.constraint}</p>
                {/* <LazyLoadImage className="eventimage" src={eventInfo.event.url}/>*/}

            </div>

        )
    }

    render() {
        let loading = this.state.loading
        let error = this.state.error
        //With this, we will get all field values.
        const onCreateNewActivity = (values) => {

            let lieu = '';
            let equipement = '';
            let obligatoire = '';
            let isAcceptHoraireAvt24 = false;
            let ville = '';
            let price = 0;
            let reduce = 0;
            let isFree = false;
            if (values.ville) {
                ville = values.ville
            }
            if (values.price) {
                price = values.price
            }
            if (values.reduce) {
                reduce = values.reduce
            }
            if (values.lieu) {
                lieu = values.lieu
            }
            if (values.equipement) {
                equipement = values.equipement
            }
            if (values.obligatoire) {
                obligatoire = values.obligatoire
            }
            if (values.isAcceptHoraireAvt24) {
                isAcceptHoraireAvt24 = values.isAcceptHoraireAvt24
            }
            if (values.isFree) {
                isFree = values.isFree
            }
            let user = JSON.parse(localStorage.getItem('partenaire'))
            axios.post('api/activity/add?token=' + user.partenaire.token, {
                centres:
                    {
                        id: this.state.id_centre == '' ? JSON.parse(localStorage.getItem('id_centre')) : this.state.id_centre
                    }
                ,
                activity:
                    {
                        name: values.name,
                        type: values.type,
                        price: price,
                        reduce: reduce,
                        nbreOfPlace: values.nbreOfPlace,
                        nbreOfPlaceMin: values.nbreOfPlaceMin,
                        ville: ville,
                        date: values.date,
                        hTo: values.hTo,
                        hFrom: values.hFrom,
                        lieu: lieu,
                        isAcceptHoraireAvt24: isAcceptHoraireAvt24,
                        isFree: isFree,
                        activity: values.activity,
                        equipement: equipement,
                        obligatoire: obligatoire
                    }


            }).then(response => {

                let status = response.data.status
                let message = response.data.message
                setTimeout(function () {
                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"}>
                                <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} width={'65px'}/>
                                {status ?
                                    <>
                                        <h6 className={'text-success'}>Votre activité à bien été ajoutée </h6>
                                    </> :
                                    <p className={"text-danger pt-2"}>
                                        {message}
                                    </p>
                                }


                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                    }, 5000);

                }, 1000)
            })
                .catch(function (error) {
                    console.log(error);
                });
            this.setState({visibleNewActivity: false})
        };
        const CollectionCreateFormNewActivity = ({
                                                     visibleNewActivity,
                                                     onCreateNewActivity,
                                                     onCancelNewActivity
                                                 }) => {
            const [form] = Form.useForm();

            const onFinish = (values) => {
                console.log('Received values of form: ', values);
            };
            const [register_isFree, setRegister_isFree] = useState(false)

            const onCheckboxChange = (e) => {
                console.log(e)
                setRegister_isFree(e.target.checked);
            };
            return (
                <Modal
                    visible={visibleNewActivity}
                    onCancel={onCancelNewActivity}
                    onOk={() => {
                        form
                            .validateFields()
                            .then((values) => {
                                form.resetFields();
                                onCreateNewActivity(values);

                            })
                            .catch((info) => {
                                console.log('Ooops !! Validate Failed:', info);
                            });
                    }}
                    footer={[
                        <Button key="submit" type="primary" onClick={() => {
                            form
                                .validateFields()
                                .then((values) => {
                                    form.resetFields();
                                    onCreateNewActivity(values);
                                })
                                .catch((info) => {
                                    console.log('Ooops !! Validate Failed:', info);
                                });
                        }}>Publier
                        </Button>


                    ]}

                >

                    <div className={'text-center w-100'}>
                        <h5>Ajouter une activité</h5>
                    </div>

                    <Form
                        form={form}
                        /*onChange={(event)=>{
                            const target = event.target;
                            const id = target.id;
                            if(id =='register_isFree' || id=='register_isAcceptHoraireAvt24'){
                                const checked = target.checked;
                               console.log(id,checked)
                            }else {
                                const value = target.value;
                                console.log(id,value)

                            }
                        }}*/
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                        requiredMark={false}
                    >

                        <Form.Item
                            name="name"
                            label={
                                <span>
                                    Nom de l'activité
                                </span>
                            }

                            rules={[
                                {
                                    required: true,
                                    message: 'Nom de l\'activité ne doit pas être vide!',
                                    whitespace: true,
                                },
                            ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="type"
                            label="Catégorie"
                            rules={[
                                {
                                    type: 'array',
                                    required: true,
                                    message: 'Catégorie ne doit pas être vide!',
                                },
                            ]}
                        >
                            <Cascader options={this.state.centre_interet}/>
                        </Form.Item>
                        <Form.Item label="Ville de l'activité" name={"ville"} rules={[
                            {
                                required: true,
                            },
                        ]} hasFeedback>
                            <Select>
                                {this.state.ville.map(ville =>
                                    <Option value={ville.id} key={ville.id}>{ville.name}</Option>
                                )}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="isFree"
                            label={
                                <span>
                                   Activité gratuite
                                </span>
                            }
                            valuePropName="checked"
                            rules={[
                                {
                                    required: register_isFree,
                                },
                            ]}
                        >
                            <Checkbox defaultChecked={false} onChange={onCheckboxChange}>

                            </Checkbox>
                        </Form.Item>
                        {register_isFree ? null :
                            <>
                                <Form.Item
                                    name="price"
                                    label={
                                        <span>
                                   Prix de base
                                </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Prix ne doit pas être vide!',
                                        },
                                    ]} hasFeedback
                                >
                                    <InputNumber min={0} step={0.1}/>
                                </Form.Item>


                                <Form.Item
                                    name="reduce"
                                    label={
                                        <span>
                                   Taux de remise <Tooltip
                                            title="indiqué seulement 60, si vous souhaitez faire -60%, pas besoin de sine négatif ou de signe poucentage"><InfoCircleOutlined/></Tooltip>
                                </span>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Taux de remise ne doit pas être vide!',
                                        },
                                    ]} hasFeedback
                                >

                                    <InputNumber min={0} max={100} step={0.1} addonBefore="-" addonAfter="%"/>

                                </Form.Item> </>
                        }
                        <Form.Item
                            name="nbreOfPlace"
                            label={
                                <span>
                                  Nombre de participants
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: ' Nombre de participants ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"number"}/>
                        </Form.Item>
                        <Form.Item
                            name="nbreOfPlaceMin"
                            label={
                                <span>
                                  Minimum de participants requis
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message: 'Minimum de participants requis ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"number"}/>
                        </Form.Item>

                        <Form.Item
                            name="isAcceptHoraireAvt24"
                            label={
                                <span>
                                   Ne plus accepter de réservation 24h avant l'activité
                                </span>
                            }
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <Checkbox defaultChecked={false}>

                            </Checkbox>
                        </Form.Item>
                        <h4>Date & heure</h4>
                        <Form.Item
                            name="date"
                            label="Date de l'activité"
                            rules={[
                                {
                                    type: 'date',
                                    message: 'Date de l\'activité n\'est pas valid!',
                                },
                                {
                                    required: true,
                                    message: 'Date de l\'activité ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"date"} min={moment().format("YYYY-MM-DD")}
                                   defaultValue={this.state.day ? this.state.day : null}/>
                        </Form.Item>
                        <Form.Item
                            name="hFrom"
                            label="Horaire de début"
                            rules={[
                                {
                                    required: true,
                                    message: 'Horaire de début ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"time"} defaultValue={this.state.startTime ? this.state.startTime : null}
                                   min={this.state.myMin} max={this.state.myMax}/>
                        </Form.Item>
                        <Form.Item
                            name="hTo"
                            label="Horaire de fin"
                            rules={[
                                {
                                    required: true,
                                    message: 'Horaire de fin ne doit pas être vide!',
                                },
                            ]} hasFeedback
                        >
                            <Input type={"time"} defaultValue={this.state.endTime ? this.state.endTime : null}
                                   min={this.state.myMin} max={this.state.myMax}/>
                        </Form.Item>
                        <Form.Item
                            className={'myTextArea'}
                            name="lieu"
                            label="Lieu"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.TextArea maxLength="750" rows="5"
                                            placeholder={'Indiquez à vos clients, si une information complémentaire est nécessaire, exemple : arriver 10 mn avant minimum'}/>
                        </Form.Item>
                        <Form.Item
                            className={'myTextArea'}
                            name="activity"
                            label="Activité"
                            rules={[
                                {
                                    required: true,
                                    message: 'Description de l\'activité ne doit pas être vide!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.TextArea placeholder={'Décrivez l\'activité que vous proposez'} maxLength="750"
                                            rows="5"/>
                        </Form.Item>

                        <Form.Item
                            className={'myTextArea'}
                            name="equipement"
                            label="Équipement"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.TextArea maxLength="750" rows="5"
                                            placeholder={'Indiquez à vos clients, si un équipement spécifique est nécessaire'}/>
                        </Form.Item>

                        <Form.Item
                            className={'myTextArea'}
                            name="obligatoire"
                            label="Obligatoire"
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.TextArea maxLength="750" rows="5"
                                            placeholder={'Indiquez à vos clients, si une information complémentaire est nécessaire, exemple : âge requis minimum '}/>
                        </Form.Item>

                    </Form>
                </Modal>
            );
        };
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className={'bg-white calendarColor p-4'}>
                            <h6 className={'mb-3'}>Calendrier</h6>
                            <p><FontAwesomeIcon icon={faCheck} style={{backgroundColor: '#7656D6'}}/> 100%
                                reservé et validé</p>
                            <p><FontAwesomeIcon icon={faCheck} style={{backgroundColor: '#37B4E2'}}/> En cours
                                de réservation</p>
                            <p><FontAwesomeIcon icon={faCheck} style={{backgroundColor: '#5DAB76'}}/> Nombre
                                minimum atteint en
                                attente validation</p>
                        </div>
                    </div>
                    <div className="col-md-9">
                        {loading ?
                            <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">
    </span>
                            </p> :
                            <>
                                {error ?
                                    <Alert message="Vérifier votre interval de temps" type="error" closable/> : null}
                                <FullCalendar
                                    defaultView="timeGridWeek"
                                    headerToolbar={{
                                        center: 'timeGridWeek',
                                    }}
                                    editable={true}
                                    allDaySlot={false}
                                    slotMinTime={this.state.myMin}
                                    slotMaxTime={this.state.myMax}
                                    datesSet={this.getNumberOfWeek}
                                    locale={esLocale}
                                    plugins={[timeGridPlugin, interactionPlugin]}
                                    eventContent={this.renderEventContent}
                                    weekNumbers={true}
                                    eventClick={this.handleEventClick}
                                    events={this.state.event}
                                    select={this.handleSelectDate}
                                    selectMirror={true}
                                    selectable={true}
                                    /* dateClick={() => {
                                     this.setState({visibleNewActivity: true})

                                 }}*/

                                />
                                <CollectionCreateFormNewActivity key={'Ajouter une activité dashbord' + Math.random()}
                                                                 visibleNewActivity={this.state.visibleNewActivity}
                                                                 onCreateNewActivity={onCreateNewActivity}
                                                                 onCancelNewActivity={() => {
                                                                     this.setState({visibleNewActivity: false})
                                                                 }}
                                />
                            </>
                        }


                    </div>
                </div>
            </div>

        )
    };
}

export default Dashbord;
