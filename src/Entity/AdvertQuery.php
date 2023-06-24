<?php

namespace App\Entity;

use App\Repository\AdvertQueryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AdvertQueryRepository::class)]
class AdvertQuery
{
    const pending=0;
     const valid=1;
     const refused=2;
     
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'advertQueries')]
    private ?Client $client = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column]
    private ?int $status = null;

    #[ORM\ManyToOne(inversedBy: 'advertQueries')]
    private ?Advert $advert = null;


    #[ORM\Column]
    private array $objectRelaisDepart = [];
    #[ORM\Column]
    private array $objectRelaisArriv = [];

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

      #[ORM\Column(length: 255)]
    private ?string $fromAdress = null;

    #[ORM\Column(length: 255)]
    private ?string $toAdress = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

     #[ORM\Column(nullable: true)]
    private array $objectType = [];

    #[ORM\Column(nullable: true)]
    private array $objectTransport = [];

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateFrom = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $dateTo = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeFrom = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    private ?\DateTimeInterface $timeTo = null;

    #[ORM\Column]
    private array $objectContenu = [];


     #[ORM\Column(length: 255)]
    private ?string $adressPointDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $adressPointArrivee = null;


     #[ORM\Column(length: 255)]
    private ?string $typeAdressDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $typeAdresseArrivee = null;


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

    #[ORM\Column]
    private ?int $isValid = null;

    #[ORM\OneToMany(mappedBy: 'advertQuery', targetEntity: LogRefund::class)]
    private Collection $logRefunds;

    #[ORM\Column]
    private ?float $lat_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $long_adresse_point_depart = null;

    #[ORM\Column]
    private ?float $lat_adresse_point_arrivee = null;

    #[ORM\Column]
    private ?float $long_adresse_point_arrivee = null;

    #[ORM\ManyToOne(inversedBy: 'advertQueriesPointDepart')]
    private ?Client $point_relais_depart = null;

    #[ORM\ManyToOne(inversedBy: 'advertQueriesPointRelaisArrivee')]
    private ?Client $point_relais_arrivee = null;

  
   

     public function __construct()
    {
        $this->status=0;
        $this->paied=0;
        $this->createdAt=new \Datetime();
        $this->total=0;
        $this->isValid=0;
        $this->logRefunds = new ArrayCollection();
        $this->objectRelaisDepart=[];
        $this->objectRelaisArriv=[];

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

    public function getobjectRelaisDepart(): array
    {
        return $this->objectRelaisDepart;
    }

    public function setobjectRelaisDepart(array $objectRelaisDepart): self
    {
        $this->objectRelaisDepart = $objectRelaisDepart;

        return $this;
    }

    public function getobjectRelaisArriv(): array
    {
        return $this->objectRelaisArriv;
    }

    public function setobjectRelaisArriv(array $objectRelaisArriv): self
    {
        $this->objectRelaisArriv = $objectRelaisArriv;

        return $this;
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

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getAdvert(): ?Advert
    {
        return $this->advert;
    }

    public function setAdvert(?Advert $advert): self
    {
        $this->advert = $advert;

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

     public function getFromAdress(): ?string
    {
        return $this->fromAdress;
    }

    public function setFromAdress(string $fromAdress): self
    {
        $this->fromAdress = $fromAdress;

        return $this;
    }

    public function getToAdress(): ?string
    {
        return $this->toAdress;
    }

    public function setToAdress(string $toAdress): self
    {
        $this->toAdress = $toAdress;

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

     public function getObjectContenu(): array
    {
        return $this->objectContenu;
    }

    public function setObjectContenu(array $objectContenu): self
    {
        $this->objectContenu = $objectContenu;

        return $this;
    }


     public function getAdressPointDepart(): ?string
    {
        return $this->adressPointDepart;
    }

    public function setAdressPointDepart(string $adressPointDepart): self
    {
        $this->adressPointDepart = $adressPointDepart;

        return $this;
    }

    public function getAdressPointArrivee(): ?string
    {
        return $this->adressPointArrivee;
    }

    public function setAdressPointArrivee(string $adressPointArrivee): self
    {
        $this->adressPointArrivee = $adressPointArrivee;

        return $this;
    }


     public function getTypeAdressDepart(): ?string
    {
        return $this->typeAdressDepart;
    }

    public function setTypeAdressDepart(string $typeAdressDepart): self
    {
        $this->typeAdressDepart = $typeAdressDepart;

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

    public function setPaied(bool $paied): self
    {
        $this->paied = $paied;

        return $this;
    }

    public function getIsPaied(): ?bool
    {
        return $this->isPaied();
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

    public function getIsValid(): ?int
    {
        return $this->isValid;
    }

    public function setIsValid(int $isValid): self
    {
        $this->isValid = $isValid;

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
            $logRefund->setAdvertQuery($this);
        }

        return $this;
    }

    public function removeLogRefund(LogRefund $logRefund): self
    {
        if ($this->logRefunds->removeElement($logRefund)) {
            // set the owning side to null (unless already changed)
            if ($logRefund->getAdvertQuery() === $this) {
                $logRefund->setAdvertQuery(null);
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
