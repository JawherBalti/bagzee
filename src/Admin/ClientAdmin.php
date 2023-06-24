<?php

namespace App\Admin;

use App\Entity\Client;
use App\Entity\Partenaire;
use App\Entity\User;
use Doctrine\DBAL\Types\FloatType;
use phpDocumentor\Reflection\Types\Integer;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\ProxyQueryInterface;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use TheSeer\Tokenizer\Token;
use Vich\UploaderBundle\Form\Type\VichImageType;
use App\Form\VehiculeType;
use Aws\S3\S3Client;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

final class ClientAdmin extends AbstractAdmin
{

    protected UserPasswordHasherInterface $passwordEncoder;

    public function __construct(
        string $code,
        string $class,
        string $baseControllerName,
        UserPasswordHasherInterface $passwordEncoder
    ) {
        parent::__construct($code, $class, $baseControllerName);

        $this->passwordEncoder = $passwordEncoder;
    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }
    protected function configureFormFields(FormMapper $form): void
    {

        /** @var User $editUser */
        $editUser = $this->getSubject();
        $isCreation = $editUser->getId() === null;
        $generated=$editUser->getId()?true:false;
        $form
        ->tab('information')
            ->add('email', TextType::class)
            ->add('firstname', TextType::class)
            ->add('lastname', TextType::class)
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'options' => [
                    'attr' => ['autocomplete' => 'new-password'],
                ],
                'first_options' => [
                    'label' => $isCreation ? 'Mot de passe' : 'Nouveau mot de passe',
                    'help' => $isCreation ? null : 'Laisser vide pour conserver le mot de passe actuel',
                ],
                'second_options' => ['label' => $isCreation ? 'Confirmer le mot de passe' : 'Confirmer le nouveau mot de passe'],
                'required' => $isCreation,
                'invalid_message' => 'Les mots de passes saisis sont différents',
            ])
            ->add('gender',ChoiceType::class,['choices'=>['Mr'=>'Mr','Mme'=>'Mme','Non-binaire'=>'Non-binaire']])
            ->add('birdh',DateType::class,['widget'=>'single_text'])
            ->add('phone',TextType::class)
            ->add('file', FileType::class, [
                'label' => 'Image'
              , 'required' => false
            ])
            ->add('token',TextType::class,['attr'=>[$generated?true:'value'=>sha1(random_bytes(12))]])
               ->end()
        ->end()

        ->tab('Vehicule')

            ->add('vehicules',CollectionType::class,[
                'entry_type' => VehiculeType::class,
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
     * @param Client $client
     */
    public function prePersist($client): void
    {
        if ($client->getPlainPassword() !== null) {
            $client->setPassword($this->passwordEncoder->hashPassword($client, $client->getPlainPassword()));
        }
        $this->manageFileUpload($client);
    }

    /**
     * @param Client $client
     */
    public function preUpdate($client): void
    {
        if ($client->getPlainPassword() !== null) {
            $client->setPassword($this->passwordEncoder->hashPassword($client, $client->getPlainPassword()));
        }
        $this->manageFileUpload($client);
    }


    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid->add('email')


        ;
    }

    protected function configureQuery(ProxyQueryInterface $query): ProxyQueryInterface
    {
      
        $query = parent::configureQuery($query);

        $rootAlias = current($query->getRootAliases());

        $query->andWhere(
            $query->expr()->eq($rootAlias . '.deleted', ':deleted')
        );
        $query->setParameter('deleted', 0);

        return $query;
    }

    private function manageFileUpload(Client $client): void
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
          if($client->getFile())
          {
$file_Path=$client->getFile()->getClientOriginalName();
$imageFileType = strtolower(pathinfo($file_Path,PATHINFO_EXTENSION));
$new_name = rand().'.'.$imageFileType;
//dd($file_Path->getOriginalName());
$key = basename($new_name);
try {
    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key'    => $key,
        'Body'   => fopen($client->getFile(), 'r'),
        'ACL'    => 'public-read', // make file 'public'
    ]);
    $client->setPhoto($result->get('ObjectURL'));
} catch (Aws\S3\Exception\S3Exception $e) {
    dd($e->getMessage());
}            
          }

          if(count($client->getVehicules())>0)
          {
            foreach ($client->getVehicules() as $key => $vehicule) {
                
                if($vehicule->getFileV())
                {
                    $file_Path=$vehicule->getFileV()->getClientOriginalName();
$imageFileType = strtolower(pathinfo($file_Path,PATHINFO_EXTENSION));
$new_name = rand().'.'.$imageFileType;
//dd($file_Path->getOriginalName());
$key = basename($new_name);
try {
    $result = $s3Client->putObject([
        'Bucket' => $bucket,
        'Key'    => $key,
        'Body'   => fopen($vehicule->getFileV(), 'r'),
        'ACL'    => 'public-read', // make file 'public'
    ]);
    $vehicule->setPhoto($result->get('ObjectURL'));
} catch (Aws\S3\Exception\S3Exception $e) {
    dd($e->getMessage());
}    
                }
            }
          }

    }


    protected function configureListFields(ListMapper $list): void
    {

        $list
            ->addIdentifier('id',null,['route' => array('name' => 'edit')])
            ->addIdentifier('email',null,['route' => array('name' => 'edit')])
            ->addIdentifier('firstName',null,['route' => array('name' => 'edit')])
            ->addIdentifier('lastName',null,['route' => array('name' => 'edit')])
            ->addIdentifier('phone',null,['route' => array('name' => 'edit')])
            ->addIdentifier('gender',null,['route' => array('name' => 'edit'),'template' => 'crud/field.html.twig'])
            ->addIdentifier('birdh',null,['route' => array('name' => 'edit')])
            ->addIdentifier('createdAt',null,['route' => array('name' => 'edit'),'label'=>'date de création'])
        ;
        $list->add(ListMapper::NAME_ACTIONS, ListMapper::TYPE_ACTIONS, [
            'actions' => [
                'delete_client' => ['template' => 'crud/delete_client.html.twig']
                //this twig file will be located at: templates/Admin/MyController/my_partial.html.twig
            ]]);

    }
    protected function configureRoutes(RouteCollectionInterface $collection): void
    {
        $collection->remove('delete');
    }

}