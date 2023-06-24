<?php

namespace App\Entity;

use App\Repository\BaggisteQueryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BaggisteQueryRepository::class)]
class BaggisteQuery
{


     const pending=0;
     const valid=1;
     const refused=2;



    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'baggisteQueries')]
    private ?Client $client = null;

    #[ORM\Column]
    private array $contenuTransporter = [];

    #[ORM\Column]
    private ?float $prix = null;

    #[ORM\Column]
    private ?float $prixNet = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\OneToMany(mappedBy: 'baggisteQuery', targetEntity: BaggisteQueryPhoto::class)]
    private Collection $photos;

    #[ORM\ManyToOne(inversedBy: 'baggisteQuery')]
    private ?Baggagite $baggagite = null;

    #[ORM\Column(nullable: true)]
    private array $contenuRefuse = [];


     #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFrom = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateTo = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeFrom = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeTo = null;


     #[ORM\Column(length: 255)]
    private ?string $adressFrom = null;

    #[ORM\Column(length: 255)]
    private ?string $adressTo = null;

     #[ORM\Column(nullable: true)]
    private array $notContain = [];

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

     #[ORM\Column(length: 255)]
    private ?string $typeAdresseDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $typeAdresseArrivee = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;


    #[ORM\Column]
    private ?float $width = null;

    #[ORM\Column]
    private ?float $height = null;

    #[ORM\Column]
    private ?float $length = null;

    #[ORM\Column]
    private ?int $weight = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $raisonRefus = null;

    #[ORM\Column]
    private ?float $total = null;

    #[ORM\Column]
    private ?int $isValid = null;

       #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripePaymentMethode = null;

    #[ORM\Column]
    private ?bool $paied = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $codePromos = null;

    #[ORM\Column(nullable: true)]
    private ?float $reduce = null;

    #[ORM\Column(nullable: true)]
    private ?float $oldTotal = null;

    #[ORM\OneToMany(mappedBy: 'bagagisteQuery', targetEntity: LogRefund::class)]
    private Collection $logRefunds;


    #[ORM\Column]
    private ?float $lat_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $long_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $lat_adresse_point_arrivee = null;

    #[ORM\Column]
    private ?float $long_adresse_point_arrivee = null;

    #[ORM\ManyToOne(inversedBy: 'baggisteQueriesPointRelaisDepart')]
    private ?Client $point_relais_depart = null;

    #[ORM\ManyToOne(inversedBy: 'baggisteQueriesPointRelaisArrivee')]
    private ?Client $point_relais_arrivee = null;
      #[ORM\Column(nullable: true)]
    private array $objectPriceSetting = [];

    public function __construct()
    {
        $this->photos = new ArrayCollection();
        $this->status =0;
        $this->createdAt=new \Datetime();
        $this->isValid=0;
        $this->paied=0;
        $this->total=0;
        $this->logRefunds = new ArrayCollection();
       // $this->objectPriceSetting=$objectPriceSetting;


    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getContenuTransporter(): array
    {
        return $this->contenuTransporter;
    }

    public function setContenuTransporter(array $contenuTransporter): self
    {
        $this->contenuTransporter = $contenuTransporter;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): self
    {
        $this->prix = $prix;

        return $this;
    }
    public function getPrixNet(): ?float
    {
        return $this->prixNet;
    }

    public function setPrixNet(float $prixNet): self
    {
        $this->prixNet = $prixNet;

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

 public function getobjectPriceSetting(): array
    {
        return $this->objectPriceSetting;
    }

    public function setobjectPriceSetting(?array $objectPriceSetting): self
    {
        $this->objectPriceSetting = $objectPriceSetting;

        return $this;
    }

    /**
     * @return Collection<int, BaggisteQueryPhoto>
     */
    public function getPhotos(): Collection
    {
        return $this->photos;
    }

    public function addPhoto(BaggisteQueryPhoto $photo): self
    {
        if (!$this->photos->contains($photo)) {
            $this->photos->add($photo);
            $photo->setBaggisteQuery($this);
        }

        return $this;
    }

    public function removePhoto(BaggisteQueryPhoto $photo): self
    {
        if ($this->photos->removeElement($photo)) {
            // set the owning side to null (unless already changed)
            if ($photo->getBaggisteQuery() === $this) {
                $photo->setBaggisteQuery(null);
            }
        }

        return $this;
    }

    public function getBaggagite(): ?Baggagite
    {
        return $this->baggagite;
    }

    public function setBaggagite(?Baggagite $baggagite): self
    {
        $this->baggagite = $baggagite;

        return $this;
    }

    public function getContenuRefuse(): array
    {
        return $this->contenuRefuse;
    }

    public function setContenuRefuse(?array $contenuRefuse): self
    {
        $this->contenuRefuse = $contenuRefuse;

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

      public function getWidth(): ?float
    {
        return $this->width;
    }

    public function setWidth(float $width): self
    {
        $this->width = $width;

        return $this;
    }

    public function getHeight(): ?float
    {
        return $this->height;
    }

    public function setHeight(float $height): self
    {
        $this->height = $height;

        return $this;
    }

    public function getLength(): ?float
    {
        return $this->length;
    }

    public function setLength(float $length): self
    {
        $this->length = $length;

        return $this;
    }

    public function getWeight(): ?int
    {
        return $this->weight;
    }

    public function setWeight(int $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getRaisonRefus(): ?string
    {
        return $this->raisonRefus;
    }

    public function setRaisonRefus(?string $raisonRefus): self
    {
        $this->raisonRefus = $raisonRefus;

        return $this;
    }

    public function getTotal(): ?float
    {
        return $this->total;
    }

    public function setTotal(float $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function getIsValid(): ?int
    {
        return $this->isValid;
    }

    public function setIsValid(int $isValid): self
    {
        $this->isValid = $isValid;

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

    public function getStripePaymentMethode(): ?string
    {
        return $this->stripePaymentMethode;
    }

    public function setStripePaymentMethode(?string $stripePaymentMethode): self
    {
        $this->stripePaymentMethode = $stripePaymentMethode;

        return $this;
    }

    public function isPaied(): ?bool
    {
        return $this->paied;
    }

    public function getIsPaied(): ?bool
    {
        return $this->isPaied();
    }
    public function setPaied(bool $paied): self
    {
        $this->paied = $paied;

        return $this;
    }

    public function getCodePromos(): ?string
    {
        return $this->codePromos;
    }

    public function setCodePromos(?string $codePromos): self
    {
        $this->codePromos = $codePromos;

        return $this;
    }

    public function getReduce(): ?float
    {
        return $this->reduce;
    }

    public function setReduce(?float $reduce): self
    {
        $this->reduce = $reduce;

        return $this;
    }

    public function getOldTotal(): ?float
    {
        return $this->oldTotal;
    }

    public function setOldTotal(?float $oldTotal): self
    {
        $this->oldTotal = $oldTotal;

        return $this;
    }

    /**
     * @return Collection<int, LogRefund>
     */
    public function getLogRefunds(): Collection
    {
        return $this->logRefunds;
    }

    public function addLogRefund(LogRefund $logRefund): self
    {
        if (!$this->logRefunds->contains($logRefund)) {
            $this->logRefunds->add($logRefund);
            $logRefund->setBagagisteQuery($this);
        }

        return $this;
    }

    public function removeLogRefund(LogRefund $logRefund): self
    {
        if ($this->logRefunds->removeElement($logRefund)) {
            // set the owning side to null (unless already changed)
            if ($logRefund->getBagagisteQuery() === $this) {
                $logRefund->setBagagisteQuery(null);
            }
        }

        return $this;
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
