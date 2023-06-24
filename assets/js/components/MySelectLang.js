import React from "react";
import {useTranslation} from "react-i18next";

const MySelectLang = (props) => {
    const { t, i18n } = useTranslation();
    const handleChange=(e)=>{
        console.log(e.target.value)
        i18n.changeLanguage(e.target.value);
    }
    return (
        <><select name={"lang"} key={Math.random()+"lang"}
                onChange={handleChange}>
            {props.children.map(lang =>
                <option key={lang.id} value={lang.name}>{lang.name}</option>
            )}
        </select>
        </>
    )
}
export default MySelectLang;