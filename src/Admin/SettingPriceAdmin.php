<?php
namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Symfony\Component\DomCrawler\Image;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
final class SettingPriceAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $form): void
    {
    
        $form
            ->add('name', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('price', MoneyType::class,['attr'=>['class'=>'form-control']])
            ->add('isRelais', CheckboxType::class,['required'=>false,'attr'=>['class'=>'form-control']])
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid
            ->add('name')
            ->add('price')
            ->add('isRelais')
            ;
    }



    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('name', null, ['label' => 'Titre'])
            ->add('price', null, ['label' => 'Prix'])
             ->add('isRelais', false, ['label' => 'isRelais'])
        ;
    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

}