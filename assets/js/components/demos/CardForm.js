import React, {useEffect, useMemo, useState} from "react";
import {useStripe, useElements, CardElement} from "@stripe/react-stripe-js";

import useResponsiveFontSize from "../../useResponsiveFontSize";
import axios from "axios";
import {Button, Form, Input, Modal, Select} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faPlus} from "@fortawesome/free-solid-svg-icons";
import {messageService} from '../../lib/Services';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {withTranslation} from "react-i18next";

const useOptions = () => {
    const fontSize = useResponsiveFontSize();
    const Options = useMemo(
        () => ({
            hidePostalCode: true,
            style: {
                base: {
                    fontSize,
                    color: "#424770",
                    background: '#fff',
                    letterSpacing: "0.025em",
                    fontFamily: "Source Code Pro, monospace",
                    "::placeholder": {
                        color: "#aab7c4"
                    }
                },
                invalid: {
                    color: "#9e2146"
                }
            }
        }),
        [fontSize]
    );

    return Options;
};

const CardForm = (props) => {
    const t=props.t;
    const stripe = useStripe();
    const elements = useElements();
    const Options = useOptions();
    //  updateCardValue=NoOp;
    const [noload, setNoLoad] = useState(false);
    const [disabled, setDisabled] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async event => {
        setDisabled(true)
        event.preventDefault();
        setTimeout(() => {
            setDisabled(false)
        }, 5000);
        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            alert('ooops erreur');
        }

        const payload = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardElement)
        });
        axios.post('api/card/create', {
            tokenCard: payload.paymentMethod.id,
            tokenClient: token
        })
            .then(res => {
                console.log('api/stripe/card/create')
                setDisabled(false)
                setVisibleCard(false);
                // updateCardValue(25);
                messageService.sendMessage('ok');
                const modal = Modal.success({
                    content: (
                        <div className={"text-center"} key={'visibleCard-'+Math.random()}>
                            <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"} width={'65px'}/>
                            <p className={"text-success pt-2"}>
                                {t('success_alert')}
                            </p>

                        </div>),
                    okText: 'ok',
                });
                setTimeout(() => {
                    modal.destroy();
                }, 5000);
                setSuccess('ok')
                 window.location.reload(false);
                /*  if(props.children=='
                reloadMe') {
                      window.location.reload(false);
                  }*/

            }).catch(function (error) {
            setDisabled(false)

        })
    };
    const [visibleCard, setVisibleCard] = useState(false);
    const [visibleIconSuccess, setVisibleIconSuccess] = useState(false);
    const [form] = Form.useForm();
    const user = JSON.parse(localStorage.getItem('client'));
    const token =user.client.token;
    const client = user.client;
    let firefox= navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    return (
        <>
            <Modal className={'addCard'} open={visibleCard} onOk={handleSubmit}
                   onCancel={() => {
                       setVisibleCard(false);
                       setDisabled(false)

                   }} footer={[

                <Button key="submit" type="primary" className={disabled || noload ? 'disabled' : null} disabled={!stripe}
                        onClick={(event) => {
                            handleSubmit(event)

                        }}>
                    {disabled || noload ? <>Enregistrer {noload?null:<span className="fa fa-spin fa-spinner "> </span>}</> : 'Enregistrer'}

                </Button>,
                <Button key="back" className={'cancel'} style={{padding:15}} onClick={() => {
                    setVisibleCard(false);
                }}>
                    Annuler
                </Button>,

            ]}>
                <h4>Ajouter un mode de paiement</h4>
                <p style={{color: '#939393'}}><FontAwesomeIcon icon={faLock}/> Paiement 100% sécurisé</p>
                <LazyLoadImage src={"/images/mastercard.png"} alt={'masterCard'} width={"40px"} className={'pr-2'}/>
                <LazyLoadImage src={"/images/visa.png"} alt={'visa'} width={"40px"} className={'pr-2'}/>
                <LazyLoadImage src={"/images/amex.png"} alt={'amex'} width={"40px"}/>

                <Form requiredMark={false}
                      form={form}
                      name="addCard"
                      scrollToFirstError>
                    {/*<div className={'row'}>
                        <Form.Item initialValue={client.lastName} className={'col-md-6'}
                                   name="lastName"
                                   label={"Nom"}
                                   rules={[
                                       {
                                           required: true,
                                           message: 'votre nom de famille ne doit pas être vide!',
                                           whitespace: true,
                                       },
                                   ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item initialValue={client.firstName} className={'col-md-6'}
                                   name="firstName"
                                   label={"Prénom"}

                                   rules={[
                                       {
                                           required: true,
                                           message: 'votre Prénom ne doit pas être vide!',
                                           whitespace: true,
                                       },
                                   ]} hasFeedback
                        >
                            <Input/>
                        </Form.Item>
                    </div>*/}
                    <Form.Item
                        name="infoCard"
                        label="Informations de la carte"
                        hasFeedback
                    >
                        <CardElement
                            Options={Options}
                            onReady={() => {
                                console.log("CardElement [ready]");
                            }}
                            onChange={event => {
                                console.log("CardElement [change]", event);
                                if (event.complete == true) {
                                    setVisibleIconSuccess(true);
                                    setNoLoad(false)
                                }else{
                                    setNoLoad(true)
                                }
                            }}
                            onBlur={() => {
                                console.log("CardElement [blur]");
                            }}
                            onFocus={(event) => {
                                console.log("CardElement [focus]");
                            }}
                        />
                        {visibleIconSuccess ? <span className="ant-form-item-children-icon myTest">
                           <span role="img" aria-label="check-circle" className="anticon anticon-check-circle">
                               <svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" width="1em"
                                    height="1em"
                                    fill="currentColor" aria-hidden="true">
                                   <path
                                       d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z">

                                   </path>
                               </svg>
                           </span>
                       </span> : null}
                    </Form.Item>
                    <Form.Item
                        name="pays"
                        label="Pays"
                        initialValue={'France'}
                        rules={[

                            {
                                required: true,
                                message: 'pays ne doit pas être vide!',
                            },
                        ]} hasFeedback
                    >
                        <Select name="pays" defaultValue="France">
                            <Option  key={'ville-' + Math.random()} value="France" selected={true}>France</Option>

                            <Option  key={'ville-' + Math.random()} value="Afghanistan">Afghanistan </Option>
                            <Option  key={'ville-' + Math.random()} value="Afrique_Centrale">Afrique_Centrale </Option>
                            <Option  key={'ville-' + Math.random()} value="Afrique_du_sud">Afrique_du_Sud </Option>
                            <Option  key={'ville-' + Math.random()} value="Albanie">Albanie </Option>
                            <Option  key={'ville-' + Math.random()} value="Algerie">Algerie </Option>
                            <Option  key={'ville-' + Math.random()} value="Allemagne">Allemagne </Option>
                            <Option  key={'ville-' + Math.random()} value="Andorre">Andorre </Option>
                            <Option  key={'ville-' + Math.random()} value="Angola">Angola </Option>
                            <Option  key={'ville-' + Math.random()} value="Anguilla">Anguilla </Option>
                            <Option  key={'ville-' + Math.random()} value="Arabie_Saoudite">Arabie_Saoudite </Option>
                            <Option  key={'ville-' + Math.random()} value="Argentine">Argentine </Option>
                            <Option  key={'ville-' + Math.random()} value="Armenie">Armenie </Option>
                            <Option  key={'ville-' + Math.random()} value="Australie">Australie </Option>
                            <Option  key={'ville-' + Math.random()} value="Autriche">Autriche </Option>
                            <Option  key={'ville-' + Math.random()} value="Azerbaidjan">Azerbaidjan </Option>

                            <Option  key={'ville-' + Math.random()} value="Bahamas">Bahamas </Option>
                            <Option  key={'ville-' + Math.random()} value="Bangladesh">Bangladesh </Option>
                            <Option  key={'ville-' + Math.random()} value="Barbade">Barbade </Option>
                            <Option  key={'ville-' + Math.random()} value="Bahrein">Bahrein </Option>
                            <Option  key={'ville-' + Math.random()} value="Belgique">Belgique </Option>
                            <Option  key={'ville-' + Math.random()} value="Belize">Belize </Option>
                            <Option  key={'ville-' + Math.random()} value="Benin">Benin </Option>
                            <Option  key={'ville-' + Math.random()} value="Bermudes">Bermudes </Option>
                            <Option  key={'ville-' + Math.random()} value="Bielorussie">Bielorussie </Option>
                            <Option  key={'ville-' + Math.random()} value="Bolivie">Bolivie </Option>
                            <Option  key={'ville-' + Math.random()} value="Botswana">Botswana </Option>
                            <Option  key={'ville-' + Math.random()} value="Bhoutan">Bhoutan </Option>
                            <Option  key={'ville-' + Math.random()} value="Boznie_Herzegovine">Boznie_Herzegovine </Option>
                            <Option  key={'ville-' + Math.random()} value="Bresil">Bresil </Option>
                            <Option  key={'ville-' + Math.random()} value="Brunei">Brunei </Option>
                            <Option  key={'ville-' + Math.random()} value="Bulgarie">Bulgarie </Option>
                            <Option  key={'ville-' + Math.random()} value="Burkina_Faso">Burkina_Faso </Option>
                            <Option  key={'ville-' + Math.random()} value="Burundi">Burundi </Option>

                            <Option  key={'ville-' + Math.random()} value="Caiman">Caiman </Option>
                            <Option  key={'ville-' + Math.random()} value="Cambodge">Cambodge </Option>
                            <Option  key={'ville-' + Math.random()} value="Cameroun">Cameroun </Option>
                            <Option  key={'ville-' + Math.random()} value="Canada">Canada </Option>
                            <Option  key={'ville-' + Math.random()} value="Canaries">Canaries </Option>
                            <Option  key={'ville-' + Math.random()} value="Cap_vert">Cap_Vert </Option>
                            <Option  key={'ville-' + Math.random()} value="Chili">Chili </Option>
                            <Option  key={'ville-' + Math.random()} value="Chine">Chine </Option>
                            <Option  key={'ville-' + Math.random()} value="Chypre">Chypre </Option>
                            <Option  key={'ville-' + Math.random()} value="Colombie">Colombie </Option>
                            <Option  key={'ville-' + Math.random()} value="Comores">Colombie </Option>
                            <Option  key={'ville-' + Math.random()} value="Congo">Congo </Option>
                            <Option  key={'ville-' + Math.random()} value="Congo_democratique">Congo_democratique </Option>
                            <Option  key={'ville-' + Math.random()} value="Cook">Cook </Option>
                            <Option  key={'ville-' + Math.random()} value="Coree_du_Nord">Coree_du_Nord </Option>
                            <Option  key={'ville-' + Math.random()} value="Coree_du_Sud">Coree_du_Sud </Option>
                            <Option  key={'ville-' + Math.random()} value="Costa_Rica">Costa_Rica </Option>
                            <Option  key={'ville-' + Math.random()} value="Cote_d_Ivoire">Côte_d_Ivoire </Option>
                            <Option  key={'ville-' + Math.random()} value="Croatie">Croatie </Option>
                            <Option  key={'ville-' + Math.random()} value="Cuba">Cuba </Option>

                            <Option  key={'ville-' + Math.random()} value="Danemark">Danemark </Option>
                            <Option  key={'ville-' + Math.random()} value="Djibouti">Djibouti </Option>
                            <Option  key={'ville-' + Math.random()} value="Dominique">Dominique </Option>

                            <Option  key={'ville-' + Math.random()} value="Egypte">Egypte </Option>
                            <Option  key={'ville-' + Math.random()} value="Emirats_Arabes_Unis">Emirats_Arabes_Unis </Option>
                            <Option  key={'ville-' + Math.random()} value="Equateur">Equateur </Option>
                            <Option  key={'ville-' + Math.random()} value="Erythree">Erythree </Option>
                            <Option  key={'ville-' + Math.random()} value="Espagne">Espagne </Option>
                            <Option  key={'ville-' + Math.random()} value="Estonie">Estonie </Option>
                            <Option  key={'ville-' + Math.random()} value="Etats_Unis">Etats_Unis </Option>
                            <Option  key={'ville-' + Math.random()} value="Ethiopie">Ethiopie </Option>

                            <Option  key={'ville-' + Math.random()} value="Falkland">Falkland </Option>
                            <Option  key={'ville-' + Math.random()} value="Feroe">Feroe </Option>
                            <Option  key={'ville-' + Math.random()} value="Fidji">Fidji </Option>
                            <Option  key={'ville-' + Math.random()} value="Finlande">Finlande </Option>
                            <Option  key={'ville-' + Math.random()} value="France">France </Option>

                            <Option  key={'ville-' + Math.random()} value="Gabon">Gabon </Option>
                            <Option  key={'ville-' + Math.random()} value="Gambie">Gambie </Option>
                            <Option  key={'ville-' + Math.random()} value="Georgie">Georgie </Option>
                            <Option  key={'ville-' + Math.random()} value="Ghana">Ghana </Option>
                            <Option  key={'ville-' + Math.random()} value="Gibraltar">Gibraltar </Option>
                            <Option  key={'ville-' + Math.random()} value="Grece">Grece </Option>
                            <Option  key={'ville-' + Math.random()} value="Grenade">Grenade </Option>
                            <Option  key={'ville-' + Math.random()} value="Groenland">Groenland </Option>
                            <Option  key={'ville-' + Math.random()} value="Guadeloupe">Guadeloupe </Option>
                            <Option  key={'ville-' + Math.random()} value="Guam">Guam </Option>
                            <Option  key={'ville-' + Math.random()} value="Guatemala">Guatemala</Option>
                            <Option  key={'ville-' + Math.random()} value="Guernesey">Guernesey </Option>
                            <Option  key={'ville-' + Math.random()} value="Guinee">Guinee </Option>
                            <Option  key={'ville-' + Math.random()} value="Guinee_Bissau">Guinee_Bissau </Option>
                            <Option  key={'ville-' + Math.random()} value="Guinee equatoriale">Guinee_Equatoriale </Option>
                            <Option  key={'ville-' + Math.random()} value="Guyana">Guyana </Option>
                            <Option  key={'ville-' + Math.random()} value="Guyane_Francaise ">Guyane_Francaise </Option>

                            <Option  key={'ville-' + Math.random()} value="Haiti">Haiti </Option>
                            <Option  key={'ville-' + Math.random()} value="Hawaii">Hawaii </Option>
                            <Option  key={'ville-' + Math.random()} value="Honduras">Honduras </Option>
                            <Option  key={'ville-' + Math.random()} value="Hong_Kong">Hong_Kong </Option>
                            <Option  key={'ville-' + Math.random()} value="Hongrie">Hongrie </Option>

                            <Option  key={'ville-' + Math.random()} value="Inde">Inde </Option>
                            <Option  key={'ville-' + Math.random()} value="Indonesie">Indonesie </Option>
                            <Option  key={'ville-' + Math.random()} value="Iran">Iran </Option>
                            <Option  key={'ville-' + Math.random()} value="Iraq">Iraq </Option>
                            <Option  key={'ville-' + Math.random()} value="Irlande">Irlande </Option>
                            <Option  key={'ville-' + Math.random()} value="Islande">Islande </Option>
                            <Option  key={'ville-' + Math.random()} value="Israel">Israel </Option>
                            <Option  key={'ville-' + Math.random()} value="Italie">italie </Option>

                            <Option  key={'ville-' + Math.random()} value="Jamaique">Jamaique </Option>
                            <Option  key={'ville-' + Math.random()} value="Jan Mayen">Jan Mayen </Option>
                            <Option  key={'ville-' + Math.random()} value="Japon">Japon </Option>
                            <Option  key={'ville-' + Math.random()} value="Jersey">Jersey </Option>
                            <Option  key={'ville-' + Math.random()} value="Jordanie">Jordanie </Option>

                            <Option  key={'ville-' + Math.random()} value="Kazakhstan">Kazakhstan </Option>
                            <Option  key={'ville-' + Math.random()} value="Kenya">Kenya </Option>
                            <Option  key={'ville-' + Math.random()} value="Kirghizstan">Kirghizistan </Option>
                            <Option  key={'ville-' + Math.random()} value="Kiribati">Kiribati </Option>
                            <Option  key={'ville-' + Math.random()} value="Koweit">Koweit </Option>

                            <Option  key={'ville-' + Math.random()} value="Laos">Laos </Option>
                            <Option  key={'ville-' + Math.random()} value="Lesotho">Lesotho </Option>
                            <Option  key={'ville-' + Math.random()} value="Lettonie">Lettonie </Option>
                            <Option  key={'ville-' + Math.random()} value="Liban">Liban </Option>
                            <Option  key={'ville-' + Math.random()} value="Liberia">Liberia </Option>
                            <Option  key={'ville-' + Math.random()} value="Liechtenstein">Liechtenstein </Option>
                            <Option  key={'ville-' + Math.random()} value="Lituanie">Lituanie </Option>
                            <Option  key={'ville-' + Math.random()} value="Luxembourg">Luxembourg </Option>
                            <Option  key={'ville-' + Math.random()} value="Lybie">Lybie </Option>

                            <Option  key={'ville-' + Math.random()} value="Macao">Macao </Option>
                            <Option  key={'ville-' + Math.random()} value="Macedoine">Macedoine </Option>
                            <Option  key={'ville-' + Math.random()} value="Madagascar">Madagascar </Option>
                            <Option  key={'ville-' + Math.random()} value="Madère">Madère </Option>
                            <Option  key={'ville-' + Math.random()} value="Malaisie">Malaisie </Option>
                            <Option  key={'ville-' + Math.random()} value="Malawi">Malawi </Option>
                            <Option  key={'ville-' + Math.random()} value="Maldives">Maldives </Option>
                            <Option  key={'ville-' + Math.random()} value="Mali">Mali </Option>
                            <Option  key={'ville-' + Math.random()} value="Malte">Malte </Option>
                            <Option  key={'ville-' + Math.random()} value="Man">Man </Option>
                            <Option  key={'ville-' + Math.random()} value="Mariannes du Nord">Mariannes du Nord </Option>
                            <Option  key={'ville-' + Math.random()} value="Maroc">Maroc </Option>
                            <Option  key={'ville-' + Math.random()} value="Marshall">Marshall </Option>
                            <Option  key={'ville-' + Math.random()} value="Martinique">Martinique </Option>
                            <Option  key={'ville-' + Math.random()} value="Maurice">Maurice </Option>
                            <Option  key={'ville-' + Math.random()} value="Mauritanie">Mauritanie </Option>
                            <Option  key={'ville-' + Math.random()} value="Mayotte">Mayotte </Option>
                            <Option  key={'ville-' + Math.random()} value="Mexique">Mexique </Option>
                            <Option  key={'ville-' + Math.random()} value="Micronesie">Micronesie </Option>
                            <Option  key={'ville-' + Math.random()} value="Midway">Midway </Option>
                            <Option  key={'ville-' + Math.random()} value="Moldavie">Moldavie </Option>
                            <Option  key={'ville-' + Math.random()} value="Monaco">Monaco </Option>
                            <Option  key={'ville-' + Math.random()} value="Mongolie">Mongolie </Option>
                            <Option  key={'ville-' + Math.random()} value="Montserrat">Montserrat </Option>
                            <Option  key={'ville-' + Math.random()} value="Mozambique">Mozambique </Option>

                            <Option  key={'ville-' + Math.random()} value="Namibie">Namibie </Option>
                            <Option  key={'ville-' + Math.random()} value="Nauru">Nauru </Option>
                            <Option  key={'ville-' + Math.random()} value="Nepal">Nepal </Option>
                            <Option  key={'ville-' + Math.random()} value="Nicaragua">Nicaragua </Option>
                            <Option  key={'ville-' + Math.random()} value="Niger">Niger </Option>
                            <Option  key={'ville-' + Math.random()} value="Nigeria">Nigeria </Option>
                            <Option  key={'ville-' + Math.random()} value="Niue">Niue </Option>
                            <Option  key={'ville-' + Math.random()} value="Norfolk">Norfolk </Option>
                            <Option  key={'ville-' + Math.random()} value="Norvege">Norvege </Option>
                            <Option  key={'ville-' + Math.random()} value="Nouvelle_Caledonie">Nouvelle_Caledonie </Option>
                            <Option  key={'ville-' + Math.random()} value="Nouvelle_Zelande">Nouvelle_Zelande </Option>

                            <Option  key={'ville-' + Math.random()} value="Oman">Oman </Option>
                            <Option  key={'ville-' + Math.random()} value="Ouganda">Ouganda </Option>
                            <Option  key={'ville-' + Math.random()} value="Ouzbekistan">Ouzbekistan </Option>

                            <Option  key={'ville-' + Math.random()} value="Pakistan">Pakistan </Option>
                            <Option  key={'ville-' + Math.random()} value="Palau">Palau </Option>
                            <Option  key={'ville-' + Math.random()} value="Palestine">Palestine </Option>
                            <Option  key={'ville-' + Math.random()} value="Panama">Panama </Option>
                            <Option  key={'ville-' + Math.random()} value="Papouasie_Nouvelle_Guinee">Papouasie_Nouvelle_Guinee </Option>
                            <Option  key={'ville-' + Math.random()} value="Paraguay">Paraguay </Option>
                            <Option  key={'ville-' + Math.random()} value="Pays_Bas">Pays_Bas </Option>
                            <Option  key={'ville-' + Math.random()} value="Perou">Perou </Option>
                            <Option  key={'ville-' + Math.random()} value="Philippines">Philippines </Option>
                            <Option  key={'ville-' + Math.random()} value="Pologne">Pologne </Option>
                            <Option  key={'ville-' + Math.random()} value="Polynesie">Polynesie </Option>
                            <Option  key={'ville-' + Math.random()} value="Porto_Rico">Porto_Rico </Option>
                            <Option  key={'ville-' + Math.random()} value="Portugal">Portugal </Option>

                            <Option  key={'ville-' + Math.random()} value="Qatar">Qatar </Option>

                            <Option  key={'ville-' + Math.random()} value="Republique_Dominicaine">Republique_Dominicaine </Option>
                            <Option  key={'ville-' + Math.random()} value="Republique_Tcheque">Republique_Tcheque </Option>
                            <Option  key={'ville-' + Math.random()} value="Reunion">Reunion </Option>
                            <Option  key={'ville-' + Math.random()} value="Roumanie">Roumanie </Option>
                            <Option  key={'ville-' + Math.random()} value="Royaume_Uni">Royaume_Uni </Option>
                            <Option  key={'ville-' + Math.random()} value="Russie">Russie </Option>
                            <Option  key={'ville-' + Math.random()} value="Rwanda">Rwanda </Option>

                            <Option  key={'ville-' + Math.random()} value="Sahara Occidental">Sahara Occidental </Option>
                            <Option  key={'ville-' + Math.random()} value="Sainte_Lucie">Sainte_Lucie </Option>
                            <Option  key={'ville-' + Math.random()} value="Saint_Marin">Saint_Marin </Option>
                            <Option  key={'ville-' + Math.random()} value="Salomon">Salomon </Option>
                            <Option  key={'ville-' + Math.random()} value="Salvador">Salvador </Option>
                            <Option  key={'ville-' + Math.random()} value="Samoa_Occidentales">Samoa_Occidentales</Option>
                            <Option  key={'ville-' + Math.random()} value="Samoa_Americaine">Samoa_Americaine </Option>
                            <Option  key={'ville-' + Math.random()} value="Sao_Tome_et_Principe">Sao_Tome_et_Principe </Option>
                            <Option  key={'ville-' + Math.random()} value="Senegal">Senegal </Option>
                            <Option  key={'ville-' + Math.random()} value="Seychelles">Seychelles </Option>
                            <Option  key={'ville-' + Math.random()} value="Sierra Leone">Sierra Leone </Option>
                            <Option  key={'ville-' + Math.random()} value="Singapour">Singapour </Option>
                            <Option  key={'ville-' + Math.random()} value="Slovaquie">Slovaquie </Option>
                            <Option  key={'ville-' + Math.random()} value="Slovenie">Slovenie</Option>
                            <Option  key={'ville-' + Math.random()} value="Somalie">Somalie </Option>
                            <Option  key={'ville-' + Math.random()} value="Soudan">Soudan </Option>
                            <Option  key={'ville-' + Math.random()} value="Sri_Lanka">Sri_Lanka </Option>
                            <Option  key={'ville-' + Math.random()} value="Suede">Suede </Option>
                            <Option  key={'ville-' + Math.random()} value="Suisse">Suisse </Option>
                            <Option  key={'ville-' + Math.random()} value="Surinam">Surinam </Option>
                            <Option  key={'ville-' + Math.random()} value="Swaziland">Swaziland </Option>
                            <Option  key={'ville-' + Math.random()} value="Syrie">Syrie </Option>

                            <Option  key={'ville-' + Math.random()} value="Tadjikistan">Tadjikistan </Option>
                            <Option  key={'ville-' + Math.random()} value="Taiwan">Taiwan </Option>
                            <Option  key={'ville-' + Math.random()} value="Tonga">Tonga </Option>
                            <Option  key={'ville-' + Math.random()} value="Tanzanie">Tanzanie </Option>
                            <Option  key={'ville-' + Math.random()} value="Tchad">Tchad </Option>
                            <Option  key={'ville-' + Math.random()} value="Thailande">Thailande </Option>
                            <Option  key={'ville-' + Math.random()} value="Tibet">Tibet </Option>
                            <Option  key={'ville-' + Math.random()} value="Timor_Oriental">Timor_Oriental </Option>
                            <Option  key={'ville-' + Math.random()} value="Togo">Togo </Option>
                            <Option  key={'ville-' + Math.random()} value="Trinite_et_Tobago">Trinite_et_Tobago </Option>
                            <Option  key={'ville-' + Math.random()} value="Tristan da cunha">Tristan de cuncha </Option>
                            <Option  key={'ville-' + Math.random()} value="Tunisie">Tunisie </Option>
                            <Option  key={'ville-' + Math.random()} value="Turkmenistan">Turmenistan </Option>
                            <Option  key={'ville-' + Math.random()} value="Turquie">Turquie </Option>

                            <Option  key={'ville-' + Math.random()} value="Ukraine">Ukraine </Option>
                            <Option  key={'ville-' + Math.random()} value="Uruguay">Uruguay </Option>

                            <Option  key={'ville-' + Math.random()} value="Vanuatu">Vanuatu </Option>
                            <Option  key={'ville-' + Math.random()} value="Vatican">Vatican </Option>
                            <Option  key={'ville-' + Math.random()} value="Venezuela">Venezuela </Option>
                            <Option  key={'ville-' + Math.random()} value="Vierges_Americaines">Vierges_Americaines </Option>
                            <Option  key={'ville-' + Math.random()} value="Vierges_Britanniques">Vierges_Britanniques </Option>
                            <Option  key={'ville-' + Math.random()} value="Vietnam">Vietnam </Option>

                            <Option  key={'ville-' + Math.random()} value="Wake">Wake </Option>
                            <Option  key={'ville-' + Math.random()} value="Wallis et Futuma">Wallis et Futuma </Option>

                            <Option  key={'ville-' + Math.random()} value="Yemen">Yemen </Option>
                            <Option  key={'ville-' + Math.random()} value="Yougoslavie">Yougoslavie </Option>

                            <Option  key={'ville-' + Math.random()} value="Zambie">Zambie </Option>
                            <Option  key={'ville-' + Math.random()} value="Zimbabwe">Zimbabwe </Option>

                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            <Button
                className={"btnTransparent"} style={{borderColor: '#38BFEF', color: '#38BFEF'}}
                onClick={() => {
                    setVisibleCard(true);
                }}
            >
                <FontAwesomeIcon className={firefox?'':'ml-2'} icon={faPlus}/>  {props.children}
            </Button>
        </>
    );
};

export default withTranslation()(CardForm);
