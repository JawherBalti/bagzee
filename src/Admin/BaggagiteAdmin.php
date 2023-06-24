<?php

namespace App\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TimeType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Form\SizeType;
use App\Entity\Baggagite;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;

final class BaggagiteAdmin extends AbstractAdmin
{
	protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('adressFrom',null,['label' => "Adresse de départ"])
            ->add('adressTo',null,['label' => "Adresse d'arrivée"])
            ->add('adresse_point_depart',null,['label' => "Adresse point de départ"])
            ->add('adresse_point_arrivee',null,['label' => "Adresse point d'arrivée"])
            ->add('dateFrom',null,['label' => "Date départ",
                'format' => 'd/m/Y',])
            ->add('dateTo',null,['label' => "Date d'arrivée",
                'format' => 'd/m/Y',])
            ->add('timeFrom',null,['label' => "Heure du départ",
                'format' => 'H:i',])
            ->add('timeTo',null,['label' => "Heure d'arrivée",
                'format' => 'd/m/Y H:i:s',])
            ->add('createdAt',null,['label' => 'Date de création',
                'format' => 'd/m/Y H:i:s','label'=>'date de création'])
        ;
    }

    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('delete');
        $collection->remove('create');
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
        ->tab('information')
        ->add('adressFrom', TextType::class)
        ->add('adressTo', TextType::class)
        ->add('adresse_point_depart', TextType::class)
        ->add('adresse_point_arrivee', TextType::class)
        ->add('dateFrom', DateType::class,[
                    'label' => 'Date de départ',
                    'widget' => 'single_text'
                ])
        ->add('dateTo', DateType::class,[
                    'label' => "Date d'arrivée",
                    'widget' => 'single_text'
                ])
         ->add('timeFrom', TimeType::class,[
                    'label' => "Heure du départ",
                    'widget' => 'single_text'
                ])
          ->add('timeTo', TimeType::class,[
                    'label' => "Heure d'arrivée",
                    'widget' => 'single_text'
                ])
           ->add('lat_adresse_point_depart', HiddenType::class)
        ->add('long_adresse_point_depart', HiddenType::class)
         ->add('lat_adresse_point_arrivee', HiddenType::class)
        ->add('long_adresse_point_arrivee', HiddenType::class)
            ->end()
        ->end()
         ->tab('Dimension')

            ->add('dimension',SizeType::class,[])
           ->end()
        ->end()
           

;
    }
      

}
