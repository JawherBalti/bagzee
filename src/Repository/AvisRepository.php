<?php

namespace App\Repository;

use App\Entity\Avis;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Avis>
 *
 * @method Avis|null find($id, $lockMode = null, $lockVersion = null)
 * @method Avis|null findOneBy(array $criteria, array $orderBy = null)
 * @method Avis[]    findAll()
 * @method Avis[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AvisRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Avis::class);
    }

    public function save(Avis $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Avis $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return Avis[] Returns an array of Avis objects
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

//    public function findOneBySomeField($value): ?Avis
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

//avis baggagiste
    public function nbre($tabIdBaggagiste)
    {
        return $this->createQueryBuilder('a')
            ->select('avg(a.etatBagage) as etatBagage','avg(a.respectSecurite) as respectSecurite','avg(a.ponctualite) as ponctualite','avg(a.courtoisie) as courtoisie','count(a.id) as nbrAvis')
            ->andWhere('a.baggagist IN (:val)')
            ->setParameter('val', $tabIdBaggagiste)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }


      public function nbreClientnoted($clientNoted)
    {
        return $this->createQueryBuilder('a')
            ->select('avg(a.etatBagage) as etatBagage','avg(a.respectSecurite) as respectSecurite','avg(a.ponctualite) as ponctualite','avg(a.courtoisie) as courtoisie','count(a.id) as nbrAvis')
            ->andWhere('a.clientNoted = :val')
            ->setParameter('val', $clientNoted)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }




//avis baggagiste
    public function nbreavisbyClient($client)
    {
        return $this->createQueryBuilder('a')
            ->select('avg(a.etatBagage) as etatBagage','avg(a.respectSecurite) as respectSecurite','avg(a.ponctualite) as ponctualite','avg(a.courtoisie) as courtoisie','count(a.id) as nbrAvis')
            ->andWhere('a.client = :val')
            ->setParameter('val', $client)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    //avis adveert
  public function nbreAdvert($tabIdadvert)
    {
        return $this->createQueryBuilder('a')
            ->select('avg(a.etatBagage) as etatBagage','avg(a.respectSecurite) as respectSecurite','avg(a.ponctualite) as ponctualite','avg(a.courtoisie) as courtoisie','count(a.id) as nbrAvis')
            ->andWhere('a.advert IN (:val)')
            ->setParameter('val', $tabIdadvert)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    public function listAdvertByNotClient($advert,$client)
    {
         return $this->createQueryBuilder('a')
            ->leftJoin('a.advert','advert')
            ->leftJoin('a.client','client')
            ->andWhere('advert=:advert')
            ->andWhere('client!=:client')
            ->setParameter('advert', $advert)
            ->setParameter('client', $client)
            ->getQuery()
            ->getResult();
    }

}
