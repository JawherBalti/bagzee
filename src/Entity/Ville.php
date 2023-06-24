<?php

namespace App\Entity;

use App\Repository\VilleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;


#[ORM\Entity(repositoryClass: VilleRepository::class)]
class Ville
{
    const SERVER_PATH_TO_IMAGE_FOLDER = 'uploads/';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    private $name;

    #[ORM\Column(type: 'datetime')]
    private $createdAt;

    #[ORM\Column(type: 'datetime')]
    private $updatedAt;

    
    
    #[ORM\OneToMany(targetEntity: PopupPubFront::class, mappedBy: 'ville')]
    private $villePublicities;



    public function __construct()
    {
        $this->createdAt=new \DateTime();
        $this->updatedAt=new \DateTime();
        $this->activities = new ArrayCollection();
        $this->subscriptions = new ArrayCollection();
        $this->villePublicities = new ArrayCollection();
    }

   


    public function getId(): ?int
    {
        return $this->id;
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

   

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getPublicity(): ?string
    {
        return $this->publicity;
    }


    /**
     * @return Collection<int, PopupPubFront>
     */
    public function getVillePublicities(): Collection
    {
        return $this->villePublicities;
    }

    public function addPopupPubFront(PopupPubFront $PopupPubFront): self
    {
        if (!$this->villePublicities->contains($PopupPubFront)) {
            $this->villePublicities[] = $PopupPubFront;
            $PopupPubFront->setVille($this);
        }

        return $this;
    }

    public function removePopupPubFront(PopupPubFront $PopupPubFront): self
    {
        if ($this->villePublicities->removeElement($PopupPubFront)) {
            // set the owning side to null (unless already changed)
            if ($PopupPubFront->getVille() === $this) {
                $PopupPubFront->setVille(null);
            }
        }

        return $this;
    }

    public function addVillePublicity(PopupPubFront $villePublicity): self
    {
        if (!$this->villePublicities->contains($villePublicity)) {
            $this->villePublicities->add($villePublicity);
            $villePublicity->setVille($this);
        }

        return $this;
    }

    public function removeVillePublicity(PopupPubFront $villePublicity): self
    {
        if ($this->villePublicities->removeElement($villePublicity)) {
            // set the owning side to null (unless already changed)
            if ($villePublicity->getVille() === $this) {
                $villePublicity->setVille(null);
            }
        }

        return $this;
    }


     public function __toString(): string
    {
        return $this->getName();
    }

}
