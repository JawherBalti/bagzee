<?php

namespace App\Repository;

use App\Entity\CodePromosSubscription;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method CodePromosSubscription|null find($id, $lockMode = null, $lockVersion = null)
 * @method CodePromosSubscription|null findOneBy(array $criteria, array $orderBy = null)
 * @method CodePromosSubscription[]    findAll()
 * @method CodePromosSubscription[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CodePromosSubscriptionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, CodePromosSubscription::class);
    }

    // /**
    //  * @return CodePromosSubscription[] Returns an array of CodePromosSubscription objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?CodePromosSubscription
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

     public function betwenDate($codePromos)
    {
        $date=new \DateTime();
        return $this->createQueryBuilder('s')
            ->andWhere('s.name= :codePromos')
            ->andWhere(':date between s.start and s.end')
            ->andWhere('s.qte>=1')
            ->setParameter('codePromos', $codePromos)
            ->setParameter('date', $date->format('Y-m-d'))
            ->getQuery()
            ->getOneOrNullResult()
            ;
    }
}
