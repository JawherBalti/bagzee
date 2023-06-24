import React, {Component} from 'react';
import axios from "axios";
import {Modal, Select} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";
import Block404 from "../../Block404";
import { LazyLoadImage } from 'react-lazy-load-image-component';

class InfoVitrine extends Component {
    constructor() {
        super();
        this.state = {
            centres: {
                adresse: '',
                phone: '',
                description: '',
                centre_interet: []

            }, centre_interet: []
            , loading: true, isEdit: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.showInfo = this.showInfo.bind(this);
    }

    userState() {
        let user = JSON.parse(localStorage.getItem('partenaire'));
        this.setState({partenaire: user.partenaire}, () => {
            console.log(user)
            this.showInfo()
        })
    }

    showInfo() {
        let partenaire = this.state.partenaire
        axios.get('api/centre/get?token=' + partenaire.token).then(res => {
            if (res.data.centres.length > 0) {
                this.setState({
                    centres: res.data.centres[0],
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        })

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.state.loading = true;
        this.userState()
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            centres: {
                ...prevState.centres,    // keep all other key-value pairs
                [name]: value
            }
        }));
    }


    formSubmit(event) {
        let partenaire = this.state.partenaire
        event.preventDefault();
        let that = this;
        this.setState(prevState => ({
                centres: {
                    ...prevState.centres,
                    centre_interet: this.state.centre_interet

                }
            }), () => {
                console.log(JSON.stringify(this.state.centres.id),
                    axios.put(' api/centre/update?token=' + partenaire.token, {centres: this.state.centres}).then(function (response) {

                            if (response.data.status == true) {
                                localStorage.setItem('centre_id', JSON.stringify(response.data.centres[0].id));


                                const modal = Modal.success({
                                    content: (
                                        <div className={"text-center"}>
                                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                                            <h4 className={" pt-2"}>
                                                Modification Vitrine Partenaire
                                            </h4>
                                            <p className={"text-success pt-2"}>
                                                Vos informations ont été mise à jour
                                            </p>

                                        </div>),
                                    okText: 'ok',
                                });
                                if (!that.state.centres.id)
                                    setTimeout(() => {
                                        window.location.reload(false);
                                    });

                                setTimeout(() => {
                                    modal.destroy();
                                }, 5000);
                            }
                            let partenaire = that.state.partenaire
                            axios.get('api/centre/get?token=' + partenaire.token).then(res => {
                                if (res.data.centres.length > 0) {
                                    that.setState({
                                        centres: res.data.centres[0],
                                        loading: false
                                    });
                                } else {
                                    that.setState({
                                        loading: false
                                    });
                                }
                            })
                        },
                    ).catch(function (error) {
                        console.log(error);
                    }))
            }
        )

    }

    render() {
        const loading = this.state.loading;
        return (
            <div className={"Info-vitrine "}>
                <div className={"col-sm-12 text-right"}>
                    <button className={"edit"} onClick={() => {
                        this.setState({isEdit: !this.state.isEdit});
                    }}><FontAwesomeIcon icon={faEdit}/> Editer
                    </button>
                </div>
                {loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">
                    </span>
                    </p> :
                    <form onSubmit={this.formSubmit}>


                        <div className={"row mb-3"}>
                            <div className={"col-md-3"}>
                                <label className={"centrage-y"}>Adresse</label>
                            </div>
                            <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                <input type={"text"} name={"adresse"} value={this.state.centres.adresse}
                                       placeholder={"Adresse*"} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <div className={"col-md-3"}>
                                <label className={"centrage-y"}>Numéro de téléphone</label>
                            </div>
                            <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                <input type={"tel"} minLength={10} maxLength={10} placeholder={'0600000000'}
                                       name={"phone"} value={this.state.centres.phone}
                                       onKeyPress={(event) => {
                                           if (!/[0-9]/.test(event.key)) {
                                               event.preventDefault();
                                           }
                                       }} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <div className={"col-md-3"}>
                                <label>Description</label>
                            </div>
                            <div className={this.state.isEdit ? "col-md-9 readOnly" : "col-md-9"}>
                                <textarea maxLength="750" rows="5" name={"description"} placeholder={"Description*"}
                                          onChange={this.handleChange}>
                                    {this.state.centres.description}
                                </textarea>
                                <p style={{color: '#C2C2C2'}}>Max 750 caractères</p>
                            </div>
                        </div>

                        {(this.state.isEdit === false) ?
                            <button className="btn-blue" type="submit">
                                Continuer
                            </button> : null}


                    </form>
                }
            </div>
        )
    }

}

export default InfoVitrine;