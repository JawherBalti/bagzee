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
use App\Repository\FavorisRepository;
use App\Entity\Favoris;
/**
 * @Route("/api/favoris", name="api_")
 */

class FavorisController extends AbstractController
{

		private $clientRepo;
        private $baggagiteRepository;
     
        private $advertRepository;
        private $favorisRepository;
        private $advertRepo;

	    public function __construct(ClientRepository $clientRepo,BaggagiteRepository $baggagiteRepository,FavorisRepository $favorisRepository,AdvertRepository $advertRepository)
	    {
	    	$this->clientRepo=$clientRepo;
            $this->baggagiteRepository=$baggagiteRepository;
           $this->advertRepository=$advertRepository;
            $this->favorisRepository=$favorisRepository;
         
	    }


	/**
    * @Route("/create", name="favoris_create", methods={"POST"})
    */
    public function favoris_create(ManagerRegistry $doctrine,Request $request): Response
    {
        $favoris = null;
        $message='';
        $baggagistQuery = null;
        $advertQuery = null;
    	$data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
        
        if ($client) {
if(isset($data['baggagist_id']))
       {  $message = "Insertion a été pris en compte";
            $status = true;

             $baggaiste = $this->baggagiteRepository->findOneBy(['id' => $data['baggagist_id']]);
              $favoris=$this->favorisRepository->findOneBy(['client'=>$client,'baggagist'=>$baggaiste]);
             if(!$favoris){
          
            $favoris=$favoris?$favoris:new Favoris();
           $favoris->setType(1);
            $favoris->setBaggagist($baggaiste??null);
            $favoris->setAdvert(null);
            
            $favoris->setClient($client);
         
            

        }else
        $favoris->setType(0);
       
       $entityManager->persist($favoris);
            $entityManager->flush();

        }
          if(isset($data['advert_id']))
        {  $message = "Insertion a été pris en compte";
            $status = true;

             $advert = $this->advertRepository->findOneBy(['id' => $data['advert_id']]);
              $favoris=$this->favorisRepository->findOneBy(['client'=>$client,'advert'=>$advert]);
             if(!$favoris){
          
            $favoris=$favoris?$favoris:new Favoris();
           $favoris->setType(1);
            $favoris->setBaggagist(null);
            $favoris->setAdvert($advert??null);
            
            $favoris->setClient($client);
         
            

        }else
        $favoris->setType(0);
       
       $entityManager->persist($favoris);
            $entityManager->flush();

        }
    }
        else
        {
  			$message = "Vous devez vous connecter";
            $status = false;
        }

                return $this->json(['status' => $status, 'message' => $message]);

    }

    

}