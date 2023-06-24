<?php

namespace App\Entity;

use App\Repository\BlogRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[ORM\Entity(repositoryClass: BlogRepository::class)]
class Blog
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $publish = null;

    private $file;

        #[ORM\Column(type: Types::TEXT)]
        private ?string $url = null;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPublish(): ?\DateTimeInterface
    {
        return $this->publish;
    }

    public function setPublish(\DateTimeInterface $publish): self
    {
        $this->publish = $publish;

        return $this;
    }

     public function __toString(): string
    {
        return $this->getTitle();
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
      public function setFile(?UploadedFile $file = null): void
    {
        $this->file = $file;
    }

    public function getFile(): ?UploadedFile
    {
        return $this->file;
    }
}
