<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\AdressRepository;
use App\Entity\Adress;

/**
 * @Route("/api/address", name="api_address_")
 */
class AddressController extends AbstractController
{

	private $clientRepo;
	private $adressRepo;

    public function __construct(ClientRepository $clientRepo,AdressRepository $adressRepo)
    {
        $this->clientRepo = $clientRepo;
        $this->adressRepo = $adressRepo;
    }


	  /**
     * @Route("/add", name="create", methods={"POST"})
     */
	  public function add(ManagerRegistry $doctrine, Request $request): Response
	  {
	  		$data = json_decode($request->getContent(), true);
	  		$entityManager = $doctrine->getManager();
	        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
	        if ($client) {
	        	if(in_array('ROLE_POINT_RELAIS', $client->getRoles()))
	        	{
				$adresse=$this->adressRepo->findOneBy(['client'=>$client]);
				$adresse=$adresse?$adresse:new Adress();
				$adresse->setName($data['name']);
	        	$adresse->setLat($data['lat']);
	        	$adresse->setLng($data['long']);
	        	$adresse->setVille($data['ville']);
	        	$adresse->setClient($client);
	        	$entityManager->persist($adresse);
	        	$entityManager->flush();

	        	}
	        	else
	        	{
	        	$adr=new Adress();
	        	$adr->setName($data['name']);
	        	$adr->setLat($data['lat']);
	        	$adr->setLng($data['long']);
	        	$adr->setVille($data['ville']);
	        	$adr->setClient($client);
	        	$entityManager->persist($adr);
	        	$entityManager->flush();
	        	}
	        	
	        	$status=true;
	        	$message="information a été prise en compte";
	        	}
	        	else
	        	{
				$status=false;
	        	$message="Vous devez vous connecter";
	        	}
	    return $this->json(['status' => $status, 'message' => $message]);

	  }

	    /**
     * @Route("/list", name="show", methods={"POST"})
     */
	  public function show(ManagerRegistry $doctrine, Request $request): Response
	  {
	  		$tab=[];
	  		$data = json_decode($request->getContent(), true);
	  		$entityManager = $doctrine->getManager();
	        $client = $this->clientRepo->findOneBy(['token' => $data['token']]);
	        if ($client) {
	        	$adresses=$client->getAdresses();
	        	if(count($adresses)>0)
	        	{
	        		foreach ($adresses as $key => $adresse) {
	        			$tab[]=[
	        				'id'=>$adresse->getId(),
	        				'name'=>$adresse->getName(),
	        				'lat'=>$adresse->getLat(),
	        				'long'=>$adresse->getLng(),
	        				'ville'=>$adresse->getVille(),
	        				'idPointRelais'=>$adresse->getClient()->getId()
	        			];
	        		}
	        	}
	        	$status=true;
	        	$message="information a été prise en compte";
	        	}
	        	else
	        	{
				$status=false;
	        	$message="Vous devez vous connecter";
	        	}
	    return $this->json(['status' => $status, 'message' => $message,'mesAdresses'=>$tab]);

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
