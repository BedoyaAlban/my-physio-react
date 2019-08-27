<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\DiaryRepository")
 * @ApiResource(
 *      attributes={
 *              "order": {"date":"desc"}
 *      },
 *      normalizationContext={
 *              "groups"={"diaries_read"}
 *      }
 * )
 */
class Diary
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"diaries_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"diaries_read", "invoices_read", "clients_read"})
     */
    private $date;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"diaries_read", "clients_read"})
     */
    private $startSession;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"diaries_read"})
     */
    private $endSession;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Clients", inversedBy="diaries")
     * @Groups({"diaries_read"})
     */
    private $clients;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="diaries")
     * @Groups({"diaries_read"})
     */
    private $users;
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getStartSession(): ?\DateTimeInterface
    {
        return $this->startSession;
    }

    public function setStartSession(?\DateTimeInterface $startSession): self
    {
        $this->startSession = $startSession;

        return $this;
    }

    public function getEndSession(): ?\DateTimeInterface
    {
        return $this->endSession;
    }

    public function setEndSession(?\DateTimeInterface $endSession): self
    {
        $this->endSession = $endSession;

        return $this;
    }

    public function getClients(): ?Clients
    {
        return $this->clients;
    }

    public function setClients(?Clients $clients): self
    {
        $this->clients = $clients;

        return $this;
    }

    public function getUsers(): ?User
    {
        return $this->users;
    }

    public function setUser(?User $users): self
    {
        $this->users = $users;

        return $this;
    }
}
