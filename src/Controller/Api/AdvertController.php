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
use App\Repository\AdvertRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\BaggisteQueryRepository;
use App\Entity\Advert;
use App\Entity\Size;
use App\Entity\ObjectType;
use App\Entity\ObjectTransport;
use App\Entity\Image;
use App\Entity\AdvertQuery;
use App\Entity\Notification;
use App\Service\AdvertCancel;

/**
 * @Route("/api/advert", name="api_")
 */
class AdvertController extends AbstractController
{

    private $clientRepo;
    private $objectTypeRepo;
    private $objectTransportRepo;
    private $advertRepo;
    private $advertQueryRepository;
    private $baggisteQueryRepository;


    public function __construct(ClientRepository $clientRepo, ObjectTypeRepository $objectTypeRepo, ObjectTransportRepository $objectTransportRepo, AdvertRepository $advertRepo, AdvertQueryRepository $advertQueryRepository, BaggisteQueryRepository $baggisteQueryRepository)
    {
        $this->clientRepo = $clientRepo;
        $this->objectTypeRepo = $objectTypeRepo;
        $this->objectTransportRepo = $objectTransportRepo;
        $this->advertRepo = $advertRepo;
        $this->advertQueryRepository = $advertQueryRepository;
        $this->baggisteQueryRepository = $baggisteQueryRepository;
    }


    /**
     * @Route("/create", name="advert_create", methods={"POST"})
     */
    public function advert_create(ManagerRegistry $doctrine, Request $request): Response
    {
        $listeContenu = [];

        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        $advert = new Advert();
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

            $advert->setFromAdress($data['ville_depart']);
            $advert->setToAdress($data['ville_arrivee']);
            $advert->setDescription($data['description'] ?? '');
            $advert->setPrice($data['price']);
            $advert->setPriceNet($data['priceNet']);


            $advert->setobjectRelaisDepart($data['settingPriceDep']);
            $advert->setobjectRelaisArriv($data['settingPriceArr']);

            $advert->setObjectContenu($data['listeContenu']);
            $advert->setDateFrom(new \DateTime($data['fromDate']));
            $advert->setTimeFrom(new \DateTime($data['fromTime']));
            if ($data['toDate'] == '') {
                $timeTo = clone $advert->getTimeFrom();
                $timeTo->modify('+ 2 hours');
                $advert->setDateTo($advert->getDateFrom());
                $advert->setTimeTo($timeTo);

            } else {
                $advert->setDateTo(new \DateTime($data['toDate']));
                $advert->setTimeTo(new \DateTime($data['toTime']));

            }
            $advert->setAdressPointDepart($data['adresse_point_depart']);
            $advert->setAdressPointArrivee($data['adresse_point_arrivee']);
            $advert->setTypeAdressDepart($data['type_adresse_depart']);
            $advert->setTypeAdresseArrivee($data['type_adresse_arrivee']);
            $advert->setClient($client);
            $advert->setStatus($data['status']);
            $advert->setDimension($dimension);


            $advert->setLatAdressePointDepart($data['lat_adresse_point_depart']);

            $advert->setLongAdressePointDepart($data['long_adresse_point_depart']);


            $advert->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);

            $advert->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

            $advert->setCanDepose($data['canDepose'] ?? false);

            if (isset($data['idPointRelaisDep'])) {
                if ($data['idPointRelaisDep'] != '') {
                    $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                    $advert->setPointRelaisDepart($pointrelaisDepart);
                }
            }

            if (isset($data['idPointRelaisArr'])) {
                if ($data['idPointRelaisArr'] != '') {
                    $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                    $advert->setPointRelaisArrivee($pointrelaisArrivee);
                }

            }


            $dataObjecttypes = $data['objectType'];
            $advert->setObjectType($dataObjecttypes);
            $dataobjectTransports = $data['objectTransport'];
            $advert->setObjectTransport($dataobjectTransports);
            $entityManager->persist($advert);
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

            if (isset($data['gellery'])) {
                foreach ($data['gellery'] as $key => $gallery) {
                    $document = new Image();
                    $document->setUrl($gallery['url']);
                    $document->setAdvert($advert);
                    $entityManager->persist($document);
                    $entityManager->flush();
                }
            }


