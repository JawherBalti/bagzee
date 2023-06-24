<?php

namespace App\Repository;

use App\Entity\AdvertQuery;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AdvertQuery>
 *
 * @method AdvertQuery|null find($id, $lockMode = null, $lockVersion = null)
 * @method AdvertQuery|null findOneBy(array $criteria, array $orderBy = null)
 * @method AdvertQuery[]    findAll()
 * @method AdvertQuery[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AdvertQueryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AdvertQuery::class);
    }

    public function save(AdvertQuery $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AdvertQuery $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return AdvertQuery[] Returns an array of AdvertQuery objects
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

//    public function findOneBySomeField($value): ?AdvertQuery
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }




    public function byPointRelaisDepartArrivee($client,$status)
    {
        return $this->createQueryBuilder('c')
            //->andWhere('c.status= :status')
            ->andWhere('(c.point_relais_depart is not null and c.point_relais_depart=:client) OR (c.point_relais_arrivee is not null and c.point_relais_arrivee=:client)')
            //->setParameter('status', $status)
            ->setParameter('client', $client)
            ->getQuery()
            ->getResult();
    }

     public function numberof($start,$end)
    {
       return $this->createQueryBuilder('c')
            ->leftJoin('c.client','clientQuery')
            ->leftJoin('c.advert','advert')
            ->leftJoin('advert.client','client')
            ->select('count(c.id)')
            ->andWhere('c.createdAt between :start and :end')
            ->andWhere('clientQuery!=client')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function byAdvert($id)
    {
     return $this->createQueryBuilder('c')
            ->leftJoin('c.advert','advert')
            ->andWhere('advert.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getResult();   
    }

     public function bydatewithPointrelais($start,$end,$client)
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.client','client')
            ->andWhere('c.createdAt between :start and :end')
            ->andWhere('c.point_relais_depart is not null or c.point_relais_arrivee is not null')
            ->andWhere('client.id =:cl')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->setParameter('cl', $client->getId())
            ->getQuery()
            ->getResult();
    }
}
