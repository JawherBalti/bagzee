<?php

namespace App\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

final class SponsorshipAdmin extends AbstractAdmin
{
	protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('name',null,['label' => "Code promos"])
            ->add('start',null,['label' => "Date début",
                'format' => 'd/m/Y',])
            ->add('end',null,['label' => "Date de fin",
                'format' => 'd/m/Y',])
    
            ->add('reduce',null,['label' => "réduction"])
            ->add('qte',null,['label' => "quantité"])
            ->add('type',ChoiceType::class,['choices'=>['montant'=>'montant','pourcentage'=>'pourcentage']])


        ;
    }


     protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

     protected function configureFormFields(FormMapper $form): void
    {
         $form
      
        ->add('name', TextType::class)
        ->add('qte', IntegerType::class)
        ->add('start', DateType::class,[
                    'label' => 'Date de départ',
                    'widget' => 'single_text'
                ])
        ->add('end', DateType::class,[
                    'label' => "Date d'arrivée",
                    'widget' => 'single_text'
                ])
                ->add('reduce', MoneyType::class)
            ->add('type',ChoiceType::class,['choices'=>['montant'=>'montant','pourcentage'=>'pourcentage']])

        ->end()
           

;
    }
      

}
