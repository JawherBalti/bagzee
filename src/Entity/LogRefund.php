<?php

namespace App\Entity;

use App\Repository\LogRefundRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LogRefundRepository::class)]
class LogRefund
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $proprietaire = null;

    #[ORM\Column]
    private ?float $montant = null;

    #[ORM\ManyToOne(inversedBy: 'logRefunds')]
    private ?AdvertQuery $advertQuery = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $contraite = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $refund = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $transfert = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $error = null;

    #[ORM\ManyToOne(inversedBy: 'logRefunds')]
    private ?BaggisteQuery $bagagisteQuery = null;

    #[ORM\Column]
    private ?float $montantTransferer = null;

     public function __construct()
    {
        $this->montantTransferer = 0;
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProprietaire(): ?int
    {
        return $this->proprietaire;
    }

    public function setProprietaire(int $proprietaire): self
    {
        $this->proprietaire = $proprietaire;

        return $this;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant(float $montant): self
    {
        $this->montant = $montant;

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

    public function getContraite(): ?string
    {
        return $this->contraite;
    }

    public function setContraite(string $contraite): self
    {
        $this->contraite = $contraite;

        return $this;
    }

    public function getRefund(): ?string
    {
        return $this->refund;
    }

    public function setRefund(?string $refund): self
    {
        $this->refund = $refund;

        return $this;
    }

    public function getTransfert(): ?string
    {
        return $this->transfert;
    }

    public function setTransfert(?string $transfert): self
    {
        $this->transfert = $transfert;

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

    public function getError(): ?string
    {
        return $this->error;
    }

    public function setError(?string $error): self
    {
        $this->error = $error;

        return $this;
    }

    public function getBagagisteQuery(): ?BaggisteQuery
    {
        return $this->bagagisteQuery;
    }

    public function setBagagisteQuery(?BaggisteQuery $bagagisteQuery): self
    {
        $this->bagagisteQuery = $bagagisteQuery;

        return $this;
    }

    public function getMontantTransferer(): ?float
    {
        return $this->montantTransferer;
    }

    public function setMontantTransferer(float $montantTransferer): self
    {
        $this->montantTransferer = $montantTransferer;

        return $this;
    }
}
