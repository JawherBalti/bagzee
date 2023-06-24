<?php

namespace App\Entity;

use App\Repository\VehiculeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttHttpFoundationpFoundation\File\File;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[ORM\Entity(repositoryClass: VehiculeRepository::class)]
class Vehicule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    private ?Client $client = null;

    private $fileV;

    #[ORM\Column(length: 255)]
    private ?string $nomVehicule = null;


    public function __construct()
    {
        $this->createdAt=new \Datetime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): self
    {
        $this->photo = $photo;

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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

     public function __toString(): string
    {
        return $this->getName();
    }

     public function setFileV(?UploadedFile $fileV = null): void
    {
        $this->fileV = $fileV;
    }

    public function getFileV(): ?UploadedFile
    {
        return $this->fileV;
    }

    public function getNomVehicule(): ?string
    {
        return $this->nomVehicule;
    }

    public function setNomVehicule(string $nomVehicule): self
    {
        $this->nomVehicule = $nomVehicule;

        return $this;
    }
}
