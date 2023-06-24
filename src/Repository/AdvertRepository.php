<?php

namespace App\Repository;

use App\Entity\Advert;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Advert>
 *
 * @method Advert|null find($id, $lockMode = null, $lockVersion = null)
 * @method Advert|null findOneBy(array $criteria, array $orderBy = null)
 * @method Advert[]    findAll()
 * @method Advert[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AdvertRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Advert::class);
    }

    public function save(Advert $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Advert $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function byFilter($data)
    {
        $pageSize = 10;
        $page=0;
        if(isset($data['page']))
        {
            $page=$data['page'];
        }
        if($page==0){$page=1;}
        $firstResult = ($page - 1) * $pageSize;

        $today = new \DateTime();
        $filter = [];
        $dimensionsLarg = 0;
        if (isset($data['dimensionsLarg'])) {
            $filter['dimensionsLarg'] = $data['dimensionsLarg'];
        }

        if (isset($data['dimensionsH'])) {
            $filter['dimensionsH'] = $data['dimensionsH'];
        }

        if (isset($data['dimensionsLong'])) {

            $filter['dimensionsLong'] = $data['dimensionsLong'];
        }

        if (isset($data['dimensionsKg'])) {

            $filter['dimensionsKg'] = $data['dimensionsKg'];
        }
        $res = $this->createQueryBuilder('advert');
        $res->leftJoin('advert.dimension', 'dimension');
        if (isset($filter['dimensionsLarg'])) {
            $res->andWhere('dimension.width >= :Larg')->setParameter('Larg', $filter['dimensionsLarg']);

        }

        if (isset($filter['dimensionsH'])) {
            $res->andWhere('dimension.height >= :Height')->setParameter('Height', $filter['dimensionsH']);

        }

        if (isset($filter['dimensionsLong'])) {
            $res->andWhere('dimension.length >= :Length')->setParameter('Length', $filter['dimensionsLong']);

        }

        if (isset($filter['dimensionsKg'])) {
            $res->andWhere('dimension.weight >= :Kg')->setParameter('Kg', $filter['dimensionsKg']);

        }

        if (isset($filter['type_adresse_arrivee'])) {
            if ($filter['type_adresse_arrivee'] != "") {
                $res->andWhere('advert.typeAdresseArrivee like :typeAdresseArrivee')->setParameter('typeAdresseArrivee', '%' . $filter['type_adresse_arrivee'] . '%');
            }

        }

        if (isset($filter['type_adresse_depart'])) {
            if ($filter['type_adresse_depart'] != "") {
                $res->andWhere('advert.typeAdressDepart like :typeAdressDepart')->setParameter('typeAdressDepart', '%' . $filter['type_adresse_depart'] . '%');
            }

        }
        if (isset($data['objectTransport'])) {
            if ($data['objectTransport'] != "") {
                $orX = $res->expr()->orX();
                $i = 0;
                foreach ($data['objectTransport'] as $value) {
                    $orX->add($res->expr()->like('advert.objectTransport', ':objectTransport' . $i));
                    $res->setParameter('objectTransport' . $i, '%' . ($value) . '%');
                    $i++;
                }
                $res->andWhere($orX);
            }

        }

        if (isset($data['objectType'])) {
            if ($data['objectType'] != "") {
                $orX = $res->expr()->orX();
                $i = 0;
                foreach ($data['objectType'] as $value) {
                    $orX->add($res->expr()->like('advert.objectType', ':objectType' . $i));
                    $res->setParameter('objectType' . $i, '%' . ($value) . '%');
                    $i++;
                }
                $res->andWhere($orX);
            }

        }


        if (isset($data['dateDepart'])&&$data['dateDepart']!="") {
            $date = new \DateTime($data['dateDepart']);
            if($date<$today)
                $date=$today;
        } else {
            $date = $today;

        }
         $date->setTime(0, 0);
        $res->andWhere('advert.dateFrom > :dateFrom or (advert.dateFrom=:dateFrom2 and advert.timeFrom > :timeFrom)')->setParameter('dateFrom', $date->format('Y-m-d'))
            ->setParameter('dateFrom2', $date->format('Y-m-d'))
            ->setParameter('timeFrom', $date->format('H:i'));

        $res->andWhere('advert.status = :status')->setParameter('status', 1);
 

        //by lat long

        if ($data['lat_adresse_point_depart'] != 0 && $data['long_adresse_point_depart'] != 0) {
            if (isset($data['rayonAdressDep'])&&$data['rayonAdressDep']) {
                $rayonAdressDep = intval($data['rayonAdressDep']);
            } else {
                $rayonAdressDep = 0;
            }
            if($rayonAdressDep==0||$rayonAdressDep==20)
            {
              $sup='>=';
            }
            else
            {
               $sup='<=';

            }

            $res
                ->addSelect('GEO_DISTANCE(:lat_adresse_point_depart, :long_adresse_point_depart, advert.lat_adresse_point_depart, advert.long_adresse_point_depart) AS  distanceOne')
                ->having('distanceOne <= :rayonAdressDep')
                ->setParameter('rayonAdressDep', $rayonAdressDep??10)
                ->setParameter('lat_adresse_point_depart', $data['lat_adresse_point_depart'])
                ->setParameter('long_adresse_point_depart', $data['long_adresse_point_depart']);
  
          }


        $res = $res->orderBy('advert.dateFrom', 'ASC')
         ->setFirstResult($firstResult)
            ->setMaxResults($pageSize)
            ->getQuery()
            ->getResult();
 
        return $res;
    }



    public function nbreByFilter($data)
    {
       $today = new \DateTime();
        $filter = [];
        $dimensionsLarg = 0;
        if (isset($data['dimensionsLarg'])) {
            $filter['dimensionsLarg'] = $data['dimensionsLarg'];
        }

        if (isset($data['dimensionsH'])) {
            $filter['dimensionsH'] = $data['dimensionsH'];
        }

        if (isset($data['dimensionsLong'])) {

            $filter['dimensionsLong'] = $data['dimensionsLong'];
        }

        if (isset($data['dimensionsKg'])) {

            $filter['dimensionsKg'] = $data['dimensionsKg'];
        }
        $res = $this->createQueryBuilder('advert');
        $res->leftJoin('advert.dimension', 'dimension');
        if (isset($filter['dimensionsLarg'])) {
            $res->andWhere('dimension.width >= :Larg')->setParameter('Larg', $filter['dimensionsLarg']);

        }

        if (isset($filter['dimensionsH'])) {
            $res->andWhere('dimension.height >= :Height')->setParameter('Height', $filter['dimensionsH']);

        }

        if (isset($filter['dimensionsLong'])) {
            $res->andWhere('dimension.length >= :Length')->setParameter('Length', $filter['dimensionsLong']);

        }

        if (isset($filter['dimensionsKg'])) {
            $res->andWhere('dimension.weight >= :Kg')->setParameter('Kg', $filter['dimensionsKg']);

        }

        if (isset($filter['type_adresse_arrivee'])) {
            if ($filter['type_adresse_arrivee'] != "") {
                $res->andWhere('advert.typeAdresseArrivee like :typeAdresseArrivee')->setParameter('typeAdresseArrivee', '%' . $filter['type_adresse_arrivee'] . '%');
            }

        }

        if (isset($filter['type_adresse_depart'])) {
            if ($filter['type_adresse_depart'] != "") {
                $res->andWhere('advert.typeAdressDepart like :typeAdressDepart')->setParameter('typeAdressDepart', '%' . $filter['type_adresse_depart'] . '%');
            }

        }
        if (isset($data['objectTransport'])) {
            if ($data['objectTransport'] != "") {
                $orX = $res->expr()->orX();
                $i = 0;
                foreach ($data['objectTransport'] as $value) {
                    $orX->add($res->expr()->like('advert.objectTransport', ':objectTransport' . $i));
                    $res->setParameter('objectTransport' . $i, '%' . ($value) . '%');
                    $i++;
                }
                $res->andWhere($orX);
            }

        }

        if (isset($data['objectType'])) {
            if ($data['objectType'] != "") {
                $orX = $res->expr()->orX();
                $i = 0;
                foreach ($data['objectType'] as $value) {
                    $orX->add($res->expr()->like('advert.objectType', ':objectType' . $i));
                    $res->setParameter('objectType' . $i, '%' . ($value) . '%');
                    $i++;
                }
                $res->andWhere($orX);
            }

        }


        if (isset($data['dateDepart'])&&$data['dateDepart']!="") {
            $date = new \DateTime($data['dateDepart']);
            $date->setTime(0, 0);
        } else {
            $date = $today;
        }
        $res->andWhere('advert.dateFrom > :dateFrom or (advert.dateFrom=:dateFrom2 and advert.timeFrom > :timeFrom)')->setParameter('dateFrom', $date->format('Y-m-d'))
            ->setParameter('dateFrom2', $date->format('Y-m-d'))
            ->setParameter('timeFrom', $date->format('H:i'));

        $res->andWhere('advert.status = :status')->setParameter('status', 1);
 

        //by lat long

        if ($data['lat_adresse_point_depart'] != 0 && $data['long_adresse_point_depart'] != 0) {
            if (isset($data['rayonAdressDep'])&&$data['rayonAdressDep']) {
                $rayonAdressDep = intval($data['rayonAdressDep']);
            } else {
                $rayonAdressDep = 0;
            }
            if($rayonAdressDep==0||$rayonAdressDep==20)
            {
              $sup='>=';
            }
            else
            {
               $sup='<=';

            }
 
            $res
                ->addSelect('GEO_DISTANCE(:lat_adresse_point_depart, :long_adresse_point_depart, advert.lat_adresse_point_depart, advert.long_adresse_point_depart) AS  distanceOne')
                ->having('distanceOne <= :rayonAdressDep')
                ->setParameter('rayonAdressDep', $rayonAdressDep??10)
                ->setParameter('lat_adresse_point_depart', $data['lat_adresse_point_depart'])
                ->setParameter('long_adresse_point_depart', $data['long_adresse_point_depart']);
  
          }
 
 
          

        $res = $res->select('count(advert.id)')
            ->getQuery()
            ->getSingleScalarResult();
 
        return $res;
    }

    public function numberof($start, $end)
    {
        return $this->createQueryBuilder('c')
            ->select('count(c.id)')
            ->andWhere('c.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getSingleScalarResult();
    }

     public function list($start, $end)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getResult();
    }

    public function bydate($start,$end,$client)
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.client','client')
            ->andWhere('c.createdAt between :start and :end')
            ->andWhere('client.id =: cl')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->setParameter('cl', $client->getId())
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Advert[] Returns an array of Advert objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Advert
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
