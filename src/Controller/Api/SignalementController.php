<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Client;
use App\Repository\ClientRepository;
use App\Entity\Signalement;
/**
 * @Route("/api/signalement", name="api_")
 */
class SignalementController extends AbstractController
{
	/**
     * @Route("/create", name="signalement_create", methods={"POST"})
     */
	public function signalement_create(ManagerRegistry $doctrine, Request $request,ClientRepository $clientRepository): Response
	{

		$client=$clientRepository->findOneBy(['token'=>$_GET['token']]);
		        $entityManager = $doctrine->getManager();

		if($client)
		{
			$data = json_decode($request->getContent(), true);

		        $signalement=new Signalement();
		        $signalement->setSujet($data['sujet']);
		        $signalement->setMessage($data['message']);
		        $signalement->setClient($client);

		            $entityManager->persist($signalement);
		            $entityManager->flush();

		            $status=true;
		            $message='signalement a été pris en consédiration';
		}
		else

		{
			 $status=false;
		            $message='Vous devez vous connecter';
		}

        return $this->json(['status' => $status, 'message' => $message]);




		        



	}

}