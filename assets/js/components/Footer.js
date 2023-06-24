// ./assets/js/components/HomePageXD.js

import React, {Component} from 'react';
import {Link} from "react-router-dom";
import SubscribePartenaire from "./subscribePartenaire";
import moment from "moment";
import axios from "axios";
import {Modal} from "antd";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAt, faPhone, faTimes} from "@fortawesome/free-solid-svg-icons";
import {withTranslation} from "react-i18next";
import Login from "./Login";


class Footer extends Component {
    constructor() {
        super();
        this.state = {
            email: ''
        }
    }



    render() {
        const { t } = this.props;
        function canUseWebP(img) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') > -1) {
                if (ua.indexOf('chrome') > -1) {
                    return '/images/'+img+'.webp'
                } else {
                    return '/images/'+img+'.png'
                }
            }
        }
        return (
            <>
                <section className={'container-fluid commentCaMArche py-5 px-0'}>
                    <h2 className="col-md-12 pb-5 fs-3x text-center">{t('page_home.partageSection')}
                    </h2>
                    <p className={"mb-0 text-center"}>

                        <a href={'https://fr.linkedin.com/company/bagzeeofficiel'} target={'_blank'} className={'mx-2'}>
                            <svg id="linkedin-svgrepo-com_10_" data-name="linkedin-svgrepo-com (10)"
                                 xmlns="http://www.w3.org/2000/svg" width="48.12" height="48.12"
                                 viewBox="0 0 48.12 48.12">
                                <path id="Tracé_94" data-name="Tracé 94"
                                      d="M24.06,0A24.06,24.06,0,1,1,0,24.06,24.06,24.06,0,0,1,24.06,0Z"
                                      transform="translate(0 0)" fill="#0e76a8"/>
                                <path id="Tracé_95" data-name="Tracé 95"
                                      d="M81.957,93.858h4.505V78.842H81.957ZM99.509,78.322a6.762,6.762,0,0,0-5.531,2.561v-2.09H89.456V93.859h4.522V85.711a3.577,3.577,0,0,1,3.553-3.4c1.976,0,2.463,1.68,2.463,3.359v8.188H104.5V85.334C104.5,79.413,101.7,78.322,99.509,78.322Zm-15.32-.981a2.256,2.256,0,1,0-2.256-2.256A2.257,2.257,0,0,0,84.189,77.341Z"
                                      transform="translate(-68.399 -60.8)" fill="#fff"/>
                            </svg>
                        </a>
                        <a href={'https://www.tiktok.com/@bagzeeapp'} target={'_blank'} className={'mx-2'}>
                            <LazyLoadImage src={"/images/tiktok.png"} width={'48px'} alt={"bagzee"}/>

                        </a>
                        <a href={'https://www.youtube.com/@bagzee'} target={'_blank'} className={'mx-2'}>
                            <svg id="youtube-svgrepo-com_5_" data-name="youtube-svgrepo-com (5)"
                                 xmlns="http://www.w3.org/2000/svg" width="48.267" height="48.267"
                                 viewBox="0 0 48.267 48.267">
                                <circle id="Ellipse_14" data-name="Ellipse 14" cx="24.134" cy="24.134" r="24.134"
                                        transform="translate(0 0)" fill="#d42428"/>
                                <path id="Tracé_83" data-name="Tracé 83"
                                      d="M103.508,69.38a24.135,24.135,0,0,1-34.132,34.132Z"
                                      transform="translate(-62.31 -62.314)" fill="#cc202d"/>
                                <path id="Tracé_84" data-name="Tracé 84"
                                      d="M164.448,179.092,152.5,167.148l-14.087,1.6-8.521,13.192,15.922,15.922A24.161,24.161,0,0,0,164.448,179.092Z"
                                      transform="translate(-116.666 -150.125)" fill="#ba202e"/>
                                <path id="Tracé_85" data-name="Tracé 85"
                                      d="M144.929,158.935a3.662,3.662,0,0,0-3.661-3.663H124.092a3.662,3.662,0,0,0-3.66,3.663v9.822a3.662,3.662,0,0,0,3.66,3.663h17.176a3.662,3.662,0,0,0,3.661-3.663v-9.822Zm-14.7,9.055v-9.225l7,4.613Z"
                                      transform="translate(-108.167 -139.458)" fill="#fff"/>
                            </svg>
                        </a>
                        <a href={'https://www.instagram.com/bagzee_officiel/?fbclid=IwAR2o7RTj73OUmxRoTJxHZn8P6NMBVa9_ap6gbxaxY5E80TsyTqrX9g7xcFE'} target={'_blank'} className={'mx-2'}>

                            <svg id="instagram-svgrepo-com_10_" data-name="instagram-svgrepo-com (10)"
                                 xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                                <circle id="Ellipse_15" data-name="Ellipse 15" cx="24" cy="24" r="24"
                                        fill="#6c27b3"/>
                                <path id="Tracé_86" data-name="Tracé 86"
                                      d="M145.89,126.094a40.278,40.278,0,0,1-8.839.064c-4.189-.322-10.312-2.256-12.567,1.611-3.624,6.191-1.836,14.116-.992,21.13l12.593,12.59a23.928,23.928,0,0,0,22.6-22.6Z"
                                      transform="translate(-110.868 -113.671)" fill="#501a96"/>
                                <g id="Groupe_67" data-name="Groupe 67" transform="translate(10.231 10.231)">
                                    <path id="Tracé_87" data-name="Tracé 87"
                                          d="M128.7,109.468H117.628a8.169,8.169,0,0,0-8.16,8.16V128.7a8.169,8.169,0,0,0,8.16,8.16H128.7a8.169,8.169,0,0,0,8.16-8.16V117.628a8.169,8.169,0,0,0-8.16-8.16Zm5.4,19.231a5.4,5.4,0,0,1-5.4,5.4H117.628a5.4,5.4,0,0,1-5.4-5.4V117.628a5.4,5.4,0,0,1,5.4-5.4H128.7a5.4,5.4,0,0,1,5.4,5.4Z"
                                          transform="translate(-109.468 -109.468)" fill="#fff"/>
                                    <path id="Tracé_88" data-name="Tracé 88"
                                          d="M187.286,180.2a7.084,7.084,0,1,0,7.084,7.084,7.092,7.092,0,0,0-7.084-7.084Zm0,11.413a4.329,4.329,0,1,1,4.329-4.329,4.329,4.329,0,0,1-4.329,4.329Z"
                                          transform="translate(-173.591 -173.591)" fill="#fff"/>
                                </g>
                                <g id="Groupe_68" data-name="Groupe 68" transform="translate(23.873 10.231)">
                                    <path id="Tracé_89" data-name="Tracé 89"
                                          d="M317.172,164.309a1.7,1.7,0,1,1-1.7-1.7,1.7,1.7,0,0,1,1.7,1.7Z"
                                          transform="translate(-308.323 -157.644)" fill="#d1d1d1"/>
                                    <path id="Tracé_90" data-name="Tracé 90"
                                          d="M261.015,109.468h-5.589v2.755h5.589a5.4,5.4,0,0,1,5.4,5.4V128.7a5.4,5.4,0,0,1-5.4,5.4h-5.589v2.755h5.589a8.169,8.169,0,0,0,8.16-8.16V117.628A8.169,8.169,0,0,0,261.015,109.468Z"
                                          transform="translate(-255.426 -109.468)" fill="#d1d1d1"/>
                                    <path id="Tracé_91" data-name="Tracé 91"
                                          d="M255.48,180.2h-.054v2.755h.054a4.329,4.329,0,0,1,0,8.657h-.054v2.755h.054a7.084,7.084,0,0,0,0-14.168Z"
                                          transform="translate(-255.426 -173.591)" fill="#d1d1d1"/>
                                </g>
                            </svg>


                        </a>
                        <a href={'https://www.facebook.com/people/Bagzee-Officiel/100089718671353/'} target={'_blank'} className={'mx-2'}>
                            <svg id="facebook-svgrepo-com_16_" data-name="facebook-svgrepo-com (16)"
                                 xmlns="http://www.w3.org/2000/svg" width="48.12" height="48.12"
                                 viewBox="0 0 48.12 48.12">
                                <path id="Tracé_92" data-name="Tracé 92"
                                      d="M24.06,0A24.06,24.06,0,1,1,0,24.06,24.06,24.06,0,0,1,24.06,0Z"
                                      fill="#3b5998"/>
                                <path id="Tracé_93" data-name="Tracé 93"
                                      d="M118.1,77.127h3.1v-4.58h-3.645v.017c-4.417.156-5.322,2.639-5.4,5.247h-.009V80.1h-3.007v4.486h3.007V96.607h4.532V84.583h3.713l.717-4.486h-4.428V78.715A1.477,1.477,0,0,1,118.1,77.127Z"
                                      transform="translate(-91.109 -60.564)" fill="#fff"/>
                            </svg>

                        </a>
                    </p>
                    <div className="mosaic-container pt-5 mb-0">

                        <div className="col col-0">
                            <div className="picture">
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={canUseWebP("helena-lopes")}
                                    alt="helena-lopes"/>
                            </div>

                        </div>
                        <div className="col col-6">
                            <div className="picture">
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={canUseWebP("spencer-davis")}
                                    alt="spencer-davis"/>
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={canUseWebP("tim-mossholder")}
                                    alt="tim-mossholder"/>
                            </div>
                            <div className="picture">
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={canUseWebP("jeshoots-com")}
                                    alt="jeshoots-com"/>
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={canUseWebP("bagage")}
                                    alt="bagage"/>
                            </div>
                        </div>
                        <div className="col col-3">
                            <div className="picture">
                                <LazyLoadImage
                                    data-src-transform="cover"
                                    src={"images/famille.png"}
                                    alt="famille"/>
                            </div>

                        </div>

                    </div>
                </section>
                <div className="footerSection p-md-5">
                    <div className={" container"}>
                        <div className="row">
                            <div className="col-md-3 my-3 text-left">
                                <p className={"TitleCol"}>
                                    {t('footer.contactUs')}
                                </p>
                                <p className={"mb-2 fs-small"}>
                                    <FontAwesomeIcon icon={faPhone}/> 06 25 45 43 50
                                </p>
                                <p className={"mb-2 fs-small"}>
                                    <FontAwesomeIcon icon={faAt}/> hugo.serres@bagzee.fr
                                </p>
                            </div>
                            <div className="col-md-3 my-3 text-left">
                                <p className={"TitleCol"}>
                                    {t('reserver')}
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/confier-bagage"}>{t('footer.find_depart')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/deposer-annonce"}>{t('footer.proposer_depart')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/suivre-valise"}>{t('footer.suivre_valise')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/partenaires-points-relais"}>{t('footer.find_pRelais')}</Link>
                                </p>
                            </div>
                            <div className="col-md-3 my-3 text-left">
                                <p className={"TitleCol"}>
                                    {t('footer.lesBagages')}
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/comment-ca-marche"}>{t('footer.comm_ca_fonction')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/confier-bagage"}>{t('footer.deposer_ann')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/porter-bagage"}>{t('footer.porter_bagage')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <SubscribePartenaire/>
                                </p>
                            </div>
                            <div className="col-md-3 my-3 text-left">
                                <p className={"TitleCol"} style={{minHeight: '24px'}}>

                                </p>
                                <p className={"mb-0"}>
                                    <Login isPRelais={true} />
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/securite"}>{t('page_home.securite')}</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/faq"}>FAQ</Link>
                                </p>
                                <p className={"mb-0"}>
                                    <Link className={"navbar-brand"} to={"/contact"}>{t('page_home.contact')}</Link>
                                </p>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col-md-12 text-center copyright">
                                <span>Copyright @ {moment().format("YYYY")} Bagzee - Webcom Agency</span>
                            </div>
                            <div className="col-md-12 text-center">
                                <p className={"mb-0"}>

                                    <span>
                                    <Link className={"navbar-brand"} to={"/politique-de-confidentialite"}>{t('footer.politiqueConf')}</Link>
                                </span>
                                    {/*<span>
                                    <Link className={"navbar-brand"} to={"/mentions-legales"}>{t('footer.mentions_legales')}</Link>
                                    </span>*/}

                                    <span>
                                    <Link className={"navbar-brand"} to={"/conditions-generales-utilisation"}>CGU</Link>
                                </span>
                                    <span>
                                    <Link className={"navbar-brand"}
                                          to={"/conditions-generales-de-vente"}>CGV</Link>
                                </span>
                                    <span>
                                    <Link className={"navbar-brand"} to={"/cookies"}>Cookies</Link>
                                </span>
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withTranslation()(Footer);
