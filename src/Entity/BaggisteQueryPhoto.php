<?php

namespace App\Entity;

use App\Repository\BaggisteQueryPhotoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BaggisteQueryPhotoRepository::class)]
class BaggisteQueryPhoto
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[ORM\ManyToOne(inversedBy: 'photos')]
    private ?BaggisteQuery $baggisteQuery = null;


    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;

        return $this;
    }

    public function getBaggisteQuery(): ?BaggisteQuery
    {
        return $this->baggisteQuery;
    }

    public function setBaggisteQuery(?BaggisteQuery $baggisteQuery): self
    {
        $this->baggisteQuery = $baggisteQuery;

        return $this;
    }
}
