import React, { Component } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { Modal, Select } from "antd";
import "react-multi-carousel/lib/styles.css";
import "moment/locale/fr";
import { user } from "../app";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Header from "./Header";
import { withTranslation, Trans } from "react-i18next";
import VoyagerAvantage from "./VoyagerAvantage";
import Autocomplete from "react-google-autocomplete";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faClock} from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

class PorterBagage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      client: {},
      rayonAdressDep: 0,
      adresse_point_depart: "",
      rayonAdressArr: 0,
      adresse_point_arrivee: "",
      lat_adresse_point_arrivee: 0,
      long_adresse_point_arrivee: 0,
      lat_adresse_point_depart: 0,
      long_adresse_point_depart: 0,
      depart: {
        isPointRelais: false,
        isDomicile: false,
        isAutre: false,
        isIndifferent: false,
      },
      arrivee: {
        isPointRelais: false,
        isDomicile: false,
        isAutre: false,
        isIndifferent: false,
      },

      bagages: {
        dimensionsLong: "",
        dimensionsH: "",
        dimensionsLarg: "",
        dimensionsKg: "",
        isBagage: false,
        isSacDos: false,
        isHorsFormat: false,
        isPetitObj: false,
        isIndifferent: false,
        isIndifferentV: false,
        isChat: false,
        isVoiture: false,
        isCar: false,
        isCamion: false,
        isAvion: false,
        isTrain: false,
        isBateau: false,
      },
      ville: [],
      annonces: [],
      page: 1,
      lastPage: 1,
      loading: true,
    };
    this.handleChangeDescBagage = this.handleChangeDescBagage.bind(this);
    this.filtrer = this.filtrer.bind(this);
    if (user) {
      this.state.client.token = user.client.token;
      this.state.client.photo = user.client.photo;
      this.state.client.firstName = user.client.firstName;
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.filtrer(1);

    axios.get("api/ville/get").then((res) => {
      this.setState({ ville: res.data.ville, loading: false });
    });
  }

  filtrer(page) {
    const { bagages, arrivee, depart } = this.state;
    let myArr = [];
    bagages.isBagage && myArr.push("Bagage");
    bagages.isChat && myArr.push("Chat");
    bagages.isHorsFormat && myArr.push("Hors format");
    bagages.isSacDos && myArr.push("Sac à dos");
    bagages.isIndifferent && myArr.push("Indifferent");
    bagages.isPetitObj && myArr.push("Petits objets");

    let myArr2 = [];
    bagages.isVoiture && myArr2.push("Voiture");
    bagages.isCar && myArr2.push("Car");
    bagages.isCamion && myArr2.push("Camion");
    bagages.isAvion && myArr2.push("Avion");
    bagages.isBateau && myArr2.push("Bateau");
    bagages.isTrain && myArr2.push("Train");
    bagages.isIndifferentV && myArr2.push("Indifferent");
    let type_adresse_depart = "";
    let type_adresse_arrivee = "";
    depart.isPointRelais
      ? (type_adresse_depart = "Point relais")
      : depart.isDomicile
      ? (type_adresse_depart = "Domicile")
      : depart.isAutre
      ? (type_adresse_depart = "Autre lieux")
      : depart.isIndifferent
      ? (type_adresse_depart = "Indifferent")
      : null;
    arrivee.isPointRelais
      ? (type_adresse_arrivee = "Point relais")
      : arrivee.isDomicile
      ? (type_adresse_arrivee = "Domicile")
      : arrivee.isAutre
      ? (type_adresse_arrivee = "Autre lieux")
      : arrivee.isIndifferent
      ? (type_adresse_arrivee = "Indifferent")
      : null;
    this.setState({ loadingSearch: page == 1 ? true : false }, () => {
      console.log(this.state.loadingSearch);
      axios
        .post("api/search/list", {
          adresse_point_depart: this.state.adresse_point_depart,
          rayonAdressDep: this.state.lat_adresse_point_depart
            ? this.state.rayonAdressDep
            : 0,
          rayonAdressArr: this.state.adresse_point_arrivee
            ? this.state.rayonAdressArr
            : 0,
          dateDepart: this.state.dateDepart,
          lat_adresse_point_depart: this.state.lat_adresse_point_depart,
          long_adresse_point_depart: this.state.long_adresse_point_depart,
          adresse_point_arrivee: this.state.adresse_point_arrivee,
          lat_adresse_point_arrivee: this.state.lat_adresse_point_arrivee,
          long_adresse_point_arrivee: this.state.long_adresse_point_arrivee,
          type_adresse_depart: type_adresse_depart,
          type_adresse_arrivee: type_adresse_arrivee,
          dimensionsLong: bagages.dimensionsLong,
          dimensionsH: bagages.dimensionsH,
          dimensionsLarg: bagages.dimensionsLarg,
          dimensionsKg: bagages.dimensionsKg,
          objectType: myArr,
          objectTransport: myArr2,
          type: 2,
        })
        .then((res) => {
          if (page == 1) {
            this.setState(
              {
                annonces: res.data.annonces,
                lastPage: res.data.lastPage,
              },
              () => this.setState({ loadingSearch: false })
            );
          } else {
            this.setState({
              annonces: this.state.annonces.concat(res.data.annonces),
            });
          }
        })
        .catch((e) => {
          Modal.success({
            content: (
              <div className={"text-center"} key={"ops" + Math.random()}>
                <LazyLoadImage
                  src={"/images/logo.png"}
                  width={"65px"}
                  alt={"bagzee"}
                />
                <p className={"text-danger pt-2"}>{e}</p>
              </div>
            ),
            okText: "ok",
          });
        });
    });
  }

  handleChangeDescBagage(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState((prevState) => ({
      bagages: {
        ...prevState.bagages, // keep all other key-value pairs
        [name]: value,
      },
    }));
  }

  render() {
    const { t } = this.props;
    const { bagages, arrivee, depart } = this.state;

    function canUseWebP(img) {
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("safari") > -1) {
        if (ua.indexOf("chrome") > -1) {
          return "/images/" + img + ".webp";
        } else {
          return "/images/" + img + ".png";
        }
      }
    }

    return (
      <div className={"HomeSection landing confierBG"}>
        <Header />
        <section
          className="Header "
          style={{ backgroundImage: "url(images/headerPorterBagage.png)" }}
        >
          <div className={"row h-100 d-flex align-items-center"}>
            <div className={"col-md-8"}></div>

            <div className={"col-md-4"}>
              <p className={"dialogueHeader mb-4"}>
                Trouve un bagage ou un porteur pour
                <br />
                ton prochain voyage.
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="56.139"
                  height="51.038"
                  viewBox="0 0 56.139 51.038"
                  style={{ position: "absolute", left: -20, bottom: -20 }}
                >
                  <path
                    id="Tracé_8760"
                    data-name="Tracé 8760"
                    d="M1194.117,243.623l-56.139,30.165,27.775-51.038Z"
                    transform="translate(-1137.978 -222.75)"
                    fill="#4dbded"
                  />
                </svg>
              </p>
              <h2 className={"h1 text-white"}>CONFIER OU PORTER ?</h2>
              <p
                className={"mt-4 fs-large "}
                style={{ color: "#000", lineHeight: 1.5 }}
              >
                Trouve un bagage ou un porteur pour
                <br />
                ton prochain voyage.
              </p>
            </div>
          </div>
        </section>
        <section className={"container-fluid py-5 px-0"}>
          <div className={"px-lg-5 mx-lg-5 px-3"}>
            <div className={"row"}>
              <div className={"col-lg-9"}>
                <div className={"whiteBlock "}>
                  <div className={"row mb-3"}>
                    <div className={"col-lg-4"}>
                      <Link
                        to={"/confier-bagage"}
                        style={{ fontSize: "max(60%,68%)",minWidth:"100%",padding:"10px 2%" }}
                        className={"d-block btnConfier w-100 btnTransparent"}
                      >
                        {t("page_home.je_veux_confier_mon_bagage")}
                      </Link>
                    </div>
                    <div className={"col-lg-4"}>
                      <Link
                        to={"/porter-bagage"}
                        style={{ fontSize: "max(60%,68%)",minWidth:"100%",padding:"10px 2%" }}
                        className={"d-block btnPorter w-100 btnTransparent"}
                      >
                        {t("page_home.je_veux_porter_un_bagage")}
                      </Link>
                    </div>
                    <div className={"col-lg-4"}>
                      <Link
                        to={"/deposer-annonce"}
                        style={{ fontSize: "max(60%,68%)",minWidth:"100%",padding:"10px 2%" }}
                        className={"d-block btnDeposer w-100 btnTransparent"}
                      >
                        {t("page_home.deposer_une_annonce")}
                      </Link>
                    </div>
                  </div>
                  <div className={"row mb-3"}>
                    <div className={"col-xl-3 col-md-4 order-1"}>
                      <Autocomplete
                      className="confier-autocomplete"
                        style={{
                          backgroundImage: "url(images/pinDepart.png)",
                          paddingLeft: "35px !important",
                        }}
                        placeholder={t("page_home.ville_depart")}
                        apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                        options={{
                          types: ["geocode", "establishment"],
                          strictBounds: true,
                          componentRestrictions: { country: "fr" },
                        }}
                        onPlaceSelected={(place) => {
                          this.setState({
                            adresse_point_depart: place.formatted_address,
                            lat_adresse_point_depart:
                              place.geometry.location.lat(),
                            long_adresse_point_depart:
                              place.geometry.location.lng(),
                          });
                        }}
                      />
                    </div>
                    <div className={"col-xl-3 col-md-4 order-2"}>
                      <Autocomplete
                      className="confier-autocomplete"
                        style={{
                          backgroundImage: "url(images/pinArrive.png)",
                          paddingLeft: "35px !important",
                        }}
                        placeholder={t("page_home.ville_arrivee")}
                        apiKey={"AIzaSyDq2ZZeHGzuBplFDclItHIDEc-V9-Uhcm0"}
                        options={{
                          types: ["geocode", "establishment"],
                          strictBounds: true,
                          componentRestrictions: { country: "fr" },
                        }}
                        onPlaceSelected={(place) => {
                          this.setState({
                            adresse_point_arrivee: place.formatted_address,
                            lat_adresse_point_arrivee:
                              place.geometry.location.lat(),
                            long_adresse_point_arrivee:
                              place.geometry.location.lng(),
                          });
                        }}
                      />
                    </div>
                    <div className={"col-xl-3 col-md-4 order-3"}>
                      <input
                      className="confier-date"
                        type={"date"}
                        name={"date"}
                        placeholder={t("page_home.date")}
                        value={this.state.dateDepart}
                        style={{
                          backgroundImage: "url(images/date.png)",
                          paddingLeft: "35px !important",
                        }}
                        min={moment().format("YYYY-MM-DD")}
                        onChange={(e) =>
                          this.setState({ dateDepart: e.target.value })
                        }
                      />
                    </div>
                    <div className={"col-xl-3 col-md-4 order-12 order-lg-4"}>
                      <button
                        onClick={() =>
                          this.setState({ page: 1 }, () => {
                            this.filtrer(this.state.page);
                          })
                        }
                        className={"btnBlue btnRecherche reserver w-100"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19.016"
                          height="19"
                          viewBox="0 0 19.016 19"
                        >
                          <g
                            id="search-svgrepo-com_13_"
                            data-name="search-svgrepo-com (13)"
                            transform="translate(0 -0.2)"
                          >
                            <g
                              id="Groupe_129"
                              data-name="Groupe 129"
                              transform="translate(0 0.2)"
                            >
                              <path
                                id="Tracé_405"
                                data-name="Tracé 405"
                                d="M18.776,17.846l-5.456-5.46a7.37,7.37,0,0,0,1.722-4.739A7.522,7.522,0,0,0,0,7.651a7.529,7.529,0,0,0,12.186,5.834l5.475,5.475a.788.788,0,1,0,1.115-1.115ZM1.6,7.651a5.92,5.92,0,0,1,11.839,0,5.92,5.92,0,0,1-11.839,0Z"
                                transform="translate(0 -0.2)"
                                fill="#fff"
                              />
                            </g>
                          </g>
                        </svg>
                        {t("page_home.recherche")}
                      </button>
                    </div>

                    <div className={"col-xl-3 col-md-4 order-5"}>
                      <select
                      className="confier-select"
                        name={"rayon"}
                        value={this.state.rayonAdressDep}
                        onChange={(e) => {
                          this.setState({ rayonAdressDep: e.target.value });
                        }}
                        style={{ backgroundImage: "url(images/rayon2.png)" }}
                      >
                        <option
                          key={"-1"}
                          value={0}
                          selected={true}
                          disabled={true}
                        >
                          {t("page_home.rayonDep")}
                        </option>
                        <option key={0} value={5}>
                          5 Km
                        </option>
                        <option key={1} value={10}>
                          10 km
                        </option>
                        <option key={2} value={15}>
                          15 km
                        </option>
                        <option key={3} value={20}>
                          20 km et +
                        </option>
                      </select>
                    </div>
                    <div className={"col-xl-3 col-md-4 order-6"}>
                      <select
                      className="confier-select"
                        name={"rayon"}
                        value={this.state.rayonAdressArr}
                        onChange={(e) => {
                          this.setState({ rayonAdressArr: e.target.value });
                        }}
                        style={{ backgroundImage: "url(images/rayon1.png)" }}
                      >
                        <option
                          key={"-1"}
                          value={0}
                          selected={true}
                          disabled={true}
                        >
                          {t("page_home.rayonArr")}
                        </option>
                        <option key={0} value={5}>
                          5 Km
                        </option>
                        <option key={1} value={10}>
                          10 km
                        </option>
                        <option key={2} value={15}>
                          15 km
                        </option>
                        <option key={3} value={20}>
                          20 km et +
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className={"row mb-3"}>
                    <div className={"col-lg-9"}>
                      <LazyLoadImage
                        src={"/images/assurance.png"}
                        alt={"assurance"}
                      />{" "}
                      <span
                        style={{
                          fontSize: "small",
                          color: "#B5B5B5",
                        }}
                      >
                        {t("page_home.assurance")}{" "}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={"col-lg-3"}>
                {this.state.annonces.length ? (
                  this.state.annonces[0].isFavoris ? (
                    <svg
                      className="float-right"
                      style={{
                        position: "absolute",
                        right: "2rem",
                        top: "1.75rem",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="41.8"
                      height="37.579"
                      viewBox="0 0 21.8 17.579"
                    >
                      <g
                        id="heart-svgrepo-com_10_"
                        data-name="heart-svgrepo-com (10)"
                        transform="translate(0 -33.251)"
                      >
                        <g id="Artwork_15_" transform="translate(0 33.251)">
                          <g id="Layer_5_15_" transform="translate(0)">
                            <path
                              id="Tracé_7837"
                              data-name="Tracé 7837"
                              d="M16.173,33.251c-2.955,0-4.83,3.294-5.274,3.294-.388,0-2.186-3.294-5.274-3.294A5.738,5.738,0,0,0,.009,38.727a6.582,6.582,0,0,0,1.225,4.152C2.772,45.212,9.5,50.83,10.909,50.83c1.444,0,8.107-5.6,9.655-7.951a6.581,6.581,0,0,0,1.225-4.152,5.738,5.738,0,0,0-5.616-5.476"
                              transform="translate(0 -33.251)"
                              fill="#ef7615"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  ) : (
                    <svg
                      className="float-right"
                      style={{
                        position: "absolute",
                        right: "2rem",
                        top: "1.75rem",
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="42.8"
                      height="40.844"
                      viewBox="0 0 22.8 20.844"
                    >
                      <path
                        id="heart-svgrepo-com_9_"
                        data-name="heart-svgrepo-com (9)"
                        d="M19.461,11.572a5.733,5.733,0,0,0-3.534-1.238A8.477,8.477,0,0,0,10.9,12.315a8.477,8.477,0,0,0-5.026-1.981A5.733,5.733,0,0,0,2.34,11.572,5.4,5.4,0,0,0,0,16.081c.085,6.128,10.037,13.36,10.46,13.664l.439.316.439-.316c.424-.3,10.375-7.536,10.46-13.664A5.4,5.4,0,0,0,19.461,11.572ZM15.426,24.24A46.071,46.071,0,0,1,10.9,28.2,46.056,46.056,0,0,1,6.375,24.24c-3.156-3.175-4.841-6-4.87-8.181a3.917,3.917,0,0,1,1.747-3.291,4.262,4.262,0,0,1,2.622-.93,7.63,7.63,0,0,1,4.544,2.016l.482.4.482-.4a7.63,7.63,0,0,1,4.544-2.016,4.262,4.262,0,0,1,2.622.93A3.917,3.917,0,0,1,20.3,16.059C20.266,18.237,18.582,21.065,15.426,24.24Z"
                        transform="translate(0.5 -9.834)"
                        fill="#53bfed"
                        stroke="#ef7615"
                        strokeWidth="1"
                      />
                    </svg>
                  )
                ) : (
                  <svg
                    className="float-right"
                    style={{
                      position: "absolute",
                      right: "2rem",
                      top: "1.75rem",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    width="42.8"
                    height="40.844"
                    viewBox="0 0 22.8 20.844"
                  >
                    <path
                      id="heart-svgrepo-com_9_"
                      data-name="heart-svgrepo-com (9)"
                      d="M19.461,11.572a5.733,5.733,0,0,0-3.534-1.238A8.477,8.477,0,0,0,10.9,12.315a8.477,8.477,0,0,0-5.026-1.981A5.733,5.733,0,0,0,2.34,11.572,5.4,5.4,0,0,0,0,16.081c.085,6.128,10.037,13.36,10.46,13.664l.439.316.439-.316c.424-.3,10.375-7.536,10.46-13.664A5.4,5.4,0,0,0,19.461,11.572ZM15.426,24.24A46.071,46.071,0,0,1,10.9,28.2,46.056,46.056,0,0,1,6.375,24.24c-3.156-3.175-4.841-6-4.87-8.181a3.917,3.917,0,0,1,1.747-3.291,4.262,4.262,0,0,1,2.622-.93,7.63,7.63,0,0,1,4.544,2.016l.482.4.482-.4a7.63,7.63,0,0,1,4.544-2.016,4.262,4.262,0,0,1,2.622.93A3.917,3.917,0,0,1,20.3,16.059C20.266,18.237,18.582,21.065,15.426,24.24Z"
                      transform="translate(0.5 -9.834)"
                      fill="#53bfed"
                      stroke="#ef7615"
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className={"container-fluid py-5 px-0"}>
          <div className={"px-md-5 mx-md-5 px-3"}>
            <div className={"row mb-3"}>
              <div className={"col-xl-5"}>
                <p>{t("moyen_transport_prefere")}</p>
                <div
                  className="d-flex gap-md-5 gap-3 mb-3 align-items-center justify-content-start w-100 "
                  style={{ overflowX: "auto" }}
                >
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isVoiture: !bagages.isVoiture,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                        <g id="Groupe_3569" data-name="Groupe 3569">
                          <path
                            id="Tracé_4987"
                            data-name="Tracé 4987"
                            d="M8.052,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,8.052,16.86Zm0,4.772a1.106,1.106,0,1,0-1.1-1.106A1.109,1.109,0,0,0,8.052,21.632Z"
                            transform="translate(19.229 -6.929)"
                            fill={bagages.isVoiture ? "#ef7615" : "#000"}
                          />
                          <path
                            id="Tracé_4988"
                            data-name="Tracé 4988"
                            d="M.605,18.77,1.2,13.9a1.8,1.8,0,0,1,1.879-1.57L4.4,12.4,8.473,8.726A2.134,2.134,0,0,1,9.9,8.178h8.282a8.159,8.159,0,0,1,5.11,1.8l4.621,3.713,6.214,1.553a1.794,1.794,0,0,1,1.359,1.74v1.791a.475.475,0,0,1,.477.475v2.369a.611.611,0,0,1-.611.611H31.846c.015-.152.046-.3.046-.453a4.609,4.609,0,0,0-9.218,0,4.5,4.5,0,0,0,.047.453H13.007c.014-.152.045-.3.045-.453a4.608,4.608,0,1,0-9.215,0,4.187,4.187,0,0,0,.046.453H.61A.61.61,0,0,1,0,21.616V19.382A.6.6,0,0,1,.605,18.77ZM12.9,12.781l11.554.584-2.212-1.779A6.761,6.761,0,0,0,18,10.094H12.9Zm-1.919-.1V10.1h-.751a1.048,1.048,0,0,0-.7.271L7.163,12.489Z"
                            transform="translate(0 -8.177)"
                            fill={bagages.isVoiture ? "#ef7615" : "#000"}
                          />
                          <path
                            id="Tracé_4989"
                            data-name="Tracé 4989"
                            d="M24.524,16.86a3.665,3.665,0,1,1-3.663,3.665A3.663,3.663,0,0,1,24.524,16.86Zm0,4.772a1.106,1.106,0,1,0-1.106-1.106A1.108,1.108,0,0,0,24.524,21.632Z"
                            transform="translate(-16.083 -6.929)"
                            fill={bagages.isVoiture ? "#ef7615" : "#000"}
                          />
                        </g>
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isVoiture
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.voiture")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isCar: !bagages.isCar,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                            fill={bagages.isCar ? "#ef7615" : "#000"}
                          />
                        </g>
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isCar
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.car")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isCamion: !bagages.isCamion,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                        fill={bagages.isCamion ? "#ef7615" : "#000"}
                      />
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isCamion
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.camion")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isAvion: !bagages.isAvion,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32.625"
                      height="17.048"
                      viewBox="0 0 32.625 17.048"
                    >
                      <g id="XMLID_909_" transform="translate(0 -110.089)">
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
                            fill={bagages.isAvion ? "#ef7615" : "#000"}
                          />
                        </g>
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isAvion
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.avion")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isTrain: !bagages.isTrain,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                          fill={bagages.isTrain ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6613"
                          data-name="Tracé 6613"
                          d="M55.734,188.378a2.1,2.1,0,0,0-2.1,1.972H49.586a2.976,2.976,0,1,0-.54,1.092h4.82a2.1,2.1,0,1,0,1.868-3.064Z"
                          transform="translate(-40.553 -154.141)"
                          fill={bagages.isTrain ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isTrain
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.train")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isBateau: !bagages.isBateau,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24.57"
                      height="20.641"
                      viewBox="0 0 24.57 20.641"
                    >
                      <path
                        id="boat-svgrepo-com"
                        d="M24.338,33.351l-3.729,4a.867.867,0,0,1-.635.276H3.078a.867.867,0,0,1-.759-.448l-2.21-4a.867.867,0,0,1,.759-1.286H23.7a.867.867,0,0,1,.635,1.458Zm-1.053-4.47L10.915,17.226a.867.867,0,0,0-1.462.631V29.512a.867.867,0,0,0,.867.867H22.69a.867.867,0,0,0,.595-1.5ZM7.31,23.924a.867.867,0,0,0-.938.165L1.286,28.881a.867.867,0,0,0,.595,1.5H6.966a.867.867,0,0,0,.867-.867V24.72A.868.868,0,0,0,7.31,23.924Z"
                        transform="translate(0 -16.99)"
                        fill={bagages.isBateau ? "#ef7615" : "#000"}
                      />
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isBateau
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.bateau")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isIndifferentV: !bagages.isIndifferentV,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                            fill={bagages.isIndifferentV ? "#ef7615" : "#000"}
                          />
                          <circle
                            id="Ellipse_139"
                            data-name="Ellipse 139"
                            cx="2.719"
                            cy="2.719"
                            r="2.719"
                            transform="translate(4.914)"
                            fill={bagages.isIndifferentV ? "#ef7615" : "#000"}
                          />
                        </g>
                      </g>
                    </svg>
                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isIndifferentV
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.indifferent")}
                    </span>
                  </div>
                </div>
                <p>Type de bien à transporter</p>
                <div
                  className="d-flex gap-md-5 gap-3 mb-3 align-items-center justify-content-start w-100 "
                  style={{ overflowX: "auto" }}
                >
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isBagage: !bagages.isBagage,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="17.483"
                      height="26.251"
                      viewBox="0 0 17.483 26.251"
                    >
                      <path
                        id="suitcase-svgrepo-com_1_"
                        data-name="suitcase-svgrepo-com (1)"
                        d="M29.471,24.988a2.706,2.706,0,0,0,2.7-2.7V8.8a2.706,2.706,0,0,0-2.7-2.7H20.3a2.706,2.706,0,0,0-2.7,2.7V22.29a2.706,2.706,0,0,0,2.7,2.7ZM19.111,9.475a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0V9.475a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,9.475v.432a.27.27,0,1,1-.54,0Zm.54,8.04v.432a.27.27,0,1,1-.54,0v-.432a1.808,1.808,0,0,1,1.808-1.808h7.905a1.808,1.808,0,0,1,1.808,1.808v.432a.27.27,0,1,1-.54,0v-.432a1.267,1.267,0,0,0-1.268-1.268H20.918A1.267,1.267,0,0,0,19.65,17.515ZM24.507,3.054a.668.668,0,0,1,.674-.674h1.538a.668.668,0,0,1,.674.674v2h1.079v-2A1.75,1.75,0,0,0,26.719,1.3H25.181a1.75,1.75,0,0,0-1.754,1.754v2h1.079ZM32.385,6.1h-.324a3.811,3.811,0,0,1,1.187,2.752V22.263a3.811,3.811,0,0,1-1.187,2.752h.324a2.706,2.706,0,0,0,2.7-2.7V8.827A2.712,2.712,0,0,0,32.385,6.1ZM29.876,27.551a1.537,1.537,0,0,0,1.538-1.538H28.338A1.52,1.52,0,0,0,29.876,27.551Zm-8.094,0a1.537,1.537,0,0,0,1.538-1.538H20.244A1.537,1.537,0,0,0,21.782,27.551Z"
                        transform="translate(-17.6 -1.3)"
                        fill={bagages.isBagage ? "#ef7615" : "#000"}
                      />
                    </svg>
                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isBagage
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.bagage")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isSacDos: !bagages.isSacDos,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22.633"
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
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6615"
                          data-name="Tracé 6615"
                          d="M262.231,169.567v8.446h1.193a.916.916,0,0,0,.915-.915v-5.423A2.11,2.11,0,0,0,262.231,169.567Z"
                          transform="translate(-232.971 -155.837)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6616"
                          data-name="Tracé 6616"
                          d="M12.1,21.057h.333a3.246,3.246,0,0,1-.1-.8V16.647a3.25,3.25,0,0,1,.1-.8H12.1a1.142,1.142,0,0,0-1.141,1.141v2.933A1.142,1.142,0,0,0,12.1,21.057Z"
                          transform="translate(-2.048 -14.56)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6617"
                          data-name="Tracé 6617"
                          d="M57.527,0H44.394a2.09,2.09,0,0,0-2.087,2.087V5.693A2.09,2.09,0,0,0,44.394,7.78h1.574V5.949a.582.582,0,0,1,1.165,0V7.78h7.655V5.949a.582.582,0,1,1,1.165,0V7.78h1.574a2.09,2.09,0,0,0,2.087-2.087V2.087A2.09,2.09,0,0,0,57.527,0Z"
                          transform="translate(-30.854)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <rect
                          id="Rectangle_5839"
                          data-name="Rectangle 5839"
                          width="11.4"
                          height="4.826"
                          transform="translate(14.407 16.226)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6618"
                          data-name="Tracé 6618"
                          d="M59.731,104.62v1.123a.582.582,0,0,1-1.165,0V104.62H50.91v1.123a.582.582,0,0,1-1.165,0V104.62H48.171a3.232,3.232,0,0,1-1.754-.516V118.4a1.326,1.326,0,0,0,1.324,1.324H61.735a1.326,1.326,0,0,0,1.324-1.324V104.1a3.232,3.232,0,0,1-1.754.516H59.731Zm1.872,6.7v5.991a.583.583,0,0,1-.582.582H48.456a.583.583,0,0,1-.582-.582v-5.991a.583.583,0,0,1,.582-.582H61.02A.582.582,0,0,1,61.6,111.318Z"
                          transform="translate(-34.631 -95.675)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6619"
                          data-name="Tracé 6619"
                          d="M269.206,21.058h.333a1.142,1.142,0,0,0,1.141-1.141V16.985a1.142,1.142,0,0,0-1.141-1.141h-.333a3.247,3.247,0,0,1,.1.8v3.606A3.241,3.241,0,0,1,269.206,21.058Z"
                          transform="translate(-239.381 -14.561)"
                          fill={bagages.isSacDos ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isSacDos
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.sacDos")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isHorsFormat: !bagages.isHorsFormat,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="33.502"
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
                          fill={bagages.isHorsFormat ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>
                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isHorsFormat
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.horsFormat")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isPetitObj: !bagages.isPetitObj,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="35.79"
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
                          fill={bagages.isPetitObj ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isPetitObj
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.petitsObj")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isChat: !bagages.isChat,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
                      xmlns="http://www.w3.org/2000/svg"
                      width="32.312"
                      height="26.612"
                      viewBox="0 0 32.312 26.612"
                    >
                      <path
                        id="dog-svgrepo-com"
                        d="M32.271,45.789a.659.659,0,0,0-.37-.379l-2.871-1.158a2.453,2.453,0,0,0-1.79-1.9l-.155-1.784a.659.659,0,0,0-1.145-.386l-.737.813L24.748,39.4a.659.659,0,0,0-1.253-.043l-3.4,9.388L7.481,49.33a6.607,6.607,0,0,1-6.237-3.524.659.659,0,1,0-1.168.612A7.93,7.93,0,0,0,5.242,50.44a5.123,5.123,0,0,0-1,1.949,7.108,7.108,0,0,0,.718,5.172l-1.848,2.51a.659.659,0,0,0-.117.51l.813,4.41a.659.659,0,0,0,.648.54h.828a.659.659,0,0,0,.648-.777l-.515-2.829,5.449-4.09h0a4.918,4.918,0,0,0,1.17-1.415c2.84.5,6.726,1.173,9.217,1.574l1.1,6.98a.659.659,0,0,0,.651.557h.682a.659.659,0,0,0,.659-.659V57.786a2.734,2.734,0,0,0,.987-1.821L26.8,49.2a5.067,5.067,0,0,0,.834.07,5.194,5.194,0,0,0,4.613-2.949A.659.659,0,0,0,32.271,45.789Z"
                        transform="translate(-0.001 -38.918)"
                        fill={bagages.isChat ? "#ef7615" : "#000"}
                      />
                    </svg>
                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isChat
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.animal")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        bagages: {
                          ...prev.bagages,
                          isIndifferent: !bagages.isIndifferent,
                        },
                      }));
                    }}
                  >
                    <svg
                      className="icon-transport"
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
                            fill={bagages.isIndifferent ? "#ef7615" : "#000"}
                          />
                          <circle
                            id="Ellipse_139"
                            data-name="Ellipse 139"
                            cx="2.719"
                            cy="2.719"
                            r="2.719"
                            transform="translate(4.914)"
                            fill={bagages.isIndifferent ? "#ef7615" : "#000"}
                          />
                        </g>
                      </g>
                    </svg>
                    <br />
                    <span
                      className="icon-transport-txt"
                      style={
                        bagages.isIndifferent
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.indifferent")}
                    </span>
                  </div>
                </div>
                <p>{t("circuit_depot_annonce.dimensions")}</p>
                <div className={"row text-left"}>
                  <div className={"col-md-4  text-left"}>
                    <input
                    className="confier-input"
                      type={"number"}
                      name={"dimensionsLong"}
                      value={bagages.dimensionsLong}
                      min={1}
                      placeholder={t("circuit_depot_annonce.dimensionsLong")}
                      required
                      onChange={this.handleChangeDescBagage}
                    />
                  </div>
                  <div className={"col-md-4  text-left"}>
                    <input
                    className="confier-input"
                      type={"number"}
                      name={"dimensionsLarg"}
                      value={bagages.dimensionsLarg}
                      min={1}
                      placeholder={t("circuit_depot_annonce.dimensionsLarg")}
                      required
                      onChange={this.handleChangeDescBagage}
                    />
                  </div>
                  <div className={"col-md-4  text-left"}>
                    <input
                    className="confier-input"
                      type={"number"}
                      name={"dimensionsH"}
                      min={1}
                      value={bagages.dimensionsH}
                      placeholder={t("circuit_depot_annonce.dimensionsH")}
                      required
                      onChange={this.handleChangeDescBagage}
                    />
                  </div>
                </div>
                <p>{t("circuit_depot_annonce.poidsMax")}</p>
                <div className={"row text-left"}>
                  <div className={"col-md-4  text-left"}>
                    <input
                    className="confier-input"
                      type={"number"}
                      name={"dimensionsKg"}
                      min={1}
                      placeholder={"Kg"}
                      value={bagages.dimensionsKg}
                      required
                      onChange={this.handleChangeDescBagage}
                    />
                  </div>
                </div>
                <p>Lieu de départ</p>
                <div
                  className="d-flex gap-md-5 gap-3 mb-3 justify-content-start  w-100"
                  style={{ overflowX: "auto" }}
                >
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        depart: {
                          ...prev.depart,
                          isPointRelais: true,
                          isDomicile: false,
                          isAutre: false,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20.354"
                      height="21.502"
                      viewBox="0 0 20.354 21.502"
                    >
                      <g
                        id="store-svgrepo-com_2_"
                        data-name="store-svgrepo-com (2)"
                        transform="translate(-12.151)"
                      >
                        <path
                          id="Tracé_6624"
                          data-name="Tracé 6624"
                          d="M37.628,90.221h-17.6L18.974,92.46H38.683Z"
                          transform="translate(-6.501 -85.957)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6625"
                          data-name="Tracé 6625"
                          d="M321.723,167.6a2.947,2.947,0,0,0,5.724,0Z"
                          transform="translate(-294.942 -159.675)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6626"
                          data-name="Tracé 6626"
                          d="M169.8,169.839a2.954,2.954,0,0,0,2.862-2.244h-5.724A2.954,2.954,0,0,0,169.8,169.839Z"
                          transform="translate(-147.472 -159.675)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6627"
                          data-name="Tracé 6627"
                          d="M17.875,167.6H12.151a2.947,2.947,0,0,0,5.724,0Z"
                          transform="translate(0 -159.675)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6628"
                          data-name="Tracé 6628"
                          d="M56.742,203.057a4.362,4.362,0,0,1-7.315,0,4.362,4.362,0,0,1-4.994,1.776v10.131h4.886v-8.091h7.53v8.091h4.886V204.833a4.362,4.362,0,0,1-4.994-1.776Z"
                          transform="translate(-30.756 -193.461)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <rect
                          id="Rectangle_5840"
                          data-name="Rectangle 5840"
                          width="13.004"
                          height="2.846"
                          transform="translate(15.826)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <rect
                          id="Rectangle_5841"
                          data-name="Rectangle 5841"
                          width="4.695"
                          height="6.673"
                          transform="translate(19.981 14.829)"
                          fill={depart.isPointRelais ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      style={
                        depart.isPointRelais
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.point_relais")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        depart: {
                          ...prev.depart,
                          isPointRelais: false,
                          isDomicile: true,
                          isAutre: false,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22.449"
                      height="21.502"
                      viewBox="0 0 22.449 21.502"
                    >
                      <path
                        id="home-svgrepo-com"
                        d="M22.055,15.317l-2.809-2.289V9.366a.749.749,0,0,0-.748-.748H16.731a.749.749,0,0,0-.748.748v1L12.23,7.309a1.648,1.648,0,0,0-2.01,0L.394,15.317c-.446.364-.42.681-.364.837s.234.418.808.418H2.183V27.105a1.363,1.363,0,0,0,1.36,1.363H7.792a1.33,1.33,0,0,0,1.326-1.363V22.786a.739.739,0,0,1,.714-.707h2.855a.679.679,0,0,1,.646.707v4.319a1.4,1.4,0,0,0,1.394,1.363h4.181a1.363,1.363,0,0,0,1.36-1.363V16.572h1.345c.573,0,.752-.262.808-.418S22.5,15.68,22.055,15.317Z"
                        transform="translate(0 -6.966)"
                        fill={depart.isDomicile ? "#ef7615" : "#000"}
                      />
                    </svg>

                    <br />
                    <span
                      style={
                        depart.isDomicile
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.domicile")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        depart: {
                          ...prev.depart,
                          isPointRelais: false,
                          isDomicile: false,
                          isAutre: true,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      id="pin-maps-and-location-svgrepo-com"
                      xmlns="http://www.w3.org/2000/svg"
                      width="26.307"
                      height="26.307"
                      viewBox="0 0 26.307 26.307"
                    >
                      <g id="Groupe_5066" data-name="Groupe 5066">
                        <path
                          id="Tracé_6963"
                          data-name="Tracé 6963"
                          d="M14.637,19.751l.254-6.6h.017a.438.438,0,0,0,.438-.438V10.96a5.7,5.7,0,1,0-4.384,0v1.755a.438.438,0,0,0,.438.438h.017l.254,6.6C7.131,19.874,0,20.681,0,23.018c0,2.413,7.866,3.288,13.153,3.288s13.153-.876,13.153-3.288C26.307,20.681,19.176,19.874,14.637,19.751Zm-.168-8.464v.99H11.838v-.99c.261.033.479.058.679.075.086.01.173.013.26.019l.141.007c.078,0,.156.012.235.012s.157-.009.235-.012l.141-.007c.087-.006.174-.009.26-.019C13.989,11.344,14.208,11.32,14.469,11.286ZM10.084,5.7a.438.438,0,0,1-.877,0,3.951,3.951,0,0,1,3.946-3.946.438.438,0,0,1,0,.877A3.073,3.073,0,0,0,10.084,5.7Zm3.069,19.73C5.659,25.43.877,24,.877,23.018c0-.774,3.618-2.21,10.827-2.392l.1,2.629a1.35,1.35,0,0,0,2.7,0l.1-2.629c7.209.182,10.826,1.618,10.826,2.392C25.43,24,20.647,25.43,13.153,25.43Z"
                          fill={depart.isAutre ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      style={
                        depart.isAutre
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.autreLieu")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        depart: {
                          ...prev.depart,
                          isPointRelais: false,
                          isDomicile: false,
                          isAutre: false,
                          isIndifferent: true,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30.375"
                      height="30.208"
                      viewBox="1 0 37.375 55.208"
                    >
                      <g
                        id="Groupe_9221"
                        data-name="Groupe 9221"
                        transform="translate(-420.649 -1460.159)"
                      >
                        <path
                          id="pin-svgrepo-com_4_"
                          data-name="pin-svgrepo-com (4)"
                          d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                          transform="translate(403.25 1460.159)"
                          fill={depart.isIndifferent ? "#ef7615" : "#000"}
                        />
                        <g
                          id="Groupe_5100"
                          data-name="Groupe 5100"
                          transform="translate(421.127 1488.99)"
                        >
                          <path
                            id="Tracé_6965"
                            data-name="Tracé 6965"
                            d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                            transform="translate(2053.208 -7072.97)"
                            fill="none"
                            stroke={depart.isIndifferent ? "#ef7615" : "#000"}
                            strokeWidth="1"
                          />
                          <path
                            id="Tracé_6966"
                            data-name="Tracé 6966"
                            d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                            transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                            fill="none"
                            stroke={depart.isIndifferent ? "#ef7615" : "#000"}
                            strokeWidth="1"
                          />
                        </g>
                      </g>
                    </svg>
                    <br />
                    <span
                      style={
                        depart.isIndifferent
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.indifferent")}
                    </span>
                  </div>
                </div>

                <p>Lieu de livraison</p>
                <div
                  className="d-flex gap-md-5 gap-3 mb-3 justify-content-start  w-100"
                  style={{ overflowX: "auto" }}
                >
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        arrivee: {
                          ...prev.arrivee,
                          isPointRelais: true,
                          isDomicile: false,
                          isAutre: false,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20.354"
                      height="21.502"
                      viewBox="0 0 20.354 21.502"
                    >
                      <g
                        id="store-svgrepo-com_2_"
                        data-name="store-svgrepo-com (2)"
                        transform="translate(-12.151)"
                      >
                        <path
                          id="Tracé_6624"
                          data-name="Tracé 6624"
                          d="M37.628,90.221h-17.6L18.974,92.46H38.683Z"
                          transform="translate(-6.501 -85.957)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6625"
                          data-name="Tracé 6625"
                          d="M321.723,167.6a2.947,2.947,0,0,0,5.724,0Z"
                          transform="translate(-294.942 -159.675)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6626"
                          data-name="Tracé 6626"
                          d="M169.8,169.839a2.954,2.954,0,0,0,2.862-2.244h-5.724A2.954,2.954,0,0,0,169.8,169.839Z"
                          transform="translate(-147.472 -159.675)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6627"
                          data-name="Tracé 6627"
                          d="M17.875,167.6H12.151a2.947,2.947,0,0,0,5.724,0Z"
                          transform="translate(0 -159.675)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <path
                          id="Tracé_6628"
                          data-name="Tracé 6628"
                          d="M56.742,203.057a4.362,4.362,0,0,1-7.315,0,4.362,4.362,0,0,1-4.994,1.776v10.131h4.886v-8.091h7.53v8.091h4.886V204.833a4.362,4.362,0,0,1-4.994-1.776Z"
                          transform="translate(-30.756 -193.461)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <rect
                          id="Rectangle_5840"
                          data-name="Rectangle 5840"
                          width="13.004"
                          height="2.846"
                          transform="translate(15.826)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                        <rect
                          id="Rectangle_5841"
                          data-name="Rectangle 5841"
                          width="4.695"
                          height="6.673"
                          transform="translate(19.981 14.829)"
                          fill={arrivee.isPointRelais ? "#ef7615" : "#000"}
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      style={
                        arrivee.isPointRelais
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.point_relais")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        arrivee: {
                          ...prev.arrivee,
                          isPointRelais: false,
                          isDomicile: true,
                          isAutre: false,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22.449"
                      height="21.502"
                      viewBox="0 0 22.449 21.502"
                    >
                      <path
                        id="home-svgrepo-com"
                        d="M22.055,15.317l-2.809-2.289V9.366a.749.749,0,0,0-.748-.748H16.731a.749.749,0,0,0-.748.748v1L12.23,7.309a1.648,1.648,0,0,0-2.01,0L.394,15.317c-.446.364-.42.681-.364.837s.234.418.808.418H2.183V27.105a1.363,1.363,0,0,0,1.36,1.363H7.792a1.33,1.33,0,0,0,1.326-1.363V22.786a.739.739,0,0,1,.714-.707h2.855a.679.679,0,0,1,.646.707v4.319a1.4,1.4,0,0,0,1.394,1.363h4.181a1.363,1.363,0,0,0,1.36-1.363V16.572h1.345c.573,0,.752-.262.808-.418S22.5,15.68,22.055,15.317Z"
                        transform="translate(0 -6.966)"
                        fill={arrivee.isDomicile ? "#ef7615" : "#000"}
                      />
                    </svg>

                    <br />
                    <span
                      style={
                        arrivee.isDomicile
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.domicile")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        arrivee: {
                          ...prev.arrivee,
                          isPointRelais: false,
                          isDomicile: false,
                          isAutre: true,
                          isIndifferent: false,
                        },
                      }));
                    }}
                  >
                    <svg
                      id="pin-maps-and-location-svgrepo-com"
                      xmlns="http://www.w3.org/2000/svg"
                      width="26.307"
                      height="26.307"
                      viewBox="0 0 26.307 26.307"
                    >
                      <g id="Groupe_5066" data-name="Groupe 5066">
                        <path
                          id="Tracé_6963"
                          data-name="Tracé 6963"
                          fill={arrivee.isAutre ? "#ef7615" : "#000"}
                          d="M14.637,19.751l.254-6.6h.017a.438.438,0,0,0,.438-.438V10.96a5.7,5.7,0,1,0-4.384,0v1.755a.438.438,0,0,0,.438.438h.017l.254,6.6C7.131,19.874,0,20.681,0,23.018c0,2.413,7.866,3.288,13.153,3.288s13.153-.876,13.153-3.288C26.307,20.681,19.176,19.874,14.637,19.751Zm-.168-8.464v.99H11.838v-.99c.261.033.479.058.679.075.086.01.173.013.26.019l.141.007c.078,0,.156.012.235.012s.157-.009.235-.012l.141-.007c.087-.006.174-.009.26-.019C13.989,11.344,14.208,11.32,14.469,11.286ZM10.084,5.7a.438.438,0,0,1-.877,0,3.951,3.951,0,0,1,3.946-3.946.438.438,0,0,1,0,.877A3.073,3.073,0,0,0,10.084,5.7Zm3.069,19.73C5.659,25.43.877,24,.877,23.018c0-.774,3.618-2.21,10.827-2.392l.1,2.629a1.35,1.35,0,0,0,2.7,0l.1-2.629c7.209.182,10.826,1.618,10.826,2.392C25.43,24,20.647,25.43,13.153,25.43Z"
                        />
                      </g>
                    </svg>

                    <br />
                    <span
                      style={
                        arrivee.isAutre
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.autreLieu")}
                    </span>
                  </div>
                  <div
                    className="pointer text-center"
                    onClick={() => {
                      this.setState((prev) => ({
                        arrivee: {
                          ...prev.arrivee,
                          isPointRelais: false,
                          isDomicile: false,
                          isAutre: false,
                          isIndifferent: true,
                        },
                      }));
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30.375"
                      height="30.208"
                      viewBox="1 0 37.375 55.208"
                    >
                      <g
                        id="Groupe_9221"
                        data-name="Groupe 9221"
                        transform="translate(-420.649 -1460.159)"
                      >
                        <path
                          id="pin-svgrepo-com_4_"
                          data-name="pin-svgrepo-com (4)"
                          d="M36.092,0A15.047,15.047,0,0,0,21.044,15.048c0,8.311,15.048,21.714,15.048,21.714s15.048-13.4,15.048-21.714A15.047,15.047,0,0,0,36.092,0Zm0,21.86a7.238,7.238,0,1,1,7.238-7.238A7.239,7.239,0,0,1,36.092,21.86Z"
                          transform="translate(403.25 1460.159)"
                          fill={arrivee.isIndifferent ? "#ef7615" : "#000"}
                        />
                        <g
                          id="Groupe_5100"
                          data-name="Groupe 5100"
                          transform="translate(421.127 1488.99)"
                        >
                          <path
                            id="Tracé_6965"
                            data-name="Tracé 6965"
                            d="M-2053,7099.364c3.274-1.677,36.013-15.863,36.013-15.863"
                            transform="translate(2053.208 -7072.97)"
                            fill="none"
                            stroke={arrivee.isIndifferent ? "#ef7615" : "#000"}
                            strokeWidth="1"
                          />
                          <path
                            id="Tracé_6966"
                            data-name="Tracé 6966"
                            d="M0,15.864C3.274,14.187,36.013,0,36.013,0"
                            transform="matrix(0.695, 0.719, -0.719, 0.695, 11.411, 0)"
                            fill="none"
                            stroke={arrivee.isIndifferent ? "#ef7615" : "#000"}
                            strokeWidth="1"
                          />
                        </g>
                      </g>
                    </svg>
                    <br />
                    <span
                      style={
                        arrivee.isIndifferent
                          ? {
                              color: "#ef7615",
                              fontSize: 12,
                            }
                          : {
                              color: "#000",
                              fontSize: 12,
                            }
                      }
                    >
                      {t("circuit_depot_annonce.indifferent")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    this.setState({ page: 1 }, () => {
                      this.filtrer(this.state.page);
                    })
                  }
                  className={"btnBlue mt-5"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19.016"
                    height="19"
                    viewBox="0 0 19.016 19"
                  >
                    <g
                      id="search-svgrepo-com_13_"
                      data-name="search-svgrepo-com (13)"
                      transform="translate(0 -0.2)"
                    >
                      <g
                        id="Groupe_129"
                        data-name="Groupe 129"
                        transform="translate(0 0.2)"
                      >
                        <path
                          id="Tracé_405"
                          data-name="Tracé 405"
                          d="M18.776,17.846l-5.456-5.46a7.37,7.37,0,0,0,1.722-4.739A7.522,7.522,0,0,0,0,7.651a7.529,7.529,0,0,0,12.186,5.834l5.475,5.475a.788.788,0,1,0,1.115-1.115ZM1.6,7.651a5.92,5.92,0,0,1,11.839,0,5.92,5.92,0,0,1-11.839,0Z"
                          transform="translate(0 -0.2)"
                          fill="#fff"
                        />
                      </g>
                    </g>
                  </svg>
                  {t("page_home.recherche")}
                </button>
              </div>
              <div
                className={
                  this.state.loadingSearch
                    ? "col-xl-7 text-center d-flex flex-column justify-content-center"
                    : "col-xl-7 text-center"
                }
              >
                {this.state.loadingSearch ? (
                  <span className="fa fa-spin fa-spinner fa-4x" />
                ) : (
                  this.state.annonces.map((order, key) => (
                    <ul>
                      <div className={"row"} key={"annonce-" + order.id}>
                        <div className={"col-md-12 bg-white role-porteur"}>
                          <div className={"row"}>
                            <div
                              className={"col-lg-3 text-center py-4 pl-4"}
                              style={{ borderRight: "1px solid #EAEAEA" }}
                            >
                              <div
                                className={
                                  "d-flex flex-column gap-2 justify-content-between align-items-center"
                                }
                              >
                                <div>
                                  {order.client.photo ? (
                                    <div className={"position-relative"}>
                                      <LazyLoadImage
                                        src={order.client.photo}
                                        alt={order.client.firstName}
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
                                      alt={order.client.firstName}
                                      style={{
                                        width: "60px",
                                        borderRadius: "50%",
                                      }}
                                    />
                                  )}
                                </div>
                                <p className={"userStatut"}>
                                  <Link to={`/mes-avis-${order.client.firstName.replace(/[^a-zA-Z0-9 ]/g, '').replace(" ","")}-${order.client.id}`}>
                                    <span className="username">
                                      {order.client.firstName}
                                    </span>
                                  </Link>{" "}
                                  <button className={"btnStatut"}>
                                    {t("statut")}
                                  </button>
                                </p>
                                <div>
                                  <span className={"text-orange mr-2"}>
                                    {order.infoAvis ? order.infoAvis.total : 0}
                                  </span>
                                  <LazyLoadImage
                                    src={"/images/star.png"}
                                    alt={"avis"}
                                    className={"mr-2"}
                                  />
                                  <span className={"text-gris"}>
                                    {order.infoAvis
                                      ? order.infoAvis.nbrAvis
                                      : 0}{" "}
                                    {t("page_avis.avis")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                "col-lg-6 py-4 d-flex flex-column align-items-center justify-content-between"
                              }
                            >
                              <div
                                className={
                                  "d-flex align-items-center justify-content-center w-100"
                                }
                              >
                                <div
                                  style={{ width: "70px", maxWidth: "70px" }}
                                className={"col-md-2 text-capitalize"}>
                                  <svg
                                    style={{
                                      position: "absolute",
                                      left: -8,
                                      top: -18,
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
                                    style={{ maxHeight: 35 }}
                                    src={
                                      "/images/" +
                                      order.type_adresse_depart.toLowerCase().replace(" ", "") +
                                      ".png"
                                    }
                                    alt={order.type_adresse_depart}
                                  />
                                </div>

                                <div className={"col-6 col-md-7"}>
                                  <div
                                    className={
                                      "d-flex justify-content-center align-items-center gap-2"
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
                                    {order.objectTransport.includes("Car") ? (
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
                                    {order.objectTransport.includes("Avion") ? (
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
                                    {order.objectTransport.includes("Train") ? (
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
                                        borderTop: "3px solid #ef7615",
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
                                        fill="#ef7615"
                                      >
                                        <path
                                          d="M 25.03966903686523 18.07143592834473 L 0.9603309631347656 18.07143592834473 L 13 0.871906578540802 L 25.03966903686523 18.07143592834473 Z"
                                          stroke="none"
                                        />
                                        <path
                                          d="M 13 1.743783950805664 L 1.920652389526367 17.57142448425293 L 24.07934761047363 17.57142448425293 L 13 1.743783950805664 M 13 -5.7220458984375e-06 L 26 18.57142448425293 L 0 18.57142448425293 L 13 -5.7220458984375e-06 Z"
                                          stroke="none"
                                          fill="#ef7615"
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
                                      {order.objectType.includes("Bagage") ? (
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
                                <div
                                  className={
                                    "col-md-2 d-flex flex-column text-capitalize"
                                  }
                                  style={{
                                    width: "70px",
                                    maxWidth: "70px",
                                  }}
                                >
                                  <svg
                                    style={{
                                      position: "absolute",
                                      right: -10,
                                      top: -20,
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
                                    style={{ maxHeight: 35, width:"max-content" }}
                                    src={
                                      "/images/" +
                                      order.type_adresse_arrivee.toLowerCase().replace(
                                        " ",
                                        ""
                                      ) +
                                      ".png"
                                    }
                                    alt={order.type_adresse_arrivee}
                                  />
                                </div>
                              </div>
<div
                                  className="d-flex justify-content-between w-100"
                                  style={{fontSize: "max(60%,82%)"}}>
                                <div
                                    className={"d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"}>
                                                                                    <span>
                                                                                        <FontAwesomeIcon
                                                                                            icon={faCalendar}
                                                                                            style={{color: "#A1A4A4"}}/>{" "}{order.dateDepart}
                                                                                    </span>
                                  <span>
                                                                                        <FontAwesomeIcon icon={faClock}
                                                                                                         style={{color: "#A1A4A4"}}/>{" "}
                                    {order.heureDepart}
                                                                                    </span>
                                </div>

                                <div
                                    className={"d-flex flex-md-row flex-column w-50 justify-content-around align-items-center py-3"}>
                                                                                    <span>
                                                                                        <FontAwesomeIcon
                                                                                            icon={faCalendar}
                                                                                            style={{color: "#A1A4A4"}}/>{" "}{order.dateArrivee}
                                                                                    </span>
                                  <span>
                                                                                        <FontAwesomeIcon icon={faClock}
                                                                                                         style={{color: "#A1A4A4"}}/>{" "}{order.heureArrivee}
                                                                                    </span>
                                </div>

                              </div>
                            </div>
                            <div
                              className={
                                "col-lg-3 py-4 pr-4 text-center d-flex flex-column align-items-center justify-content-center"
                              }
                              style={{ borderLeft: "1px solid #EAEAEA" }}
                            >
                              {order.isFavoris ? (
                                <svg
                                  className="float-right"
                                  style={{
                                    position: "absolute",
                                    right: "2rem",
                                    top: "1.75rem",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="21.8"
                                  height="17.579"
                                  viewBox="0 0 21.8 17.579"
                                >
                                  <g
                                    id="heart-svgrepo-com_10_"
                                    data-name="heart-svgrepo-com (10)"
                                    transform="translate(0 -33.251)"
                                  >
                                    <g
                                      id="Artwork_15_"
                                      transform="translate(0 33.251)"
                                    >
                                      <g
                                        id="Layer_5_15_"
                                        transform="translate(0)"
                                      >
                                        <path
                                          id="Tracé_7837"
                                          data-name="Tracé 7837"
                                          d="M16.173,33.251c-2.955,0-4.83,3.294-5.274,3.294-.388,0-2.186-3.294-5.274-3.294A5.738,5.738,0,0,0,.009,38.727a6.582,6.582,0,0,0,1.225,4.152C2.772,45.212,9.5,50.83,10.909,50.83c1.444,0,8.107-5.6,9.655-7.951a6.581,6.581,0,0,0,1.225-4.152,5.738,5.738,0,0,0-5.616-5.476"
                                          transform="translate(0 -33.251)"
                                          fill="#ef7615"
                                        />
                                      </g>
                                    </g>
                                  </g>
                                </svg>
                              ) : (
                                <svg
                                  className="float-right"
                                  style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "20px",
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="22.8"
                                  height="20.844"
                                  viewBox="0 0 22.8 20.844"
                                >
                                  <path
                                    id="heart-svgrepo-com_9_"
                                    data-name="heart-svgrepo-com (9)"
                                    d="M19.461,11.572a5.733,5.733,0,0,0-3.534-1.238A8.477,8.477,0,0,0,10.9,12.315a8.477,8.477,0,0,0-5.026-1.981A5.733,5.733,0,0,0,2.34,11.572,5.4,5.4,0,0,0,0,16.081c.085,6.128,10.037,13.36,10.46,13.664l.439.316.439-.316c.424-.3,10.375-7.536,10.46-13.664A5.4,5.4,0,0,0,19.461,11.572ZM15.426,24.24A46.071,46.071,0,0,1,10.9,28.2,46.056,46.056,0,0,1,6.375,24.24c-3.156-3.175-4.841-6-4.87-8.181a3.917,3.917,0,0,1,1.747-3.291,4.262,4.262,0,0,1,2.622-.93,7.63,7.63,0,0,1,4.544,2.016l.482.4.482-.4a7.63,7.63,0,0,1,4.544-2.016,4.262,4.262,0,0,1,2.622.93A3.917,3.917,0,0,1,20.3,16.059C20.266,18.237,18.582,21.065,15.426,24.24Z"
                                    transform="translate(0.5 -9.834)"
                                    fill="#53bfed"
                                    stroke="#ef7615"
                                    strokeWidth="1"
                                  />
                                </svg>
                              )}
                              <p
                                className={"price fs-1 text-orange porter-prix"}
                              >
                                {order.price} €
                              </p>

                              <Link
                                className={"btnBlue myBtn reserver"}
                                to={{
                                  pathname: "/recapitulatif-annonce-porter-"+order.id,
                                  state: {
                                    token: this.state.client.token,
                                    myReservation: order,
                                  },
                                }}
                              >
                                {t("reserver")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ul>
                  ))
                )}
                {this.state.annonces.length && !this.state.loadingSearch ? (
                  <button
                    onClick={() => {
                      this.setState({ page: this.state.page + 1 }, () => {
                        this.filtrer(this.state.page);
                      });
                    }}
                    className={"btnBlueDark"}
                  >
                    {t("btns.voir_plus_annonces")}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
        <div
          className={"py-3"}
          style={{
            backgroundImage: "url(images/bgVioletSectionConfierBagage.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "bottom",
          }}
        >
          <div className="row d-flex justify-content-around gap-4">
            <div className={"col-lg-5"}>
              <div
                style={{
                  background: "url(/images/triangleOrange2.png",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "100% 100%",
                  backgroundSize: "auto",
                  maxWidth: "600px",
                }}
              >
                <div
                  className={
                    "d-flex flex-column justify-content-between dialogueOrange"
                  }
                >
                  <h4 className={"text-white text-uppercase"}>
                    {t("page_home.je_veux_porter_un_bagage")}! <br />
                  </h4>
                  <p className={"text-white"}>
                    {t("page_home.rentabilise_espaces_vides")}
                  </p>
                  <p className={"text-white"}>
                    <Trans i18nKey={"veuxPorterBagagesDesc"}>
                      De la place dans ta voiture ?
                      <br />
                      Un voyage en train sans valise ?
                      <br />
                      Un vol en avion sans bagage ?
                      <br />
                      <strong>
                        Bagzee est la solution simple et idéale pour
                        rentabiliser ton trajet.
                      </strong>
                      <br />
                      Tu portes des bagages d’une ville à une autre et tu
                      amortis
                      <br />
                      le coût de tes déplacements ! Toutes les raisons sont
                      bonnes
                      <br /> pour commencer l’aventure Bagzee !
                    </Trans>
                  </p>
                  <Link
                    to={"/comment-ca-marche"}
                    className={"d-block btnTransparent"}
                  >
                    {t("en_savoir_plus")}
                  </Link>
                </div>
              </div>
            </div>
            <div className={"col-lg-5"}>
              <div
                style={{
                  background: "url(/images/triangleBleu2.png",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "0 100%",
                  backgroundSize: "auto",
                }}
              >
                <div
                  className={
                    "d-flex flex-column justify-content-between dialogueBleu"
                  }
                  style={{ width: "75%" }}
                >
                  <h4 className={"text-white text-uppercase"}>
                    {t("page_home.je_confie_mon_bagage")}
                    <br />
                  </h4>
                  <p className="text-white">
                    {t("page_home.fais_economies_trajet")}
                  </p>
                  <p className={"text-white"}>
                    <Trans i18nKey={"page_home.confieMonBagagesDesc"}>
                      Bagages surchargés ?<br />
                      Achats et cadeaux de retour ?<br />
                      Marchandises limitées en avion ?<br />
                      Manque de confiance en les compagnies aériennes et les
                      aéroports ?<br />
                      Bagages hors format ?<br />
                      BAGZEE est la solution économique et pratique pour le
                      transport de tes bagages !<br />
                      <br />
                      Confie ton bagage à un voyageur qui fait le même trajet
                      que toi !<br />
                      Toutes les raisons sont bonnes pour commencer l’aventure
                      Bagzee !
                    </Trans>
                  </p>
                  <Link
                    to={"/comment-ca-marche"}
                    className={"d-block btnTransparent"}
                  >
                    {t("en_savoir_plus")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className={"m-3"}>
            <div
              className={"bg-white mx-xl-5 px-xl-5 mx-2 px-2"}
              style={{ borderRadius: "50px" }}
            >
              <ul
                className={
                  "etapesBagage flex-column flex-md-row align-item-center align-item-md-start"
                }
              >
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>1</span>
                  <LazyLoadImage src={"/images/etape1.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je crée
                    <br />
                    mon compte
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>2</span>
                  <LazyLoadImage src={"/images/etape2.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je dépose
                    <br />
                    une annonce
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>3</span>
                  <LazyLoadImage src={"/images/etape3.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je réserve,
                    <br />
                    Je paye
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>4</span>
                  <LazyLoadImage src={"/images/etape4.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je dépose/prends
                    <br />
                    le bagage dans
                    <br />
                    un point relais
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>5</span>
                  <LazyLoadImage src={"/images/etape5.png"} alt={"etape1"} />
                  <p className={"text-gris"}>Je voyage</p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>6</span>
                  <LazyLoadImage src={"/images/etape6.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je suis mon bagage
                    <br />
                    sur l’application Bagzee
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>7</span>
                  <LazyLoadImage src={"/images/etape7.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Je récupère/dépose
                    <br />
                    le bagage dans
                    <br />
                    un point relais
                  </p>
                </li>
                <li
                  className={
                    "d-flex flex-column justify-content-start align-items-center"
                  }
                >
                  <span>8</span>
                  <LazyLoadImage src={"/images/etape8.png"} alt={"etape1"} />
                  <p className={"text-gris"}>
                    Le porteur
                    <br />
                    reçoit sa
                    <br />
                    commission
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <VoyagerAvantage />

        <div className={"container-fluid"}>
          <Link to={"/faq"} className={"btnFAQ"}>
            FAQ
          </Link>
        </div>
        <section className={"container-fluid my-5 py-4"}>
          <div className={"row mb-3 px-md-5 mx-md-5 px-3"}>
            <div className={"col-md-4"}>
              <LazyLoadImage
                src={canUseWebP("anete-lusina")}
                alt={"anete-lusina"}
                className={"mb-2"}
              />
              <h4 className={"mb-2"} style={{ color: "#4BBEED" }}>
                BAGZEE
              </h4>
              <h5 className={"mb-2"}>Lorem ipsum dolor sit amet</h5>
              <p className={"mb-2"}>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim m ad minim veniam, commodo coid
                est laborum.
              </p>
              <p className={"mb-2"} style={{ color: "#EE7923" }}>
                Samedi 26 Novembre 2022
              </p>
            </div>
            <div className={"col-md-4"}>
              <LazyLoadImage
                src={canUseWebP("arnel-hasanovic")}
                alt={"arnel-hasanovic"}
                className={"mb-2"}
              />
              <h4 style={{ color: "#4BBEED" }} className={"mb-2"}>
                BAGZEE
              </h4>
              <h5 className={"mb-2"}>Lorem ipsum dolor sit amet</h5>
              <p className={"mb-2"}>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim m ad minim veniam, commodo coid
                est laborum.
              </p>
              <p style={{ color: "#EE7923" }}>Samedi 26 Novembre 2022</p>
            </div>
            <div className={"col-md-4"}>
              <LazyLoadImage
                src={canUseWebP("marissa-grootes")}
                alt={"marissa-grootes"}
                className={"mb-2"}
              />
              <h4 className={"mb-2"} style={{ color: "#4BBEED" }}>
                BAGZEE
              </h4>
              <h5 className={"mb-2"}>Lorem ipsum dolor sit amet</h5>
              <p className={"mb-2"}>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim m ad minim veniam, commodo coid
                est laborum.
              </p>
              <p style={{ color: "#EE7923" }}>Samedi 26 Novembre 2022</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default withTranslation()(PorterBagage);
