import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockCGU from "./BlockCGU";
import axios from "axios";

class PageCGU extends Component {
    constructor() {
        super();
        this.state = {
            cgu: [],
            loading:true

        }
        window.scrollTo(0, 0);
        axios.get('api/regle/cgu').then(res => {
            this.setState({cgu: res.data.cgu,loading:false})
        })
    }

    render() {
        return (
            <div>
                <Header/>
                {this.state.loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                    </p> :<BlockCGU regles={this.state.cgu}/>
                }
                <Footer/>
            </div>
        )
    }
}

export default PageCGU;