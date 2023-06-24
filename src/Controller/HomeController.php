<?php

namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
     
    /**
     * @Route("/{reactRouting}", name="app_home", defaults={"reactRouting": null})
     */
    public function index(): Response
    {
    	//dd($_ENV["APP_STRIPE"]);
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }
}
