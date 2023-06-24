<?php

namespace App\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use App\Entity\Faq;
use App\Repository\FaqRepository;
use Sonata\AdminBundle\Route\RouteCollectionInterface;


final class FaqAdmin extends AbstractAdmin
{
    public function __construct(
        string $code,
        string $class,
        string $baseControllerName,
        FaqRepository $faqRepository
    ) {
        parent::__construct($code, $class, $baseControllerName);

        $this->faqRepository = $faqRepository;
      /*  if(count($faqRepository->findAll())==0)
        {
            $pc=new Faq();
            $pc->setQuestion('default value');
            $pc->setReponse('default value');
            $this->faqRepository->save($pc,true);
        }*/

    }



    protected function configureFormFields(FormMapper $form): void
    {

        $form
            ->add('question', TextType::class,[])
             ->add('reponse', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ])
            
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('question')->add('reponse')


        ;
    }

    protected function configureListFields(ListMapper $list): void
    {
          $list->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('question','text',['route' => array('name' => 'edit')])
            ->add('reponse','html',['route' => array('name' => 'edit')])
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
       
    }

}