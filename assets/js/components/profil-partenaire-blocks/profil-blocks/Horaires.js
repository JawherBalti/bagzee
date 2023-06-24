import React, {Component} from 'react';
import {faClock, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {Checkbox, Form, Input, Modal, Radio, Select} from "antd";
import {Redirect} from 'react-router';
import {messageService} from "../../../lib/Services";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {user} from "../../../app";
import {withTranslation} from "react-i18next";

class Horaires extends Component {
    constructor() {
        super();
        this.state = {
            id_centre: '',
            working: [],
            week: [],
            loading: true,
            redirect: false


        }
        this.formSubmit = this.formSubmit.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.showInfo()
        axios.get('api/relay_point/week').then(res => {
            this.week = [];
            res.data.week.map(dat => {
                this.week.push(<Select.Option key={dat} value={dat}>{this.props.t('semaine')+' '+dat}</Select.Option>);
            })
            this.setState({weeks:res.data.week})
            console.log(this.state.weeks[0])
        })

    }


    handleChange(event, id) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            working: prevState.working.map(working =>
                (working.days === id ? Object.assign(working, {[name]: value}) : working))
        }));
    }

    handleChangeCheckbox(event, id) {
        const target = event.target;
        const value = target.checked;
        const name = target.name;
        this.setState(prevState => ({
                working: prevState.working.map(working =>

                    (working.days === id ? Object.assign(working, {[name]: value}) : working)
                )

            })
        )
        ;
    }

    showInfo() {
        axios.get('api/relay_point/working/list?token=' + user.client.token).then(res => {
            this.setState({
                working: res.data.working,
                week:res.data.weeks,
                isMultiple:res.data.weeks.length>2?true:false,
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
                localStorage.getItem('myMax');


            });


        })


    }

    formSubmit(event) {
        let that=this
        event.preventDefault();
        axios.post('api/relay_point/working/create', {
            working: this.state.working,
            week: this.state.week,
            token: user.client.token
        }).then(function (response) {

            if (response.data.status == true) {

                const modal = Modal.success({
                    content: (
                        <div className={"text-center"} key={'horaire-success-' + Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <h4 className={" pt-2"}>
                                Modification Horaire
                            </h4>
                            <p className={"text-success pt-2"}>
                                Vos informations ont été mise à jour
                            </p>

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    that.showInfo()
                    modal.destroy();
                }, 5000);
            }
        }).catch(function (error) {
            console.log(error);
        })
       // window.location.reload(false);

    }

    render() {
        let loading = this.state.loading
        const {t} = this.props

        if (this.state.redirect) {
            return <Redirect to='/info-vitrine'/>;
        } else {
            return (
                <form className={"Horaire container mt-5"} onSubmit={this.formSubmit}>
                    <div className="row">
                        {loading ?
                            <p className={'text-center my-5 col-12'}><span className="fa fa-spin fa-spinner fa-4x">
                                </span>
                            </p> : <>
                                {this.state.working.map(working =>
                                    <div className=" col-md-12 text-left py-3" key={working.id}
                                         style={{borderBottom: '1px solid #949494'}}>
                                        <input id={'check-time-' + working.id} name={'work'} type={'checkbox'}
                                               onChange={() => this.handleChangeCheckbox(event, working.days)}
                                               defaultChecked={working.work}/>
                                        <label className={'h6 d-inline-block ml-3'}
                                               htmlFor={'check-time-' + working.id}>{working.dayName}
                                        </label>
                                        {working.work ?
                                            <div className="row container horaireInput mt-3">
                                                <div className="col-md-12 text-left">
                                                    <input type={'checkbox'} id={'continu-' + working.id}
                                                           name={'continu'}
                                                           onChange={() => this.handleChangeCheckbox(event, working.days)}
                                                           defaultChecked={working.continu}/>
                                                    <label className={'h6 d-inline-block ml-3'}
                                                           htmlFor={'continu-' + working.id}>En
                                                        continu</label>
                                                </div>
                                                <div className="col-md-6 text-left mt-3">
                                                    <label><FontAwesomeIcon icon={faClock} className={'ml-2'}/> heure
                                                        début</label>
                                                    <Input type={'time'} name={'morningFrom'} className={'mb-3'}
                                                           value={working.morningFrom}
                                                           onChange={() => this.handleChange(event, working.days)}/>
                                                    {working.continu ? null :
                                                        <Input type={'time'} name={'afternoonFrom'}
                                                               value={working.afternoonFrom}  className={'mb-3'}
                                                               onChange={() => this.handleChange(event, working.days)}/>}
                                                </div>
                                                <div className="col-md-6 text-left mt-3">
                                                    <label><FontAwesomeIcon icon={faClock} className={'ml-2'}/> heure
                                                        fin</label>

                                                    {working.continu ? null :
                                                        <Input type={'time'} name={'morningTo'}
                                                               value={working.morningTo}  className={'mb-3'}
                                                               onChange={() => this.handleChange(event, working.days)}/>}
                                                    <Input type={'time'} name={'afternoonTo'}  className={'mb-3'}
                                                           value={working.afternoonTo}
                                                           onChange={() => this.handleChange(event, working.days)}/>
                                                </div>
                                            </div> : null}
                                    </div>
                                )}
                                <div className={"workingSemaine col-md-12 text-left py-3"} >
                                    <Radio.Group defaultValue={this.state.isMultiple?'nextWeeks':'onlyThisWeek'} onChange={(e)=>{
                                        this.setState({
                                            isMultiple:e.target.value=='onlyThisWeek'?false:true,
                                        },()=>
                                        {
                                            if(!this.state.isMultiple){
                                                let myWeek=[];
                                                myWeek.push(this.state.weeks[0])
                                                this.setState({week:myWeek})
                                            }
                                        })
                                    }}>
                                        <Radio value={'onlyThisWeek'} > {t('onlyThisWeek')}

                                        </Radio>
                                        <hr/>
                                        <Radio value={'nextWeeks'}> {t('nextWeeks')}

                                        </Radio>
                                    </Radio.Group>
                                    {this.state.isMultiple?
                                        <div className={"col-md-12 text-left py-3"} style={{borderBottom: '1px solid #949494'}}>
                                        <Select mode={'multiple'} defaultValue={this.state.week}
                                                name={'semaine'}
                                                placeholder="Sélectionner les semaines "
                                                onChange={(e) => {
                                                    this.setState({week: e})
                                                }}
                                                style={{width: '100%'}}
                                        >
                                            {this.week}
                                        </Select>
                                    </div>:null}
                                </div>
                            </>}
                    </div>

                        <button type={'submit'} className="btnBlue border-orange bg-orange mt-5">Enregistrer</button>
                </form>
            )
        }
    }
}

export default withTranslation()(Horaires);