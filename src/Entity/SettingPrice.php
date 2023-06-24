<?php

namespace App\Entity;

use App\Repository\SettingPriceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SettingPriceRepository::class)]
class SettingPrice
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;
     #[ORM\Column]
    private ?bool $isRelais = false;

 public function __construct()
    {
         $this->isRelais=0;
        
    }
    public function getIsRelais(): ?bool
    {
        return $this->isRelais;
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }
      public function setIsRelais(bool $isRelais): self
    {
         $this->isRelais = $isRelais;

        return $this;
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
}
