import React, {Component, useContext} from 'react';
import {withTranslation} from "react-i18next";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link, Redirect} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCheck, faChevronDown,
    faChevronUp,
    faTimes
} from "@fortawesome/free-solid-svg-icons";
import {Checkbox, Modal, Upload} from "antd";
import axios from "axios";
import {AuthContext} from "../chatComponents/AuthContext";
import {collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from "../../hooks/firebase";

function getBase64PP(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class RecapAnnonceDemandeListeProp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            myReservation: {},
            client: {},
            listeContenu: [
                {label: 'Trotinette', checked: true},
                {label: 'Casarole'},
                {label: 'Casque'},
                {label: 'Ecran', checked: true},

            ],

            isDetails: false,
            loading: true,
            loadingPhoto: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],
            gallery: [],

        }

        window.scrollTo(0, 0);
    }

    componentDidMount() {
        /*this.setState({myReservation: this.props.location.state.myReservation,client: this.props.location.state.client}, () => {
            console.log(this.state.myReservation)
            this.setState({loading: false})
        })*/
        axios.post('api/profil/liste/demande/adverts', {
            token: this.props.location.state.client.token,
            advert_id: this.props.location.state.myReservation.id
        }).then(res => {
            if (res.data.status)
                this.setState({myReservation: res.data.adverts, gallery: res.data.adverts.gallery}, () => {
                    this.setState({loading: false})

                })
        })


    }

    handleCancel = () => this.setState({previewVisible: false});
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64PP(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    refuser() {
        axios.post('api/advert/query/refus/demande', {
            "token": this.props.location.state.client.token,
            "raisonRefus": this.state.raisonRefus,
            "client_id": this.state.clientDetails.id,
            "order_id": this.state.clientDetails.id_advert_query,

        }).then(res => {
            Modal.success({
                content: (
                    <div className={"text-center"} key={'onCreateAnnConf' + Math.random()}>
                        <LazyLoadImage src={"/images/demandeSoumise.png"} alt={"demandeSoumise"}/>
                        <p className={"text-gris fs-5 py-4"}>
                            {res.data.message}
                        </p>

                    </div>),
                okText: 'ok',
            });
            if (res.data.status) {
                history.back()
            }
        })

    }

    soumettre() {
        /* axios.post('api/baggagite/query/create',{
             "token": this.props.location.state.token,
             "listeContenu":this.state.listeContenu,
             "gallery":this.state.gallery,
             "price":this.state.price,
             "baggagite_id":this.state.myReservation.id

     }).then(res=>{
         if(res.data.status){
             Modal.success({
                 content: (
                     <div className={"text-center"} key={'onCreateAnnConf' + Math.random()}>
                         <LazyLoadImage src={"/images/demandeSoumise.png"} alt={"demandeSoumise"}/>
                         <p className={"text-gris fs-5 py-4"}>
                             {this.props.t('recap.demandeSoumise')}
                         </p>

                     </div>),
                 okText: 'ok',
             });
         }else {
             Modal.success({
                 content: (
                     <div className={"text-center"} key={'onCreateAnnConf' + Math.random()}>
                         <LazyLoadImage src={"/images/logo.png"} alt={"logo"}/>
                         <p className={"text-gris fs-5 py-4"}>
                             {res.data.message}
                         </p>

                     </div>),
                 okText: 'ok',
             });
         }
         })*/

    }

    render() {
        const {t} = this.props;
        const {isDetails, loading, myReservation, price, previewVisible, previewImage, gallery, listeContenu} = this.state;
        const onCheckboxChangeAss = (event, price) => {
            const target = event.target;
            const value = target.checked;
            const name = target.name;

            this.props.location.state.id ? null : this.setState(prev => ({


                clientDetails: {
                    ...prev.clientDetails,
                    setting_price: prev.clientDetails.setting_price.map(working =>
                        (working.name === name ? Object.assign(working, {checked: value}) : working)),
                    price_porteur: value ? this.state.clientDetails.price_porteur + price : this.state.clientDetails.price_porteur - price
                }
            }), () => console.log(this.state))
            ;
        }
        const CombinerChat = ({emailClient, orderInfo}) => {
            const {currentUser} = useContext(AuthContext);
            return (
                <span
                    onClick={async () => {
                        let myUser = {};
                        try {
                            const q = query(
                                collection(db, "users"),
                                where("email", "==", emailClient) //order.client.email
                            );
                            const querySnapshot = await getDocs(q);
                            console.log("querySnapshot", querySnapshot);

                            querySnapshot.forEach((doc) => {
                                myUser = doc.data();
                                console.log(doc.data());
                            });
                        } catch (e) {
                            console.log(e);
                        }
                        const combinedId =
                            currentUser.uid > myUser.uid
                                ? currentUser.uid + myUser.uid
                                : myUser.uid + currentUser.uid;
                        try {
                            const res = await getDoc(doc(db, "chats", combinedId));
                            console.log("combinedId", combinedId);
                            console.log("res", res);
                            if (!res.exists()) {
                                //create a chat in chats collection
                                await setDoc(doc(db, "chats", combinedId), {messages: []});

                                //create user chats
                                await updateDoc(doc(db, "userChats", currentUser.uid), {
                                    [combinedId + ".userInfo"]: {
                                        uid: myUser.uid,
                                        displayName: myUser.displayName,
                                        photoURL: myUser.photoURL ? myUser.photoURL : "/images/avatar-person.png"

                                    },
                                    [combinedId + ".date"]: serverTimestamp(),
                                });

                                await updateDoc(doc(db, "userChats", myUser.uid), {
                                    [combinedId + ".userInfo"]: {
                                        uid: currentUser.uid,
                                        displayName: currentUser.displayName,
                                        photoURL: currentUser.photoURL ? currentUser.photoURL : "/images/avatar-person.png",
                                    },
                                    [combinedId + ".date"]: serverTimestamp(),
                                });
                                this.setState({myUser: myUser, orderInfo}, () => {
                                    this.setState(prev=>({redirectChat: true,orderInfo:{
                                            ...prev.orderInfo,client:orderInfo
                                        }}));
                                });
                            } else {
                                this.setState({myUser: myUser, orderInfo}, () => {
                                    this.setState(prev=>({redirectChat: true,orderInfo:{
                                            ...prev.orderInfo,client:orderInfo
                                        }}));
                                })
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }}
                >
                    {t('btns.contacter')}
                </span>
            );
        };
        if (this.state.redirectChat) {
            return (
                <Redirect
                    to={{
                        pathname: "/tchat-group",
                        state: {
                            myUser: this.state.myUser,
                            orderInfo: this.state.orderInfo,
                        },
                    }}
                />
            );
        } else
        if (this.state.redirect)
            return <Redirect to={{
                pathname: '/recapitulatif-annonce',
                state: {id: this.state.clientDetails.id_advert_query, order: myReservation,clientDetails:this.state.clientDetails, page: 'listeDemande'}
            }}/>
        else
            return (
                loading ?
                    <p className={'text-center my-5'}>
                            <span className="fa fa-spin fa-spinner fa-4x">
                            </span>
                    </p> :
                    <div>
                        <section className={'depotAnnonce  container text-center py-5'}>

                            <p className={'text-dark-blue'}>{t('circuit_depot_annonce.recapAnn')}</p>

                            <div className={"recapBorderedBlock"}>
                                <div className={"d-flex flex-column flex-md-row"}>
                                    <div className="d-flex flex-column flex-md-row justify-content-between w-100">
                                        <div className={"col-md-2 text-capitalize"}>
                                            <svg style={{
                                                position: 'absolute',
                                                top: '-18px',
                                                left: 0,
                                            }} xmlns="http://www.w3.org/2000/svg" width="27.515" height="35.661"
                                                 viewBox="0 0 27.515 35.661">
                                                <g id="pin-svgrepo-com_2_" data-name="pin-svgrepo-com (2)"
                                                   transform="translate(52.386 35.411) rotate(180)">
                                                    <g id="Groupe_4899" data-name="Groupe 4899"
                                                       transform="translate(25.121)">
                                                        <g id="Groupe_4898" data-name="Groupe 4898"
                                                           transform="translate(0)">
                                                            <path id="Tracé_6731" data-name="Tracé 6731"
                                                                  d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                  transform="translate(-25.121)" fill="#4bbded"
                                                                  stroke="#4bbded" strokeWidth="0.5"/>
                                                            <path id="Tracé_6732" data-name="Tracé 6732"
                                                                  d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                  transform="translate(-68.326 -99.979)"
                                                                  fill="#4bbded"
                                                                  stroke="#4bbded" strokeWidth="0.5"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            {myReservation.ville_depart}<br/>
                                            <LazyLoadImage style={{maxHeight: 35}}
                                                           src={"/images/" + myReservation.type_adresse_depart.toLowerCase().replace(' ', '') + ".png"}
                                                           alt={myReservation.type_adresse_depart}/>
                                            <br/> <sup style={{
                                            fontSize: 'x-small',
                                            color: '#b9b9b9'
                                        }}>{myReservation.type_adresse_depart}</sup>
                                        </div>

                                        <div className={'col-6 col-md-8'}>
                                            <div
                                                className={'d-flex flex-md-row flex-column justify-content-center align-items-center gap-2'}>
                                                {myReservation.objectTransport.includes("Voiture") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="35.965" height="17.26"
                                                         viewBox="0 0 35.965 17.26">
                                                        <g id="car-svgrepo-com_1_"
                                                           data-name="car-svgrepo-com (1)"
                                                           transform="translate(0 0)">
                                                            <g id="Groupe_3569"
                                                               data-name="Groupe 3569">
                                                                <path id="Tracé_4987"
                                                                      data-name="Tracé 4987"
                                                                      d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                                      transform="translate(19.229 -6.929)"
                                                                />
                                                                <path id="Tracé_4988"
                                                                      data-name="Tracé 4988"
                                                                      d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                                      transform="translate(0 -8.177)"
                                                                />
                                                                <path id="Tracé_4989"
                                                                      data-name="Tracé 4989"
                                                                      d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                                      transform="translate(-16.083 -6.929)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Car") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="32.58" height="16.883"
                                                         viewBox="0 0 32.58 16.883">
                                                        <g id="bus-svgrepo-com_2_"
                                                           data-name="bus-svgrepo-com (2)"
                                                           transform="translate(0 -83.368)">
                                                            <g id="Groupe_4744"
                                                               data-name="Groupe 4744"
                                                               transform="translate(0 83.368)">
                                                                <path id="Tracé_6610"
                                                                      data-name="Tracé 6610"
                                                                      d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                                      transform="translate(0 -83.368)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Camion") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="33.884" height="17.048"
                                                         viewBox="0 0 33.884 17.048">
                                                        <path id="truck-svgrepo-com_1_"
                                                              data-name="truck-svgrepo-com (1)"
                                                              d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                              transform="translate(0 -96.384)"
                                                        />
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Avion") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="32.625" height="17.048"
                                                         viewBox="0 0 32.625 17.048">
                                                        <g id="XMLID_909_"
                                                           transform="translate(0 -110.089)">
                                                            <g id="Groupe_4745"
                                                               data-name="Groupe 4745"
                                                               transform="translate(0 110.089)">
                                                                <path id="Tracé_6611"
                                                                      data-name="Tracé 6611"
                                                                      d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                                      transform="translate(0 -110.089)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Train") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="21.018" height="18.048"
                                                         viewBox="0 0 21.018 18.048">
                                                        <g id="train-svgrepo-com_2_"
                                                           data-name="train-svgrepo-com (2)"
                                                           transform="translate(0 -20.392)">
                                                            <path id="Tracé_6612"
                                                                  data-name="Tracé 6612"
                                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                            />
                                                            <path id="Tracé_6613"
                                                                  data-name="Tracé 6613"
                                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                                  transform="translate(-40.553 -154.141)"
                                                            />
                                                        </g>
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Bateau") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="24.57" height="20.641"
                                                         viewBox="0 0 24.57 20.641">
                                                        <path id="boat-svgrepo-com"
                                                              d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                              transform="translate(0 -16.99)"
                                                        />
                                                    </svg> : null}
                                                {myReservation.objectTransport.includes("Indifferent") ?
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                         width="15.308" height="26.276"
                                                         viewBox="0 0 15.308 26.276">
                                                        <g id="standing-man-svgrepo-com"
                                                           transform="translate(-25.906)">
                                                            <g id="Groupe_8941"
                                                               data-name="Groupe 8941"
                                                               transform="translate(25.906 0)">
                                                                <path id="Tracé_7680"
                                                                      data-name="Tracé 7680"
                                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                      transform="translate(-25.906 -20.81)"
                                                                />
                                                                <circle id="Ellipse_139"
                                                                        data-name="Ellipse 139"
                                                                        cx="2.719"
                                                                        cy="2.719"
                                                                        r="2.719"
                                                                        transform="translate(4.914)"
                                                                />
                                                            </g>
                                                        </g>
                                                    </svg> : null}
                                            </div>
                                            <div
                                                className={'d-flex flex-row align-items-center justify-content-center'}>
                                                <hr style={{
                                                    minWidth: '80%',
                                                    borderTop: '3px solid #EF7723'
                                                }}/>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     width="18.571" height="26"
                                                     viewBox="0 0 18.571 26">
                                                    <g id="Polygone_9"
                                                       data-name="Polygone 9"
                                                       transform="translate(18.571) rotate(90)"
                                                       fill="#EF7723">
                                                        <path
                                                            d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                            stroke="none"/>
                                                        <path
                                                            d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                            stroke="none"
                                                            fill="#EF7723"/>
                                                    </g>
                                                </svg>
                                            </div>
                                            <div
                                                className={'d-flex justify-content-between'}>
                                                                <span>
                                                                    <LazyLoadImage src={"/images/poids.png"}
                                                                                   alt={'poids'}/> <sub>{myReservation.dimensionsKg} Kg</sub>
                                                                </span>
                                                <span>
                                                                    {myReservation.objectType.includes("Bagage") ?
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="17.483"
                                                                             className={"mx-1"} height="26.251"
                                                                             viewBox="0 0 17.483 26.251">
                                                                            <path id="suitcase-svgrepo-com_1_"
                                                                                  data-name="suitcase-svgrepo-com (1)"
                                                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                                                  transform="translate(-17.6 -1.3)"/>
                                                                        </svg> : null}
                                                    {myReservation.objectType.includes("Sac à dos") ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22.633"
                                                             className={"mx-1"} height="24.048"
                                                             viewBox="0 0 22.633 24.048">
                                                            <g id="backpack-svgrepo-com_1_"
                                                               data-name="backpack-svgrepo-com (1)"
                                                               transform="translate(-8.735)">
                                                                <path id="Tracé_6614" data-name="Tracé 6614"
                                                                      d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                                      transform="translate(0 -155.838)"
                                                                />
                                                                <path id="Tracé_6615" data-name="Tracé 6615"
                                                                      d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                                      transform="translate(-232.971 -155.837)"
                                                                />
                                                                <path id="Tracé_6616" data-name="Tracé 6616"
                                                                      d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                                      transform="translate(-2.048 -14.56)"
                                                                />
                                                                <path id="Tracé_6617" data-name="Tracé 6617"
                                                                      d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                                      transform="translate(-30.854)"
                                                                />
                                                                <rect id="Rectangle_5839"
                                                                      data-name="Rectangle 5839"
                                                                      width="11.4"
                                                                      height="4.826"
                                                                      transform="translate(14.407 16.226)"
                                                                />
                                                                <path id="Tracé_6618" data-name="Tracé 6618"
                                                                      d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                                      transform="translate(-34.631 -95.675)"
                                                                />
                                                                <path id="Tracé_6619" data-name="Tracé 6619"
                                                                      d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                                      transform="translate(-239.381 -14.561)"
                                                                />
                                                            </g>
                                                        </svg> : null}


                                                    {myReservation.objectType.includes("Hors format") ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="33.502"
                                                             className={"mx-1"} height="22.131"
                                                             viewBox="0 0 33.502 22.131">
                                                            <g id="bike-svgrepo-com"
                                                               transform="translate(0.001 -50.317)">
                                                                <path id="Tracé_6621" data-name="Tracé 6621"
                                                                      d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                                      transform="translate(0)"/>
                                                            </g>
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Petits objets') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="35.79"
                                                             className={"mx-1"} height="21.048"
                                                             viewBox="0 0 35.79 21.048">
                                                            <g id="trainers-svgrepo-com"
                                                               transform="translate(0 -61.013)">
                                                                <path id="Tracé_6622" data-name="Tracé 6622"
                                                                      d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                                      transform="translate(0)"/>
                                                            </g>
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Chat') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16.371"
                                                             className={"mx-1"} height="23"
                                                             viewBox="0 0 16.371 23">
                                                            <path id="cat-svgrepo-com"
                                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                                  transform="translate(-32.398)"
                                                            />
                                                        </svg> : null}
                                                    {myReservation.objectType.includes('Indifferent') ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="15.308"
                                                             className={"mx-1"} height="26.276"
                                                             viewBox="0 0 15.308 26.276">
                                                            <g id="standing-man-svgrepo-com"
                                                               transform="translate(-25.906)">
                                                                <g id="Groupe_8941" data-name="Groupe 8941"
                                                                   transform="translate(25.906 0)">
                                                                    <path id="Tracé_7680" data-name="Tracé 7680"
                                                                          d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                                          transform="translate(-25.906 -20.81)"
                                                                    />
                                                                    <circle id="Ellipse_139"
                                                                            data-name="Ellipse 139"
                                                                            cx="2.719"
                                                                            cy="2.719"
                                                                            r="2.719"
                                                                            transform="translate(4.914)"
                                                                    />
                                                                </g>
                                                            </g>
                                                        </svg>
                                                        : null}
                                                    <sub>{myReservation.dimensionsLong} x {myReservation.dimensionsLarg} x {myReservation.dimensionsH} Cm</sub>
                                                                </span>
                                            </div>
                                        </div>
                                        <div className={"col-md-2 text-capitalize"}>
                                            {myReservation.ville_arrivee}
                                            <svg style={{
                                                position: 'absolute',
                                                top: '-18px',
                                                right: 0
                                            }} xmlns="http://www.w3.org/2000/svg" width="27.515" height="35.661"
                                                 viewBox="0 0 27.515 35.661">
                                                <g id="pin-svgrepo-com_2_" data-name="pin-svgrepo-com (2)"
                                                   transform="translate(52.386 35.411) rotate(180)">
                                                    <g id="Groupe_4899" data-name="Groupe 4899"
                                                       transform="translate(25.121)">
                                                        <g id="Groupe_4898" data-name="Groupe 4898"
                                                           transform="translate(0)">
                                                            <path id="Tracé_6731" data-name="Tracé 6731"
                                                                  d="M38.628,0C33.6,0,25.121,14.76,25.121,21.654a13.507,13.507,0,1,0,27.015,0C52.136,14.76,43.656,0,38.628,0Zm0,33.875A12.235,12.235,0,0,1,26.407,21.654c0-7.215,8.569-20.368,12.221-20.368S50.849,14.439,50.849,21.654A12.235,12.235,0,0,1,38.628,33.875Z"
                                                                  transform="translate(-25.121)" fill="#ef7723"
                                                                  stroke="#ef7723" strokeWidth="0.5"/>
                                                            <path id="Tracé_6732" data-name="Tracé 6732"
                                                                  d="M81.834,119.329a5.146,5.146,0,1,0,5.146,5.146A5.152,5.152,0,0,0,81.834,119.329Zm0,9a3.859,3.859,0,1,1,3.859-3.859A3.863,3.863,0,0,1,81.834,128.334Z"
                                                                  transform="translate(-68.326 -99.979)"
                                                                  fill="#ef7723"
                                                                  stroke="#ef7723" strokeWidth="0.5"/>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                            <br/>
                                            <LazyLoadImage style={{maxHeight: 35}}
                                                           src={"/images/" + myReservation.type_adresse_arrivee.toLowerCase().replace(' ', '') + ".png"}
                                                           alt={myReservation.type_adresse_arrivee}/>
                                            <br/> <sup style={{
                                            fontSize: 'x-small',
                                            color: '#b9b9b9'
                                        }}>{myReservation.type_adresse_arrivee}</sup>
                                        </div>
                                    </div>
                                    <div className={"col-md-3"}>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.dateDep')}
                                            <span
                                                className="text-gris float-right">{myReservation.dateDepart}</span>
                                        </p>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.heureDep')}
                                            <span
                                                className="text-gris float-right">{myReservation.heureDepart}</span>
                                        </p>
                                        <br/>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.dateArr')}
                                            <span
                                                className="text-gris float-right">{myReservation.dateArrivee}</span>
                                        </p>
                                        <p className={'fs-small mb-0 text-left'}>{t('circuit_depot_annonce.heureArr')}
                                            <span
                                                className="text-gris float-right">{myReservation.heureArrivee}</span>
                                        </p>
                                        <br/>
                                    </div>
                                </div>
                            </div>
                            <div className={"recapBorderedBlock text-left px-5 py-4 mt-4"}>
                                <div className={'row'}>
                                    <div className={'col-md-12'}>
                                        <p className={'text-left'}>{t('circuit_depot_annonce.listeContenu')}</p>
                                        <div className={"recapBorderedBlock p-3"} style={{borderRadius: 50}}>

                                            {myReservation.listeContenu.map(cont =>
                                                <label style={{
                                                    backgroundColor: '#53BFED',
                                                    color: 'white',
                                                    borderRadius: 5,
                                                    padding: 5,
                                                    margin: '5px 10px'
                                                }} htmlFor={cont.label}>
                                                    {cont.label}
                                                </label>
                                            )}

                                        </div>
                                        <p className={'text-left'}>{t('circuit_depot_annonce.galerie')}</p>
                                        <div className={"recapBorderedBlock text-left px-5 py-4 my-4"}>
                                            <div className="clearfix text-md-left text-center">
                                                <Upload
                                                    action=""
                                                    listType="picture-card"
                                                    fileList={gallery}
                                                    onPreview={this.handlePreview}
                                                >
                                                </Upload>
                                                <Modal open={previewVisible} footer={null}
                                                       onCancel={this.handleCancel}
                                                       className={'text-center'}>
                                                    <LazyLoadImage alt="example" src={previewImage}/>
                                                </Modal>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <p className={'text-left fw-bold mt-3'}>{t('recap.ListePorteur')}</p>
                            <p className={'text-left'}>{t('recap.selectPorteur')}</p>
                            <div className={"row "}>
                                {myReservation.porteurs.map(client =>
                                    <div className={"col-md-4 "}>
                                        <div
                                            className={isDetails ? "recapBorderedBlock p-0 " : "recapBorderedBlock border-blue p-0"}
                                            style={{borderRadius: 24, borderWidth: 2}}>
                                            <div className={"row m-0"}>
                                                <div className={"col-lg-12 text-left p-3"}>
                                                    <div
                                                        className="d-flex flex-row gap-3 justify-content-start align-items-start">
                                                        <div className={'mx-2'}>{client.photo ?
                                                            <div className={'position-relative'}>
                                                                <LazyLoadImage
                                                                    src={client.photo}
                                                                    alt={client.firstName}
                                                                    style={{
                                                                        width: '60px',
                                                                        height: '60px',
                                                                        objectFit:'cover',
                                                                        borderRadius: '50%',
                                                                    }}/>
                                                            </div> :
                                                            <LazyLoadImage
                                                                src={"/images/avatar-person.png"}
                                                                alt={client.firstName}
                                                                style={{
                                                                    width: '60px',
                                                                    borderRadius: '50%',
                                                                }}/>}
                                                        </div>
                                                        <p className={'d-flex flex-column justify-content-around align-items-center mb-0'}>
                                                            <span>{client.firstName}</span>
                                                            <div>
                                            <span
                                                className={'text-orange mr-2'}>{client.totalAvis}</span>
                                                                <LazyLoadImage src={"/images/star.png"} alt={'avis'}
                                                                               className={'mr-2'}/>
                                                                <span
                                                                    className={'text-gris'}>{client.nbrAvis} {t('page_avis.avis')}</span>
                                                            </div>
                                                        </p>

                                                    </div>
                                                </div>
                                                <div className={"col-lg-12 px-4 py-0 border-top"}>
                                                    <div className={"row "}>
                                                        <div
                                                            className="col-6 mb-0 text-orange border-right py-2 pointer">

                                                            <CombinerChat
                                                                emailClient={client.email}
                                                                orderInfo={client}
                                                            />
                                                        </div>

                                                        {client.isValid == 0 ?
                                                            <div
                                                                className={"col-6 mb-0 text-gris pointer py-2"}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        clientDetails: client,
                                                                        priceNet:client.priceNet
                                                                    }, () => {
                                                                        this.setState({isDetails: !this.state.isDetails,})
                                                                    })
                                                                }}>{this.state.isDetails ?
                                                            <FontAwesomeIcon
                                                                icon={faChevronUp}/> : t('btns.details')}
                                                            </div> :
                                                            <div onClick={() => {
                                                                this.setState({

                                                                    clientDetails: client,
                                                                    priceNet:client.priceNet
                                                                }, () => {
                                                                    this.setState({isDetails: !this.state.isDetails,})
                                                                })
                                                            }}
                                                                className={client.isValid == 1 ? "col-6 mb-0 text-success fs-small pointer py-2" : "col-6 mb-0 text-danger fs-small pointer py-2"}
                                                            >{client.isValid == 1 ?client.isPaied == 1?
                                                                t('page_annonce.Paye') : t('page_annonce.demandeValider') : t('page_annonce.demandeRefuser')}</div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>)}
                                <div>

                                    {isDetails ?
                                        <div
                                            className={"btnCustomColor mb-3 row p-3 w-100 text-gris border-blue bg-transparent mt-4"}
                                            style={{borderWidth: 2}}
                                        >
                                            <div className={'col-8 text-left'}>
                                                <div className={'col-md-12 text-left'}>
                                                    <div className={'row text-left'}>
                                                        <div className={'col-12 text-left'}>
                                                            <label>{t('page_home.ville_depart_propose')}
                                                                <LazyLoadImage className={'mx-2'}
                                                                               src={"/images/" + this.state.clientDetails.type_adresse_depart.toLowerCase().replace(' ', '') + ".png"}
                                                                               alt={this.state.clientDetails.type_adresse_depart}
                                                                               height={30}/>
                                                            </label>
                                                            <input type={"text"} name={"ville_depart"}
                                                                   value={this.state.clientDetails.ville_depart != '' ? this.state.clientDetails.ville_depart : myReservation.ville_depart}
                                                                   readOnly/>
                                                            <input type={"text"} name={"adresse_point_depart"}
                                                                   value={this.state.clientDetails.adresse_point_depart != '' ? this.state.clientDetails.adresse_point_depart : myReservation.adresse_point_depart}
                                                                   readOnly/>

                                                        </div>
                                                        <div className={'col-md-6 text-left'}>
                                                            <label>{t('page_home.date')}</label>
                                                            <input type={"text"} name={"date"}
                                                                   value={this.state.clientDetails.dateDepart}
                                                                   readOnly/>

                                                        </div>
                                                        <div className={'col-md-6 text-left'}>
                                                            <label>{t('circuit_depot_annonce.heure')}</label>
                                                            <input type={"time"} name={"heure"}
                                                                   value={this.state.clientDetails.heureDepart}
                                                                   readOnly/>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={'col-md-12 text-left'}>
                                                    <div className={'row text-left'}>
                                                        <div className={'col-12 text-left'}>
                                                            <label>{t('page_home.ville_arrivee_propose')}
                                                                <LazyLoadImage className={'mx-2'}
                                                                               src={"/images/" + this.state.clientDetails.type_adresse_arrivee.toLowerCase().replace(' ', '') + ".png"}
                                                                               alt={this.state.clientDetails.type_adresse_arrivee}
                                                                               height={30}/>
                                                            </label>
                                                            <input type={"text"} name={"ville_arrivee"}
                                                                   value={this.state.clientDetails.ville_arrivee != '' ? this.state.clientDetails.ville_arrivee : myReservation.ville_arrivee}
                                                                   readOnly/>
                                                            <input type={"text"} name={"adresse_point_arrivee"}
                                                                   value={this.state.clientDetails.adresse_point_arrivee != '' ? this.state.clientDetails.adresse_point_arrivee : myReservation.adresse_point_arrivee}
                                                                   readOnly/>

                                                        </div>
                                                        <div className={'col-md-6 text-left'}>
                                                            <label>{t('page_home.date')}</label>
                                                            <input type={"text"} name={"date"}
                                                                   value={this.state.clientDetails.dateArrivee}
                                                                   readOnly/>

                                                        </div>
                                                        <div className={'col-md-6 text-left'}>
                                                            <label>{t('circuit_depot_annonce.heure')}</label>
                                                            <input type={"time"} name={"heure"}
                                                                   value={this.state.clientDetails.heureArrivee}
                                                                   readOnly/>

                                                        </div>
                                                    </div>
                                                </div>
                                                {this.state.clientDetails.isValid===0&&<div className={'col-md-12 text-left'}>
                                                    <button disabled={this.state.raisonRefus ? false : true}
                                                            onClick={() => this.refuser()}
                                                            className={"btnBlue w-100"}>{t('btns.refuserDemande')}
                                                    </button>
                                                    <label>{t('recap.raisonRefus')}<span
                                                        className={"text-danger"}>*</span></label>
                                                    <textarea name={"raisonRefus"} value={this.state.raisonRefus}
                                                              rows={'4'} required
                                                              onChange={(e) => {
                                                                  this.setState({raisonRefus: e.target.value})
                                                              }}/>
                                                </div>}
                                            </div>
                                            <div className={'col-4'}>
                                                <div
                                                    className={"btnCustomColor d-flex flex-column w-100 text-gris border-blue bg-transparent"}
                                                    style={{borderWidth: 2}}>
                                                    <div className={'d-flex justify-content-between py-2'}>
                                                        <span>{t('btns.details')}</span>
                                                        <FontAwesomeIcon
                                                            icon={isDetails ? faChevronUp : faChevronDown}/>
                                                    </div>
                                                    <div className={'d-flex justify-content-between p-2'}>
                                                        <label>{t('recap.prixAnnonce')}</label>
                                                        <label>{this.state.priceNet}€</label>
                                                    </div>
                                                    <div className={'d-flex justify-content-between p-2'}>
                                                        <label>{t('recap.assurance')}</label>
                                                        <label>
                                                            <FontAwesomeIcon
                                                                className={'text-blue'}
                                                                icon={faCheck}/>
                                                        </label>
                                                    </div>
                                                    {this.state.clientDetails.setting_price.filter(val => val.isRelais == false).map(setting =>
                                                        <div className={'d-flex justify-content-between py-2 '}>
                                                            <Checkbox className={'text-gris'} name={setting.name}
                                                                      style={this.props.location.state.id ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}
                                                                      checked={setting.checked}
                                                                      onChange={(e) => onCheckboxChangeAss(e, setting.price)}
                                                            >
                                                                {setting.name}
                                                            </Checkbox>
                                                            <span>{setting.price ? setting.price + '€' : '_'}</span>
                                                        </div>)}
                                                    {this.state.clientDetails.objectRelaisArriv.filter(val => val.isRelais == true && val.checked == true).map(setting =>
                                                        <div className={'d-flex justify-content-between py-2 demandeListeProp'}>
                                                            <Checkbox className={'text-gris'} name={setting.name}
                                                                      style={this.props.location.state.id ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}
                                                                      checked={setting.checked}
                                                                //   onChange={(e)=>onCheckboxChangeAss(e,setting.price)}
                                                            >
                                                                {setting.name}
                                                            </Checkbox>
                                                            <span>{setting.price ? setting.price + '€' : '_'}</span>
                                                        </div>)}
                                                    {this.state.clientDetails.objectRelaisDepart.filter(val => val.isRelais == true && val.checked == true).map(setting =>
                                                        <div className={'d-flex justify-content-between py-2 demandeListeProp'}>
                                                            <Checkbox className={'text-gris'} name={setting.name}
                                                                      style={this.props.location.state.id ? {pointerEvents: 'none'} : {pointerEvents: 'auto'}}
                                                                      checked={setting.checked}
                                                                      //onChange={(e) => onCheckboxChangeAss(e, setting.price)}
                                                            >
                                                                {setting.name}
                                                            </Checkbox>
                                                            <span>{setting.price ? setting.price + '€' : '_'}</span>
                                                        </div>)}
                                                </div>
                                                <div
                                                    className={"btnCustomColor mb-3 d-flex flex-row align-items-center justify-content-between w-100 text-blue border-blue bg-transparent"}>
                                                    <div>{t('circuit_depot_annonce.priceTotal')}:</div>
                                                    <div className={"d-flex flex-row align-items-center"}>
                                                            <span
                                                                className="fs-3 fw-bold">{this.state.clientDetails.price_porteur} €</span>
                                                    </div>
                                                </div>
                                                {this.state.clientDetails.isValid===0&&<button className={"btnBlue w-100"}
                                                         onClick={() => this.setState({redirect: true}, () => {
                                                             window.location.reload(false)
                                                         })}>{t('reserver')}</button>}
                                            </div>
                                        </div>
                                        : null}

                                </div>
                            </div>
                        </section>
                        <div className={'container-fluid'}>
                            <Link to={'/faq'}
                                  className={'btnFAQ'}>FAQ
                            </Link>
                        </div>
                    </div>
            )
    }

}

export default withTranslation()(RecapAnnonceDemandeListeProp);