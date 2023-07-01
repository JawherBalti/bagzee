<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Client;
use App\Entity\Notification;
use App\Entity\Document;
use App\Entity\PhotoClient;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\DocumentRepository;
use App\Repository\PorteurRepository;
use App\Repository\PhotoClientRepository;
use App\Service\SendEmail;
use App\Repository\AdvertRepository;
use App\Repository\BaggagiteRepository;
use App\Repository\BaggisteQueryRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\AvisRepository;
use App\Repository\SettingPriceRepository;

/**
 * @Route("/api/profil", name="api_")
 */
class ProfilController extends AbstractController
{

    /**
     * @Route("/client", name="profil_client", methods={"POST"})
     */
    public function profil_client(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder, ClientRepository $clientRepo): Response
    {

        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $client = [];
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $status = true;
            $message = 'Info client';
            $client = [
                'id' => $hasClient->getId(),
                'firstName' => $hasClient->getFirstname(),
                'lastName' => $hasClient->getLastname(),
                'email' => $hasClient->getEmail(),
                'gender' => $hasClient->getGender(),
                'phone' => $hasClient->getPhone(),
                'birdh' => date_format($hasClient->getBirdh(), 'd-m-Y'),
                'photo' => $hasClient->getPhoto() ?? '',
                'description'=> $hasClient->getDescription(),
                'nationalite' => $hasClient->getNationalite() ?? '',
                'entreprise' => $hasClient->getEntreprise() ?? '',
                'siret' => $hasClient->getSiret() ?? '',
                'isPointRelais' => in_array('ROLE_POINT_RELAIS', $hasClient->getRoles()) ? true : false,

            ];
        }

