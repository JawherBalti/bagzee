import React, {Component} from 'react';

class BlockMentionsLegales extends Component {
    render() {
        return (
            <div className={"CookiesBlock bg-white container mt-5 mb-5 p-md-5"} style={{borderRadius: '20px'}}>
                <div className="row m-0">
                    <div className="col-md-12 ">
                        {this.props.regles.map((rgl)=>
                            <div dangerouslySetInnerHTML={{__html: rgl.content}}/>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default BlockMentionsLegales;