<?php

namespace App\Repository;

use App\Entity\PopupPubFront;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\OptimisticLockException;
use Doctrine\ORM\ORMException;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PopupPubFront>
 *
 * @method PopupPubFront|null find($id, $lockMode = null, $lockVersion = null)
 * @method PopupPubFront|null findOneBy(array $criteria, array $orderBy = null)
 * @method PopupPubFront[]    findAll()
 * @method PopupPubFront[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PopupPubFrontRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PopupPubFront::class);
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function add(PopupPubFront $entity, bool $flush = true): void
    {
        $this->_em->persist($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    /**
     * @throws ORMException
     * @throws OptimisticLockException
     */
    public function remove(PopupPubFront $entity, bool $flush = true): void
    {
        $this->_em->remove($entity);
        if ($flush) {
            $this->_em->flush();
        }
    }

    // /**
    //  * @return PopupPubFront[] Returns an array of PopupPubFront objects
    //  */

    public function show($ville)
    {
        $date=date('Y-m-d');
        return $this->createQueryBuilder('v')
            ->andWhere('v.ville = :ville')
            ->andWhere(':date between v.start and v.end')
            ->setParameter('ville', $ville)
            ->setParameter('date', $date)
            ->orderBy('v.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }


    /*
    public function findOneBySomeField($value): ?PopupPubFront
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
