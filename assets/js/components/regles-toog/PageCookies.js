import React, {Component} from 'react';
import BlockCookies from "./BlockCookies";
import Footer from "../Footer";
import Header from "../Header";
import axios from "axios";

class PageCookies extends Component {
    constructor() {
        super();
        this.state = {
            cookies: [],
            loading:true

        }
        window.scrollTo(0, 0);
        axios.get('api/regle/cookies').then(res => {
            this.setState({cookies: res.data.cookies,loading:false})
        })
    }

    render() {
        return (
            <div >
                <Header/>
                {this.state.loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                    </p> :<BlockCookies regles={this.state.cookies}/>
                }
                <Footer/>
            </div>
        )
    }
}

export default PageCookies;