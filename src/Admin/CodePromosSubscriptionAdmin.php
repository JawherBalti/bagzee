<?php
namespace App\Admin;
use FOS\CKEditorBundle\Form\Type\CKEditorType;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\DatagridInterface;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Form\FormMapper;
use Sonata\AdminBundle\Route\RouteCollectionInterface;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use App\Entity\CodePromosSubscription;

final class CodePromosSubscriptionAdmin extends AbstractAdmin
{

 public function __construct(
        string $code,
        string $class,
        string $baseControllerName
    ) {
        parent::__construct($code, $class, $baseControllerName);

    }
    protected function configureFormFields(FormMapper $form): void
    {
        $form
            ->add('name', TextType::class,['attr'=>['class'=>'form-control']])
            ->add('start', DateType::class,['widget'=>'single_text'])
            ->add('end', DateType::class,['widget'=>'single_text'])
            ->add('qte',            NumberType::class)
            ->add('reduce',     MoneyType::class,['label'=>'montant'])
            ->add('stripeCoupon', TextType::class,['disabled'=>'disabled'])


        ;
    }


    protected function configureDatagridFilters(DatagridMapper $datagrid): void
    {
        $datagrid
            ->add('name')
        ;
    }

    protected function configureListFields(ListMapper $list): void
    {
        $list
            ->addIdentifier('id', null, ['label' => 'id','route' => array('name' => 'edit')])
            ->add('name', null,['attr'=>['class'=>'form-control'],'label' => 'name'])
            ->add('start', null,['attr'=>['class'=>'form-control'],'label' => 'start'])
            ->add('end', null,['attr'=>['class'=>'form-control'],'label' => 'end'])
            ->add('qte', null,['attr'=>['class'=>'form-control'],'label' => 'qte'])
            ->add('reduce', null,['attr'=>['class'=>'form-control'],'label' => 'montant'])

        ;

    }

    protected function configureDefaultSortValues(array &$sortValues): void
    {
        $sortValues[DatagridInterface::PAGE] = 1;
        $sortValues[DatagridInterface::SORT_ORDER] = 'DESC';
        $sortValues[DatagridInterface::SORT_BY] = 'id';
    }

    /**
     * @param CodePromosSubscription $code
     */
    public function prePersist($code): void
    {
 \Stripe\Stripe::setApiKey("sk_test_G7AQZHdRZKvFumZlcbDPmWLn");
       
        if (is_null($code->getStripeCoupon())) {
              $coupon = \Stripe\Coupon::create([
  'percent_off' => $code->getReduce(),
  'duration' => 'repeating',
  'duration_in_months' => 3,
]);
            $code->setStripeCoupon($coupon->id);
        }
        
    }

    /**
     * @param CodePromosSubscription $code
     */
    public function preUpdate($code): void
    {


        \Stripe\Stripe::setApiKey("sk_test_G7AQZHdRZKvFumZlcbDPmWLn");
        if (is_null($code->getStripeCoupon())) {
             $coupon = \Stripe\Coupon::create([
                'percent_off' => $code->getReduce(),
                'duration' => 'repeating',
                'duration_in_months' => 3,
                ]);
            $code->setStripeCoupon($coupon->id);
        }
        //$this->manageFileUpload($image);
    }


     /**
     * @param CodePromosSubscription $code
     */
    public function PreRemove($code): void
    {


 \Stripe\Stripe::setApiKey("sk_test_G7AQZHdRZKvFumZlcbDPmWLn");
        if (!is_null($code->getStripeCoupon())) {

             $coupon = \Stripe\Coupon::delete($code->getStripeCoupon(),[]);
        }
        //$this->manageFileUpload($image);
    }



    
}
