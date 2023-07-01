<?php

namespace App\Entity;

use App\Repository\favorisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FavorisRepository::class)]
class Favoris
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $type = null;

      

    #[ORM\ManyToOne(inversedBy: 'favoris')]
    private ?Baggagite $baggagist = null;

    #[ORM\ManyToOne(inversedBy: 'favoris')]
    private ?Client $client = null;
 

    #[ORM\ManyToOne(inversedBy: 'favoris')]
    private ?Advert $advert = null;

     public function __construct()
    {
        
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?int
    {
        return $this->type;
    }

    public function setType(int $type): self
    {
        $this->type = $type;

        return $this;
    }

    

    public function setPonctualite(int $ponctualite): self
    {
        $this->ponctualite = $ponctualite;

        return $this;
    }

    

    

    public function getBaggagist(): ?Baggagite
    {
        return $this->baggagist;
    }

    public function setBaggagist(?Baggagite $baggagist): self
    {
        $this->baggagist = $baggagist;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }



    public function getAdvert(): ?Advert
    {
        return $this->advert;
    }

    public function setAdvert(?Advert $advert): self
    {
        $this->advert = $advert;

        return $this;
    }
}
