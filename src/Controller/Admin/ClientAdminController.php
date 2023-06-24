<?php

namespace App\Controller\Admin;

use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class ClientAdminController extends AbstractController
{
    /**
     * @Route("/admin/client/delete/{id}", name="delete_client", requirements={"id" = "\d+"})
     */
    public function clientAction(Request $request,$id,ClientRepository $clientRepository,EntityManagerInterface $entityManager): Response
    {
        $client=$clientRepository->find($id);
        $client->setDeleted(1);
        $entityManager->flush();
        return $this->redirectToRoute('admin_app_client_list');

    }
}

