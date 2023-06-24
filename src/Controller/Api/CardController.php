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
 * @Route("/api/card", name="api_")
 */

class CardController extends AbstractController
{
	 /**
     * @Route("/create", name="card_create",methods={"POST"})
     */
    public function card_create(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine)
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
                	try
                	{
                		 $payment_method = \Stripe\PaymentMethod::retrieve($data['tokenCard']);
                $payment_method->attach(['customer' => $client->getStripeCustomerId()]);
                $client->setStripePaymentMethod($payment_method->id);

                \Stripe\Customer::update($client->getStripeCustomerId(),array(
                    "invoice_settings" => ["default_payment_method" => $data['tokenCard']],
                ));

                $entityManager->flush();
                $status=true;
                $message="Votre carte a été créer";
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
     * @Route("/show", name="card_show",methods={"POST"})
     */
      public function card_show(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine)
    	{
    		$cards=[];
    			\Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);
  				$data=json_decode($request->getContent(),true);
           $entityManager = $doctrine->getManager();
           $client=$clientRepository->findOneBy(['token'=>$data['token']]);
                if(!$client)
                {
 					$status=false;
           			$message="Vous devez vous connecter";
                }
                else
                {
                	  $all=\Stripe\PaymentMethod::all(['customer'=>$client->getStripeCustomerId(),'type'=>'card']);
            $status=true;

            $message='information carte en cours';
            if(!empty($all))
            {

                foreach ($all->data as $key=>$p){
                    if($key==0)
                    {
                        $checked=true;

                    }
                    else {
                        $checked=false;

                    }

                    $payment_method = \Stripe\PaymentMethod::retrieve($p->id);

                    $card=$payment_method["card"];
                    $cards[] = [
                        'type' => $card['brand'],
                        'pm' => $p->id,
                        'cvc_check' => $card['checks']['cvc_check'],
                        'exp'=>$card['exp_month'].'/'.$card['exp_year'],
                        'last4' => $card['last4'],
                        'checked'=>$checked
                    ];
                }


            }
                }
        return $this->json(['status'=>$status,'message'=>$message,'cards'=>$cards]);
    	}


    /**
     * @Route("/delete", name="card_delete",methods={"POST"})
     */
     public function card_delete(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine)
    	{
    		\Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);
  				$data=json_decode($request->getContent(),true);
           $entityManager = $doctrine->getManager();
           $client=$clientRepository->findOneBy(['token'=>$data['token']]);
                if(!$client)
                {
 					$status=false;
           			$message="Vous devez vous connecter";
                }
                else
                {
                	 try 
            {
            
              $payment_method = \Stripe\PaymentMethod::retrieve($data['pm']);
                        $payment_method->detach();
                                    $all=\Stripe\PaymentMethod::all(['customer'=>$client->getStripeCustomerId(),'type'=>'card']);

                                    if(!empty($all->data))
                                    {
                                        foreach ($all->data as $key=>$p){
                    if($key==0)
                    {
                        $payment_method = \Stripe\PaymentMethod::retrieve($p->id);
                $payment_method->attach(['customer' => $client->getStripeCustomerId()]);
                $client->setStripePaymentMethod($payment_method->id);


                \Stripe\Customer::update($client->getStripeCustomerId(),array(
                    "invoice_settings" => ["default_payment_method" => $p->id],
                ));

                $entityManager->flush();
                    }
                }
                                    }

                                    else

                                    {
                                        $client->setStripePaymentMethod(NULL);
                                        $entityManager->flush();
                                    }

 

                          

            $status=true;
            $message="Votre carte à bien été supprimée";
            }
            catch (\Exception $ex)
            {
                $status=false;
                $message=$ex->getMessage();
            }
                }

        return $this->json(['status'=>$status,'message'=>$message]);



    	}
}