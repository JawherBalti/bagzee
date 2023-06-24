<?php

namespace App\Admin;

use App\Entity\CGU;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use App\Repository\CGURepository;


final class CGUAdmin extends AbstractAdmin
{
    public function __construct(
        string $code,
        string $class,
        ?string $baseControllerName,
        CGURepository $CGURepository
    ) {
        parent::__construct($code, $class, $baseControllerName);

        $this->CGURepository = $CGURepository;

          if(count($CGURepository->findAll())==0)
        {
            $pc=new CGU();
            $pc->settext('default value');
            $this->CGURepository->save($pc,true);
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

    /**
     * @param CGU $CGU
     */
    public function prePersist($CGU): void
    {

        
    }

    /**
     * @param CGU $CGU
     */
    public function preUpdate($CGU): void
    {

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