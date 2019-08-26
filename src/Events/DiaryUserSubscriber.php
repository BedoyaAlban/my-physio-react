<?php

namespace App\Events;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Diary;

class DiaryUserSubscriber implements EventSubscriberInterface 
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForDiary', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForDiary(GetResponseForControllerResultEvent $event)
    {
        $diary = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($diary instanceof Diary && $method === "POST") {
            //Récupérer l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            //Assigner l'utilisateur au client qu'on est en train de créer
            $diary->setUser($user);
        }
    }
}