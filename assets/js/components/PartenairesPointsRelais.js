import React, {Component, useRef} from "react";
import Footer from "./Footer";
import Header from "./Header";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link} from "react-router-dom";
import useIntersectionObserver from "@react-hook/intersection-observer";
import Iframe from "react-iframe";
import {Trans, withTranslation} from "react-i18next";

class PartenairesPointsRelais extends Component{
    constructor() {
        super();
    }
  render() {

          const Youtube = ({url, title}) => {
              const containerRef = useRef();
              const lockRef = useRef(false);
              const {isIntersecting} = useIntersectionObserver(containerRef);
              if (isIntersecting) {
                  lockRef.current = true;
              }
              return (
                  <div
                      className={"text-center"}
                      ref={containerRef}
                  >
                      {lockRef.current && (
                          <Iframe
                              url={"/images/video_bagzee.mp4"}
                              width={'100%'} height={'365px'}
                              title="video_bagzee"
                              frameBorder="0"
                              allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                          />
                      )}
                  </div>
              );
          };
          const {t} = this.props;

          return (
              <section className={'pagePointRelais'}>
                  <Header/>
                  <section className="Header "
                           style={{backgroundImage: "url(images/pprBanner.png)", backgroundPosition: "left"}}>
                      <div className={"container"}>
                          <div className={"row"}>
                              <div className={"col-md-4 mt-3"}>
                                  <h3 style={{color: '#1C2D5A'}}>Faire équipe avec nous est toujours payant !</h3>
                                  <p className="ff-Gordita-Medium mt-3" style={{color: '#1C2D5A'}}>Devenez facilement
                                      point
                                      relais,
                                      transporteur professionnel ou partenaire Bagzee dans toute la France.</p>
                              </div>
                          </div>
                      </div>
                  </section>
                  <section className="container mt-5 py-5 px-3 px-md-0 d-flex align-items-center">
                      <div className="row">
                          <div className="col-12 col-md-3 mb-3">
                              <div className="picture">
                                  <LazyLoadImage
                                      data-src-transform="cover"
                                      src={"images/pprPoint.png"}
                                      alt="helena-lopes"
                                  />
                              </div>
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                              <h1 style={{color: "#1C2D5A"}}>
                                  DEVENEZ <br/> POINT RELAIS !
                              </h1>
                              <h6 style={{lineHeight: "25px", color: '#1C2C59'}}>
                                  Vous avez de la place disponible dans votre commerce <br/> et vous
                                  aimeriez augmenter vos revenus mensuels? <br/> Devenez point-relais
                                  en quelques clics !
                              </h6>
                              <p style={{fontSize: 14, color: '#1C2C59'}}>
                                  Votre mission: <br/>
                                  <p>
                                      1.Réceptionnez les bagages
                                      <br/>
                                      2.Les contrôler avec les voyageurs
                                      <br/>
                                      3.Les stocker dans un endroit sécurisé
                                      <br/>
                                      4.Les contrôler avec les porteurs
                                      <br/>
                                      5.Les sécuriser avec un accessoire en cas de besoin
                                      <br/>
                                      6.Les confier aux porteurs
                                      <br/>
                                      Gagnez ainsi PLUS D'ARGENT et attirez plus de passage <br/> dans
                                      votre commerce
                                  </p>
                              </p>

                              <button className={"btnPurple"}>Devenez point relais</button>
                          </div>
                          <div className="col-12 col-md-3 mb-3">
                              <div className="picture">
                                  <LazyLoadImage
                                      data-src-transform="cover"
                                      src={"images/pprMap.png"}
                                      alt="helena-lopes"
                                  />
                              </div>
                          </div>
                      </div>
                  </section>

                  <section className="mt-5 py-5 px-3 px-md-0 " style={{backgroundColor: "#F4F5F6",}}>
                      <section className="container" style={{backgroundColor: "#F4F5F6",}}>
                          <h1 style={{color: "#1C2D5A"}}>
                              DEVIENS TRANSPORTEUR
                              <br/> PROFESSIONNEL !
                          </h1>
                          <div className=" row">
                              <div className={'col-md-4 mb-3'} style={{lineHeight: "25px"}}>
                                  <h6 style={{lineHeight: "25px", color: '#1C2C59'}}>
                                      Planifiez des livraisons qui vous conviennent <br/> Vous êtes
                                      transporteur professionnel ou livreur ? Utilisez <br/> l'espace
                                      disponible de votre voiture, votre remorque ou <br/> votre camion
                                      pour compléter vos revenus.
                                      <br/>
                                  </h6>
                                  <p style={{fontSize: 14, color: '#1C2C59'}}>
                                      Planifiez des livraisons qui vous conviennent. <br/>
                                      Comment ça marche? <br/>
                                      1.Inscrivez-vous en tant que profession...
                                      <br/>
                                      2. Déposez votre annonce ou trouvez celle d'un <br/> propriétaire
                                      de bagage qui correspond à votre trajet
                                      <br/>
                                      3.Choisissez le lieu de retrait de livraison et <br/> de contrôle
                                      de bagage <br/>
                                      4.Transportez et déposer le bagage au lieu de <br/> livraison
                                      prévu
                                      <br/>
                                      5.Le voyageur valide la transaction et vous êtes payé. <br/>{" "}
                                      Gagnez plus d'argent, contribuez à la réduction <br/> d'empreinte
                                      carbonne et à changer le monde !
                                  </p>
                                  <button className={"btnBlueDark2"}>Devenez transporteur pro</button>
                              </div>
                              <div className={'col-md-4 mb-3'}>
                                  <div className="picture">
                                      <LazyLoadImage
                                          data-src-transform="cover"
                                          src={"images/pprTransport.png"}
                                          alt="helena-lopes"
                                      />
                                  </div>
                              </div>

                              <div className={'col-md-4 mb-3'} style={{textAlign: "center", letterSpacing: "2px",}}>
                                  <h2 style={{color: "#276C80"}}>
                                      FAITES PARTIE DES <br/>
                                      <span
                                          style={{
                                              color: "#EF7615",
                                              fontSize: "110px",
                                              fontFamily: "revert",
                                          }}
                                      >
                235
              </span>
                                      <br/>
                                      <h2 style={{color: "#46A7BA"}}>
                                          Aujourd'hui XXXX <br/> professionnels <br/> participent au
                                          <br/> réseau de transport <br/> Bagzee.
                                      </h2>
                                  </h2>
                              </div>
                          </div>
                      </section>
                  </section>
                  <section className='container-fluid my-5 px-0'
                           style={{
                               backgroundImage: 'url(/images/bgBlockpupleSection.png)',
                               backgroundPosition: 'right',
                               backgroundRepeat: 'no-repeat',
                               backgroundSize: 'cover'
                           }}>
                      <div className={'px-md-5 mx-md-5 p-3'}>
                          <div className={'row'}>
                              <div className={'col-lg-6'}>
                                  <Youtube/>
                              </div>
                              <div className={'col-lg-6 d-flex flex-column justify-content-center py-5'}>

                                  <h4 className={'text-white text-uppercase'}>
                                      DEVENEZ PARTENAIRE
                                      <br/>BAGZEE !
                                  </h4>

                                  <p className={'text-white'}>
                                      <span className="ff-Gordita-Medium">Que avez une entreprise physique ou en ligne, rejoignez-nous.</span><br/>
                                      Vous êtes influenceurs ou bloggeurs de voyage, fabricants ou vendeurs de bagages
                                      et
                                      d'accessoires de voyage, agence de voyage, agence de location de voitures, agence
                                      de
                                      tourisme médical, taxi, hôtels et autres professionnels dont la thématique tourne
                                      autour
                                      du voyage ou du bagage :<span
                                      className="ff-Gordita-Medium"> devenez partenaire !</span><br/>
                                      Profitez de notre système d’affiliation afin de toucher des commissions !<br/>
                                      Seul on va vite, ensemble on va plus loin ! Vous n’avez que quelques clics à faire
                                      pour
                                      entrer dans l’aventure <span className="ff-Gordita-Medium">Bagzee.</span>
                                  </p>

                                  <Link to={'/'}
                                        className={'btnWhite2'}>Devenir partenaire
                                  </Link>
                              </div>
                          </div>
                      </div>

                  </section>
                  <div className={"container-fluid"}>
                      <Link to={"/faq"} className={"btnFAQ mt-5"}>
                          FAQ
                      </Link>
                  </div>
                  <Footer/>
              </section>
          );

  }
}

export default withTranslation()(PartenairesPointsRelais);
