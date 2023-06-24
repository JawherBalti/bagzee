import React, {Component} from 'react';
import Block404 from "./Block404";
import Footer from "./Footer";
import Header from "./Header";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {withTranslation,Trans} from "react-i18next";

class PourquoiBagzee extends Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }

    render() {
        function canUseWebP(img) {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('safari') > -1) {
                if (ua.indexOf('chrome') > -1) {
                    return '/images/'+img+'.webp'
                } else {
                    return '/images/'+img+'.png'
                }
            }
        }
        const { t } = this.props;
        return (
            <>
                <Header/>
                <section className={'container mt-5'}>
                    <div className={'row'}>
                        <div className={'col-md-8'}>
                            <h2 style={{color:'#38BFEF'}}>
                                <Trans i18nKey={'PourquoiBagzee.title1'}>
                                Hugo Serres,<br/>CEO-Fondateur de Bagzee
                                </Trans>
                            </h2>
                            <p style={{lineHeight:2}}>
                                <Trans i18nKey={'PourquoiBagzee.desc1'}>
                                    Je suis Hugo Serres, le fondateur de Bagzee.<br/><br/>

                                Depuis 2018 je suis marchand de vins et je fais venir mes bouteilles de partout en
                                France par des
                                transporteurs particuliers et professionnels via des plateformes collaboratives de
                                colis. Je me dis
                                    soudainement : et si j’expédiais mes vins à mes clients de la même manière ?
                                </Trans>
                            </p>
                            <p style={{lineHeight:2}}>
                                {t('PourquoiBagzee.desc2')}
                            </p><br/>
                        </div>
                        <div className={'col-md-4'}>
                            <LazyLoadImage src={canUseWebP("fondateurBagzee")} alt={"fondateurBagzee"}  style={{padding:'10px'}}/>
                        </div>
                    </div>
                    <p style={{lineHeight:2}}>
                        <Trans i18nKey={'PourquoiBagzee.desc3'}>
                        Au même moment, je loue aussi des chambres en courtes durées. Les voyageurs me demandent souvent
                        de laisser leur bagage lors du check-out et de le récupérer en fin de journée, avant de prendre
                        l’avion ou le train. Je les vois repartir plus chargés qu’à l’aller et je pense au supplément
                        bagage qui les attend.
                        <br/><br/>
                        Fini le fardeau des bagages ? Pourquoi pas confier son bagage entier à un autre voyageur qui n’a
                        pas de bagages ? Ou qui bénéficie d’un tarif de supplément moins chers ? Ou qui a tout
                        simplement la place dans sa voiture, sur sa moto, en avion, en train ou sur un ferry ? Et s’il
                        suffisait que X confie à Y son bagage afin de lui éviter de payer un supplément bagage ? Et s’il
                        suffisait de mettre en relations ces voyageurs et de leur apporter de la sécurité et de la
                        confiance pour le permettre ?
                        <br/><br/>
                        Je vois le potentiel, les idées fusent, le concept de “cobagage” prend forme et je ressens cette
                        rare, vibrante et profonde excitation que chaque nouveau projet me procure.
                        <br/><br/>
                        C’est en juin 2021, que les planètes s’alignent : j’ai dégagé du temps, la covid ralentit, les
                        avions redécollent, le marché est toujours inoccupé et j’ai rencontré Sofia, ma meilleure amie,
                        dont je connais le professionnalisme, l’ambition et le sérieux. C’est le moment. Nous réalisons
                        plusieurs enquêtes de terrains et études de marché et ça se confirme : le potentiel est là. La
                        demande est forte, l’offre inexistante et les modes de consommations collaboratifs croissants.
                        <br/><br/>
                        </Trans>
                    </p>
                    <p style={{lineHeight:2}}>
                        <Trans i18nKey={'PourquoiBagzee.desc4'}>
                        Bagzee offre un service simple : un propriétaire de bagage confie son bagage ou objets à un
                        voyageur nommé porteur afin qu’il l’achemine du point A au point B, par n’importe quel moyen de
                        locomotion, pour un prix en moyenne 30% moins cher que le tarif du supplément bagage aérien.
                        Pourquoi Bagzee ? Pour le confort et la mobilité, pour la sécurité et la tranquillité d’esprit,
                        pour la rapidité et le temps gagné, pour l’argent engrangé et les économies faites, pour
                        l’écologie et la planète.
                        <br/><br/>
                        Nous mettons en avant l’innovation, la mobilité, le confort, la confiance et l’environnement.
                        Nous voulons libérer le trajet du voyageur, enrichir le consommateur, créer une communauté,
                        protéger l’environnement et CHANGER LE MONDE. Nous ambitionnons de devenir un acteur majeur du
                        marché du supplément bagage, de la livraison de tout type d’objets et du déménagement. Le monde
                        de demain est innovant, entrepreneurial, collaboratif et individualisé. Tout le monde offrira
                        des biens et services sur-mesure à un particulier ou une entreprise. L’avenir, c’est la
                        livraison par drones, les capsules volantes individuelles, les taxis autonomes ou encore les
                        Hyperloop.
                        <br/><br/>
                        Demain, j’imagine des voyages légers, des bagages sécurisés, du temps gagné, moins de pollution,
                        des coûts de déplacements réduits et un supplément bagage moins cher.
                        <br/><br/>
                        Je rêve de changer le monde. Changer les modes de consommations. Changer la vie des gens. Je
                        vais commencer par celle des voyageurs...
                        <br/><br/>
                        </Trans>
                    </p>
                    <div className={'row'}>
                        <div className={'col-md-8'}>
                            <h2  style={{color:'#38BFEF'}}>
                                <Trans i18nKey={'PourquoiBagzee.title2'}>
                                    Sofia Khattabi,<br/>
                                CO-CEO et Co-Fondatrice<br/>
                                de Bagzee
                                </Trans>
                            </h2>
                            <p style={{lineHeight:2}}>
                                <Trans i18nKey={'PourquoiBagzee.desc5'}>
                                    Je suis Sofia KHATTABI, la co-fondatrice de Bagzee.<br/><br/>

                                BAGZEE est entrée dans ma vie sous la couverture d’une autre aventure frissonnante que
                                je ne me voyais pas vivre, mais pas non plus refusée. Lorsque tout a commencé, je venais
                                d’emménager à Lyon, pour suivre une formation bac+3 dans une école de commerce en
                                alternance. J’avais mes cours, mon job et une vie assez remplie en réalité.
                                </Trans>
                            </p><br/>
                        </div>

                        <div className={'col-md-4'}>
                            <LazyLoadImage src={canUseWebP("fondatriceBagzee")} alt={"fondatriceBagzee"} style={{padding:'10px'}}/>
                        </div>
                    </div>
                    <p style={{lineHeight:2}}>
                        <Trans i18nKey={'PourquoiBagzee.desc6'}>
                        Parfois, la nature des relations que nous tissons avec les autres nous fait oublier l’importance
                        qui réside dans la nouvelle rencontre, dans la bienveillance et le positif qui peuvent en
                        sortir.
                        <br/><br/>
                        Voilà ce que m’inspire ma rencontre avec Hugo Serres, mon meilleur ami et partenaire. Les
                        premières choses que l’on a retenues l’un sur l’autre c’est notre envie d’avancer, de prendre
                        des risques et notre ambition. Ensuite, tout est venu naturellement, on a beaucoup discuté de
                        ses business, de stratégies d’entreprise... puis il a fini par me proposer de l’accompagner dans
                        son histoire de cobagage.
                        <br/><br/>
                        Evidemment, lorsqu’on parle de cobagage, ce n’est pas très tchatcheur comme ça, pourtant, c’est
                        en réalité un des sujets les plus intéressants de business que l'on ait pu découvrir ! Un marché
                        de 25 milliards de chiffre d’affaires dans le monde, peu exploité, monopolisé par les compagnies
                        aériennes qui gèrent les bagages du départ à l’arrivée. Sans parler des vols, casses, pertes que
                        l’on rencontre en cours d'acheminement.
                        <br/><br/>
                        De plus, étant d’origine maghrébine, j’ai été amenée à prendre le bateau quelques fois en
                        famille pour traverser la mer Méditerranée. A cette époque, je trouvais ça plaisant de voir à
                        quel point les personnes autour de nous s’entraidaient pour faire transporter leur surplus de
                        bagages ou d’objets de différentes tailles ou valeurs. Ces personnes n’avaient pas d’autre
                        solution que la collaboration. Alors, je trouve ça très bien d’aider à concevoir un service qui
                        leur servira d’assurance, de sécurité et d’accompagnement, et ce, à un coût moins cher que celui
                        du marché.
                        <br/><br/>
                        En toute honnêteté, l’idée que des personnes puissent gagner un peu d’argent tout en voyageant
                        ou en rentrant chez elles, juste en apportant des affaires ou des bagages me fait aussi plaisir
                        !
                        <br/><br/>
                        Par ailleurs, dans un contexte où l’entraide, la responsabilisation et la sensibilisation
                        doivent devenir primordiales dans nos façons de consommer. Pourquoi ne pas encourager leur
                        progression en œuvrant pour leur mise en place et leur pratique. BAGZEE n’est pas qu’un service
                        qui facilite le transport de bagage de manière plus économique, écologique et sécurisé. C’est
                        aussi une équipe, une finalité et des valeurs qui nous tiennent à cœur. Une fois l’Homme, deux
                        fois l’Homme, trois fois l’Homme... comme dirait une de mes connaissances. Nous créons un
                        écosystème et espérons influencer par nos décisions, aider autour de nous et apprendre toujours
                        plus de ce qui a été fait, de ce qui se fait actuellement et de ce qui se fera plus tard.
                        <br/><br/>
                        Sans surprise, nous n’en sommes qu’au début de l’histoire BAGZEE, mais je reste très heureuse
                        que l’on ait réussi à faire tout ce chemin, réaliser autant de choses en si peu de temps et le
                        meilleur reste à venir ! Pour cette raison, je remercie les professionnels et les personnes qui
                        nous ont aidés et soutenus dans ce projet ! J’insiste sur le l’entourage qualitatif que nous
                        avons, nos freelanceurs, Sandrine TORDJMAN et Noa SAMAI, et notre agence de développement WEBCOM
                        Agency, qui nous ont prouvé plus d’une fois qu’ils maitrisaient leur sujet !
                        <br/><br/>
                        Le meilleur pour la fin, je vous remercie de lire ce mot, de faire preuve de curiosité, d’être
                        présent sur notre plateforme ou application mobile et pour les membres de la team BAGZEE, merci
                        d’utiliser ce service et de nous aider à l’améliorer un peu plus chaque jour ! :)
                        </Trans>
                    </p>
                </section>
                <Footer/>
            </>
        )
    }
}

export default withTranslation()(PourquoiBagzee);