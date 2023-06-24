<?php

namespace App\Repository;

use App\Entity\Baggagite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Baggagite>
 *
 * @method Baggagite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Baggagite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Baggagite[]    findAll()
 * @method Baggagite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BaggagiteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Baggagite::class);
    }

    public function save(Baggagite $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Baggagite $entity, bool $flush = false): void
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


        $today=new \DateTime();
        $filter=[];
        $dimensionsLarg=0;
        if(isset($data['dimensionsLarg'])&&$data['dimensionsLarg']!="")
        {
            $filter['dimensionsLarg']=$data['dimensionsLarg'];
        }

        if(isset($data['dimensionsH'])&&$data['dimensionsH']!="")
        {
            $filter['dimensionsH']=$data['dimensionsH'];
        }

        if(isset($data['dimensionsLong'])&&$data['dimensionsLong']!="")
        {
           
            $filter['dimensionsLong']=$data['dimensionsLong'];
        }

        if(isset($data['dimensionsKg'])&&$data['dimensionsKg']!="")
        {
           
            $filter['dimensionsKg']=$data['dimensionsKg'];
        }
          $res=$this->createQueryBuilder('bagagiste');
          $res->leftJoin('bagagiste.dimension','dimension');
          if(isset($filter['dimensionsLarg']))
          {
            $res->andWhere('dimension.width >= :Larg')->setParameter('Larg',$filter['dimensionsLarg']);

          }

          if(isset($filter['dimensionsH']))
          {
            $res->andWhere('dimension.height >= :Height')->setParameter('Height',$filter['dimensionsH']);

          }

           if(isset($filter['dimensionsLong']))
          {
            $res->andWhere('dimension.length >= :Length')->setParameter('Length',$filter['dimensionsLong']);

          }

           if(isset($filter['dimensionsKg']))
          {
            $res->andWhere('dimension.weight >= :Kg')->setParameter('Kg',$filter['dimensionsKg']);

          }

            if(isset($filter['type_adresse_arrivee']))
          {
            if($filter['type_adresse_arrivee']!="")
            {
                 $res->andWhere('bagagiste.typeAdresseArrivee like :typeAdresseArrivee')->setParameter('typeAdresseArrivee','%'.$filter['type_adresse_arrivee'].'%');
            }

          }

          if(isset($data['type_adresse_depart']))
          {
            if($data['type_adresse_depart']!="")
            {
                 $res->andWhere('bagagiste.typeAdresseDepart like :typeAdressDepart')->setParameter('typeAdressDepart','%'.$data['type_adresse_depart'].'%');
            }

          }
           if(isset($data['objectTransport'])&&$data['objectTransport']!="")
          {
            if($data['objectTransport']!="")
            { 
                $orX = $res->expr()->orX();
    $i = 0;
    foreach ($data['objectTransport'] as $value) {
        $orX->add($res->expr()->like('bagagiste.objectTransport', ':objectTransport'.$i));
        $res->setParameter('objectTransport'.$i, '%'.($value).'%');
        $i++;
    }
    $res->andWhere($orX);
            }

          }

           if(isset($data['objectType']))
          {
            if($data['objectType']!="")
            {
                $orX = $res->expr()->orX();
    $i = 0;
    foreach ($data['objectType'] as $value) {
        $orX->add($res->expr()->like('bagagiste.objectType', ':objectType'.$i));
        $res->setParameter('objectType'.$i, '%'.($value).'%');
        $i++;
    }
    $res->andWhere($orX);
            }

          }

                 $res->andWhere('bagagiste.dateFrom > :dateFrom or (bagagiste.dateFrom=:dateFrom2 and bagagiste.timeFrom > :timeFrom)')->setParameter('dateFrom',$today->format('Y-m-d'))
