<?php

namespace App\Service;
class HelperApi
{

    function reformdataadvert($advertQuerys)
    {
        $tab = [];

        foreach ($advertQuerys as $key => $advertQuery) {

            $gallery = [];
            $priceRelaisDepart = 0;
            $priceRelaisArriv = 0;
            $advert = $advertQuery->getAdvert();

            if ($advert) {


                if (count($advert->getImages()) > 0) {

                    foreach ($advert->getImages() as $key => $doc) {
                        $gallery[] = [
                            'id' => $doc->getId(),
                            'url' => $doc->getUrl(),
                            'uid' => $doc->getId(),
                            'status' => 'done'
                        ];
                    }
                }

                $client = [
                    'id' => $advert->getClient()->getId(),
                    'firstName' => $advert->getClient()->getFirstname(),
                    'lastName' => $advert->getClient()->getLastname(),
                    'email' => $advert->getClient()->getEmail(),
                    'phone' => $advert->getClient()->getPhone(),
                    'photo' => $advert->getClient()->getPhoto() ?? '',
                ];

                $proprietaire = [
                    'firstName' => $advertQuery->getAdvert()->getClient()->getFirstname(),
                    'photo' => $advertQuery->getAdvert()->getClient()->getPhoto() ?? '',
                    'tags' => 0
                ];


                $porteur = [
                    'firstName' => $advertQuery->getClient()->getFirstname(),
                    'photo' => $advertQuery->getClient()->getPhoto() ?? '',
                    'tags' => 0
                ];

                $object = [
                    'proprietaire' => $proprietaire,
                    'porteur' => $porteur,
                    'gallery' => $gallery,
                    'ville_depart' => $advertQuery->getFromAdress(),
                    'objectRelaisDepart' => $advertQuery->getobjectRelaisDepart(),
                    'objectRelaisArriv' => $advertQuery->getobjectRelaisArriv(),
                    'ville_arrivee' => $advertQuery->getToAdress(),
                    'dateDepart' => date_format($advertQuery->getDateFrom(), 'd-m-Y'),
                    'heureDepart' => date_format($advertQuery->getTimeFrom(), 'H:i'),
                    'dateArrivee' => date_format($advertQuery->getDateTo(), 'd-m-Y'),
                    'heureArrivee' => date_format($advertQuery->getTimeTo(), 'H:i'),
                    'status' => $advertQuery->getStatus(),
                    'isValid' => $advertQuery->getIsValid(),
                    'isPaied' => $advertQuery->getIsPaied(),
                    'dimensionsLarg' => $advertQuery->getWidth(),
                    'dimensionsH' => $advertQuery->getHeight(),
                    'dimensionsLong' => $advertQuery->getLength(),
                    'dimensionsKg' => $advertQuery->getWeight(),
                    'type_adresse_arrivee' => $advertQuery->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $advertQuery->getTypeAdressDepart(),
                    'objectType' => $advertQuery->getObjectType(),
                    'objectTransport' => $advertQuery->getObjectTransport(),
                    'price' => 0
                ];


                

                $founddepart = false;
                $foundarriv = false;
                foreach ($advertQuery->getObjectRelaisDepart() as $key => $value) {
                    if (isset($value['checked'])) {
                        if ($value['checked'] && $value['isRelais']) {
                            $price = $value['price'];
                                                $object['price'] = $price / 2;

 if(strpos($value['name'], 'mutuel') !== FALSE)
                             {

                            $founddepart = true;

                             }



                        }
                    }

                }

                foreach ($advertQuery->getObjectRelaisArriv() as $key => $value) {
                    if (isset($value['checked'])) {
                        if ($value['checked'] && $value['isRelais']) {
                            $price = $value['price'];
                    $object['price'] = $price / 2;
                             if(strpos($value['name'], 'mutuel') !== FALSE)
                             {

                                 $foundarriv = true;

                             }

                        }
                    }

                }

                if ($foundarriv || $founddepart) {
                    $object['price'] = $price / 2;
                    $tab['mutuel'][] = $object;

                }

if(!$foundarriv&&!$founddepart)
                    {
                    if (strtotime(date_format($advertQuery->getDateFrom(), 'd-m-Y')) >= strtotime(date_format(new \DateTime(), 'd-m-Y'))) {
                        


                        $tab['avenir'][] = $object;
                    } else {
                        $tab['passe'][] = $object;

                    }
                }



            }

        }

        return $tab;


    }

