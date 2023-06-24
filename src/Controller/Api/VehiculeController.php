<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Client;
use App\Entity\Vehicule;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\ClientRepository;
use App\Repository\VehiculeRepository;


/**
 * @Route("/api/vehicule", name="api_")
 */
class VehiculeController extends AbstractController
{
    /**
     * @Route("/create", name="vehicule_add", methods={"POST"})
     */
    public function vehicule_add(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo,VehiculeRepository $vehiculeRepository): Response
    {

        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $entityManager = $doctrine->getManager();
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $voiture=$vehiculeRepository->findOneBy(['client'=>$hasClient]);
            $voiture =$voiture?$voiture: new Vehicule();
            $voiture->setName($data['name']);
            $voiture->setNomVehicule($data['nom_vehicule']);
            if (isset($data['photo'])) {
                $voiture->setPhoto($data['photo']);
            }
            $voiture->setClient($hasClient);
            $entityManager->persist($voiture);
            $entityManager->flush();

            $status = true;
            $message = 'Votre photo a été pris en compte';
        }

        return $this->json(['status' => $status, 'message' => $message]);

    }


    /**
     * @Route("/list", name="vehicule_list", methods={"POST"})
     */
    public function list(Request $request, ClientRepository $clientRepo,VehiculeRepository $vehiculeRepository): Response
    {
        $data = json_decode($request->getContent(), true);
        $hasClient = $clientRepo->findOneBy(['token' => $data['token']]);
        $vehicules = [
                        'uid' =>'',
                       // 'name' => $vehicule->getName(),
                        'status' => '',
                        'url' => '',
                        'nom_vehicule'=>''
                    ];
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {
            $voiture=$vehiculeRepository->findOneBy(['client'=>$hasClient]);
            if ($voiture) {
                    $vehicules = [
                        'uid' => $voiture->getId(),
                       // 'name' => $vehicule->getName(),
                        'status' => 'done',
                        'url' => $voiture->getPhoto(),
                        'nom_vehicule'=>$voiture->getNomVehicule()??''
                    ];
                
            }
            $status = true;
            $message = 'Liste des véhicules';
        }

        return $this->json(['status' => $status, 'message' => $message, 'vehicules' => $vehicules]);
    }

    /**
     * @Route("/delete", name="vehicule_delete", methods={"GET"})
     */
    public function vehicule_delete(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, VehiculeRepository $vehiculeRepository): Response
    {

        $hasClient = $clientRepo->findOneBy(['token' => $_GET['token']]);
        if (!$hasClient) {
            $status = false;
            $message = 'Vous devez vous connecter';
        } else {

            $status = true;
            $message = 'véhicule a été retirer de votre liste';
            $entityManager = $doctrine->getManager();
            $vehicule = $vehiculeRepository->find($_GET['uid']);
            $entityManager->remove($vehicule);
            $entityManager->flush();

        }
        return $this->json(['status' => $status, 'message' => $message]);
    }

}
