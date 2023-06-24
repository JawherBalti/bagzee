<?php

namespace App\Repository;

use App\Entity\SmsStatistics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method SmsStatistics|null find($id, $lockMode = null, $lockVersion = null)
 * @method SmsStatistics|null findOneBy(array $criteria, array $orderBy = null)
 * @method SmsStatistics[]    findAll()
 * @method SmsStatistics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SmsStatisticsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SmsStatistics::class);
    }

    // /**
    //  * @return SmsStatistics[] Returns an array of SmsStatistics objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?SmsStatistics
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    public function getSms($type,$start,$end)
    {
        return $this->createQueryBuilder('o')
            ->andWhere('o.createdAt between :start and :end')
            ->andWhere('o.type= :type')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->setParameter('type', $type)
            ->orderBy('o.id', 'desc')
            ->getQuery()
            ->getResult()
            ;
    }
}
