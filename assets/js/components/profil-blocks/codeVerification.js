import React from 'react';
import {useState} from "react";
import ReactInputVerificationCode from "react-verification-code-input"


const codeVerification =()=> {

        const [value, setValue] = useState("");
        const [isInvalid, setIsInvalid] = useState(false);
        const [error, setError] = useState(null);
        const [seconds, setSeconds] = useState(null);
        return (
            <div>
                <div className={isInvalid ?'isInvalid styledInputReactVerCode' :'styledInputReactVerCode'}>
                    <ReactInputVerificationCode
                        value={value}
                        placeholder={''}
                        length={5}
                        onChange={(newValue) => {
                            setValue(newValue);

                            if (newValue !== "") {
                                setError(null);
                            }
                        }}
                    />
                </div>

                {error && <div className={'StyledError'} >{error}</div>}

                {seconds && (
                    <div className={'StyledSeconds'} >{`Verification code has been re-sent (${seconds}s)`}</div>
                )}

                <button className={'btn-blue'}
                    onClick={() => {
                        setValue("");
                        setError("Incorrect code. Please try again");
                        setIsInvalid(true);
                        setSeconds(60);
                        let mySeconds = 60;
                        const intervalId = setInterval(() => {
                            mySeconds = mySeconds - 1;
                            setSeconds(mySeconds);

                            if (mySeconds === 0) {
                                clearInterval(intervalId);
                                setSeconds(null);
                            }
                        }, 1000);

                        setTimeout(() => {
                            setIsInvalid(false);
                        }, 1000);
                    }}
                >
                    Send
                </button>
            </div>
        )
}

export default codeVerification;