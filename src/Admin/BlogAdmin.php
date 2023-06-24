<?php

namespace App\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use App\Entity\Blog;
use Aws\S3\S3Client;
use FOS\CKEditorBundle\Form\Type\CKEditorType;

final class BlogAdmin extends AbstractAdmin
{
	protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('title',null,['label' => "Titre"])
            ->add('publish',null,['label' => "Date de publication",'format' => 'd/m/Y'])

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

        $hasRequired=($this->getSubject()->getId()==null)?true:false;
         $form
        ->add('title', TextType::class)
         ->add('description', CKEditorType::class,[
                'attr' => ['class' => 'ckeditor'],
            ])
        ->add('url', TextType::class)
       
        ->add('publish', DateType::class,[
                    'label' => 'Date de publication',
                    'widget' => 'single_text'])    
             ->add('file', FileType::class, [
                'label' => 'Image'
              , 'required' => $hasRequired
            ])
;
    }

     /**
     * @param Blog $blog
     */
    public function prePersist($blog): void
    {
        
        $this->manageFileUpload($blog);
    }

    /**
     * @param Blog $blog
     */
    public function preUpdate($blog): void
    {
        $this->manageFileUpload($blog);
    }

     private function manageFileUpload(Blog $blog): void
    {
         $bucket = $_ENV["assets_bucket"];
          $s3Client = new S3Client([
    'version' => 'latest',
    'region' => $_ENV["assets_region"],
    'credentials' => [
        'key'    => $_ENV["assets_key"],
        'secret' => $_ENV["assets_secret"]
    ]
]);
if(!is_null($blog->getFile()))
{

                    $file_Path=$blog->getFile()->getClientOriginalName();
                    $imageFileType = strtolower(pathinfo($file_Path,PATHINFO_EXTENSION));
$new_name = rand().'.'.$imageFileType;
//dd($file_Path->getOriginalName());
$key = basename($new_name);
try {
    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key'    => $key,
        'Body'   => fopen($blog->getFile(), 'r'),
        'ACL'    => 'public-read', // make file 'public'
    ]);
    $blog->setImage($result->get('ObjectURL'));
}

 catch (Aws\S3\Exception\S3Exception $e) {
    dd($e->getMessage());
}    
               
    }}



      

}
