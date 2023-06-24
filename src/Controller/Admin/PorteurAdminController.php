<?php

namespace App\Controller\Admin;

use App\Repository\PorteurRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class PorteurAdminController extends AbstractController
{
    /**
     * @Route("/admin/porteur/delete/{id}", name="delete_porteur", requirements={"id" = "\d+"})
     */
    public function clientAction(Request $request,$id,PorteurRepository $porteurRepository,EntityManagerInterface $entityManager): Response
    {
        $client=$porteurRepository->find($id);
        $client->setDeleted(1);
        $entityManager->flush();
        return $this->redirectToRoute('admin_app_porteur_list');

    }
}

