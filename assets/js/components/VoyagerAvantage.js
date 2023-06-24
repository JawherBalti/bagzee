import React  from 'react'

import {LazyLoadImage} from "react-lazy-load-image-component";
import Carousel from "react-multi-carousel";
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const VoyagerAvantage = (props) => {
    const { t } = props;

    return (

        <section className={'voyagerAvantage container-fluid my-5 py-4'} style={{backgroundColor: '#F4F5F6'}}>
            <h2 className="col-md-12 pb-5 fs-4 text-center text-uppercase">{t('page_home.titleAvantage')}</h2>
            <div className={"row mb-3 justify-content-center"}>
                <div className={"col-lg-2 col-md-4 mb-4"}>
                    <div className={"economie"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="86.6" height="81.25"
                             viewBox="0 0 86.6 81.25">
                            <g id="piggy-bank-svgrepo-com" transform="translate(0.5 -15.5)">
                                <path id="Tracé_6752" data-name="Tracé 6752"
                                      d="M372.013,176a4.013,4.013,0,1,0,4.012,4.012A4.017,4.017,0,0,0,372.013,176Zm0,5.35a1.338,1.338,0,1,1,1.337-1.338A1.339,1.339,0,0,1,372.013,181.35Z"
                                      transform="translate(-306.475 -133.25)" fill="#e16a25" stroke="#e16a25"
                                      strokeWidth="1"/>
                                <path id="Tracé_6753" data-name="Tracé 6753"
                                      d="M80.25,46.763H78.116A32.9,32.9,0,0,0,65.537,31.981V17.337A1.338,1.338,0,0,0,64.2,16,12.056,12.056,0,0,0,52.27,26.424a43.089,43.089,0,0,0-9.47-1.062,40.6,40.6,0,0,0-26.4,9.329A32.151,32.151,0,0,0,8.059,45.427l-.034,0a5.351,5.351,0,0,1-4.281-8.56,1.338,1.338,0,1,0-2.139-1.607A8.024,8.024,0,0,0,6.983,48.03,28.009,28.009,0,0,0,5.35,57.463C5.35,68,11.334,77.8,21.4,83.809V90.9a5.356,5.356,0,0,0,5.35,5.35h2.675a5.356,5.356,0,0,0,5.35-5.35V88.819a43.973,43.973,0,0,0,16.05.005V90.9a5.356,5.356,0,0,0,5.35,5.35H58.85A5.356,5.356,0,0,0,64.2,90.9V83.8A33.774,33.774,0,0,0,76.864,70.838H80.25a5.356,5.356,0,0,0,5.35-5.35V52.112A5.356,5.356,0,0,0,80.25,46.763Zm2.675,18.725a2.678,2.678,0,0,1-2.675,2.675H78.123a28.7,28.7,0,0,0,1.228-3.676,1.338,1.338,0,0,0-2.589-.674,26.216,26.216,0,0,1-1.876,5.013A1.308,1.308,0,0,0,74.8,69,31.146,31.146,0,0,1,62.148,81.9a1.338,1.338,0,0,0-.623,1.537V90.9a2.678,2.678,0,0,1-2.675,2.675H56.175A2.678,2.678,0,0,1,53.5,90.9V87.181a1.337,1.337,0,0,0-1.635-1.3,41.038,41.038,0,0,1-18.13-.006,1.338,1.338,0,0,0-1.635,1.3V90.9a2.678,2.678,0,0,1-2.675,2.675H26.75A2.678,2.678,0,0,1,24.075,90.9V83.042A1.338,1.338,0,0,0,23.4,81.88C13.773,76.389,8.025,67.261,8.025,57.463c0-16.225,15.6-29.425,34.775-29.425a40.465,40.465,0,0,1,9.362,1.109v1.566a1.337,1.337,0,1,0,2.675,0V28.459a1.329,1.329,0,0,0,0-.689,9.379,9.379,0,0,1,8.021-9V32.078a1.338,1.338,0,0,0,.508,1.693A30.245,30.245,0,0,1,75.923,48.484a1.341,1.341,0,0,0,.061.162,25.5,25.5,0,0,1,.778,2.463,1.337,1.337,0,1,0,2.589-.674c-.087-.334-.182-.666-.282-1H80.25a2.678,2.678,0,0,1,2.675,2.675Z"
                                      transform="translate(0)" fill="#e16a25" stroke="#e16a25"
                                      strokeWidth="1"/>
                                <path id="Tracé_6754" data-name="Tracé 6754"
                                      d="M189.375,154.7c2.43,0,4.68,1.159,5.234,2.7a1.894,1.894,0,0,1,.116.647,4.012,4.012,0,0,0,8.025,0,9.915,9.915,0,0,0-.591-3.369,12.294,12.294,0,0,0-8.855-7.481,4.013,4.013,0,0,0-7.855-.011,13.812,13.812,0,0,0-6.4,3.637A10.385,10.385,0,0,0,176,158.044c0,6.269,6,11.369,13.375,11.369,2.525,0,5.35,1.43,5.35,3.344s-2.825,3.344-5.35,3.344-5.35-1.43-5.35-3.344a4.013,4.013,0,1,0-8.025,0,10.385,10.385,0,0,0,3.052,7.224,13.811,13.811,0,0,0,6.4,3.637,4.013,4.013,0,0,0,7.852,0,13.811,13.811,0,0,0,6.4-3.637,10.385,10.385,0,0,0,3.052-7.224c0-6.269-6-11.369-13.375-11.369-2.525,0-5.35-1.43-5.35-3.344S186.85,154.7,189.375,154.7Zm0,9.363c5.9,0,10.7,3.9,10.7,8.694,0,3.99-3.48,7.548-8.275,8.459a1.338,1.338,0,0,0-1.088,1.314v.258a1.338,1.338,0,0,1-2.675,0v-.258a1.337,1.337,0,0,0-1.088-1.314c-4.795-.911-8.275-4.469-8.275-8.459a1.338,1.338,0,1,1,2.675,0c0,3.319,3.6,6.019,8.025,6.019s8.025-2.7,8.025-6.019-3.6-6.019-8.025-6.019c-5.9,0-10.7-3.9-10.7-8.694,0-3.99,3.48-7.548,8.275-8.459a1.338,1.338,0,0,0,1.088-1.314v-.258a1.338,1.338,0,0,1,2.675,0v.275A1.337,1.337,0,0,0,191.8,149.6c3.758.7,6.761,2.992,7.837,5.98a7.243,7.243,0,0,1,.433,2.462,1.337,1.337,0,1,1-2.675,0,4.565,4.565,0,0,0-.274-1.555c-.947-2.628-4.134-4.464-7.751-4.464-4.425,0-8.025,2.7-8.025,6.019S184.95,164.063,189.375,164.063Z"
                                      transform="translate(-146.575 -106.6)" fill="#e16a25" stroke="#e16a25"
                                      strokeWidth="1"/>
                                <path id="Tracé_6755" data-name="Tracé 6755"
                                      d="M109.2,122.656A31.361,31.361,0,0,0,98.377,130.6a1.338,1.338,0,0,0,2.026,1.747,28.672,28.672,0,0,1,9.894-7.255,1.337,1.337,0,1,0-1.1-2.437Z"
                                      transform="translate(-81.659 -88.725)" fill="#e16a25" stroke="#e16a25"
                                      strokeWidth="1"/>
                                <path id="Tracé_6756" data-name="Tracé 6756"
                                      d="M190.389,111.024a1.347,1.347,0,0,0,.361-.05c1-.279,2.022-.516,3.049-.705a1.337,1.337,0,0,0-.484-2.631c-1.107.2-2.212.459-3.287.76a1.338,1.338,0,0,0,.36,2.626Z"
                                      transform="translate(-157.445 -76.299)" fill="#e16a25" stroke="#e16a25"
                                      strokeWidth="1"/>
                            </g>
                        </svg>
                        <h4 className={'avantage-titre text-uppercase'}>{t('page_home.economie')}</h4>
                        <p className='avantage-txt' style={{flex:1}}>{t('page_home.descEconomie')}</p>
                        <Link to={'/comment-ca-marche'}
                              className={'btnTransparent2'}>{t('en_savoir_plus')}
                        </Link>
                    </div>
                </div>
                <div className={"col-lg-2 col-md-4 mb-4"}>
                    <div className={"securite"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64.176" height="76.376"
                             viewBox="0 0 64.176 76.376">
                            <g id="security-svgrepo-com_1_" data-name="security-svgrepo-com (1)"
                               transform="translate(-17.112 0)">
                                <path id="Tracé_6757" data-name="Tracé 6757"
                                      d="M81.206,19.666c-.039-2.062-.077-4.01-.077-5.895A2.673,2.673,0,0,0,78.456,11.1C67.023,11.1,58.318,7.812,51.062.757a2.673,2.673,0,0,0-3.727,0C40.08,7.812,31.377,11.1,19.944,11.1a2.673,2.673,0,0,0-2.673,2.673c0,1.885-.037,3.834-.077,5.9-.366,19.19-.868,45.471,31.129,56.562a2.67,2.67,0,0,0,1.751,0C82.074,65.138,81.573,38.856,81.206,19.666ZM49.2,70.866C21.757,60.9,22.172,39.06,22.54,19.769c.022-1.158.043-2.28.058-3.38,10.708-.452,19.27-3.7,26.6-10.082,7.331,6.385,15.895,9.63,26.6,10.082.015,1.1.036,2.221.058,3.378C76.228,39.059,76.643,60.9,49.2,70.866Z"
                                      transform="translate(0 0)" fill="#f89932"/>
                                <path id="Tracé_6758" data-name="Tracé 6758"
                                      d="M91.482,79.669l-12.9,12.9-5.506-5.506a2.673,2.673,0,0,0-3.78,3.781l7.4,7.4a2.674,2.674,0,0,0,3.78,0L95.262,83.449a2.673,2.673,0,0,0-3.78-3.781Z"
                                      transform="translate(-33.077 -50.767)" fill="#f89932"/>
                            </g>
                        </svg>

                        <h4 className={'avantage-titre text-uppercase'}>{t('page_home.securite')}</h4>
                        <p className='avantage-txt' style={{flex:1}}>{t('page_home.descSecurite')}</p>
                        <Link to={'/comment-ca-marche'}
                              className={'btnTransparent2'}>{t('en_savoir_plus')}
                        </Link>
                    </div>
                </div>
                <div className={"col-lg-2 col-md-4 mb-4"}>
                    <div className={"confort"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="76.376" height="76.376"
                             viewBox="0 0 76.376 76.376">
                            <path id="couch-svgrepo-com"
                                  d="M73.465,40.733a10.8,10.8,0,0,0-5.455,1.513V13.455A5.454,5.454,0,0,0,62.554,8H29.822a5.454,5.454,0,0,0-5.455,5.455v28.79a10.8,10.8,0,0,0-5.455-1.513,10.878,10.878,0,0,0-5.455,20.309V76.193a8.175,8.175,0,0,0,12.775,6.766,5.383,5.383,0,0,0,3.591,1.417H62.554a5.383,5.383,0,0,0,3.591-1.417,8.175,8.175,0,0,0,12.775-6.766V61.041a10.878,10.878,0,0,0-5.455-20.309Zm-49.1,35.46a2.728,2.728,0,0,1-5.455,0V62.554a10.8,10.8,0,0,0,5.455-1.513ZM18.911,57.1a5.455,5.455,0,1,1,5.455-5.455A5.461,5.461,0,0,1,18.911,57.1ZM62.554,78.921H29.822V66.491a10.755,10.755,0,0,0,5.455,1.519H57.1a10.755,10.755,0,0,0,5.455-1.519ZM57.1,62.554H35.277a5.455,5.455,0,1,1,0-10.911H57.1a5.455,5.455,0,1,1,0,10.911Zm5.455-14.848A10.755,10.755,0,0,0,57.1,46.188H35.277a10.755,10.755,0,0,0-5.455,1.519V13.455H62.554ZM73.465,76.193a2.728,2.728,0,0,1-5.455,0V61.041a10.8,10.8,0,0,0,5.455,1.513Zm0-19.094a5.455,5.455,0,1,1,5.455-5.455A5.461,5.461,0,0,1,73.465,57.1Z"
                                  transform="translate(-8 -8)" fill="#f5bc17"/>
                        </svg>

                        <h4 className={'avantage-titre text-uppercase'}>{t('page_home.confort')}</h4>
                        <p className='avantage-txt' style={{flex:1}}>{t('page_home.descConfort')}</p>
                        <Link to={'/comment-ca-marche'}
                              className={'btnTransparent2'}>{t('en_savoir_plus')}
                        </Link>
                    </div>
                </div>
                <div className={"col-lg-2 col-md-4 mb-4"}>
                    <div className={"rapidite"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="103" height="76.376"
                             viewBox="0 0 103 76.376">
                            <g id="rapidite" transform="translate(-1211 -2825.75)">
                                <g id="download-speed-svgrepo-com" transform="translate(1228 2804.524)">
                                    <path id="Tracé_6759" data-name="Tracé 6759"
                                          d="M86,65.589A44.94,44.94,0,0,0,73.6,34.456a2.192,2.192,0,0,0-.2-.237,2.122,2.122,0,0,0-.23-.2,41.99,41.99,0,0,0-60.352,0,2.186,2.186,0,0,0-.23.2,2.163,2.163,0,0,0-.2.237,45.325,45.325,0,0,0,.193,62.5l0,0,0,0,0,0a2.069,2.069,0,0,0,2.991,0c.035-.036.067-.075.1-.113l6.517-6.724a2.231,2.231,0,0,0,0-3.086,2.069,2.069,0,0,0-2.991,0l-5.086,5.247A40.325,40.325,0,0,1,4.287,67.771h7.192a2.183,2.183,0,0,0,0-4.364H4.288a40.5,40.5,0,0,1,9.857-24.5l5.072,5.232a2.069,2.069,0,0,0,2.991,0,2.231,2.231,0,0,0,0-3.086l-5.071-5.233A38.013,38.013,0,0,1,40.885,25.65v7.42a2.116,2.116,0,1,0,4.23,0V25.65a38.013,38.013,0,0,1,23.75,10.169l-5.072,5.232a2.231,2.231,0,0,0,0,3.086,2.069,2.069,0,0,0,2.991,0L71.855,38.9a40.5,40.5,0,0,1,9.857,24.5H74.52a2.183,2.183,0,0,0,0,4.364h7.192a40.326,40.326,0,0,1-9.843,24.517L66.783,87.04a2.069,2.069,0,0,0-2.991,0,2.231,2.231,0,0,0,0,3.086l6.622,6.832a2.067,2.067,0,0,0,2.291.479,2.107,2.107,0,0,0,.7-.479A44.791,44.791,0,0,0,86,65.589Z"
                                          fill="#bcd531"/>
                                    <path id="Tracé_6760" data-name="Tracé 6760"
                                          d="M141.566,87.325a2.04,2.04,0,0,0-2.654,1.136l-5.9,14.722a7.759,7.759,0,0,0-.825-.05,7.568,7.568,0,0,0-6.772,4.152,8.113,8.113,0,0,0,.934,8.557,3.322,3.322,0,0,0,.726.725,8.709,8.709,0,0,0,5.113,1.759,7.568,7.568,0,0,0,6.772-4.152,8.111,8.111,0,0,0-.933-8.555,3.322,3.322,0,0,0-.727-.728c-.149-.108-.3-.207-.453-.306L142.7,89.978A2.041,2.041,0,0,0,141.566,87.325Zm-6.242,25a3.5,3.5,0,0,1-3.135,1.923,4.545,4.545,0,0,1-2.609-.905,4.03,4.03,0,0,1-.525-4.2,3.5,3.5,0,0,1,3.135-1.923,3.972,3.972,0,0,1,1.273.216l.041.019c.045.018.09.032.134.047a5.421,5.421,0,0,1,1.161.623A4.031,4.031,0,0,1,135.324,112.322Z"
                                          transform="translate(-89.118 -45.809)" fill="#bcd531"/>
                                </g>
                                <path id="Tracé_6761" data-name="Tracé 6761" d="M-3240,3704.75h34"
                                      transform="translate(4455 -826)" fill="none" stroke="#bcd531"
                                      strokeWidth="2"/>
                                <path id="Tracé_6762" data-name="Tracé 6762" d="M-3240,3704.75h11"
                                      transform="translate(4505 -815.75)" fill="none" stroke="#bcd531"
                                      strokeWidth="2"/>
                                <path id="Tracé_6763" data-name="Tracé 6763" d="M-3240,3704.75h34"
                                      transform="translate(4467 -815.75)" fill="none" stroke="#bcd531"
                                      strokeWidth="2"/>
                                <path id="Tracé_6764" data-name="Tracé 6764" d="M-3240,3704.75h17"
                                      transform="translate(4451 -836.25)" fill="none" stroke="#bcd531"
                                      strokeWidth="2"/>
                            </g>
                        </svg>


                        <h4 className={'avantage-titre text-uppercase'}>{t('page_home.rapidite')}</h4>
                        <p className='avantage-txt' style={{flex:1}}>{t('page_home.descRapidite')}</p>
                        <Link to={'/comment-ca-marche'}
                              className={'btnTransparent2'}>{t('en_savoir_plus')}
                        </Link>
                    </div>
                </div>
                <div className={"col-lg-2 col-md-4 mb-4"}>
                    <div className={"ecologie"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="82.4" height="82.4"
                             viewBox="0 0 82.4 82.4">
                            <path id="planet-earth-svgrepo-com"
                                  d="M79.684,28.941c.011-.05.023-.1.034-.151l-.084-.017A40.717,40.717,0,0,0,11.921,11.921,40.7,40.7,0,0,0,69.48,69.479,40.433,40.433,0,0,0,81.4,40.7,40.857,40.857,0,0,0,79.684,28.941ZM58.54,7.916a37.4,37.4,0,0,1,7.97,5.846c-.226.628-.609,1.319-1.2,1.319h-.028a6.838,6.838,0,0,1-1.731-.419,8.118,8.118,0,0,0-3.253-.567,8.627,8.627,0,0,0-3.132,1.048,3.759,3.759,0,0,1-2.108.648c-.5-.124-1.023-.753-1.559-1.443a3.646,3.646,0,0,1-.44-.655c.064-.107.194-.275.263-.365a35.654,35.654,0,0,1,2.919-3.075C57.033,9.475,57.844,8.677,58.54,7.916ZM46.614,3.857A9.458,9.458,0,0,1,45.375,7.4a1.969,1.969,0,0,1-2.154.7,3.218,3.218,0,0,1-1.369-2.464,9.857,9.857,0,0,0-.7-2.232A37.734,37.734,0,0,1,46.614,3.857ZM14.32,14.319A37.118,37.118,0,0,1,29.915,4.967c.7,2.314,1.561,4.483,2.4,6.532a11.11,11.11,0,0,1,1.2,4.957c-.063.616-.219,1.4-.609,1.66a4.474,4.474,0,0,1-1.741.339,7.69,7.69,0,0,0-4.015,1.169c-.288.2-.555.411-.813.613a5.268,5.268,0,0,1-1.568.98,5.154,5.154,0,0,1-1.827-.018c-.414-.047-.843-.1-1.3-.111-1.439-.053-4.721.639-6.149,2.5a3.4,3.4,0,0,0-.573,3.138A4.155,4.155,0,0,0,16.2,28.566a16.858,16.858,0,0,0,8.622,4.08c.456.071.9.124,1.325.177,2.339.286,3.5.494,4.387,2.088a10.581,10.581,0,0,1,.586,1.364,13.565,13.565,0,0,0,.766,1.763,4.724,4.724,0,0,0,4.254,2.721,5.475,5.475,0,0,0,2.883-1.235,5.545,5.545,0,0,1,.932-.579,3.473,3.473,0,0,1,3,.728,5.332,5.332,0,0,1,2.178,2.539,2.259,2.259,0,0,1-.466,2.337l-4.984,4.257c-1.6,1.371-3.322,3.036-3.38,5.45a9.135,9.135,0,0,0,.278,2.144,4.342,4.342,0,0,1,.173,1.408,3.2,3.2,0,0,1-.774.249,6.64,6.64,0,0,0-1.477.5c-2.511,1.268-2.745,4.271-2.9,6.259-.113,1.442-.647,2.655-1.193,2.705-.443.043-1.07-.724-1.287-1.574a12.644,12.644,0,0,1-.266-1.737,12.285,12.285,0,0,0-.566-2.911A12.493,12.493,0,0,0,26.3,58.014a7.912,7.912,0,0,1-1.575-2.689,8,8,0,0,1-.027-2.349,10.217,10.217,0,0,0-.162-3.6,10.119,10.119,0,0,0-2.8-4.213,10.634,10.634,0,0,1-1.777-2.205,5.4,5.4,0,0,1-.351-2.985,8.705,8.705,0,0,0-.28-3.473,5.184,5.184,0,0,0-2.141-2.459,41.928,41.928,0,0,1-5.981-5.206,9.076,9.076,0,0,1-2.293-3.382c-.1-.324-.163-.568-.215-.76a3.328,3.328,0,0,0-.859-1.7A37.451,37.451,0,0,1,14.32,14.319ZM40.7,78.008A37.352,37.352,0,0,1,5.923,27.142a13.139,13.139,0,0,0,2.83,4.026A45.357,45.357,0,0,0,15.229,36.8c.329.236.828.593.895.79a5.905,5.905,0,0,1,.1,2.168,8.47,8.47,0,0,0,.732,4.769A13.3,13.3,0,0,0,19.285,47.5a7.28,7.28,0,0,1,1.982,2.772,7.471,7.471,0,0,1,.051,2.434,10.777,10.777,0,0,0,.107,3.4A10.663,10.663,0,0,0,23.6,60.069a9.664,9.664,0,0,1,1.492,2.377,9.435,9.435,0,0,1,.385,2.124,15.366,15.366,0,0,0,.352,2.215c.539,2.1,2.246,4.127,4.525,4.127.117,0,.236-.005.356-.016,2.368-.216,4-2.446,4.266-5.819.1-1.3.241-3.088,1.048-3.5a4.079,4.079,0,0,1,.755-.23,4.672,4.672,0,0,0,2.393-1.172c1.379-1.412,1-3.192.718-4.491a6.531,6.531,0,0,1-.2-1.35c.024-1.017,1.144-2.057,2.192-2.952l4.978-4.252a5.568,5.568,0,0,0,1.491-5.984,8.512,8.512,0,0,0-3.518-4.3c-2.151-1.434-4.348-1.8-6.186-1.036a8.193,8.193,0,0,0-1.585.94,3.121,3.121,0,0,1-1.121.619c-.266.017-.743-.339-1.081-.959a10.908,10.908,0,0,1-.57-1.337,13.278,13.278,0,0,0-.793-1.812c-1.762-3.176-4.513-3.512-6.94-3.809-.4-.049-.815-.1-1.218-.162a13.379,13.379,0,0,1-6.848-3.227,1.983,1.983,0,0,1-.328-.345c0-.009,0-.017,0-.022.224-.521,2.255-1.254,3.376-1.222.317.011.66.05,1.024.091a7.888,7.888,0,0,0,3.127-.086,7.916,7.916,0,0,0,2.741-1.573c.235-.184.458-.357.675-.51a4.779,4.779,0,0,1,2.348-.564c1.86-.155,4.973-.415,5.443-5.035a13.843,13.843,0,0,0-1.436-6.581c-.784-1.922-1.588-3.949-2.245-6.076a37.453,37.453,0,0,1,4.3-.613q.122.279.244.55a9.081,9.081,0,0,1,.76,2.114c.41,2.43,1.585,4.2,3.307,4.986a4.7,4.7,0,0,0,1.953.416,5.526,5.526,0,0,0,4.245-2.066,11.977,11.977,0,0,0,1.92-4.991A36.859,36.859,0,0,1,55.34,6.365c-.469.48-.977.978-1.478,1.469a37.553,37.553,0,0,0-3.228,3.423,4.2,4.2,0,0,0-.951,1.928,4.284,4.284,0,0,0,1.136,3.248,6.521,6.521,0,0,0,3.415,2.65,4.337,4.337,0,0,0,1.055.129,7.674,7.674,0,0,0,3.372-1.026,6,6,0,0,1,1.9-.71,5.371,5.371,0,0,1,1.925.409,9.568,9.568,0,0,0,2.665.585,4.268,4.268,0,0,0,3.832-2.1,37.021,37.021,0,0,1,7.105,12.469c-.25.18-.758.2-1.95.219-.518.006-1.105.014-1.731.062a10.369,10.369,0,0,1-4.653-.944,21.67,21.67,0,0,0-3.427-1.047c-3.264-.65-6.637,1.175-8.593,4.646-.356.631-3.409,6.256-1.15,9.368a9.566,9.566,0,0,0,3,2.455,31.065,31.065,0,0,0,4.331,2.29c.334.135.671.259,1,.38a6.169,6.169,0,0,1,2.857,1.6,4.42,4.42,0,0,1,.466,3.045,14.285,14.285,0,0,1-.938,3.331c-.953,2.6-2.14,5.835.642,9.013a7.826,7.826,0,0,0,2.8,2.05q-.8.907-1.659,1.771A37.065,37.065,0,0,1,40.7,78.008ZM71,62.474a4.306,4.306,0,0,1-2.51-1.447c-1.392-1.591-.961-3.018-.009-5.612a17.027,17.027,0,0,0,1.127-4.151,7.518,7.518,0,0,0-1.1-5.394,8.784,8.784,0,0,0-4.421-2.785c-.317-.117-.616-.227-.9-.343a28.1,28.1,0,0,1-3.856-2.053,6.8,6.8,0,0,1-2-1.539c-.538-.74.123-3.516,1.36-5.71.929-1.649,2.79-3.418,4.977-2.984a18.727,18.727,0,0,1,2.91.9A13.379,13.379,0,0,0,72.671,32.5c.517-.04,1.024-.046,1.514-.052a9.585,9.585,0,0,0,2.837-.328,37.593,37.593,0,0,1,.988,8.58A37.031,37.031,0,0,1,71,62.474Z"
                                  transform="translate(0.499 0.5)" fill="#80c241" stroke="#80c241"
                                  strokeWidth="1"/>
                        </svg>
                        <h4 className='avantage-titre text-uppercase'>{t('page_home.ecologie')}</h4>
                        <p className='avantage-txt' style={{flex:1}}>{t('page_home.descEcologie')}</p>
                        <Link to={'/comment-ca-marche'}
                              className={'btnTransparent2'}>{t('en_savoir_plus')}
                        </Link>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default withTranslation()(VoyagerAvantage)