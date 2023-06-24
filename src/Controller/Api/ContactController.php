<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Repository\ContactNousRepository;
use App\Entity\ContactNous;
/**
 * @Route("/api/contact", name="api_")
 */

class ContactController extends AbstractController
{

	private $contactNousRepo;

	 public function __construct(ContactNousRepository $contactNousRepo)
	    {
	    	$this->contactNousRepo=$contactNousRepo;
	    }

	/**
    * @Route("/create", name="contact_create", methods={"POST"})
    */
    public function contact_create(Request $request,ManagerRegistry $doctrine): Response
    {
    	$data = json_decode($request->getContent(), true);
    	$entityManager = $doctrine->getManager();
    	$contactNous=new ContactNous();
    	$contactNous->setFirstName($data['firstName']);
    	$contactNous->setLastName($data['lastName']);
    	$contactNous->setEmail($data['email']);
    	$contactNous->setPhone($data['phone']);
    	$contactNous->setSubject($data['subject']);
    	$contactNous->setContent($data['content']);

    	try
    	{
    		$entityManager->persist($contactNous);
        	$entityManager->flush();
        	$status=true;
        	$message="Votre message a été envoyer avec succès";
    	}
    	catch(\Exception $ex)
    	{
    		$status=false;
        	$messae=$ex->getMessage();
    	}

    	

       	return $this->json(['status'=>$status,'message'=>$message]);


    }


}