<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\ObjectTypeRepository;
use App\Repository\ObjectTransportRepository;
use App\Repository\BaggagiteRepository;
use App\Repository\BaggisteQueryRepository;
use App\Entity\Baggagite;
use App\Entity\BaggisteQuery;
use App\Entity\BaggisteQueryPhoto;
use App\Entity\Size;
use App\Entity\ObjectType;
use App\Entity\ObjectTransport;
use App\Entity\Notification;
use App\Repository\AdvertQueryRepository;
use App\Service\BagagisteCancel;

/**
 * @Route("/api/baggagite", name="api_")
 */
class BaggagiteController extends AbstractController
{

    private $clientRepo;
    private $objectTypeRepo;
    private $objectTransportRepo;
    private $baggagiteRepository;
    private $baggisteQueryRepository;
    private $advertRepo;
    private $advertQueryRepository;

    public function __construct(ClientRepository $clientRepo, ObjectTypeRepository $objectTypeRepo, ObjectTransportRepository $objectTransportRepo, BaggagiteRepository $baggagiteRepository, BaggisteQueryRepository $baggisteQueryRepository, AdvertQueryRepository $AdvertQueryRepository)
    {
        $this->clientRepo = $clientRepo;
        $this->objectTypeRepo = $objectTypeRepo;
        $this->objectTransportRepo = $objectTransportRepo;
        $this->baggagiteRepository = $baggagiteRepository;
        $this->AdvertQueryRepository = $AdvertQueryRepository;
        $this->baggisteQueryRepository = $baggisteQueryRepository;
    }


    /**
     * @Route("/create", name="baggagite_create", methods={"POST"})
     */
    public function baggagite_create(ManagerRegistry $doctrine, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        $tabContenuRefuse = [];

        $baggagite = new Baggagite();

        if ($client) {

            $today = new \DateTime();
            $fromDate = new \DateTime($data['fromDate'] . ' ' . $data['fromTime']);
            $toDate = new \DateTime($data['toDate'] . ' ' . $data['toTime']);

            $fromDate = strtotime(date_format($fromDate, 'Y-m-d H:i'));
            $toDate = strtotime(date_format($toDate, 'Y-m-d H:i'));
            $today = strtotime(date_format($today, 'Y-m-d H:i'));

            if (($today >= $fromDate) || ($data['toDate'] != '' && $today >= $toDate)) {
                $message = "la date que vous avez choisit doit êtes au future";
                $status = false;
                return $this->json(['status' => $status, 'message' => $message, 'id' => -1]);
            } else {
                if ($data['toDate'] != '' && $fromDate >= $toDate) {
                    $message = "choix des dates invalides";
                    $status = false;
                    return $this->json(['status' => $status, 'message' => $message, 'id' => -1]);
                }
            }

            $dimension = new Size();
            $dimension->setWidth($data['dimensionsLarg']);
            $dimension->setHeight($data['dimensionsH']);
            $dimension->setLength($data['dimensionsLong']);
            $dimension->setWeight($data['dimensionsKg']);

            $baggagite->setAdressFrom($data['ville_depart']);
            $baggagite->setAdressTo($data['ville_arrivee']);


            $baggagite->setDateFrom(new \DateTime($data['fromDate']));
            $baggagite->setTimeFrom(new \DateTime($data['fromTime']));


            $baggagite->setDateFrom(new \DateTime($data['fromDate']));
            $baggagite->setTimeFrom(new \DateTime($data['fromTime']));

            if ($data['toDate'] == '') {
                $baggagite->setDateTo($baggagite->getDateFrom());
                $timeTo = clone $baggagite->getTimeFrom();
                $timeTo->modify('+ 2 hours');
                $baggagite->setDateTo($baggagite->getDateFrom());
                $baggagite->setTimeTo($timeTo);

            } else {
                $baggagite->setDateTo(new \DateTime($data['toDate']));
                $baggagite->setTimeTo(new \DateTime($data['toTime']));

            }
            $baggagite->setAdressePointDepart($data['adresse_point_depart']);
            $baggagite->setAdressePointArrivee($data['adresse_point_arrivee']);
            $baggagite->setTypeAdresseDepart($data['type_adresse_depart']);
            $baggagite->setTypeAdresseArrivee($data['type_adresse_arrivee']);
            $baggagite->setCommentaire($data['commentaire']);
            $baggagite->setContenuRefuse($data['contenuRefuse']);
            $baggagite->setStatus($data['status']);
            $baggagite->setDimension($dimension);
            $baggagite->setClient($client);
            $baggagite->setCanDepose($data['canDepose'] ?? false);

            if (isset($data['idPointRelaisDep'])) {
                if ($data['idPointRelaisDep'] != '') {
                    $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                    $baggagite->setPointRelaisDepart($pointrelaisDepart);
                }

            }

            if (isset($data['idPointRelaisArr'])) {
                if ($data['idPointRelaisArr'] != '') {
                    $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                    $baggagite->setPointRelaisArrivee($pointrelaisArrivee);
                }
            }


            $dataObjecttypes = $data['objectType'];
            $baggagite->setObjectType($dataObjecttypes);
            $dataobjectTransports = $data['objectTransport'];
            $baggagite->setObjectTransport($dataobjectTransports);

            if ($data['lat_adresse_point_depart'] != "") {
                $baggagite->setLatAdressePointDepart($data['lat_adresse_point_depart']);

            }
            if ($data['long_adresse_point_depart'] != "") {
                $baggagite->setLongAdressePointDepart($data['long_adresse_point_depart']);

            }
            if ($data['lat_adresse_point_arrivee'] != "") {
                $baggagite->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);

            }
            if ($data['long_adresse_point_arrivee'] != "") {
                $baggagite->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

            }

            $entityManager->persist($baggagite);
            $entityManager->flush();


            foreach ($dataObjecttypes as $key => $dataObjecttype) {
                $objectType = $this->objectTypeRepo->findOneBy(['name' => $dataObjecttype]);
                $objectType = $objectType ? $objectType : new ObjectType();
                $objectType->setName($dataObjecttype);
                $entityManager->persist($objectType);
                $entityManager->flush();

            }


            foreach ($dataobjectTransports as $key => $dataobjectTransport) {
                $objectTransport = $this->objectTransportRepo->findOneBy(['name' => $dataobjectTransport]);
                $objectTransport = $objectTransport ? $objectTransport : new ObjectTransport();
                $objectTransport->setName($dataobjectTransport);
                $entityManager->persist($objectTransport);
                $entityManager->flush();
            }


            $message = "Insertion a été pris en compte";
            $status = true;

        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }


