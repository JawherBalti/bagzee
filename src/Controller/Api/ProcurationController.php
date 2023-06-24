<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Procuration;
/**
 * @Route("/api/procuration", name="api_")
 */

class ProcurationController extends AbstractController
{

	/**
    * @Route("/create", name="procuration_create", methods={"POST"})
    */
    public function procuration_create(ManagerRegistry $doctrine,Request $request): Response
    {
    	$data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $procuration=new Procuration();
        $procuration->setFirstName($data['firstName']);
        $procuration->setLastName($data['lastName']);
        $procuration->setEmail($data['email']);
        $procuration->setVille($data['ville']);
        $procuration->setAdresse($data['adresse']);
        $procuration->setZip($data['zip']);
        $procuration->setPhone($data['phone']);

        $entityManager->persist($procuration);
        			$entityManager->flush();

        return $this->json(['status'=>true,'message'=>'procuration a été pris en compte','id'=>$procuration->getId()]);

    }
}