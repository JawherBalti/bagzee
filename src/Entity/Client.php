<?php

namespace App\Entity;

use App\Repository\ClientRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\String\ByteString;
use Symfony\Component\HttHttpFoundationpFoundation\File\File;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
class Client implements UserInterface,PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $firstname;

    #[ORM\Column(type: 'string', length: 255)]
    private $lastname;

     #[ORM\Column(length: 255, nullable: true)]
    private ?string $entreprise = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siret = null;

    /**
     * @var string The hashed password
     */
    #[ORM\Column(type: 'string')]
    private string $password;

    private ?string $plainPassword = null;

    #[ORM\Column(type: 'string', length: 255)]
    private $email;


    #[ORM\Column(type: 'string', length: 255)]
    private $gender;

    #[ORM\Column(type: 'date')]
    private $birdh;

   

    #[ORM\Column(type: 'string', length: 255)]
    private $phone;

   

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $photo;

    #[ORM\Column(type: 'datetime')]
    private $updated;
    
    #[ORM\Column(type: 'boolean')]
    private $deleted;

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    #[ORM\Column(type: 'text')]
    private $token;

    #[ORM\Column(type: 'text')]
    private $description;

    #[ORM\Column(type: 'json')]
    private array $roles = [];

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Advert::class)]
    private Collection $adverts;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripeCustomerId = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripeAccount = null;
    
    private $file;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nationalite = null;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Vehicule::class,cascade: ['persist', 'remove'])]
    private Collection $vehicules;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: BaggisteQuery::class)]
    private Collection $baggisteQueries;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: AdvertQuery::class)]
    private Collection $advertQueries;

    #[ORM\OneToMany(mappedBy: 'clients', targetEntity: PhotoClient::class)]
    private Collection $photoClients;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripePaymentMethod = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $stripeBanqueAccount = null;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Baggagite::class)]
    private Collection $baggagites;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Avis::class)]
    private Collection $avis;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Adress::class)]
    private Collection $adresses;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Working::class)]
    private Collection $workings;

    #[ORM\OneToMany(mappedBy: 'point_relais_depart', targetEntity: AdvertQuery::class)]
    private Collection $advertQueriesPointDepart;

    #[ORM\OneToMany(mappedBy: 'point_relais_arrivee', targetEntity: AdvertQuery::class)]
    private Collection $advertQueriesPointRelaisArrivee;

    #[ORM\OneToMany(mappedBy: 'point_relais_depart', targetEntity: BaggisteQuery::class)]
    private Collection $baggisteQueriesPointRelaisDepart;

    #[ORM\OneToMany(mappedBy: 'point_relais_arrivee', targetEntity: BaggisteQuery::class)]
    private Collection $baggisteQueriesPointRelaisArrivee;

    #[ORM\OneToMany(mappedBy: 'point_relais_depart', targetEntity: Advert::class)]
    private Collection $advertsPointRelaisDepart;

    #[ORM\OneToMany(mappedBy: 'point_relais_arrivee', targetEntity: Advert::class)]
    private Collection $advertsPointRelaisArrivee;

    #[ORM\OneToMany(mappedBy: 'point_relais_depart', targetEntity: Baggagite::class)]
    private Collection $baggagitesPointRelaisDepart;

    #[ORM\OneToMany(mappedBy: 'point_relais_arrivee', targetEntity: Baggagite::class)]
    private Collection $baggagitesPointRelaisArrivee;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Signalement::class)]
    private Collection $signalements;

 

    /**
     * @param $updated
     */
    public function __construct()
    {
        $this->updated = new \DateTime();
        $this->createdAt=new \DateTime();
        $this->deleted=0;
        $this->setRoles(["ROLE_USER"]);
        $this->setToken(ByteString::fromRandom(32)->toString());
        $this->adverts = new ArrayCollection();
        $this->vehicules = new ArrayCollection();
        $this->baggisteQueries = new ArrayCollection();
        $this->advertQueries = new ArrayCollection();
        $this->photoClients = new ArrayCollection();
        $this->baggagites = new ArrayCollection();
        $this->avis = new ArrayCollection();
        $this->adresses = new ArrayCollection();
        $this->workings = new ArrayCollection();
        $this->advertQueriesPointDepart = new ArrayCollection();
        $this->advertQueriesPointRelaisArrivee = new ArrayCollection();
        $this->baggisteQueriesPointRelaisDepart = new ArrayCollection();
        $this->baggisteQueriesPointRelaisArrivee = new ArrayCollection();
        $this->advertsPointRelaisDepart = new ArrayCollection();
        $this->advertsPointRelaisArrivee = new ArrayCollection();
        $this->baggagitesPointRelaisDepart = new ArrayCollection();
        $this->baggagitesPointRelaisArrivee = new ArrayCollection();
        $this->description='';
        $this->signalements = new ArrayCollection();

    }

    public function getId(): ?int
    {
        return $this->id;
    }
    

    public function __toString(): string
    {
        return $this->getFullname();
    }

    public function getFullname(): string
    {
        return $this->firstname.' '.$this->lastname;
    }

    public function getUsername(): string
    {
        return (string) $this->email;
    }
    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }


    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param array<string> $roles
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }


    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }


    public function getGender(): ?string
    {
        return $this->gender;
    }

    public function setGender(string $gender): self
    {
        $this->gender = $gender;

        return $this;
    }

    public function getBirdh()
    {
        return $this->birdh;
    }

    public function setBirdh(\DateTimeInterface $birdh): self
    {   
                
        $this->birdh = $birdh;
        return $this;
    }

    

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): self
    {
        $this->photo = $photo;

        return $this;
    }
    /**
     * Updates the hash value to force the preUpdate and postUpdate events to fire.
     */
    public function refreshUpdated(): void
    {
        $this->setUpdated(new \DateTime());
    }

    public function getUpdated(): ?\DateTimeInterface
    {
        return $this->updated;
    }

    public function setUpdated(\DateTimeInterface $updated): self
    {
        $this->updated = $updated;

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

    public function getToken(): ?string
    {
        return $this->token;
    }

    public function setToken(string $token): self
    {
        $this->token = $token;

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



    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function eraseCredentials(): void
    {
    }

     
    public function getUserIdentifier(): string
    {
        return (string) $this->username;
    }  

    public function getDeleted(): ?bool
    {
        return $this->deleted;
    }

    public function setDeleted(bool $deleted): self
    {
        $this->deleted = $deleted;

        return $this;
    }

    public function isDeleted(): ?bool
    {
        return $this->deleted;
    }

    /**
     * @return Collection<int, Advert>
     */
    public function getAdverts(): Collection
    {
        return $this->adverts;
    }

    public function addAdvert(Advert $advert): self
    {
        if (!$this->adverts->contains($advert)) {
            $this->adverts->add($advert);
            $advert->setClient($this);
        }

        return $this;
    }

    public function removeAdvert(Advert $advert): self
    {
        if ($this->adverts->removeElement($advert)) {
            // set the owning side to null (unless already changed)
            if ($advert->getClient() === $this) {
                $advert->setClient(null);
            }
        }

        return $this;
    }

    public function getSiret(): ?string
    {
        return $this->siret;
    }

    public function setSiret(?string $siret): self
    {
        $this->siret = $siret;

        return $this;
    }

    public function getEntreprise(): ?string
    {
        return $this->entreprise;
    }

    public function setEntreprise(?string $entreprise): self
    {
        $this->entreprise = $entreprise;

        return $this;
    }

    public function getStripeCustomerId(): ?string
    {
        return $this->stripeCustomerId;
    }

    public function setStripeCustomerId(?string $stripeCustomerId): self
    {
        $this->stripeCustomerId = $stripeCustomerId;

        return $this;
    }

    public function getStripeAccount(): ?string
    {
        return $this->stripeAccount;
    }

    public function setStripeAccount(?string $stripeAccount): self
    {
        $this->stripeAccount = $stripeAccount;

        return $this;
    }

      public function setFile(?UploadedFile $file = null): void
    {
        $this->file = $file;
    }

    public function getFile(): ?UploadedFile
    {
        return $this->file;
    }

    public function getNationalite(): ?string
    {
        return $this->nationalite;
    }

    public function setNationalite(?string $nationalite): self
    {
        $this->nationalite = $nationalite;

        return $this;
    }

    /**
     * @return Collection<int, Vehicule>
     */
    public function getVehicules(): Collection
    {
        return $this->vehicules;
    }

    public function addVehicule(Vehicule $vehicule): self
    {
        if (!$this->vehicules->contains($vehicule)) {
            $this->vehicules->add($vehicule);
            $vehicule->setClient($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): self
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getClient() === $this) {
                $vehicule->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BaggisteQuery>
     */
    public function getBaggisteQueries(): Collection
    {
        return $this->baggisteQueries;
    }

    public function addBaggisteQuery(BaggisteQuery $baggisteQuery): self
    {
        if (!$this->baggisteQueries->contains($baggisteQuery)) {
            $this->baggisteQueries->add($baggisteQuery);
            $baggisteQuery->setClient($this);
        }

        return $this;
    }

    public function removeBaggisteQuery(BaggisteQuery $baggisteQuery): self
    {
        if ($this->baggisteQueries->removeElement($baggisteQuery)) {
            // set the owning side to null (unless already changed)
            if ($baggisteQuery->getClient() === $this) {
                $baggisteQuery->setClient(null);
            }
        }

        return $this;
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
            $advertQuery->setClient($this);
        }

        return $this;
    }

    public function removeAdvertQuery(AdvertQuery $advertQuery): self
    {
        if ($this->advertQueries->removeElement($advertQuery)) {
            // set the owning side to null (unless already changed)
            if ($advertQuery->getClient() === $this) {
                $advertQuery->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, PhotoClient>
     */
    public function getPhotoClients(): Collection
    {
        return $this->photoClients;
    }

    public function addPhotoClient(PhotoClient $photoClient): self
    {
        if (!$this->photoClients->contains($photoClient)) {
            $this->photoClients->add($photoClient);
            $photoClient->setClients($this);
        }

        return $this;
    }

    public function removePhotoClient(PhotoClient $photoClient): self
    {
        if ($this->photoClients->removeElement($photoClient)) {
            // set the owning side to null (unless already changed)
            if ($photoClient->getClients() === $this) {
                $photoClient->setClients(null);
            }
        }

        return $this;
    }

    public function getStripePaymentMethod(): ?string
    {
        return $this->stripePaymentMethod;
    }

    public function setStripePaymentMethod(?string $stripePaymentMethod): self
    {
        $this->stripePaymentMethod = $stripePaymentMethod;

        return $this;
    }

    public function getStripeBanqueAccount(): ?string
    {
        return $this->stripeBanqueAccount;
    }

    public function setStripeBanqueAccount(?string $stripeBanqueAccount): self
    {
        $this->stripeBanqueAccount = $stripeBanqueAccount;

        return $this;
    }

    /**
     * @return Collection<int, Baggagite>
     */
    public function getBaggagites(): Collection
    {
        return $this->baggagites;
    }

    public function addBaggagite(Baggagite $baggagite): self
    {
        if (!$this->baggagites->contains($baggagite)) {
            $this->baggagites->add($baggagite);
            $baggagite->setClient($this);
        }

        return $this;
    }

    public function removeBaggagite(Baggagite $baggagite): self
    {
        if ($this->baggagites->removeElement($baggagite)) {
            // set the owning side to null (unless already changed)
            if ($baggagite->getClient() === $this) {
                $baggagite->setClient(null);
            }
        }

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
            $avi->setClient($this);
        }

        return $this;
    }

    public function removeAvi(Avis $avi): self
    {
        if ($this->avis->removeElement($avi)) {
            // set the owning side to null (unless already changed)
            if ($avi->getClient() === $this) {
                $avi->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Adress>
     */
    public function getAdresses(): Collection
    {
        return $this->adresses;
    }

    public function addAdress(Adress $adress): self
    {
        if (!$this->adresses->contains($adress)) {
            $this->adresses->add($adress);
            $adress->setClient($this);
        }

        return $this;
    }

    public function removeAdress(Adress $adress): self
    {
        if ($this->adresses->removeElement($adress)) {
            // set the owning side to null (unless already changed)
            if ($adress->getClient() === $this) {
                $adress->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Working>
     */
    public function getWorkings(): Collection
    {
        return $this->workings;
    }

    public function addWorking(Working $working): self
    {
        if (!$this->workings->contains($working)) {
            $this->workings->add($working);
            $working->setClient($this);
        }

        return $this;
    }

    public function removeWorking(Working $working): self
    {
        if ($this->workings->removeElement($working)) {
            // set the owning side to null (unless already changed)
            if ($working->getClient() === $this) {
                $working->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AdvertQuery>
     */
    public function getAdvertQueriesPointDepart(): Collection
    {
        return $this->advertQueriesPointDepart;
    }

    public function addAdvertQueriesPointDepart(AdvertQuery $advertQueriesPointDepart): self
    {
        if (!$this->advertQueriesPointDepart->contains($advertQueriesPointDepart)) {
            $this->advertQueriesPointDepart->add($advertQueriesPointDepart);
            $advertQueriesPointDepart->setPointRelaisDepart($this);
        }

        return $this;
    }

    public function removeAdvertQueriesPointDepart(AdvertQuery $advertQueriesPointDepart): self
    {
        if ($this->advertQueriesPointDepart->removeElement($advertQueriesPointDepart)) {
            // set the owning side to null (unless already changed)
            if ($advertQueriesPointDepart->getPointRelaisDepart() === $this) {
                $advertQueriesPointDepart->setPointRelaisDepart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, AdvertQuery>
     */
    public function getAdvertQueriesPointRelaisArrivee(): Collection
    {
        return $this->advertQueriesPointRelaisArrivee;
    }

    public function addAdvertQueriesPointRelaisArrivee(AdvertQuery $advertQueriesPointRelaisArrivee): self
    {
        if (!$this->advertQueriesPointRelaisArrivee->contains($advertQueriesPointRelaisArrivee)) {
            $this->advertQueriesPointRelaisArrivee->add($advertQueriesPointRelaisArrivee);
            $advertQueriesPointRelaisArrivee->setPointRelaisArrivee($this);
        }

        return $this;
    }

    public function removeAdvertQueriesPointRelaisArrivee(AdvertQuery $advertQueriesPointRelaisArrivee): self
    {
        if ($this->advertQueriesPointRelaisArrivee->removeElement($advertQueriesPointRelaisArrivee)) {
            // set the owning side to null (unless already changed)
            if ($advertQueriesPointRelaisArrivee->getPointRelaisArrivee() === $this) {
                $advertQueriesPointRelaisArrivee->setPointRelaisArrivee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BaggisteQuery>
     */
    public function getBaggisteQueriesPointRelaisDepart(): Collection
    {
        return $this->baggisteQueriesPointRelaisDepart;
    }

    public function addBaggisteQueriesPointRelaisDepart(BaggisteQuery $baggisteQueriesPointRelaisDepart): self
    {
        if (!$this->baggisteQueriesPointRelaisDepart->contains($baggisteQueriesPointRelaisDepart)) {
            $this->baggisteQueriesPointRelaisDepart->add($baggisteQueriesPointRelaisDepart);
            $baggisteQueriesPointRelaisDepart->setPointRelaisDepart($this);
        }

        return $this;
    }

    public function removeBaggisteQueriesPointRelaisDepart(BaggisteQuery $baggisteQueriesPointRelaisDepart): self
    {
        if ($this->baggisteQueriesPointRelaisDepart->removeElement($baggisteQueriesPointRelaisDepart)) {
            // set the owning side to null (unless already changed)
            if ($baggisteQueriesPointRelaisDepart->getPointRelaisDepart() === $this) {
                $baggisteQueriesPointRelaisDepart->setPointRelaisDepart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BaggisteQuery>
     */
    public function getBaggisteQueriesPointRelaisArrivee(): Collection
    {
        return $this->baggisteQueriesPointRelaisArrivee;
    }

    public function addBaggisteQueriesPointRelaisArrivee(BaggisteQuery $baggisteQueriesPointRelaisArrivee): self
    {
        if (!$this->baggisteQueriesPointRelaisArrivee->contains($baggisteQueriesPointRelaisArrivee)) {
            $this->baggisteQueriesPointRelaisArrivee->add($baggisteQueriesPointRelaisArrivee);
            $baggisteQueriesPointRelaisArrivee->setPointRelaisArrivee($this);
        }

        return $this;
    }

    public function removeBaggisteQueriesPointRelaisArrivee(BaggisteQuery $baggisteQueriesPointRelaisArrivee): self
    {
        if ($this->baggisteQueriesPointRelaisArrivee->removeElement($baggisteQueriesPointRelaisArrivee)) {
            // set the owning side to null (unless already changed)
            if ($baggisteQueriesPointRelaisArrivee->getPointRelaisArrivee() === $this) {
                $baggisteQueriesPointRelaisArrivee->setPointRelaisArrivee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Advert>
     */
    public function getAdvertsPointRelaisDepart(): Collection
    {
        return $this->advertsPointRelaisDepart;
    }

    public function addAdvertsPointRelaisDepart(Advert $advertsPointRelaisDepart): self
    {
        if (!$this->advertsPointRelaisDepart->contains($advertsPointRelaisDepart)) {
            $this->advertsPointRelaisDepart->add($advertsPointRelaisDepart);
            $advertsPointRelaisDepart->setPointRelaisDepart($this);
        }

        return $this;
    }

    public function removeAdvertsPointRelaisDepart(Advert $advertsPointRelaisDepart): self
    {
        if ($this->advertsPointRelaisDepart->removeElement($advertsPointRelaisDepart)) {
            // set the owning side to null (unless already changed)
            if ($advertsPointRelaisDepart->getPointRelaisDepart() === $this) {
                $advertsPointRelaisDepart->setPointRelaisDepart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Advert>
     */
    public function getAdvertsPointRelaisArrivee(): Collection
    {
        return $this->advertsPointRelaisArrivee;
    }

    public function addAdvertsPointRelaisArrivee(Advert $advertsPointRelaisArrivee): self
    {
        if (!$this->advertsPointRelaisArrivee->contains($advertsPointRelaisArrivee)) {
            $this->advertsPointRelaisArrivee->add($advertsPointRelaisArrivee);
            $advertsPointRelaisArrivee->setPointRelaisArrivee($this);
        }

        return $this;
    }

    public function removeAdvertsPointRelaisArrivee(Advert $advertsPointRelaisArrivee): self
    {
        if ($this->advertsPointRelaisArrivee->removeElement($advertsPointRelaisArrivee)) {
            // set the owning side to null (unless already changed)
            if ($advertsPointRelaisArrivee->getPointRelaisArrivee() === $this) {
                $advertsPointRelaisArrivee->setPointRelaisArrivee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Baggagite>
     */
    public function getBaggagitesPointRelaisDepart(): Collection
    {
        return $this->baggagitesPointRelaisDepart;
    }

    public function addBaggagitesPointRelaisDepart(Baggagite $baggagitesPointRelaisDepart): self
    {
        if (!$this->baggagitesPointRelaisDepart->contains($baggagitesPointRelaisDepart)) {
            $this->baggagitesPointRelaisDepart->add($baggagitesPointRelaisDepart);
            $baggagitesPointRelaisDepart->setPointRelaisDepart($this);
        }

        return $this;
    }

    public function removeBaggagitesPointRelaisDepart(Baggagite $baggagitesPointRelaisDepart): self
    {
        if ($this->baggagitesPointRelaisDepart->removeElement($baggagitesPointRelaisDepart)) {
            // set the owning side to null (unless already changed)
            if ($baggagitesPointRelaisDepart->getPointRelaisDepart() === $this) {
                $baggagitesPointRelaisDepart->setPointRelaisDepart(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Baggagite>
     */
    public function getBaggagitesPointRelaisArrivee(): Collection
    {
        return $this->baggagitesPointRelaisArrivee;
    }

    public function addBaggagitesPointRelaisArrivee(Baggagite $baggagitesPointRelaisArrivee): self
    {
        if (!$this->baggagitesPointRelaisArrivee->contains($baggagitesPointRelaisArrivee)) {
            $this->baggagitesPointRelaisArrivee->add($baggagitesPointRelaisArrivee);
            $baggagitesPointRelaisArrivee->setPointRelaisArrivee($this);
        }

        return $this;
    }

    public function removeBaggagitesPointRelaisArrivee(Baggagite $baggagitesPointRelaisArrivee): self
    {
        if ($this->baggagitesPointRelaisArrivee->removeElement($baggagitesPointRelaisArrivee)) {
            // set the owning side to null (unless already changed)
            if ($baggagitesPointRelaisArrivee->getPointRelaisArrivee() === $this) {
                $baggagitesPointRelaisArrivee->setPointRelaisArrivee(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Signalement>
     */
    public function getSignalements(): Collection
    {
        return $this->signalements;
    }

    public function addSignalement(Signalement $signalement): self
    {
        if (!$this->signalements->contains($signalement)) {
            $this->signalements->add($signalement);
            $signalement->setClient($this);
        }

        return $this;
    }

    public function removeSignalement(Signalement $signalement): self
    {
        if ($this->signalements->removeElement($signalement)) {
            // set the owning side to null (unless already changed)
            if ($signalement->getClient() === $this) {
                $signalement->setClient(null);
            }
        }

        return $this;
    }

}
