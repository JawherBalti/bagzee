import React  from 'react'

import {LazyLoadImage} from "react-lazy-load-image-component";
import Carousel from "react-multi-carousel";
import {withTranslation} from "react-i18next";
const responsivePresse = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: {max: 4000, min: 2000},
        items: 4,
        slidesToSlide: 1 // optional, default to 1.
    },
    desktop: {
        breakpoint: {max: 2000, min: 1400},
        items: 3,
        slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
        breakpoint: {max: 1400, min: 950},
        items: 2,
        slidesToSlide: 1 // optional, default to 1.

    },
    mobile: {
        breakpoint: {max: 950, min: 0},
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

const CarouselPart = (props) => {
    const { t } = props;

    return (
        <Carousel responsive={responsivePresse} infinite={true} className={props.myColor?'myColor presse':'presse'}
                  autoPlay={props.deviceType !== "mobile" ? false : true}
                  autoPlaySpeed={2000}
                 // removeArrowOnDeviceType={["tablet", "mobile"]}
                  containerClass="carousel-container"
                  keyBoardControl={true}
                  customTransition="transform 1000ms ease-in-out"
                  transitionDuration={1000}>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row  text-center text-md-left'}>
                    <div className={'col-md-5 '}>
                        <div className='d-flex flex-column align-items-center justify-content-center'>
                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                        </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row  text-center text-md-left'}>
                    <div className={'col-md-5'}>
                    <div className='d-flex flex-column align-items-center justify-content-center'>

                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                    </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row  text-center text-md-left'}>
                    <div className={'col-md-5'}>
                    <div className='d-flex flex-column align-items-center justify-content-center'>

                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                        
                    </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row text-center text-md-left'}>
                    <div className={'col-md-5'}>
                    <div className='d-flex flex-column align-items-center justify-content-center'>

                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                    </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row text-center text-md-left'}>
                    <div className={'col-md-5'}>
                    <div className='d-flex flex-column align-items-center justify-content-center'>

                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                    </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>
            <div className={'carouselItem'} style={props.myColor?{borderColor:'#EE7923'}:{}}>
                <div className={'row text-center text-md-left'}>
                    <div className={'col-md-5'}>
                    <div className='d-flex flex-column align-items-center justify-content-center'>

                        <LazyLoadImage src={"/images/logo.png"} className="mx-auto mx-md-0" width={'80px'} alt={"bagzee"}/>
                        <p className={'userName'}>Mickel Mickel</p>
                        <p className={'d-flex justify-content-around gap-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16.038" height="15.338"
                                 viewBox="0 0 16.038 15.338">
                                <path id="star-svgrepo-com_17_" data-name="star-svgrepo-com (17)"
                                      d="M8.794,1.528,10.6,5.194a.863.863,0,0,0,.65.472l4.045.588a.864.864,0,0,1,.479,1.473L12.85,10.58a.864.864,0,0,0-.248.764l.691,4.029a.864.864,0,0,1-1.253.911l-3.618-1.9a.865.865,0,0,0-.8,0L4,16.284a.864.864,0,0,1-1.253-.911l.691-4.029a.864.864,0,0,0-.248-.764L.262,7.727A.864.864,0,0,1,.741,6.254l4.045-.588a.863.863,0,0,0,.65-.472L7.245,1.528A.863.863,0,0,1,8.794,1.528Z"
                                      transform="translate(-0.001 -1.047)" fill={props.myColor? "#F89D1C":"#00acf5"}/>
                            </svg>
                        </p>
                    </div>
                    </div>
                    <div className={'col-md-7 py-3'}>
                        <h6>{props.myColor?t('proprietaire'):t('porteur')}</h6>
                        <p className={'prix'}>
                            <b style={props.myColor?{color: '#F89D1C'}:{color: '#4BBEED'}}>
                                {props.myColor?t('page_home.gain'):t('page_home.price')}
                            </b> <big style={props.myColor?{fontWeight: 'bold',color:'#E0532A'}:{fontWeight: 'bold'}}>100€</big></p>
                        <p className={'date'}>01 Nov 2022</p>
                        <p className={'adr'}>{t('page_home.depart')}: Courbevoie, France.</p>
                        <p className={'adr'}>{t('page_home.arrivee')}: Courbevoie, France.</p>
                    </div>
                </div>
            </div>

            {/*<div><img src={'/images/RVB_radio_vallée_bergerac.png'}
                                          alt={'RVB_radio_vallée_bergerac'}/></div>*/}
        </Carousel>
    )
}

export default withTranslation()(CarouselPart)