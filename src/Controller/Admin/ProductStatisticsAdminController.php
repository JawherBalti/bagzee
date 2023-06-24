<?php

namespace App\Controller\Admin;


use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\RequestStack;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Client;
use App\Entity\Advert;
use App\Entity\AdvertQuery;
use App\Entity\BaggisteQuery;
use App\Entity\Baggagite;


class ProductStatisticsAdminController extends Controller
{
	 private $requestStack;
	 private $doctrine;

    public function __construct(RequestStack $requestStack,ManagerRegistry $doctrine)
    {
        $this->requestStack = $requestStack;
        $this->doctrine = $doctrine;
    }
	 public function listAction(Request $request): Response
    {
    	 $start = new \DateTime();
         $end = new \DateTime();
         $role="tout";
         $entityManager = $this->doctrine->getManager();
        $session = $this->requestStack->getSession();
            if ($request->isMethod('POST')) {
            $start = new \DateTime($request->get('start'));
            $end = new \DateTime($request->get('end'));
            $role=$request->get('role');
            $session->set('start', $start);
            $session->set('end', $end);
            $session->set('role', $role);
        }
        if (is_null($session->get('start'))) {
            $session->set('start', $start);
            $session->set('end', $end);
            $session->set('role', $role);
        }

        if(in_array($role, ['porteur','tout']))
        {
            $numberOfadvert=$entityManager->getRepository(Advert::class)->numberof($session->get('start'),$session->get('end'));
            $numberOfadvertQuery=$entityManager->getRepository(AdvertQuery::class)->numberof($session->get('start'),$session->get('end'));
            $adverts=$entityManager->getRepository(Advert::class)->list($session->get('start'),$session->get('end'));
        }
        if(in_array($role, ['proprietaire','tout']))
        {
        	$numberOfbagagiste=$entityManager->getRepository(Baggagite::class)->numberof($session->get('start'),$session->get('end'));
            $numberOfBaggisteQuery=$entityManager->getRepository(BaggisteQuery::class)->numberof($session->get('start'),$session->get('end'));
             $baggagistes=$entityManager->getRepository(Baggagite::class)->list($session->get('start'),$session->get('end'));

        }
        
		$numberOfclient=$entityManager->getRepository(Client::class)->numberof($session->get('start'),$session->get('end'));


          return $this->render('crud/stats.html.twig', [
            'start' => $session->get('start'), 
            'end' => $session->get('end'),
            'role'=>$session->get('role'),
            'numberOfclient'=>$numberOfclient['nbre'],
            'numberOfadvert'=>$numberOfadvert??0,
            'numberOfbagagiste'=>$numberOfbagagiste??0,
            'numberOfadvertQuery'=>$numberOfadvertQuery??0,
            'numberOfBaggisteQuery'=>$numberOfBaggisteQuery??0,
            'adverts'=>$adverts,
            'baggagistes'=>$baggagistes
        ]);
    }



     public function advertQueryAction(Request $request): Response
    {
        $em=$this->doctrine->getManager();
        $advertQuery = $em->getRepository(AdvertQuery::class)->byAdvert($request->get('id'));
          return $this->render('tables/advertQuery.html.twig', [
            'advertQuery' => $advertQuery
        ]);

    }

    public function bagagisteQueryAction(Request $request): Response
    {
        $em=$this->doctrine->getManager();
        $baggisteQuery = $em->getRepository(BaggisteQuery::class)->byBagagiste($request->get('id'));
         return $this->render('tables/bagagisteQuery.html.twig', [
            'baggisteQuery' => $baggisteQuery
        ]);

    }
}