    /**
     * @Route("/query/create", name="baggagite_query_create", methods={"POST"})
     */
    public function baggagite_query_create(ManagerRegistry $doctrine, Request $request): Response
    {

        $data = json_decode($request->getContent(), true);
        $tabContenuTransporter = [];
        $tabContenuRefuse = [];
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $message = "Insertion a été pris en compte";
            $status = true;
            $baggagiste = $this->baggagiteRepository->find($data['baggagite_id']);
            if ($baggagiste->getClient()->getId() == $client->getId()) {
                $message = "Vous ne devez pas déposer une demande de votre annonce";
                $status = false;
            } else {
                $hasBaggistyeQuery = $this->baggisteQueryRepository->findOneBy(['client' => $client, 'baggagite' => $baggagiste]);
                if (!$hasBaggistyeQuery) {
                    $baggistyeQuery = new BaggisteQuery();
                    $baggistyeQuery->setClient($client);
                    $baggistyeQuery->setPrix($data['price']);
                    $baggistyeQuery->setPrixNet($data['priceNet']);
                    $baggistyeQuery->setTotal($data['price']);
                    $baggistyeQuery->setContenuTransporter($data['listeContenu']);
                    $baggistyeQuery->setContenuRefuse($data['contenuRefuse']);

                    $baggistyeQuery->setWidth(($data['dimensionsLarg'] != "") ? $data['dimensionsLarg'] : $baggagiste->getDimension()->getWidth());
                    $baggistyeQuery->setHeight(($data['dimensionsH'] != "") ? $data['dimensionsH'] : $baggagiste->getDimension()->getHeight());
                    $baggistyeQuery->setLength(($data['dimensionsLong'] != "") ? $data['dimensionsLong'] : $baggagiste->getDimension()->getLength());
                    $baggistyeQuery->setWeight(($data['dimensionsKg'] != "") ? $data['dimensionsKg'] : $baggagiste->getDimension()->getWeight());
                    $baggistyeQuery->setobjectPriceSetting(isset($data['setting_price']) ? $data['setting_price'] : []);
                    $baggistyeQuery->setAdressFrom(($data['ville_depart'] != "") ? $data['ville_depart'] : $baggagiste->getAdressFrom());
                    $baggistyeQuery->setAdressTo(($data['ville_arrivee'] != "") ? $data['ville_arrivee'] : $baggagiste->getAdressTo());
                    if ($data['fromDate'] != "") {
                        $baggistyeQuery->setDateFrom(new \DateTime($data['fromDate']));
                    } else {
                        $baggistyeQuery->setDateFrom($baggagiste->getDateFrom());

                    }

                    if ($data['toDate'] != "") {
                        $baggistyeQuery->setDateTo(new \DateTime($data['toDate']));
                    } else {
                        $baggistyeQuery->setDateTo($baggagiste->getDateTo());

                    }
                    if ($data['fromTime'] != "") {
                        $baggistyeQuery->setTimeFrom(new \DateTime($data['fromTime']));
                    } else {
                        $baggistyeQuery->setTimeFrom($baggagiste->getTimeFrom());

                    }

                    if ($data['toTime'] != "") {
                        $baggistyeQuery->setTimeTo(new \DateTime($data['toTime']));
                    } else {
                        $baggistyeQuery->setTimeTo($baggagiste->getTimeTo());

                    }

                    $baggistyeQuery->setAdressePointDepart($data['adresse_point_depart'] ?? $baggagiste->getAdressePointDepart());
                    $baggistyeQuery->setAdressePointArrivee($data['adresse_point_arrivee'] ?? $baggagiste->getAdressePointArrivee());
                    $baggistyeQuery->setTypeAdresseDepart($data['type_adresse_depart'] ?? $baggagiste->getTypeAdresseDepart());
                    $baggistyeQuery->setTypeAdresseArrivee($data['type_adresse_arrivee'] ?? $baggagiste->getTypeAdresseArrivee());
                    $baggistyeQuery->setCommentaire($data['commentaire'] ?? $baggagiste->getCommentaire());

                    $baggistyeQuery->setLatAdressePointDepart($data['lat_adresse_point_depart']);
                    $baggistyeQuery->setLongAdressePointDepart($data['long_adresse_point_depart']);
                    $baggistyeQuery->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);
                    $baggistyeQuery->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

                    if ($data['idPointRelaisDep'] != '') {
                        $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                        $baggistyeQuery->setPointRelaisDepart($pointrelaisDepart);
                    }

                    if ($data['idPointRelaisArr'] != '') {
                        $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                        $baggistyeQuery->setPointRelaisArrivee($pointrelaisArrivee);
                    }

                    $baggistyeQuery->setBaggagite($baggagiste);

                    $entityManager->persist($baggistyeQuery);
                    $entityManager->flush();

                    $query = $doctrine->getManager()
                        ->createQuery("SELECT e FROM App:BaggisteQuery e WHERE e.id = :id")
                        ->setParameter('id', $baggistyeQuery->getId());

                    /*                                $notification=new Notification();
                                                    $notification->setCreatedAt(new \DateTime());
                                                    $notification->setType('prorietaire');
                                                    $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a déposée une demande');
                                                    $notification->setContent($query->getArrayResult());
                                                    $notification->setUser($client->getId());
                                                    $notification->setToUser($baggistyeQuery->getBaggagite()->getClient()->getId());
                                                    $entityManager->persist($notification);
                                                    $entityManager->flush();

                                                    */

                    if (isset($data['gellery'])) {
                        if (count($data['gellery']) > 0) {
                            foreach ($data['gellery'] as $key => $gallery) {
                                $document = new BaggisteQueryPhoto();
                                $document->setUrl($gallery['url']);
                                $document->setBaggisteQuery($baggistyeQuery);
                                $entityManager->persist($document);
                                $entityManager->flush();
                            }
                        }

                    }

                } else {
                    $message = "Vous avez déjà reservé cette annonce";
                    $status = false;
                }
            }


        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
     * @Route("/query/update", name="baggagite_query_update", methods={"POST"})
     */
    public function baggagite_query_update(ManagerRegistry $doctrine, Request $request): Response
    {

        $data = json_decode($request->getContent(), true);
        $tabContenuTransporter = [];
        $tabContenuRefuse = [];
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $message = "Insertion a été pris en compte";
            $status = true;
            $baggistyeQuery = $this->baggisteQueryRepository->find($data['id']);
            $baggagiste = $this->baggagiteRepository->find($data['baggagite_id']);

            $baggistyeQuery->setPrix($data['price']);
            $baggistyeQuery->setTotal($data['price']);
            $baggistyeQuery->setContenuTransporter($data['listeContenu']);
            $baggistyeQuery->setContenuRefuse($data['contenuRefuse']);
            $baggistyeQuery->setobjectPriceSetting(isset($data['setting_price']) ? $data['setting_price'] : []);

            $baggistyeQuery->setWidth(($data['dimensionsLarg'] != "") ? $data['dimensionsLarg'] : $baggagiste->getDimension()->getWidth());
            $baggistyeQuery->setHeight(($data['dimensionsH'] != "") ? $data['dimensionsH'] : $baggagiste->getDimension()->getHeight());
            $baggistyeQuery->setLength(($data['dimensionsLong'] != "") ? $data['dimensionsLong'] : $baggagiste->getDimension()->getLength());
            $baggistyeQuery->setWeight(($data['dimensionsKg'] != "") ? $data['dimensionsKg'] : $baggagiste->getDimension()->getWeight());

            $baggistyeQuery->setAdressFrom(($data['ville_depart'] != "") ? $data['ville_depart'] : $baggagiste->getAdressFrom());
            $baggistyeQuery->setAdressTo(($data['ville_arrivee'] != "") ? $data['ville_arrivee'] : $baggagiste->getAdressTo());
            if ($data['fromDate'] != "") {
                $baggistyeQuery->setDateFrom(new \DateTime($data['fromDate']));
            } else {
                $baggistyeQuery->setDateFrom($baggagiste->getDateFrom());

            }

            if ($data['toDate'] != "") {
                $baggistyeQuery->setDateTo(new \DateTime($data['toDate']));
            } else {
                $baggistyeQuery->setDateTo($baggagiste->getDateTo());

            }
            if ($data['fromTime'] != "") {
                $baggistyeQuery->setTimeFrom(new \DateTime($data['fromTime']));
            } else {
                $baggistyeQuery->setTimeFrom($baggagiste->getTimeFrom());

            }

            if ($data['toTime'] != "") {
                $baggistyeQuery->setTimeTo(new \DateTime($data['toTime']));
            } else {
                $baggistyeQuery->setTimeTo($baggagiste->getTimeTo());

            }

            $baggistyeQuery->setAdressePointDepart($data['adresse_point_depart'] ?? $baggagiste->getAdressePointDepart());
            $baggistyeQuery->setAdressePointArrivee($data['adresse_point_arrivee'] ?? $baggagiste->getAdressePointArrivee());
            $baggistyeQuery->setTypeAdresseDepart($data['type_adresse_depart'] ?? $baggagiste->getTypeAdresseDepart());
            $baggistyeQuery->setTypeAdresseArrivee($data['type_adresse_arrivee'] ?? $baggagiste->getTypeAdresseArrivee());
            $baggistyeQuery->setCommentaire($data['commentaire'] ?? $baggagiste->getCommentaire());

            $baggistyeQuery->setLatAdressePointDepart($data['lat_adresse_point_depart']);
            $baggistyeQuery->setLongAdressePointDepart($data['long_adresse_point_depart']);
            $baggistyeQuery->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);
            $baggistyeQuery->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

