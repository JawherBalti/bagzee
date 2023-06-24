<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\AdvertQuery;
use App\Entity\BaggisteQuery;
use App\Entity\Commission;
use App\Entity\Advert;
use App\Entity\Notification;
use App\Entity\LogRefund;
use App\Repository\ClientRepository;
use App\Repository\AdvertRepository;
use App\Repository\BaggisteQueryRepository;
use App\Repository\AdvertQueryRepository;
use App\Repository\CommissionRepository;
use App\Repository\SettingPriceRepository;
use App\Service\AdvertCancel;
use App\Service\BagagisteCancel;
/**
 * @Route("/api/payment", name="api_payment_")
 */

class PaymentController extends AbstractController
{


	 private $clientRepo;
    private $BaggisteQueryRepository;
    private $AdvertQueryRepository;
    private $commissionRepository;
    private $AdvertRepository;
    private $SettingPriceRepository;

    public function __construct(SettingPriceRepository $SettingPriceRepository,AdvertRepository $AdvertRepository,ClientRepository $clientRepo,BaggisteQueryRepository $BaggisteQueryRepository,AdvertQueryRepository $AdvertQueryRepository,CommissionRepository $commissionRepository)
    {
            \Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);

        $this->clientRepo = $clientRepo;
        $this->BaggisteQueryRepository = $BaggisteQueryRepository;
        $this->AdvertQueryRepository = $AdvertQueryRepository;
        $this->commissionRepository = $commissionRepository;
        $this->AdvertRepository = $AdvertRepository;
        $this->SettingPriceRepository = $SettingPriceRepository;
    }




    /**
    * @Route("/setting/price", name="setting_price_list", methods={"GET"})
    */

    public function setting_price_list(Request $request): Response
    {
        $tabsettingPrice=[];
            $settings=$this->SettingPriceRepository->findBy([],['name'=>'asc']);
            if($settings)
            {
                foreach ($settings as $key => $setting) {
                    $tabsettingPrice[] = [
                    'id' => $setting->getId(),
                    'name' => $setting->getName(),
                    'price' => $setting->getPrice(),
                        'isRelais' => $setting->getIsRelais()

                    ];
                }
            }
        return $this->json(['status'=>true,'setting_price'=>$tabsettingPrice]);

    }


	/**
    * @Route("/create", name="create", methods={"POST"})
    */
    public function create(ManagerRegistry $doctrine,Request $request): Response
    {
    	$data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();

        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);

          if ($client) {
						try {
					        	  $intent = \Stripe\PaymentIntent::retrieve($data['payment_method']);
					                    $intent->confirm([
					                        'payment_method' => $client->getStripePaymentMethod(),
					                    ]);
					        }

					        catch (\Exception $ex) {


					        	 $paymentIntent = \Stripe\PaymentIntent::create([

                                'amount' => intval(100 * $data['total']),
                                'currency' => 'eur',
                                'payment_method_types' => ['card'],
                                /*'application_fee_amount' => intval($data['don']*100)+$fess*100,*/
                                'customer' => $client->getStripeCustomerId(),
                                'payment_method' => $client->getStripePaymentMethod(),
                                'off_session' => false,
                                'save_payment_method' => true,
                                'capture_method' => 'automatic',
                                'confirmation_method' => 'manual',
                                'confirm' => true,

                                /*'on_behalf_of' => $activity->getCentre()->getPartenaire()->getStripeAccount(),
                                'transfer_data' => [
                                    'destination' => $activity->getCentre()->getPartenaire()->getStripeAccount(),
                               ],*/

                            ]);

	$order = $this->saveOrder($data, $client, $entityManager,$paymentIntent->id);
  if ($paymentIntent->status == 'requires_action' && $paymentIntent->next_action->type &&
                            $paymentIntent->next_action->type == 'use_stripe_sdk') {
                            # Tell the client to handle the action
                            $object = [
                                'requires_action' => true,
                                'payment_intent_client_secret' => $paymentIntent->client_secret,
                                'status' => true, 'message' => 'order has been created'
                            ];

                                    return $this->json($object);



					        }

					        else if ($paymentIntent->status == 'succeeded') {

                      
                            return $this->json(['requires_action' => null, 'status' => $paymentIntent->status]);


                        }

                        else {
                            # Invalid status
                           
                            $object = ['error' => 'Invalid PaymentIntent status'];
                           return $this->json($object);


                        }

                        } catch (\Exception $ex) {
                        $object = ['error_carte' => 'Carte invalide'];
                       return $this->json($object);
                    }



			$message = "Insertion a été pris en compte";
            $status = true;
          }
          else
          {
 			$message = "Vous devez vous connecter";
            $status = false;
          }



       

        return $this->json(['status'=>true,'message'=>'partenaire a été pris en compte']);

    }


    public function saveOrder($data,$client,$entityManager,$paymentIntent)
    {

        if($data['isBagagiste']==true)
        {
            $order=$this->BaggisteQueryRepository->find($data['order_id']);
            if($order)
            {
                $order->setStripePaymentMethode($paymentIntent);
                $order->setTotal($data['total']);
                if($data['codePromos']!="")
                {
                    $order->setCodePromos($data['codePromos']);
                    $order->setReduce($data['reduce']);
                    $order->setOldTotal($data['oldPrice']);
                }
                $entityManager->flush();

                 $comision=$this->commissionRepository->findOneBy(['baggagisteQuery'=>$order]);
            $comision=$comision?$comision:new Commission();

            $comision->setBaggagisteQuery($order);
            $comision->setBagzee($data['total']*0.3);
            $comision->setPorteur($data['total']*0.7);
            
                    $entityManager->persist($comision);
                    $entityManager->flush();

            }
        }
    	
        else
        {
        $order=$this->AdvertQueryRepository->find($data['order_id']);
        if($order)
                {
                    $order->setStripePaymentMethode($paymentIntent);
                    $order->setTotal($data['total']);
                     if($data['codePromos']!="")
                        {
                            $order->setCodePromos($data['codePromos']);
                            $order->setReduce($data['reduce']);
                            $order->setOldTotal($data['oldPrice']);
                        }
                    $entityManager->flush();

            $comision=$this->commissionRepository->findOneBy(['advertQuery'=>$order]);
            $comision=$comision?$comision:new Commission();

            $comision->setAdvertQuery($order);
            $comision->setBagzee($data['total']*0.3);
            $comision->setPorteur($data['total']*0.7);
            
                    $entityManager->persist($comision);
                    $entityManager->flush();

/*
           $query = $entityManager->getManager()
        ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
        ->setParameter('id', $order->getId());*/
           /*
                 $notification=new Notification();
                                $notification->setCreatedAt(new \DateTime());
                                $notification->setType('propreetaire');
                                $notification->setMessage($order->getClient()->getFirstname().' '.$order->getClient()->getLastname().' à confimer son paiement');
                                $notification->setContent($query->getArrayResult());
                                $notification->setUser($order->getClient()->getId());
                                $notification->setToUser($order->getAdvert()->getClient()->getId());
                                $entityManager->persist($notification);
                                $entityManager->flush();

                                */

                }
        }
    }

    /**
    * @Route("/cancel/proprietaire", name="cancel_proprietaire", methods={"POST"})
    */
    public function cancel_proprietaire(ManagerRegistry $doctrine,Request $request,BagagisteCancel $bagagisteCancel): Response
    {

        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);

        if ($client) {
          
              if(isset($data['id_order']))
              {
                $bagagisteQuery=$this->BaggisteQueryRepository->findOneBy(['id'=>$data['id_order']]);
                if($bagagisteQuery)
                {

                   $bagagisteCancel->cancelQueryBagagiste($bagagisteQuery,$client);
                }
                    

              }

                      return $this->json(['status'=>true,'message'=>'annulation a été prise en compte']);

          }
          else
          {
        return $this->json(['status'=>false,'message'=>'Vous devez vous connecter']);

          }

    }

      /**
    * @Route("/cancel/porteur", name="cancel_porteur", methods={"POST"})
    */
    public function cancel_porteur(ManagerRegistry $doctrine,Request $request,AdvertCancel $advertCancel): Response
    {

         $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);

        if ($client) {

            $advertQuery=$this->AdvertQueryRepository->findOneBy(['id'=>$data['id_order']]);
            $advertCancel->cancelQueryAdvert($advertQuery,$client);
            
            return $this->json(['status'=>true,'message'=>'annulation a été prise en compte']);

        }
        else
        {
                    return $this->json(['status'=>false,'message'=>'Vous devez vous connecter']);

        }
    }






}