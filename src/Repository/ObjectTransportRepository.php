<?php

namespace App\Repository;

use App\Entity\ObjectTransport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ObjectTransport>
 *
 * @method ObjectTransport|null find($id, $lockMode = null, $lockVersion = null)
 * @method ObjectTransport|null findOneBy(array $criteria, array $orderBy = null)
 * @method ObjectTransport[]    findAll()
 * @method ObjectTransport[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ObjectTransportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ObjectTransport::class);
    }

    public function save(ObjectTransport $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ObjectTransport $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return ObjectTransport[] Returns an array of ObjectTransport objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ObjectTransport
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
