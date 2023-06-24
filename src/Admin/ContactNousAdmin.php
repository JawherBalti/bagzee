<?php

namespace App\Admin;


use Doctrine\DBAL\Types\FloatType;
use phpDocumentor\Reflection\Types\Integer;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use TheSeer\Tokenizer\Token;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

final class ContactNousAdmin extends AbstractAdmin
{


    
    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }
   

    

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('email')


        ;
    }

    
    protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->addIdentifier('email',null,['route' => array('name' => 'edit')])
            ->addIdentifier('firstName',null,['route' => array('name' => 'edit')])
            ->addIdentifier('lastName',null,['route' => array('name' => 'edit')])
            ->addIdentifier('phone',null,['route' => array('name' => 'edit')])
            ->addIdentifier('subject',null,['route' => array('name' => 'edit')])
            ->addIdentifier('content',null,['route' => array('name' => 'edit')])
        ;
       

    }
    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('delete');
        $collection->remove('create');
        $collection->remove('edit');
    }

}