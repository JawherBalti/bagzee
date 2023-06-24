<?php

namespace App\Entity;

use App\Repository\SmsStatisticsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SmsStatisticsRepository::class)]
class SmsStatistics
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer')]
    private $nbre;

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    #[ORM\Column(type: 'text')]
    private $message;

    #[ORM\Column(type: 'string', length: 255)]
    private $typeEnvoie;

    #[ORM\Column(type: 'string', length: 255)]
    private $type;

    #[ORM\Column]
    private array $client_id = [];

    #[ORM\Column]
    private array $client_name = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNbre(): ?int
    {
        return $this->nbre;
    }

    public function setNbre(int $nbre): self
    {
        $this->nbre = $nbre;

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

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getTypeEnvoie(): ?string
    {
        return $this->typeEnvoie;
    }

    public function setTypeEnvoie(string $typeEnvoie): self
    {
        $this->typeEnvoie = $typeEnvoie;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getClientId(): array
    {
        return $this->client_id;
    }

    public function setClientId(array $client_id): self
    {
        $this->client_id = $client_id;

        return $this;
    }

    public function getClientName(): array
    {
        return $this->client_name;
    }

    public function setClientName(array $client_name): self
    {
        $this->client_name = $client_name;

        return $this;
    }
}