            $message = "Insertion a été pris en compte";
            $status = true;

        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message, 'id' => $advert->getId() ?? '']);

    }

    /**
     * @Route("/update", name="advert_update", methods={"POST"})
     */
    public function advert_update(ManagerRegistry $doctrine, Request $request): Response
    {
        $listeContenu = [];
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
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
            $advert = $this->advertRepo->find($data['id']);

            $dimension = $advert->getDimension();
            $dimension->setWidth($data['dimensionsLarg']);
            $dimension->setHeight($data['dimensionsH']);
            $dimension->setLength($data['dimensionsLong']);
            $dimension->setWeight($data['dimensionsKg']);

            $advert->setDateFrom(new \DateTime($data['fromDate']));
            $advert->setDateTo(new \DateTime($data['toDate']));
            $advert->setTimeFrom(new \DateTime($data['fromTime']));
            $advert->setTimeTo(new \DateTime($data['toTime']));
            $advert->setAdressPointDepart($data['adresse_point_depart']);
            $advert->setAdressPointArrivee($data['adresse_point_arrivee']);
            $advert->setTypeAdressDepart($data['type_adresse_depart']);
            $advert->setTypeAdresseArrivee($data['type_adresse_arrivee']);
            $advert->setStatus($data['status']);
            $advert->setDimension($dimension);

            $advert->setFromAdress($data['ville_depart']);
            $advert->setToAdress($data['ville_arrivee']);
            if (isset($data['description'])) {
                $advert->setDescription($data['description']);
            }
            $advert->setPrice($data['price']);
            $advert->setPriceNet($data['priceNet']);
            $advert->setCanDepose($data['canDepose'] ?? false);


            $advert->setLatAdressePointDepart($data['lat_adresse_point_depart']);

            $advert->setLongAdressePointDepart($data['long_adresse_point_depart']);


            $advert->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);


            $advert->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);

            if ($data['idPointRelaisDep'] != '') {
                $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                $advert->setPointRelaisDepart($pointrelaisDepart);
            }

            if ($data['idPointRelaisArr'] != '') {
                $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                $advert->setPointRelaisArrivee($pointrelaisArrivee);
            }
            $advert->setobjectRelaisDepart($data['settingPriceDep']);
            $advert->setobjectRelaisArriv($data['settingPriceArr']);
            $advert->setObjectContenu($data['listeContenu']);
            $dataObjecttypes = $data['objectType'];
            $advert->setObjectType($dataObjecttypes);
            $dataobjectTransports = $data['objectTransport'];
            $advert->setObjectTransport($dataobjectTransports);


            $entityManager->flush();

            if (isset($data['gellery'])) {
                if (count($data['gellery']) > 0) {
                    foreach ($advert->getImages() as $key => $image) {

                        $advert->removeImage($image);
                    }

                    foreach ($data['gellery'] as $key => $gallery) {

                        $document = new Image();
                        $document->setUrl($gallery['url']);
                        $document->setAdvert($advert);
                        $entityManager->persist($document);
                        $entityManager->flush();
                    }
                }

            }

            $message = "Donnée a été pris en compte";
            $status = true;
        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
     * @Route("/get/{id}", name="advert_get", methods={"GET"})
     */
    public function advert_get($id): Response
    {
        $data = [];
        $gallery = [];
        $advert = $this->advertRepo->find($id);
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
            $client = [
                'id' => $advert->getClient()->getId(),
                'firstName' => $advert->getClient()->getFirstname(),
                'lastName' => $advert->getClient()->getLastname(),
                'email' => $advert->getClient()->getEmail(),
                'gender' => $advert->getClient()->getGender(),
                'phone' => $advert->getClient()->getPhone(),
                'birdh' => date_format($advert->getClient()->getBirdh(), 'd-m-Y'),
                'photo' => $advert->getClient()->getPhoto() ?? '',
                "token" => $advert->getClient()->getToken(),
                'stripeCustomerId' => $advert->getClient()->getStripeCustomerId(),
                'stripeAccount' => $advert->getClient()->getStripeAccount() ?? ''
            ];
            $data = [
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
                'dateDepart' => date_format($advert->getDateFrom(), 'Y-m-d'),
                'dateArrivee' => date_format($advert->getDateTo(), 'Y-m-d'),
                'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                'listeContenu' => $advert->getObjectContenu() ? $advert->getObjectContenu() : [],

                'settingPriceDep' => $advert->getobjectRelaisDepart() && $advert->getTypeAdressDepart() == "Point relais" ? $advert->getobjectRelaisDepart() : [],
                'settingPriceArr' => $advert->getobjectRelaisArriv() && $advert->getTypeAdresseArrivee() == "Point relais" ? $advert->getobjectRelaisArriv() : [],
                'price' => $advert->getPrice(),
                'canDepose' => $advert->getCanDepose(),
                'priceNet' => $advert->getPriceNet()? $advert->getPriceNet():30,
                'adresse_point_depart' => $advert->getAdressPointDepart(),
                'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                'type_adresse_depart' => $advert->getTypeAdressDepart(),
                'gallery' => $gallery,
                'status' => $advert->getStatus(),
                'client' => $client,
                'lat_adresse_point_depart' => $advert->getLatAdressePointDepart(),
                'long_adresse_point_depart' => $advert->getLongAdressePointDepart(),
                'lat_adresse_point_arrivee' => $advert->getLatAdressePointArrivee(),
                'long_adresse_point_arrivee' => $advert->getLongAdressePointArrivee(),
                'nomEntrepriseDep' => !is_null($advert->getPointRelaisDepart()) ? $advert->getPointRelaisDepart()->getEntreprise() : '',
                'nomEntrepriseArr' => !is_null($advert->getPointRelaisArrivee()) ? $advert->getPointRelaisArrivee()->getEntreprise() : '',
                'idPointRelaisDep' => !is_null($advert->getPointRelaisDepart()) ? $advert->getPointRelaisDepart()->getId() : '',
                'idPointRelaisArr' => !is_null($advert->getPointRelaisArrivee()) ? $advert->getPointRelaisArrivee()->getId() : ''
            ];
        }
        return $this->json(['advert' => $data]);
    }


    /**
     * @Route("/query/create", name="advert_query_create", methods={"POST"})
     */
    public function advert_query_create(ManagerRegistry $doctrine, Request $request)
    {
        $listeContenu = [];
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        $advert = $this->advertRepo->findOneBy(['id' => $data['advert_id']]);
        if ($client) {
            $message = "Insertion a été pris en compte";
            $status = true;

            if ($advert->getClient()->getId() == $client->getId()) {
                $message = "Vous ne devez pas déposer une demande de votre annonce";
                $status = false;
            } else {
                $hasAdvertQuery = $this->advertQueryRepository->findOneBy(['client' => $client, 'advert' => $advert]);
                $paied= false;
                foreach ($advert->getAdvertQueries() as $key=>$advQuery){
                    if($advQuery->getIsPaied()==1 && $advQuery->getIsValid()==1){
                        $paied= true;
                    }
                }
                if (!$hasAdvertQuery && (!$paied) ) {
                    $advertQuery = new AdvertQuery();

                    $advertQuery->setPrice($data['price']);
                    $advertQuery->setTotal($data['price']);
                    $advertQuery->setWidth($data['dimensionsLarg'] ?? $advert->getDimension()->getWidth());
                    $advertQuery->setHeight($data['dimensionsH'] ?? $advert->getDimension()->getHeight());
                    $advertQuery->setLength($data['dimensionsLong'] ?? $advert->getDimension()->getLength());
                    $advertQuery->setWeight($data['dimensionsKg'] ?? $advert->getDimension()->getWeight());
                    $advertQuery->setFromAdress($data['ville_depart'] ?? $advert->getFromAdress());
                    $advertQuery->setToAdress($data['ville_arrivee'] ?? $advert->getToAdress());
                    $advertQuery->setDescription($data['description'] ?? $advert->getDescription());


                    $advertQuery->setObjectContenu($data['listeContenu']);
                    if (isset($data['fromDate'])) {
                        $advertQuery->setDateFrom(new \DateTime($data['fromDate']));
                    } else {
                        $advertQuery->setDateFrom($advert->getDateFrom());

                    }

                    if (isset($data['toDate'])) {
                        $advertQuery->setDateTo(new \DateTime($data['toDate']));
                    } else {
                        $advertQuery->setDateTo($advert->getDateTo());

                    }
                    if (isset($data['fromTime'])) {
                        $advertQuery->setTimeFrom(new \DateTime($data['fromTime']));
                    } else {
                        $advertQuery->setTimeFrom($advert->getTimeFrom());

                    }

                    if (isset($data['toTime'])) {
                        $advertQuery->setTimeTo(new \DateTime($data['toTime']));
                    } else {
                        $advertQuery->setTimeTo($advert->getTimeTo());

                    }
                    $advertQuery->setAdressPointDepart($data['adresse_point_depart'] ?? $advert->getAdressPointDepart());
                    $advertQuery->setAdressPointArrivee($data['adresse_point_arrivee'] ?? $advert->getAdressPointArrivee());
                    $advertQuery->setTypeAdressDepart($data['type_adresse_depart'] ?? $advert->getTypeAdressDepart());
                    $advertQuery->setTypeAdresseArrivee($data['type_adresse_arrivee'] ?? $advert->getTypeAdresseArrivee());

                    $advertQuery->setLatAdressePointDepart($data['lat_adresse_point_depart']);
                    $advertQuery->setLongAdressePointDepart($data['long_adresse_point_depart']);
                    $advertQuery->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);
                    $advertQuery->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);
                    $advertQuery->setobjectRelaisDepart($data['settingPriceDep']);
                    $advertQuery->setobjectRelaisArriv($data['settingPriceArr']);

                    if ($data['idPointRelaisDep'] != '') {
                        $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                        $advertQuery->setPointRelaisDepart($pointrelaisDepart);
                    }

                    if ($data['idPointRelaisArr'] != '') {
                        $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                        $advertQuery->setPointRelaisArrivee($pointrelaisArrivee);
                    }

                    if (isset($data['objectType'])) {
                        $dataObjecttypes = $data['objectType'];

                    } else {
                        $dataObjecttypes = $advert->getObjectType();
                    }
                    $advertQuery->setObjectType($dataObjecttypes);

                    if (isset($data['objectTransport'])) {
                        $dataobjectTransports = $data['objectTransport'];

                    } else {
                        $dataobjectTransports = $advert->getObjectTransport();
                    }

                    $advertQuery->setObjectTransport($dataobjectTransports);


                    $advertQuery->setClient($client);
                    $advertQuery->setAdvert($advert);
                    $entityManager->persist($advertQuery);
                    $entityManager->flush();
                    $query = $doctrine->getManager()
                        ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
                        ->setParameter('id', $advertQuery->getId());
                    /*
                     $notification=new Notification();
                                    $notification->setCreatedAt(new \DateTime());
                                    $notification->setType('poreur');
                                    $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a déposée une demande');
                                    $notification->setContent($query->getArrayResult());
                                    $notification->setUser($client->getId());
                                    $notification->setToUser($advertQuery->getAdvert()->getClient()->getId());
                                    $entityManager->persist($notification);
                                    $entityManager->flush();*/
                } else if($paied){
                    $message = "le propriétaire a confirmé cette annonce avec un porteur";
                    $status = false;
                }else {
                    $message = "Vous avez déja deposer votre demande";
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
     * @Route("/query/update", name="advert_query_update", methods={"POST"})
     */
    public function advert_query_update(ManagerRegistry $doctrine, Request $request)
    {
        $listeContenu = [];
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        $advertQuery = $this->advertQueryRepository->findOneBy(['id' => $data['id']]);
        $advert = $this->advertRepo->findOneBy(['id' => $data['advert_id']]);
        if ($client) {
            $message = "Insertion a été pris en compte";
            $status = true;

            $advertQuery->setPrice($data['price']);
            $advertQuery->setTotal($data['price']);
            $advertQuery->setWidth($data['dimensionsLarg'] ?? $advert->getDimension()->getWidth());
            $advertQuery->setHeight($data['dimensionsH'] ?? $advert->getDimension()->getHeight());
            $advertQuery->setLength($data['dimensionsLong'] ?? $advert->getDimension()->getLength());
            $advertQuery->setWeight($data['dimensionsKg'] ?? $advert->getDimension()->getWeight());
            $advertQuery->setFromAdress($data['ville_depart'] ?? $advert->getFromAdress());
            $advertQuery->setToAdress($data['ville_arrivee'] ?? $advert->getToAdress());
            $advertQuery->setDescription($data['description'] ?? $advert->getDescription());


            $advertQuery->setObjectContenu($data['listeContenu']);
            if (isset($data['fromDate'])) {
                $advertQuery->setDateFrom(new \DateTime($data['fromDate']));
            } else {
                $advertQuery->setDateFrom($advert->getDateFrom());

            }

            if (isset($data['toDate'])) {
                $advertQuery->setDateTo(new \DateTime($data['toDate']));
            } else {
                $advertQuery->setDateTo($advert->getDateTo());

            }
            if (isset($data['fromTime'])) {
                $advertQuery->setTimeFrom(new \DateTime($data['fromTime']));
            } else {
                $advertQuery->setTimeFrom($advert->getTimeFrom());

            }

            if (isset($data['toTime'])) {
                $advertQuery->setTimeTo(new \DateTime($data['toTime']));
            } else {
                $advertQuery->setTimeTo($advert->getTimeTo());

            }
            $advertQuery->setAdressPointDepart($data['adresse_point_depart'] ?? $advert->getAdressPointDepart());
            $advertQuery->setAdressPointArrivee($data['adresse_point_arrivee'] ?? $advert->getAdressPointArrivee());
            $advertQuery->setTypeAdressDepart($data['type_adresse_depart'] ?? $advert->getTypeAdressDepart());
            $advertQuery->setTypeAdresseArrivee($data['type_adresse_arrivee'] ?? $advert->getTypeAdresseArrivee());

            $advertQuery->setLatAdressePointDepart($data['lat_adresse_point_depart']);
            $advertQuery->setLongAdressePointDepart($data['long_adresse_point_depart']);
            $advertQuery->setLatAdressePointArrivee($data['lat_adresse_point_arrivee']);
            $advertQuery->setLongAdressePointArrivee($data['long_adresse_point_arrivee']);
            $advertQuery->setobjectRelaisDepart($data['settingPriceDep']);
            $advertQuery->setobjectRelaisArriv($data['settingPriceArr']);

            if ($data['idPointRelaisDep'] != '') {
                $pointrelaisDepart = $this->clientRepo->find($data['idPointRelaisDep']);
                $advertQuery->setPointRelaisDepart($pointrelaisDepart);
            }

            if ($data['idPointRelaisArr'] != '') {
                $pointrelaisArrivee = $this->clientRepo->find($data['idPointRelaisArr']);

                $advertQuery->setPointRelaisArrivee($pointrelaisArrivee);
            }

            if (isset($data['objectType'])) {
                $dataObjecttypes = $data['objectType'];

            } else {
                $dataObjecttypes = $advert->getObjectType();
            }
            $advertQuery->setObjectType($dataObjecttypes);

            if (isset($data['objectTransport'])) {
                $dataobjectTransports = $data['objectTransport'];

            } else {
                $dataobjectTransports = $advert->getObjectTransport();
            }

            $advertQuery->setObjectTransport($dataobjectTransports);


            $advertQuery->setClient($client);
            $advertQuery->setAdvert($advert);
            $entityManager->persist($advertQuery);
            $entityManager->flush();
            $query = $doctrine->getManager()
                ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
                ->setParameter('id', $advertQuery->getId());
            /*
             $notification=new Notification();
                            $notification->setCreatedAt(new \DateTime());
                            $notification->setType('poreur');
                            $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a déposée une demande');
                            $notification->setContent($query->getArrayResult());
                            $notification->setUser($client->getId());
                            $notification->setToUser($advertQuery->getAdvert()->getClient()->getId());
                            $entityManager->persist($notification);
                            $entityManager->flush();*/

        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
     * @Route("/query/list/all", name="advert_query_list", methods={"POST"})
     */
    public
    function advert_query_list(ManagerRegistry $doctrine, Request $request)
    {
        $tab = [];
        $gallery = [];
        $dataAdvert = [];
        $tabBaggQuery = [];
        $data = json_decode($request->getContent(), true);
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $message = "Liste des adverts query";
            $status = true;
            /*$advertQuerys = $this->advertQueryRepository->findBy(['client' => $client, 'status' => $data['status']], ['id' => 'desc']);
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
                        'objectType' => implode(",", $advert->getObjectType()),
                        'objectTransport' => implode(",", $advert->getObjectTransport()),
                        'dateDepart' => date_format($advert->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($advert->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($advert->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($advert->getTimeTo(), 'H:i'),
                        'listeContenu' => $advert->getObjectContenu() ? implode(",", $advert->getObjectContenu()) : '',
                        'price' => $advert->getPrice(),
                        'status' => $advertQuery->getStatus(),
                        'adresse_point_depart' => $advert->getAdressPointDepart(),
                        'adresse_point_arrivee' => $advert->getAdressPointArrivee(),
                        'type_adresse_arrivee' => $advert->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $advert->getTypeAdressDepart(),
                        'objectType'=>implode(",",$advert->getObjectType()),
                        'objectTransport'=>implode(",",$advert->getObjectTransport()),
                        'gallery' => $gallery,
                        'isValid'=>$advertQuery->getStatus()
                    ];

                }
            }*/
            //propreitare
            $baggisteQuerys = $this->baggisteQueryRepository->findBy(['client' => $client, 'status' => $data['status']], ['id' => 'desc']);
            foreach ($baggisteQuerys as $key => $baggisteQuery) {
                $baggiste = $baggisteQuery->getBaggagite();

                $client = [
                    'id' => $baggiste->getClient()->getId(),
                    'firstName' => $baggiste->getClient()->getFirstname(),
                    'lastName' => $baggiste->getClient()->getLastname(),
                    'email' => $baggiste->getClient()->getEmail(),
                    'phone' => $baggiste->getClient()->getPhone(),
                    'photo' => $baggiste->getClient()->getPhoto() ?? '',
                ];
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
                    'contenuRefuse' => $baggisteQuery->getBaggagite()->getContenuRefuse(),
                    'status' => $baggisteQuery->getStatus(),
                    'dimensionsLarg' => $baggisteQuery->getBaggagite()->getDimension()->getWidth(),
                    'dimensionsH' => $baggisteQuery->getBaggagite()->getDimension()->getHeight(),
                    'dimensionsLong' => $baggisteQuery->getBaggagite()->getDimension()->getLength(),
                    'dimensionsKg' => $baggisteQuery->getBaggagite()->getDimension()->getWeight(),
                    'type_adresse_arrivee' => $baggisteQuery->getBaggagite()->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $baggisteQuery->getBaggagite()->getTypeAdresseDepart(),
                    'objectType' => implode(",", $baggisteQuery->getBaggagite()->getObjectType()),
                    'objectTransport' => implode(",", $baggisteQuery->getBaggagite()->getObjectTransport()),
                    'client' => $client,
                    'isValid' => $baggisteQuery->getIsValid()

                ];
            }


        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }
        return $this->json(['status' => $status, 'message' => $message, 'adverts' => $tabBaggQuery]);

    }


    /**
     * @Route("/query/refus/demande", name="advert_query_refus_demande", methods={"POST"})
     */
    public
    function advert_query_refus_demande(ManagerRegistry $doctrine, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {

            $advertQuerys = $this->advertQueryRepository->find($data['order_id']);
            if ($advertQuerys) {
                $advertQuerys->setIsValid(AdvertQuery::refused);
                $advertQuerys->setRaisonRefus($data['raisonRefus']);
                $entityManager->flush();
                /*
                                $query = $doctrine->getManager()
                        ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
                        ->setParameter('id', $advertQuerys->getId());*/
                /*
                 $notification=new Notification();
                                $notification->setCreatedAt(new \DateTime());
                                $notification->setType('');
                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a refusé une demande');
                                $notification->setContent($query->getArrayResult());
                                $notification->setUser($client->getId());
                                $notification->setToUser($advertQuerys->getAdvert()->getClient()->getId());
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
     * @Route("/query/valide/demande", name="advert_query_valide_demande", methods={"POST"})
     */
    public
    function advert_query_valide_demande(ManagerRegistry $doctrine, Request $request): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {

            $advertQuerys = $this->advertQueryRepository->find($data['order_id']);
            if ($advertQuerys) {
                $advertQuerys->setIsValid(AdvertQuery::valid);
                $advertQuerys->setTotal($data['price']);
                $entityManager->flush();

                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
                    ->setParameter('id', $advertQuerys->getId());

                /*
                                $notification=new Notification();
                                                $notification->setCreatedAt(new \DateTime());
                                                $notification->setType('');
                                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a validée votre demande');
                                                $notification->setContent($query->getArrayResult());
                                                $notification->setUser($client->getId());
                                                $notification->setToUser($advertQuerys->getAdvert()->getClient()->getId());
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
     * @Route("/cancel", name="advert_cencel", methods={"GET"})
     */
    public
    function advert_cencel(ManagerRegistry $doctrine, Request $request, AdvertCancel $advertCancel): Response
    {
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $_GET['token']]);
        if ($client) {
            $advert = $this->advertRepo->find($_GET['id']);
            if ($advert) {
                $advert->setStatus(Advert::canceled);
                $entityManager->flush();

                $query = $doctrine->getManager()
                    ->createQuery("SELECT e FROM App:Advert e WHERE e.id = :id")
                    ->setParameter('id', $advert->getId());

                /*
                                $notification=new Notification();
                                                $notification->setCreatedAt(new \DateTime());
                                                $notification->setType('');
                                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a annulée votre demande');
                                                $notification->setContent($query->getArrayResult());
                                                $notification->setUser($client->getId());
                                                $notification->setToUser($advert->getClient()->getId());
                                                $entityManager->persist($notification);
                                                $entityManager->flush();

                                                */

                if (count($advert->getAdvertQueries()) > 0) {
                    foreach ($advert->getAdvertQueries() as $key => $advertQueries) {

                        $advertCancel->cancelQueryAdvert($advertQueries, $client);

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