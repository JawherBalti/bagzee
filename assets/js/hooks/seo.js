import React, {Component} from 'react';

import axios from "axios";
import {messageService} from "../lib/Services";
import {HelmetProvider, Helmet} from 'react-helmet-async';

class Seo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            seo: {
                title: 'title de page',
                url: '',
                siteName: 'Bagzee',
                content: 'Bagzee description',
                image: '/images/logo.png',
                siteUrl: 'https://bagzee.com/',
                canonical: 'https://bagzee.com/',


                keyword: "keyword",
                metaDesc: "meta desc",
                metaTitle: "meta title",
                ogDescription: "og description",
                ogTitle: "og title",
                robots: "index"


            }


        };

    }

    componentDidMount() {
        window.scrollTo(0, 0);


        if (typeof (this.props) != "undefined") {
            axios.post('api/seo/show', {url: window.location.pathname}).then(res => {

                if (res.data.seo.length === 0 || res.status!=200) {
                    let title = window.location.pathname.split('/')[1]
                    if (this.props.match.params[0])
                        title = this.props.match.params[0]
                    this.setState(prevState => ({
                        seo: {                   // object that we want to update
                            ...prevState.seo,    // keep all other key-value pairs
                            title: title,     // update the value of specific key
                            url: window.location.pathname       // update the value of specific key
                        }
                    }), () => {
                        this.setState({loading: false})
                    })


                } else {
                    this.setState({seo: res.data.seo}, () => {
                        this.setState({loading: false})
                    })
                }
            })
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (typeof (nextProps) != "undefined" && typeof (nextProps.location) != "undefined") {
            if (nextProps.location.pathname !== this.props.location.pathname || nextState.seo.url !== this.state.seo.url) {
                if (!Array.prototype.last) {

                    Array.prototype.last = function () {
                        return this[this.length - 1];
                    };
                }
                let title = window.location.pathname.split('/')[1]
                if (this.state.seo.url !== window.location.pathname) {

                    axios.post('api/seo/show', {url: window.location.pathname}).then(res => {

                            if (res.data.seo.length === 0 || res.status!=200) {
                                if (this.props.match.params[0])
                                    title = this.props.match.params[0]
                                this.setState(prevState => ({
                                    seo: {                   // object that we want to update
                                        ...prevState.seo,    // keep all other key-value pairs
                                        title: title,     // update the value of specific key
                                        url: window.location.pathname       // update the value of specific key
                                    }
                                }), () => {
                                    this.setState({loading: false})
                                })

                            } else {
                                this.setState({seo: res.data.seo}, () => {
                                    this.setState({loading: false})

                                })
                            }
                        }
                    )
                }

            }
            return true;
        }
    }


    render() {

        let seo = this.state.seo;
        let loading = this.state.loading;
        return (
            <> {
                loading ? null :
                    <HelmetProvider>
                        <Helmet defer={false} prioritizeSeoTags>
                            <title> {seo.title}</title>
                            <meta property="og:title" content={seo.title}/>
                            <meta property="og:title" content={seo.ogTitle}/>
                            <meta property="og:description" content={seo.ogDescription}/>
                            <meta property="og:type" content={"website"}/>
                            <meta property="og:image"
                                  content={window.location.protocol + '//' + window.location.host + '/uploads/' + seo.image == '' ? '/images/logo.png' : seo.image}/>
                            <meta name="description" content={seo.content}/>
                            <meta name="title" content={seo.title}/>
                            <link rel="canonical" href={window.location.href}/>
                            <meta name="robots" content="index, follow"/>
                        </Helmet>
                    </HelmetProvider>
            }</>
        )
    }

}


export default Seo;
