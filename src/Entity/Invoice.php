<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
* @ORM\Entity(repositoryClass="App\Repository\InvoiceRepository")
* @ApiResource(
*      subresourceOperations={
*          "api_clients_invoices_get_subresource"={
*               "normalization_context"={"groups"={"invoices_subresource"}}
*          }
*      },
*      attributes={
*          "order": {"chrono":"desc"}
*      },
*      normalizationContext={
*          "groups"={"invoices_read"}
*      },
*      denormalizationContext={"disable_type_enforcement"=true}
* )
*/
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "invoices_subresource", "clients_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "invoices_subresource", "clients_read",})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire !")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un numérique !")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "invoices_subresource", "clients_read"})
     * @Assert\DateTime(message="La date doit être au format YYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoi doit être renseignée")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "invoices_subresource", "clients_read"})
     * @Assert\NotBlank(message="Le statut de la facture est obligatoire")
     * @Assert\Choice(choices={"INVOICED", "PAID", "CANCELLED"}, message="Le statut doit être INVOICED, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Clients", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client de la facture doit être renseigné")
     */
    private $client;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "invoices_subresource", "clients_read"})
     * @Assert\NotBlank(message="Il faut absolument un chrono pour la facture")
     * @Assert\Type(type="integer", message="Le chrono doit être un nombre !")
     */
    private $chrono;

    /**
     * Permet de récupérer le User à qui appartient finalement la facture
     * @groups({"invoices_read", "invoices_subresource"})
     * @return User
     */
    public function getUser() : User {
        return $this->client->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getClient(): ?Clients
    {
        return $this->client;
    }

    public function setClient(?Clients $client): self
    {
        $this->client = $client;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
