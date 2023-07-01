<?php

namespace App\Entity;

use App\Repository\BaggagiteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BaggagiteRepository::class)]
class Baggagite
{
        const canceled=4;


    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFrom = null;

    #[ORM\Column(type: Types::DATE_MUTABLE,nullable: true)]
    private ?\DateTimeInterface $dateTo = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeFrom = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeTo = null;

    #[ORM\Column(length: 255)]
    private ?string $adressFrom = null;

    #[ORM\Column(length: 255)]
    private ?string $adressTo = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\Column(nullable: true)]
    private array $notContain = [];

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Size $dimension = null;

      #[ORM\Column(nullable: true)]
    private array $objectType = [];

    #[ORM\Column(nullable: true)]
    private array $objectTransport = [];

    #[ORM\Column(length: 255)]
    private ?string $adresse_point_depart = null;

    #[ORM\Column(length: 255)]
    private ?string $adresse_point_arrivee = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $commentaire = null;

    #[ORM\Column]
    private array $contenuRefuse = [];

    #[ORM\OneToMany(mappedBy: 'baggagite', targetEntity: BaggisteQuery::class)]
    private Collection $baggisteQuery;

    #[ORM\Column(length: 255)]
    private ?string $typeAdresseDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $typeAdresseArrivee = null;

    #[ORM\ManyToOne(inversedBy: 'baggagites')]
    private ?Client $client = null;

    #[ORM\OneToMany(mappedBy: 'baggagist', targetEntity: Avis::class)]
    private Collection $avis;

     #[ORM\Column]
    private ?float $lat_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $long_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $lat_adresse_point_arrivee = null;

    #[ORM\Column]
    private ?float $long_adresse_point_arrivee = null;

    #[ORM\Column]
    private ?bool $canDepose = null;

    #[ORM\ManyToOne(inversedBy: 'baggagitesPointRelaisDepart')]
    private ?Client $point_relais_depart = null;

    #[ORM\ManyToOne(inversedBy: 'baggagitesPointRelaisArrivee')]
    private ?Client $point_relais_arrivee = null;

   

    public function __construct()
    {
         $this->createdAt=new \Datetime();
         $this->contenuRefuse=[];
         $this->baggisteQuery = new ArrayCollection();
         $this->avis = new ArrayCollection();
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

    public function getDateFrom(): ?\DateTimeInterface
    {
        return $this->dateFrom;
    }

    public function setDateFrom(\DateTimeInterface $dateFrom): self
    {
        $this->dateFrom = $dateFrom;

        return $this;
    }

    public function getDateTo(): ?\DateTimeInterface
    {
        return $this->dateTo;
    }

    public function setDateTo(\DateTimeInterface $dateTo): self
    {
        $this->dateTo = $dateTo;

        return $this;
    }

    public function getTimeFrom(): ?\DateTimeInterface
    {
        return $this->timeFrom;
    }

    public function setTimeFrom(\DateTimeInterface $timeFrom): self
    {
        $this->timeFrom = $timeFrom;

        return $this;
    }

    public function getTimeTo(): ?\DateTimeInterface
    {
        return $this->timeTo;
    }

    public function setTimeTo(\DateTimeInterface $timeTo): self
    {
        $this->timeTo = $timeTo;

        return $this;
    }

    public function getAdressFrom(): ?string
    {
        return $this->adressFrom;
    }

    public function setAdressFrom(string $adressFrom): self
    {
        $this->adressFrom = $adressFrom;

        return $this;
    }

    public function getAdressTo(): ?string
    {
        return $this->adressTo;
    }

    public function setAdressTo(string $adressTo): self
    {
        $this->adressTo = $adressTo;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getNotContain(): array
    {
        return $this->notContain;
    }

    public function setNotContain(?array $notContain): self
    {
        $this->notContain = $notContain;

        return $this;
    }

    public function getDimension(): ?Size
    {
        return $this->dimension;
    }

    public function setDimension(?Size $dimension): self
    {
        $this->dimension = $dimension;

        return $this;
    }

      public function getObjectType(): array
    {
        return $this->objectType;
    }

    public function setObjectType(?array $objectType): self
    {
        $this->objectType = $objectType;

        return $this;
    }

    public function getObjectTransport(): array
    {
        return $this->objectTransport;
    }

    public function setObjectTransport(?array $objectTransport): self
    {
        $this->objectTransport = $objectTransport;

        return $this;
    }

    public function getAdressePointDepart(): ?string
    {
        return $this->adresse_point_depart;
    }

    public function setAdressePointDepart(string $adresse_point_depart): self
    {
        $this->adresse_point_depart = $adresse_point_depart;

        return $this;
    }

    public function getAdressePointArrivee(): ?string
    {
        return $this->adresse_point_arrivee;
    }

    public function setAdressePointArrivee(string $adresse_point_arrivee): self
    {
        $this->adresse_point_arrivee = $adresse_point_arrivee;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(string $commentaire): self
    {
        $this->commentaire = $commentaire;

        return $this;
    }

    public function getContenuRefuse(): array
    {
        return $this->contenuRefuse;
    }

    public function setContenuRefuse(array $contenuRefuse): self
    {
        $this->contenuRefuse = $contenuRefuse;

        return $this;
    }
     public function __toString(): string
    {
        return $this->getId();
    }

     /**
      * @return Collection<int, BaggisteQuery>
      */
     public function getBaggisteQuery(): Collection
     {
         return $this->baggisteQuery;
     }

     public function addBaggisteQuery(BaggisteQuery $baggisteQuery): self
     {
         if (!$this->baggisteQuery->contains($baggisteQuery)) {
             $this->baggisteQuery->add($baggisteQuery);
             $baggisteQuery->setBaggagite($this);
         }

         return $this;
     }

     public function removeBaggisteQuery(BaggisteQuery $baggisteQuery): self
     {
         if ($this->baggisteQuery->removeElement($baggisteQuery)) {
             // set the owning side to null (unless already changed)
             if ($baggisteQuery->getBaggagite() === $this) {
                 $baggisteQuery->setBaggagite(null);
             }
         }

         return $this;
     }

     public function getTypeAdresseDepart(): ?string
     {
         return $this->typeAdresseDepart;
     }

     public function setTypeAdresseDepart(string $typeAdresseDepart): self
     {
         $this->typeAdresseDepart = $typeAdresseDepart;

         return $this;
     }

     public function getTypeAdresseArrivee(): ?string
     {
         return $this->typeAdresseArrivee;
     }

     public function setTypeAdresseArrivee(string $typeAdresseArrivee): self
     {
         $this->typeAdresseArrivee = $typeAdresseArrivee;

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

     /**
      * @return Collection<int, Avis>
      */
     public function getAvis(): Collection
     {
         return $this->avis;
     }

     public function addAvi(Avis $avi): self
     {
         if (!$this->avis->contains($avi)) {
             $this->avis->add($avi);
             $avi->setBaggagist($this);
         }

         return $this;
     }

     public function removeAvi(Avis $avi): self
     {
         if ($this->avis->removeElement($avi)) {
             // set the owning side to null (unless already changed)
             if ($avi->getBaggagist() === $this) {
                 $avi->setBaggagist(null);
             }
         }

         return $this;
     }


     public function hasDemande()
     {
        $trouve=false;
        foreach ($this->getBaggisteQuery() as $key => $query) {
            if($query->getIsValid()==1)
            {
                $trouve=true;
                
            }
        }
        return $trouve;
     }

      public function getLatAdressePointDepart(): ?float
    {
        return $this->lat_adresse_point_depart;
    }

    public function setLatAdressePointDepart(float $lat_adresse_point_depart): self
    {
        $this->lat_adresse_point_depart = $lat_adresse_point_depart;

        return $this;
    }

    public function getLongAdressePointDepart(): ?float
    {
        return $this->long_adresse_point_depart;
    }

    public function setLongAdressePointDepart(float $long_adresse_point_depart): self
    {
        $this->long_adresse_point_depart = $long_adresse_point_depart;

        return $this;
    }

    public function getLatAdressePointArrivee(): ?float
    {
        return $this->lat_adresse_point_arrivee;
    }

    public function setLatAdressePointArrivee(float $lat_adresse_point_arrivee): self
    {
        $this->lat_adresse_point_arrivee = $lat_adresse_point_arrivee;

        return $this;
    }

    public function getLongAdressePointArrivee(): ?float
    {
        return $this->long_adresse_point_arrivee;
    }

    public function setLongAdressePointArrivee(float $long_adresse_point_arrivee): self
    {
        $this->long_adresse_point_arrivee = $long_adresse_point_arrivee;

        return $this;
    }

    public function isCanDepose(): ?bool
    {
        return $this->canDepose;
    }

    public function getCanDepose(): ?bool
    {
        return $this->canDepose;
    }
    public function setCanDepose(bool $canDepose): self
    {
        $this->canDepose = $canDepose;

        return $this;
    }

    public function getPointRelaisDepart(): ?Client
    {
        return $this->point_relais_depart;
    }

    public function setPointRelaisDepart(?Client $point_relais_depart): self
    {
        $this->point_relais_depart = $point_relais_depart;

        return $this;
    }

    public function getPointRelaisArrivee(): ?Client
    {
        return $this->point_relais_arrivee;
    }

    public function setPointRelaisArrivee(?Client $point_relais_arrivee): self
    {
        $this->point_relais_arrivee = $point_relais_arrivee;

        return $this;
    }
}
