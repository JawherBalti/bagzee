<?php

namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

final class PushRecurenteAdmin extends AbstractAdmin
{

    protected $baseRoutePattern = 'pushRecurente';
    protected $baseRouteName = 'pushRecurente';

    protected function configureRoutes(RouteCollectionInterface $collection):void
    {
        $collection->clearExcept(array('list'));
        $collection->add('list','list'); 
        $collection->add('create');
        $collection->add('remove','remove/'.$this->getRouterIdParameter());
    }
}