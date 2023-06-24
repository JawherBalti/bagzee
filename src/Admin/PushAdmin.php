<?php

namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

final class PushAdmin extends AbstractAdmin
{

    protected $baseRoutePattern = 'push';
    protected $baseRouteName = 'push';

    protected function configureRoutes(RouteCollectionInterface $collection):void
    {
        $collection->clearExcept(array('list'));
        $collection->add('list','list'); 
        $collection->add('create');
    }
}