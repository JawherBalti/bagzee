<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Partenaire;
/**
 * @Route("/api/partenaire", name="api_")
 */

class PartenaireController extends AbstractController
{

	/**
    * @Route("/create", name="partenaire_create", methods={"POST"})
    */
    public function partenaire_create(ManagerRegistry $doctrine,Request $request,UserPasswordHasherInterface $passwordEncoder): Response
    {
    	$data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();

        $partenaire=new Partenaire();
        $partenaire->setFirstName($data['firstName']);
        $partenaire->setLastName($data['lastName']);
        $partenaire->setEmail($data['email']);
        $partenaire->setPhone($data['phone']);
        $partenaire->setNomStructure($data['nomStructure']);
        $partenaire->setAdresse($data['adresse']);
        $partenaire->setSiret($data['siret']);
        $partenaire->setPassword($passwordEncoder->hashPassword($partenaire, $data['password']));

        $entityManager->persist($partenaire);
        $entityManager->flush();

        return $this->json(['status'=>true,'message'=>'partenaire a été pris en compte','id'=>$partenaire->getId()]);

    }
}