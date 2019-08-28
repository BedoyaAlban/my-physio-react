<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;



/**
 * @ORM\Entity(repositoryClass="App\Repository\ClientsRepository")
 * @ApiResource(
 *    subresourceOperations={
 *    "invoices_get_subresource"={"path"="/clients/{id}/factures"}
 *    },
 *    normalizationContext={
 *         "groups"={"clients_read"}
 *    }
 * )
 */
class Clients
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"clients_read", "invoices_read", "diaries_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "invoices_read", "diaries_read"})
     * @Assert\NotBlank(message="Le prénom du client doit être renseigné")
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read", "invoices_read", "diaries_read"})
     * @Assert\NotBlank(message="Le nom de famille du client doit être renseigné")
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="L'email du client doit être renseigné")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="Le numéro de téléphone du client doit être renseigné")
     */
    private $numberPhone;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="L'adresse du client doit être renseigné")
     * @Assert\Type(type="numeric", message="Le numéro de la rue doit être un numérique !")
     */
    private $adressNumber;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="L'adresse du client doit être renseigné")
     */
    private $adressName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="La ville du client doit être renseigné")
     */
    private $adressCity;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="Le code postal du client doit être renseigné")
     */
    private $zipCode;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"clients_read"})
     * @Assert\NotBlank(message="Le numéro de sécurité sociale du client doit être renseigné")
     * @Assert\Type(type="numeric", message="Le numéro de sécurité sociale doit être un numérique !")
     */
    private $securitySocialNumber;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"clients_read", "diaries_read"})
     */
    private $note;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="client")
     * @Groups({"clients_read", "invoices_subresource"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
     * @Groups({"clients_read"})
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Diary", mappedBy="clients")
     * @Groups({"clients_read"})
     */
    private $diaries;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
        $this->diaries = new ArrayCollection();
    }
    
    /**
     * Permet de récupérer le total des factures
     *@Groups({"clients_read"})
     * @return float
     */
    public function getTotalAmount(): float {
        return array_reduce($this->invoices->toArray(), function($total, $invoice) {
            return $total + $invoice->getAmount();
        }, 1);
    }
    
    /**
     * Récupérer le montant total non payé (montant total hors factures payées ou annulées)
     * @Groups({"clients_read"})
     * @return float
     */
    public function getUnpaidAmount(): float {
        return array_reduce($this->invoices->toArray(), function($total, $invoice) {
            return $total + ($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELED" ? 0 : $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

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

    public function getNumberPhone(): ?string
    {
        return $this->numberPhone;
    }

    public function setNumberPhone(string $numberPhone): self
    {
        $this->numberPhone = $numberPhone;

        return $this;
    }

    public function getAdressNumber(): ?int
    {
        return $this->adressNumber;
    }

    public function setAdressNumber(int $adressNumber): self
    {
        $this->adressNumber = $adressNumber;

        return $this;
    }

    public function getAdressName(): ?string
    {
        return $this->adressName;
    }

    public function setAdressName(string $adressName): self
    {
        $this->adressName = $adressName;

        return $this;
    }

    public function getAdressCity(): ?string
    {
        return $this->adressCity;
    }

    public function setAdressCity(string $adressCity): self
    {
        $this->adressCity = $adressCity;

        return $this;
    }

    public function getZipCode(): ?string
    {
        return $this->zipCode;
    }

    public function setZipCode(string $zipCode): self
    {
        $this->zipCode = $zipCode;

        return $this;
    }

    public function getSecuritySocialNumber(): ?int
    {
        return $this->securitySocialNumber;
    }

    public function setSecuritySocialNumber(int $securitySocialNumber): self
    {
        $this->securitySocialNumber = $securitySocialNumber;

        return $this;
    }

    public function getNote(): ?string
    {
        return $this->note;
    }

    public function setNote(?string $note): self
    {
        $this->note = $note;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setClient($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->contains($invoice)) {
            $this->invoices->removeElement($invoice);
            // set the owning side to null (unless already changed)
            if ($invoice->getClient() === $this) {
                $invoice->setClient(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    /**
     * 
     * @return Collection|Diary[]
     */
    public function getDiaries(): Collection
    {
        return $this->diaries;
    }

    public function addDiary(Diary $diary): self
    {
        if (!$this->diaries->contains($diary)) {
            $this->diaries[] = $diary;
            $diary->setClients($this);
        }

        return $this;
    }

    
    public function removeDiary(Diary $diary): self
    {
        if ($this->diaries->contains($diary)) {
            $this->diaries->removeElement($diary);
            // set the owning side to null (unless already changed)
            if ($diary->getClients() === $this) {
                $diary->setClients(null);
            }
        }

        return $this;
    }
}
