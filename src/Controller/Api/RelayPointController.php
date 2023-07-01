<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\WorkingRepository;
use App\Repository\ClientRepository;
use App\Repository\AvisRepository;
use App\Entity\Working;
use App\Repository\AdvertQueryRepository;
use App\Repository\BaggisteQueryRepository;

/**
 * @Route("/api/relay_point", name="api_")
 */

class RelayPointController extends AbstractController
{
	/**
     * @Route("/working/create", name="working_create",methods={"POST"})
     */
	public function working_create(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine,WorkingRepository $WorkingRepository)
	{
			$data=json_decode($request->getContent(),true);
           $entityManager = $doctrine->getManager();
           $client=$clientRepository->findOneBy(['token'=>$data['token']]);
                   $days=['','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

                if(!$client)
                {
 					$status=false;
           			$message="Vous devez vous connecter";
                }
                else
                {

                    $oldWorkings=$WorkingRepository->findBy(['client'=>$client],['days'=>'asc']);
                    if($oldWorkings)
                    {
                        foreach ($oldWorkings as $key => $oldWorking) {
                           $entityManager->remove($oldWorking);
                        }
                         $entityManager->flush();
                    }


                	$status=true;
           			$message="mise a jour a été créer avec succès";
                	$works=$data['working'];

                	  foreach ($data['week'] as $week) {
                	  	foreach ($works as $key => $work) {
                	  		$working=$WorkingRepository->findOneBy(['client'=>$client,'week'=>$week,'days'=>$work['days']],['days'=>'asc']);
        						$working=new Working();
        		$working->setDays($work['days']);
                $working->setContenu($work['continu']);
                $working->setWork($work['work']);
                $working->setWeek($week);
                $working->setAfternoonFrom(new \DateTime($work['afternoonFrom']));
                $working->setAfternoonTo(new \DateTime($work['afternoonTo']));
                $working->setMorningFrom(new \DateTime($work['morningFrom']));
                $working->setMorningTo(new \DateTime($work['morningTo']));
                $working->setClient($client);
                $entityManager->persist($working);
                $entityManager->flush();

                	  	}
        						
                	  }
                }

                        return $this->json(['status'=>$status,'message'=>$message]);
	
	}

	/**
     * @Route("/working/list", name="working_list",methods={"GET"})
     */
	public function working_list(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine,WorkingRepository $WorkingRepository)
	{
		$object=[];
        $tabWeek=[];
		$data=json_decode($request->getContent(),true);
           $entityManager = $doctrine->getManager();
                   $days=['','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

           $client=$clientRepository->findOneBy(['token'=>$_GET['token']]);
                if(!$client)
                {
 					$status=false;
           			$message="Vous devez vous connecter";
                }
                else
                {
                	$message='Liste des horaires';
			            $status=true;
                	if(isset($_GET['week']))
                	{
                		$week=$_GET['week'];
                	}
                	else
                	{
                		$week=date('W');
                	}
        			$working=$WorkingRepository->findBy(['client'=>$client,'week'=>$week],['days'=>'asc']);
        			if(!$working)
        			{
						  for ($i=1;$i<=7;$i++)
						            {
						                $object[]=[
						                    'id'=>$i,
						                    'days'=>$i,
						                    'dayName'=>$days[$i],
						                    'continu'=>false,
						                    'work'=>false,
						                    'morningFrom'=>date_format(new \DateTime('09:00'),'H:i'),
						                    'morningTo'=>date_format(new \DateTime('13:00'),'H:i'),
						                    'afternoonFrom'=>date_format(new \DateTime('14:00'),'H:i'),
						                    'afternoonTo'=>date_format(new \DateTime('18:00'),'H:i')
						                ];
						            }
        			}

        			else
        			{
        				foreach ($working as $work)
			            {
			                $object[]=[
			                    'id'=>$work->getId(),
			                    'days'=>$work->getDays(),
			                    'dayName'=>$days[$work->getDays()],
			                    'continu'=>$work->isContenu(),
			                    'work'=>$work->isWork(),
			                    'morningFrom'=>date_format($work->getMorningFrom(),'H:i'),
			                    'morningTo'=>date_format($work->getMorningTo(),'H:i'),
			                    'afternoonFrom'=>date_format($work->getAfternoonFrom(),'H:i'),
			                    'afternoonTo'=>date_format($work->getAfternoonTo(),'H:i')
			                ];
			            }
        			}
        			
			            
                }

                $selectedWeek=$WorkingRepository->listWeekSelected($client);
                if($selectedWeek)
                {
                    foreach ($selectedWeek as $key => $w) {
                         $tabWeek[]=$w['week'];
                    }
                   
                }


        return $this->json(['status'=>$status,'message'=>$message,'working'=>$object,'weeks'=>$tabWeek]);
	
	}


	/**
     * @Route("/week", name="working_week",methods={"GET"})
     */
	public function working_week(ClientRepository $clientRepository,Request $request,ManagerRegistry $doctrine,WorkingRepository $WorkingRepository)
	{
		 $year=date('Y',strtotime(date_format(new \DateTime(),'Y-m-d')));
        $lastWeek=date("W", strtotime($year."-12-31"));
        if(intval($lastWeek)==1)
        {
            $lastWeek=52;
        }
        $object=[];
        $week=date('W',strtotime(date_format(new \DateTime(),'Y-m-d')));
       
        for($i=intval($week);$i<=$lastWeek;$i++)
        {
         
         	$object[]=$i;
        }
        return $this->json(['week'=>$object]);


	}


    /**
     * @Route("/list", name="point_relais_list",methods={"GET"})
     */
    public function point_relais_list(ClientRepository $clientRepository,Request $request)
    {
        $tab=[];
        $adress=['id'=>'','name'=>'','lat'=>'','lng'=>'','ville'=>''];

        $pointRelais=$clientRepository->hasRole('POINT_RElAIS');
        
                    foreach ($pointRelais as $key => $pointRelais) {
                        $adress=['id'=>'','name'=>'','lat'=>'','lng'=>''];

                        if(count($pointRelais->getAdresses())>0)
                        {
                            foreach ($pointRelais->getAdresses() as $key => $adr) {
                                $adress=['id'=>$adr->getId(),'name'=>$adr->getName(),'lat'=>$adr->getLat(),'lng'=>$adr->getLng(),'ville'=>$adr->getVille()];
                            }
                        }

                        $tab[] = [
                    'id' => $pointRelais->getId(),
                    'firstName' => $pointRelais->getFirstname(),
                    'lastName' => $pointRelais->getLastname(),
                    'email' => $pointRelais->getEmail(),
                    'gender' => $pointRelais->getGender(),
                    'nationalite'=>$pointRelais->getNationalite()??'',
                    'phone' => $pointRelais->getPhone(),
                    'birdh' => date_format($pointRelais->getBirdh(), 'd-m-Y'),
                    'photo' => $pointRelais->getPhoto()??'',
                    'stripeCustomerId' => $pointRelais->getStripeCustomerId(),
                    'stripeAccount' => $pointRelais->getStripeAccount() ?? '',
                     'numSiret' => $pointRelais->getSiret() ?? '',
                'nomEntreprise'=>$pointRelais->getEntreprise()??'',
                'adress'=>$adress
                ];
                    }

                    $status=true;
                    $message="Liste des point relais";
                

        
        return $this->json(['point_relais'=>$tab,'message'=>$message,'status'=>$status]);


    }


    /**
     * @Route("/advert/query", name="point_relais_advert_query",methods={"POST"})
     */
     public function point_relais_advert_query(ClientRepository $clientRepository,Request $request,AdvertQueryRepository $advertQueryRepository,AvisRepository $avisRepo)
    {

                $nbjour=date('N');
                $today=new \DateTime();
                $tabAdverts=[];
                $nbDebutSemaine=1;
                if($nbjour-1>0)
                {
                    $nbDebutSemaine=$nbjour-1;

                }
                if($nbDebutSemaine>1)
                {
                    $start=date_modify($today,"-".$nbDebutSemaine. "days");
                    $newstart=clone $start;
                     $end=date_modify($newstart,"+ 6 days");
                }
                else
                {
                    $start=$today;
                    $newstart=clone $start;
                     $end=date_modify($newstart,"+ 6 days");
                }

        $data = json_decode($request->getContent(), true);
        $client=$clientRepository->findOneBy(['token'=>$data['token']]);
         if(!$client)
                {
                    $status=false;
                    $message="Vous devez vous connecter";
                }
                else
                {

                    $message='Liste des advertquery';
                    $status=true;

                    $advertquerys=$advertQueryRepository->bydatewithPointrelais($start,$end,$client);
                    if($advertquerys)
                    {
                        foreach ($advertquerys as $key => $advertQuery) {

 $idPorteur=[];
                            $idPorteur[]=$advertQuery->getClient()->getId();
                            $avis = $avisRepo->nbreAdvert($idPorteur);
                             $porteurs = [
                                'id' => $advertQuery->getClient()->getId(),
                                'photo' => $advertQuery->getClient()->getPhoto() ?? '',
                                'firstName' => $advertQuery->getClient()->getFirstname(),
                                'lastName' => $advertQuery->getClient()->getLastname(),
                                'nbrAvis' => floatval($avis['nbrAvis']),
                                'totalAvis' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1),
                            ];
                           
$proprietaire=[
     'id' => $advertQuery->getClient()->getId(),
                                'photo' => $advertQuery->getClient()->getPhoto() ?? '',
                                'firstName' => $advertQuery->getClient()->getFirstname(),
                                'lastName' => $advertQuery->getClient()->getLastname()
                               
];
                            $tabAdverts[] = [
                    'id' => $advertQuery->getId(),
                    'dimensionsLarg' => $advertQuery->getWidth(),
                    'dimensionsH' => $advertQuery->getHeight(),
                    'dimensionsLong' => $advertQuery->getLength(),
                    'dimensionsKg' => $advertQuery->getWeight(),
                    'ville_depart' => $advertQuery->getFromAdress(),
                    'ville_arrivee' => $advertQuery->getToAdress(),
                    'description' => $advertQuery->getDescription(),
                    'objectType' => implode(",", $advertQuery->getObjectType()),
                    'objectTransport' => implode(",", $advertQuery->getObjectTransport()),
                    'dateDepart' => date_format($advertQuery->getDateFrom(), 'd-m-Y'),
                    'dateArrivee' => date_format($advertQuery->getDateTo(), 'd-m-Y'),
                    'heureDepart' => date_format($advertQuery->getTimeFrom(), 'H:i'),
                    'heureArrivee' => date_format($advertQuery->getTimeTo(), 'H:i'),
                    'listeContenu' => $advertQuery->getObjectContenu(),
                    'price' => $advertQuery->getPrice(),
                    'adresse_point_depart' => $advertQuery->getAdressPointDepart(),
                    'adresse_point_arrivee' => $advertQuery->getAdressPointArrivee(),
                    'type_adresse_arrivee' => $advertQuery->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $advertQuery->getTypeAdressDepart(),
                    'porteurs' => $porteurs,
                    'proprietaire'=>$proprietaire,
                    'status_label'=>$this->getStatusByName($advertQuery)
                ];

                        }
                    }
                }

        return $this->json(['status'=>$status,'message'=>$message,'advertQuery'=>$tabAdverts]);

    }

       /**
     * @Route("/bagagiste/query", name="point_relais_bagagiste_query",methods={"POST"})
     */
     public function point_relais_bagagiste_query(ClientRepository $clientRepository,Request $request,BaggisteQueryRepository $baggisteQueryRepository)
    {

                $nbjour=date('N');
                $today=new \DateTime();
                $tabAdverts=[];
                $nbDebutSemaine=1;
                if($nbjour-1>0)
                {
                    $nbDebutSemaine=$nbjour-1;

                }
                if($nbDebutSemaine>1)
                {
                    $start=date_modify($today,"-".$nbDebutSemaine. "days");
                    $newstart=clone $start;
                     $end=date_modify($newstart,"+ 6 days");
                }
                else
                {
                    $start=$today;
                    $newstart=clone $start;
                     $end=date_modify($newstart,"+ 6 days");
                }

        $data = json_decode($request->getContent(), true);
        $client=$clientRepository->findOneBy(['token'=>$data['token']]);
         if(!$client)
                {
                    $status=false;
                    $message="Vous devez vous connecter";
                }
                else
                {

                    $message='Liste des advertquery';
                    $status=true;

                    $bagagistesquerys=$baggisteQueryRepository->bydatewithPointrelais($start,$end,$client);
                    if($bagagistesquerys)
                    {
                        foreach ($bagagistesquerys as $key => $baggagistesQuery) {

                             
                           
$proprietaire=[
     'id' => $baggagistesQuery->getClient()->getId(),
                                'photo' => $baggagistesQuery->getClient()->getPhoto() ?? '',
                                'firstName' => $baggagistesQuery->getClient()->getFirstname(),
                                'lastName' => $baggagistesQuery->getClient()->getLastname()
                               
];
                            $tabAdverts[] = [
                    'id' => $baggagistesQuery->getId(),
                     'ville_depart' => $baggagistesQuery->getBaggagite()->getAdressFrom(),
                        'ville_arrivee' => $baggagistesQuery->getBaggagite()->getAdressTo(),
                        'dateDepart' => date_format($baggagistesQuery->getBaggagite()->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($baggagistesQuery->getBaggagite()->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($baggagistesQuery->getBaggagite()->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($baggagistesQuery->getBaggagite()->getTimeTo(), 'H:i'),
                        'adresse_point_depart' => $baggagistesQuery->getBaggagite()->getAdressePointDepart(),
                        'adresse_point_arrivee' => $baggagistesQuery->getBaggagite()->getAdressePointArrivee(),
                        'commentaire' => $baggagistesQuery->getBaggagite()->getCommentaire(),
                        'contenuRefuse' => $baggagistesQuery->getContenuRefuse(),
                        'contenuTransporter' => implode(',', $baggagistesQuery->getContenuTransporter()),
                        'status' => $baggagistesQuery->getStatus(),
                        'dimensionsLarg' => $baggagistesQuery->getBaggagite()->getDimension()->getWidth(),
                        'dimensionsH' => $baggagistesQuery->getBaggagite()->getDimension()->getHeight(),
                        'dimensionsLong' => $baggagistesQuery->getBaggagite()->getDimension()->getLength(),
                        'dimensionsKg' => $baggagistesQuery->getBaggagite()->getDimension()->getWeight(),
                        'type_adresse_arrivee' => $baggagistesQuery->getBaggagite()->getTypeAdresseArrivee(),
                        'type_adresse_depart' => $baggagistesQuery->getBaggagite()->getTypeAdresseDepart(),
                        'objectType' => implode(",", $baggagistesQuery->getBaggagite()->getObjectType()),
                        'objectTransport' => implode(",", $baggagistesQuery->getBaggagite()->getObjectTransport()),
                        'notContain' => implode(",", $baggagistesQuery->getBaggagite()->getNotContain()),
                    'proprietaire'=>$proprietaire,
                    'status_label'=>$this->getStatusByName($baggagistesQuery)
                ];

                        }
                    }
                }

        return $this->json(['status'=>$status,'message'=>$message,'advertQuery'=>$tabAdverts]);

    }


    public function getStatusByName($advertQuery)
    {

       switch ($advertQuery->getStatus()) {
  case 0:
    return $status='en attente';
    break;
  case 1:
  return !is_null($advertQuery->getStripePaymentMethode())?$status='payée':'aceptée';
    break;
  case 2:
    return $status='annulée';
    break;
  default:
    $status='';
    return $status;
}
    }



	




}