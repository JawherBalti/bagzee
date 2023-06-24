import React, {Component} from 'react';
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom";
import Seo from "../../hooks/seo";
import Brand from "../profil-partenaire-blocks/profil-blocks/Brand";
import InfoVitrine from "../profil-partenaire-blocks/profil-blocks/InfoVitrine";
import Horaire from "../profil-partenaire-blocks/profil-blocks/Horaires";
import AddActivity from "../profil-partenaire-blocks/profil-blocks/AddActivity";
import UpdateActivity from "../profil-partenaire-blocks/profil-blocks/UpdateActivity";

class Profil extends Component {
    constructor() {
        super();
        this.state = {
            partenaire: {
                photo: '',
                token: '',
                firstName: ''
            },
        };
        window.scrollTo(0, 0);
        let user = JSON.parse(localStorage.getItem('partenaire'))
        if (user) {
            console.log(user)
            this.state.partenaire = user.partenaire
        }
    }

    render() {

        return (
            <div className={"Dashbord profil_blocks Information py-4"}>
                <BrowserRouter>
                    <div className={"container"}>
                        <div className={"row"}>
                            <div className={"col-md-12 pt-5 text-left"}>
                                <ul className={"Navbar_Profil"}>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/photos",
                                            state: {partenaire: this.state.partenaire}
                                        }}>Photos</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/info-vitrine",
                                            state: {partenaire: this.state.partenaire}
                                        }}>Info vitrine</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/activités",
                                            state: {partenaire: this.state.partenaire}
                                        }}>Activités</NavLink>
                                    </li>
                                    <li>
                                        <NavLink activeClassName={"active"} className={"nav-link"} to={{
                                            pathname: "/horaires",
                                            state: {partenaire: this.state.partenaire}
                                        }}>Horaires</NavLink>
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={"container py-5"}>
                        <Route path="/*" render={() => <Seo /* possible prop injection */ />}/>
                        <Switch>
                            <Route exact path="/mon-profil-partenaire" render={(props) => <Brand {...props}/>}/>

                            <Route path="/photos" render={(props) => <Brand {...props}/>}/>
                            <Route path="/info-vitrine" render={(props) => <InfoVitrine {...props}/>}/>
                            <Route path="/activités" render={(props) => <AddActivity {...props}/>}/>
                            <Route path="/horaires" render={(props) => <Horaire {...props}/>}/>
                            <Route path="/update-activite" render={(props) => <UpdateActivity {...props}/>}/>
                            <Route path="/dupliquer-activité" render={(props) => <UpdateActivity {...props}/>}/>
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        )
    }
}

export default Profil;