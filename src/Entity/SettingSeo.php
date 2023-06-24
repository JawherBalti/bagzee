<?php

namespace App\Entity;

use App\Repository\SettingSeoRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SettingSeoRepository::class)]
class SettingSeo
{
     #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\Column(type: 'text')]
    private $hotjar;
    
    #[ORM\Column(type: 'text')]
    private $google_analytics;
    
    #[ORM\Column(type: 'text')]
    private $pixel_facebook;

    #[ORM\Column(type: 'text')]
    private $pixel_tiktok;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHotjar(): ?string
    {
        return $this->hotjar;
    }

    public function setHotjar(string $hotjar): self
    {
        $this->hotjar = $hotjar;

        return $this;
    }

    public function getGoogleAnalytics(): ?string
    {
        return $this->google_analytics;
    }

    public function setGoogleAnalytics(string $google_analytics): self
    {
        $this->google_analytics = $google_analytics;

        return $this;
    }

    public function getPixelFacebook(): ?string
    {
        return $this->pixel_facebook;
    }

    public function setPixelFacebook(string $pixel_facebook): self
    {
        $this->pixel_facebook = $pixel_facebook;

        return $this;
    }

    public function getPixelTiktok(): ?string
    {
        return $this->pixel_tiktok;
    }

    public function setPixelTiktok(string $pixel_tiktok): self
    {
        $this->pixel_tiktok = $pixel_tiktok;

        return $this;
    }
}
