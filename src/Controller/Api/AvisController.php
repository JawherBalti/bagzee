<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\BaggagiteRepository;
use App\Repository\BaggisteQueryRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\AdvertRepository;
use App\Repository\AvisRepository;
use App\Entity\Avis;
/**
 * @Route("/api/avis", name="api_")
 */

class AvisController extends AbstractController
{

		private $clientRepo;
        private $baggagiteRepository;
        private $baggagiteQueryRepository;
        private $advertQueryRepository;
        private $avisRepository;
        private $advertRepo;

	    public function __construct(ClientRepository $clientRepo,AdvertQueryRepository $advertQueryRepository,BaggisteQueryRepository $baggagiteQueryRepository,BaggagiteRepository $baggagiteRepository,AvisRepository $avisRepository,AdvertRepository $advertRepo)
	    {
	    	$this->clientRepo=$clientRepo;
            $this->baggagiteRepository=$baggagiteRepository;
            $this->advertQueryRepository=$advertQueryRepository;
            $this->baggagiteQueryRepository=$baggagiteQueryRepository;
            $this->avisRepository=$avisRepository;
            $this->advertRepo=$advertRepo;
	    }


	/**
    * @Route("/create", name="avis_create", methods={"POST"})
    */
    public function avis_create(ManagerRegistry $doctrine,Request $request): Response
    {
        $avis = null;
        $baggagistQuery = null;
        $advertQuery = null;
    	$data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        
        if ($client) {
if(isset($data['baggagist_id']))
        {
            $baggagistQuery = $this->baggagiteQueryRepository->findOneBy(['id' => $data['baggagist_id']]);

                        $avis=$this->avisRepository->findOneBy(['client'=>$client,'baggagist'=>$baggagistQuery]);

        }
          if(isset($data['advert_id']))
        {
            $advertQuery = $this->advertQueryRepository->findOneBy(['id' => $data['advert_id']]);

                        $avis=$this->avisRepository->findOneBy(['client'=>$client,'advert'=>$advertQuery]);

        }

        	$message = "Insertion a été pris en compte";
            $status = true;
            $avis=$avis?$avis:new Avis();
            $avis->setEtatBagage($data['etatBagage']);
            $avis->setRespectSecurite($data['respectSecurite']);
            $avis->setPonctualite($data['ponctualite']);
            $avis->setCourtoisie($data['courtoisie']);
            $avis->setDescAvis($data['descAvis']);
            $avis->setBaggagist($baggagistQuery?$baggagistQuery->getBaggagite():null);
            $avis->setAdvert($advertQuery?$advertQuery->getAdvert():null);
            $avis->setClientNoted($baggagistQuery?$baggagistQuery->getBaggagite()->getClient():$advertQuery->getAdvert()->getClient());
            $avis->setClient($client);
            $entityManager->persist($avis);
            $entityManager->flush();


        }
        else
        {
  			$message = "Vous devez vous connecter";
            $status = false;
        }

                return $this->json(['status' => $status, 'message' => $message]);

    }

    /**
    * @Route("/info", name="avis_info", methods={"GET"})
    */
    public function avis_info(Request $request)
    {
        $idbaggagist=[];
        $idAvert=[];
        $objectAvisBagagiste=[];
        $objectAvisAvert=[];
    	$data = json_decode($request->getContent(), true);
        $client = $this->clientRepo->findOneBy(['id' => $_GET['id']]);
        if($client)
        {

			$message = "Liste des avis";
            $status = true;
            $clientnoted=$this->avisRepository->findOneBy(['clientNoted'=>$client]);
            $avis=$this->avisRepository->nbreClientnoted($clientnoted);
            if($avis)
           {
            $objectAvisBagagiste=[
                'etatBagage'=>floatval($avis['etatBagage']),
                'respectSecurite'=>floatval($avis['respectSecurite']),
                'ponctualite'=>floatval($avis['ponctualite']),
                'courtoisie'=>floatval($avis['courtoisie']),
                'nbrAvis'=>floatval($avis['nbrAvis']),
                'total'=>($avis['etatBagage']+$avis['respectSecurite']+$avis['ponctualite']+$avis['courtoisie'])/4
            ];
           }

        }
        else
        {
        	$message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message,'mesInfoAvis'=>$objectAvisBagagiste]);

    }

     /**
    * @Route("/list", name="avis_list", methods={"GET"})
    */
     public function avis_list(Request $request)
    {
        $avisDepose=[];
        $avisRecu=[];
        $data = json_decode($request->getContent(), true);
        $client = $this->clientRepo->findOneBy(['id' => $_GET['id']]);
        if($client)
        {
            $avis=$this->avisRepository->findBy(['client'=>$client]);
            if($avis)
            {
                foreach ($avis as $key => $avi) {
                    $avisDepose[]=[
                        'id'=>$avi->getId(),
                        'photo'=>$avi->getClient()->getPhoto()??'',
                        'firstName'=>$avi->getClient()->getFirstname(),
                        'tags'=>0,
                        'message'=>$avi->getDescAvis(),
                        'note_etat_BG'=>$avi->getEtatBagage(),
                        'note_securite'=>$avi->getRespectSecurite(),
                        'note_ponctualite'=>$avi->getPonctualite(),
                        'note_courtoisie'=>$avi->getCourtoisie(),
                    ];
                }
            }
            $avis=$this->avisRepository->findBy(['clientNoted'=>$client]);
             if($avis)
            {
                foreach ($avis as $key => $avi) {
                    $avisRecu[]=[
                        'id'=>$avi->getId(),
                        'photo'=>$avi->getClient()->getPhoto()??'',
                        'firstName'=>$avi->getClient()->getFirstname(),
                        'tags'=>0,
                        'message'=>$avi->getDescAvis(),
                        'note_etat_BG'=>$avi->getEtatBagage(),
                        'note_securite'=>$avi->getRespectSecurite(),
                        'note_ponctualite'=>$avi->getPonctualite(),
                        'note_courtoisie'=>$avi->getCourtoisie(),
                    ];
                }
            }
            $message = "liste des avis";
            $status = true;
        }
        else
        {
            $message = "Vous devez vous connecter";
            $status = false;
        }

        return $this->json(['status' => $status, 'message' => $message,'avisDepose'=>$avisDepose,'avisRecu'=>$avisRecu]);

    }

}