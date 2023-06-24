<?php

namespace App\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\PushRecurente;
use App\Service\Helper;
use Doctrine\Persistence\ManagerRegistry;

class PushRecurenteAdminController extends Controller
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function createAction(Request $request):Response
    {
        $em=$this->doctrine->getManager();
        if($request->isMethod('POST'))
        {
            $days=[];
            foreach ($request->get('days') as $key => $day) {
                $days[]=$day;
            }
            $pushRecurente=new PushRecurente();
            $pushRecurente->setObject($request->get('object'));
            $pushRecurente->setcontent($request->get('content'));
            $pushRecurente->setDays($days);
            $pushRecurente->setHours(new \DateTime($request->get('hours')));
            $em->persist($pushRecurente);
            $em->flush();
            return $this->redirectToRoute('pushRecurente_list');
        }
                $data['days']=['lundi'=>1,'mardi'=>2,'mercredi'=>3,'jeudi'=>4,'vendredi'=>5,'samedi'=>6,'dimanche'=>7];

        return $this->render('pushRecurente/create.html.twig',['days'=>$data['days']]);
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

        $pushrecurente=$em->getRepository(PushRecurente::class)->get($session->get('start'),$session->get('end'));


        return $this->render('pushRecurente/index.html.twig', [
          'pushrecurente'=>$pushrecurente,
            'start'=>$session->get('start'),
            'end'=>$session->get('end'),

        ]);

    }

    public function removeAction(Request $request,$id):Response
    {
        $em=$this->doctrine->getManager();

        $pushrecurente=$em->getRepository(PushRecurente::class)->find($id);
        if($pushrecurente)
        {
            $em->remove($pushrecurente);
            $em->flush();
        }


       return $this->redirectToRoute('pushRecurente_list');

    }
}
