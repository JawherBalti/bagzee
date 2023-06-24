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
use App\Repository\AdvertRepository;
use App\Service\HelperApi;
/**
 * @Route("/api/relais", name="api_")
 */
class RelaisController extends AbstractController
{

    private $clientRepo;
    private $objectTypeRepo;
    private $objectTransportRepo;
    private $baggagiteRepository;
    private $baggisteQueryRepository;
    private $advertRepo;
    private $advertQueryRepository;

    public function __construct(ClientRepository $clientRepo, ObjectTypeRepository $objectTypeRepo, ObjectTransportRepository $objectTransportRepo, BaggagiteRepository $baggagiteRepository, BaggisteQueryRepository $baggisteQueryRepository, AdvertQueryRepository $AdvertQueryRepository,AdvertRepository $advertRepo)
    {
        $this->clientRepo = $clientRepo;
        $this->objectTypeRepo = $objectTypeRepo;
        $this->objectTransportRepo = $objectTransportRepo;
        $this->baggagiteRepository = $baggagiteRepository;
        $this->AdvertQueryRepository = $AdvertQueryRepository;
        $this->baggisteQueryRepository = $baggisteQueryRepository;
        $this->advertRepo=$advertRepo;
    }

    /**
     * @Route("/list/annonce", name="annonce_relais_list", methods={"POST"})
     */
    public function annonce_relais_list(ManagerRegistry $doctrine, Request $request,HelperApi $helperApi): Response
    {

        $data = json_decode($request->getContent(), true);
        $tabAdvert = [];    
        $tabBag = [];    
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        if ($client) {
            $message = "Liste des annonces relais";
            $status = true;


            $advertQuerys = $this->AdvertQueryRepository->byPointRelaisDepartArrivee($client,$status=1);
            $bagQuerys = $this->baggisteQueryRepository->byPointRelaisDepartArrivee($client,$status=1);



            if ($advertQuerys) {

                $tabAdvert=$helperApi->reformdataadvert($advertQuerys);

            }

            if ($bagQuerys) {

                $tabBag=$helperApi->reformdataBag($bagQuerys);


            }
            $tab=array_merge($tabAdvert,$tabBag);

            



        } else {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message, 'data' => $tab]);
    }
}