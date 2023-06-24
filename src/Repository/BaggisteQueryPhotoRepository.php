<?php

namespace App\Repository;

use App\Entity\BaggisteQueryPhoto;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<BaggisteQueryPhoto>
 *
 * @method BaggisteQueryPhoto|null find($id, $lockMode = null, $lockVersion = null)
 * @method BaggisteQueryPhoto|null findOneBy(array $criteria, array $orderBy = null)
 * @method BaggisteQueryPhoto[]    findAll()
 * @method BaggisteQueryPhoto[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BaggisteQueryPhotoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BaggisteQueryPhoto::class);
    }

    public function save(BaggisteQueryPhoto $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(BaggisteQueryPhoto $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return BaggisteQueryPhoto[] Returns an array of BaggisteQueryPhoto objects
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

//    public function findOneBySomeField($value): ?BaggisteQueryPhoto
//    {
//        return $this->createQueryBuilder('b')
//            ->andWhere('b.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
