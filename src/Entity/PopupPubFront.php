<?php

namespace App\Entity;

use App\Repository\PopupPubFrontRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[ORM\Entity(repositoryClass: PopupPubFrontRepository::class)]
class PopupPubFront 
{

    const SERVER_PATH_TO_IMAGE_FOLDER = 'uploads/';


    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'date')]
    private $start;

    #[ORM\Column(type: 'date')]
    private $end;

    #[ORM\Column(type: 'string', length: 255)]
    private $photo;

    #[ORM\ManyToOne(targetEntity: Ville::class, inversedBy: 'villePublicities')]
    private $ville;

    /**
     * Unmapped property to handle file uploads
     */
    private $file;

     #[ORM\Column(type: 'datetime')]
    private $createdAt;

     #[ORM\Column(type: 'datetime')]
    private $updatedAt;


    public function __construct()
    {
        $this->createdAt=new \DateTime();
        $this->updatedAt=new \DateTime();
    }
    public function __toString(): string
    {
        return $this->getId();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function setFile(?UploadedFile $file = null): void
    {
        $this->file = $file;
    }

    public function getFile(): ?UploadedFile
    {
        return $this->file;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(string $photo): self
    {
        $this->photo = $photo;

        return $this;
    }

    public function getVille(): ?Ville
    {
        return $this->ville;
    }

    public function setVille(?Ville $ville): self
    {
        $this->ville = $ville;

        return $this;
    }

     /**
     * Manages the copying of the file to the relevant place on the server
     */
    public function upload(): void
    {
        // the file property can be empty if the field is not required
        if (null === $this->getFile()) {
            return;
        }

        // we use the original file name here but you should
        // sanitize it at least to avoid any security issues
        $id_name = uniqid(md5(true));

        // move takes the target directory and target filename as params

        $this->getFile()->move(
            self::SERVER_PATH_TO_IMAGE_FOLDER,
            $id_name.'.png'
        );// set the path property to the filename where you've saved the file
        $this->setPhoto($id_name.'.png');

        // clean up the file property as you won't need it anymore
        $this->setFile(null);
    }

    /**
     * Lifecycle callback to upload the file to the server.
     */
    public function lifecycleFileUpload(): void
    {

        $this->upload();
        //$this->uploadP();
    }

    /**
     * Updates the hash value to force the preUpdate and postUpdate events to fire.
     */
    public function refreshUpdated(): void
    {
        $this->setUpdatedAt(new \DateTime());
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

}
