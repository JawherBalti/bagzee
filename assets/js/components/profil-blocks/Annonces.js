import React, { Component, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faEye,
  faFile,
  faFileAlt,
  faLock,
  faMapMarker,
  faPhone,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
} from "antd";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { withTranslation, Trans } from "react-i18next";
import { createFilter } from "react-search-input";
import locale from "antd/es/date-picker/locale/fr_FR";
import { messageService } from "../../lib/Services";

const KEYS_TO_FILTERSA = ["dateDepart"];
import { Rating } from "react-simple-star-rating";
import { user } from "../../app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../hooks/firebase";
import { AuthContext } from "../chatComponents/AuthContext";

class Annonces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPorteur: props.location.state
        ? props.location.state.role
          ? false
          : true
        : true,
      statusName: props.location.state?.statusName
        ? props.location.state?.statusName
        : props.t("page_annonce.ann_enAttente"),
      status: props.location.state?.status
        ? props.location.state.status.toString()
        : "0",
      rating: {
        etatBagage: 0,
        respectSecurite: 0,
        ponctualite: 0,
        courtoisie: 0,
        descAvis: "",
      },
      mesInfoAvis: {
        rapidite: 4,
        securite: 4,
        ponctualite: 2,
        courtoisie: 4,
        total: 4,
        nbrAvis: 25,
      },
      client: {},
      annonces: [],
      searchTerm: "",
      loading: true,
    };
    this.handleChange = this.handleChange.bind(this);

    /*
        Mes annoces en attente ==> draft -> client peut modifier ou deposer //status 0
         Mes annonces en cours ==> annonces publiées mais pas réserver // status 1
         ------------------------------------------------------------------
          Mes demandes de réservations en attente ==> attente validation porteur //status 0
         Mes réservations en cours ==> réserver un porteur / après paiement //status 1
         Mes réservations passées ==> terminées //status 2
         */
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (
      this.state.statusName ==
      this.props.t("page_annonce.reservation_demande_enAttente")
    ) {
      this.getReservation();
    } else {
      this.getAnnonces();
    }
  }

  getAnnonces() {
    if (user)
      this.setState({ client: user.client }, () => {
        axios.get(`api/avis/info?id=` + this.state.client.id).then((res) => {
          this.setState({ mesInfoAvis: res.data.mesInfoAvis });
        });
        this.state.isPorteur
          ? axios
              .post(`api/profil/baggagistes`, {
                status: this.state.status,
                token: this.state.client.token,
              })
              .then((baggagite) => {
                this.setState({
                  annonces: baggagite.data.baggagistes,
                  loading: false,
                });
              })
          : axios
              .post(`api/profil/adverts`, {
                status: this.state.status,
                token: this.state.client.token,
              })
              .then((advert) => {
                console.log(this.state.statusName);
                console.log(this.state.status);
                this.setState(
                  { annonces: advert.data.adverts, loading: false },
                  () => {
                    console.log(this.state.annonces);
                  }
                );
              });
      });
  }

  getReservation() {
    let user = JSON.parse(localStorage.getItem("client"));
    if (user)
      this.setState({ client: user.client }, () => {
        this.state.isPorteur
          ? axios
              .post(`api/baggagite/query/list/all`, {
                status: this.state.status,
                token: this.state.client.token,
              })
              .then((baggagite) => {
                this.setState({
                  annonces: baggagite.data.baggistes,
                  loading: false,
                });
              })
          : axios
              .post(`api/advert/query/list/all`, {
                status: this.state.status,
                token: this.state.client.token,
              })
              .then((advert) => {
                console.log(this.state.statusName);
                console.log(this.state.status);
                this.setState({
                  annonces: advert.data.adverts,
                  loading: false,
                });
              });
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState((prev) => ({
      rating: {
        ...prev.rating,
        descAvis: value,
      },
    }));
  }

  render() {
    const CombinerChat = ({ emailClient, orderInfo }) => {
      const { currentUser } = useContext(AuthContext);
      return (
        <button
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
                await setDoc(doc(db, "chats", combinedId), { messages: [] });

                //create user chats
                await updateDoc(doc(db, "userChats", currentUser.uid), {
                  [combinedId + ".userInfo"]: {
                    uid: myUser.uid,
                    displayName: myUser.displayName,
                    photoURL: myUser.photoURL
                      ? myUser.photoURL
                      : "/images/avatar-person.png",
                  },
                  [combinedId + ".date"]: serverTimestamp(),
                });

                await updateDoc(doc(db, "userChats", myUser.uid), {
                  [combinedId + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                      ? currentUser.photoURL
                      : "/images/avatar-person.png",
                  },
                  [combinedId + ".date"]: serverTimestamp(),
                });

                this.setState({ myUser: myUser, orderInfo }, () => {
                  this.setState({ redirectChat: true });
                });
              } else {
                this.setState({ myUser: myUser, orderInfo }, () => {
                  this.setState({ redirectChat: true });
                });
              }
            } catch (err) {
              console.log(err);
            }
          }}
          className={"btnBlue myBtn"}
        >
          {!this.state.isPorteur
            ? t("page_annonce.contacter_porteur")
            : t("page_annonce.contacter_proprietaire")}
        </button>
      );
    };
    const CollectionCreateFormProcuration = ({
      visibleProcuration,
      onCreateProcuration,
      onCancelProcuration,
    }) => {
      const [form] = Form.useForm();

      const onFinish = (values) => {
        console.log("Received values of form: ", values);
      };

      return (
        <Modal
          open={visibleProcuration}
          onCancel={onCancelProcuration}
          key={"Procuration-Detail-" + Math.random()}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onCreateProcuration(values);
              })
              .catch((info) => {
                console.log("Ooops !! Validate Failed:", info);
              });
          }}
          footer={[
            <Button
              key="submit"
              className={"btnBlue"}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    onCreateProcuration(values);
                  })
                  .catch((info) => {
                    console.log("Ooops !! Validate Failed:", info);
                  });
              }}
            >
              {t("page_annonce.genererDocument")}
            </Button>,
          ]}
        >
          <Form
            form={form}
            name={"register_detail" + Math.random()}
            onFinish={onFinish}
            scrollToFirstError
            requiredMark={false}
          >
            <Form.Item
              name="lastName"
              label={<span>Nom</span>}
              rules={[
                {
                  required: true,
                  message: "Nom de famille ne doit pas être vide!",
                  whitespace: true,
                },
              ]}
              hasFeedback
              className={"d-inline-block col-6 pl-0"}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="firstName"
              label={<span>Prénom</span>}
              rules={[
                {
                  required: true,
                  message: "Prénom ne doit pas être vide!",
                  whitespace: true,
                },
              ]}
              hasFeedback
              className={"d-inline-block col-6 pr-0"}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Téléphone"
              rules={[
                {
                  required: true,
                  message: "Numéro de téléphone ne doit pas être vide!",
                },
                {
                  pattern: "^((06)|(07))[0-9]{8}$",
                  message:
                    "Numéro de téléphone doit être à 10 chiffres et commencer par 06 ou 07",
                },
              ]}
              hasFeedback
              className={"d-inline-block col-6 pl-0"}
            >
              <Input
                type="tel"
                minLength={10}
                maxLength={10}
                placeholder={"0600000000"}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail bénéficiaire"
              rules={[
                {
                  type: "email",
                  message: "Votre email n'est pas valide !",
                },
                {
                  required: true,
                  message: "Email ne doit pas être vide!",
                },
              ]}
              hasFeedback
              className={"d-inline-block col-6 pr-0"}
            >
              <Input type={"email"} />
            </Form.Item>
            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[
                {
                  required: true,
                  message: "Adresse ne doit pas être vide!",
                },
              ]}
              hasFeedback
            >
              <Input type={"text"} />
            </Form.Item>
            <Form.Item
              name="zip"
              label="Code postal"
              rules={[
                {
                  required: true,
                  message: "Code postal ne doit pas être vide!",
                },
              ]}
              hasFeedback
              className={"d-inline-block col-6 pl-0"}
            >
              <Input type={"text"} />
            </Form.Item>
            <Form.Item
              name="ville"
              label="ville"
              initialValue={"lyon"}
              className={"d-inline-block col-6 pr-0"}
              rules={[
                {
                  required: true,
                  message: "ville ne doit pas être vide!",
                },
              ]}
              hasFeedback
            >
              <Select
                name="villes"
                defaultValue="agen"
                style={{
                  borderRadius: 50,
                  padding: "6px 10px",
                  height: "auto",
                }}
              >
                <Option key={"ville-" + Math.random()} value="bourg">
                  01 - Bourg-en-Bresse
                </Option>
                <Option key={"ville-" + Math.random()} value="laon">
                  02 - Laon
                </Option>
                <Option key={"ville-" + Math.random()} value="saintQuentin">
                  02 - Saint-Quentin
                </Option>
                <Option key={"ville-" + Math.random()} value="soissons">
                  02 - Soissons
                </Option>
                <Option key={"ville-" + Math.random()} value="moulins">
                  03 - Moulins
                </Option>
                <Option key={"ville-" + Math.random()} value="montluçon">
                  03 - Montluçon
                </Option>
                <Option key={"ville-" + Math.random()} value="vichy">
                  03 - Vichy
                </Option>
                <Option key={"ville-" + Math.random()} value="digne">
                  04 - Digne-les-Bains
                </Option>
                <Option key={"ville-" + Math.random()} value="gap">
                  05 - Gap
                </Option>
                <Option key={"ville-" + Math.random()} value="nice">
                  06 - Nice
                </Option>
                <Option key={"ville-" + Math.random()} value="privas">
                  07 - Privas
                </Option>
                <Option key={"ville-" + Math.random()} value="charleville">
                  08 - Charleville-Mézières
                </Option>
                <Option key={"ville-" + Math.random()} value="foix">
                  09 - Foix
                </Option>
                <Option key={"ville-" + Math.random()} value="troyes">
                  10 - Troyes
                </Option>
                <Option key={"ville-" + Math.random()} value="carcassonne">
                  11 - Carcassonne
                </Option>
                <Option key={"ville-" + Math.random()} value="narbonne">
                  11 - Narbonne
                </Option>
                <Option key={"ville-" + Math.random()} value="rodez">
                  12 - Rodez
                </Option>
                <Option key={"ville-" + Math.random()} value="marseille">
                  13 - Marseille
                </Option>
                <Option key={"ville-" + Math.random()} value="aix">
                  13 - Aix-en-Provence
                </Option>
                <Option key={"ville-" + Math.random()} value="arles">
                  13 - Arles
                </Option>
                <Option key={"ville-" + Math.random()} value="bayeux">
                  14 - Bayeux
                </Option>
                <Option key={"ville-" + Math.random()} value="caen">
                  14 - Caen
                </Option>
                <Option key={"ville-" + Math.random()} value="aurillac">
                  15 - Aurillac
                </Option>
                <Option key={"ville-" + Math.random()} value="angouleme">
                  16 - Angoulême
                </Option>
                <Option key={"ville-" + Math.random()} value="cognac">
                  16 - Cognac
                </Option>
                <Option key={"ville-" + Math.random()} value="larochelle">
                  17 - La Rochelle
                </Option>
                <Option key={"ville-" + Math.random()} value="saintes">
                  17 - Saintes
                </Option>
                <Option key={"ville-" + Math.random()} value="bourges">
                  18 - Bourges
                </Option>
                <Option key={"ville-" + Math.random()} value="tulle">
                  19 - Tulle
                </Option>
                <Option key={"ville-" + Math.random()} value="brive">
                  19 - Brive
                </Option>
                <Option key={"ville-" + Math.random()} value="ajaccio">
                  2A - Ajaccio
                </Option>
                <Option key={"ville-" + Math.random()} value="bastia">
                  2B - Bastia
                </Option>
                <Option key={"ville-" + Math.random()} value="dijon">
                  21 - Dijon
                </Option>
                <Option key={"ville-" + Math.random()} value="beaune">
                  21 - Beaune
                </Option>
                <Option key={"ville-" + Math.random()} value="saintbrieuc">
                  22 - Saint-Brieuc
                </Option>
                <Option key={"ville-" + Math.random()} value="guingamp">
                  22 - Guingamp
                </Option>
                <Option key={"ville-" + Math.random()} value="gueret">
                  23 - Guéret
                </Option>
                <Option key={"ville-" + Math.random()} value="perigueux">
                  24 - Périgueux
                </Option>
                <Option key={"ville-" + Math.random()} value="bergerac">
                  24 - Bergerac
                </Option>
                <Option key={"ville-" + Math.random()} value="besancon">
                  25 - Besançon
                </Option>
                <Option key={"ville-" + Math.random()} value="montbeliard">
                  25 - Montbéliard
                </Option>
                <Option key={"ville-" + Math.random()} value="lille">
                  26 - Valence
                </Option>
                <Option key={"ville-" + Math.random()} value="evreux">
                  27 - Evreux
                </Option>
                <Option key={"ville-" + Math.random()} value="chartres">
                  28 - Chartres
                </Option>
                <Option key={"ville-" + Math.random()} value="brest">
                  29 - Brest
                </Option>
                <Option key={"ville-" + Math.random()} value="quimper">
                  29 - Quimper
                </Option>
                <Option key={"ville-" + Math.random()} value="nimes">
                  30 - Nîmes
                </Option>
                <Option key={"ville-" + Math.random()} value="toulouse">
                  31 - Toulouse
                </Option>
                <Option key={"ville-" + Math.random()} value="auch">
                  32 - Auch
                </Option>
                <Option key={"ville-" + Math.random()} value="bordeaux">
                  33 - Bordeaux
                </Option>
                <Option key={"ville-" + Math.random()} value="libourne">
                  33 - Libourne
                </Option>
                <Option key={"ville-" + Math.random()} value="beziers">
                  34 - Béziers
                </Option>
                <Option key={"ville-" + Math.random()} value="montpellier">
                  34 - Montpellier
                </Option>
                <Option key={"ville-" + Math.random()} value="rennes">
                  35 - Rennes
                </Option>
                <Option key={"ville-" + Math.random()} value="saintmalo">
                  35 - Saint-Malo
                </Option>
                <Option key={"ville-" + Math.random()} value="chateauroux">
                  36 - Châteauroux
                </Option>
                <Option key={"ville-" + Math.random()} value="tours">
                  37 - Tours
                </Option>
                <Option key={"ville-" + Math.random()} value="grenoble">
                  38 - Grenoble
                </Option>
                <Option key={"ville-" + Math.random()} value="lons">
                  39 - Lons-le-Saunier
                </Option>
                <Option key={"ville-" + Math.random()} value="dole">
                  39 - Dole
                </Option>
                <Option key={"ville-" + Math.random()} value="montdemarsan">
                  40 - Mont-de-Marsan
                </Option>
                <Option key={"ville-" + Math.random()} value="dax">
                  40 - Dax
                </Option>
                <Option key={"ville-" + Math.random()} value="blois">
                  41 - Blois
                </Option>
                <Option key={"ville-" + Math.random()} value="romorantin">
                  41 - Romorantin-Lanthenay
                </Option>
                <Option key={"ville-" + Math.random()} value="saintetienne">
                  42 - Saint-Etienne
                </Option>
                <Option key={"ville-" + Math.random()} value="Montbrison">
                  42 - Montbrison
                </Option>
                <Option key={"ville-" + Math.random()} value="brioude">
                  43 - Brioude
                </Option>
                <Option key={"ville-" + Math.random()} value="lepuyenvelay">
                  43 - Le Puy-en-Velay
                </Option>
                <Option key={"ville-" + Math.random()} value="nantes">
                  44 - Nantes
                </Option>
                <Option key={"ville-" + Math.random()} value="saintnazaire">
                  44 - Saint-Nazaire
                </Option>
                <Option key={"ville-" + Math.random()} value="orleans">
                  45 - Orléans
                </Option>
                <Option key={"ville-" + Math.random()} value="montargis">
                  45 - Montargis
                </Option>
                <Option key={"ville-" + Math.random()} value="cahors">
                  46 - Cahors
                </Option>
                <Option key={"ville-" + Math.random()} value="agen">
                  47 - Agen
                </Option>
                <Option key={"ville-" + Math.random()} value="mende">
                  48 - Mende
                </Option>
                <Option key={"ville-" + Math.random()} value="angers">
                  49 - Angers
                </Option>
                <Option key={"ville-" + Math.random()} value="cholet">
                  49 - Cholet
                </Option>
                <Option key={"ville-" + Math.random()} value="saintlo">
                  50 - Saint-Lô
                </Option>
                <Option key={"ville-" + Math.random()} value="cherbourg">
                  50 - Cherbourg
                </Option>
                <Option key={"ville-" + Math.random()} value="chalons">
                  51 - Châlons-en-Champagne
                </Option>
                <Option key={"ville-" + Math.random()} value="reims">
                  51 - Reims
                </Option>
                <Option key={"ville-" + Math.random()} value="chaumont">
                  52 - Chaumont
                </Option>
                <Option key={"ville-" + Math.random()} value="saintDizier">
                  52 - Saint-Dizier
                </Option>
                <Option key={"ville-" + Math.random()} value="laval">
                  53 - Laval
                </Option>
                <Option key={"ville-" + Math.random()} value="mayenne">
                  53 - Mayenne
                </Option>
                <Option key={"ville-" + Math.random()} value="nancy">
                  54 - Nancy
                </Option>
                <Option key={"ville-" + Math.random()} value="barleduc">
                  55 - Bar-le-Duc
                </Option>
                <Option key={"ville-" + Math.random()} value="lorient">
                  56 - Lorient
                </Option>
                <Option key={"ville-" + Math.random()} value="pontivy">
                  56 - Pontivy
                </Option>
                <Option key={"ville-" + Math.random()} value="vannes">
                  56 - Vannes
                </Option>
                <Option key={"ville-" + Math.random()} value="metz">
                  57 - Metz
                </Option>
                <Option key={"ville-" + Math.random()} value="nevers">
                  58 - Nevers
                </Option>
                <Option key={"ville-" + Math.random()} value="dunkerque">
                  59 - Dunkerque
                </Option>
                <Option key={"ville-" + Math.random()} value="lille">
                  59 - Lille
                </Option>
                <Option key={"ville-" + Math.random()} value="valenciennes">
                  59 - Valenciennes
                </Option>
                <Option key={"ville-" + Math.random()} value="beauvais">
                  60 - Beauvais
                </Option>
                <Option key={"ville-" + Math.random()} value="alencon">
                  61 - Alençon
                </Option>
                <Option key={"ville-" + Math.random()} value="arras">
                  62 - Arras
                </Option>
                <Option key={"ville-" + Math.random()} value="boulognesurmer">
                  62 - Boulogne-sur-Mer
                </Option>
                <Option key={"ville-" + Math.random()} value="calais">
                  62 - Calais
                </Option>
                <Option key={"ville-" + Math.random()} value="Lens">
                  62 - Lens
                </Option>
                <Option key={"ville-" + Math.random()} value="letouquet">
                  62 - Le Touquet
                </Option>
                <Option key={"ville-" + Math.random()} value="clermont">
                  63 - Clermont-Ferrand
                </Option>
                <Option key={"ville-" + Math.random()} value="bayonne">
                  64 - Bayonne
                </Option>
                <Option key={"ville-" + Math.random()} value="biarritz">
                  64 - Biarritz
                </Option>
                <Option key={"ville-" + Math.random()} value="pau">
                  64 - Pau
                </Option>
                <Option key={"ville-" + Math.random()} value="tarbes">
                  65 - Tarbes
                </Option>
                <Option key={"ville-" + Math.random()} value="perpignan">
                  66 - Perpignan
                </Option>
                <Option key={"ville-" + Math.random()} value="strasbourg">
                  67 - Strasbourg
                </Option>
                <Option key={"ville-" + Math.random()} value="colmar">
                  68 - Colmar
                </Option>
                <Option key={"ville-" + Math.random()} value="mulhouse">
                  68 - Mulhouse
                </Option>
                <Option key={"ville-" + Math.random()} value="lyon">
                  69 - Lyon
                </Option>
                <Option key={"ville-" + Math.random()} value="vesoul">
                  70 - Vesoul
                </Option>
                <Option key={"ville-" + Math.random()} value="chalonsursaone">
                  71 - Chalon-sur-Saône
                </Option>
                <Option key={"ville-" + Math.random()} value="macon">
                  71 - Mâcon
                </Option>
                <Option key={"ville-" + Math.random()} value="lafleche">
                  72 - La Flèche
                </Option>
                <Option key={"ville-" + Math.random()} value="lemans">
                  72 - Le Mans
                </Option>
                <Option key={"ville-" + Math.random()} value="chambery">
                  73 - Chambéry
                </Option>
                <Option key={"ville-" + Math.random()} value="annecy">
                  74 - Annecy
                </Option>
                <Option key={"ville-" + Math.random()} value="paris">
                  75 - Paris
                </Option>
                <Option key={"ville-" + Math.random()} value="lehavre">
                  76 - Le Havre
                </Option>
                <Option key={"ville-" + Math.random()} value="rouen">
                  76 - Rouen
                </Option>
                <Option key={"ville-" + Math.random()} value="melun">
                  77 - Melun
                </Option>
                <Option key={"ville-" + Math.random()} value="versailles">
                  78 - Versailles
                </Option>
                <Option key={"ville-" + Math.random()} value="niort">
                  79 - Niort
                </Option>
                <Option key={"ville-" + Math.random()} value="amiens">
                  80 - Amiens
                </Option>
                <Option key={"ville-" + Math.random()} value="albi">
                  81 - Albi
                </Option>
                <Option key={"ville-" + Math.random()} value="castres">
                  81 - Castres
                </Option>
                <Option key={"ville-" + Math.random()} value="montauban">
                  82 - Montauban
                </Option>
                <Option key={"ville-" + Math.random()} value="brignoles">
                  83 - Brignoles
                </Option>
                <Option key={"ville-" + Math.random()} value="draguignan">
                  83 - Draguignan
                </Option>
                <Option key={"ville-" + Math.random()} value="toulon">
                  83 - Toulon
                </Option>
                <Option key={"ville-" + Math.random()} value="avignon">
                  84 - Avignon
                </Option>
                <Option key={"ville-" + Math.random()} value="larochesuryon">
                  85 - La-Roche-sur-Yon
                </Option>
                <Option key={"ville-" + Math.random()} value="lessablesdolonne">
                  85 - Les Sables-d'Olonne
                </Option>
                <Option key={"ville-" + Math.random()} value="poitiers">
                  86 - Poitiers
                </Option>
                <Option key={"ville-" + Math.random()} value="limoges">
                  87 - Limoges
                </Option>
                <Option key={"ville-" + Math.random()} value="epinal">
                  88 - Epinal
                </Option>
                <Option key={"ville-" + Math.random()} value="auxerre">
                  89 - Auxerre
                </Option>
                <Option key={"ville-" + Math.random()} value="belfort">
                  90 - Belfort
                </Option>
                <Option key={"ville-" + Math.random()} value="etampes">
                  91 - Étampes
                </Option>
                <Option key={"ville-" + Math.random()} value="evry">
                  91 - Evry
                </Option>
                <Option key={"ville-" + Math.random()} value="antony">
                  92 - Antony
                </Option>
                <Option
                  key={"ville-" + Math.random()}
                  value="boulognebillancourt"
                >
                  92 - Boulogne-Billancourt
                </Option>
                <Option key={"ville-" + Math.random()} value="nanterre">
                  92 - Nanterre
                </Option>
                <Option key={"ville-" + Math.random()} value="bobigny">
                  93 - Bobigny
                </Option>
                <Option key={"ville-" + Math.random()} value="leraincy">
                  93 - Le Raincy
                </Option>
                <Option key={"ville-" + Math.random()} value="saintdenis">
                  93 - Saint-Denis
                </Option>
                <Option key={"ville-" + Math.random()} value="creteil">
                  94 - Créteil
                </Option>
                <Option key={"ville-" + Math.random()} value="cergy">
                  95 - Cergy
                </Option>
                <Option key={"ville-" + Math.random()} value="pontoise">
                  95 - Pontoise
                </Option>
                <Option key={"ville-" + Math.random()} value="basseterre">
                  971 - Basse-Terre
                </Option>
                <Option key={"ville-" + Math.random()} value="fortdefrance">
                  972 - Fort-de-France
                </Option>
                <Option key={"ville-" + Math.random()} value="cayenne">
                  973 - Cayenne
                </Option>
                <Option key={"ville-" + Math.random()} value="saintdenis">
                  974 - Saint-Denis
                </Option>
                <Option key={"ville-" + Math.random()} value="mamoudzou">
                  976 - Mamoudzou
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      );
    };
    const CollectionsProcuration = (props) => {
      //With this, we will get all field values.
      const onCreateProcuration = (values) => {
        axios
          .post("api/procuration", {
            id: props.orderId,
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            ville: values.ville,
            adresse: values.adresse,
            zip: values.zip,
            phone: values.phone.replace(/ /g, ""),
          })
          .then(function (response) {
            let status = response.data.status;
            let message = response.data.message;
            setTimeout(() => {
              const modal = Modal.success({
                content: (
                  <div
                    className={"text-center"}
                    key={"Procuration-" + Math.random()}
                  >
                    <LazyLoadImage
                      src={"/images/logo.png"}
                      width={"65px"}
                      alt={"bagzee"}
                    />
                    <p
                      className={
                        status ? "text-success pt-2" : "text-danger pt-2"
                      }
                    >
                      {message}
                    </p>
                  </div>
                ),
                okText: "ok",
              });
              setTimeout(() => {
                modal.destroy();
              }, 5000);
              /**login apres inscription**/

              this.setState({ visibleProcuration: false });

              /***/
            }, 1000);
          })
          .catch(function (error) {
            console.log(error);
          });
        this.setState({ visibleProcuration: false });
      };

      return (
        <div>
          <button
            className={"btnBlue myAltBtn fs-small"}
            onClick={() => {
              this.setState({ visibleProcuration: true });
            }}
          >
            {t("page_annonce.procuration")}
          </button>
          <CollectionCreateFormProcuration
            key={"Procuration_in_detail_" + Math.random()}
            visibleProcuration={this.state.visibleProcuration}
            onCreateProcuration={onCreateProcuration}
            onCancelProcuration={() => {
              this.setState({
                visibleProcuration: false,
              });
            }}
          />
        </div>
      );
    };
    let loading = this.state.loading;
    const { t } = this.props;
    console.log(this.props);
    const handleetatBagage = (rate) => {
      this.setState((prev) => ({
        rating: {
          ...prev.rating,
          etatBagage: rate,
        },
      }));
    };
    const handlerespectSecurite = (rate) => {
      this.setState((prev) => ({
        rating: {
          ...prev.rating,
          respectSecurite: rate,
        },
      }));
    };
    const handleponctualite = (rate) => {
      this.setState((prev) => ({
        rating: {
          ...prev.rating,
          ponctualite: rate,
        },
      }));
    };
    const handlecourtoisie = (rate) => {
      this.setState((prev) => ({
        rating: {
          ...prev.rating,
          courtoisie: rate,
        },
      }));
    };
    const onPointerEnter = () => console.log("Enter");
    const onPointerLeave = () => console.log("Leave");
    const onPointerMove = (value, index) => console.log(value, index);

    const filteredOrdersProp = this.state.annonces.filter(
      createFilter(this.state.searchTerm, KEYS_TO_FILTERSA)
    );
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
    } else if (this.state.redirect == "modifier") {
      return (
        <Redirect
          to={{
            pathname: this.state.isPorteur
              ? "/porter-lieu-retrait"
              : "/confier-lieu-depot",
            state: { id: this.state.orderId },
          }}
        />
      );
    } else if (
      this.state.redirect == "reserver" ||
      this.state.redirect == "details"
    ) {
      return (
        <>
          <Redirect
            to={{
              pathname: this.state.isPorteur
                ? "/recapitulatif-annonce-porter-" + this.state.orderId
                : "/recapitulatif-annonce",
              state: {
                id: this.state.orderId,
                order: this.state.order,
                page: this.state.redirect == "details" ? "details" : "annonce",
              },
            }}
          />
        </>
      );
    } else
      return (
        <div className={"profil_blocks Reservation"}>
          <div className={"container py-2 px-4"}>
            {loading ? (
              <p className={"text-center my-5"}>
                <span className="fa fa-spin fa-spinner fa-4x"></span>
              </p>
            ) : (
              <div className={"row mb-3"}>
                <div className={"col-12 pt-4 mb-4"}>
                  <div
                    className={
                      "d-flex flex-column flex-lg-row justify-content-end gap-3 align-items-center filterAnnonce"
                    }
                  >
                    <select
                      className={"m-0 w-auto fs-small"}
                      defaultValue={
                        this.state.statusName.includes("annonces")
                          ? this.state.statusName + "-a-" + this.state.status
                          : this.state.statusName + "-r-" + this.state.status
                      }
                      onChange={(e) => {
                        this.setState(
                          {
                            statusName: e.target.value.split("-")[0],
                            status: e.target.value.split("-")[2],
                            loading: true,
                          },
                          () => {
                            if (e.target.value.split("-")[1] == "a") {
                              this.getAnnonces();
                            } else {
                              this.getReservation();
                            }
                            console.log(this.state.statusName);
                            console.log(this.state.status);
                          }
                        );
                      }}
                    >
                      <option
                        id={"a0"}
                        value={t("page_annonce.ann_enAttente") + "-a-" + 0}
                      >
                        {t("page_annonce.ann_enAttente")}
                      </option>
                      <option
                        id={"a1"}
                        value={t("page_annonce.ann_enCours") + "-a-" + 1}
                      >
                        {t("page_annonce.ann_enCours")}
                      </option>
                      <option
                        id={"r0"}
                        value={
                          t("page_annonce.reservation_demande_enAttente") +
                          "-r-" +
                          0
                        }
                      >
                        {t("page_annonce.reservation_demande_enAttente")}
                      </option>
                      <option
                        id={"r1"}
                        value={
                          t("page_annonce.reservation_enCours") + "-r-" + 1
                        }
                      >
                        {t("page_annonce.reservation_enCours")}
                      </option>
                      <option
                        id={"r2"}
                        value={t("page_annonce.reservation_passes") + "-r-" + 2}
                      >
                        {t("page_annonce.reservation_passes")}
                      </option>
                    </select>
                    <label style={{ width: "auto" }}>
                      {t("page_annonce.role")}
                    </label>
                    <select
                      className={"m-0"}
                      defaultValue={
                        this.state.isPorteur ? t("porteur") : t("proprietaire")
                      }
                      style={
                        this.state.isPorteur
                          ? {
                              width: "auto",
                              margin: "0 !important",
                              border: "1px solid #EF7723",
                            }
                          : {
                              width: "auto",
                              margin: "0 !important",
                              border: "1px solid #4BBEED",
                            }
                      }
                      onChange={(e) => {
                        console.log(e.target.value);
                        if (e.target.value == t("porteur")) {
                          this.setState(
                            {
                              isPorteur: true,
                              statusName: t("page_annonce.ann_enAttente"),
                              status: "0",
                              loading: true,
                            },
                            () => {
                              this.getAnnonces();
                            }
                          );
                        } else {
                          this.setState(
                            {
                              isPorteur: false,
                              statusName: t("page_annonce.ann_enAttente"),
                              status: "0",
                              loading: true,
                            },
                            () => {
                              this.getAnnonces();
                            }
                          );
                        }
                      }}
                    >
                      <option key={"1"} value={t("porteur")}>
                        {t("porteur")}
                      </option>
                      <option key={"2"} value={t("proprietaire")}>
                        {t("proprietaire")}
                      </option>
                    </select>
                    <label style={{ width: "auto" }}>
                      {t("page_annonce.filterDate")}
                    </label>
                    <DatePicker
                      locale={locale}
                      format={"DD-MM-YYYY"}
                      style={{ width: "auto" }}
                      onChange={(date, dateString) => {
                        console.log(date, dateString);
                        this.setState({ searchTerm: dateString }, () => {});
                      }}
                    />
                  </div>
                  {this.state.annonces.length > 0 ? (
                    <>
                      <p className={"text-uppercase mt-3"}>
                        {this.state.statusName}
                      </p>
                      {filteredOrdersProp.map((order, key) =>
                        order.status == 0 &&
                        this.state.statusName.includes("brouillons") ? (
                          <ul>
                            <div className={"row "} key={"annonce-" + order.id}>
                              <div
                                className={
                                  this.state.isPorteur
                                    ? "col-md-12 bg-white role-porteur"
                                    : " col-md-12 bg-white role-proprietaire"
                                }
                              >
                                <div className={"row"}>
                                  <div
                                    className="col-lg-3 text-center py-4  borderRight"
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                      }
                                    >
                                      <div className="d-flex flex-column align-items-center justify-content-center w-100">
                                        <div className="d-flex align-items-center gap-2 gap-md-0 justify-content-between annonce-info-top">
                                          <div>
                                            {this.state.client.photo ? (
                                              <div
                                                className={"position-relative"}
                                              >
                                                <LazyLoadImage
                                                  src={this.state.client.photo}
                                                  alt={
                                                    this.state.client.firstName
                                                  }
                                                  style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <LazyLoadImage
                                                src={
                                                  "/images/avatar-person.png"
                                                }
                                                alt={
                                                  this.state.client.firstName
                                                }
                                                style={{
                                                  width: "60px",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <button
                                            className={
                                              "d-flex align-items-center justify-content-center btnStatut"
                                            }
                                            style={{
                                              fontSize: "12px",
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          >
                                            {t("statut")}
                                          </button>
                                          <FontAwesomeIcon icon={faTag} />
                                          <span
                                            className={
                                              this.state.isPorteur
                                                ? "text-blue"
                                                : "text-orange"
                                            }
                                          >
                                            20
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between annonce-info-bottom">
                                          {this.state.client.firstName}
                                          <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faEye}
                                              fontSize={25}
                                              className={
                                                this.state.isPorteur
                                                  ? "text-orange"
                                                  : "text-blue"
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className={"fs-5"}>
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className={
                                          this.state.isPorteur
                                            ? "text-blue"
                                            : "text-orange"
                                        }
                                        style={{ rotate: "90deg" }}
                                      />{" "}
                                      {this.state.client.phone}
                                    </p>

                                    <p
                                      className={
                                        this.state.isPorteur
                                          ? "price fs-1 text-orange mb-0"
                                          : "price fs-1 text-blue mb-0"
                                      }
                                    >
                                      {order.price ? order.price + "€" : null}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex justify-content-between w-100"
                                      }
                                    >
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "-10px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_depart}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_depart
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_depart}
                                        />
                                      </div>

                                      <div className={"col-md-8"}>
                                        <div
                                          className={
                                            "d-flex flex-md-row  justify-content-center gap-2"
                                          }
                                        >
                                          {order.objectTransport.includes(
                                            "Voiture"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="35.965"
                                              height="17.26"
                                              viewBox="0 0 35.965 17.26"
                                            >
                                              <g
                                                id="car-svgrepo-com_1_"
                                                data-name="car-svgrepo-com (1)"
                                                transform="translate(0 0)"
                                              >
                                                <g
                                                  id="Groupe_3569"
                                                  data-name="Groupe 3569"
                                                >
                                                  <path
                                                    id="Tracé_4987"
                                                    data-name="Tracé 4987"
                                                    d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                    transform="translate(19.229 -6.929)"
                                                  />
                                                  <path
                                                    id="Tracé_4988"
                                                    data-name="Tracé 4988"
                                                    d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                    transform="translate(0 -8.177)"
                                                  />
                                                  <path
                                                    id="Tracé_4989"
                                                    data-name="Tracé 4989"
                                                    d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                    transform="translate(-16.083 -6.929)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Car"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.58"
                                              height="16.883"
                                              viewBox="0 0 32.58 16.883"
                                            >
                                              <g
                                                id="bus-svgrepo-com_2_"
                                                data-name="bus-svgrepo-com (2)"
                                                transform="translate(0 -83.368)"
                                              >
                                                <g
                                                  id="Groupe_4744"
                                                  data-name="Groupe 4744"
                                                  transform="translate(0 83.368)"
                                                >
                                                  <path
                                                    id="Tracé_6610"
                                                    data-name="Tracé 6610"
                                                    d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                    transform="translate(0 -83.368)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Camion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="33.884"
                                              height="17.048"
                                              viewBox="0 0 33.884 17.048"
                                            >
                                              <path
                                                id="truck-svgrepo-com_1_"
                                                data-name="truck-svgrepo-com (1)"
                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                transform="translate(0 -96.384)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Avion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.625"
                                              height="17.048"
                                              viewBox="0 0 32.625 17.048"
                                            >
                                              <g
                                                id="XMLID_909_"
                                                transform="translate(0 -110.089)"
                                              >
                                                <g
                                                  id="Groupe_4745"
                                                  data-name="Groupe 4745"
                                                  transform="translate(0 110.089)"
                                                >
                                                  <path
                                                    id="Tracé_6611"
                                                    data-name="Tracé 6611"
                                                    d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                    transform="translate(0 -110.089)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Train"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="21.018"
                                              height="18.048"
                                              viewBox="0 0 21.018 18.048"
                                            >
                                              <g
                                                id="train-svgrepo-com_2_"
                                                data-name="train-svgrepo-com (2)"
                                                transform="translate(0 -20.392)"
                                              >
                                                <path
                                                  id="Tracé_6612"
                                                  data-name="Tracé 6612"
                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                />
                                                <path
                                                  id="Tracé_6613"
                                                  data-name="Tracé 6613"
                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                  transform="translate(-40.553 -154.141)"
                                                />
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Bateau"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24.57"
                                              height="20.641"
                                              viewBox="0 0 24.57 20.641"
                                            >
                                              <path
                                                id="boat-svgrepo-com"
                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                transform="translate(0 -16.99)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Indifferent"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15.308"
                                              height="26.276"
                                              viewBox="0 0 15.308 26.276"
                                            >
                                              <g
                                                id="standing-man-svgrepo-com"
                                                transform="translate(-25.906)"
                                              >
                                                <g
                                                  id="Groupe_8941"
                                                  data-name="Groupe 8941"
                                                  transform="translate(25.906 0)"
                                                >
                                                  <path
                                                    id="Tracé_7680"
                                                    data-name="Tracé 7680"
                                                    d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                    transform="translate(-25.906 -20.81)"
                                                  />
                                                  <circle
                                                    id="Ellipse_139"
                                                    data-name="Ellipse 139"
                                                    cx="2.719"
                                                    cy="2.719"
                                                    r="2.719"
                                                    transform="translate(4.914)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-row align-items-center justify-content-center"
                                          }
                                        >
                                          <hr
                                            style={
                                              this.state.isPorteur
                                                ? {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #4bbeed",
                                                  }
                                                : {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #EF7723",
                                                  }
                                            }
                                          />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.571"
                                            height="26"
                                            viewBox="0 0 18.571 26"
                                          >
                                            <g
                                              id="Polygone_9"
                                              data-name="Polygone 9"
                                              transform="translate(18.571) rotate(90)"
                                              fill={
                                                this.state.isPorteur
                                                  ? "#4bbeed"
                                                  : "#EF7723"
                                              }
                                            >
                                              <path
                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                stroke="none"
                                              />
                                              <path
                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                stroke="none"
                                                fill={
                                                  this.state.isPorteur
                                                    ? "#4bbeed"
                                                    : "#EF7723"
                                                }
                                              />
                                            </g>
                                          </svg>
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-between align-items-center"
                                          }
                                        >
                                          <span>
                                            <LazyLoadImage
                                              src={"/images/poids.png"}
                                              alt={"poids"}
                                            />{" "}
                                            <sub>{order.dimensionsKg} Kg</sub>
                                          </span>
                                          <span>
                                            {order.objectType.includes(
                                              "Bagage"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17.483"
                                                className={"mx-1"}
                                                height="26.251"
                                                viewBox="0 0 17.483 26.251"
                                              >
                                                <path
                                                  id="suitcase-svgrepo-com_1_"
                                                  data-name="suitcase-svgrepo-com (1)"
                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                  transform="translate(-17.6 -1.3)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Sac à dos"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22.633"
                                                className={"mx-1"}
                                                height="24.048"
                                                viewBox="0 0 22.633 24.048"
                                              >
                                                <g
                                                  id="backpack-svgrepo-com_1_"
                                                  data-name="backpack-svgrepo-com (1)"
                                                  transform="translate(-8.735)"
                                                >
                                                  <path
                                                    id="Tracé_6614"
                                                    data-name="Tracé 6614"
                                                    d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                    transform="translate(0 -155.838)"
                                                  />
                                                  <path
                                                    id="Tracé_6615"
                                                    data-name="Tracé 6615"
                                                    d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                    transform="translate(-232.971 -155.837)"
                                                  />
                                                  <path
                                                    id="Tracé_6616"
                                                    data-name="Tracé 6616"
                                                    d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                    transform="translate(-2.048 -14.56)"
                                                  />
                                                  <path
                                                    id="Tracé_6617"
                                                    data-name="Tracé 6617"
                                                    d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                    transform="translate(-30.854)"
                                                  />
                                                  <rect
                                                    id="Rectangle_5839"
                                                    data-name="Rectangle 5839"
                                                    width="11.4"
                                                    height="4.826"
                                                    transform="translate(14.407 16.226)"
                                                  />
                                                  <path
                                                    id="Tracé_6618"
                                                    data-name="Tracé 6618"
                                                    d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                    transform="translate(-34.631 -95.675)"
                                                  />
                                                  <path
                                                    id="Tracé_6619"
                                                    data-name="Tracé 6619"
                                                    d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                    transform="translate(-239.381 -14.561)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}

                                            {order.objectType.includes(
                                              "Hors format"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="33.502"
                                                className={"mx-1"}
                                                height="22.131"
                                                viewBox="0 0 33.502 22.131"
                                              >
                                                <g
                                                  id="bike-svgrepo-com"
                                                  transform="translate(0.001 -50.317)"
                                                >
                                                  <path
                                                    id="Tracé_6621"
                                                    data-name="Tracé 6621"
                                                    d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Petits objets"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.79"
                                                className={"mx-1"}
                                                height="21.048"
                                                viewBox="0 0 35.79 21.048"
                                              >
                                                <g
                                                  id="trainers-svgrepo-com"
                                                  transform="translate(0 -61.013)"
                                                >
                                                  <path
                                                    id="Tracé_6622"
                                                    data-name="Tracé 6622"
                                                    d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Chat"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16.371"
                                                className={"mx-1"}
                                                height="23"
                                                viewBox="0 0 16.371 23"
                                              >
                                                <path
                                                  id="cat-svgrepo-com"
                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                  transform="translate(-32.398)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Indifferent"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15.308"
                                                className={"mx-1"}
                                                height="26.276"
                                                viewBox="0 0 15.308 26.276"
                                              >
                                                <g
                                                  id="standing-man-svgrepo-com"
                                                  transform="translate(-25.906)"
                                                >
                                                  <g
                                                    id="Groupe_8941"
                                                    data-name="Groupe 8941"
                                                    transform="translate(25.906 0)"
                                                  >
                                                    <path
                                                      id="Tracé_7680"
                                                      data-name="Tracé 7680"
                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                      transform="translate(-25.906 -20.81)"
                                                    />
                                                    <circle
                                                      id="Ellipse_139"
                                                      data-name="Ellipse 139"
                                                      cx="2.719"
                                                      cy="2.719"
                                                      r="2.719"
                                                      transform="translate(4.914)"
                                                    />
                                                  </g>
                                                </g>
                                              </svg>
                                            ) : null}
                                            <sub>
                                              {order.dimensionsLong} x{" "}
                                              {order.dimensionsLarg} x{" "}
                                              {order.dimensionsH} Cm
                                            </sub>
                                          </span>
                                        </div>
                                      </div>

                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "60px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_arrivee}

                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_arrivee
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_arrivee}
                                        />
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between w-100">
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                      </div>

                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-3 py-4 pr-4 text-center borderLeft"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <button
                                      className={"btnBlue myBtn"}
                                      onClick={() => {
                                        if (order.canDepose) {
                                          axios
                                            .post(
                                              this.state.isPorteur
                                                ? "api/profil/baggagistes/deposer"
                                                : "api/profil/adverts/deposer",
                                              {
                                                token: this.state.client.token,
                                                orderId: order.id,
                                              }
                                            )
                                            .then((res) => {
                                              Modal.success({
                                                content: (
                                                  <div
                                                    className={"text-center"}
                                                    key={
                                                      "reservation-modal-" +
                                                      Math.random()
                                                    }
                                                  >
                                                    <div>
                                                      <LazyLoadImage
                                                        src={"/images/logo.png"}
                                                        alt={"logo"}
                                                      />
                                                      <p
                                                        style={{
                                                          color: "#8D8D8D",
                                                        }}
                                                        className={"pt-2"}
                                                      >
                                                        {res.data.message}
                                                      </p>
                                                    </div>
                                                  </div>
                                                ),
                                                okText: "ok",
                                              });
                                              if (res.data.status) {
                                                window.location.reload(false);
                                              }
                                            });
                                        } else {
                                          Modal.success({
                                            content: (
                                              <div
                                                className={"text-center"}
                                                key={
                                                  "reservation-modal-" +
                                                  Math.random()
                                                }
                                              >
                                                <div>
                                                  <FontAwesomeIcon
                                                    icon={faTimes}
                                                    fontSize={60}
                                                    color={"red"}
                                                  />
                                                  <p
                                                    style={{ color: "#8D8D8D" }}
                                                    className={"pt-2"}
                                                  >
                                                    Vous devez remplir tout les
                                                    champs pour déposer
                                                    l'annonce
                                                  </p>
                                                </div>
                                              </div>
                                            ),
                                            okText: "ok",
                                          });
                                        }
                                      }}
                                    >
                                      {t("page_annonce.deposer")}
                                    </button>
                                    <br />
                                    <button
                                      className={"btnBlue myAltBtn"}
                                      onClick={() => {
                                        this.setState(
                                          {
                                            redirect: "modifier",
                                            orderId: order.id,
                                          },
                                          () => {
                                            window.location.reload(false);
                                          }
                                        );
                                      }}
                                    >
                                      {t("btns.modifier")}
                                    </button>
                                    <br />
                                    <button
                                      className={"btnBlue myAltBtn"}
                                      onClick={() => {
                                        this.setState({
                                          showModalAnn: true,
                                          orderId: order.id,
                                        });
                                      }}
                                    >
                                      {t("btns.annuler")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ul>
                        ) : (order.status == 1 || order.status == 4) &&
                          this.state.statusName.includes("annonces") ? (
                          <ul>
                            <div className={"row "} key={"annonce-" + order.id}>
                              <div
                                className={
                                  this.state.isPorteur
                                    ? "col-md-12 bg-white role-porteur"
                                    : " col-md-12 bg-white role-proprietaire"
                                }
                              >
                                <div className={"row"}>
                                  <div
                                    className={
                                      "col-lg-3 text-center py-4 pl-4 borderRight"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                      }
                                    >
                                      <div className="d-flex flex-column align-items-center justify-content-center w-100">
                                        <div className="d-flex align-items-center gap-2 gap-md-0 justify-content-between annonce-info-top">
                                          <div>
                                            {this.state.client.photo ? (
                                              <div
                                                className={"position-relative"}
                                              >
                                                <LazyLoadImage
                                                  src={this.state.client.photo}
                                                  alt={
                                                    this.state.client.firstName
                                                  }
                                                  style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <LazyLoadImage
                                                src={
                                                  "/images/avatar-person.png"
                                                }
                                                alt={
                                                  this.state.client.firstName
                                                }
                                                style={{
                                                  width: "60px",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <button
                                            className={
                                              "d-flex align-items-center justify-content-center btnStatut"
                                            }
                                            style={{
                                              fontSize: "12px",
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          >
                                            {t("statut")}
                                          </button>
                                          <FontAwesomeIcon icon={faTag} />{" "}
                                          <span
                                            className={
                                              this.state.isPorteur
                                                ? "text-blue"
                                                : "text-orange"
                                            }
                                          >
                                            20
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between annonce-info-bottom">
                                          {this.state.client.firstName}
                                          <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faEye}
                                              fontSize={25}
                                              className={
                                                this.state.isPorteur
                                                  ? "text-orange"
                                                  : "text-blue"
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className={"fs-5"}>
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className={
                                          this.state.isPorteur
                                            ? "text-blue"
                                            : "text-orange"
                                        }
                                        style={{ rotate: "90deg" }}
                                      />{" "}
                                      {this.state.client.phone}
                                    </p>

                                    <p
                                      className={
                                        this.state.isPorteur
                                          ? "price fs-1 text-orange mb-0"
                                          : "price fs-1 text-blue mb-0"
                                      }
                                    >
                                      {order.price ? order.price + "€" : null}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex justify-content-between w-100"
                                      }
                                    >
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "-10px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_depart}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_depart
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_depart}
                                        />
                                      </div>

                                      <div className={"col-md-8"}>
                                        <div
                                          className={
                                            "d-flex flex-md-row  justify-content-center gap-2"
                                          }
                                        >
                                          {order.objectTransport.includes(
                                            "Voiture"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="35.965"
                                              height="17.26"
                                              viewBox="0 0 35.965 17.26"
                                            >
                                              <g
                                                id="car-svgrepo-com_1_"
                                                data-name="car-svgrepo-com (1)"
                                                transform="translate(0 0)"
                                              >
                                                <g
                                                  id="Groupe_3569"
                                                  data-name="Groupe 3569"
                                                >
                                                  <path
                                                    id="Tracé_4987"
                                                    data-name="Tracé 4987"
                                                    d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                    transform="translate(19.229 -6.929)"
                                                  />
                                                  <path
                                                    id="Tracé_4988"
                                                    data-name="Tracé 4988"
                                                    d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                    transform="translate(0 -8.177)"
                                                  />
                                                  <path
                                                    id="Tracé_4989"
                                                    data-name="Tracé 4989"
                                                    d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                    transform="translate(-16.083 -6.929)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Car"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.58"
                                              height="16.883"
                                              viewBox="0 0 32.58 16.883"
                                            >
                                              <g
                                                id="bus-svgrepo-com_2_"
                                                data-name="bus-svgrepo-com (2)"
                                                transform="translate(0 -83.368)"
                                              >
                                                <g
                                                  id="Groupe_4744"
                                                  data-name="Groupe 4744"
                                                  transform="translate(0 83.368)"
                                                >
                                                  <path
                                                    id="Tracé_6610"
                                                    data-name="Tracé 6610"
                                                    d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                    transform="translate(0 -83.368)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Camion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="33.884"
                                              height="17.048"
                                              viewBox="0 0 33.884 17.048"
                                            >
                                              <path
                                                id="truck-svgrepo-com_1_"
                                                data-name="truck-svgrepo-com (1)"
                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                transform="translate(0 -96.384)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Avion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.625"
                                              height="17.048"
                                              viewBox="0 0 32.625 17.048"
                                            >
                                              <g
                                                id="XMLID_909_"
                                                transform="translate(0 -110.089)"
                                              >
                                                <g
                                                  id="Groupe_4745"
                                                  data-name="Groupe 4745"
                                                  transform="translate(0 110.089)"
                                                >
                                                  <path
                                                    id="Tracé_6611"
                                                    data-name="Tracé 6611"
                                                    d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                    transform="translate(0 -110.089)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Train"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="21.018"
                                              height="18.048"
                                              viewBox="0 0 21.018 18.048"
                                            >
                                              <g
                                                id="train-svgrepo-com_2_"
                                                data-name="train-svgrepo-com (2)"
                                                transform="translate(0 -20.392)"
                                              >
                                                <path
                                                  id="Tracé_6612"
                                                  data-name="Tracé 6612"
                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                />
                                                <path
                                                  id="Tracé_6613"
                                                  data-name="Tracé 6613"
                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                  transform="translate(-40.553 -154.141)"
                                                />
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Bateau"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24.57"
                                              height="20.641"
                                              viewBox="0 0 24.57 20.641"
                                            >
                                              <path
                                                id="boat-svgrepo-com"
                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                transform="translate(0 -16.99)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Indifferent"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15.308"
                                              height="26.276"
                                              viewBox="0 0 15.308 26.276"
                                            >
                                              <g
                                                id="standing-man-svgrepo-com"
                                                transform="translate(-25.906)"
                                              >
                                                <g
                                                  id="Groupe_8941"
                                                  data-name="Groupe 8941"
                                                  transform="translate(25.906 0)"
                                                >
                                                  <path
                                                    id="Tracé_7680"
                                                    data-name="Tracé 7680"
                                                    d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                    transform="translate(-25.906 -20.81)"
                                                  />
                                                  <circle
                                                    id="Ellipse_139"
                                                    data-name="Ellipse 139"
                                                    cx="2.719"
                                                    cy="2.719"
                                                    r="2.719"
                                                    transform="translate(4.914)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-row align-items-center justify-content-center"
                                          }
                                        >
                                          <hr
                                            style={
                                              this.state.isPorteur
                                                ? {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #4bbeed",
                                                  }
                                                : {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #EF7723",
                                                  }
                                            }
                                          />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.571"
                                            height="26"
                                            viewBox="0 0 18.571 26"
                                          >
                                            <g
                                              id="Polygone_9"
                                              data-name="Polygone 9"
                                              transform="translate(18.571) rotate(90)"
                                              fill={
                                                this.state.isPorteur
                                                  ? "#4bbeed"
                                                  : "#EF7723"
                                              }
                                            >
                                              <path
                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                stroke="none"
                                              />
                                              <path
                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                stroke="none"
                                                fill={
                                                  this.state.isPorteur
                                                    ? "#4bbeed"
                                                    : "#EF7723"
                                                }
                                              />
                                            </g>
                                          </svg>
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-between align-items-center"
                                          }
                                        >
                                          <span>
                                            <LazyLoadImage
                                              src={"/images/poids.png"}
                                              alt={"poids"}
                                            />{" "}
                                            <sub>{order.dimensionsKg} Kg</sub>
                                          </span>
                                          <span>
                                            {order.objectType.includes(
                                              "Bagage"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17.483"
                                                className={"mx-1"}
                                                height="26.251"
                                                viewBox="0 0 17.483 26.251"
                                              >
                                                <path
                                                  id="suitcase-svgrepo-com_1_"
                                                  data-name="suitcase-svgrepo-com (1)"
                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                  transform="translate(-17.6 -1.3)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Sac à dos"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22.633"
                                                className={"mx-1"}
                                                height="24.048"
                                                viewBox="0 0 22.633 24.048"
                                              >
                                                <g
                                                  id="backpack-svgrepo-com_1_"
                                                  data-name="backpack-svgrepo-com (1)"
                                                  transform="translate(-8.735)"
                                                >
                                                  <path
                                                    id="Tracé_6614"
                                                    data-name="Tracé 6614"
                                                    d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                    transform="translate(0 -155.838)"
                                                  />
                                                  <path
                                                    id="Tracé_6615"
                                                    data-name="Tracé 6615"
                                                    d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                    transform="translate(-232.971 -155.837)"
                                                  />
                                                  <path
                                                    id="Tracé_6616"
                                                    data-name="Tracé 6616"
                                                    d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                    transform="translate(-2.048 -14.56)"
                                                  />
                                                  <path
                                                    id="Tracé_6617"
                                                    data-name="Tracé 6617"
                                                    d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                    transform="translate(-30.854)"
                                                  />
                                                  <rect
                                                    id="Rectangle_5839"
                                                    data-name="Rectangle 5839"
                                                    width="11.4"
                                                    height="4.826"
                                                    transform="translate(14.407 16.226)"
                                                  />
                                                  <path
                                                    id="Tracé_6618"
                                                    data-name="Tracé 6618"
                                                    d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                    transform="translate(-34.631 -95.675)"
                                                  />
                                                  <path
                                                    id="Tracé_6619"
                                                    data-name="Tracé 6619"
                                                    d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                    transform="translate(-239.381 -14.561)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}

                                            {order.objectType.includes(
                                              "Hors format"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="33.502"
                                                className={"mx-1"}
                                                height="22.131"
                                                viewBox="0 0 33.502 22.131"
                                              >
                                                <g
                                                  id="bike-svgrepo-com"
                                                  transform="translate(0.001 -50.317)"
                                                >
                                                  <path
                                                    id="Tracé_6621"
                                                    data-name="Tracé 6621"
                                                    d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Petits objets"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.79"
                                                className={"mx-1"}
                                                height="21.048"
                                                viewBox="0 0 35.79 21.048"
                                              >
                                                <g
                                                  id="trainers-svgrepo-com"
                                                  transform="translate(0 -61.013)"
                                                >
                                                  <path
                                                    id="Tracé_6622"
                                                    data-name="Tracé 6622"
                                                    d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Chat"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16.371"
                                                className={"mx-1"}
                                                height="23"
                                                viewBox="0 0 16.371 23"
                                              >
                                                <path
                                                  id="cat-svgrepo-com"
                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                  transform="translate(-32.398)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Indifferent"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15.308"
                                                className={"mx-1"}
                                                height="26.276"
                                                viewBox="0 0 15.308 26.276"
                                              >
                                                <g
                                                  id="standing-man-svgrepo-com"
                                                  transform="translate(-25.906)"
                                                >
                                                  <g
                                                    id="Groupe_8941"
                                                    data-name="Groupe 8941"
                                                    transform="translate(25.906 0)"
                                                  >
                                                    <path
                                                      id="Tracé_7680"
                                                      data-name="Tracé 7680"
                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                      transform="translate(-25.906 -20.81)"
                                                    />
                                                    <circle
                                                      id="Ellipse_139"
                                                      data-name="Ellipse 139"
                                                      cx="2.719"
                                                      cy="2.719"
                                                      r="2.719"
                                                      transform="translate(4.914)"
                                                    />
                                                  </g>
                                                </g>
                                              </svg>
                                            ) : null}
                                            <sub>
                                              {order.dimensionsLong} x{" "}
                                              {order.dimensionsLarg} x{" "}
                                              {order.dimensionsH} Cm
                                            </sub>
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "60px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_arrivee}

                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_arrivee
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_arrivee}
                                        />
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between w-100">
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                      </div>
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                    {/*<p className={'mb-0'}><span
                                                                            style={{color: '#A1A4A4'}}>{t('page_annonce.num_cmd')} </span>{order.numCommande}
                                                                        </p>*/}
                                  </div>
                                  <div
                                    className={
                                      "col-lg-3 py-4 pr-4 text-center borderLeft"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    {order.hasDemande ? (
                                      <p className={"mb-0"}>
                                        <Link
                                          to={{
                                            pathname: this.state.isPorteur
                                              ? "/demande-liste-porteur"
                                              : "/demande-liste-proprietaire",
                                            state: {
                                              client: this.state.client,
                                              myReservation: order,
                                            },
                                          }}
                                          className={"btnBlue myBtn"}
                                        >
                                          {t("page_annonce.listeDemandes")}
                                        </Link>
                                      </p>
                                    ) :  <button
                                        className={"btnBlue myAltBtn"}
                                        onClick={() => {
                                          this.setState(
                                              {
                                                redirect: "modifier",
                                                orderId: order.id,
                                              },
                                              () => {
                                                window.location.reload(false);
                                              }
                                          );
                                        }}
                                    >
                                      {t("btns.modifier")}
                                    </button>
                                     }
                                    <br />
                                    {order.status == 4 ? (
                                      <button
                                        className="btnBlue myAltBtn text-danger border-danger "
                                        style={{ cursor: "auto" }}
                                      >
                                        Annulé
                                      </button>
                                    ) : (
                                      <button
                                        className={"btnBlue myAltBtn"}
                                        onClick={() => {
                                          this.setState({
                                            showModalAnn: true,
                                            orderId: order.id,
                                          });
                                        }}
                                      >
                                        {t("btns.annuler")}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ul>
                        ) : order.status == 1 &&
                          this.state.statusName.includes("réservations") ? (
                          <ul>
                            <div className={"row "} key={"annonce-" + order.id}>
                              <div
                                className={
                                  this.state.isPorteur
                                    ? "col-md-12 bg-white role-porteur"
                                    : " col-md-12 bg-white role-proprietaire"
                                }
                              >
                                <div className={"row"}>
                                  <div
                                    className={
                                      "col-lg-3 text-center py-4 pl-4 borderRight"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                      }
                                    >
                                      <div className="d-flex flex-column align-items-center justify-content-center w-100">
                                        <div className="d-flex align-items-center gap-2 gap-md-0 justify-content-between annonce-info-top">
                                          <div>
                                            {order.client.photo ? (
                                              <div
                                                className={"position-relative"}
                                              >
                                                <LazyLoadImage
                                                  src={order.client.photo}
                                                  alt={order.client.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <LazyLoadImage
                                                src={
                                                  "/images/avatar-person.png"
                                                }
                                                alt={order.client.firstName}
                                                style={{
                                                  width: "60px",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <button
                                            className={
                                              "d-flex align-items-center justify-content-center btnStatut"
                                            }
                                            style={{
                                              fontSize: "12px",
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          >
                                            {t("statut")}
                                          </button>
                                          <FontAwesomeIcon icon={faTag} />{" "}
                                          <span
                                            className={
                                              this.state.isPorteur
                                                ? "text-blue"
                                                : "text-orange"
                                            }
                                          >
                                            20
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between annonce-info-bottom">
                                          {this.state.client.firstName}
                                          <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faEye}
                                              fontSize={25}
                                              className={
                                                this.state.isPorteur
                                                  ? "text-orange"
                                                  : "text-blue"
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className={"fs-5"}>
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className={
                                          this.state.isPorteur
                                            ? "text-blue"
                                            : "text-orange"
                                        }
                                        style={{ rotate: "90deg" }}
                                      />{" "}
                                      {order.client.phone}
                                    </p>

                                    <p
                                      className={
                                        this.state.isPorteur
                                          ? "price fs-1 text-orange mb-0"
                                          : "price fs-1 text-blue mb-0"
                                      }
                                    >
                                      {order.price ? order.price + "€" : null}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex justify-content-between w-100"
                                      }
                                    >
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "-10px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_depart}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_depart
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_depart}
                                        />
                                      </div>

                                      <div className={"col-md-8"}>
                                        <div
                                          className={
                                            "d-flex flex-md-row  justify-content-center gap-2"
                                          }
                                        >
                                          {order.objectTransport.includes(
                                            "Voiture"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="35.965"
                                              height="17.26"
                                              viewBox="0 0 35.965 17.26"
                                            >
                                              <g
                                                id="car-svgrepo-com_1_"
                                                data-name="car-svgrepo-com (1)"
                                                transform="translate(0 0)"
                                              >
                                                <g
                                                  id="Groupe_3569"
                                                  data-name="Groupe 3569"
                                                >
                                                  <path
                                                    id="Tracé_4987"
                                                    data-name="Tracé 4987"
                                                    d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                    transform="translate(19.229 -6.929)"
                                                  />
                                                  <path
                                                    id="Tracé_4988"
                                                    data-name="Tracé 4988"
                                                    d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                    transform="translate(0 -8.177)"
                                                  />
                                                  <path
                                                    id="Tracé_4989"
                                                    data-name="Tracé 4989"
                                                    d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                    transform="translate(-16.083 -6.929)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Car"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.58"
                                              height="16.883"
                                              viewBox="0 0 32.58 16.883"
                                            >
                                              <g
                                                id="bus-svgrepo-com_2_"
                                                data-name="bus-svgrepo-com (2)"
                                                transform="translate(0 -83.368)"
                                              >
                                                <g
                                                  id="Groupe_4744"
                                                  data-name="Groupe 4744"
                                                  transform="translate(0 83.368)"
                                                >
                                                  <path
                                                    id="Tracé_6610"
                                                    data-name="Tracé 6610"
                                                    d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                    transform="translate(0 -83.368)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Camion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="33.884"
                                              height="17.048"
                                              viewBox="0 0 33.884 17.048"
                                            >
                                              <path
                                                id="truck-svgrepo-com_1_"
                                                data-name="truck-svgrepo-com (1)"
                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                transform="translate(0 -96.384)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Avion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.625"
                                              height="17.048"
                                              viewBox="0 0 32.625 17.048"
                                            >
                                              <g
                                                id="XMLID_909_"
                                                transform="translate(0 -110.089)"
                                              >
                                                <g
                                                  id="Groupe_4745"
                                                  data-name="Groupe 4745"
                                                  transform="translate(0 110.089)"
                                                >
                                                  <path
                                                    id="Tracé_6611"
                                                    data-name="Tracé 6611"
                                                    d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                    transform="translate(0 -110.089)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Train"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="21.018"
                                              height="18.048"
                                              viewBox="0 0 21.018 18.048"
                                            >
                                              <g
                                                id="train-svgrepo-com_2_"
                                                data-name="train-svgrepo-com (2)"
                                                transform="translate(0 -20.392)"
                                              >
                                                <path
                                                  id="Tracé_6612"
                                                  data-name="Tracé 6612"
                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                />
                                                <path
                                                  id="Tracé_6613"
                                                  data-name="Tracé 6613"
                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                  transform="translate(-40.553 -154.141)"
                                                />
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Bateau"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24.57"
                                              height="20.641"
                                              viewBox="0 0 24.57 20.641"
                                            >
                                              <path
                                                id="boat-svgrepo-com"
                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                transform="translate(0 -16.99)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Indifferent"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15.308"
                                              height="26.276"
                                              viewBox="0 0 15.308 26.276"
                                            >
                                              <g
                                                id="standing-man-svgrepo-com"
                                                transform="translate(-25.906)"
                                              >
                                                <g
                                                  id="Groupe_8941"
                                                  data-name="Groupe 8941"
                                                  transform="translate(25.906 0)"
                                                >
                                                  <path
                                                    id="Tracé_7680"
                                                    data-name="Tracé 7680"
                                                    d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                    transform="translate(-25.906 -20.81)"
                                                  />
                                                  <circle
                                                    id="Ellipse_139"
                                                    data-name="Ellipse 139"
                                                    cx="2.719"
                                                    cy="2.719"
                                                    r="2.719"
                                                    transform="translate(4.914)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-row align-items-center justify-content-center"
                                          }
                                        >
                                          <hr
                                            style={
                                              this.state.isPorteur
                                                ? {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #4bbeed",
                                                  }
                                                : {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #EF7723",
                                                  }
                                            }
                                          />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.571"
                                            height="26"
                                            viewBox="0 0 18.571 26"
                                          >
                                            <g
                                              id="Polygone_9"
                                              data-name="Polygone 9"
                                              transform="translate(18.571) rotate(90)"
                                              fill={
                                                this.state.isPorteur
                                                  ? "#4bbeed"
                                                  : "#EF7723"
                                              }
                                            >
                                              <path
                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                stroke="none"
                                              />
                                              <path
                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                stroke="none"
                                                fill={
                                                  this.state.isPorteur
                                                    ? "#4bbeed"
                                                    : "#EF7723"
                                                }
                                              />
                                            </g>
                                          </svg>
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-between align-items-center"
                                          }
                                        >
                                          <span>
                                            <LazyLoadImage
                                              src={"/images/poids.png"}
                                              alt={"poids"}
                                            />{" "}
                                            <sub>{order.dimensionsKg} Kg</sub>
                                          </span>
                                          <span>
                                            {order.objectType.includes(
                                              "Bagage"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17.483"
                                                className={"mx-1"}
                                                height="26.251"
                                                viewBox="0 0 17.483 26.251"
                                              >
                                                <path
                                                  id="suitcase-svgrepo-com_1_"
                                                  data-name="suitcase-svgrepo-com (1)"
                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                  transform="translate(-17.6 -1.3)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Sac à dos"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22.633"
                                                className={"mx-1"}
                                                height="24.048"
                                                viewBox="0 0 22.633 24.048"
                                              >
                                                <g
                                                  id="backpack-svgrepo-com_1_"
                                                  data-name="backpack-svgrepo-com (1)"
                                                  transform="translate(-8.735)"
                                                >
                                                  <path
                                                    id="Tracé_6614"
                                                    data-name="Tracé 6614"
                                                    d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                    transform="translate(0 -155.838)"
                                                  />
                                                  <path
                                                    id="Tracé_6615"
                                                    data-name="Tracé 6615"
                                                    d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                    transform="translate(-232.971 -155.837)"
                                                  />
                                                  <path
                                                    id="Tracé_6616"
                                                    data-name="Tracé 6616"
                                                    d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                    transform="translate(-2.048 -14.56)"
                                                  />
                                                  <path
                                                    id="Tracé_6617"
                                                    data-name="Tracé 6617"
                                                    d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                    transform="translate(-30.854)"
                                                  />
                                                  <rect
                                                    id="Rectangle_5839"
                                                    data-name="Rectangle 5839"
                                                    width="11.4"
                                                    height="4.826"
                                                    transform="translate(14.407 16.226)"
                                                  />
                                                  <path
                                                    id="Tracé_6618"
                                                    data-name="Tracé 6618"
                                                    d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                    transform="translate(-34.631 -95.675)"
                                                  />
                                                  <path
                                                    id="Tracé_6619"
                                                    data-name="Tracé 6619"
                                                    d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                    transform="translate(-239.381 -14.561)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}

                                            {order.objectType.includes(
                                              "Hors format"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="33.502"
                                                className={"mx-1"}
                                                height="22.131"
                                                viewBox="0 0 33.502 22.131"
                                              >
                                                <g
                                                  id="bike-svgrepo-com"
                                                  transform="translate(0.001 -50.317)"
                                                >
                                                  <path
                                                    id="Tracé_6621"
                                                    data-name="Tracé 6621"
                                                    d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Petits objets"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.79"
                                                className={"mx-1"}
                                                height="21.048"
                                                viewBox="0 0 35.79 21.048"
                                              >
                                                <g
                                                  id="trainers-svgrepo-com"
                                                  transform="translate(0 -61.013)"
                                                >
                                                  <path
                                                    id="Tracé_6622"
                                                    data-name="Tracé 6622"
                                                    d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Chat"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16.371"
                                                className={"mx-1"}
                                                height="23"
                                                viewBox="0 0 16.371 23"
                                              >
                                                <path
                                                  id="cat-svgrepo-com"
                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                  transform="translate(-32.398)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Indifferent"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15.308"
                                                className={"mx-1"}
                                                height="26.276"
                                                viewBox="0 0 15.308 26.276"
                                              >
                                                <g
                                                  id="standing-man-svgrepo-com"
                                                  transform="translate(-25.906)"
                                                >
                                                  <g
                                                    id="Groupe_8941"
                                                    data-name="Groupe 8941"
                                                    transform="translate(25.906 0)"
                                                  >
                                                    <path
                                                      id="Tracé_7680"
                                                      data-name="Tracé 7680"
                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                      transform="translate(-25.906 -20.81)"
                                                    />
                                                    <circle
                                                      id="Ellipse_139"
                                                      data-name="Ellipse 139"
                                                      cx="2.719"
                                                      cy="2.719"
                                                      r="2.719"
                                                      transform="translate(4.914)"
                                                    />
                                                  </g>
                                                </g>
                                              </svg>
                                            ) : null}
                                            <sub>
                                              {order.dimensionsLong} x{" "}
                                              {order.dimensionsLarg} x{" "}
                                              {order.dimensionsH} Cm
                                            </sub>
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "60px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_arrivee}

                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_arrivee
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_arrivee}
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-between w-100">
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                      </div>
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                    <p className={"mb-0"}>
                                      <span style={{ color: "#A1A4A4" }}>
                                        {t("page_annonce.num_cmd")}{" "}
                                      </span>
                                      {order.numCommande}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-3 py-4 pr-4 text-center borderLeft"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div className={"row"}>
                                      {/*<div className={"col-lg-7 text-center"}>
                                                                                    <div
                                                                                        className="d-flex flex-row justify-content-around gap-2">
                                                                                        <div>
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="31" height="31"
                                                                                                viewBox="0 0 31 31">
                                                                                                <g id="picture-svgrepo-com_3_"
                                                                                                   data-name="picture-svgrepo-com (3)"
                                                                                                   transform="translate(0.5 0.5)">
                                                                                                    <g id="Groupe_9311"
                                                                                                       data-name="Groupe 9311">
                                                                                                        <path
                                                                                                            id="Tracé_7966"
                                                                                                            data-name="Tracé 7966"
                                                                                                            d="M0,26.837A3.167,3.167,0,0,0,3.163,30H26.837A3.167,3.167,0,0,0,30,26.837V3.163A3.167,3.167,0,0,0,26.837,0H3.163A3.167,3.167,0,0,0,0,3.163ZM26.837,28.5H3.163A1.666,1.666,0,0,1,1.5,26.837V22.883L7.19,17.195l4.861,4.861a.747.747,0,0,0,1.06,0l8.778-8.778L28.5,19.886v6.951A1.667,1.667,0,0,1,26.837,28.5ZM3.163,1.5H26.837A1.666,1.666,0,0,1,28.5,3.163v14.6l-6.081-6.075a.747.747,0,0,0-1.06,0l-8.778,8.778L7.718,15.6a.747.747,0,0,0-1.06,0L1.5,20.756V3.163A1.666,1.666,0,0,1,3.163,1.5Z"
                                                                                                            fill={this.state.isPorteur ? "#ef7723" : "#4bbeed"}
                                                                                                            stroke={this.state.isPorteur ? "#ef7723" : "#4bbeed"}
                                                                                                            strokeWidth="1"/>
                                                                                                        <path
                                                                                                            id="Tracé_7967"
                                                                                                            data-name="Tracé 7967"
                                                                                                            d="M93.219,79.138A3.819,3.819,0,1,0,89.4,75.319,3.823,3.823,0,0,0,93.219,79.138Zm0-6.136A2.317,2.317,0,1,1,90.9,75.319,2.319,2.319,0,0,1,93.219,73Z"
                                                                                                            transform="translate(-83.92 -67.117)"
                                                                                                            fill={this.state.isPorteur ? "#ef7723" : "#4bbeed"}
                                                                                                            stroke={this.state.isPorteur ? "#ef7723" : "#4bbeed"}
                                                                                                            strokeWidth="1"/>
                                                                                                    </g>
                                                                                                </g>
                                                                                            </svg>
                                                                                            <br/>
                                                                                            <p className={"fs-small"}>{t('photo')}</p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                width="24.425"
                                                                                                height="31"
                                                                                                viewBox="0 0 24.425 31">
                                                                                                <path
                                                                                                    id="file-svgrepo-com_4_"
                                                                                                    data-name="file-svgrepo-com (4)"
                                                                                                    d="M79.422,6.5c0-.011,0-.021,0-.032s0-.007,0-.011-.006-.025-.009-.037v0c0-.013-.008-.025-.013-.037v0c0-.011-.01-.023-.016-.033l0-.006c-.005-.01-.012-.02-.018-.03l0-.007-.019-.026-.006-.009L79.3,6.237l0,0L73.19.129l0,0L73.158.1l-.01-.007L73.124.074,73.114.069,73.087.052l-.007,0L73.047.034l0,0L73.007.019h0L72.965.009l-.011,0-.031,0-.044,0H58.319A2.322,2.322,0,0,0,56,2.319V27.681A2.322,2.322,0,0,0,58.319,30H77.106a2.322,2.322,0,0,0,2.319-2.319V6.546A.437.437,0,0,0,79.422,6.5Zm-6.1-5,4.6,4.6H74.757a1.44,1.44,0,0,1-1.438-1.438Zm3.787,27.616H58.319a1.44,1.44,0,0,1-1.438-1.438V2.319A1.44,1.44,0,0,1,58.319.881H72.438V4.667a2.322,2.322,0,0,0,2.319,2.319h3.787V27.681A1.44,1.44,0,0,1,77.106,29.119Z"
                                                                                                    transform="translate(-55.5 0.5)"
                                                                                                    fill={this.state.isPorteur ? "#ef7723" : "#4bbeed"}
                                                                                                    stroke={this.state.isPorteur ? "#ef7723" : "#4bbeed"}

                                                                                                    strokeWidth="1"/>
                                                                                            </svg>

                                                                                            <br/>
                                                                                            <p className={"fs-small"}>{t('page_annonce.documentDouane')}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <br/>
                                                                                    <button
                                                                                        className={"btnBlue myAltBtn"}
                                                                                        onClick={() => {
                                                                                            this.setState({
                                                                                                showModalAnn: true,
                                                                                                orderId: order.id
                                                                                            })
                                                                                        }}>{t('page_annonce.discussion')}
                                                                                    </button>
                                                                                    <br/>
                                                                                    <CollectionsProcuration
                                                                                        orderId={order.id}
                                                                                        key={'CollectionsProcuration-' + Math.random()}/>

                                                                                </div>*/}
                                      <div className={"col-lg-12 text-center"}>
                                        <CombinerChat
                                          emailClient={order.client.email}
                                          orderInfo={{ order }}
                                        />
                                        <br />
                                        <button className={"btnBlue myAltBtn"}>
                                          {t("page_annonce.litige")}
                                        </button>
                                        <br />

                                        <button
                                          className={"btnBlue myAltBtn"}
                                          onClick={() => {
                                            this.setState({
                                              showModalAnnReservation: true,
                                              orderId: order.id,
                                            });
                                          }}
                                        >
                                          {t("btns.annuler")}
                                        </button>
                                        <br />
                                        <button
                                          className={"btnBlue myAltBtn"}
                                          onClick={() => {
                                            this.setState(
                                              {
                                                redirect: "details",
                                                orderId: order.id,
                                                order: order,
                                              },
                                              () => {
                                                window.location.reload(false);
                                              }
                                            );
                                          }}
                                        >
                                          {t("btns.details")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ul>
                        ) : order.status == 0 &&
                          this.state.statusName.includes("demandes") ? (
                          <ul>
                            <div className={"row "} key={"annonce-" + order.id}>
                              <div
                                className={
                                  this.state.isPorteur
                                    ? "col-md-12 bg-white role-porteur"
                                    : " col-md-12 bg-white role-proprietaire"
                                }
                              >
                                <div className={"row"}>
                                  <div
                                    className={
                                      "col-lg-3 text-center py-4 pl-4 borderRight"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                      }
                                    >
                                      <div className="d-flex flex-column align-items-center justify-content-center w-100">
                                        <div className="d-flex align-items-center gap-2 gap-md-0 justify-content-between annonce-info-top">
                                          <div>
                                            {order.client?.photo ? (
                                              <div
                                                className={"position-relative"}
                                              >
                                                <LazyLoadImage
                                                  src={order.client.photo}
                                                  alt={order.client.firstName}
                                                  style={{
                                                    width: "60px",
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <LazyLoadImage
                                                src={
                                                  "/images/avatar-person.png"
                                                }
                                                alt={order.client.firstName}
                                                style={{
                                                  width: "60px",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <button
                                            className={
                                              "d-flex align-items-center justify-content-center btnStatut"
                                            }
                                            style={{
                                              fontSize: "12px",
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          >
                                            {t("statut")}
                                          </button>
                                          <FontAwesomeIcon icon={faTag} />
                                          <span
                                            className={
                                              this.state.isPorteur
                                                ? "text-orange"
                                                : "text-blue"
                                            }
                                          >
                                            20
                                          </span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between annonce-info-bottom">
                                          {order.client.firstName}
                                          <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faEye}
                                              fontSize={25}
                                              className={
                                                this.state.isPorteur
                                                  ? "text-blue"
                                                  : "text-orange"
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className={"fs-5"}>
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className={
                                          this.state.isPorteur
                                            ? "text-blue"
                                            : "text-orange"
                                        }
                                        style={{ rotate: "90deg" }}
                                      />{" "}
                                      {order.client.phone}
                                    </p>

                                    <p
                                      className={
                                        this.state.isPorteur
                                          ? "price fs-1 text-blue mb-0"
                                          : "price fs-1 text-orange mb-0"
                                      }
                                    >
                                      {order.priceQuery
                                        ? order.priceQuery + "€"
                                        : order.price + "€"}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex justify-content-between w-100"
                                      }
                                    >
                                      <div
                                        className={"mt-3 d-flex flex-column col-md-2 text-capitalize"}
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "-10px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_depart}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_depart
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_depart}
                                        />
                                      </div>

                                      <div className={"col-md-8"}>
                                        <div
                                          className={
                                            "d-flex flex-md-row  justify-content-center gap-2"
                                          }
                                        >
                                          {order.objectTransport.includes(
                                            "Voiture"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="35.965"
                                              height="17.26"
                                              viewBox="0 0 35.965 17.26"
                                            >
                                              <g
                                                id="car-svgrepo-com_1_"
                                                data-name="car-svgrepo-com (1)"
                                                transform="translate(0 0)"
                                              >
                                                <g
                                                  id="Groupe_3569"
                                                  data-name="Groupe 3569"
                                                >
                                                  <path
                                                    id="Tracé_4987"
                                                    data-name="Tracé 4987"
                                                    d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                    transform="translate(19.229 -6.929)"
                                                  />
                                                  <path
                                                    id="Tracé_4988"
                                                    data-name="Tracé 4988"
                                                    d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                    transform="translate(0 -8.177)"
                                                  />
                                                  <path
                                                    id="Tracé_4989"
                                                    data-name="Tracé 4989"
                                                    d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                    transform="translate(-16.083 -6.929)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Car"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.58"
                                              height="16.883"
                                              viewBox="0 0 32.58 16.883"
                                            >
                                              <g
                                                id="bus-svgrepo-com_2_"
                                                data-name="bus-svgrepo-com (2)"
                                                transform="translate(0 -83.368)"
                                              >
                                                <g
                                                  id="Groupe_4744"
                                                  data-name="Groupe 4744"
                                                  transform="translate(0 83.368)"
                                                >
                                                  <path
                                                    id="Tracé_6610"
                                                    data-name="Tracé 6610"
                                                    d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                    transform="translate(0 -83.368)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Camion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="33.884"
                                              height="17.048"
                                              viewBox="0 0 33.884 17.048"
                                            >
                                              <path
                                                id="truck-svgrepo-com_1_"
                                                data-name="truck-svgrepo-com (1)"
                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                transform="translate(0 -96.384)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Avion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.625"
                                              height="17.048"
                                              viewBox="0 0 32.625 17.048"
                                            >
                                              <g
                                                id="XMLID_909_"
                                                transform="translate(0 -110.089)"
                                              >
                                                <g
                                                  id="Groupe_4745"
                                                  data-name="Groupe 4745"
                                                  transform="translate(0 110.089)"
                                                >
                                                  <path
                                                    id="Tracé_6611"
                                                    data-name="Tracé 6611"
                                                    d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                    transform="translate(0 -110.089)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Train"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="21.018"
                                              height="18.048"
                                              viewBox="0 0 21.018 18.048"
                                            >
                                              <g
                                                id="train-svgrepo-com_2_"
                                                data-name="train-svgrepo-com (2)"
                                                transform="translate(0 -20.392)"
                                              >
                                                <path
                                                  id="Tracé_6612"
                                                  data-name="Tracé 6612"
                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                />
                                                <path
                                                  id="Tracé_6613"
                                                  data-name="Tracé 6613"
                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                  transform="translate(-40.553 -154.141)"
                                                />
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Bateau"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24.57"
                                              height="20.641"
                                              viewBox="0 0 24.57 20.641"
                                            >
                                              <path
                                                id="boat-svgrepo-com"
                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                transform="translate(0 -16.99)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Indifferent"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15.308"
                                              height="26.276"
                                              viewBox="0 0 15.308 26.276"
                                            >
                                              <g
                                                id="standing-man-svgrepo-com"
                                                transform="translate(-25.906)"
                                              >
                                                <g
                                                  id="Groupe_8941"
                                                  data-name="Groupe 8941"
                                                  transform="translate(25.906 0)"
                                                >
                                                  <path
                                                    id="Tracé_7680"
                                                    data-name="Tracé 7680"
                                                    d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                    transform="translate(-25.906 -20.81)"
                                                  />
                                                  <circle
                                                    id="Ellipse_139"
                                                    data-name="Ellipse 139"
                                                    cx="2.719"
                                                    cy="2.719"
                                                    r="2.719"
                                                    transform="translate(4.914)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-row align-items-center justify-content-center"
                                          }
                                        >
                                          <hr
                                            style={{
                                              minWidth: "80%",
                                              borderTop: "3px solid #EF7723",
                                            }}
                                          />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.571"
                                            height="26"
                                            viewBox="0 0 18.571 26"
                                          >
                                            <g
                                              id="Polygone_9"
                                              data-name="Polygone 9"
                                              transform="translate(18.571) rotate(90)"
                                              fill="#EF7723"
                                            >
                                              <path
                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                stroke="none"
                                              />
                                              <path
                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                stroke="none"
                                                fill="#EF7723"
                                              />
                                            </g>
                                          </svg>
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-between align-items-center"
                                          }
                                        >
                                          <span>
                                            <LazyLoadImage
                                              src={"/images/poids.png"}
                                              alt={"poids"}
                                            />{" "}
                                            <sub>{order.dimensionsKg} Kg</sub>
                                          </span>
                                          <span>
                                            {order.objectType.includes(
                                              "Bagage"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17.483"
                                                className={"mx-1"}
                                                height="26.251"
                                                viewBox="0 0 17.483 26.251"
                                              >
                                                <path
                                                  id="suitcase-svgrepo-com_1_"
                                                  data-name="suitcase-svgrepo-com (1)"
                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                  transform="translate(-17.6 -1.3)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Sac à dos"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22.633"
                                                className={"mx-1"}
                                                height="24.048"
                                                viewBox="0 0 22.633 24.048"
                                              >
                                                <g
                                                  id="backpack-svgrepo-com_1_"
                                                  data-name="backpack-svgrepo-com (1)"
                                                  transform="translate(-8.735)"
                                                >
                                                  <path
                                                    id="Tracé_6614"
                                                    data-name="Tracé 6614"
                                                    d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                    transform="translate(0 -155.838)"
                                                  />
                                                  <path
                                                    id="Tracé_6615"
                                                    data-name="Tracé 6615"
                                                    d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                    transform="translate(-232.971 -155.837)"
                                                  />
                                                  <path
                                                    id="Tracé_6616"
                                                    data-name="Tracé 6616"
                                                    d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                    transform="translate(-2.048 -14.56)"
                                                  />
                                                  <path
                                                    id="Tracé_6617"
                                                    data-name="Tracé 6617"
                                                    d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                    transform="translate(-30.854)"
                                                  />
                                                  <rect
                                                    id="Rectangle_5839"
                                                    data-name="Rectangle 5839"
                                                    width="11.4"
                                                    height="4.826"
                                                    transform="translate(14.407 16.226)"
                                                  />
                                                  <path
                                                    id="Tracé_6618"
                                                    data-name="Tracé 6618"
                                                    d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                    transform="translate(-34.631 -95.675)"
                                                  />
                                                  <path
                                                    id="Tracé_6619"
                                                    data-name="Tracé 6619"
                                                    d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                    transform="translate(-239.381 -14.561)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}

                                            {order.objectType.includes(
                                              "Hors format"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="33.502"
                                                className={"mx-1"}
                                                height="22.131"
                                                viewBox="0 0 33.502 22.131"
                                              >
                                                <g
                                                  id="bike-svgrepo-com"
                                                  transform="translate(0.001 -50.317)"
                                                >
                                                  <path
                                                    id="Tracé_6621"
                                                    data-name="Tracé 6621"
                                                    d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Petits objets"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.79"
                                                className={"mx-1"}
                                                height="21.048"
                                                viewBox="0 0 35.79 21.048"
                                              >
                                                <g
                                                  id="trainers-svgrepo-com"
                                                  transform="translate(0 -61.013)"
                                                >
                                                  <path
                                                    id="Tracé_6622"
                                                    data-name="Tracé 6622"
                                                    d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Chat"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16.371"
                                                className={"mx-1"}
                                                height="23"
                                                viewBox="0 0 16.371 23"
                                              >
                                                <path
                                                  id="cat-svgrepo-com"
                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                  transform="translate(-32.398)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Indifferent"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15.308"
                                                className={"mx-1"}
                                                height="26.276"
                                                viewBox="0 0 15.308 26.276"
                                              >
                                                <g
                                                  id="standing-man-svgrepo-com"
                                                  transform="translate(-25.906)"
                                                >
                                                  <g
                                                    id="Groupe_8941"
                                                    data-name="Groupe 8941"
                                                    transform="translate(25.906 0)"
                                                  >
                                                    <path
                                                      id="Tracé_7680"
                                                      data-name="Tracé 7680"
                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                      transform="translate(-25.906 -20.81)"
                                                    />
                                                    <circle
                                                      id="Ellipse_139"
                                                      data-name="Ellipse 139"
                                                      cx="2.719"
                                                      cy="2.719"
                                                      r="2.719"
                                                      transform="translate(4.914)"
                                                    />
                                                  </g>
                                                </g>
                                              </svg>
                                            ) : null}
                                            <sub>
                                              {order.dimensionsLong} x{" "}
                                              {order.dimensionsLarg} x{" "}
                                              {order.dimensionsH} Cm
                                            </sub>
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "60px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_arrivee}

                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_arrivee
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_arrivee}
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-between w-100">
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                      </div>

                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                    <p className={"mb-0"}>
                                      {order.isValid == 1 ? (
                                        <strong className="text-success">
                                          {" "}
                                          {t("page_annonce.demandeValider")}
                                        </strong>
                                      ) : order.isValid == 0 ? (
                                        <strong className="text-orange">
                                          {t("page_annonce.enAttValidation")}
                                        </strong>
                                      ) : (
                                        <strong className="text-orange">
                                          {t("page_annonce.demandeRefuser")}
                                        </strong>
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-3 py-4 pr-4 text-center borderLeft"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <CombinerChat
                                      emailClient={order.client.email}
                                      orderInfo={{ order }}
                                    />

                                    <br />

                                    <button
                                      className={"btnBlue myAltBtn"}
                                      onClick={() => {
                                        this.setState({
                                          showModalAnnReservation: true,
                                          orderId: order.id,
                                          isValid: order.isValid,
                                        });
                                      }}
                                    >
                                      {t("btns.annuler")}
                                    </button>
                                    <br />
                                    {order.isValid == 1 ? (
                                      <button
                                        className={"btnBlue myBtn"}
                                        onClick={() => {
                                          this.setState(
                                            {
                                              redirect: "reserver",
                                              orderId: order.id,
                                              order: order,
                                            },
                                            () => {
                                              window.location.reload(false);
                                            }
                                          );
                                        }}
                                      >
                                        {t("reserver")}
                                      </button>
                                    ) : order.isValid == 0 ? (
                                      <a
                                        href={
                                          !this.state.isPorteur
                                            ? "/recapitulatif-demande-annonce-" +
                                              order.id
                                            : "/modifier-recapitulatif-annonce-porter-" +
                                              order.id
                                        }
                                        className={"btnBlue myAltBtn"}
                                      >
                                        {t("btns.modifier")}
                                      </a>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ul>
                        ) : order.status == 2 &&
                          this.state.statusName.includes("réservations") ? (
                          <ul>
                            <div className={"row "} key={"annonce-" + order.id}>
                              <div
                                className={
                                  this.state.isPorteur
                                    ? "col-md-12 bg-white role-porteur"
                                    : " col-md-12 bg-white role-proprietaire"
                                }
                              >
                                <div className={"row"}>
                                  <div
                                    className={
                                      "col-lg-3 text-center py-4 pl-4 borderRight"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                      }
                                    >
                                      <div className="d-flex flex-column align-items-center justify-content-center w-100">
                                        <div className="d-flex align-items-center gap-2 gap-md-0 justify-content-between annonce-info-top">
                                          <div>
                                            {order.client.photo ? (
                                              <div
                                                className={"position-relative"}
                                              >
                                                <LazyLoadImage
                                                  src={order.client.photo}
                                                  alt={order.client.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                  }}
                                                />
                                              </div>
                                            ) : (
                                              <LazyLoadImage
                                                src={
                                                  "/images/avatar-person.png"
                                                }
                                                alt={order.client.firstName}
                                                style={{
                                                  width: "60px",
                                                  borderRadius: "50%",
                                                }}
                                              />
                                            )}
                                          </div>
                                          <button
                                            className={
                                              "d-flex align-items-center justify-content-center btnStatut"
                                            }
                                            style={{
                                              fontSize: "12px",
                                              width: "25px",
                                              height: "25px",
                                            }}
                                          >
                                            {t("statut")}
                                          </button>
                                          <FontAwesomeIcon icon={faTag} />{" "}
                                          <span
                                            className={
                                              this.state.isPorteur
                                                ? "text-blue"
                                                : "text-orange"
                                            }
                                          >
                                            20
                                          </span>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between annonce-info-bottom">
                                          {order.client.firstName}

                                          <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                          >
                                            <FontAwesomeIcon
                                              icon={faEye}
                                              fontSize={25}
                                              className={
                                                this.state.isPorteur
                                                  ? "text-orange"
                                                  : "text-blue"
                                              }
                                            />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <p className={"fs-5"}>
                                      <FontAwesomeIcon
                                        icon={faPhone}
                                        className={
                                          this.state.isPorteur
                                            ? "text-blue"
                                            : "text-orange"
                                        }
                                        style={{ rotate: "90deg" }}
                                      />{" "}
                                      {order.client.phone}
                                    </p>

                                    <p className={"price fs-1 text-blue"}>
                                      {order.price ? order.price + "€" : null}{" "}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "d-flex justify-content-between w-100"
                                      }
                                    >
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "-10px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#4bbded"
                                                  stroke="#4bbded"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_depart}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_depart
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_depart}
                                        />
                                      </div>
                                      <div className={"col-8"}>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-center gap-2"
                                          }
                                        >
                                          {order.objectTransport.includes(
                                            "Voiture"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="35.965"
                                              height="17.26"
                                              viewBox="0 0 35.965 17.26"
                                            >
                                              <g
                                                id="car-svgrepo-com_1_"
                                                data-name="car-svgrepo-com (1)"
                                                transform="translate(0 0)"
                                              >
                                                <g
                                                  id="Groupe_3569"
                                                  data-name="Groupe 3569"
                                                >
                                                  <path
                                                    id="Tracé_4987"
                                                    data-name="Tracé 4987"
                                                    d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                                    transform="translate(19.229 -6.929)"
                                                  />
                                                  <path
                                                    id="Tracé_4988"
                                                    data-name="Tracé 4988"
                                                    d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                                    transform="translate(0 -8.177)"
                                                  />
                                                  <path
                                                    id="Tracé_4989"
                                                    data-name="Tracé 4989"
                                                    d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                                    transform="translate(-16.083 -6.929)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Car"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.58"
                                              height="16.883"
                                              viewBox="0 0 32.58 16.883"
                                            >
                                              <g
                                                id="bus-svgrepo-com_2_"
                                                data-name="bus-svgrepo-com (2)"
                                                transform="translate(0 -83.368)"
                                              >
                                                <g
                                                  id="Groupe_4744"
                                                  data-name="Groupe 4744"
                                                  transform="translate(0 83.368)"
                                                >
                                                  <path
                                                    id="Tracé_6610"
                                                    data-name="Tracé 6610"
                                                    d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                                    transform="translate(0 -83.368)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Camion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="33.884"
                                              height="17.048"
                                              viewBox="0 0 33.884 17.048"
                                            >
                                              <path
                                                id="truck-svgrepo-com_1_"
                                                data-name="truck-svgrepo-com (1)"
                                                d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                                transform="translate(0 -96.384)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Avion"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="32.625"
                                              height="17.048"
                                              viewBox="0 0 32.625 17.048"
                                            >
                                              <g
                                                id="XMLID_909_"
                                                transform="translate(0 -110.089)"
                                              >
                                                <g
                                                  id="Groupe_4745"
                                                  data-name="Groupe 4745"
                                                  transform="translate(0 110.089)"
                                                >
                                                  <path
                                                    id="Tracé_6611"
                                                    data-name="Tracé 6611"
                                                    d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                                    transform="translate(0 -110.089)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Train"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="21.018"
                                              height="18.048"
                                              viewBox="0 0 21.018 18.048"
                                            >
                                              <g
                                                id="train-svgrepo-com_2_"
                                                data-name="train-svgrepo-com (2)"
                                                transform="translate(0 -20.392)"
                                              >
                                                <path
                                                  id="Tracé_6612"
                                                  data-name="Tracé 6612"
                                                  d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                                />
                                                <path
                                                  id="Tracé_6613"
                                                  data-name="Tracé 6613"
                                                  d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                                  transform="translate(-40.553 -154.141)"
                                                />
                                              </g>
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Bateau"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="24.57"
                                              height="20.641"
                                              viewBox="0 0 24.57 20.641"
                                            >
                                              <path
                                                id="boat-svgrepo-com"
                                                d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                                transform="translate(0 -16.99)"
                                              />
                                            </svg>
                                          ) : null}
                                          {order.objectTransport.includes(
                                            "Indifferent"
                                          ) ? (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="15.308"
                                              height="26.276"
                                              viewBox="0 0 15.308 26.276"
                                            >
                                              <g
                                                id="standing-man-svgrepo-com"
                                                transform="translate(-25.906)"
                                              >
                                                <g
                                                  id="Groupe_8941"
                                                  data-name="Groupe 8941"
                                                  transform="translate(25.906 0)"
                                                >
                                                  <path
                                                    id="Tracé_7680"
                                                    data-name="Tracé 7680"
                                                    d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                    transform="translate(-25.906 -20.81)"
                                                  />
                                                  <circle
                                                    id="Ellipse_139"
                                                    data-name="Ellipse 139"
                                                    cx="2.719"
                                                    cy="2.719"
                                                    r="2.719"
                                                    transform="translate(4.914)"
                                                  />
                                                </g>
                                              </g>
                                            </svg>
                                          ) : null}
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-row align-items-center justify-content-center"
                                          }
                                        >
                                          <hr
                                            style={
                                              this.state.isPorteur
                                                ? {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #4bbeed",
                                                  }
                                                : {
                                                    minWidth: "80%",
                                                    borderTop:
                                                      "3px solid #EF7723",
                                                  }
                                            }
                                          />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18.571"
                                            height="26"
                                            viewBox="0 0 18.571 26"
                                          >
                                            <g
                                              id="Polygone_9"
                                              data-name="Polygone 9"
                                              transform="translate(18.571) rotate(90)"
                                              fill={
                                                this.state.isPorteur
                                                  ? "#4bbeed"
                                                  : "#EF7723"
                                              }
                                            >
                                              <path
                                                d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                                stroke="none"
                                              />
                                              <path
                                                d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                                stroke="none"
                                                fill={
                                                  this.state.isPorteur
                                                    ? "#4bbeed"
                                                    : "#EF7723"
                                                }
                                              />
                                            </g>
                                          </svg>
                                        </div>
                                        <div
                                          className={
                                            "d-flex flex-md-row justify-content-between align-items-center"
                                          }
                                        >
                                          <span>
                                            <LazyLoadImage
                                              src={"/images/poids.png"}
                                              alt={"poids"}
                                            />{" "}
                                            <sub>{order.dimensionsKg} Kg</sub>
                                          </span>
                                          <span>
                                            {order.objectType.includes(
                                              "Bagage"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17.483"
                                                className={"mx-1"}
                                                height="26.251"
                                                viewBox="0 0 17.483 26.251"
                                              >
                                                <path
                                                  id="suitcase-svgrepo-com_1_"
                                                  data-name="suitcase-svgrepo-com (1)"
                                                  d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                                                  transform="translate(-17.6 -1.3)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Sac à dos"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="22.633"
                                                className={"mx-1"}
                                                height="24.048"
                                                viewBox="0 0 22.633 24.048"
                                              >
                                                <g
                                                  id="backpack-svgrepo-com_1_"
                                                  data-name="backpack-svgrepo-com (1)"
                                                  transform="translate(-8.735)"
                                                >
                                                  <path
                                                    id="Tracé_6614"
                                                    data-name="Tracé 6614"
                                                    d="M8.735,171.676V177.1a.916.916,0,0,0,.915.915h1.193v-8.446h0A2.11,2.11,0,0,0,8.735,171.676Z"
                                                    transform="translate(0 -155.838)"
                                                  />
                                                  <path
                                                    id="Tracé_6615"
                                                    data-name="Tracé 6615"
                                                    d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                                                    transform="translate(-232.971 -155.837)"
                                                  />
                                                  <path
                                                    id="Tracé_6616"
                                                    data-name="Tracé 6616"
                                                    d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                                                    transform="translate(-2.048 -14.56)"
                                                  />
                                                  <path
                                                    id="Tracé_6617"
                                                    data-name="Tracé 6617"
                                                    d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                                                    transform="translate(-30.854)"
                                                  />
                                                  <rect
                                                    id="Rectangle_5839"
                                                    data-name="Rectangle 5839"
                                                    width="11.4"
                                                    height="4.826"
                                                    transform="translate(14.407 16.226)"
                                                  />
                                                  <path
                                                    id="Tracé_6618"
                                                    data-name="Tracé 6618"
                                                    d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                                                    transform="translate(-34.631 -95.675)"
                                                  />
                                                  <path
                                                    id="Tracé_6619"
                                                    data-name="Tracé 6619"
                                                    d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                                                    transform="translate(-239.381 -14.561)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}

                                            {order.objectType.includes(
                                              "Hors format"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="33.502"
                                                className={"mx-1"}
                                                height="22.131"
                                                viewBox="0 0 33.502 22.131"
                                              >
                                                <g
                                                  id="bike-svgrepo-com"
                                                  transform="translate(0.001 -50.317)"
                                                >
                                                  <path
                                                    id="Tracé_6621"
                                                    data-name="Tracé 6621"
                                                    d="M26.524,58.494a6.938,6.938,0,0,0-2.653.525l-2.991-5.209a3.608,3.608,0,0,0,3.212-2.293.9.9,0,1,0-1.708-.594c-.371,1.066-1.7,1.238-4.721,1.238a.9.9,0,0,0,0,1.808c.406,0,.814,0,1.218-.008l1.953,3.4-3.991,6.372c-1.359-2.355-3.383-5.831-4.755-8.215,1.553-.262,2.7-.563,2.7-1.57V53.9c0-1.039-1.223-1.326-2.848-1.595a23.7,23.7,0,0,0-2.65-.3H9.248a1.921,1.921,0,0,0-1.914,1.9v.046a1.921,1.921,0,0,0,1.914,1.9h.046c.15,0,.47-.023.878-.065l.861,1.5L9.875,59.128a6.964,6.964,0,1,0,4.015,7.227h2.926a.883.883,0,0,0,.783-.429c.012-.021.022-.032.032-.053l4.224-6.738.448.784a6.975,6.975,0,1,0,4.221-1.424ZM6.976,70.619A5.161,5.161,0,1,1,8.9,60.674L7.938,62.22a3.379,3.379,0,1,0,2.3,4.135h1.824A5.124,5.124,0,0,1,6.976,70.619Zm3.274-6.072a3.891,3.891,0,0,0-.779-1.392l.966-1.553a5.245,5.245,0,0,1,1.632,2.945Zm3.646,0a6.92,6.92,0,0,0-2.488-4.483l.647-1.045c.825,1.432,1.87,3.268,3.2,5.528Zm12.628,6.094a5.167,5.167,0,0,1-3.311-9.136l.906,1.578a3.381,3.381,0,1,0,1.57-.9l-.908-1.58a5.169,5.169,0,1,1,1.743,10.035Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Petits objets"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="35.79"
                                                className={"mx-1"}
                                                height="21.048"
                                                viewBox="0 0 35.79 21.048"
                                              >
                                                <g
                                                  id="trainers-svgrepo-com"
                                                  transform="translate(0 -61.013)"
                                                >
                                                  <path
                                                    id="Tracé_6622"
                                                    data-name="Tracé 6622"
                                                    d="M35.03,73.025a4.169,4.169,0,0,0-2.109-.941,33.963,33.963,0,0,1-7.308-2.15L23.69,73.341a.967.967,0,0,1-1.683-.95L23.865,69.1c-.514-.27-.984-.54-1.414-.8l-2.8,3.112a.967.967,0,1,1-1.437-1.293l2.614-2.9c-.332-.239-.635-.466-.912-.673a10.185,10.185,0,0,0-2.181-1.391c-2.708-4.13-3.737-4.131-4.15-4.131l-.075,0c-1.068.059-1.694,1.232-2.392,4.481-.125.584-.236,1.164-.329,1.687-.262.013-.536.021-.826.021-4.421,0-5.531-2.841-5.573-2.954a.967.967,0,0,0-1.651-.3A13.412,13.412,0,0,0,.121,70.659a12.464,12.464,0,0,1,4.234.4,10.758,10.758,0,0,1,7.409,7.355,19.285,19.285,0,0,1,2.494-.164c2.077,0,4.512.241,6.866.475,2.418.24,4.919.487,7.121.487.491,0,.961-.013,1.4-.037a8.446,8.446,0,0,0,2.939-.716,3.952,3.952,0,0,1-3.373,1.665H2.5l.094-.98a19.365,19.365,0,0,0,2.311.143,25.155,25.155,0,0,0,4.683-.52l.235-.042a8.763,8.763,0,0,0-5.987-5.8A10.456,10.456,0,0,0,0,72.61a18,18,0,0,0,.74,5.595L.474,81a.966.966,0,0,0,.962,1.059H29.207a5.992,5.992,0,0,0,4.469-1.878,7.162,7.162,0,0,0,1.754-4.121,2.87,2.87,0,0,0,.356-1.179A2.3,2.3,0,0,0,35.03,73.025ZM15.6,65.45l0,.005a4.535,4.535,0,0,1-2.8,1.465,21.529,21.529,0,0,1,.979-3.745A16,16,0,0,1,15.6,65.45Z"
                                                    transform="translate(0)"
                                                  />
                                                </g>
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Chat"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16.371"
                                                className={"mx-1"}
                                                height="23"
                                                viewBox="0 0 16.371 23"
                                              >
                                                <path
                                                  id="cat-svgrepo-com"
                                                  d="M46.626,6.961,44.494,9.038v6.35l-.307.126A13.771,13.771,0,0,0,41,9.3a4.916,4.916,0,0,0,2.3-5.084L44.1,0,40.611.667a4.905,4.905,0,0,0-4.275,0L32.85,0l.791,4.213a4.9,4.9,0,0,0,2.3,5.084A14.356,14.356,0,0,0,32.4,18c0,3.086,2.328,5,6.076,5,3.458,0,5.688-1.633,6.016-4.309l3.075-1.2V10.326l1.2-1.175Z"
                                                  transform="translate(-32.398)"
                                                />
                                              </svg>
                                            ) : null}
                                            {order.objectType.includes(
                                              "Indifferent"
                                            ) ? (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="15.308"
                                                className={"mx-1"}
                                                height="26.276"
                                                viewBox="0 0 15.308 26.276"
                                              >
                                                <g
                                                  id="standing-man-svgrepo-com"
                                                  transform="translate(-25.906)"
                                                >
                                                  <g
                                                    id="Groupe_8941"
                                                    data-name="Groupe 8941"
                                                    transform="translate(25.906 0)"
                                                  >
                                                    <path
                                                      id="Tracé_7680"
                                                      data-name="Tracé 7680"
                                                      d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                                      transform="translate(-25.906 -20.81)"
                                                    />
                                                    <circle
                                                      id="Ellipse_139"
                                                      data-name="Ellipse 139"
                                                      cx="2.719"
                                                      cy="2.719"
                                                      r="2.719"
                                                      transform="translate(4.914)"
                                                    />
                                                  </g>
                                                </g>
                                              </svg>
                                            ) : null}
                                            <sub>
                                              {order.dimensionsLong} x{" "}
                                              {order.dimensionsLarg} x{" "}
                                              {order.dimensionsH} Cm
                                            </sub>
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          "mt-3 col-md-2 d-flex flex-column text-capitalize"
                                        }
                                        style={{ width: "120px" }}
                                      >
                                        <svg
                                          style={{
                                            position: "absolute",
                                            top: "-20px",
                                            left: "65px",
                                          }}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20.6"
                                          height="26.662"
                                          viewBox="0 0 20.6 26.662"
                                        >
                                          <g
                                            id="pin-svgrepo-com_2_"
                                            data-name="pin-svgrepo-com (2)"
                                            transform="translate(45.471 26.412) rotate(180)"
                                          >
                                            <g
                                              id="Groupe_4899"
                                              data-name="Groupe 4899"
                                              transform="translate(25.121)"
                                            >
                                              <g
                                                id="Groupe_4898"
                                                data-name="Groupe 4898"
                                                transform="translate(0)"
                                              >
                                                <path
                                                  id="Tracé_6731"
                                                  data-name="Tracé 6731"
                                                  d="M35.171,0c-3.741,0-10.05,10.983-10.05,16.112a10.05,10.05,0,1,0,20.1,0C45.221,10.983,38.912,0,35.171,0Zm0,25.2a9.1,9.1,0,0,1-9.093-9.093c0-5.368,6.376-15.155,9.093-15.155s9.093,9.787,9.093,15.155A9.1,9.1,0,0,1,35.171,25.2Z"
                                                  transform="translate(-25.121)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                                <path
                                                  id="Tracé_6732"
                                                  data-name="Tracé 6732"
                                                  d="M80.517,119.329a3.829,3.829,0,1,0,3.829,3.829A3.833,3.833,0,0,0,80.517,119.329Zm0,6.7a2.871,2.871,0,1,1,2.871-2.871A2.875,2.875,0,0,1,80.517,126.029Z"
                                                  transform="translate(-70.466 -104.932)"
                                                  fill="#f47d29"
                                                  stroke="#f47d29"
                                                  strokeWidth="0.5"
                                                />
                                              </g>
                                            </g>
                                          </g>
                                        </svg>
                                        {order.ville_arrivee}
                                        <LazyLoadImage
                                          src={
                                            "/images/" +
                                            order.type_adresse_arrivee
                                              .toLowerCase()
                                              .replace(" ", "") +
                                            ".png"
                                          }
                                          style={{ width: "max-content" }}
                                          alt={order.type_adresse_arrivee}
                                        />
                                      </div>
                                    </div>

                                    <div className="d-flex justify-content-between w-100">
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                      </div>
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                    <p className={"mb-0"}>
                                      <span style={{ color: "#A1A4A4" }}>
                                        {t("page_annonce.num_cmd")}{" "}
                                      </span>
                                      {order.numCommande}
                                    </p>
                                  </div>
                                  <div
                                    className={
                                      "col-lg-3 py-4 pr-4 text-center borderLeft"
                                    }
                                    style={
                                      this.state.isPorteur
                                        ? { borderColor: "#ef7723" }
                                        : { borderColor: "#4BBEED" }
                                    }
                                  >
                                    <button className={"btnBlue myBtn"}>
                                      {t("page_annonce.litige")}
                                    </button>
                                    <br />
                                    <button
                                      className={"btnBlue myAltBtn"}
                                      onClick={() => {
                                        this.setState({
                                          showModalNote: true,
                                          orderNote: order,
                                          orderId: order.id,
                                          firstNameClientOrder:
                                            order.client.firstName,
                                        });
                                      }}
                                    >
                                      {t("btns.noter")}
                                    </button>
                                    <br />
                                    <button className={"btnBlue myAltBtn"}>
                                      {t("btns.facture")}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ul>
                        ) : null
                      )}
                    </>
                  ) : (
                    <div className={"col-12 pt-5 mt-5 mb-4 text-center"}>
                      {t("page_annonce.no_ann")}
                    </div>
                  )}

                  <Modal
                    open={
                      this.state.showModalAnn ||
                      this.state.showModalAnnReservation
                    }
                    title={"Annulation"}
                    className={"annulationPopup"}
                    footer={[
                      <Button
                        className={"alertAnn"}
                        onClick={() => {
                          if (this.state.showModalAnnReservation) {
                            axios
                              .post(
                                this.state.isPorteur
                                  ? `api/payment/cancel/porteur`
                                  : `api/payment/cancel/proprietaire`,
                                {
                                  token: this.state.client.token,
                                  id_order: this.state.orderId,
                                }
                              )
                              .then((res) => {
                                let that = this;
                                that.setState({
                                  showModalAnn: false,
                                  showModalAnnReservation: false,
                                });
                                if (res.data.status) {
                                  const modal = Modal.success({
                                    content: (
                                      <div
                                        className={"text-center"}
                                        key={"cancel-order-" + Math.random()}
                                      >
                                        <LazyLoadImage
                                          src={"/images/logo.png"}
                                          alt={"bagzee"}
                                          width={"120px"}
                                        />

                                        <p className={"text-success pt-2"}>
                                          {res.data.message}
                                        </p>
                                      </div>
                                    ),
                                    okText: "ok",
                                  });
                                  setTimeout(() => {
                                    modal.destroy();
                                  }, 5000);
                                  that.setState(
                                    { status: this.state.isValid == 0 ? 2 : 0 },
                                    () => {
                                      this.getReservation();
                                    }
                                  );
                                }
                              });
                          } else {
                            axios
                              .get(
                                this.state.isPorteur
                                  ? `api/baggagite/cancel?token=` +
                                      this.state.client.token +
                                      `&id=` +
                                      this.state.orderId
                                  : `api/advert/cancel?token=` +
                                      this.state.client.token +
                                      `&id=` +
                                      this.state.orderId
                              )
                              .then((res) => {
                                if (res.data.status) {
                                  let that = this;
                                  that.setState({
                                    showModalAnn: false,
                                    showModalAnnReservation: false,
                                  });
                                  const modal = Modal.success({
                                    content: (
                                      <div
                                        className={"text-center"}
                                        key={"cancel-order-" + Math.random()}
                                      >
                                        <LazyLoadImage
                                          src={"/images/logo.png"}
                                          alt={"bagzee"}
                                          width={"120px"}
                                        />

                                        <p className={"text-success pt-2"}>
                                          {res.data.message}
                                        </p>
                                      </div>
                                    ),
                                    okText: "ok",
                                  });
                                  setTimeout(() => {
                                    modal.destroy();
                                  }, 5000);
                                  this.getAnnonces();
                                }
                              });
                          }
                        }}
                      >
                        {t("btns.oui")}
                      </Button>,
                      <Button
                        className={"alertAnn"}
                        onClick={() =>
                          this.setState({
                            showModalAnn: false,
                            showModalAnnReservation: false,
                          })
                        }
                      >
                        {t("btns.non")}
                      </Button>,
                    ]}
                  >
                    <div className={"container"}>
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <p>
                            <Trans i18nKey={"modal_annuler_ann"}>
                              Êtes-vous certain de vouloir annuler
                              <br />
                              cette annonce ?
                            </Trans>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Modal>
                  <Modal
                    onCancel={() => this.setState({ showModalNote: false })}
                    open={this.state.showModalNote}
                    maskClosable={true}
                    className={"noterPopup"}
                    footer={[
                      <Button
                        className={"btnBlue"}
                        disabled={Object.values(this.state.rating).every(val=>(val!=0||val!=''))?false:true}
                        onClick={() => {
                          let obj = {};
                          if (!this.state.isPorteur) {
                            obj = {
                              token: this.state.client.token,
                              etatBagage: this.state.rating.etatBagage,
                              respectSecurite:
                                this.state.rating.respectSecurite,
                              ponctualite: this.state.rating.ponctualite,
                              courtoisie: this.state.rating.courtoisie,
                              descAvis: this.state.rating.descAvis,
                              baggagist_id: this.state.orderId,
                            };
                          } else {
                            obj = {
                              token: this.state.client.token,
                              etatBagage: this.state.rating.etatBagage,
                              respectSecurite:
                                this.state.rating.respectSecurite,
                              ponctualite: this.state.rating.ponctualite,
                              courtoisie: this.state.rating.courtoisie,
                              descAvis: this.state.rating.descAvis,
                              advert_id: this.state.orderId,
                            };
                          }
                          axios.post("api/avis/create", obj).then((res) => {
                            res.status
                              ? this.setState({ showModalNote: false ,rating: {
                                    etatBagage: 0,
                                    respectSecurite: 0,
                                    ponctualite: 0,
                                    courtoisie: 0,
                                    descAvis: "",
                                  }}, () => {
                                  Modal.success({
                                    content: (
                                      <div
                                        className={"text-center"}
                                        key={"ops" + Math.random()}
                                      >
                                        <LazyLoadImage
                                          src={"/images/logo.png"}
                                          width={"65px"}
                                          alt={"bagzee"}
                                        />
                                        <p className={"text-success pt-2"}>
                                          {res.data.message}
                                        </p>
                                      </div>
                                    ),
                                    okText: "ok",
                                  });
                                })
                              : Modal.success({
                                  content: (
                                    <div
                                      className={"text-center"}
                                      key={"ops" + Math.random()}
                                    >
                                      <LazyLoadImage
                                        src={"/images/logo.png"}
                                        width={"65px"}
                                        alt={"bagzee"}
                                      />
                                      <p className={"text-danger pt-2"}>
                                        {res.data.message}
                                      </p>
                                    </div>
                                  ),
                                  okText: "ok",
                                });
                          });
                        }}
                      >
                        {t("btns.valider")}
                      </Button>,
                    ]}
                  >
                    <div className={"container"}>
                      <div className="row">
                        <div className="col-md-12 text-center">
                          <label
                            className={
                              "text-center fs-4 text-blue fw-500 w-100"
                            }
                          >
                            {t("page_avis.noterVoyage")}
                          </label>
                        </div>
                        <div className="col-md-12 text-center">
                          <div className={"d-flex flex-column gap-3 mb-4"}>
                            <div>
                              {this.state.orderNote?.client.photo ? (
                                <div className={"position-relative"}>
                                  <LazyLoadImage
                                    src={this.state.orderNote?.client.photo}
                                    alt={this.state.orderNote?.client.firstName}
                                    style={{
                                      width: "60px",
                                      height: "60px",
                                      objectFit: "cover",
                                      borderRadius: "50%",
                                    }}
                                  />
                                </div>
                              ) : (
                                <LazyLoadImage
                                  src={"/images/avatar-person.png"}
                                  alt={this.state.orderNote?.client.firstName}
                                  style={{
                                    width: "60px",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <span>
                                {this.state.orderNote?.client.firstName}{" "}
                              </span>
                              <button className={"btnStatut"}>
                                {t("statut")}
                              </button>
                            </div>
                            <div>
                              <span className={"text-orange mr-2"}>
                                {this.state.mesInfoAvis.total}
                              </span>
                              <LazyLoadImage
                                src={"/images/star.png"}
                                alt={"avis"}
                                className={"mr-2"}
                              />
                              <span className={"text-gris"}>
                                {this.state.mesInfoAvis.nbrAvis}{" "}
                                {t("page_avis.avis")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 text-center">
                          <p className="d-flex flex-row justify-content-between">
                            <span>{t("page_avis.etat_bagage")}</span>{" "}
                            <Rating
                              fillColor={"#4BBEED"}
                              onClick={handleetatBagage}
                              onPointerEnter={onPointerEnter}
                              onPointerLeave={onPointerLeave}
                              onPointerMove={onPointerMove}
                              /* Available Props */
                            />
                          </p>
                          <p className="d-flex flex-row justify-content-between">
                            <span>{t("page_avis.respect_securite")}</span>
                            <Rating
                              fillColor={"#4BBEED"}
                              onClick={handlerespectSecurite}
                              onPointerEnter={onPointerEnter}
                              onPointerLeave={onPointerLeave}
                              onPointerMove={onPointerMove}
                              /* Available Props */
                            />
                          </p>
                          <p className="d-flex flex-row justify-content-between">
                            <span>{t("page_avis.ponctualite")}</span>
                            <Rating
                              fillColor={"#4BBEED"}
                              onClick={handleponctualite}
                              onPointerEnter={onPointerEnter}
                              onPointerLeave={onPointerLeave}
                              onPointerMove={onPointerMove}
                              /* Available Props */
                            />
                          </p>
                          <p className="d-flex flex-row justify-content-between">
                            <span>{t("page_avis.courtoisie")}</span>
                            <Rating
                              fillColor={"#4BBEED"}
                              onClick={handlecourtoisie}
                              onPointerEnter={onPointerEnter}
                              onPointerLeave={onPointerLeave}
                              onPointerMove={onPointerMove}
                              /* Available Props */
                            />
                          </p>
                          <p>
                            <Trans i18nKey={"descAvis"}>
                              Ecris un avis à {this.state.firstNameClientOrder},
                              ça lui fera plaisir!
                            </Trans>
                          </p>
                          <textarea
                            name={"descAvis"}
                            rows={4}
                            value={this.state.descAvis}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal>

                  <Modal
                    open={this.state.showModalSuivi}
                    style={{ maxWidth: "100%", minWidth: "50%" }}
                    onCancel={() => this.setState({ showModalSuivi: false })}
                    className={"suiviPopup"}
                    footer={[
                      <Button
                        className={"btnBlue"}
                        onClick={() => {
                          this.setState({ showModalSuivi: false });
                        }}
                      >
                        {t("btns.fermer")}
                      </Button>,
                    ]}
                  >
                    {this.state.mystate ? (
                      <div className={"container"}>
                        <div className="row">
                          <div className="col-md-12 mb-4 text-center d-flex justify-content-center align-items-center gap-2 flex-column flex-md-row">
                            <LazyLoadImage
                              src={"images/suisBagage.png"}
                              alt={"suisBagage"}
                            />
                            <label
                              className={
                                "text-blue fw-500 fs-4 text-md-left text-center"
                              }
                            >
                              <Trans i18nKey={"suisBagage"}>
                                Suis <br /> ton bagage
                              </Trans>
                            </label>
                          </div>
                          <div className="col-md-12 text-center">
                            <div
                              className={
                                "d-flex flex-column flex-md-row  justify-content-around gap-3 mb-4"
                              }
                            >
                              <div
                                className={
                                  "d-flex flex-row gap-3 align-items-center justify-content-center"
                                }
                              >
                                {this.state.mystate.objectTransport.includes(
                                  "Voiture"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="35.965"
                                    height="17.26"
                                    viewBox="0 0 35.965 17.26"
                                  >
                                    <g
                                      id="car-svgrepo-com_1_"
                                      data-name="car-svgrepo-com (1)"
                                      transform="translate(0 0)"
                                    >
                                      <g
                                        id="Groupe_3569"
                                        data-name="Groupe 3569"
                                      >
                                        <path
                                          id="Tracé_4987"
                                          data-name="Tracé 4987"
                                          d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                                          transform="translate(19.229 -6.929)"
                                        />
                                        <path
                                          id="Tracé_4988"
                                          data-name="Tracé 4988"
                                          d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                                          transform="translate(0 -8.177)"
                                        />
                                        <path
                                          id="Tracé_4989"
                                          data-name="Tracé 4989"
                                          d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                                          transform="translate(-16.083 -6.929)"
                                        />
                                      </g>
                                    </g>
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Car"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32.58"
                                    height="16.883"
                                    viewBox="0 0 32.58 16.883"
                                  >
                                    <g
                                      id="bus-svgrepo-com_2_"
                                      data-name="bus-svgrepo-com (2)"
                                      transform="translate(0 -83.368)"
                                    >
                                      <g
                                        id="Groupe_4744"
                                        data-name="Groupe 4744"
                                        transform="translate(0 83.368)"
                                      >
                                        <path
                                          id="Tracé_6610"
                                          data-name="Tracé 6610"
                                          d="M32.439,89.572l-3.913-5.73a1.233,1.233,0,0,0-1.021-.474H1.153A1.046,1.046,0,0,0,0,84.254v12.8a1.046,1.046,0,0,0,1.153.886H5.62c1.154,3.076,6.851,3.079,8.007,0h4.1c1.154,3.076,6.851,3.079,8.006,0h5.7a1.046,1.046,0,0,0,1.153-.886V90A.745.745,0,0,0,32.439,89.572Zm-28.7,6.6H2.305v-1.1H3.737Zm-1.432-7.06V85.139H9.759v3.972Zm7.318,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.847,3.594-1.906,3.72-.077,0,.025,0,.051,0,.077,0,0,0,0,0,0A1.693,1.693,0,0,1,9.623,98.488Zm2.441-9.377V85.139h8.452v3.972Zm9.665,9.377a1.691,1.691,0,0,1-1.862-1.431c0-1.845,3.6-1.9,3.72-.075,0,.025,0,.049,0,.075v0A1.691,1.691,0,0,1,21.728,98.488Zm1.093-9.377V85.139h3.988l2.712,3.972Zm7.453,2.872H28.843v-1.1h1.432Z"
                                          transform="translate(0 -83.368)"
                                        />
                                      </g>
                                    </g>
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Camion"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="33.884"
                                    height="17.048"
                                    viewBox="0 0 33.884 17.048"
                                  >
                                    <path
                                      id="truck-svgrepo-com_1_"
                                      data-name="truck-svgrepo-com (1)"
                                      d="M31.718,104.339c-.106-.019-.207-.037-.3-.057-1.013-.227-1.475-.352-1.816-.921l-1.294-2.26a3.055,3.055,0,0,0-2.394-1.256h-2.3v-2.61a.926.926,0,0,0-.985-.85L6.579,96.4a.869.869,0,0,0-.928.843v.772H1.54a1.343,1.343,0,1,0,0,2.657H5.651v1.273H2.959a1.343,1.343,0,1,0,0,2.657H5.651v1.273H4.379a1.343,1.343,0,1,0,0,2.657H5.651v1.332a.926.926,0,0,0,.985.85H8.306a3.565,3.565,0,0,0,3.651,2.722,3.566,3.566,0,0,0,3.651-2.722h6.756c.035,0,.071,0,.107,0a3.564,3.564,0,0,0,3.652,2.726,3.566,3.566,0,0,0,3.651-2.722h2.4a1.609,1.609,0,0,0,1.712-1.477v-2.506A2.158,2.158,0,0,0,31.718,104.339Zm-5.6,4.752a1.17,1.17,0,1,1-1.341,1.157A1.261,1.261,0,0,1,26.123,109.091Zm-2.51-4.932v-3.082h1.761a2.363,2.363,0,0,1,1.821.954l1.152,2.012q.037.061.076.117h-4.81ZM13.3,110.249a1.261,1.261,0,0,1-1.342,1.157,1.17,1.17,0,1,1,0-2.314A1.261,1.261,0,0,1,13.3,110.249Z"
                                      transform="translate(0 -96.384)"
                                    />
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Avion"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32.625"
                                    height="17.048"
                                    viewBox="0 0 32.625 17.048"
                                  >
                                    <g
                                      id="XMLID_909_"
                                      transform="translate(0 -110.089)"
                                    >
                                      <g
                                        id="Groupe_4745"
                                        data-name="Groupe 4745"
                                        transform="translate(0 110.089)"
                                      >
                                        <path
                                          id="Tracé_6611"
                                          data-name="Tracé 6611"
                                          d="M29.322,113.082H6.565l-2.974-2.757a.882.882,0,0,0-.6-.235H.773a.32.32,0,0,0-.3.443l1.1,2.643H1.061a1.061,1.061,0,0,0,0,2.123h1.39l.873,2.106a3.7,3.7,0,0,0,3.421,2.285H8.765l-4.252,6.5a.615.615,0,0,0,.515.953H6.684a4.93,4.93,0,0,0,2.335-.588l1.528-.822h5.2a1.061,1.061,0,1,0,0-2.123H14.493l2.1-1.131H20.9a1.061,1.061,0,1,0,0-2.123h-.359l1.231-.662h7.548a3.3,3.3,0,1,0,0-6.607Z"
                                          transform="translate(0 -110.089)"
                                        />
                                      </g>
                                    </g>
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Train"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="21.018"
                                    height="18.048"
                                    viewBox="0 0 21.018 18.048"
                                  >
                                    <g
                                      id="train-svgrepo-com_2_"
                                      data-name="train-svgrepo-com (2)"
                                      transform="translate(0 -20.392)"
                                    >
                                      <path
                                        id="Tracé_6612"
                                        data-name="Tracé 6612"
                                        d="M20.972,34.567l-.717-1.816a.66.66,0,0,0-.613-.417H17.173a.928.928,0,0,0,.786-.435,6,6,0,0,0,0-6.367.927.927,0,0,0-.786-.435h-.826V22.815h.426a.477.477,0,0,0,.477-.477v-.522a.477.477,0,0,0-.477-.477H13.264a.477.477,0,0,0-.477.477v.522a.477.477,0,0,0,.477.477h.426V25.1H10.86V21.052a.66.66,0,0,0-.66-.66H.66a.66.66,0,0,0-.66.66v1.01a.66.66,0,0,0,.66.66H1.4v9.613H.66a.66.66,0,0,0-.66.66V34.81a.66.66,0,0,0,.66.66H2.093a4.063,4.063,0,0,1,8.126,0h1.966a3.12,3.12,0,0,1,5.993,0h2.18a.66.66,0,0,0,.614-.9ZM8.5,28.865a.62.62,0,0,1-.62.62H4.208a.62.62,0,0,1-.62-.62v-3.1a2.458,2.458,0,1,1,4.917,0v3.1Z"
                                      />
                                      <path
                                        id="Tracé_6613"
                                        data-name="Tracé 6613"
                                        d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                                        transform="translate(-40.553 -154.141)"
                                      />
                                    </g>
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Bateau"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24.57"
                                    height="20.641"
                                    viewBox="0 0 24.57 20.641"
                                  >
                                    <path
                                      id="boat-svgrepo-com"
                                      d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                                      transform="translate(0 -16.99)"
                                    />
                                  </svg>
                                ) : null}
                                {this.state.mystate.objectTransport.includes(
                                  "Indifferent"
                                ) ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="15.308"
                                    height="26.276"
                                    viewBox="0 0 15.308 26.276"
                                  >
                                    <g
                                      id="standing-man-svgrepo-com"
                                      transform="translate(-25.906)"
                                    >
                                      <g
                                        id="Groupe_8941"
                                        data-name="Groupe 8941"
                                        transform="translate(25.906 0)"
                                      >
                                        <path
                                          id="Tracé_7680"
                                          data-name="Tracé 7680"
                                          d="M40.432,28.066a1.055,1.055,0,0,0-1.293.746,1,1,0,0,1-.357.6.465.465,0,0,1-.327-.037,4.868,4.868,0,0,1-2.079-1.51,4.669,4.669,0,0,0-1.047-.942,3.13,3.13,0,0,0-1.11-.521l-.677.682-.657-.689h-.007a3.088,3.088,0,0,0-1.326.688,5.639,5.639,0,0,0-.8.781,4.869,4.869,0,0,1-2.079,1.51.467.467,0,0,1-.327.037,1,1,0,0,1-.357-.6,1.056,1.056,0,0,0-2.039.548,2.951,2.951,0,0,0,1.444,1.94,2.294,2.294,0,0,0,1.04.246,2.758,2.758,0,0,0,1.009-.2,7.265,7.265,0,0,0,1.321-.671v4.1a2.13,2.13,0,0,0,.21.925c0,.012,0,.022,0,.034l-.009,10.108A1.247,1.247,0,0,0,32.2,47.085h0a1.248,1.248,0,0,0,1.247-1.247l.008-8.673c.028,0,.055,0,.083,0s.064,0,.1,0v8.673a1.248,1.248,0,1,0,2.5,0V35.73c0-.022-.005-.041-.006-.062a2.127,2.127,0,0,0,.2-.9V30.646a7.225,7.225,0,0,0,1.363.7,2.756,2.756,0,0,0,1.009.2,2.3,2.3,0,0,0,1.04-.246,2.95,2.95,0,0,0,1.444-1.94A1.056,1.056,0,0,0,40.432,28.066Zm-6.886,4.4h-.013l-.656-.9.656-4.383h.013l.656,4.383Z"
                                          transform="translate(-25.906 -20.81)"
                                        />
                                        <circle
                                          id="Ellipse_139"
                                          data-name="Ellipse 139"
                                          cx="2.719"
                                          cy="2.719"
                                          r="2.719"
                                          transform="translate(4.914)"
                                        />
                                      </g>
                                    </g>
                                  </svg>
                                ) : null}
                              </div>
                              <div>
                                <p
                                  className={
                                    "d-flex flex-row gap-3 justify-content-center"
                                  }
                                >
                                  {" "}
                                  {t("circuit_depot_annonce.dateDep")}
                                  <span style={{ color: "#707A85" }}>
                                    {this.state.mystate.dateDepart}
                                  </span>
                                </p>
                                <p
                                  className={
                                    "d-flex flex-row gap-3 justify-content-center"
                                  }
                                >
                                  {" "}
                                  {t("circuit_depot_annonce.heureDep")}
                                  <span style={{ color: "#707A85" }}>
                                    {this.state.mystate.heureDepart}
                                  </span>
                                </p>
                              </div>
                              <div>
                                <span>{this.state.client.firstName} </span>
                                <br />
                                <span className={"text-orange mr-2"}>
                                  {this.state.mesInfoAvis.total}
                                </span>
                                <LazyLoadImage
                                  src={"/images/star.png"}
                                  alt={"avis"}
                                  className={"mr-2"}
                                />
                              </div>
                              <div>
                                <button className={"btnStatut"}>
                                  {t("statut")}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div
                            className="col-md-12 text-center"
                            style={{ paddingTop: 100 }}
                          >
                            <div className={"rect"}></div>
                            <label className={"depart"}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18.159"
                                height="23.484"
                                viewBox="0 0 18.159 23.484"
                              >
                                <g
                                  id="pin-svgrepo-com_2_"
                                  data-name="pin-svgrepo-com (2)"
                                  transform="translate(17.909 23.234) rotate(180)"
                                >
                                  <g
                                    id="Groupe_4899"
                                    data-name="Groupe 4899"
                                    transform="translate(0)"
                                  >
                                    <g
                                      id="Groupe_4898"
                                      data-name="Groupe 4898"
                                      transform="translate(0)"
                                    >
                                      <path
                                        id="Tracé_6731"
                                        data-name="Tracé 6731"
                                        d="M8.829,0C5.543,0,0,9.648,0,14.155a8.829,8.829,0,1,0,17.659,0C17.659,9.648,12.116,0,8.829,0Zm0,22.143A8,8,0,0,1,.841,14.154C.841,9.439,6.442.841,8.829.841s7.988,8.6,7.988,13.314A8,8,0,0,1,8.829,22.143Z"
                                        fill="#fff"
                                        stroke="#fff"
                                        stroke-width="0.5"
                                      />
                                      <path
                                        id="Tracé_6732"
                                        data-name="Tracé 6732"
                                        d="M3.363,0A3.363,3.363,0,1,0,6.727,3.363,3.367,3.367,0,0,0,3.363,0Zm0,5.886A2.523,2.523,0,1,1,5.886,3.364,2.525,2.525,0,0,1,3.363,5.886Z"
                                        transform="translate(5.466 12.648)"
                                        fill="#fff"
                                        stroke="#fff"
                                        stroke-width="0.5"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              {this.state.mystate.ville_depart}
                              <LazyLoadImage
                                src={
                                  "/images/" +
                                  this.state.mystate.type_adresse_depart
                                    .toLowerCase()
                                    .replace(" ", "") +
                                  ".png"
                                }
                                alt={this.state.mystate.type_adresse_depart}
                              />
                              {this.state.mystate.type_adresse_depart}
                            </label>

                            <div className={"rect2"}></div>
                            <label className={"arrivee"}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18.159"
                                height="23.484"
                                viewBox="0 0 18.159 23.484"
                              >
                                <g
                                  id="pin-svgrepo-com_2_"
                                  data-name="pin-svgrepo-com (2)"
                                  transform="translate(17.909 23.234) rotate(180)"
                                >
                                  <g
                                    id="Groupe_4899"
                                    data-name="Groupe 4899"
                                    transform="translate(0)"
                                  >
                                    <g
                                      id="Groupe_4898"
                                      data-name="Groupe 4898"
                                      transform="translate(0)"
                                    >
                                      <path
                                        id="Tracé_6731"
                                        data-name="Tracé 6731"
                                        d="M8.829,0C5.543,0,0,9.648,0,14.155a8.829,8.829,0,1,0,17.659,0C17.659,9.648,12.116,0,8.829,0Zm0,22.143A8,8,0,0,1,.841,14.154C.841,9.439,6.442.841,8.829.841s7.988,8.6,7.988,13.314A8,8,0,0,1,8.829,22.143Z"
                                        fill="#fff"
                                        stroke="#fff"
                                        stroke-width="0.5"
                                      />
                                      <path
                                        id="Tracé_6732"
                                        data-name="Tracé 6732"
                                        d="M3.363,0A3.363,3.363,0,1,0,6.727,3.363,3.367,3.367,0,0,0,3.363,0Zm0,5.886A2.523,2.523,0,1,1,5.886,3.364,2.525,2.525,0,0,1,3.363,5.886Z"
                                        transform="translate(5.466 12.648)"
                                        fill="#fff"
                                        stroke="#fff"
                                        stroke-width="0.5"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              {this.state.mystate.ville_arrivee}
                              <LazyLoadImage
                                src={
                                  "/images/" +
                                  this.state.mystate.type_adresse_arrivee
                                    .toLowerCase()
                                    .replace(" ", "") +
                                  ".png"
                                }
                                alt={this.state.mystate.type_adresse_arrivee}
                              />
                              {this.state.mystate.type_adresse_arrivee}
                            </label>
                          </div>
                          <div className="col-md-12 text-center">
                            <div>
                              {t("circuit_depot_annonce.dateArr")}{" "}
                              <span style={{ color: "#707A85" }}>
                                {this.state.mystate.dateArrivee}
                              </span>
                              <br />
                              {t("circuit_depot_annonce.heureArr")}{" "}
                              <span style={{ color: "#707A85" }}>
                                {this.state.mystate.heureArrivee}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </Modal>
                </div>
              </div>
            )}
          </div>
        </div>
      );
  }
}

export default withTranslation()(Annonces);
