<?php
namespace App\Service;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\BaggisteQuery;
use App\Entity\Client;
use App\Entity\LogRefund;

class BagagisteCancel
{
	    private $doctrine;

	     public function __construct(ManagerRegistry $doctrine)
	     {
	     	$this->doctrine = $doctrine;
                                    \Stripe\Stripe::setApiKey($_ENV["APP_STRIPE"]);

	     }

	        public function cancelQueryBagagiste(BaggisteQuery $bagagisteQuery,Client $client)
	     	{

	     	        $entityManager = $this->doctrine->getManager();
	     	                    $refund_id=null;
	     		 if($bagagisteQuery)
                {
                			if(!is_null($bagagisteQuery->getStripePaymentMethode()))
                    {
                        $today=new \DateTime();


                        $dateadvert=new \DateTime(date_format($bagagisteQuery->getDateTo(),'Y-m-d').' '.date_format($bagagisteQuery->getTimeTo(),'H:i'));
                        $date2=date_format($dateadvert,'Y-m-d H:i');
                        $date1=date_format($today,'Y-m-d H:i');
                        $diff = abs(strtotime($date2) - strtotime($date1)); 
                        $years   = floor($diff / (365*60*60*24)); 
                        $months  = floor(($diff - $years * 365*60*60*24) / (30*60*60*24)); 
                        $days    = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24)/ (60*60*24));
                        $hours   = floor(($diff - $years * 365*60*60*24 - $months*30*60*60*24 - $days*60*60*24)/ (60*60)); 

                         if($days>0)
                        {

                           $this->supperieur12H($bagagisteQuery,$client);
                                  

                        }
                        else
                        {
                        	 if($days==0&&$hours<12)
                            {
                            	$this->inferrieur12h($bagagisteQuery,$client);
                            }
                            else
                            {
                            	if($days==0&&$hours>12)
                            	{
                                $this->supperieur12H($bagagisteQuery,$client);
                            	}
                            }
                        }







	
                }

                  $bagagisteQuery->setStatus(BaggisteQuery::refused);
                  $bagagisteQuery->setIsValid(BaggisteQuery::refused);
                    $entityManager->flush();

                    /*$query = $doctrine->getManager()
        ->createQuery("SELECT e FROM App:BaggisteQuery e WHERE e.id = :id")
        ->setParameter('id', $bagagisteQuery->getId());*/

            /*         $notification=new Notification();
                                $notification->setCreatedAt(new \DateTime());
                                $notification->setType('propreetaire');
                                $notification->setMessage($client->getFirstname().' '.$client->getLastname().' a annulée sa demande');
                                $notification->setContent($query->getArrayResult());
                                $notification->setUser($client->getId());
                                $notification->setToUser($bagagisteQuery->getClient()->getId());
                                $entityManager->persist($notification);
                                $entityManager->flush();
*/

	     	}
	     }



	     public function inferrieur12h($bagagisteQuery,$client)
	     {
             $entityManager = $this->doctrine->getManager();
             $intent = \Stripe\PaymentIntent::retrieve($bagagisteQuery->getStripePaymentMethode());
                                try{
                                      
                                    $refund=\Stripe\Refund::create([
                                        "charge" => $intent->latest_charge,
                                        "amount" => ($bagagisteQuery->getTotal()*0.5)*100
                                    ]);
                                     $refund_id=$refund->id;

                                    $transfert=\Stripe\Transfer::create([

  'amount' => ($bagagisteQuery->getTotal()-($bagagisteQuery->getTotal()*0.5)-$bagagisteQuery->getTotal()*0.3)*100,
  'currency' => 'eur',
  'destination' => $bagagisteQuery->getClient()->getStripeAccount()
  //'transfer_group' => 'Acitivity_'.$act->getId(),
]);
                                    $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                     $logRefund->setMontant($bagagisteQuery->getTotal()*0.5);
                                    $logRefund->setBagagisteQuery($bagagisteQuery);
                                    $logRefund->setMontantTransferer($bagagisteQuery->getTotal()-($bagagisteQuery->getTotal()*0.5)-$bagagisteQuery->getTotal()*0.3);
                                    $logRefund->setContraite("moins de 12h");
                                    $logRefund->setRefund($refund->id);
                                    $logRefund->setTransfert($transfert->id);
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();

                                }

                                  catch(\Exception $ex)
                            {
                                    $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                     $logRefund->setMontant($bagagisteQuery->getTotal()*0.5);
                                    $logRefund->setBagagisteQuery($bagagisteQuery);
                                    $logRefund->setMontantTransferer($bagagisteQuery->getTotal()-($bagagisteQuery->getTotal()*0.5)-$bagagisteQuery->getTotal()*0.3);
                                    $logRefund->setContraite("moins de 12h");
                                    $logRefund->setRefund($refund_id);
                                    $logRefund->setTransfert($transfert->id);
                                    $logRefund->setError($ex->getMessage());
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();
                            }
	     }




	     public function supperieur12H($bagagisteQuery,$client)
	     {
$refund_id=null;
             $entityManager = $this->doctrine->getManager();


	     	   //annulation propriertire au dela de 12h
                            try
                            {
                                   $intent = \Stripe\PaymentIntent::retrieve($bagagisteQuery->getStripePaymentMethode());
                                    $refund=\Stripe\Refund::create([
                                        "charge" => $intent->latest_charge,
                                        "amount" => $bagagisteQuery->getTotal()*100
                                    ]);
$refund_id=$refund->id;
                                      $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                    $logRefund->setMontant($bagagisteQuery->getTotal());
                                    $logRefund->setMontantTransferer(0);
                                    $logRefund->setBagagisteQuery($bagagisteQuery);
                                    $logRefund->setContraite("au dela de 12h");
                                    $logRefund->setRefund($refund->id);
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();
                            }
                            catch(\Exception $ex)
                            {
                                    $logRefund=new LogRefund();
                                    $logRefund->setCreatedAt(new \DateTime());
                                    $logRefund->setProprietaire($client->getId());
                                    $logRefund->setMontant($bagagisteQuery->getTotal());
                                    $logRefund->setMontantTransferer(0);
                                    $logRefund->setBagagisteQuery($bagagisteQuery);
                                    $logRefund->setContraite("au dela de 12h");
                                    $logRefund->setRefund($refund_id);
                                    $logRefund->setError($ex->getMessage());
                                    $entityManager->persist($logRefund);
                                    $entityManager->flush();
                            }

	     }
     }