<?php

namespace App\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use App\Entity\MentionLegal;
use App\Repository\MentionLegalRepository;

final class MentionLegalAdmin extends AbstractAdmin
{
    public function __construct(
        string $code,
        string $class,
        string $baseControllerName,
        MentionLegalRepository $mentionLegalRepository
    ) {
        parent::__construct($code, $class, $baseControllerName);

        $this->mentionLegalRepository = $mentionLegalRepository;
        if(count($mentionLegalRepository->findAll())==0)
        {
            $pc=new MentionLegal();
            $pc->settext('default value');
            $this->mentionLegalRepository->save($pc,true);
        }

    }
    protected function configureFormFields(FormMapper $form): void
    {

        $form
            ->add('text', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ])
            
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('text')


        ;
    }

    protected function configureListFields(ListMapper $list): void
    {
          $list->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('text','html',['route' => array('name' => 'edit')])
        ;

    }

    

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }
 protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('delete');
        $collection->remove('create');
    }
}