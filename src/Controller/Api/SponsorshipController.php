<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Client;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\AdvertRepository;
use App\Repository\AvisRepository;
use App\Repository\BaggagiteRepository;
use App\Repository\BaggisteQueryRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\SponsorshipRepository;
/**
 * @Route("/api/sponsorship", name="api_sponsorship_")
 */

class SponsorshipController extends AbstractController{


	/**
     * @Route("/check", name="check", methods={"POST"})
     */
    public function api_sponsorship_check(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo,SponsorshipRepository $SponsorshipRepository,BaggisteQueryRepository $BaggisteQueryRepository,AdvertQueryRepository $AdvertQueryRepository): Response
    {
    	$tab=[];
    	        $data = json_decode($request->getContent(), true);

    			        $client = $clientRepo->findOneBy(['token' => $data['token']]);
    			        if($client)
    			        {
    			        	$sponsorship=$SponsorshipRepository->betwenDate($data['codePromos']);
    			        	if(!is_null($sponsorship))
    			        	{
    			        		$hasCodepromosBagagiste=$BaggisteQueryRepository->findOneBy(['client'=>$client,'codePromos'=>$data['codePromos']]);
    			        	$hasCodepromosAdvert=$AdvertQueryRepository->findOneBy(['client'=>$client,'codePromos'=>$data['codePromos']]);

    			        	if(!$hasCodepromosAdvert&&!$hasCodepromosBagagiste)
    			        	{
    			        		$autorized=true;
    			        	}
    			        	else
    			        	{
    			        		$autorized=false;
    			        	}
			    			        	if($autorized)
			    			        	{
			    			        		$status=true;
			    			        	$message="code promos";
			    			        	$tab=[
			    			        		'id'=>$sponsorship->getId(),
			    			        		'reduce'=>$sponsorship->getReduce(),
			    			        		'type'=>$sponsorship->getType(),
			    			        		'code'=>$sponsorship->getName()
			    			        	];
			    			        	}
			    			        	else
			    			        	{
			    			        		$status=false;
			    			        		$message="code promos déja utilisée";
			    			        	}

							
    			        	}
    			        	else
    			        	{
    			        		$status=false;
    			        	$message="code promos incorrect";
    			        	}
							
    			        }
    			        else
    			        {
    			        	$status=false;
    			        	$message="Vous devez vous connecter";

    			        }

    			                return $this->json(['status' => $status, 'message' => $message,'codePromos'=>$tab]);


    }
}