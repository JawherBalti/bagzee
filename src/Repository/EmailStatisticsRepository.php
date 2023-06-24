<?php

namespace App\Repository;

use App\Entity\EmailStatistics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<EmailStatistics>
 *
 * @method EmailStatistics|null find($id, $lockMode = null, $lockVersion = null)
 * @method EmailStatistics|null findOneBy(array $criteria, array $orderBy = null)
 * @method EmailStatistics[]    findAll()
 * @method EmailStatistics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EmailStatisticsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, EmailStatistics::class);
    }
    public function getEmailByDATE($type,$start,$end)
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
    public function save(EmailStatistics $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(EmailStatistics $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return EmailStatistics[] Returns an array of EmailStatistics objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('e.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?EmailStatistics
//    {
//        return $this->createQueryBuilder('e')
//            ->andWhere('e.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
