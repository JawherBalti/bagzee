import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import "../css/app.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfilClient from "./components/ProfilClient";
import VitrinePartenaire from "./components/VitrinePartenaire";
import Seo from "./hooks/seo";
import ProfilPartenaire from "./components/ProfilPartenaire";
import DetailActivity from "./components/DetailActivity";
import Page404 from "./components/Page404";
import ForgetPassword from "./components/ForgetPassword";
import PageCookies from "./components/regles-toog/PageCookies";
import LandingPage from "./components/LandingPage";
import ValidNewPassword from "./components/ValidNewPassword";
import subscribeVille from "./components/subscribeVille";
import PagePolitiqueConfiden from "./components/regles-toog/PagePolitiqueConfiden";
import PageSecurite from "./components/regles-toog/PageSecurite";
import PageCGU from "./components/regles-toog/PageCGU";
import PageCGV from "./components/regles-toog/PageCGV";
import PageMentionsLegales from "./components/regles-toog/PageMentionsLegales";
import PageEquipe from "./components/regles-toog/PageEquipe";
import PageContact from "./components/regles-toog/PageContact";
import TchatGroup from "./components/profil-blocks/TchatGroup";
import PourquoiBagzee from "./components/PourquoiBagzee";
import Faqs from "./components/Faqs";
import "./i18n";
import CommentCaMarche from "./components/CommentCaMarche";
import ConfierBagage from "./components/ConfierBagage";
import PorterBagage from "./components/PorterBagage";
import Etape1 from "./components/circuit_deposer_annonces/Etape1";
import ConfierLieuDepot from "./components/circuit_deposer_annonces/ConfierLieuDepot";
import PorterLieuRetrait from "./components/circuit_deposer_annonces/PorterLieuRetrait";
import RecapAnnonceConfierBagage from "./components/RecapAnnonceConfierBagage";
import RecapAnnonceDemandeConfierBagage from "./components/RecapAnnonceDemandeConfierBagage";
import RecapAnnoncePorterBagage from "./components/RecapAnnoncePorterBagage";
import { ChatContextProvider } from "./components/chatComponents/ChatContext";
import { AuthContextProvider } from "./components/chatComponents/AuthContext";
import PartenairesPointsRelais from "./components/PartenairesPointsRelais";
import Login from "./components/Login";
import Avis from "./components/profil-blocks/Avis";

const settings = {
  stripe: {
    //publishableKey: "pk_live_51Jm0pOIC3PjkyPuyFGyqbGSkF4jtyd9JBslQPc7Xv7BfuGAzdynCepoe74qxTNav2Y5vFxtImeccE46DOQ1RgoP600FbnTS9tn"
    publishableKey:
      "pk_test_51MRzMXKP8NeruhvKxTdYpcAsjpOECwEh46eM933XhFxwHIc9BoqgDmcsRCiPO3ruSmnk3dwt9Nca1ls8u8bcEqK800iGQDnE4E",
  },
};

export default settings;
export const user = JSON.parse(localStorage.getItem("client"));