    function reformdataBag($bagQuerys)
    {
        $tabbag = [];

        foreach ($bagQuerys as $key => $bagQuery) {

            $gallery = [];
            $priceRelaisDepart = 0;
            $priceRelaisArriv = 0;
            $bagagiste = $bagQuery->getBaggagite();

            if ($bagagiste) {


                if (count($bagQuery->getPhotos()) > 0) {

                    foreach ($bagQuery->getPhotos() as $key => $doc) {
                        $gallery[] = [
                            'id' => $doc->getId(),
                            'url' => $doc->getUrl(),
                            'uid' => $doc->getId(),
                            'status' => 'done'
                        ];
                    }
                }

                $client = [
                    'id' => $bagagiste->getClient()->getId(),
                    'firstName' => $bagagiste->getClient()->getFirstname(),
                    'lastName' => $bagagiste->getClient()->getLastname(),
                    'email' => $bagagiste->getClient()->getEmail(),
                    'phone' => $bagagiste->getClient()->getPhone(),
                    'photo' => $bagagiste->getClient()->getPhoto() ?? '',
                ];

                $proprietaire = [
                    'firstName' => $bagQuery->getClient()->getFirstname(),
                    'photo' => $bagQuery->getClient()->getPhoto() ?? '',
                    'tags' => 0
                ];


                $porteur = [
                    'firstName' => $bagQuery->getBaggagite()->getClient()->getFirstname(),
                    'photo' => $bagQuery->getBaggagite()->getClient()->getPhoto() ?? '',
                    'tags' => 0
                ];

                $object = [
                    'proprietaire' => $proprietaire,
                    'porteur' => $porteur,
                    'gallery' => $gallery,
                    'ville_depart' => $bagQuery->getAdressFrom(),
                    'ville_arrivee' => $bagQuery->getAdressTo(),
                    'dateDepart' => date_format($bagQuery->getDateFrom(), 'd-m-Y'),
                    'heureDepart' => date_format($bagQuery->getTimeFrom(), 'H:i'),
                    'dateArrivee' => date_format($bagQuery->getDateTo(), 'd-m-Y'),
                    'heureArrivee' => date_format($bagQuery->getTimeTo(), 'H:i'),
                    'status' => $bagQuery->getStatus(),
                    'isPaied' => $bagQuery->getIsPaied(),
                    'isValid' => $bagQuery->getIsValid(),
                    'dimensionsLarg' => $bagQuery->getWidth(),
                    'objectPriceSetting' => $bagQuery->getObjectPriceSetting(),
                    'dimensionsH' => $bagQuery->getHeight(),
                    'dimensionsLong' => $bagQuery->getLength(),
                    'dimensionsKg' => $bagQuery->getWeight(),
                    'type_adresse_arrivee' => $bagQuery->getTypeAdresseArrivee(),
                    'type_adresse_depart' => $bagQuery->getTypeAdresseDepart(),
                    'objectType' => $bagQuery->getObjectType(),
                    'objectTransport' => $bagQuery->getObjectTransport(),
                    'price' => 0
                ];


                


                $founddepart = false;

                foreach ($bagQuery->getObjectPriceSetting() as $key => $value) {
                    if (isset($value['checked'])) {
                        if ($value['checked'] && $value['isRelais']) {
                            $price = $value['price'];
                    $object['price'] = $price / 2;

                            if(strpos($value['name'], 'mutuel') !== FALSE)
                            {

                                $founddepart = true;



                            }


                        }
                    }

                }


                if ($founddepart) {
                    $object['price'] = $price / 2;
                    $tabbag['mutuel'][] = $object;

                }

                if(!$founddepart)
                {
                     if (strtotime(date_format($bagQuery->getDateFrom(), 'd-m-Y')) >= strtotime(date_format(new \DateTime(), 'd-m-Y'))) {

                    $tabbag['avenir'][] = $object;
                } else {

                    $tabbag['passe'][] = $object;

                }
                }


               


            }


        }


        return $tabbag;


    }
}