        return $this->json(['status' => $status, 'message' => $message, 'client' => $client]);


    }

    /**
     * @Route("/client", name="get_profil_client", methods={"GET"})
     */
    public function getprofil_client(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder, ClientRepository $clientRepo): Response
    {

        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['id' => $_GET['id']]);
        $client = [];
        if (!$hasClient) {
            $status = false;
            $message = 'id incorrect';
        } else {
            $status = true;
            $message = 'Info client';
            $client = [
                'id' => $hasClient->getId(),
                'firstName' => $hasClient->getFirstname(),
                'lastName' => $hasClient->getLastname(),
                'email' => $hasClient->getEmail(),
                'gender' => $hasClient->getGender(),
                'phone' => $hasClient->getPhone(),
                'description'=> $hasClient->getDescription(),
                'birdh' => date_format($hasClient->getBirdh(), 'd-m-Y'),
                'photo' => $hasClient->getPhoto() ?? '',
                'nationalite' => $hasClient->getNationalite() ?? '',
                'entreprise' => $hasClient->getEntreprise() ?? '',
                'siret' => $hasClient->getSiret() ?? '',
                'isPointRelais' => in_array('ROLE_POINT_RELAIS', $hasClient->getRoles()) ? true : false,

            ];
        }

        return $this->json(['status' => $status, 'message' => $message, 'client' => $client]);


    }


    /**
     * @Route("/update", name="update_client", methods={"POST"})
     */
    public function update_client(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder, ClientRepository $clientRepo): Response
    {

        $data = json_decode($request->getContent(), true);

        $entityManager = $doctrine->getManager();
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $client = [];
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $hasClient->setFirstname($data['firstName']);
            $hasClient->setLastname($data['lastName']);
            $hasClient->setEmail($data['email']);
            $hasClient->setGender($data['gender']);
            $hasClient->setPhone($data['phone']);
            $hasClient->setBirdh(new \DateTime($data['birdh']));
            $hasClient->setNationalite($data['nationalite']);
            $hasClient->setNationalite($data['nationalite']);

            $hasClient->setSiret($data['numSiret']);
            $hasClient->setPhoto($data['photo']);
            $hasClient->setEntreprise($data['nomEntreprise']);

            if (isset($data['password'])) {
                if ($data['password'] != "") {
                    $hasClient->setPassword($passwordEncoder->hashPassword($hasClient, $data['password']));

                }
            }
             if (isset($data['description'])) {
                if ($data['description'] != "") {
                    $hasClient->setDescription($data['description']);

                }
            }
            if (in_array('ROLE_POINT_RELAIS', $hasClient->getRoles())) {
                if (count($hasClient->getAdresses()) > 0) {
                    $hasClient->getAdresses()[0]->setVille($data['ville']);
                }
            }
            $entityManager->flush();

            $status = true;
            $message = 'Info client';
            $client = [
                'id' => $hasClient->getId(),
                'firstName' => $hasClient->getFirstname(),
                'lastName' => $hasClient->getLastname(),
                'email' => $hasClient->getEmail(),
                'gender' => $hasClient->getGender(),
                'phone' => $hasClient->getPhone(),
                'birdh' => date_format($hasClient->getBirdh(), 'd-m-Y'),
                'photo' => $hasClient->getPhoto() ?? '',
                'nationalite' => $hasClient->getNationalite(),
                'numSiret' => $hasClient->getSiret() ?? '',
                'isPointRelais' => in_array('ROLE_POINT_RELAIS', $hasClient->getRoles()) ? true : false,
                'nomEntreprise' => $hasClient->getEntreprise() ?? ''
            ];
        }

        return $this->json(['status' => $status, 'message' => $message, 'client' => $client]);


    }

    /**
     * @Route("/forget/password", name="forget_password", methods={"POST"})
     */
    public function forget_password(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, SendEmail $sendEmail): Response
    {
        $baseurl = $request->getSchemeAndHttpHost();

        $data = json_decode($request->getContent(), true);

        $hasClient = $clientRepo->findOneBy(['email' => $data['email']]);
        if (!$hasClient) {
            $status = false;
            $message = "vous n'avez pas encore un compte, inscrivez-vous ou vérifier votre adresse mail";
        } else {
            $url = $baseurl . '/valider-nouveau-mot-de-passe-' . $hasClient->getToken();
            $status = true;
            $message = 'Vous devez consulter votre boite email';
            $body = $this->renderView('email/forgetPassword.html.twig', array('client' => $hasClient, 'url' => $url));
            $sendEmail->sendEmail('mot de passe oublie', $hasClient->getEmail(), $body);
        }

        return $this->json(['status' => $status, 'message' => $message]);


    }

    /**
     * @Route("/forget/password/update", name="update_password", methods={"POST"})
     */
    public function update_password(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, UserPasswordHasherInterface $passwordEncoder): Response
    {
        $data = json_decode($request->getContent(), true);

        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'Vous mot de passe a été mis à jour';
            $hasClient->setPassword($passwordEncoder->hashPassword($hasClient, $data['password']));

        }

        return $this->json(['status' => $status, 'message' => $message]);


    }

    /**
     * @Route("/photo/add", name="profil_photo_add", methods={"POST"})
     */
    public function profil_photo_add(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo): Response
    {
        $data = json_decode($request->getContent(), true);

        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'Votre photo a été pris en compte';
            $entityManager = $doctrine->getManager();
            $photoClient = new PhotoClient();
            $photoClient->setUrl($data['photo']);
            $photoClient->setClients($hasClient);
            $entityManager->persist($photoClient);
            $entityManager->flush();

        }
        return $this->json(['status' => $status, 'message' => $message]);

    }


    /**
     * @Route("/document/add", name="profil_document_add", methods={"POST"})
     */
    public function profil_document_add(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, DocumentRepository $documentRepo): Response
    {
        $data = json_decode($request->getContent(), true);

        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'Votre document a été pris en compte';
            $entityManager = $doctrine->getManager();
            $document = $documentRepo->findOneBy(['client' => $hasClient]);
            $document = $document ? $document : new Document();
            $document->setCin($data['cin']);
            $document->setPermis($data['permis']);
            $document->setPermis($data['permis']);
            $document->setCasier($data['casier']);
            $document->setSanitaire($data['sanitaire']);
            $document->setKbis($data['kbis']);
            $document->setCarteEUR($data['carteEUR']);
            $document->setFacture($data['facture']);
            $document->setJustification($data['justification']);
            $document->setClient($hasClient);
            $entityManager->persist($document);
            $entityManager->flush();

        }
        return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
     * @Route("/document/show", name="profil_document_show", methods={"POST"})
     */
    public function profil_document_show(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, DocumentRepository $documentRepo): Response
    {
        $data = json_decode($request->getContent(), true);
        $tab = [];
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'liste document';
            $entityManager = $doctrine->getManager();
            $document = $documentRepo->findOneBy(['client' => $hasClient]);
            if ($document) {
                $tab = [
                    'cin' => $document->getCin() ?? '',
                    'permis' => $document->getPermis() ?? '',
                    'casier' => $document->getCasier() ?? '',
                    'sanitaire' => $document->getSanitaire() ?? '',
                    'kbis' => $document->getKbis() ?? '',
                    'carteEUR' => $document->getCarteEUR() ?? '',
                    'facture' => $document->getFacture() ?? '',
                    'justification' => $document->getJustification() ?? '',
                ];
            }


        }
        return $this->json(['status' => $status, 'message' => $message, 'document' => $tab]);

    }


    /**
     * @Route("/photo/list", name="profil_photo_list", methods={"POST"})
     */
    public function profil_photo_list(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, PhotoClientRepository $photoClientRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $tabGallery = [];
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $galleries = $photoClientRepository->findBy(['clients' => $hasClient]);
            if ($galleries) {
                foreach ($galleries as $key => $gallery) {
                    $tabGallery[] = [
                        'createdAt' => date_format($gallery->getCreatedAt(), 'd-m-Y'),
                        'url' => $gallery->getUrl(),
                        'uid' => $gallery->getId(),
                        'status' => 'done'
                    ];
                }
            }
            $status = true;
            $message = 'Liste photo en cours';


        }

        return $this->json(['status' => $status, 'message' => $message, 'tabGallery' => $tabGallery]);

    }


    /**
     * @Route("/photo/delete", name="profil_photo_delete", methods={"GET"})
     */
    public function profil_photo_delete(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, PhotoClientRepository $photoClientRepository): Response
    {

        $hasClient = $clientRepo->findOneBy(['token' => $_GET['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'Photo a été supprimer';
            $entityManager = $doctrine->getManager();
            $photoClient = $photoClientRepository->find($_GET['uid']);
            $entityManager->remove($photoClient);
            $entityManager->flush();

        }
        return $this->json(['status' => $status, 'message' => $message]);
    }

    /**
     * @Route("/adverts", name="adverts_list_profil_client", methods={"POST"})
     */
    public function adverts_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertRepository $advertRepository): Response
    {
        $tabAdverts = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);

        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $myStatus = intval($data['status']);
            if ($myStatus == 1)
                $myStatus = [$myStatus, 4];

            $adverts = $advertRepository->findBy(['client' => $hasClient, 'status' => $myStatus], ['id' => 'desc']);

            if ($adverts) {
                  foreach ($adverts as $key => $advert) {
                     // $avis = $avisRepository->nbreavisbyClient([$annonce->getClient()->getId()]);

                    $tabAdverts[] = [
                        'id' => $advert->getId(),
                        'status' => $advert->getStatus(),
                        'dimensionsLarg' => $advert->getDimension()->getWidth(),
                        'dimensionsH' => $advert->getDimension()->getHeight(),
                        'dimensionsLong' => $advert->getDimension()->getLength(),
                        'dimensionsKg' => $advert->getDimension()->getWeight(),
                        'ville_depart' => $advert->getFromAdress(),
                        'ville_arrivee' => $advert->getToAdress(),
                        'description' => $advert->getDescription(),
                        'objectType' => implode(",", $advert->getObjectType()),
                        'objectTransport' => implode(",", $advert->getObjectTransport()),
                        'dateDepart' => date_format($advert->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($advert->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                        'listeContenu' => $advert->getObjectContenu(),

                        'price' => $advert->getPrice(),

                        'adresse_point_depart' => $advert->getAdressPointDepart(),
                        'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                        'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $advert->getTypeAdressDepart(),
                        'hasDemande' => count($advert->getAdvertQueries()) > 0 ? true : false,
                        'canDepose' => $advert->isCanDepose(),

 ];
                }
            }
            $status = true;
            $message = 'liste des adverts';
        }
        return $this->json(['status' => $status, 'message' => $message, 'adverts' => $tabAdverts]);


    }

    /**
     * @Route("/adverts", name="get_adverts_list_profil_client", methods={"GET"})
     */
    public function getadverts_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertRepository $advertRepository): Response
    {
        $tabAdverts = [];
        //$data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['id' => $_GET['id']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $myStatus = intval($_GET['status']);
            if ($myStatus == 1)
                $myStatus = [$myStatus, 4];

            $adverts = $advertRepository->findBy(['client' => $hasClient, 'status' => $myStatus], ['id' => 'desc']);
            if ($adverts) {
                foreach ($adverts as $key => $advert) {
                    $galleries = $advert->getImages();
                    $gallery = [];
                    if (count($galleries) > 0) {
                        foreach ($galleries as $key => $gallerie) {
                            $gallery[] = [
                                'id' => $gallerie->getId(),
                                'url' => $gallerie->getUrl(),
                                'uid' => $gallerie->getId(),
                                'status' => 'done'
                            ];
                        }
                    }
                    $tabAdverts[] = [
                        'id' => $advert->getId(),
                        'dimensionsLarg' => $advert->getDimension()->getWidth(),
                        'dimensionsH' => $advert->getDimension()->getHeight(),
                        'dimensionsLong' => $advert->getDimension()->getLength(),
                        'dimensionsKg' => $advert->getDimension()->getWeight(),
                        'ville_depart' => $advert->getFromAdress(),
                        'ville_arrivee' => $advert->getToAdress(),
                        'description' => $advert->getDescription(),
                        'objectType' => implode(",", $advert->getObjectType()),
                        'objectTransport' => implode(",", $advert->getObjectTransport()),
                        'dateDepart' => date_format($advert->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($advert->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                        'status' => $advert->getStatus(),
                        'listeContenu' => $advert->getObjectContenu(),
                        'price' => $advert->getPrice(),
                        'adresse_point_depart' => $advert->getAdressPointDepart(),
                        'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                        'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $advert->getTypeAdressDepart(),
                        'hasDemande' => count($advert->getAdvertQueries()) > 0 ? true : false,
                        'objectRelaisDepart' => $advert->getobjectRelaisDepart(),
                        'objectRelaisArriv' => $advert->getobjectRelaisArriv(),
                        'priceNet' => $advert->getPriceNet(),
                        'gallery' => $gallery,
                        'canDepose' => $advert->isCanDepose()
                    ];
                }
            }
            $status = true;
            $message = 'liste des adverts';
        }
        return $this->json(['status' => $status, 'message' => $message, 'adverts' => $tabAdverts]);


    }


    /**
     * @Route("/adverts/query", name="adverts_query_list_profil_client", methods={"POST"})
     */
    public function adverts_query_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertQueryRepository $advertQueryRepository): Response
    {
        $tabAdverts = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $adverts = $advertQueryRepository->findBy(['client' => $hasClient, 'status' => intval($data['status'])], ['id' => 'desc']);
            if ($adverts) {
                foreach ($adverts as $key => $advert) {

                    $tabAdverts[] = [
                        'id' => $advert->getId(),
                        'dimensionsLarg' => $advert->getAdvert()->getDimension()->getWidth(),
                        'dimensionsH' => $advert->getAdvert()->getDimension()->getHeight(),
                        'dimensionsLong' => $advert->getAdvert()->getDimension()->getLength(),
                        'dimensionsKg' => $advert->getAdvert()->getDimension()->getWeight(),
                        'ville_depart' => $advert->getAdvert()->getFromAdress(),
                        'ville_arrivee' => $advert->getAdvert()->getToAdress(),
                        'description' => $advert->getAdvert()->getDescription(),
                        'objectType' => implode(",", $advert->getAdvert()->getObjectType()),
                        'objectTransport' => implode(",", $advert->getAdvert()->getObjectTransport()),
                        'dateDepart' => date_format($advert->getAdvert()->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($advert->getAdvert()->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($advert->getAdvert()->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($advert->getAdvert()->getTimeTo(), 'H:i'),
                        'status' => $advert->getStatus(),
                        'listeContenu' => $advert->getAdvert()->getObjectContenu(),
                        'price' => $advert->getAdvert()->getPrice(),
                        'priceNet' => $advert->getAdvert()->getPriceNet()?$advert->getAdvert()->getPriceNet():30,
                        'objectRelaisDepart' => $advert->getAdvert()->getobjectRelaisDepart(),
                        'objectRelaisArriv' => $advert->getAdvert()->getobjectRelaisArriv(),
                        'adresse_point_depart' => $advert->getAdvert()->getAdressPointDepart(),
                        'adresse_point_arrivee' => $advert->getAdvert()->getAdressPointArrivee(),
                        'type_adresse_arrivee' => $advert->getAdvert()->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $advert->getAdvert()->getTypeAdressDepart(),
                    ];
                }
            }
            $status = true;
            $message = 'liste des adverts';
        }
        return $this->json(['status' => $status, 'message' => $message, 'adverts' => $tabAdverts]);


    }


    /**
     * @Route("/liste/demande/adverts", name="adverts_list_demande_profil_client", methods={"POST"})
     */
    public function adverts_list_demande_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertRepository $advertRepository, AvisRepository $avisRepo, SettingPriceRepository $settingPriceRepository): Response
    {
        $tabAdverts = [];
        $gallery = [];
        $porteurs = [];
        $idPorteur = [];
        $tabsettingPrice = [];
        $listeContenu = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $setting_prices = $settingPriceRepository->findAll();
        if ($setting_prices) {
            foreach ($setting_prices as $key => $setting_price) {
                $tabsettingPrice[] = [
                    'id' => $setting_price->getId(),
                    'name' => $setting_price->getName(),
                    'price' => $setting_price->getPrice(),
                    'isRelais' => $setting_price->getIsRelais()
                ];
            }
        }
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $advert = $advertRepository->find($data['advert_id']);

            if ($advert) {

                if (count($advert->getAdvertQueries()) > 0) {
                    foreach ($advert->getAdvertQueries() as $key => $advertQueries) {
                        if ($advertQueries->getClient() != $hasClient) {
                            $idPorteur = [];
                            $advertByPorteur = $advertQueries->getClient()->getAdverts();
                            if (count($advertByPorteur) > 0) {
                                foreach ($advertByPorteur as $key => $advertByPorteur) {
                                    $idPorteur[] = $advertByPorteur->getId();
                                }
                            }
                            $avis = $avisRepo->nbreAdvert($idPorteur);

                            $porteurs[] = [
                                'id' => $advertQueries->getClient()->getId(),
                                'photo' => $advertQueries->getClient()->getPhoto() ?? '',
                                'firstName' => $advertQueries->getClient()->getFirstname(),
                                'email' => $advertQueries->getClient()->getEmail(),
                                'lastName' => $advertQueries->getClient()->getLastname(),
                                'nbrAvis' => floatval($avis['nbrAvis']),
                                'totalAvis' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1),
                                'price_porteur' => $advertQueries->getPrice(),
                                'isValid' => $advertQueries->getIsValid(),
                                'isPaied' => $advertQueries->getIsPaied(),
                                'setting_price' => $tabsettingPrice,
                                'dimensionsLarg' => $advertQueries->getWidth(),
                                'dimensionsH' => $advertQueries->getHeight(),
                                'dimensionsLong' => $advertQueries->getLength(),
                                'dimensionsKg' => $advertQueries->getWeight(),
                                'ville_depart' => $advertQueries->getFromAdress(),
                                'ville_arrivee' => $advertQueries->getToAdress(),
                                'description' => $advertQueries->getDescription(),
                                'objectType' => implode(",", $advertQueries->getObjectType()),
                                'objectTransport' => implode(",", $advertQueries->getObjectTransport()),
                                'objectRelaisDepart' => $advertQueries->getobjectRelaisDepart(),

                                'objectRelaisArriv' => $advertQueries->getobjectRelaisArriv(),
                                'dateDepart' => date_format($advertQueries->getDateFrom(), 'd-m-Y'),
                                'dateArrivee' => date_format($advertQueries->getDateTo(), 'd-m-Y'),
                                'heureDepart' => date_format($advertQueries->getTimeFrom(), 'H:i'),
                                'heureArrivee' => date_format($advertQueries->getTimeTo(), 'H:i'),
                                'listeContenu' => implode(",", $advertQueries->getObjectContenu()),
                                'price' => $advertQueries->getPrice(),
                                'priceNet' => $advertQueries->getAdvert()->getPriceNet()?$advertQueries->getAdvert()->getPriceNet():30,
                                'adresse_point_depart' => $advertQueries->getAdressPointDepart(),
                                'adresse_point_arrivee' => $advertQueries->getAdressPointArrivee(),
                                'type_adresse_arrivee' => $advertQueries->getTypeAdresseArrivee(),
                                'type_adresse_depart' => $advertQueries->getTypeAdressDepart(),
                                'id_advert_query' => $advertQueries->getId()
                            ];
                        }
                    }

                }
                foreach ($advert->getObjectContenu() as $key => $adlisteContenu) {
                    $listeContenu[] = ['label' => $adlisteContenu];
                }
                if (count($advert->getImages()) > 0) {
                    foreach ($advert->getImages() as $key => $doc) {
                        $gallery[] = [
                            'id' => $doc->getId(),
                            'url' => $doc->getUrl(),
                            'uid' => $doc->getId(),
                            'status' => 'done'
                        ];
                    }
                }
                $tabAdverts = [
                    'id' => $advert->getId(),
                    'dimensionsLarg' => $advert->getDimension()->getWidth(),
                    'dimensionsH' => $advert->getDimension()->getHeight(),
                    'dimensionsLong' => $advert->getDimension()->getLength(),
                    'dimensionsKg' => $advert->getDimension()->getWeight(),
                    'ville_depart' => $advert->getFromAdress(),
                    'ville_arrivee' => $advert->getToAdress(),
                    'description' => $advert->getDescription(),
                    'objectType' => implode(",", $advert->getObjectType()),
                    'objectTransport' => implode(",", $advert->getObjectTransport()),
                    'dateDepart' => date_format($advert->getDateFrom(), 'd-m-Y'),
                    'dateArrivee' => date_format($advert->getDateTo(), 'd-m-Y'),
                    'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                    'listeContenu' => $listeContenu,
                    'price' => $advert->getPrice(),
                    'adresse_point_depart' => $advert->getAdressPointDepart(),
                    'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                    'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $advert->getTypeAdressDepart(),
                    'porteurs' => $porteurs,
                    'gallery' => $gallery
                ];
            }
            $status = true;
            $message = 'liste des demandes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'adverts' => $tabAdverts]);


    }

    /**
     * @Route("/baggagistes", name="get_baggagiste_list_profil_client", methods={"GET"})
     */
    public function getbaggagiste_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggagiteRepository $baggagiteRepository): Response
    {
        $tabBagagistes = [];
        //$data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['id' => $_GET['id']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $myStatus = intval($_GET['status']);
            if ($myStatus == 1)
                $myStatus = [$myStatus, 4];

            $baggagistes = $baggagiteRepository->findBy(['client' => $hasClient, 'status' => $myStatus], ['id' => 'desc']);
            if ($baggagistes) {
                foreach ($baggagistes as $key => $baggagiste) {

                    $tabBagagistes[] = [
                        'id' => $baggagiste->getId(),
                        'ville_depart' => $baggagiste->getAdressFrom(),
                        'ville_arrivee' => $baggagiste->getAdressTo(),
                        'dateDepart' => date_format($baggagiste->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($baggagiste->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($baggagiste->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($baggagiste->getTimeTo(), 'H:i'),
                        'adresse_point_depart' => $baggagiste->getAdressePointDepart(),
                        'adresse_point_arrivee' => $baggagiste->getAdressePointArrivee(),
                        'commentaire' => $baggagiste->getCommentaire(),
                        'contenuRefuse' => implode(',', $baggagiste->getContenuRefuse()),
                        'status' => $baggagiste->getStatus(),
                        'dimensionsLarg' => $baggagiste->getDimension()->getWidth(),
                        'dimensionsH' => $baggagiste->getDimension()->getHeight(),
                        'dimensionsLong' => $baggagiste->getDimension()->getLength(),
                        'dimensionsKg' => $baggagiste->getDimension()->getWeight(),
                        'type_adresse_arrivee' => $baggagiste->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $baggagiste->getTypeAdresseDepart(),
                        'objectType' => implode(",", $baggagiste->getObjectType()),
                        'objectTransport' => implode(",", $baggagiste->getObjectTransport()),
                        'notContain' => implode(",", $baggagiste->getNotContain()),
                        'hasDemande' => count($baggagiste->getBaggisteQuery()) > 0 ? true : false,
                        'canDepose' => $baggagiste->isCanDepose()

                    ];
                }
            }
            $status = true;
            $message = 'liste des baggagistes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'baggagistes' => $tabBagagistes]);


    }

    /**
     * @Route("/baggagistes", name="baggagiste_list_profil_client", methods={"POST"})
     */
    public function baggagiste_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggagiteRepository $baggagiteRepository): Response
    {
        $tabBagagistes = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $myStatus = intval($data['status']);
            if ($myStatus == 1)
                $myStatus = [$myStatus, 4];

            $baggagistes = $baggagiteRepository->findBy(['client' => $hasClient, 'status' => $myStatus], ['id' => 'desc']);
            if ($baggagistes) {
                foreach ($baggagistes as $key => $baggagiste) {

                    $tabBagagistes[] = [
                        'id' => $baggagiste->getId(),
                        'ville_depart' => $baggagiste->getAdressFrom(),
                        'ville_arrivee' => $baggagiste->getAdressTo(),
                        'dateDepart' => date_format($baggagiste->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($baggagiste->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($baggagiste->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($baggagiste->getTimeTo(), 'H:i'),
                        'adresse_point_depart' => $baggagiste->getAdressePointDepart(),
                        'adresse_point_arrivee' => $baggagiste->getAdressePointArrivee(),
                        'commentaire' => $baggagiste->getCommentaire(),
                        'contenuRefuse' => implode(',', $baggagiste->getContenuRefuse()),
                        'status' => $baggagiste->getStatus(),
                        'dimensionsLarg' => $baggagiste->getDimension()->getWidth(),
                        'dimensionsH' => $baggagiste->getDimension()->getHeight(),
                        'dimensionsLong' => $baggagiste->getDimension()->getLength(),
                        'dimensionsKg' => $baggagiste->getDimension()->getWeight(),
                        'type_adresse_arrivee' => $baggagiste->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $baggagiste->getTypeAdresseDepart(),
                        'objectType' => implode(",", $baggagiste->getObjectType()),
                        'objectTransport' => implode(",", $baggagiste->getObjectTransport()),
                        'notContain' => implode(",", $baggagiste->getNotContain()),
                        'hasDemande' => count($baggagiste->getBaggisteQuery()) > 0 ? true : false,
                        'canDepose' => $baggagiste->isCanDepose()

                    ];
                }
            }
            $status = true;
            $message = 'liste des baggagistes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'baggagistes' => $tabBagagistes]);


    }

    /**
     * @Route("/baggagistes/query", name="baggagiste_query_list_profil_client", methods={"POST"})
     */
    public function baggagiste_query_list_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggisteQueryRepository $baggisteQueryRepository): Response
    {
        $tabBagagistes = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $baggagistesQuery = $baggisteQueryRepository->findBy(['client' => $hasClient, 'status' => intval($data['status'])], ['id' => 'desc']);
            if ($baggagistesQuery) {
                foreach ($baggagistesQuery as $key => $baggagistesQuery) {

                    $tabBagagistes[] = [
                        'ville_depart' => $baggagistesQuery->getBaggagite()->getAdressFrom(),
                        'ville_arrivee' => $baggagistesQuery->getBaggagite()->getAdressTo(),
                        'dateDepart' => date_format($baggagistesQuery->getBaggagite()->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($baggagistesQuery->getBaggagite()->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($baggagistesQuery->getBaggagite()->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($baggagistesQuery->getBaggagite()->getTimeTo(), 'H:i'),
                        'adresse_point_depart' => $baggagistesQuery->getBaggagite()->getAdressePointDepart(),
                        'adresse_point_arrivee' => $baggagistesQuery->getBaggagite()->getAdressePointArrivee(),
                        'commentaire' => $baggagistesQuery->getBaggagite()->getCommentaire(),
                        'contenuRefuse' => $baggagistesQuery->getContenuRefuse(),
                        'contenuTransporter' => implode(',', $baggagistesQuery->getContenuTransporter()),
                        'status' => $baggagistesQuery->getStatus(),
                        'dimensionsLarg' => $baggagistesQuery->getBaggagite()->getDimension()->getWidth(),
                        'dimensionsH' => $baggagistesQuery->getBaggagite()->getDimension()->getHeight(),
                        'dimensionsLong' => $baggagistesQuery->getBaggagite()->getDimension()->getLength(),
                        'dimensionsKg' => $baggagistesQuery->getBaggagite()->getDimension()->getWeight(),
                        'type_adresse_arrivee' => $baggagistesQuery->getBaggagite()->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $baggagistesQuery->getBaggagite()->getTypeAdresseDepart(),
                        'objectType' => implode(",", $baggagistesQuery->getBaggagite()->getObjectType()),
                        'objectTransport' => implode(",", $baggagistesQuery->getBaggagite()->getObjectTransport()),
                        'notContain' => implode(",", $baggagistesQuery->getBaggagite()->getNotContain())
                    ];
                }
            }
            $status = true;
            $message = 'liste des query baggagistes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'baggagistes' => $tabBagagistes]);


    }

    /**
     * @Route("/baggagistes/query/by/id", name="baggagiste_query_by_id_profil_client", methods={"POST"})
     */
    public function baggagiste_query_by_id_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggisteQueryRepository $baggisteQueryRepository, AvisRepository $avisRepo, SettingPriceRepository $settingPriceRepository): Response
    {
        $tabBagagistes = [];
        $infoAnnonce = [];
        $tabsettingPrice = [];
        $gallery = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $baggagistesQuery = $baggisteQueryRepository->find(intval($data['id']));
            $setting_prices = $settingPriceRepository->findAll();
            if ($setting_prices) {
                foreach ($setting_prices as $key => $setting_price) {
                    $tabsettingPrice[] = [
                        'id' => $setting_price->getId(),
                        'name' => $setting_price->getName(),
                        'price' => $setting_price->getPrice(),
                        'isRelais' => $setting_price->getIsRelais()
                    ];
                }
            }
            if ($baggagistesQuery) {
                $avis = $avisRepo->nbre([$baggagistesQuery->getBaggagite()->getClient()->getId()]);

                if (count($baggagistesQuery->getPhotos()) > 0) {
                    foreach ($baggagistesQuery->getPhotos() as $key => $doc) {
                        $gallery[] = [
                            'id' => $doc->getId(),
                            'url' => $doc->getUrl(),
                            'uid' => $doc->getId(),
                            'status' => 'done'
                        ];
                    }
                }

                $porteurs = [
                    'id' => $baggagistesQuery->getBaggagite()->getClient()->getId(),
                    'photo' => $baggagistesQuery->getBaggagite()->getClient()->getPhoto() ?? '',
                    'firstName' => $baggagistesQuery->getBaggagite()->getClient()->getFirstname(),
                    'email' => $baggagistesQuery->getBaggagite()->getClient()->getEmail(),
                    'lastName' => $baggagistesQuery->getBaggagite()->getClient()->getLastname(),
                    'nbrAvis' => floatval($avis['nbrAvis']),
                    'totalAvis' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1),
                    'price_porteur' => $baggagistesQuery->getTotal(),
                    'priceNet' => $baggagistesQuery->getPrixNet()?$baggagistesQuery->getPrixNet():30,
                ];
                $bagagiste = $baggagistesQuery->getBaggagite();
                $infoAnnonce = [
                    'ville_depart' => $bagagiste->getAdressFrom(),
                    'ville_arrivee' => $bagagiste->getAdressTo(),
                    'dateDepart' => date_format($bagagiste->getDateFrom(), 'Y-m-d'),
                    'dateArrivee' => date_format($bagagiste->getDateTo(), 'Y-m-d'),
                    'heureDepart' => date_format($bagagiste->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($bagagiste->getTimeTo(), 'H:i'),
                    'dimensionsLarg' => $bagagiste->getDimension()->getWidth(),
                    'dimensionsH' => $bagagiste->getDimension()->getHeight(),
                    'dimensionsLong' => $bagagiste->getDimension()->getLength(),
                    'dimensionsKg' => $bagagiste->getDimension()->getWeight(),
                    'type_adresse_arrivee' => $bagagiste->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $bagagiste->getTypeAdresseDepart(),
                    'objectType' => implode(",", $bagagiste->getObjectType()),
                    'objectTransport' => implode(",", $bagagiste->getObjectTransport()),
                ];
                $tabBagagistes = [
                    'orderId' => $baggagistesQuery->getBaggagite()->getId(),
                    'ville_depart' => $baggagistesQuery->getAdressFrom(),
                    'ville_arrivee' => $baggagistesQuery->getAdressTo(),
                    'dateDepart' => date_format($baggagistesQuery->getDateFrom(), 'Y-m-d'),
                    'dateArrivee' => date_format($baggagistesQuery->getDateTo(), 'Y-m-d'),
                    'heureDepart' => date_format($baggagistesQuery->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($baggagistesQuery->getTimeTo(), 'H:i'),
                    'adresse_point_depart' => $baggagistesQuery->getAdressePointDepart(),
                    'adresse_point_arrivee' => $baggagistesQuery->getAdressePointArrivee(),
                    'lat_adresse_point_depart' => $baggagistesQuery->getLatAdressePointDepart(),
                    'long_adresse_point_depart' => $baggagistesQuery->getLongAdressePointDepart(),
                    'lat_adresse_point_arrivee' => $baggagistesQuery->getLatAdressePointArrivee(),
                    'long_adresse_point_arrivee' => $baggagistesQuery->getLongAdressePointArrivee(),
                    'setting_price' => $baggagistesQuery->getobjectPriceSetting(),
                    'commentaire' => $baggagistesQuery->getCommentaire(),
                    'contenuRefuse' => $baggagistesQuery->getContenuRefuse(),
                    'listeContenu' => $baggagistesQuery->getContenuTransporter(),
                    'status' => $baggagistesQuery->getStatus(),
                    'dimensionsLarg' => $baggagistesQuery->getWidth(),
                    'dimensionsH' => $baggagistesQuery->getHeight(),
                    'dimensionsLong' => $baggagistesQuery->getLength(),
                    'dimensionsKg' => $baggagistesQuery->getWeight(),
                    'type_adresse_arrivee' => $baggagistesQuery->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $baggagistesQuery->getTypeAdresseDepart(),
                    'objectType' => implode(",", $baggagistesQuery->getObjectType()),
                    'objectTransport' => implode(",", $baggagistesQuery->getObjectTransport()),
                    'notContain' => implode(",", $baggagistesQuery->getNotContain()),
                    'porteur' => $porteurs,
                    'gallery' => $gallery,
                    'nomEntrepriseDep' => !is_null($baggagistesQuery->getPointRelaisDepart()) ? $baggagistesQuery->getPointRelaisDepart()->getEntreprise() : '',
                    'nomEntrepriseArr' => !is_null($baggagistesQuery->getPointRelaisArrivee()) ? $baggagistesQuery->getPointRelaisArrivee()->getEntreprise() : '',
                    'idPointRelaisDep' => !is_null($baggagistesQuery->getPointRelaisDepart()) ? $baggagistesQuery->getPointRelaisDepart()->getId() : '',
                    'idPointRelaisArr' => !is_null($baggagistesQuery->getPointRelaisArrivee()) ? $baggagistesQuery->getPointRelaisArrivee()->getId() : '',
                    'infoAnnonce' => $infoAnnonce
                ];
            }
            $status = true;
            $message = 'liste des query baggagistes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'baggagistes' => $tabBagagistes]);


    }


    /**
     * @Route("/adverts/query/by/id", name="adverts_query_by_id_profil_client", methods={"POST"})
     */
    public function adverts_query_by_id_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertQueryRepository $AdvertQueryRepository, AvisRepository $avisRepo, SettingPriceRepository $settingPriceRepository): Response
    {
        $tabAdvertQuery = [];
        $tabsettingPrice = [];
        $infoAnnonce = [];
        $gallery = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $advertQuery = $AdvertQueryRepository->find(intval($data['id_order']));
            $setting_prices = $settingPriceRepository->findAll();
            if ($setting_prices) {
                foreach ($setting_prices as $key => $setting_price) {
                    $tabsettingPrice[] = [
                        'id' => $setting_price->getId(),
                        'name' => $setting_price->getName(),
                        'price' => $setting_price->getPrice(),
                        'isrelais' => $setting_price->getIsRelais()
                    ];
                }
            }
            if ($advertQuery) {
                $avis = $avisRepo->nbreAdvert([$advertQuery->getAdvert()->getClient()->getId()]);

                if (count($advertQuery->getAdvert()->getImages()) > 0) {
                    foreach ($advertQuery->getAdvert()->getImages() as $key => $doc) {
                        $gallery[] = [
                            'id' => $doc->getId(),
                            'url' => $doc->getUrl(),
                            'uid' => $doc->getId(),
                            'status' => 'done'
                        ];
                    }
                }

                $porteurs = [
                    'id' => $advertQuery->getAdvert()->getClient()->getId(),
                    'photo' => $advertQuery->getAdvert()->getClient()->getPhoto() ?? '',
                    'email' => $advertQuery->getAdvert()->getClient()->getEmail() ?? '',
                    'firstName' => $advertQuery->getAdvert()->getClient()->getFirstname(),
                    'lastName' => $advertQuery->getAdvert()->getClient()->getLastname(),
                    'nbrAvis' => floatval($avis['nbrAvis']),
                    'priceNet' => $advertQuery->getAdvert()->getPriceNet()?$advertQuery->getAdvert()->getPriceNet():30,
                    'totalAvis' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1),
                    'price_porteur' => $advertQuery->getPrice(),
                    'objectRelaisDepart' => $advertQuery->getobjectRelaisDepart(),
                    'objectRelaisArriv' => $advertQuery->getobjectRelaisArriv(),
                    'setting_price' => $tabsettingPrice
                ];
                $advert=$advertQuery->getAdvert();
                $infoAnnonce = [
                    'dimensionsLarg' => $advert->getDimension()->getWidth(),
                    'dimensionsH' => $advert->getDimension()->getHeight(),
                    'dimensionsLong' => $advert->getDimension()->getLength(),
                    'dimensionsKg' => $advert->getDimension()->getWeight(),
                    'ville_depart' => $advert->getFromAdress(),
                    'ville_arrivee' => $advert->getToAdress(),
                    'dateDepart' => date_format($advert->getDateFrom(), 'Y-m-d'),
                    'dateArrivee' => date_format($advert->getDateTo(), 'Y-m-d'),
                    'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                    'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $advert->getTypeAdressDepart(),
                    'objectType' => implode(",", $advert->getObjectType()),
                    'objectTransport' => implode(",", $advert->getObjectTransport()),
                    'objectRelaisDepart' => $advertQuery->getAdvert()->getobjectRelaisDepart(),

                    'objectRelaisArriv' => $advertQuery->getAdvert()->getobjectRelaisArriv(),
                ];


                $tabAdvertQuery = [
                    'orderId' => $advertQuery->getAdvert()->getId(),
                    'id_advert_query' => $advertQuery->getId(),
                    'dimensionsLarg' => $advertQuery->getWidth(),
                    'dimensionsH' => $advertQuery->getHeight(),
                    'dimensionsLong' => $advertQuery->getLength(),
                    'dimensionsKg' => $advertQuery->getWeight(),
                    'ville_depart' => $advertQuery->getFromAdress(),
                    'ville_arrivee' => $advertQuery->getToAdress(),
                    'description' => $advertQuery->getDescription(),
                    'objectType' => implode(",", $advertQuery->getObjectType()),
                    'objectTransport' => implode(",", $advertQuery->getObjectTransport()),
                    'dateDepart' => date_format($advertQuery->getDateFrom(), 'Y-m-d'),
                    'dateArrivee' => date_format($advertQuery->getDateTo(), 'Y-m-d'),
                    'heureDepart' => date_format($advertQuery->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($advertQuery->getTimeTo(), 'H:i'),
                    'contenuTransporter' => $advertQuery->getObjectContenu(),
                    'price' => $advertQuery->getPrice(),
                    'adresse_point_depart' => $advertQuery->getAdressPointDepart(),
                    'lat_adresse_point_depart' => $advertQuery->getLatAdressePointDepart(),
                    'long_adresse_point_depart' => $advertQuery->getLongAdressePointDepart(),
                    'lat_adresse_point_arrivee' => $advertQuery->getLatAdressePointArrivee(),
                    'long_adresse_point_arrivee' => $advertQuery->getLongAdressePointArrivee(),
                    'adresse_point_arrivee' => $advertQuery->getAdressPointArrivee(),
                    'type_adresse_arrivee' => $advertQuery->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $advertQuery->getTypeAdressDepart(),
                    'gallery' => $gallery,
                    'status' => $advertQuery->getStatus(),
                    'porteurs' => $porteurs,
                    'listeContenu' => $advertQuery->getObjectContenu(),
                    'nomEntrepriseDep' => !is_null($advertQuery->getPointRelaisDepart()) ? $advertQuery->getPointRelaisDepart()->getEntreprise() : '',
                    'nomEntrepriseArr' => !is_null($advertQuery->getPointRelaisArrivee()) ? $advertQuery->getPointRelaisArrivee()->getEntreprise() : '',
                    'idPointRelaisDep' => !is_null($advertQuery->getPointRelaisDepart()) ? $advertQuery->getPointRelaisDepart()->getId() : '',
                    'idPointRelaisArr' => !is_null($advertQuery->getPointRelaisArrivee()) ? $advertQuery->getPointRelaisArrivee()->getId() : '',
                    'infoAnnonce' => $infoAnnonce

                ];
            }
            $status = true;
            $message = 'liste des query advert';
        }
        return $this->json(['status' => $status, 'message' => $message, 'advert_query' => $tabAdvertQuery]);


    }

    /**
     * @Route("/baggagistes/deposer", name="baggagiste_deposer_profil_client", methods={"POST"})
     */
    public function baggagiste_deposer_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggagiteRepository $baggagiteRepository)
    {
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $entityManager = $doctrine->getManager();

        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $bagagise = $baggagiteRepository->find($data['orderId']);
            if ($bagagise) {
                $bagagise->setStatus(1);
                $entityManager->flush();
                $status = true;
                $message = 'Votre annonce a bien été déposé';
                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:Baggagite e WHERE e.id = :id")
                    ->setParameter('id', $bagagise->getId());

                /*  $notification=new Notification();
                                $notification->setCreatedAt(new \DateTime());
                                $notification->setType('propreetaire');
                                $notification->setMessage($hasClient->getFirstname().' '.$hasClient->getLastname().' à publier sa annonces');
                                $notification->setContent($query->getArrayResult());
                                $notification->setUser($bagagise->getClient()->getId());
                                $notification->setToUser($bagagise->getClient()->getId());
                                $entityManager->persist($notification);
                                $entityManager->flush();
                                */
            } else {
                $status = false;
                $message = 'Donnée non trouvée';
            }

        }

        return $this->json(['status' => $status, 'message' => $message]);


    }

    /**
     * @Route("/adverts/deposer", name="adverts_deposer_profil_client", methods={"POST"})
     */
    public function adverts_deposer_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertRepository $advertRepository)
    {
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $entityManager = $doctrine->getManager();

        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $advert = $advertRepository->find($data['orderId']);
            if ($advert) {
                $advert->setStatus(1);
                $entityManager->flush();
                $status = true;
                $message = 'Votre annonce a bien été déposé';
                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:Advert e WHERE e.id = :id")
                    ->setParameter('id', $advert->getId());
                /*
                 $notification=new Notification();
                               $notification->setCreatedAt(new \DateTime());
                               $notification->setType('propreetaire');
                               $notification->setMessage($hasClient->getFirstname().' '.$hasClient->getLastname().' à publier sa annonces');
                               $notification->setContent($query->getArrayResult());
                               $notification->setUser($advert->getClient()->getId());
                               $notification->setToUser($adver->getClient()->getId());
                               $entityManager->persist($notification);
                               $entityManager->flush();
                               */
            } else {
                $status = false;
                $message = 'Donnée non trouvée';
            }

        }

        return $this->json(['status' => $status, 'message' => $message]);


    }


    /**
     * @Route("/liste/demande/bagagiste", name="bagagiste_list_demande_profil_client", methods={"POST"})
     */
    public function bagagiste_list_demande_profil_client(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, BaggagiteRepository $baggagiteRepository, AvisRepository $avisRepo, SettingPriceRepository $settingPriceRepository): Response
    {
        $tabBagagistes = [];
        $gallery = [];
        $porteurs = [];
        $idPorteur = [];
        $tabsettingPrice = [];
        $TabcontenuTransporter = [];
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $setting_prices = $settingPriceRepository->findAll();
        if ($setting_prices) {
            foreach ($setting_prices as $key => $setting_price) {
                $tabsettingPrice[] = [
                    'id' => $setting_price->getId(),
                    'name' => $setting_price->getName(),
                    'price' => $setting_price->getPrice(),
                    'isRelais' => $setting_price->getIsRelais()
                ];
            }
        }
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $bagagise = $baggagiteRepository->find($data['bagagiste_id']);


            if (count($bagagise->getBaggisteQuery()) > 0) {
                foreach ($bagagise->getBaggisteQuery() as $key => $baggisteQuery) {
                    if ($baggisteQuery->getClient() != $hasClient) {
                        $idPorteur = [];
                        $gallery = [];
                        $contenuTransporter = [];
                        $TabcontenuTransporter = [];

                        $advertByPorteur = $baggisteQuery->getClient()->getBaggagites();
                        if (count($advertByPorteur) > 0) {
                            foreach ($advertByPorteur as $key => $advertByPorteur) {
                                $idPorteur[] = $advertByPorteur->getId();
                            }
                        }
                        $avis = $avisRepo->nbre($idPorteur);

                        foreach ($baggisteQuery->getPhotos() as $key => $photo) {
                            $gallery[] = [
                                'id' => $photo->getId(),
                                'url' => $photo->getUrl(),
                                'uid' => $photo->getId(),
                                'status' => 'done'
                            ];
                        }

                        foreach ($baggisteQuery->getContenuTransporter() as $key => $contenuTransporter) {
                            $TabcontenuTransporter[] = ['label' => $contenuTransporter];
                        }


                        $porteurs[] = [
                            'id' => $baggisteQuery->getClient()->getId(),
                            'photo' => $baggisteQuery->getClient()->getPhoto() ?? '',
                            'firstName' => $baggisteQuery->getClient()->getFirstname(),
                            'lastName' => $baggisteQuery->getClient()->getLastname(),
                            'email' => $baggisteQuery->getClient()->getEmail(),
                            'nbrAvis' => floatval($avis['nbrAvis']),
                            'totalAvis' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1),
                            'price_porteur' => $baggisteQuery->getPrix(),
                            'priceNet' => $baggisteQuery->getPrixNet(),
                            'gallery' => $gallery,
                            'contenuTransporter' => $TabcontenuTransporter,
                            'setting_price' => $baggisteQuery->getobjectPriceSetting(),
                            'ville_depart' => $baggisteQuery->getAdressFrom(),
                            'ville_arrivee' => $baggisteQuery->getAdressTo(),
                            'dateDepart' => date_format($baggisteQuery->getDateFrom(), 'd-m-Y'),
                            'dateArrivee' => date_format($baggisteQuery->getDateTo(), 'd-m-Y'),
                            'heureDepart' => date_format($baggisteQuery->getTimeFrom(), 'H:i'),
                            'heureArrivee' => date_format($baggisteQuery->getTimeTo(), 'H:i'),
                            'adresse_point_depart' => $baggisteQuery->getAdressePointDepart(),
                            'adresse_point_arrivee' => $baggisteQuery->getAdressePointArrivee(),
                            'commentaire' => $baggisteQuery->getCommentaire(),
                            'dimensionsLarg' => $baggisteQuery->getWidth(),
                            'dimensionsH' => $baggisteQuery->getHeight(),
                            'dimensionsLong' => $baggisteQuery->getLength(),
                            'dimensionsKg' => $baggisteQuery->getWeight(),
                            'type_adresse_arrivee' => $baggisteQuery->getTypeAdresseArrivee(),
                            'type_adresse_depart' => $baggisteQuery->getTypeAdresseDepart(),
                            'objectType' => implode(",", $baggisteQuery->getObjectType()),
                            'objectTransport' => implode(",", $baggisteQuery->getObjectTransport()),
                            'contenuRefuse' => implode(",", $baggisteQuery->getContenuRefuse()),
                            'id_bagagiste_query' => $baggisteQuery->getId(),
                            'isValid' => $baggisteQuery->getIsValid(),
                            'isPaied' => $baggisteQuery->getIsPaied(),


                        ];
                    }
                }

            }

            $tabBagagistes = [
                'ville_depart' => $bagagise->getAdressFrom(),
                'ville_arrivee' => $bagagise->getAdressTo(),
                'dateDepart' => date_format($bagagise->getDateFrom(), 'd-m-Y'),
                'dateArrivee' => date_format($bagagise->getDateTo(), 'd-m-Y'),
                'heureDepart' => date_format($bagagise->getTimeFrom(), 'H:i'),
                'heureArrivee' => date_format($bagagise->getTimeTo(), 'H:i'),
                'adresse_point_depart' => $bagagise->getAdressePointDepart(),
                'adresse_point_arrivee' => $bagagise->getAdressePointArrivee(),
                'commentaire' => $bagagise->getCommentaire(),
                'dimensionsLarg' => $bagagise->getDimension()->getWidth(),
                'dimensionsH' => $bagagise->getDimension()->getHeight(),
                'dimensionsLong' => $bagagise->getDimension()->getLength(),
                'dimensionsKg' => $bagagise->getDimension()->getWeight(),
                'type_adresse_arrivee' => $bagagise->getTypeAdresseArrivee(),
                'type_adresse_depart' => $bagagise->getTypeAdresseDepart(),
                'objectType' => implode(",", $bagagise->getObjectType()),
                'objectTransport' => implode(",", $bagagise->getObjectTransport()),
                'notContain' => implode(",", $bagagise->getNotContain()),
                'contenuRefuse' => implode(",", $bagagise->getContenuRefuse()),
                'clients' => $porteurs
            ];
            $status = true;
            $message = 'liste des demandes';
        }
        return $this->json(['status' => $status, 'message' => $message, 'bagagistes' => $tabBagagistes]);


    }
}