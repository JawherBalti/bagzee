<?php

namespace App\Controller\Api;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\AdvertRepository;
use App\Repository\BaggisteQueryRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\ClientRepository;
use App\Entity\BaggisteQuery;
use App\Entity\AdvertQuery;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @Route("/api/webhooks", name="api_")
 */
class WebhooksController extends AbstractController
{

        private $clientRepo;
        private $BaggisteQueryRepository;
        private $doctrine;
        private $AdvertQueryRepository;


         public function __construct(ClientRepository $clientRepo, BaggisteQueryRepository $BaggisteQueryRepository,ManagerRegistry $doctrine,AdvertQueryRepository $AdvertQueryRepository)
    {
            \Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);

        $this->clientRepo = $clientRepo;
        $this->BaggisteQueryRepository = $BaggisteQueryRepository;
        $this->doctrine = $doctrine;
        $this->AdvertQueryRepository = $AdvertQueryRepository;
       
    }




   /**
     * @Route("/payment", name="payment",methods={"POST"})
     */
   public function api_payment(Request $request)
    {
        if($request->getContent())
        {
        $data = json_decode($request->getContent(), true)['data']['object'];
        $type = json_decode($request->getContent(), true)['type'];
      
//        return ;
        switch ($type) {
           /* case 'payment_intent.succeeded':
                $this->paymentSucceeded($data);
                break;*/
            case 'charge.succeeded':
                $this->paymentSucceeded($data);
                break;    
            default:
                break;
        }
        }
    	

        return $this->json([]);
    }

     public function paymentSucceeded($data)
    {
            $entityManager = $this->doctrine->getManager();
        
            $order=$this->BaggisteQueryRepository->findoneBy(['stripePaymentMethode'=>$data['payment_intent']]);
         
           if($order)
            { 
                $order->setStatus(BaggisteQuery::valid);
                $order->setIsValid(BaggisteQuery::valid);
                $order->setPaied(1);
                // $advert=$order->getAdvert();
                //$advert->setStatus(1);
            $entityManager->flush();
            }
            else
            {
               
            $order=$this->AdvertQueryRepository->findoneBy(['stripePaymentMethode'=>$data['payment_intent']]);
            
                  if($order)
            {
                
                $order->setStatus(AdvertQuery::valid);
                $order->setIsValid(AdvertQuery::valid);
                $order->setPaied(1);

            $entityManager->flush();
                $advert=$order->getAdvert();
                //$advert->setStatus(1);
                $advertQueries=$advert->getAdvertQueries();
                if(count($advertQueries)>0)
                {
                    foreach ($advertQueries as $key => $advertQuerie) {
                        if($advertQuerie->getStatus()!=1)
                        { 
                            $advertQuerie->setStatus(AdvertQuery::refused);
                            $advertQuerie->setIsValid(AdvertQuery::refused);
                        }
                    }
                    $entityManager->flush();

                }


           

            }

            }

die();
                return new JsonResponse([], 200);


    }



}