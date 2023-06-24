<?php
namespace App\Service;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\AdvertQuery;
use App\Entity\Client;
use App\Entity\LogRefund;

class AdvertCancel
{
	    private $doctrine;

	     public function __construct(ManagerRegistry $doctrine)
	     {
                        \Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);

	     	$this->doctrine = $doctrine;
	     }

	     public function cancelQueryAdvert(AdvertQuery $advertQuery,Client $client)
	     {
	     	        $entityManager = $this->doctrine->getManager();
	     	                    $refund_id=null;


	     	 try
                            {
                                $intent = \Stripe\PaymentIntent::retrieve($advertQuery->getStripePaymentMethode());

                                    $refund=\Stripe\Refund::create([
                                        "amount" => $advertQuery->getTotal()*100,
                                        "charge"=>$intent->latest_charge
                                    ]);
                                    $refund_id=$refund->id;
                                    $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                    $logRefund->setMontant($advertQuery->getTotal());
                                    $logRefund->setAdvertQuery($advertQuery);
                                    $logRefund->setContraite("remboursement intégral du proprietaire");
                                    $logRefund->setRefund($refund->id);
                                    $logRefund->setError('');
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();
                            }

                               catch(\Exception $ex)
                            {
                                    $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                    $logRefund->setMontant($advertQuery->getTotal());
                                    $logRefund->setAdvertQuery($advertQuery);
                                    $logRefund->setContraite("remboursement intégral du proprietaire");
                                    $logRefund->setRefund($refund_id);
                                    $logRefund->setError($ex->getMessage());
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();


                            }

                             $advertQuery->setStatus(AdvertQuery::refused);
                             $advertQuery->setIsValid(AdvertQuery::refused);
                    $entityManager->flush();
/*
                          $query = $doctrine->getManager()
        ->createQuery("SELECT e FROM App:AdvertQuery e WHERE e.id = :id")
        ->setParameter('id', $advertQuery->getId());*/


   /*      $notification=new Notification();
                                $notification->setCreatedAt(new \DateTime());
                                $notification->setType('propreetaire');
                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a annulée sa demande');
                                $notification->setContent($query->getArrayResult());
                                $notification->setUser($client->getId());
                                $notification->setToUser($advertQuery->getClient()->getId());
                                $entityManager->persist($notification);
                                $entityManager->flush();

                                */

	     }

}