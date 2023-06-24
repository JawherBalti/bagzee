import React, {Component} from 'react';
import Footer from "../Footer";
import Header from "../Header";
import BlockCGV from "./BlockCGV";
import axios from "axios";

class PageCGV extends Component {
    constructor() {
        super();
        this.state = {
            cgu: [],
            loading:true

        }
        window.scrollTo(0, 0);
        axios.get('api/regle/cgv').then(res => {
            this.setState({cgv: res.data.cgv,loading:false})
        })
    }

    render() {
        return (
            <div>
                <Header/>
                {this.state.loading ?
                    <p className={'text-center my-5'}><span className="fa fa-spin fa-spinner fa-4x">

                                </span>
                    </p> :<BlockCGV regles={this.state.cgv}/>
                }
                <Footer/>
            </div>
        )
    }
}

export default PageCGV;