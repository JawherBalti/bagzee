import React, {Component} from 'react';
import axios from "axios";
import Faq from "react-faq-component";
import {LazyLoadImage} from "react-lazy-load-image-component";
import Header from "./Header";
import Footer from "./Footer";
import preview from "emoji-mart/dist-modern/components/preview";

class Faqs extends Component {
    constructor() {
        super();
        this.state = {
            faqData1: {
                title: '',
                rows: [
                    /*{
                        "title": "Comment envoyer un bagage en train (SNCF) ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment envoyer un bagage en avion (livraison de bagage à domicile) ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment envoyer un bagage par car ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment ne pas payer de supplément bagage ?",
                        "content": "Bagzee est une application qui te permet de ne pas payer de supplément bagage en prenant l'avion, le train, le car ou le bateau ! Au lieu de payer un excédent bagage pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion ! Économise 30% par rapport au prix du surplus bagage que tu payerais en prenant l'avion et le porteur gagneras de l'argent ! "
                    }, {
                        "title": "Comment suivre mon bagage (suivi) ?",
                        "content": "Sur Bagzee (l'application qui te permet de faire de ne pas payer de supplément bagage) le système de suivi est très simple.\n" +
                            "Rends toi dans tes réservations, puis tu verras la liste des étapes d’acheminement de ta valise. \n" +
                            "Le porteur valide les ces étapes tout au long du transport."
                    }, {
                        "title": "Comment envoyer une valise en toute sécurité ? ",
                        "content": "Environ 82 000 bagages sont perdus chaque jour dans tous les aéroports du monde.\n" +
                            "Découvre le cobagage avec Bagzee, l'application qui te permet d'envoyer et de livrer tes bagages en toute sécurité. \n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination\n" +
                            "Tu peux suivre les étapes d’acheminement de tes valises depuis l'application."
                    }, {
                        "title": "Livraison de valise en 24h ",
                        "content": "Pour faire livrer et envoyer tes valises et ne pas payer d'excédent bagage, fais du cobagage sur Bagzee:\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination\n" +
                            "Tu peux suivre les étapes d’acheminement de tes valises depuis l'application."
                    }, {
                        "title": "Qu'est ce que le cobagage ?",
                        "content": "Le cobagage, c'est comme le covoiturage, ça fonctionne sur la base de l'économie de partage et de la livraison collaborative entre particuliers. Si tu voyage et que tu part en vacance, il te suffit d'aller sur le site ou l'app de Bagzee, de déposer ou chercher une annonce qui correspond à ton itinéraire et c'est bon ! Tu fera des économies en ne passant pas par les services payants de supplément bagage des compagnies de transport en commun et tu ne sera pas encombré tout au long de ton trajet."
                    }*/
                ]

            },
            faqData2: {
                title: '',
                rows: [
                    /*{
                        "title": "Comment envoyer un bagage en train (SNCF) ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment envoyer un bagage en avion (livraison de bagage à domicile) ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment envoyer un bagage par car ?",
                        "content": "Pour envoyer et faire livrer ton bagage à domicile ou en point relais, utilise Bagzee, l'application de cobagage qui permet de ne pas payer de supplément bagage en prenant le train, l'avion, le car ou le bateau ! Au lieu de payer un excédent pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion !\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination"
                    }, {
                        "title": "Comment ne pas payer de supplément bagage ?",
                        "content": "Bagzee est une application qui te permet de ne pas payer de supplément bagage en prenant l'avion, le train, le car ou le bateau ! Au lieu de payer un excédent bagage pour ta valise en soute, en cabine ou tes objets hors formats, confies-les à un autre voyageur qui fait le même trajet en voiture, en train, en car, en bateau ou même en avion ! Économise 30% par rapport au prix du surplus bagage que tu payerais en prenant l'avion et le porteur gagneras de l'argent ! "
                    }, {
                        "title": "Comment suivre mon bagage (suivi) ?",
                        "content": "Sur Bagzee (l'application qui te permet de faire de ne pas payer de supplément bagage) le système de suivi est très simple.\n" +
                            "Rends toi dans tes réservations, puis tu verras la liste des étapes d’acheminement de ta valise. \n" +
                            "Le porteur valide les ces étapes tout au long du transport."
                    }, {
                        "title": "Comment envoyer une valise en toute sécurité ? ",
                        "content": "Environ 82 000 bagages sont perdus chaque jour dans tous les aéroports du monde.\n" +
                            "Découvre le cobagage avec Bagzee, l'application qui te permet d'envoyer et de livrer tes bagages en toute sécurité. \n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination\n" +
                            "Tu peux suivre les étapes d’acheminement de tes valises depuis l'application."
                    }, {
                        "title": "Livraison de valise en 24h ",
                        "content": "Pour faire livrer et envoyer tes valises et ne pas payer d'excédent bagage, fais du cobagage sur Bagzee:\n" +
                            " 1. Envoie tes valises\n" +
                            "2. Profite du fait de ne pas être encombré durant ton voyage\n" +
                            "3. Récupère-les à destination\n" +
                            "Tu peux suivre les étapes d’acheminement de tes valises depuis l'application."
                    }, {
                        "title": "Qu'est ce que le cobagage ?",
                        "content": "<h1>Le cobagage, c'est comme le covoiturage, ça fonctionne sur la base de l'économie de partage et de la livraison collaborative entre particuliers. Si tu voyage et que tu part en vacance, il te suffit d'aller sur le site ou l'app de Bagzee, de déposer ou chercher une annonce qui correspond à ton itinéraire et c'est bon ! Tu fera des économies en ne passant pas par les services payants de supplément bagage des compagnies de transport en commun et tu ne sera pas encombré tout au long de ton trajet.</h1>"

                    }*/
                ]

            }, loading1: false, loading2: false
        }
        console.log(this.state.faq)
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        console.log(this.state.faq)

        axios.get('api/regle/faq').then(res=>{
            if(res.data.faq.length>2) {
                let myTab1 = []
                let myTab2 = []
                res.data.faq.map((item,key) => {
                    return (key%2) ==0 ? myTab1.push({title: item.question, content: item.reponse}):myTab2.push({title: item.question, content: item.reponse})

                });

                if (myTab1.length ) {
                    this.setState(prev => ({
                        faqData1: {
                            ...prev.faqData1,
                            rows: myTab1
                        }
                    }), () => {
                        console.log(this.state.faqData1)

                        this.setState({loading1: false})
                    })
                }
                if (myTab2.length) {
                    this.setState(prev => ({
                        faqData2: {
                            ...prev.faqData2,
                            rows: myTab2
                        }
                    }), () => {
                        console.log(this.state.faqData2)
                        this.setState({loading2: false})
                    })
                }

            }else{
                let myTab1 = []
                res.data.faq.map((item,key) => {
                    myTab1.push({title: item.question, content: item.reponse})
                })
                this.setState(prev => ({
                    faqData1: {
                        ...prev.faqData1,
                        rows:myTab1
                    }
                }), () => {
                    console.log(this.state.faqData1)

                    this.setState({loading1: false,loading2: false})
                })
            }
        })

        /* axios.get('api/faq/client').then(res => {
            this.setState(prev=>({
                faqData: {
                    ...prev.faqData,
                    rows: res.data.faq
                }
            }), () => {
                console.log(this.state)
                this.setState({loading: false})
            })
        })*/
    }

