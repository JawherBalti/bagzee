<?php

namespace App\Entity;

use App\Repository\CodePromosSubscriptionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CodePromosSubscriptionRepository::class)]
class CodePromosSubscription
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'date')]
    private $createdAt;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'date')]
    private $start;

    #[ORM\Column(type: 'date')]
    private $end;

    #[ORM\Column(type: 'integer')]
    private $qte;

    #[ORM\Column(type: 'float')]
    private $reduce;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $stripeCoupon;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

      public function __toString()
    {
        return $this->name;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getStart(): ?\DateTimeInterface
    {
        return $this->start;
    }

    public function setStart(\DateTimeInterface $start): self
    {
        $this->start = $start;

        return $this;
    }

    public function getEnd(): ?\DateTimeInterface
    {
        return $this->end;
    }

    public function setEnd(\DateTimeInterface $end): self
    {
        $this->end = $end;

        return $this;
    }

    public function getQte(): ?int
    {
        return $this->qte;
    }

    public function setQte(int $qte): self
    {
        $this->qte = $qte;

        return $this;
    }

    public function getReduce(): ?float
    {
        return $this->reduce;
    }

    public function setReduce(float $reduce): self
    {
        $this->reduce = $reduce;

        return $this;
    }

    public function getStripeCoupon(): ?string
    {
        return $this->stripeCoupon;
    }

    public function setStripeCoupon(?string $stripeCoupon): self
    {
        $this->stripeCoupon = $stripeCoupon;

        return $this;
    }
}
