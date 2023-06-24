<?php

namespace App\Repository;

use App\Entity\PushRecurente;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<PushRecurente>
 *
 * @method PushRecurente|null find($id, $lockMode = null, $lockVersion = null)
 * @method PushRecurente|null findOneBy(array $criteria, array $orderBy = null)
 * @method PushRecurente[]    findAll()
 * @method PushRecurente[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PushRecurenteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, PushRecurente::class);
    }

    public function save(PushRecurente $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(PushRecurente $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return PushRecurente[] Returns an array of PushRecurente objects
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

//    public function findOneBySomeField($value): ?PushRecurente
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

        public function get($start,$end)
    {
         return $this->createQueryBuilder('o')
            ->andWhere('o.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->orderBy('o.id', 'desc')
            ->getQuery()
            ->getResult()
            ;
    }
}
