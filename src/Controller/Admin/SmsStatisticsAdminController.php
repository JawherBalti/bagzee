<?php

namespace App\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Client;
use App\Entity\SmsStatistics;
use App\Service\Sms;
use Doctrine\Persistence\ManagerRegistry;

class SmsStatisticsAdminController extends Controller
{
    private $serviceSms;
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine , Sms $sms)
    {
        $this->serviceSms=$sms;
        $this->doctrine = $doctrine;
    }

    public function createAction(Request $request):Response
    {
        mb_internal_encoding('UTF-8');
        $sucessSend=0;
        $tabClientId=[];
        $tabClientName=[];
        $em=$this->doctrine->getManager();
        $clients=$em->getRepository(Client::class)->findBy(['deleted'=>0]);
        if($request->isMethod('POST'))
        {

            if(!is_null($request->get('client')))
            {
                if($request->get('type')=='single')
                {
                    foreach ($request->get('client') as $numero)
                    {
                       $cl=$em->getRepository(Client::class)->find($numero);
                      if($this->serviceSms->sendSms('',$cl->getPhone(),strip_tags($request->get('message'))))
                        {
                            
                            $tabClientId[]=$cl->getId();
                            $tabClientName[]=$cl->getFirstname().' '.$cl->getLastname();

                            $sucessSend++;

                        }

                    }
                }

            }
            if($request->get('type')=='all')
            {

                foreach ($clients as $client)
                {

                    if($this->serviceSms->sendSms('',$client->getPhone(),strip_tags($request->get('message'))))
                    {
                            $tabClientId[]=$client->getId();
                            $tabClientName[]=$client->getFirstname().' '.$client->getLastname();

                        $sucessSend++;

                    }

                }
            }

            if(count($tabClientId)>0)
            {
                $SmsStatistics=new SmsStatistics();
            $SmsStatistics->setCreatedAt(new \DateTime());
            $SmsStatistics->setNbre($sucessSend);
            $SmsStatistics->setMessage($request->get('message'));
            $SmsStatistics->setTypeEnvoie($request->get('type'));
            $SmsStatistics->setType('client');
            $SmsStatistics->setClientId($tabClientId);
            $SmsStatistics->setClientName($tabClientName);
            $em->persist($SmsStatistics);
            $em->flush();
            }

            

            return $this->redirectToRoute('smsStatistics_list');
        }
        return $this->render('sms/create.html.twig', [
            'client'=>$clients
        ]);
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

        $sms=$em->getRepository(SmsStatistics::class)->getSms('client',$session->get('start'),$session->get('end'));
        return $this->render('sms/index.html.twig', [
            'sms'=>$sms,
            'start'=>$session->get('start'),
            'end'=>$session->get('end'),

        ]);

    }

    
}
