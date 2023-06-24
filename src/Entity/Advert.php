<?php

namespace App\Entity;

use App\Repository\AdvertRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AdvertRepository::class)]
class Advert
{

    const canceled=4;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $fromAdress = null;

    #[ORM\Column(length: 255)]
    private ?string $toAdress = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'adverts')]
    private ?Client $client = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;


    #[ORM\Column]
    private ?int $status = null;

   

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Size $dimension = null;

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
    private ?float $price = null;
    #[ORM\Column]
    private ?float $priceNet = null;

    #[ORM\Column]
    private array $objectContenu = [];

    #[ORM\Column]
    private array $objectRelaisDepart = [];
     #[ORM\Column]
    private array $objectRelaisArriv = [];

    #[ORM\OneToMany(mappedBy: 'advert', targetEntity: Image::class,cascade: ['persist', 'remove'])]
    private Collection $images;

    #[ORM\Column(length: 255)]
    private ?string $adressPointDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $adressPointArrivee = null;

    #[ORM\OneToMany(mappedBy: 'advert', targetEntity: AdvertQuery::class)]
    private Collection $advertQueries;

    #[ORM\Column(length: 255)]
    private ?string $typeAdressDepart = null;

    #[ORM\Column(length: 255)]
    private ?string $typeAdresseArrivee = null;

    #[ORM\OneToMany(mappedBy: 'advert', targetEntity: Avis::class)]
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

    #[ORM\ManyToOne(inversedBy: 'advertsPointRelaisDepart')]
    private ?Client $point_relais_depart = null;

    #[ORM\ManyToOne(inversedBy: 'advertsPointRelaisArrivee')]
    private ?Client $point_relais_arrivee = null;

    public function __construct()
    {
       
        $this->createdAt=new \Datetime();
        $this->price=0;
        $this->priceNet=0;
        $this->images = new ArrayCollection();
        $this->objectContenu=[];
        $this->objectRelaisDepart=[];
         $this->objectRelaisArriv=[];

        $this->advertQueries = new ArrayCollection();
        $this->avis = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

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

   

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

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

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }
    public function getPriceNet(): ?float
    {
        return $this->priceNet;
    }

    public function setPriceNet(float $priceNet): self
    {
        $this->priceNet = $priceNet;

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

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setAdvert($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getAdvert() === $this) {
                $image->setAdvert(null);
            }
        }

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

    public function __toString(): string
    {
        return $this->getId();
    }

    /**
     * @return Collection<int, AdvertQuery>
     */
    public function getAdvertQueries(): Collection
    {
        return $this->advertQueries;
    }

    public function addAdvertQuery(AdvertQuery $advertQuery): self
    {
        if (!$this->advertQueries->contains($advertQuery)) {
            $this->advertQueries->add($advertQuery);
            $advertQuery->setAdvert($this);
        }

        return $this;
    }

    public function removeAdvertQuery(AdvertQuery $advertQuery): self
    {
        if ($this->advertQueries->removeElement($advertQuery)) {
            // set the owning side to null (unless already changed)
            if ($advertQuery->getAdvert() === $this) {
                $advertQuery->setAdvert(null);
            }
        }

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
            $avi->setAdvert($this);
        }

        return $this;
    }

    public function removeAvi(Avis $avi): self
    {
        if ($this->avis->removeElement($avi)) {
            // set the owning side to null (unless already changed)
            if ($avi->getAdvert() === $this) {
                $avi->setAdvert(null);
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

    public function isCanDepose(): ?bool
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
