import React, {Component, useState} from 'react';
import {
    Form,
    Input,
    Checkbox,
    Button,
    Cascader,
    Modal, Select, DatePicker, Tooltip, InputNumber
} from 'antd';
import "antd/dist/antd.css";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import 'moment/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';
import {InfoCircleOutlined} from "@ant-design/icons";
import {PaymentRequestButtonElement} from "@stripe/react-stripe-js";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class ModalAddActivity extends Component {
    constructor(props) {
        super();
        this.state = {
            activity: {},
            loading: true,
            centre_interet: [],
            centre_interet1: [],
            id_centre: '',
            ville: []
        };
        axios.get('api/ville/get').then(res => {
            this.setState({ville: res.data.ville})
        })
        let user = JSON.parse(localStorage.getItem('partenaire'))

        axios.get('api/centre/get?token=' + user.partenaire.token).then(res => {
            this.setState({
                id_centre: res.data.centres[0].id,
            }, () => {
                    axios.get('api/working/get?id=' + this.state.id_centre).then(res => {
                        this.setState({
                            working: res.data.working,
                            loading: false,

                        }, () => {
                            let working = this.state.working
                            let myMin = 24;
                            let myMax = 0;
                            working.map(hour => {
                                    hour.morningFrom.split(':')[0] < myMin ? myMin = hour.morningFrom.split(':')[0] : null
                                    hour.afternoonTo.split(':')[0] > myMax ? myMax = hour.afternoonTo.split(':')[0] : null
                                }
                            )
                            localStorage.setItem('myMin', myMin + ':00:00');
                            localStorage.setItem('myMax', myMax + ':00:00');
                            localStorage.getItem('myMin');
                            localStorage.getItem( 'myMax');

                            this.setState({myMin: myMin, myMax: myMax}, () => {
                                console.log('maxx ' + myMax)
                                console.log('minn ' + myMin)
                            })
                        });


                    })
            });
        })

        axios.get('api/centre/interet/patenaire/all').then(res => {
            this.setState({centre_interet: res.data.centre_interet}, () => {
                this.setState({loading: false})
            })
        })
        axios.get('api/week/get').then(res => {
            this.week = [];
            res.data.date.map(dat => {
                this.week.push(<Select.Option key={dat.id} value={dat.week}>{dat.week} / {dat.start}</Select.Option>);
            })


        })
    }

    componentDidMount() {


    }



    render() {

        const {Option} = Select;

        function disabledDate(current) {
            //alert(current)
            // Can not select days before today and today
            return current < moment().startOf('day');

        }

        function handleChange(value) {
            console.log(`Selected: ${value}`);
        }

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
                const [multiple_date, setMultiple_date] = useState(false)

                const onCheckboxChange = (e) => {
                    console.log(e)
                    setRegister_isFree(e.target.checked);
                };
                const onCheckboxChangeMultiple = (e) => {
                    console.log(e)
                    setMultiple_date(e.target.checked);
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
                            className={'add-Activity'}
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
                                                Taux de remise
                                                <Tooltip
                                                    title="indiqué seulement 60, si vous souhaitez faire -60%, pas besoin de signe négatif ou de signe poucentage">
                                                    <InfoCircleOutlined/>
                                                </Tooltip>
                                            </span>
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Taux de remise ne doit pas être vide!',
                                            },
                                        ]} hasFeedback
                                    >
                                        <InputNumber min={0} max={100} addonBefore="-" addonAfter="%"/>

                                    </Form.Item>
                                </>
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
                                <InputNumber min={1}/>
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
                                <InputNumber min={1}/>
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
                            <Form.Item
                                name="defaultValidate"
                                label={
                                    <span>
                                        Valider automatiquement
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
                                name="isMultipleDate"
                                label={
                                    <span>
                                        Recurrent
                                    </span>
                                }
                                valuePropName="checked"
                                rules={[
                                    {
                                        required: multiple_date,
                                    },
                                ]}
                            >
                                <Checkbox defaultChecked={false} onChange={onCheckboxChangeMultiple}>

                                </Checkbox>
                            </Form.Item>
                            {multiple_date ?
                                <>
                                    <Form.Item
                                        name="semaine"
                                        label="Semaine"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Semaine de l\'activité ne doit pas être vide!',
                                            },
                                        ]} hasFeedback>
                                        <Select
                                            mode="multiple"
                                            placeholder="Sélectionner les semaines "
                                            onChange={handleChange}
                                            style={{width: '100%'}}
                                        >
                                            {this.week}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name="jours"
                                        label="Jours"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Jours de l\'activité ne doit pas être vide!',
                                            },
                                        ]} hasFeedback>
                                        <Select
                                            mode="multiple"
                                            placeholder="Sélectionner les Jours "
                                            onChange={handleChange}
                                            style={{width: '100%'}}
                                        >
                                            <Select.Option key={'1'} value={1}>Lundi</Select.Option>
                                            <Select.Option key={'2'} value={2}>Mardi</Select.Option>
                                            <Select.Option key={'3'} value={3}>Mercredi</Select.Option>
                                            <Select.Option key={'4'} value={4}>Jeudi</Select.Option>
                                            <Select.Option key={'5'} value={5}>Vendredi</Select.Option>
                                            <Select.Option key={'6'} value={6}>Samedi</Select.Option>
                                            <Select.Option key={'7'} value={7}>Dimanche</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </> : <Form.Item
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
                                    <DatePicker disabledDate={disabledDate} locale={locale} format={'dddd D MMMM YYYY'}/>
                                </Form.Item>}
                            <Form.Item
                                name="hFrom"
                                label="Horaire de début"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Horaire de début ne doit pas être vide!',
                                    },({getFieldValue}) => ({
                                        validator(_, value) {
                                            console.log(getFieldValue('hFrom'))
                                            var hms = getFieldValue('hFrom')+':00';   // your input string
                                            var hms2 = localStorage.getItem('myMin')
                                            var hms3 = localStorage.getItem('myMax')
                                            var a = hms.split(':'); // split it at the colons
                                            var a2 = hms2.split(':'); // split it at the colons
                                            var a3 = hms3.split(':'); // split it at the colons

                                            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                                            var seconds2 = (+a2[0]) * 60 * 60 + (+a2[1]) * 60 + (+a2[2]);
                                            var seconds3 = (+a3[0]) * 60 * 60 + (+a3[1]) * 60 + (+a3[2]);
                                            if (seconds < seconds2 || seconds > seconds3) {
                                                return Promise.reject('Horaire de début non valide');
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]} hasFeedback
                            >
                                <Input type={"time"} defaultValue={this.state.myMin ? this.state.myMin : null}
                                       min={this.state.myMin ? this.state.myMin : null}
                                       max={this.state.myMax ? this.state.myMax : null} />
                            </Form.Item>
                            <Form.Item
                                name="hTo"
                                label="Horaire de fin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Horaire de fin ne doit pas être vide!',
                                    },({getFieldValue}) => ({
                                        validator(_, value) {
                                            console.log(getFieldValue('hTo'))
                                            var hms = getFieldValue('hTo')+':00';   // your input string
                                            var hms2 = localStorage.getItem('myMin')
                                            var hms3 = localStorage.getItem('myMax')
                                            var a = hms.split(':'); // split it at the colons
                                            var a2 = hms2.split(':'); // split it at the colons
                                            var a3 = hms3.split(':'); // split it at the colons

                                            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                                            var seconds2 = (+a2[0]) * 60 * 60 + (+a2[1]) * 60 + (+a2[2]);
                                            var seconds3 = (+a3[0]) * 60 * 60 + (+a3[1]) * 60 + (+a3[2]);
                                            if (seconds < seconds2 || seconds > seconds3) {
                                                return Promise.reject('Horaire de fin non valide');
                                            }
                                            return Promise.resolve();
                                        },
                                    })
                                ]} hasFeedback
                            >
                                <Input type={"time"} defaultValue={this.state.myMax ? this.state.myMax : null}
                                       min={this.state.myMin ? this.state.myMin : null}
                                       max={this.state.myMax ? this.state.myMax : null}/>
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
            }
        ;
        const CollectionsPageNewActivity = () => {
                const [visibleNewActivity, setVisibleNewActivity] = useState(false);
                //With this, we will get all field values.
                const onCreateNewActivity = (values) => {

                    let lieu = '';
                    let equipement = '';
                    let obligatoire = '';
                    let isAcceptHoraireAvt24 = false;
                    let defaultValidate = false;
                    let ville = '';
                    let price = 0;
                    let reduce = 0;
                    let isFree = false;
                    if (values.ville) {
                        ville = values.ville
                    }
                    if (values.price && !values.isFree) {
                        price = values.price
                    }
                    if (values.reduce && !values.isFree) {
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
                    if (values.defaultValidate) {
                        defaultValidate = values.defaultValidate
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
                                defaultValidate: defaultValidate,
                                isFree: isFree,
                                activity: values.activity,
                                week: values.semaine,
                                day: values.jours,
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
                                                <h6 className={'text-success'}>Votre activité à bien été ajoutée
                                                </h6>
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
                                window.location.reload(false);
                            }, 5000);

                        }, 1000)
                    })
                        .catch(function (error) {
                            console.log(error);
                        });
                    setVisibleNewActivity(false);
                };

                return (
                    <div>
                        {this.state.loading ? null :
                            <>
                                <Button
                                    type="primary"
                                    className={'btn-blue my-3'}
                                    onClick={() => {
                                        if (this.state.id_centre == '') {
                                            const modal = Modal.success({
                                                content: (
                                                    <div className={"text-center"}>
                                                        <div>
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                            <br/>
                                                            <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez
                                                                configurer votre
                                                                vitrine.
                                                            </p>
                                                        </div>

                                                    </div>),
                                                okText: 'ok',
                                            });
                                            setTimeout(() => {
                                                modal.destroy();
                                            }, 5000);
                                        } else if (!this.state.myMin && !this.state.myMax ) {
                                            const modal = Modal.success({
                                                content: (
                                                    <div className={"text-center"}>
                                                        <div>
                                                            <FontAwesomeIcon icon={faTimes}/>
                                                            <br/>
                                                            <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez
                                                                configurer vos horaires .
                                                            </p>
                                                        </div>

                                                    </div>),
                                                okText: 'ok',
                                            });
                                            setTimeout(() => {
                                                modal.destroy();
                                            }, 5000);
                                        } else {
                                            setVisibleNewActivity(true);
                                        }
                                    }}
                                >
                                    Ajouter une activité
                                </Button>
                                <CollectionCreateFormNewActivity key={'Ajouter une activité' + Math.random()}
                                                                 visibleNewActivity={visibleNewActivity}
                                                                 onCreateNewActivity={onCreateNewActivity}
                                                                 onCancelNewActivity={() => {
                                                                     setVisibleNewActivity(false);
                                                                 }}
                                />
                            </>
                        }
                    </div>
                );
            }

        ;


        return (
            <CollectionsPageNewActivity/>
        );


    }
}

export default ModalAddActivity;