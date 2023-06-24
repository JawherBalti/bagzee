import React, {Component, useRef} from 'react'
import useIntersectionObserver from '@react-hook/intersection-observer'
import Iframe from "react-iframe";
import {Link} from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import {Select} from "antd";
import 'react-multi-carousel/lib/styles.css';
import 'moment/locale/fr';
import CarouselPart from "./CarouselPart";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Header from "./Header";
import {withTranslation, Trans} from "react-i18next";
import VoyagerAvantage from "./VoyagerAvantage";
import {auth} from "../hooks/firebase";
import {signOut} from "firebase/auth";
import moment from "moment";

const {Option} = Select;


const responsiveLoisirs = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 3000},
        items: 6,
        slidesToSlide: 1 // optional, default to 1.
    },
    desktop: {
        breakpoint: {max: 3000, min: 1024},
        items: 6,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1024, min: 464},
        items: 4,
        slidesToSlide: 1 // optional, default to 1.

    },
    mobile: {
        breakpoint: {max: 464, min: 0},
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    }
};

class LandingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

            partenaire: {
                token: '',
                firstName: ''
            },
            lang: [{
                id: '0',
                name: 'Fr'
            }, {
                id: '0',
                name: 'En'
            },],
            "blogs": [
                {
                    "id": 1,
                    "title": "Lorem ipsum dolor sit amet",
                    "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit  animproident, sunt in culpa qui officia deserunt mollit  animproident, sunt in culpa qui officia deserunt mollit  anim m ad minim veniam, commodo coid est laborum.",
                    "url": "https://www.google.com/",
                    "image": "/images/arnel-hasanovic.png",
                    "date_publish": "28-03-2023"
                },
                {
                    "id": 2,
                    "title": "Lorem ipsum dolor sit amet",
                    "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit  anim m ad minim veniam, commodo coid est laborum.",
                    "url": "https://www.google.com/",
                    "image": "/images/arnel-hasanovic.png",
                    "date_publish": "28-02-2023"
                },
                {
                    "id": 3,
                    "title": "Lorem ipsum dolor sit amet",
                    "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit  anim m ad minim veniam, commodo coid est laborum.",
                    "url": "https://www.google.com/",
                    "image": "/images/arnel-hasanovic.png",
                    "date_publish": "28-01-2023"
                },
            ],
            loading: true
        };

    }

    componentDidMount() {

        window.scrollTo(0, 0);
        axios.get('/api/blog/list').then(res => {
            this.setState({blogs: res.data.blogs, loading: false})
        })
    }

    handleChange(event) {
        console.log(event.target.value)
    }

    logout() {
        localStorage.clear();
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
        window.location.reload(false);
        //go to home page
    }

    render() {
        const {t} = this.props;
        const jour = [];
        for (let i = 1; i <= 31; i++) {
            jour.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{(i < 10 ? "0" : "") + i.toString()}</Option>);
        }
        const mois = [];
        for (let i = 1; i <= 12; i++) {
            mois.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{(i < 10 ? "0" : "") + i.toString()}</Option>);
        }
        const annee = [];
        for (let i = 1900; i <= 2004; i++) {
            annee.push(<Option key={(i < 10 ? "0" : "") + i.toString()}>{i.toString()}</Option>);
        }

        const Youtube = ({url, title}) => {
            const containerRef = useRef()
            const lockRef = useRef(false)
            const {isIntersecting} = useIntersectionObserver(containerRef)
            if (isIntersecting) {
                lockRef.current = true
            }
            return (
                <div className={'text-center'} ref={containerRef}>
                    {lockRef.current && (
                        <Iframe url={'/images/video_bagzee.mp4'} width={'100%'} height={'365px'}
                                title="video_bagzee" frameBorder="0"
                                allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen/>
                    )}
                </div>
            )
        }

        function handleChange(jours) {
            console.log(`Selected: ${jours}`);
        }

        function canUseWebP(img) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') > -1) {
                if (ua.indexOf('chrome') > -1) {
                    return '/images/' + img + '.webp'
                } else {
                    return '/images/' + img + '.png'
                }
            }
        }

        return (
            <div className={'HomeSection landing'}>
                <Header/>
                <section className="Header " style={{backgroundImage: 'url(images/bgHeader.png)'}}>
                    {/*<h1 className={"h1 text-center fs-4x"}>
                        On fait quoi ce soir, demain ou ce week-end?
                        <br/>
                        <p className={"text-center mt-5 fs-large fs-xl"} style={{color: '#C0C0C0', lineHeight: 1.5}}>
                            Avec Bagzee, tu
                            peux trouver des bons plans loisirs à prix ultra réduits, près<br/>de chez toi et en
                            faisant de nouvelles rencontres amicales
                        </p>
                    </h1>*/}
                </section>
                <section className='container py-5 px-3 px-md-0'>
                    <div className={'whiteBlock'}>
                        <div className={"row mb-3"}>
                            <div className={"col-lg-4"}>
                                <Link to={'/confier-bagage'}  style={{fontSize:'max(60%,82%)'}}
                                      className={'d-block btnConfier btnTransparent'}>{t('page_home.je_veux_confier_mon_bagage')}
                                </Link>
                            </div>
                            <div className={"col-lg-4"}>
                                <Link to={'/porter-bagage'} style={{fontSize:'max(60%,82%)'}}
                                      className={'d-block btnPorter w-100 btnTransparent'}>{t('page_home.je_veux_porter_un_bagage')}
                                </Link>
                            </div>
                            <div className={"col-lg-4"}>
                                <Link to={'/deposer-annonce'} style={{fontSize:'max(60%,82%)'}}
                                      className={'d-block btnDeposer w-100 btnTransparent'}>{t('page_home.deposer_une_annonce')}
                                </Link>
                            </div>
                        </div>
                        <div className={"row mb-3"}>
                            <div className={"col-lg-9"}>
                                <LazyLoadImage src={"/images/assurance.png"} alt={"assurance"}/> <span
                                style={{fontSize: 'small', color: '#B5B5B5'}}>{t('page_home.assurance')} </span>
                            </div>

                        </div>
                    </div>
                </section>

                <section className={'container-fluid my-5 px-0'}>
                    <div className={'px-md-5 mx-md-5 px-3'}>
                        <h2 className="col-md-12 pb-5 fs-4 text-center text-uppercase">{t('page_home.dernieres_ann')}</h2>
                        <CarouselPart/>
                    </div>
                </section>
                <section className='container-fluid my-5 px-0'
                         style={{backgroundImage: 'url(/images/bgBlockSection.png)', backgroundRepeat: 'no-repeat',backgroundSize:'cover',backgroundPosition:'right'}}>
                    <div className={'px-md-5 mx-md-5 p-3'}>
                        <div className={'row'}>
                            <div className={'col-lg-6'}>
                                <Youtube/>
                            </div>
                            <div className={'col-lg-6 d-flex flex-column justify-content-center py-5'}>

                                <h4 className={'text-white text-uppercase'}>
                                    <Trans i18nKey="page_home.titleBleuSection">
                                        Bagzee, la nouvelle application<br/>de mise en relation pour faciliter<br/>le
                                        transport de bagages.
                                    </Trans></h4>

                                <p className={'text-white'}>
                                    <Trans i18nKey="page_home.descBleuSection">
                                        <strong>Notre service te permet d’économiser 30% sur le prix du supplément
                                            bagage en
                                            confiant ton bagage à un autre voyageur.
                                            Il suffit de créer un compte, mettre les détails du bagage et du trajet pour
                                            que
                                            son annonce soit déposée !</strong><br/>
                                        Le propriétaire du bagage et le porteur s’accordent sur le lieu de retrait et de
                                        livraison. Le propriétaire réserve et paye la transaction.
                                    </Trans>
                                </p>

                                <Link to={'/comment-ca-marche'}
                                      className={'btnWhite'}>{t('en_savoir_plus')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <section className={'container-fluid d-flex flex-md-row flex-column'}
                         style={{marginBottom: '10%'}}>
                    <div className={'row'}>
                        <div className={'col-lg-4'}>
                            <div style={{
                                background: 'url(/images/triangleBleu.png',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '100% 0',
                                backgroundSize: 'auto'
                            }}>
                                <div className={'d-flex flex-column justify-content-between dialogueBleu'}>
                                    <h4 className={'text-white'}>
                                        {t('page_home.confierBagages')}<br/><small>{t('page_home.confierBagagesSmall')}</small>
                                    </h4>
                                    <p className={'text-white'}>
                                        <Trans i18nKey={'page_home.confierBagagesDesc'}>
                                            <strong>Qu’importe la destination, confie ta valise et déplace-toi en toute
                                                liberté !</strong><br/>. Le prix du supplément bagage est élevé.<br/>.
                                            Tu veux voyager moins cher ?<br/>. Voyager léger ?<br/>. Tu as déjà eu un
                                            bagage perdu ou endommagé ?<br/>. Tu veux envoyer des affaires personnelles
                                            à tes proches ?<br/>BAGZEEEEE !
                                        </Trans>
                                    </p>
                                    <Link to={'/comment-ca-marche'}
                                          className={'d-block btnTransparent'}>{t('en_savoir_plus')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className={'col-lg-4 d-flex justify-content-center'}>
                            <LazyLoadImage src={"/images/confierPorterBagage.png"} alt={"confierPorterBagage"}
                                           className={'img2BlockDialogue'}/>
                        </div>
                        <div className={'col-lg-4'}>

                            <div style={{
                                background: 'url(/images/triangleOrange.png',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: '0 0',
                                backgroundSize: 'auto',
                            }}>
                                <div className={'d-flex flex-column justify-content-between dialogueOrange'}>
                                    <h4 className={'text-white'}>{t('page_home.porterBagages')} <br/>
                                        <small>{t('page_home.porterSmall')}</small></h4>
                                    <p className={'text-white'}>
                                        <Trans i18nKey={'porterBagagesDesc'}>
                                            <strong>Tu es un globe-trotter ou simplement un voyageur ponctuel.Tu serais
                                                heureux
                                                de gagner
                                                de l’argent en voyageant ?</strong><br/>
                                            . Tu te déplaces en voiture, en car, en camion, en train, en bateau ou en
                                            avion
                                            ?<br/>
                                            . Tu as de la place pour prendre un bagage supplémentaire ?<br/>
                                            Tu n'atteins pas ton quota de poids de bagage ?
                                        </Trans>
                                    </p>
                                    <Link to={'/comment-ca-marche'}
                                          className={'d-block btnTransparent'}>{t('en_savoir_plus')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
                <VoyagerAvantage/>

                <div className={'container-fluid'}>
                    <Link to={'/faq'}
                          className={'btnFAQ'}>FAQ
                    </Link>
                </div>
                <section className={'container-fluid my-5 py-4'}>
                    <div className={"row mb-3 px-md-5 mx-md-5 px-3"}>
                        {this.state.blogs?.map(item =>
                            <Link to={item.url} className="col-md-4 text-decoration-none">
                                <LazyLoadImage src={item.image} alt={item.title} className={'mb-2'} style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: 272,
                                    borderRadius: 32
                                }}/>
                                <h4 className={'mb-2'} style={{color: '#4BBEED'}}>BAGZEE</h4>
                                <h5 className={'mb-2'} style={{color: '#000'}}>{item.title}</h5>
                                <p className={'mb-2 limitRows'} style={{color: '#000'}}>{item.description}</p>
                                <p className={'mb-2'} style={{color: '#EE7923'}}>
                                    {moment(new Date(item.date_publish.split('-')[2] + "-" + item.date_publish.split('-')[1] + "-" + item.date_publish.split('-')[0] + "T00:00")).locale('fr').format('dddd D MMMM YYYY')}</p>
                            </Link>)}
                    </div>
                </section>
                <Footer/>
            </div>
        )
    }
}

export default withTranslation()(LandingPage);
