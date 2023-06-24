<?php

namespace App\Repository;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Client|null find($id, $lockMode = null, $lockVersion = null)
 * @method Client|null findOneBy(array $criteria, array $orderBy = null)
 * @method Client[]    findAll()
 * @method Client[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    // /**
    //  * @return Client[] Returns an array of Client objects
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
    public function findOneBySomeField($value): ?Client
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    public function hasRole($role)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.roles like :val')
            ->setParameter('val', '%'.$role.'%')
            ->orderBy('u.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
    public function numberOfUser($start,$end)
    {
        return $this->createQueryBuilder('c')
            ->select('count(c.id)')
            ->andWhere('c.createdAt between :start and :end')
            ->setParameter('start', $start->format('Y-m-d 00:00:00'))
            ->setParameter('end', $end->format('Y-m-d 23:59:59'))
            ->getQuery()
            ->getSingleScalarResult();
    }
  public function findOneByOr($phone,$email)
    {
        return $this->createQueryBuilder('c')
         
            ->andWhere('c.email= :email or c.phone= :phone')
            ->setParameter('email', $email)
            ->setParameter('phone', $phone)
            ->getQuery()
            ->getResult();

    }


    public function listBagagisteproteur($status,$client)
    {
           return $this->createQueryBuilder('c')
            ->leftJoin('c.baggagites','baggagites')
            ->leftJoin('baggagites.client','client')
            ->andWhere('client= :client and baggagites.status= :status')
            ->setParameter('status', $status)
            ->setParameter('client', $client)
            ->getQuery()
            ->getResult();
    }

    public function numberof($start,$end)
    {
         return $this->createQueryBuilder('c')->select('count(c.id) as nbre')->where('c.createdAt between :start and :end')
         ->setParameter('start',$start)
         ->setParameter('end',$end)
         ->getQuery()
         ->getOneOrNullResult();
    }

}
