import React, {Component} from 'react';
import {withTranslation} from "react-i18next";
import Sidebar from "../chatComponents/Sidebar";
import Chat from "../chatComponents/Chat";
import Navbar from "../chatComponents/Navbar";

class TchatGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }


    componentDidMount() {
        window.scrollTo(0, 0);
        if(this.props.location.state){
            this.setState({orderInfo:this.props.location.state.orderInfo},()=>{
            })
        }

    }


    render() {
        const t=this.props.t

        return (
            <div className='home tchatGroup mt-5'>

                <div className="container">
                    <div style={{flex:1}}>
                        <div className={'d-flex flex-column justify-content-between dialogueBleu'}
                             style={{width: '75%',height:'max-content'}}>
                            <h4 className={'text-white text-uppercase'}>
                                BLA,<br/>
                                BLA, BLA,<br/>
                            </h4>
                            <p className="text-white">{t('parlons')}</p>
                        </div>
                    </div>
                <div style={{flex:2}}>
                        {/*<div className={'d-flex flex-column justify-content-between dialogueBleu'}
                             style={{width: '75%'}}>
                            <h4 className={'text-white text-uppercase'}>
                                BLA,<br/>
                                BLA, BLA,<br/>
                            </h4>
                            <p className="text-white">{t('parlons')}</p>
                        </div>*/}
                    </div>
                </div>
                <div className="container mt-3" style={{minHeight:'70vh'}}>
                    <Sidebar  {...this.props}/>
                    <Chat  {...this.props}/>
                    {this.state.orderInfo && <Navbar orderInfo={this.state.orderInfo?.order?this.state.orderInfo?.order:this.state.orderInfo}  {...this.props}/>}
                </div>
            </div>
        )
        /*}*/
    }

}

export default withTranslation()(TchatGroup);