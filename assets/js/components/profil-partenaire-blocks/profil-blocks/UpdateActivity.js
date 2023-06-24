import React, {Component} from 'react';
import axios from "axios";
import {Cascader, Form, Input, Modal, Select, Tooltip} from "antd";
import Block404 from "../../Block404";
import moment from "moment";
import {Redirect} from 'react-router';
import {InfoCircleOutlined} from "@ant-design/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class UpdateActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activity: {},
            ville: [], centreInteretLocal: [],
            categ: '', sCateg: '', redirect: false,
            loading: true, disabled: false, isMultipleDate: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);

        axios.get('api/week/get').then(res => {
            this.week = [];
            res.data.date.map(dat => {
                this.week.push(<Select.Option key={dat.id} value={dat.week}>{dat.week} / {dat.start}</Select.Option>);
            })


        })
    }

    componentDidMount() {
        let myyMin = localStorage.getItem('myMin')
        let myyMax = localStorage.getItem('myMax')
        if (myyMin && myyMax) {
            this.setState({myMin: myyMin, myMax: myyMax}, () => {
                console.log('maxx ' + myyMax)
                console.log('minn ' + myyMin)
            })
            console.log(this.props.location.state.duplicate)
            window.scrollTo(0, 0);
            let activity = this.props.location.state.activity
            this.setState({activity}, () => {
                let date = this.state.activity.date
                const [dd, mm, yy] = date.split('-');
                let newDateAct = yy + '-' + mm + '-' + dd
                this.setState(prevState => ({
                    activity: {
                        ...prevState.activity,
                        date: newDateAct
                    }, centreInteretLocal: activity.sousCentreInteret
                }), () => {
                    console.log(this.state.activity);
                    this.renderArrayCentreInteret();
                });
            })
            axios.get('api/ville/get').then(res => {
                this.setState({ville: res.data.ville})
            })
        } else {
            this.setState({redirectWorking: true}, () => {
                const modal = Modal.success({
                    content: (
                        <div className={"text-center"} key={'horaire' + Math.random()}>
                            <div>
                                <FontAwesomeIcon icon={faTimes}/>
                                <br/>
                                <p style={{color: '#8D8D8D'}} className={"pt-2"}>Vous devez configurer vos
                                    horaires.
                                </p>
                            </div>

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
            })
        }


    }

    handleChangeRecurrentJ = (event) => {
        this.setState(prevState => ({
            activity: {
                ...prevState.activity,    // keep all other key-value pairs
                day: event
            }
        }), () => {
            console.log(this.state.activity)
        });

    }
    handleChangeRecurrentS = (event) => {
        this.setState(prevState => ({
            activity: {
                ...prevState.activity,    // keep all other key-value pairs
                week: event
            }
        }), () => {
            console.log(this.state.activity)
        });

    }

    handleChange(event) {
        console.log(event)
        const target = event.target;
        const name = target.name;
        if (name == 'isFree' || name == 'isAcceptHoraireAvt24' || name == 'isMultipleDate' || name == 'defaultValidate') {
            const checked = target.checked;

            this.setState(prevState => ({
                activity: {
                    ...prevState.activity,    // keep all other key-value pairs
                    [name]: checked
                }
            }), () => {
                if (checked == true && name == 'isMultipleDate') {
                    this.setState(prevState => ({
                        activity: {
                            ...prevState.activity,    // keep all other key-value pairs
                            date: ''
                        }
                    }));
                } else if (checked == true && name == 'isFree') {
                    this.setState(prevState => ({
                        activity: {
                            ...prevState.activity,    // keep all other key-value pairs
                            price: 0,
                            reduce: 0
                        }
                    }));
                }
            });
        } else {
            const value = target.value;
            this.setState(prevState => ({
                activity: {
                    ...prevState.activity,    // keep all other key-value pairs
                    [name]: value
                }
            }), () => {
                console.log(this.state.activity.defaultValidate)
                console.log(this.state.activity.ville)
            });
        }
    }

    formSubmit(event) {
        this.setState({disabled: true});
        let partenaire = this.props.location.state.partenaire
        event.preventDefault();
        /*let myObj=[this.state.categ,this.state.sCateg]
        if(myObj!=this.state.activity.sousCentreInteret){
            this.setState(prev=>({
               activity:{
                   ...prev.activity,
                   sousCentreInteret:myObj,
               }
            }))
        }*/
        console.log(this.state)
        if (this.props.location.state.duplicate) {
            axios.post('api/activity/add?token=' + partenaire.token, {
                centres: {id: this.props.location.state.id_centre},
                activity: this.state.activity
            }).then(response => {
                    let status = response.data.status
                    let message = response.data.message
                    if (status == true) {
                        this.setState({disabled: false})
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"}>
                                    <LazyLoadImage src={"/images/logo_partenaire.png"} alt={"bagzee"} width={'65px'}/>
                                    {status ?
                                        <>
                                            <h6 className={'text-success'}>Votre activité à bien été ajoutée</h6>
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
                        this.setState({redirect: true});

                    }

                },
            ).catch(function (error) {
                console.log(error);
            })
        } else {
            axios.put('api/activity/update?token=' + partenaire.token + '&id=' + this.state.activity.id, {activity: this.state.activity}).then(response => {
                    if (response.data.status == true) {
                        this.setState({disabled: false})
                        const modal = Modal.success({
                            content: (
                                <div className={"text-center"}>
                                    <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                                    <h4 className={" pt-2"}>
                                        Modification Activité
                                    </h4>
                                    <p className={"text-success pt-2"}>
                                        Les informations ont été mise à jour
                                    </p>

                                </div>),
                            okText: 'ok',
                        });
                        setTimeout(() => {
                            modal.destroy();

                        }, 5000);
                        this.setState({redirect: true});

                    }

                },
            ).catch(function (error) {
                console.log(error);
            })
        }

    }

    renderArrayCentreInteret() {
        let cat = '';
        let sCat = '';
        this.state.activity.sousCentreInteret.forEach((interet) => {
            if (interet.checked) {
                cat = interet.value
                interet.children.forEach((sInteret) => {
                    if (sInteret.checked) {
                        sCat = sInteret.value
                    }
                })
            }
            this.setState(prev => ({
                    categ: cat,
                    sCateg: sCat,
                    activity: {
                        ...prev.activity,
                        sousCentreInteret: [cat, sCat],
                        type: [cat, sCat]
                    }, loading: false
                }
            ), console.log(this.state.activity))
        });

    }

    render() {
        const loading = this.state.loading;
        if (this.state.redirectWorking) {
            return <Redirect to='/horaires'/>;
        } else if (this.state.redirect) {
            return <Redirect to='/activités'/>;
        } else {
            return (
                <div className={"Info-vitrine "}>
                    {loading ?
                        <Block404/>
                        :
                        <form onSubmit={this.formSubmit}>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Nom de l'activité</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={"text"} name={"name"} value={this.state.activity.name}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Catégorie</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <Cascader defaultValue={[this.state.categ, this.state.sCateg]}
                                              style={{color: '#000'}}
                                              options={this.state.centreInteretLocal} onChange={(e) => {
                                        this.setState(prevState => ({
                                            activity: {
                                                ...prevState.activity,    // keep all other key-value pairs
                                                sousCentreInteret: e
                                            }
                                        }), () => {
                                            console.log(e)
                                        });
                                    }}
                                              type={'array'} name={"type"}/>
                                </div>
                            </div>

                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Ville de l'activité</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <select onChange={this.handleChange} name={'ville'}>
                                        {this.state.ville.map((ville) =>
                                            <option value={ville.id} key={ville.id}
                                                    selected={ville.id == this.state.activity.ville ? true : false}> {ville.name}</option>
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>

                                </div>
                                <div className={"col-md-9"}>
                                    <input type={'checkbox'} name={"isFree"} id={'isFree'} required={false}
                                           onChange={this.handleChange}
                                           checked={this.state.activity.isFree}/>
                                    <label htmlFor={'isFree'} className={"pl-3"}>Activité gratuite</label>
                                </div>
                            </div>

                            <div className={this.state.activity.isFree ? "d-none" : "row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Prix de base</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={"number"} name={"price"} value={this.state.activity.price} min={0}
                                           step={0.1}
                                           onChange={this.handleChange}/>

                                </div>
                            </div>

                            <div className={this.state.activity.isFree ? "d-none" : "row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Taux de remise
                                        <Tooltip
                                            title="indiqué seulement 70, si vous souhaitez faire -60%, pas besoin de sine négatif ou de signe poucentage">
                                            <InfoCircleOutlined/>
                                        </Tooltip>
                                    </label>
                                </div>
                                <div className={"col-md-9 form-group has-feedback"}>
                                    <input type={"number"} name={"reduce"} value={this.state.activity.reduce} step={0.1}
                                           min={0} max={100}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Nombre de participants</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={"number"} name={"nbreOfPlace"} value={this.state.activity.nbreOfPlace}
                                           min={1}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Minimum de participants requis</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={"number"} name={"nbreOfPlaceMin"} min={1}
                                           value={this.state.activity.nbreOfPlaceMin}
                                           onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>

                                </div>
                                <div className={"col-md-9 d-flex align-content-center"}>
                                    <input type={'checkbox'} name={"isAcceptHoraireAvt24"} id={"isAcceptHoraireAvt24"}
                                           required={false}
                                           onChange={this.handleChange}
                                           checked={this.state.activity.isAcceptHoraireAvt24}/>
                                    <label htmlFor={'isAcceptHoraireAvt24'} className={"pl-3 mb-0"}>
                                        Ne plus accepter de réservation 24h avant l'activité
                                    </label>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>

                                </div>
                                <div className={"col-md-9 d-flex align-content-center"}>
                                    <input type={'checkbox'} name={"defaultValidate"} id={"defaultValidate"}
                                           required={false}
                                           onChange={this.handleChange}
                                           checked={this.state.activity.defaultValidate}/>
                                    <label htmlFor={'defaultValidate'} className={"pl-3 mb-0"}>
                                        Valider automatiquement
                                    </label>
                                </div>
                            </div>
                            <h4>Date & heure</h4>
                            {/*no recurret */}
                            {this.props.location.state.duplicate ?
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                    </div>
                                    <div className={"col-md-9"}>
                                        <input type={'checkbox'} name={"isMultipleDate"} id={'isMultipleDate'}
                                               required={false}
                                               onChange={this.handleChange}
                                               checked={this.state.activity.isMultipleDate}/>
                                        <label htmlFor={'isMultipleDate'} className={"pl-3"}>Recurrent</label>
                                    </div>
                                </div> : null}

                            {this.state.activity.isMultipleDate ?
                                <>
                                    <div className={"row mb-3"}>
                                        <div className={"col-md-3"}>
                                            <label className={"centrage-y"}>Semaine</label>
                                        </div>
                                        <div className={"col-md-9"}>
                                            <Select mode={'multiple'}
                                                    name={'semaine'}
                                                    placeholder="Sélectionner les semaines "
                                                    onChange={this.handleChangeRecurrentS}
                                                    style={{width: '100%'}}
                                            >
                                                {this.week}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className={"row mb-3"}>
                                        <div className={"col-md-3"}>
                                            <label className={"centrage-y"}>Jours</label>
                                        </div>
                                        <div className={"col-md-9"}>
                                            <Select mode={'multiple'}
                                                    name={'jours'}
                                                    placeholder="Sélectionner les Jours "
                                                    onChange={this.handleChangeRecurrentJ}
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
                                        </div>
                                    </div>
                                </>
                                :
                                <div className={"row mb-3"}>
                                    <div className={"col-md-3"}>
                                        <label className={"centrage-y"}>Date de l'activité</label>
                                    </div>
                                    <div className={"col-md-9"}>
                                        <input type={'date'} name={"date"} onChange={this.handleChange}
                                               min={moment().format("YYYY-MM-DD")}
                                               value={this.state.activity.date}/>
                                    </div>
                                </div>}
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Horaire de
                                        début {this.state.myMin != '' && this.state.myMax != '' ? <Tooltip
                                            title={"Horaire de début doit être entre " + this.state.myMin.split(':')[0] + ':' + this.state.myMin.split(':')[1] + ' h et ' + this.state.myMax.split(':')[0] + ':' + this.state.myMax.split(':')[1] + ' h'}>
                                            <InfoCircleOutlined/>
                                        </Tooltip> : null}</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={'time'} name={"hFrom"} onChange={this.handleChange}
                                           value={this.state.activity.hFrom} min={this.state.myMin}
                                           max={this.state.myMax} onBlur={(event) => {

                                        var hms = event.target.value + ':00';   // your input string
                                        var hms2 = this.state.myMin;   // your input string
                                        var hms3 = this.state.myMax;   // your input string
                                        var a = hms.split(':'); // split it at the colons
                                        var a2 = hms2.split(':'); // split it at the colons
                                        var a3 = hms3.split(':'); // split it at the colons

                                        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                                        var seconds2 = (+a2[0]) * 60 * 60 + (+a2[1]) * 60 + (+a2[2]);
                                        var seconds3 = (+a3[0]) * 60 * 60 + (+a3[1]) * 60 + (+a3[2]);
                                        console.log(seconds)
                                        console.log(seconds2)
                                        console.log(seconds3)

                                        if (seconds < seconds2 || seconds > seconds3) {
                                            event.preventDefault();
                                            console.log('test true')
                                            this.setState(prev => ({
                                                activity: {
                                                    ...prev.activity,
                                                    hFrom: this.state.myMin
                                                }
                                            }), () => {
                                                console.log(this.state.activity.hFrom)
                                            })
                                        }
                                    }}/>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Horaire de
                                        fin {this.state.myMin != '' && this.state.myMax != '' ? <Tooltip
                                            title={"Horaire de fin doit être entre " + this.state.myMin.split(':')[0] + ':' + this.state.myMin.split(':')[1] + ' h et ' + this.state.myMax.split(':')[0] + ':' + this.state.myMax.split(':')[1] + ' h'}>
                                            <InfoCircleOutlined/>
                                        </Tooltip> : null}</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <input type={'time'} name={"hTo"} onChange={this.handleChange} onBlur={(event) => {

                                        var hms = event.target.value + ':00';   // your input string
                                        var hms2 = this.state.myMin;   // your input string
                                        var hms3 = this.state.myMax;   // your input string
                                        var a = hms.split(':'); // split it at the colons
                                        var a2 = hms2.split(':'); // split it at the colons
                                        var a3 = hms3.split(':'); // split it at the colons

                                        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                                        var seconds2 = (+a2[0]) * 60 * 60 + (+a2[1]) * 60 + (+a2[2]);
                                        var seconds3 = (+a3[0]) * 60 * 60 + (+a3[1]) * 60 + (+a3[2]);
                                        console.log(seconds)
                                        console.log(seconds2)
                                        console.log(seconds3)

                                        if (seconds < seconds2 || seconds > seconds3) {
                                            event.preventDefault();
                                            console.log('test true')
                                            this.setState(prev => ({
                                                activity: {
                                                    ...prev.activity,
                                                    hTo: this.state.myMax
                                                }
                                            }), () => {
                                                console.log(this.state.activity.hTo)
                                            })
                                        }
                                    }}
                                           value={this.state.activity.hTo} min={this.state.activity.hFrom}
                                           max={this.state.myMax}/>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Activité</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <textarea name={"activity"} placeholder={'Décrivez l\'activité que vous proposez'}
                                              maxLength="750" rows="5"
                                              onChange={this.handleChange}>
                                        {this.state.activity.activity}
                                    </textarea>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Équipement</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <textarea name={"equipement"} maxLength="750" rows="5"
                                              placeholder={'Indiquez à vos clients, si un équipement spécifique est nécessaire'}
                                              onChange={this.handleChange}>
                                        {this.state.activity.equipement}
                                    </textarea>
                                </div>
                            </div>

                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Lieu</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <textarea name={"lieu"} onChange={this.handleChange} maxLength="750" rows="5"
                                              placeholder={'Indiquez à vos clients, si une information complémentaire est nécessaire, exemple : arriver 10 mn avant minimum'}>
                                        {this.state.activity.lieu}
                                    </textarea>
                                </div>
                            </div>
                            <div className={"row mb-3"}>
                                <div className={"col-md-3"}>
                                    <label className={"centrage-y"}>Obligatoire</label>
                                </div>
                                <div className={"col-md-9"}>
                                    <textarea maxLength="750" rows="5"
                                              placeholder={'Indiquez à vos clients, si une information complémentaire est nécessaire, exemple : âge requis minimum '}
                                              name={"obligatoire"} onChange={this.handleChange}>
                                        {this.state.activity.obligatoire}
                                    </textarea>
                                </div>
                            </div>

                            <button className={this.state.disabled ? "btn-blue disabled" : "btn-blue"} type="submit">
                                Enregistrer
                            </button>


                        </form>
                    }
                </div>
            )
        }
    }

}

export default UpdateActivity;