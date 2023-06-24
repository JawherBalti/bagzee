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
use App\Service\Stripe;

/**
 * @Route("/api/banque", name="api_")
 */

class BanqueController extends AbstractController
{
	 /**
     * @Route("/create", name="banque_create",methods={"POST"})
     */
   public function banque_create(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine)
   {
   	\Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);
  				$data=json_decode($request->getContent(),true);
           $entityManager = $doctrine->getManager();
           $client=$clientRepository->findOneBy(['token'=>$data['tokenClient']]);
                if(!$client)
                {
 					$status=false;
           			$message="Vous devez vous connecter";
                }
                else
                {
                	$status=true;
           			$message="Votre iban a été créer";
 				try{
 					$externel=\Stripe\Account::createExternalAccount(
                $client->getStripeAccount(),
                [
                    'external_account' => $data['tokenBanque'],
                    'default_for_currency'=>true
                ]
            );
            $client->setstripeBanqueAccount($externel->id);
            $entityManager->flush();
 				}
 				catch(\Exception $ex)
 				{
$status=false;
           			$message=$ex->getMessage();
 				}
 				
             }
                        return $this->json(['status'=>$status,'message'=>$message]);
         
   	}


   	 /**
     * @Route("/show", name="banque_show",methods={"POST"})
     */
    public function banque_show(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine)
    {
   		\Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);
        $data=json_decode($request->getContent(),true);
        $tab=[];
           $client=$clientRepository->findOneBy(['token'=>$data['tokenClient']]);
        if(!$client)
        {
            
            $status=false;
            $message="Vous devez vous connecter";
        }
        else
        {
            $status=true;
            $message="Information banque account";
            try
            {
            	$externel=\Stripe\Account::retrieveExternalAccount(
                $client->getStripeAccount(),
                $client->getStripeBanqueAccount()
            );
            $tab=['last4'=>$externel->last4];
            }
            catch(\Exception $ex)
 				{
$status=false;
           			$message=$ex->getMessage();
 				}
            

        }
                        return $this->json(['status'=>$status,'message'=>$message,'banque'=>$tab]);

    }
}