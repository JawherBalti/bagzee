import React, {Component} from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {Link} from "react-router-dom";

class Block404 extends Component {
    render() {
        return(
            <div className={"block404 container mb-5 px-4"} style={{minHeight:'calc(100vh - 482px)'}}>
                <div className="row">
                    <div className="col-md-12 text-center mb-3">
                      <LazyLoadImage src={'/images/404.png'} alt={'404'} className={'p-1'}/>
                    </div>
                    <div className="col-md-12 text-center">
                       <h4 className={'mb-5'} style={{color:'#38BFEF'}}>Woops, aucun résultat trouvé</h4>
                        <p style={{lineHeight:2}}>
                            Nous n'avons pas trouvé ce que vous cherchiez<br/> Essayez à nouveau de rechercher
                        </p>
                        <Link to={'/'} className={'btnBlue my-5 mx-auto'}>Retour
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}
export default Block404;