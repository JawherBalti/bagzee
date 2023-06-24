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

final class SeoAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $form): void
    {
        $seo = $this->getSubject();


            $fileFieldOptions=[
                'required' => false,
                'label'=>'photo'
            ];
            $form->add('file',FileType::class,$fileFieldOptions);





        $form
            ->add('url', TextType::class,['attr'=>['class'=>'form-control','placeholder'=>'Exemple: /mon-url']])
            ->add('title', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('content', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('canonical', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('metaTitle', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('robots', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('metaDesc', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('ogTitle', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('ogDescription', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('keyword', TextType::class,['attr'=>['class'=>'form-control']])
        ;
    }

    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid
            ->add('url')
            ->add('title')
        ->add('content')
        ->add('canonical')
        ->add('metaTitle')
        ->add('robots')
        ->add('metaDesc')
            ;
    }



    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->addIdentifier('title', null, ['label' => 'Titre'])
            ->add('url', null, ['label' => 'url'])
            ->add('content', null, ['label' => 'content'])
            ->add('canonical', null, ['label' => 'canonical'])
            ->add('metaTitle', null, ['label' => 'metaTitle'])
            ->add('robots', null, ['label' => 'robots'])
            ->add('metaDesc', null, ['label' => 'metaDesc'])
        ;
    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

    public function prePersist(object $image): void
    {

        $this->manageFileUpload($image);
    }

    public function preUpdate(object $image): void
    {

        $this->manageFileUpload($image);
    }

    private function manageFileUpload(object $image): void
    {

        if ($image->getFile()) {
            $image->upload();
        }
    }


}