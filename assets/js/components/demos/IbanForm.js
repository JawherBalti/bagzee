import React, {useState} from "react";
import axios from "axios";
import {Modal} from "antd";
import settings from "../../app";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const script = document.createElement("script");
script.src = 'https://js.stripe.com/v3/';
let strip; // new line
script.onload = function () {
    strip = Stripe(settings.stripe.publishableKey);

};
document.body.appendChild(script);

const IbanForm = (props) => {
    let last4=props.last4
    const [iban, setIban] = useState(last4,'')
    const [disabled, setDisabled] = useState(false)


    const handleSubmit = async event => {
        setDisabled(true)
        event.preventDefault();
        let user = JSON.parse(localStorage.getItem('partenaire'));
        const partenaire = user.partenaire;
        let bankAccount = {
            country: 'FR',
            currency: 'EUR',
            account_holder_type: 'individual',
            account_holder_name: partenaire.lastName + ' ' + partenaire.firstName,
            account_number: iban,
        };

        strip.createToken('bank_account', bankAccount).then((result) => {
           
            axios.post('api/stripe/banque/create', {
                token: result.token.id,
                token_partenaire: token
            }).then(response => {
                setDisabled(false)

                    const modal = Modal.success({
                        content: (
                            <div className={"text-center"}>
                                <LazyLoadImage src={"/images/logo.png"} alt={"bagzee"}  width={'65px'}/>
                                <h4 className={" pt-2"}>
                                   Mon compte IBAN
                                </h4>
                                <p className={"text-success pt-2"}>
                                    {response.data.message}
                                </p>

                            </div>),
                        okText: 'ok',
                    });
                    setTimeout(() => {
                        modal.destroy();
                    }, 5000);

            })

        });

    };
    let user = JSON.parse(localStorage.getItem('partenaire'));
    const token = user.partenaire.token
    return (
        <>
            <div className={"row mb-3"}>
                <div className={"col-md-3"}>
                    <label className={"requis centrage-y"}>IBAN</label>
                </div>
                <div className={"col-md-9"}>
                    <input type={'text'} className={'mb-3'} value={iban} placeholder={'Enter votre code IBAN'} onFocus={() => {
                        setIban('')
                    }}
                           onChange={(event) => {
                               setIban(event.target.value);
                           }}/>

                </div>
            </div>
            <button onClick={handleSubmit} className={disabled?'btn-blue float-right disabled':'btn-blue float-right'}>
                <svg className={'mr-2'} xmlns="http://www.w3.org/2000/svg" width="10.455" height="15"
                     viewBox="0 0 10.455 15">
                    <g id="XMLID_504_" transform="translate(-50)">
                        <path id="XMLID_505_"
                              d="M50.682,15h9.091a.682.682,0,0,0,.682-.682V6.591a.682.682,0,0,0-.682-.682h-.682V3.864a3.864,3.864,0,0,0-7.727,0V5.909h-.682A.682.682,0,0,0,50,6.591v7.727A.682.682,0,0,0,50.682,15Zm6.476-5.029L55.226,11.9a.682.682,0,0,1-.964,0l-.966-.966a.682.682,0,1,1,.964-.964l.484.484,1.45-1.45a.682.682,0,1,1,.964.964ZM52.727,3.864a2.5,2.5,0,0,1,5,0V5.909h-5Z"
                              fill="#fff"/>
                    </g>
                </svg>
                {disabled?<>Valider <span className="fa fa-spin fa-spinner "> </span></>:'Valider'}
            </button>
        </>
    );
};

export default IbanForm;
