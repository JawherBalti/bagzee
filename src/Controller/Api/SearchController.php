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
use App\Repository\AdvertRepository;
use App\Repository\AvisRepository;
use App\Repository\FavorisRepository;
use App\Repository\BaggagiteRepository;

/**
 * @Route("/api/search", name="api_")
 */
class SearchController extends AbstractController
{
    /**
     * @Route("/list", name="search_list", methods={"POST"})
     */
    public function search_list(ManagerRegistry $doctrine, Request $request, ClientRepository $clientRepo, AdvertRepository $advertRepo, AvisRepository $avisRepository, BaggagiteRepository $baggagiteRepository,FavorisRepository $favorisRepository): Response
    {
        $tabAdvert = [];
        $gallery = [];
        $hasClient=null;
        $data = json_decode($request->getContent(), true);
        if(isset($data['token']))
       $hasClient=$clientRepo->findOneBy(['token'=>$data['token']]);
        /* if(!$hasClient)
       {
           $status=false;
           $message='Vous devez vous connecter';
       }
       else
       {*/
        $status = true;
        $objectClient = [];
        $message = 'Liste des adverts';
        if ($data['type'] == 1) {
            $annonces = $baggagiteRepository->byFilter($data);
            $nbre = $baggagiteRepository->nbreByFilter($data);
        } else {
            $annonces = $advertRepo->byFilter($data);

            $nbre = $advertRepo->nbreByFilter($data);
        }

        $valueInt = intval($nbre / 10);
        $floatValue = $nbre / 10 - $valueInt;
        if ($floatValue > 0.1) {
            $lastPage = $valueInt + 1;
        } else {
            $lastPage = $valueInt;

        }

 
        if ($annonces) {
            foreach ($annonces as $key => $annonce) {
                 $isfavoris=false;
                if (!is_null($annonce->getClient())) {
                    $objectClient = [
                        'id' => $annonce->getClient()->getId(),
                        'firstName' => $annonce->getClient()->getFirstname(),
                        'lastName' => $annonce->getClient()->getLastname(),
                        'email' => $annonce->getClient()->getEmail(),
                        'gender' => $annonce->getClient()->getGender(),
                        'phone' => $annonce->getClient()->getPhone(),
                        'birdh' => date_format($annonce->getClient()->getBirdh(), 'd-m-Y'),
                        'priceNet' => ($data['type'] == 2) ? $annonce->getPriceNet() : 30,
                        //'setting_price' =>$annonce->getSettingPrice() ?$annonce->getSettingPrice():[],
                        'photo' => $annonce->getClient()->getPhoto() ?? '',
                        'stripeCustomerId' => $annonce->getClient()->getStripeCustomerId(),
                        'stripeAccount' => $annonce->getClient()->getStripeAccount() ?? ''
                    ];
                }
                if ($data['type'] == 1) {
                    if($hasClient)
                   $isfavoris= $favorisRepository->findOneBy(['client'=>$hasClient,'baggagist'=>$annonce])?true:false;
                    $avis = $avisRepository->nbreClientnoted([$annonce->getClient()->getId()]);
                    $listeContenu = [];

                } else {
                    $listeContenu = $annonce->getObjectContenu();
    if($hasClient)
                   $isfavoris= $favorisRepository->findOneBy(['client'=>$hasClient,'advert'=>$annonce])?true:false;
                    $avis = $avisRepository->nbreClientnoted([$annonce->getClient()->getId()]);
                    $galleries = $annonce->getImages();
                    $gallery = [];
                    if (count($galleries) > 0) {
                        foreach ($galleries as $key => $gallerie) {
                            $gallery[] = [
                                'id' => $gallerie->getId(),
                                'url' => $gallerie->getUrl(),
                                'uid' => $gallerie->getId(),
                                'status' => 'done'
                            ];
                        }
                    }

                }


                if (strtotime(date_format($annonce->getDateFrom(), 'd-m-Y') . ' ' . date_format($annonce->getTimeFrom(), 'H:i')) >= strtotime(date_format(new \DateTime(), 'd-m-Y H:i'))) {
                    $tabAdvert[] = [
                        'id' => $annonce->getId(),
                        'status' => $annonce->getStatus(),
                        'dimensionsLarg' => $annonce->getDimension()->getWidth(),
                        'dimensionsH' => $annonce->getDimension()->getHeight(),
                        'dimensionsLong' => $annonce->getDimension()->getLength(),
                        'dimensionsKg' => $annonce->getDimension()->getWeight(),
                        'ville_depart' => ($data['type'] == 2) ? $annonce->getFromAdress() : $annonce->getAdressFrom(),
                        'ville_arrivee' => ($data['type'] == 2) ? $annonce->getToAdress() : $annonce->getAdressTo(),
                        'description' => ($data['type'] == 2) ? $annonce->getDescription() : '',
                        'objectType' => implode(",", $annonce->getObjectType()),
                        'objectTransport' => implode(",", $annonce->getObjectTransport()),
                        'objectRelaisDepart' => ($data['type'] == 2) ? $annonce->getobjectRelaisDepart() : [],
                        'objectRelaisArriv' => ($data['type'] == 2) ? $annonce->getobjectRelaisArriv() : [],
                        'dateDepart' => date_format($annonce->getDateFrom(), 'd-m-Y'),
                        'dateArrivee' => date_format($annonce->getDateTo(), 'd-m-Y'),
                        'heureDepart' => date_format($annonce->getTimeFrom(), 'H:i'),
                        'heureArrivee' => date_format($annonce->getTimeTo(), 'H:i'),
                        'listeContenu' => $listeContenu,
                        'infoAvis' => [
                            'nbrAvis' => floatval($avis['nbrAvis']),
                            'total' => number_format(($avis['etatBagage'] + $avis['respectSecurite'] + $avis['ponctualite'] + $avis['courtoisie']) / 4,1)
                        ],
                        'price' => ($data['type'] == 2) ? $annonce->getPrice() : '',
                        'priceNet' => ($data['type'] == 2) ? $annonce->getPriceNet() : '',
                        'type_adresse_arrivee' => $annonce->getTypeAdresseArrivee(),
                        'type_adresse_depart' => ($data['type'] == 2) ? $annonce->getTypeAdressDepart() : $annonce->getTypeAdresseDepart(),
                        'client' => $objectClient,
                        'commentaire' => ($data['type'] == 1) ? $annonce->getCommentaire() : '',
                        'contenuRefuse' => ($data['type'] == 1) ? $annonce->getContenuRefuse() : '',
                        'isFavoris' => $isfavoris,
                        'gallery' => $gallery
                    ];
                }


            }
        }

        //}
        return $this->json(['status' => $status, 'message' => $message, 'annonces' => $tabAdvert, 'lastPage' => $lastPage]);

    }

}
