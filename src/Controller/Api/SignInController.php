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
use App\Repository\ClientRepository;
use App\Service\Stripe;
/**
 * @Route("/api/signIn", name="api_")
 */
class SignInController extends AbstractController
{

    /**
     * @Route("/client", name="signIn_client", methods={"POST"})
     */
    public function signIn_client(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder, ClientRepository $clientRepo, Stripe $stripeHelper): Response
    {
        $client = [];

        $data = json_decode($request->getContent(), true);
        $data = $data['values'];

        $hasClient = $clientRepo->findOneBy(['email' => $data['email']]);
        $token = null;
        $entityManager = $doctrine->getManager();
        if (!$hasClient) {
            $status = false;
            $message = 'Email non trouver';
        } else {
            if (!$passwordEncoder->isPasswordValid($hasClient, $data['password'])) {
                $status = false;
                $message = 'incorrect password';
            } else {
                $stripeHelper->createCustomer($hasClient, $entityManager);
                $token = $hasClient->getToken();
                $status = true;
                $message = "Authentification réussite";
                $ville="";
                if(in_array('ROLE_POINT_RELAIS', $hasClient->getRoles()))
                {
                    if(count($hasClient->getAdresses())>0)
                    {
                        $ville=$hasClient->getAdresses()[0]->getVille();
                    }
                }
                $client = [
                    'id' => $hasClient->getId(),
                    'firstName' => $hasClient->getFirstname(),
                    'lastName' => $hasClient->getLastname(),
                    'email' => $hasClient->getEmail(),
                    'gender' => $hasClient->getGender(),
                    'nationalite'=>$hasClient->getNationalite()??'',
                    'phone' => $hasClient->getPhone(),
                    'birdh' => date_format($hasClient->getBirdh(), 'd-m-Y'),
                    'photo' => $hasClient->getPhoto()??'',
                    'description' => $hasClient->getDescription()??'',
                    "token" => $token,
                    'stripeCustomerId' => $hasClient->getStripeCustomerId(),
                    'stripeAccount' => $hasClient->getStripeAccount() ?? '',
                     'numSiret' => $hasClient->getSiret() ?? '',
                'isPointRelais'=>in_array('ROLE_POINT_RELAIS', $hasClient->getRoles())?true:false,
                'nomEntreprise'=>$hasClient->getEntreprise()??'',
                'ville'=>$ville
                ];
            }
        }
        return $this->json(['status'=>$status,'message'=>$message,"token"=>$token,'client'=>$client]);
    }

    /**
     * @Route("/porteur", name="signIn_porteur", methods={"POST"})
     */
    public function signIn_porteur(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder, PorteurRepository $porteurRepo): Response
    {

        $data = json_decode($request->getContent(), true);
        $hasPorteur = $porteurRepo->findOneBy(['email' => $data['email']]);
        $token = null;
        if (!$hasPorteur) {
            $status = false;
            $message = 'Email non trouver';
        } else {
            if (!$passwordEncoder->isPasswordValid($hasPorteur, $data['password'])) {
                $status = false;
                $message = 'incorrect password';
            } else {
                $token = $hasPorteur->getToken();
                $status = true;
                $message = "Authentification réussite";
            }
        }
        return $this->json(['status' => $status, 'message' => $message, "token" => $token]);
    }

    /**
     * @Route("/all", name="porteur_all", methods={"GET"})
     */
    public function porteur_all(ManagerRegistry $doctrine, Request $request, UserPasswordHasherInterface $passwordEncoder): Response
    {
        return $this->json('Created new project successfully with id ');
    }

}