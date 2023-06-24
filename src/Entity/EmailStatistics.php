<?php

namespace App\Entity;

use App\Repository\EmailStatisticsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EmailStatisticsRepository::class)]
class EmailStatistics
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'integer')]
    private $nbre;

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    #[ORM\Column(type: 'string', length: 255)]
    private $object;

    #[ORM\Column(type: 'text')]
    private $message;

    #[ORM\Column(type: 'string', length: 255)]
    private $typeEnvoi;

    #[ORM\Column(type: 'string', length: 255)]
    private $type;

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

    public function getObject(): ?string
    {
        return $this->object;
    }

    public function setObject(string $object): self
    {
        $this->object = $object;

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

    public function getTypeEnvoi(): ?string
    {
        return $this->typeEnvoi;
    }

    public function setTypeEnvoi(string $typeEnvoi): self
    {
        $this->typeEnvoi = $typeEnvoi;

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
}