->setParameter('dateFrom2',$today->format('Y-m-d'))
->setParameter('timeFrom',$today->format('H:i'))
                 ;


      $res->andWhere('bagagiste.status = :status')->setParameter('status',1);

   if ($data['lat_adresse_point_depart'] != 0 && $data['long_adresse_point_depart'] != 0) {
            if (isset($data['rayonAdressDep'])) {
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
                ->addSelect('GEO_DISTANCE(:lat_adresse_point_depart, :long_adresse_point_depart, bagagiste.lat_adresse_point_depart, bagagiste.long_adresse_point_depart) AS  distanceOne')
                ->having('distanceOne <= :rayonAdressDep')
                ->setParameter('rayonAdressDep', $rayonAdressDep??10)
                ->setParameter('lat_adresse_point_depart', $data['lat_adresse_point_depart'])
                ->setParameter('long_adresse_point_depart', $data['long_adresse_point_depart']);
  
          }
 
            $res=$res->orderBy('bagagiste.dateFrom', 'ASC')
            ->setFirstResult($firstResult)
            ->setMaxResults($pageSize)
            ->getQuery()
            ->getResult()
        ;
  
        return $res;
    }


    public function nbreByFilter($data)
    {
    $today=new \DateTime();
        $filter=[];
        $dimensionsLarg=0;
        if(isset($data['dimensionsLarg'])&&$data['dimensionsLarg']!="")
        {
            $filter['dimensionsLarg']=$data['dimensionsLarg'];
        }

        if(isset($data['dimensionsH'])&&$data['dimensionsH']!="")
        {
            $filter['dimensionsH']=$data['dimensionsH'];
        }

        if(isset($data['dimensionsLong'])&&$data['dimensionsLong']!="")
        {
           
            $filter['dimensionsLong']=$data['dimensionsLong'];
        }

        if(isset($data['dimensionsKg'])&&$data['dimensionsKg']!="")
        {
           
            $filter['dimensionsKg']=$data['dimensionsKg'];
        }
          $res=$this->createQueryBuilder('bagagiste');
          $res->leftJoin('bagagiste.dimension','dimension');
          if(isset($filter['dimensionsLarg']))
          {
            $res->andWhere('dimension.width >= :Larg')->setParameter('Larg',$filter['dimensionsLarg']);

          }

          if(isset($filter['dimensionsH']))
          {
            $res->andWhere('dimension.height >= :Height')->setParameter('Height',$filter['dimensionsH']);

          }

           if(isset($filter['dimensionsLong']))
          {
            $res->andWhere('dimension.length >= :Length')->setParameter('Length',$filter['dimensionsLong']);

          }

           if(isset($filter['dimensionsKg']))
          {
            $res->andWhere('dimension.weight >= :Kg')->setParameter('Kg',$filter['dimensionsKg']);

          }

            if(isset($filter['type_adresse_arrivee']))
          {
            if($filter['type_adresse_arrivee']!="")
            {
                 $res->andWhere('bagagiste.typeAdresseArrivee like :typeAdresseArrivee')->setParameter('typeAdresseArrivee','%'.$filter['type_adresse_arrivee'].'%');
            }

          }

          if(isset($data['type_adresse_depart']))
          {
            if($data['type_adresse_depart']!="")
            {
                 $res->andWhere('bagagiste.typeAdresseDepart like :typeAdressDepart')->setParameter('typeAdressDepart','%'.$data['type_adresse_depart'].'%');
            }

          }
           if(isset($data['objectTransport'])&&$data['objectTransport']!="")
          {
            if($data['objectTransport']!="")
            { 
                $orX = $res->expr()->orX();
    $i = 0;
    foreach ($data['objectTransport'] as $value) {
        $orX->add($res->expr()->like('bagagiste.objectTransport', ':objectTransport'.$i));
        $res->setParameter('objectTransport'.$i, '%'.($value).'%');
        $i++;
    }
    $res->andWhere($orX);
            }

          }

           if(isset($data['objectType']))
          {
            if($data['objectType']!="")
            {
                $orX = $res->expr()->orX();
    $i = 0;
    foreach ($data['objectType'] as $value) {
        $orX->add($res->expr()->like('bagagiste.objectType', ':objectType'.$i));
        $res->setParameter('objectType'.$i, '%'.($value).'%');
        $i++;
    }
    $res->andWhere($orX);
            }

          }

                 $res->andWhere('bagagiste.dateFrom > :dateFrom or (bagagiste.dateFrom=:dateFrom2 and bagagiste.timeFrom > :timeFrom)')->setParameter('dateFrom',$today->format('Y-m-d'))
->setParameter('dateFrom2',$today->format('Y-m-d'))
->setParameter('timeFrom',$today->format('H:i'))
                 ;


      $res->andWhere('bagagiste.status = :status')->setParameter('status',1);
 
   if ($data['lat_adresse_point_depart'] != 0 && $data['long_adresse_point_depart'] != 0) {
            if (isset($data['rayonAdressDep'])&&$data['rayonAdressDep']!="") {
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
                ->addSelect('GEO_DISTANCE(:lat_adresse_point_depart, :long_adresse_point_depart, bagagiste.lat_adresse_point_depart, bagagiste.long_adresse_point_depart) AS  distanceOne')

                ->having('distanceOne <= :rayonAdressDep ')
                ->setParameter('rayonAdressDep', $rayonAdressDep??10)
                ->setParameter('lat_adresse_point_depart', $data['lat_adresse_point_depart'])
                ->setParameter('long_adresse_point_depart', $data['long_adresse_point_depart']);
  
          }
 
            $res=$res->select('count(bagagiste.id)')
            ->getQuery()
            ->getSingleScalarResult()
        ;
 


        return $res;
    }

    public function numberof($start,$end)
    {
       return $this->createQueryBuilder('c')
            ->select('count(c.id)')
            ->andWhere('c.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getSingleScalarResult();
    }

     public function list($start,$end)
    {
       return $this->createQueryBuilder('c')
            ->andWhere('c.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getResult();
    }

//    /**
//     * @return Baggagite[] Returns an array of Baggagite objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('b.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Baggagite
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
