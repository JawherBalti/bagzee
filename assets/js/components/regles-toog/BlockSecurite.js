import React, {Component} from 'react';
import {LazyLoadImage} from "react-lazy-load-image-component";

class BlockSecurite extends Component {
    render() {
        return (
            <div className={"CookiesBlock bg-white container-fluid px-0"}>
                <div className={"my-xl-5 py-xl-5 my-2 py-2"}>
                    <div className={"mx-xl-5 px-xl-5 mx-2 px-2"}>
                        <div className="row">
                            <div className="col-md-12 my-3">
                                <h2 className="ff-Montserrat-sBold text-center mb-3 text-gris">
                                    <span className={'text-blue fw-bold'}>BAG</span><span
                                    className={'text-orange fw-bold'}>ZEE</span> AVEC UN <span
                                    className={'text-orange fw-bold'}>Z</span></h2>
                                <h1 className={'text-gris mb-5 text-center '}>COMME <span
                                    className={'text-orange fw-bold'}>ZÉCURITÉ </span><span
                                    className={'text-blue'}>!</span></h1>
                                <div className={'row '}>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite1.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Carte d'identité
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        La carte d'identité de chaque membre est vérifiée ainsi que les
                                                        passeports pour les utilisateurs voyageant hors union
                                                        européenne.
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        Les pièces d'identités acceptées au point-relais sont les
                                                        suivantes
                                                        : Carte d'identité, permis de conduire ou passeport. </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite2.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Nos point-relais partenaires
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        mettent à
                                                        disponible des zones
                                                        adaptés pour contrôler
                                                        vos valises, les équiper
                                                        d'une protection bagage
                                                        et les stocker en toute
                                                        sécurité.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite3.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Photo du contenu du bagage
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        par le propriétaire du point relais.<br/>
                                                        Lors du dépôt du bagage en point relais, le propriétaire doit
                                                        prendre en photo l’intérieur du contenu du bagage pour attester
                                                        de
                                                        la réalisation de la transaction.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite4.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Procuration
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        Tu peux donner procuration à un proche pour qu'il laisse ou
                                                        prenne
                                                        un bagage à ta place. La procuration à générer se trouve dans
                                                        les
                                                        détails de ta réservation dans "Mes annonces".
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite5.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Contrôle des bagages.
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        Le point relais est formé au contrôle du bagage (respect
                                                        sécuritaires et douaniers, astuces et techniques de
                                                        cachette). Le propriétaire et le porteur reçoivent aussi les
                                                        règles
                                                        sécuritaires
                                                        à la réservation.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite6.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Autorisations et
                                                        interdictions douanières.
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        par le propriétaire du point relais.<br/>
                                                        Les règlementations
                                                        douanières en vigueur
                                                        dans chaque pays.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite7.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Document douane
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        Tu as dans les détails de ta réservation un document attestant
                                                        de la
                                                        responsabilité de chacune des parties et ce dernier est
                                                        présentable
                                                        en cas de problèmes (douanes, police, assurance...). Tu le
                                                        trouves
                                                        dans "Mes réservations" en cliquant sur "Générer un document
                                                        douanier" </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'col-md-4 mb-3'}>
                                        <div className={'whiteBlock h-100 w-100'}>
                                            <div className={'row'}>
                                                <div className={'col-lg-4 text-center'}>
                                                    <LazyLoadImage src={"/images/securite8.png"} alt={"securite1"}
                                                                   className={'mb-3'}/>
                                                </div>
                                                <div className={'col-lg-8'}>
                                                    <p className={'text-gris'} style={{fontWeight: 'bold'}}>
                                                        Stockage des bagages en lieu sécurisé.
                                                    </p>
                                                    <p className={'text-gris'}>
                                                        Les points relais stockent les bagages dans une zone sécurisé
                                                        (arrière-boutique, espace de stockage, cage ect.)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h6 className={'text-center py-5 mx-auto'} style={{maxWidth: '50%', minWidth: '300px'}}>
                                    Notre partenariat avec AXA assurance nous permet adipiscing elit, sed diam nonummy
                                    nibh euismod tin
                                    cidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam,
                                    quis nostrud exerci
                                    tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                                </h6>
                            </div>

                        </div>
                    </div>
                    <div className={'py-3'} style={{backgroundImage: 'url(images/bgBleuSectionSecurite.png)',backgroundRepeat:'no-repeat',backgroundSize:'cover'}}>
                        <p className={'text-white text-center pt-5 pb-3'}>
                            Un fonctionnement simple<br/>
                            pour faire voyager rapidement<br/>
                            et en toute sécurité ses bagages !
                        </p>
                        <div className={'m-3'}>
                            <div className={"bg-white mx-xl-5 px-xl-5 mx-2 px-2"} style={{borderRadius:'50px',overflowX:"hidden"}}>
                                <ul className='etapesBagage flex-column flex-md-row align-item-center align-item-md-start justify-content-start m-auto' style={{overflowX:"auto",maxWidth:'max-content'}}>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>1</span>
                                        <LazyLoadImage src={"/images/etape1.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je crée<br/>
                                            mon compte</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>2</span>
                                        <LazyLoadImage src={"/images/etape2.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je dépose<br/>
                                            une annonce</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>3</span>
                                        <LazyLoadImage src={"/images/etape3.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je réserve,<br/>
                                            Je paye</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>4</span>
                                        <LazyLoadImage src={"/images/etape4.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je dépose/prends<br/>
                                            le bagage dans<br/>
                                            un point relais</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>5</span>
                                        <LazyLoadImage src={"/images/etape5.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je voyage</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>6</span>
                                        <LazyLoadImage src={"/images/etape6.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je suis mon bagage<br/>
                                            sur l’application Bagzee</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>7</span>
                                        <LazyLoadImage src={"/images/etape7.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Je récupère/dépose<br/>
                                            le bagage dans<br/>
                                            un point relais</p>
                                    </li>
                                    <li className={'d-flex flex-column justify-content-start align-items-center'}>
                                        <span>8</span>
                                        <LazyLoadImage src={"/images/etape8.png"} alt={"etape1"}/>
                                        <p className={'text-gris'}>Le porteur<br/>
                                            reçoit sa<br/>
                                            commission</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default BlockSecurite;