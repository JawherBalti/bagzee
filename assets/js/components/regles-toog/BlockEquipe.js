import React, {Component} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

class BlockEquipe extends Component {
    render() {
        return (
            <div className={"CookiesBlock container mt-5 mb-5 p-md-5"} style={{borderRadius: '20px'}}>
                <div className="row m-0">
                    <div className="col-md-12 ">
                        <h1 className={'mb-5 text-center'}>L'équipe Bagzee </h1>
                        <LazyLoadImage src={"/images/equipe.png"} alt={"equipe-toog"} /><br/>
                        <p className="mb-3 fs-large pt-5 text-center grayText">
                            L’ensemble de l’équipe Bagzee vous attend autour d’un jeu de société, un laser game ou<br/> un atelier patisserie (à prix réduits) ! 😊
                        </p>

                    </div>
                </div>
            </div>
        )
    }
}

export default BlockEquipe;