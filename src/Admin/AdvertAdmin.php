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
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use App\Form\SizeType;
use App\Form\ImageType;
use App\Entity\Advert;
use Aws\S3\S3Client;

final class AdvertAdmin extends AbstractAdmin
{
	protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->add('fromAdress',null,['label' => "Adresse de départ"])
            ->add('toAdress',null,['label' => "Adresse d'arrivée"])
            ->add('price',null,['label' => "Total"])
            ->add('adressPointDepart',null,['label' => "Adresse point de départ"])
            ->add('adressPointArrivee',null,['label' => "Adresse point d'arrivée"])
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
        ->add('fromAdress', TextType::class)
        ->add('toAdress', TextType::class)
        ->add('price', MoneyType::class)
        ->add('adressPointDepart', TextType::class)
        ->add('adressPointArrivee', TextType::class)
        ->add('lat_adresse_point_depart', HiddenType::class)
        ->add('long_adresse_point_depart', HiddenType::class)
         ->add('lat_adresse_point_arrivee', HiddenType::class)
        ->add('long_adresse_point_arrivee', HiddenType::class)
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
            ->end()
        ->end()
         
           ->tab('Vehicule')

            ->add('images',CollectionType::class,[
                'entry_type' => ImageType::class,
                'allow_add' => true,
                'allow_delete' => true,
                'entry_options' => ['label' => false],
                'by_reference' => false,
            ])
           ->end()
        ->end()
            
        
         
;
    }

     /**
     * @param Advert $advert
     */
    public function prePersist($advert): void
    {
        
        $this->manageFileUpload($advert);
    }

    /**
     * @param Advert $advert
     */
    public function preUpdate($advert): void
    {
        $this->manageFileUpload($advert);
    }

     private function manageFileUpload(Advert $advert): void
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

        if(count($advert->getImages())>0)
          {
            foreach ($advert->getImages() as $key => $doc) {
                
                if($doc->getFileD())
                {
                    $file_Path=$doc->getFileD()->getClientOriginalName();
$imageFileType = strtolower(pathinfo($file_Path,PATHINFO_EXTENSION));
$new_name = rand().'.'.$imageFileType;
//dd($file_Path->getOriginalName());
$key = basename($new_name);
try {
    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key'    => $key,
        'Body'   => fopen($doc->getFileD(), 'r'),
        'ACL'    => 'public-read', // make file 'public'
    ]);
    $doc->setUrl($result->get('ObjectURL'));
} catch (Aws\S3\Exception\S3Exception $e) {
    dd($e->getMessage());
}    
                }
            }
          }
    }



      

}
