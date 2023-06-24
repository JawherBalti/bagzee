<?php

namespace App\Entity;

use App\Repository\AvisRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AvisRepository::class)]
class Avis
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $etatBagage = null;

    #[ORM\Column]
    private ?int $respectSecurite = null;

    #[ORM\Column]
    private ?int $ponctualite = null;

    #[ORM\Column]
    private ?int $courtoisie = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $descAvis = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    private ?Baggagite $baggagist = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    private ?Client $client = null;
       #[ORM\ManyToOne(inversedBy: 'avis')]
    private ?Client $clientNoted = null;

    #[ORM\ManyToOne(inversedBy: 'avis')]
    private ?Advert $advert = null;

     public function __construct()
    {
         $this->createdAt=new \Datetime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEtatBagage(): ?int
    {
        return $this->etatBagage;
    }

    public function setEtatBagage(int $etatBagage): self
    {
        $this->etatBagage = $etatBagage;

        return $this;
    }

    public function getRespectSecurite(): ?int
    {
        return $this->respectSecurite;
    }

    public function setRespectSecurite(int $respectSecurite): self
    {
        $this->respectSecurite = $respectSecurite;

        return $this;
    }

    public function getPonctualite(): ?int
    {
        return $this->ponctualite;
    }

    public function setPonctualite(int $ponctualite): self
    {
        $this->ponctualite = $ponctualite;

        return $this;
    }

    public function getCourtoisie(): ?int
    {
        return $this->courtoisie;
    }

    public function setCourtoisie(int $courtoisie): self
    {
        $this->courtoisie = $courtoisie;

        return $this;
    }

    public function getDescAvis(): ?string
    {
        return $this->descAvis;
    }

    public function setDescAvis(?string $descAvis): self
    {
        $this->descAvis = $descAvis;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

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

      public function getClientNoted(): ?Client
    {
        return $this->clientNoted;
    }

    public function setClientNoted(?Client $clientNoted): self
    {
        $this->clientNoted = $clientNoted;

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
