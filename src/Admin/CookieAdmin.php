<?php

namespace App\Admin;

use App\Entity\Cookies;
use App\Repository\CookiesRepository;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Route\RouteCollectionInterface;


final class CookieAdmin extends AbstractAdmin
{
     public function __construct(
        string $code,
        string $class,
        ?string $baseControllerName,
        CookiesRepository $cookiesRepository
    ) {
        parent::__construct($code, $class, $baseControllerName);

        $this->cookiesRepository = $cookiesRepository;

          if(count($cookiesRepository->findAll())==0)
        {
            $pc=new Cookies();
            $pc->settext('default value');
            $this->cookiesRepository->save($pc,true);
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
     * @param Cookies $Cookies
     */
    public function prePersist($Cookies): void
    {

        
    }

    /**
     * @param Cookies $Cookies
     */
    public function preUpdate($Cookies): void
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