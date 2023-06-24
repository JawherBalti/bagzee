<?php

namespace App\Entity;

use App\Repository\WorkingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WorkingRepository::class)]
class Working
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $contenu = null;

    #[ORM\Column]
    private ?bool $work = null;

    #[ORM\Column]
    private ?int $days = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $morningFrom = null;

    #[ORM\Column(type: Types::TIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $morningTo = null;

    #[ORM\Column(type: Types::TIME_MUTABLE,nullable: true)]
    private ?\DateTimeInterface $afternoonFrom = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $afternoonTo = null;

    #[ORM\Column]
    private ?int $week = null;

    #[ORM\ManyToOne(inversedBy: 'workings')]
    private ?Client $client = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isContenu(): ?bool
    {
        return $this->contenu;
    }

    public function setContenu(bool $contenu): self
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function isWork(): ?bool
    {
        return $this->work;
    }

    public function setWork(bool $work): self
    {
        $this->work = $work;

        return $this;
    }

    public function getDays(): ?int
    {
        return $this->days;
    }

    public function setDays(int $days): self
    {
        $this->days = $days;

        return $this;
    }

    public function getMorningFrom(): ?\DateTimeInterface
    {
        return $this->morningFrom;
    }

    public function setMorningFrom(\DateTimeInterface $morningFrom): self
    {
        $this->morningFrom = $morningFrom;

        return $this;
    }

    public function getMorningTo(): ?\DateTimeInterface
    {
        return $this->morningTo;
    }

    public function setMorningTo(?\DateTimeInterface $morningTo): self
    {
        $this->morningTo = $morningTo;

        return $this;
    }

    public function getAfternoonFrom(): ?\DateTimeInterface
    {
        return $this->afternoonFrom;
    }

    public function setAfternoonFrom(?\DateTimeInterface $afternoonFrom): self
    {
        $this->afternoonFrom = $afternoonFrom;

        return $this;
    }

    public function getAfternoonTo(): ?\DateTimeInterface
    {
        return $this->afternoonTo;
    }

    public function setAfternoonTo(\DateTimeInterface $afternoonTo): self
    {
        $this->afternoonTo = $afternoonTo;

        return $this;
    }

    public function getWeek(): ?int
    {
        return $this->week;
    }

    public function setWeek(int $week): self
    {
        $this->week = $week;

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
