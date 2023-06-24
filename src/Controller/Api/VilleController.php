<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\VilleRepository;
use App\Entity\Adress;

/**
 * @Route("/api/ville", name="api_ville_")
 */
class VilleController extends AbstractController
{

	private $villeRepo;

    public function __construct(VilleRepository $villeRepo)
    {
        $this->villeRepo = $villeRepo;
    }



	/**
     * @Route("/get", name="show", methods={"GET"})
     */
	  public function show(ManagerRegistry $doctrine, Request $request): Response
	  {
	  		$tab=[];
	  		
	  		$entityManager = $doctrine->getManager();
	        $villes = $this->villeRepo->findBy([],['name'=>'asc']);
	        if ($villes) {
	        	foreach ($villes as $key => $ville) {
	        		$tab[]=[
	        			'id'=>$ville->getId(),
	        			'name'=>$ville->getName()
	        		];
	        	}
	        	
	        	
	        	}
	        $status=true;
	        	$message="liste des villes";	
	        	
	    return $this->json(['status' => $status, 'message' => $message,'ville'=>$tab]);

	  }

	   /**
     * @Route("/delete", name="delete", methods={"POST"})
     */
	  public function delete(ManagerRegistry $doctrine, Request $request): Response
	  {
	  		$tab=[];
	  		$data = json_decode($request->getContent(), true);
	  		$entityManager = $doctrine->getManager();
	        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
	        if ($client) {
	        	$adresse=$this->adressRepo->findOneBy(['client'=>$client,'id'=>$data['id']]);
		        	if($adresse)
		        	{
		        		$entityManager->remove($adresse);
		        		$entityManager->flush();
		        		$status=true;
		        	    $message="adresse a été retiré de votre liste";
		        	}
		        	else
		        	{
		        		$status=true;
		        	    $message="id non trouvée";
		        	}
	        	
	        	
	        	}
	        	else
	        	{
				$status=false;
	        	$message="Vous devez vous connecter";
	        	}
	    return $this->json(['status' => $status, 'message' => $message]);

	  }
}
