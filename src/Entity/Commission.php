<?php

namespace App\Entity;

use App\Repository\CommissionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommissionRepository::class)]
class Commission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $bagzee = null;

    #[ORM\Column]
    private ?float $porteur = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?AdvertQuery $advertQuery = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?BaggisteQuery $baggagisteQuery = null;


    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBagzee(): ?float
    {
        return $this->bagzee;
    }

    public function setBagzee(float $bagzee): self
    {
        $this->bagzee = $bagzee;

        return $this;
    }

    public function getPorteur(): ?float
    {
        return $this->porteur;
    }

    public function setPorteur(float $porteur): self
    {
        $this->porteur = $porteur;

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

    public function getAdvertQuery(): ?AdvertQuery
    {
        return $this->advertQuery;
    }

    public function setAdvertQuery(?AdvertQuery $advertQuery): self
    {
        $this->advertQuery = $advertQuery;

        return $this;
    }

    public function getBaggagisteQuery(): ?BaggisteQuery
    {
        return $this->baggagisteQuery;
    }

    public function setBaggagisteQuery(?BaggisteQuery $baggagisteQuery): self
    {
        $this->baggagisteQuery = $baggagisteQuery;

        return $this;
    }
}
