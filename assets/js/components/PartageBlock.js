import React, {Component} from 'react';
import {FacebookShareButton} from "react-share";

class PartageBlock extends Component {
    render() {
        return(
               <div className={"PartageBlock container mt-5 mb-5 p-4"}>
                <div className="row">
                    <div className="col-md-12 text-center mb-3">
                        <h3 className="h4">
                            Partage Bagzee à tes amis pour qu’ils bénéficient de<br/>
                            bons plans avec toi 🙏👇
                        </h3>
                    </div>
                    <div className="col-md-12 text-center">
                        <FacebookShareButton className={'btn-default partage'}
                                              url={window.location.href}
                                              quote={'Bagzee'}
                                              hashtag="#Bagzee">
                            Partager
                        </FacebookShareButton>
                    </div>
                </div>
            </div>
        )
    }
}
export default PartageBlock;