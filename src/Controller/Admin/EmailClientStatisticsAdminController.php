<?php

namespace App\Controller\Admin;

use Sonata\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Client;
use App\Entity\EmailStatistics;
use App\Service\SendEmail;
use Doctrine\Persistence\ManagerRegistry;


class EmailClientStatisticsAdminController extends Controller
{
    private $serviceEmail;
    private $doctrine;
    public function __construct(ManagerRegistry $doctrine,SendEmail $mailer)
    {
        $this->serviceEmail=$mailer;
        $this->doctrine = $doctrine;
    }

    public function createAction(Request $request):Response
    {

        $sucessSend=0;
        $em=$this->doctrine->getManager();
        $clients=$em->getRepository(Client::class)->findAll();
       
        if($request->isMethod('POST'))
        {
            if(!is_null($request->get('client')))
            {
                if($request->get('type')=='single')
                {
                    foreach ($request->get('client') as $email)
                    {
                        $sucessSend++;
                        $this->serviceEmail->sendEmail($request->get('object'), $email, $request->get('message'));
                    }
                }

            }

            if($request->get('type')=='all')
            {
                foreach ($clients as $client)
                {
                    $this->serviceEmail->sendEmail($request->get('object'), $client->getEmail(), $request->get('message'));
                    $sucessSend++;
                }
            }

            $emailStatistics=new EmailStatistics();
            $emailStatistics->setCreatedAt(new \DateTime());
            $emailStatistics->setNbre($sucessSend);
            $emailStatistics->setMessage($request->get('message'));
            $emailStatistics->setObject($request->get('object'));
            $emailStatistics->setTypeEnvoi($request->get('type'));
            $emailStatistics->setType('client');
            $em->persist($emailStatistics);
            $em->flush();
          //  return $this->redirectToRoute('emailClientStatistics_list');
        }
        return $this->render('emailClient/create.html.twig', [
            'clients'=>$clients
        ]);
    }
    public function listAction(Request $request):Response
    {
        $session = $request->getSession();

        $em=$this->doctrine->getManager();
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
        $emails=$em->getRepository(EmailStatistics::class)->getEmailByDATE('client',$session->get('start'),$session->get('end'));
        return $this->render('emailClient/index.html.twig', [
            'emails'=>$emails,
            'start'=> $session->get('start'),
            'end'=> $session->get('end'),
        ]);

    }
}