    render() {
        let loading1 = this.state.loading1
        let loading2 = this.state.loading2

        return (
            <>
                <Header/>
                <div className={"profil_blocks Faq"}>
                    <div className={"container-fluid py-2 px-4"}>

                        <div className={"row"}>
                            <div className={"col-12 my-3 "}>
                                <h5 className={"text-center"}>
                                    <LazyLoadImage src={"/images/faq.png"} alt={"faq"}/>

                                    <br/>
                                    <br/>
                                    Tu as des questions, nous avons les réponses !<br/>
                                    Tu peux également nous contacter à tout moment sur le chat box ou sur le formulaire
                                    de contact.
                                </h5>
                            </div>

                        </div>
                    </div>
                    <div className={"container pt-4 pb-2 px-4"}>
                        {(loading1||loading2) ?
                            <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                            </p>
                            : <div className={"row mt-5 mb-3"}>
                                {this.state.faqData1.rows.length?<div className={"col-md-6 p-4"}>
                                    {/*<h6>Qui somme nous?</h6>*/}
                                  <Faq data={this.state.faqData1}
                                          dangerouslySetInnerHTML={{__html: this.state.faqData1}}/>

                                </div>:null}
                                {this.state.faqData2.rows.length?<div className={"col-md-6 p-4"}>
                                    {/*<h6>Qui somme nous?</h6>*/}
                                    <Faq data={this.state.faqData2}
                                         dangerouslySetInnerHTML={{__html: this.state.faqData2}}/>

                                </div>:null}
                            </div>}
                    </div>
                </div>
                <Footer/>
            </>
        )
    }
}

export default Faqs;