            if ($data['idPointRelaisDep'] != '') {
                $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                $baggistyeQuery->setPointRelaisDepart($pointrelaisDepart);
            }

            if ($data['idPointRelaisArr'] != '') {
                $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                $baggistyeQuery->setPointRelaisArrivee($pointrelaisArrivee);
            }

            $baggistyeQuery->setBaggagite($baggagiste);

            $entityManager->persist($baggistyeQuery);
            $entityManager->flush();

            $query = $doctrine->getManager()
                ->createQuery("SELECT e FROM App:BaggisteQuery e WHERE e.id = :id")
                ->setParameter('id', $baggistyeQuery->getId());

            /*                                $notification=new Notification();
                                            $notification->setCreatedAt(new \DateTime());
                                            $notification->setType('prorietaire');
                                            $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a déposée une demande');
                                            $notification->setContent($query->getArrayResult());
                                            $notification->setUser($client->getId());
                                            $notification->setToUser($baggistyeQuery->getBaggagite()->getClient()->getId());
                                            $entityManager->persist($notification);
                                            $entityManager->flush();

                                            */

            if (isset($data['gellery'])) {
                if (count($data['gellery']) > 0) {

                    foreach ($baggistyeQuery->getPhotos() as $key => $image) {

                        $baggistyeQuery->removePhoto($image);
                    }


                    foreach ($data['gellery'] as $key => $gallery) {
                        $document = new BaggisteQueryPhoto();
                        $document->setUrl($gallery['url']);
                        $document->setBaggisteQuery($baggistyeQuery);
                        $entityManager->persist($document);
                        $entityManager->flush();
                    }
                }

            }


        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
     * @Route("/get/{id}", name="baggagite_get", methods={"GET"})
     */
    public function baggagite_get($id): Response
    {
        $data = [];
        $gallery = [];
        $baggagiste = $this->baggagiteRepository->find($id);
        if ($baggagiste) {

            $data = [
                'id' => $baggagiste->getId(),
                'ville_depart' => $baggagiste->getAdressFrom(),
                'ville_arrivee' => $baggagiste->getAdressTo(),
                'dateDepart' => date_format($baggagiste->getDateFrom(), 'Y-m-d'),
                'dateArrivee' => date_format($baggagiste->getDateTo(), 'Y-m-d'),
                'heureDepart' => date_format($baggagiste->getTimeFrom(), 'H:i'),
                'heureArrivee' => date_format($baggagiste->getTimeTo(), 'H:i'),
                'adresse_point_depart' => $baggagiste->getAdressePointDepart(),
                'adresse_point_arrivee' => $baggagiste->getAdressePointArrivee(),
                'commentaire' => $baggagiste->getCommentaire(),
                'contenuRefuse' => $baggagiste->getContenuRefuse(),
                'status' => $baggagiste->getStatus(),
                'dimensionsLarg' => $baggagiste->getDimension()->getWidth(),
                'dimensionsH' => $baggagiste->getDimension()->getHeight(),
                'dimensionsLong' => $baggagiste->getDimension()->getLength(),
                'dimensionsKg' => $baggagiste->getDimension()->getWeight(),
                'type_adresse_arrivee' => $baggagiste->getTypeAdresseArrivee(),
                'type_adresse_depart' => $baggagiste->getTypeAdresseDepart(),
                'objectType' => $baggagiste->getObjectType() ? implode(',', $baggagiste->getObjectType()) : '',
                'canDepose' => $baggagiste->getCanDepose(),
                'objectTransport' => $baggagiste->getObjectTransport(),
                'lat_adresse_point_depart' => $baggagiste->getLatAdressePointDepart(),
                'long_adresse_point_depart' => $baggagiste->getLongAdressePointDepart(),
                'lat_adresse_point_arrivee' => $baggagiste->getLatAdressePointArrivee(),
                'long_adresse_point_arrivee' => $baggagiste->getLongAdressePointArrivee(),
                'nomEntrepriseDep' => !is_null($baggagiste->getPointRelaisDepart()) ? $baggagiste->getPointRelaisDepart()->getEntreprise() : '',
                'nomEntrepriseArr' => !is_null($baggagiste->getPointRelaisArrivee()) ? $baggagiste->getPointRelaisArrivee()->getEntreprise() : '',
                'idPointRelaisDep' => !is_null($baggagiste->getPointRelaisDepart()) ? $baggagiste->getPointRelaisDepart()->getId() : '',
                'idPointRelaisArr' => !is_null($baggagiste->getPointRelaisArrivee()) ? $baggagiste->getPointRelaisArrivee()->getId() : ''

            ];
        }
        return $this->json(['baggagiste' => $data]);
    }


