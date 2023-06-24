<?php

namespace App\Admin;
use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Route\RouteCollection;
use Sonata\AdminBundle\Route\RouteCollectionInterface;

final class StatsAdmin extends AbstractAdmin
{

    protected $baseRoutePattern = 'product-statistics';
    protected $baseRouteName = 'productStatistics';

    protected function configureRoutes(RouteCollectionInterface $collection):void
    {
        $collection->clearExcept(array('list'));
        $collection->add('list','list');
        $collection->add('advertQuery','advertQuery');        
        $collection->add('bagagisteQuery','bagagisteQuery');        

    }
}