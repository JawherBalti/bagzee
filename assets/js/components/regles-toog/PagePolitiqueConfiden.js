import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockPolitiqueConfiden from "./BlockPolitiqueConfiden";
import {Link} from "react-router-dom";
import axios from "axios";

class PagePolitiqueConfiden extends Component {
    constructor() {
        super();
        this.state = {
            politique: [],
            loading:true

        }
        window.scrollTo(0, 0);
        axios.get('api/regle/politique').then(res => {
            this.setState({politique: res.data.politique,loading:false})
        })    }

    render() {
        return (
            <div >
                <Header/>
                {this.state.loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                    </p> :<BlockPolitiqueConfiden regles={this.state.politique}/>
                }
                <div className={'container-fluid'}>
                    <Link to={'/faq'}
                          className={'btnFAQ'}>FAQ
                    </Link>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default PagePolitiqueConfiden;