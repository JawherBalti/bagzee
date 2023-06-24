import React, {Component} from 'react';
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom";
import Seo from "../../hooks/seo";
import Informations from "./sousMenu/Informations";
import MesDocuments from "./sousMenu/MesDocuments";
import BagagesVehicule from "./sousMenu/BagagesVehicule";
import Alertes from "./sousMenu/Alertes";
import PaiementMenu from "./PaiementMenu";
import {withTranslation} from "react-i18next";


class Profil extends Component {
    constructor() {
        super();
        this.state = {
        };
        window.scrollTo(0, 0);

    }

    render() {
        const { t } = this.props;

        return (
            <div className={"Dashbord profil_blocks Information py-4"} >
                <BrowserRouter>
                    <div className={"container"}>
                        <div className={"row"}>
                            <div className={"col-md-12 pt-2 text-left"}>
                                <ul className={"Navbar_Profil"}>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/informations",
                                        }}>{t('mes_informations')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/mes-documents",
                                        }}>{t('mes_documents')} </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"}
                                                 to={{pathname: "/moyen-paiement"}}>{t('moyens_paiements')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"}
                                                 to={{pathname: "/mes-bagages-mon-vehicule"}}>{t('bagages_vehicule')}</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"}
                                                 to={{pathname: "/mes-alertes"}}>{t('mes_alertes')}</NavLink>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={"container py-5"}  style={{border:'none'}}>
                        <Route path="/*" render={() => <Seo /* possible prop injection */ />}/>
                        <Switch>
                            <Route path="/informations" render={(props) => <Informations {...props}/>}/>
                            <Route path="/mes-documents" render={(props) => <MesDocuments {...props}/>}/>
                            <Route path="/(moyen-paiement|mon-compte)/" render={(props) => <PaiementMenu {...props}/>}/>
                            <Route path="/mes-bagages-mon-vehicule" render={(props) => <BagagesVehicule {...props}/>}/>
                            <Route path="/mes-alertes" render={(props) => <Alertes {...props}/>}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default withTranslation()(Profil);