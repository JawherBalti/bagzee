import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockMentionsLegales from "./BlockMentionsLegales";
import axios from "axios";
import BlockCGU from "./BlockCGU";

class PageMentionsLegales extends Component {
    constructor() {
        super();
        this.state = {
            mentions: [],
            loading:true

        }
        window.scrollTo(0, 0);
        axios.get('api/regle/mentions').then(res => {
            this.setState({mentions: res.data.mentions,loading:false})
        })
    }

    render() {
        return (
            <div >
                <Header/>
                {this.state.loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                    </p> :<BlockMentionsLegales regles={this.state.mentions}/>
                }
                <Footer/>
            </div>
        )
    }
}

export default PageMentionsLegales;