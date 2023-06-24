<?php

namespace App\Repository;

use App\Entity\PolitiqueConfidentialite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PolitiqueConfidentialite>
 *
 * @method PolitiqueConfidentialite|null find($id, $lockMode = null, $lockVersion = null)
 * @method PolitiqueConfidentialite|null findOneBy(array $criteria, array $orderBy = null)
 * @method PolitiqueConfidentialite[]    findAll()
 * @method PolitiqueConfidentialite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PolitiqueConfidentialiteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PolitiqueConfidentialite::class);
    }

    public function save(PolitiqueConfidentialite $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PolitiqueConfidentialite $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return PolitiqueConfidentialite[] Returns an array of PolitiqueConfidentialite objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?PolitiqueConfidentialite
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