    /**
     * @Route("/query/list/all", name="baggagite__query_list", methods={"POST"})
     */
    public function baggagite__query_list(ManagerRegistry $doctrine, Request $request): Response
    {

        $data = json_decode($request->getContent(), true);
        $tabContenuTransporter = [];
        $tab = [];
        $baggiste = [];
        $tabBaggQuery = [];
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $message = "Liste des baggagiste query";
            $status = true;

            /*$baggisteQuerys = $this->baggisteQueryRepository->findBy(['client' => $client,'status'=>$data['status']], ['id' => 'desc']);
            foreach ($baggisteQuerys as $key => $baggisteQuery) {

                
                $tabBaggQuery[] = [
                    'id' => $baggisteQuery->getId(),
                    'price' => $baggisteQuery->getPrix(),
                    'contenuTransporter' => implode(',', $baggisteQuery->getContenuTransporter()),
                     'ville_depart' => $baggisteQuery->getBaggagite()->getAdressFrom(),
                    'ville_arrivee' => $baggisteQuery->getBaggagite()->getAdressTo(),
                    'dateDepart' => date_format($baggisteQuery->getBaggagite()->getDateFrom(), 'd-m-Y'),
                    'dateArrivee' => date_format($baggisteQuery->getBaggagite()->getDateTo(), 'd-m-Y'),
                    'heureDepart' => date_format($baggisteQuery->getBaggagite()->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($baggisteQuery->getBaggagite()->getTimeTo(), 'H:i'),
                    'adresse_point_depart' => $baggisteQuery->getBaggagite()->getAdressePointDepart(),
                    'adresse_point_arrivee' => $baggisteQuery->getBaggagite()->getAdressePointArrivee(),
                    'commentaire' => $baggisteQuery->getBaggagite()->getCommentaire(),
                    'contenuRefuse' => implode(',', $baggisteQuery->getBaggagite()->getContenuRefuse()),
                    'status' => $baggisteQuery->getStatus(),
                    'dimensionsLarg' => $baggisteQuery->getBaggagite()->getDimension()->getWidth(),
                    'dimensionsH' => $baggisteQuery->getBaggagite()->getDimension()->getHeight(),
                    'dimensionsLong' => $baggisteQuery->getBaggagite()->getDimension()->getLength(),
                    'dimensionsKg' => $baggisteQuery->getBaggagite()->getDimension()->getWeight(),
                    'type_adresse_arrivee'=>$baggisteQuery->getBaggagite()->getTypeAdresseArrivee(),
                    'type_adresse_depart'=>$baggisteQuery->getBaggagite()->getTypeAdresseDepart(),
                    'objectType'=>implode(",",$baggisteQuery->getBaggagite()->getObjectType()),
                    'objectTransport'=>implode(",",$baggisteQuery->getBaggagite()->getObjectTransport()),
                ];
            }*/
//porteiur
            $advertQuerys = $this->AdvertQueryRepository->findBy(['client' => $client, 'status' => $data['status']], ['id' => 'desc']);
            if ($advertQuerys) {
                foreach ($advertQuerys as $key => $advertQuery) {
                    $gallery = [];
                    $advert = $advertQuery->getAdvert();
                    if ($advert) {

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

                    }
                    $client = [
                        'id' => $advert->getClient()->getId(),
                        'firstName' => $advert->getClient()->getFirstname(),
                        'lastName' => $advert->getClient()->getLastname(),
                        'email' => $advert->getClient()->getEmail(),
                        'phone' => $advert->getClient()->getPhone(),
                        'photo' => $advert->getClient()->getPhoto() ?? '',
                    ];
                    $tab[] = [
                        'id' => $advertQuery->getId(),
                        'priceQuery' => $advertQuery->getPrice(),
                        'dimensionsLarg' => $advert->getDimension()->getWidth(),
                        'dimensionsH' => $advert->getDimension()->getHeight(),
                        'dimensionsLong' => $advert->getDimension()->getLength(),
                        'dimensionsKg' => $advert->getDimension()->getWeight(),
                        'ville_depart' => $advert->getFromAdress(),
                        'ville_arrivee' => $advert->getToAdress(),
                        'description' => $advert->getDescription(),
                        'dateDepart' => date_format($advert->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($advert->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                        'listeContenu' => $advert->getObjectContenu(),
                        'price' => $advert->getPrice(),
                        'status' => $advertQuery->getStatus(),
                        'adresse_point_depart' => $advert->getAdressPointDepart(),
                        'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                        'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $advert->getTypeAdressDepart(),
                        'objectType' => implode(",", $advert->getObjectType()),
                        'objectTransport' => implode(",", $advert->getObjectTransport()),
                        'gallery' => $gallery,
                        'isValid' => $advertQuery->getIsValid(),
                        'client' => $client
                    ];

                }
            }

        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message, 'baggistes' => $tab]);
    }

