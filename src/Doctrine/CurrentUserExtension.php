<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Clients;
use App\Entity\Invoice;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use App\Entity\Diary;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface {

    private $security;
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass) {
        
        $user = $this->security->getUser();

        if(($resourceClass === Clients::class || 
            $resourceClass === Invoice::class ) 
            && !$this->auth->isGranted('SUPER_ROLE_ADMIN')) {
    
                $rootAlias = $queryBuilder->getRootAliases()[0];

                if($resourceClass === Clients::class) {

                    $queryBuilder->andWhere("$rootAlias.user = :user");
                } else if ($resourceClass === Invoice::class) {
                    
                    $queryBuilder->join("$rootAlias.client", "c")
                                ->andWhere("c.user = :user");
                }

            $queryBuilder->setParameter("user", $user);
        } else if ($resourceClass === Diary::class) {
            $rootAlias = $queryBuilder->getRootAliases()[0];
            
            if($resourceClass === Diary::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            }
            $queryBuilder->setParameter("user", $user);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, ?string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, ?string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}