<?php

namespace App\Entity;

use App\Repository\DocumentRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DocumentRepository::class)]
class Document
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $cin = null;

    #[ORM\Column(length: 255)]
    private ?string $permis = null;

    #[ORM\Column(length: 255)]
    private ?string $casier = null;

    #[ORM\Column(length: 255)]
    private ?string $sanitaire = null;

    #[ORM\Column(length: 255)]
    private ?string $kbis = null;

    #[ORM\Column(length: 255)]
    private ?string $carteEUR = null;

    #[ORM\Column(length: 255)]
    private ?string $facture = null;

    #[ORM\Column(length: 255)]
    private ?string $justification = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Client $client = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCin(): ?string
    {
        return $this->cin;
    }

    public function setCin(string $cin): self
    {
        $this->cin = $cin;

        return $this;
    }

    public function getPermis(): ?string
    {
        return $this->permis;
    }

    public function setPermis(string $permis): self
    {
        $this->permis = $permis;

        return $this;
    }

    public function getCasier(): ?string
    {
        return $this->casier;
    }

    public function setCasier(string $casier): self
    {
        $this->casier = $casier;

        return $this;
    }

    public function getSanitaire(): ?string
    {
        return $this->sanitaire;
    }

    public function setSanitaire(string $sanitaire): self
    {
        $this->sanitaire = $sanitaire;

        return $this;
    }

    public function getKbis(): ?string
    {
        return $this->kbis;
    }

    public function setKbis(string $kbis): self
    {
        $this->kbis = $kbis;

        return $this;
    }

    public function getCarteEUR(): ?string
    {
        return $this->carteEUR;
    }

    public function setCarteEUR(string $carteEUR): self
    {
        $this->carteEUR = $carteEUR;

        return $this;
    }

    public function getFacture(): ?string
    {
        return $this->facture;
    }

    public function setFacture(string $facture): self
    {
        $this->facture = $facture;

        return $this;
    }

    public function getJustification(): ?string
    {
        return $this->justification;
    }

    public function setJustification(string $justification): self
    {
        $this->justification = $justification;

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
}