ReactDOM.render(
  <>
    <AuthContextProvider>
      <ChatContextProvider>
        <Suspense
          fallback={
            <p className={"text-center my-5"}>
              <span className="fa fa-spin fa-spinner fa-4x" />
            </p>
          }
        >
          <Router>
            <Route
              path="/*"
              render={(props) => (
                <Seo {...props} /* possible prop injection */ />
              )}
            />

            <Switch>
              
              <Route
                exact
                path="/"
                render={(props) => <LandingPage {...props} />}
              />
              <Route
                exact
                path="/mes-avis-:name-:id"
                render={(props) => <Avis {...props} />}
              />
              <Route
                path="/deposer-annonce"
                render={(props) => <Etape1 {...props} />}
              />
              <Route
                path="/inscription"
                render={(props) => <Login {...props} />}
              />
              <Route
                path="/confier-bagage"
                render={(props) => <ConfierBagage {...props} />}
              />
              <Route
                path="/porter-bagage"
                render={(props) => <PorterBagage {...props} />}
              />
              <Route
                path="/(demande-liste-proprietaire|demande-liste-porteur|profil|mes-avis|horaires|annonces|reservations-paiements|offre|mon-compte|informations|mes-documents|mes-bagages-mon-vehicule|mes-alertes|moyen-paiement|mon-statut|tchat-group)/"
                render={(props) => <ProfilClient {...props} />}
              />
              <Route
                path="/recapitulatif-annonce"
                render={(props) => <RecapAnnonceConfierBagage {...props} />}
              />
              <Route
                path="/recapitulatif-demande-annonce-:id"
                render={(props) => <RecapAnnonceDemandeConfierBagage {...props} />}
              />
              <Route
                path="/recapitulatif-annonce-porter-:id"
                render={(props) => <RecapAnnoncePorterBagage {...props} />}
              />
              <Route
                path="/modifier-recapitulatif-annonce-porter-:id"
                render={(props) => <RecapAnnoncePorterBagage {...props} />}
              />
              <Route
                path="/confier-lieu-depot"
                render={(props) => <ConfierLieuDepot {...props} />}
              />
              <Route
                path="/porter-lieu-retrait"
                render={(props) => <PorterLieuRetrait {...props} />}
              />
              <Route
                path="/cookies"
                render={(props) => <PageCookies {...props} />}
              />
              <Route
                path="/mot-de-passe-oublie"
                render={(props) => <ForgetPassword {...props} />}
              />
              <Route path="/faq" render={(props) => <Faqs {...props} />} />
              <Route
                path="/comment-ca-marche"
                render={(props) => <CommentCaMarche {...props} />}
              />
              <Route
                path="/pourquoi-bagzee"
                render={(props) => <PourquoiBagzee {...props} />}
              />
              <Route
                path="/conditions-generales-de-vente"
                render={(props) => <PageCGV {...props} />}
              />
              <Route
                path="/conditions-generales-utilisation"
                render={(props) => <PageCGU {...props} />}
              />
              <Route
                path="/contact"
                render={(props) => <PageContact {...props} />}
              />
              {/*<Route path="/mentions-legales" render={(props) => <PageMentionsLegales {...props}/>}/>*/}
              <Route
                path="/securite"
                render={(props) => <PageSecurite {...props} />}
              />
              <Route
                path="/equipe"
                render={(props) => <PageEquipe {...props} />}
              />
              <Route
                path="/politique-de-confidentialite"
                component={PagePolitiqueConfiden}
              />
              <Route
                path="/(update-activite-:id|dupliquer-activite-:id|photos|horaires|info-vitrine|activités|profil-partenaire|dashbord-partenaire|evenement-partenaire|mon-profil-partenaire|informations-partenaire|contact-partenaire)/"
                render={(props) => <ProfilPartenaire {...props} />}
              />
              <Route
                path="/Login-ville"
                component={subscribeVille}
                render={(props) => <subscribeVille {...props} />}
              />
              <Route
                path="/vitrine-:nomStructure-:ville-:id"
                render={(props) => <VitrinePartenaire {...props} />}
              />
              <Route
                path="/detail-activite-:nomAct-:id"
                render={(props) => <DetailActivity {...props} />}
              />
              <Route
                path="/valider-nouveau-mot-de-passe-:token"
                render={(props) => <ValidNewPassword {...props} />}
              />
              <Route
                path="/tchat-group"
                render={(props) => <TchatGroup {...props} />}
              />
              <Route
                path="/partenaires-points-relais"
                render={(props) => <PartenairesPointsRelais {...props} />}
              />
              <Route
                path={"*"}
                component={Page404}
                render={(props) => <Page404 {...props} />}
              />
            </Switch>
          </Router>
        </Suspense>
      </ChatContextProvider>
    </AuthContextProvider>
  </>,
  document.getElementById("root")
);