    /**
     * @Route("/query/refus/demande", name="baggagite_query_refus_demande", methods={"POST"})
     */
    public function baggagite_query_refus_demande(ManagerRegistry $doctrine, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {

            $baggisteQuerys = $this->baggisteQueryRepository->find($data['order_id']);
            if ($baggisteQuerys) {
                $baggisteQuerys->setIsValid(BaggisteQuery::refused);
                $baggisteQuerys->setRaisonRefus($data['raisonRefus']);
                $entityManager->flush();

                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:BaggisteQuery e WHERE e.id = :id")
                    ->setParameter('id', $baggisteQuerys->getId());

                /*
                                $notification=new Notification();
                                                $notification->setCreatedAt(new \DateTime());
                                                $notification->setType('');
                                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a refusée votre demande');
                                                $notification->setContent($query->getArrayResult());
                                                $notification->setUser($client->getId());
                                                $notification->setToUser($baggisteQuerys->getBaggagite()->getClient()->getId());
                                                $entityManager->persist($notification);
                                                $entityManager->flush();
                                                */

            }

            $message = "Votre demande a été pris en compte";
            $status = true;
        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }
        return $this->json(['status' => $status, 'message' => $message]);


    }

    /**
     * @Route("/query/valide/demande", name="baggagite_query_valide_demande", methods={"POST"})
     */
    public function baggagite_query_valide_demande(ManagerRegistry $doctrine, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {

            $baggisteQuerys = $this->baggisteQueryRepository->find($data['order_id']);
            if ($baggisteQuerys) {
                $baggisteQuerys->setIsValid(BaggisteQuery::valid);
                $baggisteQuerys->setTotal($data['price']);
                $entityManager->flush();


                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:BaggisteQuery e WHERE e.id = :id")
                    ->setParameter('id', $baggisteQuerys->getId());

                /*   $notification=new Notification();
                                   $notification->setCreatedAt(new \DateTime());
                                   $notification->setType('');
                                   $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a validée votre demande');
                                   $notification->setContent($query->getArrayResult());
                                   $notification->setUser($client->getId());
                                   $notification->setToUser($baggisteQuerys->getBaggagite()->getClient()->getId());
                                   $entityManager->persist($notification);
                                   $entityManager->flush();

                                   */

            }

            $message = "Votre demande a été pris en compte";
            $status = true;
        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }
        return $this->json(['status' => $status, 'message' => $message]);


    }


