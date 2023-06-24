import React, {Component} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock, faTimes, faUsers} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {Modal} from "antd";
import {Link} from "react-router-dom";


class Favoris extends Component {

    constructor() {
        super();
        this.state = {favoris: [], token: '', loading: true};
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('client'))
        if (user)
            this.state.token = user.client.token
        this.getFavoris();
    }

    getFavoris() {
        axios.get(`api/check/activity/favoris/list?token=` + this.state.token).then(favoris => {
            this.setState({favoris: favoris.data.favoris, loading: false})
        })
    }

    render() {
        let loading = this.state.loading
        const getMyReduce=(reduce)=>{
            if(reduce >=20 && reduce<=29){
                return reduce-10
            }else if(reduce >=30 && reduce<=49){
                return reduce-15

            }else if(reduce >=50 && reduce<=99){
                return reduce-20
            }
            else {
                return reduce
            }
        }
        return (
            <div className={"profil_blocks Favoris"}>
                <div className={"container py-2 px-4"}>
                    <div className={"row"}>
                        <div className={"col-12 my-3"}>
                            <h5 className={"centrage-y"}>Mon compte > Mes Favoris</h5>
                        </div>
                    </div>
                </div>
                <div className={"container py-2 px-4"}>
                    {loading ?
                        <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                        </p> :
                        <> {this.state.favoris.length > 0 ?
                            <div className={"row mt-5 mb-3"}>
                                {this.state.favoris.map(fav =>
                                        <div className={'col-md-3 pt-4 mb-4'} key={'favoris-' + fav.id}>
                                            <div className="Activity">
                                                <div className="imgActivity"
                                                     style={{backgroundImage: `url(/images/imgHoverActuality.png),url(uploads/` + fav.sousCentreInteret + `)`}}>
                                                    {fav.nbreOfPlaceRest == fav.nbreOfPlace ?
                                                        <h4>Victime de son succès</h4> : null}
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="51.669" height="42.635"
                                                         viewBox="0 0 51.669 42.635" className="favoris">
                                                        <g id="heart-svgrepo-com_1_" data-name="heart-svgrepo-com (1)"
                                                           transform="translate(2.498 2.5)">
                                                            <g id="Artwork_15_" transform="translate(0 0)">
                                                                <g id="Layer_5_15_" transform="translate(0 0)">
                                                                    <path id="Tracé_5" data-name="Tracé 5"
                                                                          d="M34.627,33.251c-6.327,0-10.341,7.053-11.291,7.053-.831,0-4.68-7.053-11.291-7.053A12.286,12.286,0,0,0,.021,44.976a14.092,14.092,0,0,0,2.624,8.888c3.292,5,17.686,17.022,20.713,17.022,3.092,0,17.357-11.983,20.67-17.022a14.09,14.09,0,0,0,2.624-8.888A12.285,12.285,0,0,0,34.627,33.251"
                                                                          transform="translate(0 -33.251)" fill="#30a3f2"
                                                                          stroke="#fff"
                                                                          strokeWidth="5"/>
                                                                </g>
                                                            </g>
                                                        </g>
                                                        <text id="_5" data-name="5" transform="translate(19.863 30.208)"
                                                              fill="#fff"
                                                              fontSize="21" fontFamily="Gordita_Regular">
                                                            <tspan x="0" y="0">{fav.nbreFavoris}</tspan>
                                                        </text>
                                                    </svg>
                                                </div>
                                                <div className={"contentActivity px-3"}>
                                                    <h5>{fav.name}</h5>
                                                    {fav.price ?
                                                        <h6 className="oldPrice text-right"> {fav.price} €</h6> :
                                                        <h6 className="text-right text-success"
                                                            style={{textDecoration: "none !important"}}>Gratuit</h6>}
                                                    <p className="group">
                              <span className="float-left">
                                   <FontAwesomeIcon
                                       icon={faUsers}/> {fav.nbreOfPlace - fav.nbreOfPlaceRest} places restantes
                              </span>
                                                        <span className="float-right">
                                    <span
                                        className="newPrice">{fav.price ? (fav.price - ((fav.price * getMyReduce(fav.reduce)) / 100)).toFixed(2) + '€' : null}</span>
                              </span>

                                                    </p>
                                                    <p className="horaire">
                                <span className="float-left">
                                   <FontAwesomeIcon icon={faClock}/> {fav.hFrom}-{fav.hTo}
                                </span>
                                                        <span className="float-right">
                                  -{getMyReduce(fav.reduce)}%
                              </span>
                                                    </p>
                                                    <Link to={{
                                                        pathname: '/detail-activite-' + fav.nomStructure.replace(/ |-/g, '').replace('%','') + '-' + fav.name.replace(/ |-/g, '').replace('%','') + '-' + fav.id,
                                                        state: {myActDetail: fav}
                                                    }}>
                                                        <button className={"btn-default w-100"}>Réserver
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                )}
                            </div> :
                            <div className={'col-12 pt-5 mt-5 mb-4 text-center'}>Aucune activité n'a été encore été
                                ajoutée
                                à tes favoris, va vite dénicher une activité à partager 😉</div>}</>
                    }
                </div>
            </div>
        )
    }
}

export default Favoris;