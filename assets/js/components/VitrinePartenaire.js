import React, {Component} from 'react';
import axios from "axios";
import PartageBlock from "./PartageBlock";
import Footer from "./Footer";
import {faClock, faEnvelope, faMapMarkerAlt, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GoogleMapReact from "google-map-react";
import Header from "./Header";
import {Modal} from 'antd';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {HelmetProvider, Helmet} from 'react-helmet-async';
const AnyReactComponent = ({text}) => <div>{text}</div>;

class VitrinePartenaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            visible: false,
            ville:'',
            imgGall: '',
            partenaire: {},
            centre: {},
            working: [],
            photos: {
                gellery: []
            }
        }
    }

    static defaultProps = {
        center: {
            lat: 59.95,
            lng: 30.33
        },
        zoom: 11
    };

    componentDidMount(props) {
        window.scrollTo(0, 0);
     
        let mayArray=(this.props.location.pathname).split('-')
        
        let id = mayArray[(mayArray.length)-1] 
        let nomStructure = mayArray.slice(1,(mayArray.length)-2)
        let ville = mayArray.slice((mayArray.length)-2,(mayArray.length)-1)
       
        axios.get('api/centre/vitrine/' + id + '/' + nomStructure + '/' + ville).then(res => {
            this.setState({centre: res.data.centres, partenaire: res.data.partenaire}, () => {
                axios.get('api/working/get?id=' + this.state.centre.id).then(res => {
                    this.setState({
                        working: res.data.working,
                        ville:ville
                    }, () => {
                        this.setState({loading: false});
                    });
                })
            })
        })
        axios.get('api/centre/photo/list?id=' + id).then(res => {
            this.setState({photos: res.data.photos})
        })

    }

    render() {
        let loading = this.state.loading
        let state = this.state
        return (
            <>
               {loading ? null :

                        <HelmetProvider>
                            <Helmet defer={false} prioritizeSeoTags>
                                <title> { state.partenaire.nomStructure+": organise des activités  sur "+state.ville}</title>
                               
                                <meta property="og:title" content={ state.partenaire.nomStructure+": organise des activités  sur "+state.ville}/>
                                <meta property="og:description" content={"La société "+state.partenaire.nomStructure+" organise des activité  près de chez toi à "+state.ville+". Vous pouvez trouver toutes ces offres aux meilleurs prix sur toog."}/>
                                <meta property="og:type" content={"website"}/>
                                 <meta name="description" content={"La société "+state.partenaire.nomStructure+" organise des activité  près de chez toi à "+state.ville+". Vous pouvez trouver toutes ces offres aux meilleurs prix sur toog."}/>
                                <meta name="title" content={ state.partenaire.nomStructure+": organise des activités  sur "+state.ville}/>
                                <link rel="canonical" href={window.location.href}/>
                                <meta name="robots" content="index, follow"/>
                            </Helmet>
                        </HelmetProvider>


                    }
                     
                <Header/>
                <div >
                    <div className={"Profil_Partenaire container py-4 px-sm-5"}
                         style={{ minHeight: 'calc( 100vh - 646px )'}}>
                        {loading ?
                            <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">
                                </span>
                            </p> :

                            <div className="row">
                                <div className="col-md-6 mb-3 text-center">
                                    <div className="bg-white borderedBlock">
                                        <div className={'bgVitrine'}
                                             style={{backgroundImage: 'url(' + state.photos.bg_photo + ')'}}
                                        >

                                        </div>
                                        <div style={{backgroundImage: 'url(' + state.photos.logo + ')'}}
                                             className={'toTop'}>
                                        </div>
                                        <h4 className={'mb-4'}
                                            style={{color: '#909090'}}>{state.partenaire.nomStructure}</h4>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3 text-left">
                                    <div className=" bg-white borderedBlock">
                                        <h5>Informations :</h5>
                                        <div className={'row grayText'}>
                                            <div className={'col-2 col-md-1'}>
                                                <FontAwesomeIcon icon={faPhone}/>
                                            </div>
                                            <div className={'col-10 col-md-11'}>
                                                {state.partenaire.phone}
                                            </div>
                                        </div>
                                        <div className={'row grayText'}>
                                            <div className={'col-2 col-md-1'}>
                                                <FontAwesomeIcon icon={faEnvelope}/>
                                            </div>
                                            <div className={'col-10 col-md-11'}>
                                                {state.partenaire.email}
                                            </div>
                                        </div>
                                        <div className={'row grayText'}>
                                            <div className={'col-2 col-md-1'}>
                                                <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                            </div>
                                            <div className={'col-10 col-md-11'}>
                                                {state.centre.adresse}
                                            </div>
                                        </div>
                                        <div className={'row grayText'}>
                                            <div className={'col-2 col-md-1'}>
                                                <FontAwesomeIcon icon={faClock}/>
                                            </div>
                                            <div className={'col-10 col-md-11'}>
                                                {state.working.map(work =>
                                                    <p key={work.id}>
                                                        <span
                                                            className={'d-block d-sm-inline-block mt-3 mt-sm-0'}>{work.dayName}</span>
                                                        {work.work ?
                                                            <>{work.continu ?
                                                                <>{work.morningFrom}-{work.afternoonTo}</> :
                                                                <>{work.morningFrom}-{work.morningTo} / {work.afternoonFrom}-{work.afternoonTo} </>
                                                            }</> : 'Fermé'
                                                        }

                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3 mt-5 text-left bg-white borderedBlock">
                                    <h5>Présentation</h5><br/>
                                    <p className={'grayText'}>{state.centre.description}</p>
                                </div>
                                <div className="col-md-6 mb-3 mt-5 text-left bg-white borderedBlock">
                                    <h5>Découvrez nous en Images</h5><br/>
                                    <div className={'row'}>
                                        {this.state.photos.gellery ?
                                            this.state.photos.gellery.map(gall =>
                                                gall.url?
                                                    <div className={'col-md-3 col-4'} key={gall.id}>
                                                        {/*<div className={'border10'} style={{backgroundImage:'url('+gall.url+')',width:'100%',height:'150px'}} > </div>*/}
                                                        <LazyLoadImage src={gall.url} width={'100%'} style={{borderRadius: '10px'}}
                                                             onClick={() =>
                                                                 this.setState({visible: true, imgGall: gall.url})
                                                             }/>

                                                    </div>
                                                    :null

                                            )
                                            : <p>Pas encore des images</p>}
                                    </div>
                                </div>
                                <Modal visible={this.state.visible} onCancel={() =>
                                    this.setState({visible: false})}
                                       footer={null}>
                                    <LazyLoadImage src={this.state.imgGall} width={'100%'}
                                         style={{borderRadius: '10px'}}/>
                                </Modal>
                                {/*<div className={'col-md-6 mt-5 '}>
                                <div className={'borderedBlock h-100'}>
                                    <GoogleMapReact
                                        bootstrapURLKeys={{key:'12154546'}}
                                        defaultCenter={this.props.center}
                                        defaultZoom={this.props.zoom}
                                    >
                                        <AnyReactComponent
                                            lat={59.955413}
                                            lng={30.337844}
                                            text="My Marker"
                                        />
                                    </GoogleMapReact>
                                </div>
                            </div>*/}
                            </div>
                        }
                    </div>
                    <PartageBlock/>
                    <Footer/>
                </div>
            </>
        )
    }

}

export default VitrinePartenaire;