    /**
     * @Route("/update", name="baggagite_update", methods={"POST"})
     */
    public function baggagite(ManagerRegistry $doctrine, Request $request): Response
    {
        $listeContenu = [];
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $fromDate = new \DateTime($data['fromDate'] . ' ' . $data['fromTime']);
            $toDate = new \DateTime($data['toDate'] . ' ' . $data['toTime']);

            $fromDate = strtotime(date_format($fromDate, 'Y-m-d'));
            $toDate = strtotime(date_format($toDate, 'Y-m-d'));
            if ($toDate != '' && $fromDate > $toDate) {
                $message = "choix des dates invalides";
                $status = false;
                return $this->json(['status' => $status, 'message' => $message, 'id' => -1]);
            }
            $bagagiste = $this->baggagiteRepository->find($data['id']);

            $dimension = $bagagiste->getDimension();
            $dimension->setWidth($data['dimensionsLarg']);
            $dimension->setHeight($data['dimensionsH']);
            $dimension->setLength($data['dimensionsLong']);
            $dimension->setWeight($data['dimensionsKg']);

            $bagagiste->setDateFrom(new \DateTime($data['fromDate']));
            $bagagiste->setDateTo(new \DateTime($data['toDate']));
            $bagagiste->setTimeFrom(new \DateTime($data['fromTime']));
            $bagagiste->setTimeTo(new \DateTime($data['toTime']));
            $bagagiste->setAdressePointDepart($data['adresse_point_depart']);
            $bagagiste->setAdressePointArrivee($data['adresse_point_arrivee']);
            $bagagiste->setTypeAdresseDepart($data['type_adresse_depart']);
            $bagagiste->setTypeAdresseArrivee($data['type_adresse_arrivee']);
            $bagagiste->setStatus($data['status']);
            $bagagiste->setDimension($dimension);
            $bagagiste->setCanDepose($data['canDepose'] ?? false);

            $bagagiste->setAdressFrom($data['ville_depart']);
            $bagagiste->setAdressTo($data['ville_arrivee']);
            $bagagiste->setCommentaire($data['commentaire']);


            if ($data['lat_adresse_point_depart'] != "") {
                $bagagiste->setLatAdressePointDepart($data['lat_adresse_point_depart']);

            }
            if ($data['long_adresse_point_depart'] != "") {
                $bagagiste->setLongAdressePointDepart($data['long_adresse_point_depart']);

            }
            if ($data['lat_adresse_point_arrivee'] != "") {
                $bagagiste->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);

            }
            if ($data['long_adresse_point_arrivee'] != "") {
                $bagagiste->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

            }

