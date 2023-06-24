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
 * @Route("/api/client", name="api_")
 */

class ClientController extends AbstractController
{

	/**
    * @Route("/subscription", name="client_subscription", methods={"POST"})
    */
    public function client_subscription(ManagerRegistry $doctrine,Request $request,UserPasswordHasherInterface $passwordEncoder,ClientRepository $clientRepo,Stripe $stripeHelper): Response
    {

    	$data = json_decode($request->getContent(), true);
        $data=$data['values'];
        $hasClient=$clientRepo->findOneBy(['email'=>$data['email']]);
        if(!$hasClient)
        {
            $client=new Client();
        $entityManager = $doctrine->getManager();
        $client->setFirstname($data['firstName']);
        $client->setLastname($data['lastName']);
        $client->setEmail($data['email']);
        $client->setGender($data['gender']);
        if(isset($data['birdh']))
        {
                    $client->setBirdh(new \DateTime($data['birdh']));

        }
        else
        {
                    $client->setBirdh(new \DateTime("2000-01-01"));

        }
        if(isset($data['photo']))
        {
            $client->setPhoto($data['photo']);
        }
        $client->setPhone($data['phone']);
        $client->setPassword($passwordEncoder->hashPassword($client, $data['password']));
        if(isset($data['siret']))
        {
            if($data['siret']!="")
            {
                    $client->setSiret($data['siret']);
            $client->setEntreprise($data['entreprise']);    
            }
            
        }

        if($data['isPointRelais']==true)
        {
            $client->setRoles(["ROLE_POINT_RELAIS"]);    
        }

        $entityManager->persist($client);
        $entityManager->flush();

        $stripeHelper->createCustomer($client,$entityManager);


            $status=true;
            $message='vos informations ont été pris en compte';
        }
        else
        {
            $status=false;
            $message='votre email existe déja';   
        }
        return $this->json(['status'=>$status,'message'=>$message]);
    }

    /**
    * @Route("/all", name="client_all", methods={"GET"})
    */
    public function client_all(ManagerRegistry $doctrine,Request $request,UserPasswordHasherInterface $passwordEncoder): Response
    {
        return $this->json('Created new project successfully with id ');
    }

}