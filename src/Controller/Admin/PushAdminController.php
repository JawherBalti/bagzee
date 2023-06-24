<?php

namespace App\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Push;
use App\Service\Helper;
use Doctrine\Persistence\ManagerRegistry;

class PushAdminController extends Controller
{
    private $servicepush;
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine , Helper $servicepush)
    {
        $this->servicepush=$servicepush;
        $this->doctrine = $doctrine;
    }

    public function createAction(Request $request):Response
    {
        $em=$this->doctrine->getManager();
        if($request->isMethod('POST'))
        {
            $data=['title'=>$request->get('object'),'content'=>$request->get('content')];
            $this->servicepush->sendPushAllDevice($data);
            $push=new Push();
            $push->setObject($request->get('object'));
            $push->setContent($request->get('content'));
            $push->setCreatedAt(new \DateTime());
            $em->persist($push);
            $em->flush();
            return $this->redirectToRoute('push_list');
        }
        return $this->render('push/create.html.twig', []);
    }
    public function listAction(Request $request):Response
    {
        $session = $request->getSession();

        $start=new \DateTime();
        $end=new \DateTime();
        if($request->isMethod('POST'))
        {
            $start=new \DateTime($request->get('start'));
            $end=new \DateTime($request->get('end'));
            $session->set('start',$start);
            $session->set('end',$end);
        }
        if(is_null($session->get('start')))
        {
            $session->set('start',$start);
            $session->set('end',$end);
        }
        $em=$this->doctrine->getManager();

        $push=$em->getRepository(Push::class)->get($session->get('start'),$session->get('end'));
        return $this->render('push/index.html.twig', [
            'push'=>$push,
            'start'=>$session->get('start'),
            'end'=>$session->get('end'),

        ]);

    }
}
