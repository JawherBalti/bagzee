<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Blog;
use App\Repository\BlogRepository;

/**
 * @Route("/api/blog", name="api_")
 */

class BlogController extends AbstractController
{
	 /**
     * @Route("/list", name="blog_list",methods={"GET"})
     */
   public function blog_list(BlogRepository $blogRepository)
   {
   	$object=[];
   	$blogs=$blogRepository->findBy([],['title'=>'asc']);
   	if($blogs)
   	{
   		foreach ($blogs as $key => $blog) {
   			$object[]=[
   				'id'=>$blog->getId(),
   				'title'=>$blog->getTitle(),
               'description'=>$blog->getDescription(),
               'des'=>strip_tags($blog->getDescription()),
   				'url'=>$blog->getUrl(),
   				'image'=>$blog->getImage(),
   				'date_publish'=>date_format($blog->getPublish(),'d-m-Y'),
   			];
   		}
   	}


   	    return $this->json(['blogs'=>$object]);

   }
}