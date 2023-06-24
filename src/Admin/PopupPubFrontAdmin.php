<?php

namespace App\Admin;

use App\Entity\Ville;
use App\Entity\PopupPubFront;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\DateType;

use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

final class PopupPubFrontAdmin extends AbstractAdmin
{
    
    protected function configureFormFields(FormMapper $form): void
    {

        $form
            ->add('start', DateType::class,['widget'=>'single_text'])
            ->add('end', DateType::class,['widget'=>'single_text'])
            ->add('ville', EntityType::class, [
                'label' => 'Ville',
                'class' => Ville::class,
                'required' => true,
                'choice_label' => 'name',
                'multiple' => false,
                'expanded' => false
            ])
            ->add('file',FileType::class,[
                'required' => false,
                'label'=>'Image (500 × 250)'
            ])
            
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('name')


        ;
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list->addIdentifier('id',null,['route' => array('name' => 'edit')]);
        $list->add('photo', null, array('template' => 'ville/photo.html.twig'));
        $list->add('start'); 
        $list->add('end'); 
        $list->add('ville.name'); 





    }

    /**
     * @param PopupPubFront $PopupPubFront
     */
    public function prePersist($PopupPubFront): void
    {

        $this->manageFileUpload($PopupPubFront);
    }

    /**
     * @param PopupPubFront $PopupPubFront
     */
    public function preUpdate($PopupPubFront): void
    {

        $this->manageFileUpload($PopupPubFront);
    }

    private function manageFileUpload(PopupPubFront $image): void
    {

        if ($image->getFile()) {
            $image->upload();
        }

        /*if ($image->getFileP()) {
            $image->uploadP();
        }*/
    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

}