<?php
namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

final class SmsAdmin extends AbstractAdmin
{

    protected $baseRoutePattern = 'sms-statistics';
    protected $baseRouteName = 'smsStatistics';

    protected function configureRoutes(RouteCollectionInterface $collection):void
    {

        $collection->add('create','create');
        $collection->add('list','list');
    }
}