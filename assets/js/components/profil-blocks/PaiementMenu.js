import React, {Component} from 'react';
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom";
import Seo from "../../hooks/seo";
import Paiement from "./sousMenu/Paiement";
import Compte from "./sousMenu/Compte";
import {withTranslation} from "react-i18next";


class PaiementMenu extends Component {
    constructor() {
        super();
        this.state = {


        };
        window.scrollTo(0, 0);
    }




    render() {
        const { t } = this.props;

        return (
            <div className={"Dashbord profil_blocks Information py-4"}>
                <BrowserRouter>
                    <div className={"container"}>
                        <div className={"row"}>
                            <div className={"col-md-12 pt-2 text-left"}>
                                <ul className={"Navbar_Profil"}>

                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/moyen-paiement",
                                        }}>{t('mes_cartes')}
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/mon-compte",
                                        }}>{t('mon_compte')}
                                        </NavLink>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={"container"} style={{border: 'none'}}>
                        <Route path="/*" render={() => <Seo /* possible prop injection */ />}/>
                        <Switch>
                            <Route path="/moyen-paiement" render={(props) => <Paiement {...props}/>}/>
                            <Route path="/mon-compte" render={(props) => <Compte {...props}/>}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default withTranslation()(PaiementMenu);