import React, {Component, useRef} from 'react';
import {withTranslation, Trans} from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import CarouselPart from "./CarouselPart";
import VoyagerAvantage from "./VoyagerAvantage";
import {Link} from "react-router-dom";
import useIntersectionObserver from "@react-hook/intersection-observer";
import Iframe from "react-iframe";

class CommentCaMarche extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
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
        const {t} = this.props;
        return (
            <div>
                <Header/>
                <section className={'pagecommentCaMarche container_fluid position-relative'}
                         style={{
                             backgroundImage: 'url(images/headerCCM.png),url(images/bgCommentCaMarche.png)',
                             backgroundPosition: 'top,bottom',
                             backgroundSize: '100%,cover',
                             backgroundRepeat: 'no-repeat'
                         }}>
                    <div className={'headerCCM'}>
                        <h5>
                            <Trans i18nKey={'commentCaMarche.titleHeader'}>
                                Comment utiliser<br/>
                                le service BAGZEE ?
                            </Trans>
                        </h5>
                        <p>
                            <Trans i18nKey={'commentCaMarche.paragHeader'}>
                                Voici toutes les explications<br/>pour confier ou porter un bagage.
                            </Trans>
                        </p>
                    </div>
                    <div className={'text-center'}>
                        <LazyLoadImage src={"/images/imgCommentCaMarche.png"} alt={"imgCommentCaMarche"}
                                       style={{padding: '30px 10px',width:'50%',minWidth:300}}/>
                    </div>

                    <div className={'container'}>
                        <p className={'text-white py-4 text-center'}>
                            {t('commentCaMarche.paragCentered')}
                        </p>
                    </div>
                    <div className={'container-fluid my-5 px-0'}>
                        <div className={'px-md-5 mx-md-5 px-3'}>
                            <div className={'row'}>
                                <div className={'col-lg-6'}>
                                    <h6>{t('page_home.depart')}</h6>
                                    <p className={'text-white'}>
                                        <Trans i18nKey={'commentCaMarche.paragdepart'}>
                                            Dépose ton annonce ou cherche celle d'un porteur qui correspond à ton trajet<br/>Choisi
                                            le lieu de prise en charge (en main propre ou en points relais) <br/>Réserve
                                            sur
                                            Bagzee et prépare ton bagage<br/>Contrôle le contenu du bagage avec le
                                            porteur
                                            ou<br/>le gérant du point relais au lieu fixé<br/>Confie ton bagage !<br/>Profite
                                            de
                                            ton voyage en ayant l’esprit tranquille,<br/>les porteurs Bagzee sont
                                            vérifiés et
                                            notés.<br/><br/><br/>Tu peux suivre ton bagage sur l'application:<br/>En
                                            utilisant nos services tu gagneras du temps, du confort et de
                                            l'énergie.<br/>Économise
                                            ton argent et contribue considérablement à la réduction<br/>d’empreinte
                                            carbone
                                            !<br/>Pourquoi utiliser nos services en tant que propriétaire d’un bagage
                                            ?<br/>•
                                            Prendre plus d'affaires<br/>• Achats et cadeaux de retour<br/>• Déménagement<br/>•
                                            Marchandises interdites en avion<br/>• Livraison express<br/>• Peur qu’une
                                            compagnie
                                            perde mon bagage<br/>• Landeau et poussette <br/>• Enfant seul
                                        </Trans>
                                    </p>
                                </div>
                                <div className={'col-lg-6'}>
                                    <h6>{t('page_home.arrivee')}</h6>
                                    <p className={'text-white'}>
                                        <Trans i18nKey={'commentCaMarche.paragarrivee'}>
                                            • Contrôle le bagage avec le porteur ou le gérant du point relais au lieu
                                            de récupération fixé<br/>• Récupère ton bagage<br/>• Valide la transaction
                                            et
                                            note le porteur
                                        </Trans>
                                    </p><br/>
                                    <p className={'text-white'}>
                                      <Youtube />
                                    </p>
                                </div>
                                <div className='col-12 text-center py-5 mb-5 d-flex flex-column flex-md-row gap-4 justify-content-center align-items-center'>
                                    <Link to={'/deposer-annonce'}
                                        className={'btnWhite text-blue mx-2'}>{t('commentCaMarche.btnPubAnn')}</Link>
                                    <Link className={'btnWhite text-blue mx-2'} to={'/confier-bagage'}
                                            style={{backgroundColor: '#14566A'}}>{t('commentCaMarche.btnVoirPlusPorteur')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                <section className={'container-fluid my-5 px-0'}>
                    <div className={'px-md-5 mx-md-5 px-3'}>
                        <h2 className="col-md-12 pb-5 fs-4 text-center text-uppercase">{t('commentCaMarche.annProteurDispo')}</h2>
                        <CarouselPart/>
                    </div>
                    <p className={'text-orange text-uppercase py-5 text-center'}>{t('commentCaMarche.economiserPrixBagage')}</p>
                </section>
                <section className={'container-fluid py-5 px-0'} style={{
                    backgroundImage: ' url(images/bgCommentCaMarche2.png),linear-gradient(180deg, white , #f7931e, #f7931e, #f7931e)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    backgroundColor: '#F7931E'
                }}>
                    <div className={'px-md-5 mx-md-5 px-3 pt-3'}>
                        <div className={"row mb-3"}>
                            <div className={"col-lg-6"}>
                                <h2 className="col-md-12 text-white py-3 fs-4 text-uppercase px-0">{t('footer.porter_bagage')}</h2>
                                <p className={'text-white text-left'} style={{lineHeight:2}}>
                                    <b className={'text-white text-center w-100 d-block'}>
                                        {t('commentCaMarche.gainArgentBagage')}
                                    </b>
                                    <b className={'text-white text-center w-100 d-block'}>
                                        {t('commentCaMarche.voyageEnVoiture')}</b>
                                  <Trans i18nKey={'commentCaMarche.porterBagageParag'}>
                                      • Tu as de la place pour prendre un bagage supplémentaire ?<br/>
                                      • Tu n'atteins pas ton quota de poids autorisé ou tu voyages sans bagage ?<br/>
                                      • Tu aimerais réduire le coût de tes déplacements ?<br/>
                                  </Trans>
                                </p>
                                <h6 className="col-md-12 text-white pt-5 fs-6 px-0">{t('commentCaMarche.devenirPorteur')}</h6>


                            </div>
                            <div className={"col-lg-6 text-center"}>
                                <Youtube />

                            </div>
                            <div className={"col-lg-6"}>
                                <h5 className="col-md-12 text-white pb-5 fs-5 px-0">{t('page_home.depart')}</h5>
                                <p className={'text-white'}>
                                    <Trans i18nKey={'commentCaMarche.departParag'}>
                                    • Dépose ton annonce ou trouve celle d’un voyageur qui correspond à ton trajet<br/>
                                    • Accorde-toi avec le voyageur sur le lieu de dépôt et de prise en charge<br/>
                                    • (en main propre ou en points relais)<br/>
                                    • Réserve sur l’annonce<br/>
                                    • Contrôle le contenu du bagage avec le propriétaire ou<br/>
                                     le gérant du point relais au lieu fixé<br/>
                                    • Récupère-le bagage<br/>
                                    • Voyage en étant responsable<br/>
                                    </Trans>
                                </p>

                            </div>
                            <div className={"col-lg-6"}>
                                <h5 className="col-md-12 text-white pb-5 fs-5 px-0">{t('page_home.arrivee')}</h5>
                                <p className={'text-white'}  style={{lineHeight:2}}>
                                    <Trans i18nKey={'commentCaMarche.arriveeParag'}>
                                    • Contrôle le bagage avec le porteur ou le gérant du point relais au lieu de
                                    récupération fixé<br/>
                                    • Laisse le bagage au voyageur <br/>
                                    • Valide la transaction et note le voyageur
                                    <br/><br/>
                                    Rentabilise l'essence, le péage ou ton billet de transport !<br/>
                                    Contribue considérablement à la réduction d'empreinte carbone
                                    et change le monde !
                                    </Trans>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={'col-12 text-center d-flex flex-column flex-md-row gap-4 justify-content-center align-items-center'}>
                        <Link to={'/deposer-annonce'}
                            className={'btnWhite text-orange mx-2'}>{t('commentCaMarche.btnPubAnn')}</Link>
                        <Link to={"/porter-bagage"} className={'btnWhite mx-2'}
                                style={{backgroundColor: '#E05325',color:'#FFC471'}}>{t('commentCaMarche.btnVoirPlusProprietaire')}</Link>
                    </div>
                </section>
                <section className={'container-fluid my-5 px-0'}>
                    <div className={'px-md-5 mx-md-5 px-3'}>
                        <h2 className="col-md-12 pb-5 fs-4 text-center text-uppercase">{t('commentCaMarche.annBagagesPret')}</h2>
                        <CarouselPart myColor={true}/>
                    </div>
                </section>

                <Footer/>
            </div>
        )
    }
}

export default withTranslation()(CommentCaMarche);