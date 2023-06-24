<?php

namespace App\Admin;

use App\Entity\SettingSeo;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use FOS\CKEditorBundle\Form\Type\CKEditorType;


final class SettingSeoAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->add('hotjar', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ]) 
            ->add('google_analytics', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ]) 
            ->add('pixel_facebook', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ]) 
            ->add('pixel_tiktok', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ])            
        ;
    }
    

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('hotjar')
            ->add('google_analytics')
            ->add('pixel_facebook')
            ->add('pixel_tiktok')


        ;
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list->addIdentifier('hotjar',null,['route' => array('text' => 'edit')])
            ->addIdentifier('google_analytics',null,['route' => array('text' => 'edit')])
            ->addIdentifier('pixel_facebook',null,['route' => array('text' => 'edit')])
            ->addIdentifier('pixel_tiktok',null,['route' => array('text' => 'edit')])
        ;

    }

    /**
     * @param SettingSeo $SettingSeo
     */
    public function prePersist($SettingSeo): void
    {

        
    }

    /**
     * @param SettingSeo $SettingSeo
     */
    public function preUpdate($SettingSeo): void
    {

    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

}