            if ($data['idPointRelaisDep'] != '') {
                $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                $bagagiste->setPointRelaisDepart($pointrelaisDepart);
            }

            if ($data['idPointRelaisArr'] != '') {
                $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                $bagagiste->setPointRelaisArrivee($pointrelaisArrivee);
            }


            $bagagiste->setContenuRefuse($data['contenuRefuse']);


            $dataObjecttypes = $data['objectType'];
            $bagagiste->setObjectType($dataObjecttypes);
            $dataobjectTransports = $data['objectTransport'];
            $bagagiste->setObjectTransport($dataobjectTransports);

            $entityManager->flush();

            $message = "Donnée a été pris en compte";
            $status = true;
        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }


    /**
     * @Route("/cancel", name="baggagite_cencel", methods={"GET"})
     */
    public function baggagite_cencel(ManagerRegistry $doctrine, Request $request, BagagisteCancel $bagagisteCancel): Response
    {
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $_GET['token']]);
        if ($client) {
            $bagagiste = $this->baggagiteRepository->find($_GET['id']);

            if ($bagagiste) {
                $bagagiste->setStatus(Baggagite::canceled);
                $entityManager->flush();

                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:Baggagite e WHERE e.id = :id")
                    ->setParameter('id', $bagagiste->getId());

                $notification = new Notification();
                $notification->setCreatedAt(new \DateTime());
                $notification->setType('');
                $notification->setMessage($client->getFirstname() . ' ' . $client->getLastname() . ' a refusée votre demande');
                $notification->setContent($query->getArrayResult());
                $notification->setUser($client->getId());
                $notification->setToUser($bagagiste->getClient()->getId());
                $entityManager->persist($notification);
                $entityManager->flush();
                $bagagisteQuerys = $bagagiste->getBaggisteQuery();
                if (count($bagagisteQuerys) > 0) {
                    foreach ($bagagisteQuerys as $key => $bagagisteQuery) {
                        if ($bagagisteQuery)
                            $bagagisteCancel->cancelQueryBagagiste($bagagisteQuery, $client);

                    }
                }


            }
            $message = "Votre demande a été pris en compte";
            $status = true;
        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }
        return $this->json(['status' => $status, 'message' => $message]);


    }


}