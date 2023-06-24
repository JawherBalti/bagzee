<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Repository\CookiesRepository;
use App\Repository\CGURepository;
use App\Repository\CGVRepository;
use App\Repository\FaqRepository;
use App\Repository\MentionLegalRepository;
use App\Repository\PolitiqueConfidentialiteRepository;
/**
 * @Route("/api/regle", name="api_")
 */

class RegleController extends AbstractController
{

	/**
    * @Route("/cookies", name="regle_cookies", methods={"GET"})
    */
    public function regle_cookies(CookiesRepository $cookiesRepo): Response
    {
    	$tab=[];
    	$cookies=$cookiesRepo->findBy([],['id'=>'desc']);
    	if($cookies)
    	{
    		$tab[]=['id'=>$cookies[0]->getId(),'content'=>$cookies[0]->getText()];
    	}
    	    return $this->json(['cookies'=>$tab]);

    }

    /**
    * @Route("/cgu", name="regle_cgu", methods={"GET"})
    */
    public function regle_cgu(CGURepository $cguRepo): Response
    {
    	$tab=[];
    	$cgu=$cguRepo->findBy([],['id'=>'desc']);
    	if($cgu)
    	{
    		$tab[]=['id'=>$cgu[0]->getId(),'content'=>$cgu[0]->getText()];
    	}
    	    return $this->json(['cgu'=>$tab]);

    }

     /**
    * @Route("/cgv", name="regle_cgv", methods={"GET"})
    */
    public function regle_cgv(CGVRepository $cgvRepo): Response
    {
    	$tab=[];
    	$cgv=$cgvRepo->findBy([],['id'=>'desc']);
    	if($cgv)
    	{
    		$tab[]=['id'=>$cgv[0]->getId(),'content'=>$cgv[0]->getText()];
    	}
    	    return $this->json(['cgv'=>$tab]);

    }

     /**
    * @Route("/politique", name="regle_politique", methods={"GET"})
    */
    public function regle_politique(PolitiqueConfidentialiteRepository $politiqueConfidentialiteRepository): Response
    {
    	$tab=[];
    	$politique=$politiqueConfidentialiteRepository->findBy([],['id'=>'desc']);
    	if($politique)
    	{
    		$tab[]=['id'=>$politique[0]->getId(),'content'=>$politique[0]->getText()];
    	}
    	    return $this->json(['politique'=>$tab]);

    }

    /**
    * @Route("/faq", name="regle_faq", methods={"GET"})
    */
    public function regle_faq(FaqRepository $faqRepository): Response
    {
        $tab=[];
        $faq=$faqRepository->findBy([],['id'=>'desc']);

        if($faq)
        {
            foreach ($faq as $key => $faq) {
                $tab[]=[
                'id'=>$faq->getId(),
                'question'=>$faq->getQuestion(),
                'reponse'=>$faq->getReponse()
            ];
            }
           
        }
            return $this->json(['faq'=>$tab]);

    }

    /**
    * @Route("/mentions", name="regle_mentions", methods={"GET"})
    */
    public function regle_mentions(MentionLegalRepository $mentionLegalRepository): Response
    {
        $tab=[];
        $mentionLegal=$mentionLegalRepository->findBy([],['id'=>'desc']);

        if($mentionLegal)
        {
            foreach ($mentionLegal as $key => $mentionLegal) {
                $tab=[
                'id'=>$mentionLegal->getId(),
                'content'=>$mentionLegal->getText()
            ];
            }
           
        }
            return $this->json(['mentions'=>$tab]);

    }
}