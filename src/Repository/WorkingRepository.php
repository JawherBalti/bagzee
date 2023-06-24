<?php

namespace App\Repository;

use App\Entity\Working;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Working>
 *
 * @method Working|null find($id, $lockMode = null, $lockVersion = null)
 * @method Working|null findOneBy(array $criteria, array $orderBy = null)
 * @method Working[]    findAll()
 * @method Working[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class WorkingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Working::class);
    }

    public function save(Working $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Working $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function listWeekSelected($client)
    {
        return $this->createQueryBuilder('w')
        ->leftJoin('w.client','cl')
        ->select('w.week')
        ->distinct('w.week')
            ->andWhere('cl.id = :idclient')
            ->setParameter('idclient', $client->getId())
            ->getQuery()
            ->getArrayResult()
        ;
    }

//    /**
//     * @return Working[] Returns an array of Working objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('w.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Working
//    {
//        return $this->createQueryBuilder('w')
//            ->andWhere('w.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
