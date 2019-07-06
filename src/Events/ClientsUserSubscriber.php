<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Clients;

class ClientsUserSubscriber implements EventSubscriberInterface 
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForClients', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForClients(GetResponseForControllerResultEvent $event)
    {
        $client = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($client instanceof Clients && $method === "POST") {
            //Récupérer l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            //Assigner l'utilisateur au client qu'on est en train de créer
            $client->setUser($user);
        }
    }
}