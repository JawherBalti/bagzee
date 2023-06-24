<?php
namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

final class EmailClientAdmin extends AbstractAdmin
{

    protected $baseRoutePattern = 'email-client-statistics';
    protected $baseRouteName = 'emailClientStatistics';

    protected function configureRoutes(RouteCollectionInterface $collection):void
    {

        $collection->add('create','create');
        $collection->add('list','list');
    }
}