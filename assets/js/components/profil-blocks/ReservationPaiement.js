import React, { Component, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faEye,
  faFile,
  faFileAlt,
  faImage,
  faLock,
  faMapMarker,
  faPhone,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, Modal, Select, Upload, DatePicker } from "antd";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { withTranslation, Trans } from "react-i18next";
import locale from "antd/es/date-picker/locale/fr_FR";
import { user } from "../../app";

const { RangePicker } = DatePicker;

class ReservationPaiement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusName: props.t("page_annonce.ann_enAttente"),
      status: "0",
      client: {},
      annonces: {
        avenir: [
          {
            id: 3,
            proprietaire: { firstName: "mickel", photo: "", tags: 20 },
            porteur: { firstName: "elie", photo: "", tags: 20 },
            gallery: [{ id: 2, url: "" }],
            ville_depart: "paris",
            dateDepart: "11-06-2023",
            heureDepart: "11:55",
            ville_arrivee: "lyon",
            dateArrivee: "11-06-2023",
            heureArrivee: "14:55",
            status: 0,
            dimensionsLarg: 20,
            dimensionsH: 20,
            dimensionsLong: 20,
            dimensionsKg: 20,
            type_adresse_arrivee: "Indifferent",
            type_adresse_depart: "Indifferent",
            objectType: "Bagage",
            objectTransport: "Voiture",
            price: 5,
          },
        ],
        mutuel: [
          {
            id: 12,
            proprietaire: { firstName: "mickel", photo: "", tags: 20 },
            porteur: { firstName: "elie", photo: "", tags: 20 },
            ville_depart: "paris",
            dateDepart: "11-06-2023",
            gallery: [{ id: 2, url: "" }],
            heureDepart: "11:55",
            ville_arrivee: "lyon",
            dateArrivee: "11-06-2023",
            heureArrivee: "14:55",
            status: 1,
            dimensionsLarg: 20,
            dimensionsH: 20,
            dimensionsLong: 20,
            dimensionsKg: 20,
            type_adresse_arrivee: "Indifferent",
            type_adresse_depart: "Indifferent",
            objectType: "Bagage",
            objectTransport: "Voiture",
            price: 5,
          },
        ],
        passe: [
          {
            id: 15,
            proprietaire: { firstName: "mickel", photo: "", tags: 20 },
            porteur: { firstName: "elie", photo: "", tags: 20 },
            ville_depart: "paris",
            dateDepart: "11-06-2023",
            gallery: [{ id: 2, url: "" }],
            heureDepart: "11:55",
            ville_arrivee: "lyon",
            dateArrivee: "11-06-2023",
            heureArrivee: "14:55",
            status: 2,
            dimensionsLarg: 20,
            dimensionsH: 20,
            dimensionsLong: 20,
            dimensionsKg: 20,
            type_adresse_arrivee: "Indifferent",
            type_adresse_depart: "Indifferent",
            objectType: "Bagage",
            objectTransport: "Voiture",
            price: 5,
          },
        ],
      },
      loading: true,
    };

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
    this.getAnnonces();
  }

  getAnnonces() {
    if (user)
      this.setState({ client: user.client }, () => {
        axios
          .post(`api/relais/list/annonce`, {
            token: this.state.client.token,
          })
          .then((res) => {
            this.setState(
              { annonces: res.data.data, loading: false },
              () => {
                console.log(this.state.annonces);
              }
            );
          })
          .catch((e) => {
            this.setState({ loading: false }, () => {
              console.log(this.state.annonces);
            });
          });
      });
  }

  render() {
    const uploadButton = (
      <div className={"position-relative"}>
        <LazyLoadImage
          src={"/images/avatar-person.png"}
          alt={"avatar-person"}
          style={{ width: "60px", height: '60px',
            objectFit:'cover',
            borderRadius: "50%" }}
        />
      </div>
    );
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
          <span
            className={"d-block text-center"}
            style={{ fontSize: 12 }}
            onClick={() => {
              this.setState({ visibleProcuration: true });
            }}
          >
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ color: "#38BFEF", fontSize: 23 }}
            />
            <br />
            {t("page_annonce.procuration")}
          </span>
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

    const CollectionCreateFormCause = ({
      visibleCause,
      onCreateCause,
      onCancelCause,
    }) => {
      const [form] = Form.useForm();
      return (
        <Modal
          visible={visibleCause}
          okText="Signaler"
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields();
                onCreateCause(values);
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
          onCancel={onCancelCause}
          footer={[
            <Button
              key="submit"
              type="primary"
              className={"w-50"}
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    onCreateCause(values);
                  })
                  .catch((info) => {
                    console.log("Validate Failed:", info);
                  });
              }}
            >
              Envoyer
            </Button>,
          ]}
        >
          <div className={"text-center"}>
          <p
              className="ff-Gordita-Medium"
              style={{ color: "#1C2D5A", fontSize: "20px" }}
            >
              Signaler
            </p>
            <LazyLoadImage
              src={"/images/signaler.png"}
              alt={"signaler"}
              width={"55%"}
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            name="signalement"
            requiredMark={false}
          >
            <Form.Item
              name="sujet"
              label={
                <span className="requis">
            Objet
        </span>
            }
              rules={[
                {
                  required: true,
                  message: "Objet ne doit pas etre vide",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="message"
              label={
                <span className="requis">
            Message
        </span>
            }
              rules={[
                {
                  required: true,
                  message: "Message ne doit pas etre vide",
                },
              ]}
            >
              <Input.TextArea maxLength="750" rows="5"/>
            </Form.Item>
          </Form>
        </Modal>
      );
    };

    const CollectionsPageCause = (props) => {
        const [visibleCause, setVisibleCause] = useState(false);
      const onCreateCause = (values) => {
        axios
          .post(`api/signalement/create?token=`+user.client.token, {
              sujet: values.sujet,
              message: values.message,
            })
          .then(function (res) {
            const modal = Modal.success({
              content: (
                <div
                  className={"text-center"}
                  key={"cancel-order-" + Math.random()}
                >
                  <LazyLoadImage
                    src={"/images/logo.png"}
                    width={"65px"}
                    alt={"bagzee"}
                  />

                  <p className={"text-success pt-2"}>{res.data.message}</p>
                </div>
              ),
              okText: "ok",
            });
            setTimeout(() => {
              modal.destroy();
            }, 5000);
          });
        setVisibleCause(false);

      };

      return (
        <span>
          <button
            className={"btnBlue"}
            onClick={() => {
                setVisibleCause(true);

            }}
          >
            {t("btns.signaler")}
          </button>
          <CollectionCreateFormCause
            key={"annuler-order-" + Math.random()}
            visibleCause={visibleCause}
            onCreateCause={onCreateCause}
            onCancelCause={() => {
                setVisibleCause(false);
            }}
          />
        </span>
      );
    };

    let loading = this.state.loading;
    const { t } = this.props;
    console.log(this.props);
    return (
      <div className={"profil_blocks Reservation"}>
        <div className={"container py-2 px-4"}>
          {loading ? (
            <p className={"text-center my-5"}>
              <span className="fa fa-spin fa-spinner fa-4x"></span>
            </p>
          ) : (
            <div className={"row mb-3"}>
              <div className={"col-12 col-md-3 pt-4 mb-4"}>
                <Upload
                  previewFile={this.state.client.photo}
                  style={{ width: "60px",height: '60px',
                    objectFit:'cover',
                    borderRadius: "50%" }}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader d-block text-center"
                  showUploadList={false}
                  action=""
                >
                  {this.state.client.photo ? (
                    <div className={"position-relative"}>
                      <LazyLoadImage
                        src={this.state.client.photo}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
              <div className={"col-12 col-md-9 pt-4 mb-4"}>
                <p className={"fs-small"}>
                  {this.state.client.description?this.state.client.description:<>Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.</>}
                </p>
              </div>
              <div className={"col-12 pt-4 mb-4"}>
                <div
                  className={
                    "d-flex flex-column flex-md-row justify-content-end gap-3 align-items-center filterAnnonce"
                  }
                >
                  <RangePicker
                    locale={locale}
                    onChange={(date, dateString) => {
                      console.log("Formatted Selected Time: ", dateString);
                      this.setState({
                        dateDeb: dateString[0],
                        dateFin: dateString[1],
                      });
                    }}
                    style={{ background: "#fff" }}
                  />
                </div>
                {this.state.annonces ? (
                  <>
                    <p className={"text-uppercase mt-3"}>Contrôle à venir</p>
                    {this.state.annonces.avenir?.map((order, key) => (
                      <div className={"row "} key={"annonce-" + order.id}>
                        <div
                          className={" col-md-12 bg-white role-proprietaire mb-3"}
                        >
                          <div className={"row"}>
                            <div className={"col-lg-9"}>
                              <div className={"row h-100"}>
                                <div
                                  className="col-lg-3 text-center py-4 borderRight"
                                  style={{ borderColor: "#4BBEED" }}
                                >
                                  <p style={{ color: "#38BFEF", fontSize: 15 }}>
                                    {t("proprietaire")}
                                  </p>
                                  <div
                                    className={
                                      "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                    }
                                  >
                                    <div>
                                      {order.proprietaire.photo ? (
                                        <div className={"position-relative"}>
                                          <LazyLoadImage
                                            src={order.proprietaire.photo}
                                            alt={order.proprietaire.firstName}
                                            style={{
                                              width: "60px",
                                              height: '60px',
                                              objectFit:'cover',
                                              borderRadius: "50%",
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <LazyLoadImage
                                          src={"/images/avatar-person.png"}
                                          alt={order.proprietaire.firstName}
                                          style={{
                                            width: "60px",
                                            height: '60px',
                                            objectFit:'cover',
                                            borderRadius: "50%",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <p className={"mb-0"}>
                                        {order.proprietaire.firstName}
                                      </p>
                                      <button
                                        className={"d-block btnStatut my-2"}
                                      >
                                        {t("statut")}
                                      </button>
                                      <span>
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                        <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className="col-lg-3 text-center py-4  borderRight"
                                  style={{ borderColor: "#4BBEED" }}
                                >
                                  <p style={{ color: "#EF7723", fontSize: 15 }}>
                                    {t("porteur")}
                                  </p>
                                  <div
                                    className={
                                      "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                    }
                                  >
                                    <div>
                                      {order.porteur.photo ? (
                                        <div className={"position-relative"}>
                                          <LazyLoadImage
                                            src={order.porteur.photo}
                                            alt={order.porteur.firstName}
                                            style={{
                                              width: "60px",
                                              height: '60px',
                                              objectFit:'cover',
                                              borderRadius: "50%",
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <LazyLoadImage
                                          src={"/images/avatar-person.png"}
                                          alt={order.porteur.firstName}
                                          style={{
                                            width: "60px",
                                            height: '60px',
                                            objectFit:'cover',
                                            borderRadius: "50%",
                                          }}
                                        />
                                      )}
                                    </div>
                                    <div>
                                      <p className={"mb-0"}>
                                        {order.porteur.firstName}
                                      </p>
                                      <button
                                        className={"d-block btnStatut my-2"}
                                      >
                                        {t("statut")}
                                      </button>
                                      <span
                                        onClick={() => {
                                          this.setState({
                                            showModalSuivi: true,
                                            mystate: order,
                                          });
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                        <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    "col-lg-5 py-4 d-flex flex-column align-items-center justify-content-between borderRight"
                                  }
                                  style={{ borderColor: "#4BBEED" }}
                                >
                                  <div className={"row"}>
                                    <div className={"col-md-2"}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20.6"
                                        height="26.662"
                                        viewBox="0 0 20.6 26.662"
                                        style={{
                                          position: "absolute",
                                          left: -12,
                                          top: -5,
                                        }}
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
                                          "d-flex flex-md-row flex-column w-100 justify-content-between py-3"
                                        }
                                      >
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                          <br />
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                        <span>
                                          <FontAwesomeIcon
                                            icon={faCalendar}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateArrivee}
                                          <br />
                                          <FontAwesomeIcon
                                            icon={faClock}
                                            style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureArrivee}
                                        </span>
                                      </div>
                                    </div>
                                    <div className={"col-md-2"}>
                                      {order.ville_arrivee}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20.6"
                                        height="26.662"
                                        viewBox="0 0 20.6 26.662"
                                        style={{
                                          position: "absolute",
                                          right: -12,
                                          top: -5,
                                        }}
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
                                    <div className={"col-md-12"}>
                                      <div
                                        className={
                                          "d-flex flex-md-row flex-column justify-content-between"
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
                                          {order.objectType.includes("Chat") ? (
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
                                  </div>
                                </div>
                                <div
                                  className={
                                    "col-lg-1 py-4 d-flex flex-column align-items-center justify-content-around"
                                  }
                                >
                                  <CollectionsProcuration
                                    orderId={order.id}
                                    key={
                                      "CollectionsProcuration-" + Math.random()
                                    }
                                  />
                                  <span
                                    className={"d-block text-center"}
                                    style={{ fontSize: 12 }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faImage}
                                      style={{
                                        color: "#38BFEF",
                                        fontSize: 23,
                                      }}
                                    />
                                    <br />
                                    {t("photos")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={"col-lg-3 borderLeft"}
                              style={{ borderColor: "#4BBEED" }}
                            >
                              <div
                                className={"row"}
                                style={{ borderBottom: "5px solid #4BBEED" }}
                              >
                                <div
                                  className={"col-6 py-3 pr-3 borderRight"}
                                  style={{ borderColor: "#4BBEED" }}
                                >
                                  <p
                                    className={
                                      "text-center ff-Gordita-Medium fs-3 text-blue mb-0"
                                    }
                                  >
                                    {order.price ? order.price + "€" : "0€"}
                                  </p>
                                </div>
                                <div className={"col-6 py-3 pr-3"}>
                                  <p
                                    className={
                                      "text-center fs-5 ff-Gordita-Medium text-gris mb-0"
                                    }
                                  >
                                    {order.status==0?'En attente':order.status==2 || order.isValid==2?'Annulé':
                                        order.status==1 && order.isValid==1&& order.isPaied==1?'Payé':
                                            order.status==1 && order.isValid==1 && order.isPaied==0?'Validé':'Encours'}
                                  </p>
                                </div>
                              </div>
                              <div className={"row py-3 pr-3"}>
                                <div className={"col-md-12"}>
                                  <button
                                    className={"btnBlue myAltBtn"}
                                    onClick={() => {
                                      this.setState({
                                        orderId: order.id,
                                      });
                                    }}
                                  >
                                    {t("btns.confirmerDepot")}
                                  </button>
                                </div>
                                <div className={"col-md-12"}>
                                    <CollectionsPageCause order={order.id} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <p className={"text-uppercase mt-3"}>Contrôle mutuel</p>
                    {this.state.annonces.mutuel?.map((order, key) => (
                        <div className={"row "} key={"annonce-" + order.id}>
                          <div
                              className={" col-md-12 bg-white role-proprietaire mb-3"}
                          >
                            <div className={"row"}>
                              <div className={"col-lg-9"}>
                                <div className={"row h-100"}>
                                  <div
                                      className="col-lg-3 text-center py-4 borderRight"
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p style={{ color: "#38BFEF", fontSize: 15 }}>
                                      {t("proprietaire")}
                                    </p>
                                    <div
                                        className={
                                          "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                        }
                                    >
                                      <div>
                                        {order.proprietaire.photo ? (
                                            <div className={"position-relative"}>
                                              <LazyLoadImage
                                                  src={order.proprietaire.photo}
                                                  alt={order.proprietaire.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: '60px',
                                                    objectFit:'cover',
                                                    borderRadius: "50%",
                                                  }}
                                              />
                                            </div>
                                        ) : (
                                            <LazyLoadImage
                                                src={"/images/avatar-person.png"}
                                                alt={order.proprietaire.firstName}
                                                style={{
                                                  width: "60px",
                                                  height: '60px',
                                                  objectFit:'cover',
                                                  borderRadius: "50%",
                                                }}
                                            />
                                        )}
                                      </div>
                                      <div>
                                        <p className={"mb-0"}>
                                          {order.proprietaire.firstName}
                                        </p>
                                        <button
                                            className={"d-block btnStatut my-2"}
                                        >
                                          {t("statut")}
                                        </button>
                                        <span>
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                          <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                      className="col-lg-3 text-center py-4  borderRight"
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p style={{ color: "#EF7723", fontSize: 15 }}>
                                      {t("porteur")}
                                    </p>
                                    <div
                                        className={
                                          "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                        }
                                    >
                                      <div>
                                        {order.porteur.photo ? (
                                            <div className={"position-relative"}>
                                              <LazyLoadImage
                                                  src={order.porteur.photo}
                                                  alt={order.porteur.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: '60px',
                                                    objectFit:'cover',
                                                    borderRadius: "50%",
                                                  }}
                                              />
                                            </div>
                                        ) : (
                                            <LazyLoadImage
                                                src={"/images/avatar-person.png"}
                                                alt={order.porteur.firstName}
                                                style={{
                                                  width: "60px",
                                                  height: '60px',
                                                  objectFit:'cover',
                                                  borderRadius: "50%",
                                                }}
                                            />
                                        )}
                                      </div>
                                      <div>
                                        <p className={"mb-0"}>
                                          {order.porteur.firstName}
                                        </p>
                                        <button
                                            className={"d-block btnStatut my-2"}
                                        >
                                          {t("statut")}
                                        </button>
                                        <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                        >
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                          <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                      className={
                                        "col-lg-5 py-4 d-flex flex-column align-items-center justify-content-between borderRight"
                                      }
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <div className={"row"}>
                                      <div className={"col-md-2"}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20.6"
                                            height="26.662"
                                            viewBox="0 0 20.6 26.662"
                                            style={{
                                              position: "absolute",
                                              left: -12,
                                              top: -5,
                                            }}
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
                                              "d-flex flex-md-row flex-column w-100 justify-content-between py-3"
                                            }
                                        >
                                        <span>
                                          <FontAwesomeIcon
                                              icon={faCalendar}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                          <br />
                                          <FontAwesomeIcon
                                              icon={faClock}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                          <span>
                                          <FontAwesomeIcon
                                              icon={faCalendar}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                            {order.dateArrivee}
                                            <br />
                                          <FontAwesomeIcon
                                              icon={faClock}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                            {order.heureArrivee}
                                        </span>
                                        </div>
                                      </div>
                                      <div className={"col-md-2"}>
                                        {order.ville_arrivee}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20.6"
                                            height="26.662"
                                            viewBox="0 0 20.6 26.662"
                                            style={{
                                              position: "absolute",
                                              right: -12,
                                              top: -5,
                                            }}
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
                                      <div className={"col-md-12"}>
                                        <div
                                            className={
                                              "d-flex flex-md-row flex-column justify-content-between"
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
                                            {order.objectType.includes("Chat") ? (
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
                                    </div>
                                  </div>
                                  <div
                                      className={
                                        "col-lg-1 py-4 d-flex flex-column align-items-center justify-content-around"
                                      }
                                  >
                                    <CollectionsProcuration
                                        orderId={order.id}
                                        key={
                                          "CollectionsProcuration-" + Math.random()
                                        }
                                    />
                                    <span
                                        className={"d-block text-center"}
                                        style={{ fontSize: 12 }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        style={{
                                          color: "#38BFEF",
                                          fontSize: 23,
                                        }}
                                    />
                                    <br />
                                      {t("photos")}
                                  </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                  className={"col-lg-3 borderLeft"}
                                  style={{ borderColor: "#4BBEED" }}
                              >
                                <div
                                    className={"row"}
                                    style={{ borderBottom: "5px solid #4BBEED" }}
                                >
                                  <div
                                      className={"col-6 py-3 pr-3 borderRight"}
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p
                                        className={
                                          "text-center ff-Gordita-Medium fs-3 text-blue mb-0"
                                        }
                                    >
                                      {order.price ? order.price + "€" : "0€"}
                                    </p>
                                  </div>
                                  <div className={"col-6 py-3 pr-3"}>
                                    <p
                                        className={
                                          "text-center fs-5 ff-Gordita-Medium text-gris mb-0"
                                        }
                                    >
                                      En attente
                                    </p>
                                  </div>
                                </div>
                                <div className={"row py-3 pr-3"}>
                                  <div className={"col-md-12"}>
                                    <button
                                        className={"btnBlue myAltBtn"}
                                        onClick={() => {
                                          this.setState({
                                            orderId: order.id,
                                          });
                                        }}
                                    >
                                      {t("btns.confirmerDepot")}
                                    </button>
                                  </div>
                                  <div className={"col-md-12"}>
                                    <CollectionsPageCause order={order.id} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                    <p className={"text-uppercase mt-3"}>Contrôle passés</p>
                    {this.state.annonces.passe?.map((order, key) => (
                        <div className={"row "} key={"annonce-" + order.id}>
                          <div
                              className={" col-md-12 bg-white role-proprietaire mb-3"}
                          >
                            <div className={"row"}>
                              <div className={"col-lg-9"}>
                                <div className={"row h-100"}>
                                  <div
                                      className="col-lg-3 text-center py-4 borderRight"
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p style={{ color: "#38BFEF", fontSize: 15 }}>
                                      {t("proprietaire")}
                                    </p>
                                    <div
                                        className={
                                          "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                        }
                                    >
                                      <div>
                                        {order.proprietaire.photo ? (
                                            <div className={"position-relative"}>
                                              <LazyLoadImage
                                                  src={order.proprietaire.photo}
                                                  alt={order.proprietaire.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: '60px',
                                                    objectFit:'cover',
                                                    borderRadius: "50%",
                                                  }}
                                              />
                                            </div>
                                        ) : (
                                            <LazyLoadImage
                                                src={"/images/avatar-person.png"}
                                                alt={order.proprietaire.firstName}
                                                style={{
                                                  width: "60px",
                                                  height: '60px',
                                                  objectFit:'cover',
                                                  borderRadius: "50%",
                                                }}
                                            />
                                        )}
                                      </div>
                                      <div>
                                        <p className={"mb-0"}>
                                          {order.proprietaire.firstName}
                                        </p>
                                        <button
                                            className={"d-block btnStatut my-2"}
                                        >
                                          {t("statut")}
                                        </button>
                                        <span>
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                          <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                      className="col-lg-3 text-center py-4  borderRight"
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p style={{ color: "#EF7723", fontSize: 15 }}>
                                      {t("porteur")}
                                    </p>
                                    <div
                                        className={
                                          "d-flex flex-md-row flex-column justify-content-between align-items-center"
                                        }
                                    >
                                      <div>
                                        {order.porteur.photo ? (
                                            <div className={"position-relative"}>
                                              <LazyLoadImage
                                                  src={order.porteur.photo}
                                                  alt={order.porteur.firstName}
                                                  style={{
                                                    width: "60px",
                                                    height: '60px',
                                                    objectFit:'cover',
                                                    borderRadius: "50%",
                                                  }}
                                              />
                                            </div>
                                        ) : (
                                            <LazyLoadImage
                                                src={"/images/avatar-person.png"}
                                                alt={order.porteur.firstName}
                                                style={{
                                                  width: "60px",
                                                  height: '60px',
                                                  objectFit:'cover',
                                                  borderRadius: "50%",
                                                }}
                                            />
                                        )}
                                      </div>
                                      <div>
                                        <p className={"mb-0"}>
                                          {order.porteur.firstName}
                                        </p>
                                        <button
                                            className={"d-block btnStatut my-2"}
                                        >
                                          {t("statut")}
                                        </button>
                                        <span
                                            onClick={() => {
                                              this.setState({
                                                showModalSuivi: true,
                                                mystate: order,
                                              });
                                            }}
                                        >
                                        <FontAwesomeIcon icon={faTag} />{" "}
                                          <span className={"text-orange"}>
                                          20
                                        </span>
                                      </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                      className={
                                        "col-lg-5 py-4 d-flex flex-column align-items-center justify-content-between borderRight"
                                      }
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <div className={"row"}>
                                      <div className={"col-md-2"}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20.6"
                                            height="26.662"
                                            viewBox="0 0 20.6 26.662"
                                            style={{
                                              position: "absolute",
                                              left: -12,
                                              top: -5,
                                            }}
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
                                              "d-flex flex-md-row flex-column w-100 justify-content-between py-3"
                                            }
                                        >
                                        <span>
                                          <FontAwesomeIcon
                                              icon={faCalendar}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.dateDepart}
                                          <br />
                                          <FontAwesomeIcon
                                              icon={faClock}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                          {order.heureDepart}
                                        </span>
                                          <span>
                                          <FontAwesomeIcon
                                              icon={faCalendar}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                            {order.dateArrivee}
                                            <br />
                                          <FontAwesomeIcon
                                              icon={faClock}
                                              style={{ color: "#A1A4A4" }}
                                          />{" "}
                                            {order.heureArrivee}
                                        </span>
                                        </div>
                                      </div>
                                      <div className={"col-md-2"}>
                                        {order.ville_arrivee}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20.6"
                                            height="26.662"
                                            viewBox="0 0 20.6 26.662"
                                            style={{
                                              position: "absolute",
                                              right: -12,
                                              top: -5,
                                            }}
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
                                      <div className={"col-md-12"}>
                                        <div
                                            className={
                                              "d-flex flex-md-row flex-column justify-content-between"
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
                                            {order.objectType.includes("Chat") ? (
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
                                    </div>
                                  </div>
                                  <div
                                      className={
                                        "col-lg-1 py-4 d-flex flex-column align-items-center justify-content-around"
                                      }
                                  >
                                    <CollectionsProcuration
                                        orderId={order.id}
                                        key={
                                          "CollectionsProcuration-" + Math.random()
                                        }
                                    />
                                    <span
                                        className={"d-block text-center"}
                                        style={{ fontSize: 12 }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faImage}
                                        style={{
                                          color: "#38BFEF",
                                          fontSize: 23,
                                        }}
                                    />
                                    <br />
                                      {t("photos")}
                                  </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                  className={"col-lg-3 borderLeft"}
                                  style={{ borderColor: "#4BBEED" }}
                              >
                                <div
                                    className={"row"}
                                    style={{ borderBottom: "5px solid #4BBEED" }}
                                >
                                  <div
                                      className={"col-6 py-3 pr-3 borderRight"}
                                      style={{ borderColor: "#4BBEED" }}
                                  >
                                    <p
                                        className={
                                          "text-center ff-Gordita-Medium fs-3 text-blue mb-0"
                                        }
                                    >
                                      {order.price ? order.price + "€" : "0€"}
                                    </p>
                                  </div>
                                  <div className={"col-6 py-3 pr-3"}>
                                    <p
                                        className={
                                          "text-center fs-5 ff-Gordita-Medium text-gris mb-0"
                                        }
                                    >
                                      En attente
                                    </p>
                                  </div>
                                </div>
                                <div className={"row py-3 pr-3"}>
                                  <div className={"col-md-12"}>
                                    <button
                                        className={"btnBlue myAltBtn"}
                                        onClick={() => {
                                          this.setState({
                                            orderId: order.id,
                                          });
                                        }}
                                    >
                                      {t("btns.confirmerDepot")}
                                    </button>
                                  </div>
                                  <div className={"col-md-12"}>
                                    <CollectionsPageCause order={order.id} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </>
                ) : (
                  <div className={"col-12 pt-5 mt-5 mb-4 text-center"}>
                    {t("page_annonce.no_ann")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ReservationPaiement);
