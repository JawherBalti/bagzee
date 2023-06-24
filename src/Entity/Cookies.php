<?php

namespace App\Entity;

use App\Repository\CookiesRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CookiesRepository::class)]
class Cookies
{
        #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id ;
    
    #[ORM\Column(type: 'text')]
    private $text;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): self
    {
        $this->text = $text;

        return $this;
    }
     public function __toString(): string
    {
        return $this->getId();
    }
}
