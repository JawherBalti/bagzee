<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Porteur;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\PorteurRepository;

/**
 * @Route("/api/porteur", name="api_")
 */

class PorteurController extends AbstractController
{

	/**
    * @Route("/subscription", name="porteur_subscription", methods={"POST"})
    */
    public function porteur_subscription(ManagerRegistry $doctrine,Request $request,UserPasswordHasherInterface $passwordEncoder,PorteurRepository $porteurRepo): Response
    {

    	$data = json_decode($request->getContent(), true);
        $hasPorteur=$porteurRepo->findOneBy(['email'=>$data['email']]);

        if(!$hasPorteur)
        {

    	$porteur=new Porteur();
        $entityManager = $doctrine->getManager();
        $porteur->setEntreprise($data['entreprise']);
        $porteur->setSiret($data['siret']);
        $porteur->setFirstname($data['firstName']);
    	$porteur->setLastname($data['lastName']);
    	$porteur->setEmail($data['email']);
    	$porteur->setGender($data['gender']);
    	$porteur->setBirdh(new \DateTime($data['birdh']));
    	$porteur->setPhone($data['phone']);
    	$porteur->setPassword($passwordEncoder->hashPassword($porteur, $data['password']));

		$entityManager->persist($porteur);
        $entityManager->flush();

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
    * @Route("/all", name="porteur_all", methods={"GET"})
    */
    public function porteur_all(ManagerRegistry $doctrine,Request $request,UserPasswordHasherInterface $passwordEncoder): Response
    {
        return $this->json('Created new project successfully with id ');
    }

}